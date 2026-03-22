export default function PikachuCharacter() {
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