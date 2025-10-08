import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import LoggingOut from "./components/LoggingOut";
import Loading from "./components/Loading";
import AnimatedRoute from "./components/AnimatedRoute";
import PageLoadingSpinner from "./components/PageLoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatus from "./components/NetworkStatus";
import "./assets/errorStyles.css";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const JoinUs = React.lazy(() => import("./pages/JoinUs"));
const HireAgent = React.lazy(() => import("./pages/HireAgent"));
const Terms = React.lazy(() => import("./pages/Terms"));
const JoinUsTerms = React.lazy(() => import("./pages/JoinUsTerms"));
const Feeds = React.lazy(() => import("./pages/Feeds"));
const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function Navbar({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Check if mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation button animation variants
  const navButtonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "var(--shield-accent)",
      color: "var(--shield-black)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Menu animation variants (only for mobile)
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SHIELD
        </motion.div>
      </Link>

      {/* Hamburger Button */}
      <motion.button
        className="hamburger"
        onClick={() => setShowMenu((prev) => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        ☰
      </motion.button>

      {/* Nav links - conditional motion for mobile only */}
      {isMobile ? (
        <motion.div 
          className={`nav-links ${showMenu ? "show" : ""}`}
          variants={menuVariants}
          initial="closed"
          animate={showMenu ? "open" : "closed"}
        >
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link to="/" className="nav-btn" onClick={() => setShowMenu(false)}>
              Home
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/about"
              className="nav-btn"
              onClick={() => setShowMenu(false)}
            >
              About
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/join-us"
              className="nav-btn"
              onClick={() => setShowMenu(false)}
            >
              Join Us
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/hire-agent"
              className="nav-btn"
              onClick={() => setShowMenu(false)}
            >
              Hire an Agent
            </Link>
          </motion.div>

          {user && (
            <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
              <Link
                to="/feeds"
                className="nav-btn"
                onClick={() => setShowMenu(false)}
              >
                My Feeds
              </Link>
            </motion.div>
          )}

          {user ? (
            <motion.button 
              className="nav-btn" 
              onClick={onLogout}
              variants={navButtonVariants} 
              whileHover="hover" 
              whileTap="tap"
            >
              Logout
            </motion.button>
          ) : (
            <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
              <Link
                to="/login"
                className="nav-btn"
                onClick={() => setShowMenu(false)}
              >
                Login
              </Link>
            </motion.div>
          )}
        </motion.div>
      ) : (
        // Desktop version without motion variants that interfere
        <div className="nav-links">
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link to="/" className="nav-btn">
              Home
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link to="/about" className="nav-btn">
              About
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link to="/join-us" className="nav-btn">
              Join Us
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
            <Link to="/hire-agent" className="nav-btn">
              Hire an Agent
            </Link>
          </motion.div>

          {user && (
            <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
              <Link to="/feeds" className="nav-btn">
                My Feeds
              </Link>
            </motion.div>
          )}

          {user ? (
            <motion.button 
              className="nav-btn" 
              onClick={onLogout}
              variants={navButtonVariants} 
              whileHover="hover" 
              whileTap="tap"
            >
              Logout
            </motion.button>
          ) : (
            <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
              <Link to="/login" className="nav-btn">
                Login
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
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
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <NetworkStatus />
      
      <React.Suspense fallback={<PageLoadingSpinner />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <AnimatedRoute variant="fade">
                <Home />
              </AnimatedRoute>
            } />
            <Route path="/about" element={
              <AnimatedRoute variant="slide">
                <About />
              </AnimatedRoute>
            } />
            <Route path="/join-us" element={
              <AnimatedRoute>
                <JoinUs />
              </AnimatedRoute>
            } />
            <Route path="/hire-agent" element={
              <AnimatedRoute>
                <HireAgent />
              </AnimatedRoute>
            } />
            <Route path="/terms" element={
              <AnimatedRoute variant="fade">
                <Terms />
              </AnimatedRoute>
            } />
            <Route path="/join-us-terms" element={
              <AnimatedRoute variant="fade">
                <JoinUsTerms />
              </AnimatedRoute>
            } />
            <Route path="/feeds" element={
              <AnimatedRoute variant="slide">
                {user ? <Feeds /> : <Login />}
              </AnimatedRoute>
            } />
            <Route path="/login" element={
              <AnimatedRoute variant="slide">
                <Login />
              </AnimatedRoute>
            } />
            <Route path="*" element={
              <AnimatedRoute variant="fade">
                <NotFound />
              </AnimatedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </React.Suspense>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <div className="shield-error-boundary-container">
          <h1>Application Error</h1>
          <p>We're sorry, but something went wrong. Our team has been notified.</p>
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
