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
    connectionLimit: 20,       // increased from 10
    queueLimit: 50,            // queue up to 50 waiting requests
    connectTimeout: 10000,     // 10s connection timeout
    idleTimeout: 60000,        // release idle connections after 60s
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

// In development, cache on the global object to survive hot reloads
if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;
