document.addEventListener('DOMContentLoaded', function() {
    // Pantalla de bienvenida
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const btnEmpezar = document.getElementById('btn-empezar');
    
    btnEmpezar.addEventListener('click', function() {
      pantallaBienvenida.style.display = 'none';
      cargarPantalla('inicio');
    });
  
    // Carga inicial
    if (!window.location.hash) {
      pantallaBienvenida.style.display = 'flex';
    } else {
      cargarPantalla(window.location.hash.substring(1));
    }
  });
  
  function cargarPantalla(pantalla) {
    window.location.hash = pantalla;
    const app = document.getElementById('app');
    
    switch(pantalla) {
      case 'inicio':
        mostrarInicio();
        break;
      case 'juego':
        iniciarJuego();
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
  
  window.cargarPantalla = cargarPantalla;