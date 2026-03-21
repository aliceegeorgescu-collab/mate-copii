import { useEffect, useState } from "react";
import "./App.css";
import { apiRequest } from "./api";
import LegacyGameApp from "./LegacyGameApp";

function AuthScreen({ mode, onModeChange, onLogin, onRegister, loading, error }) {
  const [loginForm, setLoginForm] = useState({ username: "", parola: "" });
  const [registerForm, setRegisterForm] = useState({
    numeComplet: "",
    username: "",
    parola: "",
    confirmaParola: "",
  });

  return (
    <div className="app-shell">
      <div className="app-frame auth-layout">
        <section className="hero-panel">
          <div>
            <p className="muted">Aplicatie web pentru acasa si scoala</p>
            <h1 className="hero-title">Matematica magica online</h1>
            <p className="hero-subtitle">
              Versiunea completa pastreaza jocul animat original, dar adauga cont, login sigur si salvare in PostgreSQL.
            </p>
          </div>

          <div className="helper-list">
            <div className="helper-item">Jocurile animate vechi raman aplicatia principala.</div>
            <div className="helper-item">Login sigur cu JWT si parole criptate cu bcrypt.</div>
            <div className="helper-item">Profilurile si rezultatele sunt salvate doar in baza de date.</div>
          </div>
        </section>

        <section className="auth-panel">
          <p className="muted">Bine ai venit</p>
          <h2 className="brand-title">Intra in aventura numerelor</h2>
          <p className="auth-copy">
            Creeaza un cont nou sau autentifica-te pentru a continua direct in jocul animat.
          </p>

          <div className="auth-tabs">
            <button className={`tab-button ${mode === "login" ? "active" : ""}`} onClick={() => onModeChange("login")}>
              Login
            </button>
            <button className={`tab-button ${mode === "register" ? "active" : ""}`} onClick={() => onModeChange("register")}>
              Register
            </button>
          </div>

          {mode === "login" ? (
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                onLogin(loginForm);
              }}
            >
              <label className="form-label">
                Username
                <input
                  className="form-input"
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                  placeholder="username"
                />
              </label>

              <label className="form-label">
                Parola
                <input
                  className="form-input"
                  type="password"
                  value={loginForm.parola}
                  onChange={(event) => setLoginForm((current) => ({ ...current, parola: event.target.value }))}
                  placeholder="******"
                />
              </label>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Se verifica..." : "Login"}
              </button>
            </form>
          ) : (
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                onRegister(registerForm);
              }}
            >
              <label className="form-label">
                Nume complet
                <input
                  className="form-input"
                  value={registerForm.numeComplet}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, numeComplet: event.target.value }))}
                  placeholder="Nume copil"
                />
              </label>

              <label className="form-label">
                Username
                <input
                  className="form-input"
                  value={registerForm.username}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, username: event.target.value }))}
                  placeholder="username"
                />
              </label>

              <label className="form-label">
                Parola
                <input
                  className="form-input"
                  type="password"
                  value={registerForm.parola}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, parola: event.target.value }))}
                  placeholder="******"
                />
              </label>

              <label className="form-label">
                Confirma parola
                <input
                  className="form-input"
                  type="password"
                  value={registerForm.confirmaParola}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, confirmaParola: event.target.value }))}
                  placeholder="******"
                />
              </label>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Se creeaza contul..." : "Register"}
              </button>
            </form>
          )}

          {error ? <div className="error-banner">{error}</div> : null}
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
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
    })();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleLogin(form) {
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
  }

  async function handleRegister(form) {
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
  }

  async function handleLogout() {
    try {
      await apiRequest("/api/logout", { method: "POST" });
    } catch {
      // Ignoram erorile de retea si resetam sesiunea locala.
    }

    setUser(null);
    setAuthError("");
    setAuthMode("login");
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-card">
          <h1 className="brand-title">Matematica magica online</h1>
          <p className="muted">Se pregateste sesiunea...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        mode={authMode}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={submitting}
        error={authError}
      />
    );
  }

  return <LegacyGameApp user={user} onLogout={handleLogout} />;
}
