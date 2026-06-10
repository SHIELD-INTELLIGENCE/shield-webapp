import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";

function WhoWeAre() {
  useEffect(() => {
    updateSEO(
      "Who We Are | SHIELD Intelligence",
      "Meet the founders behind SHIELD Intelligence — Reyansh Raj Mishra, Akshit Pandey, and Shubham Kumar Upadhyay.",
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
      className="about-section about-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.section className="about-hero" variants={fadeInUp}>
        <motion.div
          className="about-logo-frame"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <motion.img
            src="/logo512.png"
            alt="SHIELD Intelligence logo"
            className="about-brand-logo"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="about-hero-content">
          <motion.h1 className="about-title" variants={fadeInUp}>
            Who We Are
          </motion.h1>
          <motion.p className="about-hero-tagline" variants={fadeInUp}>
            Meet the People Behind SHIELD Intelligence
          </motion.p>
        </div>
      </motion.section>

      <motion.section className="about-block" variants={fadeInUp}>
        <motion.p className="about-paragraph" variants={fadeInUp}>
          SHIELD Intelligence is built by a team of engineers, operators, and
          strategists who believe that great technology comes from purpose,
          discipline, and a commitment to real-world results. Here are the people
          driving that vision.
        </motion.p>
      </motion.section>

      <motion.section className="about-block" variants={fadeInUp}>
        <motion.h2 className="about-subtitle" variants={fadeInUp}>From the Founders</motion.h2>

        <motion.div className="founder-card" variants={fadeInUp}>
          <h3 className="founder-name">Reyansh Raj Mishra</h3>
          <p className="founder-role"><strong>Designation:</strong> Founder | Chief Executive Officer</p>
          <p className="about-paragraph">
            SHIELD was built on a simple belief: technology should be dependable, secure, and built
            with purpose.
          </p>
          <p className="about-paragraph">
            From the beginning, my vision has been to create an organization that solves meaningful
            problems through thoughtful engineering, disciplined execution, and long-term thinking. I
            believe great systems are not defined by complexity, but by their ability to remain
            reliable when people need them most.
          </p>
          <p className="about-paragraph">
            At SHIELD, we focus on building solutions that organizations can trust—whether through
            software, infrastructure, or digital transformation initiatives. Every project is
            approached with a commitment to quality, continuous improvement, and genuine value creation.
          </p>
          <p className="about-paragraph">
            We are still at the start of our journey, but our direction is clear: build exceptional
            products, earn trust through results, and create a lasting impact through technology.
          </p>
          <p className="founder-signoff">— Reyansh Raj Mishra<br/>Founder | CEO</p>
        </motion.div>

        <motion.div className="founder-card" variants={fadeInUp}>
          <h3 className="founder-name">Akshit Pandey</h3>
          <p className="founder-role"><strong>Designation:</strong> Co-Founder | Chief Operations Officer</p>
          <p className="about-paragraph">
            Building great technology requires more than strong ideas—it requires consistency,
            discipline, and execution.
          </p>
          <p className="about-paragraph">
            As Co-Founder of SHIELD Intelligence, my focus is on ensuring that our operations,
            processes, and projects are aligned with our mission and delivered to the highest
            standard. I believe sustainable growth comes from strong foundations, clear
            communication, and a commitment to excellence in every detail.
          </p>
          <p className="about-paragraph">
            Our goal is not simply to complete projects, but to build long-term relationships with
            clients by delivering solutions that are reliable, practical, and impactful.
          </p>
          <p className="about-paragraph">
            As SHIELD grows, I remain committed to strengthening the systems, culture, and
            operational framework that will support our vision for years to come.
          </p>
          <p className="founder-signoff">— Akshit Pandey<br/>Co-Founder | Chief Operations Officer</p>
        </motion.div>

        <motion.div className="founder-card" variants={fadeInUp}>
          <h3 className="founder-name">Shubham Kumar Upadhyay</h3>
          <p className="founder-role"><strong>Designation:</strong> Engineer | Co-Founder | Chief Growth Officer</p>
          <p className="about-paragraph">
            Innovation creates opportunities, but meaningful growth comes from understanding people,
            solving real problems, and building lasting relationships.
          </p>
          <p className="about-paragraph">
            As Co-Founder of SHIELD Intelligence, I focus on business development, strategic
            partnerships, and expanding our reach to new markets. My role involves working closely
            with clients to understand their challenges, identify opportunities, and ensure our
            solutions create measurable value.
          </p>
          <p className="about-paragraph">
            With an engineering background and a passion for technology, I enjoy bridging the gap
            between business objectives and practical innovation. I believe that sustainable growth
            is achieved when customer success and organizational progress move together.
          </p>
          <p className="about-paragraph">
            My commitment is to help SHIELD continuously evolve, strengthen its market presence, and
            create long-term value for every client and partner we serve.
          </p>
          <p className="founder-signoff">— Shubham Kumar Upadhyay<br/>Engineer | Co-Founder | Chief Growth Officer</p>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}

export default WhoWeAre;
