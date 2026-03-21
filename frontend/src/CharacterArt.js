export const PERSONAJE = [
  { id: "batman", nume: "Batman", culoare: "#1a1a2e", simbol: "BM" },
  { id: "sarpe", nume: "Sarpe simpatic", culoare: "#2e7d32", simbol: "SS" },
  { id: "liliac", nume: "Liliac simpatic", culoare: "#6a1b9a", simbol: "LB" },
  { id: "ponei", nume: "Ponei curcubeu", culoare: "#f06292", simbol: "PN" },
  { id: "spongebob", nume: "SpongeBob", culoare: "#f9a825", simbol: "SB" },
  { id: "pikachu", nume: "Pikachu", culoare: "#ffeb3b", simbol: "PK" },
  { id: "minion", nume: "Minion", culoare: "#fdd835", simbol: "MN" },
  { id: "dory", nume: "Dory", culoare: "#1565c0", simbol: "DR" },
];

export function getPersonajById(id) {
  return PERSONAJE.find((personaj) => personaj.id === id) || null;
}

function BatmanSvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="28" ry="7" fill="rgba(0,0,0,0.18)" />
      <g className="hero">
        <path className="cape" d="M44 72 C30 88 28 118 44 146 L116 146 C132 118 130 88 116 72 C104 86 94 92 80 92 C66 92 56 86 44 72Z" fill="#243b82" />
        <rect x="58" y="60" width="44" height="58" rx="20" fill="#1f4ea0" />
        <rect x="58" y="100" width="44" height="8" rx="4" fill="#fdd835" />
        <path d="M66 79 C71 70 76 77 80 73 C84 77 89 70 94 79 C89 81 86 84 80 83 C74 84 71 81 66 79Z" fill="#fdd835" />
        <ellipse cx="80" cy="38" rx="24" ry="22" fill="#151521" />
        <polygon points="61,20 69,6 74,24" fill="#151521" />
        <polygon points="99,20 91,6 86,24" fill="#151521" />
        <path d="M60 34 H100 V49 C94 54 89 57 80 57 C71 57 66 54 60 49Z" fill="#0f0f16" />
        <ellipse cx="72" cy="42" rx="6" ry="4" fill="#ffffff" />
        <ellipse cx="88" cy="42" rx="6" ry="4" fill="#ffffff" />
        <circle cx="72" cy="42" r="1.7" fill="#111" />
        <circle cx="88" cy="42" r="1.7" fill="#111" />
        <path className="brow brow-left" d="M66 36 L76 33" stroke="#0f0f16" strokeWidth="3.5" strokeLinecap="round" />
        <path className="brow brow-right" d="M84 33 L94 36" stroke="#0f0f16" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M73 54 Q80 59 87 54" stroke="#ffccbc" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="50" y="70" width="12" height="35" rx="6" fill="#151521" />
        <rect x="98" y="70" width="12" height="35" rx="6" fill="#151521" />
        <rect x="63" y="118" width="11" height="24" rx="6" fill="#151521" />
        <rect x="86" y="118" width="11" height="24" rx="6" fill="#151521" />
      </g>
      <g className="fx-batarang">
        <path d="M112 34 L124 28 L120 39 L128 42 L118 44 L115 54 L110 44 L100 42 L109 39 Z" fill="#fdd835" />
      </g>
    </>
  );
}

function SnakeSvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="30" ry="7" fill="rgba(0,0,0,0.16)" />
      <g className="hero">
        <path className="snake-body" d="M46 124 C36 102 44 82 64 84 C84 86 74 116 96 118 C118 120 124 102 114 78" fill="none" stroke="#2e7d32" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        <path className="snake-belly" d="M52 122 C45 103 50 90 65 92 C80 94 80 116 95 118 C108 120 112 106 105 86" fill="none" stroke="#81c784" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="108" cy="58" r="24" fill="#2e7d32" />
        <ellipse cx="108" cy="66" rx="17" ry="14" fill="#a5d6a7" />
        <circle cx="99" cy="54" r="6" fill="#fff" />
        <circle cx="117" cy="54" r="6" fill="#fff" />
        <circle cx="100" cy="55" r="2.5" fill="#111" />
        <circle cx="118" cy="55" r="2.5" fill="#111" />
        <path d="M101 68 Q108 73 115 68" stroke="#1b5e20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M108 71 V83 M108 83 L101 90 M108 83 L115 90" stroke="#e53935" strokeWidth="3" strokeLinecap="round" />
        <path d="M58 112 C63 103 71 103 76 112" stroke="#43a047" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M71 123 C76 115 84 115 89 123" stroke="#43a047" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g className="fx-heart">
        <path d="M124 30 C124 23 132 21 136 27 C140 21 148 23 148 30 C148 41 136 48 136 48 C136 48 124 41 124 30Z" fill="#ff5c8d" />
      </g>
    </>
  );
}

function BatCuteSvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="28" ry="6" fill="rgba(0,0,0,0.15)" />
      <g className="hero">
        <path className="wing wing-left" d="M78 78 C46 54 30 64 24 96 C40 82 52 88 66 104 Z" fill="#7b1fa2" />
        <path className="wing wing-right" d="M82 78 C114 54 130 64 136 96 C120 82 108 88 94 104 Z" fill="#7b1fa2" />
        <ellipse cx="80" cy="92" rx="24" ry="30" fill="#8e24aa" />
        <ellipse cx="80" cy="56" rx="20" ry="18" fill="#8e24aa" />
        <polygon points="66,42 58,20 74,36" fill="#8e24aa" />
        <polygon points="94,42 102,20 86,36" fill="#8e24aa" />
        <ellipse cx="72" cy="55" rx="7" ry="9" fill="#e3f2fd" />
        <ellipse cx="88" cy="55" rx="7" ry="9" fill="#e3f2fd" />
        <circle cx="72" cy="57" r="3" fill="#42a5f5" />
        <circle cx="88" cy="57" r="3" fill="#42a5f5" />
        <circle cx="80" cy="64" r="3" fill="#f48fb1" />
        <path d="M72 68 Q80 74 88 68" stroke="#5e35b1" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M66 106 Q80 118 94 106" stroke="#6a1b9a" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g className="fx-sparkle">
        <path d="M124 30 L128 40 L138 44 L128 48 L124 58 L120 48 L110 44 L120 40 Z" fill="#ffe082" />
        <path d="M42 24 L45 31 L52 34 L45 37 L42 44 L39 37 L32 34 L39 31 Z" fill="#fff59d" />
        <circle cx="136" cy="66" r="4" fill="#fff59d" />
      </g>
    </>
  );
}

function PonySvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="34" ry="7" fill="rgba(0,0,0,0.16)" />
      <g className="hero">
        <path className="tail rainbow-tail" d="M44 98 C24 110 20 132 40 138 C54 140 62 130 60 112" fill="none" stroke="#42a5f5" strokeWidth="12" strokeLinecap="round" />
        <path className="tail rainbow-tail-2" d="M44 96 C25 106 22 126 42 132" fill="none" stroke="#fdd835" strokeWidth="7" strokeLinecap="round" />
        <path className="tail rainbow-tail-3" d="M44 100 C28 112 28 124 44 128" fill="none" stroke="#ef5350" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="72" cy="96" rx="34" ry="22" fill="#f48fb1" />
        <circle cx="108" cy="78" r="22" fill="#f48fb1" />
        <path className="wing wing-pony" d="M70 78 C54 62 46 82 54 96 C62 104 74 96 78 84" fill="#ffd1e7" />
        <path className="mane mane-red" d="M86 56 C72 40 80 20 104 22 C116 26 116 42 108 60" fill="#ff7043" />
        <path className="mane mane-yellow" d="M94 55 C86 34 98 22 116 28 C120 34 118 48 110 62" fill="#ffd54f" />
        <path className="mane mane-blue" d="M100 58 C98 36 112 34 124 42 C126 52 120 62 110 68" fill="#42a5f5" />
        <path d="M102 54 L106 36 L112 54" fill="#fefefe" stroke="#ffd54f" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="96,58 90,45 101,51" fill="#f48fb1" />
        <ellipse cx="116" cy="76" rx="8" ry="11" fill="#fff" />
        <circle cx="117" cy="77" r="3.2" fill="#5c6bc0" />
        <circle cx="119" cy="75" r="1.1" fill="#fff" />
        <circle cx="127" cy="82" r="2.2" fill="#f48fb1" />
        <path d="M111 87 Q117 92 123 87" stroke="#ad1457" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M74 92 L74 136 M58 92 L58 136 M92 98 L92 136 M108 96 L108 136" stroke="#f06292" strokeWidth="8" strokeLinecap="round" />
        <path className="front-hoof" d="M108 136 h12" stroke="#f8bbd0" strokeWidth="5" strokeLinecap="round" />
        <path d="M72 92 C76 80 88 76 102 76" stroke="#f8bbd0" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M68 100 l7 -8 l7 8 l-7 8 z" fill="#fff59d" />
      </g>
      <g className="fx-sparkle">
        <path d="M128 30 L131 38 L139 41 L131 44 L128 52 L125 44 L117 41 L125 38 Z" fill="#fff59d" />
        <circle cx="138" cy="66" r="5" fill="#ffe082" />
        <circle cx="32" cy="42" r="4" fill="#fff59d" />
      </g>
    </>
  );
}

function SpongeBobSvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="30" ry="7" fill="rgba(0,0,0,0.14)" />
      <g className="hero">
        <rect className="sponge-body" x="48" y="34" width="64" height="78" rx="12" fill="#fdd835" stroke="#f9a825" strokeWidth="4" />
        <circle cx="60" cy="50" r="5" fill="#e6b800" />
        <circle cx="95" cy="44" r="4" fill="#e6b800" />
        <circle cx="84" cy="69" r="6" fill="#e6b800" />
        <circle cx="67" cy="86" r="4" fill="#e6b800" />
        <rect x="48" y="88" width="64" height="24" fill="#8d6e63" />
        <rect x="48" y="82" width="64" height="8" fill="#ffffff" />
        <path d="M76 88 L80 98 L84 88" fill="#d32f2f" />
        <path d="M80 98 V111" stroke="#d32f2f" strokeWidth="4" strokeLinecap="round" />
        <line x1="48" y1="100" x2="112" y2="100" stroke="#263238" strokeWidth="3" />
        <line x1="60" y1="112" x2="56" y2="138" stroke="#fbc02d" strokeWidth="5" strokeLinecap="round" />
        <line x1="100" y1="112" x2="104" y2="138" stroke="#fbc02d" strokeWidth="5" strokeLinecap="round" />
        <line x1="46" y1="82" x2="28" y2="98" stroke="#fbc02d" strokeWidth="5" strokeLinecap="round" />
        <line x1="114" y1="82" x2="132" y2="98" stroke="#fbc02d" strokeWidth="5" strokeLinecap="round" />
        <circle cx="70" cy="60" r="12" fill="#fff" />
        <circle cx="90" cy="60" r="12" fill="#fff" />
        <circle cx="70" cy="61" r="5" fill="#42a5f5" />
        <circle cx="90" cy="61" r="5" fill="#42a5f5" />
        <circle cx="70" cy="61" r="2.4" fill="#111" />
        <circle cx="90" cy="61" r="2.4" fill="#111" />
        <path d="M68 50 L64 42 M72 50 L70 40 M88 50 L90 40 M92 50 L96 42" stroke="#263238" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="74" r="4" fill="#f48fb1" />
        <circle cx="100" cy="74" r="4" fill="#f48fb1" />
        <path d="M66 76 Q80 88 94 76" stroke="#6d4c41" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="72" y="77" width="8" height="11" rx="1.5" fill="#fff" />
        <rect x="80" y="77" width="8" height="11" rx="1.5" fill="#fff" />
      </g>
      <g className="fx-bubble">
        <circle cx="122" cy="28" r="8" fill="rgba(255,255,255,0.75)" stroke="#90caf9" strokeWidth="2" />
        <circle cx="132" cy="48" r="5" fill="rgba(255,255,255,0.7)" stroke="#bbdefb" strokeWidth="2" />
        <circle cx="34" cy="34" r="6" fill="rgba(255,255,255,0.75)" stroke="#90caf9" strokeWidth="2" />
      </g>
      <g className="fx-tear">
        <path d="M59 86 C55 95 56 104 61 112" stroke="#64b5f6" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M101 86 C105 95 104 104 99 112" stroke="#64b5f6" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

function PikachuSvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="29" ry="7" fill="rgba(0,0,0,0.15)" />
      <g className="hero">
        <path className="tail" d="M112 86 L144 70 L128 100 L146 100 L116 124 L124 106 L106 106 Z" fill="#ffeb3b" stroke="#f9a825" strokeWidth="4" strokeLinejoin="round" />
        <ellipse cx="80" cy="88" rx="28" ry="34" fill="#ffeb3b" stroke="#f9a825" strokeWidth="4" />
        <ellipse cx="80" cy="54" rx="24" ry="22" fill="#ffeb3b" stroke="#f9a825" strokeWidth="4" />
        <path className="ear ear-left" d="M63 42 L49 6 L70 28 Z" fill="#ffeb3b" stroke="#f9a825" strokeWidth="3" strokeLinejoin="round" />
        <path className="ear ear-right" d="M97 42 L111 6 L90 28 Z" fill="#ffeb3b" stroke="#f9a825" strokeWidth="3" strokeLinejoin="round" />
        <path d="M54 20 L64 10 L68 23" fill="#212121" />
        <path d="M106 20 L96 10 L92 23" fill="#212121" />
        <circle cx="69" cy="54" r="5" fill="#212121" />
        <circle cx="91" cy="54" r="5" fill="#212121" />
        <circle cx="60" cy="68" r="9" className="cheek" fill="#e53935" />
        <circle cx="100" cy="68" r="9" className="cheek" fill="#e53935" />
        <path d="M72 66 Q80 72 88 66" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M67 92 L56 104 M93 92 L104 104" stroke="#f9a825" strokeWidth="6" strokeLinecap="round" />
        <path d="M69 106 L62 136 M91 106 L98 136" stroke="#f9a825" strokeWidth="8" strokeLinecap="round" />
        <path d="M66 96 C70 104 76 106 80 106 C84 106 90 104 94 96" stroke="#8d6e63" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g className="fx-lightning">
        <path d="M126 28 L114 54 H126 L110 84" stroke="#ffd54f" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 26 L32 48 H42 L28 72" stroke="#fff176" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

function MinionSvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="28" ry="7" fill="rgba(0,0,0,0.16)" />
      <g className="hero">
        <rect x="52" y="26" width="56" height="96" rx="28" fill="#fdd835" stroke="#f9a825" strokeWidth="4" />
        <path d="M52 80 H108 V122 H52 Z" fill="#1976d2" />
        <path d="M62 80 V58 M98 80 V58" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
        <rect x="52" y="54" width="56" height="10" fill="#455a64" />
        <circle cx="68" cy="59" r="13" fill="#cfd8dc" stroke="#607d8b" strokeWidth="4" />
        <circle cx="92" cy="59" r="13" fill="#cfd8dc" stroke="#607d8b" strokeWidth="4" />
        <g className="pupil-group">
          <circle cx="68" cy="59" r="7" fill="#fff" />
          <circle cx="92" cy="59" r="7" fill="#fff" />
          <circle cx="68" cy="60" r="3.3" fill="#5d4037" />
          <circle cx="92" cy="60" r="3.3" fill="#5d4037" />
        </g>
        <path d="M69 88 Q80 97 91 88" stroke="#5d4037" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M74 90 H86" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M61 22 L58 10 M80 20 L80 8 M99 22 L102 10" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
        <line x1="52" y1="90" x2="30" y2="102" stroke="#f9a825" strokeWidth="6" strokeLinecap="round" />
        <line x1="108" y1="90" x2="130" y2="102" stroke="#f9a825" strokeWidth="6" strokeLinecap="round" />
        <line x1="68" y1="122" x2="62" y2="140" stroke="#263238" strokeWidth="6" strokeLinecap="round" />
        <line x1="92" y1="122" x2="98" y2="140" stroke="#263238" strokeWidth="6" strokeLinecap="round" />
        <circle cx="33" cy="103" r="4" fill="#fff" />
        <circle cx="127" cy="103" r="4" fill="#fff" />
      </g>
    </>
  );
}

