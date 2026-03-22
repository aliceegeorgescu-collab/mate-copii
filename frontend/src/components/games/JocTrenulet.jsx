import { memo, useMemo } from "react";
import GameResultScreen from "./GameResultScreen";
import ConfettiTop from "../ui/ConfettiTop";
import RoundFeedback from "../ui/RoundFeedback";
import GameSpeedControl from "../ui/GameSpeedControl";
import GameLayout from "../ui/GameLayout";
import { useGameEngine } from "../../hooks/useGameEngine";
import useGameMotionSettings from "../../hooks/useGameMotionSettings";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";

function JocTrenuletComponent({
  personaj,
  dificultate,
  onBack,
  peGata,
  sunetActivat,
  gamePreferences,
  onSetGameSpeed,
  onMarkGameHintSeen,
  onAwardStars,
  onRecordResult,
}) {
  const eng = useGameEngine(dificultate, { sunetActivat });
  const motion = useGameMotionSettings({
    gameId: "trenulet",
    gamePreferences,
    onSetGameSpeed,
    onMarkGameHintSeen,
  });

  const totalStatii = eng.dif.ex;
  const trainStep = eng.stare === "corect" ? Math.min(eng.nr, totalStatii - 1) : Math.max(0, eng.nr - 1);
  const trainProgress = totalStatii <= 1 ? 0 : trainStep / (totalStatii - 1);
  const statii = useMemo(
    () => Array.from({ length: totalStatii }, (_, index) => ({
      id: index + 1,
      stare: index < trainStep ? "passed" : index === trainStep ? "active" : "upcoming",
    })),
    [totalStatii, trainStep]
  );

  if (eng.stare === "gata") {
    return (
      <GameResultScreen
        scor={eng.scor}
        max={eng.dif.ex}
        personaj={personaj}
        onBack={peGata}
        onAwardStars={onAwardStars}
        onRecordResult={onRecordResult}
      />
    );
  }

  return (
    <div className={`screen game-screen screen-enter ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" ? <ConfettiTop /> : null}

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        timp={eng.timp}
        nr={eng.nr}
        total={eng.dif.ex}
        scor={eng.scor}
        progressValue={Math.max(0, eng.nr - 1)}
        progressMax={eng.dif.ex}
        progressLabel="Traseu"
        progressText={`${Math.max(0, eng.nr - 1)}/${eng.dif.ex}`}
        control={<GameSpeedControl compact value={motion.speedId} onChange={motion.setSpeed} />}
        instruction="Da click pe raspunsul corect!"
        sceneClassName="train-layout-scene"
        answerArea={(
          <div className="game-answer-grid train-answer-grid">
            {eng.optiuni.map((valoare) => (
              <button
                key={valoare}
                className={`btn-train-opt interactive-target ${eng.stare === "gresit" && valoare === eng.ales ? "is-wrong" : ""}`.trim()}
                onClick={() => {
                  motion.dismissHint();
                  eng.raspunde(valoare);
                }}
                disabled={eng.stare !== "idle"}
              >
                {valoare}
              </button>
            ))}
          </div>
        )}
      >
        <RoundFeedback stare={eng.stare} />

        <div className="train-question-card screen-enter">
          <div className="train-question-kicker">Statia {eng.nr}</div>
          <div className="train-question-text">{eng.q.a} {eng.q.op} {eng.q.b} = ?</div>
        </div>

        <div
          className="train-route-card"
          style={{
            "--train-progress": trainProgress,
            "--route-duration": `${Math.max(0.8, motion.speed.routeSeconds * 0.25)}s`,
          }}
        >
          <div className="train-route-line" aria-hidden="true" />
          <div className="train-route-rail top" aria-hidden="true" />
          <div className="train-route-rail bottom" aria-hidden="true" />

          <div className="train-station-row" aria-hidden="true">
            {statii.map((statie) => (
              <div key={statie.id} className={`train-station-stop is-${statie.stare}`}>
                <span className="train-station-dot" />
                <span className="train-station-label">{statie.id}</span>
              </div>
            ))}
          </div>

          <div className={`train-engine ${eng.stare === "corect" ? "is-celebrating" : ""}`.trim()}>
            <span className="train-engine-body">{"🚂"}</span>
            {eng.stare === "corect" ? <span className="train-engine-spark">{"✨"}</span> : null}
          </div>
        </div>
      </GameLayout>
    </div>
  );
}

const JocTrenulet = memo(JocTrenuletComponent);

export default JocTrenulet;