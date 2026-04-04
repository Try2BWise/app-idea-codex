import type { ChildAgeGroup } from '../types';
import type { AppState } from '../hooks/useAppState';

type Props = Pick<
  AppState,
  | 'copy'
  | 'profileName'
  | 'setProfileName'
  | 'profileType'
  | 'setProfileType'
  | 'ageGroup'
  | 'setAgeGroup'
  | 'profileStep'
  | 'setProfileStep'
  | 'setShowProfileForm'
  | 'createProfile'
>;

export function ProfileFormModal({
  copy,
  profileName,
  setProfileName,
  profileType,
  setProfileType,
  ageGroup,
  setAgeGroup,
  profileStep,
  setProfileStep,
  setShowProfileForm,
  createProfile,
}: Props) {
  return (
    <div className="ios-sheet-backdrop" onClick={() => setShowProfileForm(false)}>
      <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="ios-sheet-handle" />
        <div className="ios-sheet-header">
          <button className="ios-link" onClick={() => { setShowProfileForm(false); setProfileStep(0); }}>Cancel</button>
          <h2 className="ios-sheet-title">{copy.profileForm.title}</h2>
          <button className="ios-link ios-link-bold" onClick={createProfile} disabled={!profileName.trim()}>
            {copy.profileForm.save}
          </button>
        </div>

        <div className="ios-sheet-body">
          <div className="ios-stepper-dots">
            {[0, 1, 2].map((step) => (
              <div key={step} className={`ios-dot ${profileStep === step ? 'active' : ''} ${profileStep > step ? 'done' : ''}`} />
            ))}
          </div>

          <div className="ios-section-group">
            <div className="ios-section-header"><span>{copy.profileForm.name}</span></div>
            <div className="ios-card">
              <input
                className="ios-input"
                value={profileName}
                placeholder="Enter name"
                onChange={(event) => {
                  setProfileName(event.target.value);
                  if (event.target.value.trim()) setProfileStep((c) => Math.max(c, 1));
                }}
              />
            </div>
          </div>

          <div className="ios-section-group">
            <div className="ios-section-header"><span>{copy.profileForm.type}</span></div>
            <div className="ios-card">
              <button
                className={`ios-cell ios-cell-tappable ${profileType === 'child' ? 'ios-cell-selected' : ''}`}
                onClick={() => {
                  setProfileType('child');
                  if (ageGroup === 'teen') setAgeGroup('big-kid');
                  setProfileStep((c) => Math.max(c, 1));
                }}
              >
                <div>
                  <span className="ios-cell-label">{copy.profileForm.child}</span>
                  <span className="ios-cell-detail">{copy.profileForm.childDescription}</span>
                </div>
                {profileType === 'child' && <span className="ios-checkmark">&#10003;</span>}
              </button>
              <div className="ios-separator" />
              <button
                className={`ios-cell ios-cell-tappable ${profileType === 'teen' ? 'ios-cell-selected' : ''}`}
                onClick={() => {
                  setProfileType('teen');
                  setAgeGroup('teen');
                  setProfileStep((c) => Math.max(c, 1));
                }}
              >
                <div>
                  <span className="ios-cell-label">{copy.profileForm.teen}</span>
                  <span className="ios-cell-detail">{copy.profileForm.teenDescription}</span>
                </div>
                {profileType === 'teen' && <span className="ios-checkmark">&#10003;</span>}
              </button>
            </div>
          </div>

          <div className="ios-section-group">
            <div className="ios-section-header"><span>{copy.profileForm.ageGroup}</span></div>
            <div className="ios-card">
              <div className="ios-cell">
                <select
                  className="ios-select"
                  value={ageGroup}
                  onChange={(event) => {
                    setAgeGroup(event.target.value as ChildAgeGroup);
                    setProfileStep(2);
                  }}
                >
                  <option value="little-kid">{copy.profileForm.littleKid}</option>
                  <option value="big-kid">{copy.profileForm.bigKid}</option>
                  <option value="teen">{copy.profileForm.teenager}</option>
                </select>
              </div>
            </div>
            <div className="ios-section-footer">{copy.profileForm.ageGroupHelp}</div>
          </div>

          <div className="ios-section-group">
            <div className="ios-section-header"><span>{copy.profileForm.previewTitle}</span></div>
            <div className="ios-card">
              <div className="ios-cell">
                <div>
                  <span className="ios-cell-label">{profileName.trim() || 'New profile'}</span>
                  <span className="ios-cell-detail">
                    {profileType === 'teen' ? copy.profileForm.teenDescription : copy.profileForm.childDescription}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
