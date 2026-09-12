# استخراج محادثة قديمة — صندوق مطبعجي

> **Current behavior:** Auto-Persist. هذا الملف يلغي أي نص Legacy سابق كان يطلب انتظار `اعتمد وسجل` قبل الحفظ.

ابدأ من:
- `../PROJECT_BOOK.md`
- `../SCHEMA/AUTO_PERSISTENCE_POLICY.md`
- `../SCHEMA/APPROVAL_COMMAND_ROUTER.md`
- `../SCHEMA/DESIGN_CASE_SCHEMA.md`
- `../SCHEMA/ASSET_LINKING_CONTRACT.md`

## المهمة

اقرأ المحادثة كاملة من أول رسالة إلى آخر رسالة متاحة، وافصل كل Design Case مستقلة.

لكل Case استخرج فقط ما تدعمه المحادثة:
- الطلب الأصلي.
- النصوص حرفيًا.
- نوع المنتج/المطبوع.
- المقاس والوحدة والكمية.
- الصور الأصلية والمراجع ودور كل Asset.
- Layout / Style / Colors / Fonts إن ذكرت.
- Must Keep / Must Avoid.
- كل Attempt/Version ونتيجتها.
- Feedback والتعديلات والقبول والرفض.
- Order ID فقط إذا ظهر من مصدر موثوق، وإلا `UNKNOWN`.
- Reusable Rules / Negative Learning / Search Tags.

## Dedup — قبل إنشاء Case

ابحث داخل `CASES/` أولًا. إذا ثبت أنها نفس الحالة:
- استخدم نفس Case ID.
- نفذ Update/Backfill.
- لا تنشئ Duplicate.

إذا لم يثبت التطابق، لا تدمج تلقائيًا.

## Assets

خصص Asset ID لكل ملف/صورة.

- الصور الفعلية: Google Drive.
- GitHub: metadata/IDs/links فقط.
- `LINKED` لا تستخدم إلا بعد وجود Drive File ID حقيقي.
- إذا الملف غير متاح: `PENDING_UPLOAD` أو `MISSING`.

## Truth Labels

`EXPLICIT | INFERRED | UNKNOWN`

لا تحول INFERRED إلى Fact.

## Auto-Persist — إلزامي

بعد الاستخراج ومنع التكرار:

`CREATE/UPDATE CASE -> AUTO-SELECT ARCHIVAL FINAL -> UPLOAD AVAILABLE ASSETS -> WRITE DRIVE IDS -> PERSIST GITHUB`

لا تنتظر أي Approval Gate للحفظ.

لا تطلب:
- `اعتمد وسجل`
- `تمام سجل`

كشرط للحفظ.

## Final Selection

طبق `AUTO_PERSISTENCE_POLICY.md`:
1. Explicit final evidence إن وجد.
2. آخر نتيجة ناجحة غير مرفوضة ولم يتبعها طلب تعديل.
3. آخر نتيجة عليها قبول واضح ولم تُرفض لاحقًا.
4. وإلا `NO_VALID_FINAL_ASSET`.

هذا اختيار أرشيفي فقط ولا يساوي موافقة العميل.

## بعد الحفظ

اعرض عند توفرها:
- Case ID
- Case folder URL
- Asset links
- LINKED / PENDING / MISSING counts
- archival_final_status
- customer_approval_status إن كان موثقًا
- SAFE_TO_DELETE_CHAT فقط بعد تحقق persistence بالكامل.
