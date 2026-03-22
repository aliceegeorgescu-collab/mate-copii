import { useCallback, useEffect, useMemo, useState } from "react";

export const GAME_SPEED_OPTIONS = [
  { id: "incet", label: "Incet" },
  { id: "normal", label: "Normal" },
  { id: "rapid", label: "Rapid" },
];

const SPEED_CONFIG = {
  incet: {
    label: "Incet",
    motionSeconds: 18,
    routeSeconds: 4.8,
    rivalTickMs: 1600,
    rivalStepFactor: 0.7,
  },
  normal: {
    label: "Normal",
    motionSeconds: 12,
    routeSeconds: 4.2,
    rivalTickMs: 1200,
    rivalStepFactor: 1,
  },
  rapid: {
    label: "Rapid",
    motionSeconds: 8,
    routeSeconds: 4,
    rivalTickMs: 900,
    rivalStepFactor: 1.25,
  },
};

export default function useGameMotionSettings({ gameId, gamePreferences, onSetGameSpeed, onMarkGameHintSeen }) {
  const hintSeen = Boolean(gamePreferences?.hintSeenByGame?.[gameId]);
  const [hintDismissed, setHintDismissed] = useState(hintSeen);

  useEffect(() => {
    setHintDismissed(hintSeen);
  }, [gameId, hintSeen]);

  const speedId = gamePreferences?.speedByGame?.[gameId] ?? "incet";
  const speed = useMemo(() => SPEED_CONFIG[speedId] ?? SPEED_CONFIG.incet, [speedId]);

  const setSpeed = useCallback((nextSpeedId) => {
    if (!SPEED_CONFIG[nextSpeedId]) return;
    onSetGameSpeed?.(gameId, nextSpeedId);
  }, [gameId, onSetGameSpeed]);

  const dismissHint = useCallback(() => {
    if (hintDismissed) return;
    setHintDismissed(true);
    onMarkGameHintSeen?.(gameId);
  }, [gameId, hintDismissed, onMarkGameHintSeen]);

  return {
    speedId,
    speed,
    speedOptions: GAME_SPEED_OPTIONS,
    showHint: !hintDismissed,
    setSpeed,
    dismissHint,
  };
}