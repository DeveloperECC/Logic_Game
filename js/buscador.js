// Configura el buscador y filtro
function iniciarBuscador() {
    const buscador = document.getElementById("buscador");
    const filtro = document.getElementById("filtro");

    // Traducción de términos
    const traducciones = {
        'corazones': 'hearts',
        'diamantes': 'diamonds',
        'treboles': 'clubs',
        'picas': 'spades',
        'as': 'ace',
        'jota': 'jack',
        'reina': 'queen',
        'rey': 'king'
    };

    buscador.addEventListener("input", function() {
        const termino = this.value.toLowerCase();
        const paloSeleccionado = filtro.value;
        
        document.querySelectorAll(".carta").forEach(carta => {
            const paloCarta = carta.dataset.palo;
            const valorCarta = carta.querySelector("img").alt.toLowerCase();
            
            // Buscar tanto en español como en inglés
            const terminoTraducido = traducciones[termino] || termino;
            const coincideTexto = valorCarta.includes(terminoTraducido);
            const coincidePalo = paloSeleccionado === 'all' || paloCarta === paloSeleccionado;
            
            carta.style.display = (coincideTexto && coincidePalo) ? 'block' : 'none';
        });
    });

    filtro.addEventListener("change", function() {
        buscador.dispatchEvent(new Event('input'));
    });
}