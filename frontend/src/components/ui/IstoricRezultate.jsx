import { memo } from "react";
import { DIFICULTATI } from "../../utils/gameConfig";
import { formatDateLabel, formatGameLabel } from "../../utils/formatters";

function IstoricRezultateComponent({ history }) {
  if (!history.length) {
    return <div className="istoric-empty">Încă nu există rezultate salvate pentru acest copil.</div>;
  }

  return (
    <div className="istoric-list">
      {history.slice(0, 6).map((entry) => (
        <div key={entry.id} className="istoric-item">
          <span>{formatGameLabel(entry.jocId)}</span>
          <span>{DIFICULTATI[entry.dificultate]?.label ?? entry.dificultate}</span>
          <span>{entry.scor}/{entry.maxExercitii}</span>
          <span>{formatDateLabel(entry.playedAt)}</span>
        </div>
      ))}
    </div>
  );
}

const IstoricRezultate = memo(IstoricRezultateComponent);

export default IstoricRezultate;
