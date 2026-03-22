import { memo } from "react";
import GameResultScreen from "./GameResultScreen";
import ConfettiTop from "../ui/ConfettiTop";
import RoundFeedback from "../ui/RoundFeedback";
import GameSpeedControl from "../ui/GameSpeedControl";
import GameLayout from "../ui/GameLayout";
import { useGameEngine } from "../../hooks/useGameEngine";
import useGameMotionSettings from "../../hooks/useGameMotionSettings";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";

function JocRachetaComponent({
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
    gameId: "racheta",
    gamePreferences,
    onSetGameSpeed,
    onMarkGameHintSeen,
  });

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

  const missionStep = eng.stare === "corect" ? eng.nr : Math.max(0, eng.nr - 1);
  const missionProgress = eng.dif.ex <= 1 ? 0 : missionStep / Math.max(1, eng.dif.ex - 1);

  return (
    <div className={`screen game-screen bg-space screen-enter ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" ? <ConfettiTop /> : null}

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        timp={eng.timp}
        nr={eng.nr}
        total={eng.dif.ex}
        scor={eng.scor}
        progressValue={Math.max(0, eng.nr - 1)}
        progressMax={eng.dif.ex}
        progressLabel="Misiuni"
        progressText={`${Math.max(0, eng.nr - 1)}/${eng.dif.ex}`}
        control={<GameSpeedControl compact value={motion.speedId} onChange={motion.setSpeed} light />}
        instruction="Da click pe numarul corect!"
        light
        sceneClassName="rocket-layout-scene rocket-layout-scene-compact"
        answerClassName="rocket-answer-shell"
        answerArea={(
          <div className="game-answer-grid rocket-answer-grid">
            {eng.optiuni.map((valoare) => {
              const isCorrect = eng.stare === "corect" && valoare === eng.q.raspuns;
              const isWrong = eng.stare === "gresit" && valoare === eng.ales;

              return (
                <button
                  key={valoare}
                  className={`btn-rocket-opt interactive-target ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`.trim()}
                  onClick={() => {
                    motion.dismissHint();
                    eng.raspunde(valoare);
                  }}
                  disabled={eng.stare !== "idle"}
                >
                  {valoare}
                </button>
              );
            })}
          </div>
        )}
      >
        <RoundFeedback stare={eng.stare} />

        <div className="rocket-question-card screen-enter text-white">
          <div className="rocket-question-kicker">Misiunea {eng.nr}</div>
          <div className="rocket-question-text">{eng.q.a} {eng.q.op} {eng.q.b} = ?</div>
        </div>

        <div className="rocket-playfield" style={{ "--rocket-progress": missionProgress, "--rocket-flight-duration": `${Math.max(1, motion.speed.routeSeconds * 0.24)}s` }}>
          <span className="space-star star-a">{"⭐"}</span>
          <span className="space-star star-b">{"✨"}</span>
          <span className="space-star star-c">{"🌟"}</span>

          <div className="rocket-launch-lane" aria-hidden="true">
            <div className="rocket-destination">{"🌟"}</div>
            <div className="rocket-trail" />
            <div className={`rocket-ship ${eng.stare === "corect" ? "is-boosting" : ""}`.trim()}>
              <span className="rocket-ship-body">{"🚀"}</span>
              <span className="rocket-ship-flame">{"🔥"}</span>
            </div>
          </div>
        </div>
      </GameLayout>
    </div>
  );
}

const JocRacheta = memo(JocRachetaComponent);

export default JocRacheta;