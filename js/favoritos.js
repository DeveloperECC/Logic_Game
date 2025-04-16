// Almacenamiento
let favoritos = JSON.parse(localStorage.getItem('cartasFavoritas')) || [];

// Toggle favorito
function agregarFavorito(codigo, e) {
    e.stopPropagation();
    const index = favoritos.indexOf(codigo);
    index === -1 ? favoritos.push(codigo) : favoritos.splice(index, 1);
    localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
    e.target.textContent = index === -1 ? '❤️' : '★';
}

// Mostrar favoritos
async function mostrarFavoritos() {
    const app = document.getElementById("app");
    
    if (favoritos.length === 0) {
        app.innerHTML = `<div class="empty">No hay favoritos</div>`;
        return;
    }

    app.innerHTML = '<div class="loading">Cargando...</div>';

    try {
        const cartas = await Promise.all(
            favoritos.map(codigo => 
                fetch(`https://deckofcardsapi.com/api/deck/new/draw/?cards=${codigo}`)
                .then(res => res.json())
                .then(data => data.cards[0])
        );

        app.innerHTML = `
            <h2>Favoritos (${favoritos.length})</h2>
            <div class="grid-fav">
                ${cartas.map(carta => `
                    <div class="card-fav" onclick="mostrarDetalleCarta('${carta.code}')">
                        <img src="${carta.image}" alt="${carta.value} de ${carta.suit}">
                        <button class="btn-del" onclick="eliminarFav('${carta.code}', event)">×</button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        app.innerHTML = `<div class="error">Error al cargar</div>`;
    }
}

// Eliminar favorito
function eliminarFav(codigo, e) {
    e.stopPropagation();
    favoritos = favoritos.filter(c => c !== codigo);
    localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
    e.target.closest('.card-fav').remove();
    if (favoritos.length === 0) mostrarFavoritos();
}