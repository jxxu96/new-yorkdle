// New Yorkdle — DOM controller. Game rules live in game.js / geo.js / search.js.
import { PLACES } from '../data/places.js';
import { MANHATTAN_POLYGON } from '../data/manhattan.js';
import { pointInPolygon, distanceToPolygonEdge } from './geo.js';
import * as G from './game.js';
import { searchPlaces, findExact, normalize } from './search.js';
import { ManhattanMap } from './map.js';
import { confetti } from './confetti.js';
import { COPY, pick, tierLine } from './copy.js';

const $ = (sel) => document.querySelector(sel);
const PLACE_BY_ID = new Map(PLACES.map((p) => [p.id, p]));
const SHORE_TOLERANCE_M = 120;
const KEY_PREFIX = 'nyd:v1:';
const DARK_TEXT_TIERS = new Set(['scorching']);

/* ------------------------------------------------------------------ */
/* Storage (fails soft in private mode)                                */
/* ------------------------------------------------------------------ */

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage unavailable — play on without persistence */
    }
  },
};

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const state = {
  mode: store.get('mode', 'daily') === 'practice' ? 'practice' : 'daily',
  difficulty: store.get('practiceDifficulty', 'mixed'),
  recent: [],
  round: null,
  pending: null,
  shownHints: -1,
  activeIndex: -1,
  suggestions: [],
};

function dailyRound() {
  const dayIndex = G.dayIndexForDate();
  const saved = store.get(`daily:${dayIndex}`, null);
  const place = (saved && PLACE_BY_ID.get(saved.placeId)) || G.dailyPlace(PLACES, dayIndex);
  return {
    mode: 'daily',
    dayIndex,
    puzzleNumber: G.puzzleNumberForDayIndex(dayIndex),
    placeId: place.id,
    guesses: Array.isArray(saved?.guesses) ? saved.guesses : [],
    recorded: !!saved?.recorded,
  };
}

function todaysDailyId() {
  return G.dailyPlace(PLACES, G.dayIndexForDate()).id;
}

function newPracticeRound() {
  const place = G.pickPracticePlace(PLACES, state.difficulty, Math.random, [...state.recent, todaysDailyId()]);
  state.recent = [place.id, ...state.recent.filter((id) => id !== place.id)].slice(0, 60);
  return { mode: 'practice', placeId: place.id, guesses: [], difficulty: state.difficulty, recorded: false };
}

function practiceRound() {
  const saved = store.get('practice', null);
  state.recent = Array.isArray(saved?.recent) ? saved.recent : [];
  if (saved && PLACE_BY_ID.has(saved.placeId)) {
    return {
      mode: 'practice',
      placeId: saved.placeId,
      guesses: Array.isArray(saved.guesses) ? saved.guesses : [],
      difficulty: saved.difficulty || state.difficulty,
      recorded: !!saved.recorded,
    };
  }
  return newPracticeRound();
}

function saveRound() {
  const r = state.round;
  if (r.mode === 'daily') {
    store.set(`daily:${r.dayIndex}`, { placeId: r.placeId, guesses: r.guesses, recorded: r.recorded });
  } else {
    store.set('practice', { placeId: r.placeId, guesses: r.guesses, difficulty: r.difficulty, recorded: r.recorded, recent: state.recent });
  }
}

function snapshot() {
  const r = state.round;
  const place = PLACE_BY_ID.get(r.placeId);
  const { results, status } = G.replayRound(place, r.guesses);
  return { r, place, results, status, wrong: results.filter((x) => !x.win).length };
}

/* ------------------------------------------------------------------ */
/* Small DOM helpers                                                   */
/* ------------------------------------------------------------------ */

function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

function toast(message, kind = '', ms = 2300) {
  const zone = $('#toasts');
  const t = h('div', { class: `toast ${kind}` }, message);
  // One toast at a time keeps the map visible on phones.
  zone.replaceChildren(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove(), { once: true });
    setTimeout(() => t.remove(), 600);
  }, ms);
}

function shake(node) {
  if (!node) return;
  node.classList.remove('shake');
  void node.offsetWidth;
  node.classList.add('shake');
  node.addEventListener('animationend', () => node.classList.remove('shake'), { once: true });
}

const ARROW_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4.5 13H10v9h4v-9h5.5z"/></svg>';

