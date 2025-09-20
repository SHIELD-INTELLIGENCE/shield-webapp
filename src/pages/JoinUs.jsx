import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function JoinUs() {
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
      
      <h1>Join SHIELD</h1>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSe_t5fBMb7zQD24vRK0hFGqpsVxjf_tsHGH9_tg39ay2mOiRg/viewform?embedded=true" 
        width="100%" 
        height="1670" 
        frameBorder="0" 
        marginHeight="0" 
        marginWidth="0"
        onLoad={handleIframeLoad}
        style={{ display: formLoaded ? 'block' : 'none' }}
      >
        Loading…
      </iframe>

      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Please read our <Link to="/join-us-terms">Terms & Conditions for Joining SHIELD</Link> before applying.
      </p>
    </div>
  );
}

export default JoinUs;
