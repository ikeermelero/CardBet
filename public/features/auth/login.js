// ============================================================
//  features/auth/login.js
//
//  Vista de inicio de sesión.
//  Renderiza el formulario en el DOM y gestiona el submit.
// ============================================================

// Importamos el servicio y los repos para crear las instancias aquí.
// En una app más grande esto vendría de un contenedor de dependencias.
/* import { AuthService }              from './auth.service.js'
import { SupabaseAuthRepository }   from '../../infrastructure/supabase/auth.repository.js'
import { navigate }                 from '../../router.js'
import { showToast }                from '../../shared/ui/Toast.js' */

// Creamos el servicio con su dependencia (el repositorio de Supabase)
/* const authService = new AuthService(new SupabaseAuthRepository()) */

// renderLogin es la función que el router llama cuando el usuario
// navega a "/login". Recibe el elemento contenedor del DOM.
export function renderLogin() {
  // Inyectamos el HTML del formulario en el contenedor
  return `
  <div style="max-width:380px;margin:60px auto">
      <h1 style="font-family:var(--font-display);color:var(--c-gold);font-size:28px;text-align:center;margin-bottom:6px">Card Platform</h1>
      <p style="text-align:center;color:var(--c-text2);margin-bottom:32px;font-size:13px">Inicia sesión para jugar</p>

      <div style="background:var(--c-bg2);border:1px solid var(--c-border);border-radius:14px;padding:28px">
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:12px;color:var(--c-text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Email</label>
          <input type="email" id="login-email" placeholder="tu@email.com" autocomplete="email">
        </div>
        <div style="margin-bottom:24px">
          <label style="display:block;font-size:12px;color:var(--c-text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Contraseña</label>
          <input type="password" id="login-pass" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button id="btn-login" class="btn btn-primary" style="width:100%">Entrar</button>
        <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--c-text2)">
          ¿Sin cuenta? <a href="/register" data-link>>Regístrate</a>
        </p>
      </div>
    </div>
    
  `
}
  // Capturamos el formulario del DOM y escuchamos el evento "submit"
 /*  const form = document.getElementById('login-form')
  const btn  = document.getElementById('login-btn') */

  /* form.addEventListener('submit', async (event) => {
    // Prevenimos que el formulario recargue la página (comportamiento por defecto)
    event.preventDefault()

    // Leemos los valores de los campos
    const email    = document.getElementById('email').value
    const password = document.getElementById('password').value

    // Desactivamos el botón para evitar doble envío
    btn.disabled    = true
    btn.textContent = 'Cargando...'

    try {
      // Llamamos al servicio, que llama al repositorio, que llama a Supabase
      await authService.login(email, password)

      // Si llegamos aquí, el login fue exitoso → redirigimos al lobby
      navigate('/lobby')

    } catch (error) {
      // Si algo falló, mostramos el mensaje de error al usuario
      showToast(error.message, 'error')

    } finally {
      // "finally" siempre se ejecuta, haya error o no.
      // Restauramos el botón.
      btn.disabled    = false
      btn.textContent = 'Entrar'
    }
  }) */



/* 
    <div class="auth-card">
      <h1 class="auth-title">CardBet</h1>
      <p class="auth-subtitle">Inicia sesión para jugar</p>

      <form id="login-form" class="auth-form">
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="tu@email.com" required />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <input type="password" id="password" placeholder="••••••••" required />
        </div>

        <!-- El botón muestra "Cargando..." mientras espera la respuesta -->
        <button type="submit" id="login-btn" class="btn-primary">
          Entrar
        </button>
      </form>

      <p class="auth-link">
        ¿No tienes cuenta? <a href="/register" data-link>Regístrate</a>
      </p>
    </div> */