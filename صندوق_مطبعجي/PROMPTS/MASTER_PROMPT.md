# البرومبت الموحد — صندوق مطبعجي

> هذا الملف مرجع داخلي. المستخدم لا يحتاج لنسخه يدويًا.

## Startup

ابدأ دائمًا من:
- Repository: `fawakhry/Matbagy-Design-Workflow`
- Branch: `agent/initial-mvp`
- Entry: `صندوق_مطبعجي.md`
- Continuation Book: `صندوق_مطبعجي/PROJECT_BOOK.md`
- Instructions: `صندوق_مطبعجي/اقرأني_أولاً.md`

## قاعدة الاستكمال

لا تبدأ من الصفر.
اقرأ `PROJECT_BOOK.md` أولًا، ثم افحص commits الأحدث من checkpoint المسجل فيه. إذا ظهرت Evidence أحدث، حدث الكتيب واستمر من آخر حالة متحققة.

## عند استخراج شات تصميم

1. اقرأ المحادثة كاملة.
2. افصل Design Cases المستقلة.
3. اعمل Dedup قبل إنشاء Case جديدة.
4. استخرج Request / text / dimensions / assets / versions / feedback / acceptance / rejection / failures / rules / tags.
5. استخدم `DESIGN_CASE_SCHEMA.md` و`ASSET_LINKING_CONTRACT.md`.
6. Order ID غير الموثق = `UNKNOWN`.
7. خصص Asset ID لكل صورة/ملف.
8. لا تضع صور العملاء على GitHub العام.

## Auto-Persist — السلوك الرسمي

طبق:
- `SCHEMA/AUTO_PERSISTENCE_POLICY.md`
- `SCHEMA/APPROVAL_COMMAND_ROUTER.md`

المسار:

`READ -> EXTRACT -> DEDUP -> CREATE/UPDATE CASE -> AUTO-SELECT ARCHIVAL FINAL -> UPLOAD AVAILABLE ASSETS -> WRITE DRIVE IDS -> PERSIST GITHUB -> OPTIONAL VERIFY`

لا تنتظر `اعتمد وسجل` أو `تمام سجل` كشرط للحفظ.

## Final Selection

1. Explicit Final Evidence.
2. Latest Successful Non-Rejected Result لم يتبعه طلب تعديل.
3. Latest Explicitly Liked/Accepted Result غير مرفوض لاحقًا.
4. وإلا `NO_VALID_FINAL_ASSET`.

`ARCHIVAL FINAL != CUSTOMER APPROVAL`.

## عند استدعاء شغل قديم

1. ابحث بـCase ID ثم Order ID ثم المنتج/المقاس/الكلمات.
2. اقرأ Case + Room + Assets.
3. استخدم Drive File IDs فقط للأصول `LINKED`.
4. أعط الأولوية لـFINAL_APPROVED ثم EXPLICITLY_LIKED ثم PARTIAL_ACCEPTANCE.
5. REJECTED/FAILED = Negative Learning فقط.

## AI Room

ChatGPT وGemini مستشاران فقط:
`AI_AUTHORITY = ADVISORY_ONLY`

الـOrchestrator الحقيقي غير Production حاليًا؛ استخدم GitHub Rooms + Manual Bridge عند الحاجة.

## الحقيقة

افصل:
`CUSTOMER_FACT | OWNER_DECISION | CHATGPT_OPINION | GEMINI_OPINION | SYSTEM_STATE | INFERRED | UNKNOWN`

لا تخترع IDs أو approvals أو live order/payment/production facts.

## Safe Delete

قل `SAFE_TO_DELETE_CHAT` فقط بعد تحقق حفظ Case/Timeline/Versions/Assets/Archival Final وعدم بقاء معلومة مهمة داخل الشات فقط.

## الأمر البشري المختصر

يكفي أن يقول المستخدم:
`ادخل جيت هب صندوق مطبعجي`

أو:
`كمل مشروع صندوق مطبعجي`

والـAI يتولى باقي ملفات التشغيل تلقائيًا.
