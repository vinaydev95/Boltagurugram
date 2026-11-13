import mysql from 'mysql2/promise';

// Singleton pool to prevent multiple pool instances during Next.js hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const pool =
  global._mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 30,       // allow up to 30 active connections
    queueLimit: 0,             // 0 = unlimited queue (PREVENTS "Queue limit reached" error under load)
    connectTimeout: 20000,     // 20s connection timeout (cross-region Sweden to Mumbai)
    idleTimeout: 60000,        // release idle connections after 60s
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

// Cache on the global object to survive hot reloads and prevent multiple pool instances
if (!global._mysqlPool) {
  global._mysqlPool = pool;
}

export default pool;