function arrowEl(bearing) {
  const wrap = h('span', { class: 'arrow' });
  wrap.innerHTML = ARROW_SVG;
  wrap.firstChild.style.transform = `rotate(${bearing.toFixed(0)}deg)`;
  return wrap;
}

function bulletEl(label, tier, extra = '') {
  const cls = `bullet ${tier && DARK_TEXT_TIERS.has(tier.key) ? 'dark-text' : ''} ${extra}`;
  return h('span', { class: cls, style: tier ? `--c:${tier.color}` : '' }, label);
}

function guessLabel(guess) {
  if (guess.placeId) return PLACE_BY_ID.get(guess.placeId)?.name || 'Unknown place';
  return 'Dropped pin';
}

function breakdownText(res) {
  const b = res.breakdown;
  const parts = [];
  if (b.streets) parts.push(`${b.streets} street${b.streets === 1 ? '' : 's'}`);
  if (b.avenues) parts.push(`${b.avenues} avenue${b.avenues === 1 ? '' : 's'}`);
  return parts.length ? `≈ ${parts.join(', ')}` : 'right around here';
}

/** replaceChildren that skips null/false (replaceChildren would print "null"). */
function fill(node, ...kids) {
  node.replaceChildren(...kids.flat().filter((k) => k != null && k !== false));
}

function niceDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

let map;

function render({ animateLast = false } = {}) {
  const snap = snapshot();
  const { r, place, results, status, wrong } = snap;
  const playing = status === 'playing';

  // Mode bar
  $('#mode-daily').setAttribute('aria-pressed', String(r.mode === 'daily'));
  $('#mode-practice').setAttribute('aria-pressed', String(r.mode === 'practice'));
  $('#practice-bar').hidden = r.mode !== 'practice';
  for (const b of document.querySelectorAll('[data-diff]')) b.setAttribute('aria-pressed', String(b.dataset.diff === state.difficulty));
  const meta = $('#puzzle-meta');
  meta.replaceChildren();
  if (r.mode === 'daily') {
    const label = r.puzzleNumber >= 1 ? `#${r.puzzleNumber}` : 'Sneak peek';
    meta.append(h('strong', {}, label), h('span', {}, `· ${niceDate(G.nyDateString())}`));
  } else {
    meta.append(h('strong', {}, 'Practice'), h('span', {}, `· ${state.difficulty[0].toUpperCase()}${state.difficulty.slice(1)}`));
  }

  renderClues(place, wrong, !playing, results.length);
  $('#guess-form').hidden = !playing;
  renderTracker(results, playing);
  renderEndPanel(snap);
  renderGuessList(r, results, animateLast);
  renderMap(snap, animateLast);
}

function renderClues(place, wrong, revealAll, used) {
  const card = $('#clue-card');
  const cat = G.categoryInfo(place.category);
  const hints = G.hintsFor(place, wrong, revealAll);
  const unlockedCount = hints.filter((x) => x.unlocked).length;
  const fresh = state.shownHints >= 0 && unlockedCount > state.shownHints ? state.shownHints : Infinity;
  state.shownHints = unlockedCount;
  const head = h(
    'div',
    { class: 'clue-head' },
    h('span', { class: 'chip' }, `${cat.emoji} ${cat.label}`),
    h('span', { class: `chip ${place.difficulty}` }, place.difficulty === 'iconic' ? '★ Iconic' : '◆ Local'),
    revealAll ? null : h('span', { class: 'chip ghost' }, `${G.MAX_GUESSES - used} guess${G.MAX_GUESSES - used === 1 ? '' : 'es'} left`),
  );
  const list = h('ol', { class: 'hints' });
  hints.forEach((hint, i) => {
    if (!hint.unlocked) return;
    list.append(
      h(
        'li',
        { class: `hint${i >= fresh ? ' fresh' : ''}` },
        h('span', { class: 'hint-k' }, hint.label),
        h('span', { class: 'hint-v' }, hint.text),
      ),
    );
  });
  const locked = hints.filter((x) => !x.unlocked);
  if (locked.length) {
    // Compact "what's next" line instead of a stack of locked rows.
    list.append(
      h(
        'li',
        { class: 'hint locked' },
        h('span', { class: 'hint-k' }, '🔒 Next'),
        h('span', { class: 'hint-v' }, `${locked[0].label} after a miss`, locked.length > 1 ? ` · then ${locked.slice(1).map((x) => x.label.toLowerCase()).join(', ')}` : ''),
      ),
    );
  }
  card.replaceChildren(head, list);
}

