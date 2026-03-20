import { useState, useEffect, useRef } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generezaIntrebare(tip, dificultate = "mediu") {
  if (tip === "+") {
    let a, b;
    if (dificultate === "usor") {
      a = rand(1, 9); b = rand(1, 10 - a);
    } else if (dificultate === "mediu") {
      a = rand(1, 19); b = rand(1, 20 - a);
    } else { // greu, trecere peste zece
      a = rand(2, 9); b = rand(11 - a, 9);
      if (Math.random() > 0.5) { a = rand(11, 19); b = rand(1, 20 - a); }
    }
    return { a, b, op: "+", raspuns: a + b };
  } else {
    let a, b;
    if (dificultate === "usor") {
      a = rand(2, 10); b = rand(1, a - 1);
    } else if (dificultate === "mediu") {
      a = rand(2, 20); b = rand(1, a - 1);
    } else { // greu, trecere peste 10 
      a = rand(11, 18); b = rand(a - 9, 9); 
    }
    return { a, b, op: "-", raspuns: a - b };
  }
}

function genOptiuni(raspuns, max = 20) {
  const set = new Set([raspuns]);
  let fails = 0;
  while (set.size < 4 && fails < 50) {
    const v = raspuns + rand(-4, 4);
    if (v !== raspuns && v >= 0 && v <= max) set.add(v);
    else fails++;
  }
  while (set.size < 4) set.add(rand(0, max));
  return [...set].sort(() => Math.random() - 0.5);
}

const PERSONAJE = [
  { id: "urs", nume: "Ursuleț", emoji: "🐻", culoare: "#8d6e63" },
  { id: "iepure", nume: "Iepuraș", emoji: "🐰", culoare: "#f48fb1" },
  { id: "pisica", nume: "Pisicuță", emoji: "🐱", culoare: "#ffb74d" },
  { id: "vulpe", nume: "Vulpiță", emoji: "🦊", culoare: "#ff7043" },
];

const DIFICULTATI = {
  usor: { label: "Ușor", ex: 5, timp: 20 },
  mediu: { label: "Mediu", ex: 8, timp: 15 },
  greu: { label: "Greu", ex: 10, timp: 10 }
};

// ── COMPONENTE GENERALE ────────────────────────────────────────────────────────

function BackgroundEnvironment() {
  const nori = [1, 2, 3, 4].map(i => ({ id: i, top: rand(5, 25), delay: rand(0, 10), dur: rand(30, 60) }));
  const fluturi = [1, 2, 3].map(i => ({ id: i, delay: rand(0, 5), dur: rand(15, 25) }));
  return (
    <div className="bg-env">
      <div className="soare">☀️</div>
      <div className="curcubeu">🌈</div>
      {nori.map(n => (
        <div key={n.id} className="nor" style={{ top: `${n.top}%`, animationDuration: `${n.dur}s`, animationDelay: `-${n.delay}s` }}>☁️</div>
      ))}
      <div className="stele-bg">
         {Array.from({length: 15}).map((_, i) => (
            <span key={i} className="stea-bg" style={{ left: `${rand(0, 100)}%`, top: `${rand(0, 40)}%`, animationDelay: `${rand(0, 3)}s` }}>⭐</span>
         ))}
      </div>
      <div className="iarba-container">
        {Array.from({length: 20}).map((_, i) => (
           <div key={i} className="fir-iarba" style={{ animationDelay: `${rand(0, 2)}s` }} />
        ))}
      </div>
      {fluturi.map(f => (
        <div key={f.id} className="fluture" style={{ animationDuration: `${f.dur}s`, animationDelay: `-${f.delay}s` }}>🦋</div>
      ))}
    </div>
  );
}

function AnimatedCharacter({ personaj, stare }) {
  // stare: "idle", "corect", "gresit"
  let cls = "char-idle";
  if (stare === "corect") cls = "char-dance";
  if (stare === "gresit") cls = "char-sad";
  return (
    <div className={`anim-char ${cls}`}>
      <span className="char-emoji">{personaj.emoji}</span>
      {stare === "gresit" && <span className="char-mood">😢</span>}
      {stare === "corect" && <span className="char-mood">🎉</span>}
    </div>
  );
}

