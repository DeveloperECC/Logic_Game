// Logic_Game-main/js/pantalla_principal.js

// Si esta pantalla necesita funciones de la API (como obtener todas las cartas para el explorador)
// las importará. Si la llamada fetch se queda aquí, no es necesario.
import { obtenerCartas as obtenerTodasLasCartasDesdeAPI } from './conexion_api.js'; // Renombrado para claridad si se usa

let todasLasCartasCacheLocalPp = [];
let mazoActualFiltroPp = 'all';

const storageAccesiblePp = (() => {
  try {
    const testKey = '__storage_test_pp__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    console.warn("localStorage no está disponible en pantalla_principal.js. Favoritos no funcionarán correctamente.");
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
})();

function esFavoritaLocalPp(codigoCarta) {
  const favoritos = JSON.parse(storageAccesiblePp.getItem('favoritos') || '[]');
  return favoritos.some(carta => carta.code === codigoCarta);
}

export async function mostrarInicio(appContainer) {
  console.log("Mostrando pantalla de inicio (pantalla_principal.js)...");
  if (!appContainer) {
    console.error("Error en mostrarInicio: appContainer no fue proporcionado.");
    return;
  }

  appContainer.innerHTML = `
    <h1>Explora Todas las Cartas</h1>
    <div class="buscador-container">
      <input type="text" id="buscador-inicio" placeholder="🔍 Buscar por valor (ej: ACE, KING, 5) o palo...">
      <select id="filtro-palo-inicio">
        <option value="all">Todos los palos</option>
        <option value="HEARTS">♥ Corazones</option>
        <option value="DIAMONDS">♦ Diamantes</option>
        <option value="CLUBS">♣ Tréboles</option>
        <option value="SPADES">♠ Picas</option>
      </select>
    </div>
    <div id="loading-inicio" class="mensaje-carga"><p>Cargando cartas...</p></div>
    <div id="card-container-inicio" class="card-container"></div>
  `;

  const loadingDiv = document.getElementById('loading-inicio');
  const buscadorInput = document.getElementById('buscador-inicio');
  const filtroPaloSelect = document.getElementById('filtro-palo-inicio');

  if (todasLasCartasCacheLocalPp.length === 0) {
    try {
      if (loadingDiv) loadingDiv.style.display = 'block';
      // Usar la función importada si se prefiere centralizar las llamadas API
      // todasLasCartasCacheLocalPp = await obtenerTodasLasCartasDesdeAPI('new', 52);

      // O mantener el fetch directo si es específico para esta pantalla:
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
      if (!response.ok) {
        throw new Error(`Error HTTP al cargar cartas: ${response.status}`);
      }
      const data = await response.json();
      todasLasCartasCacheLocalPp = data.cards || [];
      console.log("Cartas cargadas desde API en pantalla_principal:", todasLasCartasCacheLocalPp.length);
      renderizarCartasPp(todasLasCartasCacheLocalPp);
    } catch (error) {
      console.error('Error al cargar cartas en pantalla_principal:', error);
      if (loadingDiv) loadingDiv.innerHTML = `<p class="mensaje-error">Error al cargar las cartas. Intenta recargar.</p>`;
    } finally {
      if (loadingDiv) loadingDiv.style.display = 'none';
    }
  } else {
    console.log("Usando cartas cacheadas localmente en pantalla_principal.");
    renderizarCartasPp(todasLasCartasCacheLocalPp);
    if (loadingDiv) loadingDiv.style.display = 'none';
  }

  if (buscadorInput) buscadorInput.addEventListener('input', () => filtrarCartasPp());
  if (filtroPaloSelect) filtroPaloSelect.addEventListener('change', function() {
    mazoActualFiltroPp = this.value;
    filtrarCartasPp();
  });
}

function renderizarCartasPp(cartas) {
  const container = document.getElementById('card-container-inicio');
  if (!container) {
    console.error("Contenedor #card-container-inicio no encontrado.");
    return;
  }
  if (!cartas || cartas.length === 0) {
    container.innerHTML = '<p class="mensaje-vacio">No se encontraron cartas con esos filtros.</p>';
    return;
  }
  container.innerHTML = cartas.map(carta => `
    <div class="card" data-code="${carta.code}">
      <img src="${carta.image}" alt="${carta.value} ${carta.suit}">
      <button class="favorito" onclick="appToggleFavorito('${carta.code}')">
        <img src="assets/img/iconos/${esFavoritaLocalPp(carta.code) ? 'favorito-lleno.png' : 'favorito.png'}" alt="Favorito">
      </button>
    </div>
  `).join('');
}

function filtrarCartasPp() {
  const buscadorInput = document.getElementById('buscador-inicio');
  if (!buscadorInput) return;
  const texto = buscadorInput.value.toLowerCase();
  
  const filtradas = todasLasCartasCacheLocalPp.filter(carta => {
    const valorCarta = carta.value ? carta.value.toLowerCase() : '';
    const paloCarta = carta.suit ? carta.suit.toLowerCase() : '';
    const coincideTexto = valorCarta.includes(texto) || 
                         paloCarta.startsWith(texto) ||
                         `${valorCarta} ${paloCarta}`.includes(texto);
    const coincidePalo = mazoActualFiltroPp === 'all' || (carta.suit && carta.suit === mazoActualFiltroPp);
    return coincideTexto && coincidePalo;
  });
  renderizarCartasPp(filtradas);
}

// --- FUNCIONES GLOBALES PARA FAVORITOS Y MENSAJES ---
// Estas funciones son usadas por onclick en HTML generado y por otros módulos.

window.appToggleFavorito = function(codigoCarta) {
  console.log("[pantalla_principal.js] appToggleFavorito para:", codigoCarta);
  let favoritos = JSON.parse(storageAccesiblePp.getItem('favoritos') || '[]');
  const carta = todasLasCartasCacheLocalPp.find(c => c.code === codigoCarta); 
  
  if (!carta && !favoritos.some(fav => fav.code === codigoCarta)) {
    // Si la carta no está en el caché local Y tampoco en favoritos (podría ser una carta de otra pantalla)
    // Intentamos buscarla en el caché de `favoritos.js` si este expone su lista de favoritos
    // Esto es más complejo y podría requerir un gestor de estado o pasar datos entre módulos.
    // Por ahora, asumimos que `todasLasCartasCacheLocalPp` es la fuente principal para añadir.
    // O si `favoritos.js` es el único que puede añadir, este `appToggleFavorito` aquí
    // solo se encargaría de la parte visual de la pantalla de inicio.
    // Para una solución simple ahora, si la carta no está en el caché de esta pantalla,
    // y no es para remover, no podemos añadirla.
    console.warn("Carta no encontrada en caché local de pantalla_principal para añadir a favoritos:", codigoCarta);
    // No hacer nada si no podemos encontrar los detalles de la carta para añadirla.
    // La lógica de añadir debería originarse donde la carta completa está disponible.
    // Sin embargo, SÍ podemos removerla si ya existe en favoritos.
    const indiceExistente = favoritos.findIndex(fav => fav.code === codigoCarta);
    if (indiceExistente === -1) { // No está en favoritos y no la encontramos para añadir
        window.appMostrarMensaje('Error: No se pudo encontrar la carta para añadir a favoritos.');
        return;
    }
  }

  const indiceFavorito = favoritos.findIndex(fav => fav.code === codigoCarta);
  
  if (indiceFavorito > -1) {
    favoritos.splice(indiceFavorito, 1);
    window.appMostrarMensaje('Carta removida de tus favoritos');
  } else {
    if (carta) { // Solo añadir si encontramos la carta en el caché local de esta pantalla
        favoritos.push({ code: carta.code, image: carta.image, value: carta.value, suit: carta.suit });
        window.appMostrarMensaje('¡Carta añadida a favoritos!');
    } else {
        // Esto no debería pasar si el chequeo anterior funcionó, pero por si acaso.
        window.appMostrarMensaje('Error: Detalles de la carta no disponibles para añadir a favoritos.');
        return;
    }
  }
  storageAccesiblePp.setItem('favoritos', JSON.stringify(favoritos));
  
  // Actualizar TODOS los botones de favorito en la página actual que coincidan con este código de carta
  // Esto es importante si la misma carta aparece múltiples veces o si estamos en la pantalla de favoritos.
  const todosLosBotonesDeEstaCarta = document.querySelectorAll(`.card[data-code="${codigoCarta}"] .favorito img`);
  todosLosBotonesDeEstaCarta.forEach(imgBoton => {
    imgBoton.src = `assets/img/iconos/${esFavoritaLocalPp(codigoCarta) ? 'favorito-lleno.png' : 'favorito.png'}`;
  });

  // Si estamos en la pantalla de favoritos, y quitamos un favorito, la vista podría necesitar recargarse.
  // Esto lo maneja favoritos.js al llamar a appToggleFavorito y luego posiblemente recargar su propia vista.
}

window.appMostrarMensaje = function(mensaje) {
  const toastId = 'toast-mensaje-app-global'; // ID único para el toast global
  let toast = document.getElementById(toastId);
  if (!toast) {
    toast = document.createElement('div');
    toast.id = toastId;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'var(--color-secundario, #2ecc71)';
    toast.style.color = 'white';
    toast.style.padding = '12px 25px';
    toast.style.borderRadius = '25px';
    toast.style.zIndex = '2000';
    toast.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in-out, bottom 0.3s ease-in-out'; // Añadir transición para bottom
    document.body.appendChild(toast);
  }
  
  toast.textContent = mensaje;
  toast.style.opacity = '1';
  toast.style.bottom = '80px'; // Asegurar posición inicial

  if (toast.timeoutId) clearTimeout(toast.timeoutId);

  toast.timeoutId = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.bottom = '60px'; // Mover hacia abajo al desaparecer
    // No remover, se reutiliza.
  }, 2500);
}

console.log("[pantalla_principal.js] Módulo cargado. Exporta: mostrarInicio. Globales: appToggleFavorito, appMostrarMensaje.");