# Card Platform 🃏

Plataforma de juegos de cartas en el navegador, construida con JavaScript nativo (ES Modules), sin frameworks frontend, con persistencia en MySQL/MariaDB a través de una API mínima en Node.js.

Los jugadores crean una cuenta, reciben una wallet inicial de fichas y compiten en juegos de cartas clásicos. Cada partida registra el historial de apuestas, y el sistema de torneos genera rankings por juego.

---

## Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | JS nativo (ES Modules) | Sin dependencias de compilación |
| Estilos | CSS custom properties | Design tokens globales, sin preprocesador |
| API | Node.js + Express | Capa fina entre el navegador y la BD |
| Base de datos | MySQL 8+ / MariaDB 10.6+ | Relacional, robusto, ampliamente soportado en hosting |
| Driver | mysql2 (Promise API) | Async/await nativo, prepared statements, pool de conexiones |
| Auth | bcrypt + JWT (httpOnly cookie) | Sin OAuth externo, autónomo |

---

## Estructura del proyecto

```
card-platform/
│
├── README.md
├── package.json
├── .env.example
├── .gitignore
│
├── db/
│   ├── schema.sql          ← DDL completo (fuente de verdad)
│   ├── seed.sql            ← Datos iniciales (juegos, fichas de bienvenida)
│   └── database.js         ← Pool de conexiones singleton (mysql2)
│
├── api/
│   ├── server.js           ← Express: rutas, middleware, arranque
│   ├── middleware/
│   │   ├── auth.js         ← Verifica JWT en cookie httpOnly
│   │   └── validate.js     ← Validación de body (sin librerías externas)
│   └── routes/
│       ├── auth.js         ← POST /auth/register, /auth/login, /auth/logout
│       ├── wallet.js       ← GET /wallet, POST /wallet/bet, /wallet/payout
│       ├── history.js      ← GET /history, GET /history/:gameId
│       └── tournaments.js  ← GET /tournaments, GET /tournaments/:id/leaderboard
│
├── core/
│   ├── store.js            ← Estado global observable (patrón pub/sub)
│   ├── router.js           ← Hash router con guards de autenticación
│   ├── api-client.js       ← fetch() wrapper (manejo de errores centralizado)
│   └── events.js           ← Bus de eventos cross-módulo
│
├── shared/
│   ├── deck.js             ← Baraja genérica: crear, barajar, valor de carta
│   ├── components/
│   │   ├── modal.js
│   │   ├── toast.js
│   │   └── card-renderer.js
│   └── styles/
│       ├── tokens.css      ← Variables: colores, tipografía, espaciado
│       └── components.css
│
├── features/
│   ├── auth/
│   │   ├── login.html
│   │   └── auth-ui.js
│   ├── lobby/
│   │   ├── lobby.html
│   │   └── lobby.js
│   ├── history/
│   │   ├── history.html
│   │   └── history.js
│   └── tournaments/
│       ├── tournaments.html
│       └── tournament-engine.js
│
└── games/
    ├── _base/
    │   └── game-context.js ← Contrato que todo juego implementa
    ├── blackjack/
    │   ├── blackjack.html
    │   ├── blackjack.js
    │   └── blackjack.css
    └── ...                 ← Nuevos juegos: una carpeta, mismo contrato
```

---

## Base de datos

### Diseño general

MySQL 8+ / MariaDB 10.6+ con el driver `mysql2` en modo Promise. La aplicación mantiene un **pool de conexiones** (por defecto 10) para reutilizarlas entre requests sin abrir y cerrar sockets en cada llamada. El fichero `db/schema.sql` es la fuente de verdad: cualquier cambio estructural va ahí primero.

### Variables de entorno

```bash
# .env.example
DB_HOST=localhost
DB_PORT=3306
DB_USER=card_user
DB_PASSWORD=tu_password_aqui
DB_NAME=card_platform
DB_POOL_SIZE=10

JWT_SECRET=cambia_esto_por_un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d
PORT=3000
```

### Pool de conexiones (`db/database.js`)

