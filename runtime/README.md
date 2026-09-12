# Matbagy Runtime v0.9

Runtime تدريجي لصندوق مطبعجي. وصل إلى Cloudflare Live-AI Sandbox code + optional sandbox persistence، بدون Production activation أو نشر Cloudflare مؤكد حتى الآن.

## الطبقات الحالية

### v0.1 — Orchestrator Core
- Case normalization/validation.
- Auto archival-final selection.
- Persist Plan.
- GPT / Gemini / BOOM routing.
- Shared Context Packet.
- `AI_AUTHORITY = ADVISORY_ONLY`.

### v0.2 — Storage mocks
- `MemoryCaseStore` و`MemoryAssetStore`.
- Auto-Persist بالمحاكاة.
- Watch update + audit trail.

### v0.3 — Provider + Turn Runtime
- Mock ChatGPT/Gemini providers.
- Truth-label validation.
- Full orchestration turn.

### v0.4 — HTTP Boundary
- Health + turn endpoints.
- Request IDs + idempotency.
- JSON limits and standard errors.

### v0.5 — Contract Hardening
- Test auth / audit interfaces.
- GitHub/Drive contracts with mocks.
- Provider timeout/retry/circuit breaker.
- Rate limiting.

### v0.6 — Sandbox Integration Harness
- GitHub sandbox branch: `sandbox/runtime-v06`.
- Allowed GitHub prefix: `runtime-sandbox/`.
- Drive sandbox folder: `99_Runtime_Sandbox`.
- Drive sandbox ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`.
- Live GitHub create/read/delete smoke: PASS.
- Live Drive create/read/delete smoke: PASS.

### v0.7 — Readiness + CI
- Fail-closed readiness gate.
- GitHub Actions Runtime test suite.
- Production remains false by construction.
- Cloudflare + live AI architecture has now been owner-approved, so the next gate is credential setup/deployment rather than architecture selection.

### v0.8 — Live AI provider layer
Files:
- `runtime/live-providers.mjs`
- `runtime/live-providers.test.mjs`
- `runtime/cloudflare-worker.mjs`
- `runtime/wrangler.jsonc`

Implemented:
- OpenAI Responses API adapter.
- Gemini Interactions API adapter.
- Cloudflare Worker server-side boundary.
- Worker Bearer auth.
- Worker rate limiting.
- Provider timeout/retry/circuit breaker reused from the Runtime.
- Secrets required server-side; none committed to GitHub.
- Worker rejects non-SANDBOX configuration.

### v0.9 — Cloud Sandbox persistence
Files:
- `runtime/cloud-sandbox-persistence.mjs`
- `runtime/cloud-sandbox-persistence.test.mjs`
- `runtime/CLOUDFLARE_SANDBOX_DEPLOYMENT.md`

Implemented:
- Real GitHub REST sandbox writer guarded to `sandbox/*` + `runtime-sandbox/`.
- Google OAuth refresh-token access provider.
- Real Drive multipart sandbox writer guarded to the exact sandbox folder.
- Optional evidence persistence to both GitHub Sandbox + Drive Sandbox.
- External persistence is **OFF by default** with `SANDBOX_PERSISTENCE_ENABLED=false`.
- If enabled and a credential/write fails, Runtime fails closed instead of falling back to canonical targets.
- Manual Cloudflare deploy workflow is `workflow_dispatch` only.

## CI / Tests

Runtime test workflow:
`.github/workflows/runtime-tests.yml`

It runs:

```bash
node runtime/orchestrator-core.test.mjs
node runtime/storage-adapters.test.mjs
node runtime/orchestrator-runtime.test.mjs
node runtime/http-server.test.mjs
node runtime/runtime-v05.test.mjs
node runtime/runtime-v06.test.mjs
node runtime/readiness.test.mjs
node runtime/live-providers.test.mjs
node runtime/cloud-sandbox-persistence.test.mjs
```

Latest CI evidence before this documentation update:
- Commit: `0f57a9c6dd162b6edfb9dee8f88b00a2153a58c4`
- Workflow: `Matbagy Runtime Tests`
- Conclusion: `success`

## Cloudflare deployment

Runbook:
`runtime/CLOUDFLARE_SANDBOX_DEPLOYMENT.md`

Manual deploy workflow:
`.github/workflows/deploy-worker-sandbox.yml`

Phase A requires Worker Secrets:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `RUNTIME_BEARER_TOKEN`

GitHub Actions deploy credentials:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Phase B optional persistence additionally requires:
- `GITHUB_SANDBOX_TOKEN`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

No secret values belong in the repository.

## Current gate

`CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY`

Code/CI preparation is ready. The Worker has **not** been claimed as deployed or live-verified yet.

Production remains disabled. A later explicit owner decision is still required before any canonical customer/Case/Drive write or Production endpoint is enabled.
