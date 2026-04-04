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
    <div className="modal-backdrop" role="presentation" onClick={() => setShowProfileForm(false)}>
      <div className="modal panel profile-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>{copy.profileForm.title}</h2>
        <div className="profile-stepper">
          {[0, 1, 2].map((step) => (
            <div key={step} className={`step-dot ${profileStep === step ? 'active' : ''} ${profileStep > step ? 'done' : ''}`} />
          ))}
        </div>
        <label className="stacked-label">
          <span>{copy.profileForm.name}</span>
          <input
            value={profileName}
            onChange={(event) => {
              setProfileName(event.target.value);
              if (event.target.value.trim()) {
                setProfileStep((current) => Math.max(current, 1));
              }
            }}
          />
        </label>
        <div className="profile-choice-grid">
          <button
            className={`choice-card ${profileType === 'child' ? 'selected' : ''}`}
            onClick={() => {
              setProfileType('child');
              if (ageGroup === 'teen') {
                setAgeGroup('big-kid');
              }
              setProfileStep((current) => Math.max(current, 1));
            }}
          >
            <strong>{copy.profileForm.child}</strong>
            <span>{copy.profileForm.childDescription}</span>
          </button>
          <button
            className={`choice-card ${profileType === 'teen' ? 'selected' : ''}`}
            onClick={() => {
              setProfileType('teen');
              setAgeGroup('teen');
              setProfileStep((current) => Math.max(current, 1));
            }}
          >
            <strong>{copy.profileForm.teen}</strong>
            <span>{copy.profileForm.teenDescription}</span>
          </button>
        </div>
        <label className="stacked-label">
          <span>{copy.profileForm.ageGroup}</span>
          <select
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
          <small className="field-help">{copy.profileForm.ageGroupHelp}</small>
        </label>
        <div className="profile-preview">
          <p className="eyebrow">{copy.profileForm.previewTitle}</p>
          <strong>{profileName.trim() || 'New profile'}</strong>
          <span>{profileType === 'teen' ? copy.profileForm.teenDescription : copy.profileForm.childDescription}</span>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={createProfile} disabled={!profileName.trim()}>
            {copy.profileForm.save}
          </button>
          <button
            className="soft-button"
            onClick={() => {
              setShowProfileForm(false);
              setProfileStep(0);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
