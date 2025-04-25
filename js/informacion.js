async function mostrarInformacion() {
  const app = document.getElementById('app');
  
  // Obtener una carta aleatoria de la API
  let cartaAleatoria;
  try {
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
    const data = await response.json();
    cartaAleatoria = data.cards[0];
  } catch (error) {
    console.error("Error al obtener carta aleatoria:", error);
    cartaAleatoria = null;
  }

  app.innerHTML = `
    <div class="info-container">
      <div class="info-content">
        <img src="assets/img/iconos/info.png" class="info-icon" alt="Icono información">
        <h2>✨ Sobre Logic Game y la API Deck of Cards ✨</h2>
        
        <div class="info-card">
          ${cartaAleatoria ? `
            <img src="${cartaAleatoria.image}" alt="${cartaAleatoria.value} of ${cartaAleatoria.suit}">
            <p class="carta-desc">Carta del día: ${cartaAleatoria.value} de ${cartaAleatoria.suit}</p>
          ` : `
            <img src="assets/img/iconos/carta.png" alt="Carta mágica">
            <p class="carta-desc">Carta especial</p>
          `}
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <img src="assets/img/iconos/juego.png" class="info-icon" alt="Desarrollador">
            <span>Desarrollado por: Elmer Cabrera Cortez</span><br>
          <span class="info-url">GitHub.com/DeveloperECC</span>
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

window.mostrarInformacion = mostrarInformacion;