# كتيب مشروع صندوق مطبعجي — Project Continuation Book

> هذا الملف هو نقطة الاستكمال الرسمية لأي شات/Agent جديد يعمل على مشروع صندوق مطبعجي.
> لا تبدأ من الصفر. ابدأ من هذا الملف ثم اتبع روابط المصادر الرسمية أدناه.

## 0) Project Routing — المصدر الرسمي الوحيد

- Repository: `fawakhry/Matbagy-Design-Workflow`
- Branch: `agent/initial-mvp`
- Primary Entry: `صندوق_مطبعجي.md`
- Canonical Instructions: `صندوق_مطبعجي/اقرأني_أولاً.md`
- Continuation Book: `صندوق_مطبعجي/PROJECT_BOOK.md`

ممنوع استخدام أي من التالي كبديل لذاكرة Design Cases:
- `fawakhry/Matbagy`
- `fawakhry/TrendOs/FOKHA_BRAIN`
- أي Repository آخر مشابه بالاسم

## 1) Snapshot / Checkpoint

- snapshot_date: `2026-09-12`
- source_branch_tip_observed_before_this_book: `d28b645961aa801e30fa55a110e02a5186b6951f`
- observed_tip_commit_date: `2026-09-04T03:24:22Z`
- observed_tip_commit_message: `Add DESIGN-2026-000014 to active watch`
- project_memory_version: `V1.8`
- memory_mode: `AUTO_PERSIST + AUTO_ARCHIVAL_FINAL_SELECTION`
- ai_authority: `ADVISORY_ONLY`
- production_orchestrator_status: `NOT_YET_IMPLEMENTED_IN_PRODUCTION`
- gemini_direct_github_status: `NOT_YET_RUNTIME_VERIFIED`
- current_shared_ai_mode: `MANUAL_BRIDGE / GITHUB ROOM PROTOCOL`

## 2) هدف المشروع

تحويل تاريخ شغل التصميمات إلى ذاكرة قابلة للبحث والتعلم والاستدعاء:

`Chat -> Design Case -> Versions -> Assets -> Decisions -> Lessons -> Knowledge`

الهدف النهائي:
- عدم بدء التصميمات المتكررة من الصفر.
- حفظ كل Request / Feedback / Version / Rejection / Approval.
- ربط الصور الفعلية بـGoogle Drive بدون وضع صور العملاء على GitHub العام.
- استخدام Negative Learning لمنع تكرار الأخطاء.
- استخراج Knowledge موثقة قابلة لإعادة الاستخدام.
- بناء واجهة/Orchestrator لاحقًا يربط User + ChatGPT + Gemini + GitHub + Drive.

## 3) العقود الأعلى أولوية

عند أي تعارض، ابدأ بهذه العقود:

1. `SCHEMA/AUTO_PERSISTENCE_POLICY.md`
2. `SCHEMA/APPROVAL_COMMAND_ROUTER.md`
3. `SCHEMA/DESIGN_CASE_SCHEMA.md`
4. `SCHEMA/ASSET_LINKING_CONTRACT.md`
5. `SCHEMA/CASE_LIFECYCLE_AND_LEARNING.md`
6. `SCHEMA/AI_ROOM_CONTRACT.md`
7. `SCHEMA/CASE_WATCH_CONTRACT.md`
8. `SCHEMA/CHAT_DELETION_SAFETY.md`
9. `SCHEMA/KNOWLEDGE_EXTRACTION_CONTRACT.md`
10. `SCHEMA/MANUAL_AI_BRIDGE.md`

## 4) Auto-Persist — القرار الحالي الملزم

الوضع الرسمي:

`READ -> EXTRACT -> DEDUP -> CREATE/UPDATE CASE -> AUTO-SELECT ARCHIVAL FINAL -> UPLOAD AVAILABLE ASSETS -> WRITE DRIVE IDS -> PERSIST GITHUB -> OPTIONAL VERIFY`

