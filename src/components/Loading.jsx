// src/components/Loading.jsx
import React, { useEffect } from 'react';

const Loading = () => {
  useEffect(() => {
    // Prevent scrolling when loading screen is visible
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="shield-loading-screen">
      <div className="shield-loading-title">
        <span className="desktop-text">Loading</span>
        <span className="mobile-text">Loading</span>
      </div>
      <div className="shield-spinner"></div>
    </div>
  );
};

export default Loading;