# Matbagy Runtime v0.3

أول Runtime قابل للاختبار لصندوق مطبعجي، بدون أي اتصال إنتاجي خارجي.

## الهدف

تحويل العقود المكتوبة في `صندوق_مطبعجي/SCHEMA/` إلى منطق تنفيذي deterministic يمكن اختباره قبل ربط OpenAI / Gemini / Google Drive / GitHub production writes.

## ما يعمل الآن

### Orchestrator Core v0.1
- تطبيع Case state.
- التحقق الأساسي من Case IDs وAsset binding.
- تطبيق Auto-Selection للـarchival final حسب `AUTO_PERSISTENCE_POLICY.md`.
- بناء Persist Plan بدون تنفيذ I/O.
- Routing للرسائل: GPT / Gemini / BOOM.
- بناء Shared Context Packet بأقل Context لازم.
- منع AI من إغلاق Case أو اعتماد Final بنفسه.
- Console محلي لاختبار JSON يدويًا.

### Storage Adapter Layer v0.2
- `MemoryCaseStore` لاختبار upsert والاسترجاع.
- `MemoryAssetStore` لمحاكاة asset linking بدون Drive حقيقي.
- `persistCaseWithAdapters()` لتجربة Auto-Persist end-to-end داخل الذاكرة.
- Watch state مشتق من Case state.
- Audit trail تجريبي لكل عملية.
- حساب LINKED / PENDING_UPLOAD / MISSING.
- `SAFE_TO_DELETE_CHAT` لا يصبح true إلا بعد اكتمال binding في سيناريو الاختبار.

### Provider + Turn Runtime v0.3
- Provider contracts منفصلة عن الـCore.
- `MockChatGPTProvider` و`MockGeminiProvider` بدون أي API خارجي.
- Validation لردود الـProviders وTruth Labels.
- `runOrchestrationTurn()` يشغل Turn كامل حسب GPT / Gemini / BOOM.
- Shared Context يمرر أقل معلومات لازمة لكل Provider.
- Provider outputs تبقى `CHATGPT_OPINION` / `GEMINI_OPINION` ولا تتحول إلى Customer Fact.
- Auto-Persist بالمحاكاة يعمل بعد الـTurn مع Audit entry.
- Case phase لا تتحول تلقائيًا إلى `FINAL_APPROVED` أو `CLOSED`.

## ما لا يعمل بعد

- لا OpenAI API حي.
- لا Gemini API حي.
- لا Google Drive production read/write.
- لا GitHub production write من داخل Runtime.
- لا secrets أو credentials.
- لا Auth أو Rate Limits.
- لا Production deployment.

## الاختبارات

```bash
node runtime/orchestrator-core.test.mjs
node runtime/storage-adapters.test.mjs
node runtime/orchestrator-runtime.test.mjs
```

المتوقع:

```text
Matbagy Orchestrator Core v0.1 tests: PASS
Matbagy Storage Adapter v0.2 tests: PASS
Matbagy Orchestrator Runtime v0.3 tests: PASS
```

## Console

افتح `runtime/console.html` من HTTP static server/GitHub Pages. لا يحتاج Backend.

## المرحلة التالية

`RUNTIME-04 — Server Boundary + Mock HTTP API`

1. بناء HTTP contract محلي/اختباري بدون secrets.
2. فصل auth/audit/request-id/error model عن منطق الـCore.
3. إضافة idempotency وrequest tracing.
4. بعدها فقط إنشاء adapters حقيقية في بيئة اختبار منفصلة.
5. Runtime verification قبل أي Production activation.

## قاعدة الأمان

الـCore مستقل عن مزودي الخدمة. أي اتصال فعلي بـOpenAI/Gemini/Drive/GitHub يجب أن يكون Server-side وألا يضع secrets في Frontend أو Repository عام.
