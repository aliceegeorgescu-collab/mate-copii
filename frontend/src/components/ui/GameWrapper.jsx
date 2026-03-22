import { memo } from "react";
import GameHeaderCompact from "./GameHeaderCompact";
import GameAnswerTray from "./GameAnswerTray";
import ProgressBar from "./ProgressBar";

function GameWrapperComponent({
  onBack,
  timp,
  nr,
  total,
  scor,
  scoreLabel = "Scor",
  progressValue,
  progressMax,
  progressLabel = "Progres",
  progressText,
  secondaryStat,
  control,
  answerArea,
  light = false,
  className = "",
  areaClassName = "",
  children,
}) {
  const resolvedProgressValue = progressValue ?? (typeof nr === "number" ? Math.max(0, nr - 1) : 0);
  const resolvedProgressMax = progressMax ?? (typeof total === "number" ? total : 1);
  const resolvedProgressText = progressText ?? `${resolvedProgressValue}/${resolvedProgressMax}`;

  return (
    <div className={`game-wrapper ${light ? "is-light" : ""} ${className}`.trim()}>
      <GameHeaderCompact
        onBack={onBack}
        timp={timp}
        nr={nr}
        total={total}
        scor={scor}
        scoreLabel={scoreLabel}
        secondaryStat={secondaryStat}
        control={control}
        light={light}
      />

      <div className="game-wrapper-progress">
        <ProgressBar
          value={resolvedProgressValue}
          max={resolvedProgressMax}
          label={progressLabel}
          valueText={resolvedProgressText}
          compact
          tone={light ? "sky" : "sun"}
        />
      </div>

      <div className="game-wrapper-body">
        <div className={`game-wrapper-area ${areaClassName}`.trim()}>{children}</div>
        {answerArea ? <GameAnswerTray>{answerArea}</GameAnswerTray> : null}
      </div>
    </div>
  );
}

const GameWrapper = memo(GameWrapperComponent);

export default GameWrapper;