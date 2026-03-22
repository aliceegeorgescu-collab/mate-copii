export default function LiliacCharacter() {
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