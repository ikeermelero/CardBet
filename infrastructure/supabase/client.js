// ============================================================
//  infrastructure/supabase/client.js
//
//  Este archivo crea UNA SOLA instancia del cliente de Supabase
//  y la exporta para que todos los repositorios la compartan.
//
//  ¿Por qué una sola instancia?
//  Porque abrir múltiples conexiones a Supabase es ineficiente.
//  Con el patrón "singleton" garantizamos que solo hay una.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Estas variables las defines en un archivo .env en la raíz.
// Supabase te las da en: Dashboard → Settings → API
const SUPABASE_URL  = 'https://lekojqrepmgrbkmdlkno.supabase.co'
const SUPABASE_KEY  = 'sb_publishable_4yCAWTmlTyxK1B1VkC61bA_or1BHdAZ'

// createClient() inicializa la conexión con Supabase.
// Devuelve un objeto con métodos para auth, base de datos, etc.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)