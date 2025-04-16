function mostrarInformacion() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="info-container">
        <h2>¡Sobre nuestro juego!</h2>
        
        <div class="info-card bounce-effect">
          <img src="img/carta-especial.png" alt="Carta mágica" style="width:100%;height:100%;object-fit:cover;">
        </div>
        
        <div class="info-item">
          <img src="img/iconos/desarrollador.png" class="info-icon" alt="Desarrollador">
          <span>Desarrollado por: Elmer y el equipo mágico</span>
        </div>
        
        <div class="info-item">
          <img src="img/iconos/version.png" class="info-icon" alt="Versión">
          <span>Versión: 2.0.0</span>
        </div>
        
        <div class="info-item">
          <img src="img/iconos/api.png" class="info-icon" alt="API">
          <span>API: Deck of Cards API</span>
        </div>
        
        <div class="info-item">
          <img src="img/iconos/objetivo.png" class="info-icon" alt="Objetivo">
          <span>Objetivo: Aprender matemáticas jugando</span>
        </div>
        
        <p style="margin-top:20px;font-size:1.2rem;">
          ¡Diseñado especialmente para niños a partir de 5 años! 
          Aprende sumas, restas y multiplicaciones con cartas mágicas.
        </p>
      </div>
    `;
  }
  
  window.mostrarInformacion = mostrarInformacion;