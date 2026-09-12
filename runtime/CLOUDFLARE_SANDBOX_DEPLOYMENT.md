# Matbagy Cloudflare Sandbox Deployment

**Target:** Live OpenAI + Gemini inside an isolated Cloudflare Worker Sandbox.

**Production status:** `DISABLED`

## 1) Deployment architecture

`Client -> Cloudflare Worker Sandbox -> OpenAI + Gemini`

Optional second phase:

`Cloudflare Worker Sandbox -> GitHub sandbox branch + Drive sandbox folder`

Boundaries:
- GitHub branch: `sandbox/runtime-v06`
- GitHub write prefix: `runtime-sandbox/`
- Drive folder: `99_Runtime_Sandbox`
- Drive folder ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`
- Canonical Drive root is never a sandbox write target.
- `AI_AUTHORITY = ADVISORY_ONLY`.

## 2) Phase A — Live AI, memory-only persistence

Use one setup location: GitHub Environment `matbagy-sandbox`.

Add these five Environment Secrets:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `RUNTIME_BEARER_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The manual workflow:
`.github/workflows/deploy-worker-sandbox.yml`

is `workflow_dispatch` only and performs this sequence:
1. Run the complete Runtime test suite.
2. Validate all five secrets are present.
3. Build a temporary secrets JSON file inside the GitHub Actions runner.
4. Deploy with Wrangler `--secrets-file`, so OpenAI/Gemini/runtime bearer values become encrypted Worker Secrets during the same deploy.
5. Remove the temporary secrets file in an `always()` cleanup step.

The raw values are never stored in tracked repository files or Wrangler `vars`.

Default config keeps:
`SANDBOX_PERSISTENCE_ENABLED=false`

Expected first verification sequence:
1. All CI tests pass.
2. Configure the five Environment Secrets in `matbagy-sandbox`.
3. Run the manual sandbox deploy workflow.
4. Verify `GET /health` returns sandbox mode, production disabled and no blockers.
5. Execute one synthetic `POST /v1/turn` using `@GPT`.
6. Execute one synthetic `POST /v1/turn` using `@Gemini`.
7. Execute one synthetic `POST /v1/turn` using `@الكل` / BOOM mode.
8. Confirm provider outputs retain `CHATGPT_OPINION` / `GEMINI_OPINION` and `ADVISORY_ONLY` authority.

Do not use customer data for these first live checks.

## 3) Phase B — External sandbox persistence

Enable only after Phase A live AI smoke passes.

Additional Worker Secrets:
- `GITHUB_SANDBOX_TOKEN`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

Then change only:
`SANDBOX_PERSISTENCE_ENABLED=true`

Fail-closed behavior:
- missing credentials -> Worker readiness fails;
- GitHub target outside `sandbox/*` / `runtime-sandbox/` -> rejected;
- Drive target outside the exact sandbox folder -> rejected;
- persistence enabled + external write failure -> request reports sandbox persistence failure instead of silently writing elsewhere.

First persistence smoke must use synthetic evidence only and verify:
- GitHub evidence written under `runtime-sandbox/live-runs/`;
- Drive evidence written inside `99_Runtime_Sandbox`;
- no canonical Case file/folder changed.

## 4) Secret handling

Never store raw secret values in:
- GitHub tracked files;
- screenshots;
- Cases/Rooms/Knowledge;
- issue/PR comments;
- test fixtures or logs;
- normal chat messages.

Local `.dev.vars*` and `.env*` are ignored by `.gitignore`.

## 5) Deployment stop conditions

Stop/fail closed if any of the following occurs:
- runtime mode is not `SANDBOX`;
- GitHub branch does not start with `sandbox/`;
- GitHub write path escapes `runtime-sandbox/`;
- Drive sandbox ID equals canonical Drive root;
- a required secret is missing;
- CI is red;
- `/health` reports production integrations enabled;
- AI response attempts to create customer approval/owner decision as fact.

## 6) Production boundary

A successful sandbox deployment does **not** authorize Production.

Moving any of the following to Production requires a later explicit owner decision after live sandbox verification:
- canonical GitHub Case writes;
- canonical Drive writes;
- production customer data;
- production authentication/identity;
- production public endpoint/domain.
