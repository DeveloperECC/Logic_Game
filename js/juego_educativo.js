let puntaje = 0;
let respuestaCorrecta = 0;

async function mostrarJuego() {
    const app = document.getElementById("app");
    app.innerHTML = '<div class="cargando">Preparando juego...</div>';
    
    try {
        const mazo = await barajarMazo();
        const cartas = await sacarCartas(mazo.deck_id, 2);
        
        const valores = {
            "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, 
            "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
            "JACK": 10, "QUEEN": 10, "KING": 10
        };
        
        const operaciones = ['+', '-', '×', '÷'];
        const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
        
        let valor1 = valores[cartas[0].value];
        let valor2 = valores[cartas[1].value];
        
        // Asegurar operaciones adecuadas para niños
        if (operacion === '-' && valor1 < valor2) {
            [valor1, valor2] = [valor2, valor1]; // Intercambiar para resultado positivo
        }
        
        if (operacion === '÷') {
            valor1 = valor1 * valor2; // Asegurar división exacta
        }
        
        respuestaCorrecta = eval(`${valor1} ${operacion.replace('×', '*').replace('÷', '/')} ${valor2}`);
        
        app.innerHTML = `
            <div class="juego-matematico">
                <h2>¡Resuelve!</h2>
                <div class="puntaje">Puntos: ${puntaje}</div>
                
                <div class="cartas-juego">
                    <div class="carta-juego">
                        <img src="${cartas[0].image}" alt="Carta 1">
                        <div class="valor-carta">${valor1}</div>
                    </div>
                    
                    <div class="signo-operacion">${operacion}</div>
                    
                    <div class="carta-juego">
                        <img src="${cartas[1].image}" alt="Carta 2">
                        <div class="valor-carta">${valor2}</div>
                    </div>
                    
                    <div class="signo-igual">=</div>
                    
                    <input type="number" id="respuesta" placeholder="?" class="input-respuesta">
                </div>
                
                <div class="botones-juego">
                    <button onclick="comprobarRespuesta()" class="boton-comprobar">
                        Comprobar
                    </button>
                    <button onclick="mostrarPista(${valor1}, ${valor2}, '${operacion}')" class="boton-pista">
                        Pista
                    </button>
                </div>
                
                <div id="resultado"></div>
            </div>
        `;
    } catch (error) {
        app.innerHTML = '<div class="error">Error al cargar el juego. Intenta nuevamente.</div>';
    }
}

function comprobarRespuesta() {
    const respuestaUsuario = parseFloat(document.getElementById("respuesta").value);
    const resultadoDiv = document.getElementById("resultado");
    
    if (isNaN(respuestaUsuario)) {
        resultadoDiv.innerHTML = '<p class="error">Escribe un número</p>';
        return;
    }
    
    if (respuestaUsuario == respuestaCorrecta) {
        puntaje += 10;
        resultadoDiv.innerHTML = '<p class="correcto">¡Correcto! +10 puntos</p>';
        setTimeout(mostrarJuego, 1500);
    } else {
        puntaje = Math.max(0, puntaje - 5);
        resultadoDiv.innerHTML = `<p class="incorrecto">¡Oops! Era ${respuestaCorrecta}. -5 puntos</p>`;
    }
}

function mostrarPista(valor1, valor2, operacion) {
    const pistas = {
        '+': `Suma ${valor1} + ${valor2}`,
        '-': `Resta ${valor1} - ${valor2}`,
        '×': `Multiplica ${valor1} × ${valor2}`,
        '÷': `Divide ${valor1} ÷ ${valor2}`
    };
    document.getElementById("resultado").innerHTML = `<p class="pista">💡 ${pistas[operacion]}</p>`;
}