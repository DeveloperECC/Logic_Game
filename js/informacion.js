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
        <h2>✨ Sobre Logic Game ✨</h2>
        
        <div class="info-card-container">
          ${cartaAleatoria ? `
            <div class="info-card">
              <img src="${cartaAleatoria.image}" alt="${cartaAleatoria.value} of ${cartaAleatoria.suit}">
              <p class="carta-desc">Carta del día: ${cartaAleatoria.value} de ${cartaAleatoria.suit}</p>
            </div>
          ` : `
            <div class="info-card">
              <img src="img/carta-especial.png" alt="Carta mágica">
              <p class="carta-desc">Carta especial</p>
            </div>
          `}
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <img src="img/iconos/desarrollador.png" class="info-icon" alt="Desarrollador">
            <span>Desarrollado por: Elmer y equipo</span>
          </div>
          
          <div class="info-item">
            <img src="img/iconos/version.png" class="info-icon" alt="Versión">
            <span>Versión: 2.0.0</span>
          </div>
          
          <div class="info-item">
            <img src="img/iconos/api.png" class="info-icon" alt="API">
            <span>API: Deck of Cards</span>
          </div>
        </div>
        
        <p class="info-descripcion">
          Logic Game es una aplicación educativa diseñada para hacer el aprendizaje 
          de las matemáticas divertido e interactivo para niños y adultos.
        </p>
      </div>
    `;
  }
  
  window.mostrarInformacion = mostrarInformacion;