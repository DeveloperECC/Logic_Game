let puntuacionActual = 0;
let operacionActual = '';
let resultadoCorrecto = 0;
let valores = []; 

async function mostrarJuego() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="cargando">
            <div class="spinner"></div>
            <p>Preparando juego divertido...</p>
        </div>
    `;

    try {
        await iniciarNuevoJuego();
    } catch (error) {
        app.innerHTML = `
            <div class="error">
                <p>¡Oops! Algo salió mal</p>
                <button onclick="mostrarJuego()" class="boton-reintentar">
                    Reintentar
                </button>
            </div>
        `;
        console.error("Error en el juego:", error);
    }
}

async function iniciarNuevoJuego() {
    const mazo = await barajarMazo();
    const cartas = await sacarCartas(mazo.deck_id, 4);
    
    if (cartas.length < 4) {
        throw new Error("No se pudieron obtener suficientes cartas");
    }

    valores = cartas.map(carta => {
        let valor;
        switch(carta.value.toLowerCase()) {
            case 'ace': case 'as': valor = 1; break;
            case 'jack': case 'jota': valor = 11; break;
            case 'queen': case 'reina': valor = 12; break;
            case 'king': case 'rey': valor = 13; break;
            default: valor = parseInt(carta.value);
        }
        return { valor, carta };
    });

    const operaciones = [
        { simbolo: '+', texto: 'más', fn: (a, b) => a + b },
        { simbolo: '-', texto: 'menos', fn: (a, b) => a - b },
        { simbolo: '×', texto: 'por', fn: (a, b) => a * b }
    ];
    
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
    operacionActual = operacion;
    resultadoCorrecto = operacion.fn(valores[0].valor, valores[1].valor);

    document.getElementById("app").innerHTML = `
        <div class="juego-matematico">
            <div class="puntaje-container">
                <span class="puntaje">Puntos: ${puntuacionActual}</span>
                <div class="operacion-actual">${operacion.simbolo}</div>
            </div>
            
            <div class="cartas-juego">
                <div class="carta-juego-container">
                    <img src="${valores[0].carta.image}" alt="${valores[0].carta.value}" 
                         onerror="this.src='https://via.placeholder.com/150x200?text=Carta+No+Disponible'">
                    <div class="valor-carta">${valores[0].valor}</div>
                </div>
                
                <div class="signo-operacion">${operacion.simbolo}</div>
                
                <div class="carta-juego-container">
                    <img src="${valores[1].carta.image}" alt="${valores[1].carta.value}"
                         onerror="this.src='https://via.placeholder.com/150x200?text=Carta+No+Disponible'">
                    <div class="valor-carta">${valores[1].valor}</div>
                </div>
                
                <div class="signo-igual">=</div>
                
                <input type="number" class="input-respuesta" id="respuesta" autofocus>
            </div>
            
            <div id="resultado"></div>
            
            <div class="botones-juego">
                <button class="boton-comprobar" onclick="comprobarRespuesta()">
                    <img src="img/iconos/comprobar.png" 
                         alt="Comprobar" class="icono-boton"
                         onerror="this.src='https://via.placeholder.com/30x30?text=✓'">
                    Comprobar
                </button>
                <button class="boton-pista" onclick="mostrarPista()">
                    <img src="img/iconos/pista.png" 
                         alt="Pista" class="icono-boton"
                         onerror="this.src='https://via.placeholder.com/30x30?text=?'">
                    Pista
                </button>
            </div>
        </div>
    `;

    // Permitir enviar con Enter
    document.getElementById('respuesta').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            comprobarRespuesta();
        }
    });
}

function comprobarRespuesta() {
    const respuestaUsuario = parseInt(document.getElementById('respuesta').value);
    const resultadoDiv = document.getElementById('resultado');
    
    if (isNaN(respuestaUsuario)) {
        resultadoDiv.innerHTML = '<p class="incorrecto">¡Escribe un número primero!</p>';
        return;
    }
    
    if (respuestaUsuario === resultadoCorrecto) {
        puntuacionActual += 10;
        resultadoDiv.innerHTML = `
            <div class="feedback-correcto">
                <p class="correcto">¡Correcto! 🎉 +10 puntos</p>
                <p class="explicacion">${operacionActual.texto.toUpperCase()} ${resultadoCorrecto}</p>
            </div>
        `;
        
        // Recargar automáticamente después de 2 segundos
        setTimeout(() => {
            mostrarJuego();
        }, 2000);
    } else {
        resultadoDiv.innerHTML = `
            <div class="feedback-incorrecto">
                <p class="incorrecto">¡Ups! Intenta otra vez</p>
                <p class="pista-simple">El resultado es ${respuestaUsuario < resultadoCorrecto ? 'mayor' : 'menor'}</p>
            </div>
        `;
    }
}

function mostrarPista() {
    const resultadoDiv = document.getElementById('resultado');
    
    // Pistas más concretas y educativas
    let pista = "";
    if (operacionActual.simbolo === '+') {
        pista = `Suma los dos números: ${valores[0].valor} + ${valores[1].valor} = ${resultadoCorrecto}`;
    } else if (operacionActual.simbolo === '-') {
        pista = `Resta: ${valores[0].valor} - ${valores[1].valor} = ${resultadoCorrecto}`;
    } else {
        pista = `Multiplica: ${valores[0].valor} × ${valores[1].valor} = ${resultadoCorrecto}`;
    }
    
    resultadoDiv.innerHTML = `
        <div class="pista-detallada">
            <p>💡 ${pista}</p>
            <button onclick="ocultarPista()" class="boton-ocultar">Ocultar</button>
        </div>
    `;
}

function ocultarPista() {
    document.getElementById('resultado').innerHTML = '';
}