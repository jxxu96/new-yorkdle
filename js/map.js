// Blank Manhattan SVG map with pan, wheel/pinch/button zoom and tap-to-pin.
import { project, unproject } from './geo.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const PAD_M = 700;
const MIN_VIEW_W = 350; // max zoom: ~350 m across
const TAP_SLOP_PX = 7;

function el(name, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export class ManhattanMap {
  constructor(container, polygon, { onTap, onKeyboardDrop } = {}) {
    this.container = container;
    this.onTap = onTap || (() => {});
    this.onKeyboardDrop = onKeyboardDrop || this.onTap;
    this.pointers = new Map();
    this.pins = [];

    const pts = polygon.map(([lat, lng]) => project(lat, lng));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    this.bounds = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };

    this.svg = el('svg', {
      class: 'map-svg',
      role: 'application',
      'aria-label': 'Blank map of Manhattan. Tap or click to drop a pin. Arrow keys pan, plus and minus zoom, Enter drops a pin at the crosshair.',
      tabindex: '0',
      preserveAspectRatio: 'xMidYMid meet',
    });
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + 'Z';
    // Cheap "glow" along the shoreline: two wide translucent strokes behind the island.
    el('path', { d, class: 'shore shore-outer' }, this.svg);
    el('path', { d, class: 'shore shore-inner' }, this.svg);
    this.island = el('path', { d, class: 'island' }, this.svg);
    this.zoneLayer = el('g', { class: 'zone-layer' }, this.svg);
    this.lineLayer = el('g', { class: 'line-layer' }, this.svg);
    this.pinLayer = el('g', { class: 'pin-layer' }, this.svg);
    this.pendingLayer = el('g', { class: 'pending-layer' }, this.svg);
    this.crosshair = el('g', { class: 'crosshair', 'aria-hidden': 'true' }, this.svg);
    el('circle', { r: 10, class: 'crosshair-ring' }, this.crosshair);
    el('path', { d: 'M-18 0H-6M6 0H18M0 -18V-6M0 6V18', class: 'crosshair-lines' }, this.crosshair);
    container.appendChild(this.svg);

    this.view = { x: 0, y: 0, w: 1, h: 1 };
    this.fit(false);
    this.bindEvents();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);
  }

  /* ---------------- view math ---------------- */

  get aspect() {
    const r = this.svg.getBoundingClientRect();
    return r.width > 0 && r.height > 0 ? r.width / r.height : 0.6;
  }

  homeView() {
    const b = this.bounds;
    const bw = b.maxX - b.minX + PAD_M * 2;
    const bh = b.maxY - b.minY + PAD_M * 2;
    const a = this.aspect;
    let w = bw;
    let h = bw / a;
    if (h < bh) {
      h = bh;
      w = bh * a;
    }
    return { x: (b.minX + b.maxX) / 2 - w / 2, y: (b.minY + b.maxY) / 2 - h / 2, w, h };
  }

  clampView(v) {
    const home = this.homeView();
    const maxW = home.w * 1.15;
    let w = Math.min(maxW, Math.max(MIN_VIEW_W, v.w));
    const a = this.aspect;
    let h = w / a;
    const cx0 = v.x + v.w / 2;
    const cy0 = v.y + v.h / 2;
    const b = this.bounds;
    const cx = Math.min(b.maxX + PAD_M, Math.max(b.minX - PAD_M, cx0));
    const cy = Math.min(b.maxY + PAD_M, Math.max(b.minY - PAD_M, cy0));
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }

  applyView() {
    const v = this.view;
    this.svg.setAttribute('viewBox', `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);
    const r = this.svg.getBoundingClientRect();
    this.unitsPerPx = r.width ? v.w / r.width : 1;
    const s = this.unitsPerPx;
    for (const g of this.svg.querySelectorAll('[data-anchor]')) {
      const [x, y] = g.dataset.anchor.split(',').map(Number);
      g.setAttribute('transform', `translate(${x} ${y}) scale(${s})`);
    }
    const c = this.crosshair;
    c.setAttribute('transform', `translate(${v.x + v.w / 2} ${v.y + v.h / 2}) scale(${s})`);
  }

  setView(v, animate = false) {
    const target = this.clampView(v);
    cancelAnimationFrame(this.anim);
    if (!animate || prefersReducedMotion()) {
      this.view = target;
      this.applyView();
      return;
    }
    const from = { ...this.view };
    const t0 = performance.now();
    const dur = 550;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      this.view = {
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      };
      this.applyView();
      if (t < 1) this.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  }

  fit(animate = true) {
    this.setView(this.homeView(), animate);
  }

  handleResize() {
    const v = this.view;
    const cx = v.x + v.w / 2;
    const cy = v.y + v.h / 2;
    const w = v.w;
    const h = w / this.aspect;
    this.view = this.clampView({ x: cx - w / 2, y: cy - h / 2, w, h });
    this.applyView();
  }

  zoomBy(factor, clientX, clientY) {
    const v = this.view;
    const r = this.svg.getBoundingClientRect();
    const fx = clientX == null ? 0.5 : (clientX - r.left) / r.width;
    const fy = clientY == null ? 0.5 : (clientY - r.top) / r.height;
    const px = v.x + fx * v.w;
    const py = v.y + fy * v.h;
    const home = this.homeView();
    const w = Math.min(home.w * 1.15, Math.max(MIN_VIEW_W, v.w / factor));
    const h = w / this.aspect;
    this.setView({ x: px - fx * w, y: py - fy * h, w, h });
  }

  /** Animate so that all [lat, lng] points are visible with some padding. */
  fitPoints(latlngs, { minWidth = 1600 } = {}) {
    if (!latlngs.length) return;
    const ps = latlngs.map(([lat, lng]) => project(lat, lng));
    const minX = Math.min(...ps.map((p) => p.x));
    const maxX = Math.max(...ps.map((p) => p.x));
    const minY = Math.min(...ps.map((p) => p.y));
    const maxY = Math.max(...ps.map((p) => p.y));
    const a = this.aspect;
    let w = Math.max(minWidth, (maxX - minX) * 1.5 + 400);
    let h = w / a;
    const needH = (maxY - minY) * 1.4 + 600;
    if (h < needH) {
      h = needH;
      w = h * a;
    }
    this.setView({ x: (minX + maxX) / 2 - w / 2, y: (minY + maxY) / 2 - h / 2 - h * 0.04, w, h }, true);
  }

  /** Pan (keeping zoom) if a point is outside the comfortable part of the view. */
  ensureVisible(lat, lng) {
    const v = this.view;
    // Zoomed all the way out, the whole island is already on screen.
    if (v.w >= this.homeView().w * 0.9) return;
    const p = project(lat, lng);
    const mx = v.w * 0.06;
    const my = v.h * 0.06;
    if (p.x < v.x + mx || p.x > v.x + v.w - mx || p.y < v.y + my || p.y > v.y + v.h - my) {
      this.setView({ ...v, x: p.x - v.w / 2, y: p.y - v.h / 2 }, true);
    }
  }

  clientToLatLng(clientX, clientY) {
    const r = this.svg.getBoundingClientRect();
    const v = this.view;
    const x = v.x + ((clientX - r.left) / r.width) * v.w;
    const y = v.y + ((clientY - r.top) / r.height) * v.h;
    return unproject(x, y);
  }

  centerLatLng() {
    const v = this.view;
    return unproject(v.x + v.w / 2, v.y + v.h / 2);
  }

  /* ---------------- input ---------------- */

  bindEvents() {
    const svg = this.svg;
    svg.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
      svg.setPointerCapture?.(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 1) {
        this.drag = { startX: e.clientX, startY: e.clientY, view: { ...this.view }, tap: true };
      } else if (this.pointers.size === 2) {
        this.drag = null;
        this.pinch = this.pinchState();
      }
    });
    svg.addEventListener('pointermove', (e) => {
      if (!this.pointers.has(e.pointerId)) return;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2 && this.pinch) {
        const now = this.pinchState();
        const factor = now.dist / this.pinch.dist;
        const r = svg.getBoundingClientRect();
        const v = this.pinch.view;
        const fx0 = (this.pinch.cx - r.left) / r.width;
        const fy0 = (this.pinch.cy - r.top) / r.height;
        const px = v.x + fx0 * v.w;
        const py = v.y + fy0 * v.h;
        const w = v.w / factor;
        const h = w / this.aspect;
        const fx1 = (now.cx - r.left) / r.width;
        const fy1 = (now.cy - r.top) / r.height;
        this.setView({ x: px - fx1 * w, y: py - fy1 * h, w, h });
        return;
      }
      if (this.drag) {
        const dx = e.clientX - this.drag.startX;
        const dy = e.clientY - this.drag.startY;
        if (Math.hypot(dx, dy) > TAP_SLOP_PX) this.drag.tap = false;
        if (!this.drag.tap) {
          const s = this.drag.view.w / svg.getBoundingClientRect().width;
          this.setView({ ...this.drag.view, x: this.drag.view.x - dx * s, y: this.drag.view.y - dy * s });
          svg.classList.add('is-dragging');
        }
      }
    });
    const end = (e) => {
      if (!this.pointers.has(e.pointerId)) return;
      this.pointers.delete(e.pointerId);
      svg.classList.remove('is-dragging');
      if (this.pinch) {
        if (this.pointers.size < 2) this.pinch = null;
        // Don't treat the end of a pinch as a tap.
        if (this.pointers.size === 1) {
          const [p] = this.pointers.values();
          this.drag = { startX: p.x, startY: p.y, view: { ...this.view }, tap: false };
        }
        return;
      }
      if (this.drag?.tap && e.type === 'pointerup') {
        const ll = this.clientToLatLng(e.clientX, e.clientY);
        this.onTap(ll);
      }
      this.drag = null;
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    svg.addEventListener('lostpointercapture', end);
    svg.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
        this.zoomBy(Math.exp(-delta * 0.0018), e.clientX, e.clientY);
      },
      { passive: false },
    );
    svg.addEventListener('keydown', (e) => {
      const v = this.view;
      const step = v.w * 0.12;
      const keys = {
        ArrowLeft: () => this.setView({ ...v, x: v.x - step }),
        ArrowRight: () => this.setView({ ...v, x: v.x + step }),
        ArrowUp: () => this.setView({ ...v, y: v.y - step }),
        ArrowDown: () => this.setView({ ...v, y: v.y + step }),
        '+': () => this.zoomBy(1.4),
        '=': () => this.zoomBy(1.4),
        '-': () => this.zoomBy(1 / 1.4),
        _: () => this.zoomBy(1 / 1.4),
        '0': () => this.fit(),
        Enter: () => this.onKeyboardDrop(this.centerLatLng()),
        ' ': () => this.onKeyboardDrop(this.centerLatLng()),
      };
      if (keys[e.key]) {
        e.preventDefault();
        keys[e.key]();
      }
    });
  }

  pinchState() {
    const [a, b] = [...this.pointers.values()];
    return { dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, view: { ...this.view } };
  }

  /* ---------------- drawing ---------------- */

  anchorGroup(lat, lng, parent, cls) {
    const p = project(lat, lng);
    const g = el('g', { class: cls, 'data-anchor': `${p.x.toFixed(2)},${p.y.toFixed(2)}` }, parent);
    g.setAttribute('transform', `translate(${p.x} ${p.y}) scale(${this.unitsPerPx || 1})`);
    return g;
  }

  /** pins: [{ lat, lng, label, color, textColor, title, animate }] */
  setPins(pins) {
    this.pinLayer.replaceChildren();
    for (const pin of pins) {
      const g = this.anchorGroup(pin.lat, pin.lng, this.pinLayer, 'pin');
      if (pin.title) el('title', {}, g).textContent = pin.title;
      el('ellipse', { cx: 0, cy: 0, rx: 6, ry: 2.6, class: 'pin-shadow' }, g);
      const body = el('g', { class: `pin-body${pin.animate ? ' pin-drop' : ''}` }, g);
      el('path', { d: 'M0 0 L-5 -14 L5 -14 Z', fill: pin.color, class: 'pin-stem' }, body);
      el('circle', { cx: 0, cy: -25, r: 13, fill: pin.color, class: 'pin-bullet' }, body);
      const t = el('text', { x: 0, y: -20.5, class: 'pin-label', fill: pin.textColor || '#fff' }, body);
      t.textContent = pin.label;
      el('circle', { cx: 0, cy: 0, r: 2.4, class: 'pin-dot' }, g);
    }
  }

  setPending(latlng) {
    this.pendingLayer.replaceChildren();
    if (!latlng) return;
    const g = this.anchorGroup(latlng.lat, latlng.lng, this.pendingLayer, 'pin pending');
    el('circle', { cx: 0, cy: 0, r: 10, class: 'pending-ring' }, g);
    const body = el('g', { class: 'pin-body pin-drop' }, g);
    el('path', { d: 'M0 0 L-5 -14 L5 -14 Z', class: 'pin-stem pending-fill' }, body);
    el('circle', { cx: 0, cy: -25, r: 13, class: 'pin-bullet pending-fill' }, body);
    const t = el('text', { x: 0, y: -20.5, class: 'pin-label', fill: '#111' }, body);
    t.textContent = '?';
    el('circle', { cx: 0, cy: 0, r: 2.4, class: 'pin-dot' }, g);
  }

  setZone(zone) {
    this.zoneLayer.replaceChildren();
    if (!zone) return;
    const c = project(zone.lat, zone.lng);
    el('circle', { cx: c.x, cy: c.y, r: zone.radius, class: 'zone' }, this.zoneLayer);
  }

  /** Reveal the answer: target marker, optional path, and a line from the last guess. */
  setReveal(reveal) {
    this.lineLayer.replaceChildren();
    const old = this.svg.querySelector('.target-layer');
    old?.remove();
    if (!reveal) return;
    const { target, from, path, won } = reveal;
    if (path?.length > 1) {
      const d = path.map(([lat, lng], i) => {
        const p = project(lat, lng);
        return `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join('');
      el('path', { d, class: 'target-path' }, this.lineLayer);
    }
    if (from) {
      const a = project(from.lat, from.lng);
      const b = project(target.lat, target.lng);
      el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'reveal-line' }, this.lineLayer);
    }
    const layer = el('g', { class: 'target-layer' });
    this.svg.insertBefore(layer, this.pendingLayer);
    const g = this.anchorGroup(target.lat, target.lng, layer, `target-marker${won ? ' won' : ''}`);
    if (target.title) el('title', {}, g).textContent = target.title;
    el('circle', { r: 16, class: 'target-pulse' }, g);
    el('circle', { r: 12, class: 'target-disc' }, g);
    el('path', {
      d: 'M0,-7.5 L2.2,-2.4 L7.6,-2.3 L3.4,1.1 L4.9,6.4 L0,3.3 L-4.9,6.4 L-3.4,1.1 L-7.6,-2.3 L-2.2,-2.4 Z',
      class: 'target-star',
    }, g);
  }

  setCrosshairVisible(on) {
    this.crosshair.classList.toggle('visible', on);
  }
}
