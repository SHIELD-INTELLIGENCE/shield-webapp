// src/pages/JoinUsTerms.jsx
import React, { useEffect } from "react";
import { updateSEO } from "../utils/seoUtils";

const JoinUsTerms = () => {
  useEffect(() => {
    updateSEO(
      "Join SHIELD Intelligence – Terms & Conditions",
      "Terms and conditions governing applications to join SHIELD Intelligence as a student or contributor."
    );

    const metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "robots");
    metaTag.setAttribute("content", "noindex, follow");
    metaTag.setAttribute("id", "noindex-joinus-tag");
    document.head.appendChild(metaTag);

    return () => {
      const existingTag = document.getElementById("noindex-joinus-tag");
      if (existingTag) {
        document.head.removeChild(existingTag);
      }
    };
  }, []);

  return (
    <div
      className="terms-page"
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.6",
        background: "#f5f5f5",
        color: "#333",
      }}
    >
      <style>{`.terms-page p, .terms-page li { color: #000 !important; }`}</style>

      <h1>Terms & Conditions for Joining SHIELD Intelligence</h1>
      <p><strong>Effective Date:</strong> January 18, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        SHIELD Intelligence (“SHIELD”) is a technology-focused initiative engaged in
        software development, digital products, and technical experimentation.
        SHIELD is not currently a registered company, government body, security agency,
        or licensed intelligence organization.
      </p>
      <p>
        These Terms apply to all individuals applying to join SHIELD as students,
        contributors, interns, or early collaborators through the Join SHIELD Intelligence
        application form.
      </p>

      <h2>2. Nature of Participation</h2>
      <p>
        Joining SHIELD does not constitute employment, formal partnership, or guaranteed
        position. Participation is voluntary and based on availability, interest, and
        suitability.
      </p>
      <p>
        Roles may involve learning, experimentation, and contribution to real software
        projects under guidance. There is no guarantee of compensation, recognition,
        or continued involvement.
      </p>

      <h2>3. Eligibility</h2>
      <ul>
        <li>Applicants must be at least 13 years of age.</li>
        <li>Applicants must provide accurate and truthful information.</li>
        <li>SHIELD reserves the right to accept or reject any application without explanation.</li>
      </ul>

      <h2>4. Scope of Work</h2>
      <p>
        Current work at SHIELD focuses on software development, digital products,
        system design, and technical research.
      </p>
      <p>
        Physical protection services and private intelligence operations are planned
        future divisions only. These are not currently active, and applicants will not
        be involved in real-world intelligence or physical security operations at this time.
      </p>

      <h2>5. Conduct & Responsibility</h2>
      <ul>
        <li>Maintain respectful and professional behavior.</li>
        <li>Do not misuse access, tools, or information.</li>
        <li>Do not claim affiliation with SHIELD for unauthorized purposes.</li>
        <li>Follow instructions and boundaries set by SHIELD coordinators.</li>
      </ul>

      <h2>6. Confidentiality</h2>
      <p>
        Applicants and contributors may be exposed to internal ideas, discussions,
        or early-stage systems. Such information must not be shared externally
        without explicit permission.
      </p>
      <p>
        SHIELD does not guarantee absolute confidentiality and is not liable for
        disclosures caused by third-party platforms or user negligence.
      </p>

      <h2>7. No Authority or Representation</h2>
      <p>
        Being associated with SHIELD does not grant authority to represent SHIELD
        publicly, provide services, or speak on behalf of the organization unless
        explicitly authorized.
      </p>

      <h2>8. Removal or Termination</h2>
      <p>
        SHIELD reserves the right to remove or restrict any participant at any time
        for misconduct, inactivity, misrepresentation, or violation of these Terms.
      </p>

      <h2>9. No Guarantees</h2>
      <p>
        SHIELD makes no guarantees regarding learning outcomes, project success,
        future roles, employment, or involvement in future divisions.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        These Terms may be updated as SHIELD evolves. Continued participation
        implies acceptance of the latest version.
      </p>

      <h2>11. Governing Jurisdiction</h2>
      <p>
        These Terms shall be governed by applicable laws within India.
      </p>

      <h2>12. Contact</h2>
      <p>
        For questions regarding joining SHIELD, contact:
        <strong> queriesshield@gmail.com</strong>
      </p>

      <footer
        style={{
          marginTop: "40px",
          fontSize: "0.9em",
          color: "#777",
          borderTop: "1px solid #ccc",
          paddingTop: "20px",
        }}
      >
        &copy; 2025 SHIELD Intelligence — All rights reserved.
      </footer>
    </div>
  );
};

export default JoinUsTerms;
