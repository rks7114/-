const CACHE_NAME = 'jamgong-mobile-v5';
const URLS = [
  './',
  './index.html',
  './404.html',
  './admin-secretary.html',
  './safe-housing.html',
  './asset-guide.html',
  './emergency-rescue.html',
  './digital-help.html',
  './roadmaster.html',
  './checklist-generator.html',
  './practical-conversation.html',
  './homeland-connect.html',
  './future-planning.html',
  './backup.html',
  './style.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const network = await fetch(event.request);
      const clone = network.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      if (network.status === 404 && event.request.mode === 'navigate') {
        return caches.match('./404.html') || network;
      }
      return network;
    } catch (_) {
      if (event.request.mode === 'navigate') {
        return caches.match('./404.html') || caches.match('./index.html');
      }
      return caches.match('./index.html');
    }
  })());
});
