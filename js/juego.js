let puntuacionActual = 0;
let operacionActual = {};
let resultadoCorrecto = 0;
let valores = [];
let mazoId = null;

async function iniciarNuevoJuego() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="juego-matematico">
      <div class="puntaje-container">
        <span class="puntaje">Puntos: ${puntuacionActual}</span>
        <div class="operacion-actual">${operacionActual.simbolo || '?'}</div>
      </div>
      <div class="cartas-juego"></div>
      <div id="resultado"></div>
      <div class="botones-juego">
        <button onclick="comprobarRespuesta()">Comprobar</button>
        <button onclick="mostrarPista()">Pista</button>
      </div>
    </div>
  `;

  try {
    if (!mazoId) {
      const mazo = await barajarMazo();
      mazoId = mazo.deck_id;
    }
    
    const cartasAPI = await sacarCartas(mazoId, 2);
    valores = cartasAPI.map(c => {
      let val = isNaN(c.value) ? ({'ACE':1,'JACK':11,'QUEEN':12,'KING':13}[c.value]||0) : +c.value;
      return { valor: val, image: c.image, suit: c.suit, code: c.code };
    });
    
    const ops = [
      { simbolo: '+', fn: (a,b)=>a+b, texto:'suma' },
      { simbolo: '-', fn: (a,b)=>a-b, texto:'resta' },
      { simbolo: '×', fn: (a,b)=>a*b, texto:'multiplicación' }
    ];
    
    operacionActual = ops[Math.floor(Math.random()*ops.length)];
    resultadoCorrecto = operacionActual.fn(valores[0].valor, valores[1].valor);

    document.querySelector('.operacion-actual').textContent = operacionActual.simbolo;
    const cont = document.querySelector('.cartas-juego');
    cont.innerHTML = `
      ${valores.map(v=>`
        <div class="carta-juego">
          <img src="${v.image}">
          <div class="valor">${v.valor}</div>
        </div>
      `).join('')}
      <div class="igual">=</div>
      <input id="respuesta" type="number" autofocus>
    `;
    
    document.getElementById('respuesta').addEventListener('keypress', e => {
      if (e.key === 'Enter') comprobarRespuesta();
    });
  } catch (error) {
    document.getElementById("resultado").innerHTML = `<p>Error al cargar el juego. Intenta de nuevo.</p>`;
    console.error(error);
  }
}

function comprobarRespuesta() {
  const respuestaInput = document.getElementById('respuesta');
  const resp = +respuestaInput.value;
  const resDiv = document.getElementById('resultado');
  
  if (isNaN(resp)) {
    resDiv.innerHTML = `<p>Por favor ingresa un número válido</p>`;
    return;
  }
  
  if (resp === resultadoCorrecto) {
    puntuacionActual += 10;
    resDiv.innerHTML = `<p>¡Correcto! +10 puntos</p>`;
    setTimeout(iniciarNuevoJuego, 1500);
  } else {
    resDiv.innerHTML = `<p>¡Incorrecto! Pista: el resultado es ${resp < resultadoCorrecto ? 'mayor' : 'menor'}</p>`;
    respuestaInput.focus();
  }
}

function mostrarPista() {
  document.getElementById('resultado').innerHTML =
    `<p>💡 ${operacionActual.texto}: ${valores[0].valor} ${operacionActual.simbolo} ${valores[1].valor} = ${resultadoCorrecto}</p>`;
}

// Hacer funciones accesibles globalmente
window.iniciarNuevoJuego = iniciarNuevoJuego;
window.comprobarRespuesta = comprobarRespuesta;
window.mostrarPista = mostrarPista;
window.mostrarJuego = iniciarNuevoJuego;