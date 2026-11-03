/**
 * Local-calendar date helpers.
 *
 * Dates that represent a *day* — a delivery date, not an instant — are passed
 * around as 'YYYY-MM-DD' strings. `Date.prototype.toISOString()` is the obvious
 * way to produce one and the wrong one: it converts to UTC first, so for a
 * UTC-6 user every time from 18:00 local onwards reports tomorrow's date. A
 * form would then mark today as already in the past.
 *
 * These read the local calendar fields instead, so "today" is today wherever
 * the visitor is.
 */

/** 'YYYY-MM-DD' for the given date, in the visitor's own timezone. */
export const toLocalIso = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** Parses 'YYYY-MM-DD' as local midnight. `new Date('2026-01-05')` would parse as UTC. */
export const fromLocalIso = (value: string): Date | null => {
  const [year, month, day] = value.split('-').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
};

/** Today's local date as 'YYYY-MM-DD'. */
export const todayLocalIso = (): string => toLocalIso(new Date());
