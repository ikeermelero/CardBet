// ============================================================
//  features/profile/profile.js
//
//  Vista del perfil de usuario.
// ============================================================

import { getSession, clearSession } from '../auth/auth.repository.js';
import { setAuthStatus, router } from '../../router.js';

export function renderProfile() {
  const session = getSession();

  if (!session) {
    // Si no hay sesión, redirigir a login
    history.pushState({}, '', '/login');
    router('/login');
    return '';
  }

  const user = session.user;

  return `
  <div style="max-width:600px;margin:60px auto;padding:20px">
    <h1 style="font-family:var(--font-display);color:var(--c-gold);font-size:32px;text-align:center;margin-bottom:8px">Mi Perfil</h1>
    <p style="text-align:center;color:var(--c-text2);margin-bottom:40px;font-size:14px">Información de tu cuenta</p>

    <div style="background:var(--c-bg2);border:1px solid var(--c-border);border-radius:14px;padding:32px">
      <div style="display:flex;align-items:center;margin-bottom:32px">
        <div style="width:80px;height:80px;background:var(--c-gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;color:var(--c-bg);font-weight:bold;margin-right:24px">
          ${user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style="font-size:24px;color:var(--c-text);margin:0;margin-bottom:4px">${user.username}</h2>
          <p style="color:var(--c-text2);margin:0;font-size:14px">${user.email}</p>
        </div>
      </div>

      <div style="border-top:1px solid var(--c-border);padding-top:24px">
        <h3 style="font-size:18px;color:var(--c-text);margin-bottom:16px">Información de la cuenta</h3>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px">
          <div style="background:var(--c-bg1);padding:16px;border-radius:8px;border:1px solid var(--c-border)">
            <div style="font-size:12px;color:var(--c-text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Usuario</div>
            <div style="font-size:16px;color:var(--c-text);font-weight:500">${user.username}</div>
          </div>

          <div style="background:var(--c-bg1);padding:16px;border-radius:8px;border:1px solid var(--c-border)">
            <div style="font-size:12px;color:var(--c-text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Email</div>
            <div style="font-size:16px;color:var(--c-text);font-weight:500">${user.email}</div>
          </div>

          <div style="background:var(--c-bg1);padding:16px;border-radius:8px;border:1px solid var(--c-border)">
            <div style="font-size:12px;color:var(--c-text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Victorias</div>
            <div style="font-size:16px;color:var(--c-text);font-weight:500">${user.vi}</div>
          </div>

          <div style="background:var(--c-bg1);padding:16px;border-radius:8px;border:1px solid var(--c-border)">
            <div style="font-size:12px;color:var(--c-text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Berrys</div>
            <div style="font-size:16px;color:var(--c-text);font-weight:500">${user.berrys}</div>
          </div>
        </div>

        <div style="border-top:1px solid var(--c-border);padding-top:24px;text-align:center">
          <button id="btn-logout-profile" class="btn btn-primary" style="background:var(--c-error);border-color:var(--c-error);padding:12px 24px;font-size:16px; color:var(--c-gold)">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Handler para el botón de logout en el perfil
document.addEventListener('click', (e) => {
  if (e.target.id === 'btn-logout-profile') {
    e.preventDefault();

    // Confirmar logout
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      clearSession();
      setAuthStatus(false);
      history.pushState({}, '', '/login');
      router('/login');
    }
  }
});