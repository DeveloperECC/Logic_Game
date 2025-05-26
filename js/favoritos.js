// Logic_Game-main/js/favoritos.js

const storageAccesibleFav = (() => {
  try {
    const testKey = '__storage_test_fav__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    console.warn("localStorage no está disponible. Los favoritos no funcionarán correctamente.");
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
})();

export function mostrarFavoritos(appContainer) {
    console.log("Mostrando pantalla de Favoritos...");
    if (!appContainer) {
        console.error("Error en mostrarFavoritos: appContainer no fue proporcionado.");
        return;
    }

    const favoritos = JSON.parse(storageAccesibleFav.getItem('favoritos')) || [];
    
    let htmlFavoritos = `
      <h1>❤️ Tus Cartas Favoritas</h1>
    `;
    
    if (favoritos.length === 0) {
        htmlFavoritos += `
            <div class="sin-favoritos">
              <p>Aún no tienes cartas favoritas.</p>
              <p>Agrega algunas desde la pantalla de inicio explorando las cartas.</p>
              <button onclick="appCargarPantalla('inicio')" class="btn-secundario">Ir a Inicio</button>
            </div>
        `;
    } else {
        htmlFavoritos += `
            <div class="card-container" id="lista-favoritos-render">
                ${favoritos.map(carta => `
                    <div class="card" data-code="${carta.code}">
                      <img src="${carta.image}" alt="${carta.value} of ${carta.suit}">
                      <button class="favorito" onclick="appToggleFavorito('${carta.code}')">
                        <img src="assets/img/iconos/favorito-lleno.png" alt="Quitar de favoritos">
                      </button>
                    </div>
                `).join('')}
            </div>
            <button onclick="appLimpiarFavoritos()" class="btn-limpiar">🗑️ Limpiar Todos los Favoritos</button>
        `;
    }
    appContainer.innerHTML = htmlFavoritos;
}
  
window.appLimpiarFavoritos = function() {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS tus favoritos? Esta acción no se puede deshacer.')) {
      storageAccesibleFav.removeItem('favoritos');
      if (typeof window.appCargarPantalla === 'function') {
          window.appCargarPantalla('favoritos'); 
      } else {
          console.error("appCargarPantalla no está definida globalmente para refrescar favoritos.");
      }

      if (typeof window.appMostrarMensaje === 'function') {
          window.appMostrarMensaje('Todos los favoritos fueron eliminados.');
      } else {
          alert('Todos los favoritos fueron eliminados.');
      }
    }
}

console.log("[favoritos.js] Módulo cargado. Funciones exportadas: mostrarFavoritos. Función global: appLimpiarFavoritos.");