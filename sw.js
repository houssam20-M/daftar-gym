// Offline shell for Daftar l-Gym. Bump CACHE when index.html changes so phones pick up the new version.
const CACHE = 'daftar-gym-v18';
const FILES = [
  './',
  'index.html',
  'css/base.css',
  'css/palettes.css',
  'css/components.css',
  'css/tools.css',
  'css/progress.css',
  'css/motion.css',
  'css/food.css',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'views/splash.js',
  'views/setup.js',
  'views/header.js',
  'views/lyoum.js',
  'views/simana.js',
  'views/t9eddom.js',
  'views/makla.js',
  'views/kter.js',
  'views/settings.js',
  'views/nav.js',
  'views/photo-viewer.js',
  'js/store.js',
  'js/lang.js',
  'js/ui.js',
  'js/helpers.js',
  'js/stats.js',
  'js/session.js',
  'js/food.js',
  'js/photos.js',
  'js/report.js',
  'js/boot.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first so an update shows up when online; the cache answers when there is no connection.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
  );
});
