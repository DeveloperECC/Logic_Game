import { mostrarInicio } from './pantalla_principal.js'; // Asume que pantalla_principal.js exporta mostrarInicio
import { iniciarJuego } from './juego.js';               // Asume que juego.js exporta iniciarJuego
import { mostrarFavoritos } from './favoritos.js';         // Asume que favoritos.js exporta mostrarFavoritos
import { mostrarInformacion } from './informacion.js';     // Asume que informacion.js exporta mostrarInformacion

// --- REGISTRO DEL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js') // Ruta al archivo sw.js desde la raíz
            .then(registration => {
                console.log('Service Worker registrado con éxito. Scope:', registration.scope);
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker == null) return;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('Nuevo contenido disponible, por favor refresca la página.');
                                // Aquí podrías mostrar un toast/banner al usuario.
                            } else {
                                console.log('Contenido cacheado para uso offline.');
                            }
                        }
                    };
                };
            })
            .catch(error => {
                console.error('Error en el registro del Service Worker:', error);
            });
    });
} else {
    console.log('Service Worker no es soportado por este navegador.');
}

// --- LÓGICA DE INICIALIZACIÓN DE LA APLICACIÓN Y NAVEGACIÓN ---
document.addEventListener('DOMContentLoaded', function() {
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const btnEmpezar = document.getElementById('btn-empezar');
    
    if (btnEmpezar) { // Verificar que el botón exista antes de añadir el listener
        btnEmpezar.addEventListener('click', function() {
            console.log("Botón Empezar clickeado.");
            if (pantallaBienvenida) pantallaBienvenida.style.display = 'none';
            // Usamos la función global appCargarPantalla que definiremos más abajo
            window.appCargarPantalla('inicio'); 
        });
    } else {
        console.warn("Elemento #btn-empezar no encontrado.");
    }
  
    // Carga inicial basada en el hash de la URL o pantalla de bienvenida
    if (window.location.hash && window.location.hash !== "#") {
        console.log("Cargando pantalla desde hash:", window.location.hash.substring(1));
        if (pantallaBienvenida) pantallaBienvenida.style.display = 'none';
        window.appCargarPantalla(window.location.hash.substring(1));
    } else if (pantallaBienvenida) {
        console.log("Mostrando pantalla de bienvenida.");
        pantallaBienvenida.style.display = 'flex'; // Asegurar que sea visible
    } else {
        // Si no hay bienvenida ni hash, cargar inicio por defecto
        console.log("No hay bienvenida ni hash, cargando pantalla de inicio por defecto.");
        window.appCargarPantalla('inicio');
    }
});
  
// --- FUNCIÓN GLOBAL PARA CARGAR PANTALLAS ---
// La asignamos a window para que esté disponible para los onclick del HTML
// Cambié el nombre a appCargarPantalla para coincidir con index.html modificado.
window.appCargarPantalla = function(pantalla) {
    console.log(`Intentando cargar pantalla: ${pantalla}`);
    // window.location.hash = pantalla; // Comentado temporalmente para PWA, el routing simple sin hash es mejor.
                                     // Si necesitas routing con hash, descomenta y ajusta.
                                     // Para PWA con start_url, es mejor no depender del hash para la carga inicial.
    
    const app = document.getElementById('app');
    if (!app) {
        console.error("Contenedor #app no encontrado en el DOM.");
        return;
    }
    
    // Opcional: Añadir un atributo para estilizar la pantalla actual si es necesario
    app.setAttribute('data-pantalla-actual', pantalla);
    app.innerHTML = `<p style="text-align:center; padding:20px;">Cargando ${pantalla}...</p>`; // Feedback visual

    switch(pantalla) {
      case 'inicio':
        if (typeof mostrarInicio === 'function') {
            mostrarInicio(app); // Pasar el contenedor de la app
        } else { console.error("Función mostrarInicio no está definida/importada."); }
        break;
      case 'juego':
        if (typeof iniciarJuego === 'function') {
            iniciarJuego(app); // Pasar el contenedor de la app
        } else { console.error("Función iniciarJuego no está definida/importada."); }
        break;
      case 'favoritos':
        if (typeof mostrarFavoritos === 'function') {
            mostrarFavoritos(app); // Pasar el contenedor de la app
        } else { console.error("Función mostrarFavoritos no está definida/importada."); }
        break;
      case 'informacion':
        if (typeof mostrarInformacion === 'function') {
            mostrarInformacion(app); // Pasar el contenedor de la app
        } else { console.error("Función mostrarInformacion no está definida/importada."); }
        break;
      default:
        console.warn(`Pantalla desconocida: ${pantalla}. Cargando inicio por defecto.`);
        if (typeof mostrarInicio === 'function') {
            mostrarInicio(app);
        } else { 
            app.innerHTML = `<p style="text-align:center; padding:20px;">Error: Pantalla de inicio no disponible.</p>`;
            console.error("Función mostrarInicio no está definida/importada para default."); 
        }
    }
}

console.log("[main.js] Módulo principal cargado y configurado.");