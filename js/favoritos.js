function mostrarFavoritos() {
    const app = document.getElementById('app');
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    app.innerHTML = `
      <h2>Tus Cartas Favoritas</h2>
      ${favoritos.length === 0 ? '<p>No tienes cartas favoritas aún. Agrega algunas desde la pantalla principal.</p>' : ''}
      <div class="card-container" id="listaFavoritos"></div>
      ${favoritos.length > 0 ? '<button onclick="limpiarFavoritos()" style="margin-top: 20px;">Limpiar Todos</button>' : ''}
    `;
    
    const listaFavoritos = document.getElementById('listaFavoritos');
    if (favoritos.length > 0) {
      listaFavoritos.innerHTML = favoritos.map(carta => `
        <div class="card" data-palo="${carta.suit}" data-valor="${carta.value}">
          <img src="${carta.image}" alt="${carta.code}">
          <button onclick="eliminarDeFavoritos('${carta.code}')">Quitar</button>
        </div>
      `).join('');
    }
  }
  
  function eliminarDeFavoritos(codigoCarta) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(carta => carta.code !== codigoCarta);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
  }
  
  function limpiarFavoritos() {
    localStorage.removeItem('favoritos');
    mostrarFavoritos();
  }
  
  // Hacer funciones accesibles globalmente
  window.mostrarFavoritos = mostrarFavoritos;
  window.eliminarDeFavoritos = eliminarDeFavoritos;
  window.limpiarFavoritos = limpiarFavoritos;