// Logic_Game-main/js/juego.js
import { barajarMazo /*, sacarCartas */ } from './conexion_api.js';

let mazoJuegoId = null;
let puntuacion = 0;
let juegoActual = null;
let appContainerJuego = null;

// --- BANCO DE PREGUNTAS TEMÁTICAS ---
const bancoDePreguntas = [
    // ÁLGEBRA
    {
        tema: "algebra", nivel: 1,
        enunciadoPlantilla: "Resuelve para x: <br> {v1}x = {resultadoDirecto}",
        ayudaAdicional: "x = ?",
        funcionCalculo: (v1, v2) => (v2 * (Math.floor(Math.random() * 5) + 2)), // resultadoDirecto es v2 * k
        calcularRespuesta: (v1, v2, resultadoDirecto) => resultadoDirecto / v1, // x = resultadoDirecto / v1
        requiereV1NoCero: true
    },
    {
        tema: "algebra", nivel: 1,
        enunciadoPlantilla: "Resuelve para y: <br> y / {v1} = {v2}",
        ayudaAdicional: "y = ?",
        funcionCalculo: (v1, v2) => v1 * v2, // y = v1 * v2
        calcularRespuesta: (v1, v2, _rd) => v1 * v2,
    },
    {
        tema: "algebra", nivel: 2,
        enunciadoPlantilla: "Si f(x) = {v1}x + {v2}, calcula f({x_val})",
        ayudaAdicional: `f({x_val}) = ? (donde x_val es ${Math.floor(Math.random() * 5) + 1})`,
        funcionCalculo: (v1, v2, x_val) => (v1 * x_val) + v2,
        calcularRespuesta: (v1, v2, _rd, x_val) => (v1 * x_val) + v2,
    },

    // FÍSICA
    {
        tema: "fisica", nivel: 1,
        enunciadoPlantilla: "Un auto viaja a {v1} m/s.",
        ayudaAdicional: "¿Qué distancia recorre en {v2} segundos?",
        funcionCalculo: (v1, v2) => v1 * v2,
        calcularRespuesta: (v1, v2, _rd) => v1 * v2,
        unidadRespuesta: "m"
    },
    {
        tema: "fisica", nivel: 1,
        enunciadoPlantilla: "Se aplica una fuerza de {resultadoDirecto} N a un objeto.", // F es resultadoDirecto
        ayudaAdicional: "Si su masa es {v1} kg, ¿cuál es su aceleración (a = F/m)?",
        funcionCalculo: (v1, v2) => v1 * v2, // resultadoDirecto (Fuerza) será v1*v2 (para que 'a' sea v2)
        calcularRespuesta: (v1, v2, resultadoDirecto) => resultadoDirecto / v1, // a = F / v1 (donde F=resultadoDirecto)
        unidadRespuesta: "m/s²",
        requiereV1NoCero: true
    },

    // QUÍMICA
    {
        tema: "quimica", nivel: 1,
        enunciadoPlantilla: "{v1} moles de H₂O.",
        ayudaAdicional: "¿Cuántos gramos son? (Masa molar H₂O ≈ 18 g/mol)",
        funcionCalculo: (v1, _v2) => v1 * 18,
        calcularRespuesta: (v1, _v2, _rd) => v1 * 18,
        unidadRespuesta: "g"
    },
    {
        tema: "quimica", nivel: 1,
        enunciadoPlantilla: (v1) => { // Permite enunciados dinámicos basados en un solo valor
            const elementos = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al"];
            let val = Math.min(Math.max(v1, 1), elementos.length); // Asegurar que v1 esté en rango
            return `Elemento: ${elementos[val -1]} (Z=${val})`;
        },
        ayudaAdicional: "¿Cuántos protones tiene?",
        funcionCalculo: (v1, _v2) => Math.min(Math.max(v1, 1), 13), // El número de protones es Z (valor de la carta)
        calcularRespuesta: (v1, _v2, _rd) => Math.min(Math.max(v1, 1), 13),
    },

    // CÁLCULO
    {
        tema: "calculo", nivel: 1,
        enunciadoPlantilla: "Si f(x) = {v1}x<sup>{v2}</sup>",
        ayudaAdicional: (v1, v2) => `Calcula f'(x) y da el coeficiente de x<sup>${v2-1}</sup>. (Asume x ≠ 0 si v2-1 < 0)`,
        funcionCalculo: (v1, v2) => (v2 === 0 ? 0 : v1 * v2), // Coeficiente de x^(v2-1)
        calcularRespuesta: (v1, v2, _rd) => (v2 === 0 ? 0 : v1 * v2),
        requiereV2Positivo: true // v2 debe ser > 0 para x^(v2-1) simple
    },
    {
        tema: "calculo", nivel: 1,
        enunciadoPlantilla: "Integra ∫ {v1} dx",
        ayudaAdicional: "¿Cuál es la función resultante (sin constante C)?",
        funcionCalculo: (v1, _v2) => `${v1}x`, // La respuesta esperada sería solo el coeficiente v1 si preguntamos por la parte con x
        calcularRespuesta: (v1, _v2, _rd) => v1, // Si la pregunta es solo el coeficiente
        respuestaEsperadaTexto: (v1) => `${v1}x` // Para mostrar en feedback
    },
];
// --- FIN BANCO DE PREGUNTAS ---


