// Logic_Game-main/sw.js

const CACHE_NAME = 'logicgame-cache-v1.1'; // Incrementa la 'vX.X' si cambias los archivos cacheados

// Lista de archivos que componen el "App Shell" y son cruciales para la carga inicial.
// Asegúrate de que todas las rutas sean correctas desde la raíz de tu sitio.
const APP_SHELL_RESOURCES = [
    '/',                        // Cachea la raíz (generalmente tu index.html)
    'index.html',
    'css/styles.css',
    'manifest.json',            // El manifest también se puede cachear

    // Tus scripts JS principales
    'js/main.js',               // Asumiendo que este es tu script principal que carga otros
    'js/conexion_api.js',
    'js/pantalla_principal.js',
    'js/juego.js',
    'js/favoritos.js',
    'js/informacion.js',

    // Iconos PWA (los que están en tu manifest)
    'assets/img/iconos/logicgame-icon-192x192.png',
    'assets/img/iconos/logicgame-icon-512x512.png',

    // Iconos importantes de la UI y favicon
    'assets/img/iconos/info.png', // Tu favicon actual
    'assets/img/iconos/inicio.png',
    'assets/img/iconos/juego.png',
    'assets/img/iconos/favoritos.png',
    'assets/img/iconos/info1.png',
    // 'assets/img/iconos/carta.png', // Si este icono es usado en la carga inicial

    // Imágenes de fondo si son cruciales para la primera pintura y no muy grandes
    // 'assets/img/foninfo.png', // Evalúa si es necesario cachearlo siempre
    // 'assets/img/iconos/fonfavoritos.png' // Igual aquí
];

// Evento 'install': Se dispara cuando el Service Worker se instala.
// Usado para cachear los recursos del App Shell.
self.addEventListener('install', (event) => {
    console.log('[SW] Evento: install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando App Shell:', APP_SHELL_RESOURCES);
                return cache.addAll(APP_SHELL_RESOURCES);
            })
            .catch(error => {
                console.error('[SW] Falló cache.addAll durante la instalación:', error);
                // Si falla el cacheo de algún recurso crítico, la instalación del SW podría fallar.
            })
            .then(() => {
                console.log('[SW] App Shell cacheado. Forzando activación con skipWaiting().');
                return self.skipWaiting(); // Hace que el nuevo SW se active inmediatamente
            })
    );
});

// Evento 'activate': Se dispara después de 'install' y cuando el SW toma control.
// Usado para limpiar cachés antiguas que ya no son necesarias.
self.addEventListener('activate', (event) => {
    console.log('[SW] Evento: activate');
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
            return self.clients.claim(); // Permite que el SW tome control de los clientes abiertos inmediatamente
        })
    );
});

// Evento 'fetch': Se dispara cada vez que la PWA hace una petición de red.
// Aquí implementamos una estrategia de caché "Cache First, then Network".
self.addEventListener('fetch', (event) => {
    // No queremos cachear las peticiones a la API de Deck of Cards con esta estrategia simple,
    // ya que esos datos deben ser frescos o la API maneja su propio cacheo.
    if (event.request.url.includes('deckofcardsapi.com')) {
        // console.log('[SW] Petición a API (red):', event.request.url);
        event.respondWith(fetch(event.request));
        return;
    }

    // console.log('[SW] Evento: fetch para ->', event.request.url);
    event.respondWith(
        caches.match(event.request) // Intenta encontrar la petición en la caché actual
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // console.log('[SW] Sirviendo desde CACHÉ:', event.request.url);
                    return cachedResponse; // Si está en caché, la devuelve
                }
                // console.log('[SW] No en caché, yendo a la RED:', event.request.url);
                return fetch(event.request).then((networkResponse) => {
                    // Opcional: Si quieres cachear dinámicamente nuevos recursos que no estaban
                    // en el App Shell, podrías abrir la caché y añadir la respuesta aquí.
                    // Por ejemplo, para imágenes de cartas que se cargan después.
                    // Ten cuidado de no llenar la caché con demasiadas cosas.
                    // if (networkResponse.ok && event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
                    //   const responseToCache = networkResponse.clone();
                    //   caches.open(CACHE_NAME).then(cache => {
                    //     cache.put(event.request, responseToCache);
                    //   });
                    // }
                    return networkResponse; // Sirve desde la red
                });
            })
            .catch(error => {
                console.error('[SW] Error en fetch:', event.request.url, error);
                // Aquí podrías devolver una página offline genérica si la tuvieras cacheada
                // ej: return caches.match('/offline.html');
            })
    );
});