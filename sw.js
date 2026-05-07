// Service Worker for Ontario Parks App
const CACHE_NAME = 'ontario-parks-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/all-parks.html',
  '/park-details.html',
  '/booking.html',
  '/gear-list.html',
  '/review-reservation.html',
  '/shopping-cart.html',
  '/acknowledge.html',
  '/css/styles.css',
  '/css/all-parks.css',
  '/css/booking.css',
  '/css/park-details.css',
  '/css/gear-list.css',
  '/css/review-reservation.css',
  '/js/script.js',
  '/js/all-parks.js',
  '/js/booking.js',
  '/js/park-details.js',
  '/js/parks-api.js',
  '/js/image-config.js',
  '/js/image-manager.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Try network request
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page if available
            return caches.match('/index.html');
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
