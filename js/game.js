// Pure game logic for New Yorkdle (no DOM — importable from Node).
import {
  haversine,
  bearing,
  compass16,
  arrow8,
  gridDirection,
  gridBreakdown,
  blocksApprox,
  metersToMiles,
  nearestPointOnPath,
  METERS_PER_DEG_LAT,
} from './geo.js';

export const MAX_GUESSES = 6;
export const WIN_RADIUS_M = 75;
export const LAUNCH_DATE = '2026-10-31';
export const NY_TZ = 'America/New_York';
export const SITE_URL = 'https://jxxu96.github.io/new-yorkdle/';
const DAY_MS = 86400000;

export const CATEGORIES = {
  landmark: { emoji: '🗽', label: 'Landmark' },
  museum: { emoji: '🏛️', label: 'Museum' },
  food: { emoji: '🍕', label: 'Food & drink' },
  bar: { emoji: '🍺', label: 'Bar' },
  park: { emoji: '🌳', label: 'Park' },
  subway: { emoji: '🚇', label: 'Subway' },
  shop: { emoji: '🛍️', label: 'Shop' },
  'music venue': { emoji: '🎷', label: 'Music venue' },
  church: { emoji: '⛪', label: 'House of worship' },
  bridge: { emoji: '🌉', label: 'Bridge' },
  building: { emoji: '🏙️', label: 'Building' },
  sports: { emoji: '🏀', label: 'Sports' },
  oddity: { emoji: '🤔', label: 'Oddity' },
  theater: { emoji: '🎭', label: 'Theater & TV' },
};

export function categoryInfo(key) {
  return CATEGORIES[key] || { emoji: '📍', label: key };
}

/* ------------------------------------------------------------------ */
/* Dates (America/New_York)                                            */
/* ------------------------------------------------------------------ */

