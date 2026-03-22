import { memo } from "react";

function GameInstructionCardComponent({ text, light = false, className = "" }) {
  if (!text) {
    return null;
  }

  return <div className={`game-instruction-card ${light ? "is-light" : ""} ${className}`.trim()}>{text}</div>;
}

const GameInstructionCard = memo(GameInstructionCardComponent);

export default GameInstructionCard;