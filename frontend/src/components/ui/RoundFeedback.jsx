import { memo } from "react";

function RoundFeedbackComponent({ stare }) {
  if (stare !== "corect" && stare !== "gresit") {
    return null;
  }

  const config = stare === "corect"
    ? { className: "is-correct", text: "Bravo! Ai raspuns corect!" }
    : { className: "is-wrong", text: "Mai incearca! Urmatoarea intrebare vine imediat." };

  return <div className={`round-feedback ${config.className}`}>{config.text}</div>;
}

const RoundFeedback = memo(RoundFeedbackComponent);

export default RoundFeedback;