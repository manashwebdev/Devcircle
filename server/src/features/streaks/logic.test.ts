import { describe, expect, it } from 'vitest';
import { liveStreak, previousDay } from '../../core/day';
import { advance } from './logic';

describe('advance', () => {
  const fresh = { current: 0, longest: 0, lastDay: '' };

  it('starts at 1', () => {
    expect(advance(fresh, '2026-10-30')).toEqual({ current: 1, longest: 1, lastDay: '2026-10-30' });
  });
  it('grows on consecutive days', () => {
    const s = { current: 3, longest: 5, lastDay: '2026-10-29' };
    expect(advance(s, '2026-10-30')).toEqual({ current: 4, longest: 5, lastDay: '2026-10-30' });
  });
  it('resets after a gap but keeps the longest', () => {
    const s = { current: 4, longest: 4, lastDay: '2026-10-27' };
    expect(advance(s, '2026-10-30')).toEqual({ current: 1, longest: 4, lastDay: '2026-10-30' });
  });
  it('ignores the same day twice and older days', () => {
    const s = { current: 2, longest: 2, lastDay: '2026-10-30' };
    expect(advance(s, '2026-10-30')).toBe(s);
    expect(advance(s, '2026-10-20')).toBe(s);
  });
});

describe('liveStreak', () => {
  it('is safe when today is done', () => expect(liveStreak(3, '2026-10-30', '2026-10-30')).toEqual({ current: 3, atRisk: false }));
  it('is at risk when last day was yesterday', () => expect(liveStreak(3, '2026-10-29', '2026-10-30')).toEqual({ current: 3, atRisk: true }));
  it('is broken after a missed day', () => expect(liveStreak(3, '2026-10-27', '2026-10-30')).toEqual({ current: 0, atRisk: false }));
  it('handles month boundaries', () => expect(previousDay('2026-11-01')).toBe('2026-10-31'));
});