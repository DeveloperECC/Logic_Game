let mazosDisponibles = [
  { nombre: "Todos los Mazos", id: "new" },
  { nombre: "♠ Picas", id: "spades" },
  { nombre: "♥ Corazones", id: "hearts" },
  { nombre: "♦ Diamantes", id: "diamonds" },
  { nombre: "♣ Tréboles", id: "clubs" }
];

let mazoActual = "new";

async function mostrarInicio() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1 style="color:#FF6B6B;">🎴 Mazos Mágicos</h1>
    <p>¡Elige un mazo y comienza a aprender!</p>
    
    <div style="display:flex;gap:10px;margin-bottom:20px;">
      <select id="selector-mazo" style="padding:10px;border-radius:10px;flex-grow:1;">
        ${mazosDisponibles.map(mazo => `
          <option value="${mazo.id}">${mazo.nombre}</option>
        `).join('')}
      </select>
      <button onclick="cargarMazoSeleccionado()" style="background-color:#4ECDC4;">🔍 Cargar</button>
    </div>
    
    <input type="text" id="buscador" placeholder="🔎 Buscar cartas por nombre o valor..." 
           style="padding:12px;width:100%;border-radius:20px;border:2px solid #4ECDC4;">
    
    <div id="card-container" class="card-container" style="margin-top:20px;"></div>
  `;
  
  document.getElementById('selector-mazo').addEventListener('change', function() {
    mazoActual = this.value;
  });
  
  document.getElementById('buscador').addEventListener('input', function(e) {
    filtrarCartas(e);
  });
  
  await cargarCartas();
}

async function cargarMazoSeleccionado() {
  await cargarCartas();
}

async function cargarCartas() {
  const container = document.getElementById('card-container');
  container.innerHTML = '<p>Cargando cartas mágicas...</p>';
  
  try {
    let cartasAPI;
    if (mazoActual === "new") {
      const mazo = await barajarMazo();
      cartasAPI = await sacarCartas(mazo.deck_id, 20);
    } else {
      cartasAPI = await obtenerCartasPorPalo(mazoActual, 20);
    }
    
    mazoDeCartas = cartasAPI;
    mostrarCartasEnContainer(mazoDeCartas, container);
  } catch (error) {
    container.innerHTML = '<p>¡Las cartas mágicas se escondieron! Intenta de nuevo.</p>';
    console.error(error);
  }
}

// Agrega esta función a conexion_api.js
async function obtenerCartasPorPalo(palo, cantidad) {
  try {
    const respuesta = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${cantidad}&suits=${palo}`);
    const datos = await respuesta.json();
    return datos.cards;
  } catch (error) {
    console.error('Error al obtener cartas por palo:', error);
    throw error;
  }
}