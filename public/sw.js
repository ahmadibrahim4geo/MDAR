/**
 * مدار – MDAR | Service Worker for Offline Execution & Asset Caching (PWA)
 * Enables 100% offline functionality in field environments without internet access.
 */

const CACHE_NAME = "mdar-cache-v1.0.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./downloads/MDAR_Converter.xlsx"
];

// Install Event: pre-cache core application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[MDAR SW] Pre-caching core application shell and companion workbook");
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clean up older cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[MDAR SW] Removing obsolete cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache First, falling back to network
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic assets (chunks, styles)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === "basic" || event.request.url.startsWith(self.location.origin))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback to index.html if navigating
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
