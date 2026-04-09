import { renderLogin }    from './login.js'
import { renderRegister } from './register.js'
 
// Exportamos las rutas como un objeto: { ruta: función_que_renderiza }
export const authRoutes = {
  '/': renderLogin,
  '/login': renderLogin,
  '/register': renderRegister, 
}