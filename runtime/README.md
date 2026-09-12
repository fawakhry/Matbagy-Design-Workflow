# Matbagy Runtime v0.2

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

## ما لا يعمل بعد

- لا OpenAI API.
- لا Gemini API.
- لا Google Drive production read/write.
- لا GitHub production write من داخل Runtime.
- لا secrets أو credentials.
- لا Auth أو Rate Limits.
- لا Production deployment.

## الاختبارات

```bash
node runtime/orchestrator-core.test.mjs
node runtime/storage-adapters.test.mjs
```

المتوقع:

```text
Matbagy Orchestrator Core v0.1 tests: PASS
Matbagy Storage Adapter v0.2 tests: PASS
```

## Console

افتح `runtime/console.html` من HTTP static server/GitHub Pages. لا يحتاج Backend.

## المرحلة التالية

1. تعريف Production adapter interfaces بدون أسرار.
2. Server-side AI provider adapter مع Mock provider أولًا.
3. Auth + audit persistence + rate limits.
4. GitHub/Drive adapters في بيئة اختبار منفصلة.
5. Runtime verification قبل أي Production activation.

## قاعدة الأمان

الـCore مستقل عن مزودي الخدمة. أي اتصال فعلي بـOpenAI/Gemini/Drive/GitHub يجب أن يكون Server-side وألا يضع secrets في Frontend أو Repository عام.
