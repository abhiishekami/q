const CACHE_NAME = "verisma-tracker-cache-v1";
const URLS_TO_CACHE = [
  "index.html",
  "manifest.json"
  // If you add any local CSS/JS files, list them here as well. For example:
  // "styles.css",
  // "app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((resp) => resp || fetch(event.request))
      .catch(() => fetch(event.request))
  );
});
