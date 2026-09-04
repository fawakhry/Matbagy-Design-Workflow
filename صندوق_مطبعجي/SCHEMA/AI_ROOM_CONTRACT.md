# Matbagy AI Room Contract — صندوق مطبعجي

> عقد التشغيل المشترك لغرفة مطبعجي التي تضم المستخدم + ChatGPT + Gemini.

## الحالة

`APPROVED_ARCHITECTURE / NOT_YET_IMPLEMENTED_IN_PRODUCTION`

هذه وثيقة معمارية وتشغيلية. وجودها لا يعني أن الربط بين APIs تم نشره أو اختباره إنتاجيًا.

## الفكرة

تعمل منصة مطبعجي كـ`AI Orchestrator` ووسيط وحيد بين الأطراف:

`User <-> Matbagy Orchestrator <-> ChatGPT`

`User <-> Matbagy Orchestrator <-> Gemini`

لا يتصل ChatGPT بـGemini مباشرة خارج المنصة، ولا يتصل Gemini بـChatGPT مباشرة خارج المنصة. المنصة تنقل الرسائل والسياق وتحدد الدور والحدود.

## الأطراف

### User / Owner
- طرف كامل داخل الغرفة.
- يستطيع مخاطبة AI واحد أو الاثنين.
- يملك القرار النهائي والاعتماد.
- يستطيع إيقاف النقاش أو طلب جولة إضافية.

### ChatGPT
الدور الأساسي:
`Design Orchestrator + Memory Manager + Workflow Planner + Final Synthesizer`

المهام:
- فهم طلب المستخدم.
- قراءة صندوق مطبعجي والحالات السابقة.
- تكوين Design Context.
- إدارة Case ID / Order ID / Asset IDs.
- تحديد ما يجب إرساله إلى Gemini للتحليل البصري.
- دمج نتيجة Gemini مع الذاكرة والقواعد.
- تلخيص القرار والخطوة التالية للمستخدم.

### Gemini
الدور الأساسي:
`Visual Intelligence + Design Reviewer + Reference Comparator`

المهام:
- تحليل الصور والمراجع.
- مقارنة النسخ والمحاولات.
- اكتشاف layout/style/color/composition patterns.
- مراجعة الحفاظ على الملامح والنصوص والعناصر.
- إجراء Visual QA وPrint/Cut QA عند الحاجة.
- إرجاع نتيجة منظمة للـOrchestrator.

## الذاكرة المشتركة

الذاكرة الرسمية للتصميمات ليست ذاكرة ChatGPT أو Gemini منفردًا.

المصدر المشترك:
- GitHub: `صندوق_مطبعجي/CASES/` + القواعد والـschemas.
- Google Drive: الصور المرتبطة بالـAssets.

العلاقة:
`Case ID -> Asset ID -> Google Drive File ID`

لا يجوز لأي Agent إنشاء حقيقة موازية تخالف صندوق مطبعجي.

## Live Facts

حقائق التشغيل الحية مثل Order/Payment/Production لا تؤخذ من AI memory. إذا تم ربط الغرفة بـTrendOS مستقبلًا، تأتي هذه الحقائق من TrendOS connectors/source-of-truth فقط.

## Room IDs

كل جلسة/رسالة داخل المنصة يفضل أن تحمل:
- `room_id`
- `conversation_id`
- `message_id`
- `sender`: USER | CHATGPT | GEMINI | SYSTEM
- `case_id`: إن وجد
- `order_id`: إن وجد
- `asset_ids`: قائمة إن وجدت
- `reply_to_message_id`: إن وجد
- `created_at`

## أوضاع المخاطبة

### @GPT
يرد ChatGPT فقط، إلا إذا قرر المستخدم صراحة طلب Gemini بعد ذلك.

### @Gemini
يرد Gemini فقط.

### @الكل / BOOM MODE
يعمل الاثنان في نفس المهمة تحت تحكم Orchestrator.

المسار الافتراضي المقترح:
1. USER -> ChatGPT
2. ChatGPT -> Gemini عند وجود حاجة بصرية/مقارنة أو مراجعة ثانية
3. Gemini -> ChatGPT بنتيجة منظمة
4. ChatGPT -> USER بخلاصة موحدة

يجوز للواجهة عرض رسائل الطرفين للمستخدم بشكل مرئي بدل إخفائها.

## منع الحلقات اللانهائية

- ممنوع أن يظل Agentان يردان على بعضهما بلا نهاية.
- افتراضيًا أقصى عدد جولات AI-to-AI في طلب المستخدم الواحد: `3`.
- بعد ذلك تعاد الكلمة للمستخدم أو يصدر ChatGPT خلاصة.
- يمكن للمستخدم طلب `ناقشوا أكتر` لفتح جولة إضافية محددة.

## بروتوكول طلب داخلي مقترح

عندما يحتاج ChatGPT تحليلًا بصريًا:

`CALL_GEMINI_VISUAL_REVIEW(case_id, asset_ids, task, constraints)`

وعندما يحتاج Gemini ذاكرة أو قواعد:

`ASK_CHATGPT_MEMORY(case_id, query)`

هذه أسماء منطقية داخلية للـOrchestrator وليست API endpoints مثبتة حتى الآن.

## Shared Context Packet

عند تمرير مهمة من Agent لآخر، يرسل Orchestrator أقل Context كافٍ:
- Current user request
- Case ID / Order ID
- Relevant Asset IDs
- Must Keep
- Must Avoid
- Relevant approved cases/rules
- Current attempt/version
- Exact task requested from the receiving Agent

لا ترسل كل التاريخ بلا حاجة.

## Gemini output contract

يفضل أن يرجع Gemini:
- `VISUAL_ANALYSIS`
- `REFERENCE_ANALYSIS`
- `MUST_KEEP_CHECK`
- `MUST_AVOID_CHECK`
- `DIFFERENCES`
- `PRINT_QA`
- `CUT_QA`
- `VERDICT`: PASS | NEEDS_CHANGE | FAIL
- `RECOMMENDATION`
- `CONFIDENCE`

## ChatGPT output contract

يفضل أن يرجع ChatGPT للمستخدم:
- ما فهمه من الهدف
- ما استعاده من الذاكرة عند الحاجة
- خلاصة Gemini عند استخدامه
- القرار الموحد
- ما يحتاج اعتماد المستخدم
- Case/Asset references المهمة

## Security

- مفاتيح OpenAI وGemini لا توضع في Frontend/browser.
- تخزن الأسرار Server-side فقط.
- لا تمرر Secrets داخل الرسائل بين الـAgents.
- صور العملاء تبقى في Google Drive وفق قواعد صندوق مطبعجي.
- GitHub العام يحفظ metadata والقواعد فقط، لا صور العملاء الحقيقية.

## Target architecture

المسار المستهدف:

`Matbagy UI -> Matbagy AI Orchestrator -> OpenAI API + Gemini API -> صندوق مطبعجي + Google Drive Assets`

يمكن استضافة الـOrchestrator على Cloudflare لاحقًا، لكن ذلك يحتاج تنفيذًا واختبارات منفصلة قبل اعتباره Production.

## Truth labels

أي معلومة غير مؤكدة تظل:
- `EXPLICIT`
- `INFERRED`
- `UNKNOWN`

ولا يجوز لأي Agent اختراع Final Approval أو Order ID أو Asset link أو Drive File ID.
