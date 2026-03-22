import { memo, useEffect, useMemo, useState } from "react";
import GameResultScreen from "./GameResultScreen";
import ConfettiTop from "../ui/ConfettiTop";
import RoundFeedback from "../ui/RoundFeedback";
import GameSpeedControl from "../ui/GameSpeedControl";
import GameLayout from "../ui/GameLayout";
import { useGameEngine } from "../../hooks/useGameEngine";
import useGameMotionSettings from "../../hooks/useGameMotionSettings";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";
import { getPersonajSimbol } from "../../utils/formatters";

function JocCursaComponent({
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
    gameId: "cursa",
    gamePreferences,
    onSetGameSpeed,
    onMarkGameHintSeen,
  });
  const [compP, setCompP] = useState(0);

  useEffect(() => {
    setCompP(0);
  }, [dificultate]);

  useEffect(() => {
    if (eng.stare === "gata" || eng.stare !== "idle") {
      return undefined;
    }

    const baseStep = dificultate === "usor" ? 1.6 : dificultate === "mediu" ? 2.2 : 3;
    const interval = window.setInterval(() => {
      setCompP((current) => Math.min(100, current + baseStep * motion.speed.rivalStepFactor));
    }, motion.speed.rivalTickMs);

    return () => window.clearInterval(interval);
  }, [dificultate, eng.stare, motion.speed.rivalStepFactor, motion.speed.rivalTickMs]);

  const playerP = ((eng.nr - 1) / eng.dif.ex) * 100;
  const positions = useMemo(() => {
    const playerLeads = playerP >= compP;
    return {
      player: playerLeads ? 1 : 2,
      rival: playerLeads ? 2 : 1,
    };
  }, [playerP, compP]);

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
    <div className={`screen game-screen bg-env screen-enter ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" ? <ConfettiTop /> : null}

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        timp={eng.timp}
        nr={eng.nr}
        total={eng.dif.ex}
        scor={eng.scor}
        progressValue={Math.max(0, eng.nr - 1)}
        progressMax={eng.dif.ex}
        progressLabel="Tururi"
        progressText={`${Math.max(0, eng.nr - 1)}/${eng.dif.ex}`}
        secondaryStat={{ label: "Pozitii", value: `Tu ${positions.player} • Rival ${positions.rival}` }}
        control={<GameSpeedControl compact value={motion.speedId} onChange={motion.setSpeed} />}
        instruction="Da click pe raspuns ca sa accelerezi!"
        sceneClassName="race-layout-scene"
        answerArea={(
          <div className="game-answer-grid race-answer-grid">
            {eng.optiuni.map((valoare) => {
              const isCorrect = eng.stare === "corect" && valoare === eng.q.raspuns;
              const isWrong = eng.stare === "gresit" && valoare === eng.ales;

              return (
                <button
                  key={valoare}
                  className={`btn-train-opt interactive-target ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`.trim()}
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

        <div className="race-question-card screen-enter">
          <div className="race-question-kicker">Cursa {eng.nr}</div>
          <div className="race-question-text">Cat face: {eng.q.a} {eng.q.op} {eng.q.b}?</div>
        </div>

        <div className="race-playfield">
          <div className="race-status-board">
            <div className="race-status-row-mini">
              <span>Tu</span>
              <div className="race-status-track"><div className="race-status-fill player" style={{ width: `${playerP}%` }} /></div>
              <strong>Loc {positions.player}</strong>
            </div>
            <div className="race-status-row-mini rival">
              <span>Rival</span>
              <div className="race-status-track"><div className="race-status-fill rival" style={{ width: `${compP}%` }} /></div>
              <strong>Loc {positions.rival}</strong>
            </div>
          </div>

          <div className="race-track-modern">
            <div className="race-finish-flag">FINISH</div>

            <div className="race-lane-modern player">
              <div className="race-lane-dashes" aria-hidden="true" />
              <div className="race-racer-modern player" style={{ left: `${playerP}%`, "--route-duration": `${motion.speed.routeSeconds}s` }}>
                <span className="race-car-emoji">{"🏎️"}</span>
                <span className="race-car-tag">{getPersonajSimbol(personaj)}</span>
              </div>
            </div>

            <div className="race-lane-modern rival">
              <div className="race-lane-dashes" aria-hidden="true" />
              <div className="race-racer-modern rival" style={{ left: `${compP}%`, "--route-duration": `${motion.speed.routeSeconds}s` }}>
                <span className="race-car-emoji">{"🚗"}</span>
                <span className="race-car-tag rival">PC</span>
              </div>
            </div>
          </div>
        </div>
      </GameLayout>
    </div>
  );
}

const JocCursa = memo(JocCursaComponent);

export default JocCursa;