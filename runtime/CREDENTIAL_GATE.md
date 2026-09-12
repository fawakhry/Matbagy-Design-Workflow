# Matbagy Runtime Credential Gate

Status: `BLOCKED_ON_EXTERNAL_ACCOUNT_CREDENTIAL_SETUP`

No architecture decision is pending for the current Sandbox phase.

Approved target:
`Cloudflare Worker Sandbox -> OpenAI + Gemini`

## Phase A — required to deploy live AI sandbox

Cloudflare Worker Secrets:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `RUNTIME_BEARER_TOKEN`

GitHub Actions deployment secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Phase B — only after Phase A smoke succeeds

Additional Worker Secrets:
- `GITHUB_SANDBOX_TOKEN`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

Then enable:
`SANDBOX_PERSISTENCE_ENABLED=true`

## Safety

- Do not paste raw credentials into repository files, issues, PR comments, Cases, Rooms, Knowledge, or design chats.
- Production stays disabled.
- Canonical GitHub/Drive writes stay blocked.
- Phase B must not be enabled before Phase A live smoke is verified.

## Resume condition

Resume deployment immediately after the Phase A secrets/deploy credentials are securely configured in the external accounts.
