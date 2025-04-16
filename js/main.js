// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const btnEmpezar = document.getElementById('btn-empezar');
    const app = document.getElementById('app');
    
    // Ocultar pantalla de bienvenida y mostrar la app principal
    btnEmpezar.addEventListener('click', function() {
      pantallaBienvenida.style.display = 'none';
      pantallaPrincipal();
    });
  });
  
  // Navegación entre pantallas
  function pantallaPrincipal() {
    mostrarInicio();
  }
  
  function mostrarJuego() {
    iniciarNuevoJuego();
  }
  
  function mostrarFavoritos() {
    mostrarFavoritos();
  }
  
  function mostrarInformacion() {
    mostrarInformacion();
  }