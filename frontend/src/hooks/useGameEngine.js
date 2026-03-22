import { useCallback, useEffect, useRef, useState } from "react";
import { DIFICULTATI } from "../utils/gameConfig";
import { alegeOperator, genereazaIntrebare, genereazaOptiuni } from "../utils/mathGenerators";
import useTimer from "./useTimer";

function playDing() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch {
    // Ignoram lipsa suportului audio in browser sau in test.
  }
}

function playBoing() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch {
    // Ignoram lipsa suportului audio in browser sau in test.
  }
}

export function useGameEngine(dificultateId, options = {}) {
  const { sunetActivat = true } = options;
  const dif = DIFICULTATI[dificultateId] ?? DIFICULTATI.mediu;
  const [nr, setNr] = useState(1);
  const [scor, setScor] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ales, setAles] = useState(null);
  const [q, setQ] = useState(() => genereazaIntrebare(alegeOperator(), dificultateId));
  const [optiuni, setOptiuni] = useState(() => genereazaOptiuni(q.raspuns, 20));
  const [stare, setStare] = useState("idle");
  const timeoutRef = useRef(null);

  const nextIntrebare = useCallback(() => {
    clearTimeout(timeoutRef.current);

    if (nr >= dif.ex) {
      setStare("gata");
      return;
    }

    const urmatoareaIntrebare = genereazaIntrebare(alegeOperator(), dificultateId);
    setAles(null);
    setQ(urmatoareaIntrebare);
    setOptiuni(genereazaOptiuni(urmatoareaIntrebare.raspuns, 20));
    setStare("idle");
    setNr((current) => current + 1);
  }, [dif.ex, dificultateId, nr]);

  const handleGresit = useCallback(() => {
    if (sunetActivat) {
      playBoing();
    }

    setStare("gresit");
    setStreak(0);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextIntrebare, 2000);
  }, [nextIntrebare, sunetActivat]);

  const { timeLeft: timp } = useTimer({
    initialTime: dif.timp,
    active: stare === "idle",
    onExpire: handleGresit,
    resetKey: `${dificultateId}-${nr}`,
  });

  const raspunde = useCallback((valoare) => {
    if (stare !== "idle") {
      return;
    }

    setAles(valoare);

    if (valoare === q.raspuns) {
      if (sunetActivat) {
        playDing();
      }

      setStare("corect");
      setScor((current) => current + 1);
      setStreak((current) => current + 1);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(nextIntrebare, 2000);
      return;
    }

    handleGresit();
  }, [handleGresit, nextIntrebare, q.raspuns, stare, sunetActivat]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return { nr, scor, q, optiuni, stare, timp, dif, raspunde, streak, ales };
}