import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../utils/seoUtils';

function RequestService() {
  const [formLoaded, setFormLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());

  let timeoutId;

  const handleIframeLoad = () => {
    setFormLoaded(true);
    setLoadError(false);
    clearTimeout(timeoutId);
  };

  const handleIframeError = () => {
    setLoadError(true);
    setFormLoaded(false);
  };

  useEffect(() => {
    updateSEO(
      "Request a Service | SHIELD Intelligence",
      "Request secure software development, digital products, and custom technology solutions from SHIELD Intelligence."
    );

    timeoutId = setTimeout(() => {
      if (!formLoaded) {
        setLoadTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [formLoaded]);

  const retryLoading = () => {
    setLoadError(false);
    setLoadTimeout(false);
    setFormLoaded(false);
    setIframeKey(Date.now());
  };

  return (
    <div>
      {!formLoaded && !loadError && !loadTimeout && (
        <div className="shield-loading-screen">
          <div className="shield-loading-title">
            <span className="desktop-text">Loading</span>
            <span className="mobile-text">Loading</span>
          </div>
          <div className="shield-spinner"></div>
        </div>
      )}

      {(loadError || loadTimeout) && (
        <div className="shield-error-container" role="alert">
          <h3 className="shield-error-title" style={{ fontSize: "clamp(1.1rem, 4vw, 1.5rem)" }}>
            {loadTimeout ? "Loading is taking longer than expected" : "Unable to load form"}
          </h3>
          <p className="shield-error-message" style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)" }}>
            {loadTimeout
              ? "The form is taking longer to load. This may be due to a slow internet connection or browser restrictions."
              : "The form couldn't be loaded. This might be due to browser security settings, ad blockers, or network restrictions."}
          </p>
          <p className="shield-error-message" style={{ marginTop: "0.5rem", fontSize: "clamp(0.85rem, 2.5vw, 0.9rem)" }}>
            If you're using a strict browser or privacy extension, try opening the form in a new tab instead.
          </p>
          <div className="shield-error-actions">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScGKnCxrLnrbfGXPIcNnKzc0uiFlokapZvXjLFanZ10mvzdAg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn"
              style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)" }}
            >
              Open Form in New Tab
            </a>
            <button className="bw-btn outline" onClick={retryLoading} style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)" }}>
              Try Again
            </button>
          </div>
        </div>
      )}

      <h1 style={{ padding: '0 1rem' }}>Request a Service</h1>

      <div style={{
        padding: "1.5rem",
        backgroundColor: "rgba(252, 211, 77, 0.1)",
        border: "1px solid rgba(252, 211, 77, 0.3)",
        borderRadius: "0.5rem",
        maxWidth: "800px",
        margin: "0 auto 2rem auto"
      }}>
        <h3 style={{ color: "rgba(252, 211, 77, 1)", marginTop: 0 }}>
          Current Services
        </h3>

        <ul style={{ color: "#ccc", marginBottom: 0 }}>
          <li>
            <strong>Software Development:</strong> Custom websites, web applications,
            internal dashboards, and purpose-built digital tools.
          </li>
          <li>
            <strong>Security-Oriented Products:</strong> Integration and support for
            privacy-focused tools, including authentication and access-controlled systems.
          </li>
          <li>
            <strong>Technical Consultation:</strong> Project planning, system design,
            and implementation guidance.
          </li>
        </ul>

        <p style={{ color: "#ccc", marginTop: "1rem", fontSize: "0.95rem" }}>
          All services listed above are currently active and available.
        </p>
      </div>

      <iframe
        key={iframeKey}
        src="https://docs.google.com/forms/d/e/1FAIpQLScGKnCxrLnrbfGXPIcNnKzc0uiFlokapZvXjLFanZ10mvzdAg/viewform?embedded=true"
        width="100%"
        height="2130"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ display: formLoaded ? 'block' : 'none' }}
        title="Request a SHIELD Service Form"
        aria-label="Request a SHIELD Service Form"
      >
        Loading…
      </iframe>

      <div style={{
        marginTop: "2rem",
        padding: "1.5rem",
        backgroundColor: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(252, 211, 77, 0.3)",
        borderRadius: "0.5rem",
        maxWidth: "800px",
        margin: "2rem auto"
      }}>
        <h2 style={{ color: "rgba(252, 211, 77, 1)", marginBottom: "1rem" }}>
          Future Capabilities
        </h2>
        <p style={{ color: "#ccc" }}>
          SHIELD Intelligence is designed for long-term expansion. Future offerings may
          include physical protection services and private intelligence operations.
          These capabilities are not currently active and are not offered through this form.
        </p>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#caa94c' }}>
        Please read our <Link to="/terms">Terms & Conditions</Link> before requesting a service.
      </p>
    </div>
  );
}

export default RequestService;
