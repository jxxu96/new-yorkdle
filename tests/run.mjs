// New Yorkdle test runner — plain Node, no dependencies.  Run: node tests/run.mjs
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { PLACES } from '../data/places.js';
import { MANHATTAN_POLYGON } from '../data/manhattan.js';
import * as geo from '../js/geo.js';
import * as G from '../js/game.js';
import { searchPlaces, findExact, normalize } from '../js/search.js';
import { COPY, pick, tierLine } from '../js/copy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, err });
    console.log(`  ✗ ${name}\n      ${err.message}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

function assert(cond, msg = 'assertion failed') {
  if (!cond) throw new Error(msg);
}

function eq(actual, expected, msg = '') {
  if (actual !== expected) throw new Error(`${msg} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function near(actual, expected, tol, msg = '') {
  if (Math.abs(actual - expected) > tol) throw new Error(`${msg} expected ${expected} ± ${tol}, got ${actual}`);
}

const BBOX = { minLat: 40.68, maxLat: 40.88, minLng: -74.03, maxLng: -73.9 };
const inBbox = (lat, lng) => lat >= BBOX.minLat && lat <= BBOX.maxLat && lng >= BBOX.minLng && lng <= BBOX.maxLng;
const decimals = (n) => (String(n).split('.')[1] || '').length;

/* ------------------------------------------------------------------ */
section('Manhattan polygon');

test('has a sensible number of vertices (80–200)', () => {
  assert(MANHATTAN_POLYGON.length >= 80 && MANHATTAN_POLYGON.length <= 200, `got ${MANHATTAN_POLYGON.length}`);
});

test('every vertex is a [lat, lng] pair inside the bounding box', () => {
  for (const v of MANHATTAN_POLYGON) {
    assert(Array.isArray(v) && v.length === 2, `bad vertex ${JSON.stringify(v)}`);
    assert(inBbox(v[0], v[1]), `vertex outside bbox: ${v}`);
  }
});

test('spans Manhattan from the Battery to Inwood', () => {
  const lats = MANHATTAN_POLYGON.map((v) => v[0]);
  assert(Math.min(...lats) < 40.705, 'should reach the Battery');
  assert(Math.max(...lats) > 40.87, 'should reach Inwood');
});

test('known land points are inside, water and other boroughs are outside', () => {
  const inside = [
    ['Empire State Building', 40.74844, -73.98566],
    ['Central Park', 40.7812, -73.9665],
    ['Inwood', 40.8677, -73.9212],
    ['Wall Street', 40.7064, -74.0094],
    ['Harlem', 40.8116, -73.9465],
  ];
  const outside = [
    ['Hudson River', 40.75, -74.02],
    ['East River', 40.73, -73.965],
    ['Statue of Liberty', 40.68925, -74.0445],
    ['Roosevelt Island', 40.762, -73.95],
    ['Downtown Brooklyn', 40.6928, -73.9903],
    ['Long Island City', 40.7447, -73.9485],
    ['Jersey City', 40.7178, -74.0431],
    ['The Bronx', 40.8448, -73.9156],
  ];
  for (const [n, la, lo] of inside) assert(geo.pointInPolygon(la, lo, MANHATTAN_POLYGON), `${n} should be inside`);
  for (const [n, la, lo] of outside) assert(!geo.pointInPolygon(la, lo, MANHATTAN_POLYGON), `${n} should be outside`);
});

/* ------------------------------------------------------------------ */
section('Places dataset');

const iconic = PLACES.filter((p) => p.difficulty === 'iconic');
const local = PLACES.filter((p) => p.difficulty === 'local');

test('has at least 160 places', () => assert(PLACES.length >= 160, `only ${PLACES.length}`));

test('ids are unique, kebab-case strings', () => {
  const seen = new Set();
  for (const p of PLACES) {
    assert(typeof p.id === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id), `bad id ${p.id}`);
    assert(!seen.has(p.id), `duplicate id ${p.id}`);
    seen.add(p.id);
  }
});