function renderTracker(results, playing) {
  const tr = $('#tracker');
  tr.replaceChildren();
  for (let i = 0; i < G.MAX_GUESSES; i++) {
    const res = results[i];
    if (res) tr.append(bulletEl(i + 1, res.tier));
    else tr.append(bulletEl(i + 1, null, `empty${playing && i === results.length ? ' next' : ''}`));
  }
  tr.setAttribute('aria-label', `${results.length} of ${G.MAX_GUESSES} guesses used`);
}

function renderGuessList(r, results, animateLast) {
  const list = $('#guess-list');
  list.replaceChildren();
  results.forEach((res, i) => {
    const g = r.guesses[i];
    const fresh = animateLast && i === results.length - 1;
    const name = guessLabel(g);
    const row = h(
      'li',
      {
        class: `guess-row${res.win ? ' won' : ''}${fresh ? ' fresh' : ''}`,
        style: `--c:${res.tier.color}`,
        'aria-label': res.win
          ? `Guess ${i + 1}: ${name}. Correct!`
          : `Guess ${i + 1}: ${name}. ${res.miles.toFixed(2)} miles, about ${res.blocks} blocks, head ${res.grid}, ${res.compass}. ${res.proximity} percent close.`,
      },
      bulletEl(i + 1, res.tier),
      h(
        'div',
        { class: 'g-main' },
        h('div', { class: 'g-name' }, name),
        h('div', { class: 'g-sub' }, res.win ? '🎯 Nailed it!' : `${res.grid} · ${breakdownText(res)}`),
        h(
          'div',
          { class: 'meter-row', 'aria-hidden': 'true' },
          h('div', { class: 'meter' }, h('span', { style: `width:${res.proximity}%` })),
          h('span', { class: 'g-pct' }, `${res.proximity}%`),
        ),
      ),
      h('div', { class: 'g-dist' }, res.win ? '🎉' : `${res.miles.toFixed(2)} mi`, res.win ? null : h('small', {}, `≈ ${res.blocks} block${res.blocks === 1 ? '' : 's'}`)),
      h(
        'div',
        { class: 'g-dir' },
        res.win ? h('span', { class: 'arrow' }, '📍') : arrowEl(res.bearing),
        h('small', {}, res.win ? 'Here!' : res.compass),
      ),
    );
    list.append(row);
  });
}

function renderEndPanel({ r, place, results, status }) {
  const panel = $('#end-panel');
  if (status === 'playing') {
    panel.hidden = true;
    return;
  }
  const won = status === 'won';
  panel.hidden = false;
  panel.className = `end-panel ${won ? 'won' : 'lost'}`;
  const title = won
    ? results.length === 1
      ? pick(COPY.winFirstTry, hashSeed(r))
      : pick(COPY.win, hashSeed(r))
    : pick(COPY.lose, hashSeed(r));
  const actions = h(
    'div',
    { class: 'end-actions' },
    h('button', { type: 'button', class: 'btn btn-primary', onclick: share }, '📤 Share'),
    r.mode === 'daily'
      ? h('button', { type: 'button', class: 'btn btn-small', onclick: () => openStats() }, '📊 Stats')
      : h('button', { type: 'button', class: 'btn btn-small', onclick: () => startPractice(true) }, '🔀 Next place'),
    r.mode === 'daily' ? h('button', { type: 'button', class: 'btn btn-small', onclick: () => setMode('practice') }, '🏃 Practice') : null,
  );
  fill(panel,
    h('h2', { class: 'end-title' }, `${title} ${won ? '🗽' : '🚕'}`),
    h(
      'p',
      { class: 'end-answer' },
      won ? `${results.length}/${G.MAX_GUESSES} — it was ` : 'It was ',
      h('strong', {}, place.name),
      ` · ${place.neighborhood}`,
    ),
    h('p', { class: 'end-fact' }, `💡 ${place.fact}`),
    actions,
    r.mode === 'daily' ? h('p', { class: 'countdown' }, 'Next New Yorkdle in ', h('span', { class: 'cd' }, G.formatCountdown(G.msUntilNextNYMidnight()))) : null,
  );
}

