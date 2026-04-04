import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'copy' | 'setShowWelcome' | 'setState'>;

export function WelcomeModal({ copy, setShowWelcome, setState }: Props) {
  return (
    <div className="ios-sheet-backdrop">
      <div className="ios-sheet ios-sheet-welcome">
        <div className="ios-sheet-handle" />
        <div className="ios-sheet-body ios-sheet-body-centered">
          <p className="ios-overline">{copy.appName}</p>
          <h2 className="ios-sheet-title-large">{copy.home.onboardingTitle}</h2>
          <p className="ios-muted">{copy.home.onboardingBody}</p>

          <div className="ios-section-group">
            <div className="ios-card">
              {copy.home.onboardingPoints.map((point, i) => (
                <div key={point}>
                  {i > 0 && <div className="ios-separator" />}
                  <div className="ios-cell">
                    <span className="ios-cell-label">{point}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="ios-button-primary ios-button-lg ios-button-full"
            onClick={() => {
              setShowWelcome(false);
              setState((current) => ({ ...current, hasSeenWelcome: true }));
            }}
          >
            {copy.home.onboardingButton}
          </button>
        </div>
      </div>
    </div>
  );
}
