import { useEffect, useMemo, useRef } from "react";
import AnimatedCharacter from "../characters/AnimatedCharacter";
import ConfettiTop from "../ui/ConfettiTop";
import ProgressBar from "../ui/ProgressBar";
import ScoreBadge from "../ui/ScoreBadge";

export default function GameResultScreen({ scor, max, personaj, onBack, onAwardStars, onRecordResult }) {
  const steleAcordateRef = useRef(false);

  useEffect(() => {
    if (steleAcordateRef.current) return;
    steleAcordateRef.current = true;

    if (onAwardStars && scor > 0) {
      onAwardStars(scor);
    }

    if (onRecordResult) {
      onRecordResult({ scor, max });
    }
  }, [max, onAwardStars, onRecordResult, scor]);

  const pct = max > 0 ? scor / max : 0;
  const bg = pct === 1 ? "bg-rez-perfect" : "bg-rez-ok";
  const mesaj = useMemo(() => {
    if (pct === 1) return "Perfect! Esti genial!";
    if (pct >= 0.7) return "Super! Te descurci grozav!";
    if (pct >= 0.5) return "Foarte bine! Continua asa!";
    return "Nu-i nimic, mai exersam putin!";
  }, [pct]);

  const subtitlu = pct >= 0.5
    ? `Ai rezolvat ${scor} din ${max} exercitii corect.`
    : `Ai rezolvat ${scor} din ${max} exercitii. Urmatoarea runda va fi si mai buna!`;

  const tone = pct === 1 ? "sun" : pct >= 0.5 ? "mint" : "sky";
  const starePersonaj = pct >= 0.5 ? "corect" : "gresit";

  return (
    <div className={`screen center-screen z-front screen-enter ${bg}`}>
      {pct >= 0.5 ? <ConfettiTop /> : null}

      <div className="result-shell">
        <div className="result-character-wrap">
          <AnimatedCharacter personaj={personaj} stare={starePersonaj} />
          <span className={`result-status-pill ${pct >= 0.5 ? "is-good" : "is-try"}`}>
            {pct >= 0.5 ? "Bravo!" : "Curaj!"}
          </span>
        </div>

        <h1 className="titlu-mare wobble" style={{ margin: "0.25rem 0" }}>{mesaj}</h1>
        <p className="result-copy">{subtitlu}</p>

        <div className="result-summary-row">
          <ScoreBadge label="Corecte" score={scor} icon="*" />
          <ScoreBadge label="Total" score={max} icon="#" className="is-muted" />
        </div>

        <ProgressBar value={scor} max={max} label="Raspunsuri corecte" tone={tone} className="result-progress" />

        <div className="stele-rezultat result-stars-flight">
          {Array.from({ length: max }).map((_, index) => (
            <span
              key={index}
              className={`stea-rez ${index < scor ? "aprins" : "stins"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <button className="btn-maine bounce-on-hover" onClick={onBack} style={{ marginTop: "1rem" }}>
          {"<- Meniu principal"}
        </button>
      </div>
    </div>
  );
}