function ConfettiTop() {
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6bff", "#ff9f43"];
  return (
    <div className="confetti-wrap">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${rand(0, 100)}%`, background: colors[i % colors.length],
          animationDelay: `${rand(0, 5) * 0.1}s`, animationDuration: `${0.8 + Math.random()}s`,
          width: `${8 + rand(0, 8)}px`, height: `${8 + rand(0, 8)}px`,
        }} />
      ))}
    </div>
  );
}

function CheckConfirm(action) {
  if (window.confirm("Ești sigur? Vei pierde progresul din acest joc!")) action();
}

// ── ECARNE MENIU ─────────────────────────────────────────────────────────────

function SelectPersonaj({ onSelect }) {
  return (
    <div className="screen center-screen z-front fade-in">
      <h1 className="titlu-mare wobble">🌈 Matematică<br/>Magică!</h1>
      <p className="subtitlu pulse-text">Alege-ți personajul!</p>
      <div className="personaje-grid">
        {PERSONAJE.map(p => (
          <button key={p.id} className="personaj-btn bounce-on-hover" onClick={() => onSelect(p)} style={{ "--pc": p.culoare }}>
            <span className="personaj-emoji breathe">{p.emoji}</span>
            <span className="personaj-nume">{p.nume}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectJoc({ personaj, onSelect, onBack }) {
  const jocuri = [
    { id: "baloane", nume: "Prinde Răspunsul", icon: "🎈", cod: "A", bg: "linear-gradient(135deg,#ff9a9e,#fecfef)" },
    { id: "trenulet", nume: "Trenulețul Info", icon: "🚂", cod: "B", bg: "linear-gradient(135deg,#a18cd1,#fbc2eb)" },
    { id: "pescuit", nume: "Pescuitul Numerelor", icon: "🎣", cod: "C", bg: "linear-gradient(135deg,#84fab0,#8fd3f4)" },
    { id: "racheta", nume: "Racheta spre Stele", icon: "🚀", cod: "D", bg: "linear-gradient(135deg,#fccb90,#d57eeb)" },
  ];
  return (
    <div className="screen z-front fade-in">
      <div className="top-bar"><button className="btn-back" onClick={onBack}>← Înapoi</button></div>
      <div className="center-screen">
        <AnimatedCharacter personaj={personaj} stare="idle" />
        <h2 className="titlu-mediu wobble">Ce joc alegem?</h2>
        <div className="jocuri-main-grid">
          {jocuri.map(j => (
            <button key={j.id} className="card-joc bounce-on-hover" onClick={() => onSelect(j.id)} style={{ background: j.bg }}>
              <span className="card-icon">{j.icon}</span>
              <span className="card-titlu">{j.nume}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectDificultate({ onSelect, onBack }) {
  return (
    <div className="screen center-screen z-front fade-in">
      <div className="top-bar w-full"><button className="btn-back" onClick={onBack}>← Înapoi</button></div>
      <h2 className="titlu-mediu wobble">Alege Dificultatea</h2>
      <div className="dif-box-grid">
        {Object.entries(DIFICULTATI).map(([k, v]) => (
          <button key={k} className={`dif-card dif-${k} bounce-on-hover`} onClick={() => onSelect(k)}>
            <h3>{v.label}</h3>
            <p>⏳ {v.timp} sec / ex</p>
            <p>🎯 {v.ex} exerciții</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function RezultatScreen({ scor, max, personaj, onBack }) {
  const pct = scor / max;
  let mesaj = "Nu-i bai, mai încearcă!";
  let bg = "bg-rez-ok";
  if (pct === 1) { mesaj = "PERFECT! Ești GENIAL! 🌟"; bg = "bg-rez-perfect"; }
  else if (pct >= 0.7) { mesaj = "Superb! Te descurci grozav! 🎉"; }
  else if (pct >= 0.5) { mesaj = "Bine! Continuă să exersezi! 👍"; }

  return (
    <div className={`screen center-screen z-front fade-in ${bg}`}>
      {pct >= 0.5 && <ConfettiTop />}
      <AnimatedCharacter personaj={personaj} stare={pct >= 0.5 ? "corect" : "gresit"} />
      <h1 className="titlu-mare wobble" style={{ margin: "1rem 0" }}>{mesaj}</h1>
      <div className="scor-mare pulse-text">Ai rezolvat {scor} din {max} exerciții corect!</div>
      <div className="stele-rezultat">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={`stea-rez ${i < scor ? "aprins" : "stins"}`} style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
        ))}
      </div>
      <button className="btn-maine bounce-on-hover" onClick={onBack} style={{ marginTop: "2rem" }}>← Meniu Principal</button>
    </div>
  );
}

// ── ENGINE DE JOC ────────────────────────────────────────────────────────────
// Un hook custom care tine starea generala pentru un mini-joc
function useGameEngine(dificultateId) {
  const dif = DIFICULTATI[dificultateId];
  const op = rand(0, 1) === 0 ? "+" : "-";
  
  const [nr, setNr] = useState(1);
  const [scor, setScor] = useState(0);
  const [q, setQ] = useState(() => generezaIntrebare(op, dificultateId));
  const [optiuni, setOptiuni] = useState(() => genOptiuni(q.raspuns, 20)); // optiunile pt raspuns
  
  const [stare, setStare] = useState("idle"); // "idle", "corect", "gresit", "gata"
  const [timp, setTimp] = useState(dif.timp);
  const timerRef = useRef(null);

  useEffect(() => {
    if (stare !== "idle") return;
    timerRef.current = setInterval(() => {
      setTimp(t => {
        if (t <= 1) {
          handleGresit(); // timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stare, nr]);

  function raspunde(v) {
    if (stare !== "idle") return;
    clearInterval(timerRef.current);
    if (v === q.raspuns) {
      setStare("corect"); setScor(s => s + 1);
      setTimeout(nextIntrebare, 2000);
    } else {
      handleGresit();
    }
  }

  function handleGresit() {
    clearInterval(timerRef.current);
    setStare("gresit");
    setTimeout(nextIntrebare, 2000);
  }

  function nextIntrebare() {
    if (nr >= dif.ex) { setStare("gata"); }
    else {
      const nop = rand(0, 1) === 0 ? "+" : "-";
      const nq = generezaIntrebare(nop, dificultateId);
      setQ(nq); setOptiuni(genOptiuni(nq.raspuns, 20));
      setTimp(dif.timp); setStare("idle"); setNr(n => n + 1);
    }
  }

  return { nr, scor, q, optiuni, stare, timp, dif, raspunde };
}

// ── A) PRINDE RĂSPUNSUL (JocBaloane) ──────────────────────────────────────────
function JocBaloane({ personaj, dificultate, onBack, peGata }) {
  const eng = useGameEngine(dificultate);
  
  if (eng.stare === "gata") return <RezultatScreen scor={eng.scor} max={eng.dif.ex} personaj={personaj} onBack={peGata} />;

  return (
    <div className={`screen game-screen ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" && <ConfettiTop />}
      {eng.stare === "corect" && <div className="expand-ring"></div>}
      
      <div className="top-bar space-between z-front">
        <button className="btn-back" onClick={() => CheckConfirm(onBack)}>← Înapoi</button>
        <div className="hud">⏳ {eng.timp}s | 🎯 {eng.nr}/{eng.dif.ex} | ⭐ {eng.scor}</div>
      </div>

      <div className="joc-body z-front">
         <div className="q-box bounce">
             Cât face: <b>{eng.q.a} {eng.q.op} {eng.q.b}</b> ?
         </div>
         
         <div className="baloane-container">
           {eng.optiuni.map((v, i) => {
             // Daca e corect/gresit, animam balonul apsat
             let bstare = "falling";
             if (eng.stare === "corect" && v === eng.q.raspuns) bstare = "popped-ok";
             if (eng.stare === "gresit" && v !== eng.q.raspuns && v === eng.ales) bstare = "popped-bad"; // nu retinem ales, doar facem ca toate sa dispara
             if (eng.stare !== "idle" && v !== eng.q.raspuns) bstare = "fade-out";
             
             return (
               <div key={`${eng.nr}-${i}`} className={`img-balon wrap-${bstare}`} 
                    style={{ left: `${10 + i * 20}%`, animationDelay: `0.${i}s` }}
                    onClick={() => eng.raspunde(v)}>
                 🎈<span className="b-num">{v}</span>
               </div>
             )
           })}
         </div>

         <div className="char-bottom-left">
           <AnimatedCharacter personaj={personaj} stare={eng.stare} />
         </div>
      </div>
    </div>
  );
}

