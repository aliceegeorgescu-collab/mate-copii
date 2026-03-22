import { memo, useMemo } from "react";

function CameraTrofeeComponent({ stele }) {
  const trofeu = useMemo(() => {
    if (stele >= 150) {
      return { icon: "\uD83C\uDFC6", label: "Cupa de Aur", tone: "gold" };
    }

    if (stele >= 50) {
      return { icon: "\uD83E\uDD48", label: "Cupa de Argint", tone: "silver" };
    }

    if (stele >= 20) {
      return { icon: "\uD83E\uDD49", label: "Cupa de Bronz", tone: "bronze" };
    }

    return { icon: "\u2B50", label: "Primul trofeu te asteapta", tone: "starter" };
  }, [stele]);

  return (
    <div className={`trofee-box is-${trofeu.tone}`.trim()} aria-live="polite">
      <div className="trofee-count">
        <span className="trofee-count-icon" aria-hidden="true">{"\u2B50"}</span>
        <strong>{stele} stele</strong>
      </div>
      <div className="trofee-label">
        <span className="trofee-label-icon" aria-hidden="true">{trofeu.icon}</span>
        <span>{trofeu.label}</span>
      </div>
    </div>
  );
}

const CameraTrofee = memo(CameraTrofeeComponent);

export default CameraTrofee;