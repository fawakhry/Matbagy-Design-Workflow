# حفظ الحالة بعد موافقة المستخدم — صندوق مطبعجي

## متى يسمح بالحفظ؟

لا تحفظ داخل `CASES/` ولا ترفع الصور إلا بعد موافقة المستخدم الصريحة على الـDraft، مثل `تمام سجل` أو `اعتمد وسجل`.

## قبل الكتابة

1. اقرأ `../SCHEMA/DESIGN_CASE_SCHEMA.md`.
2. اقرأ `../SCHEMA/ASSET_LINKING_CONTRACT.md`.
3. طبّق تصحيحات المستخدم.
4. اترك غير المؤكد `INFERRED` أو `UNKNOWN`.
5. افحص الحالات الحالية لتحديد Case ID التالي بدون تعارض.

## Case ID

`DESIGN-YYYY-NNNNNN`

هو المفتاح الأساسي للحالة.

## Order ID

إذا ظهر بوضوح سجله كما هو؛ وإلا `UNKNOWN`. ممنوع اختراعه. ويمكن إضافته لاحقًا بدون تغيير Case ID.

## Asset IDs

حوّل Draft IDs إلى:

`<CASE_ID>-A001`, `<CASE_ID>-A002`...

وحدّث أي روابط داخل Timeline أو Approval لتشير إلى IDs النهائية.

## Google Drive هو مخزن الصور الرسمي

Root Folder ID:
`1qhoxC_c2MF3X_hhHcWiDo2SzW2ySCch_`

مجلد 2026:
`1AP68g1gP0S3fNNzgyOkithg3VfH4kEgE`

بعد الموافقة:

1. أنشئ/استخدم مجلد السنة.
2. أنشئ مجلدًا باسم Case ID داخل السنة.
3. ارفع كل صورة/ملف متاح فعليًا من المحادثة إذا كانت الأدوات تسمح بالوصول إلى bytes/file reference.
4. سمِّ الملف بما يبدأ بـAsset ID قدر الإمكان.
5. سجّل `drive_file_id` الحقيقي لكل ملف تم رفعه.
6. اجعل `asset_binding_status: LINKED` فقط بعد نجاح الرفع ووجود File ID.
7. إذا كان Asset معروفًا لكن الملف نفسه غير متاح للأداة، استخدم `asset_binding_status: PENDING_UPLOAD` و`storage_provider: GOOGLE_DRIVE`.
8. لا تدّعِ رفع أي صورة لم تحصل لها على File ID حقيقي.

## مكان حفظ Case

`CASES/YYYY/DESIGN-YYYY-NNNNNN.md`

ويجب أن يحتوي على Request، Design Intent، Constraints، Assets Map، Timeline، Approval، Reusable Rules، Search Tags، وTruth/Confidence notes.

يفضل أن يتضمن YAML:

- `case_id`
- `order_id`
- `approval_status`
- `asset_count`
- `linked_asset_count`
- `pending_asset_count`
- `storage_provider: GOOGLE_DRIVE`
- `drive_case_folder_id`

## الخصوصية

- لا ترفع صور العملاء إلى GitHub العام.
- GitHub يحفظ الـmetadata والذاكرة فقط.
- Google Drive يحفظ الصور الفعلية.
- لا تحفظ Tokens أو Secrets.

## بعد الحفظ

أبلغ المستخدم بـCase ID، Order ID أو UNKNOWN، مسار GitHub، Approval status، عدد الـAssets، عدد LINKED، عدد PENDING_UPLOAD، وعدد Reusable Rules.

## التحديث اللاحق

إذا عاد المستخدم بصورة قديمة أو Order ID جديد:

- لا تنشئ Case جديدة لنفس الحالة.
- لا تغيّر Case ID أو Asset IDs.
- حدّث فقط حقول الربط أو الـTimeline مع الحفاظ على Audit Trail.