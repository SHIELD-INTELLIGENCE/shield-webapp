import { text } from 'framer-motion/client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../utils/seoUtils';

function RequestService() {
  const [formLoaded, setFormLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  
  // Handle iframe load success
  const handleIframeLoad = () => {
    setFormLoaded(true);
    setLoadError(false);
    clearTimeout(timeoutId); // Clear the timeout when the iframe loads successfully
  };
  
  // Handle iframe load error
  const handleIframeError = () => {
    setLoadError(true);
    setFormLoaded(false);
  };
  
  // Set a timeout to detect slow or failed loading
  let timeoutId;
  useEffect(() => {
    updateSEO(
      "Request Service | SHIELD Intelligence",
      "Request professional intelligence and security services from SHIELD. Our elite team provides tailored solutions for your security needs."
    );
    timeoutId = setTimeout(() => {
      if (!formLoaded) {
        setLoadTimeout(true);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [formLoaded]);
  
  // Retry loading the form
  const retryLoading = () => {
    setLoadError(false);
    setLoadTimeout(false);
    setFormLoaded(false);
    
    // Force iframe reload by updating the key
    setIframeKey(Date.now());
  };
  
  const [iframeKey, setIframeKey] = useState(Date.now());

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
          <h3 className="shield-error-title">
            {loadTimeout ? "Loading is taking longer than expected" : "Error loading form"}
          </h3>
          <p className="shield-error-message">
            {loadTimeout 
              ? "The form is taking a long time to load. This could be due to a slow internet connection." 
              : "There was a problem loading the form. This might be due to network issues or the form might be temporarily unavailable."}
          </p>
          <div className="shield-error-actions">
            <button className="bw-btn" onClick={retryLoading}>Retry</button>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScGKnCxrLnrbfGXPIcNnKzc0uiFlokapZvXjLFanZ10mvzdAg/viewform" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bw-btn alternate"
            >
              Open Form in New Tab
            </a>
          </div>
        </div>
      )}
      
      <h1>Request a Service</h1>
      
      <div style={{
        padding: "1.5rem",
        backgroundColor: "rgba(252, 211, 77, 0.1)",
        border: "1px solid rgba(252, 211, 77, 0.3)",
        borderRadius: "0.5rem",
        maxWidth: "800px",
        margin: "0 auto 2rem auto"
      }}>
        <h3 style={{ color: "rgba(252, 211, 77, 1)", marginTop: 0 }}>What We Offer:</h3>
        <ul style={{ color: "#ccc", marginBottom: 0 }}>
          <li><strong>Intelligence Services:</strong> Investigation, surveillance, and information gathering</li>
          <li><strong>Software Development:</strong> Custom websites, applications, and digital tools built to your specifications</li>
          <li><strong>Consultation:</strong> Technical advice and project planning</li>
        </ul>
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
        <h2 style={{ color: "rgba(252, 211, 77, 1)", marginBottom: "1rem" }}>Public Software Tools</h2>
        <p style={{ color: "#ccc", marginBottom: "1rem" }}>
          In addition to our intelligence services, SHIELD provides the following public software solutions:
        </p>
        <ul style={{ color: "#ccc", listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "rgba(252, 211, 77, 0.9)" }}>SHIELD Authenticator</strong> - A superior replacement for other authenticators with enhanced security features, multi-device sync, and encrypted cloud backup.
            <br />
            <a href="https://shield-auth.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(252, 211, 77, 0.7)", fontSize: "0.9rem" }}>Visit →</a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "rgba(252, 211, 77, 0.9)" }}>AIDIARY</strong> - Personal AI-powered diary and journaling application for secure journaling.
            <br />
            <a href="https://aidiary.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(252, 211, 77, 0.7)", fontSize: "0.9rem" }}>Visit →</a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "rgba(252, 211, 77, 0.9)" }}>NotesVault</strong> - Simple note-taking application with advanced features.
            <br />
            <a href="https://nv.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(252, 211, 77, 0.7)", fontSize: "0.9rem" }}>Visit →</a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "rgba(252, 211, 77, 0.9)" }}>Bookmarky</strong> - Simple bookmark manager to organize and sync your favorite web resources.
            <br />
            <a href="https://bookmarky.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(252, 211, 77, 0.7)", fontSize: "0.9rem" }}>Visit →</a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "rgba(252, 211, 77, 0.9)" }}>SHIELD Mobile App</strong> - Download our official Android application for mobile access to SHIELD services.
            <br />
            <a href="https://download.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(252, 211, 77, 0.7)", fontSize: "0.9rem" }}>Download APK →</a>
          </li>
        </ul>
      </div>
            <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#caa94c' }}>
        Please read our <Link to="/terms">Terms & Conditions</Link> before requesting a service.
      </p>
      
    </div>
  );
}

export default RequestService;
