import {authRoutes} from './features/auth/auth.routes.js';
import {profileRoutes} from './features/profile/profile.routes.js';
import { getSession } from './features/auth/auth.repository.js';

const routes = {
  ...authRoutes,
  ...profileRoutes,
  "/ranking": () => "<h1>Ranking</h1><p>Tu perfil</p>",
  "/lobby": () => "<h1>Lobby</h1><p>Estas en lobby</p>",
  "/contact": () => "<h1>Contact</h1><p>Contacto</p>",
};

const PUBLIC_ROUTES = new Set(['/','/login','/register'])
const AUTH_STORAGE_KEY = 'cardbet.authenticated'

function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function setAuthStatus(isLoggedIn) {
  localStorage.setItem(AUTH_STORAGE_KEY, isLoggedIn ? 'true' : 'false')
  updateNavbar(); // Actualizar navbar cuando cambia el estado de autenticación
}

function toggleNavbar(show) {
  const navbar = document.getElementById('navbar')
  if (!navbar) return
  navbar.style.display = show ? 'flex' : 'none'
  if (show) {
    updateNavbar(); // Actualizar navbar cuando se muestra
  }
}

function updateNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const session = getSession();
  const navbarLinks = navbar.querySelector('.navbar-links');

  if (session && session.user) {
    // Usuario logueado - mostrar nombre
    const userInfo = document.createElement('span');
    userInfo.className = 'navbar-user';
    userInfo.innerHTML = `Hola, ${session.user.username}`;

    // Reemplazar el enlace de perfil con el nombre del usuario
    const profileLink = navbarLinks.querySelector('a[href="/profile"]');
    if (profileLink) {
      profileLink.innerHTML = 'Perfil';
      profileLink.style.marginLeft = '16px';
    }

    // Agregar nombre del usuario antes del enlace de perfil
    const existingUserInfo = navbarLinks.querySelector('.navbar-user');
    if (existingUserInfo) {
      existingUserInfo.remove();
    }
    navbarLinks.insertBefore(userInfo, profileLink);
  } else {
    // Usuario no logueado - remover nombre
    const userInfo = navbarLinks.querySelector('.navbar-user');
    if (userInfo) {
      userInfo.remove();
    }
  }
}

export function router(path) {
  const authenticated = isAuthenticated()
  const isPublicRoute = PUBLIC_ROUTES.has(path)

  if (!authenticated && !isPublicRoute) {
    history.replaceState({}, '', '/login')
    toggleNavbar(false)
    return router('/login')
  }

  if (authenticated && isPublicRoute) {
    history.replaceState({}, '', '/lobby')
    toggleNavbar(true)
    return router('/lobby')
  }

  toggleNavbar(authenticated)
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