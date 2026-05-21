// src/pages/Terms.jsx
import React, { useEffect } from "react";
import { updateSEO } from "../utils/seoUtils";

const Terms = () => {
  useEffect(() => {
    updateSEO(
      "Terms and Conditions | SHIELD Intelligence",
      "Terms and conditions governing service requests and use of SHIELD Intelligence platforms.",
    );

    const metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "robots");
    metaTag.setAttribute("content", "noindex, follow");
    metaTag.setAttribute("id", "noindex-terms-tag");

    document.head.appendChild(metaTag);

    return () => {
      const existingTag = document.getElementById("noindex-terms-tag");
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
        background: "#1a1a1a",
        color: "#e0e0e0",
        minHeight: "100vh",
      }}
    >
      <style>{`.terms-page p, .terms-page li { color: #e0e0e0 !important; } .terms-page h1, .terms-page h2 { color: #ffffff; }`}</style>

      <h1>Terms and Conditions</h1>
      <p>
        <strong>Effective Date:</strong> January 18, 2026
      </p>

      <h2>1. Introduction</h2>
      <p>
        SHIELD Intelligence (“SHIELD”) is an independent, technology-focused
        initiative engaged in software development, digital products, and
        technical consultation. SHIELD is currently an independent,
        non-registered entity. All services are provided on a best-effort basis
        and do not constitute formal legal, corporate, or contractual
        obligations unless explicitly agreed.
      </p>
      <p>
        These Terms and Conditions govern all service requests, communications,
        and interactions made through SHIELD platforms, including the “Request a
        Service” form.
      </p>

      <h2>2. Scope of Services</h2>
      <p>
        SHIELD currently provides technology-related services only. These
        include software development, digital product development, and technical
        consultation.
      </p>
      <p>
        Physical protection services and private intelligence operations are
        planned future capabilities and are not currently offered, advertised,
        or contractually available. Any mention of such services is
        informational only.
      </p>

      <h2>3. Voluntary Requests</h2>
      <p>
        Submitting a service request to SHIELD is voluntary. Submission of a
        request does not guarantee acceptance, response, or execution of the
        requested service.
      </p>
      <p>
        SHIELD reserves the right to decline, modify, or discontinue any request
        at its discretion.
      </p>

      <h2>4. No Professional or Legal Liability</h2>
      <p>
        SHIELD does not provide legal, financial, law-enforcement, or emergency
        services. Any guidance or output provided is based on technical judgment
        and best effort only.
      </p>
      <p>
        SHIELD and its members are not liable for any direct or indirect
        outcomes resulting from the use, misuse, or interpretation of services
        or information provided.
      </p>

      <h2>5. User Responsibilities</h2>
      <ul>
        <li>
          Provide accurate and truthful information when submitting requests.
        </li>
        <li>Do not submit illegal, unethical, or malicious requests.</li>
        <li>
          Do not submit passwords, OTPs, private keys, or sensitive credentials.
        </li>
        <li>Respect communication boundaries and response timelines.</li>
        <li>
          Understand that deliverables depend on scope, feasibility, and
          agreement.
        </li>
      </ul>

      <h2>6. Confidentiality & Information Handling</h2>
      <p>
        SHIELD will handle submitted information responsibly and limit access
        internally on a need-to-know basis.
      </p>
      <p>
        However, SHIELD does not guarantee absolute confidentiality and is not
        responsible for data exposure caused by user error, third-party
        platforms (such as Google Forms), or external factors beyond reasonable
        control.
      </p>

      <h2>7. Payments & Pricing</h2>
      <p>
        Any pricing, budget discussions, or payments (if applicable) are handled
        separately and only after mutual agreement. Submission of a form does
        not constitute a binding contract or financial obligation.
      </p>
      <h2>8. Service Plans, Billing & Enforcement</h2>

      <p>
        SHIELD services operate on a subscription-based model where applicable.
        Each service request, once accepted and activated, follows a defined
        billing cycle (e.g., monthly or quarterly) as agreed.
      </p>

      <p>
        Billing periods are tracked internally by SHIELD. Clients are
        responsible for ensuring timely payment before the end of each billing
        cycle.
      </p>

      <p>
        If SHIELD is responsible for building a website or product from scratch,
        the first billing cycle may be offered free of charge. This benefit
        applies only to projects built entirely by SHIELD and does not apply to
        pre-existing or third-party projects provided by the client.
      </p>

      <p>
        Failure to renew or complete payment before the end of the billing cycle
        may result in service interruption. SHIELD reserves the right to pause,
        restrict, or disable access to the delivered service (including
        websites, hosting, or systems) until payment is completed.
      </p>

      <p>
        Any such action is considered a standard operational measure and not a
        breach of service.
      </p>

      <p>
        Invoices generated by SHIELD are internal billing records for tracking
        and communication purposes. These invoices are not legal tax invoices
        and do not represent a registered business entity unless explicitly
        stated.
      </p>

      <p>
        SHIELD retains full control over service continuation, pausing, or
        resumption based on billing status and operational judgment.
      </p>
      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, SHIELD disclaims all
        warranties, express or implied. SHIELD shall not be liable for damages,
        losses, or disputes arising from the use or inability to use services.
      </p>

      <h2>10. Intellectual Property</h2>
      <p>
        All original code, designs, documentation, and materials produced by
        SHIELD remain the intellectual property of SHIELD unless otherwise
        agreed in writing.
      </p>

      <h2>11. Termination & Refusal of Service</h2>
      <p>
        SHIELD reserves the right to refuse service, terminate communication, or
        restrict access for any request that violates these Terms or poses
        legal, ethical, or operational risk.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        SHIELD may update these Terms at any time. Continued use of SHIELD
        platforms after changes implies acceptance of the revised Terms.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms shall be governed in accordance with applicable local laws
        in India.
      </p>

      <h2>14. Contact</h2>
      <p>
        For questions regarding these Terms, contact:
        <strong> queriesshield@gmail.com</strong>
      </p>

      <footer className="terms-footer">
        &copy; 2025 SHIELD Intelligence — All rights reserved.
        <br />
        This website and its content are independently maintained.
      </footer>
    </div>
  );
};

export default Terms;
