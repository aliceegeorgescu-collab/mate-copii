export default function DoryCharacter() {
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