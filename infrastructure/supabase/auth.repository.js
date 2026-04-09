// ============================================================
//  infrastructure/supabase/auth.repository.js
//
//  Implementación REAL del contrato IAuthRepository.
//  Aquí sí usamos Supabase directamente.
//  Los features no importan este archivo: reciben la instancia
//  inyectada desde app.js (inyección de dependencias).
// ============================================================

/* import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js'
 */import { supabase }        from './client.js'

export class SupabaseAuthRepository {

  // Registra un nuevo usuario.
  // Supabase crea el usuario en auth.users y el trigger SQL
  // crea automáticamente su fila en "profiles".
  async register(email, password) {
    // signUp devuelve { data, error }. Siempre comprobamos error.
    //const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    return data.user  // devolvemos el objeto usuario de Supabase
  }

  // Inicia sesión con email y contraseña.
  async login(email, password) {
    //const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return data.session  // la sesión contiene el token JWT y el usuario
  }

  // Cierra la sesión actual.
  async logout() {
    //const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  // Comprueba si hay una sesión activa (útil al recargar la página).
  async getSession() {
    //const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    return data.session  // null si no hay sesión activa
  }
}