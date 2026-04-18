// DogWalking Service Worker v2.0.0
const CACHE_NAME = 'dogwalking-v2';
const STATIC_CACHE = 'dogwalking-static-v2';
const DYNAMIC_CACHE = 'dogwalking-dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api') || url.hostname.includes('supabase')) return;

  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request) || caches.match('/'))
    );
    return;
  }

  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            return response;
          });
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Push notification event - enhanced with message support
self.addEventListener('push', (event) => {
  let data = { title: 'Open GO', body: 'Nouvelle notification', type: 'general' };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  // Different icons/actions based on notification type
  let icon = '/icons/icon-192x192.png';
  let badge = '/icons/icon-72x72.png';
  let actions = [
    { action: 'open', title: 'Ouvrir' },
    { action: 'close', title: 'Fermer' }
  ];

  if (data.type === 'message') {
    actions = [
      { action: 'reply', title: '💬 Répondre' },
      { action: 'close', title: 'Fermer' }
    ];
  } else if (data.type === 'booking') {
    actions = [
      { action: 'open', title: '📋 Voir' },
      { action: 'close', title: 'Fermer' }
    ];
  } else if (data.type === 'mission') {
    actions = [
      { action: 'open', title: '🐾 Suivre' },
      { action: 'close', title: 'Fermer' }
    ];
  }

  const options = {
    body: data.body,
    icon,
    badge,
    vibrate: [100, 50, 100],
    tag: data.type || 'notification',
    renotify: true,
    data: {
      url: data.url || '/',
      type: data.type,
      dateOfArrival: Date.now()
    },
    actions
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  let urlToOpen = event.notification.data?.url || '/';

  // Handle reply action - open messages tab
  if (event.action === 'reply') {
    urlToOpen = '/dashboard?tab=messages';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});

// Background sync for offline messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'send-message') {
    event.waitUntil(syncMessages());
  }
  if (event.tag === 'sync-gps') {
    event.waitUntil(syncGPSData());
  }
});

async function syncMessages() {
  try {
    const cache = await caches.open('pending-messages');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        // Re-send message via fetch to Supabase
        await fetch(data.url, {
          method: 'POST',
          headers: data.headers,
          body: JSON.stringify(data.body)
        });
        await cache.delete(request);
      }
    }
  } catch (e) {
    console.error('[SW] Sync messages failed:', e);
  }
}

async function syncGPSData() {
  try {
    const cache = await caches.open('pending-gps');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch(data.url, {
          method: 'PATCH',
          headers: data.headers,
          body: JSON.stringify(data.body)
        });
        await cache.delete(request);
      }
    }
  } catch (e) {
    console.error('[SW] Sync GPS failed:', e);
  }
}