test('every place has all required fields', () => {
  for (const p of PLACES) {
    const where = `(${p.id})`;
    assert(typeof p.name === 'string' && p.name.trim(), `name ${where}`);
    assert(Array.isArray(p.aliases) && p.aliases.every((a) => typeof a === 'string' && a.trim()), `aliases ${where}`);
    assert(Number.isFinite(p.lat) && Number.isFinite(p.lng), `lat/lng ${where}`);
    assert(decimals(p.lat) <= 5 && decimals(p.lng) <= 5, `coords should have at most 5 decimals ${where}`);
    assert(p.category in G.CATEGORIES, `unknown category "${p.category}" ${where}`);
    assert(typeof p.neighborhood === 'string' && p.neighborhood.trim(), `neighborhood ${where}`);
    assert(p.difficulty === 'iconic' || p.difficulty === 'local', `difficulty ${where}`);
    assert(Array.isArray(p.clues) && p.clues.length === 3, `needs exactly 3 clues ${where}`);
    assert(p.clues.every((c) => typeof c === 'string' && c.trim().length > 10), `clue text ${where}`);
    assert(new Set(p.clues).size === 3, `clues must differ ${where}`);
    assert(typeof p.fact === 'string' && p.fact.trim().length > 10, `fact ${where}`);
    if (p.radius != null) assert(Number.isFinite(p.radius) && p.radius >= 30 && p.radius <= 200, `radius ${where}`);
    if (p.path != null) assert(Array.isArray(p.path) && p.path.length >= 2, `path ${where}`);
  }
});

test('mix is roughly 70 iconic and 90+ local', () => {
  assert(iconic.length >= 60 && iconic.length <= 85, `iconic = ${iconic.length}`);
  assert(local.length >= 90, `local = ${local.length}`);
});

test('every coordinate is inside the bounding box (lat 40.68–40.88, lng -74.03 – -73.90)', () => {
  for (const p of PLACES) {
    assert(inBbox(p.lat, p.lng), `${p.id} outside bbox`);
    for (const [la, lo] of p.path || []) assert(inBbox(la, lo), `${p.id} path point outside bbox`);
  }
});

test('every coordinate is inside the Manhattan polygon', () => {
  const bad = [];
  for (const p of PLACES) {
    if (!geo.pointInPolygon(p.lat, p.lng, MANHATTAN_POLYGON)) bad.push(p.id);
    for (const [la, lo] of p.path || []) if (!geo.pointInPolygon(la, lo, MANHATTAN_POLYGON)) bad.push(`${p.id} (path)`);
  }
  assert(!bad.length, `outside polygon: ${bad.join(', ')}`);
});

test('a path place’s main point lies on (or very near) its path', () => {
  for (const p of PLACES.filter((x) => x.path)) {
    const q = geo.nearestPointOnPath(p.lat, p.lng, p.path);
    assert(geo.haversine(p.lat, p.lng, q.lat, q.lng) < 5, `${p.id} main point is off its path`);
  }
});

test('clues never give away the full place name', () => {
  for (const p of PLACES) {
    const name = normalize(p.name);
    for (const c of p.clues) assert(!normalize(c).includes(name), `${p.id} clue mentions its own name: "${c}"`);
  }
});

test('names and aliases are unambiguous across places', () => {
  const owner = new Map();
  for (const p of PLACES) {
    for (const label of [p.name, ...p.aliases]) {
      const k = normalize(label);
      assert(!owner.has(k) || owner.get(k) === p.id, `"${label}" used by ${owner.get(k)} and ${p.id}`);
      owner.set(k, p.id);
    }
  }
});

test('no place sits inside another place’s win zone', () => {
  for (const a of PLACES) {
    for (const b of PLACES) {
      if (a === b) continue;
      const r = G.evaluateGuess(b, { lat: a.lat, lng: a.lng });
      assert(!r.win, `a pin on ${a.id} would win ${b.id} (${r.meters.toFixed(0)} m)`);
    }
  }
});