let nyFormatter = null;
function nyParts(date) {
  nyFormatter ||= new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const out = {};
  for (const p of nyFormatter.formatToParts(date)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  if (out.hour === 24) out.hour = 0;
  return out;
}

const pad = (n) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" for the given instant, in New York. */
export function nyDateString(date = new Date()) {
  const p = nyParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

function utcDayNumber(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

/** Days since launch for a NY date string (launch day = 0). */
export function dayIndexForDateString(dateStr) {
  return utcDayNumber(dateStr) - utcDayNumber(LAUNCH_DATE);
}

export function dayIndexForDate(date = new Date()) {
  return dayIndexForDateString(nyDateString(date));
}

/** Puzzle #1 is launch day (2026-10-31). */
export function puzzleNumberForDayIndex(dayIndex) {
  return dayIndex + 1;
}

export function puzzleNumberForDate(date = new Date()) {
  return puzzleNumberForDayIndex(dayIndexForDate(date));
}

function nyOffsetMs(t) {
  const p = nyParts(new Date(t));
  const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wall - Math.floor(t / 1000) * 1000;
}

/** Milliseconds until the next midnight in New York (DST-aware). */
export function msUntilNextNYMidnight(now = new Date()) {
  const t = now.getTime();
  const p = nyParts(now);
  const nextWallMidnight = Date.UTC(p.year, p.month - 1, p.day + 1, 0, 0, 0);
  let target = nextWallMidnight - nyOffsetMs(t);
  target = nextWallMidnight - nyOffsetMs(target);
  return Math.max(0, target - t);
}

export function formatCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/* ------------------------------------------------------------------ */
/* Seeded randomness                                                   */
/* ------------------------------------------------------------------ */

/** FNV-1a 32-bit string hash. */
export function hashString(str) {
  let h = 0x811c9dc5;
  for (const ch of String(str)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Small, fast deterministic PRNG returning floats in [0, 1). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(items, seed) {
  const a = items.slice();
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* Daily schedule                                                      */
/* ------------------------------------------------------------------ */

const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const scheduleCache = new Map();
/** Seed salt for the daily shuffle (chosen so launch day opens with a true classic). */
export const SCHEDULE_SALT = 'v41';

/**
 * One full cycle of daily puzzles: every place exactly once, iconic and local
 * spots shuffled separately then interleaved evenly (Bresenham-style), so the
 * mix stays fair (~2 iconic days for every 3 local) and nothing repeats until
 * the whole list has been played.
 */
export function dailySchedule(places, cycle = 0) {
  const key = `${cycle}|${places.length}|${places[0]?.id}|${places[places.length - 1]?.id}`;
  if (scheduleCache.has(key)) return scheduleCache.get(key);
  const sorted = places.slice().sort(byId);
  const iconic = seededShuffle(sorted.filter((p) => p.difficulty === 'iconic'), hashString(`nyd:${SCHEDULE_SALT}:iconic:${cycle}`));
  const local = seededShuffle(sorted.filter((p) => p.difficulty !== 'iconic'), hashString(`nyd:${SCHEDULE_SALT}:local:${cycle}`));
  const total = iconic.length + local.length;
  const out = [];
  let i = 0;
  let l = 0;
  for (let k = 0; k < total; k++) {
    const wantIconic = Math.ceil(((k + 1) * iconic.length) / total) > i;
    if ((wantIconic && i < iconic.length) || l >= local.length) out.push(iconic[i++]);
    else out.push(local[l++]);
  }
  scheduleCache.set(key, out);
  return out;
}

/** The daily place for a day index (0 = launch day). Works for negative indexes too. */
export function dailyPlace(places, dayIndex) {
  const n = places.length;
  const cycle = Math.floor(dayIndex / n);
  const pos = dayIndex - cycle * n;
  return dailySchedule(places, cycle)[pos];
}

export function filterByDifficulty(places, difficulty) {
  if (difficulty === 'iconic' || difficulty === 'local') return places.filter((p) => p.difficulty === difficulty);
  return places;
}

/** Random practice place, avoiding recently played ids when possible. */
export function pickPracticePlace(places, difficulty = 'mixed', rng = Math.random, avoidIds = []) {
  const pool = filterByDifficulty(places, difficulty);
  const avoid = new Set(avoidIds);
  const fresh = pool.filter((p) => !avoid.has(p.id));
  const from = fresh.length ? fresh : pool;
  return from[Math.floor(rng() * from.length)];
}

/* ------------------------------------------------------------------ */
/* Guess evaluation                                                    */
/* ------------------------------------------------------------------ */

export const TIERS = [
  { key: 'win', maxMiles: 0, emoji: '🟩', color: '#22b14c', label: 'Nailed it!' },
  { key: 'scorching', maxMiles: 0.25, emoji: '🟨', color: '#ffd21f', label: 'Scorching' },
  { key: 'warm', maxMiles: 1, emoji: '🟧', color: '#ff8c1a', label: 'Warm' },
  { key: 'chilly', maxMiles: 3, emoji: '🟥', color: '#ee352e', label: 'Chilly' },
  { key: 'freezing', maxMiles: Infinity, emoji: '🟦', color: '#2f7fe0', label: 'Freezing' },
];

export function tierFor(miles, win = false) {
  if (win) return TIERS[0];
  return TIERS.slice(1).find((t) => miles < t.maxMiles) || TIERS[TIERS.length - 1];
}

/** 0–100 closeness score; decays smoothly over Manhattan-sized distances. */
export function proximityPercent(meters, win = false) {
  if (win) return 100;
  return Math.min(99, Math.max(0, Math.round(100 * Math.exp(-meters / 3500))));
}

export function winRadius(place) {
  return place.radius ?? WIN_RADIUS_M;
}

/** Closest point of the target to a guess (handles linear places like the High Line). */
export function targetPointFor(place, lat, lng) {
  if (Array.isArray(place.path) && place.path.length) return nearestPointOnPath(lat, lng, place.path);
  return { lat: place.lat, lng: place.lng };
}

/**
 * Score a guess. `guess` = { lat, lng, placeId? }. A guess naming the target
 * wins outright; a pin (no placeId) wins inside the target's win radius.
 */
export function evaluateGuess(place, guess) {
  const tp = targetPointFor(place, guess.lat, guess.lng);
  const meters = haversine(guess.lat, guess.lng, tp.lat, tp.lng);
  const win = guess.placeId ? guess.placeId === place.id : meters <= winRadius(place);
  const brg = bearing(guess.lat, guess.lng, tp.lat, tp.lng);
  const miles = metersToMiles(meters);
  return {
    meters,
    miles,
    bearing: brg,
    compass: compass16(brg),
    arrow: arrow8(brg),
    grid: gridDirection(brg),
    breakdown: gridBreakdown(guess.lat, guess.lng, tp.lat, tp.lng),
    blocks: blocksApprox(meters),
    proximity: proximityPercent(meters, win),
    tier: tierFor(miles, win),
    win,
  };
}

/** Replays a list of stored guesses; returns per-guess results and round status. */
export function replayRound(place, guesses, maxGuesses = MAX_GUESSES) {
  const results = [];
  let status = 'playing';
  for (const g of guesses) {
    if (status !== 'playing') break;
    const r = evaluateGuess(place, g);
    results.push(r);
    if (r.win) status = 'won';
    else if (results.length >= maxGuesses) status = 'lost';
  }
  return { results, status };
}

/* ------------------------------------------------------------------ */
/* Hints                                                               */
/* ------------------------------------------------------------------ */

function stripArticle(name) {
  return name.replace(/^the\s+/i, '');
}

export function firstLetterHint(name) {
  const clean = stripArticle(name);
  const words = clean.split(/\s+/).filter(Boolean).length;
  return `Starts with “${clean.charAt(0).toUpperCase()}” · ${words} word${words === 1 ? '' : 's'}`;
}

/** What unlocks after N wrong guesses (index = wrong-guess count). */
export const HINT_SCHEDULE = [
  { key: 'clue1', label: 'Clue 1' },
  { key: 'clue2', label: 'Clue 2' },
  { key: 'clue3', label: 'Clue 3' },
  { key: 'neighborhood', label: 'Neighborhood' },
  { key: 'letter', label: 'First letter' },
  { key: 'zone', label: 'Search zone' },
];

/** Hints visible after `wrongCount` misses (or all of them once the round is over). */
export function hintsFor(place, wrongCount, revealAll = false) {
  const n = revealAll ? HINT_SCHEDULE.length - 1 : Math.min(wrongCount, HINT_SCHEDULE.length - 1);
  const values = {
    clue1: place.clues[0],
    clue2: place.clues[1],
    clue3: place.clues[2],
    neighborhood: place.neighborhood,
    letter: firstLetterHint(place.name),
    zone: revealAll ? 'The ★ on the map marks the spot.' : 'It’s somewhere inside the dashed circle on the map.',
  };
  return HINT_SCHEDULE.map((h, i) => ({ ...h, unlocked: i <= n, text: i <= n ? values[h.key] : null, unlocksAfter: i }));
}

/** Deterministic "search zone" circle that contains the target but isn't centered on it. */
export function zoneCircle(place, radiusM = 650) {
  const rnd = mulberry32(hashString(`zone:${place.id}`));
  const angle = rnd() * Math.PI * 2;
  const offset = radiusM * (0.25 + rnd() * 0.4);
  const dLat = (Math.cos(angle) * offset) / METERS_PER_DEG_LAT;
  const dLng = (Math.sin(angle) * offset) / (METERS_PER_DEG_LAT * Math.cos((place.lat * Math.PI) / 180));
  return { lat: place.lat + dLat, lng: place.lng + dLng, radius: radiusM };
}

/* ------------------------------------------------------------------ */
/* Share text                                                          */
/* ------------------------------------------------------------------ */

export function shareMiles(miles) {
  return miles >= 0.1 ? miles.toFixed(1) : miles.toFixed(2);
}

/**
 * New Yorkdle #12 3/6 🗽
 * 🟥⬆️ 2.1mi
 * 🟧↗️ 0.6mi
 * 🟩📍
 */
export function shareText({ puzzleNumber, mode = 'daily', results, won, maxGuesses = MAX_GUESSES, url = SITE_URL, difficulty }) {
  const score = won ? results.length : 'X';
  const label = mode === 'practice' ? `Practice${difficulty && difficulty !== 'mixed' ? ` (${difficulty})` : ''}` : `#${puzzleNumber}`;
  const lines = [`New Yorkdle ${label} ${score}/${maxGuesses} 🗽`];
  for (const r of results) {
    lines.push(r.win ? '🟩📍' : `${r.tier.emoji}${r.arrow} ${shareMiles(r.miles)}mi`);
  }
  if (url) lines.push(url);
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export function emptyStats() {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDay: null,
    lastWonDay: null,
    distribution: Array(MAX_GUESSES).fill(0),
  };
}

/** Returns updated daily stats after finishing `dayIndex`. Idempotent per day. */
export function recordDailyResult(stats, dayIndex, won, guessCount) {
  const s = { ...emptyStats(), ...stats, distribution: [...(stats?.distribution || emptyStats().distribution)] };
  if (s.lastPlayedDay === dayIndex) return s;
  s.played += 1;
  if (won) {
    s.wins += 1;
    s.distribution[Math.min(guessCount, MAX_GUESSES) - 1] += 1;
    s.currentStreak = s.lastWonDay === dayIndex - 1 ? s.currentStreak + 1 : 1;
    s.maxStreak = Math.max(s.maxStreak, s.currentStreak);
    s.lastWonDay = dayIndex;
  } else {
    s.currentStreak = 0;
  }
  s.lastPlayedDay = dayIndex;
  return s;
}

/** Streak as of today: broken if the last win was before yesterday. */
export function liveStreak(stats, todayIndex) {
  if (!stats || stats.lastWonDay == null) return 0;
  return stats.lastWonDay >= todayIndex - 1 ? stats.currentStreak : 0;
}

export function winPercent(stats) {
  return stats.played ? Math.round((100 * stats.wins) / stats.played) : 0;
}
