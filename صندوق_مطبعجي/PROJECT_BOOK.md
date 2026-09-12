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
- الحفظ لا ينتظر اعتمادًا يدويًا.
- الحفظ لا يساوي اعتمادًا نهائيًا ولا أمر تنفيذ.
- الفشل والرفض يُحتفظ بهما كـNegative Learning.
- AI authority = `ADVISORY_ONLY`.

## 4) مصادر الحقيقة

- GitHub: Case state / contracts / metadata / knowledge.
- Google Drive: الصور والأصول الفعلية.
- Drive File ID أقوى من الاسم أو المسار.
- حقائق Order/Payment/Inventory/Delivery تأتي من النظام التشغيلي المختص عند الربط مستقبلًا.

## 5) Google Drive

Canonical Project Root ID:
`1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`

Canonical Case path:
`01_Design_Cases/YYYY/<CASE_ID>/`

Runtime Sandbox folder:
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

`RUNTIME_V0.9 / LIVE_AI_SANDBOX_CODE_READY / CLOUD_SANDBOX_PERSISTENCE_CODE_READY / CI_GREEN / NOT_DEPLOYED`

الطبقات المبنية وصلت إلى:
- Orchestrator + Storage + HTTP.
- Auth/Audit/Resilience.
- GitHub/Drive Sandbox isolation.
- CI + Readiness gates.
- Cloudflare Worker boundary.
- Live OpenAI/Gemini provider adapters.
- Optional GitHub/Drive sandbox persistence adapters.

## 10) Sandbox verification

- GitHub sandbox create/read/delete smoke: PASS.
- Drive sandbox create/read/delete smoke: PASS.
- Canonical Cases/production targets لم تُستخدم في اختبارات الـsandbox.
- External Worker persistence يظل OFF افتراضيًا حتى ينجح Live AI deployment أولًا.

## 11) القرار المعماري الحالي

تم اعتماد المسار:

`Cloudflare Worker Sandbox -> OpenAI + Gemini`

ثم بعد نجاح Live AI smoke فقط:

`Cloudflare Worker Sandbox -> GitHub Sandbox + Drive Sandbox`

لا يوجد قرار معماري معلق لهذه المرحلة.

## 12) Current Gate

`CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY`

المتبقي قبل Live Sandbox verification هو تجهيز الأسرار/صلاحيات النشر ثم تشغيل deploy اليدوي واختبارات live الاصطناعية.

هذا Gate ليس Production approval.

## 13) Runtime Safety Boundary

غير مفعّل حتى الآن:
- أي canonical GitHub/Drive write من الـWorker.
- Production customer data.
- Production auth/identity.
- Production public endpoint/domain.
- أي ادعاء أن Cloudflare deployment أو live AI smoke تم قبل وجود Evidence فعلي.

Production يظل قرارًا منفصلًا بعد نجاح الـLive Sandbox بالكامل.

## 14) المراجع التقنية

- Runtime details: `runtime/README.md`
- Latest technical checkpoint: `صندوق_مطبعجي/CHECKPOINT_RUNTIME_2026-09-12.md`
- Sandbox targets: `runtime/SANDBOX_TARGETS.md`
- Cloudflare deployment runbook: `runtime/CLOUDFLARE_SANDBOX_DEPLOYMENT.md`

## 15) Startup Protocol

عند قول:
`كمل مشروع صندوق مطبعجي`

نفذ:
1. اقرأ هذا الكتاب.
2. اقرأ أحدث Runtime checkpoint إذا المهمة تقنية.
3. افحص commits بعد آخر checkpoint فقط.
4. لا تعد Discovery من الصفر.
5. لا تبدأ من MVP القديم في root إلا إذا كانت المهمة تخصه صراحة.

## 16) Latest Continuation Point — 2026-09-12

- Project separation: مكتمل.
- Memory integrity: مكتمل كأساس.
- Runtime: v0.9 code-ready.
- Sandbox isolation smoke: PASS.
- Runtime CI: GREEN حتى آخر تحقق مسجل.
- Live AI architecture: Cloudflare Sandbox معتمد.
- Cloudflare deploy/live-provider smoke: لم يتم إثباته بعد.
- Production: غير مفعّل.
- Next gate: `CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY`.
