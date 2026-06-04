import React, { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState(
    () => localStorage.getItem("shield_cookie_consent") || null,
  );

  useEffect(() => {
    if (!choice) setVisible(true);
    // expose consent to global scripts
    window.__shield_cookie_consent = choice;
  }, [choice]);

  const accept = () => {
    localStorage.setItem("shield_cookie_consent", "accepted");
    window.__shield_cookie_consent = "accepted";
    setChoice("accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("shield_cookie_consent", "declined");
    window.__shield_cookie_consent = "declined";
    setChoice("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-copy">
          <div className="cookie-consent-title">Cookie Preferences</div>
          <div className="cookie-consent-text">
            We use essential cookies to run the site. Non-essential cookies (analytics, tracking)
            are used only with your consent.
          </div>
        </div>
        <div className="cookie-consent-actions">
          <button className="bw-btn" onClick={accept}>
            Accept
          </button>
          <button className="bw-btn outline" onClick={decline}>
            Decline
          </button>
          <a className="cookie-consent-link" href="/privacy">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
