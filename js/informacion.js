function mostrarInformacion() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="info-container">
        <h2>✨ Sobre Logic Game ✨</h2>
        
        <div class="info-card">
          <img src="img/carta-especial.png" alt="Carta mágica">
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
          
          <div class="info-item">
            <img src="img/iconos/objetivo.png" class="info-icon" alt="Objetivo">
            <span>Objetivo: Aprender matemáticas jugando</span>
          </div>
        </div>
        
        <p class="info-descripcion">
          Logic Game es una aplicación educativa diseñada para hacer el aprendizaje de las matemáticas 
          divertido e interactivo para niños y adultos. ¡Diviértete mientras aprendes!
        </p>
      </div>
    `;
  }
  
  window.mostrarInformacion = mostrarInformacion;