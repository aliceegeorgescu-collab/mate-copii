import { memo, useMemo, useState } from "react";
import AnimatedCharacter from "../characters/AnimatedCharacter";
import { GAME_OPTIONS } from "../../utils/gameConfig";
import { formatDateLabel, formatGameLabel } from "../../utils/formatters";
import CameraTrofee from "./CameraTrofee";
import GameMenuCard from "./GameMenuCard";
import IstoricRezultate from "./IstoricRezultate";

const FILTER_OPTIONS = [
  { id: "toate", label: "Toate" },
  { id: "noi", label: "Noi" },
  { id: "jucate", label: "Jucate" },
];

function SelectJocComponent({
  personaj,
  profil,
  onSelect,
  onBack,
  onChangeCharacter,
  stele,
  sunetActivat,
  onToggleSunet,
  showWelcome,
}) {
  const [filtruActiv, setFiltruActiv] = useState("toate");
  const history = useMemo(() => profil?.history ?? [], [profil?.history]);

  const gameStats = useMemo(
    () =>
      history.reduce((acc, item) => {
        const key = item.jocId;
        const current = acc[key] ?? {
          count: 0,
          bestScore: 0,
          bestMax: item.maxExercitii ?? 0,
          playedAt: item.playedAt,
        };

        const currentRatio = current.bestMax > 0 ? current.bestScore / current.bestMax : 0;
        const nextRatio = item.maxExercitii > 0 ? item.scor / item.maxExercitii : 0;
        const shouldReplaceBest = nextRatio > currentRatio || (nextRatio === currentRatio && item.scor > current.bestScore);

        acc[key] = {
          count: current.count + 1,
          bestScore: shouldReplaceBest ? item.scor : current.bestScore,
          bestMax: shouldReplaceBest ? item.maxExercitii : current.bestMax,
          playedAt: item.playedAt ?? current.playedAt,
        };

        return acc;
      }, {}),
    [history]
  );

  const jocuriJucate = useMemo(() => GAME_OPTIONS.filter((game) => gameStats[game.id]).length, [gameStats]);

  const jocuriAfisate = useMemo(() => {
    if (filtruActiv === "noi") {
      return GAME_OPTIONS.filter((game) => !gameStats[game.id]);
    }

    if (filtruActiv === "jucate") {
      return GAME_OPTIONS.filter((game) => Boolean(gameStats[game.id]));
    }

    return GAME_OPTIONS;
  }, [filtruActiv, gameStats]);

  const ultimulJoc = useMemo(() => {
    const latest = history[0];
    if (!latest) return "Alege un joc si hai sa incepem!";
    return `Ultimul joc: ${formatGameLabel(latest.jocId)}`;
  }, [history]);

  return (
    <div className="screen menu-screen z-front screen-enter">
      <CameraTrofee stele={stele} />
      <div className="sound-floating">
        <button className="btn-back" onClick={onToggleSunet}>{sunetActivat ? "Sunet ON" : "Sunet OFF"}</button>
      </div>
      <div className="top-bar multi-top-bar">
        <button className="btn-back" onClick={onBack}>Profiluri</button>
        <button className="btn-back" onClick={onChangeCharacter}>Personaj</button>
      </div>
      <div className="center-screen menu-layout">
        {showWelcome ? (
          <div className="welcome-banner screen-enter">
            <strong>Bine ai revenit, {profil?.name ?? "campion"}!</strong>
            <span>Astazi continuam aventura numerelor cu jocuri si stele noi.</span>
          </div>
        ) : null}

        <AnimatedCharacter personaj={personaj} stare="idle" />
        <h2 className="titlu-mediu wobble">Ce joc alegem, {profil?.name ?? "campion"}?</h2>
        <div className="session-chip">Ultima sesiune: {formatDateLabel(profil?.lastSessionAt)}</div>

        <div className="menu-summary-row">
          <div className="menu-summary-pill">{"\u2B50"} Total stele: {stele}</div>
          <div className="menu-summary-pill">{"\uD83C\uDFAE"} Jocuri jucate: {jocuriJucate}/{GAME_OPTIONS.length}</div>
          <div className="menu-summary-pill">{ultimulJoc}</div>
        </div>

        <section className="game-section-shell" aria-label="Sectiune jocuri">
          <h3 className="game-section-title">Alege jocul tau!</h3>

          <div className="game-filter-row" role="tablist" aria-label="Filtre jocuri">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`game-filter-pill ${filtruActiv === option.id ? "is-active" : ""}`.trim()}
                onClick={() => setFiltruActiv(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="game-menu-grid">
            {jocuriAfisate.map((game, index) => (
              <GameMenuCard
                key={game.id}
                game={game}
                stats={gameStats[game.id]}
                onSelect={onSelect}
                index={index}
              />
            ))}
          </div>

          {jocuriAfisate.length === 0 ? (
            <div className="game-menu-empty">
              Nu exista jocuri in acest filtru inca. Incearca alta selectie.
            </div>
          ) : null}
        </section>

        <div className="istoric-box">
          <h3>Istoric recent</h3>
          <IstoricRezultate history={history} />
        </div>
      </div>
    </div>
  );
}

const SelectJoc = memo(SelectJocComponent);

export default SelectJoc;