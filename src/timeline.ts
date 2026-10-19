import type { OperaRecord } from './types';

export const ACT_IV = { start: 1895, end: 1945 } as const;

/**
 * Where a record stands at a given year.
 * - Events, facts, governance, people and myth placards are on stage from
 *   start_year to end_year (a null end_year means that one year only).
 * - Infrastructure is "building" from start_year until end_year, then
 *   "built" and stays standing for the rest of the act, like a set piece.
 */
export type Phase = 'hidden' | 'active' | 'building' | 'built';

export function phaseAt(record: OperaRecord, year: number): Phase {
  if (year < record.start_year) return 'hidden';
  const end = record.end_year ?? record.start_year;
  if (record.kind === 'infrastructure') return year < end ? 'building' : 'built';
  return year <= end ? 'active' : 'hidden';
}

export function isDraft(record: OperaRecord): boolean {
  return record.status === 'draft' || record.confidence === 'unverified';
}

/** Distinct start years, used as cue marks on the slider. */
export function cueYears(records: OperaRecord[]): number[] {
  return [...new Set(records.map((r) => r.start_year))]
    .filter((y) => y >= ACT_IV.start && y <= ACT_IV.end)
    .sort((a, b) => a - b);
}
