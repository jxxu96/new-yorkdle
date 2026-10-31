// Pure geometry helpers for New Yorkdle (no DOM — importable from Node).

export const EARTH_RADIUS_M = 6371008.8;
export const METERS_PER_MILE = 1609.344;
export const METERS_PER_DEG_LAT = 111320;
/** Reference latitude used to correct the equirectangular projection. */
export const REF_LAT = 40.78;
export const COS_REF_LAT = Math.cos((REF_LAT * Math.PI) / 180);
/** Manhattan's street grid is rotated ~29° clockwise from true north. */
export const GRID_ROTATION_DEG = 29;
/** ~20 north–south street blocks per mile. */
export const STREET_BLOCKS_PER_MILE = 20;
/** A typical crosstown avenue block is ~0.16 mi (~260 m). */
export const AVENUE_BLOCK_M = 260;

/** Top-left origin for projected map coordinates. */
export const PROJ_ORIGIN = { lat: 40.885, lng: -74.035 };

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

/** Great-circle distance in meters. */
export function haversine(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Initial bearing from point 1 to point 2, degrees clockwise from true north [0, 360). */
export function bearing(lat1, lng1, lat2, lng2) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return normalizeDeg(toDeg(Math.atan2(y, x)));
}

export function normalizeDeg(d) {
  const n = d % 360;
  return n < 0 ? n + 360 : n;
}

export const metersToMiles = (m) => m / METERS_PER_MILE;

/** Equirectangular projection (latitude-corrected) to meters from PROJ_ORIGIN; y grows southward. */
export function project(lat, lng) {
  return {
    x: (lng - PROJ_ORIGIN.lng) * COS_REF_LAT * METERS_PER_DEG_LAT,
    y: (PROJ_ORIGIN.lat - lat) * METERS_PER_DEG_LAT,
  };
}

export function unproject(x, y) {
  return {
    lat: PROJ_ORIGIN.lat - y / METERS_PER_DEG_LAT,
    lng: PROJ_ORIGIN.lng + x / (COS_REF_LAT * METERS_PER_DEG_LAT),
  };
}

/** Ray-casting point-in-polygon. `poly` is an array of [lat, lng]. */
export function pointInPolygon(lat, lng, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function nearestOnSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

/** Distance in meters from a point to the nearest edge of a polygon (array of [lat, lng]). */
export function distanceToPolygonEdge(lat, lng, poly) {
  const p = project(lat, lng);
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = project(poly[j][0], poly[j][1]);
    const b = project(poly[i][0], poly[i][1]);
    const q = nearestOnSegment(p, a, b);
    best = Math.min(best, Math.hypot(p.x - q.x, p.y - q.y));
  }
  return best;
}

/** Nearest point (lat/lng) on a polyline (array of [lat, lng]) to the given point. */
export function nearestPointOnPath(lat, lng, path) {
  if (path.length === 1) return { lat: path[0][0], lng: path[0][1] };
  const p = project(lat, lng);
  let best = null;
  let bestD = Infinity;
  for (let i = 1; i < path.length; i++) {
    const a = project(path[i - 1][0], path[i - 1][1]);
    const b = project(path[i][0], path[i][1]);
    const q = nearestOnSegment(p, a, b);
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < bestD) {
      bestD = d;
      best = q;
    }
  }
  return unproject(best.x, best.y);
}

const COMPASS_16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const ARROWS_8 = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];

/** 16-point compass label for a bearing. */
export function compass16(deg) {
  return COMPASS_16[Math.round(normalizeDeg(deg) / 22.5) % 16];
}

/** 8-point arrow emoji for a bearing (used in share text). */
export function arrow8(deg) {
  return ARROWS_8[Math.round(normalizeDeg(deg) / 45) % 8];
}

const GRID_WORDS = [
  'Uptown',
  'Uptown & east',
  'Crosstown east',
  'Downtown & east',
  'Downtown',
  'Downtown & west',
  'Crosstown west',
  'Uptown & west',
];

/**
 * Direction in "Manhattan grid" terms. Uptown is ~29° east of true north,
 * so we rotate the bearing into grid space before bucketing.
 */
export function gridDirection(deg) {
  const rel = normalizeDeg(deg - GRID_ROTATION_DEG);
  return GRID_WORDS[Math.round(rel / 45) % 8];
}

/**
 * Split the vector from point 1 to point 2 into grid components (meters):
 * `along` (+ = uptown) and `across` (+ = toward the East River).
 */
export function gridComponents(lat1, lng1, lat2, lng2) {
  const a = project(lat1, lng1);
  const b = project(lat2, lng2);
  const east = b.x - a.x;
  const north = a.y - b.y;
  const r = toRad(GRID_ROTATION_DEG);
  return {
    along: north * Math.cos(r) + east * Math.sin(r),
    across: east * Math.cos(r) - north * Math.sin(r),
  };
}

/** Approximate N–S block count for a distance (≈20 blocks per mile). */
export function blocksApprox(meters) {
  return Math.round(metersToMiles(meters) * STREET_BLOCKS_PER_MILE);
}

/** "≈ 9 streets uptown, 2 avenues east" style breakdown along the grid. */
export function gridBreakdown(lat1, lng1, lat2, lng2) {
  const { along, across } = gridComponents(lat1, lng1, lat2, lng2);
  const streets = Math.round(Math.abs(along) / (METERS_PER_MILE / STREET_BLOCKS_PER_MILE));
  const avenues = Math.round(Math.abs(across) / AVENUE_BLOCK_M);
  return {
    streets,
    avenues,
    streetDir: along >= 0 ? 'uptown' : 'downtown',
    avenueDir: across >= 0 ? 'east' : 'west',
  };
}

export function formatMiles(meters, digits = 2) {
  return `${metersToMiles(meters).toFixed(digits)} mi`;
}
