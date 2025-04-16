// conexion_api.js

/**
 * Baraja un nuevo mazo de cartas.
 * @returns {Promise<Object>} Objeto con información del mazo, incluyendo deck_id.
 */
async function barajarMazo() {
    try {
      const respuesta = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const datos = await respuesta.json();
      return datos; // Contiene deck_id, remaining, success...
    } catch (error) {
      console.error('Error al barajar el mazo:', error);
      throw error;
    }
  }
  
  /**
   * Saca una cantidad específica de cartas desde un mazo.
   * @param {string} deck_id - ID del mazo.
   * @param {number} cantidad - Número de cartas a sacar.
   * @returns {Promise<Array>} Array de cartas obtenidas.
   */
  async function sacarCartas(deck_id, cantidad) {
    try {
      const respuesta = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${cantidad}`);
      const datos = await respuesta.json();
      return datos.cards; // Array de cartas
    } catch (error) {
      console.error('Error al sacar cartas del mazo:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene una carta específica por su código.
   * @param {string} codigo - Código de la carta (por ejemplo, "AS" para As de Espadas).
   * @returns {Promise<Object>} Objeto de la carta obtenida.
   */
  async function obtenerCartaPorCodigo(codigo) {
    try {
      const respuesta = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?cards=${codigo}`);
      const datos = await respuesta.json();
      return datos.cards[0]; // Una sola carta
    } catch (error) {
      console.error('Error al obtener la carta por código:', error);
      throw error;
    }
  }
  
  