import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

interface QueryDeadlines {
  acquireMs?: number;
  executeMs?: number;
}

function acquireConnection(pool: Pool, timeoutMs: number): Promise<PoolConnection> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      reject(new Error('Database connection wait timed out'));
    }, timeoutMs);

    pool.getConnection().then((connection) => {
      if (settled) {
        connection.release();
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve(connection);
    }, (error: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}

// A timed-out mysql2 command can remain active after its promise rejects.
// Destroy that connection rather than returning an active command to the pool.
export async function queryDatabase<T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]>(
  pool: Pool,
  sql: string,
  values: unknown[] = [],
  deadlines: QueryDeadlines = {},
): Promise<T> {
  const connection = await acquireConnection(pool, deadlines.acquireMs ?? 5000);
  const executeMs = deadlines.executeMs ?? 5000;
  let destroyed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const destroy = () => {
    destroyed = true;
    connection.destroy();
  };

  try {
    const operation = connection.query<T>({ sql, timeout: executeMs }, values).then(([rows]) => rows);
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        destroy();
        reject(new Error('Database query timed out'));
      }, executeMs);
    });
    return await Promise.race([operation, deadline]);
  } catch (error) {
    if (!destroyed && (error as { code?: string }).code === 'PROTOCOL_SEQUENCE_TIMEOUT') destroy();
    throw error;
  } finally {
    clearTimeout(timer);
    if (!destroyed) connection.release();
  }
}
