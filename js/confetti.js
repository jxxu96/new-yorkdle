// Tiny canvas confetti burst in taxi yellow and subway-line colors.
const COLORS = ['#FCCC0A', '#EE352E', '#00933C', '#0039A6', '#FF6319', '#B933AD', '#ffffff'];

export function confetti({ count = 170, duration = 3200 } = {}) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const resize = () => {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  };
  resize();
  const W = () => canvas.width;
  const H = () => canvas.height;
  const parts = Array.from({ length: count }, (_, i) => {
    const fromLeft = i % 2 === 0;
    return {
      x: fromLeft ? -10 * dpr : W() + 10 * dpr,
      y: H() * (0.55 + Math.random() * 0.25),
      vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 9) * dpr,
      vy: -(11 + Math.random() * 10) * dpr,
      w: (6 + Math.random() * 6) * dpr,
      h: (8 + Math.random() * 8) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      color: COLORS[i % COLORS.length],
      shape: Math.random() < 0.2 ? 'circle' : 'rect',
    };
  });
  const start = performance.now();
  let raf;
  const frame = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, W(), H());
    for (const p of parts) {
      p.vy += 0.38 * dpr;
      p.vx *= 0.985;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - duration + 800) / 800);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1);
      }
      ctx.restore();
    }
    if (t < duration) raf = requestAnimationFrame(frame);
    else canvas.remove();
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  };
}
