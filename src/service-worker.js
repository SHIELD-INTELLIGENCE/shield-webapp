self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open('shield-pwa-cache').then((cache) => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
