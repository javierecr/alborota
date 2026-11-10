/**
 * Fisher-Yates shuffle. Returns a new array — callers often hold a
 * `useAsyncData` payload, which must never be reordered in place.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
}
