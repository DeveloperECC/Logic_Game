let todasLasCartas = [];

async function mostrarInicio() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1 class="titulo-principal">🎴 Mazos de Cartas</h1>
    <p class="subtitulo">Explora todos nuestros mazos disponibles</p>
    
    <div class="buscador-container">
      <input type="text" id="buscador" placeholder="🔍 Buscar cartas por valor (ej: ace, king, 5) o palo (hearts, spades)...">
      <select id="filtro-palo">
        <option value="all">Todos los palos</option>
        <option value="HEARTS">♥ Corazones</option>
        <option value="DIAMONDS">♦ Diamantes</option>
        <option value="CLUBS">♣ Tréboles</option>
        <option value="SPADES">♠ Picas</option>
      </select>
    </div>
    
    <div id="loading">Cargando cartas mágicas...</div>
    <div id="card-container" class="card-container"></div>
  `;

  document.getElementById('buscador').addEventListener('input', filtrarCartas);
  document.getElementById('filtro-palo').addEventListener('change', filtrarCartas);

  try {
    document.getElementById('loading').style.display = 'block';
    todasLasCartas = await obtenerMazoCompleto();
    mostrarCartas(todasLasCartas);
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    document.getElementById('loading').innerHTML = 
      '<p class="error">Error cargando cartas. Intenta recargar la página.</p>';
    console.error(error);
  }
}

function mostrarCartas(cartas) {
  const container = document.getElementById('card-container');
  container.innerHTML = cartas.map(carta => `
    <div class="card" data-palo="${carta.suit}" data-valor="${carta.value}">
      <img src="${carta.image}" alt="${carta.value} of ${carta.suit}" 
           onerror="this.src='img/carta-error.png'">
      <button onclick="agregarAFavoritos('${carta.code}')">
        <img src="img/iconos/favorito.png" alt="Favorito">
      </button>
    </div>
  `).join('');
}

function filtrarCartas() {
  const texto = document.getElementById('buscador').value.toLowerCase();
  const palo = document.getElementById('filtro-palo').value;
  
  const filtradas = todasLasCartas.filter(carta => {
    const coincideTexto = carta.value.toLowerCase().includes(texto) || 
                         carta.suit.toLowerCase().includes(texto);
    const coincidePalo = palo === 'all' || carta.suit === palo;
    return coincideTexto && coincidePalo;
  });
  
  mostrarCartas(filtradas);
}

window.mostrarInicio = mostrarInicio;