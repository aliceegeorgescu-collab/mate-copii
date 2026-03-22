import { Suspense, lazy } from "react";
import "./App.css";
import AuthScreen from "./components/ui/AuthScreen";
import LoadingScreen from "./components/ui/LoadingScreen";
import { useAuthSession } from "./hooks/useAuthSession";

const LegacyGameApp = lazy(() => import("./LegacyGameApp"));

export default function App() {
  const {
    loading,
    authMode,
    submitting,
    authError,
    user,
    setAuthMode,
    handleLogin,
    handleRegister,
    handleLogout,
  } = useAuthSession();

  if (loading) {
    return <LoadingScreen message="Se pregateste sesiunea..." />;
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

  return (
    <Suspense fallback={<LoadingScreen message="Se incarca aventura..." />}>
      <LegacyGameApp user={user} onLogout={handleLogout} />
    </Suspense>
  );
}
