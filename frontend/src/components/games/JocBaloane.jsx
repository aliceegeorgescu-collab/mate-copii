import { memo } from "react";
import GameResultScreen from "./GameResultScreen";
import ConfettiTop from "../ui/ConfettiTop";
import RoundFeedback from "../ui/RoundFeedback";
import GameSpeedControl from "../ui/GameSpeedControl";
import GameLayout from "../ui/GameLayout";
import { useGameEngine } from "../../hooks/useGameEngine";
import useGameMotionSettings from "../../hooks/useGameMotionSettings";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";

function JocBaloaneComponent({
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
    gameId: "baloane",
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

  return (
    <div className={`screen game-screen screen-enter ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" ? <ConfettiTop /> : null}
      {eng.stare === "corect" ? <div className="expand-ring" /> : null}

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        timp={eng.timp}
        nr={eng.nr}
        total={eng.dif.ex}
        scor={eng.scor}
        progressValue={Math.max(0, eng.nr - 1)}
        progressMax={eng.dif.ex}
        progressLabel="Baloane"
        progressText={`${Math.max(0, eng.nr - 1)}/${eng.dif.ex}`}
        control={<GameSpeedControl compact value={motion.speedId} onChange={motion.setSpeed} />}
        instruction="Da click pe balonul corect!"
        sceneClassName="balloon-layout-scene balloon-layout-scene-compact"
        answerClassName="balloon-answer-shell"
        answerArea={(
          <div className="game-answer-grid balloon-answer-grid">
            {eng.optiuni.map((valoare, index) => {
              const isCorrect = eng.stare === "corect" && valoare === eng.q.raspuns;
              const isWrong = eng.stare === "gresit" && valoare === eng.ales;

              return (
                <button
                  key={`${eng.nr}-${index}`}
                  type="button"
                  className={`balloon-answer interactive-target ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`.trim()}
                  onClick={() => {
                    motion.dismissHint();
                    eng.raspunde(valoare);
                  }}
                  disabled={eng.stare !== "idle"}
                >
                  <span className="balloon-answer-bubble" aria-hidden="true">{"🎈"}</span>
                  <span className="balloon-answer-value">{valoare}</span>
                </button>
              );
            })}
          </div>
        )}
      >
        <RoundFeedback stare={eng.stare} />

        <div className="balloon-question-card screen-enter">
          <div className="balloon-question-kicker">Alege raspunsul bun</div>
          <div className="balloon-question-text">Cat face: {eng.q.a} {eng.q.op} {eng.q.b}?</div>
        </div>

        <div className="balloon-playfield" aria-hidden="true">
          <span className="balloon-cloud cloud-a">{"☁️"}</span>
          <span className="balloon-cloud cloud-b">{"☁️"}</span>
          <span className="balloon-cloud cloud-c">{"☁️"}</span>
          <span className="balloon-star star-a">{"✨"}</span>
          <span className="balloon-star star-b">{"⭐"}</span>
        </div>
      </GameLayout>
    </div>
  );
}

const JocBaloane = memo(JocBaloaneComponent);

export default JocBaloane;