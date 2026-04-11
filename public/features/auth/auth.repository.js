// ============================================================
//  features/auth/auth.repository.js
//
//  (Cliente) Maneja las solicitudes HTTP a la API de auth
// ============================================================

// Session management - guarda token y usuario en localStorage
function saveSession(sessionData) {
  localStorage.setItem('cardbet.token', sessionData.token);
  localStorage.setItem('cardbet.user', JSON.stringify(sessionData.user));
  localStorage.setItem('cardbet.authenticated', 'true');
}

export function getSession() {
  const token = localStorage.getItem('cardbet.token');
  const user = localStorage.getItem('cardbet.user');
  if (!token || !user) return null;
  return {
    token,
    user: JSON.parse(user)
  };
}

export function clearSession() {
  localStorage.removeItem('cardbet.token');
  localStorage.removeItem('cardbet.user');
  localStorage.removeItem('cardbet.authenticated');
}

// API Requests
export async function loginRequest(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
}

export async function registerRequest(username, email, password) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');
  return data;
}

// Form submission handlers
document.addEventListener('submit', async (event) => {
  if (event.target.id === 'login-form') {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-pass')?.value;
    const btn = document.getElementById('btn-login');

    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      btn.disabled = true;
      btn.textContent = 'Iniciando sesión...';

      const data = await loginRequest(email, password);
      saveSession({ token: data.token, user: data.user });

      // Actualizar estado y navegar
      const { setAuthStatus, router } = await import('./../../router.js');
      setAuthStatus(true);
      history.pushState({}, '', '/lobby');
      router('/lobby');
    } catch (error) {
      alert('❌ ' + error.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  }

  if (event.target.id === 'register-form') {
    event.preventDefault();
    const username = document.getElementById('register-username')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim();
    const password = document.getElementById('register-pass')?.value;
    const confirm = document.getElementById('register-confirm')?.value;
    const btn = document.querySelector('#register-form button[type="submit"]');

    if (!username || !email || !password || !confirm) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (password !== confirm) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      btn.disabled = true;
      btn.textContent = 'Creando cuenta...';

      // Registrar usuario
      await registerRequest(username, email, password);

      // Iniciar sesión automáticamente
      const loginData = await loginRequest(email, password);
      saveSession({ token: loginData.token, user: loginData.user });

      // Navegar a lobby
      const { setAuthStatus, router } = await import('./../../router.js');
      setAuthStatus(true);
      history.pushState({}, '', '/lobby');
      router('/lobby');
    } catch (error) {
      alert('❌ ' + error.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    }
  }
});