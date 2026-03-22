import { memo, useCallback, useState } from "react";

function AuthScreenComponent({ mode, onModeChange, onLogin, onRegister, loading, error }) {
  const [loginForm, setLoginForm] = useState({ username: "", parola: "" });
  const [registerForm, setRegisterForm] = useState({
    numeComplet: "",
    username: "",
    parola: "",
    confirmaParola: "",
  });

  const handleLoginSubmit = useCallback((event) => {
    event.preventDefault();
    onLogin(loginForm);
  }, [loginForm, onLogin]);

  const handleRegisterSubmit = useCallback((event) => {
    event.preventDefault();
    onRegister(registerForm);
  }, [onRegister, registerForm]);

  const handleLoginChange = useCallback((field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }, []);

  const handleRegisterChange = useCallback((field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }, []);

  return (
    <div className="app-shell fade-slide-in">
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

          <div className="auth-tabs" role="tablist" aria-label="Autentificare">
            <button
              className={`tab-button ${mode === "login" ? "active" : ""}`}
              onClick={() => onModeChange("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`tab-button ${mode === "register" ? "active" : ""}`}
              onClick={() => onModeChange("register")}
              type="button"
            >
              Register
            </button>
          </div>

          {mode === "login" ? (
            <form className="form-grid" onSubmit={handleLoginSubmit}>
              <label className="form-label">
                Username
                <input
                  className="form-input"
                  value={loginForm.username}
                  onChange={(event) => handleLoginChange("username", event.target.value)}
                  placeholder="username"
                />
              </label>

              <label className="form-label">
                Parola
                <input
                  className="form-input"
                  type="password"
                  value={loginForm.parola}
                  onChange={(event) => handleLoginChange("parola", event.target.value)}
                  placeholder="******"
                />
              </label>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Se verifica..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="form-grid" onSubmit={handleRegisterSubmit}>
              <label className="form-label">
                Nume complet
                <input
                  className="form-input"
                  value={registerForm.numeComplet}
                  onChange={(event) => handleRegisterChange("numeComplet", event.target.value)}
                  placeholder="Nume copil"
                />
              </label>

              <label className="form-label">
                Username
                <input
                  className="form-input"
                  value={registerForm.username}
                  onChange={(event) => handleRegisterChange("username", event.target.value)}
                  placeholder="username"
                />
              </label>

              <label className="form-label">
                Parola
                <input
                  className="form-input"
                  type="password"
                  value={registerForm.parola}
                  onChange={(event) => handleRegisterChange("parola", event.target.value)}
                  placeholder="******"
                />
              </label>

              <label className="form-label">
                Confirma parola
                <input
                  className="form-input"
                  type="password"
                  value={registerForm.confirmaParola}
                  onChange={(event) => handleRegisterChange("confirmaParola", event.target.value)}
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

const AuthScreen = memo(AuthScreenComponent);

export default AuthScreen;
