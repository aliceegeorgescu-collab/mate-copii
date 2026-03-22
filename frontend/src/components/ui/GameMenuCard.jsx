import { memo } from "react";

function PreviewScene({ gameId, icon }) {
  switch (gameId) {
    case "baloane":
      return (
        <div className="game-preview preview-baloane">
          <span className="preview-item balloon a">{"\uD83C\uDF88"}</span>
          <span className="preview-item balloon b">{"\uD83C\uDF88"}</span>
          <span className="preview-item balloon c">{"\uD83C\uDF88"}</span>
        </div>
      );
    case "trenulet":
      return (
        <div className="game-preview preview-trenulet">
          <span className="preview-item train">{"\uD83D\uDE82"}</span>
          <span className="preview-item smoke">{"\uD83D\uDCA8"}</span>
          <span className="preview-track" />
        </div>
      );
    case "pescuit":
      return (
        <div className="game-preview preview-pescuit">
          <span className="preview-item fish one">{"\uD83D\uDC1F"}</span>
          <span className="preview-item fish two">{"\uD83D\uDC20"}</span>
          <span className="preview-item bubble">{"\uD83E\uDEE7"}</span>
        </div>
      );
    case "racheta":
      return (
        <div className="game-preview preview-racheta">
          <span className="preview-item rocket">{"\uD83D\uDE80"}</span>
          <span className="preview-item star one">{"\u2728"}</span>
          <span className="preview-item star two">{"\uD83C\uDF1F"}</span>
        </div>
      );
    case "cursa":
      return (
        <div className="game-preview preview-cursa">
          <span className="preview-item car red">{"\uD83C\uDFCE\uFE0F"}</span>
          <span className="preview-item car blue">{"\uD83D\uDE99"}</span>
          <span className="preview-road" />
        </div>
      );
    case "labirint_batman":
      return (
        <div className="game-preview preview-labirint">
          <div className="maze-mini-grid">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className={`maze-mini-cell ${index === 0 ? "start" : ""} ${index === 8 ? "goal" : ""}`} />
            ))}
          </div>
          <span className="preview-item batman">{"\uD83E\uDD87"}</span>
        </div>
      );
    case "gradinita_vesela":
      return (
        <div className="game-preview preview-gradinita">
          <span className="preview-item teddy">{"\uD83E\uDDF8"}</span>
          <span className="preview-item shape heart">{"\u2764"}</span>
          <span className="preview-item shape star">{"\u2605"}</span>
        </div>
      );
    default:
      return (
        <div className="game-preview preview-generic">
          <span className="preview-item generic-icon">{icon}</span>
        </div>
      );
  }
}

function calcStarCount(stats) {
  if (!stats?.bestMax) return 0;

  const ratio = stats.bestScore / stats.bestMax;
  if (ratio >= 1) return 3;
  if (ratio >= 0.67) return 2;
  return 1;
}

function GameMenuCardComponent({ game, stats, onSelect, index = 0 }) {
  const wasPlayed = Boolean(stats?.count);
  const starCount = calcStarCount(stats);
  const bestLabel = wasPlayed ? `Record ${stats.bestScore}/${stats.bestMax}` : "Nou";

  return (
    <button
      className={`game-menu-card ${wasPlayed ? "is-played" : "is-new"}`}
      onClick={() => onSelect(game.id)}
      style={{ background: game.bg, "--game-accent": game.accent, "--card-delay": `${index * 0.1}s` }}
    >
      <div className="game-menu-top">
        <span className={`game-menu-badge ${wasPlayed ? "is-played" : "is-new"}`}>
          <span aria-hidden="true">{wasPlayed ? "\u2713" : "\u2728"}</span>
          <span>{wasPlayed ? "Jucat" : "Nou"}</span>
        </span>
        <span className="game-menu-icon">{game.icon}</span>
      </div>

      {wasPlayed ? (
        <div className="game-menu-stars" aria-label={`${starCount} stele castigate`}>
          {Array.from({ length: starCount }).map((_, starIndex) => (
            <span key={starIndex} className="game-menu-star" aria-hidden="true">{"\u2B50"}</span>
          ))}
        </div>
      ) : null}

      <PreviewScene gameId={game.id} icon={game.icon} />

      <div className="game-menu-content">
        <span className="game-menu-title">{game.nume}</span>
        <span className="game-menu-meta">{bestLabel}</span>
        <span className="game-menu-foot">
          {wasPlayed ? `${stats.count} runde jucate` : "Pregatit pentru prima joaca"}
        </span>
      </div>
    </button>
  );
}

const GameMenuCard = memo(GameMenuCardComponent);

export default GameMenuCard;