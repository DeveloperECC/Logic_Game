// Logic_Game-main/js/informacion.js

// Importar la función para obtener cartas aleatorias desde conexion_api.js
import { obtenerCartasAleatorias } from './conexion_api.js';

// La función principal que será importada por main.js
export async function mostrarInformacion(appContainer) {
  console.log("Mostrando pantalla de Información...");
  if (!appContainer) {
    console.error("Error en mostrarInformacion: appContainer no fue proporcionado.");
    return;
  }

  appContainer.innerHTML = `<div class="mensaje-carga"><p>Cargando información y carta del día...</p></div>`;
  
  let cartaAleatoria = null;
  try {
    const cartas = await obtenerCartasAleatorias(1);
    if (cartas && cartas.length > 0) {
      cartaAleatoria = cartas[0];
    }
  } catch (error) {
    console.error("Fallo al obtener carta aleatoria para la pantalla de información:", error);
  }

  appContainer.innerHTML = `
    <div class="info-container">
      <div class="info-content">
        <img src="assets/img/iconos/carta.png" class="info-icon" alt="Icono información">
        <h2>✨ Sobre Logic Game y la API Deck of Cards ✨</h2>
        
        <div class="info-card-container">
          <div class="info-card">
            ${cartaAleatoria ? `
              <img src="${cartaAleatoria.image}" alt="${cartaAleatoria.value} of ${cartaAleatoria.suit}">
              <p class="carta-desc">Carta del día: ${cartaAleatoria.value} de ${cartaAleatoria.suit}</p>
            ` : `
              <img src="assets/img/iconos/carta.png" alt="Carta mágica">
              <p class="carta-desc">Carta especial del día</p>
            `}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <img src="assets/img/iconos/juego.png" class="info-icon" alt="Desarrollador">
            <div>
              <span>Desarrollado por: Elmer Cabrera Cortez</span><br>
              <a href="https://github.com/DeveloperECC" target="_blank" rel="noopener noreferrer" class="info-url">GitHub.com/DeveloperECC</a>
            </div>
          </div>
          
          <div class="info-item">
            <img src="assets/img/iconos/info1.png" class="info-icon" alt="Versión">
            <span>Versión: 1.0.0</span>
          </div>
          
          <div class="info-item">
            <img src="assets/img/iconos/foninfo.png" class="info-icon" alt="API"> 
            <span>API: Deck of Cards</span>
          </div>
        </div>
        
        <div class="info-text">
          <p>Logic Game es una aplicación educativa diseñada para hacer el aprendizaje 
          de las matemáticas divertido e interactivo para niños y adultos, utilizando la 
          API Deck of Cards para crear experiencias únicas.</p>
        </div>
      </div>
    </div>
  `;
}

console.log("[informacion.js] Módulo cargado. Funciones exportadas: mostrarInformacion.");