/**
 * Keep consecutive hero days from repeating the same book+chapter.
 * Psalm 103:5 then Psalm 103:8 reads like yesterday’s verse; this pass
 * only reorders a slice and never changes the verse set.
 */

export function chapterKey(ref) {
  const m = String(ref || '').match(/^(.+?)\s+(\d+):\d+/);
  if (!m) return String(ref || '').replace(/\s+/g, ' ').trim();
  const book = m[1].replace(/\s+/g, ' ').replace(/^Psalms$/i, 'Psalm').trim();
  return book + ' ' + m[2];
}

/**
 * Reorder arr[fromIndex, endExclusive) so no item shares a chapter with
 * the previous day. Items before fromIndex stay put. Same refs, new order.
 */
export function breakAdjacentSameChapter(arr, fromIndex = 0, endExclusive) {
  if (!Array.isArray(arr) || !arr.length) return arr ? arr.slice() : [];
  const start = Math.max(0, Number(fromIndex) || 0);
  const end = endExclusive == null ? arr.length : Math.min(arr.length, Number(endExclusive));
  if (start >= end) return arr.slice();
  const frozen = arr.slice(0, start);
  const remaining = arr.slice(start, end);
  const tail = arr.slice(end);
  const out = frozen.slice();
  while (remaining.length) {
    const prevKey = out.length ? chapterKey(out[out.length - 1].ref) : '';
    let pick = remaining.findIndex((v) => chapterKey(v.ref) !== prevKey);
    if (pick < 0) pick = 0;
    out.push(remaining.splice(pick, 1)[0]);
  }
  return out.concat(tail);
}

/** Pairs at or after fromIndex whose chapter matches the previous day. */
export function adjacentSameChapterPairs(arr, fromIndex = 0) {
  const pairs = [];
  const start = Math.max(1, Number(fromIndex) || 0);
  for (let i = start; i < arr.length; i += 1) {
    const a = arr[i - 1] && arr[i - 1].ref;
    const b = arr[i] && arr[i].ref;
    if (!a || !b) continue;
    if (chapterKey(a) === chapterKey(b)) {
      pairs.push({ index: i - 1, prev: a, next: b });
    }
  }
  return pairs;
}
