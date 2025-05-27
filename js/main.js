// main.js
import { mostrarInicio } from './pantalla_principal.js';
import { iniciarJuego } from './juego.js';
import { mostrarFavoritos } from './favoritos.js';
import { mostrarInformacion } from './informacion.js';

// --- REGISTRO DEL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Usar ruta relativa al index.html para sw.js.
        // El scope se inferirá correctamente al directorio donde está sw.js.
        navigator.serviceWorker.register('./sw.js') 
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
// (El resto de tu lógica de main.js permanece exactamente igual que la proporcionaste)
document.addEventListener('DOMContentLoaded', function() {
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const btnEmpezar = document.getElementById('btn-empezar');
    
    if (btnEmpezar) {
        btnEmpezar.addEventListener('click', function() {
            console.log("Botón Empezar clickeado.");
            if (pantallaBienvenida) pantallaBienvenida.style.display = 'none';
            window.appCargarPantalla('inicio'); 
        });
    } else {
        console.warn("Elemento #btn-empezar no encontrado.");
    }
  
    if (window.location.hash && window.location.hash !== "#") {
        console.log("Cargando pantalla desde hash:", window.location.hash.substring(1));
        if (pantallaBienvenida) pantallaBienvenida.style.display = 'none';
        window.appCargarPantalla(window.location.hash.substring(1));
    } else if (pantallaBienvenida && pantallaBienvenida.style.display !== 'none') { 
        console.log("Mostrando pantalla de bienvenida.");
    } else if (!pantallaBienvenida || pantallaBienvenida.style.display === 'none') {
        console.log("No hay bienvenida (o está oculta) ni hash, cargando pantalla de inicio por defecto.");
        window.appCargarPantalla('inicio');
    }
});
  
window.appCargarPantalla = function(pantalla) {
    console.log(`Intentando cargar pantalla: ${pantalla}`);
    
    const app = document.getElementById('app');
    if (!app) {
        console.error("Contenedor #app no encontrado en el DOM.");
        return;
    }
    
    app.setAttribute('data-pantalla-actual', pantalla);
    app.innerHTML = `<p style="text-align:center; padding:20px;">Cargando ${pantalla}...</p>`;

    switch(pantalla) {
      case 'inicio':
        if (typeof mostrarInicio === 'function') mostrarInicio(app);
        else console.error("Función mostrarInicio no está definida/importada.");
        break;
      case 'juego':
        if (typeof iniciarJuego === 'function') iniciarJuego(app);
        else console.error("Función iniciarJuego no está definida/importada.");
        break;
      case 'favoritos':
        if (typeof mostrarFavoritos === 'function') mostrarFavoritos(app);
        else console.error("Función mostrarFavoritos no está definida/importada.");
        break;
      case 'informacion':
        if (typeof mostrarInformacion === 'function') mostrarInformacion(app);
        else console.error("Función mostrarInformacion no está definida/importada.");
        break;
      default:
        console.warn(`Pantalla desconocida: ${pantalla}. Cargando inicio por defecto.`);
        if (typeof mostrarInicio === 'function') mostrarInicio(app);
        else { 
            app.innerHTML = `<p style="text-align:center; padding:20px;">Error: Pantalla de inicio no disponible.</p>`;
            console.error("Función mostrarInicio no está definida/importada para default."); 
        }
    }
}

console.log("[main.js] Módulo principal cargado y configurado.");