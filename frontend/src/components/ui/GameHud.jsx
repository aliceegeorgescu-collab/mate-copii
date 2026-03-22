import { memo } from "react";
import ProgressBar from "./ProgressBar";
import ScoreBadge from "./ScoreBadge";

function GameHudComponent({
  onBack,
  timp,
  nr,
  total,
  scor,
  scoreLabel = "Scor",
  progressValue,
  progressMax,
  progressLabel = "Progres",
  secondaryStat,
  light = false,
  extraControl = null,
}) {
  const resolvedProgressValue = progressValue ?? (typeof nr === "number" ? Math.max(0, nr - 1) : 0);
  const resolvedProgressMax = progressMax ?? (typeof total === "number" ? total : 1);
  const hasTimer = typeof timp === "number";
  const hasRound = typeof nr === "number" && typeof total === "number";
  const isTimerCritical = hasTimer && timp <= 5;

  return (
    <div className={`game-status-shell ${light ? "is-light" : ""}`.trim()}>
      <div className="game-status-row">
        <div className="game-status-actions">
          <button className="btn-back" onClick={onBack}>{"<- Inapoi"}</button>
        </div>

        <div className="game-status-metrics">
          {hasTimer ? <div className={`hud-chip ${isTimerCritical ? "is-danger" : ""}`}>Timp {timp}s</div> : null}
          {hasRound ? <div className="hud-chip">Runda {nr}/{total}</div> : null}
          {secondaryStat ? <div className="hud-chip">{secondaryStat.label} {secondaryStat.value}</div> : null}
          {typeof scor === "number" ? <ScoreBadge label={scoreLabel} score={scor} /> : null}
        </div>

        {extraControl ? <div className="game-status-extra">{extraControl}</div> : null}
      </div>

      <ProgressBar value={resolvedProgressValue} max={resolvedProgressMax} label={progressLabel} tone={light ? "sky" : "sun"} />
    </div>
  );
}

const GameHud = memo(GameHudComponent);

export default GameHud;