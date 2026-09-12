# Matbagy Orchestrator Core v0.1

أول Runtime قابل للاختبار لصندوق مطبعجي، بدون أي اتصال إنتاجي خارجي.

## الهدف

تحويل العقود المكتوبة في `صندوق_مطبعجي/SCHEMA/` إلى منطق تنفيذي deterministic يمكن اختباره قبل ربط OpenAI / Gemini / Google Drive.

## ما يعمل الآن

- تطبيع Case state.
- التحقق الأساسي من Case IDs وAsset binding.
- تطبيق Auto-Selection للـarchival final حسب `AUTO_PERSISTENCE_POLICY.md`.
- بناء Persist Plan بدون تنفيذ I/O.
- Routing للرسائل: GPT / Gemini / BOOM.
- بناء Shared Context Packet بأقل Context لازم.
- منع AI من إغلاق Case أو اعتماد Final بنفسه.
- Console محلي لاختبار JSON يدويًا.

## ما لا يعمل بعد

- لا OpenAI API.
- لا Gemini API.
- لا Google Drive write/read.
- لا GitHub write من داخل Runtime.
- لا secrets أو credentials.
- لا Production deployment.

## اختبار

```bash
node runtime/orchestrator-core.test.mjs
```

المتوقع:

`Matbagy Orchestrator Core v0.1 tests: PASS`

## Console

افتح `runtime/console.html` من HTTP static server/GitHub Pages. لا يحتاج Backend.

## المرحلة التالية

بعد تثبيت هذا الـCore:

1. Storage adapters بواجهات منفصلة (GitHub / Drive) مع mock adapters أولًا.
2. Server-side orchestrator adapter للـAI providers.
3. Auth + audit + rate limits.
4. Runtime verification قبل أي Production activation.
