// Logic_Game-main/sw.js

const CACHE_NAME = 'logicgame-cache-v1.4'; // Nueva versión para forzar actualización

// Lista de archivos que componen el "App Shell".
// Todas las rutas son relativas al directorio raíz donde reside sw.js.
const APP_SHELL_RESOURCES = [
    './index.html',
    './manifest.json',
    './css/styles.css',
    
    // Tus scripts JS principales
    './js/main.js',
    './js/conexion_api.js',
    './js/pantalla_principal.js',
    './js/juego.js',
    './js/favoritos.js',
    './js/informacion.js',

    // Iconos PWA (los que están en tu manifest)
    './assets/img/iconos/logicgame-icon-192x192.png',
    './assets/img/iconos/logicgame-icon-512x512.png',

    // Iconos importantes de la UI y otros assets para la carga inicial
    './assets/img/iconos/foninfo.png', 
    './assets/img/iconos/inicio.png',
    './assets/img/iconos/juego.png',
    './assets/img/iconos/favoritos.png',
    './assets/img/iconos/info1.png',
    // './assets/img/iconos/carta.png', // Si es crucial para la primera carga
    
    // También es buena idea cachear la raíz si es distinta de index.html,
    // aunque con start_url: "./index.html", './index.html' es lo principal.
    // './' // Puedes añadir esto si quieres asegurar que la raíz '/' también se cachee
];

self.addEventListener('install', (event) => {
    console.log('[SW] Evento: install. Cacheando App Shell para CACHE_NAME:', CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando App Shell:', APP_SHELL_RESOURCES);
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
    console.log('[SW] Evento: activate. Limpiando cachés antiguas.');
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
                    if (networkResponse && networkResponse.ok && event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            })
            .catch(error => {
                console.error('[SW] Error en fetch:', event.request.url, error);
                // Podrías devolver una página offline aquí si la tienes
                // if (event.request.mode === 'navigate') {
                //   return caches.match('./offline.html'); 
                // }
            })
    );
});