test('spec examples are present', () => {
  const ids = new Set(PLACES.map((p) => p.id));
  for (const id of [
    'empire-state-building', 'strand-bookstore', 'katzs-delicatessen', 'the-met', 'washington-square-arch',
    'flatiron-building', 'chrysler-building', 'grand-central-terminal', 'apollo-theater', 'the-cloisters',
    'little-island', 'stonewall-inn', 'russ-and-daughters', 'mcsorleys', 'joes-pizza', 'mamouns', 'petes-tavern',
    'elizabeth-street-garden', 'paley-park', 'greenacre-park', 'sylvan-terrace', 'pomander-walk',
    'little-red-lighthouse', 'freedom-tunnel', 'city-hall-station', 'alamo-cube',
  ]) assert(ids.has(id), `missing ${id}`);
});

/* ------------------------------------------------------------------ */
section('Distance & bearing');

test('haversine: zero for identical points', () => eq(geo.haversine(40.75, -73.98, 40.75, -73.98), 0));

test('haversine: one degree of latitude ≈ 111.2 km', () => near(geo.haversine(40, -74, 41, -74), 111195, 50));

test('haversine: Empire State → Chrysler ≈ 0.59 mi', () => {
  const m = geo.haversine(40.74844, -73.98566, 40.75165, -73.9754);
  near(geo.metersToMiles(m), 0.59, 0.02);
});

test('haversine: Battery → Inwood tip ≈ 13 mi', () => {
  const m = geo.haversine(40.7033, -74.017, 40.8739, -73.9109);
  near(geo.metersToMiles(m), 12.9, 0.4);
});

test('bearing: cardinal directions', () => {
  near(geo.bearing(40.7, -74, 40.8, -74), 0, 0.01, 'north');
  near(geo.bearing(40.8, -74, 40.7, -74), 180, 0.01, 'south');
  near(geo.bearing(40.75, -74, 40.75, -73.9), 90, 0.1, 'east');
  near(geo.bearing(40.75, -73.9, 40.75, -74), 270, 0.1, 'west');
});

test('compass16 and arrow8 buckets', () => {
  eq(geo.compass16(0), 'N');
  eq(geo.compass16(22.5), 'NNE');
  eq(geo.compass16(45), 'NE');
  eq(geo.compass16(200), 'SSW');
  eq(geo.compass16(359), 'N');
  eq(geo.arrow8(0), '⬆️');
  eq(geo.arrow8(45), '↗️');
  eq(geo.arrow8(90), '➡️');
  eq(geo.arrow8(135), '↘️');
  eq(geo.arrow8(180), '⬇️');
  eq(geo.arrow8(225), '↙️');
  eq(geo.arrow8(270), '⬅️');
  eq(geo.arrow8(315), '↖️');
});

test('grid direction uses Manhattan’s ~29° rotation', () => {
  eq(geo.gridDirection(29), 'Uptown');
  eq(geo.gridDirection(209), 'Downtown');
  eq(geo.gridDirection(119), 'Crosstown east');
  eq(geo.gridDirection(299), 'Crosstown west');
  eq(geo.gridDirection(0), 'Uptown & west', 'true north is uptown-and-west on the grid');
});

test('grid components: moving straight up an avenue is all "along", no "across"', () => {
  const r = (29 * Math.PI) / 180;
  const d = 1000;
  const lat2 = 40.75 + (Math.cos(r) * d) / geo.METERS_PER_DEG_LAT;
  const lng2 = -73.98 + (Math.sin(r) * d) / (geo.METERS_PER_DEG_LAT * geo.COS_REF_LAT);
  const c = geo.gridComponents(40.75, -73.98, lat2, lng2);
  near(c.along, 1000, 5);
  near(c.across, 0, 5);
});

test('blocks: ~20 north–south blocks per mile', () => {
  eq(geo.blocksApprox(geo.METERS_PER_MILE), 20);
  eq(geo.blocksApprox(geo.METERS_PER_MILE / 4), 5);
});

test('projection round-trips', () => {
  const p = geo.project(40.78, -73.97);
  const back = geo.unproject(p.x, p.y);
  near(back.lat, 40.78, 1e-9);
  near(back.lng, -73.97, 1e-9);
});

