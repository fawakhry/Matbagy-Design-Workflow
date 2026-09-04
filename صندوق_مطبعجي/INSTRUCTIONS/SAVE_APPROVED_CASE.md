# حفظ الحالة تلقائيًا بعد الاستخراج — صندوق مطبعجي

> اسم الملف Legacy، لكن السلوك الحالي هو Auto-Persist ولا ينتظر موافقة المستخدم.

## متى يتم الحفظ؟

فور اكتمال استخراج الـCase ومنع التكرار.

لا تنتظر:
- `اعتمد وسجل`
- `تمام سجل`

المرجع الأعلى أولوية:

`../SCHEMA/AUTO_PERSISTENCE_POLICY.md`

## قبل الكتابة

1. اقرأ `../SCHEMA/DESIGN_CASE_SCHEMA.md`.
2. اقرأ `../SCHEMA/ASSET_LINKING_CONTRACT.md`.
3. اقرأ `../SCHEMA/AUTO_PERSISTENCE_POLICY.md`.
4. اقرأ `../SCHEMA/APPROVAL_COMMAND_ROUTER.md`.
5. طبّق أحدث طلبات المستخدم الظاهرة في الشات.
6. اترك غير المؤكد `INFERRED` أو `UNKNOWN`.
7. افحص الحالات الحالية لتحديد هل نعمل Update/Backfill أو Case ID جديدة بدون تعارض.

## Case ID

`DESIGN-YYYY-NNNNNN`

هو المفتاح الأساسي للحالة.

## Order ID

إذا ظهر بوضوح سجله كما هو؛ وإلا `UNKNOWN`. ممنوع اختراعه. ويمكن إضافته لاحقًا بدون تغيير Case ID.

## Asset IDs

استخدم:

`<CASE_ID>-A001`, `<CASE_ID>-A002`...

وحدّث أي روابط داخل Timeline/Versions لتشير إلى IDs الصحيحة.

## Google Drive هو مخزن الصور الرسمي

Project Root:
`مشروع مطبعجي - Matbagy Project`

Design Cases folder ID:
`1qhoxC_c2MF3X_hhHcWiDo2SzW2ySCch_`

مجلد 2026:
`1AP68g1gP0S3fNNzgyOkithg3VfH4kEgE`

المسار:

`My Drive/مشروع مطبعجي - Matbagy Project/01_Design_Cases/YYYY/<CASE_ID>/`

بعد الاستخراج تلقائيًا:

1. أنشئ/استخدم مجلد السنة.
2. أنشئ/استخدم مجلد Case ID.
3. ارفع كل صورة/ملف متاح فعليًا إذا كانت الأدوات تسمح بالوصول إلى bytes/file reference.
4. سمِّ الملف بما يبدأ بـAsset ID قدر الإمكان.
5. سجّل `drive_file_id` الحقيقي لكل ملف تم رفعه.
6. اجعل `asset_binding_status: LINKED` فقط بعد نجاح الرفع ووجود File ID.
7. إذا Asset معروف لكن الملف غير متاح، استخدم `PENDING_UPLOAD` أو `MISSING` حسب الحقيقة.
8. لا توقف حفظ باقي الـCase بسبب Asset غير متاح.
9. لا تدّعِ رفع أي ملف بدون File ID حقيقي.

## مكان حفظ Case

`CASES/YYYY/DESIGN-YYYY-NNNNNN.md`

ويجب أن يحتوي على Request، Design Intent، Constraints، Assets Map، Timeline، Versions/Attempts، Final Approval evidence إن وجد، Reusable Rules، Search Tags، وTruth/Confidence notes.

يفضل أن يتضمن YAML:

- `case_id`
- `order_id`
- `memory_persistence_status`
- `design_final_approval`
- `asset_count`
- `linked_asset_count`
- `pending_asset_count`
- `storage_provider: GOOGLE_DRIVE`
- `drive_case_folder_id`

## فشل التنفيذ أو الصور

إذا محاولة صورة لم تنتج Result قابلًا للمراجعة:

- سجّلها `FAILED_NO_RESULT`.
- لا تنشئ Result Asset وهمي.
- لا تعتبرها Final.
- أكمل حفظ الـCase تلقائيًا.
- لا تعاود Image Generation إلا بأمر تنفيذ صريح جديد.

## الخصوصية

- لا ترفع صور العملاء إلى GitHub العام.
- GitHub يحفظ metadata والذاكرة فقط.
- Google Drive يحفظ الصور الفعلية.
- لا تحفظ Tokens أو Secrets.

## بعد الحفظ

اعرض للمستخدم للتأكيد الاختياري فقط:
- Case ID.
- Order ID أو UNKNOWN.
- Google Drive Case folder link.
- روابط Assets المرفوعة فعليًا.
- عدد LINKED / PENDING_UPLOAD / MISSING.
- `design_final_approval`.

لا تنتظر منه موافقة إضافية لكي يعتبر الحفظ مكتملًا.

## Safe to delete

قل `SAFE_TO_DELETE_CHAT` فقط بعد التحقق أن:
- Case record محفوظ.
- Timeline/Versions محفوظة.
- كل Asset متاح تم ربطه أو وسم حالته بصدق.
- لا توجد معلومة مهمة معروفة مازالت فقط داخل الشات.

وإلا:

`NOT_SAFE_TO_DELETE_CHAT — PERSISTENCE_NOT_CONFIRMED`

## التحديث اللاحق

إذا عاد المستخدم بصورة قديمة أو Order ID جديد:
- لا تنشئ Case جديدة لنفس الحالة.
- لا تغيّر Case ID أو Asset IDs.
- حدّث فقط حقول الربط أو الـTimeline مع الحفاظ على Audit Trail.