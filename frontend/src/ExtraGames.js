import { useEffect, useRef, useState } from "react";
import { CharacterArt, getPersonajById } from "./CharacterArt";
import "./extraGames.css";

const BATMAN = getPersonajById("batman");

const MAZE_SETTINGS = {
  usor: { size: 5, time: 90, penaltyWalls: 3, maxScore: 950 },
  mediu: { size: 7, time: 60, penaltyWalls: 7, maxScore: 650 },
  greu: { size: 9, time: 45, penaltyWalls: 11, maxScore: 500 },
};

const COLOR_OPTIONS = [
  { id: "rosu", label: "ROSU", color: "#ef5350" },
  { id: "albastru", label: "ALBASTRU", color: "#42a5f5" },
  { id: "galben", label: "GALBEN", color: "#fdd835" },
  { id: "verde", label: "VERDE", color: "#66bb6a" },
  { id: "portocaliu", label: "PORTOCALIU", color: "#fb8c00" },
  { id: "roz", label: "ROZ", color: "#f48fb1" },
  { id: "mov", label: "MOV", color: "#ab47bc" },
  { id: "alb", label: "ALB", color: "#ffffff", border: "#cfd8dc" },
];

const ANIMAL_OPTIONS = ["??", "??", "??", "??"];
const SHAPE_OPTIONS = [
  { id: "cerc", label: "cerc", color: "#4fc3f7" },
  { id: "patrat", label: "patrat", color: "#ff8a65" },
  { id: "triunghi", label: "triunghi", color: "#ffd54f" },
  { id: "stea", label: "stea", color: "#ba68c8" },
  { id: "inima", label: "inima", color: "#f06292" },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildMaze(size, extraRemovals = 0) {
  const maze = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );

  const stack = [{ row: 0, col: 0 }];
  maze[0][0].visited = true;
  const directions = [
    { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    { dr: 0, dc: 1, wall: "right", opposite: "left" },
    { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    { dr: 0, dc: -1, wall: "left", opposite: "right" },
  ];

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = directions.filter((direction) => {
      const nextRow = current.row + direction.dr;
      const nextCol = current.col + direction.dc;
      return (
        nextRow >= 0 &&
        nextRow < size &&
        nextCol >= 0 &&
        nextCol < size &&
        !maze[nextRow][nextCol].visited
      );
    });

    if (!neighbors.length) {
      stack.pop();
      continue;
    }

    const choice = neighbors[rand(0, neighbors.length - 1)];
    const nextRow = current.row + choice.dr;
    const nextCol = current.col + choice.dc;

    maze[current.row][current.col].walls[choice.wall] = false;
    maze[nextRow][nextCol].walls[choice.opposite] = false;
    maze[nextRow][nextCol].visited = true;
    stack.push({ row: nextRow, col: nextCol });
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      delete maze[row][col].visited;
    }
  }

  const removable = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (col < size - 1) {
        removable.push({ row, col, wall: "right", nextRow: row, nextCol: col + 1, opposite: "left" });
      }
      if (row < size - 1) {
        removable.push({ row, col, wall: "bottom", nextRow: row + 1, nextCol: col, opposite: "top" });
      }
    }
  }

  shuffle(removable)
    .slice(0, extraRemovals)
    .forEach((entry) => {
      maze[entry.row][entry.col].walls[entry.wall] = false;
      maze[entry.nextRow][entry.nextCol].walls[entry.opposite] = false;
    });

  return maze;
}

function coordsKey(row, col) {
  return `${row}-${col}`;
}

function GothamBackground() {
  return (
    <div className="maze-night-bg">
      <div className="maze-moon" />
      <div className="maze-stars">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="maze-star"
            style={{
              left: `${rand(4, 96)}%`,
              top: `${rand(3, 42)}%`,
              animationDelay: `${index * 0.13}s`,
            }}
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

function CelebrationBurst({ variant }) {
  return (
    <div className={`celebration-burst ${variant}`}>
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="burst-piece"
          style={{
            left: `${rand(10, 90)}%`,
            top: `${rand(10, 85)}%`,
            animationDelay: `${index * 0.04}s`,
          }}
        >
          {variant === "kind" ? ["?", "??", "??", "??"][index % 4] : "??"}
        </span>
      ))}
    </div>
  );
}

