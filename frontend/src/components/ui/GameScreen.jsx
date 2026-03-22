import { memo } from "react";

function GameScreenComponent({
  header,
  progress,
  instruction,
  answers,
  light = false,
  className = "",
  children,
}) {
  return (
    <div className={`game-screen-shell ${light ? "is-light" : ""} ${className}`.trim()}>
      {header ? <div className="game-screen-header">{header}</div> : null}
      {progress ? <div className="game-screen-progress">{progress}</div> : null}
      {instruction ? <div className="game-screen-instruction">{instruction}</div> : null}
      <div className="game-screen-content">{children}</div>
      {answers ? <div className="game-screen-answers">{answers}</div> : null}
    </div>
  );
}

const GameScreen = memo(GameScreenComponent);

export default GameScreen;