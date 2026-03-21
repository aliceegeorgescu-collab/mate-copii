import { useState, useEffect, useRef } from "react";
import { createId, createRemoteProfile, getPlayerId, loadRemoteAccount, saveRemoteGameResult, saveRemoteProfileState } from "./persistence";
import { CharacterArt, PERSONAJE, getPersonajById } from "./CharacterArt";
import { JocGradinitaVesela, JocLabirintBatman } from "./ExtraGames";

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
function AnimatedCharacter({ personaj, stare, streak }) {
  let cls = "char-idle";
  if (stare === "corect") cls = "char-dance";
  if (stare === "gresit") cls = "char-sad";
  const isOnFire = streak >= 3;
  const resolved = getPersonajById(personaj?.id) || PERSONAJE[0];

  return (
    <div className={`anim-char ${cls} ${isOnFire ? "on-fire" : ""}`}>
      <CharacterArt personaj={resolved} stare={stare} streak={streak} />
    </div>
  );
}
function playDing() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = "sine"; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.5);
  } catch(e){}
}

function playBoing() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = "sawtooth"; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  } catch(e){}
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

function formatDateLabel(value) {
  if (!value) return "Nicio sesiune încă";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nicio sesiune încă";

  return date.toLocaleString("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getPersonajSimbol(personaj) {
  if (!personaj) return "EU";
  return personaj.simbol || personaj.nume?.slice(0, 2)?.toUpperCase() || "EU";
}

function formatGameLabel(gameId) {
  const labels = {
    baloane: "Prinde Răspunsul",
    trenulet: "Trenulețul Info",
    pescuit: "Pescuitul Numerelor",
    racheta: "Racheta spre Stele",
    cursa: "Cursa Mașinuțelor",
    labirint_batman: "Labirintul lui Batman",
    gradinita_vesela: "Gradinita Vesela",
  };

  return labels[gameId] ?? gameId;
}
function SelectProfil({ profiles, onSelect, onCreate }) {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  }

  return (
    <div className="screen center-screen z-front fade-in">
      <h1 className="titlu-mare wobble">👨‍👩‍👧‍👦 Alege copilul</h1>
      <p className="subtitlu pulse-text">Fiecare profil are progresul și istoricul lui.</p>
      <div className="profil-grid">
        {profiles.map((profile) => (
          <button key={profile.id} className="profil-card bounce-on-hover" onClick={() => onSelect(profile.id)}>
            <span className="profil-name">{profile.name}</span>
            <span className="profil-meta">⭐ {profile.steleGlobale} stele</span>
            <span className="profil-meta">🕒 {formatDateLabel(profile.lastSessionAt)}</span>
          </button>
        ))}
      </div>
      <form className="profil-form" onSubmit={handleSubmit}>
        <input
          className="profil-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Numele copilului"
          maxLength={30}
        />
        <button className="btn-maine bounce-on-hover" type="submit">Adaugă profil</button>
      </form>
    </div>
  );
}
function IstoricRezultate({ history }) {
  if (!history.length) {
    return <div className="istoric-empty">Încă nu există rezultate salvate pentru acest copil.</div>;
  }

  return (
    <div className="istoric-list">
      {history.slice(0, 6).map((entry) => (
        <div key={entry.id} className="istoric-item">
          <span>{formatGameLabel(entry.jocId)}</span>
          <span>{DIFICULTATI[entry.dificultate]?.label ?? entry.dificultate}</span>
          <span>{entry.scor}/{entry.maxExercitii}</span>
          <span>{formatDateLabel(entry.playedAt)}</span>
        </div>
      ))}
    </div>
  );
}
function SelectPersonaj({ onSelect }) {
  return (
    <div className="screen center-screen z-front fade-in">
      <h1 className="titlu-mare wobble">🌈 Matematică<br/>Magică!</h1>
      <p className="subtitlu pulse-text">Alege-ți personajul!</p>
      <div className="personaje-grid">
        {PERSONAJE.map(p => (
          <button key={p.id} className="personaj-btn bounce-on-hover" onClick={() => onSelect(p)} style={{ "--pc": p.culoare }}>
            <div className="personaj-figure"><CharacterArt personaj={p} stare="idle" size={132} className="select-character" /></div>
            <span className="personaj-nume">{p.nume}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function CameraTrofee({ stele }) {
  let trofeu = "Niciun trofeu încă";
  if (stele >= 150) trofeu = "🏆 Cupa de Aur";
  else if (stele >= 50) trofeu = "🥈 Cupa de Argint";
  else if (stele >= 20) trofeu = "🥉 Cupa de Bronz";

  return (
    <div className="trofee-box" style={{position:'absolute', top: '20px', right: '20px', background:'white', padding:'0.5rem 1rem', borderRadius:'20px', border:'4px solid #ffca28', boxShadow:'0 6px 0 #ffb300', textAlign:'center', zIndex:100}}>
       <div style={{fontSize:'1.8rem', fontWeight:'bold', color:'#f57f17'}}>⭐ {stele} stele</div>
       <div style={{fontSize:'1.2rem', marginTop:'0.2rem', color:'#333'}}>{trofeu}</div>
    </div>
  );
}
function SelectJoc({ personaj, profil, onSelect, onBack, onChangeCharacter, stele, sunetActivat, onToggleSunet }) {
  const jocuri = [
    { id: "baloane", nume: "Prinde Raspunsul", icon: "\uD83C\uDF88", cod: "A", bg: "linear-gradient(135deg,#ff9a9e,#fecfef)" },
    { id: "trenulet", nume: "Trenuletul Info", icon: "\uD83D\uDE82", cod: "B", bg: "linear-gradient(135deg,#a18cd1,#fbc2eb)" },
    { id: "pescuit", nume: "Pescuitul Numerelor", icon: "\uD83D\uDC1F", cod: "C", bg: "linear-gradient(135deg,#84fab0,#8fd3f4)" },
    { id: "racheta", nume: "Racheta spre Stele", icon: "\uD83D\uDE80", cod: "D", bg: "linear-gradient(135deg,#fccb90,#d57eeb)" },
    { id: "cursa", nume: "Cursa Masinutelor", icon: "\uD83C\uDFCE\uFE0F", cod: "E", bg: "linear-gradient(135deg,#ff0844,#ffb199)" },
    { id: "labirint_batman", nume: "Labirintul lui Batman", icon: "\uD83E\uDD87", cod: "F", bg: "linear-gradient(135deg,#111827,#1f3b8a)" },
    { id: "gradinita_vesela", nume: "Gradinita Vesela", icon: "\uD83E\uDDF8", cod: "G", bg: "linear-gradient(135deg,#ffd1dc,#f8bbd0)" },
  ];

  return (
    <div className="screen z-front fade-in">
      <CameraTrofee stele={stele} />
      <div className="sound-floating">
        <button className="btn-back" onClick={onToggleSunet}>{sunetActivat ? "Sunet ON" : "Sunet OFF"}</button>
      </div>
      <div className="top-bar multi-top-bar">
        <button className="btn-back" onClick={onBack}>Profiluri</button>
        <button className="btn-back" onClick={onChangeCharacter}>Personaj</button>
      </div>
      <div className="center-screen menu-layout">
        <AnimatedCharacter personaj={personaj} stare="idle" />
        <h2 className="titlu-mediu wobble">Ce joc alegem, {profil?.name ?? "campion"}?</h2>
        <div className="session-chip">Ultima sesiune: {formatDateLabel(profil?.lastSessionAt)}</div>
        <div className="jocuri-main-grid">
          {jocuri.map(j => (
            <button key={j.id} className="card-joc bounce-on-hover" onClick={() => onSelect(j.id)} style={{ background: j.bg }}>
              <span className="card-icon">{j.icon}</span>
              <span className="card-titlu">{j.nume}</span>
            </button>
          ))}
        </div>
        <div className="istoric-box">
          <h3>Istoric recent</h3>
          <IstoricRezultate history={profil?.history ?? []} />
        </div>
      </div>
    </div>
  );
}
function SelectDificultate({ jocId, onSelect, onBack }) {
  const descrieri = {
    labirint_batman: {
      usor: "Labirint 5x5 � 90 secunde � mai putini pereti",
      mediu: "Labirint 7x7 � 60 secunde",
      greu: "Labirint 9x9 � 45 secunde � multi pereti",
    },
    gradinita_vesela: {
      usor: "4 runde � culori si forme simple",
      mediu: "6 runde � mai multa varietate",
      greu: "8 runde � pana la 5 animale si toate formele",
    },
  };

  const esteLabirint = jocId === "labirint_batman";
  const esteGradinita = jocId === "gradinita_vesela";

  return (
    <div className="screen center-screen z-front fade-in">
      <div className="top-bar w-full"><button className="btn-back" onClick={onBack}>{"<- Inapoi"}</button></div>
      <h2 className="titlu-mediu wobble">Alege dificultatea</h2>
      <div className="dif-box-grid">
        {Object.entries(DIFICULTATI).map(([k, v]) => (
          <button key={k} className={`dif-card dif-${k} bounce-on-hover`} onClick={() => onSelect(k)}>
            <h3>{v.label}</h3>
            {esteLabirint || esteGradinita ? (
              <p>{descrieri[jocId]?.[k]}</p>
            ) : (
              <>
                <p>Timp: {v.timp} sec / exercitiu</p>
                <p>Exercitii: {v.ex}</p>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
function RezultatScreen({ scor, max, personaj, onBack }) {
  const steleAcordateRef = useRef(false);

  useEffect(() => {
    if (steleAcordateRef.current) return;
    steleAcordateRef.current = true;
    if (window.adaugaStele && scor > 0) window.adaugaStele(scor);
    if (window.inregistreazaRezultat) window.inregistreazaRezultat({ scor, max });
  }, [max, scor]);

  const pct = scor / max;
  let mesaj = "Nu-i bai, mai încearcă!";
  let bg = "bg-rez-ok";
  if (pct === 1) { mesaj = "PERFECT! Ești genial! 🌟"; bg = "bg-rez-perfect"; }
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
      <button className="btn-maine bounce-on-hover" onClick={onBack} style={{ marginTop: "2rem" }}>← Meniu principal</button>
    </div>
  );
}
function useGameEngine(dificultateId) {
  const dif = DIFICULTATI[dificultateId];
  const op = rand(0, 1) === 0 ? "+" : "-";
  
  const [nr, setNr] = useState(1);
  const [scor, setScor] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ales, setAles] = useState(null);
  const [q, setQ] = useState(() => generezaIntrebare(op, dificultateId));
  const [optiuni, setOptiuni] = useState(() => genOptiuni(q.raspuns, 20));
  
  const [stare, setStare] = useState("idle");
  const [timp, setTimp] = useState(dif.timp);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (stare !== "idle") return;
    timerRef.current = setInterval(() => {
      setTimp(t => {
        if (t <= 1) {
          handleGresit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stare, nr]);

  function raspunde(v) {
    if (stare !== "idle") return;
    clearInterval(timerRef.current);
    setAles(v);
    if (v === q.raspuns) {
      if(window.sunetActivat !== false) playDing();
      setStare("corect"); setScor(s => s + 1); setStreak(s => s + 1);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(nextIntrebare, 2000);
    } else {
      handleGresit();
    }
  }

  function handleGresit() {
    clearInterval(timerRef.current);
    if(window.sunetActivat !== false) playBoing();
    setStare("gresit"); setStreak(0);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextIntrebare, 2000);
  }

  function nextIntrebare() {
    clearTimeout(timeoutRef.current);
    if (nr >= dif.ex) { setStare("gata"); }
    else {
      const nop = rand(0, 1) === 0 ? "+" : "-";
      const nq = generezaIntrebare(nop, dificultateId);
      setAles(null);
      setQ(nq); setOptiuni(genOptiuni(nq.raspuns, 20));
      setTimp(dif.timp); setStare("idle"); setNr(n => n + 1);
    }
  }

  return { nr, scor, q, optiuni, stare, timp, dif, raspunde, streak, ales };
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
           <AnimatedCharacter personaj={personaj} stare={eng.stare} streak={eng.streak} />
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
           <AnimatedCharacter personaj={personaj} stare={eng.stare} streak={eng.streak} />
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
           ⛵<AnimatedCharacter personaj={personaj} stare={eng.stare} streak={eng.streak} />
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
           <div className="mt-2"><AnimatedCharacter personaj={personaj} stare={eng.stare} streak={eng.streak} /></div>
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

// ── E) CURSA MAȘINUȚELOR (JocCursa) ──────────────────────────────────────────
function JocCursa({ personaj, dificultate, onBack, peGata }) {
  const eng = useGameEngine(dificultate);
  const [compP, setCompP] = useState(0);
  
  useEffect(() => {
    if (eng.stare === "gata" || eng.stare !== "idle") return;
    const interval = setInterval(() => {
      setCompP(p => Math.min(100, p + (dificultate === "usor" ? 2 : dificultate === "mediu" ? 3 : 4)));
    }, 1000);
    return () => clearInterval(interval);
  }, [eng.stare, dificultate]);

  if (eng.stare === "gata") return <RezultatScreen scor={eng.scor} max={eng.dif.ex} personaj={personaj} onBack={peGata} />;

  const playerP = ((eng.nr - 1) / eng.dif.ex) * 100;
  
  return (
    <div className={`screen game-screen bg-env ${eng.stare === "gresit" ? "shake-scr red-pulse" : ""}`}>
      {eng.stare === "corect" && <ConfettiTop />}
      <div className="top-bar space-between z-front">
        <button className="btn-back" onClick={() => CheckConfirm(onBack)}>← Înapoi</button>
        <div className="hud">⏳ {eng.timp}s | 🎯 {eng.nr}/{eng.dif.ex} | ⭐ {eng.scor}</div>
      </div>
      
      <div className="joc-body z-front flex-col-center w-full" style={{paddingTop: '2rem'}}>
        <div className="q-box bounce z-front">Cât face: <b>{eng.q.a} {eng.q.op} {eng.q.b}</b> ?</div>
        <div className="z-front" style={{display:'flex', gap:'1rem', margin:'1rem'}}>
          {eng.optiuni.map(v => (
             <button key={v} className="btn-train-opt bounce-on-hover" onClick={() => eng.raspunde(v)} disabled={eng.stare !== "idle"}>{v}</button>
          ))}
        </div>
        
        <div style={{width:'90%', background:'#555', borderRadius:'10px', padding:'1rem', marginTop:'auto', marginBottom:'5%', position:'relative', boxShadow: '0 8px 0 #333'}}>
           <div style={{position:'absolute', right:'20px', top:0, bottom:0, width:'10px', background:'repeating-linear-gradient(45deg, white, white 10px, black 10px, black 20px)'}}></div>
           
           <div style={{height:'60px', borderBottom:'2px dashed #999', position:'relative', marginBottom:'10px'}}>
             <div style={{position:'absolute', left:`${playerP}%`, top:0, fontSize:'3.5rem', transition:'left 0.5s', zIndex:5}}>
               🏎️<span style={{fontSize:'1.2rem', position:'absolute', top:'-20px', left:'10px', background:'white', borderRadius:'10px', padding:'2px 8px'}}>{getPersonajSimbol(personaj)}</span>
             </div>
           </div>
           
           <div style={{height:'60px', position:'relative'}}>
             <div style={{position:'absolute', left:`${compP}%`, top:0, fontSize:'3.5rem', transition:'left 1s linear'}}>
               🚙<span style={{fontSize:'1.2rem', position:'absolute', top:'-20px', left:'10px', background:'black', color:'white', borderRadius:'10px', padding:'2px 8px'}}>PC</span>
             </div>
           </div>
        </div>
        <div className="char-bottom-left" style={{zIndex:0}}><AnimatedCharacter personaj={personaj} stare={eng.stare} streak={eng.streak} /></div>
      </div>
    </div>
  );
}

// ── APP MAIN ──────────────────────────────────────────────────────────────────

window.sunetActivat = true;

export default function LegacyGameApp({ user, onLogout }) {
  const [playerId] = useState(() => getPlayerId());
  const [syncReady, setSyncReady] = useState(false);
  const remoteSaveTimeoutRef = useRef(null);
  const selectedProfileIdRef = useRef(null);

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [steleGlobale, setSteleGlobale] = useState(0);
  const [sunetActivat, setSunetActivat] = useState(true);
  const [personaj, setPersonaj] = useState(null);
  const [faza, setFaza] = useState("profil");
  const [jocSelectat, setJocSelectat] = useState(null);
  const [dificultate, setDificultate] = useState(null);

  const profilActiv = profiles.find((profile) => profile.id === selectedProfileId) ?? null;

  function incarcaProfil(profile) {
    const chosenPersonaj = getPersonajById(profile?.personaj?.id) ?? null;
    setSelectedProfileId(profile?.id ?? null);
    setPersonaj(chosenPersonaj);
    setSteleGlobale(profile?.steleGlobale ?? 0);
    setSunetActivat(profile?.sunetActivat ?? true);
    setJocSelectat(null);
    setDificultate(null);
    setFaza(profile ? (chosenPersonaj ? "meniu" : "personaj") : "profil");
  }

  useEffect(() => {
    selectedProfileIdRef.current = selectedProfileId;
  }, [selectedProfileId]);


  useEffect(() => {
    window.sunetActivat = sunetActivat;
  }, [sunetActivat]);

  useEffect(() => {
    if (!selectedProfileId) return;
    setProfiles((current) => current.map((profile) => (
      profile.id === selectedProfileId
        ? { ...profile, personaj, steleGlobale, sunetActivat }
        : profile
    )));
  }, [personaj, selectedProfileId, steleGlobale, sunetActivat]);

  useEffect(() => {
    window.adaugaStele = (n) => setSteleGlobale((s) => s + n);
    return () => {
      delete window.adaugaStele;
    };
  }, []);

  useEffect(() => {
    window.inregistreazaRezultat = ({ scor, max }) => {
      if (!selectedProfileId || !jocSelectat || !dificultate) return;

      const result = {
        id: createId("result"),
        jocId: jocSelectat,
        dificultate,
        scor,
        maxExercitii: max,
        playedAt: new Date().toISOString(),
      };

      setProfiles((current) => current.map((profile) => {
        if (profile.id !== selectedProfileId) return profile;
        return {
          ...profile,
          lastSessionAt: result.playedAt,
          history: [result, ...(profile.history ?? [])].slice(0, 20),
        };
      }));

      saveRemoteGameResult(playerId, selectedProfileId, result).catch(() => {
        // Keep local history even if the API is temporarily unavailable.
      });
    };

    return () => {
      delete window.inregistreazaRezultat;
    };
  }, [dificultate, jocSelectat, playerId, selectedProfileId]);

  useEffect(() => {
    let ignore = false;

    loadRemoteAccount(playerId)
      .then((remoteAccount) => {
        if (ignore) return;
        const remoteProfiles = remoteAccount.profiles ?? [];
        if (remoteProfiles.length > 0) {
          setProfiles(remoteProfiles);
          const nextProfile = remoteProfiles.find((profile) => profile.id === selectedProfileIdRef.current) ?? remoteProfiles[0];
          incarcaProfil(nextProfile);
        }
      })
      .catch(() => {
        // Keep local fallback when the API is unavailable.
      })
      .finally(() => {
        if (!ignore) setSyncReady(true);
      });

    return () => {
      ignore = true;
    };
  }, [playerId]);

  useEffect(() => {
    if (!syncReady || !profilActiv) return undefined;

    clearTimeout(remoteSaveTimeoutRef.current);
    remoteSaveTimeoutRef.current = setTimeout(() => {
      saveRemoteProfileState(playerId, profilActiv).catch(async (error) => {
        if (String(error.message).includes("404")) {
          try {
            await createRemoteProfile(playerId, profilActiv);
          } catch {
            // Keep local fallback if profile creation also fails.
          }
        }
      });
    }, 300);

    return () => {
      clearTimeout(remoteSaveTimeoutRef.current);
    };
  }, [playerId, profilActiv, syncReady]);

  const toggleSunet = () => {
    setSunetActivat((activ) => !activ);
  };

  const onSelectProfil = (profileId) => {
    const nextProfile = profiles.find((profile) => profile.id === profileId) ?? null;
    incarcaProfil(nextProfile);
  };

  const onCreateProfil = (name) => {
    const profile = {
      id: createId("child"),
      name,
      personaj: null,
      steleGlobale: 0,
      sunetActivat: true,
      lastSessionAt: null,
      history: [],
    };

    setProfiles((current) => [...current, profile]);
    incarcaProfil(profile);
    createRemoteProfile(playerId, profile).catch(() => {
      // Local fallback remains available.
    });
  };

  const onSelectPersonaj = (p) => { setPersonaj(p); setFaza("meniu"); };
  const onSelectJoc = (jId) => { setJocSelectat(jId); setFaza("dificultate"); };
  const onSelectDificultate = (dId) => { setDificultate(dId); setFaza("joc"); };
  const backLaProfil = () => { setJocSelectat(null); setDificultate(null); setFaza("profil"); };
  const backLaPersonaj = () => { setJocSelectat(null); setDificultate(null); setFaza("personaj"); };
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
        .account-floating { position: fixed; top: 1rem; left: 1rem; z-index: 220; display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.96); border: 4px solid #ffd54f; border-radius: 20px; padding: 0.6rem 0.9rem; box-shadow: 0 8px 0 #ffb300; }
        .account-name { font-family: var(--main-font); color: #6d4c41; font-size: 1rem; }
        .btn-logout { padding: 0.55rem 1rem; border-radius: 99px; background: #ef5350; color: white; border: 3px solid #fff; font-size: 1rem; box-shadow: 0 4px 0 #c62828; }
        .btn-logout:hover { transform: translateY(2px); box-shadow: 0 2px 0 #c62828; }
        .btn-maine { padding: 1.2rem 2.5rem; font-size: 1.6rem; border-radius: 99px; background: #ff7043; color: white; border: 4px solid #fff; box-shadow: 0 8px 0 #d84315; }
        .btn-maine:hover { transform: translateY(4px); box-shadow: 0 4px 0 #d84315; }
        
        .top-bar { display: flex; width: 100%; padding: 0 1rem; align-items: center; }
        .sound-floating { position: absolute; top: 0; right: 1rem; z-index: 120; }
        .hud { font-size: 1.4rem; font-family: var(--main-font); background: white; padding: 0.5rem 1rem; border-radius: 99px; border: 3px solid #ccc; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-top: 1rem;}
        .border-white { border-color: white !important; background: transparent !important; color: white; }
        
        /* SELECTION GRIDS */
        .profil-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 220px)); gap: 1rem; margin-top: 2rem; }
        .profil-card { background: white; border: 4px solid #80cbc4; border-radius: 24px; padding: 1rem; box-shadow: 0 8px 0 #26a69a; display: flex; flex-direction: column; gap: 0.5rem; min-height: 140px; }
        .profil-form { display: flex; gap: 1rem; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; justify-content: center; }
        .profil-input { min-width: 260px; padding: 0.9rem 1rem; border-radius: 18px; border: 4px solid #80cbc4; font-size: 1.1rem; font-family: var(--sec-font); user-select: text; }
        .profil-name { font-size: 1.5rem; color: #00695c; }
        .profil-meta { font-size: 0.95rem; font-family: var(--sec-font); color: #455a64; }
        .menu-layout { gap: 1rem; padding-bottom: 2rem; }
        .multi-top-bar { justify-content: space-between; }
        .session-chip { background: rgba(255,255,255,0.9); border: 3px solid #80cbc4; border-radius: 99px; padding: 0.6rem 1rem; font-family: var(--main-font); color: #00695c; }
        .istoric-box { width: min(90vw, 720px); background: rgba(255,255,255,0.92); border: 4px solid #ffd54f; border-radius: 24px; padding: 1rem 1.2rem; box-shadow: 0 8px 0 #ffb300; }
        .istoric-box h3 { color: #e65100; margin-bottom: 0.8rem; }
        .istoric-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .istoric-item { display: grid; grid-template-columns: 1.4fr 1fr 0.7fr 1.3fr; gap: 0.5rem; align-items: center; background: #fff8e1; border-radius: 14px; padding: 0.7rem 0.9rem; font-family: var(--sec-font); font-weight: 700; }
        .istoric-empty { font-family: var(--sec-font); color: #6d4c41; }
                .personaje-grid { display: grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: 1.25rem; margin-top: 2rem; width: min(94vw, 1120px); }
        .personaj-btn { background: white; border: 5px solid var(--pc); border-radius: 30px; padding: 1.15rem 1rem; box-shadow: 0 8px 0 var(--pc); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 235px; }
        .personaj-btn:active { transform: translateY(6px); box-shadow: 0 2px 0 var(--pc); }
        .personaj-figure { width: 132px; height: 132px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
        .personaj-nume { font-size: 1.2rem; margin-top: 0.4rem; color: #333; text-align: center; line-height: 1.2; }
        
        .jocuri-main-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1.2rem; width: min(94vw, 860px); margin: 2rem auto; }
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
        .anim-char { position: relative; display: inline-flex; align-items: flex-end; justify-content: center; min-width: 120px; min-height: 120px; }
        .char-art { position: relative; display: inline-flex; align-items: center; justify-content: center; transform-origin: center bottom; transition: transform 0.35s ease, filter 0.35s ease; }
        .char-svg { width: 100%; height: 100%; overflow: visible; }
        .char-art.is-streak,
        .anim-char.on-fire .char-art { filter: drop-shadow(0 0 14px rgba(255, 193, 7, 0.95)) drop-shadow(0 0 28px rgba(255, 152, 0, 0.45)); }
        .char-art .fx-batarang,
        .char-art .fx-heart,
        .char-art .fx-sparkle,
        .char-art .fx-bubble,
        .char-art .fx-lightning,
        .char-art .fx-tear { opacity: 0; }
        .char-art.batman.state-idle .cape { animation: capeWave 2.4s ease-in-out infinite; transform-origin: 80px 76px; }
        .char-art.batman.state-corect .hero { animation: heroLeap 1s ease; }
        .char-art.batman.state-corect .fx-batarang { opacity: 1; animation: batarangFly 1s ease forwards; }
        .char-art.batman.state-gresit .brow-left { animation: browFrownLeft 0.8s ease forwards; }
        .char-art.batman.state-gresit .brow-right { animation: browFrownRight 0.8s ease forwards; }
        .char-art.sarpe.state-idle .snake-body,
        .char-art.sarpe.state-idle .snake-belly { animation: snakeWave 2.5s ease-in-out infinite; transform-origin: 82px 104px; }
        .char-art.sarpe.state-corect .hero { animation: snakeRise 1s ease; }
        .char-art.sarpe.state-corect .fx-heart { opacity: 1; animation: heartFloat 1s ease forwards; }
        .char-art.sarpe.state-gresit .hero { animation: snakeCurl 0.8s ease forwards; transform-origin: 80px 118px; }
        .char-art.liliac.state-idle .wing-left { animation: wingLeft 2s ease-in-out infinite; transform-origin: 78px 88px; }
        .char-art.liliac.state-idle .wing-right { animation: wingRight 2s ease-in-out infinite; transform-origin: 82px 88px; }
        .char-art.liliac.state-corect .hero { animation: batLoop 1s ease; transform-origin: 80px 88px; }
        .char-art.liliac.state-corect .fx-sparkle { opacity: 1; animation: sparkleOrbit 1s ease forwards; }
        .char-art.liliac.state-gresit .hero { animation: batHang 0.8s ease forwards; transform-origin: 80px 92px; }
        .char-art.ponei.state-idle .mane,
        .char-art.ponei.state-idle .tail { animation: maneWave 2.4s ease-in-out infinite; transform-origin: 76px 82px; }
        .char-art.ponei.state-corect .hero { animation: ponyGallop 1s ease; }
        .char-art.ponei.state-corect .fx-sparkle { opacity: 1; animation: sparkleTrail 1s ease forwards; }
        .char-art.ponei.state-gresit .front-hoof { animation: hoofTap 0.8s ease; }
        .char-art.ponei.state-gresit .hero { animation: ponySad 0.8s ease; }
        .char-art.spongebob.state-idle .sponge-body { animation: spongeBobIdle 1.8s ease-in-out infinite; transform-origin: center bottom; }
        .char-art.spongebob.state-corect .hero { animation: spongeLaugh 1s ease; }
        .char-art.spongebob.state-corect .fx-bubble { opacity: 1; animation: bubbleRise 1s ease forwards; }
        .char-art.spongebob.state-gresit .hero { animation: spongeCry 0.8s ease; }
        .char-art.spongebob.state-gresit .fx-tear { opacity: 1; animation: tearFall 0.8s ease forwards; }
        .char-art.pikachu.state-idle .cheek { animation: cheekGlow 1.5s ease-in-out infinite; }
        .char-art.pikachu.state-corect .hero { animation: pikachuHop 1s ease; }
        .char-art.pikachu.state-corect .fx-lightning { opacity: 1; animation: lightningStrike 1s ease forwards; }
        .char-art.pikachu.state-gresit .ear-left { animation: earDropLeft 0.8s ease forwards; transform-origin: 63px 42px; }
        .char-art.pikachu.state-gresit .ear-right { animation: earDropRight 0.8s ease forwards; transform-origin: 97px 42px; }
        .char-art.minion.state-idle .pupil-group { animation: minionEyes 2.6s ease-in-out infinite; }
        .char-art.minion.state-corect .hero { animation: minionJump 1s ease; }
        .char-art.minion.state-gresit .hero { animation: minionFall 0.8s ease forwards; transform-origin: 80px 120px; }
        .char-art.dory.state-idle .fish-body { animation: dorySwim 2.8s ease-in-out infinite; transform-origin: 80px 82px; }
        .char-art.dory.state-corect .hero { animation: doryJump 1s ease; transform-origin: 80px 82px; }
        .char-art.dory.state-corect .fx-bubble { opacity: 1; animation: bubbleRise 1s ease forwards; }
        .char-art.dory.state-gresit .hero { animation: dorySpin 0.8s ease; transform-origin: 80px 82px; }

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
        @keyframes capeWave { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(7deg); } }
        @keyframes heroLeap { 0% { transform: translateY(0) scale(1); } 35% { transform: translateY(-18px) scale(1.04); } 70% { transform: translateY(0) scale(1.02); } 100% { transform: translateY(0) scale(1); } }
        @keyframes batarangFly { 0% { transform: translate(-6px, 10px) rotate(0deg); } 100% { transform: translate(30px, -18px) rotate(260deg); } }
        @keyframes browFrownLeft { 0% { transform: rotate(0deg) translateY(0); } 100% { transform: rotate(16deg) translateY(2px); } }
        @keyframes browFrownRight { 0% { transform: rotate(0deg) translateY(0); } 100% { transform: rotate(-16deg) translateY(2px); } }
        @keyframes snakeWave { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-7px) scaleY(1.04); } }
        @keyframes snakeRise { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-14px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }
        @keyframes heartFloat { 0% { opacity: 0; transform: translateY(12px) scale(0.4); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-14px) scale(1.1); } }
        @keyframes snakeCurl { 0% { transform: scale(1); } 100% { transform: scale(0.82) translateY(12px); } }
        @keyframes wingLeft { 0%, 100% { transform: rotate(7deg); } 50% { transform: rotate(20deg); } }
        @keyframes wingRight { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(-20deg); } }
        @keyframes batLoop { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(10px, -16px) rotate(12deg); } 50% { transform: translate(-6px, -22px) rotate(-8deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes sparkleOrbit { 0% { opacity: 0; transform: rotate(0deg) scale(0.5); } 35% { opacity: 1; } 100% { opacity: 0; transform: rotate(180deg) scale(1.15); } }
        @keyframes batHang { 0% { transform: rotate(0deg) translateY(0); } 100% { transform: rotate(180deg) translateY(-12px); } }
        @keyframes maneWave { 0%, 100% { transform: rotate(-3deg) translateY(0); } 50% { transform: rotate(5deg) translateY(-3px); } }
        @keyframes ponyGallop { 0% { transform: translateX(0) translateY(0); } 30% { transform: translateX(14px) translateY(-10px); } 60% { transform: translateX(-6px) translateY(-4px); } 100% { transform: translateX(0) translateY(0); } }
        @keyframes sparkleTrail { 0% { opacity: 0; transform: translateX(-10px) scale(0.4); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateX(16px) scale(1.15); } }
        @keyframes hoofTap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        @keyframes ponySad { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(7px) rotate(-3deg); } }
        @keyframes spongeBobIdle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes spongeLaugh { 0% { transform: scale(1); } 25% { transform: scale(1.08) translateY(-10px); } 100% { transform: scale(1); } }
        @keyframes bubbleRise { 0% { opacity: 0; transform: translateY(10px) scale(0.7); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-18px) scale(1.18); } }
        @keyframes spongeCry { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(10px) scaleY(0.98); } }
        @keyframes tearFall { 0% { opacity: 0; transform: translateY(-4px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(18px); } }
        @keyframes cheekGlow { 0%, 100% { filter: drop-shadow(0 0 0 rgba(255, 235, 59, 0)); } 50% { filter: drop-shadow(0 0 10px rgba(255, 235, 59, 0.95)); } }
        @keyframes pikachuHop { 0% { transform: translateY(0); } 30% { transform: translateY(-15px) scale(1.05); } 100% { transform: translateY(0); } }
        @keyframes lightningStrike { 0% { opacity: 0; } 20% { opacity: 1; } 45% { opacity: 0.25; } 70% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes earDropLeft { 0% { transform: rotate(0deg); } 100% { transform: rotate(-20deg) translate(-2px, 6px); } }
        @keyframes earDropRight { 0% { transform: rotate(0deg); } 100% { transform: rotate(20deg) translate(2px, 6px); } }
        @keyframes minionEyes { 0%, 100% { transform: translateX(0); } 35% { transform: translateX(-4px); } 70% { transform: translateX(4px); } }
        @keyframes minionJump { 0% { transform: translateY(0); } 30% { transform: translateY(-18px) scale(1.04); } 100% { transform: translateY(0); } }
        @keyframes minionFall { 0% { transform: rotate(0deg); } 100% { transform: rotate(92deg) translateY(10px); } }
        @keyframes dorySwim { 0%, 100% { transform: translateX(-6px); } 50% { transform: translateX(8px); } }
        @keyframes doryJump { 0% { transform: translateY(0) rotate(0deg); } 45% { transform: translateY(-18px) rotate(-7deg); } 100% { transform: translateY(0) rotate(0deg); } }
        @keyframes dorySpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
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
        @keyframes vibrate { 0% { transform: translate(2px, 2px); } 50% { transform: translate(-2px, -2px); } 100% { transform: translate(2px, -2px); } }
        
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
      
      <div className="account-floating">
        <span className="account-name">Cont: {user?.numeComplet || user?.username || "Utilizator"}</span>
        {onLogout ? <button className="btn-logout" onClick={onLogout}>Logout</button> : null}
      </div>

      {!jocSelectat && <BackgroundEnvironment />}
      
      {faza === "profil" && <SelectProfil profiles={profiles} onSelect={onSelectProfil} onCreate={onCreateProfil} />}
      {faza === "personaj" && <SelectPersonaj onSelect={onSelectPersonaj} />}
      {faza === "meniu" && <SelectJoc personaj={personaj} profil={profilActiv} onSelect={onSelectJoc} onBack={backLaProfil} onChangeCharacter={backLaPersonaj} stele={steleGlobale} sunetActivat={sunetActivat} onToggleSunet={toggleSunet} />}
      {faza === "dificultate" && <SelectDificultate jocId={jocSelectat} onSelect={onSelectDificultate} onBack={backLaMeniu} />}
      
      {faza === "joc" && jocSelectat === "baloane" && <JocBaloane personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "trenulet" && <JocTrenulet personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "pescuit" && <JocPescuit personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "racheta" && <JocRacheta personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "cursa" && <JocCursa personaj={personaj} dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "labirint_batman" && <JocLabirintBatman dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
      {faza === "joc" && jocSelectat === "gradinita_vesela" && <JocGradinitaVesela dificultate={dificultate} onBack={backLaMeniu} peGata={backLaMeniu} />}
    </>
  );
}












