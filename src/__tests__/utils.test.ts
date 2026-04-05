import { describe, expect, it } from 'vitest';
import { daysBetween, profileGradient, shortToothLabel } from '../utils';

describe('profileGradient', () => {
  it('returns orange gradient for child type', () => {
    expect(profileGradient('child')).toContain('#ffb24a');
  });

  it('returns blue gradient for teen type', () => {
    expect(profileGradient('teen')).toContain('#5ec2ff');
  });
});

describe('daysBetween', () => {
  it('returns 0 for same date', () => {
    expect(daysBetween('2026-04-01', '2026-04-01')).toBe(0);
  });

  it('returns positive number when dateA is after dateB', () => {
    expect(daysBetween('2026-04-10', '2026-04-01')).toBe(9);
  });

  it('returns negative number when dateA is before dateB', () => {
    expect(daysBetween('2026-04-01', '2026-04-10')).toBe(-9);
  });

  it('returns 1 for consecutive days', () => {
    expect(daysBetween('2026-04-02', '2026-04-01')).toBe(1);
  });
});

describe('shortToothLabel', () => {
  it('abbreviates top teeth correctly', () => {
    expect(shortToothLabel('Top right back')).toBe('T R Back');
  });

  it('abbreviates bottom teeth correctly', () => {
    expect(shortToothLabel('Bottom front left')).toBe('B Front L');
  });

  it('abbreviates middle teeth correctly', () => {
    expect(shortToothLabel('Top left middle')).toBe('T L Mid');
  });
});
