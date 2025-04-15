/// Conecta con la API Deck of Cards
async function barajarMazo() {
    try {
        const respuesta = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al barajar:", error);
        return null;
    }
}

async function sacarCartas(idMazo, cantidad) {
    try {
        const respuesta = await fetch(`https://deckofcardsapi.com/api/deck/${idMazo}/draw/?count=${cantidad}`);
        const datos = await respuesta.json();
        return datos.cards;
    } catch (error) {
        console.error("Error al sacar cartas:", error);
        return [];
    }
}