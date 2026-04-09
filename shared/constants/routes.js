// ============================================================
//  shared/constants/routes.js
//
//  Centraliza todas las rutas de la app en un solo lugar.
//  Así si cambias una ruta, solo la cambias aquí.
// ============================================================

export const ROUTES = {
  LOGIN:     '/login',
  REGISTER:  '/register',
  LOBBY:     '/lobby',
  PROFILE:   '/profile',
  BLACKJACK: '/blackjack',
}


// ============================================================
//  shared/constants/config.js
//
//  Configuración global de la aplicación.
// ============================================================

export const CONFIG = {
  APP_NAME:         'CardBet',
  DEFAULT_BERRIES:  1000,    // Berrys iniciales al registrarse (también en SQL)
  MIN_BET:          10,
  MAX_BET:          500,
}