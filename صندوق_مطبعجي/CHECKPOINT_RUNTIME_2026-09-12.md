# Matbagy Runtime Checkpoint — 2026-09-12

## Status

`RUNTIME_V0.7 / SANDBOX_LIVE_SMOKE_PASS / CI_INITIAL_RUN_SUCCESS / PRODUCTION_DECISION_GATE`

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
- Full local orchestration turn.

### v0.4 — HTTP Boundary
- Local Node HTTP service.
- Health + turn endpoints.
- Request IDs, idempotency and JSON limits.

### v0.5 — Contract Hardening
- Test-only Bearer auth and operator role.
- Memory/JSONL audit interfaces.
- GitHub/Drive contracts with mocks.
- Provider timeout/retry/circuit breaker.
- Test rate limiter.
- Expanded audit events.

### v0.6 — Sandbox Integration Harness
Files:
- `runtime/sandbox-config.mjs`
- `runtime/sandbox-harness.mjs`
- `runtime/runtime-v06.test.mjs`
- `runtime/SANDBOX_TARGETS.md`

Boundaries:
- GitHub sandbox branch: `sandbox/runtime-v06`.
- GitHub allowed write prefix: `runtime-sandbox/`.
- Drive sandbox folder: `99_Runtime_Sandbox`.
- Drive sandbox folder ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`.
- Canonical paths/Drive root are rejected by guard logic.

Live verification performed:
- GitHub temporary marker create -> fetch/readback -> delete: PASS.
- Drive temporary folder create -> metadata/readback -> delete: PASS.
- Canonical Cases and production folders were not used as smoke targets.

### v0.7 — Readiness + CI
Files:
- `runtime/readiness.mjs`
- `runtime/readiness.test.mjs`
- `.github/workflows/runtime-tests.yml`

Implemented:
- Fail-closed readiness gate.
- Production remains false by construction.
- Owner decision is required only after sandbox + tests are green.
- GitHub Actions suite runs runtime tests with Node 22 and no secrets.

CI evidence:
- Workflow: `Matbagy Runtime Tests`.
- First push run ID: `34713266546`.
- Conclusion: `success`.

## Safety Boundary

Still NOT activated:
- Live OpenAI provider.
- Live Gemini provider.
- Production GitHub/Drive runtime adapters.
- Production credentials.
- Production auth provider.
- Public server deployment.

No secrets or production customer data were added.

## Current Decision Gate

`OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT`

The system is now ready to proceed to live-provider/deployment preparation, but crossing that boundary requires the owner to choose/approve:
1. Activate OpenAI + Gemini live now or keep provider mocks.
2. Server-side hosting target.
3. Production credential provisioning method.

Until that decision, Production activation stays blocked.
