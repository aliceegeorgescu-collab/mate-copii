import { memo } from "react";
import { GAME_SPEED_OPTIONS } from "../../hooks/useGameMotionSettings";

function GameSpeedControlComponent({ value = "incet", onChange, light = false, compact = false }) {
  return (
    <div className={`game-speed-control ${light ? "is-light" : ""} ${compact ? "is-compact" : ""}`.trim()}>
      {compact ? null : <span className="game-speed-label">Viteza jocului</span>}
      <div className="game-speed-options">
        {GAME_SPEED_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`game-speed-chip ${value === option.id ? "is-active" : ""}`.trim()}
            onClick={() => onChange?.(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const GameSpeedControl = memo(GameSpeedControlComponent);

export default GameSpeedControl;