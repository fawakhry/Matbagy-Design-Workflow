# Matbagy Runtime Checkpoint — 2026-09-12

## Status

`RUNTIME_V0.9 / LIVE_AI_SANDBOX_CODE_READY / CLOUD_SANDBOX_PERSISTENCE_CODE_READY / CI_GREEN / NOT_DEPLOYED`

## Implemented

### v0.1 — Orchestrator Core
- Case normalization/validation.
- Auto archival-final selection.
- Persist plan.
- GPT / Gemini / BOOM routing.
- Shared Context Packet.
- AI authority remains `ADVISORY_ONLY`.

### v0.2 — Storage mocks
- In-memory Case/Asset stores.
- Auto-Persist simulation.
- Watch updates and audit trail.

### v0.3 — Provider + Turn Runtime
- Mock ChatGPT/Gemini providers.
- Truth-label validation.
- Full orchestration turn.

### v0.4 — HTTP Boundary
- Local Node HTTP service.
- Health + turn endpoints.
- Request IDs, idempotency and JSON limits.

### v0.5 — Contract Hardening
- Test auth and audit interfaces.
- GitHub/Drive contracts with mocks.
- Provider timeout/retry/circuit breaker.
- Test rate limiter.

### v0.6 — Sandbox Integration Harness
Boundaries:
- GitHub sandbox branch: `sandbox/runtime-v06`.
- GitHub allowed write prefix: `runtime-sandbox/`.
- Drive sandbox folder: `99_Runtime_Sandbox`.
- Drive sandbox folder ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`.
- Canonical paths/Drive root are rejected by guard logic.

Live verification already performed:
- GitHub temporary marker create -> fetch/readback -> delete: PASS.
- Drive temporary folder create -> metadata/readback -> delete: PASS.
- Canonical Cases and production folders were not used as smoke targets.

### v0.7 — Readiness + CI
- GitHub Actions test workflow active.
- Readiness is fail-closed.
- Production remains false by construction.
- Owner approved architecture: Cloudflare Workers + live OpenAI + Gemini in Sandbox first.
- Readiness next gate advanced from architecture decision to `CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY`.

### v0.8 — Live AI Sandbox providers
Files:
- `runtime/live-providers.mjs`
- `runtime/live-providers.test.mjs`
- `runtime/cloudflare-worker.mjs`
- `runtime/wrangler.jsonc`

Implemented:
- OpenAI Responses API provider adapter.
- Gemini Interactions API provider adapter.
- Server-side Cloudflare Worker boundary.
- Sandbox Bearer auth and rate limit.
- Reuses provider timeout/retry/circuit breaker.
- Required secrets are server-side bindings; no values are in GitHub.
- `/health` and `/v1/turn` remain sandbox-only.

### v0.9 — Cloud Sandbox persistence
Files:
- `runtime/cloud-sandbox-persistence.mjs`
- `runtime/cloud-sandbox-persistence.test.mjs`
- `runtime/CLOUDFLARE_SANDBOX_DEPLOYMENT.md`

Implemented:
- GitHub REST writer restricted to sandbox branch/path.
- Google OAuth refresh token provider.
- Google Drive multipart writer restricted to exact sandbox folder ID.
- Optional evidence write to both GitHub + Drive sandboxes.
- `SANDBOX_PERSISTENCE_ENABLED=false` is the default.
- When persistence is enabled, missing credentials or external write failure fails closed.
- No fallback to canonical Case/Drive targets.

### Deployment workflow
File:
`.github/workflows/deploy-worker-sandbox.yml`

Rules:
- `workflow_dispatch` only.
- Runs the complete Runtime test suite before deployment.
- Requires Cloudflare GitHub Actions deployment credentials.
- Does not activate Production.

## CI Evidence

Latest verified Runtime CI before this checkpoint update:
- Commit: `0f57a9c6dd162b6edfb9dee8f88b00a2153a58c4`
- Workflow: `Matbagy Runtime Tests`
- Run ID: `34713837364`
- Conclusion: `success`

Suite includes:
- Core tests.
- Storage tests.
- Orchestrator tests.
- HTTP tests.
- v0.5 tests.
- v0.6 Sandbox tests.
- Readiness tests.
- Live AI provider tests.
- Cloud Sandbox persistence tests.

## Secrets / credentials boundary

Required for Phase A live AI Worker deployment:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `RUNTIME_BEARER_TOKEN`
- GitHub Actions deploy secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

Additional secrets only if Phase B sandbox persistence is enabled:
- `GITHUB_SANDBOX_TOKEN`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

No raw secret values were committed.

The secure OpenAI API-key setup flow was opened in ChatGPT, but this checkpoint does not assume that the user completed key creation or installed it in Cloudflare.

## Current Gate

`CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY`

Code and CI preparation are ready. The system is not yet allowed to claim:
- Cloudflare Worker deployed;
- real OpenAI/Gemini live smoke passed;
- external Worker persistence enabled;
- Production ready.

## After credentials become available

Execute in this order:
1. Configure Cloudflare Worker Secrets for Phase A.
2. Configure Cloudflare GitHub Actions deploy credentials.
3. Run manual deploy workflow.
4. Verify `/health`.
5. Execute synthetic `@GPT`, `@Gemini`, and BOOM live turns.
6. Record live-provider evidence.
7. Only then consider enabling Phase B sandbox persistence.
8. Production remains a separate later owner decision.
