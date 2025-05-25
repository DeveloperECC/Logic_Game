// En Logic_Game-main/js/main.js

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js') // Ruta al archivo sw.js desde la raíz
            .then(registration => {
                console.log('Service Worker registrado con éxito. Scope:', registration.scope);

                // Lógica para manejar actualizaciones del Service Worker (opcional avanzado)
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker == null) {
                        return;
                    }
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // Nuevo contenido está disponible y ha sido cacheado.
                                // Notificar al usuario para que refresque.
                                console.log('Nuevo contenido disponible, por favor refresca la página.');
                                // Aquí podrías mostrar un toast/banner al usuario.
                            } else {
                                // Contenido cacheado para uso offline.
                                console.log('Contenido cacheado para uso offline.');
                            }
                        }
                    };
                };
            })
            .catch(error => {
                console.error('Error en el registro del Service Worker:', error);
            });
    });
} else {
    console.log('Service Worker no es soportado por este navegador.');
}

// ... Aquí continúa el resto de tu código existente en main.js
// Por ejemplo, el código que maneja #btn-empezar y la función cargarPantalla
// (Como el que tenías en el ejemplo de la guía del manifest.json)
document.addEventListener('DOMContentLoaded', () => {
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const btnEmpezar = document.getElementById('btn-empezar');
    // ... y el resto de tu lógica de inicialización que ya tenías ...

    // Asegúrate de que tu función cargarPantalla esté disponible globalmente si los
    // botones del menú la llaman directamente desde el onclick del HTML.
    // Si ya la tienes definida en este archivo, está bien.
    // Si está en otro archivo y no es global, necesitarás importarla o exponerla.
});
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