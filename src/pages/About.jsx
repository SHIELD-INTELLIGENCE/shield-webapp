import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../utils/seoUtils';

const paragraphStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.8",
  color: "#ccc",
};

function About() {
  useEffect(() => {
    updateSEO(
      "About Us | SHIELD Intelligence",
      "Learn about SHIELD — Spies Hub for Intelligence, Elegance, Learning, and Defence. Our mission is to redefine safety and strategic observation."
    );
  }, []);

  return (
    <div className='about-section'>
      <h1 style={{ color: "var(--shield-accent)", textAlign: "center", marginBottom: "1.5rem" }}>
        About SHIELD
      </h1>

      <p style={paragraphStyle}>
        SHIELD — <strong>Spies Hub for Intelligence, Elegance, Learning, and Defence</strong> — is not merely a security company.
        It is a purpose-driven, future-focused private intelligence and technology powerhouse that redefines what safety, strategic observation,
        discreet service, and innovative software solutions mean in the modern world.
      </p>

      <p style={{ ...paragraphStyle, marginTop: "1rem" }}>
        Established with a vision to create a world where confidentiality and security enable innovation, our elite teams of professionals
        are dedicated to delivering intelligence solutions and cutting-edge software products that not only protect what matters most, but also 
        empower users with powerful digital tools. From advanced security services to custom-built applications and platforms, we proactively 
        shape a more stable and secure future. Every action we take is guided by unwavering integrity, deep respect for privacy, and an 
        uncompromising commitment to excellence.
      </p>

      <p style={paragraphStyle}>
        From high-risk personal protection to enterprise-level security audits, advanced cyber intelligence, forensic investigation, 
        diplomatic liaison, and <strong>custom software development</strong>, SHIELD applies expertise across multiple domains. We design 
        and build secure digital solutions including websites, mobile applications, authentication systems, productivity tools, and specialized 
        platforms. Our flagship products include SHIELD Authenticator, AIDIARY, NotesVault, and Bookmarky — all built with the same precision 
        and security standards we apply to intelligence operations. Our people draw on decades of real-world intelligence experience and 
        cutting-edge development expertise, working alongside trusted partners and clients who require absolute discretion, rapid response, 
        and actionable insight.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>Our Mission</h2>
      <p style={paragraphStyle}>
        Our mission is to leverage unparalleled human expertise and state-of-the-art technology to create a safer, more connected world. 
        Beyond merely reacting to threats, we proactively identify risks before they become crises while simultaneously building innovative 
        software solutions that enhance productivity, security, and privacy for everyone. We believe in empowering individuals, organizations,
        and communities with knowledge, strategy, protection, and powerful digital tools — ensuring that those we serve never have to look 
        over their shoulders and have the best technology at their fingertips.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>Our Core Values</h2>
      <ul style={{ paddingLeft: "1.2rem", color: "#ccc", fontSize: "1.1rem", lineHeight: "1.8" }}>
        <li><strong>Integrity:</strong> Upholding the highest moral standards in every action.</li>
        <li><strong>Confidentiality:</strong> Treating every matter with utmost discretion.</li>
        <li><strong>Excellence:</strong> Committing to the absolute best in every service we provide.</li>
        <li><strong>Vigilance:</strong> Constantly adapting to new challenges and emerging risks.</li>
        <li><strong>Innovation:</strong> Harnessing new technologies and methodologies to stay ahead of the curve.</li>
      </ul>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>Why Choose SHIELD?</h2>
      <p style={paragraphStyle}>
        Every client we serve is unique — and so are the solutions we craft. SHIELD takes the time to understand your goals, assess the
        landscape, and craft tailored strategies that deliver real-world results. Whether it's protecting assets across borders,
        supporting dignitaries during high-stakes travel, providing cyber-intelligence that preempts threats, or <strong>developing custom 
        websites, mobile apps, and specialized software tools</strong> built to your exact specifications — our elite team of
        professionals is on hand, anytime and anywhere. We combine intelligence expertise with technical excellence to deliver solutions 
        that exceed expectations.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>Your Next Step</h2>
      <p style={{ ...paragraphStyle, marginBottom: "2rem" }}>
        Ready to work with us? Whether you need intelligence services, want to build a custom software solution, or wish to explore our 
        public tools, reach out by
        <Link 
          to="/#contact-section"
          style={{ color: "var(--shield-accent)", textDecoration: "underline", marginLeft: 4 }}
        >
          visiting the contact section on our home page
        </Link>
        — our team is always ready to listen. Or explore our <Link to="/request-service" style={{ color: "var(--shield-accent)", textDecoration: "underline" }}>service request form</Link> to get started immediately.
      </p>
    </div>
  );
}

export default About;