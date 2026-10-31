// Fuzzy place-name search (no DOM — importable from Node).

/** Lowercase, strip accents/punctuation, unify "&"/"and", "st."/"saint", drop a leading "the". */
export function normalize(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/½/g, ' 1/2')
    .replace(/&/g, ' and ')
    .replace(/['’‘`".]/g, '')
    .replace(/[^a-z0-9/]+/g, ' ')
    .replace(/\bsaint\b/g, 'st')
    .trim()
    .replace(/^the /, '');
}

/** Classic Levenshtein distance, bailing out early once `max` is exceeded. */
export function editDistance(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function isSubsequence(q, s) {
  let i = 0;
  for (let j = 0; j < s.length && i < q.length; j++) if (q[i] === s[j]) i++;
  return i === q.length;
}

/** Score how well a normalized query matches one normalized label (0 = no match). */
export function scoreLabel(q, label) {
  if (!q || !label) return 0;
  if (label === q) return 1000;
  if (label.startsWith(q)) return 900 - Math.min(80, label.length - q.length);
  const words = label.split(' ');
  if (words.some((w) => w.startsWith(q))) return 800 - Math.min(80, label.length - q.length);
  if (label.includes(q)) return 700;
  const qWords = q.split(' ');
  if (qWords.length > 1 && qWords.every((qw) => words.some((w) => w.startsWith(qw)))) return 650;
  if (q.length >= 3) {
    // Typo tolerance against the start of the label and against each word.
    const allowed = q.length >= 7 ? 2 : 1;
    const head = editDistance(q, label.slice(0, q.length), allowed);
    if (head <= allowed) return 560 - head * 60;
    for (const w of words) {
      if (w.length < 3) continue;
      const d = editDistance(q, w.slice(0, Math.max(q.length, Math.min(w.length, q.length + 1))), allowed);
      if (d <= allowed) return 500 - d * 60;
    }
    if (q.length >= 4 && isSubsequence(q.replace(/ /g, ''), label.replace(/ /g, ''))) return 300;
  }
  return 0;
}

const labelCache = new WeakMap();
function labelsFor(place) {
  let labels = labelCache.get(place);
  if (!labels) {
    labels = [place.name, ...(place.aliases || [])].map((text, i) => ({ text, norm: normalize(text), primary: i === 0 }));
    labelCache.set(place, labels);
  }
  return labels;
}

/**
 * Ranked autocomplete results: [{ place, score, matched }] where `matched`
 * is the alias that matched (null when it was the primary name).
 */
export function searchPlaces(places, query, limit = 8) {
  const q = normalize(query);
  if (!q) return [];
  const results = [];
  for (const place of places) {
    let best = 0;
    let matched = null;
    for (const l of labelsFor(place)) {
      const s = scoreLabel(q, l.norm) + (l.primary ? 5 : 0);
      if (s > best) {
        best = s;
        matched = l.primary ? null : l.text;
      }
    }
    if (best > 5) results.push({ place, score: best, matched });
  }
  results.sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name));
  return results.slice(0, limit);
}

/** Exact (normalized) match on name or alias, or null. */
export function findExact(places, query) {
  const q = normalize(query);
  if (!q) return null;
  return places.find((p) => labelsFor(p).some((l) => l.norm === q)) || null;
}
