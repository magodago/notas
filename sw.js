/* Service worker: la app tiene que funcionar en modo avión, en escena. */
const CACHE = 'indice-v1';
const ARCHIVOS = [
  './notas.html',
  './calculadora.html',
  './data.js',
  './notas.webmanifest',
  './calculadora.webmanifest'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') return;
  evento.respondWith(
    caches.match(evento.request, { ignoreSearch: true }).then((guardado) => {
      if (guardado) return guardado;
      return fetch(evento.request).then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((c) => c.put(evento.request, copia)).catch(() => {});
        return respuesta;
      }).catch(() => caches.match('./notas.html'));
    })
  );
});
