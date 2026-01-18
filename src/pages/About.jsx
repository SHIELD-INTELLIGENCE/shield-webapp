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
      "SHIELD Intelligence designs and delivers secure, privacy-conscious software systems and digital products built for real-world use."
    );
  }, []);

  return (
    <div className='about-section'>
      <h1 style={{ color: "var(--shield-accent)", textAlign: "center", marginBottom: "1.5rem" }}>
        About SHIELD Intelligence
      </h1>

      <p style={paragraphStyle}>
        SHIELD Intelligence — <strong>Spies Hub for Intelligence, Elegance, Learning, and Defence</strong> — is a technology-focused organization
        engaged in the design and development of secure, dependable software systems. Our work is centered on creating modern web
        applications, internal tools, and digital products that prioritize reliability, controlled access, and responsible data handling.
      </p>

      <p style={{ ...paragraphStyle, marginTop: "1rem" }}>
        We operate with a practical, execution-driven approach. Every system developed under SHIELD Intelligence is intended for active use,
        built to function consistently in real environments rather than as conceptual or experimental software. Emphasis is placed
        on maintainable architectures, predictable behavior, and long-term usability across varying operational conditions.
      </p>

      <p style={paragraphStyle}>
        Our current scope includes the development of secure websites, internal dashboards, role-based systems, and privacy-focused
        applications. Alongside client work, SHIELD Intelligence builds independent security-oriented products, including
        <strong> SHIELD Authenticator</strong>, a TOTP-based authenticator designed with source availability and end-to-end encryption.
        These products are engineered to meet the same standards applied to commissioned systems.
      </p>

      <p style={paragraphStyle}>
        In addition to product development, SHIELD Intelligence undertakes selective freelance and contract-based work. This includes custom
        software development for individuals, small shops, and local businesses seeking stable, purpose-built digital solutions.
        Engagements are handled with clearly defined requirements and a focus on delivering software that remains usable and
        maintainable beyond initial delivery.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>
        Our Focus
      </h2>
      <p style={paragraphStyle}>
        SHIELD Intelligence concentrates on building systems that solve specific, well-understood problems. Rather than offering broad or
        generalized solutions, we prioritize clarity in scope and implementation. This allows us to deliver software that is
        technically sound, operationally reliable, and aligned with real usage requirements.
      </p>

      <p style={paragraphStyle}>
        Our approach favors careful planning, deliberate design choices, and controlled complexity. By avoiding unnecessary
        abstractions and overengineering, we ensure that the systems we deliver remain understandable, adaptable, and sustainable
        as requirements evolve.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>
        Future Capabilities
      </h2>
      <p style={paragraphStyle}>
        SHIELD Intelligence is structured with long-term growth in mind. Future areas of operation may include physical security and private
        intelligence services. These capabilities are not currently active, are not publicly marketed, and do not have announced
        timelines. Until formally launched, SHIELD Intelligence remains focused exclusively on its present software and product development scope.
      </p>

      <h2 style={{ color: "var(--shield-accent)", marginTop: "2.5rem", fontSize: "1.5rem" }}>
        Get in Touch
      </h2>
      <p style={{ ...paragraphStyle, marginBottom: "2rem" }}>
        If you are interested in building a secure digital system, developing a custom application, or using one of our public tools,
        you can reach us by
        <Link
          to="/#contact-section"
          style={{ color: "var(--shield-accent)", textDecoration: "underline", marginLeft: 4 }}
        >
          visiting the contact section on our home page
        </Link>
        . You may also submit a request directly through the{" "}
        <Link
          to="/request-service"
          style={{ color: "var(--shield-accent)", textDecoration: "underline" }}
        >
          Request a Service
        </Link>{" "}
        page.
      </p>
    </div>
  );
}

export default About;
