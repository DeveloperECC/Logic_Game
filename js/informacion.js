function mostrarInformacion() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <h2>Información sobre la App</h2>
      <img src="img/iconos/info.png" alt="Información">
      <p>API utilizada: Deck of Cards API</p>
      <p>Desarrollado por: Elmer</p>
      <p>Versión: V.1.0.0</p>
      <p>Esta aplicación te permite aprender matemáticas básicas jugando con cartas.</p>
      <p>Características:</p>
      <ul style="text-align: left; margin-left: 20px;">
        <li>Visualiza cartas de un mazo</li>
        <li>Juega resolviendo operaciones matemáticas</li>
        <li>Guarda tus cartas favoritas</li>
      </ul>
    `;
  }
  
  // Hacer función accesible globalmente
  window.mostrarInformacion = mostrarInformacion;