function DorySvg() {
  return (
    <>
      <ellipse cx="80" cy="146" rx="34" ry="7" fill="rgba(0,0,0,0.12)" />
      <g className="hero fish-body">
        <path d="M36 82 C42 48 96 32 122 58 C136 72 136 92 122 106 C96 132 42 116 36 82Z" fill="#1e88e5" />
        <path d="M44 82 C50 58 90 46 110 62 C120 72 120 92 110 102 C90 118 50 106 44 82Z" fill="#1565c0" />
        <path d="M116 58 C136 44 146 54 144 72 C140 76 132 80 122 82" fill="#ffd54f" />
        <path d="M116 106 C136 120 146 110 144 92 C140 88 132 84 122 82" fill="#ffd54f" />
        <path d="M70 42 C84 30 100 34 108 48 C92 50 80 52 70 42Z" fill="#ffd54f" />
        <path d="M72 118 C82 132 98 132 106 120 C90 118 80 116 72 118Z" fill="#ffd54f" />
        <path d="M72 42 C86 52 96 64 100 82 C96 100 86 112 72 122" stroke="#0d47a1" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="62" cy="72" r="13" fill="#fff" />
        <circle cx="62" cy="74" r="6" fill="#263238" />
        <circle cx="65" cy="72" r="1.8" fill="#fff" />
        <path d="M54 94 Q66 102 80 94" stroke="#0d47a1" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="88" cy="90" r="3.5" fill="#0d47a1" opacity="0.55" />
      </g>
      <g className="fx-bubble">
        <circle cx="118" cy="34" r="7" fill="rgba(255,255,255,0.8)" stroke="#90caf9" strokeWidth="2" />
        <circle cx="130" cy="52" r="5" fill="rgba(255,255,255,0.75)" stroke="#bbdefb" strokeWidth="2" />
        <circle cx="38" cy="40" r="6" fill="rgba(255,255,255,0.75)" stroke="#bbdefb" strokeWidth="2" />
      </g>
    </>
  );
}

function renderCharacterSvg(id) {
  switch (id) {
    case "batman":
      return <BatmanSvg />;
    case "sarpe":
      return <SnakeSvg />;
    case "liliac":
      return <BatCuteSvg />;
    case "ponei":
      return <PonySvg />;
    case "spongebob":
      return <SpongeBobSvg />;
    case "pikachu":
      return <PikachuSvg />;
    case "minion":
      return <MinionSvg />;
    case "dory":
      return <DorySvg />;
    default:
      return <PikachuSvg />;
  }
}

export function CharacterArt({ personaj, stare = "idle", size = 140, className = "", streak = 0 }) {
  const resolved = getPersonajById(personaj?.id) || PERSONAJE[0];

  return (
    <div
      className={`char-art ${resolved.id} state-${stare} ${streak >= 3 ? "is-streak" : ""} ${className}`.trim()}
      style={{ width: size, height: size, "--char-color": resolved.culoare }}
    >
      <svg viewBox="0 0 160 160" className="char-svg" role="img" aria-label={resolved.nume}>
        {renderCharacterSvg(resolved.id)}
      </svg>
    </div>
  );
}
