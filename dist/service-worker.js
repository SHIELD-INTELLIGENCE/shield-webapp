// public/service-worker.js
const CACHE_NAME = `shield-pwa-cache-${__BUILD_TIMESTAMP__}`;
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
          .filter(name => name !== CACHE_NAME) // Delete old caches
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { pathname } = new URL(event.request.url);

  // Bypass assets and core files
  if (
    pathname.startsWith('/assets/') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    pathname === '/service-worker.js'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => {
        console.warn('[ServiceWorker] Fetch failed:', event.request.url);
      });
    })
  );
});
