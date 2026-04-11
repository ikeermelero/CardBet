// ============================================================
//  features/auth/auth.service.js
//
//  El Service orquesta la lógica de negocio del feature.
//  Recibe el repositorio por parámetro (inyección de dependencias),
//  así no está acoplado a Supabase directamente.
// ============================================================

export class AuthService {
  // El repositorio se "inyecta" al crear el servicio.
  // Esto permite que en tests podamos pasar un repositorio falso.
  constructor(authRepository) {
    this.repo = authRepository
  }

  // Registra un usuario validando los datos antes de llamar al repo.
  async register(email, password, confirmPassword) {
    // Validaciones de negocio que no dependen de la BD
    if (!email || !email.includes('@')) {
      throw new Error('El email no es válido')
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }
    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden')
    }

    // Si todo está bien, delegamos al repositorio
    return await this.repo.register(email, password)
  }

  // Inicia sesión validando que los campos no estén vacíos.
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios')
    }
    return await this.repo.login(email, password)
  }

  // Cierra sesión
  async logout() {
    return await this.repo.logout()
  }

  // Comprueba si el usuario ya estaba logueado (al recargar la página)
  async getSession() {
    return await this.repo.getSession()
  }
}