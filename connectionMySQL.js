require('dotenv').config();
const express    = require('express');
const mysql      = require('mysql2/promise');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const cors       = require('cors');
const path       = require('path');
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Conexión DB ──────────────────────────────────────────────
const pool = mysql.createPool({
  host: 'localhost', user: 'root', password: 'root', database: 'cardbet'
});

// ── Middleware auth ──────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// ── AUTH ─────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Faltan campos' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    res.json({ message: 'Usuario creado', id: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Email o usuario ya existe' });
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET, { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── CRUD USERS (protegido) ───────────────────────────────────
// Listar todos
app.get('/api/users', authMiddleware, async (req, res) => {
  const [rows] = await pool.execute('SELECT id, name, email FROM users');
  res.json(rows);
});

// Obtener uno
app.get('/api/users/:id', authMiddleware, async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(rows[0]);
});

// Crear
app.post('/api/users', authMiddleware, async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hash]
  );
  res.json({ message: 'Creado', id: result.insertId });
});

// Editar
app.put('/api/users/:id', authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  await pool.execute(
    'UPDATE users SET username = ?, email = ? WHERE id = ?',
    [username, email, req.params.id]
  );
  res.json({ message: 'Actualizado' });
});

// Eliminar
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
  await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'Eliminado' });
});

// ── Fallback SPA ─────────────────────────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));