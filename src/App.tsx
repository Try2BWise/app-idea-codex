import { useEffect, useMemo, useState } from 'react';
import { copyByLanguage } from './content';
import { loadState, saveState } from './storage';
import type { ChildAgeGroup, Language, LocalState, Profile, ProfileType, TabId } from './types';

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
  },
];

const initialState: LocalState = {
  parentName: 'Parent',
  language: 'en',
  activeProfileId: starterProfiles[0].id,
  profiles: starterProfiles,
};

function profileGradient(type: ProfileType): string {
  return type === 'teen'
    ? 'linear-gradient(135deg, #5ec2ff 0%, #2c77f4 100%)'
    : 'linear-gradient(135deg, #ffb24a 0%, #ff6f61 100%)';
}

export function App() {
  const [state, setState] = useState<LocalState>(() => loadState() ?? initialState);
  const [tab, setTab] = useState<TabId>('home');
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('child');
  const [ageGroup, setAgeGroup] = useState<ChildAgeGroup>('big-kid');
  const [saveMessage, setSaveMessage] = useState('');

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

  function markBrushed() {
    if (!activeProfile) {
      return;
    }

    updateProfile(activeProfile.id, (profile) => ({
      ...profile,
      lastBrushedOn: today,
      streak: profile.lastBrushedOn === today ? profile.streak : profile.streak + 1,
    }));
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
    };

    setState((current) => ({
      ...current,
      activeProfileId: newProfile.id,
      profiles: [...current.profiles, newProfile],
    }));
    setProfileName('');
    setProfileType('child');
    setAgeGroup('big-kid');
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

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="hero">
          <div className="hero-copy-block">
            <p className="eyebrow">{copy.appName}</p>
            <h1>{copy.heroTitle}</h1>
            <p className="hero-copy">{copy.heroBody}</p>
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
            <section className="panel spotlight">
              <p className="eyebrow">{copy.tagline}</p>
              <h2>
                {copy.home.welcome} {activeProfile.name}
              </h2>
              <p>{copy.home.dailyPlan}</p>
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
                  <div key={step} className="step-chip">
                    {step}
                  </div>
                ))}
              </div>
            </section>
            <section className="card-grid">
              <button className="panel tile action-tile" onClick={() => setTab('brushing')}>
                <h3>{copy.tabs.brushing}</h3>
                <p>{copy.home.timerCard}</p>
              </button>
              <button className="panel tile action-tile" onClick={() => setTab('teeth')}>
                <h3>{copy.tabs.teeth}</h3>
                <p>{copy.home.toothCard}</p>
              </button>
              <button className="panel tile action-tile" onClick={() => setTab('ortho')}>
                <h3>{copy.tabs.ortho}</h3>
                <p>{copy.home.orthoCard}</p>
              </button>
              <button className="panel tile action-tile" onClick={() => setTab('learn')}>
                <h3>{copy.tabs.learn}</h3>
                <p>{copy.home.learnCard}</p>
              </button>
            </section>
          </>
        )}

          {tab === 'brushing' && (
            <section className="panel wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.tabs.brushing}</p>
                <h2>{copy.brushing.title}</h2>
              </div>
              <p>{copy.brushing.body}</p>
            </div>
            <div className="timer-layout">
              <div className="timer-face">
                <span>{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}</span>
              </div>
              <div className="timer-controls">
                <p className="coach-line">{secondsLeft === 0 ? copy.brushing.finished : encouragement}</p>
                <div className="button-row">
                  <button className="primary-button" onClick={() => setIsRunning(true)} disabled={isRunning}>
                    {copy.brushing.start}
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
            <section className="panel wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.tabs.teeth}</p>
                <h2>{copy.teeth.title}</h2>
              </div>
              <p>{copy.teeth.body}</p>
            </div>
            <div className="teeth-grid">
              {copy.teeth.labels.map((label) => {
                const active = activeProfile.teethLost.includes(label);
                return (
                  <button
                    key={label}
                    className={`tooth-button ${active ? 'lost' : ''}`}
                    onClick={() => toggleTooth(label)}
                    title={label}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="disclaimer">{copy.teeth.hint}</p>
            </section>
          )}

          {tab === 'ortho' && (
            <section className="panel wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.tabs.ortho}</p>
                <h2>{copy.ortho.title}</h2>
              </div>
              <p>{copy.ortho.body}</p>
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
                    onClick={() =>
                      updateProfile(activeProfile.id, (profile) => ({
                        ...profile,
                        alignerHoursToday: Math.min(profile.alignerGoalHours, profile.alignerHoursToday + 1),
                      }))
                    }
                  >
                    {copy.ortho.addHour}
                  </button>
                  <button
                    className="soft-button"
                    onClick={() =>
                      updateProfile(activeProfile.id, (profile) => ({
                        ...profile,
                        alignerHoursToday: Math.max(0, profile.alignerHoursToday - 1),
                      }))
                    }
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
                  onChange={(event) =>
                    updateProfile(activeProfile.id, (profile) => ({
                      ...profile,
                      nextTrayChange: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="ortho-panel">
                <strong>{copy.ortho.comfortTitle}</strong>
                <ul>
                  {copy.ortho.comfortTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
            </section>
          )}

          {tab === 'learn' && (
            <section className="panel wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.tabs.learn}</p>
                <h2>{copy.learn.title}</h2>
              </div>
              <p>{copy.learn.body}</p>
            </div>
            <div className="learn-grid">
              {copy.learn.cards.map((card) => (
                <article key={card.title} className="learn-card">
                  <img className="learn-art" src={card.art} alt="" />
                  <span>{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
            </section>
          )}

          {tab === 'parent' && (
            <section className="panel wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.tabs.parent}</p>
                <h2>{copy.parent.title}</h2>
              </div>
              <p>{copy.parent.body}</p>
            </div>
            <div className="parent-grid">
              <div className="panel inset-panel">
                <strong>{copy.parent.profilesTitle}</strong>
                <div className="profile-list">
                  {state.profiles.map((profile) => (
                    <div key={profile.id} className="profile-row">
                      <span>{profile.name}</span>
                      <small>{profile.type === 'teen' ? 'Teen profile' : 'Child profile'}</small>
                    </div>
                  ))}
                </div>
                  <button className="soft-button" onClick={() => setShowProfileForm(true)}>
                  {copy.parent.addProfile}
                </button>
              </div>
              <div className="panel inset-panel">
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
            <div className="modal panel" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <h2>{copy.profileForm.title}</h2>
              <label className="stacked-label">
                <span>{copy.profileForm.name}</span>
                <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
              </label>
              <label className="stacked-label">
                <span>{copy.profileForm.type}</span>
                <select value={profileType} onChange={(event) => setProfileType(event.target.value as ProfileType)}>
                  <option value="child">{copy.profileForm.child}</option>
                  <option value="teen">{copy.profileForm.teen}</option>
                </select>
              </label>
              <label className="stacked-label">
                <span>{copy.profileForm.ageGroup}</span>
                <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value as ChildAgeGroup)}>
                  <option value="little-kid">{copy.profileForm.littleKid}</option>
                  <option value="big-kid">{copy.profileForm.bigKid}</option>
                  <option value="teen">{copy.profileForm.teenager}</option>
                </select>
              </label>
              <div className="button-row">
                <button className="primary-button" onClick={createProfile}>
                  {copy.profileForm.save}
                </button>
                <button className="soft-button" onClick={() => setShowProfileForm(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
