# Auto Persistence Policy — صندوق مطبعجي

**Status:** `ACTIVE / USER_APPROVED / OVERRIDES_OLD_HUMAN_SAVE_GATE`

## القرار

المستخدم لا يريد انتظار موافقة مثل `اعتمد وسجل` بعد استخراج كل شات.

الوضع الرسمي من الآن:

`READ CHAT -> EXTRACT -> DEDUP -> CREATE/UPDATE CASE -> UPLOAD AVAILABLE ASSETS -> WRITE DRIVE IDS -> PERSIST GITHUB -> SHOW DRIVE LINKS FOR OPTIONAL VERIFICATION`

## قاعدة الأولوية

هذا الملف يلغي أي تعليمات أقدم داخل المشروع تقول:
- أنشئ Draft ثم انتظر موافقة المستخدم قبل الحفظ.
- لا ترفع الصور قبل `اعتمد وسجل`.

إذا ظهر تعارض، هذه السياسة هي الأحدث والأعلى أولوية.

## التنفيذ

عند طلب استخراج شات أو عند تشغيل صندوق مطبعجي على محادثة قديمة:

1. اقرأ المحادثة كاملة.
2. استخرج كل Design Case مستقلة.
3. ابحث عن Duplicate قبل إنشاء Case جديدة.
4. حدّث Case موجودة أو أنشئ Case ID جديد تلقائيًا.
5. استخرج Facts / Requests / Text / Dimensions / Assets / Versions / Feedback / Acceptance / Rejection / Failures / Rules / Tags.
6. ارفع كل ملف/صورة متاحة فعليًا إلى Google Drive داخل:
   `My Drive/مشروع مطبعجي - Matbagy Project/01_Design_Cases/YYYY/<CASE_ID>/`
7. سجّل `drive_file_id` الحقيقي والرابط لكل Asset تم رفعه.
8. إذا الملف غير متاح للأداة، استخدم `PENDING_UPLOAD` أو `MISSING` ولا توقف حفظ باقي الـCase.
9. احفظ Case metadata والـTimeline والـRoom/Storage records على GitHub.
10. اعرض للمستخدم بعد الانتهاء روابط Google Drive للـCase/Assets المرفوعة للتأكد إذا أحب فقط.

## لا يوجد Approval Gate للحفظ

المستخدم لا يحتاج أن يقول:
- `اعتمد وسجل`
- `تمام سجل`

هذه العبارات ليست شرطًا للحفظ بعد الآن.

## Final Design Approval مختلف

الحفظ التلقائي للذاكرة لا يعني أن التصميم Final.

`memory_persistence_status` مستقل عن `design_final_approval`.

إذا لا يوجد Evidence واضح لاعتماد التصميم:

`design_final_approval: NOT_CONFIRMED`

حتى لو كانت الـCase نفسها محفوظة بالكامل.

إذا كان الشات التاريخي يحتوي بالفعل على اعتماد واضح لنسخة بعينها، سجله كـEvidence بدون طلب إعادة اعتماد من المستخدم.

## فشل الصور

إذا فشل Image Generation/Image Edit:
- سجل المحاولة `FAILED_NO_RESULT`.
- لا تخترع Result Asset.
- أكمل Auto-Persist.
- لا تعاود التوليد تلقائيًا بسبب الحفظ.

## التأكيد الاختياري بعد الحفظ

بعد النجاح اعرض باختصار:
- `CASE_ID`
- Case folder link
- Asset links
- `LINKED` count
- `PENDING_UPLOAD` count
- `MISSING` count
- `design_final_approval`
- `SAFE_TO_DELETE_CHAT` فقط إذا persistence verified بالكامل.

المستخدم يستطيع فتح الروابط للتأكد إذا أراد، لكن عدم فتحها لا يمنع الحفظ.

## قاعدة نهائية

`AUTO_PERSIST_FIRST; OPTIONAL_VERIFY_AFTER`

ولا تستخدم التأكيد البشري كعنق زجاجة لاستخراج المحادثات القديمة.