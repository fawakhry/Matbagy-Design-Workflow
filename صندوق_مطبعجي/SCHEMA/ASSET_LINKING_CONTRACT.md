# قواعد ربط الصور مستقبلًا — صندوق مطبعجي

> هذا الملف يحدد العلاقة الثابتة بين Design Case والأوردر والصور، حتى نستطيع استخراج الشاتات الآن وربط ملفات الصور لاحقًا بدون إعادة الاستخراج.

## المبدأ الأساسي

الذاكرة النصية والصور طبقتان منفصلتان لكن مرتبطتان بمعرفات ثابتة:

`Design Case -> Asset Records -> Future Private Storage`

لا يشترط وجود مكان تخزين الصور الآن. المهم أن كل صورة ظاهرة في الشات تأخذ سجلًا ومعرفًا ثابتًا من لحظة حفظ الـCase.

## المفاتيح

### 1. Case ID — المفتاح الأساسي لذاكرة التصميم

الصيغة:

`DESIGN-YYYY-NNNNNN`

مثال:

`DESIGN-2026-000125`

هذا هو المفتاح الأساسي الذي يجمع البرومبتات، المحاولات، التعديلات، والـAssets الخاصة بنفس حالة التصميم.

### 2. Order ID — رابط تجاري اختياري

إذا كان رقم الأوردر ظاهرًا بوضوح في الشات، يسجل كما هو في `order_id`.

إذا لم يكن ظاهرًا:

`order_id: UNKNOWN`

ممنوع اختراع Order ID.

يمكن إضافة Order ID لاحقًا بدون تغيير Case ID.

**مهم:** قد يحتوي Order ID واحد على أكثر من Design Case، لذلك Order ID ليس بديلًا عن Case ID.

### 3. Asset ID — معرف كل صورة/ملف داخل الحالة

بعد حفظ الـCase، تكون الصيغة المفضلة:

`<CASE_ID>-A001`
`<CASE_ID>-A002`
`<CASE_ID>-A003`

مثال:

`DESIGN-2026-000125-A001`

أثناء الـDraft وقبل تخصيص Case ID نهائي، يمكن استخدام:

`DRAFT-A001`
`DRAFT-A002`

وعند الحفظ يتم تحويلها إلى Asset IDs النهائية التابعة للـCase.

## سجل كل Asset

يجب أن يحتوي Asset Record على الأقل على:

- `asset_id`
- `case_id`
- `order_id`: إن كان معروفًا، وإلا UNKNOWN
- `source_role`: customer_original | reference_design | generated_result | final_approved | unknown
- `conversation_position`
- `purpose`
- `instructions`
- `attempt_id`: إن كانت الصورة نتيجة محاولة محددة
- `derived_from_asset_id`: إن كانت مبنية على Asset سابق معروف
- `privacy_class`
- `asset_binding_status`: PENDING_STORAGE | LINKED | MISSING | REMOVED
- `storage_provider`: PENDING إلى أن يعتمد مكان التخزين
- `storage_ref`: فارغ/PENDING إلى أن يوجد رابط أو معرف فعلي
- `storage_key`: إن وجد لاحقًا
- `content_hash`: اختياري عند التخزين الفعلي للتحقق من الملف
- `linked_at`: تاريخ الربط الفعلي إن تم

## الحالة الحالية قبل اختيار Storage

كل صورة مستخرجة من شات قديم تحفظ كـMetadata فقط:

- `asset_binding_status: PENDING_STORAGE`
- `storage_provider: PENDING`
- `storage_ref: PENDING`

هذا لا يعني أن الصورة ضاعت؛ معناه أن مكانها ودورها في الـCase معروفان، لكن الملف نفسه لم يتم ربطه بعد.

## عند اختيار مكان الصور لاحقًا

عند اعتماد Private Storage:

1. لا نعيد استخراج الشات.
2. نستخدم `case_id` لتحديد الحالة.
3. نطابق الصور مع الـ`asset_id` المحجوزة.
4. نرفع الصورة إلى التخزين الخاص.
5. نحدّث `asset_binding_status` إلى `LINKED`.
6. نسجل `storage_provider` و`storage_ref` و`storage_key` إن توفر.
7. نحافظ على كل Metadata القديمة والتاريخ؛ لا نستبدلها بصمت.

## Convention مقترح لمسار الملفات مستقبلًا

إذا كان الـStorage يدعم Object Keys/Folders، يفضل تنظيمه على Case ID وليس Order ID:

`design-assets/YYYY/<CASE_ID>/<ASSET_ID>/<filename>`

السبب: Case ID ثابت حتى لو Order ID لم يكن معروفًا وقت استخراج الشات أو أضيف لاحقًا.

Order ID يبقى Metadata/Index للبحث والربط مع TrendOS، وليس اسم المجلد الإجباري.

## العلاقات

- Design Case واحد -> عدد غير محدود من Assets.
- Order ID واحد -> قد يرتبط بعدة Design Cases.
- Asset أساسي واحد -> يتبع Canonical Case واحدة.
- إذا أعيد استخدام صورة من Case قديمة في Case جديدة، لا تغيّر ملكية الـAsset القديمة؛ سجّل Relation مثل `derived_from_asset_id` أو `reference_asset_id`.

## كيف سيستخدم AI الصور مستقبلًا؟

عند استرجاع حالة تصميم:

1. يبحث بالـCase ID أو Order ID أو البحث الدلالي.
2. يقرأ الـCase والـAssets map.
3. لكل Asset بحالة `LINKED` يحل `storage_ref` من التخزين الخاص.
4. يعرف دور الصورة من `source_role` قبل استخدامها.
5. يربط الصورة بالمحاولة والتعديل من `attempt_id` وTimeline.
6. يعطي الأولوية للـ`final_approved` عند التعلم، ويستخدم المرفوض كـnegative example فقط.

بهذا لا يعتمد الربط على اسم الملف أو ترتيب الصور وحده.

## قاعدة الأمان

- لا تضع صور العملاء الحقيقية في Repository عام.
- `storage_ref` يجب أن يشير مستقبلًا إلى تخزين خاص/مؤمّن مع صلاحيات مناسبة.
- لا تحفظ Token أو Secret أو Signed URL طويل العمر داخل الـCase.
- إذا احتاج الوصول إلى Signed URL، يتم توليده وقت الطلب من طبقة التخزين، وليس تخزين السر داخل GitHub.

## قاعدة الحقيقة

لا تربط ملفًا بـAsset ID إلا إذا كان التطابق مؤكدًا. عند الشك استخدم `MISSING` أو اتركه `PENDING_STORAGE` بدل ربط صورة خاطئة.
