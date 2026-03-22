import { memo, useMemo } from "react";
import { rand } from "../../utils/random";

const KIND_PIECES = ["\u2B50", "\u2764\uFE0F", "\u2600\uFE0F", "\uD83C\uDF1F"];

function CelebrationBurstComponent({ variant }) {
  const pieces = useMemo(
    () => Array.from({ length: 18 }).map((_, index) => ({
      id: index,
      left: `${rand(10, 90)}%`,
      top: `${rand(10, 85)}%`,
      delay: `${index * 0.04}s`,
      symbol: variant === "kind" ? KIND_PIECES[index % KIND_PIECES.length] : "\u2728",
    })),
    [variant]
  );

  return (
    <div className={`celebration-burst ${variant}`}>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="burst-piece"
          style={{ left: piece.left, top: piece.top, animationDelay: piece.delay }}
        >
          {piece.symbol}
        </span>
      ))}
    </div>
  );
}

const CelebrationBurst = memo(CelebrationBurstComponent);

export default CelebrationBurst;