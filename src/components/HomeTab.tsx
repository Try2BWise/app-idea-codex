import { crew } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<
  AppState,
  | 'activeProfile'
  | 'copy'
  | 'state'
  | 'setTab'
  | 'setTrackSubTab'
  | 'showCompletedTasks'
  | 'setShowCompletedTasks'
  | 'captainHomeLine'
  | 'captainMissionPills'
  | 'visibleTasks'
  | 'recentActivity'
  | 'jumpFromStep'
  | 'setShowProfileForm'
  | 'alignerProgress'
>;

export function HomeTab({
  activeProfile,
  copy,
  setTab,
  setTrackSubTab,
  showCompletedTasks,
  setShowCompletedTasks,
  captainHomeLine,
  captainMissionPills,
  visibleTasks,
  recentActivity,
  jumpFromStep,
}: Props) {
  if (!activeProfile) return null;

  return (
    <div className="ios-page">
      <div className="ios-nav-bar">
        <h1 className="ios-large-title">{copy.home.welcome}</h1>
        <p className="ios-nav-subtitle">{activeProfile.name}</p>
      </div>

      {/* Captain Brush hero card */}
      <div className="ios-hero-card">
        <div className="ios-hero-bubble">
          <strong>Captain Brush</strong>
          <p>{captainHomeLine}</p>
        </div>
        <div className="ios-pill-row">
          {captainMissionPills.map((pill) => (
            <span key={pill} className="ios-pill">{pill}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="ios-stat-strip">
        <div className="ios-stat-card">
          <span className="ios-stat-value">{activeProfile.streak}</span>
          <span className="ios-stat-label">day streak</span>
        </div>
        <div className="ios-stat-card">
          <span className="ios-stat-value">{activeProfile.teethLost.length}</span>
          <span className="ios-stat-label">teeth notes</span>
        </div>
        <div className="ios-stat-card">
          <span className="ios-stat-value">{activeProfile.alignerHoursToday}</span>
          <span className="ios-stat-label">ortho hours</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="ios-action-row">
        <button className="ios-button-primary" onClick={() => setTab('brushing')}>
          {copy.brushing.start}
        </button>
        <button className="ios-button-secondary" onClick={() => setTab('learn')}>
          {copy.tabs.learn}
        </button>
      </div>

      {/* Daily tasks */}
      <div className="ios-section-group">
        <div className="ios-section-header">
          <span>{copy.home.tasksTitle}</span>
          <button className="ios-link" onClick={() => setShowCompletedTasks((c) => !c)}>
            {showCompletedTasks ? 'Hide done' : 'Show all'}
          </button>
        </div>
        <div className="ios-card">
          {visibleTasks.length > 0 ? visibleTasks.map((task, i) => (
            <div key={task.id}>
              {i > 0 && <div className="ios-separator" />}
              <button
                className={`ios-cell ios-cell-tappable ${task.completed ? 'ios-cell-completed' : ''}`}
                onClick={task.action}
              >
                <div>
                  <span className="ios-cell-label">{task.title}</span>
                  <span className="ios-cell-detail">{task.body}</span>
                </div>
                <span className="ios-cell-chevron" aria-hidden="true" />
              </button>
            </div>
          )) : (
            <div className="ios-cell">
              <div>
                <span className="ios-cell-label">All caught up</span>
                <span className="ios-cell-detail">Today's core tasks are done.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="ios-section-group">
        <div className="ios-section-header">
          <span>{copy.home.startHereTitle}</span>
        </div>
        <div className="ios-card">
          {copy.home.nextSteps.map((step, i) => (
            <div key={step}>
              {i > 0 && <div className="ios-separator" />}
              <button className="ios-cell ios-cell-tappable" onClick={() => jumpFromStep(step)}>
                <span className="ios-cell-label">{step}</span>
                <span className="ios-cell-chevron" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Crew cards */}
      <div className="ios-section-group">
        <div className="ios-section-header">
          <span>Your guides</span>
        </div>
        <div className="ios-card">
          {([
            { id: 'brushing' as const, ...crew.brushing, action: () => setTab('brushing') },
            { id: 'track-teeth' as const, ...crew.track, action: () => { setTab('track'); setTrackSubTab('teeth'); } },
            { id: 'track-ortho' as const, name: 'Timer T-Pop', title: 'Rhythm guide', accent: 'crew-timer', badge: 'TP', vibe: '', action: () => { setTab('track'); setTrackSubTab('ortho'); } },
            { id: 'learn' as const, ...crew.learn, action: () => setTab('learn') },
          ]).map((member, i) => (
            <div key={member.id}>
              {i > 0 && <div className="ios-separator" />}
              <button className="ios-cell ios-cell-tappable" onClick={member.action}>
                <div className="ios-cell-icon-row">
                  <div className="ios-cell-icon">{member.badge}</div>
                  <div>
                    <span className="ios-cell-label">{member.name}</span>
                    <span className="ios-cell-detail">{member.title}</span>
                  </div>
                </div>
                <span className="ios-cell-chevron" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="ios-section-group">
        <div className="ios-section-header">
          <span>{copy.home.activityTitle}</span>
        </div>
        {recentActivity.length > 0 ? (
          <div className="ios-card">
            {recentActivity.map((entry, i) => (
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
          <div className="ios-section-footer">{copy.home.emptyActivity}</div>
        )}
      </div>
    </div>
  );
}