```js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               process.env.DB_PORT,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  connectionLimit:    process.env.DB_POOL_SIZE ?? 10,
  waitForConnections: true,
  namedPlaceholders:  true,   // permite INSERT ... VALUES (:balance)
});

export default pool;
```

### Esquema (`db/schema.sql`)

```sql
-- Motor InnoDB en todo: soporta foreign keys y transacciones ACID
-- utf8mb4: emojis y caracteres especiales sin sorpresas

CREATE DATABASE IF NOT EXISTS card_platform
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE card_platform;

-- ─────────────────────────────────────────────────────
-- USUARIOS
-- ─────────────────────────────────────────────────────
CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(32)  NOT NULL,
  email         VARCHAR(254) NOT NULL,
  password_hash VARCHAR(72)  NOT NULL,   -- bcrypt produce siempre ≤ 72 chars
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email    (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────
-- WALLETS  (1:1 con users)
-- ─────────────────────────────────────────────────────
CREATE TABLE wallets (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  balance    INT UNSIGNED NOT NULL DEFAULT 1000,  -- fichas enteras, nunca decimales
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wallets_user (user_id),
  CONSTRAINT fk_wallets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────
-- CATÁLOGO DE JUEGOS
-- ─────────────────────────────────────────────────────
CREATE TABLE games (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug        VARCHAR(32)  NOT NULL,   -- 'blackjack', 'poker', etc.
  name        VARCHAR(64)  NOT NULL,
  description TEXT,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,  -- 0 = oculto en el lobby
  PRIMARY KEY (id),
  UNIQUE KEY uq_games_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────
-- HISTORIAL DE RONDAS
-- ─────────────────────────────────────────────────────
CREATE TABLE rounds (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  game_id    INT UNSIGNED NOT NULL,
  bet_amount INT UNSIGNED NOT NULL,
  payout     INT UNSIGNED NOT NULL,   -- 0 si pierde
  result     ENUM('win','lose','push','blackjack') NOT NULL,
  detail     JSON,                    -- estado final: cartas, manos, etc.
  played_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_rounds_user   (user_id),
  KEY idx_rounds_game   (game_id),
  KEY idx_rounds_played (played_at),
  CONSTRAINT fk_rounds_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rounds_game FOREIGN KEY (game_id) REFERENCES games(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────
-- TORNEOS
-- ─────────────────────────────────────────────────────
CREATE TABLE tournaments (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  game_id   INT UNSIGNED NOT NULL,
  name      VARCHAR(128) NOT NULL,
  starts_at DATETIME     NOT NULL,
  ends_at   DATETIME     NOT NULL,
  status    ENUM('upcoming','active','finished') NOT NULL DEFAULT 'upcoming',
  PRIMARY KEY (id),
  KEY idx_tournaments_status (status),
  CONSTRAINT fk_tournaments_game FOREIGN KEY (game_id) REFERENCES games(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tournament_entries (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tournament_id INT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED NOT NULL,
  score         INT          NOT NULL DEFAULT 0,  -- fichas netas ganadas en el torneo
  joined_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_entries (tournament_id, user_id),
  KEY idx_entries_score (tournament_id, score DESC),
  CONSTRAINT fk_entries_tournament
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  CONSTRAINT fk_entries_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Seed (`db/seed.sql`)

```sql
USE card_platform;

INSERT INTO games (slug, name, description) VALUES
  ('blackjack', 'Blackjack', 'Plántate o pide. Llega a 21 sin pasarte.'),
  ('poker',     'Poker',     'Texas Hold\'em. Próximamente.'),
  ('baccarat',  'Baccarat',  'Punto o Banca. Próximamente.');