function hashSeed(r) {
  return (G.hashString(`${r.placeId}:${r.guesses.length}`) % 1000) / 1000;
}

function renderMap({ r, place, results, status, wrong }, animateLast) {
  const pins = results.map((res, i) => {
    const g = r.guesses[i];
    return {
      lat: g.lat,
      lng: g.lng,
      label: String(i + 1),
      color: res.tier.color,
      textColor: DARK_TEXT_TIERS.has(res.tier.key) ? '#111' : '#fff',
      title: `${i + 1}. ${guessLabel(g)}${res.win ? ' — correct!' : ` — ${res.miles.toFixed(2)} mi`}`,
      animate: animateLast && i === results.length - 1,
    };
  });
  map.setPins(pins);
  map.setPending(status === 'playing' ? state.pending : null);
  map.setZone(status === 'playing' && wrong >= G.HINT_SCHEDULE.length - 1 ? G.zoneCircle(place) : null);

  if (status !== 'playing') {
    const last = r.guesses[r.guesses.length - 1];
    const tp = last ? G.targetPointFor(place, last.lat, last.lng) : { lat: place.lat, lng: place.lng };
    map.setReveal({
      target: { ...tp, title: place.name },
      from: status === 'lost' && last ? last : null,
      path: place.path,
      won: status === 'won',
    });
  } else {
    map.setReveal(null);
  }

  $('#confirm-bar').hidden = !(status === 'playing' && state.pending);
  $('#map-hint').hidden = status !== 'playing' || results.length > 0 || !!state.pending;

  const lr = $('#last-result');
  const lastRes = results[results.length - 1];
  if (!lastRes || state.pending) {
    lr.hidden = true;
  } else {
    lr.hidden = false;
    fill(lr,
      bulletEl(results.length, lastRes.tier),
      h(
        'div',
        { class: 'lr-text' },
        h('div', { class: 'lr-top' }, lastRes.win ? `${place.name} 🎯` : `${lastRes.miles.toFixed(2)} mi · ${lastRes.proximity}%`),
        h('div', { class: 'lr-sub' }, lastRes.win ? `Found in ${results.length}!` : `${lastRes.grid} · ≈${lastRes.blocks} blocks`),
      ),
      lastRes.win ? null : arrowEl(lastRes.bearing),
    );
  }
}

/* ------------------------------------------------------------------ */
/* Guessing                                                            */
/* ------------------------------------------------------------------ */

function submitGuess(guess) {
  const before = snapshot();
  if (before.status !== 'playing') {
    toast(pick(COPY.roundOver));
    return false;
  }
  const r = state.round;
  if (guess.placeId && r.guesses.some((g) => g.placeId === guess.placeId)) {
    toast(pick(COPY.repeat), 'taxi');
    shake($('#guess-form'));
    return false;
  }
  r.guesses.push(guess);
  state.pending = null;
  map.setCrosshairVisible(false);
  saveRound();

  const after = snapshot();
  const res = after.results[after.results.length - 1];
  render({ animateLast: true });
  map.ensureVisible(guess.lat, guess.lng);

  if (after.status === 'won') onRoundEnd(after, true);
  else if (after.status === 'lost') onRoundEnd(after, false);
  else {
    const line = tierLine(res.tier.key, Math.random());
    toast(`${line} ${res.miles.toFixed(2)} mi — head ${res.grid.toLowerCase()}`, '', 2600);
    shake($('#last-result'));
  }
  return true;
}

function onRoundEnd(snap, won) {
  const { r, place, results } = snap;
  if (!r.recorded) {
    r.recorded = true;
    if (r.mode === 'daily') {
      const stats = G.recordDailyResult(store.get('stats', G.emptyStats()), r.dayIndex, won, results.length);
      store.set('stats', stats);
    } else {
      const ps = store.get('practiceStats', { played: 0, wins: 0 });
      ps.played += 1;
      if (won) ps.wins += 1;
      store.set('practiceStats', ps);
    }
    saveRound();
  }
  const pts = r.guesses.map((g) => [g.lat, g.lng]);
  pts.push([place.lat, place.lng]);
  setTimeout(() => map.fitPoints(pts), 350);
  if (won) {
    confetti();
    toast(results.length === 1 ? pick(COPY.winFirstTry) : pick(COPY.win), 'win', 3000);
  } else {
    toast(`${pick(COPY.lose)} It was ${place.name}.`, 'lose', 3600);
    shake($('#map-panel'));
  }
  if (r.mode === 'daily') setTimeout(() => openStats(), won ? 2200 : 2600);
}

