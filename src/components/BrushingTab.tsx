import { brushingRewards, crew } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<
  AppState,
  | 'activeProfile'
  | 'copy'
  | 'secondsLeft'
  | 'setSecondsLeft'
  | 'isRunning'
  | 'setIsRunning'
  | 'elapsed'
  | 'encouragement'
  | 'activeQuadrantIndex'
  | 'brushingProgress'
  | 'captainMode'
  | 'captainHeadline'
  | 'captainSubline'
  | 'captainStatusPills'
>;

export function BrushingTab({
  activeProfile,
  copy,
  secondsLeft,
  setSecondsLeft,
  isRunning,
  setIsRunning,
  elapsed,
  encouragement,
  activeQuadrantIndex,
  brushingProgress,
  captainMode,
  captainHeadline,
  captainSubline,
  captainStatusPills,
}: Props) {
  if (!activeProfile) return null;

  return (
    <div className="ios-page">
      <div className="ios-nav-bar">
        <h1 className="ios-large-title">{copy.brushing.title}</h1>
        <p className="ios-nav-subtitle">{crew.brushing.name}</p>
      </div>

      {/* Coach status card */}
      <div className="ios-card ios-card-flush">
        <div className={`ios-coach-card captain-${captainMode}`}>
          <div className="ios-cell-icon ios-cell-icon-lg">{crew.brushing.badge}</div>
          <div className="ios-coach-copy">
            <div className="ios-coach-headline">
              <strong>{crew.brushing.title}</strong>
              <span className="ios-badge">{captainHeadline}</span>
            </div>
            <p className="ios-muted">{captainSubline}</p>
            <div className="ios-pill-row">
              {captainStatusPills.map((pill) => (
                <span key={pill} className="ios-pill ios-pill-small">{pill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timer ring */}
      <div className="ios-timer-section">
        <div className="progress-ring" style={{ ['--progress' as string]: `${brushingProgress}%` }}>
          <div className="progress-ring-inner">
            <span className="ios-timer-digits">
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
            <small className="ios-muted">{copy.brushing.quadrants[activeQuadrantIndex]}</small>
          </div>
        </div>

        <div className="ios-quadrant-strip">
          {copy.brushing.quadrants.map((quadrant, index) => (
            <div
              key={quadrant}
              className={`ios-quadrant ${index === activeQuadrantIndex ? 'active' : ''} ${index < activeQuadrantIndex ? 'done' : ''}`}
            >
              {quadrant}
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement & controls */}
      <div className="ios-section-group">
        <div className="ios-card">
          <div className="ios-cell">
            <span className="ios-cell-label ios-cell-label-lg">
              {secondsLeft === 0 ? copy.brushing.finished : encouragement}
            </span>
          </div>
        </div>

        <div className="ios-reward-strip">
          {brushingRewards.map((reward, index) => (
            <span key={reward} className={`ios-pill ${elapsed / 30 > index ? 'ios-pill-earned' : ''}`}>
              {reward}
            </span>
          ))}
        </div>

        <div className="ios-action-row">
          <button
            className="ios-button-primary ios-button-lg"
            onClick={() => setIsRunning((current) => !current)}
            disabled={secondsLeft === 0}
          >
            {isRunning ? copy.brushing.pause : secondsLeft === 120 ? copy.brushing.start : copy.brushing.resume}
          </button>
          <button
            className="ios-button-secondary"
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
  );
}
