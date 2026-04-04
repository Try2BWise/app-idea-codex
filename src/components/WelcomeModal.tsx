import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'copy' | 'setShowWelcome' | 'setState'>;

export function WelcomeModal({ copy, setShowWelcome, setState }: Props) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal panel onboarding-modal" role="dialog" aria-modal="true">
        <p className="eyebrow">{copy.appName}</p>
        <h2>{copy.home.onboardingTitle}</h2>
        <p>{copy.home.onboardingBody}</p>
        <div className="onboarding-points">
          {copy.home.onboardingPoints.map((point) => (
            <div key={point} className="onboarding-point">
              {point}
            </div>
          ))}
        </div>
        <div className="button-row">
          <button
            className="primary-button"
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
