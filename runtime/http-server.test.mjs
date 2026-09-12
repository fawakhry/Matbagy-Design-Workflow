import assert from 'node:assert/strict';
import { createRuntimeServer } from './http-server.mjs';

const { server } = createRuntimeServer({ mode: 'TEST' });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

try {
  const health = await fetch(`${base}/health`).then((r) => r.json());
  assert.equal(health.ok, true);
  assert.equal(health.version, '0.5');
  assert.equal(health.production_integrations, false);

  const body = {
    userRequest: '@الكل راجعوا التصميم',
    caseData: {
      case_id: 'DESIGN-2026-000015',
      case_phase: 'UNDER_REVIEW',
      approval_status: 'NOT_CONFIRMED',
      customer_approval_status: 'NOT_DOCUMENTED',
      assets: [
        { asset_id: 'DESIGN-2026-000015-A001', asset_binding_status: 'LINKED', drive_file_id: 'MOCK_1', source_role: 'customer_original' }
      ],
      versions: [],
    }
  };

  const unauthenticated = await fetch(`${base}/v1/turn`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  assert.equal(unauthenticated.status, 401);

  const firstRes = await fetch(`${base}/v1/turn`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer matbagy-local-test-token',
      'idempotency-key': 'test-1',
      'x-request-id': 'req-1'
    },
    body: JSON.stringify(body),
  });
  assert.equal(firstRes.status, 200);
  const first = await firstRes.json();
  assert.equal(first.ok, true);
  assert.equal(first.request_id, 'req-1');
  assert.equal(first.idempotent_replay, false);
  assert.equal(first.outputs.length, 2);

  const replay = await fetch(`${base}/v1/turn`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer matbagy-local-test-token',
      'idempotency-key': 'test-1',
      'x-request-id': 'req-2'
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
  assert.equal(replay.idempotent_replay, true);
  assert.equal(replay.request_id, 'req-2');

  const invalid = await fetch(`${base}/v1/turn`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer matbagy-local-test-token'
    },
    body: JSON.stringify({ userRequest: 'missing case' }),
  });
  assert.equal(invalid.status, 400);

  console.log('Matbagy HTTP Runtime v0.5 tests: PASS');
} finally {
  await new Promise((resolve) => server.close(resolve));
}
