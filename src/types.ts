export type Language = 'en' | 'es';

export type ChildAgeGroup = 'little-kid' | 'big-kid' | 'teen';

export type ProfileType = 'child' | 'teen';

export type TabId = 'home' | 'brushing' | 'teeth' | 'ortho' | 'learn' | 'parent';

export interface Profile {
  id: string;
  name: string;
  type: ProfileType;
  ageGroup: ChildAgeGroup;
  language: Language;
  streak: number;
  lastBrushedOn: string | null;
  teethLost: string[];
  alignerHoursToday: number;
  alignerGoalHours: number;
  nextTrayChange: string;
  notes: string;
}

export interface LocalState {
  parentName: string;
  language: Language;
  activeProfileId: string;
  hasSeenWelcome: boolean;
  profiles: Profile[];
}

export interface Copy {
  appName: string;
  tagline: string;
  heroTitle: string;
  heroBody: string;
  createProfile: string;
  languageLabel: string;
  parentView: string;
  childView: string;
  tabs: Record<TabId, string>;
  home: {
    welcome: string;
    dailyPlan: string;
    startHereTitle: string;
    startHereBody: string;
    nextSteps: string[];
    onboardingTitle: string;
    onboardingBody: string;
    onboardingPoints: string[];
    onboardingButton: string;
    timerCard: string;
    toothCard: string;
    orthoCard: string;
    learnCard: string;
  };
  brushing: {
    title: string;
    body: string;
    start: string;
    reset: string;
    pause: string;
    resume: string;
    finished: string;
    encouragement: string[];
    quadrants: string[];
    helperFinished: string;
    helperPrefix: string;
    helperSuffix: string;
  };
  teeth: {
    title: string;
    body: string;
    hint: string;
    labels: string[];
  };
  ortho: {
    title: string;
    body: string;
    goal: string;
    nextChange: string;
    progressTitle: string;
    progressStates: {
      strong: string;
      steady: string;
      needsCare: string;
    };
    nextChangeLabels: {
      today: string;
      tomorrow: string;
      inDaysPrefix: string;
      overdue: string;
    };
    remindersTitle: string;
    reminders: string[];
    comfortTitle: string;
    comfortTips: string[];
    addHour: string;
    subtractHour: string;
  };
  learn: {
    title: string;
    body: string;
    sections: {
      id: string;
      title: string;
      body: string;
      ageGroups: ChildAgeGroup[];
      cards: { title: string; body: string; tag: string; art: string }[];
    }[];
  };
  parent: {
    title: string;
    body: string;
    notesLabel: string;
    saveNotes: string;
    profilesTitle: string;
    addProfile: string;
  };
  profileForm: {
    title: string;
    name: string;
    type: string;
    ageGroup: string;
    ageGroupHelp: string;
    save: string;
    previewTitle: string;
    child: string;
    teen: string;
    littleKid: string;
    bigKid: string;
    teenager: string;
    childDescription: string;
    teenDescription: string;
  };
}
