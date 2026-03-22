import { memo } from "react";
import { DIFICULTATI } from "../../utils/gameConfig";

const descrieri = {
  labirint_batman: {
    usor: "Labirint 5x5 - 90 secunde - mai putini pereti",
    mediu: "Labirint 7x7 - 60 secunde",
    greu: "Labirint 9x9 - 45 secunde - multi pereti",
  },
  gradinita_vesela: {
    usor: "4 runde - culori si forme simple",
    mediu: "6 runde - mai multa varietate",
    greu: "8 runde - pana la 5 animale si toate formele",
  },
};

function SelectDificultateComponent({ jocId, onSelect, onBack }) {
  const esteLabirint = jocId === "labirint_batman";
  const esteGradinita = jocId === "gradinita_vesela";

  return (
    <div className="screen center-screen z-front screen-enter">
      <div className="top-bar w-full"><button className="btn-back" onClick={onBack}>{"<- Inapoi"}</button></div>
      <h2 className="titlu-mediu wobble">Alege dificultatea</h2>
      <div className="dif-box-grid">
        {Object.entries(DIFICULTATI).map(([key, value]) => (
          <button key={key} className={`dif-card dif-${key} bounce-on-hover`} onClick={() => onSelect(key)}>
            <h3>{value.label}</h3>
            {esteLabirint || esteGradinita ? (
              <p>{descrieri[jocId]?.[key]}</p>
            ) : (
              <>
                <p>Timp: {value.timp} secunde / exercitiu</p>
                <p>Exercitii: {value.ex}</p>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const SelectDificultate = memo(SelectDificultateComponent);

export default SelectDificultate;