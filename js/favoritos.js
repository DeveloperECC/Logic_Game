let favoritos = JSON.parse(localStorage.getItem('cartasFavoritas')) || [];

// Función mejorada para manejar favoritos
function toggleFavorito(codigoCarta, event) {
    event.stopPropagation();
    const index = favoritos.indexOf(codigoCarta);
    
    if (index === -1) {
        favoritos.push(codigoCarta);
        event.target.innerHTML = '❤️';
        mostrarToast('Carta añadida a favoritos');
    } else {
        favoritos.splice(index, 1);
        event.target.innerHTML = '★';
        mostrarToast('Carta removida de favoritos');
    }
    
    localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
}

// Función para mostrar favoritos con efecto hover
async function mostrarFavoritos() {
    const app = document.getElementById("app");
    
    if (favoritos.length === 0) {
        app.innerHTML = `
            <div class="empty-state">
                <img src="img/iconos/corazon-roto.png" alt="Sin favoritos">
                <h3>No tienes cartas favoritas</h3>
                <button onclick="mostrarInicio()" class="btn">Buscar cartas</button>
            </div>
        `;
        return;
    }

    app.innerHTML = '<div class="loading">Cargando tus cartas favoritas...</div>';

    try {
        const cartas = await obtenerCartasFavoritas();
        renderizarCartasFavoritas(cartas);
    } catch (error) {
        console.error("Error:", error);
        app.innerHTML = `
            <div class="error-state">
                <p>Error al cargar favoritos</p>
                <button onclick="mostrarFavoritos()" class="btn">Reintentar</button>
            </div>
        `;
    }
}

// Función auxiliar para obtener cartas
async function obtenerCartasFavoritas() {
    return await Promise.all(
        favoritos.map(async codigo => {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?cards=${codigo}`);
            const data = await response.json();
            return data.cards[0];
        })
    );
}

// Renderizado con efectos hover
function renderizarCartasFavoritas(cartas) {
    const app = document.getElementById("app");
    
    app.innerHTML = `
        <div class="favoritos-container">
            <h2>Tus Cartas Favoritas <span class="counter">${cartas.length}</span></h2>
            <div class="cartas-grid">
                ${cartas.map(carta => `
                    <div class="carta-container" data-code="${carta.code}">
                        <div class="carta-wrapper">
                            <img src="${carta.image}" alt="${carta.value} de ${carta.suit}" class="carta-img">
                            
                            <div class="carta-overlay">
                                <button class="btn-accion btn-api" onclick="mostrarAPICarta('${carta.code}', event)">
                                    <img src="img/iconos/api.png" alt="Ver API">
                                </button>
                                <button class="btn-accion btn-info" onclick="mostrarDetalleCarta('${carta.code}', event)">
                                    <img src="img/iconos/info.png" alt="Detalles">
                                </button>
                                <button class="btn-accion btn-eliminar" onclick="eliminarFavorito('${carta.code}', event)">
                                    <img src="img/iconos/eliminar.png" alt="Eliminar">
                                </button>
                            </div>
                        </div>
                        <div class="carta-footer">
                            <span>${carta.value} de ${carta.suit}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Función para mostrar datos de la API
function mostrarAPICarta(codigoCarta, event) {
    event.stopPropagation();
    window.open(`https://deckofcardsapi.com/api/deck/new/draw/?cards=${codigoCarta}`, '_blank');
}

// Función para eliminar favoritos
function eliminarFavorito(codigoCarta, event) {
    event.stopPropagation();
    
    favoritos = favoritos.filter(c => c !== codigoCarta);
    localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
    
    const cartaElement = document.querySelector(`.carta-container[data-code="${codigoCarta}"]`);
    if (cartaElement) {
        cartaElement.classList.add('removing');
        setTimeout(() => {
            cartaElement.remove();
            if (favoritos.length === 0) mostrarFavoritos();
        }, 300);
    }
}

// Función auxiliar para notificaciones
function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 2000);
}