import { crew } from './constants';
import { useAppState } from './hooks/useAppState';
import { profileGradient } from './utils';
import type { Language, TabId } from './types';

import { HomeTab } from './components/HomeTab';
import { BrushingTab } from './components/BrushingTab';
import { TeethTab } from './components/TeethTab';
import { OrthoTab } from './components/OrthoTab';
import { LearnTab } from './components/LearnTab';
import { ParentTab } from './components/ParentTab';
import { ProfileFormModal } from './components/ProfileFormModal';
import { WelcomeModal } from './components/WelcomeModal';

export function App() {
  const appState = useAppState();
  const {
    state,
    setState,
    tab,
    setTab,
    activeProfile,
    copy,
    showProfileForm,
    setShowProfileForm,
    showWelcome,
  } = appState;

  const currentGuide = crew[tab];

  if (!activeProfile) {
    return null;
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
          {tab === 'home' && <HomeTab {...appState} />}
          {tab === 'brushing' && <BrushingTab {...appState} />}
          {tab === 'teeth' && <TeethTab {...appState} />}
          {tab === 'ortho' && <OrthoTab {...appState} />}
          {tab === 'learn' && <LearnTab {...appState} />}
          {tab === 'parent' && <ParentTab {...appState} />}
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

        {showProfileForm ? <ProfileFormModal {...appState} /> : null}
        {showWelcome ? <WelcomeModal {...appState} /> : null}
      </div>
    </div>
  );
}
