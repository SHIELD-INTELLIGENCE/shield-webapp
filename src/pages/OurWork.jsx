import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";
import Lightbox from "../components/Lightbox";
import logo from "../assets/logo.png";

function OurWork() {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    updateSEO(
      "Our Work | SHIELD Intelligence | Ballia",
      "Explore SHIELD Intelligence's portfolio — Green Lawns Public School (Ballia) website and our secure software solutions.",
    );
  }, []);

  const openLightbox = useCallback((src) => setLightboxSrc(src), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="about-section about-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Lightbox src={lightboxSrc} onClose={closeLightbox} />

      <motion.section className="about-hero" variants={fadeInUp}>
        <motion.div
          className="about-logo-frame"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <motion.img
            src={logo}
            alt="SHIELD Intelligence logo"
            className="about-brand-logo"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="about-hero-content">
          <motion.h1 className="about-title" variants={fadeInUp}>
            Our Work
          </motion.h1>
          <motion.p className="about-hero-tagline" variants={fadeInUp}>
            Real Projects, Real Impact
          </motion.p>
        </div>
      </motion.section>

      <motion.section className="about-block" variants={fadeInUp}>
        <motion.h2 className="about-subtitle" variants={fadeInUp}>
          Green Lawns Public School — glps.in
        </motion.h2>

        <motion.div className="work-project-card" variants={fadeInUp}>
          <div className="work-project-screenshots">
            <img
              src="/images/work/glps-home.png"
              alt="GLPS Homepage"
              className="work-screenshot"
              onClick={() => openLightbox("/images/work/glps-home.png")}
            />
            <div className="work-screenshot-thumbs">
              <img
                src="/images/work/glps-about.png"
                alt="About page"
                onClick={() => openLightbox("/images/work/glps-about.png")}
              />
              <img
                src="/images/work/glps-admission.png"
                alt="Admission page"
                onClick={() => openLightbox("/images/work/glps-admission.png")}
              />
              <img
                src="/images/work/glps-contact.png"
                alt="Contact page"
                onClick={() => openLightbox("/images/work/glps-contact.png")}
              />
              <img
                src="/images/work/glps-gallery.png"
                alt="Gallery page"
                onClick={() => openLightbox("/images/work/glps-gallery.png")}
              />
            </div>
          </div>

          <div className="work-project-info">
            <p className="about-paragraph">
              A full-featured bilingual website built for <strong>Green Lawns Public School</strong>,
              Khejuri, Ballia (U.P.). The platform serves as the school's digital presence,
              providing students, parents, and administrators with a comprehensive online
              experience.
            </p>

            <div className="work-tech-stack">
              <span className="work-tech-badge">React 18</span>
              <span className="work-tech-badge">Vite</span>
              <span className="work-tech-badge">Firebase</span>
              <span className="work-tech-badge">Cloudflare R2</span>
              <span className="work-tech-badge">Bilingual (EN/HI)</span>
              <span className="work-tech-badge">Netlify</span>
            </div>

            <ul className="work-feature-list">
              <li>Hero slider with dynamic announcements</li>
              <li>Online admission form with auto-generated PDF</li>
              <li>Student result lookup by name or roll number</li>
              <li>Full admin panel — manage students, teachers, fees, gallery, events, TC</li>
              <li>Mandatory disclosure section (CBSE compliance)</li>
              <li>Bilingual support — English & Hindi</li>
              <li>Gallery with lightbox and category filtering</li>
              <li>Student TC (Transfer Certificate) management</li>
            </ul>

            <div className="work-btn-wrapper">
              <a
                href="https://www.glps.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bw-btn"
              >
                Visit glps.in
              </a>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="about-block about-block-contact" variants={fadeInUp}>
        <motion.h2 className="about-subtitle" variants={fadeInUp}>
          Want to Work With Us?
        </motion.h2>
        <motion.p className="about-paragraph about-paragraph-bottom" variants={fadeInUp}>
          If you have a project in mind or need a custom software solution,
          we would love to hear from you. Reach out through our{" "}
          <Link className="accent-link" to="/#contact-section">
            contact section
          </Link>{" "}
          or submit a request directly via the{" "}
          <Link to="/request-service" className="accent-link">
            Request a Service
          </Link>{" "}
          page.
        </motion.p>
      </motion.section>
    </motion.div>
  );
}

export default OurWork;
