function mostrarInformacion() {
    const app = document.getElementById("app");
    
    const studentData = {
        nombre: "Elmer Cabrera Cortez",
        github: "DeveloperECC",
        descripcion: "¡Aprende matemáticas y lógica jugando con cartas! Esta app combina la magia de los naipes con educación interactiva para todas las edades.",
        version: "V.1.0.0",
        apiDescripcion: "La API Deck of Cards nos proporciona mazos virtuales, cartas aleatorias y funcionalidades para crear experiencias educativas únicas."
    };

    app.innerHTML = `
        <div class="contenedor-informacion">
            <div class="header-info">
                <img src="img/logo-api.png" alt="Logo API" class="logo-api" 
                     onerror="this.src='https://deckofcardsapi.com/static/img/logo.png'">
                <h1>Aprende con cartas mágicas</h1>
            </div>
            
            <div class="card-info">
                <div class="carta-especial">
                    <img src="img/fondos/carta-magica.png" alt="Carta educativa" 
                         onerror="this.src='https://deckofcardsapi.com/static/img/KH.png'">
                </div>
                
                <div class="texto-info">
                    <h2>✨ Sobre la App</h2>
                    <p>${studentData.descripcion}</p>
                    
                    <h2>🃏 Sobre la API</h2>
                    <p>${studentData.apiDescripcion}</p>
                    
                    <div class="datos-personales">
                        <h2>👨‍💻 Desarrollador</h2>
                        <p><strong>Nombre:</strong> ${studentData.nombre}</p>
                        <p><strong>GitHub:</strong> 
                            <a href="https://github.com/${studentData.github}" target="_blank">
                                @${studentData.github}
                            </a>
                        </p>
                    </div>
                    
                    <div class="menu-info">
                        <button onclick="mostrarInicio()">
                            <img src="img/iconos/inicio-color.png" alt="Inicio">
                            <span>Inicio</span>
                        </button>
                        <button onclick="mostrarJuego()">
                            <img src="img/iconos/juego-color.png" alt="Juego">
                            <span>Juego</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="version">${studentData.version}</div>
        </div>
    `;
}