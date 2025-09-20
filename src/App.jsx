// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

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

  return (
    <nav className="navbar">
      <div className="logo">SHIELD</div>

      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        ☰
      </button>

      {/* Nav links */}
      <div className={`nav-links ${showMenu ? "show" : ""}`}>
        <Link to="/" className="nav-btn" onClick={() => setShowMenu(false)}>
          Home
        </Link>
        <Link
          to="/about"
          className="nav-btn"
          onClick={() => setShowMenu(false)}
        >
          About
        </Link>
        <Link
          to="/join-us"
          className="nav-btn"
          onClick={() => setShowMenu(false)}
        >
          Join Us
        </Link>
        <Link
          to="/hire-agent"
          className="nav-btn"
          onClick={() => setShowMenu(false)}
        >
          Hire an Agent
        </Link>

        {user && (
          <Link
            to="/feeds"
            className="nav-btn"
            onClick={() => setShowMenu(false)}
          >
            My Feeds
          </Link>
        )}

        {user ? (
          <button className="nav-btn" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="nav-btn"
            onClick={() => setShowMenu(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u); // track auth status
      setAuthLoading(false); // auth check complete
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // go home after logout
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="shield-loading-screen">
        <div className="shield-loading-title">
          <span className="desktop-text">Loading</span>
          <span className="mobile-text">Loading</span>
        </div>
        <div className="shield-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/hire-agent" element={<HireAgent />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/join-us-terms" element={<JoinUsTerms />} />
          <Route path="/feeds" element={user ? <Feeds /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