function MazeResultScreen({ rezultat, onBack }) {
  const awardedRef = useRef(false);

  useEffect(() => {
    if (awardedRef.current) return;
    awardedRef.current = true;

    if (window.adaugaStele && rezultat.stele > 0) {
      window.adaugaStele(rezultat.stele);
    }

    if (window.inregistreazaRezultat) {
      window.inregistreazaRezultat({
        scor: rezultat.scor,
        max: rezultat.maxim,
      });
    }
  }, [rezultat]);

  return (
    <div className={`screen center-screen z-front fade-in ${rezultat.castigat ? "bg-rez-perfect" : "bg-rez-ok"}`}>
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

export function JocLabirintBatman({ dificultate, onBack, peGata }) {
  const settings = MAZE_SETTINGS[dificultate] || MAZE_SETTINGS.mediu;
  const [maze, setMaze] = useState(() => buildMaze(settings.size, settings.penaltyWalls));
  const [position, setPosition] = useState({ row: 0, col: 0 });
  const [visited, setVisited] = useState(() => new Set([coordsKey(0, 0)]));
  const [timp, setTimp] = useState(settings.time);
  const [pasi, setPasi] = useState(0);
  const [lovituri, setLovituri] = useState(0);
  const [shake, setShake] = useState(false);
  const [grimace, setGrimace] = useState(false);
  const [rezultat, setRezultat] = useState(null);
  const timerRef = useRef(null);
  const lockRef = useRef(false);

  useEffect(() => {
    setMaze(buildMaze(settings.size, settings.penaltyWalls));
    setPosition({ row: 0, col: 0 });
    setVisited(new Set([coordsKey(0, 0)]));
    setTimp(settings.time);
    setPasi(0);
    setLovituri(0);
    setRezultat(null);
    setShake(false);
    setGrimace(false);
    lockRef.current = false;
  }, [settings.penaltyWalls, settings.size, settings.time]);

  useEffect(() => {
    if (rezultat) return undefined;
    timerRef.current = setInterval(() => {
      setTimp((current) => {
        if (current <= 1) {
          clearInterval(timerRef.current);
          setRezultat({
            castigat: false,
            scor: 0,
            maxim: settings.maxScore,
            timpRamas: 0,
            pasi,
            lovituri,
            stele: 0,
          });
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [lovituri, pasi, rezultat, settings.maxScore]);

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
  });

  function finishMaze(finalSteps = pasi) {
    clearInterval(timerRef.current);
    const score = timp * 10 + (lovituri === 0 ? 50 : 0);
    setRezultat({
      castigat: true,
      scor: score,
      maxim: settings.maxScore,
      timpRamas: timp,
      pasi: finalSteps,
      lovituri,
      stele: Math.max(3, Math.ceil(score / 100)),
    });
  }

  function hitWall() {
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
  }

  function moveBatman(direction) {
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

    setPosition({ row: nextRow, col: nextCol });
    setPasi(nextSteps);
    setVisited((current) => {
      const copy = new Set(current);
      copy.add(coordsKey(nextRow, nextCol));
      return copy;
    });

    if (nextRow === settings.size - 1 && nextCol === settings.size - 1) {
      finishMaze(nextSteps);
    }
  }

  if (rezultat) {
    return <MazeResultScreen rezultat={rezultat} onBack={peGata} />;
  }

  const cellSize = settings.size === 9 ? 36 : settings.size === 7 ? 46 : 58;

  return (
    <div className={`screen z-front maze-screen ${shake ? "shake-scr" : ""}`}>
      <GothamBackground />

      <div className="top-bar space-between z-front">
        <button className="btn-back" onClick={() => window.confirm("Esti sigur? Vei pierde progresul din acest joc!") && onBack()}>{"<- Inapoi"}</button>
        <div className="hud">Timp: {timp}s | Pasi: {pasi} | Scor: {timp * 10 + (lovituri === 0 ? 50 : 0)}</div>
      </div>

      <div className="maze-layout z-front">
        <div className="maze-intro-card">
          <h2 className="titlu-mediu">Labirintul lui Batman</h2>
          <p className="maze-copy">Ajuta-l pe Batman sa ajunga la Gotham City.</p>
          <div className={`maze-batman-preview ${grimace ? "grimace" : ""}`}>
            <CharacterArt personaj={BATMAN} stare={grimace ? "gresit" : "idle"} size={148} />
          </div>
          <div className="maze-legend">
            <span><strong>Bonus:</strong> +50 puncte daca nu atingi peretii</span>
            <span><strong>Lovituri perete:</strong> {lovituri}</span>
          </div>
        </div>

        <div className="maze-board-wrap">
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
                    {isGoal ? <span className="maze-flag">??</span> : null}
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

          <div className="maze-controls">
            <button className="maze-control" onClick={() => moveBatman("sus")}>Sus</button>
            <div className="maze-control-row">
              <button className="maze-control" onClick={() => moveBatman("stanga")}>Stanga</button>
              <button className="maze-control" onClick={() => moveBatman("jos")}>Jos</button>
              <button className="maze-control" onClick={() => moveBatman("dreapta")}>Dreapta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function createColorRound() {
  const target = COLOR_OPTIONS[rand(0, COLOR_OPTIONS.length - 1)];
  const options = shuffle([target, ...shuffle(COLOR_OPTIONS.filter((color) => color.id !== target.id)).slice(0, 2)]);
  return {
    id: `color-${target.id}-${Date.now()}`,
    type: "culoare",
    target,
    options,
    message: `Gaseste culoarea ${target.label}!`,
  };
}

function createAnimalRound(maxCount) {
  const count = rand(1, maxCount);
  const animal = ANIMAL_OPTIONS[rand(0, ANIMAL_OPTIONS.length - 1)];
  const animals = Array.from({ length: count }, (_, index) => ({ id: `${animal}-${index}`, emoji: animal }));
  const numbers = new Set([count]);
  while (numbers.size < 3) {
    numbers.add(rand(1, 5));
  }
  return {
    id: `animals-${animal}-${Date.now()}`,
    type: "animale",
    animal,
    animals,
    options: shuffle(Array.from(numbers)),
    answer: count,
    message: "Numara animalele si apasa numarul corect!",
  };
}

function createShapeRound(shapePool) {
  const target = shapePool[rand(0, shapePool.length - 1)];
  const options = shuffle([target, ...shuffle(shapePool.filter((shape) => shape.id !== target.id)).slice(0, 3)]);
  return {
    id: `shape-${target.id}-${Date.now()}`,
    type: "forma",
    target,
    options,
    message: "Potriveste forma identica!",
  };
}

function buildKindergartenRound(dificultate, previousType = "") {
  const typePool = ["culoare", "animale", "forma"].filter((type) => type !== previousType);
  const chosenType = typePool[rand(0, typePool.length - 1)];

  if (chosenType === "culoare") return createColorRound();
  if (chosenType === "animale") return createAnimalRound(dificultate === "usor" ? 3 : dificultate === "mediu" ? 4 : 5);

  const shapes = dificultate === "usor" ? SHAPE_OPTIONS.slice(0, 3) : dificultate === "mediu" ? SHAPE_OPTIONS.slice(0, 4) : SHAPE_OPTIONS;
  return createShapeRound(shapes);
}

function KindergartenResultScreen({ rezultat, onBack }) {
  const awardedRef = useRef(false);

  useEffect(() => {
    if (awardedRef.current) return;
    awardedRef.current = true;

    if (window.adaugaStele && rezultat.stele > 0) {
      window.adaugaStele(rezultat.stele);
    }

    if (window.inregistreazaRezultat) {
      window.inregistreazaRezultat({
        scor: rezultat.scor,
        max: rezultat.maxim,
      });
    }
  }, [rezultat]);

  return (
    <div className="screen center-screen z-front fade-in grad-result-bg">
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

export function JocGradinitaVesela({ dificultate, onBack, peGata }) {
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
      setResult({
        scor: nextStars,
        maxim: totalRounds,
        stele: nextStars,
      });
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

  if (result) {
    return <KindergartenResultScreen rezultat={result} onBack={peGata} />;
  }

  const visibleAnimals = round.type === "animale" ? round.animals.slice(0, revealedCount) : [];

  return (
    <div className="screen z-front kindergarten-screen">
      <div className="kind-bg">
        <div className="kind-sun">??</div>
        <div className="kind-rainbow">??</div>
        <div className="kind-cloud cloud-a" />
        <div className="kind-cloud cloud-b" />
        <div className="kind-cloud cloud-c" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="kind-butterfly" style={{ top: `${16 + index * 12}%`, animationDelay: `${index * 0.6}s` }}>??</div>
        ))}
      </div>

      {feedbackKind === "correct" ? <CelebrationBurst variant="kind" /> : null}

      <div className="top-bar space-between z-front">
        <button className="btn-back" onClick={() => window.confirm("Esti sigur? Vei pierde progresul din acest joc!") && onBack()}>{"<- Inapoi"}</button>
        <div className="hud">? {stars} | Runda {roundIndex}/{totalRounds}</div>
      </div>

      <div className="kind-layout z-front">
        <aside className={`kind-guide-card ${feedbackKind}`}>
          <BearGuide mood={feedbackKind === "correct" ? "dance" : feedbackKind === "wrong" ? "sad" : "idle"} />
          <h3 className="kind-guide-title">Ursuletul te incurajeaza!</h3>
          <p className="kind-guide-message">{feedback || round.message}</p>
        </aside>

        <main className="kind-main-card">
          {round.type === "culoare" ? (
            <>
              <div className="kind-round-title">{round.target.label}</div>
              <div className={`kind-color-target ${feedbackKind === "wrong" ? "shake" : ""}`} style={{ background: round.target.color, borderColor: round.target.border || round.target.color }} />
              <div className="kind-options kind-color-options">
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
              <div className="kind-options kind-number-options">
                {round.options.map((option) => (
                  <button key={option} className="kind-option-button number" onClick={() => (option === round.answer ? onCorrect() : onWrong())}>
                    {option}
                  </button>
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
              <div className="kind-options kind-shape-options">
                {round.options.map((option) => (
                  <button key={option.id} className="kind-option-button shape" onClick={() => (option.id === round.target.id ? onCorrect() : onWrong())}>
                    <ShapeIcon shape={option} size={100} />
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}




