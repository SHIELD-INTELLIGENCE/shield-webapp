import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HireAgent() {
  const [formLoaded, setFormLoaded] = useState(false);

  const handleIframeLoad = () => {
    setFormLoaded(true);
  };

  return (
    <div>
      {!formLoaded && (
        <div className="shield-loading-screen">
          <div className="shield-loading-title">
            <span className="desktop-text">Loading</span>
            <span className="mobile-text">Loading</span>
          </div>
          <div className="shield-spinner"></div>
        </div>
      )}
      
      <h1>Hire an Agent</h1>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLScGKnCxrLnrbfGXPIcNnKzc0uiFlokapZvXjLFanZ10mvzdAg/viewform?embedded=true" 
        width="100%" 
        height="2130" 
        frameBorder="0" 
        marginHeight="0" 
        marginWidth="0"
        onLoad={handleIframeLoad}
        style={{ display: formLoaded ? 'block' : 'none' }}
      >
        Loading…
      </iframe>

      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Please read our <Link to="/terms">Terms & Conditions</Link> before hiring an agent.
      </p>
    </div>
  );
}

export default HireAgent;
