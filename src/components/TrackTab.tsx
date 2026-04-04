import { bottomTeeth, crew, topTeeth } from '../constants';
import { shortToothLabel } from '../utils';
import type { AppState } from '../hooks/useAppState';
import type { TrackSubTab } from '../types';

type Props = Pick<
  AppState,
  | 'activeProfile'
  | 'copy'
  | 'trackSubTab'
  | 'setTrackSubTab'
  | 'toggleTooth'
  | 'alignerProgress'
  | 'orthoState'
  | 'nextTrayChangeLabel'
  | 'orthoActivity'
  | 'updateProfile'
  | 'addActivity'
>;

export function TrackTab({
  activeProfile,
  copy,
  trackSubTab,
  setTrackSubTab,
  toggleTooth,
  alignerProgress,
  orthoState,
  nextTrayChangeLabel,
  orthoActivity,
  updateProfile,
  addActivity,
}: Props) {
  if (!activeProfile) return null;

  const segments: { id: TrackSubTab; label: string }[] = [
    { id: 'teeth', label: copy.teeth.title },
    { id: 'ortho', label: copy.ortho.title },
  ];

  return (
    <div className="ios-page">
      <div className="ios-nav-bar">
        <h1 className="ios-large-title">{copy.tabs.track}</h1>
        <p className="ios-nav-subtitle">{crew.track.name}</p>
      </div>

      <div className="ios-segmented-control">
        {segments.map((seg) => (
          <button
            key={seg.id}
            className={`ios-segment ${trackSubTab === seg.id ? 'active' : ''}`}
            onClick={() => setTrackSubTab(seg.id)}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {trackSubTab === 'teeth' && (
        <div className="ios-section-group">
          <div className="ios-section-header">
            <span>{copy.teeth.body}</span>
          </div>

          <div className="ios-card">
            <div className="ios-stat-row">
              <div className="ios-stat">
                <span className="ios-stat-value">{activeProfile.teethLost.length}</span>
                <span className="ios-stat-label">milestones</span>
              </div>
              <div className="ios-stat">
                <span className="ios-stat-value">{activeProfile.teethLost.length === 0 ? '--' : 'Active'}</span>
                <span className="ios-stat-label">status</span>
              </div>
            </div>
          </div>

          <div className="ios-card">
            <div className="smile-map">
              <div className="arch-section">
                <span className="arch-label">Top</span>
                <div className="teeth-arch">
                  {topTeeth.map((label) => (
                    <button
                      key={label}
                      className={`tooth-dot ${activeProfile.teethLost.includes(label) ? 'lost' : ''}`}
                      onClick={() => toggleTooth(label)}
                      title={label}
                    >
                      <span>{shortToothLabel(label)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="arch-section">
                <span className="arch-label">Bottom</span>
                <div className="teeth-arch">
                  {bottomTeeth.map((label) => (
                    <button
                      key={label}
                      className={`tooth-dot ${activeProfile.teethLost.includes(label) ? 'lost' : ''}`}
                      onClick={() => toggleTooth(label)}
                      title={label}
                    >
                      <span>{shortToothLabel(label)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ios-section-footer">{copy.teeth.hint}</div>
        </div>
      )}

      {trackSubTab === 'ortho' && (
        <div className="ios-section-group">
          <div className="ios-section-header">
            <span>{copy.ortho.body}</span>
          </div>

          <div className="ios-card">
            <div className="ios-cell">
              <span className="ios-cell-label">{copy.ortho.progressTitle}</span>
              <span className="ios-cell-value ios-tint">{orthoState}</span>
            </div>
            <div className="ios-separator" />
            <div className="ios-progress-bar">
              <div className="ios-progress-fill" style={{ width: `${alignerProgress}%` }} />
            </div>
            <div className="ios-cell">
              <span className="ios-cell-label">{copy.ortho.goal}</span>
              <span className="ios-cell-value">{activeProfile.alignerHoursToday}h / {activeProfile.alignerGoalHours}h</span>
            </div>
          </div>

          <div className="ios-card">
            <div className="ios-cell">
              <span className="ios-cell-label">{copy.ortho.nextChange}</span>
              <span className="ios-cell-value">{nextTrayChangeLabel}</span>
            </div>
            <div className="ios-separator" />
            <div className="ios-cell">
              <input
                className="ios-date-input"
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
            </div>
          </div>

          <div className="ios-card">
            <div className="ios-inline-controls">
              <button
                className="ios-stepper-btn"
                onClick={() => {
                  updateProfile(activeProfile.id, (profile) => ({
                    ...profile,
                    alignerHoursToday: Math.max(0, profile.alignerHoursToday - 1),
                  }));
                  addActivity(activeProfile.id, {
                    kind: 'aligner',
                    title: 'Aligner time adjusted',
                    detail: 'Updated today\u2019s wear-time estimate.',
                  });
                }}
              >
                {copy.ortho.subtractHour}
              </button>
              <span className="ios-stepper-value">{activeProfile.alignerHoursToday}h</span>
              <button
                className="ios-stepper-btn"
                onClick={() => {
                  updateProfile(activeProfile.id, (profile) => ({
                    ...profile,
                    alignerHoursToday: Math.min(profile.alignerGoalHours, profile.alignerHoursToday + 1),
                  }));
                  addActivity(activeProfile.id, {
                    kind: 'aligner',
                    title: 'Aligner time updated',
                    detail: 'Logged one more hour toward today\u2019s goal.',
                  });
                }}
              >
                {copy.ortho.addHour}
              </button>
            </div>
          </div>

          <div className="ios-section-header"><span>{copy.ortho.comfortTitle}</span></div>
          <div className="ios-card">
            {copy.ortho.comfortTips.map((tip, i) => (
              <div key={tip}>
                {i > 0 && <div className="ios-separator" />}
                <div className="ios-cell"><span className="ios-cell-label">{tip}</span></div>
              </div>
            ))}
          </div>

          <div className="ios-section-header"><span>{copy.ortho.historyTitle}</span></div>
          {orthoActivity.length > 0 ? (
            <div className="ios-card">
              {orthoActivity.map((entry, i) => (
                <div key={entry.id}>
                  {i > 0 && <div className="ios-separator" />}
                  <div className="ios-cell">
                    <div>
                      <span className="ios-cell-label">{entry.title}</span>
                      <span className="ios-cell-detail">{entry.detail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ios-section-footer">{copy.ortho.emptyHistory}</div>
          )}
        </div>
      )}
    </div>
  );
}
