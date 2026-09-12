# كتيب مشروع صندوق مطبعجي — Project Continuation Book

> المرجع المختصر الرسمي لاستكمال مشروع صندوق مطبعجي من أي شات جديد. لا تبدأ Discovery من الصفر.

## 1) المصدر الرسمي

- Repository: `fawakhry/Matbagy-Design-Workflow`
- Branch: `agent/initial-mvp`
- Entry: `صندوق_مطبعجي.md`
- Book: `صندوق_مطبعجي/PROJECT_BOOK.md`
- Detailed Cases: `صندوق_مطبعجي/CASES/`
- Runtime: `runtime/`

`fawakhry/Matbagy` و`fawakhry/TrendOs/FOKHA_BRAIN` ليسا ذاكرة المشروع.

## 2) هدف المشروع

صندوق مطبعجي هو ذاكرة مستقلة + Runtime تدريجي لشغل التصميمات، بحيث نحفظ Cases / Versions / Assets / Decisions / Learning ونستكمل العمل من آخر حالة موثقة بدل البدء من الصفر.

`Chat -> Case -> Versions -> Assets -> Decisions -> Lessons -> Knowledge -> Runtime`

## 3) سياسة الذاكرة

- `AUTO_PERSIST` هو الوضع الرسمي.
- الحفظ لا ينتظر عبارة اعتماد يدوية.
- الحفظ لا يساوي اعتماد نهائي ولا أمر تنفيذ.
- الفشل والرفض يُحتفظ بهما كـNegative Learning.
- AI authority = `ADVISORY_ONLY`.

## 4) مصادر الحقيقة

- GitHub: Case state / contracts / metadata / knowledge.
- Google Drive: الصور والأصول الفعلية.
- Drive File ID أقوى من الاسم أو المسار.
- حقائق Order/Payment/Inventory/Delivery تأتي من النظام التشغيلي المختص عند الربط مستقبلًا.

## 5) Google Drive

Project Root ID:
`1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`

Canonical Case path:
`01_Design_Cases/YYYY/<CASE_ID>/`

Sandbox Runtime folder:
- `99_Runtime_Sandbox`
- ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`

صور العملاء الحقيقية تبقى في Drive، وGitHub العام يحتفظ بالـmetadata والـIDs والروابط فقط.

## 6) قواعد التصميم والإنتاج — خطوط عريضة

- الحفاظ على الملامح وعدم إضافة فلاتر أو تغيير الوجه بدون طلب صريح.
- تعديل المطلوب فقط.
- المقاس والخلفية والاستروك عند طلبهم قيود إنتاج.
- `استخراج التصميم للطباعة` يعني Artwork نظيفًا.
- التعلم والقرارات يعتمدون على Evidence موثق.

## 7) الفصل بين المشاريع

- كل مشروع يحتفظ بتفاصيله داخل Repository/Branch الرسمي الخاص به.
- FOKHA_BRAIN يحتفظ فقط بفهرس وروابط عامة.
- لا تُكرر حقيقة حية في أكثر من مشروع.
- Git history القديم ليس Source of Truth حاليًا.

## 8) حالة الذاكرة

- Integrity pass: مكتمل كأساس.
- Drive duplicate/path cleanup الأساسي: مكتمل.
- Watch/Knowledge registry: تم تحديثهما.
- التعليمات المتعارضة مع Auto-Persist: تم تصحيحها.

## 9) Runtime — الحالة الحالية

Current status:

`RUNTIME_V0.7 / SANDBOX_LIVE_SMOKE_PASS / CI_INITIAL_RUN_SUCCESS / PRODUCTION_DECISION_GATE`

الطبقات المبنية:
- v0.1 Orchestrator Core.
- v0.2 Storage mocks.
- v0.3 Provider + Turn Runtime.
- v0.4 Local HTTP boundary.
- v0.5 Auth/Audit/Adapter contracts/Provider resilience/Rate limit.
- v0.6 Sandbox Integration Harness.
- v0.7 Readiness Gate + GitHub Actions CI.

## 10) Sandbox verification

GitHub sandbox:
- Branch: `sandbox/runtime-v06`.
- Allowed write prefix: `runtime-sandbox/`.
- Live create/read/delete smoke: PASS.

Drive sandbox:
- Folder: `99_Runtime_Sandbox`.
- Live create/read/delete smoke: PASS.

Canonical Cases/production targets لم تُستخدم في اختبارات الـsandbox.

التفاصيل التقنية في:
- `runtime/SANDBOX_TARGETS.md`
- `صندوق_مطبعجي/CHECKPOINT_RUNTIME_2026-09-12.md`

## 11) CI / Verification

- Workflow: `Matbagy Runtime Tests`.
- Node 22.
- بدون Secrets.
- أول تشغيل مسجل: SUCCESS.
- Local sandbox/readiness tests: PASS.

## 12) Runtime Safety Boundary

غير مفعّل حتى الآن:
- Live OpenAI API.
- Live Gemini API.
- Production GitHub/Drive runtime adapters.
- Production credentials/identity provider.
- Public runtime deployment.

الـReadiness Gate يمنع اعتبار النظام Production-ready تلقائيًا.

## 13) القرار المطلوب قبل المرحلة التالية

وصل النظام لأول بوابة تحتاج قرار مالك:

`OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT`

المطلوب تحديده قبل عبور البوابة:
1. هل يتم تفعيل OpenAI + Gemini live الآن أم نستمر بالـMocks؟
2. أين يُستضاف الـserver-side Orchestrator؟
3. كيف تُجهز Production credentials/secrets؟

حتى صدور هذا القرار، Production activation يظل محظورًا.

## 14) Startup Protocol

عند قول:
`كمل مشروع صندوق مطبعجي`

نفذ:
1. اقرأ هذا الكتاب.
2. اقرأ أحدث Runtime checkpoint إذا المهمة تقنية.
3. افحص commits بعد آخر checkpoint فقط.
4. لا تعد Discovery من الصفر.
5. لا تبدأ من MVP القديم في root إلا إذا كانت المهمة تخصه صراحة.

## 15) Latest Continuation Point — 2026-09-12

- Project separation: مكتمل.
- Memory integrity: مكتمل كأساس.
- Runtime: v0.7.
- Sandbox live smoke: PASS.
- Initial CI: SUCCESS.
- Production: غير مفعّل.
- Next gate: قرار المالك بشأن Live AI + Hosting + Secrets.
