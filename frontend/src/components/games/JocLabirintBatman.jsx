import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CharacterArt from "../characters/CharacterArt";
import { getPersonajById } from "../characters/characterRegistry";
import CelebrationBurst from "../ui/CelebrationBurst";
import GameLayout from "../ui/GameLayout";
import { confirmLeaveGame } from "../../utils/confirmLeaveGame";
import { MAZE_SETTINGS, buildMaze, coordsKey } from "../../utils/mazeGenerator";
import { rand } from "../../utils/random";
import useTimer from "../../hooks/useTimer";

const BATMAN = getPersonajById("batman");

function GothamBackground() {
  return (
    <div className="maze-night-bg">
      <div className="maze-moon" />
      <div className="maze-stars">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="maze-star"
            style={{ left: `${rand(4, 96)}%`, top: `${rand(3, 42)}%`, animationDelay: `${index * 0.13}s` }}
          />
        ))}
      </div>
      <div className="maze-buildings">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="maze-building"
            style={{ height: `${32 + (index % 4) * 12}%`, width: `${8 + (index % 3) * 2}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function MazeResultScreen({ rezultat, onBack, onAwardStars, onRecordResult }) {
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
    <div className={`screen center-screen z-front screen-enter ${rezultat.castigat ? "bg-rez-perfect" : "bg-rez-ok"}`}>
      {rezultat.castigat ? <CelebrationBurst variant="maze" /> : null}
      <div className="maze-result-card">
        <CharacterArt personaj={BATMAN} stare={rezultat.castigat ? "corect" : "gresit"} size={150} />
        <h1 className="titlu-mare">{rezultat.castigat ? "Gotham este salvat!" : "Mai incercam o data!"}</h1>
        <p className="maze-result-copy">
          {rezultat.castigat
            ? "Batman a iesit din labirint si a ajuns la Gotham City."
            : "Timpul s-a terminat, dar Batman este gata pentru o noua runda."}
        </p>
        <div className="maze-result-stats">
          <div><strong>Scor:</strong> {rezultat.scor}</div>
          <div><strong>Timp ramas:</strong> {rezultat.timpRamas}s</div>
          <div><strong>Pasi:</strong> {rezultat.pasi}</div>
          <div><strong>Lovituri perete:</strong> {rezultat.lovituri}</div>
          <div><strong>Stele castigate:</strong> {rezultat.stele}</div>
        </div>
        <button className="btn-maine bounce-on-hover" onClick={onBack}>{"<- Meniu principal"}</button>
      </div>
    </div>
  );
}

function JocLabirintBatmanComponent({ dificultate, onBack, peGata, onAwardStars, onRecordResult }) {
  const settings = useMemo(() => MAZE_SETTINGS[dificultate] || MAZE_SETTINGS.mediu, [dificultate]);
  const settingsKey = `${dificultate}-${settings.size}-${settings.time}-${settings.penaltyWalls}`;
  const [maze, setMaze] = useState(() => buildMaze(settings.size, settings.penaltyWalls));
  const [position, setPosition] = useState({ row: 0, col: 0 });
  const [visited, setVisited] = useState(() => new Set([coordsKey(0, 0)]));
  const [pasi, setPasi] = useState(0);
  const [lovituri, setLovituri] = useState(0);
  const [shake, setShake] = useState(false);
  const [grimace, setGrimace] = useState(false);
  const [rezultat, setRezultat] = useState(null);
  const lockRef = useRef(false);
  const pasiRef = useRef(0);
  const lovituriRef = useRef(0);

  useEffect(() => {
    pasiRef.current = pasi;
  }, [pasi]);

  useEffect(() => {
    lovituriRef.current = lovituri;
  }, [lovituri]);

  useEffect(() => {
    setMaze(buildMaze(settings.size, settings.penaltyWalls));
    setPosition({ row: 0, col: 0 });
    setVisited(new Set([coordsKey(0, 0)]));
    setPasi(0);
    setLovituri(0);
    setRezultat(null);
    setShake(false);
    setGrimace(false);
    lockRef.current = false;
    pasiRef.current = 0;
    lovituriRef.current = 0;
  }, [settings]);

  const finishMaze = useCallback((finalSteps, finalTime, finalHits) => {
    const score = finalTime * 10 + (finalHits === 0 ? 50 : 0);
    setRezultat({
      castigat: true,
      scor: score,
      maxim: settings.maxScore,
      timpRamas: finalTime,
      pasi: finalSteps,
      lovituri: finalHits,
      stele: Math.max(3, Math.ceil(score / 100)),
    });
  }, [settings.maxScore]);

  const onTimeExpired = useCallback(() => {
    setRezultat({
      castigat: false,
      scor: 0,
      maxim: settings.maxScore,
      timpRamas: 0,
      pasi: pasiRef.current,
      lovituri: lovituriRef.current,
      stele: 0,
    });
  }, [settings.maxScore]);

  const { timeLeft: timp } = useTimer({
    initialTime: settings.time,
    active: !rezultat,
    onExpire: onTimeExpired,
    resetKey: settingsKey,
  });

  const hitWall = useCallback(() => {
    if (lockRef.current) return;

    lockRef.current = true;
    setLovituri((current) => current + 1);
    setShake(true);
    setGrimace(true);
    window.setTimeout(() => {
      setShake(false);
      setGrimace(false);
      lockRef.current = false;
    }, 500);
  }, []);

  const moveBatman = useCallback((direction) => {
    if (rezultat || lockRef.current) return;

    const currentCell = maze[position.row][position.col];
    const directions = {
      sus: { wall: "top", dr: -1, dc: 0 },
      jos: { wall: "bottom", dr: 1, dc: 0 },
      stanga: { wall: "left", dr: 0, dc: -1 },
      dreapta: { wall: "right", dr: 0, dc: 1 },
    };
    const next = directions[direction];

    if (currentCell.walls[next.wall]) {
      hitWall();
      return;
    }

    const nextRow = position.row + next.dr;
    const nextCol = position.col + next.dc;
    const nextSteps = pasi + 1;
    const nextHits = lovituri;

    setPosition({ row: nextRow, col: nextCol });
    setPasi(nextSteps);
    setVisited((current) => {
      const copy = new Set(current);
      copy.add(coordsKey(nextRow, nextCol));
      return copy;
    });

    if (nextRow === settings.size - 1 && nextCol === settings.size - 1) {
      finishMaze(nextSteps, timp, nextHits);
    }
  }, [finishMaze, hitWall, lovituri, maze, pasi, position.col, position.row, rezultat, settings.size, timp]);

  useEffect(() => {
    if (rezultat) return undefined;

    function onKeyDown(event) {
      const map = {
        ArrowUp: "sus",
        ArrowDown: "jos",
        ArrowLeft: "stanga",
        ArrowRight: "dreapta",
      };

      if (!map[event.key]) return;
      event.preventDefault();
      moveBatman(map[event.key]);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moveBatman, rezultat]);

  if (rezultat) {
    return <MazeResultScreen rezultat={rezultat} onBack={peGata} onAwardStars={onAwardStars} onRecordResult={onRecordResult} />;
  }

  const cellSize = settings.size === 9 ? 36 : settings.size === 7 ? 46 : 58;
  const currentScore = timp * 10 + (lovituri === 0 ? 50 : 0);

  return (
    <div className={`screen z-front maze-screen screen-enter ${shake ? "shake-scr" : ""}`}>
      <GothamBackground />

      <GameLayout
        onBack={() => confirmLeaveGame(onBack)}
        timp={timp}
        scor={currentScore}
        scoreLabel="Scor"
        progressValue={visited.size}
        progressMax={settings.size * settings.size}
        progressLabel="Parcurs"
        progressText={`${visited.size}/${settings.size * settings.size}`}
        secondaryStat={{ label: "Pasi", value: pasi }}
        instruction="Foloseste sagetile sau butoanele ca sa ajungi la steag!"
        light
        sceneClassName="maze-scene-shell"
        answerArea={(
          <div className="maze-control-tray">
            <button className="maze-control" onClick={() => moveBatman("sus")}>Sus</button>
            <div className="maze-control-row">
              <button className="maze-control" onClick={() => moveBatman("stanga")}>Stanga</button>
              <button className="maze-control" onClick={() => moveBatman("jos")}>Jos</button>
              <button className="maze-control" onClick={() => moveBatman("dreapta")}>Dreapta</button>
            </div>
          </div>
        )}
      >
        <div className="maze-mission-card screen-enter">
          <div className="maze-mission-title">Labirintul lui Batman</div>
          <div className="maze-mission-copy">Ajuta-l pe Batman sa ajunga la Gotham City. Bonusul ramane daca nu lovesti peretii.</div>
          <div className={`maze-batman-preview ${grimace ? "grimace" : ""}`}>
            <CharacterArt personaj={BATMAN} stare={grimace ? "gresit" : "idle"} size={132} />
          </div>
        </div>

        <div className="maze-board-wrap maze-board-wrap-compact">
          <div className="maze-board" style={{ gridTemplateColumns: `repeat(${settings.size}, ${cellSize}px)`, gridTemplateRows: `repeat(${settings.size}, ${cellSize}px)` }}>
            {maze.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isVisited = visited.has(coordsKey(rowIndex, colIndex));
                const isStart = rowIndex === 0 && colIndex === 0;
                const isGoal = rowIndex === settings.size - 1 && colIndex === settings.size - 1;
                const isBatman = position.row === rowIndex && position.col === colIndex;

                return (
                  <div
                    key={coordsKey(rowIndex, colIndex)}
                    className={`maze-cell ${isVisited ? "visited" : ""} ${isGoal ? "goal" : ""}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderTopWidth: cell.walls.top ? 5 : 1,
                      borderRightWidth: cell.walls.right ? 5 : 1,
                      borderBottomWidth: cell.walls.bottom ? 5 : 1,
                      borderLeftWidth: cell.walls.left ? 5 : 1,
                    }}
                  >
                    {isStart ? <span className="maze-start-dot" /> : null}
                    {isGoal ? <span className="maze-flag">{"🏁"}</span> : null}
                    {isBatman ? (
                      <div className="maze-batman-token">
                        <CharacterArt personaj={BATMAN} stare={grimace ? "gresit" : "idle"} size={Math.max(54, cellSize - 4)} />
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </GameLayout>
    </div>
  );
}

const JocLabirintBatman = memo(JocLabirintBatmanComponent);

export default JocLabirintBatman;