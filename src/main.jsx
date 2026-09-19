import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootEl = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// If prerendered HTML exists, hydrate to preserve static content; otherwise create new root
if (rootEl && rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}

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

