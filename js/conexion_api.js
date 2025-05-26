// Logic_Game-main/js/conexion_api.js

const API_BASE = 'https://deckofcardsapi.com/api/deck';

// 🔄 Baraja un nuevo mazo y devuelve su deck_id
export async function barajarMazo() {
  try {
    const respuesta = await fetch(`${API_BASE}/new/shuffle/?deck_count=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP al barajar: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log('[API] Mazo barajado, ID:', datos.deck_id);
    return datos.deck_id;
  } catch (error) {
    console.error('Error al barajar mazo:', error);
    if (window.androidFallback && typeof window.androidFallback.getFallbackDeckId === 'function') {
      console.log('[API] Usando fallback de Android para deck_id');
      return window.androidFallback.getFallbackDeckId();
    }
    return null;
  }
}

// 🃏 Obtiene cartas (por defecto, un mazo nuevo de 52, o de un deckId específico)
export async function obtenerCartas(deckId = 'new', count = 52) {
  const url = deckId === 'new' 
    ? `${API_BASE}/new/draw/?count=${count}` // 'new/draw' también baraja
    : `${API_BASE}/${deckId}/draw/?count=${count}`;
  try {
    const respuesta = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP al obtener cartas: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    if (!datos.success && datos.remaining !== 0) { // A veces la API devuelve success:false incluso si hay cartas
        console.warn(`[API] API indicó no éxito pero hay ${datos.remaining} cartas restantes para deck ${deckId}. Cartas devueltas:`, datos.cards.length);
    }
    console.log(`[API] ${datos.cards ? datos.cards.length : 0} cartas obtenidas. Restantes en mazo: ${datos.remaining}`);
    return datos.cards || []; // Asegurar que siempre devuelva un array
  } catch (error) {
    console.error('Error al obtener cartas:', error);
    if (window.androidFallback && typeof window.androidFallback.getLocalCards === 'function') {
      console.log('[API] Usando fallback de Android para obtener cartas');
      return window.androidFallback.getLocalCards();
    }
    return [];
  }
}

// ✨ Obtiene una o más cartas aleatorias de un mazo nuevo (y lo desecha)
export async function obtenerCartasAleatorias(cantidad = 1) {
  try {
    // Usamos /new/draw/ que baraja y saca en un solo paso.
    // El mazo 'new' es temporal y no necesitamos su ID para esta operación.
    const respuesta = await fetch(`${API_BASE}/new/draw/?count=${cantidad}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP al obtener cartas aleatorias: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    if (datos.success && datos.cards && datos.cards.length > 0) {
      console.log(`[API] ${datos.cards.length} cartas aleatorias obtenidas.`);
      return datos.cards;
    } else {
      console.warn('[API] No se obtuvieron cartas aleatorias o la respuesta no fue exitosa:', datos);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener cartas aleatorias:', error);
    // Considerar fallback si tienes uno específico para esto
    return [];
  }
}


// ❗ IMPORTANTE: La función 'sacarCartasDesdeMazoExistente' (antes sacarCartas)
// Si la necesitas para sacar cartas de un mazo previamente barajado con 'barajarMazo()'.
/*
export async function sacarCartasDesdeMazoExistente(deckId, count = 1) {
  if (!deckId) {
    console.error('[API] Se necesita un deck_id para sacar cartas de un mazo existente.');
    return [];
  }
  try {
    const respuesta = await fetch(`${API_BASE}/${deckId}/draw/?count=${count}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP al sacar cartas: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    if (!datos.success && datos.remaining !== 0) {
        console.warn(`[API] La API indicó que no se pudo sacar cartas del mazo ${deckId}:`, datos);
        return []; // Devolver vacío si la API dice que no tuvo éxito pero no es por mazo vacío
    }
    console.log(`[API] ${datos.cards ? datos.cards.length : 0} cartas sacadas del mazo ${deckId}. Restantes: ${datos.remaining}`);
    return datos.cards || [];
  } catch (error) {
    console.error(`Error al sacar ${count} cartas del mazo ${deckId}:`, error);
    return [];
  }
}
*/


// 📲 Compatibilidad con Android WebView
if (window.AndroidInterface && typeof window.AndroidInterface.registerAPI === 'function') {
  console.log('[API] Registrando funciones en AndroidInterface...');
  const funcionesParaAndroid = {
    barajarMazo,
    obtenerCartas, // Esta función puede obtener cartas de un mazo nuevo o existente
    obtenerCartasAleatorias
    // Si implementas y exportas sacarCartasDesdeMazoExistente, añádela aquí:
    // sacarCartasDesdeMazoExistente 
  };
  window.AndroidInterface.registerAPI(funcionesParaAndroid);
} else if (window.AndroidInterface) {
    console.warn('[API] window.AndroidInterface existe, pero registerAPI no es una función.');
}

/* 
// Las siguientes asignaciones a 'window' se vuelven redundantes si todos los módulos JS
// usan 'import' para obtener estas funciones. Se comentan para promover una estructura modular.
// window.barajarMazo = barajarMazo;
// window.obtenerCartas = obtenerCartas;
// window.obtenerCartasAleatorias = obtenerCartasAleatorias;
// window.sacarCartasDesdeMazoExistente = sacarCartasDesdeMazoExistente;
*/

console.log('[conexion_api.js] Módulo cargado. Funciones exportadas: barajarMazo, obtenerCartas, obtenerCartasAleatorias.');