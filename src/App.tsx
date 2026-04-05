import { useAppState } from './hooks/useAppState';
import { profileGradient } from './utils';
import type { Language, TabId } from './types';

import { HomeTab } from './components/HomeTab';
import { BrushingTab } from './components/BrushingTab';
import { TrackTab } from './components/TrackTab';
import { LearnTab } from './components/LearnTab';
import { ParentTab } from './components/ParentTab';
import { ProfileFormModal } from './components/ProfileFormModal';
import { WelcomeModal } from './components/WelcomeModal';

const tabIcons: Record<TabId, string> = {
  home: '\u2302',      // house
  brushing: '\u2728',  // sparkles
  track: '\u2665',     // heart (tooth/health)
  learn: '\u2606',     // star
  parent: '\u2699',    // gear
};

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

  if (!activeProfile) {
    return null;
  }

  return (
    <div className="ios-app">
      {/* Profile strip */}
      <div className="ios-profile-bar">
        <div className="ios-profile-strip">
          {state.profiles.map((profile) => (
            <button
              key={profile.id}
              className={`ios-profile-chip ${profile.id === activeProfile.id ? 'active' : ''}`}
              onClick={() => setState((current) => ({ ...current, activeProfileId: profile.id }))}
              style={{ backgroundImage: profileGradient(profile.type) }}
            >
              <span className="ios-profile-name">{profile.name}</span>
            </button>
          ))}
          <button className="ios-profile-add" onClick={() => setShowProfileForm(true)}>+</button>
        </div>
        <div className="ios-lang-select">
          <select
            value={state.language}
            onChange={(event) => setState((current) => ({ ...current, language: event.target.value as Language }))}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>

      {/* Scrollable content */}
      <main className="ios-content">
        {tab === 'home' && <HomeTab {...appState} />}
        {tab === 'brushing' && <BrushingTab {...appState} />}
        {tab === 'track' && <TrackTab {...appState} />}
        {tab === 'learn' && <LearnTab {...appState} />}
        {tab === 'parent' && <ParentTab {...appState} />}
      </main>

      {/* iOS Tab Bar */}
      <nav className="ios-tab-bar" aria-label="Primary">
        {(Object.keys(copy.tabs) as TabId[]).map((tabId) => (
          <button
            key={tabId}
            className={`ios-tab ${tab === tabId ? 'active' : ''}`}
            onClick={() => setTab(tabId)}
          >
            <span className="ios-tab-icon">{tabIcons[tabId]}</span>
            <span className="ios-tab-label">{copy.tabs[tabId]}</span>
          </button>
        ))}
      </nav>

      {showProfileForm && <ProfileFormModal {...appState} />}
      {showWelcome && <WelcomeModal {...appState} />}
    </div>
  );
}
