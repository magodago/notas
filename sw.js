/* Service worker: la app tiene que funcionar en modo avión, en escena.
   HTML: red primero (para recibir cambios), caché como respaldo.
   Resto: caché primero. */
const CACHE = 'indice-v4';
const ARCHIVOS = [
  './notas.html',
  './calculadora.html',
  './listas/famosos.js',
  './listas/peliculas.js',
  './listas/objetos.js',
  './listas/musicos.js',
  './notas.webmanifest',
  './calculadora.webmanifest',
  './notas-icon.png',
  './calculadora-icon.png'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;

  const esHtml = peticion.mode === 'navigate' || /\.html$/i.test(new URL(peticion.url).pathname);

  if (esHtml) {
    evento.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((c) => c.put(peticion, copia)).catch(() => {});
          return respuesta;
        })
        .catch(() => caches.match(peticion).then((r) => r || caches.match('./notas.html')))
    );
    return;
  }

  evento.respondWith(
    caches.match(peticion).then((cacheado) => cacheado || fetch(peticion).then((respuesta) => {
      const copia = respuesta.clone();
      caches.open(CACHE).then((c) => c.put(peticion, copia)).catch(() => {});
      return respuesta;
    }).catch(() => cacheado))
  );
});
