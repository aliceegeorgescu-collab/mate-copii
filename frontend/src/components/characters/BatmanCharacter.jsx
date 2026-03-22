export default function BatmanCharacter() {
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