# Approval / Persistence Router — صندوق مطبعجي

> الهدف: فصل حفظ ذاكرة الـCase عن اعتماد التصميم النهائي وعن أوامر التنفيذ، مع اعتماد Auto-Persist بدل انتظار موافقة بشرية على الحفظ.

## الحالة

`ACTIVE / REQUIRED / AUTO_PERSIST`

هذا العقد له الأولوية على أي تعليمات أقدم تطلب `اعتمد وسجل` قبل حفظ الـCase.

## 1) Auto-Persist هو الوضع الافتراضي

بعد استخراج أي شات تصميم أو Case:

1. افهم المحادثة كاملة.
2. افصل الحالات المستقلة.
3. امنع التكرار وابحث عن Case موجودة قبل إنشاء واحدة جديدة.
4. أنشئ أو حدّث Case تلقائيًا بدون انتظار موافقة المستخدم.
5. خصص/حافظ على Case ID وAsset IDs وVersion IDs.
6. ارفع كل Asset متاح فعليًا إلى Google Drive داخل Project Root الرسمي.
7. سجّل Drive File ID الحقيقي لكل ملف تم رفعه.
8. سجّل المحاولات والنتائج والفشل والقبول والرفض كما حدثت.
9. احفظ GitHub metadata والـRoom/Storage records.
10. بعد نجاح الحفظ اعرض للمستخدم روابط Google Drive للصور/Case folder للتأكيد الاختياري فقط.

لا توجد Human Approval Gate لحفظ الذاكرة.

## 2) عبارات مثل `اعتمد وسجل` لم تعد مطلوبة

الأوامر:
- `اعتمد وسجل`
- `تمام سجل`
- `سجل الحالة`

أصبحت اختيارية/Legacy فقط.

إذا قالها المستخدم، لا تشغّل Image Generation ولا تغيّر Final Approval؛ فقط تأكد أن Auto-Persist اكتمل بالفعل.

## 3) اعتماد التصميم النهائي منفصل

`DESIGN_FINAL_APPROVAL` لا يُستنتج من مجرد الحفظ التلقائي.

يُثبت فقط من Evidence واضح، مثل:
- المستخدم يقول صراحة إن التصميم/النسخة نفسها نهائية.
- Customer approval موثق في الشات أو مصدر معتمد.

إذا لا يوجد Evidence نهائي:

`design_final_approval: NOT_CONFIRMED`

ومع ذلك تظل الـCase محفوظة بالكامل.

## 4) أوامر التنفيذ منفصلة

الأوامر مثل:
- `استخرج`
- `نفذ`
- `اعمل التصميم`
- `عدل الصورة`
- `جرب تاني`

هي أوامر تنفيذ/توليد/تعديل حسب السياق.

لا يجوز تحويل Auto-Persist أو أي أمر تسجيل إلى إعادة توليد صورة.

## 5) بعد فشل Image Generation

إذا فشل توليد/تعديل الصورة أو لم ينتج ملفًا قابلًا للمراجعة:

1. سجل المحاولة كـ`FAILED_NO_RESULT`.
2. لا تنشئ `result_asset_id` وهمي.
3. لا تعتبر التصميم Final.
4. أكمل حفظ الـCase تلقائيًا رغم الفشل.
5. لا تعاود تشغيل التوليد إلا بأمر تنفيذ جديد وصريح من المستخدم.

## 6) روابط التحقق الاختيارية

بعد Auto-Persist الناجح، اعرض عند توفرها:
- Case folder URL على Google Drive.
- روابط كل Asset مرفوع فعليًا.
- Case ID.
- عدد LINKED / PENDING_UPLOAD / MISSING.

هذه الروابط للتأكيد الاختياري فقط، وليست Gate لإتمام الحفظ.

## 7) فصل حالات الاعتماد

استخدم مفاهيم مستقلة:

- `memory_persistence_status: PERSISTED | PARTIAL | FAILED`
- `design_final_approval: FINAL_APPROVED | NOT_CONFIRMED`

يمكن أن تكون:

`memory_persistence_status: PERSISTED`

وفي نفس الوقت:

`design_final_approval: NOT_CONFIRMED`

وده طبيعي.

## 8) Safe to delete

بعد Auto-Persist يمكن اعتبار الشات آمنًا للحذف فقط إذا تم التحقق من:
- Case record محفوظ فعليًا.
- Timeline والمحاولات محفوظة.
- كل Asset متاح تم ربطه أو وسمه بوضوح `PENDING_UPLOAD/MISSING`.
- لا توجد بيانات مهمة معروفة ما زالت فقط داخل الشات.

عند تحقق ذلك:

`SAFE_TO_DELETE_CHAT`

إذا فشل الحفظ أو لم يمكن التحقق منه:

`NOT_SAFE_TO_DELETE_CHAT — PERSISTENCE_NOT_CONFIRMED`

## 9) قاعدة نهائية

`AUTO PERSISTENCE != DESIGN FINAL APPROVAL != EXECUTION COMMAND`

الحفظ تلقائي. اعتماد التصميم النهائي يعتمد على Evidence. التنفيذ يحتاج أمر تنفيذ مستقل.