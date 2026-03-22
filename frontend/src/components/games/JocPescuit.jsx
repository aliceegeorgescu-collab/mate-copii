import { memo } from "react";
import GameResultScreen from "./GameResultScreen";
import ConfettiTop from "../ui/ConfettiTop";
import RoundFeedback from "../ui/RoundFeedback";
import GameSpeedControl from "../ui/GameSpeedControl";
import GameLayout from "../ui/GameLayout";
import { useGameEngine } from "../../hooks/useGameEngine";
import useGameMotionSettings from "../../hooks/useGameMotionSettings";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";

function JocPescuitComponent({
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
    gameId: "pescuit",
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
    <div className={`screen game-screen bg-water screen-enter ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" ? <ConfettiTop /> : null}

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        timp={eng.timp}
        nr={eng.nr}
        total={eng.dif.ex}
        scor={eng.scor}
        progressValue={Math.max(0, eng.nr - 1)}
        progressMax={eng.dif.ex}
        progressLabel="Capturi"
        progressText={`${Math.max(0, eng.nr - 1)}/${eng.dif.ex}`}
        control={<GameSpeedControl compact value={motion.speedId} onChange={motion.setSpeed} />}
        instruction="Da click pe pestele potrivit!"
        sceneClassName="fishing-layout-scene fishing-layout-scene-compact"
        answerClassName="fishing-answer-shell"
        answerArea={(
          <div className="game-answer-grid fishing-answer-grid">
            {eng.optiuni.map((valoare) => {
              const isCorrect = eng.stare === "corect" && valoare === eng.q.raspuns;
              const isWrong = eng.stare === "gresit" && valoare === eng.ales;

              return (
                <button
                  key={valoare}
                  type="button"
                  className={`fishing-answer interactive-target ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`.trim()}
                  onClick={() => {
                    motion.dismissHint();
                    eng.raspunde(valoare);
                  }}
                  disabled={eng.stare !== "idle"}
                >
                  <span className="fishing-answer-fish" aria-hidden="true">{"🐟"}</span>
                  <span className="fishing-answer-value">{valoare}</span>
                </button>
              );
            })}
          </div>
        )}
      >
        <RoundFeedback stare={eng.stare} />

        <div className="fishing-question-card screen-enter">
          <div className="fishing-question-kicker">Pescuitul Numerelor</div>
          <div className="fishing-question-text">Prinde pestele cu: {eng.q.a} {eng.q.op} {eng.q.b}</div>
        </div>

        <div className="fishing-playfield">
          <div className="fishing-boat">{"⛵"}</div>
          <div className="fishing-ripple ripple-a" />
          <div className="fishing-ripple ripple-b" />
          <div className="fishing-ripple ripple-c" />
          <span className="fishing-bubble bubble-a">{"🫧"}</span>
          <span className="fishing-bubble bubble-b">{"🫧"}</span>
          <span className="fishing-bubble bubble-c">{"🫧"}</span>
          <span className="fishing-deco fish-a">{"🐠"}</span>
          <span className="fishing-deco fish-b">{"🐡"}</span>
          <span className="fishing-deco fish-c">{"🐟"}</span>
        </div>
      </GameLayout>
    </div>
  );
}

const JocPescuit = memo(JocPescuitComponent);

export default JocPescuit;