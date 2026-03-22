import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import useGameSession from "./hooks/useGameSession";
import useProfileSync from "./hooks/useProfileSync";
import "./styles/legacy-game.css";
import "./extraGames.css";
import BackgroundEnvironment from "./components/ui/BackgroundEnvironment";
import SelectDificultate from "./components/ui/SelectDificultate";
import SelectJoc from "./components/ui/SelectJoc";
import SelectPersonaj from "./components/ui/SelectPersonaj";
import SelectProfil from "./components/ui/SelectProfil";
import LoadingScreen from "./components/ui/LoadingScreen";

const JocBaloane = lazy(() => import("./components/games/JocBaloane"));
const JocPescuit = lazy(() => import("./components/games/JocPescuit"));
const JocTrenulet = lazy(() => import("./components/games/JocTrenulet"));
const JocRacheta = lazy(() => import("./components/games/JocRacheta"));
const JocCursa = lazy(() => import("./components/games/JocCursa"));
const JocLabirintBatman = lazy(() => import("./components/games/JocLabirintBatman"));
const JocGradinitaVesela = lazy(() => import("./components/games/JocGradinitaVesela"));

const GAME_COMPONENTS = {
  baloane: { Component: JocBaloane, usesPersonaj: true },
  trenulet: { Component: JocTrenulet, usesPersonaj: true },
  pescuit: { Component: JocPescuit, usesPersonaj: true },
  racheta: { Component: JocRacheta, usesPersonaj: true },
  cursa: { Component: JocCursa, usesPersonaj: true },
  labirint_batman: { Component: JocLabirintBatman, usesPersonaj: false },
  gradinita_vesela: { Component: JocGradinitaVesela, usesPersonaj: false },
};

export default function LegacyGameApp({ user, onLogout }) {
  const [welcomeSeenByProfile, setWelcomeSeenByProfile] = useState({});

  const {
    faza,
    jocSelectat,
    dificultate,
    seteazaFazaDinProfil,
    onSelectJoc,
    onSelectDificultate,
    backLaProfil,
    backLaPersonaj,
    backLaMeniu,
  } = useGameSession();

  const {
    profiles,
    profilActiv,
    personaj,
    steleGlobale,
    sunetActivat,
    gamePreferences,
    onSelectProfil,
    onCreateProfil,
    onSelectPersonaj,
    onToggleSunet,
    onAdaugaStele,
    onInregistreazaRezultat,
    onSetGameSpeed,
    onMarkGameHintSeen,
  } = useProfileSync({
    jocSelectat,
    dificultate,
    seteazaFazaDinProfil,
  });

  useEffect(() => {
    if (faza !== "meniu" || !profilActiv?.id) return;

    setWelcomeSeenByProfile((current) => {
      if (current[profilActiv.id]) return current;
      return { ...current, [profilActiv.id]: true };
    });
  }, [faza, profilActiv?.id]);

  const accountName = useMemo(
    () => user?.numeComplet || user?.username || "Utilizator",
    [user?.numeComplet, user?.username]
  );

  const shouldShowBackground = !jocSelectat;
  const showWelcome = faza === "meniu" && Boolean(profilActiv?.id) && !welcomeSeenByProfile[profilActiv.id];

  const jocActiv = useMemo(() => {
    if (faza !== "joc" || !jocSelectat) return null;

    const config = GAME_COMPONENTS[jocSelectat];
    if (!config) return null;

    const { Component, usesPersonaj } = config;
    const commonProps = {
      dificultate,
      onBack: backLaMeniu,
      peGata: backLaMeniu,
      sunetActivat,
      gamePreferences,
      onSetGameSpeed,
      onMarkGameHintSeen,
      onAwardStars: onAdaugaStele,
      onRecordResult: onInregistreazaRezultat,
    };

    const gameElement = usesPersonaj
      ? <Component {...commonProps} personaj={personaj} />
      : <Component {...commonProps} />;

    return (
      <Suspense fallback={<LoadingScreen message="Se incarca jocul..." />}>
        {gameElement}
      </Suspense>
    );
  }, [backLaMeniu, dificultate, faza, gamePreferences, jocSelectat, onAdaugaStele, onInregistreazaRezultat, onMarkGameHintSeen, onSetGameSpeed, personaj, sunetActivat]);

  return (
    <>
      {faza !== "joc" ? (
        <div className="account-floating">
          <span className="account-name">Cont: {accountName}</span>
          {onLogout ? <button className="btn-logout" onClick={onLogout}>Logout</button> : null}
        </div>
      ) : null}

      {shouldShowBackground ? <BackgroundEnvironment /> : null}

      {faza === "profil" ? (
        <SelectProfil profiles={profiles} onSelect={onSelectProfil} onCreate={onCreateProfil} />
      ) : null}

      {faza === "personaj" ? <SelectPersonaj onSelect={onSelectPersonaj} /> : null}

      {faza === "meniu" ? (
        <SelectJoc
          personaj={personaj}
          profil={profilActiv}
          onSelect={onSelectJoc}
          onBack={backLaProfil}
          onChangeCharacter={backLaPersonaj}
          stele={steleGlobale}
          sunetActivat={sunetActivat}
          onToggleSunet={onToggleSunet}
          showWelcome={showWelcome}
        />
      ) : null}

      {faza === "dificultate" ? (
        <SelectDificultate jocId={jocSelectat} onSelect={onSelectDificultate} onBack={backLaMeniu} />
      ) : null}

      {jocActiv}
    </>
  );
}