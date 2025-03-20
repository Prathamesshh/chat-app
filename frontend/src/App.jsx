import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const theme =useThemeStore();
  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <h1 style={{ color: "white" }}>Checking Authentication...</h1>;
  }

  return (
    <>
      {authUser && <Navbar />} {/* ✅ Render Navbar if user is authenticated */}

      <div data-theme={theme} className={authUser ? "pt-16" : ""}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
          
            
        </Routes>
      </div>

      <Toaster />
    </>
  );
};

export default App;
