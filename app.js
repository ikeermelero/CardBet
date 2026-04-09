// ============================================================
//  app.js
//
//  Punto de entrada de la aplicación.
//  Se ejecuta cuando el navegador carga index.html.
//  Su única responsabilidad es arrancar el router.
// ============================================================

import { router } from './router.js'

document.addEventListener('DOMContentLoaded', () =>{
  router(location.pathname);
});

// Navegar sin recargar
function navigateTo(url) {
  const path = new URL(url).pathname;
  history.pushState({}, "", path);
  router(path);
}

//  Click en enlaces
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

 // Botón atrás / adelante
window.addEventListener("popstate", () => {
  router(location.pathname);
});




































// Cuando el DOM esté listo, arrancamos el router
/* document.addEventListener('DOMContentLoaded', () => {

  // 1. Ejecutamos el router para la URL actual
  router()

  // 2. Interceptamos los clics en enlaces con [data-link]
  //    para que no recarguen la página (navegación SPA)
  document.addEventListener('click', (event) => {
    // Buscamos si el elemento clicado (o algún padre) tiene data-link
    const link = event.target.closest('[data-link]')
    if (!link) return

    event.preventDefault()          // cancelamos la navegación nativa del browser
    navigate(link.getAttribute('href'))  // usamos nuestro router
  })

  // 3. Escuchamos el botón "atrás/adelante" del navegador
  //    popstate se dispara cuando el usuario navega en el historial
  window.addEventListener('popstate', () => {
    router()
  })

}) */