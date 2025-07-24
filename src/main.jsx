import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker only once
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration);

        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('[SW] New version available. Reloading...');
              window.location.reload();
            }
          };
        };
      })
      .catch((err) => console.error('[SW] Registration failed:', err));
  });
}