function onMapTap({ lat, lng }) {
  const snap = snapshot();
  if (snap.status !== 'playing') {
    toast(pick(COPY.roundOver));
    return;
  }
  const onLand = pointInPolygon(lat, lng, MANHATTAN_POLYGON) || distanceToPolygonEdge(lat, lng, MANHATTAN_POLYGON) <= SHORE_TOLERANCE_M;
  if (!onLand) {
    toast(`💦 ${pick(COPY.water)}`, 'taxi');
    shake($('#map-panel'));
    return;
  }
  state.pending = { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
  closeSuggestions();
  if (document.activeElement === input()) input().blur();
  render();
}

function confirmPending() {
  if (!state.pending) return;
  const { lat, lng } = state.pending;
  submitGuess({ lat, lng });
}

function cancelPending() {
  state.pending = null;
  render();
}

/* ------------------------------------------------------------------ */
/* Autocomplete (ARIA combobox)                                        */
/* ------------------------------------------------------------------ */

const input = () => $('#guess-input');
const listbox = () => $('#suggestions');

function highlight(text, query) {
  const q = query.trim().toLowerCase();
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return [text];
  return [text.slice(0, i), h('mark', {}, text.slice(i, i + q.length)), text.slice(i + q.length)];
}

function updateSuggestions() {
  const q = input().value;
  const lb = listbox();
  if (!normalize(q)) {
    closeSuggestions();
    return;
  }
  state.suggestions = searchPlaces(PLACES, q, 8);
  state.activeIndex = state.suggestions.length ? 0 : -1;
  const guessed = new Set(state.round.guesses.map((g) => g.placeId).filter(Boolean));
  lb.replaceChildren();
  if (!state.suggestions.length) {
    lb.append(h('li', { class: 'empty', role: 'option', 'aria-disabled': 'true', id: 'sugg-empty' }, 'No matches — try another name, or tap the map.'));
  }
  state.suggestions.forEach(({ place, matched }, i) => {
    const cat = G.categoryInfo(place.category);
    lb.append(
      h(
        'li',
        {
          id: `sugg-${i}`,
          role: 'option',
          class: guessed.has(place.id) ? 'used' : '',
          'aria-selected': String(i === state.activeIndex),
          onmousedown: (e) => e.preventDefault(),
          onclick: () => chooseSuggestion(i),
        },
        h('span', { class: 's-emoji', 'aria-hidden': 'true' }, cat.emoji),
        h('span', {}, h('span', { class: 's-name' }, highlight(place.name, q)), matched ? h('span', { class: 's-alias' }, 'aka ', highlight(matched, q)) : null, guessed.has(place.id) ? h('span', { class: 's-alias' }, 'already guessed') : null),
      ),
    );
  });
  lb.hidden = false;
  input().setAttribute('aria-expanded', 'true');
  syncActive();
}

function syncActive() {
  const lb = listbox();
  [...lb.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === state.activeIndex)));
  const active = state.activeIndex >= 0 ? $(`#sugg-${state.activeIndex}`) : null;
  if (active) {
    input().setAttribute('aria-activedescendant', active.id);
    active.scrollIntoView({ block: 'nearest' });
  } else {
    input().removeAttribute('aria-activedescendant');
  }
}

function closeSuggestions() {
  listbox().hidden = true;
  listbox().replaceChildren();
  input().setAttribute('aria-expanded', 'false');
  input().removeAttribute('aria-activedescendant');
  state.suggestions = [];
  state.activeIndex = -1;
}

function chooseSuggestion(i) {
  const s = state.suggestions[i];
  if (!s) return;
  guessPlace(s.place);
}

function guessPlace(place) {
  const ok = submitGuess({ placeId: place.id, lat: place.lat, lng: place.lng });
  if (ok) {
    input().value = '';
    closeSuggestions();
  }
}

function onSubmit(e) {
  e.preventDefault();
  if (state.activeIndex >= 0 && state.suggestions[state.activeIndex] && !listbox().hidden) {
    chooseSuggestion(state.activeIndex);
    return;
  }
  const exact = findExact(PLACES, input().value);
  if (exact) {
    guessPlace(exact);
    return;
  }
  if (state.pending) {
    confirmPending();
    return;
  }
  toast(pick(COPY.unknown), 'taxi');
  shake($('#guess-form'));
}

