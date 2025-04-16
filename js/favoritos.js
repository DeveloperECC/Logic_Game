function mostrarFavoritos() {
    const app = document.getElementById('app');
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    app.innerHTML = `
      <h2>Favoritos</h2>
      <ul id="listaFavoritos"></ul>
    `;
    
    const listaFavoritos = document.getElementById('listaFavoritos');
    favoritos.forEach(carta => {
      const li = document.createElement('li');
      li.textContent = carta;
      listaFavoritos.appendChild(li);
    });
  }
  
