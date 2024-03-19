// service-worker.js

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('blink-reminder-v2').then(cache => {
            return cache.addAll([
                '/index.html',
                '/style.css',
                '/anterior-icon.png',
                './app.js',
                './manifest.json'
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

