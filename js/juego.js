// juego.js
let puntuacionActual = 0,
    operacionActual = {},
    resultadoCorrecto = 0,
    valores = [];

async function mostrarJuego() {
  const app = document.getElementById("app");
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
    await iniciarNuevoJuego();
  } catch {
    document.getElementById("resultado").innerHTML = `<p>Error al cargar el juego.</p>`;
  }
}

async function iniciarNuevoJuego() {
  const mazo = await barajarMazo();
  const cartasAPI = await sacarCartas(mazo.deck_id, 2);
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
    if (e.key==='Enter') comprobarRespuesta();
  });
}

function comprobarRespuesta() {
  const resp = +document.getElementById('respuesta').value,
        resDiv = document.getElementById('resultado');
  if (resp===resultadoCorrecto) {
    puntuacionActual+=10;
    resDiv.innerHTML = `<p>¡Correcto! +10 puntos</p>`;
    setTimeout(mostrarJuego, 1500);
  } else {
    resDiv.innerHTML = `<p>¡Incorrecto! Pista: el resultado es ${resp<resultadoCorrecto?'mayor':'menor'}</p>`;
  }
}

function mostrarPista() {
  document.getElementById('resultado').innerHTML =
    `<p>💡 ${operacionActual.texto}: ${valores[0].valor} ${operacionActual.simbolo} ${valores[1].valor} = ${resultadoCorrecto}</p>`;
}
