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