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