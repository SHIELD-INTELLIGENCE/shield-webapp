import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Simplified animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="home-hero-bw">
      <motion.div 
        className="home-hero-content-bw"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="logo-container" {...scaleIn}>
          <img src={logo} alt="SHIELD Logo" className="logo" />
        </motion.div>
        
        <motion.h1 {...fadeInUp}>
          WELCOME TO <span className="bw-highlight">SHIELD</span>
        </motion.h1>
        
        <motion.p {...fadeInUp}>
          Your premier private intelligence & security organization
        </motion.p>
        
        <motion.div className="home-buttons" {...fadeInUp}>
          <Link to="/hire-agent" className="bw-btn">
            Hire an Agent
          </Link>
          <Link to="/join-us" className="bw-btn outline">
            Join Us
          </Link>
        </motion.div>
      </motion.div>

      {!user && (
        <motion.section
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ amount: 0.2 }}
        >
          <h2
            style={{
              color: "rgba(252, 211, 77, 1)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Restricted Tools
          </h2>
          <p style={{ color: "#ccc", fontSize: "1rem", marginTop: "0.5rem" }}>
            Some of our most advanced resources — including encrypted
            communication, agent-only portals, and our{" "}
            <span style={{ color: "#fcd34d" }}>morse & encoder tools</span> —
            are secured and accessible only to authorized SHIELD personnel.
          </p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Please contact HQ for credentials if you are part of our operations.
          </p>
        </motion.section>
      )}

      {/* Show Agent tools if logged in */}
      {user && (
        <motion.section 
          className="private-access-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ amount: 0.2 }}
        >
          <h2>Agent-Only Tools</h2>
          <div className="private-links">
            <a
              href="https://sm.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn"
            >
              Strategic Messaging Terminal
            </a>
            <a
              href="https://morse.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn"
            >
              Morse Encoder Access
            </a>
          </div>
        </motion.section>
      )}

      {/* Public Resources */}
      <motion.section 
        className="public-resources"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.2 }}
      >
        <h2>Public Resources</h2>
        <ul>
          <li>
            <a
              href="https://aidiary.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              AIDIARY
            </a>
          </li>
          <li>
            <a
              href="https://shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Website
            </a>
          </li>
          <li>
            <a
              href="https://employees.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Employee Directory
            </a>
          </li>
          <li>
            <a
              href="https://download.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download App (APK)
            </a>
          </li>
          <li>
            <a
              href="https://wanted.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wanted List
            </a>
          </li>
          <li>
            <a
              href="https://nv.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              NotesVault
            </a>
          </li>
          <li>
            <a
              href="https://bookmarky.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bookmarky
            </a>
          </li>
          <li>
            <a
              href="https://jyotilite.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jyotilite
            </a>
          </li>
          <li>
            <a
              href="https://shield-auth.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              SHIELD-Authenticator
            </a>
          </li>
        </ul>
      </motion.section>

      {/* Contact Section */}
      <motion.div 
        className="contact-section" 
        id="contact-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.2 }}
      >
        <h2>Contact Us</h2>
        <p>Email: shield@shieldintelligence.in</p>
        <p>X: 0_SHIELD_0</p>
        <p>Instagram: shield_private</p>
        <p>Facebook: SHIELD Intelligence</p>
      </motion.div>

      {/* Footer */}
      <motion.div
        style={{
          borderTop: "1px solid #ccc",
          marginTop: "40px",
          padding: "20px 0",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3 }}
      >
        &copy; 2025 SHIELD — All rights reserved.
        <br />
        <Link
          to="/terms"
          style={{
            color: "#333",
            textDecoration: "underline",
            marginTop: "10px",
            display: "inline-block",
          }}
        >
          Terms & Conditions
        </Link>
      </motion.div>
    </div>
  );
}

export default Home;
