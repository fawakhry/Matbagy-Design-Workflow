# كتيب مشروع صندوق مطبعجي — Project Continuation Book

> المرجع المختصر الرسمي لاستكمال مشروع صندوق مطبعجي من أي شات جديد. لا تبدأ Discovery من الصفر.

## 1) المصدر الرسمي

- Repository: `fawakhry/Matbagy-Design-Workflow`
- Branch: `agent/initial-mvp`
- Entry: `صندوق_مطبعجي.md`
- Book: `صندوق_مطبعجي/PROJECT_BOOK.md`
- Operating instructions: `صندوق_مطبعجي/اقرأني_أولاً.md`
- Detailed Cases: `صندوق_مطبعجي/CASES/`
- Rooms/Watch/Knowledge/Schemas: داخل `صندوق_مطبعجي/`
- Runtime: `runtime/`

`fawakhry/Matbagy` و`fawakhry/TrendOs/FOKHA_BRAIN` ليسا ذاكرة المشروع.

## 2) هدف المشروع

صندوق مطبعجي هو ذاكرة مستقلة + Runtime تدريجي لشغل التصميمات، بحيث نحفظ Cases / Versions / Assets / Decisions / Learning ونستكمل العمل من آخر حالة موثقة بدل البدء من الصفر.

المسار العام:

`Chat -> Case -> Versions -> Assets -> Decisions -> Lessons -> Knowledge -> Runtime`

## 3) سياسة الذاكرة

- `AUTO_PERSIST` هو الوضع الرسمي.
- حفظ الذاكرة لا ينتظر عبارة اعتماد يدوية.
- الحفظ لا يساوي اعتماد التصميم النهائي ولا يساوي أمر تنفيذ.
- النسخ المرفوضة والفاشلة تُحفظ كـNegative Learning.
- IDs ثابتة قدر الإمكان: Case / Version / Asset / Knowledge.
- AI authority = `ADVISORY_ONLY`.

## 4) مصادر الحقيقة

- GitHub: Case state / contracts / decisions / metadata / knowledge.
- Google Drive: الصور والأصول الفعلية.
- Drive File ID أقوى من الاسم أو المسار.
- الحقائق التشغيلية الحية مثل Order/Payment/Inventory/Delivery تأتي مستقبلًا من نظام التشغيل المختص، وليس من AI memory.

## 5) Google Drive

Project Root:
- `مشروع مطبعجي - Matbagy Project`
- Folder ID: `1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`

Canonical path:
`01_Design_Cases/YYYY/<CASE_ID>/`

القاعدة:
- صور العملاء الحقيقية تبقى في Drive.
- GitHub يحتفظ metadata + IDs + links فقط.
- لا أسرار أو صور عملاء خاصة في Repository عام.

## 6) قواعد التصميم والإنتاج — خطوط عريضة

- الحفاظ على ملامح الصور الأصلية وعدم تغيير الوجه أو إضافة فلاتر بدون طلب صريح.
- تعديل المطلوب فقط وعدم تغيير بقية التصميم تلقائيًا.
- المقاس، الخلفية البيضاء، والاستروك المغلق عند طلبهم قيود إنتاج.
- `استخراج التصميم للطباعة` يعني Artwork نظيفًا وليس Screenshot/واجهة.
- القرار والتعلم يبنيان على Evidence موثق، وليس رأي AI وحده.

## 7) الفصل بين المشاريع

قرار ثابت منذ 2026-09-12:

- كل مشروع يحتفظ بذاكرته داخل Repository/Branch الرسمي الخاص به.
- FOKHA_BRAIN يحتفظ فقط بفهرس وروابط عالية المستوى.
- لا تحفظ تفاصيل مطبعجي داخل TrendOS/FOKHA_BRAIN.
- لا تكرر نفس الحقيقة الحية في أكثر من مشروع.
- Git history القديم قد يحتوي إشارات تاريخية، لكنه ليس Source of Truth حاليًا.

