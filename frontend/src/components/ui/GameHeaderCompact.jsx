import { memo } from "react";

function StatChip({ icon, children, isDanger = false }) {
  return (
    <div className={`game-header-chip ${isDanger ? "is-danger" : ""}`.trim()}>
      <span className="game-header-chip-icon" aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function GameHeaderCompactComponent({
  onBack,
  timp,
  nr,
  total,
  scor,
  scoreLabel = "Scor",
  secondaryStat,
  control,
  light = false,
}) {
  const isTimerCritical = typeof timp === "number" && timp <= 5;

  return (
    <div className={`game-header-compact ${light ? "is-light" : ""}`.trim()}>
      <button className="game-back-mini" onClick={onBack}>{"<- Inapoi"}</button>

      <div className="game-header-chip-row">
        {typeof timp === "number" ? <StatChip icon={"\u23F1\uFE0F"} isDanger={isTimerCritical}>Timp: {timp}s</StatChip> : null}
        {typeof nr === "number" && typeof total === "number" ? <StatChip icon={"\uD83C\uDFC1"}>Runda: {nr} din {total}</StatChip> : null}
        {secondaryStat ? <StatChip icon={"\u2728"}>{secondaryStat.label}: {secondaryStat.value}</StatChip> : null}
        {typeof scor === "number" ? <StatChip icon={"\u2B50"}>{scoreLabel}: {scor}</StatChip> : null}
      </div>

      {control ? <div className="game-header-control">{control}</div> : null}
    </div>
  );
}

const GameHeaderCompact = memo(GameHeaderCompactComponent);

export default GameHeaderCompact;