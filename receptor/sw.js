/* Shell del receptor. Red primero: el puente nunca se cachea. */
const CACHE = 'receptor-v9';
const SHELL = ['./index.html', './receptor.webmanifest', './silencio.mp4'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.hostname.endsWith('workers.dev')) return;      // el puente, siempre en vivo
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.ok && url.origin === location.origin) {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {});
      }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
