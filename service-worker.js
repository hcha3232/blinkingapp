// service-worker.js

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('blink-reminder-v1').then(cache => {
            return cache.addAll([
                '/index.html',
                '/app.js',
                '/style.css',
                '/icon.png'
                // Add more files to cache as needed
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
