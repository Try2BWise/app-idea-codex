import type { LocalState, Profile, TabId } from './types';

const today = new Date().toISOString().slice(0, 10);
const defaultTrayChange = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export { today, defaultTrayChange };

const starterProfiles: Profile[] = [
  {
    id: crypto.randomUUID(),
    name: 'Maya',
    type: 'child',
    ageGroup: 'big-kid',
    language: 'en',
    streak: 3,
    lastBrushedOn: null,
    teethLost: ['Top front right'],
    alignerHoursToday: 0,
    alignerGoalHours: 20,
    nextTrayChange: defaultTrayChange,
    notes: '',
    activityLog: [],
  },
  {
    id: crypto.randomUUID(),
    name: 'Leo',
    type: 'teen',
    ageGroup: 'teen',
    language: 'en',
    streak: 5,
    lastBrushedOn: today,
    teethLost: [],
    alignerHoursToday: 16,
    alignerGoalHours: 22,
    nextTrayChange: defaultTrayChange,
    notes: '',
    activityLog: [],
  },
];

export const initialState: LocalState = {
  parentName: 'Parent',
  language: 'en',
  activeProfileId: starterProfiles[0].id,
  hasSeenWelcome: false,
  profiles: starterProfiles,
};

export const topTeeth = [
  'Top right back',
  'Top right middle',
  'Top front right',
  'Top front left',
  'Top left middle',
  'Top left back',
];

export const bottomTeeth = [
  'Bottom left back',
  'Bottom left middle',
  'Bottom front left',
  'Bottom front right',
  'Bottom right middle',
  'Bottom right back',
];

export const crew: Record<TabId, { name: string; title: string; vibe: string; accent: string; badge: string }> = {
  home: {
    name: 'SmileSteps',
    title: 'Your smile squad',
    vibe: 'Guided brushing, tooth tracking, aligner routines, and learning — all in one place.',
    accent: 'crew-home',
    badge: 'SS',
  },
  brushing: {
    name: 'Brush Coach',
    title: 'Guided timer',
    vibe: 'A 2-minute guided brushing routine with quadrant coaching.',
    accent: 'crew-brush',
    badge: 'BC',
  },
  track: {
    name: 'Marshal Floss & Timer T-Pop',
    title: 'Progress tracker',
    vibe: 'Tracks teeth milestones and aligner routines.',
    accent: 'crew-marshal',
    badge: 'TR',
  },
  learn: {
    name: '8-Bit Paste Pals',
    title: 'Reaction team',
    vibe: 'Tiny cheer squad with collectible moods and simple explainers.',
    accent: 'crew-paste',
    badge: '8P',
  },
  parent: {
    name: 'Mission Board',
    title: 'Family control',
    vibe: 'A calmer planning layer for parents and caregivers.',
    accent: 'crew-parent',
    badge: 'MB',
  },
};

export const brushingRewards = ['Champion', 'Superstar', 'Sparkly finish'];
