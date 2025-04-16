let puntuacionActual = 0;
let operacionActual = '';
let resultadoCorrecto = 0;
let valores = [];

async function mostrarJuego() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="juego-matematico">
            <div class="puntaje-container">
                <span class="puntaje">Puntos: ${puntuacionActual}</span>
                <div class="operacion-actual">${operacionActual.simbolo || '?'}</div>
            </div>
            
            <div class="cartas-juego">
                <!-- Contenido se cargará dinámicamente -->
            </div>
            
            <div id="resultado"></div>
            
            <div class="botones-juego">
                <button class="boton-comprobar" onclick="comprobarRespuesta()">
                    <img src="img/iconos/comprobar.png" alt="Comprobar" class="icono-boton"
                         onerror="this.src='https://via.placeholder.com/30x30?text=✓'">
                    Comprobar
                </button>
                <button class="boton-pista" onclick="mostrarPista()">
                    <img src="img/iconos/pista.png" alt="Pista" class="icono-boton"
                         onerror="this.src='https://via.placeholder.com/30x30?text=?'">
                    Pista
                </button>
            </div>
        </div>
    `;

    try {
        await iniciarNuevoJuego();
    } catch (error) {
        console.error("Error en el juego:", error);
        document.getElementById('resultado').innerHTML = `
            <div class="error">
                <p>¡Error al cargar el juego!</p>
                <button onclick="mostrarJuego()" class="boton-reintentar">Reintentar</button>
            </div>
        `;
    }
}

async function iniciarNuevoJuego() {
    const mazo = await barajarMazo();
    const cartas = await sacarCartas(mazo.deck_id, 2); // Solo necesitamos 2 cartas
    
    if (cartas.length < 2) {
        throw new Error("No se pudieron obtener suficientes cartas");
    }

    valores = cartas.map(carta => {
        let valor;
        switch(carta.value.toLowerCase()) {
            case 'ace': case 'as': valor = 1; break;
            case 'jack': case 'jota': valor = 11; break;
            case 'queen': case 'reina': valor = 12; break;
            case 'king': case 'rey': valor = 13; break;
            default: valor = parseInt(carta.value) || 0;
        }
        return { valor, carta };
    });

    const operaciones = [
        { simbolo: '+', texto: 'suma', fn: (a, b) => a + b },
        { simbolo: '-', texto: 'resta', fn: (a, b) => a - b },
        { simbolo: '×', texto: 'multiplicación', fn: (a, b) => a * b }
    ];
    
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
    operacionActual = operacion;
    resultadoCorrecto = operacion.fn(valores[0].valor, valores[1].valor);

    // Actualizar la interfaz
    document.querySelector('.operacion-actual').textContent = operacion.simbolo;
    
    const cartasContainer = document.querySelector('.cartas-juego');
    cartasContainer.innerHTML = `
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
                <p class="explicacion">${operacionActual.texto}: ${valores[0].valor} ${operacionActual.simbolo} ${valores[1].valor} = ${resultadoCorrecto}</p>
            </div>
        `;
        
        // Recargar después de 1.5 segundos
        setTimeout(mostrarJuego, 1500);
    } else {
        resultadoDiv.innerHTML = `
            <div class="feedback-incorrecto">
                <p class="incorrecto">¡Incorrecto! Intenta de nuevo</p>
                <p class="pista-simple">Pista: El resultado es ${respuestaUsuario < resultadoCorrecto ? 'mayor' : 'menor'}</p>
            </div>
        `;
    }
}

function mostrarPista() {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="pista-detallada">
            <p>💡 ${operacionActual.texto}: ${valores[0].valor} ${operacionActual.simbolo} ${valores[1].valor} = ${resultadoCorrecto}</p>
            <button onclick="ocultarPista()" class="boton-ocultar">Ocultar</button>
        </div>
    `;
}

function ocultarPista() {
    document.getElementById('resultado').innerHTML = '';
}