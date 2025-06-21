const CACHE_NAME = 'shield-pwa-cache-v2'; // Change version on updates
const PRECACHE_URLS = ['/', '/index.html'];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(name => name !== CACHE_NAME) // delete old caches
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { pathname } = new URL(event.request.url);

  // Don't intercept assets or manifest or favicon
  if (
    pathname.startsWith('/assets/') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    pathname === '/service-worker.js'
  ) {
    return; // let browser do its thing
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        console.log('[ServiceWorker] Serving cached:', event.request.url);
        return cached;
      }
      return fetch(event.request).catch(() => {
        console.warn('[ServiceWorker] Fetch failed:', event.request.url);
      });
    })
  );
});
