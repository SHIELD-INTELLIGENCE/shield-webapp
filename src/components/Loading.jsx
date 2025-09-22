// src/components/Loading.jsx
import React from 'react';

const Loading = () => {
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