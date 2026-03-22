import { memo } from "react";
import GameHeaderCompact from "./GameHeaderCompact";
import GameAnswerTray from "./GameAnswerTray";
import GameInstructionCard from "./GameInstructionCard";
import GameScreen from "./GameScreen";
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
    <GameScreen
      className={`game-layout ${className}`.trim()}
      light={light}
      header={(
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
      )}
      progress={(
        <ProgressBar
          value={resolvedProgressValue}
          max={resolvedProgressMax}
          label={progressLabel}
          valueText={resolvedProgressText}
          compact
          tone={light ? "sky" : "sun"}
        />
      )}
      instruction={<GameInstructionCard text={instruction} light={light} />}
      answers={answerArea ? <GameAnswerTray className={`game-layout-answer ${answerClassName}`.trim()}>{answerArea}</GameAnswerTray> : null}
    >
      <div className={`game-layout-scene ${sceneClassName}`.trim()}>{children}</div>
    </GameScreen>
  );
}

const GameLayout = memo(GameLayoutComponent);

export default GameLayout;