llet mazoDeCartas = [];

async function mostrarInicio() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>Bienvenido al Juego Educativo de Cartas</h1>
    <p>¡Aprende jugando con cartas y diviértete!</p>
    <input type="text" id="buscador" placeholder="Buscar por palo, valor...">
    <div id="card-container" class="card-container"></div>
  `;
  
  await cargarCartas();
  
  // Evento para filtro de búsqueda
  document.getElementById('buscador').addEventListener('input', filtrarCartas);
}

async function cargarCartas() {
  const container = document.getElementById('card-container');
  container.innerHTML = '<p>Cargando cartas...</p>';
  
  try {
    const mazo = await barajarMazo();
    const cartasAPI = await sacarCartas(mazo.deck_id, 20);
    mazoDeCartas = cartasAPI;
    
    container.innerHTML = mazoDeCartas.map(carta => `
      <div class="card" data-palo="${carta.suit}" data-valor="${carta.value}">
        <img src="${carta.image}" alt="${carta.code}">
        <button onclick="agregarAFavoritos('${carta.code}')">Favorito</button>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p>Error al cargar las cartas. Intenta recargar la página.</p>';
    console.error(error);
  }
}

function filtrarCartas(event) {
  const textoFiltro = event.target.value.toLowerCase();
  const cartasFiltradas = mazoDeCartas.filter(carta => {
    return carta.suit.toLowerCase().includes(textoFiltro) || 
           carta.value.toLowerCase().includes(textoFiltro) ||
           carta.code.toLowerCase().includes(textoFiltro);
  });

  const container = document.getElementById('card-container');
  container.innerHTML = cartasFiltradas.map(carta => `
    <div class="card" data-palo="${carta.suit}" data-valor="${carta.value}">
      <img src="${carta.image}" alt="${carta.code}">
      <button onclick="agregarAFavoritos('${carta.code}')">Favorito</button>
    </div>
  `).join('');
}

function agregarAFavoritos(codigoCarta) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const carta = mazoDeCartas.find(c => c.code === codigoCarta);
  
  if (!favoritos.some(f => f.code === codigoCarta)) {
    favoritos.push(carta);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    alert(`Carta ${carta.value} de ${carta.suit} añadida a favoritos`);
  } else {
    alert('Esta carta ya está en favoritos');
  }
}

// Hacer funciones accesibles globalmente
window.mostrarInicio = mostrarInicio;
window.agregarAFavoritos = agregarAFavoritos;