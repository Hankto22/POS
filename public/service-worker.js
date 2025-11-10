self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('thrift-pos-cache').then(cache =>
      cache.addAll(['/', '/index.html', '/manifest.json'])
    )
  );
});

self.addEventListener('fetch', e => {
  // Don't cache API requests
  if (e.request.url.includes('/api/')) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
