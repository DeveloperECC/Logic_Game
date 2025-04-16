document.addEventListener('DOMContentLoaded', function() {
    // Pantalla de bienvenida
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const btnEmpezar = document.getElementById('btn-empezar');
    
    btnEmpezar.addEventListener('click', function() {
      pantallaBienvenida.style.display = 'none';
      cargarPantalla('inicio');
    });
  
    // Cargar pantalla inicial
    cargarPantalla('inicio');
  });
  
  // Función para cargar las diferentes pantallas
  function cargarPantalla(pantalla) {
    const app = document.getElementById('app');
    
    switch(pantalla) {
      case 'inicio':
        mostrarInicio();
        break;
      case 'juego':
        iniciarNuevoJuego();
        break;
      case 'favoritos':
        mostrarFavoritos();
        break;
      case 'informacion':
        mostrarInformacion();
        break;
      default:
        mostrarInicio();
    }
  }
  
  // Hacer accesible la función desde el menú
  window.cargarPantalla = cargarPantalla;