test('distance to polygon edge is small near the shore, large inland', () => {
  assert(geo.distanceToPolygonEdge(40.7033, -74.0168, MANHATTAN_POLYGON) < 150, 'Castle Clinton is near the water');
  assert(geo.distanceToPolygonEdge(40.7812, -73.9665, MANHATTAN_POLYGON) > 1000, 'Central Park is inland');
});

/* ------------------------------------------------------------------ */
section('Guess evaluation');

const esb = PLACES.find((p) => p.id === 'empire-state-building');
const highLine = PLACES.find((p) => p.id === 'high-line');

test('naming the target wins', () => {
  const r = G.evaluateGuess(esb, { placeId: esb.id, lat: esb.lat, lng: esb.lng });
  assert(r.win);
  eq(r.proximity, 100);
  eq(r.tier.emoji, '🟩');
});

test('a pin within ~75 m wins, a pin 120 m away does not', () => {
  const dLat = (m) => m / geo.METERS_PER_DEG_LAT;
  assert(G.evaluateGuess(esb, { lat: esb.lat + dLat(60), lng: esb.lng }).win, '60 m should win');
  assert(!G.evaluateGuess(esb, { lat: esb.lat + dLat(120), lng: esb.lng }).win, '120 m should not win');
});

test('naming a different place never wins, even nearby', () => {
  const russ = PLACES.find((p) => p.id === 'russ-and-daughters');
  const katz = PLACES.find((p) => p.id === 'katzs-delicatessen');
  const r = G.evaluateGuess(katz, { placeId: russ.id, lat: russ.lat, lng: russ.lng });
  assert(!r.win);
  assert(r.meters < 150);
});

test('linear places measure distance to the nearest point of the path', () => {
  const r = G.evaluateGuess(highLine, { lat: 40.7553, lng: -74.0058 });
  assert(r.meters < 50, `got ${r.meters}`);
  assert(r.win, 'a pin on the Rail Yards section should count');
});

test('result has distance, blocks, direction, proximity and tier', () => {
  const r = G.evaluateGuess(esb, { lat: 40.7128, lng: -74.006 });
  near(r.miles, 2.6, 0.2);
  eq(r.blocks, Math.round(r.miles * 20));
  eq(r.compass, 'NNE');
  eq(r.arrow, '↗️');
  eq(r.grid, 'Uptown');
  eq(r.tier.key, 'chilly');
  assert(r.proximity > 0 && r.proximity < 50);
});

test('tiers go hot → cold with distance', () => {
  eq(G.tierFor(0.1).emoji, '🟨');
  eq(G.tierFor(0.6).emoji, '🟧');
  eq(G.tierFor(2.1).emoji, '🟥');
  eq(G.tierFor(5).emoji, '🟦');
  eq(G.tierFor(0, true).emoji, '🟩');
});

test('proximity decreases monotonically', () => {
  let prev = 101;
  for (const m of [0, 50, 200, 800, 2000, 5000, 15000]) {
    const p = G.proximityPercent(m);
    assert(p <= prev, `not monotonic at ${m}`);
    prev = p;
  }
  eq(G.proximityPercent(5, true), 100);
  assert(G.proximityPercent(10) < 100, 'non-wins never show 100%');
});

test('replayRound stops at a win and loses after 6 misses', () => {
  const far = { lat: 40.86, lng: -73.93 };
  const win = { placeId: esb.id, lat: esb.lat, lng: esb.lng };
  const a = G.replayRound(esb, [far, far, win, far]);
  eq(a.status, 'won');
  eq(a.results.length, 3);
  const b = G.replayRound(esb, Array(6).fill(far));
  eq(b.status, 'lost');
  const c = G.replayRound(esb, Array(3).fill(far));
  eq(c.status, 'playing');
});

test('hints unlock progressively: clue 2, clue 3, neighborhood, first letter, zone', () => {
  for (let wrong = 0; wrong <= 5; wrong++) {
    const unlocked = G.hintsFor(esb, wrong).filter((x) => x.unlocked);
    eq(unlocked.length, wrong + 1, `after ${wrong} misses`);
  }
  const all = G.hintsFor(esb, 0, true);
  assert(all.every((x) => x.unlocked));
  eq(all[3].text, esb.neighborhood);
  eq(G.firstLetterHint('The Met Cloisters'), 'Starts with “M” · 2 words');
});

