# قواعد ربط الصور — صندوق مطبعجي

> العقد الرسمي لربط Design Case بالأوردر والصور بعد اعتماد Google Drive كمخزن الصور.

## المبدأ الأساسي

`Design Case -> Asset Records -> Google Drive`

الـCase تحفظ في GitHub كذاكرة منظمة، بينما الصورة الفعلية تحفظ في Google Drive وتُربط بالـAsset ID وDrive File ID.

## المفاتيح

### Case ID

`DESIGN-YYYY-NNNNNN`

هو المفتاح الأساسي لذاكرة التصميم.

### Order ID

رابط تجاري اختياري. يسجل فقط إذا كان ظاهرًا بوضوح أو قادمًا من مصدر موثوق.

إذا لم يوجد:

`order_id: UNKNOWN`

يمكن إضافته لاحقًا بدون تغيير Case ID.

### Asset ID

لكل صورة/ملف:

`<CASE_ID>-A001`
`<CASE_ID>-A002`
...

أثناء الـDraft يمكن استخدام `DRAFT-A001` ثم تحويله عند الحفظ.

## Google Drive — التخزين الرسمي

Root:

- `صندوق مطبعجي - الصور`
- Folder ID: `1qhoxC_c2MF3X_hhHcWiDo2SzW2ySCch_`

2026:

- Folder ID: `1AP68g1gP0S3fNNzgyOkithg3VfH4kEgE`

Convention:

`صندوق مطبعجي - الصور/YYYY/<CASE_ID>/`

الملفات يفضل أن تبدأ باسم Asset ID، لكن **Drive File ID هو المرجع الفعلي الأقوى**.

## سجل كل Asset

يحتوي على الأقل على:

- `asset_id`
- `case_id`
- `order_id`
- `source_role`: customer_original | reference_design | generated_result | final_approved | unknown
- `conversation_position`
- `purpose`
- `instructions`
- `attempt_id`
- `derived_from_asset_id`
- `privacy_class`
- `asset_binding_status`: LINKED | PENDING_UPLOAD | MISSING | REMOVED
- `storage_provider`: GOOGLE_DRIVE
- `drive_root_folder_id`
- `drive_year_folder_id`
- `drive_case_folder_id`
- `drive_file_id`
- `storage_ref`
- `file_name`
- `mime_type`: إن كان معلومًا
- `content_hash`: اختياري
- `linked_at`

## معنى الحالات

### LINKED

الملف موجود في Drive وتم تسجيل `drive_file_id` الفعلي.

### PENDING_UPLOAD

الـAsset معروف من الشات وله Asset ID، لكن bytes/file reference للصورة لم تكن متاحة وقت التسجيل أو لم يتم رفعها بعد.

### MISSING

الملف كان متوقعًا لكن تعذر العثور عليه أو لم يعد متاحًا.

### REMOVED

الملف حُذف عمدًا، مع الاحتفاظ بالسجل التاريخي.

## عند حفظ Case جديدة

بعد موافقة المستخدم:

1. خصص Case ID.
2. أنشئ مجلد Case داخل مجلد السنة في Google Drive.
3. خصص Asset IDs النهائية.
4. ارفع كل ملف متاح فعليًا.
5. لكل ملف مرفوع سجّل Drive File ID وحوّل الحالة إلى LINKED.
6. إذا تعذر الوصول للملف نفسه، سجّل PENDING_UPLOAD ولا تدّعِ الرفع.
7. احفظ Case record في GitHub.

## عند استكمال صورة قديمة لاحقًا

لا نعيد استخراج الشات:

1. افتح الـCase.
2. حدد Asset ID المطلوب.
3. ارفع الصورة إلى مجلد الـCase.
4. سجّل Drive File ID.
5. حدّث `asset_binding_status` من PENDING_UPLOAD إلى LINKED.
6. احتفظ بتاريخ الربط في `linked_at`.

## الاستدعاء

عند استدعاء Case:

1. اقرأ Case من GitHub.
2. اقرأ Assets Map.
3. لأي Asset = LINKED، استخدم `drive_file_id` أو `storage_ref` للوصول إلى الملف من Google Drive.
4. افهم `source_role` قبل استخدام الصورة.
5. اربط النتائج بالمحاولة عن طريق `attempt_id`.
6. أعط الأولوية لـfinal_approved، والمرفوض يظل negative example.

## العلاقات

- Case واحدة -> عدة Assets.
- Order ID واحد -> عدة Cases ممكنة.
- Asset أساسي -> Canonical Case واحدة.
- إعادة استخدام صورة قديمة في Case جديدة لا يغير ملكية الـAsset القديمة؛ سجّل علاقة `reference_asset_id` أو `derived_from_asset_id`.

## الأمان

- لا ترفع صور العملاء إلى GitHub العام.
- لا تحفظ Tokens أو Secrets في Case.
- لا تدّعِ أن ملفًا على Drive بدون Drive File ID فعلي.
- لا تربط صورة بـAsset ID عند الشك؛ استخدم PENDING_UPLOAD أو MISSING.
