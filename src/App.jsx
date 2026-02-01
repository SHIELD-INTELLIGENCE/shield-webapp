import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
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
  const navigate = useNavigate();

  // Hash scrolling (with retries, MutationObserver fallback, and waiting for animations to finish)
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    let attempts = 0;
    let observer = null;
    let observerTimeout = null;

    const waitForAnimationsToFinish = () => {
      return new Promise((resolve) => {
        const container =
          document.querySelector(".animated-route") || document.body;
        let resolved = false;
        const onEnd = () => {
          if (resolved) return;
          resolved = true;
          cleanup();
          resolve();
        };
        const cleanup = () => {
          container.removeEventListener("transitionend", onEnd);
          container.removeEventListener("animationend", onEnd);
          clearTimeout(timer);
        };
        // If there are no obvious animations/transitions, resolve quickly after a short delay
        const timer = setTimeout(onEnd, 800);
        container.addEventListener("transitionend", onEnd, { once: true });
        container.addEventListener("animationend", onEnd, { once: true });
      });
    };

    const tryScroll = async () => {
      const el = document.getElementById(id);
      if (el) {
        // Wait for route animations to finish before scrolling
        await waitForAnimationsToFinish();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    function scheduleRetry() {
      // Try to scroll immediately (covers preloaded site)
      tryScroll().then((found) => {
        if (found) return;
        if (attempts < 50) {
          // retry for ~5s
          attempts++;
          setTimeout(scheduleRetry, 100);
          return;
        }
        // If still not found, observe DOM changes and scroll when element shows up
        observer = new MutationObserver(async () => {
          if (await tryScroll()) {
            if (observer) observer.disconnect();
            if (observerTimeout) clearTimeout(observerTimeout);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // Stop observing after 10s
        observerTimeout = setTimeout(() => {
          if (observer) observer.disconnect();
        }, 10000);
      });
    }

    scheduleRetry();

    // Also listen for explicit embedded content load events so we can try immediately
    const onEmbeddedLoaded = () => {
      tryScroll();
    };
    window.addEventListener("embeddedContentLoaded", onEmbeddedLoaded);

    return () => {
      if (observer) observer.disconnect();
      if (observerTimeout) clearTimeout(observerTimeout);
      window.removeEventListener("embeddedContentLoaded", onEmbeddedLoaded);
    };
  }, [location.hash, location.pathname, authLoading]);

  // Redirect any non-home path that has #contact-section to the home path (preserve hash)
  useEffect(() => {
    if (location.hash === "#contact-section" && location.pathname !== "/") {
      navigate({ pathname: "/", hash: location.hash }, { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
                  <AnimatedRoute variant="fade">
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
                  <AnimatedRoute variant="fade">
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
    <div role="dialog" aria-modal="true" className="logout-confirm-overlay">
      <div className="logout-confirm-box">
        <h3 className="logout-confirm-title">Confirm Logout</h3>
        <p className="logout-confirm-text">Are you sure you want to log out?</p>

        <div className="logout-confirm-actions">
          <button className="bw-btn logout-cancel-btn" onClick={onCancel}>
            Cancel
          </button>

          <button className="bw-btn logout-confirm-btn" onClick={onConfirm}>
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
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
