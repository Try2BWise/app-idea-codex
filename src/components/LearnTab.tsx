import { crew } from '../constants';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<AppState, 'activeProfile' | 'copy' | 'learnSections' | 'expandedLearnCard' | 'setExpandedLearnCard'>;

export function LearnTab({ activeProfile, copy, learnSections, expandedLearnCard, setExpandedLearnCard }: Props) {
  if (!activeProfile) return null;

  return (
    <div className="ios-page">
      <div className="ios-nav-bar">
        <h1 className="ios-large-title">{copy.learn.title}</h1>
        <p className="ios-nav-subtitle">{crew.learn.name}</p>
      </div>

      <div className="ios-section-footer">{copy.learn.body}</div>

      {learnSections.map((section) => (
        <div key={section.id} className="ios-section-group">
          <div className="ios-section-header">
            <span>{section.title}</span>
          </div>
          <div className="ios-card">
            {section.cards.map((card, i) => {
              const cardKey = `${section.id}-${card.title}`;
              const isExpanded = expandedLearnCard === cardKey;
              return (
                <div key={cardKey}>
                  {i > 0 && <div className="ios-separator" />}
                  <button
                    className="ios-cell ios-cell-tappable"
                    onClick={() => setExpandedLearnCard((c) => c === cardKey ? null : cardKey)}
                  >
                    <div className="ios-cell-icon-row">
                      <img className="ios-learn-art" src={card.art} alt="" />
                      <div>
                        <span className="ios-cell-overline">{card.tag}</span>
                        <span className="ios-cell-label">{card.title}</span>
                        {isExpanded ? (
                          <span className="ios-cell-detail">{card.body}</span>
                        ) : (
                          <span className="ios-cell-detail ios-line-clamp">{card.body}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
