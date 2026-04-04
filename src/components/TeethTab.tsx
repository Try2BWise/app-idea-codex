import { bottomTeeth, crew, topTeeth } from '../constants';
import { shortToothLabel } from '../utils';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'activeProfile' | 'copy' | 'toggleTooth'>;

export function TeethTab({ activeProfile, copy, toggleTooth }: Props) {
  if (!activeProfile) return null;

  return (
    <section className={`panel wide-panel character-panel ${crew.teeth.accent}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{crew.teeth.name}</p>
          <h2>{copy.teeth.title}</h2>
        </div>
        <p>{copy.teeth.body}</p>
      </div>

      <div className="tooth-summary-row">
        <div className="summary-pill">
          <strong>{activeProfile.teethLost.length}</strong>
          <span>milestones logged</span>
        </div>
        <div className="summary-pill">
          <strong>{activeProfile.teethLost.length === 0 ? 'None yet' : 'In progress'}</strong>
          <span>smile updates</span>
        </div>
      </div>

      <div className="smile-map">
        <div className="arch-section">
          <span className="arch-label">Top smile</span>
          <div className="teeth-arch">
            {topTeeth.map((label) => {
              const active = activeProfile.teethLost.includes(label);
              return (
                <button
                  key={label}
                  className={`tooth-dot ${active ? 'lost' : ''}`}
                  onClick={() => toggleTooth(label)}
                  title={label}
                >
                  <span>{shortToothLabel(label)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="arch-section">
          <span className="arch-label">Bottom smile</span>
          <div className="teeth-arch">
            {bottomTeeth.map((label) => {
              const active = activeProfile.teethLost.includes(label);
              return (
                <button
                  key={label}
                  className={`tooth-dot ${active ? 'lost' : ''}`}
                  onClick={() => toggleTooth(label)}
                  title={label}
                >
                  <span>{shortToothLabel(label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="disclaimer">{copy.teeth.hint}</p>
    </section>
  );
}
