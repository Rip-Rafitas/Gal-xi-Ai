const CACHE_NAME = 'galaxy-ai-cache-v1';
const FILES_TO_CACHE = [
  './GalaxyAI-Web-1.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Estratégia: tenta a rede primeiro (para ter respostas/API atualizadas),
  // e usa o cache como reserva se estiver offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
