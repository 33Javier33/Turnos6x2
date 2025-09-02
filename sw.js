const CACHE_NAME = 'calendario-turnos-v3'; // Incrementada la versión para forzar actualización

const urlsToCache = [
  '.', // index.html
  'manifest.json',
  'icons/icon-192x192.svg',
  'icons/icon-512x512.svg',
  'icons/icon-192x192.png', // Opcional si los conviertes
  'icons/icon-512x512.png', // Opcional si los conviertes
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto y listo para guardar archivos.');
        // Usamos addAll para asegurar que si falla uno, falla toda la instalación.
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`No se pudo cachear: ${url}`, err);
            });
          })
        );
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('calendario-turnos-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});