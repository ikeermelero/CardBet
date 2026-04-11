import { router, setAuthStatus } from './router.js'
import { clearSession } from './features/auth/auth.repository.js' // Importar handlers de autenticación

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
  // Logout desde el navbar principal (si existe)
  if (e.target.id === "btn-logout-navbar") {
    e.preventDefault();
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      clearSession();
      setAuthStatus(false);
      navigateTo("/login");
    }
    return;
  }

  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

 // Botón atrás / adelante
window.addEventListener("popstate", () => {
  router(location.pathname);
});