لا تنتظر كشرط للحفظ:
- `اعتمد وسجل`
- `تمام سجل`
- `اعتمد التصميم النهائي`

لكن مهم:

`ARCHIVAL FINAL != CUSTOMER APPROVAL != EXECUTION COMMAND`

إذا لا توجد موافقة عميل موثقة:

`customer_approval_status: NOT_DOCUMENTED`

## 5) Google Drive — Source of Assets

Project Root:
- name: `مشروع مطبعجي - Matbagy Project`
- folder_id: `1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`

Direct children:
- `01_Design_Cases` — `1qhoxC_c2MF3X_hhHcWiDo2SzW2ySCch_`
- `02_Orders` — `19vhyOha215dLr5_pxv8BdZy_-sq7LgDm`
- `03_Shared_Assets` — `1cBMs21DKCuTPzcfmkj2UjgFfHdqQGVgl`
- `04_Archive` — `1kke5hm_Bsq1Q_XHEuTpOkTTRkjpMEz5K`
- `05_System` — `14amOaEUH4kGP4iFWTlMDfZ1c3c9edMH7`

Canonical Case Path:

`My Drive/مشروع مطبعجي - Matbagy Project/01_Design_Cases/YYYY/<CASE_ID>/`

2026 folder:
- `1AP68g1gP0S3fNNzgyOkithg3VfH4kEgE`

قاعدة أساسية:
- الصور الفعلية في Drive.
- GitHub يحفظ metadata + File IDs + links فقط.
- `Drive File ID` هو المرجع الأقوى من الاسم أو المسار.

## 6) الحالات المسجلة حاليًا

### DESIGN-2026-000001
- type: تصميم مدرسي وردي / حذف سطر الاسم
- case_status: SAVED
- design_final_approval: NOT_CONFIRMED
- assets: 1 linked

### DESIGN-2026-000002
- type: تنظيف ريندرات/صور منتجات وإضافة لوجو مطبعجي فقط
- approval_status: EXPLICITLY_LIKED
- assets: 46 linked
- note: قاعدة ناجحة مهمة: استخدام نفس ملف اللوجو الأصلي بلا نص إضافي.

### DESIGN-2026-000003
- type: استبدال صورة منفردة داخل كولاج أفقي
- case_phase: OPEN
- design_final_approval: NOT_CONFIRMED
- assets: 3 linked

### DESIGN-2026-000004
- type: 20×9 بصورتين ونص `أدهم ❤️ ندا`
- case_phase: OPEN
- design_final_approval: NOT_CONFIRMED
- assets: 3 linked

### DESIGN-2026-000005
- type: كارت فرح شبابي
- case_phase: CLOSED
- design_final_approval: FINAL_APPROVED
- current_version: V2
- key learning: عند طلب تعديل محدد مثل ضبط العين لا تغير باقي التصميم.

### DESIGN-2026-000006
- type: Graduation News — `MS.Shahd Tag` + `CLASS OF 2026`
- case_phase: OPEN
- design_final_approval: NOT_CONFIRMED
- assets: 2 linked

### DESIGN-2026-000007
- type: Graduation Newspaper + `A Journey from Student to Teacher`
- case_phase: CLOSED
- design_final_approval: FINAL_APPROVED
- final_version: V1
- knowledge_status: NO_REUSABLE_KNOWLEDGE

### DESIGN-2026-000008
- type: بطاقة/تيكت مدرسي وردي — 3 تصميمات منفصلة
- current meaningful state: UNDER_REVIEW / REVISION_REQUIRED history
- V1: خطأ — جمع الأطفال الثلاثة في تصميم واحد
- V2: Cutouts فقط؛ إحدى الصور لم تطابق المصدر
- V3: 3 تصميمات منفصلة
- unresolved: سطر الاسم ظل ظاهرًا
- V4: FAILED_NO_RESULT
- design_final_approval: NOT_CONFIRMED

