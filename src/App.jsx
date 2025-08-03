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

import Home from "./pages/Home";
import About from "./pages/About";
import JoinUs from "./pages/JoinUs";
import HireAgent from "./pages/HireAgent";
import Terms from "./pages/Terms";
import JoinUsTerms from "./pages/JoinUsTerms";
import Feeds from "./pages/Feeds";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

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
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u); // track auth status
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // go home after logout
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
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
