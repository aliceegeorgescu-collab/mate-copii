import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPersonajById } from "../components/characters/characterRegistry";
import {
  createId,
  createRemoteProfile,
  getPlayerId,
  loadRemoteAccount,
  saveRemoteGameResult,
  saveRemoteProfileState,
} from "../persistence";

const DEFAULT_GAME_PREFERENCES = {
  speedByGame: {},
  hintSeenByGame: {},
};

function normalizeGamePreferences(value) {
  const source = value && typeof value === "object" ? value : {};
  const speedByGame = source.speedByGame && typeof source.speedByGame === "object" ? source.speedByGame : {};
  const hintSeenByGame = source.hintSeenByGame && typeof source.hintSeenByGame === "object" ? source.hintSeenByGame : {};

  return {
    speedByGame: { ...speedByGame },
    hintSeenByGame: { ...hintSeenByGame },
  };
}

export default function useProfileSync({ jocSelectat, dificultate, seteazaFazaDinProfil }) {
  const [playerId] = useState(() => getPlayerId());
  const [syncReady, setSyncReady] = useState(false);
  const remoteSaveTimeoutRef = useRef(null);
  const selectedProfileIdRef = useRef(null);

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [steleGlobale, setSteleGlobale] = useState(0);
  const [sunetActivat, setSunetActivat] = useState(true);
  const [personaj, setPersonaj] = useState(null);
  const [gamePreferences, setGamePreferences] = useState(DEFAULT_GAME_PREFERENCES);

  const profilActiv = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId]
  );

  const serializedPreferences = useMemo(() => JSON.stringify(gamePreferences), [gamePreferences]);

  const incarcaProfil = useCallback((profile) => {
    const chosenPersonaj = getPersonajById(profile?.personaj?.id) ?? null;
    const nextPreferences = normalizeGamePreferences(profile?.gamePreferences);

    setSelectedProfileId(profile?.id ?? null);
    setPersonaj(chosenPersonaj);
    setSteleGlobale(profile?.steleGlobale ?? 0);
    setSunetActivat(profile?.sunetActivat ?? true);
    setGamePreferences(nextPreferences);
    seteazaFazaDinProfil(profile ? (chosenPersonaj ? "meniu" : "personaj") : "profil");
  }, [seteazaFazaDinProfil]);

  const onAdaugaStele = useCallback((valoare) => {
    if (!valoare) return;

    setSteleGlobale((current) => current + valoare);
  }, []);

  const onToggleSunet = useCallback(() => {
    setSunetActivat((current) => !current);
  }, []);

  const onSetGameSpeed = useCallback((gameId, speedId) => {
    if (!gameId || !speedId) return;

    setGamePreferences((current) => normalizeGamePreferences({
      ...current,
      speedByGame: {
        ...current.speedByGame,
        [gameId]: speedId,
      },
    }));
  }, []);

  const onMarkGameHintSeen = useCallback((gameId) => {
    if (!gameId) return;

    setGamePreferences((current) => {
      if (current.hintSeenByGame?.[gameId]) {
        return current;
      }

      return normalizeGamePreferences({
        ...current,
        hintSeenByGame: {
          ...current.hintSeenByGame,
          [gameId]: true,
        },
      });
    });
  }, []);

  const onSelectProfil = useCallback((profileId) => {
    const nextProfile = profiles.find((profile) => profile.id === profileId) ?? null;
    incarcaProfil(nextProfile);
  }, [incarcaProfil, profiles]);

  const onCreateProfil = useCallback((name) => {
    const profile = {
      id: createId("child"),
      name,
      personaj: null,
      steleGlobale: 0,
      sunetActivat: true,
      gamePreferences: normalizeGamePreferences(DEFAULT_GAME_PREFERENCES),
      lastSessionAt: null,
      history: [],
    };

    setProfiles((current) => [...current, profile]);
    incarcaProfil(profile);

    createRemoteProfile(playerId, profile).catch(() => {
      // Pastram datele sesiunii curente chiar daca backend-ul lipseste temporar.
    });
  }, [incarcaProfil, playerId]);

  const onSelectPersonaj = useCallback((nextPersonaj) => {
    setPersonaj(nextPersonaj);
    seteazaFazaDinProfil("meniu");
  }, [seteazaFazaDinProfil]);

  const onInregistreazaRezultat = useCallback(({ scor, max }) => {
    if (!selectedProfileId || !jocSelectat || !dificultate) return;

    const result = {
      id: createId("result"),
      jocId: jocSelectat,
      dificultate,
      scor,
      maxExercitii: max,
      playedAt: new Date().toISOString(),
    };

    setProfiles((current) => current.map((profile) => {
      if (profile.id !== selectedProfileId) return profile;

      return {
        ...profile,
        lastSessionAt: result.playedAt,
        history: [result, ...(profile.history ?? [])].slice(0, 20),
      };
    }));

    saveRemoteGameResult(playerId, selectedProfileId, result).catch(() => {
      // Istoricul ramane vizibil in sesiunea curenta chiar daca baza raspunde greu.
    });
  }, [dificultate, jocSelectat, playerId, selectedProfileId]);

  useEffect(() => {
    selectedProfileIdRef.current = selectedProfileId;
  }, [selectedProfileId]);

  useEffect(() => {
    if (!selectedProfileId) return;

    setProfiles((current) => current.map((profile) => {
      if (profile.id !== selectedProfileId) return profile;

      const profilePreferences = normalizeGamePreferences(profile.gamePreferences);
      const hasSameState =
        (profile.personaj?.id ?? null) === (personaj?.id ?? null) &&
        profile.steleGlobale === steleGlobale &&
        profile.sunetActivat === sunetActivat &&
        JSON.stringify(profilePreferences) === serializedPreferences;

      if (hasSameState) return profile;

      return {
        ...profile,
        personaj,
        steleGlobale,
        sunetActivat,
        gamePreferences,
      };
    }));
  }, [gamePreferences, personaj, selectedProfileId, serializedPreferences, steleGlobale, sunetActivat]);

  useEffect(() => {
    let ignore = false;

    loadRemoteAccount(playerId)
      .then((remoteAccount) => {
        if (ignore) return;

        const remoteProfiles = (remoteAccount.profiles ?? []).map((profile) => ({
          ...profile,
          gamePreferences: normalizeGamePreferences(profile.gamePreferences),
        }));

        if (remoteProfiles.length > 0) {
          setProfiles(remoteProfiles);

          const nextProfile =
            remoteProfiles.find((profile) => profile.id === selectedProfileIdRef.current) ??
            remoteProfiles[0];

          incarcaProfil(nextProfile);
        }
      })
      .catch(() => {
        // Aplicatia ramane utilizabila si cand API-ul nu este disponibil.
      })
      .finally(() => {
        if (!ignore) setSyncReady(true);
      });

    return () => {
      ignore = true;
    };
  }, [incarcaProfil, playerId]);

  useEffect(() => {
    if (!syncReady || !profilActiv) return undefined;

    clearTimeout(remoteSaveTimeoutRef.current);
    remoteSaveTimeoutRef.current = setTimeout(() => {
      saveRemoteProfileState(playerId, profilActiv).catch(async (error) => {
        if (String(error.message).includes("404")) {
          try {
            await createRemoteProfile(playerId, profilActiv);
          } catch {
            // Daca nu reusim nici crearea profilului, pastram starea doar in memorie.
          }
        }
      });
    }, 300);

    return () => {
      clearTimeout(remoteSaveTimeoutRef.current);
    };
  }, [playerId, profilActiv, syncReady]);

  return {
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
  };
}