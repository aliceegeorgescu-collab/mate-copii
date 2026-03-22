export default function MinionCharacter() {
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