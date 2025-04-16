let mazoJuegoId = null;
let puntuacion = 0;

async function iniciarJuego() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="juego-container">
      <div class="puntaje">Puntos: <span>${puntuacion}</span></div>
      
      <div class="cartas-juego">
        <div class="carta-juego" id="carta1"></div>
        <div class="operacion">+</div>
        <div class="carta-juego" id="carta2"></div>
        <div class="igual">=</div>
        <input type="number" id="respuesta" placeholder="?">
      </div>
      
      <div id="feedback"></div>
      
      <div class="controles-juego">
        <button id="comprobar">Comprobar</button>
        <button id="nueva-carta">Nuevo Juego</button>
      </div>
    </div>
  `;

  document.getElementById('comprobar').addEventListener('click', comprobarRespuesta);
  document.getElementById('nueva-carta').addEventListener('click', nuevaRonda);
  document.getElementById('respuesta').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') comprobarRespuesta();
  });

  await nuevaRonda();
}

async function nuevaRonda() {
  try {
    if (!mazoJuegoId) {
      const mazo = await barajarMazo();
      mazoJuegoId = mazo.deck_id;
    }
    
    const cartas = await sacarCartas(mazoJuegoId, 2);
    const [carta1, carta2] = cartas;
    
    const valor1 = obtenerValorNumerico(carta1.value);
    const valor2 = obtenerValorNumerico(carta2.value);
    
    const operaciones = [
      { simbolo: '+', calcular: (a, b) => a + b, nombre: 'suma' },
      { simbolo: '-', calcular: (a, b) => a - b, nombre: 'resta' },
      { simbolo: '×', calcular: (a, b) => a * b, nombre: 'multiplicación' }
    ];
    
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
    const resultado = operacion.calcular(valor1, valor2);
    
    // Mostrar cartas
    document.getElementById('carta1').innerHTML = `
      <img src="${carta1.image}" alt="${carta1.value}">
      <div class="valor">${valor1}</div>
    `;
    
    document.getElementById('carta2').innerHTML = `
      <img src="${carta2.image}" alt="${carta2.value}">
      <div class="valor">${valor2}</div>
    `;
    
    document.querySelector('.operacion').textContent = operacion.simbolo;
    document.getElementById('respuesta').value = '';
    document.getElementById('respuesta').focus();
    
    // Guardar estado actual
    window.juegoActual = { valor1, valor2, operacion, resultado };
    
  } catch (error) {
    document.getElementById('feedback').innerHTML = `
      <p class="error">Error al cargar cartas. Intenta de nuevo.</p>
    `;
    console.error(error);
  }
}

function obtenerValorNumerico(valorCarta) {
  const valores = {
    'ACE': 1, 'JACK': 11, 'QUEEN': 12, 'KING': 13
  };
  return valores[valorCarta] || parseInt(valorCarta);
}

function comprobarRespuesta() {
  const respuesta = parseInt(document.getElementById('respuesta').value);
  const { resultado } = window.juegoActual;
  const feedback = document.getElementById('feedback');
  
  if (isNaN(respuesta)) {
    feedback.innerHTML = '<p>Por favor ingresa un número válido</p>';
    return;
  }
  
  if (respuesta === resultado) {
    puntuacion += 10;
    feedback.innerHTML = '<p class="correcto">¡Correcto! +10 puntos</p>';
    setTimeout(nuevaRonda, 1500);
  } else {
    feedback.innerHTML = `
      <p class="incorrecto">Incorrecto. El resultado es 
      ${respuesta < resultado ? 'mayor' : 'menor'}</p>
    `;
  }
  
  document.querySelector('.puntaje span').textContent = puntuacion;
}

window.iniciarJuego = iniciarJuego;