# Matbagy Runtime v0.7

Runtime تدريجي لصندوق مطبعجي. الحالة الحالية وصلت إلى Sandbox Integration + CI Readiness، بدون أي Production activation.

## الطبقات الحالية

### v0.1 — Orchestrator Core
- Case normalization/validation.
- Auto archival-final selection.
- Persist Plan.
- GPT / Gemini / BOOM routing.
- Shared Context Packet.
- AI authority = `ADVISORY_ONLY`.

### v0.2 — Storage mocks
- `MemoryCaseStore` و`MemoryAssetStore`.
- Auto-Persist بالمحاكاة.
- Watch update + audit trail.
- Asset binding counts وsafe-to-delete calculation.

### v0.3 — Provider + Turn Runtime
- Mock ChatGPT / Gemini providers.
- Truth-label validation.
- Full local orchestration turn.

### v0.4 — HTTP Boundary
- `GET /health`.
- `POST /v1/turn`.
- Request IDs + Idempotency.
- 1 MB JSON limit.
- TEST/LOCAL only.

### v0.5 — Contract Hardening
- Test-only Bearer auth + operator role.
- Memory/JSONL audit interface.
- GitHub/Drive contracts with mocks.
- Provider timeout/retry/circuit breaker.
- Test rate limiter.
- HTTP + adapter + resilience tests.

### v0.6 — Sandbox Integration Harness
- GitHub sandbox branch boundary: `sandbox/runtime-v06`.
- Allowed GitHub write prefix: `runtime-sandbox/`.
- Drive sandbox folder: `99_Runtime_Sandbox`.
- Drive sandbox folder ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`.
- Guard rejects canonical branch/path and canonical Drive root.
- Live GitHub write/read/delete smoke: PASS.
- Live Drive create/read/delete smoke: PASS.
- Details: `runtime/SANDBOX_TARGETS.md`.

### v0.7 — Readiness + CI
- `runtime/readiness.mjs` blocks Production automatically.
- Readiness returns `OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT` only after tests + sandbox smoke pass.
- GitHub Actions workflow: `.github/workflows/runtime-tests.yml`.
- First CI execution completed successfully.
- Workflow uses Node 22 and no secrets.

## Tests

```bash
node runtime/orchestrator-core.test.mjs
node runtime/storage-adapters.test.mjs
node runtime/orchestrator-runtime.test.mjs
node runtime/http-server.test.mjs
node runtime/runtime-v05.test.mjs
node runtime/runtime-v06.test.mjs
node runtime/readiness.test.mjs
```

Local v0.6 + readiness tests: PASS.
Initial GitHub Actions runtime suite: SUCCESS.

## Production boundary

Still NOT activated:
- OpenAI live API.
- Gemini live API.
- Production Google Drive adapter.
- Production GitHub write adapter.
- Production auth/credentials.
- Public runtime deployment.

## Current decision gate

`OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT`

Before crossing this gate, owner must choose/approve:
1. Whether to activate live OpenAI + Gemini now or keep provider mocks.
2. Runtime hosting target for the server-side Orchestrator.
3. Production credential provisioning method.

No Production activation happens automatically from this repository.