// ── B) TRENULEȚUL MATEMATICII (JocTrenulet) ──────────────────────────────────
function JocTrenulet({ personaj, dificultate, onBack, peGata }) {
  const eng = useGameEngine(dificultate);
  if (eng.stare === "gata") return <RezultatScreen scor={eng.scor} max={eng.dif.ex} personaj={personaj} onBack={peGata} />;

  // animatia trenului depinde de stare
  const trainCls = eng.stare === "idle" ? "train-in-station" : "train-moving-out";

  return (
    <div className={`screen game-screen ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" && <ConfettiTop />}
      <div className="top-bar space-between z-front">
        <button className="btn-back" onClick={() => CheckConfirm(onBack)}>← Înapoi</button>
        <div className="hud">⏳ {eng.timp}s | 🎯 {eng.nr}/{eng.dif.ex} | ⭐ {eng.scor}</div>
      </div>

      <div className="joc-body z-front">
        <div className={`train-track ${trainCls}`}>
           <div className="train-cart">
              🚂
              {eng.stare === "corect" && <span className="train-smoke">💨🎉</span>}
           </div>
           {eng.stare === "idle" && (
             <div className="train-station-board fade-in">
               <h3>Stația {eng.nr}</h3>
               <h1>{eng.q.a} {eng.q.op} {eng.q.b} = ?</h1>
             </div>
           )}
        </div>

        <div className="train-options">
          {eng.optiuni.map(v => (
             <button key={v} className="btn-train-opt bounce-on-hover" onClick={() => eng.raspunde(v)} disabled={eng.stare !== "idle"}>
                {v}
             </button>
          ))}
        </div>

        <div className="char-bottom-right">
           <AnimatedCharacter personaj={personaj} stare={eng.stare} />
        </div>
      </div>
    </div>
  );
}

// ── C) PESCUITUL NUMERELOR (JocPescuit) ──────────────────────────────────────
function JocPescuit({ personaj, dificultate, onBack, peGata }) {
  const eng = useGameEngine(dificultate);
  if (eng.stare === "gata") return <RezultatScreen scor={eng.scor} max={eng.dif.ex} personaj={personaj} onBack={peGata} />;

  return (
    <div className={`screen game-screen bg-water ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" && <ConfettiTop />}
      <div className="top-bar space-between z-front">
        <button className="btn-back" onClick={() => CheckConfirm(onBack)}>← Înapoi</button>
        <div className="hud">⏳ {eng.timp}s | 🎯 {eng.nr}/{eng.dif.ex} | ⭐ {eng.scor}</div>
      </div>

      <div className="joc-body z-front flex-col-center">
        <div className="q-box bubble-box float-obj">
             Peste cu: <b>{eng.q.a} {eng.q.op} {eng.q.b}</b>
        </div>
        
        <div className="pond-container">
           {eng.optiuni.map((v, i) => {
              let fcls = "fish-swim";
              if (eng.stare === "corect" && v === eng.q.raspuns) fcls = "fish-jump";
              else if (eng.stare !== "idle") fcls = "fade-out";
              return (
                <div key={`${eng.nr}-${i}`} className={`img-fish ${fcls}`} 
                     style={{ top: `${20 + i*20}%`, animationDelay: `-${i*2}s` }}
                     onClick={() => eng.raspunde(v)}>
                  🐟 <span className="f-num">{v}</span>
                </div>
              );
           })}
        </div>

        <div className="boat-char">
           ⛵<AnimatedCharacter personaj={personaj} stare={eng.stare} />
        </div>
      </div>
    </div>
  );
}

// ── D) RACHETA SPRE STELE (JocRacheta) ───────────────────────────────────────
function JocRacheta({ personaj, dificultate, onBack, peGata }) {
  const eng = useGameEngine(dificultate);
  if (eng.stare === "gata") return <RezultatScreen scor={eng.scor} max={eng.dif.ex} personaj={personaj} onBack={peGata} />;

  const progress = ((eng.nr - 1) / eng.dif.ex) * 100;
  const inFlight = eng.stare === "corect" || eng.stare === "gata";

  return (
    <div className={`screen game-screen bg-space ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" && <ConfettiTop />}
      <div className="top-bar space-between z-front text-white">
        <button className="btn-back bg-white" onClick={() => CheckConfirm(onBack)}>← Înapoi</button>
        <div className="hud border-white">⏳ {eng.timp}s | 🎯 {eng.nr}/{eng.dif.ex} | ⭐ {eng.scor}</div>
      </div>

      <div className="joc-body z-front racheta-layout">
        <div className="q-panel text-white">
           <h2 className="wobble">Misiunea {eng.nr}</h2>
           <h1 className="q-text">{eng.q.a} {eng.q.op} {eng.q.b} = ?</h1>
           <div className="rack-options grid-2">
             {eng.optiuni.map(v => (
                <button key={v} className="btn-rocket-opt bounce-on-hover" onClick={() => eng.raspunde(v)} disabled={eng.stare !== "idle"}>
                   {v}
                </button>
             ))}
           </div>
           <div className="mt-2"><AnimatedCharacter personaj={personaj} stare={eng.stare} /></div>
        </div>

        <div className="rocket-track">
           <div className="star-goal pulse-text">🌟</div>
           <div className="track-line"></div>
           <div className={`the-rocket ${inFlight ? "rocket-boost" : "rocket-idle"}`} style={{ bottom: `${progress}%` }}>
              🚀 {inFlight && <span className="fire">🔥</span>}
           </div>
        </div>
      </div>
    </div>
  );
}

// ── APP MAIN ──────────────────────────────────────────────────────────────────

export default function App() {
  const [personaj, setPersonaj] = useState(() => {
    try { const s = localStorage.getItem("mate_personaj_v2"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [faza, setFaza] = useState(() => personaj ? "meniu" : "personaj"); 
  const [jocSelectat, setJocSelectat] = useState(null); // id joc
  const [dificultate, setDificultate] = useState(null);

  useEffect(() => {
    if (personaj) localStorage.setItem("mate_personaj_v2", JSON.stringify(personaj));
  }, [personaj]);

  const onSelectPersonaj = (p) => { setPersonaj(p); setFaza("meniu"); };
  const onSelectJoc = (jId) => { setJocSelectat(jId); setFaza("dificultate"); };
  const onSelectDificultate = (dId) => { setDificultate(dId); setFaza("joc"); };
  const backLaPersonaj = () => { setFaza("personaj"); };
  const backLaMeniu = () => { setJocSelectat(null); setDificultate(null); setFaza("meniu"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
        :root { --main-font: 'Fredoka One', cursive; --sec-font: 'Nunito', sans-serif; }
        body { margin: 0; min-height: 100vh; overflow: hidden; font-family: var(--sec-font); background: #8fd3f4; color: #333; }
        
        .screen { position: absolute; top:0; left:0; width: 100vw; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        .center-screen { justify-content: center; align-items: center; text-align: center; }
        .z-front { z-index: 10; position: relative; }
        .flex-col-center { display: flex; flex-direction: column; align-items: center; }
        .w-full { width: 100%; }
        .space-between { justify-content: space-between; }
        .mt-2 { margin-top: 1.5rem; }
        
        /* TYPOGRAPHY */
        h1, h2, h3 { font-family: var(--main-font); margin-bottom: 0.5rem; text-shadow: 2px 2px 0 rgba(255,255,255,0.5); }
        .titlu-mare { font-size: clamp(2.5rem, 8vw, 4rem); color: #e65100; text-shadow: 3px 3px 0 #fff, 5px 5px 0 #ffcc02; }
        .titlu-mediu { font-size: 2.2rem; color: #d32f2f; }
        .subtitlu { font-size: 1.5rem; font-weight: 900; color: #fff; text-shadow: 1px 1px 4px rgba(0,0,0,0.4); }
        .text-white { color: white !important; text-shadow: 2px 2px 0 #000 !important; }
        
        /* BUTTONS */
        button { font-family: var(--main-font); outline: none; border: none; cursor: pointer; }
        .btn-back { padding: 0.6rem 1.2rem; border-radius: 99px; background: white; border: 3px solid #ddd; font-size: 1.1rem; color: #777; transition: all 0.2s; box-shadow: 0 4px 0 #ccc; margin: 1rem; }
        .btn-back:hover { border-color: #ff7043; color: #ff7043; transform: translateY(2px); box-shadow: 0 2px 0 #ccc; }
        .btn-maine { padding: 1.2rem 2.5rem; font-size: 1.6rem; border-radius: 99px; background: #ff7043; color: white; border: 4px solid #fff; box-shadow: 0 8px 0 #d84315; }
        .btn-maine:hover { transform: translateY(4px); box-shadow: 0 4px 0 #d84315; }
        
        .top-bar { display: flex; width: 100%; padding: 0 1rem; align-items: center; }
        .hud { font-size: 1.4rem; font-family: var(--main-font); background: white; padding: 0.5rem 1rem; border-radius: 99px; border: 3px solid #ccc; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-top: 1rem;}
        .border-white { border-color: white !important; background: transparent !important; color: white; }
        
        /* SELECTION GRIDS */
        .personaje-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; }
        .personaj-btn { background: white; border: 5px solid var(--pc); border-radius: 30px; padding: 1.5rem; box-shadow: 0 8px 0 var(--pc); display: flex; flex-direction: column; align-items: center; }
        .personaj-btn:active { transform: translateY(6px); box-shadow: 0 2px 0 var(--pc); }
        .personaj-emoji { font-size: 4rem; }
        .personaj-nume { font-size: 1.5rem; margin-top: 0.5rem; color: #333; }
        
        .jocuri-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 500px; margin: 2rem auto; }
        .card-joc { display: flex; flex-direction: column; align-items: center; padding: 1.5rem 1rem; border-radius: 20px; color: white; border: 4px solid rgba(255,255,255,0.5); box-shadow: 0 8px 0 rgba(0,0,0,0.1); }
        .card-icon { font-size: 3.5rem; margin-bottom: 0.5rem; }
        .card-titlu { font-size: 1.3rem; line-height: 1.2; text-shadow: 1px 1px 0 rgba(0,0,0,0.2); }
        
        .dif-box-grid { display: flex; flex-direction: column; gap: 1.5rem; max-width: 350px; width: 90%; }
        .dif-card { background: white; padding: 1.5rem; border-radius: 20px; border: 5px solid #ccc; box-shadow: 0 8px 0 #ccc; display: flex; flex-direction: column; align-items: center; }
        .dif-card h3 { font-size: 2rem; color: #333; margin-bottom: 0.5rem; }
        .dif-usor { border-color: #66bb6a; box-shadow: 0 8px 0 #43a047; } .dif-usor h3 { color: #2e7d32; }
        .dif-mediu { border-color: #ffa726; box-shadow: 0 8px 0 #fb8c00; } .dif-mediu h3 { color: #e65100; }
        .dif-greu { border-color: #ef5350; box-shadow: 0 8px 0 #e53935; } .dif-greu h3 { color: #c62828; }
        
        /* BACKGROUND EVIRONMENT */
        .bg-env { position: absolute; top:0; left:0; right:0; bottom:0; z-index: 1; pointer-events: none; overflow: hidden; background: linear-gradient(180deg, #8fd3f4 0%, #e0f7fa 100%); }
        .soare { position: absolute; top: 5%; right: 5%; font-size: 6rem; animation: spin 20s linear infinite; }
        .curcubeu { position: absolute; top: -2%; left: -2%; font-size: 10rem; opacity: 0.8; animation: floatY 6s ease-in-out infinite; }
        .nor { position: absolute; font-size: 4rem; opacity: 0.8; animation: slideLeft linear infinite; right: -100px; }
        .stele-bg { position: absolute; top:0; left:0; width:100%; height:50%; }
        .stea-bg { position: absolute; font-size: 1.5rem; color: white; opacity: 0; animation: twinkle 4s ease-in-out infinite; }
        .iarba-container { position: absolute; bottom: -5%; left: 0; width: 100%; height: 20%; background: #a8e063; border-top-left-radius: 50% 20%; border-top-right-radius: 50% 20%; display: flex; justify-content: space-around; padding-top: 10px; }
        .fir-iarba { width: 10px; height: 30px; background: #68b32e; border-radius: 10px; transform-origin: bottom; animation: waveGrass 3s ease-in-out infinite alternate; }
        .fluture { position: absolute; font-size: 2rem; bottom: 20%; animation: flyButterfly 20s linear infinite; }
        
        /* CHARACTER ANIMATIONS */
        .anim-char { position: relative; display: inline-block; }
        .char-emoji { font-size: 5rem; display: block; }
        .char-mood { position: absolute; top: -10px; right: -10px; font-size: 2rem; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        .char-idle .char-emoji { animation: breathe 3s ease-in-out infinite; transform-origin: bottom; }
        .char-dance .char-emoji { animation: dance 0.6s ease-in-out infinite alternate; transform-origin: bottom; }
        .char-sad .char-emoji { animation: sadHead 1s ease-in-out infinite; transform-origin: bottom; filter: grayscale(50%); }

        /* FEEDBACK / GLOBAL EFFECTS */
        .shake-scr { animation: shakeScreen 0.4s ease-in-out; }
        .red-pulse { box-shadow: inset 0 0 50px rgba(255,0,0,0.6); }
        .expand-ring { position: absolute; top: 50%; left: 50%; width: 10px; height: 10px; border-radius: 50%; transform: translate(-50%, -50%); border: 20px solid rgba(139, 195, 74, 0.6); animation: ringOut 0.8s ease-out forwards; pointer-events: none; z-index: 99;}
        
        /* JOC BALOANE */
        .baloane-container { position: relative; width: 100%; height: 60vh; overflow: hidden; }
        .img-balon { position: absolute; font-size: 4rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .b-num { position: absolute; top: 20%; font-family: var(--main-font); font-size: 1.8rem; color: white; text-shadow: 2px 2px 0 #000; }
        .wrap-falling { animation: fallDown 15s linear infinite; }
        .wrap-popped-ok { animation: popGood 0.5s forwards; }
        .wrap-popped-bad { animation: popBad 0.5s forwards; }
        .wrap-fade-out { animation: fadeOut 0.5s forwards; }
        .char-bottom-left { position: absolute; bottom: 5%; left: 5%; }
        .q-box { background: white; padding: 1rem 2rem; border-radius: 99px; border: 4px solid #ff7043; font-size: 2rem; font-family: var(--main-font); box-shadow: 0 6px 0 #ff7043; display: inline-block; margin: 1rem auto; z-index: 20; }
        
        /* JOC TRENULET */
        .train-track { width: 100%; height: 30vh; border-bottom: 10px dashed #795548; position: relative; display: flex; align-items: flex-end; justify-content: center; }
        .train-cart { font-size: 6rem; position: relative; }
        .train-smoke { position: absolute; top: -40px; left: 0; font-size: 3rem; animation: floatUpSmoke 1s forwards; }
        .train-in-station { animation: slideToCenter 1s ease-out forwards; }
        .train-moving-out { animation: slideToRight 1s ease-in forwards; }
        .train-station-board { background: #ffe0b2; border: 5px solid #f57c00; padding: 1rem 2rem; border-radius: 10px; margin-left: 2rem; margin-bottom: 1rem; box-shadow: 4px 4px 0 rgba(0,0,0,0.1); }
        .train-options { display: flex; justify-content: center; gap: 1rem; margin-top: 3rem; flex-wrap: wrap; padding: 0 1rem; }
        .btn-train-opt { background: #fff; padding: 1.5rem; font-size: 2.5rem; border: 5px solid #29b6f6; border-radius: 20px; box-shadow: 0 6px 0 #0288d1; min-width: 80px; }
        .char-bottom-right { position: absolute; bottom: 5%; right: 5%; }

        /* JOC PESCUIT */
        .bg-water { background: linear-gradient(180deg, #4fc3f7 0%, #01579b 100%); }
        .bubble-box { background: rgba(255,255,255,0.9); border-color: #0288d1; box-shadow: 0 6px 0 #0288d1; border-radius: 30px; }
        .pond-container { position: relative; width: 100%; height: 50vh; }
        .img-fish { position: absolute; font-size: 4rem; cursor: pointer; }
        .f-num { position: absolute; top: 40%; left: 30%; font-family: var(--main-font); font-size: 1.5rem; color: white; text-shadow: 1px 1px 2px #000; }
        .fish-swim { animation: fishSwim 12s ease-in-out infinite alternate; }
        .fish-jump { animation: fishJumpOut 1s ease-in forwards; }
        .boat-char { position: absolute; bottom: 10%; font-size: 5rem; display: flex; align-items: flex-end; animation: floatY 3s infinite ease-in-out; }

        /* JOC RACHETA */
        .bg-space { background: linear-gradient(180deg, #1a237e 0%, #000000 100%); }
        .racheta-layout { display: flex; width: 100%; height: 80vh; padding: 1rem; align-items: flex-end; }
        .q-panel { flex: 1; display: flex; flex-direction: column; align-items:flex-start; margin-left:1rem;}
        .q-text { font-size: 3.5rem; margin-bottom: 2rem; color: #ffd54f; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; max-width: 300px; }
        .btn-rocket-opt { background: #3949ab; color: white; border: 4px solid #5c6bc0; font-size: 2.5rem; padding: 1.5rem; border-radius: 20px; box-shadow: 0 6px 0 #283593; }
        .rocket-track { width: 100px; height: 100%; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;}
        .track-line { position: absolute; top: 10%; bottom: 0; width: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; z-index: 1;}
        .star-goal { font-size: 4rem; position: absolute; top: 0; z-index: 2;}
        .the-rocket { font-size: 5rem; position: absolute; z-index: 3; transition: bottom 1s cubic-bezier(0.25, 1, 0.5, 1); }
        .rocket-idle { animation: floatY 2s infinite; }
        .rocket-boost { animation: rumble 0.5s infinite; }
        .fire { position: absolute; bottom: -30px; left: 15px; font-size: 3rem; animation: flicker 0.2s infinite; }

        /* REZULTAT */
        .bg-rez-perfect { background: radial-gradient(circle, #fff9c4 0%, #ffc107 100%); }
        .bg-rez-ok { background: radial-gradient(circle, #e1bee7 0%, #9c27b0 100%); color: white;}
        .stele-rezultat { display: flex; gap: 0.5rem; margin: 1.5rem 0; font-size: 2.5rem; flex-wrap: wrap; justify-content: center; }
        .stea-rez { transition: all 0.3s; transform: scale(0); opacity: 0; }
        .stea-rez.aprins { animation: popIn 0.5s forwards; filter: none; }
        .stea-rez.stins { animation: popIn 0.5s forwards; filter: grayscale(100%) opacity(0.3); }

        /* KEYFRAMES */
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideLeft { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150vw); } }
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes waveGrass { 0% { transform: skewX(-10deg); } 100% { transform: skewX(10deg); } }
        @keyframes flyButterfly { 0% { transform: translate(-50vw, 50vh) rotate(10deg); } 25% { transform: translate(0, 20vh) rotate(-10deg); } 50% { transform: translate(50vw, 40vh) rotate(10deg); } 100% { transform: translate(150vw, -10vh) rotate(-10deg); } }
        
        @keyframes breathe { 0%, 100% { transform: scaleY(1) scaleX(1); } 50% { transform: scaleY(0.95) scaleX(1.05); } }
        @keyframes dance { 0% { transform: rotate(-15deg) translateY(0); } 100% { transform: rotate(15deg) translateY(-20px); } }
        @keyframes sadHead { 0%, 100% { transform: translateX(0) rotate(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.5) translateY(20px); } 80% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeOut { to { opacity: 0; transform: scale(0.8); pointer-events: none; } }
        
        @keyframes shakeScreen { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-15px); } 40%, 80% { transform: translateX(15px); } }
        @keyframes ringOut { 0% { width: 10px; height: 10px; opacity: 1; border-width: 20px; } 100% { width: 300px; height: 300px; opacity: 0; border-width: 2px; } }
        
        @keyframes fallDown { 0% { transform: translateY(-30vh) rotate(0); } 100% { transform: translateY(120vh) rotate(20deg); } }
        @keyframes popGood { 0% { transform: scale(1); } 50% { transform: scale(1.4); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
        @keyframes popBad { 0% { transform: scale(1); filter: grayscale(0); } 50% { transform: scale(1.1); filter: grayscale(1); } 100% { transform: scale(1.1) translateY(100vh) rotate(90deg); opacity: 0; } }
        
        @keyframes slideToCenter { 0% { transform: translateX(-100vw); } 100% { transform: translateX(0); } }
        @keyframes slideToRight { 0% { transform: translateX(0); } 100% { transform: translateX(100vw); } }
        @keyframes floatUpSmoke { 0% { opacity: 1; transform: scale(0.5) translate(0,0); } 100% { opacity: 0; transform: scale(2) translate(-20px, -50px); } }
        
        @keyframes fishSwim { 0% { transform: translateX(-10vw) translateY(0) scaleX(-1); } 50% { transform: translateX(80vw) translateY(-20px) scaleX(-1); } 51% { transform: translateX(80vw) translateY(-20px) scaleX(1); } 100% { transform: translateX(-10vw) translateY(0) scaleX(1); } }
        @keyframes fishJumpOut { 0% { transform: scale(1); } 50% { transform: translateY(-200px) scale(1.5); opacity: 1; } 100% { transform: translateY(-500px) scale(0); opacity: 0; } }
        
        @keyframes rumble { 0% { transform: translate(0,0); } 25% { transform: translate(-2px, 2px); } 50% { transform: translate(2px, -2px); } 75% { transform: translate(2px, 2px); } 100% { transform: translate(-2px,-2px); } }
        @keyframes flicker { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }
        
        .fade-in { animation: popIn 0.5s ease; }
        .pulse-text { animation: twinkle 2s infinite alternate; }
        .wobble { animation: waveGrass 4s infinite alternate; }
        .bounce { animation: floatY 2s infinite ease-in-out; }
        .bounce-on-hover { transition: transform 0.2s; }
        
      `}</style>
      
      {!jocSelectat && <BackgroundEnvironment />}
      
      {faza === "personaj" && <SelectPersonaj onSelect={onSelectPersonaj} />}
      {faza === "meniu" && <SelectJoc personaj={personaj} onSelect={onSelectJoc} onBack={backLaPersonaj} />}
      {faza === "dificultate" && <SelectDificultate onSelect={onSelectDificultate} onBack={backLaMeniu} />}
      
      {faza === "joc" && jocSelectat === "baloane" && <JocBaloane personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "trenulet" && <JocTrenulet personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "pescuit" && <JocPescuit personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "racheta" && <JocRacheta personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
    </>
  );
}