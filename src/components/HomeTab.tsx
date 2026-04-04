import { captainBrushAssets, crew } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<
  AppState,
  | 'activeProfile'
  | 'copy'
  | 'state'
  | 'setTab'
  | 'showIntroDetails'
  | 'setShowIntroDetails'
  | 'showCompletedTasks'
  | 'setShowCompletedTasks'
  | 'captainHomeLine'
  | 'captainMissionPills'
  | 'visibleTasks'
  | 'recentActivity'
  | 'jumpFromStep'
  | 'setShowProfileForm'
>;

export function HomeTab({
  activeProfile,
  copy,
  setTab,
  showIntroDetails,
  setShowIntroDetails,
  showCompletedTasks,
  setShowCompletedTasks,
  captainHomeLine,
  captainMissionPills,
  visibleTasks,
  recentActivity,
  jumpFromStep,
}: Props) {
  if (!activeProfile) return null;

  const crewCards = [
    { id: 'brushing', ...crew.brushing, action: () => setTab('brushing') },
    { id: 'teeth', ...crew.teeth, action: () => setTab('teeth') },
    { id: 'ortho', ...crew.ortho, action: () => setTab('ortho') },
    { id: 'learn', ...crew.learn, action: () => setTab('learn') },
  ] as const;

  return (
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
              <span>Today's core tasks are done. You can still explore and learn.</span>
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
  );
}