```

### Decisiones de diseño

**Fichas como enteros sin signo (`INT UNSIGNED`).** Evita errores de coma flotante. El saldo nunca puede ser negativo a nivel de columna, y la constraint se refuerza en la API antes de ejecutar el UPDATE.

**Wallet separada de users.** Permite resetear el saldo sin tocar el perfil, facilita auditorías independientes y deja abierta la posibilidad de wallets por torneo en el futuro.

**`result` como ENUM.** Limita los valores posibles a nivel de motor, no solo en la aplicación. Si el código intenta insertar un resultado desconocido, MySQL lanza un error antes de que llegue a la base de datos.

**`detail` como columna JSON nativa.** MySQL 8+ valida que el JSON sea sintácticamente correcto al insertar y permite consultas con `JSON_EXTRACT()`. No necesita tabla propia por juego y no requiere migraciones adicionales cuando cambia el estado interno de un juego.

**Sin ORM.** Con `mysql2` y `namedPlaceholders: true` las consultas son legibles y seguras contra inyección SQL. Para esta escala, un ORM añade abstracción sin beneficio real.

### Flujo de una apuesta (transacción)

```js
// api/routes/wallet.js — simplificado
const conn = await pool.getConnection();
try {
  await conn.beginTransaction();

  // FOR UPDATE bloquea la fila: evita condición de carrera si el usuario
  // lanza dos peticiones simultáneas
  const [[wallet]] = await conn.query(
    'SELECT balance FROM wallets WHERE user_id = :userId FOR UPDATE',
    { userId }
  );
  if (wallet.balance < betAmount) throw new Error('Saldo insuficiente');

  await conn.query(
    'UPDATE wallets SET balance = balance - :bet WHERE user_id = :userId',
    { bet: betAmount, userId }
  );

  await conn.commit();
  res.json({ balance: wallet.balance - betAmount });
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  conn.release();
}
```

---

## Puesta en marcha

### Prerrequisitos

- Node.js 20+
- MySQL 8+ o MariaDB 10.6+ corriendo localmente o en un host

### Instalación

```bash
git clone https://github.com/tu-usuario/card-platform.git
cd card-platform
npm install
```

### Configuración

```bash
cp .env.example .env
# Edita .env: credenciales de MySQL y un JWT_SECRET aleatorio y largo
```

### Crear la base de datos

```bash
# Opción A — cliente mysql directamente
mysql -u root -p < db/schema.sql
mysql -u root -p card_platform < db/seed.sql

# Opción B — script incluido
node db/init.js
```

### Arrancar en desarrollo

```bash
npm run dev
# API en http://localhost:3000
# Frontend servido como estáticos por Express
```

---

## API — referencia rápida

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | ✗ | Crea cuenta + wallet inicial (1000 fichas) |
| POST | `/auth/login` | ✗ | Devuelve JWT en cookie httpOnly |
| POST | `/auth/logout` | ✓ | Invalida cookie |
| GET | `/wallet` | ✓ | Saldo actual del usuario |
| POST | `/wallet/bet` | ✓ | Descuenta apuesta (transacción con FOR UPDATE) |
| POST | `/wallet/payout` | ✓ | Acredita payout + registra ronda |
| GET | `/history` | ✓ | Últimas 50 rondas del usuario |
| GET | `/history/:gameId` | ✓ | Historial filtrado por juego |
| GET | `/tournaments` | ✓ | Torneos activos y próximos |
| GET | `/tournaments/:id/leaderboard` | ✓ | Ranking de un torneo |

---

## Cómo añadir un nuevo juego

1. Crea la carpeta `games/nombre-juego/` con `nombre-juego.html`, `.js` y `.css`.
2. En `nombre-juego.js`, importa `createGameContext` — es la única interfaz con la plataforma.
3. Inserta una fila en `games` vía `db/seed.sql` o directamente en la BD.
4. Registra la ruta en `core/router.js`.

```js
import { createGameContext } from '../_base/game-context.js';

const ctx = createGameContext('nombre-juego');

await ctx.bet(50);
await ctx.payout(100);
await ctx.recordRound({ result: 'win', bet: 50, payout: 100 });
```

El juego no sabe nada de wallets, historial ni torneos. Solo llama al contexto.

---

## Hoja de ruta

- [x] Blackjack — lógica base + apuestas
- [ ] Sistema de auth (register / login)
- [ ] Lobby con catálogo de juegos
- [ ] Pantalla de historial de partidas
- [ ] Motor de torneos + rankings
- [ ] Póker (Texas Hold'em simplificado)
- [ ] Baccarat
- [ ] Notificaciones en tiempo real (SSE)

---

## Licencia

MIT