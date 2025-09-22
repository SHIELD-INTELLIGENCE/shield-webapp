import React from 'react';
import { Link } from 'react-router-dom';

const paragraphStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.8",
  color: "#ccc",
};

function About() {
  return (
    <div className='about-section'>
      <h1 style={{ color: "var(--shield-accent)", textAlign: "center", marginBottom: "1.5rem" }}>
        About SHIELD
      </h1>

      <p style={paragraphStyle}>
        SHIELD — <strong>Spies Hub for Intelligence, Elegance, Learning, and Defence</strong> — is not merely a security company.
        It is a purpose-driven, future-focused private intelligence powerhouse that redefines what safety, strategic observation,
        and discreet service mean in the modern world.
      </p>

      <p style={{ ...paragraphStyle, marginTop: "1rem" }}>
        Established with a vision to create a world where confidentiality and security enable innovation, our elite teams of professionals
        are dedicated to delivering intelligence solutions that not only protect what matters most, but also proactively shape a more
        stable and secure future. Every action we take is guided by unwavering integrity, deep respect for privacy, and an uncompromising
        commitment to excellence.
      </p>

      <p style={paragraphStyle}>
        From high-risk personal protection to enterprise-level security audits, advanced cyber intelligence, forensic investigation, and
        diplomatic liaison, SHIELD applies expertise across multiple domains. Our people draw on decades of real-world intelligence
        experience, working alongside trusted partners and clients who require absolute discretion, rapid response, and actionable insight.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>Our Mission</h2>
      <p style={paragraphStyle}>
        Our mission is to leverage unparalleled human expertise and state-of-the-art technology to create a safer world. Beyond merely
        reacting to threats, we proactively identify risks before they become crises. We believe in empowering individuals, organizations,
        and communities with knowledge, strategy, and protection — ensuring that those we serve never have to look over their shoulders.
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
        supporting dignitaries during high-stakes travel, or providing cyber-intelligence that preempts threats, our elite team of
        professionals is on hand — anytime and anywhere.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>Your Next Step</h2>
      <p style={{ ...paragraphStyle, marginBottom: "2rem" }}>
        Ready to work with us? Reach out by
        <Link 
          to="/#contact-section"
          style={{ color: "var(--shield-accent)", textDecoration: "underline", marginLeft: 4 }}
        >
          visiting the contact section on our home page
        </Link>
        — our team is always ready to listen.
      </p>
    </div>
  );
}

export default About;