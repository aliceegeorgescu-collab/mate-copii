import { memo, useEffect, useMemo, useRef, useState } from "react";
import CelebrationBurst from "../ui/CelebrationBurst";
import GameLayout from "../ui/GameLayout";
import { buildKindergartenRound } from "../../utils/kindergartenRounds";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";
import { rand } from "../../utils/random";

function BearGuide({ mood }) {
  return (
    <svg viewBox="0 0 180 180" className={`bear-guide ${mood}`}>
      <ellipse cx="90" cy="158" rx="34" ry="8" fill="rgba(0,0,0,0.12)" />
      <circle cx="58" cy="50" r="16" fill="#8d6e63" />
      <circle cx="122" cy="50" r="16" fill="#8d6e63" />
      <circle cx="58" cy="50" r="8" fill="#d7ccc8" />
      <circle cx="122" cy="50" r="8" fill="#d7ccc8" />
      <circle cx="90" cy="80" r="44" fill="#8d6e63" />
      <ellipse cx="90" cy="134" rx="38" ry="28" fill="#8d6e63" />
      <ellipse cx="90" cy="88" rx="20" ry="15" fill="#f5e0c8" />
      <circle cx="74" cy="74" r="7" fill="#fff" />
      <circle cx="106" cy="74" r="7" fill="#fff" />
      <circle cx="74" cy="75" r="3" fill="#3e2723" />
      <circle cx="106" cy="75" r="3" fill="#3e2723" />
      <ellipse cx="90" cy="87" rx="5" ry="4" fill="#3e2723" />
      <path d="M78 97 Q90 108 102 97" stroke="#5d4037" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M64 132 C54 120 48 138 56 148" stroke="#8d6e63" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M116 132 C126 120 132 138 124 148" stroke="#8d6e63" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M78 154 L72 172" stroke="#6d4c41" strokeWidth="12" strokeLinecap="round" />
      <path d="M102 154 L108 172" stroke="#6d4c41" strokeWidth="12" strokeLinecap="round" />
      <circle cx="66" cy="102" r="4" fill="#f8bbd0" />
      <circle cx="114" cy="102" r="4" fill="#f8bbd0" />
    </svg>
  );
}

function ShapeIcon({ shape, size = 84, big = false }) {
  const stroke = big ? 6 : 4;
  const gradientId = `shape-${shape.id}-${size}-${big ? "b" : "s"}`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shape.color} />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {shape.id === "cerc" ? <circle cx="50" cy="50" r="28" fill={`url(#${gradientId})`} stroke={shape.color} strokeWidth={stroke} /> : null}
      {shape.id === "patrat" ? <rect x="24" y="24" width="52" height="52" rx="8" fill={`url(#${gradientId})`} stroke={shape.color} strokeWidth={stroke} /> : null}
      {shape.id === "triunghi" ? <polygon points="50,18 82,76 18,76" fill={`url(#${gradientId})`} stroke={shape.color} strokeWidth={stroke} strokeLinejoin="round" /> : null}
      {shape.id === "stea" ? <polygon points="50,14 60,38 86,38 66,54 74,82 50,66 26,82 34,54 14,38 40,38" fill={`url(#${gradientId})`} stroke={shape.color} strokeWidth={stroke} strokeLinejoin="round" /> : null}
      {shape.id === "inima" ? <path d="M50 80 C20 60 14 34 30 24 C40 18 48 24 50 30 C52 24 60 18 70 24 C86 34 80 60 50 80Z" fill={`url(#${gradientId})`} stroke={shape.color} strokeWidth={stroke} strokeLinejoin="round" /> : null}
    </svg>
  );
}

function KindergartenResultScreen({ rezultat, onBack, onAwardStars, onRecordResult }) {
  const awardedRef = useRef(false);

  useEffect(() => {
    if (awardedRef.current) return;
    awardedRef.current = true;

    if (onAwardStars && rezultat.stele > 0) {
      onAwardStars(rezultat.stele);
    }

    if (onRecordResult) {
      onRecordResult({ scor: rezultat.scor, max: rezultat.maxim });
    }
  }, [onAwardStars, onRecordResult, rezultat]);

  return (
    <div className="screen center-screen z-front screen-enter grad-result-bg">
      <CelebrationBurst variant="kind" />
      <div className="kind-result-card">
        <BearGuide mood="dance" />
        <h1 className="titlu-mare">Bravo!</h1>
        <p className="kind-result-copy">Ai terminat toate jocurile din Gradinita Vesela.</p>
        <div className="kind-result-stats">
          <span>Stele castigate: <strong>{rezultat.stele}</strong></span>
          <span>Raspunsuri corecte: <strong>{rezultat.scor}</strong> din {rezultat.maxim}</span>
        </div>
        <button className="btn-maine bounce-on-hover" onClick={onBack}>{"<- Meniu principal"}</button>
      </div>
    </div>
  );
}

function getInstruction(roundType) {
  if (roundType === "culoare") return "Apasa culoarea potrivita!";
  if (roundType === "animale") return "Numara animalele si apasa numarul bun!";
  return "Gaseste forma identica!";
}

