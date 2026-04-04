import { crew } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'activeProfile' | 'copy' | 'learnSections' | 'expandedLearnCard' | 'setExpandedLearnCard'>;

export function LearnTab({ activeProfile, copy, learnSections, expandedLearnCard, setExpandedLearnCard }: Props) {
  if (!activeProfile) return null;

  return (
    <section className={`panel wide-panel character-panel ${crew.learn.accent}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{crew.learn.name}</p>
          <h2>{copy.learn.title}</h2>
        </div>
        <p>{copy.learn.body}</p>
      </div>

      {learnSections.map((section) => (
        <section key={section.id} className="learn-section">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">{section.title}</p>
              <h3>{activeProfile.name}&apos;s guide</h3>
            </div>
            <p>{section.body}</p>
          </div>
          <div className="learn-grid">
            {section.cards.map((card) => (
              <button
                key={`${section.id}-${card.title}`}
                className={`learn-card learn-card-button ${expandedLearnCard === `${section.id}-${card.title}` ? 'expanded' : ''}`}
                onClick={() =>
                  setExpandedLearnCard((current) =>
                    current === `${section.id}-${card.title}` ? null : `${section.id}-${card.title}`,
                  )
                }
              >
                <img className="learn-art" src={card.art} alt="" />
                <span>{card.tag}</span>
                <h3>{card.title}</h3>
                <p className={expandedLearnCard === `${section.id}-${card.title}` ? '' : 'learn-snippet'}>{card.body}</p>
              </button>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
