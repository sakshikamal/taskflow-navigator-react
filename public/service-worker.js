
// Cache name with version
const CACHE_NAME = 'calroute-cache-v1';

// List of URLs to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/uploads/logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - caches assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - respond with cache then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request to use it in multiple places
        const fetchRequest = event.request.clone();
        
        // Try to fetch from network
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to use it in multiple places
            const responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        ).catch(() => {
          // Offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
