import React, { useEffect } from "react";
import { updateSEO } from "../utils/seoUtils";

export default function Privacy() {
  useEffect(() => {
    updateSEO(
      "Privacy Policy | SHIELD Intelligence",
      "Privacy policy for SHIELD Intelligence, including data collection, use, retention, cookies, and international clients.",
      "https://shieldintelligence.in/privacy",
    );

    const metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "robots");
    metaTag.setAttribute("content", "noindex, follow");
    metaTag.setAttribute("id", "noindex-privacy-tag");

    document.head.appendChild(metaTag);

    return () => {
      const existingTag = document.getElementById("noindex-privacy-tag");
      if (existingTag) {
        document.head.removeChild(existingTag);
      }
    };
  }, []);

  return (
    <div className="terms-page privacy-page">
      <h1>Privacy Policy</h1>
      <p className="terms-meta">
        <strong>Effective Date:</strong> June 4, 2026
      </p>

      <h2>1. Who We Are</h2>
      <p>
        SHIELD Intelligence is a technology-focused independent initiative that
        provides software development, digital products, consultation, and
        related services. We are not a registered agency at this time.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following information when you use our website or submit a form:</p>
      <ul>
        <li>Contact details such as name, email, phone, and contact handle.</li>
        <li>Project details, service requests, and application answers.</li>
        <li>Billing details such as country, billing name, and preferred currency.</li>
        <li>Basic technical data such as device, browser, and page activity.</li>
        <li>Cookie and consent preferences.</li>
        <li>We do not sell personal information to third parties.</li>
      </ul>

      <h2>3. Why We Use Data</h2>
      <p>We use personal data to:</p>
      <ul>
        <li>Respond to requests and applications.</li>
        <li>Manage service discussions, delivery, billing, and receipts.</li>
        <li>Maintain records, detect abuse, and improve the website.</li>
        <li>Show consent choices for cookies and related preferences.</li>
      </ul>

      <h2>4. Legal Bases</h2>
      <p>
        Where applicable, we rely on consent, performance of a contract, legitimate
        interests, and compliance with legal obligations.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We use essential cookies and local storage to keep the site working. Non-essential
        cookies or trackers, if added, will only run after you accept them using the cookie
        banner.
      </p>

      <h2>6. Sharing and Processors</h2>
      <p>
        We may share data with service providers that help us operate the site, such as
        Firebase/Google services, hosting, analytics providers, and payment tools.
      </p>

      <h2>7. International Clients</h2>
      <p>
        If you contact us from outside India, your information may be processed in India or
        other countries where our tools or providers operate. We try to use reasonable
        safeguards for cross-border transfers.
      </p>

      <h2>8. Retention</h2>
      <p>
        We keep personal data only as long as needed for the purpose it was collected, for
        legal compliance, or for dispute handling. When it is no longer needed, we delete or
        anonymize it where practical.
      </p>

      <h2>9. Your Rights</h2>
      <p>
        Depending on your location, you may request access, correction, deletion,
        restriction, or a copy of your information. You may also object to certain uses
        where allowed by law.
      </p>

      <h2>10. Security</h2>
      <p>
        We use reasonable technical and organizational safeguards, but no online system is
        perfectly secure.
      </p>

      <h2>11. Children and Teens</h2>
      <p>
        Our community may accept users 13 and above. For users under 18, we may ask for extra
        verification, and some roles or processing may require parental or guardian consent.
      </p>

      <h2>12. Contact</h2>
      <p>
        For privacy questions or requests, contact:
        <strong> privacy@shieldintelligence.in</strong>
      </p>

      <p className="terms-footer">
        This policy may be updated from time to time. Continued use of the site after an
        update means you accept the revised policy.
      </p>
    </div>
  );
}
