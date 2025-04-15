// config.js
export const Config = {
    API_URL: import.meta.env.VITE_API_URL || 'https://deckofcardsapi.com/api',
    MAX_FAVORITES: 20
};

// favoritos.js
import { Config } from './config';

export function guardarFavoritos(favoritos) {
    if (favoritos.length > Config.MAX_FAVORITES) {
        console.warn("Límite de favoritos alcanzado");
        return false;
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    return true;
}// Maneja los favoritos en localStorage
function agregarFavorito(codigo, imagen, nombre) {
    const favoritos = obtenerFavoritos();
    
    // Evitar duplicados
    if (!favoritos.some(fav => fav.codigo === codigo)) {
        favoritos.push({ codigo, imagen, nombre });
        guardarFavoritos(favoritos);
        alert("¡Añadido a favoritos!");
    } else {
        alert("Ya está en favoritos");
    }
}

function obtenerFavoritos() {
    const favoritosGuardados = localStorage.getItem('cartasFavoritas');
    return favoritosGuardados ? JSON.parse(favoritosGuardados) : [];
}

function guardarFavoritos(favoritos) {
    localStorage.setItem('cartasFavoritas', JSON.stringify(favoritos));
}

function mostrarFavoritos() {
    const app = document.getElementById("app");
    const favoritos = obtenerFavoritos();
    
    if (favoritos.length === 0) {
        app.innerHTML = '<div class="aviso">No tienes favoritos aún</div>';
        return;
    }
    
    app.innerHTML = `
        <div class="contenedor-favoritos">
            <h2>Tus Cartas Favoritas</h2>
            
            <div class="lista-favoritos">
                ${favoritos.map(fav => `
                    <div class="favorito">
                        <img src="${fav.imagen}" alt="${fav.nombre}">
                        <p>${fav.nombre}</p>
                        <button onclick="eliminarFavorito('${fav.codigo}')">Eliminar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function eliminarFavorito(codigo) {
    const favoritos = obtenerFavoritos().filter(fav => fav.codigo !== codigo);
    guardarFavoritos(favoritos);
    mostrarFavoritos(); // Refrescar la vista
}