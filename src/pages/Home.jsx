import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { updateSEO } from "../utils/seoUtils";
import {
  ShieldIcon,
  BriefcaseIcon,
  TargetIcon,
  LockIcon,
  GlobeIcon,
  ZapIcon,
  SmartphoneIcon,
  DatabaseIcon,
  KeyIcon,
} from "../components/Icons";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    zIndex: 1,
  },
  hover: {
    scale: 1.04,
    y: -8,
    zIndex: 10,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

function Home() {
  const [user, setUser] = useState(null);
  const controls = useAnimation();

  useEffect(() => {
    updateSEO(
      "SHIELD Intelligence | Secure Software & Digital Systems",
      "SHIELD Intelligence builds secure software, authentication tools, and privacy-focused digital products. Request services, explore our products, or join as a contributor.",
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
          SECURE SOFTWARE FOR THE{" "}
          <span className="bw-highlight">REAL WORLD</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="home-hero-text">
          We design and deliver privacy-conscious, reliable digital systems—from
          authentication tools to custom applications built for long-term use.
        </motion.p>

        <motion.div className="home-buttons" variants={fadeInUp}>
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
        className="home-section home-section-wide"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="home-section-title">
          What We Build
        </motion.h2>

        <div className="home-feature-grid">
          <motion.div
            className="home-feature-card"
            variants={cardHover}
            whileHover="hover"
            initial="rest"
          >
            <h3 className="home-feature-title">
              <ShieldIcon size={28} />{" "}
              <span className="nowrap">Security-First Products</span>
            </h3>
            <p className="home-feature-text">
              Privacy-focused tools like SHIELD Authenticator—built with
              end-to-end encryption and zero-knowledge architecture.
            </p>
          </motion.div>

          <motion.div
            className="home-feature-card"
            variants={cardHover}
            whileHover="hover"
            initial="rest"
          >
            <h3 className="home-feature-title">
              <BriefcaseIcon size={28} />{" "}
              <span className="nowrap">Custom Development</span>
            </h3>
            <p className="home-feature-text">
              Tailored web applications, dashboards, and internal tools for
              businesses needing reliable, maintainable solutions.
            </p>
          </motion.div>

          <motion.div
            className="home-feature-card"
            variants={cardHover}
            whileHover="hover"
            initial="rest"
          >
            <h3 className="home-feature-title">
              <TargetIcon size={28} />{" "}
              <span className="nowrap">Purpose-Built Systems</span>
            </h3>
            <p className="home-feature-text">
              Every system is designed for active use—predictable, maintainable,
              and built to function consistently in real environments.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* SHIELD Authenticator Highlight */}
      <motion.section
        className="home-section home-highlight"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="auth-highlight-header">
          <span className="auth-badge">OUR BEST PRODUCT</span>
          <h2 className="auth-title">SHIELD Authenticator</h2>
        </motion.div>

        <motion.p variants={fadeInUp} className="auth-description">
          A privacy-first, TOTP-based authentication tool designed to give you
          full control over your authentication data.{" "}
          <strong className="auth-strong">We are End-To-End Encrypted</strong>{" "}
          with a zero-knowledge architecture—only you can access your codes.
        </motion.p>

        <div className="auth-feature-grid">
          <motion.div variants={fadeInLeft}>
            <div className="auth-feature-item">
              <strong className="auth-feature-title">
                <LockIcon size={20} /> 256-bit Encryption
              </strong>
              <p className="auth-feature-text">
                Zero-trust, zero-knowledge model protects all your
                authentication data
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="auth-feature-item">
              <strong className="auth-feature-title">
                <GlobeIcon size={20} /> Cross-Platform
              </strong>
              <p className="auth-feature-text">
                Secure access across web and mobile with encrypted sync
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInRight}>
            <div className="auth-feature-item">
              <strong className="auth-feature-title">
                <ZapIcon size={20} /> Offline Ready
              </strong>
              <p className="auth-feature-text">
                Generate TOTP codes anytime, even without internet
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInLeft}>
            <div className="auth-feature-item">
              <strong className="auth-feature-title">
                <SmartphoneIcon size={20} /> QR Code Support
              </strong>
              <p className="auth-feature-text">
                Quick setup via QR scan or manual entry
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="auth-feature-item">
              <strong className="auth-feature-title">
                <DatabaseIcon size={20} /> Encrypted Backup
              </strong>
              <p className="auth-feature-text">
                Export and import with optional encryption
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInRight}>
            <div className="auth-feature-item">
              <strong className="auth-feature-title">
                <KeyIcon size={20} /> Privacy Controls
              </strong>
              <p className="auth-feature-text">
                Mask codes and secure copy for public environments
              </p>
            </div>
          </motion.div>
        </div>
        <motion.div variants={fadeInUp} className="auth-cta-center">
          <a
            href="https://shield-auth.shieldintelligence.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bw-btn home-cta-btn"
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
        className="home-approach"
      >
        <motion.h2 variants={fadeInUp} className="home-approach-title">
          Our Approach
        </motion.h2>

        <div className="home-approach-grid">
          <motion.div variants={fadeInUp}>
            <h3 className="home-approach-heading">Built for Real Use</h3>
            <p className="home-approach-text">
              Every system we develop is intended for active
              deployment—functioning consistently in real environments rather
              than as experimental software.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="home-approach-heading">Maintainable Architecture</h3>
            <p className="home-approach-text">
              We favor careful planning and deliberate design choices, avoiding
              unnecessary abstractions to ensure systems remain understandable
              and adaptable.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="home-approach-heading">Long-Term Usability</h3>
            <p className="home-approach-text">
              Our focus is on delivering software that remains usable and
              maintainable well beyond initial delivery, evolving with your
              requirements.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="home-section home-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h2 className="home-cta-title">Ready to Build Something Secure?</h2>
        <p className="home-cta-text">
          Whether you need a custom application, security tool, or digital
          system, we're here to help.
        </p>
        <div className="home-cta-actions">
          <Link to="/request-service" className="bw-btn home-cta-btn">
            Request a Service
          </Link>
          <Link to="/join-us" className="bw-btn home-cta-btn">
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
      >
        <motion.h2 variants={fadeInUp}>Explore Our Products</motion.h2>
        <motion.ul variants={staggerContainer}>
          <motion.li variants={fadeInUp}>
            <a
              href="https://shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <GlobeIcon size={20} /> Official Website
            </a>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <a
              href="https://shield-auth.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <ShieldIcon size={20} /> SHIELD Authenticator (Web)
            </a>
          </motion.li>
          <motion.li variants={fadeInUp}>
            <a
              href="https://download.shieldintelligence.in"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <SmartphoneIcon size={20} /> Download Android App (APK)
            </a>
          </motion.li>
        </motion.ul>
      </motion.section>
    </div>
  );
}

export default Home;
