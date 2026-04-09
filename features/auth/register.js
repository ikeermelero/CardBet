// ============================================================
//  features/auth/register.js
//
//  Vista de registro de nuevo usuario.
// ============================================================
/* 
import { AuthService }            from './auth.service.js'
import { SupabaseAuthRepository } from '../../infrastructure/supabase/auth.repository.js'
import { navigate }               from '../../router.js'
import { showToast }              from '../../shared/ui/Toast.js'

const authService = new AuthService(new SupabaseAuthRepository()) */

export function renderRegister() {
  return `
  <div style="max-width:380px;margin:60px auto">
    <div class="auth-card">
      <h1 class="auth-title">CardBet</h1>
      <p class="auth-subtitle">Crea tu cuenta y recibe 100 Berrys 🫐</p>

      <form id="register-form" class="auth-form">
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="tu@email.com" required />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <input type="password" id="password" placeholder="Mín. 6 caracteres" required />
        </div>

        <div class="field">
          <label for="confirm">Confirmar contraseña</label>
          <input type="password" id="confirm" placeholder="Repite la contraseña" required />
        </div>

        <button type="submit" id="register-btn" class="btn-primary">
          Crear cuenta
        </button>
      </form>

      <p class="auth-link">
        ¿Ya tienes cuenta? <a href="/login" data-link>Inicia sesión</a>
      </p>
    </div>
    </div>
  `

  /* const form = document.getElementById('register-form')
  const btn  = document.getElementById('register-btn')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email    = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirm  = document.getElementById('confirm').value

    btn.disabled    = true
    btn.textContent = 'Creando cuenta...'

    try {
      await authService.register(email, password, confirm)

      // Supabase envía un email de confirmación por defecto.
      // Avisamos al usuario y lo mandamos a login.
      showToast('¡Cuenta creada! Revisa tu email para confirmarla.', 'success')
      navigate('/login')

    } catch (error) {
      showToast(error.message, 'error')

    } finally {
      btn.disabled    = false
      btn.textContent = 'Crear cuenta'
    }
  }) */
}