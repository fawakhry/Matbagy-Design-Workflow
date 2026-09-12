import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StaticTokenAuth } from './auth.mjs';
import { JsonlAuditStore, MemoryAuditStore } from './audit-store.mjs';
import { MockDriveAdapter, MockGitHubAdapter, assertAdapterContract, DRIVE_ADAPTER_METHODS, GITHUB_ADAPTER_METHODS } from './adapter-contracts.mjs';
import { ResilientProviderExecutor } from './provider-executor.mjs';
import { MemoryRateLimiter } from './rate-limit.mjs';
import { createRuntimeServer } from './http-server.mjs';

const auth = new StaticTokenAuth({ good: { subject: 'tester', roles: ['operator'] }, viewer: { subject: 'viewer', roles: ['viewer'] } });
assert.equal(auth.authenticate({ authorization: 'Bearer good' }).ok, true);
assert.equal(auth.authenticate({ authorization: 'Bearer bad' }).ok, false);
assert.equal(auth.requireRole(auth.authenticate({ authorization: 'Bearer good' }).principal, 'operator'), true);

assertAdapterContract(new MockGitHubAdapter(), GITHUB_ADAPTER_METHODS, 'github');
assertAdapterContract(new MockDriveAdapter(), DRIVE_ADAPTER_METHODS, 'drive');
assert.throws(() => assertAdapterContract({}, DRIVE_ADAPTER_METHODS, 'drive'), /missing methods/);

const memoryAudit = new MemoryAuditStore();
await memoryAudit.append({ action: 'TEST' });
assert.equal((await memoryAudit.list()).length, 1);
const dir = await mkdtemp(join(tmpdir(), 'matbagy-audit-'));
const jsonl = new JsonlAuditStore(join(dir, 'audit.jsonl'), { mode: 'TEST' });
await jsonl.append({ action: 'ONE' });
await jsonl.append({ action: 'TWO' });
assert.deepEqual((await jsonl.list()).map((x) => x.action), ['ONE', 'TWO']);
await rm(dir, { recursive: true, force: true });

let calls = 0;
const flakyProvider = { async respond() { calls += 1; if (calls === 1) throw new Error('temporary'); return { ok: true }; } };
const executor = new ResilientProviderExecutor({ timeoutMs: 100, maxRetries: 1, failureThreshold: 2, cooldownMs: 100, sleep: async () => {} });
assert.deepEqual(await executor.execute({ providerName: 'X', provider: flakyProvider, packet: {} }), { ok: true });
assert.equal(calls, 2);

let failCalls = 0;
const alwaysFail = { async respond() { failCalls += 1; throw new Error('fail'); } };
const breaker = new ResilientProviderExecutor({ timeoutMs: 100, maxRetries: 0, failureThreshold: 1, cooldownMs: 10000, sleep: async () => {} });
await assert.rejects(() => breaker.execute({ providerName: 'FAIL', provider: alwaysFail, packet: {} }), /fail/);
await assert.rejects(() => breaker.execute({ providerName: 'FAIL', provider: alwaysFail, packet: {} }), (e) => e.code === 'CIRCUIT_OPEN');
assert.equal(failCalls, 1);

const limiter = new MemoryRateLimiter({ limit: 2, windowMs: 10000, now: () => 0 });
assert.equal(limiter.consume('a').allowed, true);
assert.equal(limiter.consume('a').allowed, true);
assert.equal(limiter.consume('a').allowed, false);

const auditStore = new MemoryAuditStore();
const app = createRuntimeServer({ mode: 'TEST', auth, auditStore, rateLimiter: new MemoryRateLimiter({ limit: 10, windowMs: 10000 }) });
await new Promise((resolve) => app.server.listen(0, '127.0.0.1', resolve));
const port = app.server.address().port;
const url = `http://127.0.0.1:${port}`;
try {
  const health = await fetch(`${url}/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).version, '0.5');

  const noAuth = await fetch(`${url}/v1/turn`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  assert.equal(noAuth.status, 401);

  const forbidden = await fetch(`${url}/v1/turn`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer viewer' }, body: '{}' });
  assert.equal(forbidden.status, 403);

  const body = { userRequest: 'راجع الحالة', caseData: { case_id: 'DESIGN-2026-999999', case_phase: 'OPEN', assets: [], versions: [] } };
  const first = await fetch(`${url}/v1/turn`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer good', 'idempotency-key': 'same' }, body: JSON.stringify(body) });
  assert.equal(first.status, 200);
  assert.equal((await first.json()).idempotent_replay, false);

  const replay = await fetch(`${url}/v1/turn`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer good', 'idempotency-key': 'same' }, body: JSON.stringify(body) });
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).idempotent_replay, true);

  const audits = await auditStore.list();
  assert.equal(audits.some((x) => x.action === 'HTTP_TURN_COMPLETED'), true);
  assert.equal(audits.some((x) => x.action === 'IDEMPOTENT_REPLAY'), true);
} finally {
  await new Promise((resolve) => app.server.close(resolve));
}

console.log('Matbagy Runtime v0.5 contract tests: PASS');