test('search zone always contains the target', () => {
  for (const p of PLACES) {
    const z = G.zoneCircle(p);
    assert(geo.haversine(z.lat, z.lng, p.lat, p.lng) < z.radius, `${p.id} outside its zone`);
    const z2 = G.zoneCircle(p);
    eq(z.lat, z2.lat, 'zone must be deterministic');
  }
});

/* ------------------------------------------------------------------ */
section('Daily puzzle');

test('launch day 2026-10-31 is puzzle #1', () => {
  eq(G.dayIndexForDateString('2026-10-31'), 0);
  eq(G.puzzleNumberForDayIndex(0), 1);
  eq(G.dayIndexForDateString('2026-11-12') + 1, 13);
  eq(G.dayIndexForDateString('2027-10-31'), 365);
});

test('New York date is used, not UTC', () => {
  // 03:30 UTC on Nov 1 is still 11:30 PM Oct 31 in New York (EDT).
  eq(G.nyDateString(new Date('2026-11-01T03:30:00Z')), '2026-10-31');
  eq(G.nyDateString(new Date('2026-11-01T04:30:00Z')), '2026-11-01');
  eq(G.puzzleNumberForDate(new Date('2026-10-31T16:00:00Z')), 1);
  eq(G.puzzleNumberForDate(new Date('2026-11-01T04:30:00Z')), 2);
  // Winter (EST): 04:30 UTC Jan 15 = 11:30 PM Jan 14.
  eq(G.nyDateString(new Date('2027-01-15T04:30:00Z')), '2027-01-14');
});

test('countdown to NY midnight handles DST', () => {
  // 12:30 AM EDT on Nov 1, 2026 — clocks fall back, so the day is 25 hours long.
  eq(G.msUntilNextNYMidnight(new Date('2026-11-01T04:30:00Z')), 24.5 * 3600 * 1000);
  // Noon EST Jan 15 → 12 hours to midnight.
  eq(G.msUntilNextNYMidnight(new Date('2027-01-15T17:00:00Z')), 12 * 3600 * 1000);
  eq(G.formatCountdown(3723000), '01:02:03');
});

test('seeded shuffle is deterministic and a permutation', () => {
  const items = Array.from({ length: 50 }, (_, i) => i);
  const a = G.seededShuffle(items, 42);
  const b = G.seededShuffle(items, 42);
  const c = G.seededShuffle(items, 43);
  eq(JSON.stringify(a), JSON.stringify(b));
  assert(JSON.stringify(a) !== JSON.stringify(c), 'different seeds should differ');
  eq(JSON.stringify([...a].sort((x, y) => x - y)), JSON.stringify(items));
  eq(JSON.stringify(items), JSON.stringify(Array.from({ length: 50 }, (_, i) => i)), 'input untouched');
});

test('daily place is deterministic for a given day', () => {
  for (const d of [0, 1, 7, 100, 1000, -3]) {
    eq(G.dailyPlace(PLACES, d).id, G.dailyPlace(PLACES, d).id, `day ${d}`);
  }
});

test('daily schedule does not depend on dataset order', () => {
  const reversed = [...PLACES].reverse();
  for (let d = 0; d < 30; d++) eq(G.dailyPlace(reversed, d).id, G.dailyPlace(PLACES, d).id, `day ${d}`);
});

test('no repeats for a full cycle (one per place)', () => {
  const seen = new Set();
  for (let d = 0; d < PLACES.length; d++) seen.add(G.dailyPlace(PLACES, d).id);
  eq(seen.size, PLACES.length);
});

