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