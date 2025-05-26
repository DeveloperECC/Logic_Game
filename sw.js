// Logic_Game-main/sw.js

// Incrementa la versión del caché cada vez que cambies los archivos cacheados
// o la lógica del SW.
const CACHE_NAME = 'logicgame-cache-v1.3'; // Nueva versión

// Lista de archivos que componen el "App Shell".
// Asegúrate de que todas las rutas sean relativas a la raíz de tu sitio,
// donde se encuentra este sw.js.
const APP_SHELL_RESOURCES = [
    './index.html',             // Ruta explícita, coincide con start_url sugerido
    './manifest.json',          // Ruta explícita para el manifest
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
    // Asegúrate de que estas rutas son correctas y los archivos existen.
    './assets/img/iconos/foninfo.png', 
    './assets/img/iconos/inicio.png',
    './assets/img/iconos/juego.png',
    './assets/img/iconos/favoritos.png',
    './assets/img/iconos/info1.png',
    // './assets/img/iconos/carta.png', // Descomenta si es crucial para la primera carga
    
    // Considera cachear también la raíz si tu servidor podría servirla
    // de forma diferente a index.html, aunque con start_url explícito,
    // './index.html' es el más importante.
    // './' 
];

self.addEventListener('install', (event) => {
    console.log('[SW] Evento: install. Cacheando App Shell para CACHE_NAME:', CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando App Shell:', APP_SHELL_RESOURCES);
                // Si addAll falla, es porque alguna de las URL no es accesible (404, error de red)
                return cache.addAll(APP_SHELL_RESOURCES);
            })
            .catch(error => {
                console.error('[SW] Falló cache.addAll durante la instalación:', error);
                // Este error es crítico. Si ocurre, el SW no se instalará correctamente.
                // Revisa las rutas en APP_SHELL_RESOURCES y la conexión de red.
            })
            .then(() => {
                console.log('[SW] App Shell cacheado correctamente. Forzando activación con skipWaiting().');
                return self.skipWaiting(); // Activa el nuevo SW inmediatamente
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
            return self.clients.claim(); // Toma control de las páginas abiertas
        })
    );
});

self.addEventListener('fetch', (event) => {
    // No cachear peticiones a la API externa
    if (event.request.url.includes('deckofcardsapi.com')) {
        // console.log('[SW] Petición a API externa (directo a red):', event.request.url);
        event.respondWith(fetch(event.request));
        return;
    }

    // Para todas las demás peticiones, usar estrategia "Cache First, then Network"
    // console.log('[SW] Evento: fetch. URL solicitada:', event.request.url);
    event.respondWith(
        caches.match(event.request) // Intenta encontrar la petición en la caché
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // console.log('[SW] Sirviendo desde CACHÉ:', event.request.url);
                    return cachedResponse; // Si está en caché, la devuelve
                }
                
                // console.log('[SW] No en caché, yendo a la RED:', event.request.url);
                return fetch(event.request).then((networkResponse) => {
                    // Opcional: Si quieres cachear dinámicamente nuevos recursos que no estaban
                    // en el App Shell (ej. imágenes cargadas por el juego).
                    // Asegúrate de que la respuesta es válida antes de cachearla.
                    if (networkResponse && networkResponse.ok && event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            // console.log('[SW] Cacheando dinámicamente:', event.request.url);
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse; // Sirve desde la red y opcionalmente la cachea
                });
            })
            .catch(error => {
                console.error('[SW] Error en fetch:', event.request.url, error);
                // Considera devolver una página offline genérica si una petición de navegación falla
                // y tienes una página 'offline.html' cacheada.
                // if (event.request.mode === 'navigate') {
                //   return caches.match('./offline.html'); // Asegúrate que 'offline.html' está en APP_SHELL_RESOURCES
                // }
            })
    );
});