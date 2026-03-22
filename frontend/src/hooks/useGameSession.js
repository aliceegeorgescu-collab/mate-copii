import { useCallback, useReducer } from "react";

const initialSessionState = {
  faza: "profil",
  jocSelectat: null,
  dificultate: null,
};

function sessionReducer(state, action) {
  switch (action.type) {
    case "INCARCA_PROFIL":
      return {
        faza: action.payload,
        jocSelectat: null,
        dificultate: null,
      };
    case "SELECTEAZA_JOC":
      return {
        faza: "dificultate",
        jocSelectat: action.payload,
        dificultate: null,
      };
    case "SELECTEAZA_DIFICULTATE":
      return {
        ...state,
        faza: "joc",
        dificultate: action.payload,
      };
    case "INAPOI_PROFIL":
      return {
        faza: "profil",
        jocSelectat: null,
        dificultate: null,
      };
    case "INAPOI_PERSONAJ":
      return {
        faza: "personaj",
        jocSelectat: null,
        dificultate: null,
      };
    case "INAPOI_MENIU":
      return {
        faza: "meniu",
        jocSelectat: null,
        dificultate: null,
      };
    default:
      return state;
  }
}

export default function useGameSession() {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);

  const seteazaFazaDinProfil = useCallback((faza) => {
    dispatch({ type: "INCARCA_PROFIL", payload: faza });
  }, []);

  const onSelectJoc = useCallback((jocId) => {
    dispatch({ type: "SELECTEAZA_JOC", payload: jocId });
  }, []);

  const onSelectDificultate = useCallback((dificultate) => {
    dispatch({ type: "SELECTEAZA_DIFICULTATE", payload: dificultate });
  }, []);

  const backLaProfil = useCallback(() => {
    dispatch({ type: "INAPOI_PROFIL" });
  }, []);

  const backLaPersonaj = useCallback(() => {
    dispatch({ type: "INAPOI_PERSONAJ" });
  }, []);

  const backLaMeniu = useCallback(() => {
    dispatch({ type: "INAPOI_MENIU" });
  }, []);

  return {
    ...state,
    seteazaFazaDinProfil,
    onSelectJoc,
    onSelectDificultate,
    backLaProfil,
    backLaPersonaj,
    backLaMeniu,
  };
}