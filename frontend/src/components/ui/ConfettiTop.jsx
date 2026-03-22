import { memo, useMemo } from "react";
import { rand } from "../../utils/random";

const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6bff", "#ff9f43"];

function ConfettiTopComponent() {
  const pieces = useMemo(
    () => Array.from({ length: 42 }).map((_, index) => ({
      id: index,
      left: rand(0, 100),
      background: colors[index % colors.length],
      delay: `${rand(0, 6) * 0.08}s`,
      duration: `${0.95 + Math.random() * 0.9}s`,
      width: `${8 + rand(0, 10)}px`,
      height: `${8 + rand(0, 12)}px`,
      rotate: `${rand(-35, 35)}deg`,
      radius: `${rand(2, 12)}px`,
    })),
    []
  );

  return (
    <div className="confetti-wrap">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            background: piece.background,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            width: piece.width,
            height: piece.height,
            transform: `rotate(${piece.rotate})`,
            borderRadius: piece.radius,
          }}
        />
      ))}
    </div>
  );
}

const ConfettiTop = memo(ConfettiTopComponent);

export default ConfettiTop;