function mostrarRegistro() {
    const app = document.getElementById("app");
    
    app.innerHTML = `
        <div class="contenedor-registro">
            <h2>Registro para Niños</h2>
            
            <form id="formulario-registro">
                <div class="campo">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" required>
                </div>
                
                <div class="campo">
                    <label for="edad">Edad (5-12 años):</label>
                    <input type="number" id="edad" min="5" max="12" required>
                </div>
                
                <div class="campo">
                    <p>Elige tu avatar favorito:</p>
                    <div class="avatares">
                        <label>
                            <input type="radio" name="avatar" value="carta1" checked>
                            <img src="img/avatares/carta1.png" alt="Avatar 1">
                        </label>
                        <label>
                            <input type="radio" name="avatar" value="carta2">
                            <img src="img/avatares/carta2.png" alt="Avatar 2">
                        </label>
                    </div>
                </div>
                
                <button type="submit">Guardar</button>
            </form>
        </div>
    `;
    
    document.getElementById("formulario-registro").addEventListener("submit", guardarRegistro);
}

function guardarRegistro(evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const avatar = document.querySelector('input[name="avatar"]:checked').value;
    
    localStorage.setItem('registroNinio', JSON.stringify({
        nombre,
        edad,
        avatar
    }));
    
    alert("¡Registro guardado! Bienvenido " + nombre);
}