## 8) الحالة العامة للذاكرة

- Integrity pass تم تنفيذه.
- Drive duplicate/path cleanup الأساسي تم مع الحفاظ على IDs الصحيحة.
- Watch وKnowledge registry تم تحديثهما.
- التعليمات القديمة المتعارضة مع Auto-Persist تم تصحيحها.
- تفاصيل الـCases تبقى في ملفاتها المتخصصة، وليس في هذا الكتاب.

## 9) Runtime — الحالة الحالية

بدأ البناء الفعلي للـOrchestrator، ولم يعد المشروع Architecture فقط.

Current runtime status:

`RUNTIME_V0.4 / LOCAL_TESTS_PASS / HTTP_TEST_BOUNDARY_READY / NO_PRODUCTION_INTEGRATION`

الموجود حاليًا داخل `runtime/`:

- Orchestrator Core v0.1.
- Storage Adapter mocks v0.2.
- ChatGPT/Gemini mock provider contracts + orchestration turn v0.3.
- Local HTTP boundary v0.4.
- Local console.
- Automated tests لكل طبقة.

الاختبارات المحلية المسجلة كلها PASS.

التفاصيل التقنية الكاملة في:
`صندوق_مطبعجي/CHECKPOINT_RUNTIME_2026-09-12.md`

## 10) Runtime Safety Boundary

لم يتم تفعيل أي Production integration حتى الآن:

- لا OpenAI API حي.
- لا Gemini API حي.
- لا Google Drive production adapter داخل Runtime.
- لا GitHub production write adapter داخل Runtime.
- لا Production Auth/Rate Limiting.
- لا Production deployment.

أي ربط حقيقي يجب أن يكون Server-side، بدون secrets في Frontend أو GitHub العام، وبعد Test Environment وRuntime Verification.

## 11) المرحلة التالية

`RUNTIME-05 — Auth/Test Adapters/Contract Hardening`

الخطوط العريضة:
- Test auth boundary.
- Persistent audit interface.
- GitHub/Drive adapter contracts مع mocks.
- Provider timeout/retry/circuit-breaker behavior.
- HTTP-to-adapter contract tests.
- بعد ذلك Test Environment منفصلة قبل أي Production activation.

## 12) Startup Protocol لأي شات جديد

عند قول المستخدم:
`ادخل جيت هب صندوق مطبعجي`
أو
`كمل مشروع صندوق مطبعجي`

نفذ:

1. اقرأ `صندوق_مطبعجي.md`.
2. اقرأ `صندوق_مطبعجي/PROJECT_BOOK.md`.
3. اقرأ أحدث Runtime checkpoint إذا المهمة تقنية.
4. افحص commits بعد آخر checkpoint فقط.
5. إذا المهمة تخص Case بعينه، اقرأ Case + Room + Drive metadata فقط.
6. لا تعيد اكتشاف المشروع من الصفر.
7. بعد تقدم جوهري، حدّث هذا الكتاب بخلاصة عالية المستوى فقط.

## 13) سياسة الكتاب

هذا الكتاب يحتفظ بالخطوط العريضة فقط:
- هوية المشروع.
- المصدر الرسمي.
- طريقة التشغيل.
- القواعد العامة.
- حالة الذاكرة والـRuntime.
- آخر نقطة استكمال.

التفاصيل التنفيذية تبقى في Cases / Rooms / Schema / Runtime / Checkpoints.

## 14) Latest Continuation Point — 2026-09-12

آخر نقطة استكمال موثقة:

- Project separation: مكتمل.
- Memory integrity: مكتمل كأساس.
- Runtime build: وصل إلى v0.4.
- Local tests: PASS.
- Production integrations: غير مفعلة.
- Next task: `RUNTIME-05`.

لا تبدأ من MVP القديم في root إلا إذا كانت المهمة تخصه صراحة؛ البناء التقني الجديد يبدأ من `runtime/`.
