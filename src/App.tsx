import { useEffect, useMemo, useState } from 'react';
import { copyByLanguage } from './content';
import { loadState, saveState } from './storage';
import type { ActivityEntry, ChildAgeGroup, Language, LocalState, Profile, ProfileType, TabId } from './types';

const today = new Date().toISOString().slice(0, 10);
const defaultTrayChange = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

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

const initialState: LocalState = {
  parentName: 'Parent',
  language: 'en',
  activeProfileId: starterProfiles[0].id,
  hasSeenWelcome: false,
  profiles: starterProfiles,
};

const topTeeth = ['Top right back', 'Top right middle', 'Top front right', 'Top front left', 'Top left middle', 'Top left back'];
const bottomTeeth = ['Bottom left back', 'Bottom left middle', 'Bottom front left', 'Bottom front right', 'Bottom right middle', 'Bottom right back'];

const crew = {
  home: {
    name: 'SmileSteps Crew',
    title: 'Your smile squad',
    vibe: 'Captain Brush leads the team, Timer T-Pop keeps the beat, Marshal Floss tracks the trail, and the Paste Pals cheer every win.',
    accent: 'crew-captain',
    badge: 'SC',
  },
  brushing: {
    name: 'Captain Brush',
    title: 'Hero coach',
    vibe: 'Fast, bright, and encouraging. Great for getting a brushing mission started.',
    accent: 'crew-captain',
    badge: 'CB',
  },
  teeth: {
    name: 'Marshal Floss',
    title: 'Trail tracker',
    vibe: 'Keeps track of milestones and helps families notice smile changes over time.',
    accent: 'crew-marshal',
    badge: 'MF',
  },
  ortho: {
    name: 'Timer T-Pop',
    title: 'Rhythm guide',
    vibe: 'Handles timing, progress, and “stay on track” energy for aligner routines.',
    accent: 'crew-timer',
    badge: 'TP',
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
} as const;

const assetBase = import.meta.env.BASE_URL;

const captainBrushAssets = {
  hero: `${assetBase}characters/captain-brush-hero.png`,
  coach: `${assetBase}characters/captain-brush-coach.png`,
  win: `${assetBase}characters/captain-brush-win.png`,
} as const;

function profileGradient(type: ProfileType): string {
  return type === 'teen'
    ? 'linear-gradient(135deg, #5ec2ff 0%, #2c77f4 100%)'
    : 'linear-gradient(135deg, #ffb24a 0%, #ff6f61 100%)';
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export function App() {
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

  if (!activeProfile) {
    return null;
  }

  const elapsed = 120 - secondsLeft;
  const encouragementIndex = Math.min(
    copy.brushing.encouragement.length - 1,
    Math.floor((elapsed / 120) * copy.brushing.encouragement.length),
  );
  const encouragement = copy.brushing.encouragement[encouragementIndex];
  const activeQuadrantIndex = Math.min(3, Math.floor(elapsed / 30));
  const brushingProgress = (elapsed / 120) * 100;
  const alignerProgress = activeProfile.alignerGoalHours > 0
    ? Math.min(100, Math.round((activeProfile.alignerHoursToday / activeProfile.alignerGoalHours) * 100))
    : 0;
  const daysUntilTrayChange = daysBetween(activeProfile.nextTrayChange, today);
  const orthoState =
    alignerProgress >= 90 ? copy.ortho.progressStates.strong :
    alignerProgress >= 60 ? copy.ortho.progressStates.steady :
    copy.ortho.progressStates.needsCare;
  const nextTrayChangeLabel =
    daysUntilTrayChange < 0 ? copy.ortho.nextChangeLabels.overdue :
    daysUntilTrayChange === 0 ? copy.ortho.nextChangeLabels.today :
    daysUntilTrayChange === 1 ? copy.ortho.nextChangeLabels.tomorrow :
    `${copy.ortho.nextChangeLabels.inDaysPrefix}: ${daysUntilTrayChange}`;
  const learnSections = copy.learn.sections.filter((section) => section.ageGroups.includes(activeProfile.ageGroup));
  const recentActivity = activeProfile.activityLog.slice(0, 4);
  const orthoActivity = activeProfile.activityLog.filter((entry) => entry.kind === 'aligner' || entry.kind === 'tray-change').slice(0, 4);
  const currentGuide = crew[tab];
  const crewCards = [
    { id: 'brushing', ...crew.brushing, action: () => setTab('brushing') },
    { id: 'teeth', ...crew.teeth, action: () => setTab('teeth') },
    { id: 'ortho', ...crew.ortho, action: () => setTab('ortho') },
    { id: 'learn', ...crew.learn, action: () => setTab('learn') },
  ] as const;
  const brushingRewards = ['Champion', 'Superstar', 'Sparkly finish'];
  const captainHomeLine =
    activeProfile.lastBrushedOn === today
      ? `Captain Brush says ${activeProfile.name} is already glowing today.`
      : `Captain Brush is ready to coach ${activeProfile.name}'s next smile mission.`;
  const captainMissionPills = [
    activeProfile.lastBrushedOn === today ? 'Brush mission complete' : '2-minute mission ready',
    activeProfile.type === 'teen' ? `${alignerProgress}% ortho rhythm` : `${activeProfile.teethLost.length} smile milestones`,
    `${activeProfile.streak} day streak`,
  ];
  const captainMode =
    secondsLeft === 0 ? 'victory' :
    isRunning ? 'active' :
    secondsLeft < 120 ? 'paused' :
    'ready';
  const captainHeadline =
    captainMode === 'victory' ? 'Mission complete' :
    captainMode === 'active' ? `Now brushing ${copy.brushing.quadrants[activeQuadrantIndex]}` :
    captainMode === 'paused' ? 'Mission paused' :
    'Mission ready';
  const captainSubline =
    captainMode === 'victory'
      ? copy.brushing.helperFinished
      : captainMode === 'active'
        ? `${copy.brushing.helperPrefix} ${copy.brushing.quadrants[activeQuadrantIndex].toLowerCase()} ${copy.brushing.helperSuffix}`
        : captainMode === 'paused'
          ? 'Captain Brush is holding your place. Jump back in when you are ready.'
          : 'Captain Brush will guide one section at a time with quick, upbeat cues.';
  const captainStatusPills = [
    copy.brushing.quadrants[activeQuadrantIndex],
    secondsLeft === 0 ? '100% complete' : `${Math.round(brushingProgress)}% complete`,
    captainMode === 'active' ? 'Coach mode live' : captainMode === 'victory' ? 'Victory mode' : 'Ready for launch',
  ];
  const dailyTasks = [
    {
      id: 'brush',
      title: copy.brushing.start,
      body: activeProfile.lastBrushedOn === today ? 'Already completed today.' : 'Knock out today’s 2-minute brushing routine.',
      completed: activeProfile.lastBrushedOn === today,
      action: () => setTab('brushing'),
    },
    {
      id: activeProfile.type === 'teen' ? 'ortho' : 'teeth',
      title: activeProfile.type === 'teen' ? copy.tabs.ortho : copy.tabs.teeth,
      body:
        activeProfile.type === 'teen'
          ? `${alignerProgress}% of today’s aligner goal tracked.`
          : `${activeProfile.teethLost.length} tooth milestones logged so far.`,
      completed: activeProfile.type === 'teen' ? alignerProgress >= 100 : activeProfile.teethLost.length > 0,
      action: () => setTab(activeProfile.type === 'teen' ? 'ortho' : 'teeth'),
    },
    {
      id: 'learn',
      title: copy.tabs.learn,
      body: `Explore ${learnSections[0]?.title?.toLowerCase() ?? 'today’s'} learning cards.`,
      completed: recentActivity.some((entry) => entry.kind === 'brush' || entry.kind === 'tooth' || entry.kind === 'aligner'),
      action: () => setTab('learn'),
    },
  ];
  const visibleTasks = showCompletedTasks ? dailyTasks : dailyTasks.filter((task) => !task.completed);

  function shortToothLabel(label: string) {
    return label
      .replace('Top ', 'T ')
      .replace('Bottom ', 'B ')
      .replace('right', 'R')
      .replace('left', 'L')
      .replace('middle', 'Mid')
      .replace('front', 'Front')
      .replace('back', 'Back');
  }

  function jumpFromStep(step: string) {
    const lower = step.toLowerCase();
    if (lower.includes('brush') || lower.includes('cepill')) setTab('brushing');
    else if (lower.includes('tooth') || lower.includes('diente')) setTab('teeth');
    else if (lower.includes('aligner') || lower.includes('alineador')) setTab('ortho');
    else if (lower.includes('learn') || lower.includes('aprende')) setTab('learn');
  }

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="app-bar">
          <div className="app-bar-copy">
            <p className="eyebrow">{copy.appName}</p>
            <strong>{activeProfile.name}</strong>
            <small className="app-bar-subtitle">{currentGuide.name} on deck</small>
          </div>
          <div className="hero-controls">
            <label className="stacked-label">
              <span>{copy.languageLabel}</span>
              <select
                value={state.language}
                onChange={(event) => setState((current) => ({ ...current, language: event.target.value as Language }))}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            <button className="soft-button" onClick={() => setShowProfileForm(true)}>
              {copy.createProfile}
            </button>
          </div>
        </header>

        <section className="profile-strip">
          {state.profiles.map((profile) => (
            <button
              key={profile.id}
              className={`profile-chip ${profile.id === activeProfile.id ? 'active' : ''}`}
              onClick={() => setState((current) => ({ ...current, activeProfileId: profile.id }))}
              style={{ backgroundImage: profileGradient(profile.type) }}
            >
              <span>{profile.name}</span>
              <small>{profile.type === 'teen' ? 'Teen ortho' : 'Kid smile'}</small>
            </button>
          ))}
        </section>

        <main className="content-grid">
          {tab === 'home' && (
            <>
              <section className={`panel spotlight character-stage ${crew.home.accent}`}>
                <div className="character-stage-layout">
                  <div className="character-stage-copy">
                    <div className="character-stage-top">
                      <div className="crew-medallion">SC</div>
                      <div>
                        <p className="eyebrow">{copy.tagline}</p>
                        <h2>{copy.home.welcome} {activeProfile.name}</h2>
                      </div>
                    </div>
                    <div className="captain-bubble captain-home-bubble">
                      <strong>Captain Brush</strong>
                      <p>{captainHomeLine}</p>
                    </div>
                  </div>
                  <div className="captain-stage-art">
                    <div className="captain-stage-glow" aria-hidden="true" />
                    <img className="feature-character art-captain" src={captainBrushAssets.hero} alt="Captain Brush" />
                  </div>
                </div>
                <div className="captain-mission-strip" aria-label="Mission status">
                  {captainMissionPills.map((pill) => (
                    <span key={pill} className="mission-pill">
                      {pill}
                    </span>
                  ))}
                </div>
                <p>{copy.home.dailyPlan}</p>
                <button className="link-button" onClick={() => setShowIntroDetails((current) => !current)}>
                  {showIntroDetails ? 'Hide details' : 'About this demo'}
                </button>
                {showIntroDetails ? (
                  <div className="intro-details">
                    <strong>{copy.heroTitle}</strong>
                    <p>{copy.heroBody}</p>
                  </div>
                ) : null}
                <div className="stat-row">
                  <div className="stat-card">
                    <strong>{activeProfile.streak}</strong>
                    <span>streak days</span>
                  </div>
                  <div className="stat-card">
                    <strong>{activeProfile.teethLost.length}</strong>
                    <span>tooth notes</span>
                  </div>
                  <div className="stat-card">
                    <strong>{activeProfile.alignerHoursToday}</strong>
                    <span>ortho hours</span>
                  </div>
                </div>
                <div className="hero-action-row">
                  <button className="primary-button" onClick={() => setTab('brushing')}>
                    {copy.brushing.start}
                  </button>
                  <button className="soft-button" onClick={() => setTab('learn')}>
                    {copy.tabs.learn}
                  </button>
                </div>
              </section>

              <section className="panel crew-roster">
                <div className="section-heading compact-heading">
                  <div>
                    <p className="eyebrow">{crew.home.title}</p>
                    <h2>Meet the guides</h2>
                  </div>
                </div>
                <div className="crew-grid">
                  {crewCards.map((member) => (
                    <button key={member.id} className={`crew-card ${member.accent}`} onClick={member.action}>
                      {member.id === 'brushing' ? (
                        <img className="crew-card-art" src={captainBrushAssets.hero} alt="Captain Brush" />
                      ) : (
                        <div className="crew-badge">{member.badge}</div>
                      )}
                      <strong>{member.name}</strong>
                      <span>{member.title}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel start-panel">
                <div className="section-heading compact-heading">
                  <div>
                    <p className="eyebrow">{copy.home.tasksTitle}</p>
                    <h2>{activeProfile.name}&apos;s plan for today</h2>
                  </div>
                  <button className="link-button" onClick={() => setShowCompletedTasks((current) => !current)}>
                    {showCompletedTasks ? 'Hide done' : 'Show all'}
                  </button>
                </div>
                <div className="task-list">
                  {visibleTasks.map((task) => (
                    <button key={task.id} className={`task-card ${task.completed ? 'task-complete' : ''}`} onClick={task.action}>
                      <strong>{task.title}</strong>
                      <span>{task.body}</span>
                    </button>
                  ))}
                  {visibleTasks.length === 0 ? (
                    <div className="activity-card">
                      <strong>All caught up</strong>
                      <span>Today’s core tasks are done. You can still explore and learn.</span>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="panel start-panel">
                <div className="section-heading compact-heading">
                  <div>
                    <p className="eyebrow">{copy.home.startHereTitle}</p>
                    <h2>{activeProfile.name}'s next steps</h2>
                  </div>
                  <p>{copy.home.startHereBody}</p>
                </div>
                <div className="step-list">
                  {copy.home.nextSteps.map((step) => (
                  <button key={step} className="step-chip" onClick={() => jumpFromStep(step)}>
                    {step}
                  </button>
                ))}
                </div>
              </section>

              <section className="panel start-panel">
                <div className="section-heading compact-heading">
                  <div>
                    <p className="eyebrow">{copy.home.activityTitle}</p>
                    <h2>Latest smile moments</h2>
                  </div>
                </div>
                {recentActivity.length > 0 ? (
                  <div className="activity-list">
                    {recentActivity.map((entry) => (
                      <div key={entry.id} className="activity-card">
                        <strong>{entry.title}</strong>
                        <span>{entry.detail}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="disclaimer">{copy.home.emptyActivity}</p>
                )}
              </section>

              <section className="card-grid">
                <button className="panel tile action-tile" onClick={() => setTab('brushing')}>
                  <p className="tile-guide">{crew.brushing.name}</p>
                  <h3>{copy.tabs.brushing}</h3>
                  <p>{copy.home.timerCard}</p>
                </button>
                <button className="panel tile action-tile" onClick={() => setTab('teeth')}>
                  <p className="tile-guide">{crew.teeth.name}</p>
                  <h3>{copy.tabs.teeth}</h3>
                  <p>{copy.home.toothCard}</p>
                </button>
                <button className="panel tile action-tile" onClick={() => setTab('ortho')}>
                  <p className="tile-guide">{crew.ortho.name}</p>
                  <h3>{copy.tabs.ortho}</h3>
                  <p>{copy.home.orthoCard}</p>
                </button>
                <button className="panel tile action-tile" onClick={() => setTab('learn')}>
                  <p className="tile-guide">{crew.learn.name}</p>
                  <h3>{copy.tabs.learn}</h3>
                  <p>{copy.home.learnCard}</p>
                </button>
              </section>
            </>
          )}

          {tab === 'brushing' && (
            <section className={`panel wide-panel character-panel ${crew.brushing.accent}`}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{crew.brushing.name}</p>
                  <h2>{copy.brushing.title}</h2>
                </div>
                <p>{copy.brushing.body}</p>
              </div>

              <div className="guide-callout">
                <div className={`captain-coach-card captain-${captainMode}`}>
                  <div className="captain-coach-art">
                    <div className="captain-stage-glow small" aria-hidden="true" />
                    <img
                      className="guide-art"
                      src={secondsLeft === 0 ? captainBrushAssets.win : captainBrushAssets.coach}
                      alt="Captain Brush"
                    />
                  </div>
                  <div className="speech-bubble captain-speech">
                    <div className="speech-badge-row">
                      <strong>{crew.brushing.title}</strong>
                      <span className="coach-badge">{captainHeadline}</span>
                    </div>
                    <p>{captainSubline}</p>
                    <div className="captain-status-strip">
                      {captainStatusPills.map((pill) => (
                        <span key={pill} className="captain-status-pill">
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="brushing-progress-panel">
                <div className="progress-ring" style={{ ['--progress' as string]: `${brushingProgress}%` }}>
                  <div className="progress-ring-inner">
                    <span>{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}</span>
                    <small>{copy.brushing.quadrants[activeQuadrantIndex]}</small>
                  </div>
                </div>
                <div className="quadrant-strip">
                  {copy.brushing.quadrants.map((quadrant, index) => (
                    <div
                      key={quadrant}
                      className={`quadrant-chip ${index === activeQuadrantIndex ? 'active' : ''} ${index < activeQuadrantIndex ? 'done' : ''}`}
                    >
                      {quadrant}
                    </div>
                  ))}
                </div>
              </div>

              <div className="timer-layout">
                <div className="timer-controls">
                  <p className="coach-line">{secondsLeft === 0 ? copy.brushing.finished : encouragement}</p>
                  <div className="captain-mini-banner">
                    <span className="captain-mini-mark">CB</span>
                    <p>{captainMode === 'victory' ? `${activeProfile.name} finished strong.` : 'Captain Brush is pacing the mission for you.'}</p>
                  </div>
                  <div className="reward-strip">
                    {brushingRewards.map((reward, index) => (
                      <span key={reward} className={`reward-chip ${elapsed / 30 > index ? 'earned' : ''}`}>
                        {reward}
                      </span>
                    ))}
                  </div>
                  <div className="button-row">
                    <button
                      className="primary-button"
                      onClick={() => setIsRunning((current) => !current)}
                      disabled={secondsLeft === 0}
                    >
                      {isRunning ? copy.brushing.pause : secondsLeft === 120 ? copy.brushing.start : copy.brushing.resume}
                    </button>
                    <button
                      className="soft-button"
                      onClick={() => {
                        setIsRunning(false);
                        setSecondsLeft(120);
                      }}
                    >
                      {copy.brushing.reset}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === 'teeth' && (
            <section className={`panel wide-panel character-panel ${crew.teeth.accent}`}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{crew.teeth.name}</p>
                  <h2>{copy.teeth.title}</h2>
                </div>
                <p>{copy.teeth.body}</p>
              </div>

              <div className="tooth-summary-row">
                <div className="summary-pill">
                  <strong>{activeProfile.teethLost.length}</strong>
                  <span>milestones logged</span>
                </div>
                <div className="summary-pill">
                  <strong>{activeProfile.teethLost.length === 0 ? 'None yet' : 'In progress'}</strong>
                  <span>smile updates</span>
                </div>
              </div>

              <div className="smile-map">
                <div className="arch-section">
                  <span className="arch-label">Top smile</span>
                  <div className="teeth-arch">
                    {topTeeth.map((label) => {
                      const active = activeProfile.teethLost.includes(label);
                      return (
                        <button
                          key={label}
                          className={`tooth-dot ${active ? 'lost' : ''}`}
                          onClick={() => toggleTooth(label)}
                          title={label}
                        >
                          <span>{shortToothLabel(label)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="arch-section">
                  <span className="arch-label">Bottom smile</span>
                  <div className="teeth-arch">
                    {bottomTeeth.map((label) => {
                      const active = activeProfile.teethLost.includes(label);
                      return (
                        <button
                          key={label}
                          className={`tooth-dot ${active ? 'lost' : ''}`}
                          onClick={() => toggleTooth(label)}
                          title={label}
                        >
                          <span>{shortToothLabel(label)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="disclaimer">{copy.teeth.hint}</p>
            </section>
          )}

          {tab === 'ortho' && (
            <section className={`panel wide-panel character-panel ${crew.ortho.accent}`}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{crew.ortho.name}</p>
                  <h2>{copy.ortho.title}</h2>
                </div>
                <p>{copy.ortho.body}</p>
              </div>

              <div className="ortho-status-card">
                <div>
                  <p className="eyebrow">{copy.ortho.progressTitle}</p>
                  <h3>{orthoState}</h3>
                  <p>{nextTrayChangeLabel}</p>
                </div>
                <div className="ortho-progress-bar" aria-hidden="true">
                  <div className="ortho-progress-fill" style={{ width: `${alignerProgress}%` }} />
                </div>
                <strong>{alignerProgress}% of today&apos;s goal</strong>
              </div>

              <div className="ortho-grid">
                <div className="ortho-meter">
                  <span>{activeProfile.alignerHoursToday}h</span>
                  <small>
                    {copy.ortho.goal}: {activeProfile.alignerGoalHours}h
                  </small>
                  <div className="button-row">
                    <button
                      className="primary-button"
                      onClick={() => {
                        updateProfile(activeProfile.id, (profile) => ({
                          ...profile,
                          alignerHoursToday: Math.min(profile.alignerGoalHours, profile.alignerHoursToday + 1),
                        }));
                        addActivity(activeProfile.id, {
                          kind: 'aligner',
                          title: 'Aligner time updated',
                          detail: 'Logged one more hour toward today’s goal.',
                        });
                      }}
                    >
                      {copy.ortho.addHour}
                    </button>
                    <button
                      className="soft-button"
                      onClick={() => {
                        updateProfile(activeProfile.id, (profile) => ({
                          ...profile,
                          alignerHoursToday: Math.max(0, profile.alignerHoursToday - 1),
                        }));
                        addActivity(activeProfile.id, {
                          kind: 'aligner',
                          title: 'Aligner time adjusted',
                          detail: 'Updated today’s wear-time estimate.',
                        });
                      }}
                    >
                      {copy.ortho.subtractHour}
                    </button>
                  </div>
                </div>

                <div className="ortho-panel">
                  <strong>{copy.ortho.nextChange}</strong>
                  <input
                    type="date"
                    value={activeProfile.nextTrayChange}
                    onChange={(event) => {
                      updateProfile(activeProfile.id, (profile) => ({
                        ...profile,
                        nextTrayChange: event.target.value,
                      }));
                      addActivity(activeProfile.id, {
                        kind: 'tray-change',
                        title: 'Tray-change date updated',
                        detail: event.target.value,
                      });
                    }}
                  />
                  <p className="inline-note">{nextTrayChangeLabel}</p>
                </div>

                <div className="ortho-panel">
                  <strong>{copy.ortho.comfortTitle}</strong>
                  <ul>
                    {copy.ortho.comfortTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="ortho-panel">
                  <strong>{copy.ortho.remindersTitle}</strong>
                  <ul>
                    {copy.ortho.reminders.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div className="ortho-panel">
                  <strong>{copy.ortho.historyTitle}</strong>
                  {orthoActivity.length > 0 ? (
                    <div className="activity-list compact-activity-list">
                      {orthoActivity.map((entry) => (
                        <div key={entry.id} className="activity-card compact-activity-card">
                          <strong>{entry.title}</strong>
                          <span>{entry.detail}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="inline-note">{copy.ortho.emptyHistory}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {tab === 'learn' && (
            <section className={`panel wide-panel character-panel ${crew.learn.accent}`}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{crew.learn.name}</p>
                  <h2>{copy.learn.title}</h2>
                </div>
                <p>{copy.learn.body}</p>
              </div>

              {learnSections.map((section) => (
                <section key={section.id} className="learn-section">
                  <div className="section-heading compact-heading">
                    <div>
                      <p className="eyebrow">{section.title}</p>
                      <h3>{activeProfile.name}&apos;s guide</h3>
                    </div>
                    <p>{section.body}</p>
                  </div>
                  <div className="learn-grid">
                    {section.cards.map((card) => (
                      <button
                        key={`${section.id}-${card.title}`}
                        className={`learn-card learn-card-button ${expandedLearnCard === `${section.id}-${card.title}` ? 'expanded' : ''}`}
                        onClick={() =>
                          setExpandedLearnCard((current) =>
                            current === `${section.id}-${card.title}` ? null : `${section.id}-${card.title}`,
                          )
                        }
                      >
                        <img className="learn-art" src={card.art} alt="" />
                        <span>{card.tag}</span>
                        <h3>{card.title}</h3>
                        <p className={expandedLearnCard === `${section.id}-${card.title}` ? '' : 'learn-snippet'}>{card.body}</p>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </section>
          )}

          {tab === 'parent' && (
            <section className={`panel wide-panel character-panel ${crew.parent.accent}`}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{crew.parent.name}</p>
                  <h2>{copy.parent.title}</h2>
                </div>
                <p>{copy.parent.body}</p>
              </div>

              <div className="parent-grid">
                <div className="panel inset-panel">
                  <div className="parent-stat-strip">
                    <div className="parent-stat">
                      <strong>{state.profiles.length}</strong>
                      <span>profiles</span>
                    </div>
                    <div className="parent-stat">
                      <strong>{state.profiles.filter((profile) => profile.lastBrushedOn === today).length}</strong>
                      <span>brushed today</span>
                    </div>
                  </div>
                  <strong>{copy.parent.profilesTitle}</strong>
                  <div className="profile-list">
                    {state.profiles.map((profile) => (
                      <div key={profile.id} className="profile-row">
                        <div className="profile-row-copy">
                          <span>{profile.name}</span>
                          <small>{profile.type === 'teen' ? 'Teen profile' : 'Child profile'}</small>
                        </div>
                        <strong>{profile.streak}d</strong>
                      </div>
                    ))}
                  </div>
                  <button className="soft-button" onClick={() => setShowProfileForm(true)}>
                    {copy.parent.addProfile}
                  </button>
                </div>

                <div className="panel inset-panel">
                  <div className="parent-reminders">
                    <div className="reminder-card">
                      <strong>Quick reminder</strong>
                      <p>Kids often still need brushing help into early elementary years.</p>
                    </div>
                    <div className="reminder-card">
                      <strong>First visit</strong>
                      <p>Plan a dental visit by the first tooth or first birthday.</p>
                    </div>
                  </div>
                  <label className="stacked-label">
                    <span>{copy.parent.notesLabel}</span>
                    <textarea
                      rows={6}
                      defaultValue={activeProfile.notes}
                      onBlur={(event) => saveNotes(event.target.value)}
                    />
                  </label>
                  {saveMessage ? <p className="save-message">{saveMessage}</p> : null}
                </div>
              </div>
            </section>
          )}
        </main>

        <nav className="tab-bar mobile-tab-bar" aria-label="Primary">
          {(Object.keys(copy.tabs) as TabId[]).map((tabId) => (
            <button
              key={tabId}
              className={tab === tabId ? 'active' : ''}
              onClick={() => setTab(tabId)}
            >
              {copy.tabs[tabId]}
            </button>
          ))}
        </nav>

        {showProfileForm ? (
          <div className="modal-backdrop" role="presentation" onClick={() => setShowProfileForm(false)}>
            <div className="modal panel profile-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <h2>{copy.profileForm.title}</h2>
              <div className="profile-stepper">
                {[0, 1, 2].map((step) => (
                  <div key={step} className={`step-dot ${profileStep === step ? 'active' : ''} ${profileStep > step ? 'done' : ''}`} />
                ))}
              </div>
              <label className="stacked-label">
                <span>{copy.profileForm.name}</span>
                <input
                  value={profileName}
                  onChange={(event) => {
                    setProfileName(event.target.value);
                    if (event.target.value.trim()) {
                      setProfileStep((current) => Math.max(current, 1));
                    }
                  }}
                />
              </label>
              <div className="profile-choice-grid">
                <button
                  className={`choice-card ${profileType === 'child' ? 'selected' : ''}`}
                  onClick={() => {
                    setProfileType('child');
                    if (ageGroup === 'teen') {
                      setAgeGroup('big-kid');
                    }
                    setProfileStep((current) => Math.max(current, 1));
                  }}
                >
                  <strong>{copy.profileForm.child}</strong>
                  <span>{copy.profileForm.childDescription}</span>
                </button>
                <button
                  className={`choice-card ${profileType === 'teen' ? 'selected' : ''}`}
                  onClick={() => {
                    setProfileType('teen');
                    setAgeGroup('teen');
                    setProfileStep((current) => Math.max(current, 1));
                  }}
                >
                  <strong>{copy.profileForm.teen}</strong>
                  <span>{copy.profileForm.teenDescription}</span>
                </button>
              </div>
              <label className="stacked-label">
                <span>{copy.profileForm.ageGroup}</span>
                <select
                  value={ageGroup}
                  onChange={(event) => {
                    setAgeGroup(event.target.value as ChildAgeGroup);
                    setProfileStep(2);
                  }}
                >
                  <option value="little-kid">{copy.profileForm.littleKid}</option>
                  <option value="big-kid">{copy.profileForm.bigKid}</option>
                  <option value="teen">{copy.profileForm.teenager}</option>
                </select>
                <small className="field-help">{copy.profileForm.ageGroupHelp}</small>
              </label>
              <div className="profile-preview">
                <p className="eyebrow">{copy.profileForm.previewTitle}</p>
                <strong>{profileName.trim() || 'New profile'}</strong>
                <span>{profileType === 'teen' ? copy.profileForm.teenDescription : copy.profileForm.childDescription}</span>
              </div>
              <div className="button-row">
                <button className="primary-button" onClick={createProfile} disabled={!profileName.trim()}>
                  {copy.profileForm.save}
                </button>
                <button
                  className="soft-button"
                  onClick={() => {
                    setShowProfileForm(false);
                    setProfileStep(0);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showWelcome ? (
          <div className="modal-backdrop" role="presentation">
            <div className="modal panel onboarding-modal" role="dialog" aria-modal="true">
              <p className="eyebrow">{copy.appName}</p>
              <h2>{copy.home.onboardingTitle}</h2>
              <p>{copy.home.onboardingBody}</p>
              <div className="onboarding-points">
                {copy.home.onboardingPoints.map((point) => (
                  <div key={point} className="onboarding-point">
                    {point}
                  </div>
                ))}
              </div>
              <div className="button-row">
                <button
                  className="primary-button"
                  onClick={() => {
                    setShowWelcome(false);
                    setState((current) => ({ ...current, hasSeenWelcome: true }));
                  }}
                >
                  {copy.home.onboardingButton}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
