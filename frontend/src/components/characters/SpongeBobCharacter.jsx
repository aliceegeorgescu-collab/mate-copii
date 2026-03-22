export default function SpongeBobCharacter() {
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