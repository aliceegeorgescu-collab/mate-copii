import { getCharacterComponent, getPersonajById, PERSONAJE } from "./characterRegistry";

export function CharacterArt({ personaj, stare = "idle", size = 140, className = "", streak = 0 }) {
  const resolved = getPersonajById(personaj?.id) || PERSONAJE[0];
  const CharacterComponent = getCharacterComponent(resolved.id);

  return (
    <div
      className={`char-art ${resolved.id} state-${stare} ${streak >= 3 ? "is-streak" : ""} ${className}`.trim()}
      style={{ width: size, height: size, "--char-color": resolved.culoare }}
    >
      <svg viewBox="0 0 160 160" className="char-svg" role="img" aria-label={resolved.nume}>
        <CharacterComponent />
      </svg>
    </div>
  );
}

export default CharacterArt;