function JocGradinitaVeselaComponent({ dificultate, onBack, peGata, onAwardStars, onRecordResult }) {
  const totalRounds = dificultate === "usor" ? 4 : dificultate === "mediu" ? 6 : 8;
  const [roundIndex, setRoundIndex] = useState(1);
  const [round, setRound] = useState(() => buildKindergartenRound(dificultate));
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackKind, setFeedbackKind] = useState("idle");
  const [result, setResult] = useState(null);
  const [revealedCount, setRevealedCount] = useState(round.type === "animale" ? 0 : round.animals?.length || 0);
  const previousTypeRef = useRef(round.type);

  useEffect(() => {
    if (round.type !== "animale") {
      setRevealedCount(round.animals?.length || 0);
      return undefined;
    }

    setRevealedCount(0);
    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setRevealedCount(current);
      if (current >= round.animals.length) {
        window.clearInterval(interval);
      }
    }, 380);

    return () => window.clearInterval(interval);
  }, [round]);

  function nextRound(nextStars) {
    if (roundIndex >= totalRounds) {
      setResult({ scor: nextStars, maxim: totalRounds, stele: nextStars });
      return;
    }

    const next = buildKindergartenRound(dificultate, previousTypeRef.current);
    previousTypeRef.current = next.type;
    setRound(next);
    setRoundIndex((current) => current + 1);
    setFeedback("");
    setFeedbackKind("idle");
  }

  function onCorrect() {
    const cheers = ["BRAVO!", "SUPER!", "ESTI CEL MAI BUN!"];
    const nextStars = stars + 1;
    setStars(nextStars);
    setFeedback(cheers[rand(0, cheers.length - 1)]);
    setFeedbackKind("correct");

    window.setTimeout(() => {
      nextRound(nextStars);
    }, 1000);
  }

  function onWrong() {
    setFeedback("Mai incearca!");
    setFeedbackKind("wrong");
    window.setTimeout(() => {
      setFeedback("");
      setFeedbackKind("idle");
    }, 700);
  }

  const instruction = useMemo(() => getInstruction(round.type), [round.type]);

  if (result) {
    return <KindergartenResultScreen rezultat={result} onBack={peGata} onAwardStars={onAwardStars} onRecordResult={onRecordResult} />;
  }

  const visibleAnimals = round.type === "animale" ? round.animals.slice(0, revealedCount) : [];

  let answerArea = null;

  if (round.type === "culoare") {
    answerArea = (
      <div className="kind-options kind-color-options kind-answer-tray-grid">
        {round.options.map((option) => (
          <button
            key={option.id}
            className="kind-option-button color"
            style={{ background: option.color, borderColor: option.border || option.color }}
            onClick={() => (option.id === round.target.id ? onCorrect() : onWrong())}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  if (round.type === "animale") {
    answerArea = (
      <div className="kind-options kind-number-options kind-answer-tray-grid">
        {round.options.map((option) => (
          <button key={option} className="kind-option-button number" onClick={() => (option === round.answer ? onCorrect() : onWrong())}>
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (round.type === "forma") {
    answerArea = (
      <div className="kind-options kind-shape-options kind-answer-tray-grid">
        {round.options.map((option) => (
          <button key={option.id} className="kind-option-button shape" onClick={() => (option.id === round.target.id ? onCorrect() : onWrong())}>
            <ShapeIcon shape={option} size={88} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="screen z-front kindergarten-screen screen-enter">
      <div className="kind-bg">
        <div className="kind-sun">{"☀️"}</div>
        <div className="kind-rainbow">{"🌈"}</div>
        <div className="kind-cloud cloud-a" />
        <div className="kind-cloud cloud-b" />
        <div className="kind-cloud cloud-c" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="kind-butterfly" style={{ top: `${16 + index * 12}%`, animationDelay: `${index * 0.6}s` }}>
            {"🦋"}
          </div>
        ))}
      </div>

      {feedbackKind === "correct" ? <CelebrationBurst variant="kind" /> : null}

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        nr={roundIndex}
        total={totalRounds}
        scor={stars}
        scoreLabel="Stele"
        progressValue={Math.max(0, roundIndex - 1)}
        progressMax={totalRounds}
        progressLabel="Runde"
        instruction={instruction}
        answerArea={answerArea}
        answerClassName="kind-answer-tray-shell"
        sceneClassName="kind-scene-shell"
      >
        <div className={`kind-guide-card kind-guide-card-inline ${feedbackKind}`}>
          <BearGuide mood={feedbackKind === "correct" ? "dance" : feedbackKind === "wrong" ? "sad" : "idle"} />
          <h3 className="kind-guide-title">Ursuletul te incurajeaza!</h3>
          <p className="kind-guide-message">{feedback || round.message}</p>
        </div>

        <main className="kind-main-card kind-main-card-compact">
          {round.type === "culoare" ? (
            <>
              <div className="kind-round-title">{round.target.label}</div>
              <div className={`kind-color-target ${feedbackKind === "wrong" ? "shake" : ""}`} style={{ background: round.target.color, borderColor: round.target.border || round.target.color }} />
            </>
          ) : null}

          {round.type === "animale" ? (
            <>
              <div className="kind-round-title">Numara animalele</div>
              <div className="kind-animals-stage">
                {visibleAnimals.map((animal, index) => (
                  <span key={animal.id} className="kind-animal" style={{ animationDelay: `${index * 0.1}s` }}>
                    {animal.emoji}
                  </span>
                ))}
              </div>
            </>
          ) : null}

          {round.type === "forma" ? (
            <>
              <div className="kind-round-title">Potriveste forma</div>
              <div className={`kind-shape-target ${feedbackKind === "wrong" ? "shake" : ""}`}>
                <ShapeIcon shape={round.target} size={160} big />
              </div>
            </>
          ) : null}
        </main>
      </GameLayout>
    </div>
  );
}

const JocGradinitaVesela = memo(JocGradinitaVeselaComponent);

export default JocGradinitaVesela;