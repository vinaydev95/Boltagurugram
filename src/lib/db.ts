import mysql from 'mysql2/promise';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { queryDatabase } from '@/lib/database-query';

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
    connectionLimit: 15,       // RDS max_connections is 60 (shared with RishteyNCR)
    queueLimit: 0,             // 0 = unlimited waiting queue (prevents ER_CON_COUNT_ERROR)
    connectTimeout: 10000,
    idleTimeout: 60000,        // release idle connections after 60s
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

// Cache on the global object to survive hot reloads and prevent multiple pool instances
if (!global._mysqlPool) {
  global._mysqlPool = pool;
}

// Bound both pool waiting and query execution for public page requests.
export async function queryRows(sql: string, values: unknown[] = []): Promise<RowDataPacket[]> {
  return queryDatabase(pool, sql, values);
}

export async function executeStatement(sql: string, values: unknown[] = []): Promise<ResultSetHeader> {
  return queryDatabase<ResultSetHeader>(pool, sql, values);
}

export default pool;
