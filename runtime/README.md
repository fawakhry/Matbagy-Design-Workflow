# Matbagy Runtime v0.5

Runtime اختباري لصندوق مطبعجي، بدون أي اتصال إنتاجي خارجي.

## الهدف

تحويل العقود المكتوبة في `صندوق_مطبعجي/SCHEMA/` إلى Runtime قابل للاختبار تدريجيًا قبل ربط OpenAI / Gemini / Google Drive / GitHub production writes.

## الطبقات الحالية

### Orchestrator Core v0.1
- Case normalization/validation.
- Auto archival-final selection.
- Persist Plan.
- GPT / Gemini / BOOM routing.
- Shared Context Packet.
- AI authority = `ADVISORY_ONLY`.

### Storage Adapter Layer v0.2
- `MemoryCaseStore` و`MemoryAssetStore`.
- Auto-Persist بالمحاكاة.
- Watch update + audit trail.
- Asset binding counts وsafe-to-delete calculation.

### Provider + Turn Runtime v0.3
- Mock ChatGPT / Gemini providers.
- Truth-label validation.
- Full local orchestration turn.
- Provider outputs تظل Opinions ولا تتحول إلى Customer Facts.

### HTTP Boundary v0.4
- `GET /health`.
- `POST /v1/turn`.
- Request IDs + Idempotency.
- 1 MB JSON body limit.
- Standard error envelope.
- TEST/LOCAL only.

### Contract Hardening v0.5
- Test-only Bearer auth boundary + operator role enforcement.
- Memory audit store + local JSONL persistent audit interface.
- GitHub/Drive adapter contracts مع mocks فقط.
- Provider timeout / retry / circuit breaker.
- Test rate limiter per authenticated subject.
- Auth rejection / forbidden / rate-limit / replay / turn completion audit events.
- HTTP + adapter + resilience contract tests.
- لا secrets حقيقية ولا network production calls.

## الملفات الجديدة في v0.5

- `runtime/auth.mjs`
- `runtime/audit-store.mjs`
- `runtime/adapter-contracts.mjs`
- `runtime/provider-executor.mjs`
- `runtime/rate-limit.mjs`
- `runtime/runtime-v05.test.mjs`

## ما لا يعمل بعد

- لا OpenAI API حي.
- لا Gemini API حي.
- لا Google Drive production read/write.
- لا GitHub production write من داخل Runtime.
- لا Production credentials.
- لا Production Auth provider.
- لا Production distributed rate limiting.
- لا Production deployment.

## الاختبارات

```bash
node runtime/orchestrator-core.test.mjs
node runtime/storage-adapters.test.mjs
node runtime/orchestrator-runtime.test.mjs
node runtime/http-server.test.mjs
node runtime/runtime-v05.test.mjs
```

المتوقع:

```text
Matbagy Orchestrator Core v0.1 tests: PASS
Matbagy Storage Adapter v0.2 tests: PASS
Matbagy Orchestrator Runtime v0.3 tests: PASS
Matbagy HTTP Runtime v0.5 tests: PASS
Matbagy Runtime v0.5 contract tests: PASS
```

## تشغيل محلي

```bash
MATBAGY_RUNTIME_MODE=LOCAL node runtime/http-server.mjs
```

ثم:
- `GET http://127.0.0.1:8787/health`
- `POST http://127.0.0.1:8787/v1/turn`

الـPOST في TEST/LOCAL يحتاج افتراضيًا:

```text
Authorization: Bearer matbagy-local-test-token
```

هذا Token صناعي للاختبار فقط وليس credential إنتاجي.

## المرحلة التالية

`RUNTIME-06 — Sandbox Integration Harness`

1. بناء adapter implementations موجهة لبيئة اختبار منفصلة فقط.
2. Contract-first GitHub sandbox adapter بدون لمس canonical cases افتراضيًا.
3. Contract-first Drive sandbox adapter داخل test folder مستقل.
4. Environment/config validation تمنع أي Production target بالخطأ.
5. End-to-end sandbox verification مع rollback/cleanup واضح.
6. أي live OpenAI/Gemini credentials أو Production connectors تحتاج قرار تفعيل مستقل بعد نجاح الـsandbox.

## قاعدة الأمان

أي اتصال فعلي بـOpenAI/Gemini/Drive/GitHub يجب أن يكون Server-side، وألا يضع secrets في Frontend أو Repository عام. لا يعتبر أي تكامل Production قبل Deploy + Runtime Verification موثق.
