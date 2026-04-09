
// ============================================================
//  infrastructure/supabase/profile.repository.js
//
//  Gestiona los datos del perfil de usuario en Supabase.
// ============================================================

import { supabase } from './client.js'

export class SupabaseProfileRepository {

  // Obtiene el perfil completo de un usuario por su ID.
  // supabase.from('profiles') equivale a: SELECT * FROM profiles
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')        // tabla de la que leer
      .select('*')             // todas las columnas
      .eq('id', userId)        // WHERE id = userId
      .single()                // esperamos un solo resultado

    if (error) throw new Error(error.message)
    return data  // { id, username, berries, avatar_url, created_at }
  }

  // Actualiza el saldo de Berrys del usuario.
  async updateBerries(userId, newAmount) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ berries: newAmount })  // SET berries = newAmount
      .eq('id', userId)                // WHERE id = userId
      .select()                        // devuelve la fila actualizada
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}


// ============================================================
//  infrastructure/supabase/game.repository.js
//
//  Gestiona el historial de partidas en Supabase.
// ============================================================

export class SupabaseGameRepository {

  // Guarda el resultado de una partida.
  // INSERT INTO game_results (user_id, game, result, bet, payout)
  async saveResult({ userId, game, result, bet, payout }) {
    const { data, error } = await supabase
      .from('game_results')
      .insert({
        user_id: userId,
        game,      // 'blackjack'
        result,    // 'win' | 'loss' | 'draw' | 'blackjack'
        bet,       // cuánto apostó
        payout     // cuánto ganó/perdió (número positivo o negativo)
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  // Obtiene las últimas "limit" partidas de un usuario.
  // ORDER BY played_at DESC = las más recientes primero
  async getHistory(userId, limit = 10) {
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data  // array de partidas
  }
}