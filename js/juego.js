let puntuacionActual = 0;
let operacionActual = {};
let resultadoCorrecto = 0;
let valores = [];
let mazoId = null;


// Agrega al inicio del archivo
let efectosSonido = {
    correcto: new Audio('sfx/correcto.mp3'),
    incorrecto: new Audio('sfx/incorrecto.mp3'),
    victoria: new Audio('sfx/victoria.mp3')
  };
  
  async function iniciarNuevoJuego() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="juego-matematico">
        <div class="puntaje-container" style="background-color:#FFD166;padding:10px;border-radius:10px;">
          <span class="puntaje">⭐ Puntos: ${puntuacionActual}</span>
        </div>
        
        <div style="display:flex;justify-content:center;align-items:center;margin:30px 0;">
          <div class="carta-juego">
            <div class="valor-carta" id="valor1">?</div>
            <img src="img/carta-fondo.png" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;opacity:0.3;">
          </div>
          
          <div class="operacion-actual">+</div>
          
          <div class="carta-juego">
            <div class="valor-carta" id="valor2">?</div>
            <img src="img/carta-fondo.png" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;opacity:0.3;">
          </div>
          
          <div class="igual" style="font-size:3rem;margin:0 15px;">=</div>
          
          <input id="respuesta" type="number" style="font-size:2rem;width:100px;text-align:center;" autofocus>
        </div>
        
        <div id="resultado" style="min-height:50px;font-size:1.2rem;"></div>
        
        <div class="botones-juego" style="display:flex;justify-content:center;gap:20px;">
          <button onclick="comprobarRespuesta()" style="background-color:#4ECDC4;">✅ Comprobar</button>
          <button onclick="mostrarPista()" style="background-color:#FFD166;">💡 Pista</button>
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
        let val = isNaN(c.value) ? ({'ACE':1,'JACK':11,'QUEEN':12,'KING':13}[c.value]||0) : parseInt(c.value);
        return { valor: val, image: c.image, suit: c.suit, code: c.code };
      });
      
      const ops = [
        { simbolo: '+', fn: (a,b)=>a+b, texto:'suma', color: '#4ECDC4' },
        { simbolo: '-', fn: (a,b)=>a-b, texto:'resta', color: '#FF6B6B' },
        { simbolo: '×', fn: (a,b)=>a*b, texto:'multiplicación', color: '#FFD166' }
      ];
      
      operacionActual = ops[Math.floor(Math.random()*ops.length)];
      resultadoCorrecto = operacionActual.fn(valores[0].valor, valores[1].valor);
  
      document.getElementById('valor1').textContent = valores[0].valor;
      document.getElementById('valor2').textContent = valores[1].valor;
      document.querySelector('.operacion-actual').textContent = operacionActual.simbolo;
      document.querySelector('.operacion-actual').style.color = operacionActual.color;
      
      document.getElementById('respuesta').addEventListener('keypress', e => {
        if (e.key === 'Enter') comprobarRespuesta();
      });
    } catch (error) {
      document.getElementById("resultado").innerHTML = `<p style="color:red;">¡Oh no! Las cartas mágicas se escaparon. Intenta de nuevo.</p>`;
      console.error(error);
    }
  }
  
  function comprobarRespuesta() {
    const respuestaInput = document.getElementById('respuesta');
    const resp = parseInt(respuestaInput.value);
    const resDiv = document.getElementById('resultado');
    
    if (isNaN(resp)) {
      resDiv.innerHTML = `<p>🧙‍♂️ ¡Necesitamos un número mágico!</p>`;
      return;
    }
    
    if (resp === resultadoCorrecto) {
      efectosSonido.correcto.play();
      puntuacionActual += 10;
      resDiv.innerHTML = `<p style="color:green;">🎉 ¡Correcto! +10 puntos mágicos</p>`;
      
      // Efecto de confeti
      if (puntuacionActual % 50 === 0) {
        efectosSonido.victoria.play();
        resDiv.innerHTML += `<p style="color:gold;font-weight:bold;">✨ ¡Racha mágica! ${puntuacionActual} puntos</p>`;
      }
      
      setTimeout(iniciarNuevoJuego, 1500);
    } else {
      efectosSonido.incorrecto.play();
      resDiv.innerHTML = `<p style="color:red;">🤔 ¡Ups! El número mágico es ${resp < resultadoCorrecto ? 'mayor' : 'menor'}</p>`;
      respuestaInput.focus();
    }
  }
  
  function mostrarPista() {
    document.getElementById('resultado').innerHTML =
      `<p>💡 ${operacionActual.texto}: ${valores[0].valor} ${operacionActual.simbolo} ${valores[1].valor} = ${resultadoCorrecto}</p>`;
  }