import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../hooks/useAppState';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  randomUUID: () => `test-uuid-${++uuidCounter}`,
});

describe('useAppState', () => {
  beforeEach(() => {
    localStorageMock.clear();
    uuidCounter = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with starter profiles', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.profiles).toHaveLength(2);
    expect(result.current.state.profiles[0].name).toBe('Maya');
    expect(result.current.state.profiles[1].name).toBe('Leo');
  });

  it('sets first profile as active by default', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.activeProfile?.name).toBe('Maya');
  });

  describe('markBrushed', () => {
    it('increments streak when not already brushed today', () => {
      const { result } = renderHook(() => useAppState());
      const initialStreak = result.current.activeProfile!.streak;

      act(() => {
        result.current.markBrushed();
      });

      expect(result.current.activeProfile!.streak).toBe(initialStreak + 1);
    });

    it('does NOT double-increment streak when already brushed today', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.markBrushed();
      });

      const streakAfterFirst = result.current.activeProfile!.streak;

      act(() => {
        result.current.markBrushed();
      });

      expect(result.current.activeProfile!.streak).toBe(streakAfterFirst);
    });

    it('sets lastBrushedOn to today', () => {
      const { result } = renderHook(() => useAppState());
      const today = new Date().toISOString().slice(0, 10);

      act(() => {
        result.current.markBrushed();
      });

      expect(result.current.activeProfile!.lastBrushedOn).toBe(today);
    });

    it('adds a brush activity entry', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.markBrushed();
      });

      const log = result.current.activeProfile!.activityLog;
      expect(log.length).toBeGreaterThan(0);
      expect(log[0].kind).toBe('brush');
      expect(log[0].title).toBe('Brushing session complete');
    });
  });

  describe('toggleTooth', () => {
    it('adds a tooth to teethLost when not present', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.toggleTooth('Bottom front left');
      });

      expect(result.current.activeProfile!.teethLost).toContain('Bottom front left');
    });

    it('removes a tooth from teethLost when already present', () => {
      const { result } = renderHook(() => useAppState());
      // Maya starts with 'Top front right'
      expect(result.current.activeProfile!.teethLost).toContain('Top front right');

      act(() => {
        result.current.toggleTooth('Top front right');
      });

      expect(result.current.activeProfile!.teethLost).not.toContain('Top front right');
    });

    it('logs a tooth activity entry', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.toggleTooth('Top left back');
      });

      const log = result.current.activeProfile!.activityLog;
      expect(log[0].kind).toBe('tooth');
      expect(log[0].detail).toBe('Top left back');
    });
  });

  describe('createProfile', () => {
    it('adds a new profile and switches to it', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setProfileName('Aria');
        result.current.setProfileType('child');
        result.current.setAgeGroup('little-kid');
      });

      act(() => {
        result.current.createProfile();
      });

      expect(result.current.state.profiles).toHaveLength(3);
      expect(result.current.activeProfile!.name).toBe('Aria');
      expect(result.current.activeProfile!.ageGroup).toBe('little-kid');
    });

    it('does not create a profile with empty name', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setProfileName('   ');
      });

      act(() => {
        result.current.createProfile();
      });

      expect(result.current.state.profiles).toHaveLength(2);
    });

    it('resets form state after creation', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setProfileName('Zane');
        result.current.setProfileType('teen');
        result.current.setAgeGroup('teen');
      });

      act(() => {
        result.current.createProfile();
      });

      expect(result.current.profileName).toBe('');
      expect(result.current.profileType).toBe('child');
      expect(result.current.showProfileForm).toBe(false);
    });

    it('sets aligner defaults for teen profiles', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setProfileName('Zane');
        result.current.setProfileType('teen');
      });

      act(() => {
        result.current.createProfile();
      });

      expect(result.current.activeProfile!.alignerHoursToday).toBe(18);
      expect(result.current.activeProfile!.alignerGoalHours).toBe(22);
    });
  });

  describe('aligner hours', () => {
    it('increments aligner hours via updateProfile', () => {
      const { result } = renderHook(() => useAppState());
      // Switch to Leo (teen profile)
      act(() => {
        result.current.setState((current) => ({
          ...current,
          activeProfileId: current.profiles[1].id,
        }));
      });

      const initialHours = result.current.activeProfile!.alignerHoursToday;

      act(() => {
        result.current.updateProfile(result.current.activeProfile!.id, (profile) => ({
          ...profile,
          alignerHoursToday: Math.min(profile.alignerGoalHours, profile.alignerHoursToday + 1),
        }));
      });

      expect(result.current.activeProfile!.alignerHoursToday).toBe(initialHours + 1);
    });

    it('does not exceed goal hours', () => {
      const { result } = renderHook(() => useAppState());
      // Switch to Leo
      act(() => {
        result.current.setState((current) => ({
          ...current,
          activeProfileId: current.profiles[1].id,
        }));
      });

      // Set hours to goal
      act(() => {
        result.current.updateProfile(result.current.activeProfile!.id, (profile) => ({
          ...profile,
          alignerHoursToday: profile.alignerGoalHours,
        }));
      });

      // Try to go over
      act(() => {
        result.current.updateProfile(result.current.activeProfile!.id, (profile) => ({
          ...profile,
          alignerHoursToday: Math.min(profile.alignerGoalHours, profile.alignerHoursToday + 1),
        }));
      });

      expect(result.current.activeProfile!.alignerHoursToday).toBe(
        result.current.activeProfile!.alignerGoalHours,
      );
    });

    it('does not go below zero', () => {
      const { result } = renderHook(() => useAppState());

      // Set hours to 0
      act(() => {
        result.current.updateProfile(result.current.activeProfile!.id, (profile) => ({
          ...profile,
          alignerHoursToday: 0,
        }));
      });

      act(() => {
        result.current.updateProfile(result.current.activeProfile!.id, (profile) => ({
          ...profile,
          alignerHoursToday: Math.max(0, profile.alignerHoursToday - 1),
        }));
      });

      expect(result.current.activeProfile!.alignerHoursToday).toBe(0);
    });
  });

  describe('activity log', () => {
    it('caps activity log at 12 entries', () => {
      const { result } = renderHook(() => useAppState());

      for (let i = 0; i < 15; i++) {
        act(() => {
          result.current.toggleTooth(`Tooth ${i}`);
        });
      }

      expect(result.current.activeProfile!.activityLog.length).toBeLessThanOrEqual(12);
    });
  });

  describe('derived values', () => {
    it('computes alignerProgress correctly', () => {
      const { result } = renderHook(() => useAppState());
      // Switch to Leo (16/22 hours)
      act(() => {
        result.current.setState((current) => ({
          ...current,
          activeProfileId: current.profiles[1].id,
        }));
      });

      expect(result.current.alignerProgress).toBe(Math.min(100, Math.round((16 / 22) * 100)));
    });

    it('starts with brushing timer at 120 seconds', () => {
      const { result } = renderHook(() => useAppState());
      expect(result.current.secondsLeft).toBe(120);
      expect(result.current.elapsed).toBe(0);
      expect(result.current.captainMode).toBe('ready');
    });
  });

  describe('persistence', () => {
    it('saves state to localStorage on change', () => {
      renderHook(() => useAppState());

      const stored = localStorageMock.getItem('smilesteps-poc-state');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.profiles).toHaveLength(2);
    });

    it('restores state from localStorage', () => {
      const customState = {
        parentName: 'CustomParent',
        language: 'en',
        activeProfileId: 'custom-id',
        hasSeenWelcome: true,
        profiles: [
          {
            id: 'custom-id',
            name: 'TestChild',
            type: 'child',
            ageGroup: 'big-kid',
            language: 'en',
            streak: 10,
            lastBrushedOn: null,
            teethLost: [],
            alignerHoursToday: 0,
            alignerGoalHours: 0,
            nextTrayChange: '2026-04-10',
            notes: '',
            activityLog: [],
          },
        ],
      };
      localStorageMock.setItem('smilesteps-poc-state', JSON.stringify(customState));

      const { result } = renderHook(() => useAppState());
      expect(result.current.activeProfile!.name).toBe('TestChild');
      expect(result.current.activeProfile!.streak).toBe(10);
      expect(result.current.showWelcome).toBe(false);
    });
  });
});
