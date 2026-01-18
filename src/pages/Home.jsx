import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { updateSEO } from "../utils/seoUtils";

// Animation Variants
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

function Home() {
  const [user, setUser] = useState(null);
  const controls = useAnimation();

  useEffect(() => {
    updateSEO(
      "SHIELD Intelligence | Secure Software & Digital Systems",
      "SHIELD Intelligence builds secure software, authentication tools, and privacy-focused digital products. Request services, explore our products, or join as a contributor."
    );
    const unsubscribe = onAuthStateChanged(auth, setUser);
    controls.start("visible");
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-hero-bw">
      {/* Hero Section */}
      <motion.div
        className="home-hero-content-bw"
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
      >
        <motion.div className="logo-container" variants={scaleIn}>
          <img src={logo} alt="SHIELD Intelligence Logo" className="logo" />
        </motion.div>

        <motion.h1 variants={fadeInUp}>
          WELCOME TO <span className="bw-highlight">SHIELD INTELLIGENCE</span>
        </motion.h1>

        <motion.p variants={fadeInUp}>
          Secure software, authentication tools, and privacy-focused digital systems.
        </motion.p>

        <motion.div className="home-buttons" variants={fadeInUp}>
          <Link to="/request-service" className="bw-btn">
            Request a Service
          </Link>
          <Link to="/join-us" className="bw-btn outline">
            Join Us
          </Link>
        </motion.div>
      </motion.div>

      {/* Product Highlight */}
      <section
        style={{
          marginTop: "4rem",
          padding: "2rem",
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(252, 211, 77, 0.3)",
          borderRadius: "1rem",
          maxWidth: "1000px",
          marginInline: "auto"
        }}
      >
        <h2 style={{ color: "rgba(252, 211, 77, 1)", marginBottom: "1rem" }}>
          SHIELD Authenticator
        </h2>

        <p style={{ color: "#ccc", lineHeight: "1.8", marginBottom: "1rem" }}>
          SHIELD Authenticator is a privacy-first, TOTP-based authentication tool designed
          to give users full control over their authentication data. It uses end-to-end
          encryption and a zero-knowledge architecture to ensure that only you can access
          your codes.
        </p>

        <ul style={{ color: "#ccc", lineHeight: "1.8" }}>
          <li><strong>End-to-End Encryption (256-bit):</strong> Authentication data is protected using a zero-trust, zero-knowledge model.</li>
          <li><strong>Encrypted Vault:</strong> Accounts are stored in a vault secured by a passphrase known only to you.</li>
          <li><strong>Cross-Platform Access:</strong> Use securely across web and mobile with encrypted sync.</li>
          <li><strong>Time-Based Codes:</strong> Generates TOTP codes that refresh every 30 seconds.</li>
          <li><strong>QR Code Support:</strong> Add accounts quickly via QR scan or manual entry.</li>
          <li><strong>Offline Access:</strong> Generate codes without an internet connection.</li>
          <li><strong>Encrypted CSV Backup:</strong> Export and import backups with optional encryption.</li>
          <li><strong>Account Recovery Options:</strong> Recovery questions help restore access if needed.</li>
          <li><strong>Privacy Controls:</strong> Mask codes and copy securely for public or shared environments.</li>
          <li><strong>Trusted Device Convenience:</strong> Optionally remember your vault passphrase on trusted devices.</li>
        </ul>

        <a
          href="https://shield-auth.shieldintelligence.in"
          target="_blank"
          rel="noopener noreferrer"
          className="bw-btn"
          style={{ marginTop: "1.5rem", display: "inline-block" }}
        >
          Open SHIELD Authenticator
        </a>
      </section>

      {/* Public Resources */}
      <section className="public-resources" style={{ marginTop: "4rem" }}>
        <h2>Our Products</h2>
        <ul>
          <li>
            <a href="https://shieldintelligence.in" target="_blank" rel="noopener noreferrer">
              Main Website
            </a>
          </li>
          <li>
            <a href="https://download.shieldintelligence.in" target="_blank" rel="noopener noreferrer">
              Download Android App (APK)
            </a>
          </li>
          <li>
            <a href="https://shield-auth.shieldintelligence.in" target="_blank" rel="noopener noreferrer">
              SHIELD Authenticator
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
