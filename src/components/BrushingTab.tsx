import { brushingRewards } from '../constants';
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
  | 'coachHeadline'
  | 'coachSubline'
  | 'coachStatusPills'
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
  coachHeadline,
  coachSubline,
  coachStatusPills,
}: Props) {
  if (!activeProfile) return null;

  return (
    <div className="ios-page">
      <div className="ios-nav-bar">
        <h1 className="ios-large-title">{copy.brushing.title}</h1>
      </div>

      {/* Timer ring — always visible above the fold */}
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

      {/* Primary action — immediately below timer */}
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

      {/* Encouragement + rewards */}
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
      </div>

      {/* Coach details — below the fold is fine */}
      <div className="ios-section-group">
        <div className="ios-section-header"><span>{coachHeadline}</span></div>
        <div className="ios-card">
          <div className="ios-cell">
            <span className="ios-cell-detail">{coachSubline}</span>
          </div>
        </div>
        <div className="ios-reward-strip">
          {coachStatusPills.map((pill) => (
            <span key={pill} className="ios-pill ios-pill-small">{pill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