export async function iniciarJuego(appContainer) {
  console.log("Iniciando pantalla de Juego...");
  if (!appContainer) { console.error("Error en iniciarJuego: appContainer no fue proporcionado."); return; }
  appContainerJuego = appContainer;

  appContainerJuego.innerHTML = `
    <div class="juego-container">
      <div class="puntaje">⭐ Puntos: <span id="puntuacion-juego">${puntuacion}</span></div>
      <div class="cartas-juego" id="area-pregunta-juego">
        {/* Contenido dinámico */}
      </div>
      <div class="area-respuesta-juego">
        <div class="igualdad-simbolo">=</div>
        <input type="number" id="respuesta-juego" placeholder="?" autofocus step="any">
      </div>
      <div id="feedback-juego" class="feedback-container"></div>
      <div class="controles-juego">
        <button id="comprobar-juego" class="btn-primario">✅ Comprobar</button>
        <button id="nueva-ronda-juego" class="btn-secundario">🔄 Nueva Ronda</button>
      </div>
    </div>
  `;

  const btnComprobar = document.getElementById('comprobar-juego');
  const btnNuevaRonda = document.getElementById('nueva-ronda-juego');
  const inputRespuesta = document.getElementById('respuesta-juego');

  if (btnComprobar) btnComprobar.addEventListener('click', comprobarRespuestaJuego);
  if (btnNuevaRonda) btnNuevaRonda.addEventListener('click', nuevaRondaJuego);
  if (inputRespuesta) inputRespuesta.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') comprobarRespuestaJuego();
  });
  await nuevaRondaJuego();
}

function generarHtmlCartasAritmeticas(carta1, carta2, valor1, valor2, simboloOperacion) {
    return `
        <div class="carta-juego" id="carta1-juego">
          <img src="${carta1.image}" alt="${carta1.value} of ${carta1.suit}">
          <div class="valor-carta">${valor1}</div>
        </div>
        <div class="operacion" id="operacion-juego">${simboloOperacion}</div>
        <div class="carta-juego" id="carta2-juego">
          <img src="${carta2.image}" alt="${carta2.value} of ${carta2.suit}">
          <div class="valor-carta">${valor2}</div>
        </div>
    `;
}

function generarHtmlPreguntaTematica(tema, enunciadoPrincipal, ayudaSecundaria = "") {
    return `
        <div class="pregunta-tematica-container">
            <div class="etiqueta-tema">${tema.charAt(0).toUpperCase() + tema.slice(1)}</div>
            <div class="pregunta-principal">${enunciadoPrincipal}</div>
            ${ayudaSecundaria ? `<div class="pregunta-secundaria">${ayudaSecundaria}</div>` : ''}
        </div>
    `;
}

