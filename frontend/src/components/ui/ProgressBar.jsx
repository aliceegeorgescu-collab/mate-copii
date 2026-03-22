import { memo } from "react";

function ProgressBarComponent({
  value = 0,
  max = 1,
  label = "Progres",
  tone = "sun",
  className = "",
  compact = false,
  valueText,
}) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.min(Math.max(0, value), safeMax);
  const percent = Math.round((safeValue / safeMax) * 100);
  const resolvedText = valueText ?? `${safeValue}/${safeMax}`;

  if (compact) {
    return (
      <div className={`progress-card is-compact ${className}`.trim()}>
        <div
          className="progress-track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={safeValue}
        >
          <div className={`progress-fill tone-${tone}`} style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-inline-pill">{resolvedText}</span>
      </div>
    );
  }

  return (
    <div className={`progress-card ${className}`.trim()}>
      <div className="progress-meta">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{safeValue}/{safeMax}</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
      >
        <div className={`progress-fill tone-${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

const ProgressBar = memo(ProgressBarComponent);

export default ProgressBar;