### DESIGN-2026-000009
- type: بطاقة اسم `إسراء` — تحويل الخلفية للأبيض
- Case file says: `FINAL_APPROVED`
- Drive assets موجودة بالفعل
- IMPORTANT: Watch index لا يعكس هذه الحالة بشكل صحيح — يحتاج مزامنة.

### DESIGN-2026-000010
- type: تصميم رومانسي 20×9 — صورة ناحية ونص ناحية
- required text: `في عينيكِ أجد وطني وسلامي، وفي قلبكِ عرفت معنى حياتي ♥️`
- case_phase: OPEN
- design_final_approval: NOT_CONFIRMED
- canonical Drive folder in Case metadata: `1vF9cdFpkhAo2XiwRrxsVm0y_wrHQzWFC`

### DESIGN-2026-000011
- type: تصميم أطفال باسم `يامن`
- required output after correction: A4 / الصور والعناصر + الاسم فقط / بدون موكاب ملابس
- Case file: `REVISION_REQUIRED`
- V1 superseded by user correction
- design_final_approval: NOT_CONFIRMED

### DESIGN-2026-000012
- type: Person 360 Turnaround from one photo
- case_phase: OPEN
- design_final_approval: NOT_CONFIRMED
- limitation: الخلف/الأجزاء غير المرئية توليد تقديري وليس 3D scan حقيقي.

### DESIGN-2026-000013
- type: أحمد وساره — 15×21 — عريس وعروسة أطفال
- case_phase: CLOSED
- design_final_approval: FINAL_APPROVED
- final_version: V2
- final direction: خلفية بيضاء صافية بدون أي تزيين
- knowledge_status: PENDING_EXTRACTION

### DESIGN-2026-000014
- type: Graduation Newspaper
- required text: `A Journey from Student to Teacher`
- corrected requirement: الجملة فوق `YOU DID IT!` في المكان المعلم بالأخضر
- current_version: V2
- case_phase: OPEN
- design_final_approval: NOT_CONFIRMED

### DESIGN-2026-000100
- type: تصميم عبوة/ملصق Mix مخصص
- size: 7×10 cm
- required text: `بطعم فطومه`
- case_phase: OPEN
- V1 linked
- design_final_approval: NOT_CONFIRMED

### DESIGN-2026-904530
- type: تصميم أفقي 20×9
- hard constraint: عدم تغيير ملامح الشخص
- case_phase: OPEN
- V1 موجود لكن fidelity غير مؤكدة
- design_final_approval: NOT_CONFIRMED

## 7) Active Watch — الحالة التي كانت مسجلة وقت المراجعة

`WATCH/ACTIVE_CASES.md` يحتوي حالات مفتوحة وحالات Recently Closed، لكنه ليس متزامنًا بالكامل مع Case files.

Known drift examples:
- `DESIGN-2026-000009`: Case file = FINAL_APPROVED، بينما Watch كان يسجل OPEN/WAITING_USER/NOT_CONFIRMED.
- `DESIGN-2026-000011`: Case file = REVISION_REQUIRED، بينما Watch كان يسجل OPEN.
- `DESIGN-2026-000002`: Case موجودة وEXPLICITLY_LIKED لكنها غير ممثلة بوضوح في Watch.

**Rule:** عند التعارض، لا تخمن. اقرأ Case file + Room + Decision evidence، ثم حدّث Watch ليصبح Index مشتقًا من المصدر الصحيح.

## 8) Drive Integrity Findings — اكتشافات 2026-09-12

تمت مراجعة Google Drive الفعلي وظهر Path Drift / Duplicates:

### DESIGN-2026-000009
- يوجد Folder فعلي مباشر تحت `01_Design_Cases` خارج `2026`:
  - Folder ID: `1aZodLEaovQH-AjUCV3K8ebz7OPdTRbIU`
  - يحتوي الأصل + نتيجة الخلفية البيضاء.
