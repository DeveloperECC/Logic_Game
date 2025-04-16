// Versión mejorada con manejo de errores
const API_BASE = 'https://deckofcardsapi.com/api/deck';

async function barajarMazo() {
  try {
    const response = await fetch(`${API_BASE}/new/shuffle/?deck_count=1`);
    if (!response.ok) throw new Error('Error al barajar');
    return await response.json();
  } catch (error) {
    console.error('Error barajando mazo:', error);
    throw error;
  }
}

async function sacarCartas(deckId, count) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}/draw/?count=${count}`);
    if (!response.ok) throw new Error('Error al sacar cartas');
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error('Error sacando cartas:', error);
    throw error;
  }
}

async function obtenerMazoCompleto() {
  try {
    const response = await fetch(`${API_BASE}/new/draw/?count=52`);
    if (!response.ok) throw new Error('Error al obtener mazo completo');
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error('Error obteniendo mazo completo:', error);
    throw error;
  }
}

window.barajarMazo = barajarMazo;
window.sacarCartas = sacarCartas;
window.obtenerMazoCompleto = obtenerMazoCompleto;