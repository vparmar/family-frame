// Family Photo Frame — Service Worker
// Minimal SW for PWA install + future background push support

const CACHE = 'pf-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Pass through all fetches (no caching strategy needed for this PWA)
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
});

// Handle push notifications from server (future use)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Family Frame', body: '' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'Family Frame', {
      body: data.body || '',
      icon: '/icon-192.png',
    })
  );
});
