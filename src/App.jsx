import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Loading from "./components/Loading";
import AnimatedRoute from "./components/AnimatedRoute";
import PageLoadingSpinner from "./components/PageLoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatus from "./components/NetworkStatus";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./assets/errorStyles.css";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const JoinUs = React.lazy(() => import("./pages/JoinUs"));
const RequestService = React.lazy(() => import("./pages/RequestService"));
const Terms = React.lazy(() => import("./pages/Terms"));
const JoinUsTerms = React.lazy(() => import("./pages/JoinUsTerms"));
const Feeds = React.lazy(() => import("./pages/Feeds"));
const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function AppContent() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u); // track auth status
      setAuthLoading(false); // auth check complete
      // Reset logging out state when auth state changes
      if (!u && isLoggingOut) {
        setTimeout(() => {
          setIsLoggingOut(false);
        }, 2000);
      }
    });
    return () => unsub();
  }, [isLoggingOut]);

  // Prevent scrolling during logout
  useEffect(() => {
    if (isLoggingOut) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoggingOut]);

  const handleLogout = async () => {
    try {
      setShowLogoutConfirm(false);
      setIsLoggingOut(true);
      await signOut(auth);
      // Don't navigate immediately - let the auth state change handle it
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return <Loading />;
  }

  if (isLoggingOut) {
    return (
      <div className="shield-logout-screen">
        <div className="shield-logout-title">
          <span className="desktop-text">Logging Out</span>
          <span className="mobile-text">Logging Out</span>
        </div>
        <div className="shield-logout-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Pass a request function to open the logout confirmation modal */}
      <Header user={user} onLogout={() => setShowLogoutConfirm(true)} />
      <NetworkStatus />

      <main className="app-main" id="main-content">
        <React.Suspense fallback={<PageLoadingSpinner />}>
          <AnimatePresence mode="wait" initial={true}>
            <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedRoute variant="fade">
                  <Home />
                </AnimatedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <AnimatedRoute variant="slide">
                  <About />
                </AnimatedRoute>
              }
            />
            <Route
              path="/join-us"
              element={
                <AnimatedRoute>
                  <JoinUs />
                </AnimatedRoute>
              }
            />
            <Route
              path="/request-service"
              element={
                <AnimatedRoute>
                  <RequestService />
                </AnimatedRoute>
              }
            />
            <Route
              path="/terms"
              element={
                <AnimatedRoute variant="fade">
                  <Terms />
                </AnimatedRoute>
              }
            />
            <Route
              path="/join-us-terms"
              element={
                <AnimatedRoute variant="fade">
                  <JoinUsTerms />
                </AnimatedRoute>
              }
            />
            <Route
              path="/feeds"
              element={
                <AnimatedRoute variant="slide">
                  {user ? <Feeds /> : <Login />}
                </AnimatedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedRoute variant="slide">
                  <Login />
                </AnimatedRoute>
              }
            />
            <Route
              path="*"
              element={
                <AnimatedRoute variant="fade">
                  <NotFound />
                </AnimatedRoute>
              }
            />
            </Routes>
          </AnimatePresence>
        </React.Suspense>
      </main>

      <Footer user={user} />

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => handleLogout()}
      />
    </div>
  );
}

// Simple in-app confirmation modal rendered by AppContent via state
function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="logout-confirm-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        className="logout-confirm-box"
        style={{
          background: "rgba(42, 42, 42, 0.9)",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          maxWidth: "420px",
          width: "90%",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#caa94c" }}>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            className="bw-btn"
            onClick={onCancel}
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.6)";
              e.target.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.3)";
              e.target.style.background = "transparent";
            }}
            onFocus={(e) => e.target.blur()}
          >
            Cancel
          </button>

          <button
            className="bw-btn"
            onClick={onConfirm}
            style={{
              background: "var(--shield-accent, #ffd200)",
              color: "#000",
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <div className="shield-error-boundary-container">
          <h1>Application Error</h1>
          <p>
            We're sorry, but something went wrong. Our team has been notified.
          </p>
          <button className="bw-btn" onClick={resetErrorBoundary}>
            Refresh Application
          </button>
        </div>
      )}
      onError={(error) => {
        // Here you could send the error to your monitoring service
        console.error("App crashed with error:", error);
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}
