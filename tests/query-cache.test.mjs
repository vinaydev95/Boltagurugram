import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/query-cache.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
}).outputText;
const { QueryCache } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('simultaneous cache misses share one loader', async () => {
  const cache = new QueryCache();
  let calls = 0;
  let finish;
  const load = () => {
    calls += 1;
    return new Promise((resolve) => { finish = resolve; });
  };
  const first = cache.get('latest', load);
  const second = cache.get('latest', load);
  await Promise.resolve();
  assert.equal(calls, 1);
  finish(['published story']);
  assert.deepEqual(await first, ['published story']);
  assert.deepEqual(await second, ['published story']);
});

test('failed refresh retains last good content and backs off repeated requests', async () => {
  let now = 0;
  let failures = 0;
  const cache = new QueryCache({ now: () => now, staleMs: 1000, retryMs: 50 });
  await cache.get('latest', async () => ['story'], 100);
  now = 101;
  const failedLoad = async () => { failures += 1; throw new Error('database offline'); };
  assert.deepEqual(await cache.get('latest', failedLoad, 100), ['story']);
  now = 120;
  assert.deepEqual(await cache.get('latest', failedLoad, 100), ['story']);
  assert.equal(failures, 1);
  now = 152;
  assert.deepEqual(await cache.get('latest', async () => ['updated story'], 100), ['updated story']);
});

test('expired fallback is not extended indefinitely by repeated database failures', async () => {
  let now = 0;
  const cache = new QueryCache({ now: () => now, staleMs: 100, retryMs: 50 });
  await cache.get('article', async () => ({ title: 'old story' }), 100);
  now = 199;
  const failure = async () => { throw new Error('database offline'); };
  assert.deepEqual(await cache.get('article', failure), { title: 'old story' });
  now = 201;
  await assert.rejects(cache.get('article', failure), /database offline/);
});

test('cold database failures propagate and a subsequent request can recover', async () => {
  const cache = new QueryCache();
  await assert.rejects(cache.get('article', async () => { throw new Error('database offline'); }), /database offline/);
  assert.equal(await cache.get('article', async () => 'recovered'), 'recovered');
});

test('a successful missing-record result replaces old article content', async () => {
  let now = 0;
  const cache = new QueryCache({ now: () => now });
  await cache.get('article', async () => ({ title: 'withdrawn story' }), 100);
  now = 101;
  assert.equal(await cache.get('article', async () => null), null);
  assert.equal(await cache.get('article', async () => { throw new Error('should be cached'); }), null);
});

test('cache size stays bounded as new URLs are requested', async () => {
  const cache = new QueryCache({ capacity: 2 });
  await cache.get('first', async () => 'one');
  await cache.get('second', async () => 'two');
  await cache.get('third', async () => 'three');
  let calls = 0;
  assert.equal(await cache.get('first', async () => { calls += 1; return 'reloaded'; }), 'reloaded');
  assert.equal(calls, 1);
});
