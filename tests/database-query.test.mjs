import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/database-query.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
}).outputText;
const { queryDatabase } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

function fixture(query) {
  const calls = { release: 0, destroy: 0 };
  const connection = { query, release() { calls.release += 1; }, destroy() { calls.destroy += 1; } };
  return { pool: { getConnection: async () => connection }, connection, calls };
}

test('successful query returns rows and releases its connection', async () => {
  const { pool, calls } = fixture(async () => [[{ id: 1 }], []]);
  assert.deepEqual(await queryDatabase(pool, 'SELECT id'), [{ id: 1 }]);
  assert.deepEqual(calls, { release: 1, destroy: 0 });
});

test('an ordinary SQL error still releases its idle connection', async () => {
  const { pool, calls } = fixture(async () => { throw new Error('invalid SQL'); });
  await assert.rejects(queryDatabase(pool, 'invalid'), /invalid SQL/);
  assert.deepEqual(calls, { release: 1, destroy: 0 });
});

test('driver timeouts destroy rather than recycle the active connection', async () => {
  const { pool, calls } = fixture(async () => {
    throw Object.assign(new Error('query timeout'), { code: 'PROTOCOL_SEQUENCE_TIMEOUT' });
  });
  await assert.rejects(queryDatabase(pool, 'SELECT id'), /query timeout/);
  assert.deepEqual(calls, { release: 0, destroy: 1 });
});

test('a stalled command is bounded even when the driver never settles', async () => {
  const { pool, calls } = fixture(() => new Promise(() => {}));
  await assert.rejects(queryDatabase(pool, 'SELECT id', [], { executeMs: 5 }), /Database query timed out/);
  assert.deepEqual(calls, { release: 0, destroy: 1 });
});

test('late pool acquisitions are returned after the requesting page times out', async () => {
  let finish;
  let releases = 0;
  const pool = { getConnection: () => new Promise((resolve) => { finish = resolve; }) };
  await assert.rejects(queryDatabase(pool, 'SELECT id', [], { acquireMs: 5 }), /connection wait timed out/);
  finish({ release() { releases += 1; } });
  await Promise.resolve();
  assert.equal(releases, 1);
});
