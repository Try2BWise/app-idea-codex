import { crew, today } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'activeProfile' | 'copy' | 'state' | 'saveMessage' | 'saveNotes' | 'setShowProfileForm'>;

export function ParentTab({ activeProfile, copy, state, saveMessage, saveNotes, setShowProfileForm }: Props) {
  if (!activeProfile) return null;

  return (
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
  );
}
