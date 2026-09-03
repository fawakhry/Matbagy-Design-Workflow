# حفظ الحالة بعد موافقة المستخدم — صندوق مطبعجي

## متى يسمح بالحفظ؟

لا تحفظ داخل `CASES/` إلا بعد موافقة المستخدم الصريحة على الـDraft، مثل:

- `تمام سجل`
- `اعتمد وسجل`
- `سجل كده`
- أو صياغة واضحة لا تحتمل اللبس

## قبل الكتابة

1. اقرأ `../SCHEMA/DESIGN_CASE_SCHEMA.md`.
2. اقرأ `../SCHEMA/ASSET_LINKING_CONTRACT.md`.
3. طبّق أي تصحيحات قالها المستخدم بعد عرض الـDraft.
4. تأكد أن كل حقول غير مؤكدة مازالت موسومة `INFERRED` أو `UNKNOWN`.
5. لا تخترع روابط صور أو IDs أو موافقات غير موجودة.
6. افحص الحالات الحالية لتحديد Case ID جديد بدون تعارض.

## Case ID

الصيغة:

`DESIGN-YYYY-NNNNNN`

مثال:

`DESIGN-2026-000001`

يجب اختيار الرقم التالي المتاح بعد فحص الحالات المسجلة في السنة نفسها.

## Order ID

- إذا كان Order ID ظاهرًا بوضوح في المحادثة، سجله كما هو.
- إذا لم يكن موجودًا، سجّل `UNKNOWN`.
- ممنوع اختراعه.
- يمكن إضافته لاحقًا بدون تغيير Case ID.
- Order ID الواحد قد يرتبط بأكثر من Design Case.

## Asset IDs عند الحفظ

قبل كتابة الحالة النهائية:

1. احصر كل الصور/الملفات المرئية المسجلة في الـDraft.
2. حوّل Draft Asset IDs إلى IDs نهائية مرتبطة بالـCase.
3. استخدم الصيغة:

`<CASE_ID>-A001`
`<CASE_ID>-A002`
`<CASE_ID>-A003`

مثال:

`DESIGN-2026-000001-A001`

4. حدّث أي `result_asset_id` أو `final_asset_id` أو `derived_from_asset_id` ليشير إلى الـIDs النهائية.
5. إذا لم يوجد Storage خاص للصور بعد، لا تترك الصورة بدون سجل؛ استخدم:

- `asset_binding_status: PENDING_STORAGE`
- `storage_provider: PENDING`
- `storage_ref: PENDING`

الهدف أن تكون كل صورة محجوزة بمعرف ثابت من الآن حتى يمكن ربط الملف الحقيقي لاحقًا.

## مكان الحفظ

`CASES/YYYY/DESIGN-YYYY-NNNNNN.md`

## محتوى الملف

يجب أن يحتوي:

- YAML front matter مختصر للفهرسة.
- Request.
- Design Intent.
- Constraints.
- Assets map مع Case ID / Order ID / Asset IDs.
- Attempts Timeline.
- Approval state.
- Reusable Rules.
- Customer preferences عند وجود هوية مؤكدة.
- Search Tags.
- Truth/Confidence notes.

ويفضل أن يتضمن الـYAML:

- `case_id`
- `order_id`
- `approval_status`
- `asset_count`
- `linked_asset_count`
- `pending_asset_count`

## الصور والبيانات الخاصة

الـRepository الحالي قد يكون Public.

لذلك في V1.1:

- لا ترفع صور عملاء حقيقية إلى GitHub العام.
- لا تكتب أرقام هواتف أو عناوين أو معلومات شخصية غير لازمة للتعلم.
- استخدم Asset metadata/placeholder بدل الملف الحقيقي إذا لم يوجد تخزين خاص معتمد.
- لا تحفظ secrets بأي شكل.

## الربط المستقبلي للصور

عندما يعتمد مكان الصور لاحقًا:

- لا تعيد استخراج المحادثة.
- لا تنشئ Case ID جديدة لنفس الحالة.
- استخدم الـAsset IDs المحجوزة لمطابقة الملفات الحقيقية.
- حدّث فقط بيانات الربط Storage fields.
- حافظ على الـTimeline والتاريخ القديم.

راجع `../SCHEMA/ASSET_LINKING_CONTRACT.md` قبل أي عملية Backfill للصور.

## بعد الحفظ

أبلغ المستخدم بـ:

- Case ID.
- Order ID أو `UNKNOWN`.
- المسار الذي تم الحفظ فيه.
- Approval status.
- عدد المحاولات التي تم تسجيلها.
- عدد الـAssets المحجوزة.
- عدد الصور `PENDING_STORAGE`.
- عدد القواعد القابلة لإعادة الاستخدام.

## عدم تعديل التاريخ بصمت

إذا عاد المستخدم لاحقًا بمعلومة أو تعديل على Case محفوظة:

- لا تمسح التاريخ السابق بدون أثر.
- حدّث الحالة بطريقة تحافظ على Timeline.
- سجّل سبب التعديل وتاريخه.

الهدف أن يظل صندوق مطبعجي Audit Trail حقيقي لتعلّم المصمم الذكي.