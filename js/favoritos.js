function mostrarFavoritos() {
    const app = document.getElementById('app');
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    app.innerHTML = `
      <h2>Tus Cartas Favoritas</h2>
      ${favoritos.length === 0 ? '<p>No tienes cartas favoritas aún</p>' : ''}
      <div class="card-container" id="listaFavoritos"></div>
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
    alert('Carta eliminada de favoritos');
  }
  
  // Hacer funciones accesibles globalmente
  window.mostrarFavoritos = mostrarFavoritos;
  window.eliminarDeFavoritos = eliminarDeFavoritos;