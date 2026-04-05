import { useEffect, useMemo, useState } from 'react';
import { copyByLanguage } from '../content';
import { defaultTrayChange, initialState, today } from '../constants';
import { loadState, saveState } from '../storage';
import { daysBetween } from '../utils';
import type { ActivityEntry, ChildAgeGroup, Language, LocalState, Profile, ProfileType, TabId, TrackSubTab } from '../types';

export function useAppState() {
  const [state, setState] = useState<LocalState>(() => {
    const saved = loadState();
    if (!saved) {
      return initialState;
    }

    return {
      ...initialState,
      ...saved,
      profiles: saved.profiles.map((profile) => ({
        ...profile,
        activityLog: profile.activityLog ?? [],
      })),
    };
  });
  const [tab, setTab] = useState<TabId>('home');
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !(loadState()?.hasSeenWelcome ?? false));
  const [showIntroDetails, setShowIntroDetails] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('child');
  const [ageGroup, setAgeGroup] = useState<ChildAgeGroup>('big-kid');
  const [profileStep, setProfileStep] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [expandedLearnCard, setExpandedLearnCard] = useState<string | null>(null);
  const [trackSubTab, setTrackSubTab] = useState<TrackSubTab>('teeth');

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          markBrushed();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const activeProfile = useMemo(
    () => state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0],
    [state],
  );

  const appLanguage: Language = activeProfile?.language ?? state.language;
  const copy = copyByLanguage[appLanguage];

  function updateProfile(profileId: string, updater: (profile: Profile) => Profile) {
    setState((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => (profile.id === profileId ? updater(profile) : profile)),
    }));
  }

  function addActivity(profileId: string, entry: Omit<ActivityEntry, 'id' | 'date'>) {
    updateProfile(profileId, (profile) => ({
      ...profile,
      activityLog: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          ...entry,
        },
        ...profile.activityLog,
      ].slice(0, 12),
    }));
  }

  function markBrushed() {
    if (!activeProfile) {
      return;
    }

    updateProfile(activeProfile.id, (profile) => ({
      ...profile,
      lastBrushedOn: today,
      streak: profile.lastBrushedOn === today ? profile.streak : profile.streak + 1,
    }));
    addActivity(activeProfile.id, {
      kind: 'brush',
      title: 'Brushing session complete',
      detail: 'Finished a full 2-minute routine.',
    });
  }

  function toggleTooth(label: string) {
    if (!activeProfile) {
      return;
    }

    updateProfile(activeProfile.id, (profile) => {
      const exists = profile.teethLost.includes(label);
      return {
        ...profile,
        teethLost: exists ? profile.teethLost.filter((item) => item !== label) : [...profile.teethLost, label],
      };
    });
    addActivity(activeProfile.id, {
      kind: 'tooth',
      title: 'Tooth milestone updated',
      detail: label,
    });
  }

  function createProfile() {
    const trimmedName = profileName.trim();
    if (!trimmedName) {
      return;
    }

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: trimmedName,
      type: profileType,
      ageGroup,
      language: state.language,
      streak: 0,
      lastBrushedOn: null,
      teethLost: [],
      alignerHoursToday: profileType === 'teen' ? 18 : 0,
      alignerGoalHours: profileType === 'teen' ? 22 : 0,
      nextTrayChange: defaultTrayChange,
      notes: '',
      activityLog: [],
    };

    setState((current) => ({
      ...current,
      activeProfileId: newProfile.id,
      profiles: [...current.profiles, newProfile],
    }));
    setProfileName('');
    setProfileType('child');
    setAgeGroup('big-kid');
    setProfileStep(0);
    setShowProfileForm(false);
  }

  function saveNotes(notes: string) {
    if (!activeProfile) {
      return;
    }

    updateProfile(activeProfile.id, (profile) => ({ ...profile, notes }));
    setSaveMessage(copy.parent.saveNotes);
    window.setTimeout(() => setSaveMessage(''), 2000);
  }

  // Derived values
  const elapsed = 120 - secondsLeft;
  const encouragementIndex = Math.min(
    copy.brushing.encouragement.length - 1,
    Math.floor((elapsed / 120) * copy.brushing.encouragement.length),
  );
  const encouragement = copy.brushing.encouragement[encouragementIndex];
  const activeQuadrantIndex = Math.min(3, Math.floor(elapsed / 30));
  const brushingProgress = (elapsed / 120) * 100;
  const alignerProgress = activeProfile && activeProfile.alignerGoalHours > 0
    ? Math.min(100, Math.round((activeProfile.alignerHoursToday / activeProfile.alignerGoalHours) * 100))
    : 0;
  const daysUntilTrayChange = activeProfile ? daysBetween(activeProfile.nextTrayChange, today) : 0;
  const orthoState =
    alignerProgress >= 90 ? copy.ortho.progressStates.strong :
    alignerProgress >= 60 ? copy.ortho.progressStates.steady :
    copy.ortho.progressStates.needsCare;
  const nextTrayChangeLabel =
    daysUntilTrayChange < 0 ? copy.ortho.nextChangeLabels.overdue :
    daysUntilTrayChange === 0 ? copy.ortho.nextChangeLabels.today :
    daysUntilTrayChange === 1 ? copy.ortho.nextChangeLabels.tomorrow :
    `${copy.ortho.nextChangeLabels.inDaysPrefix}: ${daysUntilTrayChange}`;
  const learnSections = activeProfile
    ? copy.learn.sections.filter((section) => section.ageGroups.includes(activeProfile.ageGroup))
    : [];
  const recentActivity = activeProfile ? activeProfile.activityLog.slice(0, 4) : [];
  const orthoActivity = activeProfile
    ? activeProfile.activityLog.filter((entry) => entry.kind === 'aligner' || entry.kind === 'tray-change').slice(0, 4)
    : [];

  const coachMode =
    secondsLeft === 0 ? 'victory' as const :
    isRunning ? 'active' as const :
    secondsLeft < 120 ? 'paused' as const :
    'ready' as const;

  const coachHeadline =
    coachMode === 'victory' ? 'Mission complete' :
    coachMode === 'active' ? `Now brushing ${copy.brushing.quadrants[activeQuadrantIndex]}` :
    coachMode === 'paused' ? 'Paused' :
    'Ready';

  const coachSubline =
    coachMode === 'victory'
      ? copy.brushing.helperFinished
      : coachMode === 'active'
        ? `${copy.brushing.helperPrefix} ${copy.brushing.quadrants[activeQuadrantIndex].toLowerCase()} ${copy.brushing.helperSuffix}`
        : coachMode === 'paused'
          ? 'Timer paused. Jump back in when you are ready.'
          : 'The coach will guide one section at a time with quick cues.';

  const coachStatusPills = [
    copy.brushing.quadrants[activeQuadrantIndex],
    secondsLeft === 0 ? '100% complete' : `${Math.round(brushingProgress)}% complete`,
    coachMode === 'active' ? 'Coaching' : coachMode === 'victory' ? 'Done' : 'Ready',
  ];

  const homeSummary = activeProfile
    ? (activeProfile.lastBrushedOn === today
      ? `${activeProfile.name} already brushed today. Great job!`
      : `Ready for ${activeProfile.name}\u2019s next brushing session.`)
    : '';

  const homePills = activeProfile
    ? [
      activeProfile.lastBrushedOn === today ? 'Brushed today' : '2-min session ready',
      activeProfile.type === 'teen' ? `${alignerProgress}% aligner goal` : `${activeProfile.teethLost.length} milestones`,
      `${activeProfile.streak}-day streak`,
    ]
    : [];

  const dailyTasks = activeProfile
    ? [
      {
        id: 'brush',
        title: copy.brushing.start,
        body: activeProfile.lastBrushedOn === today ? 'Already completed today.' : 'Knock out today\u2019s 2-minute brushing routine.',
        completed: activeProfile.lastBrushedOn === today,
        action: () => setTab('brushing'),
      },
      {
        id: activeProfile.type === 'teen' ? 'ortho' : 'teeth',
        title: copy.tabs.track,
        body:
          activeProfile.type === 'teen'
            ? `${alignerProgress}% of today\u2019s aligner goal tracked.`
            : `${activeProfile.teethLost.length} tooth milestones logged so far.`,
        completed: activeProfile.type === 'teen' ? alignerProgress >= 100 : activeProfile.teethLost.length > 0,
        action: () => {
          setTab('track');
          setTrackSubTab(activeProfile.type === 'teen' ? 'ortho' : 'teeth');
        },
      },
      {
        id: 'learn',
        title: copy.tabs.learn,
        body: `Explore ${learnSections[0]?.title?.toLowerCase() ?? 'today\u2019s'} learning cards.`,
        completed: recentActivity.some((entry) => entry.kind === 'brush' || entry.kind === 'tooth' || entry.kind === 'aligner'),
        action: () => setTab('learn'),
      },
    ]
    : [];

  const visibleTasks = showCompletedTasks ? dailyTasks : dailyTasks.filter((task) => !task.completed);

  function jumpFromStep(step: string) {
    const lower = step.toLowerCase();
    if (lower.includes('brush') || lower.includes('cepill')) setTab('brushing');
    else if (lower.includes('tooth') || lower.includes('diente')) { setTab('track'); setTrackSubTab('teeth'); }
    else if (lower.includes('aligner') || lower.includes('alineador')) { setTab('track'); setTrackSubTab('ortho'); }
    else if (lower.includes('learn') || lower.includes('aprende')) setTab('learn');
  }

  return {
    // Core state
    state,
    setState,
    tab,
    setTab,
    activeProfile,
    copy,
    appLanguage,

    // Timer state
    secondsLeft,
    setSecondsLeft,
    isRunning,
    setIsRunning,
    elapsed,
    encouragement,
    activeQuadrantIndex,
    brushingProgress,
    coachMode,
    coachHeadline,
    coachSubline,
    coachStatusPills,

    // Profile form state
    showProfileForm,
    setShowProfileForm,
    profileName,
    setProfileName,
    profileType,
    setProfileType,
    ageGroup,
    setAgeGroup,
    profileStep,
    setProfileStep,

    // UI state
    showWelcome,
    setShowWelcome,
    showIntroDetails,
    setShowIntroDetails,
    saveMessage,
    showCompletedTasks,
    setShowCompletedTasks,
    expandedLearnCard,
    setExpandedLearnCard,
    trackSubTab,
    setTrackSubTab,

    // Derived values
    alignerProgress,
    daysUntilTrayChange,
    orthoState,
    nextTrayChangeLabel,
    learnSections,
    recentActivity,
    orthoActivity,
    homeSummary,
    homePills,
    dailyTasks,
    visibleTasks,

    // Actions
    updateProfile,
    addActivity,
    markBrushed,
    toggleTooth,
    createProfile,
    saveNotes,
    jumpFromStep,
  };
}

export type AppState = ReturnType<typeof useAppState>;
