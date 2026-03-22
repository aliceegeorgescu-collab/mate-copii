import { memo } from "react";
import CharacterArt from "./CharacterArt";
import { PERSONAJE, getPersonajById } from "./characterRegistry";

function AnimatedCharacterComponent({ personaj, stare, streak = 0 }) {
  let cls = "char-idle";
  if (stare === "corect") cls = "char-dance";
  if (stare === "gresit") cls = "char-sad";

  const isOnFire = streak >= 3;
  const resolved = getPersonajById(personaj?.id) || PERSONAJE[0];

  return (
    <div className={`anim-char ${cls} ${isOnFire ? "on-fire" : ""}`}>
      <CharacterArt personaj={resolved} stare={stare} streak={streak} />
    </div>
  );
}

const AnimatedCharacter = memo(AnimatedCharacterComponent);

export default AnimatedCharacter;