- ويوجد Folder آخر داخل `2026`:
  - Folder ID: `13d4CP4RQw4QrOsf-D_yn99kkJN77oT8n`
  - كان فارغًا وقت المراجعة.

### DESIGN-2026-000010
يوجد Folderان داخل `2026` بنفس الاسم:
- Canonical according to Case metadata: `1vF9cdFpkhAo2XiwRrxsVm0y_wrHQzWFC`
  - يحتوي A001 + A002/V1.
- Duplicate/legacy candidate: `1cYMMybsqIBsrMrUdTvbkHdWxvlokBcfL`
  - يحتوي نسخة أصل قديمة/زائدة.

### Safety Rule for cleanup
- لا تحذف أو تنقل قبل مقارنة File IDs والـCase metadata.
- حافظ على File IDs قدر الإمكان.
- Canonical metadata يجب أن يشير إلى Folder واحد فقط لكل Case.
- أي Folder زائد يتم Archive/Remove فقط بعد verification.

## 9) Knowledge Registry — الحالة الحالية والمشكلة

`KNOWLEDGE/INDEX.md` موجود وحالته `ACTIVE` لكنه يقول إنه لا توجد Knowledge Candidates لأن أول Case غير مغلقة.

هذا أصبح Stale لأن لدينا Cases مغلقة بالفعل:
- 000005
- 000007
- 000013

وخاصة 000013 حالتها:
`knowledge_status: PENDING_EXTRACTION`

التالي المطلوب:
- تشغيل Knowledge Extraction للحالات المغلقة.
- تحويل Lessons المدعومة بـEvidence إلى Candidates.
- عدم ترقية AI Opinion وحدها إلى Global Rule.

## 10) Instruction Drift — مشكلة يجب عدم تجاهلها

السياسة الأحدث تقول Auto-Persist بدون Approval Gate.

لكن الملفات التالية تحتوي نصًا Legacy قديمًا:
- `INSTRUCTIONS/EXTRACT_OLD_CHAT.md`
- `PROMPTS/MASTER_PROMPT.md`

وتحتوي تعليمات من نوع:
- اعرض Draft فقط
- انتظر `اعتمد وسجل`

هذه التعليمات **Superseded** بواسطة:
- `SCHEMA/AUTO_PERSISTENCE_POLICY.md`
- `SCHEMA/APPROVAL_COMMAND_ROUTER.md`

**Rule for any new Agent:** لا تطبق Approval Gate القديمة حتى لو ظهرت في ملف Legacy.

## 11) UI / Runtime Reality

جذر Repository يحتوي Web MVP عربي RTL فيه:
- Dashboard
- Templates
- New Request
- Workflow
- Proof Approval
- Preflight
- Activity
- Settings
- JSON Backup/Restore

لكن التطبيق الحالي:
- Static only
- `localStorage`
- No backend
- No auth
- No real file uploads
- No Production integration
- Banner: `نسخة تجريبية مستقلة — غير متصلة بـ TrendOS`

أي Agent يجب أن يفرق بين:
1. **Legacy/Experimental UI** في root.
2. **Canonical Design Memory / صندوق مطبعجي** تحت `صندوق_مطبعجي/`.

## 12) AI Room Reality

Architecture approved:

`User <-> Matbagy Orchestrator <-> ChatGPT`

`User <-> Matbagy Orchestrator <-> Gemini`

لكن Production reality:
- Orchestrator الحقيقي: غير منفذ Production.
- Gemini direct GitHub agent: غير Runtime Verified.
- Manual Bridge هو المسار المؤقت.
- GitHub Rooms هي shared state المؤقتة.

## 13) TrendOS Boundary

صندوق مطبعجي مستقل عن TrendOS.

Design memory truth:
- GitHub Matbagy Design Workflow
- Google Drive Assets

