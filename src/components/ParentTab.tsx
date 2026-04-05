import { crew, today } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'activeProfile' | 'copy' | 'state' | 'saveMessage' | 'saveNotes' | 'setShowProfileForm'>;

export function ParentTab({ activeProfile, copy, state, saveMessage, saveNotes, setShowProfileForm }: Props) {
  if (!activeProfile) return null;

  return (
    <div className="ios-page">
      <div className="ios-nav-bar">
        <h1 className="ios-large-title">{copy.parent.title}</h1>
        <p className="ios-nav-subtitle">{crew.parent.name}</p>
      </div>

      {/* Stats */}
      <div className="ios-stat-strip">
        <div className="ios-stat-card">
          <span className="ios-stat-value">{state.profiles.length}</span>
          <span className="ios-stat-label">{'\uD83D\uDC64'} profiles</span>
        </div>
        <div className="ios-stat-card">
          <span className="ios-stat-value">{state.profiles.filter((p) => p.lastBrushedOn === today).length}</span>
          <span className="ios-stat-label">{'\uD83E\uDEB9'} brushed today</span>
        </div>
      </div>

      {/* Profiles */}
      <div className="ios-section-group">
        <div className="ios-section-header">
          <span>{copy.parent.profilesTitle}</span>
        </div>
        <div className="ios-card">
          {state.profiles.map((profile, i) => (
            <div key={profile.id}>
              {i > 0 && <div className="ios-separator" />}
              <div className="ios-cell">
                <div>
                  <span className="ios-cell-label">{profile.name}</span>
                  <span className="ios-cell-detail">{profile.type === 'teen' ? 'Teen profile' : 'Child profile'}</span>
                </div>
                <span className="ios-cell-value">{'\uD83D\uDD25'} {profile.streak}d</span>
              </div>
            </div>
          ))}
          <div className="ios-separator" />
          <button className="ios-cell ios-cell-tappable ios-cell-action" onClick={() => setShowProfileForm(true)}>
            <span className="ios-tint">{copy.parent.addProfile}</span>
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className="ios-section-group">
        <div className="ios-section-header"><span>{'\uD83D\uDCE2'} Reminders</span></div>
        <div className="ios-card">
          <div className="ios-cell">
            <div>
              <span className="ios-cell-label">{'\uD83D\uDCA1'} Quick reminder</span>
              <span className="ios-cell-detail">Kids often still need brushing help into early elementary years.</span>
            </div>
          </div>
          <div className="ios-separator" />
          <div className="ios-cell">
            <div>
              <span className="ios-cell-label">{'\uD83D\uDCC5'} First visit</span>
              <span className="ios-cell-detail">Plan a dental visit by the first tooth or first birthday.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="ios-section-group">
        <div className="ios-section-header">
          <span>{copy.parent.notesLabel}</span>
        </div>
        <div className="ios-card">
          <textarea
            className="ios-textarea"
            rows={5}
            defaultValue={activeProfile.notes}
            onBlur={(event) => saveNotes(event.target.value)}
            placeholder="Add family notes..."
          />
        </div>
        {saveMessage ? <div className="ios-section-footer">{saveMessage}</div> : null}
      </div>
    </div>
  );
}
