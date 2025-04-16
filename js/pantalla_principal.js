/let mazoDeCartas = [];

function mostrarInicio() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>Bienvenido al Juego Educativo de Cartas</h1>
    <p>¡Aprende jugando con cartas y diviértete!</p>
    <input type="text" id="buscador" placeholder="Buscar por palo, valor...">
    <div id="card-container"></div>
  `;
  cargarCartas();
}

async function cargarCartas() {
  const app = document.getElementById('card-container');
  const cartas = await obtenerCartas();
  mazoDeCartas = cartas.cards;

  app.innerHTML = mazoDeCartas.map(carta => {
    return `
      <div class="card" data-palo="${carta.suit}" data-valor="${carta.value}">
        <img src="${carta.image}" alt="${carta.code}">
        <button onclick="agregarAFavoritos('${carta.code}')">Favorito</button>
      </div>
    `;
  }).join('');

  // Evento para filtro de búsqueda
  const buscador = document.getElementById('buscador');
  buscador.addEventListener('input', filtrarCartas);
}

function filtrarCartas(event) {
  const textoFiltro = event.target.value.toLowerCase();
  const cartasFiltradas = mazoDeCartas.filter(carta => {
    return carta.suit.toLowerCase().includes(textoFiltro) || carta.value.toLowerCase().includes(textoFiltro);
  });

  const app = document.getElementById('card-container');
  app.innerHTML = cartasFiltradas.map(carta => {
    return `
      <div class="card" data-palo="${carta.suit}" data-valor="${carta.value}">
        <img src="${carta.image}" alt="${carta.code}">
        <button onclick="agregarAFavoritos('${carta.code}')">Favorito</button>
      </div>
    `;
  }).join('');
}

function agregarAFavoritos(codigoCarta) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  
  if (!favoritos.includes(codigoCarta)) {
    favoritos.push(codigoCarta);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    alert('Carta añadida a favoritos');
  }
}
