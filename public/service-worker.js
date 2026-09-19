const CACHE_VERSION = 'v2';
const CACHE_NAME = `shield-pwa-cache-${CACHE_VERSION}`;
const PRECACHE_URLS = ['/', '/index.html'];
// Crawler-critical files must never be served stale from SW cache
const BYPASS_SW_PATHS = new Set(['/robots.txt', '/sitemap.xml', '/llms.txt', '/404.html']);

// Clean up old caches on activate, keep current version
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  return self.clients.claim();
});

// Pre-cache shell
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Fetch logic: network first, fallback to cache — but bypass for crawler-critical files and 404s
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Bypass service worker for crawler-critical files — always go to network, never cache
  if (BYPASS_SW_PATHS.has(url.pathname)) {
    return;
  }

  // For HTML documents (navigation), use network-first with no stale reuse for 404
  const isDocument = event.request.destination === 'document' || event.request.headers.get('accept')?.includes('text/html');

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Do not cache non-200 (e.g., 404.html served with 404 status) and do not cache crawler HTML as immutable
        if (response.status === 200 && !isDocument) {
          // Only cache non-document assets (JS/CSS/images) — HTML is served network-first via Netlify max-age=0
          // For hashed assets, Netlify already serves immutable caching via _headers
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        // For documents, always return fresh network response (do not put in cache) to avoid stale HTML after deploy
        return response;
      })
      .catch(() => {
        // On network failure, fallback to cached document or precached shell
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Fallback to precached root for navigation offline
          if (isDocument) return caches.match('/index.html');
          return undefined;
        });
      })
  );
});
