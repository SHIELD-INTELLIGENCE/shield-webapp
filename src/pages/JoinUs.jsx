import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function JoinUs() {
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
              href="https://docs.google.com/forms/d/e/1FAIpQLSe_t5fBMb7zQD24vRK0hFGqpsVxjf_tsHGH9_tg39ay2mOiRg/viewform" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bw-btn alternate"
            >
              Open Form in New Tab
            </a>
          </div>
        </div>
      )}
      
      <h1>Join SHIELD</h1>
      
      <div style={{
        padding: "1.5rem",
        backgroundColor: "rgba(252, 211, 77, 0.1)",
        border: "1px solid rgba(252, 211, 77, 0.3)",
        borderRadius: "0.5rem",
        maxWidth: "800px",
        margin: "0 auto 2rem auto"
      }}>
        <h2 style={{ color: "rgba(252, 211, 77, 1)", marginTop: 0, fontSize: "1.5rem" }}>Why Join SHIELD?</h2>
        <p style={{ color: "#ccc", lineHeight: "1.8", fontSize: "1.05rem" }}>
          Become part of an elite organization that combines intelligence operations with cutting-edge technology. 
          At SHIELD, you'll work alongside dedicated professionals who value integrity, innovation, and excellence.
        </p>
        
        <h3 style={{ color: "rgba(252, 211, 77, 0.9)", marginTop: "1.5rem", fontSize: "1.2rem" }}>Opportunities at SHIELD:</h3>
        <ul style={{ color: "#ccc", lineHeight: "1.8", fontSize: "1.05rem" }}>
          <li><strong>Intelligence Operations:</strong> Work on investigations, surveillance, and information gathering missions</li>
          <li><strong>Software Development:</strong> Build innovative applications, websites, and digital tools that empower users worldwide</li>
          <li><strong>Security & Protection:</strong> Provide high-level security services and strategic planning</li>
          <li><strong>Research & Development:</strong> Contribute to new technologies and methodologies</li>
        </ul>
        
        <p style={{ color: "#ccc", lineHeight: "1.8", fontSize: "1.05rem", marginTop: "1rem" }}>
          Whether you're skilled in intelligence work, software engineering, security operations, or strategic analysis, 
          SHIELD offers a unique environment where your talents will be valued and your contributions will make a real difference. 
          We're building the future of private intelligence and technology solutions — and we want you to be part of it.
        </p>
        
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          backgroundColor: "rgba(0,0,0,0.3)", 
          borderLeft: "3px solid rgba(252, 211, 77, 0.8)",
          borderRadius: "0.25rem"
        }}>
          <p style={{ color: "#ccc", margin: 0, fontSize: "1rem" }}>
            <strong style={{ color: "rgba(252, 211, 77, 1)" }}>What We Look For:</strong> Dedication, discretion, technical excellence, 
            strategic thinking, and a commitment to our core values of integrity, confidentiality, excellence, vigilance, and innovation.
          </p>
        </div>
      </div>
      
      <iframe 
        key={iframeKey}
        src="https://docs.google.com/forms/d/e/1FAIpQLSe_t5fBMb7zQD24vRK0hFGqpsVxjf_tsHGH9_tg39ay2mOiRg/viewform?embedded=true" 
        width="100%" 
        height="1670" 
        frameBorder="0" 
        marginHeight="0" 
        marginWidth="0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ display: formLoaded ? 'block' : 'none' }}
        title="Join SHIELD Application Form"
        aria-label="Join SHIELD Application Form"
      >
        Loading…
      </iframe>

      <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#caa94c' }}>
        Please read our <Link to="/join-us-terms">Terms & Conditions for Joining SHIELD</Link> before applying.
      </p>
    </div>
  );
}

export default JoinUs;
