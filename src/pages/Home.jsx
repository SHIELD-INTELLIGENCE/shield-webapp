import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

// Note: Scroll-triggered animations have been removed.

function Home() {
  const [user, setUser] = useState(null);
  const [showNameNotice, setShowNameNotice] = useState(true);
  const controls = useAnimation(); // Hero animation controller

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    controls.start("visible"); // trigger hero animation on mount
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-hero-bw">
      {/* Prominent name display for Dr. Rakshit Tandon (temporary) */}
      {showNameNotice && (
        <div
          style={{
            background: "#0f172a",
            color: "#fff",
            padding: "0.9rem 1rem",
            borderRadius: "8px",
            margin: "1rem auto",
            maxWidth: "980px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 6px 18px rgba(2,6,23,0.35)",
          }}
          role="status"
          aria-live="polite"
        >
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>To be approved by Dr. Rakshit Tandon only.</div>
            <div style={{ fontSize: "0.95rem", color: "#cbd5e1", marginTop: "0.15rem" }}>
              
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowNameNotice(false)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 700,
              }}
              aria-label="Hide name notice"
            >
              Hide
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <motion.div
        className="home-hero-content-bw"
        variants={staggerContainer}
        initial="hidden"
        animate={controls} // controlled animation
      >
        <motion.div className="logo-container" variants={scaleIn}>
          <img src={logo} alt="SHIELD Logo" className="logo" />
        </motion.div>

        <motion.h1 variants={fadeInUp}>
          WELCOME TO <span className="bw-highlight">SHIELD</span>
        </motion.h1>

        <motion.p variants={fadeInUp}>
          Your premier private intelligence & security organization
        </motion.p>

        <motion.div className="home-buttons" variants={fadeInUp}>
          <Link to="/hire-agent" className="bw-btn">
            Hire an Agent
          </Link>
          <Link to="/join-us" className="bw-btn outline">
            Join Us
          </Link>
        </motion.div>
      </motion.div>

      {/* Restricted Tools */}
      {!user && (
        <section
          className="private-access-section"
          style={{
            marginTop: "3rem",
            padding: "2rem",
            backgroundColor: "rgba(0,0,0,0.7)",
            border: "2px dashed rgba(252, 211, 77, 0.6)",
            borderRadius: "1rem",
            boxShadow: "0 0 16px rgba(252, 211, 77, 0.3)",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          <h2 style={{ color: "rgba(252, 211, 77, 1)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Restricted Tools
          </h2>
          <p style={{ color: "#ccc", fontSize: "1rem", marginTop: "0.5rem" }}>
            Access to advanced SHIELD resources is strictly limited to authorized personnel. Secure portals, internal communication systems, and operational tools are available only to verified agents.
          </p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            If you are a member of our operations team and require access, please contact HQ for credentials.
          </p>
        </section>
      )}
      {user && (
        <section className="private-access-section">
          <h2>Agent-Only Tools</h2>
          <div className="private-links">
            <a href="https://sm.shieldintelligence.in" target="_blank" rel="noopener noreferrer" className="bw-btn">
              Strategic Messaging Terminal
            </a>
            <a href="https://morse.shieldintelligence.in" target="_blank" rel="noopener noreferrer" className="bw-btn">
              Morse Encoder Access
            </a>
            <a href="https://employees.shieldintelligence.in" target="_blank" rel="noopener noreferrer" className="bw-btn">
              Employee Directory
            </a>
            <a href="https://wanted.shieldintelligence.in" target="_blank" rel="noopener noreferrer" className="bw-btn">
              Wanted List
            </a>
          </div>
        </section>
      )}

      {/* Public Resources */}
      <section className="public-resources">
        <h2>Public Resources</h2>
        <ul>
          <li><a href="https://aidiary.shieldintelligence.in" target="_blank" rel="noopener noreferrer">AIDIARY</a></li>
          <li><a href="https://shieldintelligence.in" target="_blank" rel="noopener noreferrer">Main Website</a></li>
          <li><a href="https://download.shieldintelligence.in" target="_blank" rel="noopener noreferrer">Download App (APK)</a></li>
          <li><a href="https://nv.shieldintelligence.in" target="_blank" rel="noopener noreferrer">NotesVault</a></li>
          <li><a href="https://bookmarky.shieldintelligence.in" target="_blank" rel="noopener noreferrer">Bookmarky</a></li>
          <li><a href="https://shield-auth.shieldintelligence.in" target="_blank" rel="noopener noreferrer">SHIELD-Authenticator</a></li>
        </ul>
      </section>

      {/* Contact */}
      <div
        className="contact-section"
        id="contact-section"
      >
        <h2>Contact Us</h2>
        <p>Email: shield@shieldintelligence.in</p>
        <p>X: 0_SHIELD_0</p>
        <p>Instagram: shield_private</p>
        <p>Facebook: SHIELD Intelligence</p>
        <p>Discord: shield_intelligence</p>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #ccc",
          marginTop: "40px",
          padding: "20px 0",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        &copy; 2025 SHIELD — All rights reserved.
        <br />
        <Link to="/terms" style={{ color: "#333", textDecoration: "underline", marginTop: "10px", display: "inline-block" }}>
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
}

export default Home;