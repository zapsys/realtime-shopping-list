// public/service-worker.js

/* eslint-disable no-restricted-globals */

// Este código se baseia no service worker padrão do Create React App.
// Ele lida com o cache de recursos para que o PWA funcione offline.

const CACHE_NAME = 'my-app-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  // Adicione outros recursos estáticos que você queira cachear aqui
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});