async function nuevaRondaJuego() {
  const feedbackDiv = document.getElementById('feedback-juego');
  const respuestaInput = document.getElementById('respuesta-juego');
  const areaPreguntaDiv = document.getElementById('area-pregunta-juego');

  if (feedbackDiv) feedbackDiv.innerHTML = '';
  if (respuestaInput) { respuestaInput.value = ''; respuestaInput.disabled = false; respuestaInput.focus(); }
  const btnComprobar = document.getElementById('comprobar-juego');
  if(btnComprobar) btnComprobar.disabled = false;

  try {
    if (!mazoJuegoId) {
      mazoJuegoId = await barajarMazo();
      if (!mazoJuegoId) throw new Error("No se pudo obtener un ID de mazo.");
    }
    
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${mazoJuegoId}/draw/?count=2`);
    if (!response.ok) throw new Error(`Error HTTP sacando cartas: ${response.status}`);
    let data = await response.json();

    if (!data.success || data.cards.length < 2) {
        mazoJuegoId = await barajarMazo();
        if (!mazoJuegoId) throw new Error("Fallo al obtener nuevo mazo.");
        const retryResponse = await fetch(`https://deckofcardsapi.com/api/deck/${mazoJuegoId}/draw/?count=2`);
        if (!retryResponse.ok) throw new Error(`Error HTTP en reintento: ${retryResponse.status}`);
        data = await retryResponse.json();
        if (!data.success || data.cards.length < 2) throw new Error("Fallo crítico al obtener cartas.");
    }
    const [cartaObj1, cartaObj2] = data.cards;
    
    let v1 = obtenerValorNumericoJuego(cartaObj1.value);
    let v2 = obtenerValorNumericoJuego(cartaObj2.value);
    
    let tipoJuego = 'aritmetica';
    let textoPreguntaCompleta = "";
    let resultadoCorrectoNum = 0;
    let unidad = "";
    let respuestaEsperadaFormatoTexto = null; // Para respuestas como "18x"

    const probabilidadTema = 0.5; // 50% de probabilidad de una pregunta temática
    if (Math.random() < probabilidadTema) {
        const preguntasFiltradas = bancoDePreguntas.filter(p => {
            if (p.requiereV1NoCero && v1 === 0) return false;
            if (p.requiereV2Positivo && v2 <= 0) return false;
            return true;
        });
        if (preguntasFiltradas.length > 0) {
            const preguntaSeleccionada = preguntasFiltradas[Math.floor(Math.random() * preguntasFiltradas.length)];
            tipoJuego = preguntaSeleccionada.tema;

            let enunciadoPrincipal = typeof preguntaSeleccionada.enunciadoPlantilla === 'function'
                ? preguntaSeleccionada.enunciadoPlantilla(v1, v2)
                : preguntaSeleccionada.enunciadoPlantilla;

            let x_val_calculo = null; // Para f(x_val) en álgebra
            if (preguntaSeleccionada.enunciadoPlantilla.includes("{x_val}")) {
                x_val_calculo = Math.floor(Math.random() * 4) + 2; // x_val entre 2 y 5
                enunciadoPrincipal = enunciadoPrincipal.replace(/{x_val}/g, x_val_calculo);
            }
            
            const resultadoDirecto = typeof preguntaSeleccionada.funcionCalculo === 'function' 
                ? preguntaSeleccionada.funcionCalculo(v1, v2, x_val_calculo) // x_val_calculo se ignora si no lo usa
                : null;

            if (typeof preguntaSeleccionada.calcularRespuesta === 'function') {
                 resultadoCorrectoNum = preguntaSeleccionada.calcularRespuesta(v1, v2, resultadoDirecto, x_val_calculo);
            } else if (resultadoDirecto !== null && typeof resultadoDirecto !== 'string') { // Si funcionCalculo ya da la respuesta numérica
                resultadoCorrectoNum = resultadoDirecto;
            }


            // Reemplazar placeholders en el enunciado principal
            enunciadoPrincipal = enunciadoPrincipal.replace(/{v1}/g, v1).replace(/{v2}/g, v2).replace(/{resultadoDirecto}/g, resultadoDirecto);
            
            let ayuda = typeof preguntaSeleccionada.ayudaAdicional === 'function'
                ? preguntaSeleccionada.ayudaAdicional(v1, v2, x_val_calculo)
                : preguntaSeleccionada.ayudaAdicional || "";
            ayuda = ayuda.replace(/{v1}/g, v1).replace(/{v2}/g, v2).replace(/{x_val}/g, x_val_calculo);


            textoPreguntaCompleta = enunciadoPrincipal + (ayuda ? `<br><small>(${ayuda})</small>` : "");
            if (areaPreguntaDiv) areaPreguntaDiv.innerHTML = generarHtmlPreguntaTematica(tipoJuego, enunciadoPrincipal, ayuda);
            unidad = preguntaSeleccionada.unidadRespuesta || "";
            if (preguntaSeleccionada.respuestaEsperadaTexto) {
                respuestaEsperadaFormatoTexto = preguntaSeleccionada.respuestaEsperadaTexto(v1,v2,resultadoDirecto,x_val_calculo);
            }

        } else { tipoJuego = 'aritmetica'; } // Fallback si no hay preguntas temáticas válidas
    }

    if (tipoJuego === 'aritmetica') {
        const operacionesAritmeticas = [
          { simbolo: '+', calcular: (a, b) => a + b },
          { simbolo: '-', calcular: (a, b) => a - b },
          { simbolo: '×', calcular: (a, b) => a * b }
        ];
        const operacionAritmetica = operacionesAritmeticas[Math.floor(Math.random() * operacionesAritmeticas.length)];
        resultadoCorrectoNum = operacionAritmetica.calcular(v1, v2);
        textoPreguntaCompleta = `${v1} ${operacionAritmetica.simbolo} ${v2}`;
        if (areaPreguntaDiv) areaPreguntaDiv.innerHTML = generarHtmlCartasAritmeticas(cartaObj1, cartaObj2, v1, v2, operacionAritmetica.simbolo);
        unidad = "";
    }
    
    // Redondear resultado si es un número y no es una respuesta de texto como "18x"
    if (typeof resultadoCorrectoNum === 'number' && !respuestaEsperadaFormatoTexto) {
        resultadoCorrectoNum = Math.round(resultadoCorrectoNum * 100) / 100; // Redondear a 2 decimales si es necesario
    }

    juegoActual = { tipo: tipoJuego, v1, v2, resultado: resultadoCorrectoNum, textoPregunta: textoPreguntaCompleta, unidadResultado: unidad, respuestaTexto: respuestaEsperadaFormatoTexto };
    console.log("Juego actual generado:", juegoActual);
    
  } catch (error) {
    console.error('Error en nueva ronda:', error);
    if (feedbackDiv) feedbackDiv.innerHTML = `<p class="mensaje-error">¡Oops! Algo salió mal. Intenta una nueva ronda.</p>`;
  }
}

