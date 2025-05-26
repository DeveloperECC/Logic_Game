// sw.js (ubicado en la raíz de la rama 'pwa' de tu repo 'LOGIC_GAME')
// Se servirá desde https://developerecc.github.io/LOGIC_GAME/sw.js
// Su scope será https://developerecc.github.io/LOGIC_GAME/

const CACHE_NAME = 'logicgame-cache-v1.3'; // Incrementa versión para forzar actualización

// Estas rutas son relativas al scope del Service Worker.
// Si sw.js está en /LOGIC_GAME/sw.js y el scope es /LOGIC_GAME/,
// 'index.html' se refiere a /LOGIC_GAME/index.html.
// './' o '/' se refieren a /LOGIC_GAME/.
const APP_SHELL_RESOURCES = [
    './',                       // Cachea la raíz del scope (/LOGIC_GAME/)
    'index.html',               // Cachea /LOGIC_GAME/index.html
    'css/styles.css',           // Cachea /LOGIC_GAME/css/styles.css
    'manifest.json',            // Cachea /LOGIC_GAME/manifest.json (si está en la raíz de la rama)

    'js/main.js',
    'js/conexion_api.js',
    'js/pantalla_principal.js',
    'js/juego.js',
    'js/favoritos.js',
    'js/informacion.js',

    'assets/img/iconos/logicgame-icon-192x192.png',
    'assets/img/iconos/logicgame-icon-512x512.png',
    'assets/img/iconos/foninfo.png',
    'assets/img/iconos/inicio.png',
    'assets/img/iconos/juego.png',
    'assets/img/iconos/favoritos.png',
    'assets/img/iconos/info1.png',
];

self.addEventListener('install', (event) => {
    console.log('[SW] Evento: install. Cache Name:', CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando App Shell:', APP_SHELL_RESOURCES.map(url => new URL(url, self.location.origin + self.registration.scope).pathname));
                return cache.addAll(APP_SHELL_RESOURCES);
            })
            .catch(error => {
                console.error('[SW] Falló cache.addAll durante la instalación:', error);
            })
            .then(() => {
                console.log('[SW] App Shell cacheado. Forzando activación con skipWaiting().');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Evento: activate. Cache Name:', CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Borrando cache antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Cachés antiguas limpiadas. Reclamando clientes...');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('deckofcardsapi.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((networkResponse) => {
                    // Opcional: Cacheo dinámico
                    // if (networkResponse.ok && event.request.method === 'GET' &&
                    //     (event.request.url.startsWith(self.location.origin + self.registration.scope) ||
                    //      event.request.url.startsWith(self.location.origin + '/LOGIC_GAME/'))) { // Asegurar que solo cacheamos recursos propios
                    //   const responseToCache = networkResponse.clone();
                    //   caches.open(CACHE_NAME).then(cache => {
                    //     console.log('[SW] Cacheando dinámicamente:', event.request.url);
                    //     cache.put(event.request, responseToCache);
                    //   });
                    // }
                    return networkResponse;
                });
            })
            .catch(error => {
                console.error('[SW] Error en fetch:', event.request.url, error);
                // Considera servir una página offline genérica si tienes una
                // return caches.match('/LOGIC_GAME/offline.html');
            })
    );
});