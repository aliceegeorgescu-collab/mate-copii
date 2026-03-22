import { memo, useCallback, useState } from "react";
import { formatDateLabel } from "../../utils/formatters";

function SelectProfilComponent({ profiles, onSelect, onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  }, [name, onCreate]);

  return (
    <div className="screen center-screen z-front screen-enter">
      <h1 className="titlu-mare wobble">Alege copilul</h1>
      <p className="subtitlu pulse-text">Fiecare profil are progresul si istoricul lui.</p>
      <div className="profil-grid">
        {profiles.map((profile) => (
          <button key={profile.id} className="profil-card bounce-on-hover" onClick={() => onSelect(profile.id)}>
            <span className="profil-name">{profile.name}</span>
            <span className="profil-meta">* {profile.steleGlobale} stele</span>
            <span className="profil-meta">Ultima joaca: {formatDateLabel(profile.lastSessionAt)}</span>
          </button>
        ))}
      </div>
      <form className="profil-form" onSubmit={handleSubmit}>
        <input
          className="profil-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Numele copilului"
          maxLength={30}
        />
        <button className="btn-maine bounce-on-hover" type="submit">Adauga profil</button>
      </form>
    </div>
  );
}

const SelectProfil = memo(SelectProfilComponent);

export default SelectProfil;