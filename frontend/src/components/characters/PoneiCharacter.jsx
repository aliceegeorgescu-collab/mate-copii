export default function PoneiCharacter() {
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