function onInputKey(e) {
  const open = !listbox().hidden && state.suggestions.length > 0;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!open) updateSuggestions();
    else {
      state.activeIndex = (state.activeIndex + 1) % state.suggestions.length;
      syncActive();
    }
  } else if (e.key === 'ArrowUp') {
    if (!open) return;
    e.preventDefault();
    state.activeIndex = (state.activeIndex - 1 + state.suggestions.length) % state.suggestions.length;
    syncActive();
  } else if (e.key === 'Escape') {
    if (!listbox().hidden) {
      e.preventDefault();
      closeSuggestions();
    } else if (input().value) {
      input().value = '';
    }
  } else if (e.key === 'Tab') {
    closeSuggestions();
  }
}

/* ------------------------------------------------------------------ */
/* Share / clipboard                                                   */
/* ------------------------------------------------------------------ */

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = h('textarea', { style: 'position:fixed;top:-1000px;opacity:0', readonly: true });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

async function share() {
  const { r, results, status } = snapshot();
  const text = G.shareText({
    puzzleNumber: r.puzzleNumber,
    mode: r.mode,
    results,
    won: status === 'won',
    difficulty: r.difficulty,
  });
  const mobile = window.matchMedia?.('(pointer: coarse)').matches;
  if (mobile && navigator.share) {
    try {
      await navigator.share({ text });
      return;
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
  }
  if (await copyText(text)) toast('Copied to clipboard! Go brag. 📋', 'taxi');
  else toast('Couldn’t copy — your browser said fuggedaboutit.', 'lose');
}

/* ------------------------------------------------------------------ */
/* Modals                                                              */
/* ------------------------------------------------------------------ */

let lastFocus = null;

function openModal(id) {
  const m = $(id);
  lastFocus = document.activeElement;
  m.hidden = false;
  const focusable = m.querySelector('[data-close].btn, .modal-close');
  focusable?.focus();
}

function closeModal(m) {
  m.hidden = true;
  if (m.id === 'help-modal') store.set('seenHelp', true);
  lastFocus?.focus?.();
}

function openStats() {
  const stats = store.get('stats', G.emptyStats());
  const today = G.dayIndexForDate();
  const ps = store.get('practiceStats', { played: 0, wins: 0 });
  const { r, results, status } = snapshot();
  const todayDaily = store.get(`daily:${today}`, null);
  const todaySnap = todayDaily && PLACE_BY_ID.get(todayDaily.placeId) ? G.replayRound(PLACE_BY_ID.get(todayDaily.placeId), todayDaily.guesses || []) : null;
  const winRow = todaySnap?.status === 'won' ? todaySnap.results.length : null;
  const maxD = Math.max(1, ...stats.distribution);
  const body = $('#stats-body');
  fill(body,
    h(
      'div',
      { class: 'stat-grid' },
      h('div', {}, h('b', {}, stats.played), h('span', {}, 'Played')),
      h('div', {}, h('b', {}, G.winPercent(stats)), h('span', {}, 'Win %')),
      h('div', {}, h('b', {}, G.liveStreak(stats, today)), h('span', {}, 'Streak')),
      h('div', {}, h('b', {}, stats.maxStreak), h('span', {}, 'Best')),
    ),
    h('h3', { class: 'small' }, 'GUESS DISTRIBUTION'),
    h(
      'div',
      { class: 'dist' },
      stats.distribution.map((n, i) =>
        h(
          'div',
          { class: 'dist-row' },
          bulletEl(i + 1, G.TIERS[0]),
          h('div', { class: `dist-bar${winRow === i + 1 ? ' hit' : ''}`, style: `width:${Math.max(8, (100 * n) / maxD)}%` }, n),
        ),
      ),
    ),
    h('p', { class: 'stats-sub' }, `Practice: ${ps.played} played · ${ps.played ? Math.round((100 * ps.wins) / ps.played) : 0}% won`),
    todaySnap && todaySnap.status !== 'playing'
      ? h(
          'div',
          {},
          h('p', { class: 'countdown' }, 'Next New Yorkdle in ', h('span', { class: 'cd' }, G.formatCountdown(G.msUntilNextNYMidnight()))),
          r.mode === 'daily' && status !== 'playing'
            ? h('button', { type: 'button', class: 'btn btn-primary btn-block', onclick: share }, '📤 Share today’s result')
            : h('button', { type: 'button', class: 'btn btn-primary btn-block', onclick: () => { closeModal($('#stats-modal')); setMode('daily'); } }, 'See today’s puzzle'),
        )
      : h('p', { class: 'small' }, results.length ? 'Finish today’s puzzle to keep your streak alive!' : 'Today’s puzzle is waiting for you. 🗽'),
  );
  openModal('#stats-modal');
}

/* ------------------------------------------------------------------ */
/* Modes                                                               */
/* ------------------------------------------------------------------ */

function startRound(round) {
  state.round = round;
  state.pending = null;
  state.shownHints = -1;
  closeSuggestions();
  input().value = '';
  map.setCrosshairVisible(false);
  saveRound();
  render();
  const snap = snapshot();
  if (snap.status !== 'playing') {
    const pts = round.guesses.map((g) => [g.lat, g.lng]);
    pts.push([snap.place.lat, snap.place.lng]);
    map.fitPoints(pts);
  } else {
    map.fit();
  }
}

function setMode(mode) {
  state.mode = mode;
  store.set('mode', mode);
  startRound(mode === 'daily' ? dailyRound() : practiceRound());
}

function startPractice(forceNew) {
  state.mode = 'practice';
  store.set('mode', 'practice');
  if (forceNew) {
    if (!state.recent.length) state.recent = store.get('practice', null)?.recent || [];
    startRound(newPracticeRound());
  } else {
    startRound(practiceRound());
  }
}

/* ------------------------------------------------------------------ */
/* Countdown tick                                                      */
/* ------------------------------------------------------------------ */

function tick() {
  const txt = G.formatCountdown(G.msUntilNextNYMidnight());
  for (const n of document.querySelectorAll('.cd')) n.textContent = txt;
  if (state.round?.mode === 'daily' && G.dayIndexForDate() !== state.round.dayIndex) {
    startRound(dailyRound());
    toast('🗽 A fresh New Yorkdle just dropped!', 'taxi', 3500);
  }
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function init() {
  map = new ManhattanMap($('#map'), MANHATTAN_POLYGON, {
    onTap: onMapTap,
    onKeyboardDrop: (ll) => {
      onMapTap(ll);
      if (state.pending) $('#confirm-pin').focus();
    },
  });
  map.svg.addEventListener('focus', () => map.setCrosshairVisible(true));
  map.svg.addEventListener('blur', () => map.setCrosshairVisible(false));

  $('#zoom-in').addEventListener('click', () => map.zoomBy(1.6));
  $('#zoom-out').addEventListener('click', () => map.zoomBy(1 / 1.6));
  $('#zoom-reset').addEventListener('click', () => map.fit());
  $('#confirm-pin').addEventListener('click', confirmPending);
  $('#cancel-pin').addEventListener('click', cancelPending);

  $('#mode-daily').addEventListener('click', () => state.round.mode !== 'daily' && setMode('daily'));
  $('#mode-practice').addEventListener('click', () => state.round.mode !== 'practice' && setMode('practice'));
  for (const b of document.querySelectorAll('[data-diff]')) {
    b.addEventListener('click', () => {
      if (state.difficulty === b.dataset.diff) return;
      state.difficulty = b.dataset.diff;
      store.set('practiceDifficulty', state.difficulty);
      startPractice(true);
    });
  }
  $('#new-practice').addEventListener('click', () => startPractice(true));

  $('#guess-form').addEventListener('submit', onSubmit);
  input().addEventListener('input', updateSuggestions);
  input().addEventListener('keydown', onInputKey);
  input().addEventListener('focus', () => input().value && updateSuggestions());
  input().addEventListener('blur', () => setTimeout(closeSuggestions, 120));

  $('#help-btn').addEventListener('click', () => openModal('#help-modal'));
  $('#stats-btn').addEventListener('click', openStats);
  for (const m of document.querySelectorAll('.modal')) {
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-close]')) closeModal(m);
    });
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal(m);
      if (e.key === 'Tab') {
        const f = [...m.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    });
  }

  setMode(state.mode);
  setInterval(tick, 1000);
  if (!store.get('seenHelp', false)) setTimeout(() => openModal('#help-modal'), 250);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
