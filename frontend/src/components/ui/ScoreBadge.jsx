import { memo, useEffect, useState } from "react";

function ScoreBadgeComponent({ label = "Scor", score = 0, icon = "*", className = "" }) {
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    setIsBouncing(true);
    const timeoutId = window.setTimeout(() => setIsBouncing(false), 360);

    return () => window.clearTimeout(timeoutId);
  }, [score]);

  return (
    <div className={`score-badge ${isBouncing ? "is-bouncing" : ""} ${className}`.trim()}>
      <span className="score-badge-icon" aria-hidden="true">{icon}</span>
      <span className="score-badge-label">{label}</span>
      <strong className="score-badge-value">{score}</strong>
    </div>
  );
}

const ScoreBadge = memo(ScoreBadgeComponent);

export default ScoreBadge;