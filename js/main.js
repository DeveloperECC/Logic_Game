// main.js
import { renderInicio } from './pantalla_principal.js';
import { renderJuegos } from './juegos.js';
import { renderFavoritos } from './favoritos.js';
import { renderInfo } from './info.js';

// Elementos del DOM
const app = document.getElementById('app');
const splashScreen = document.getElementById('splash-screen');

// Función para ocultar la pantalla de carga
function ocultarSplash() {
  splashScreen.style.display = 'none';
}

// Función para limpiar el contenido del contenedor principal
function limpiarApp() {
  app.innerHTML = '';
}

// Función para manejar la navegación
function navegar(seccion) {
  limpiarApp();
  switch (seccion) {
    case 'inicio':
      renderInicio(app);
      break;
    case 'juegos':
      renderJuegos(app);
      break;
    case 'favoritos':
      renderFavoritos(app);
      break;
    case 'info':
      renderInfo(app);
      break;
    default:
      renderInicio(app);
  }
}

// Event listeners para los botones del menú
document.getElementById('btn-inicio').addEventListener('click', () => navegar('inicio'));
document.getElementById('btn-juegos').addEventListener('click', () => navegar('juegos'));
document.getElementById('btn-favoritos').addEventListener('click', () => navegar('favoritos'));
document.getElementById('btn-info').addEventListener('click', () => navegar('info'));

// Inicialización
window.addEventListener('load', () => {
  setTimeout(() => {
    ocultarSplash();
    navegar('inicio');
  }, 2000); // Simula la duración de la pantalla de carga
});
