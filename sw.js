const CACHE_NAME = 'calendario-turnos-v2'; // Incrementada la versión para forzar actualización

const urlsToCache = [
  '.', // index.html
  // URLs de librerías externas
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
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Falló el pre-cacheo de archivos:', error);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Borra cachés viejos si el nombre no coincide con el actual
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
        // Devuelve desde el caché si está disponible
        if (response) {
          return response;
        }
        // Si no, ve a la red
        return fetch(event.request);
      }
    )
  );
});
