import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { updateSEO } from "../utils/seoUtils";
import { ShieldIcon, BriefcaseIcon, TargetIcon, LockIcon, GlobeIcon, ZapIcon, SmartphoneIcon, DatabaseIcon, KeyIcon } from "../components/Icons";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -5, transition: { duration: 0.3, ease: "easeOut" } }
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
          SECURE SOFTWARE FOR THE <span className="bw-highlight">REAL WORLD</span>
        </motion.h1>

        <motion.p variants={fadeInUp} style={{ fontSize: "1.15rem", maxWidth: "700px", margin: "0 auto 2rem" }}>
          We design and deliver privacy-conscious, reliable digital systems—from authentication tools to custom applications built for long-term use.
        </motion.p>

        <motion.div className="home-buttons" variants={fadeInUp} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/request-service" className="bw-btn">
            Request a Service
          </Link>
          <Link to="/about" className="bw-btn outline">
            Learn More
          </Link>
        </motion.div>
      </motion.div>

      {/* Value Proposition Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        style={{
          marginTop: "5rem",
          padding: "3rem 2rem",
          maxWidth: "1200px",
          marginInline: "auto"
        }}
      >
        <motion.h2 
          variants={fadeInUp}
          style={{ 
            color: "var(--shield-accent)", 
            textAlign: "center", 
            marginBottom: "3rem",
            fontSize: "2rem"
          }}
        >
          What We Build
        </motion.h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "2rem" 
        }}>
          <motion.div 
            variants={fadeInUp}
            whileHover="hover"
            initial="rest"
            style={{
              padding: "2rem",
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              border: "1px solid rgba(202, 169, 76, 0.3)",
              borderRadius: "0.75rem",
              transition: "all 0.3s ease"
            }}
          >
            <h3 style={{ color: "var(--shield-accent)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "clamp(1rem, 4vw, 1.5rem)" }}>
              <ShieldIcon size={28} /> <span style={{ whiteSpace: "nowrap" }}>Security-First Products</span>
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.7" }}>
              Privacy-focused tools like SHIELD Authenticator—built with end-to-end encryption and zero-knowledge architecture.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover="hover"
            initial="rest"
            style={{
              padding: "2rem",
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              border: "1px solid rgba(202, 169, 76, 0.3)",
              borderRadius: "0.75rem",
              transition: "all 0.3s ease"
            }}
          >
            <h3 style={{ color: "var(--shield-accent)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "clamp(1rem, 4vw, 1.5rem)" }}>
              <BriefcaseIcon size={28} /> <span style={{ whiteSpace: "nowrap" }}>Custom Development</span>
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.7" }}>
              Tailored web applications, dashboards, and internal tools for businesses needing reliable, maintainable solutions.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover="hover"
            initial="rest"
            style={{
              padding: "2rem",
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              border: "1px solid rgba(202, 169, 76, 0.3)",
              borderRadius: "0.75rem",
              transition: "all 0.3s ease"
            }}
          >
            <h3 style={{ color: "var(--shield-accent)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "clamp(1rem, 4vw, 1.5rem)" }}>
              <TargetIcon size={28} /> <span style={{ whiteSpace: "nowrap" }}>Purpose-Built Systems</span>
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.7" }}>
              Every system is designed for active use—predictable, maintainable, and built to function consistently in real environments.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* SHIELD Authenticator Highlight */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        style={{
          marginTop: "5rem",
          padding: "3rem 2rem",
          backgroundColor: "rgba(26, 26, 26, 0.95)",
          border: "2px solid rgba(202, 169, 76, 0.4)",
          borderRadius: "1rem",
          maxWidth: "1100px",
          marginInline: "auto",
          boxShadow: "0 8px 32px rgba(202, 169, 76, 0.15)"
        }}
      >
        <motion.div variants={fadeInUp} style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ 
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(202, 169, 76, 0.15)",
            color: "var(--shield-accent)",
            borderRadius: "2rem",
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "1px",
            marginBottom: "1rem"
          }}>
            OUR BEST PRODUCT
          </span>
          <h2 style={{ color: "var(--shield-accent)", fontSize: "2.2rem", marginTop: "0.5rem" }}>
            SHIELD Authenticator
          </h2>
        </motion.div>

        <motion.p variants={fadeInUp} style={{ color: "#e0e0e0", lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "2rem", textAlign: "center", maxWidth: "800px", marginInline: "auto" }}>
          A privacy-first, TOTP-based authentication tool designed to give you full control over your authentication data. <strong style={{ color: "var(--shield-accent)", textShadow: "0 0 8px rgba(202, 169, 76, 0.4)" }}>We are End-To-End Encrypted</strong> with a zero-knowledge architecture—only you can access your codes.
        </motion.p>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1.5rem",
          marginBottom: "2.5rem" 
        }}>
          <motion.div variants={fadeInLeft}>
            <div style={{ color: "#ccc", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--shield-accent)", display: "flex", alignItems: "center", textShadow: "0 0 10px rgba(202, 169, 76, 0.5), 0 0 20px rgba(202, 169, 76, 0.3)" }}>
                <LockIcon size={20} /> 256-bit Encryption
              </strong>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Zero-trust, zero-knowledge model protects all your authentication data</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div style={{ color: "#ccc", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--shield-accent)", display: "flex", alignItems: "center", textShadow: "0 0 10px rgba(202, 169, 76, 0.5), 0 0 20px rgba(202, 169, 76, 0.3)" }}>
                <GlobeIcon size={20} /> Cross-Platform
              </strong>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Secure access across web and mobile with encrypted sync</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInRight}>
            <div style={{ color: "#ccc", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--shield-accent)", display: "flex", alignItems: "center", textShadow: "0 0 10px rgba(202, 169, 76, 0.5), 0 0 20px rgba(202, 169, 76, 0.3)" }}>
                <ZapIcon size={20} /> Offline Ready
              </strong>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Generate TOTP codes anytime, even without internet</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInLeft}>
            <div style={{ color: "#ccc", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--shield-accent)", display: "flex", alignItems: "center", textShadow: "0 0 10px rgba(202, 169, 76, 0.5), 0 0 20px rgba(202, 169, 76, 0.3)" }}>
                <SmartphoneIcon size={20} /> QR Code Support
              </strong>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Quick setup via QR scan or manual entry</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div style={{ color: "#ccc", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--shield-accent)", display: "flex", alignItems: "center", textShadow: "0 0 10px rgba(202, 169, 76, 0.5), 0 0 20px rgba(202, 169, 76, 0.3)" }}>
                <DatabaseIcon size={20} /> Encrypted Backup
              </strong>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Export and import with optional encryption</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInRight}>
            <div style={{ color: "#ccc", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--shield-accent)", display: "flex", alignItems: "center", textShadow: "0 0 10px rgba(202, 169, 76, 0.5), 0 0 20px rgba(202, 169, 76, 0.3)" }}>
                <KeyIcon size={20} /> Privacy Controls
              </strong>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>Mask codes and secure copy for public environments</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} style={{ textAlign: "center" }}>
          <a
            href="https://shield-auth.shieldintelligence.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bw-btn"
            style={{ fontSize: "clamp(0.95rem, 3vw, 1.1rem)", padding: "0.85rem 2rem", whiteSpace: "nowrap" }}
          >
            Open SHIELD Authenticator →
          </a>
        </motion.div>
      </motion.section>

      {/* Why SHIELD Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        style={{
          marginTop: "5rem",
          padding: "3rem 2rem",
          maxWidth: "1100px",
          marginInline: "auto",
          backgroundColor: "rgba(26, 26, 26, 0.6)",
          border: "1px solid rgba(202, 169, 76, 0.2)",
          borderRadius: "1rem"
        }}
      >
        <motion.h2 
          variants={fadeInUp}
          style={{ 
            color: "var(--shield-accent)", 
            textAlign: "center", 
            marginBottom: "2rem",
            fontSize: "2rem"
          }}
        >
          Our Approach
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
          <motion.div variants={fadeInUp}>
            <h3 style={{ color: "var(--shield-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>
              Built for Real Use
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.8" }}>
              Every system we develop is intended for active deployment—functioning consistently in real environments rather than as experimental software.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 style={{ color: "var(--shield-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>
              Maintainable Architecture
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.8" }}>
              We favor careful planning and deliberate design choices, avoiding unnecessary abstractions to ensure systems remain understandable and adaptable.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 style={{ color: "var(--shield-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>
              Long-Term Usability
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.8" }}>
              Our focus is on delivering software that remains usable and maintainable well beyond initial delivery, evolving with your requirements.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        style={{
          marginTop: "5rem",
          marginBottom: "3rem",
          padding: "3rem 2rem",
          backgroundColor: "rgba(202, 169, 76, 0.08)",
          border: "1px solid rgba(202, 169, 76, 0.3)",
          borderRadius: "1rem",
          maxWidth: "900px",
          marginInline: "auto",
          textAlign: "center"
        }}
      >
        <h2 style={{ color: "var(--shield-accent)", fontSize: "2rem", marginBottom: "1rem" }}>
          Ready to Build Something Secure?
        </h2>
        <p style={{ color: "#ccc", lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "2rem", maxWidth: "600px", marginInline: "auto" }}>
          Whether you need a custom application, security tool, or digital system, we're here to help.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/request-service" className="bw-btn" style={{ fontSize: "1.05rem" }}>
            Request a Service
          </Link>
          <Link to="/join-us" className="bw-btn outline" style={{ fontSize: "1.05rem" }}>
            Join Our Team
          </Link>
        </div>
      </motion.section>

      {/* Products & Resources */}
      <motion.section 
        className="public-resources" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        style={{ marginTop: "4rem", paddingBottom: "3rem" }}
      >
        <motion.h2 variants={fadeInUp}>Explore Our Products</motion.h2>
        <motion.ul variants={staggerContainer}>
          <motion.li variants={fadeInUp}>
            <a href="https://shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center" }}>
              <GlobeIcon size={20} /> Main Website
            </a>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <a href="https://shield-auth.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center" }}>
              <ShieldIcon size={20} /> SHIELD Authenticator (Web)
            </a>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <a href="https://download.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center" }}>
              <SmartphoneIcon size={20} /> Download Android App (APK)
            </a>
          </motion.li>
        </motion.ul>
      </motion.section>
    </div>
  );
}

export default Home;
