# AGENTS.md

## Isolation and Safety Rules

This repository is a completely independent experimental application.

Agents and contributors must follow these rules:

- Do not access, modify, connect to, or import data from Matbagy, TrendOS, EasyStore, Google Sheets, or any production system.
- Do not use real customer data.
- Store test data locally in the browser only.
- Never commit secrets, API keys, tokens, credentials, or private configuration.
- Do not add a backend, external database, production API integration, webhook, or automation without explicit written approval.
- Keep the visible banner in the app: `نسخة تجريبية مستقلة — غير متصلة بـ TrendOS`.
- Keep the first version deployable as a static GitHub Pages application.
- Use Arabic RTL interface conventions for user-facing screens.

## Test Data

Only synthetic test data is allowed. If sample requests are needed, use clearly fake names, fake image filenames, and fake notes.

## Backup Data

JSON export/import is for local browser test data only. Do not import production exports or customer spreadsheets.