test('daily mix is fair: iconic days spread evenly, never 3 of a kind… mostly', () => {
  const days = Array.from({ length: PLACES.length }, (_, d) => G.dailyPlace(PLACES, d).difficulty);
  eq(days[0], 'iconic', 'launch day should be an iconic spot');
  for (let start = 0; start + 7 <= days.length; start += 7) {
    const week = days.slice(start, start + 7);
    const n = week.filter((x) => x === 'iconic').length;
    assert(n >= 2 && n <= 4, `week starting day ${start} has ${n} iconic`);
  }
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] ? run + 1 : 1;
    assert(!(days[i] === 'iconic' && run > 1), 'two iconic days in a row');
    assert(run <= 3, 'more than 3 local days in a row');
  }
});

test('next cycle reshuffles but still covers every place', () => {
  const n = PLACES.length;
  const seen = new Set();
  for (let d = n; d < 2 * n; d++) seen.add(G.dailyPlace(PLACES, d).id);
  eq(seen.size, n);
  const sameOrder = Array.from({ length: 20 }, (_, i) => G.dailyPlace(PLACES, i).id === G.dailyPlace(PLACES, n + i).id).filter(Boolean).length;
  assert(sameOrder < 10, 'second cycle should be a different order');
});

test('practice picks respect difficulty and avoid recent ids', () => {
  let s = 1;
  const rng = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 50; i++) eq(G.pickPracticePlace(PLACES, 'local', rng).difficulty, 'local');
  for (let i = 0; i < 50; i++) eq(G.pickPracticePlace(PLACES, 'iconic', rng).difficulty, 'iconic');
  const avoid = PLACES.slice(0, PLACES.length - 1).map((p) => p.id);
  eq(G.pickPracticePlace(PLACES, 'mixed', rng, avoid).id, PLACES[PLACES.length - 1].id);
});

/* ------------------------------------------------------------------ */
section('Share text');

const fakeResult = (miles, arrow, win = false) => ({ miles, arrow, win, tier: G.tierFor(miles, win) });

test('matches the spec format', () => {
  const text = G.shareText({
    puzzleNumber: 12,
    results: [fakeResult(2.1, '⬆️'), fakeResult(0.6, '↗️'), fakeResult(0, '', true)],
    won: true,
  });
  eq(text, 'New Yorkdle #12 3/6 🗽\n🟥⬆️ 2.1mi\n🟧↗️ 0.6mi\n🟩📍\nhttps://jxxu96.github.io/new-yorkdle/');
});

test('a loss scores X/6', () => {
  const results = Array(6).fill(fakeResult(4.27, '↙️'));
  const text = G.shareText({ puzzleNumber: 3, results, won: false, url: '' });
  const lines = text.split('\n');
  eq(lines[0], 'New Yorkdle #3 X/6 🗽');
  eq(lines.length, 7);
  eq(lines[1], '🟦↙️ 4.3mi');
});

test('tiny distances keep two decimals; practice rounds are labeled', () => {
  const text = G.shareText({ mode: 'practice', difficulty: 'local', results: [fakeResult(0.05, '➡️'), fakeResult(0, '', true)], won: true, url: '' });
  eq(text, 'New Yorkdle Practice (local) 2/6 🗽\n🟨➡️ 0.05mi\n🟩📍');
});

test('share text from real evaluated guesses', () => {
  const far = G.evaluateGuess(esb, { lat: 40.7128, lng: -74.006 });
  const win = G.evaluateGuess(esb, { placeId: esb.id, lat: esb.lat, lng: esb.lng });
  const text = G.shareText({ puzzleNumber: 1, results: [far, win], won: true });
  assert(text.startsWith('New Yorkdle #1 2/6 🗽\n🟥↗️ 2.'), text);
  assert(text.includes('🟩📍'));
  assert(text.endsWith(G.SITE_URL));
});

/* ------------------------------------------------------------------ */
section('Stats');