Live operational facts مثل:
- Order
- Payment
- Production
- Inventory
- Delivery

تأتي مستقبلًا من TrendOS Source of Truth/connectors فقط، وليس من AI memory.

## 14) Known High-Value Reusable Rules

هذه قواعد مؤكدة من Evidence/قرارات موثقة، وليست بديلًا عن Knowledge Registry الرسمي:

- حافظ على ملامح الصور الأصلية؛ لا Filter/تنعيم/تغيير وجه إلا بطلب صريح.
- عند طلب حذف عنصر محدد، لا تغير بقية التصميم تلقائيًا.
- `كل صورة لوحدها` في سياق القوالب = Output Design مستقل لكل صورة عندما يكون ذلك هو طلب المستخدم.
- `حذف سطر الاسم كله` = إزالة السطر كوحدة كاملة، لا ترك Label فارغ.
- `استخراج التصميم للطباعة` = Artwork نظيف، لا Screenshot/واجهة.
- 20×9 غالبًا يحتاج توزيع واضح للصورة والنص مع هوامش طباعة.
- الخلفية البيضاء/الاستروك الأسود المغلق عند طلبهما قيود إنتاج، لا زينة اختيارية.
- الفشل والرفض لا يحذفان؛ يستخدمان Negative Learning.

## 15) Immediate Integrity Backlog

### P0 — Memory integrity
1. Sync `WATCH/ACTIVE_CASES.md` from actual Case/Room state.
2. Resolve Drive duplicate/path drift for 000009 and 000010 بدون كسر File IDs.
3. Update `KNOWLEDGE/INDEX.md` from closed cases.
4. Remove/Supersede legacy approval-gate text in old instructions/prompts.
5. Add explicit Continuation Book routing to primary entry files.

### P1 — Room consistency
1. Verify each Active Case has Room files required by the contract.
2. Sync STATUS / DECISION / VERSIONS / STORAGE.
3. Ensure no AI-closing without user evidence.

### P2 — Productization
1. Separate legacy static MVP from canonical memory runtime boundary.
2. Build actual Matbagy Orchestrator backend.
3. Add auth/roles/audit.
4. Connect ChatGPT + Gemini through server-side APIs.
5. Connect Drive asset retrieval safely.
6. Add TrendOS read-only Order Context first before any write integration.

## 16) New Chat Startup Protocol

عند دخول شات جديد وطلب المستخدم:
`ادخل جيت هب صندوق مطبعجي`
أو
`كمل مشروع صندوق مطبعجي`

نفذ بالترتيب:

1. Open `صندوق_مطبعجي.md`.
2. Open `صندوق_مطبعجي/PROJECT_BOOK.md`.
3. Open `صندوق_مطبعجي/اقرأني_أولاً.md`.
4. Read latest branch tip / commits since `last_verified_checkpoint`.
5. If commits exist after this book, treat newer verified evidence as authoritative and update the book.
6. For a specific Case, read Case + Room + Drive metadata before acting.
7. Never restart architecture discovery unless new evidence conflicts with this checkpoint.

## 17) Resume Prompt — internal shortcut

A new Agent should internally behave as if it received:

`Resume Matbagy Design Workflow from PROJECT_BOOK.md. Verify branch tip after the recorded checkpoint, reconcile any newer evidence, then continue from the latest verified state. Do not restart discovery from zero.`

المستخدم لا يحتاج لنسخ هذا النص.

## 18) Definition of Done for this book

هذا الكتيب يعتبر صالحًا للاستكمال عندما:
- Routing واضح.
- Source of Truth واضح.
- State/Backlog واضح.
- Known drift موثق.
- Cases المهمة موثقة.
- Drive IDs الحرجة محفوظة.
- Next actions مرتبة.
- New Chat Startup Protocol موجود.

عند أي تقدم جوهري، حدّث هذا الملف بدل الاعتماد على ذاكرة الشات.
