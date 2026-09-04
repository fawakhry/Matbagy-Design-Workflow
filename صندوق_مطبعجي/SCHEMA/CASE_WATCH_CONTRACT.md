# Case Watch & Sync Contract — صندوق مطبعجي

> بروتوكول مؤقت مجاني لتشغيل غرفة مطبعجي قبل ربط OpenAI/Gemini APIs.

## الحالة

`ACTIVE_TEMPORARY_PROTOCOL`

الهدف: جعل كل Case لها حالة واضحة وسجل رأي ChatGPT ورأي Gemini وقرار المستخدم، بحيث يستطيع أي طرف فتح نفس Case وقراءة آخر ما وصل إليه الطرف الآخر.

## مبدأ التشغيل

لا يعتمد البروتوكول على أن ChatGPT أو Gemini يتصلان ببعض مباشرة.

المصدر المشترك المؤقت هو GitHub:

`Case -> Room -> STATUS + CHATGPT + GEMINI + DECISION + SYNC_LOG`

## مكان غرفة كل Case

`صندوق_مطبعجي/ROOMS/YYYY/<CASE_ID>/`

ويفضل أن تحتوي على:

- `STATUS.md` — الحالة الحالية للكيس.
- `CHATGPT.md` — آخر رأي/تحليل/تنفيذ مهم من ChatGPT مع التاريخ.
- `GEMINI.md` — آخر رأي/تحليل/تنفيذ مهم من Gemini مع التاريخ.
- `DECISION.md` — قرارات المستخدم والاعتماد النهائي.
- `SYNC_LOG.md` — سجل المزامنات وتغيّر الحالات.

## حالات الكيس

القيم الرسمية لـ`room_status`:

- `OPEN` — الكيس مفتوحة وما زال العمل جاريًا.
- `WAITING_USER` — ننتظر قرار/اعتماد المستخدم.
- `WAITING_CHATGPT` — هناك نقطة تحتاج مراجعة ChatGPT.
- `WAITING_GEMINI` — هناك نقطة تحتاج مراجعة Gemini.
- `REVIEWING` — يوجد نقاش/مقارنة بين الرأيين.
- `CLOSED` — المستخدم اعتمد القرار النهائي وقال تم/اعتمد نهائيًا.
- `REOPENED` — Case كانت مغلقة ثم فتحها المستخدم مرة أخرى.

## قاعدة الإغلاق

لا تغلق Case تلقائيًا لمجرد وجود رد من ChatGPT أو Gemini.

الإغلاق يحتاج دليلًا صريحًا من المستخدم مثل:

- `تم`
- `اعتمد نهائي`
- `اقفل الكيس`
- أو صياغة صريحة تعني أن القرار النهائي تم اعتماده.

عند الإغلاق:

- `room_status: CLOSED`
- `watch_status: STOPPED`
- سجل القرار في `DECISION.md`.
- أضف حدثًا إلى `SYNC_LOG.md`.
- لا تحذف تاريخ الآراء السابقة.

## إعادة الفتح

إذا قال المستخدم مثل:

- `افتح الكيس`
- `رجعنا نعدل`
- `عاوز تعديل جديد على الكيس`

غيّر:

- `room_status: REOPENED` ثم `OPEN` عند بدء العمل.
- `watch_status: ACTIVE`

واحتفظ بكل التاريخ السابق.

## المزامنة المؤقتة

أثناء عدم وجود APIs/Orchestrator فعلي:

### عندما يعمل ChatGPT على Case

1. اقرأ `STATUS.md`.
2. اقرأ `GEMINI.md` إن كان موجودًا.
3. اقرأ `DECISION.md`.
4. نفّذ المطلوب.
5. حدّث `CHATGPT.md` بآخر رأي أو تنفيذ مهم.
6. أضف Entry إلى `SYNC_LOG.md`.
7. إذا لم يعتمد المستخدم نهائيًا، لا تغلق Case.

### عندما يعمل Gemini على Case

1. اقرأ `STATUS.md`.
2. اقرأ `CHATGPT.md` إن كان موجودًا.
3. اقرأ `DECISION.md`.
4. نفّذ المطلوب.
5. حدّث `GEMINI.md` بآخر رأي أو تنفيذ مهم.
6. أضف Entry إلى `SYNC_LOG.md`.
7. إذا لم يعتمد المستخدم نهائيًا، لا تغلق Case.

## Watch Index

يوجد فهرس للحالات المطلوب متابعتها في:

`صندوق_مطبعجي/WATCH/ACTIVE_CASES.md`

أي Case حالتها `OPEN / WAITING_* / REVIEWING / REOPENED` تبقى في قائمة المتابعة.

أي Case `CLOSED` تزال من المتابعة النشطة أو تظل مؤرشفة بوضوح كـSTOPPED.

## الفحص الدوري

الفحص الدوري هدفه اكتشاف:

- رد جديد من ChatGPT.
- رد جديد من Gemini.
- قرار جديد من المستخدم.
- تغيير حالة Case.
- وصول `CLOSED`.

إذا لا يوجد تغيير مهم، لا حاجة لإزعاج المستخدم برسالة.

## حدود النسخة المجانية المؤقتة

هذا البروتوكول يثبت طريقة تبادل الرأي على GitHub، لكنه لا يجعل Gemini أو ChatGPT يعملان تلقائيًا في الخلفية من تلقاء نفسهما ما لم توجد أداة جدولة/Automation متاحة للطرف نفسه.

عند بناء Matbagy AI Orchestrator لاحقًا، يتحول نفس البروتوكول إلى مزامنة حقيقية بالـAPI دون تغيير Case IDs أو Room history.

## الحقول الأساسية داخل STATUS.md

```yaml
case_id: DESIGN-YYYY-NNNNNN
order_id: UNKNOWN
room_status: OPEN
watch_status: ACTIVE
chatgpt_status: PENDING
chatgpt_last_update: UNKNOWN
gemini_status: PENDING
gemini_last_update: UNKNOWN
user_decision: PENDING
closed_at: null
reopened_at: null
```

## الحقيقة

- لا تعتبر عدم الرد موافقة.
- لا تعتبر آخر رأي قرارًا نهائيًا.
- لا تغلق Case إلا بدليل المستخدم.
- لا تخترع رأي Agent لم يكتبه فعليًا.
- لا تمسح رأيًا سابقًا عند وجود رأي أحدث؛ احتفظ بالتاريخ في سجل المزامنة.
