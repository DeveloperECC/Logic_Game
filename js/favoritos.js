// config.js
let favoritos = JSON.parse(localStorage.getItem('cartasFavoritas')) || [];

function agregarFavorito(codigoCarta) {
    // Verificar si ya está en favoritos
    if (!favoritos.includes(codigoCarta)) {
        favoritos.push(codigoCarta);
        localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
        
        // Mostrar feedback visual
        const boton = event.target;
        boton.textContent = '❤️';
        boton.style.backgroundColor = '#ff4081';
        setTimeout(() => {
            boton.textContent = '★';
            boton.style.backgroundColor = '';
        }, 1000);
    } else {
        // Si ya está, lo quitamos
        const index = favoritos.indexOf(codigoCarta);
        if (index > -1) {
            favoritos.splice(index, 1);
            localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
            
            const boton = event.target;
            boton.textContent = '☆';
            setTimeout(() => {
                boton.textContent = '★';
            }, 1000);
        }
    }
}

async function mostrarFavoritos() {
    const app = document.getElementById("app");
    
    if (favoritos.length === 0) {
        app.innerHTML = `
            <div class="sin-favoritos">
                <img src="https://raw.githubusercontent.com/DeveloperECC/Logic_Game/main/img/iconos/corazon-roto.png" alt="Sin favoritos">
                <p>Aún no tienes cartas favoritas</p>
                <button onclick="mostrarInicio()">Buscar cartas</button>
            </div>
        `;
        return;
    }

    app.innerHTML = '<div class="cargando">Cargando tus favoritos...</div>';

    try {
        // Obtener detalles de todas las cartas favoritas
        const cartasCompletas = await Promise.all(
            favoritos.map(async codigo => {
                const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?cards=${codigo}`);
                const data = await response.json();
                return data.cards[0];
            })
        );

        app.innerHTML = `
            <h2>Tus Cartas Favoritas</h2>
            <div class="contenedor-favoritos">
                ${cartasCompletas.map(carta => `
                    <div class="carta-favorito" data-codigo="${carta.code}">
                        <img src="${carta.image}" alt="${carta.value} de ${carta.suit}" 
                             onerror="this.src='https://via.placeholder.com/150x200?text=Carta+No+Disponible'">
                        <div class="info-favorito">
                            <h3>${carta.value} de ${carta.suit}</h3>
                            <small>Código: ${carta.code}</small>
                        </div>
                        <button class="btn-eliminar" onclick="eliminarFavorito('${carta.code}')">
                            ❌
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        app.innerHTML = `
            <div class="error">
                <p>Error al cargar favoritos</p>
                <button onclick="mostrarFavoritos()">Reintentar</button>
            </div>
        `;
        console.error("Error cargando favoritos:", error);
    }
}

function eliminarFavorito(codigoCarta) {
    const index = favoritos.indexOf(codigoCarta);
    if (index > -1) {
        favoritos.splice(index, 1);
        localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
        
        // Actualizar la vista
        document.querySelector(`.carta-favorito[data-codigo="${codigoCarta}"]`).remove();
        
        // Si no quedan favoritos, mostrar mensaje
        if (favoritos.length === 0) {
            mostrarFavoritos();
        }
    }
}

// Actualizar pantalla_principal.js para incluir:
function crearHtmlCarta(carta) {
    const esFavorita = favoritos.includes(carta.code);
    return `
        <div class="carta" data-palo="${carta.suit.toLowerCase()}">
            <img src="${carta.image}" alt="${carta.value} de ${carta.suit}" 
                 onerror="this.src='https://via.placeholder.com/150x200?text=Carta+No+Disponible'">
            <button class="boton-favorito ${esFavorita ? 'favorito-activo' : ''}" 
                    onclick="agregarFavorito('${carta.code}')">
                ${esFavorita ? '❤️' : '★'}
            </button>
        </div>
    `;
}