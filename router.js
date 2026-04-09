import {authRoutes} from './features/auth/auth.routes.js';

const routes = {
  ...authRoutes,
  "/profile": () => "<h1>Profile</h1><p>Sobre nosotros</p>",
  "/ranking": () => "<h1>Ranking</h1><p>Tu perfil</p>",
  "/lobby": () => "<h1>Lobby</h1><p>Estas en lobby</p>",
  "/contact": () => "<h1>Contact</h1><p>Contacto</p>",
};

export function router(path) {
  const render = routes[path]; // Buscamos el renderizador para la ruta actual
  
  if (!render) { return renderNotFound();}

  const app = document.getElementById("app"); // Obtenemos el contenedor principal de la app (definido en index.html)
  app.innerHTML = render(); // Llamamos a la función de renderizado del feature correspondiente
}


function renderNotFound() {
  document.getElementById("app").innerHTML = `
    <div class="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <a href="/lobby" data-link>Volver al lobby</a>
    </div>
  `;
}

/*// ============================================================
//  router.js
//
//  El router gestiona la navegación de la SPA (Single Page App).
//  En lugar de recargar la página, cambia la URL y renderiza
//  el componente correspondiente dinámicamente.
// ============================================================

import { authRoutes }       from '../features/auth/auth.routes.js'
/* import { lobbyRoutes }      from '../features/lobby/lobby.js'
import { blackjackRoutes }  from './features/games/blackjack/blackjack.js'
import { profileRoutes }    from './features/profile/profile.js' 
import { SupabaseAuthRepository } from './infrastructure/supabase/auth.repository.js'

// Unimos todas las rutas de los features en un solo mapa.
// Formato: { '/ruta': funcionQueRenderiza }
const routes = {
  ...authRoutes,
  /* ...lobbyRoutes,
  ...blackjackRoutes,
  ...profileRoutes, 
}

// Rutas que solo son accesibles si el usuario está logueado.
// Si intentas entrar sin sesión, te redirige a /login.
const PROTECTED_ROUTES = ['/lobby', '/blackjack', '/profile']

// Rutas que solo son accesibles si NO estás logueado.
// Si ya tienes sesión y vas a /login, te manda al lobby.
const AUTH_ROUTES = ['/login', '/register']

/* const authRepo = new SupabaseAuthRepository() 

// Función principal: determina qué renderizar según la URL actual
export async function router() {
  const path = window.location.pathname   // window.location.pathname es la ruta actual: '/login', '/lobby', etc.
  /* const session = await authRepo.getSession() */ // Comprobamos si hay sesión activa en Supabase

// Guardamos el userId en window para acceder desde cualquier feature
// En una app más grande usaríamos un store global (Context, Zustand, etc.)
/* window.__userId = session?.user?.id ?? null */

// Lógica de guardias de ruta
/* if (PROTECTED_ROUTES.includes(path) && !session) {
    return navigate('/login') // Intentas entrar a una ruta protegida sin sesión → /login
  }
  if (AUTH_ROUTES.includes(path) && session) {
    return navigate('/lobby') // Ya tienes sesión y vas a /login o /register → /lobby
  } 

  const render = routes[path] // Buscamos el renderizador para la ruta actual

  if (!render) { return renderNotFound() }  // Si la ruta no existe, mostramos un 404

  const container = document.getElementById('app') // Obtenemos el contenedor principal de la app (definido en index.html)

  await render(container) // Llamamos a la función de renderizado del feature correspondiente
}

// Navega a una nueva ruta SIN recargar la página.
// pushState cambia la URL en el navegador sin hacer una petición HTTP.
export function navigate(path) {
  window.history.pushState({}, '', path)
  router()  // volvemos a ejecutar el router con la nueva ruta
}
*/
