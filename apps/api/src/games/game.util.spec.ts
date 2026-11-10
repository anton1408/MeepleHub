import { describe, expect, it } from 'vitest';
import { isGameCacheFresh } from './game.util.js';

describe('GamesUtils', () => {
  const daysAgo = (days: number) => new Date(NOW.getTime() - days * DAY_MS);

  const NOW = new Date('2026-10-01T12:00:00.000Z');
  const TTL_DAYS = 30;
  const DAY_MS = 24 * 60 * 60 * 1000;

  // isGameCacheFresh
  it('returns true when the cache age is below the TTL', () => {
    expect(isGameCacheFresh(NOW, daysAgo(29), TTL_DAYS)).toBe(true);
  });
  it('returns false when the cache age equals the TTL', () => {
    expect(isGameCacheFresh(NOW, daysAgo(30), TTL_DAYS)).toBe(false);
  });
  it('returns false when the cache age exceeds the TTL', () => {
    expect(isGameCacheFresh(NOW, daysAgo(31), TTL_DAYS)).toBe(false);
  });
  it('returns false when the sync date is null', () => {
    expect(isGameCacheFresh(NOW, null, TTL_DAYS)).toBe(false);
  });
});
