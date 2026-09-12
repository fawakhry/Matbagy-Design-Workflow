# Matbagy Runtime Credential Gate

Status: `BLOCKED_ON_EXTERNAL_ACCOUNT_CREDENTIAL_SETUP`

No architecture decision is pending for the current Sandbox phase.

Approved target:
`Cloudflare Worker Sandbox -> OpenAI + Gemini`

## Phase A — one setup location

Configure these **five Environment Secrets** in GitHub Environment:
`matbagy-sandbox`

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `RUNTIME_BEARER_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The manual deployment workflow uses the last two to authenticate Wrangler and uploads the first three to Cloudflare as encrypted Worker Secrets during the same deploy using Wrangler `--secrets-file`.

No raw Worker secret needs to be committed or manually duplicated in Cloudflare dashboard.

## Phase B — only after Phase A smoke succeeds

Additional secure values will be required only when sandbox external persistence is activated:
- `GITHUB_SANDBOX_TOKEN`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

Then enable:
`SANDBOX_PERSISTENCE_ENABLED=true`

Phase B is intentionally not active yet.

## Safety

- Do not paste raw credentials into repository files, issues, PR comments, Cases, Rooms, Knowledge, or normal chat messages.
- Production stays disabled.
- Canonical GitHub/Drive writes stay blocked.
- Phase B must not be enabled before Phase A live smoke is verified.
- The deploy workflow deletes its temporary secrets file even if deployment fails.

## Resume condition

Resume deployment immediately after the five Phase A secrets are securely configured in GitHub Environment `matbagy-sandbox`.

No secret values are needed in chat; only confirm that setup is complete.
