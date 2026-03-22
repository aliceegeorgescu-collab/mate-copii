import { memo } from "react";

function GameAnswerTrayComponent({ children, className = "" }) {
  return <div className={`game-answer-tray ${className}`.trim()}>{children}</div>;
}

const GameAnswerTray = memo(GameAnswerTrayComponent);

export default GameAnswerTray;