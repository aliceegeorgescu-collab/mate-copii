import { memo } from "react";
import CharacterArt from "../characters/CharacterArt";
import { PERSONAJE } from "../characters/characterRegistry";

function SelectPersonajComponent({ onSelect }) {
  return (
    <div className="screen center-screen z-front screen-enter">
      <h1 className="titlu-mare wobble">Matematica Magica!</h1>
      <p className="subtitlu pulse-text">Alege-ti personajul preferat!</p>
      <div className="personaje-grid">
        {PERSONAJE.map((personaj) => (
          <button
            key={personaj.id}
            className="personaj-btn bounce-on-hover"
            onClick={() => onSelect(personaj)}
            style={{ "--pc": personaj.culoare }}
          >
            <div className="personaj-figure">
              <CharacterArt personaj={personaj} stare="idle" size={132} className="select-character" />
            </div>
            <span className="personaj-nume">{personaj.nume}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const SelectPersonaj = memo(SelectPersonajComponent);

export default SelectPersonaj;