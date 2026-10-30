// Eaglesight offline support: network-first for pages (falling back to the cached
// copy, then /offline), cache-first for static assets and images.
const VERSION = 'esds-v1';
const PRECACHE = ['/offline', '/', '/incident-response', '/contact', '/images/eagle_logo_clean.png', '/images/eagle_mark.png'];

// Cache each file on its own so one failure never blocks installation.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then(async (cache) => {
      for (const url of PRECACHE) {
        try {
          const res = await fetch(url, { cache: 'reload' });
          if (res.ok) await cache.put(url, res);
        } catch {}
      }
      await self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('/offline')))
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/images/') || url.pathname.startsWith('/_next/image')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
  }
});
