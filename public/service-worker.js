self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open('shield-pwa-cache').then((cache) => {
      // Cache only your app shell and any static files
      return cache.addAll(['/', '/index.html']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Bypass the service worker for assets
  if (url.pathname.startsWith('/assets/')) {
    return; // Don't respond, let the network take it
  }

  // Otherwise serve from cache or fetch
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
