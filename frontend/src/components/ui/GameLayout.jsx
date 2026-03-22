import { memo } from "react";
import GameHeaderCompact from "./GameHeaderCompact";
import GameAnswerTray from "./GameAnswerTray";
import GameInstructionCard from "./GameInstructionCard";
import ProgressBar from "./ProgressBar";

function GameLayoutComponent({
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
  instruction,
  answerArea,
  light = false,
  className = "",
  sceneClassName = "",
  answerClassName = "",
  children,
}) {
  const resolvedProgressValue = progressValue ?? (typeof nr === "number" ? Math.max(0, nr - 1) : 0);
  const resolvedProgressMax = progressMax ?? (typeof total === "number" ? total : 1);
  const resolvedProgressText = progressText ?? `${resolvedProgressValue}/${resolvedProgressMax}`;

  return (
    <div className={`game-layout ${light ? "is-light" : ""} ${className}`.trim()}>
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

      <div className="game-layout-progress">
        <ProgressBar
          value={resolvedProgressValue}
          max={resolvedProgressMax}
          label={progressLabel}
          valueText={resolvedProgressText}
          compact
          tone={light ? "sky" : "sun"}
        />
      </div>

      <GameInstructionCard text={instruction} light={light} />

      <div className="game-layout-body">
        <div className={`game-layout-scene ${sceneClassName}`.trim()}>{children}</div>
        {answerArea ? <GameAnswerTray className={`game-layout-answer ${answerClassName}`.trim()}>{answerArea}</GameAnswerTray> : null}
      </div>
    </div>
  );
}

const GameLayout = memo(GameLayoutComponent);

export default GameLayout;