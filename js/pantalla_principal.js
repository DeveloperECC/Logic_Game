async function mostrarInicio() {
    const app = document.getElementById("app");
    app.innerHTML = '<div class="cargando">Cargando cartas...</div>';
    
    try {
        const mazo = await barajarMazo();
        const cartas = await sacarCartas(mazo.deck_id, 52);
        
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
        console.error("Error al cargar cartas:", error);
        app.innerHTML = '<div class="error">Error al cargar las cartas. Intenta recargar la página.</div>';
    }
}

function crearHtmlCarta(carta) {
    return `
        <div class="carta" data-palo="${carta.suit.toLowerCase()}" onclick="mostrarDetalleCarta('${carta.code}')">
            <img src="${carta.image}" alt="${carta.value} de ${carta.suit}" 
                 onerror="this.src='img/carta-error.png'">
            <button class="boton-favorito" onclick="event.stopPropagation(); agregarFavorito('${carta.code}')">★</button>
            <button class="boton-api" onclick="event.stopPropagation(); abrirApiCarta('${carta.code}')">Ver API</button>
        </div>
    `;
}

function abrirApiCarta(codigoCarta) {
    window.open(`https://deckofcardsapi.com/api/deck/new/draw/?cards=${codigoCarta}`, '_blank');
}

function filtrarPorPalo(palo) {
    const cartas = document.querySelectorAll('.carta');
    cartas.forEach(carta => {
        carta.style.display = (palo === 'all' || carta.dataset.palo === palo) ? 'block' : 'none';
    });
    function crearHtmlCarta(carta) {
        const esFav = favoritos.includes(carta.code);
        return `
            <div class="carta" data-palo="${carta.suit.toLowerCase()}">
                <img src="${carta.image}" alt="${carta.value} de ${carta.suit}">
                <button class="fav-btn" onclick="agregarFavorito('${carta.code}', event)">
                    ${esFav ? '❤️' : '★'}
                </button>
            </div>
        `;
    }
}