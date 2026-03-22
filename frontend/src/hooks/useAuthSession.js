import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api";

export function useAuthSession() {
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        const profileData = await apiRequest("/api/profil");
        if (!ignore) {
          setUser(profileData.user);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogin = useCallback(async (form) => {
    setSubmitting(true);
    setAuthError("");

    try {
      const response = await apiRequest("/api/login", {
        method: "POST",
        body: form,
      });
      setUser(response.user);
    } catch (error) {
      setAuthError(error.message || "Login esuat.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (form) => {
    setSubmitting(true);
    setAuthError("");

    try {
      const response = await apiRequest("/api/register", {
        method: "POST",
        body: form,
      });
      setUser(response.user);
    } catch (error) {
      setAuthError(error.message || "Inregistrarea a esuat.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiRequest("/api/logout", { method: "POST" });
    } catch {
      // Ignoram erorile de retea si resetam sesiunea locala.
    }

    setUser(null);
    setAuthError("");
    setAuthMode("login");
  }, []);

  return {
    loading,
    authMode,
    submitting,
    authError,
    user,
    setAuthMode,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
