// Versión mejorada con manejo de errores
const API_BASE = 'https://deckofcardsapi.com/api/deck';

// Función mejorada para Android
async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    // Sistema de fallback para Android
    if (window.androidFallback) {
      return window.androidFallback.getLocalCards();
    }
    throw error;
  }
}

async function barajarMazo() {
  return fetchData(`${API_BASE}/new/shuffle/?deck_count=1`);
}

async function sacarCartas(deckId, count) {
  const data = await fetchData(`${API_BASE}/${deckId}/draw/?count=${count}`);
  return data.cards;
}

async function obtenerMazoCompleto() {
  const data = await fetchData(`${API_BASE}/new/draw/?count=52`);
  return data.cards;
}

// Exportación para Android
if (window.AndroidInterface) {
  window.AndroidInterface.registerAPI({
    barajarMazo,
    sacarCartas,
    obtenerMazoCompleto
  });
}

window.barajarMazo = barajarMazo;
window.sacarCartas = sacarCartas;
window.obtenerMazoCompleto = obtenerMazoCompleto;