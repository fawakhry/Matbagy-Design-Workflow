# Matbagy Runtime v0.4

Runtime اختباري لصندوق مطبعجي، بدون أي اتصال إنتاجي خارجي.

## الهدف

تحويل العقود المكتوبة في `صندوق_مطبعجي/SCHEMA/` إلى منطق تنفيذي يمكن اختباره قبل ربط OpenAI / Gemini / Google Drive / GitHub production writes.

## ما يعمل الآن

### Orchestrator Core v0.1
- تطبيع Case state.
- التحقق من Case IDs وAsset binding.
- Auto-Selection للـarchival final حسب السياسة الرسمية.
- Persist Plan.
- Routing: GPT / Gemini / BOOM.
- Shared Context Packet.
- منع AI من إغلاق Case أو اعتماد Final بنفسه.

### Storage Adapter Layer v0.2
- `MemoryCaseStore` و`MemoryAssetStore`.
- Auto-Persist end-to-end بالمحاكاة.
- Watch update + Audit trail.
- LINKED / PENDING_UPLOAD / MISSING counts.
- Safe-to-delete calculation في بيئة الاختبار.

### Provider + Turn Runtime v0.3
- Provider contracts مستقلة عن الـCore.
- Mock ChatGPT / Gemini providers.
- Truth-label validation لردود الـAI.
- `runOrchestrationTurn()` لتشغيل Turn كامل.
- AI outputs تبقى Opinions ولا تتحول إلى Customer Facts.

### HTTP Boundary v0.4
- Node HTTP server محلي فقط.
- `GET /health`.
- `POST /v1/turn`.
- Request IDs.
- Idempotency-Key replay protection.
- JSON body limit = 1 MB.
- Error envelope موحد.
- يرفض التشغيل خارج `TEST` / `LOCAL` mode.
- `production_integrations: false` مثبت في health response.

## ما لا يعمل بعد

- لا OpenAI API حي.
- لا Gemini API حي.
- لا Google Drive production read/write.
- لا GitHub production write من داخل Runtime.
- لا secrets أو credentials.
- لا Auth production.
- لا Rate Limits production.
- لا Production deployment.

## الاختبارات

```bash
node runtime/orchestrator-core.test.mjs
node runtime/storage-adapters.test.mjs
node runtime/orchestrator-runtime.test.mjs
node runtime/http-server.test.mjs
```

المتوقع:

```text
Matbagy Orchestrator Core v0.1 tests: PASS
Matbagy Storage Adapter v0.2 tests: PASS
Matbagy Orchestrator Runtime v0.3 tests: PASS
Matbagy HTTP Runtime v0.4 tests: PASS
```

## تشغيل محلي

```bash
MATBAGY_RUNTIME_MODE=LOCAL node runtime/http-server.mjs
```

ثم:
- `GET http://127.0.0.1:8787/health`
- `POST http://127.0.0.1:8787/v1/turn`

## Console

`runtime/console.html` لاختبار JSON مباشرة بدون Backend خارجي.

## المرحلة التالية

`RUNTIME-05 — Auth/Test Adapters/Contract Hardening`

1. Test auth boundary.
2. Persistent audit interface.
3. GitHub/Drive adapter contracts مع mocks متوافقة.
4. Provider timeout/retry/circuit-breaker behavior.
5. Contract tests بين HTTP boundary والـadapters.
6. بعد ذلك فقط إعداد بيئة اختبار حقيقية منفصلة قبل Production.

## قاعدة الأمان

أي اتصال فعلي بـOpenAI/Gemini/Drive/GitHub يجب أن يكون Server-side، وألا يضع secrets في Frontend أو Repository عام. لا يعتبر أي تكامل Production قبل Deploy + Runtime Verification موثق.
