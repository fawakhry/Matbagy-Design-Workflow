# Gemini GitHub Integration — صندوق مطبعجي

**Date:** 2026-09-04

## الهدف

تحديد الطريقة الصحيحة لجعل Gemini يقرأ/يحلل/يشارك في صندوق مطبعجي على GitHub بدون الخلط بين شات Gemini العادي وبين Agent فعلي داخل GitHub.

## الحالة الحالية

`MANUAL_BRIDGE = ACTIVE`

`DIRECT_GEMINI_GITHUB_AGENT = NOT_YET_RUNTIME_VERIFIED`

شات Gemini العادي المستخدم حاليًا صرّح أنه لا يملك وصولًا شبكيًا مباشرًا إلى GitHub. لذلك لا نعتمد عليه للوصول أو الحفظ المباشر.

## المسار المؤقت

استخدم:

`SCHEMA/MANUAL_AI_BRIDGE.md`

التدفق:

`ChatGPT -> MATBAGY_HANDOFF_PACKET -> User -> Gemini -> GEMINI_RESULT_PACKET -> User -> ChatGPT -> GitHub`

## المسار المستهدف لاحقًا

الأقرب لمتطلبات مطبعجي هو تشغيل Gemini كـAgent داخل GitHub باستخدام GitHub Actions/Agent رسمي مناسب، أو تشغيله خلف Matbagy AI Orchestrator.

الخيار الرسمي المرجعي الحالي من Google:

`google-github-actions/run-gemini-cli`

هذا النوع من الربط يسمح بتشغيل Gemini CLI من GitHub Actions مع triggers مثل Issues/PRs/schedules، ويحتاج Authentication مناسب مثل Gemini API Key أو Google authentication بالإضافة إلى GitHub permissions.

## ما لا نستخدمه كحل أساسي

- شات Gemini العادي ليس GitHub agent تلقائيًا.
- VS Code/IDE integration مفيد للتطوير المحلي لكنه ليس الغرفة المشتركة نفسها.
- Gemini Code Assist GitHub consumer القديم ليس مسارنا الأساسي.

## عند التنفيذ

يجب ألا نحول مباشرة إلى Production. الترتيب:

1. Preview/Test repository/branch only.
2. Secret names فقط داخل الذاكرة؛ القيم داخل GitHub Secrets/Google auth storage.
3. Read-only test أولًا.
4. Verify that Gemini reads the intended Case/Room only.
5. Add controlled write permission only after read path passes.
6. Verify it writes only its own `GEMINI.md` / approved sync files.
7. Add audit log and rollback.
8. Never allow Gemini to alter `DECISION.md` or close a Case on its own.
9. Only after runtime PASS can Manual Bridge be retired.

## Security

- لا تحفظ Gemini API key في repository files.
- لا تمرر secrets داخل prompts أو room logs.
- Least privilege GitHub permissions.
- Customer images remain in Google Drive unless a controlled asset access layer is added.
- AI authority remains `ADVISORY_ONLY`.

## Long-term architecture

`Matbagy UI -> Matbagy AI Orchestrator -> ChatGPT + Gemini -> GitHub Design Memory + Google Drive Assets`

GitHub Actions Gemini agent يمكن أن يكون Adapter مؤقت/مساعد، لكن الغرفة النهائية تظل تحت Orchestrator واحد لكي يحصل الطرفان على نفس context والـIDs والـaudit trail.