function obtenerValorNumericoJuego(valorCarta) {
  const valores = { 'ACE': 1, 'JACK': 11, 'QUEEN': 12, 'KING': 13 }; // Valores 1-13
  return valores[valorCarta] || parseInt(valorCarta);
}

function comprobarRespuestaJuego() {
  const respuestaInput = document.getElementById('respuesta-juego');
  const feedbackDiv = document.getElementById('feedback-juego');
  const puntuacionSpan = document.getElementById('puntuacion-juego');

  if (!respuestaInput || !feedbackDiv || !puntuacionSpan || !juegoActual) { return; }
  
  const respuestaUsuarioStr = respuestaInput.value.trim();
  let esCorrecto = false;

  if (juegoActual.respuestaTexto) { // Si esperamos una respuesta de texto (ej. "18x")
    esCorrecto = respuestaUsuarioStr.toLowerCase() === juegoActual.respuestaTexto.toLowerCase();
  } else { // Respuesta numérica
    const respuestaUsuarioNum = parseFloat(respuestaUsuarioStr);
    if (isNaN(respuestaUsuarioNum)) {
      feedbackDiv.innerHTML = '<p class="incorrecto">¡Escribe un número en la respuesta!</p>';
      respuestaInput.select();
      return;
    }
    esCorrecto = Math.abs(respuestaUsuarioNum - juegoActual.resultado) < 0.01;
  }
  
  const respuestaMostrada = juegoActual.respuestaTexto || `${juegoActual.resultado}${juegoActual.unidadResultado}`;

  if (esCorrecto) {
    puntuacion += 10;
    feedbackDiv.innerHTML = `<p class="correcto">¡Correcto! <br>La respuesta para "<span class="pregunta-feedback">${juegoActual.textoPregunta}</span>" es ${respuestaMostrada}.<br>+10 puntos ⭐</p>`;
    puntuacionSpan.textContent = puntuacion;
    
    if (puntuacion > 0 && puntuacion % 50 === 0) {
      feedbackDiv.innerHTML += '<p class="correcto racha">¡Racha mágica! 🎉</p>';
    }
    
    respuestaInput.disabled = true;
    const btnComprobar = document.getElementById('comprobar-juego');
    if(btnComprobar) btnComprobar.disabled = true;

    setTimeout(nuevaRondaJuego, 3000); 

  } else {
    feedbackDiv.innerHTML = `<p class="incorrecto">¡Ups! No es correcto. La respuesta para "<span class="pregunta-feedback">${juegoActual.textoPregunta}</span>" era ${respuestaMostrada}.<br>¡Sigue intentando!</p>`;
    respuestaInput.select();
  }
}

console.log("[juego.js] Módulo cargado con banco de preguntas. Funciones exportadas: iniciarJuego.");