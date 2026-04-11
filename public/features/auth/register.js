// ============================================================
//  features/auth/register.js
//
//  Vista de registro de nuevo usuario.
// ============================================================

import './auth.repository.js'; // Importar handlers

export function renderRegister() {
  return `
  <div style="max-width:380px;margin:60px auto">
    <h1 style="font-family:var(--font-display);color:var(--c-gold);font-size:28px;text-align:center;margin-bottom:6px">Card Platform</h1>
    <p style="text-align:center;color:var(--c-text2);margin-bottom:32px;font-size:13px">Crea tu cuenta y recibe 100 Berrys 🫐</p>

    <div style="background:var(--c-bg2);border:1px solid var(--c-border);border-radius:14px;padding:28px">
      <form id="register-form">
        <div style="margin-bottom:16px">
          <label for="register-username" style="display:block;font-size:12px;color:var(--c-text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Usuario</label>
          <input type="text" id="register-username" placeholder="tu_usuario" required style="width:100%;padding:8px;border:1px solid var(--c-border);border-radius:6px;background:var(--c-bg1);color:var(--c-text)">
        </div>

        <div style="margin-bottom:16px">
          <label for="register-email" style="display:block;font-size:12px;color:var(--c-text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Email</label>
          <input type="email" id="register-email" placeholder="tu@email.com" required style="width:100%;padding:8px;border:1px solid var(--c-border);border-radius:6px;background:var(--c-bg1);color:var(--c-text)">
        </div>

        <div style="margin-bottom:16px">
          <label for="register-pass" style="display:block;font-size:12px;color:var(--c-text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Contraseña</label>
          <input type="password" id="register-pass" placeholder="Mín. 6 caracteres" required style="width:100%;padding:8px;border:1px solid var(--c-border);border-radius:6px;background:var(--c-bg1);color:var(--c-text)">
        </div>

        <div style="margin-bottom:24px">
          <label for="register-confirm" style="display:block;font-size:12px;color:var(--c-text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Confirmar contraseña</label>
          <input type="password" id="register-confirm" placeholder="Repite la contraseña" required style="width:100%;padding:8px;border:1px solid var(--c-border);border-radius:6px;background:var(--c-bg1);color:var(--c-text)">
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;cursor:pointer">
          Crear cuenta
        </button>
      </form>

      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--c-text2)">
        ¿Ya tienes cuenta? <a href="/login" data-link style="color:var(--c-gold);text-decoration:none">Inicia sesión</a>
      </p>
    </div>
  </div>
  `
}