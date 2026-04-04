import { crew } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<
  AppState,
  | 'activeProfile'
  | 'copy'
  | 'alignerProgress'
  | 'orthoState'
  | 'nextTrayChangeLabel'
  | 'orthoActivity'
  | 'updateProfile'
  | 'addActivity'
>;

export function OrthoTab({
  activeProfile,
  copy,
  alignerProgress,
  orthoState,
  nextTrayChangeLabel,
  orthoActivity,
  updateProfile,
  addActivity,
}: Props) {
  if (!activeProfile) return null;

  return (
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
                  detail: 'Logged one more hour toward today\u2019s goal.',
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
                  detail: 'Updated today\u2019s wear-time estimate.',
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
  );
}