test('streaks count consecutive daily wins and reset on a loss', () => {
  let s = G.emptyStats();
  s = G.recordDailyResult(s, 0, true, 3);
  s = G.recordDailyResult(s, 1, true, 2);
  s = G.recordDailyResult(s, 2, true, 6);
  eq(s.currentStreak, 3);
  eq(s.maxStreak, 3);
  s = G.recordDailyResult(s, 3, false, 6);
  eq(s.currentStreak, 0);
  s = G.recordDailyResult(s, 4, true, 1);
  eq(s.currentStreak, 1);
  eq(s.maxStreak, 3);
  eq(s.played, 5);
  eq(s.wins, 4);
  eq(G.winPercent(s), 80);
  eq(JSON.stringify(s.distribution), JSON.stringify([1, 1, 1, 0, 0, 1]));
});

test('recording the same day twice is a no-op', () => {
  let s = G.recordDailyResult(G.emptyStats(), 5, true, 2);
  s = G.recordDailyResult(s, 5, true, 2);
  eq(s.played, 1);
});

test('a skipped day breaks the streak', () => {
  let s = G.recordDailyResult(G.emptyStats(), 0, true, 2);
  s = G.recordDailyResult(s, 2, true, 2);
  eq(s.currentStreak, 1);
  eq(G.liveStreak(s, 3), 1, 'yesterday’s win keeps it alive');
  eq(G.liveStreak(s, 5), 0, 'two idle days break it');
});

/* ------------------------------------------------------------------ */
section('Search');

const top = (q) => searchPlaces(PLACES, q, 5)[0]?.place.id;

test('prefix and alias matches', () => {
  eq(top('katz'), 'katzs-delicatessen');
  eq(top('Katz’s'), 'katzs-delicatessen');
  eq(top('russ and daughters'), 'russ-and-daughters');
  eq(top('MoMA'), 'moma');
  eq(top('esb'), 'empire-state-building');
  eq(top('st patricks'), 'st-patricks-cathedral');
  eq(top('saint patrick'), 'st-patricks-cathedral');
  eq(top('freedom'), 'freedom-tunnel');
});

test('typos are forgiven', () => {
  eq(top('guggenhiem'), 'guggenheim');
  eq(top('mcsorelys'), 'mcsorleys');
  eq(top('chrystler'), 'chrysler-building');
});

test('exact lookup by name or alias', () => {
  eq(findExact(PLACES, 'the strand')?.id, 'strand-bookstore');
  eq(findExact(PLACES, 'GWB')?.id, 'george-washington-bridge');
  eq(findExact(PLACES, 'not a real place'), null);
});

test('empty queries return nothing', () => {
  eq(searchPlaces(PLACES, '   ').length, 0);
  eq(normalize("  The Joe's  Pizza "), 'joes pizza');
});

/* ------------------------------------------------------------------ */
section('Copy & static site');

test('copy picker returns lines', () => {
  assert(COPY.win.includes(pick(COPY.win, 0.5)));
  for (const t of G.TIERS.slice(1)) assert(typeof tierLine(t.key, 0.3) === 'string');
});

test('index.html uses only relative asset paths (GitHub Pages subpath safe)', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  assert(refs.length > 0);
  for (const r of refs) {
    if (r.startsWith('#') || r.startsWith('https://www.openstreetmap.org')) continue;
    assert(!r.startsWith('/') && !/^[a-z]+:/i.test(r), `non-relative reference: ${r}`);
    assert(existsSync(join(ROOT, r)), `missing file: ${r}`);
  }
});

test('JS modules use only relative imports', () => {
  for (const f of ['js/app.js', 'js/game.js', 'js/geo.js', 'js/map.js', 'js/search.js', 'js/confetti.js', 'js/copy.js']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/^\s*import[^'"]*['"]([^'"]+)['"]/gm)) {
      assert(m[1].startsWith('./') || m[1].startsWith('../'), `${f} imports ${m[1]}`);
      assert(existsSync(join(ROOT, dirname(f), m[1])), `${f}: missing ${m[1]}`);
    }
  }
});

test('no GitHub workflow directory', () => assert(!existsSync(join(ROOT, '.github', 'workflows'))));

/* ------------------------------------------------------------------ */
console.log(`\n${passed} passed, ${failed} failed (${PLACES.length} places: ${iconic.length} iconic, ${local.length} local)`);
if (failed) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f.name}: ${f.err.message}`);
  process.exit(1);
}
