import { memo } from "react";

function ClickHintOverlayComponent({ visible, text = "Da click aici!" }) {
  if (!visible) return null;

  return (
    <div className="click-hint-overlay" aria-hidden="true">
      <div className="click-hint-bubble">{text}</div>
      <div className="click-hint-hand">{"\uD83D\uDC46"}</div>
    </div>
  );
}

const ClickHintOverlay = memo(ClickHintOverlayComponent);

export default ClickHintOverlay;