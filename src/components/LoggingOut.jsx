// src/components/LoggingOut.jsx
import React from 'react';

const LoggingOut = () => {
  return (
    <div className="shield-logout-screen">
      <div className="shield-logout-title">
        <span className="desktop-text">Logging Out</span>
        <span className="mobile-text">Logging Out</span>
      </div>
      <div className="shield-logout-spinner"></div>
    </div>
  );
};

export default LoggingOut;
