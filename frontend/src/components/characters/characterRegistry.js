import BatmanCharacter from "./BatmanCharacter";
import SarpeCharacter from "./SarpeCharacter";
import LiliacCharacter from "./LiliacCharacter";
import PoneiCharacter from "./PoneiCharacter";
import SpongeBobCharacter from "./SpongeBobCharacter";
import PikachuCharacter from "./PikachuCharacter";
import MinionCharacter from "./MinionCharacter";
import DoryCharacter from "./DoryCharacter";

export const PERSONAJE = [
  { id: "batman", nume: "Batman", culoare: "#1a1a2e", simbol: "BM" },
  { id: "sarpe", nume: "Sarpe simpatic", culoare: "#2e7d32", simbol: "SS" },
  { id: "liliac", nume: "Liliac simpatic", culoare: "#6a1b9a", simbol: "LB" },
  { id: "ponei", nume: "Ponei curcubeu", culoare: "#f06292", simbol: "PN" },
  { id: "spongebob", nume: "SpongeBob", culoare: "#f9a825", simbol: "SB" },
  { id: "pikachu", nume: "Pikachu", culoare: "#ffeb3b", simbol: "PK" },
  { id: "minion", nume: "Minion", culoare: "#fdd835", simbol: "MN" },
  { id: "dory", nume: "Dory", culoare: "#1565c0", simbol: "DR" },
];

export const CHARACTER_COMPONENTS = {
  batman: BatmanCharacter,
  sarpe: SarpeCharacter,
  liliac: LiliacCharacter,
  ponei: PoneiCharacter,
  spongebob: SpongeBobCharacter,
  pikachu: PikachuCharacter,
  minion: MinionCharacter,
  dory: DoryCharacter,
};

export function getPersonajById(id) {
  return PERSONAJE.find((personaj) => personaj.id === id) || null;
}

export function getCharacterComponent(id) {
  return CHARACTER_COMPONENTS[id] || PikachuCharacter;
}