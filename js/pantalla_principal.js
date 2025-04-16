async function mostrarInicio() {
    const app = document.getElementById("app");
    app.innerHTML = '<div class="cargando">Cargando cartas...</div>';
    
    try {
        const mazo = await barajarMazo();
        const cartas = await sacarCartas(mazo.deck_id, 52); // Sacar todo el mazo
        
        app.innerHTML = `
            <h2>Mazo Completo</h2>
            <div class="filtros">
                <button onclick="filtrarPorPalo('all')">Todas</button>
                <button onclick="filtrarPorPalo('hearts')">♥ Corazones</button>
                <button onclick="filtrarPorPalo('diamonds')">♦ Diamantes</button>
                <button onclick="filtrarPorPalo('clubs')">♣ Tréboles</button>
                <button onclick="filtrarPorPalo('spades')">♠ Picas</button>
            </div>
            <div class="contenedor-cartas" id="contenedor-cartas">
                ${cartas.map(carta => crearHtmlCarta(carta)).join('')}
            </div>
        `;
    } catch (error) {
        app.innerHTML = '<div class="error">Error al cargar las cartas</div>';
    } finally {
        // Asegurarnos de que el mensaje de carga se elimine
        const cargandoElement = app.querySelector('.cargando');
        if (cargandoElement) {
            cargandoElement.remove();
        }
    }
}

function crearHtmlCarta(carta) {
    return `
        <div class="carta" data-palo="${carta.suit.toLowerCase()}">
            <img src="${carta.image}" alt="${carta.value} de ${carta.suit}" 
                 onerror="this.src='img/carta-error.png'">
            <button class="boton-favorito" onclick="agregarFavorito('${carta.code}')">★</button>
        </div>
    `;
}

function filtrarPorPalo(palo) {
    const cartas = document.querySelectorAll('.carta');
    cartas.forEach(carta => {
        carta.style.display = (palo === 'all' || carta.dataset.palo === palo) ? 'flex' : 'none';
    });
}