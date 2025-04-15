function mostrarInformacion() {
    const app = document.getElementById("app");
    
    // Datos personalizables (cada estudiante modifica estos valores)
    const studentData = {
        nombre: "Tu Nombre Completo",
        github: "tuUsuarioGitHub",
        descripcion: "Esta app utiliza la API Deck of Cards para crear juegos educativos con cartas.",
        version: "V.1.0.0"
    };

    // URL del logo de la API (¡Nueva línea agregada!)
    const logoAPI = "https://deckofcardsapi.com/static/img/logo.png";
    
    // URL de imagen de carta de ejemplo (también puedes añadir esto)
    const cartaEjemplo = "https://deckofcardsapi.com/static/img/KD.png"; // Rey de Diamantes

    app.innerHTML = `
        <div class="contenedor-informacion">
            <div class="header-info">
                <!-- Usamos la variable logoAPI aquí -->
                <img src="${logoAPI}" alt="Logo API" class="logo-api" 
                     onerror="this.src='img/logo-local.png'">
                <h1>Deck of Cards API</h1>
            </div>
            
            <div class="card-info">
                <!-- Usamos la variable cartaEjemplo aquí -->
                <img src="${cartaEjemplo}" alt="Ejemplo de carta" class="carta-demo"
                     onerror="this.src='img/carta-error.png'">
                
                <div class="texto-info">
                    <p>${studentData.descripcion}</p>
                    <div class="datos-personales">
                        <p><strong>Estudiante:</strong> ${studentData.nombre}</p>
                        <p><strong>GitHub:</strong> ${studentData.github}</p>
                        <p class="version">${studentData.version}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}