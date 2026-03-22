import { memo } from "react";

function LoadingScreenComponent({ message = "Se pregateste sesiunea..." }) {
  return (
    <div className="loading-state fade-slide-in">
      <div className="loading-card pulse-soft">
        <h1 className="brand-title">Matematica magica online</h1>
        <p className="muted">{message}</p>
      </div>
    </div>
  );
}

const LoadingScreen = memo(LoadingScreenComponent);

export default LoadingScreen;
