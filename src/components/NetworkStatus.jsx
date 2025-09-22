import React, { useState, useEffect } from 'react';
import { detectNetworkChanges } from '../utils/networkUtils';

/**
 * Component to display network status and notify users when they're offline
 */
function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Handle online status
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      
      // Hide the "online" banner after 3 seconds
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    };

    // Handle offline status
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    // Set up network status detection
    const cleanupListener = detectNetworkChanges(handleOnline, handleOffline);

    // Clean up event listeners on unmount
    return cleanupListener;
  }, []);

  // Don't render anything if everything is normal (online and no banner)
  if (isOnline && !showBanner) {
    return null;
  }

  return (
    <div 
      className={`shield-network-status ${isOnline ? 'online' : 'offline'}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="shield-network-status-content">
        {isOnline ? (
          <>
            <span className="status-icon online">✓</span>
            <span>You're back online</span>
          </>
        ) : (
          <>
            <span className="status-icon offline">!</span>
            <span>You're offline. Some features may be unavailable.</span>
          </>
        )}
        {showBanner && isOnline && (
          <button 
            className="close-btn" 
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default NetworkStatus;