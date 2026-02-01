import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";

function About() {
  useEffect(() => {
    updateSEO(
      "About Us | SHIELD Intelligence",
      "SHIELD Intelligence designs and delivers secure, privacy-conscious software systems and digital products built for real-world use.",
    );
  }, []);

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
      className="about-section"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1 className="about-title" variants={fadeInUp}>
        About SHIELD Intelligence
      </motion.h1>

      <motion.p className="about-paragraph" variants={fadeInUp}>
        SHIELD Intelligence —{" "}
        <strong>
          Spies Hub for Intelligence, Elegance, Learning, and Defence
        </strong>{" "}
        — is a technology-focused organization engaged in the design and
        development of secure, dependable software systems. Our work is centered
        on creating modern web applications, internal tools, and digital
        products that prioritize reliability, controlled access, and responsible
        data handling.
      </motion.p>

      <motion.p className="about-paragraph" variants={fadeInUp}>
        We operate with a practical, execution-driven approach. Every system
        developed under SHIELD Intelligence is intended for active use, built to
        function consistently in real environments rather than as conceptual or
        experimental software. Emphasis is placed on maintainable architectures,
        predictable behavior, and long-term usability across varying operational
        conditions.
      </motion.p>

      <motion.p className="about-paragraph" variants={fadeInUp}>
        Our current scope includes the development of secure websites, internal
        dashboards, role-based systems, and privacy-focused applications.
        Alongside client work, SHIELD Intelligence builds independent
        security-oriented products, including
        <strong> SHIELD Authenticator</strong>, a TOTP-based authenticator
        designed with source availability and end-to-end encryption. These
        products are engineered to meet the same standards applied to
        commissioned systems.
      </motion.p>

      <motion.p className="about-paragraph" variants={fadeInUp}>
        In addition to product development, SHIELD Intelligence undertakes
        selective freelance and contract-based work. This includes custom
        software development for individuals, small shops, and local businesses
        seeking stable, purpose-built digital solutions. Engagements are handled
        with clearly defined requirements and a focus on delivering software
        that remains usable and maintainable beyond initial delivery.
      </motion.p>

      <motion.h2 className="about-subtitle" variants={fadeInUp}>Our Focus</motion.h2>
      <motion.p className="about-paragraph" variants={fadeInUp}>
        SHIELD Intelligence concentrates on building systems that solve
        specific, well-understood problems. Rather than offering broad or
        generalized solutions, we prioritize clarity in scope and
        implementation. This allows us to deliver software that is technically
        sound, operationally reliable, and aligned with real usage requirements.
      </motion.p>

      <motion.p className="about-paragraph" variants={fadeInUp}>
        Our approach favors careful planning, deliberate design choices, and
        controlled complexity. By avoiding unnecessary abstractions and
        overengineering, we ensure that the systems we deliver remain
        understandable, adaptable, and sustainable as requirements evolve.
      </motion.p>

      <motion.h2 className="about-subtitle" variants={fadeInUp}>Future Capabilities</motion.h2>
      <motion.p className="about-paragraph" variants={fadeInUp}>
        SHIELD Intelligence is structured with long-term growth in mind. Future
        areas of operation may include physical security and private
        intelligence services. These capabilities are not currently active, are
        not publicly marketed, and do not have announced timelines. Until
        formally launched, SHIELD Intelligence remains focused exclusively on
        its present software and product development scope.
      </motion.p>

      <motion.h2 className="about-subtitle" variants={fadeInUp}>Get in Touch</motion.h2>
      <motion.p className="about-paragraph about-paragraph-bottom" variants={fadeInUp}>
        If you are interested in building a secure digital system, developing a
        custom application, or using one of our public tools, you can reach us
        by{" "}
        <Link className="accent-link" to="/#contact-section">
         visiting the contact section on our home page
        </Link>
        . You may also submit a request directly through the{" "}
        <Link to="/request-service" className="accent-link">
          Request a Service
        </Link>{" "}
        page.
      </motion.p>
    </motion.div>
  );
}

export default About;
