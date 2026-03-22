export default function SarpeCharacter() {
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