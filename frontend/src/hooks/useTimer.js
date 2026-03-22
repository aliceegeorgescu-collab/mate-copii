import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer({ initialTime, active, onExpire, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const expireRef = useRef(onExpire);

  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, resetKey]);

  useEffect(() => {
    if (!active) return undefined;

    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          expireRef.current?.();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [active, resetKey]);

  const reset = useCallback((nextTime = initialTime) => {
    setTimeLeft(nextTime);
  }, [initialTime]);

  return { timeLeft, setTimeLeft, reset };
}