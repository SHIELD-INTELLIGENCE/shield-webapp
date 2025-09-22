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

      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Please read our <Link to="/join-us-terms">Terms & Conditions for Joining SHIELD</Link> before applying.
      </p>
    </div>
  );
}

export default JoinUs;
