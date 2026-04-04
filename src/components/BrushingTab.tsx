import { brushingRewards, captainBrushAssets, crew } from '../constants';
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
    <section className={`panel wide-panel character-panel ${crew.brushing.accent}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{crew.brushing.name}</p>
          <h2>{copy.brushing.title}</h2>
        </div>
        <p>{copy.brushing.body}</p>
      </div>

      <div className="guide-callout">
        <div className={`captain-coach-card captain-${captainMode}`}>
          <div className="captain-coach-art">
            <div className="captain-stage-glow small" aria-hidden="true" />
            <img
              className="guide-art"
              src={secondsLeft === 0 ? captainBrushAssets.win : captainBrushAssets.coach}
              alt="Captain Brush"
            />
          </div>
          <div className="speech-bubble captain-speech">
            <div className="speech-badge-row">
              <strong>{crew.brushing.title}</strong>
              <span className="coach-badge">{captainHeadline}</span>
            </div>
            <p>{captainSubline}</p>
            <div className="captain-status-strip">
              {captainStatusPills.map((pill) => (
                <span key={pill} className="captain-status-pill">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="brushing-progress-panel">
        <div className="progress-ring" style={{ ['--progress' as string]: `${brushingProgress}%` }}>
          <div className="progress-ring-inner">
            <span>{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}</span>
            <small>{copy.brushing.quadrants[activeQuadrantIndex]}</small>
          </div>
        </div>
        <div className="quadrant-strip">
          {copy.brushing.quadrants.map((quadrant, index) => (
            <div
              key={quadrant}
              className={`quadrant-chip ${index === activeQuadrantIndex ? 'active' : ''} ${index < activeQuadrantIndex ? 'done' : ''}`}
            >
              {quadrant}
            </div>
          ))}
        </div>
      </div>

      <div className="timer-layout">
        <div className="timer-controls">
          <p className="coach-line">{secondsLeft === 0 ? copy.brushing.finished : encouragement}</p>
          <div className="captain-mini-banner">
            <span className="captain-mini-mark">CB</span>
            <p>{captainMode === 'victory' ? `${activeProfile.name} finished strong.` : 'Captain Brush is pacing the mission for you.'}</p>
          </div>
          <div className="reward-strip">
            {brushingRewards.map((reward, index) => (
              <span key={reward} className={`reward-chip ${elapsed / 30 > index ? 'earned' : ''}`}>
                {reward}
              </span>
            ))}
          </div>
          <div className="button-row">
            <button
              className="primary-button"
              onClick={() => setIsRunning((current) => !current)}
              disabled={secondsLeft === 0}
            >
              {isRunning ? copy.brushing.pause : secondsLeft === 120 ? copy.brushing.start : copy.brushing.resume}
            </button>
            <button
              className="soft-button"
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
    </section>
  );
}
