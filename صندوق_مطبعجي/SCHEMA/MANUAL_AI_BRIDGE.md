# Manual AI Bridge — صندوق مطبعجي

> بروتوكول التشغيل المؤقت بين ChatGPT وGemini عندما لا يملك Gemini وصولًا مباشرًا إلى GitHub أو لا توجد API Room فعالة.

## الحالة

`ACTIVE_TEMPORARY_BRIDGE`

هذا البروتوكول مخصص لفترة التشغيل المجاني/اليدوي قبل تنفيذ الـOrchestrator الحقيقي.

## الحقيقة التشغيلية

قد لا يملك Gemini في بعض البيئات وصولًا مباشرًا إلى GitHub أو صلاحية كتابة عليه. عندها:
- لا يطلب من المستخدم نسخ كل README أو كل ملفات الـCase يدويًا.
- لا يدّعي أنه قرأ GitHub.
- لا يدّعي أنه حفظ رأيه على GitHub.
- يستخدم Bridge Packet منظمًا يجهزه ChatGPT/المنصة.

## الاتجاه 1 — من ChatGPT إلى Gemini

عندما يقول المستخدم مثلًا:
- `جهز لجيمناي`
- `هات لجيمناي الحالة`
- `خلي جيمناي يراجع`

على ChatGPT أن يقرأ من GitHub كل ما يلزم فقط من:
- Case record
- STATUS.md
- CHATGPT.md
- GEMINI.md
- DECISION.md
- VERSIONS.md
- DISAGREEMENTS.md
- LESSONS.md عند الحاجة
- Asset metadata

ثم يخرج Packet واحدًا قابلًا للنسخ بعنوان:

`MATBAGY_HANDOFF_PACKET`

ويحتوي على الأقل:
- `case_id`
- `order_id`
- `case_phase`
- `current_version_id`
- `task_for_gemini`
- `customer_facts`
- `owner_decisions`
- `chatgpt_opinion`
- `must_keep`
- `must_avoid`
- `relevant_asset_ids`
- `relevant_visual_descriptions`
- `open_disagreements`
- `exact_questions_for_gemini`
- `required_output_format`

لا يرسل Secrets أو بيانات غير لازمة.

## الاتجاه 2 — من Gemini إلى ChatGPT

Gemini يجب أن يرجع Packet واحدًا بعنوان:

`GEMINI_RESULT_PACKET`

ويحتوي على:
- `case_id`
- `version_id`
- `source_type: GEMINI_OPINION`
- `visual_analysis`
- `reference_analysis`
- `must_keep_check`
- `must_avoid_check`
- `differences`
- `print_qa`
- `cut_qa`
- `verdict: PASS | NEEDS_CHANGE | FAIL`
- `recommendation`
- `confidence`
- `disagreement_with_chatgpt: NONE | PRESENT`
- `disagreement_reason`
- `needs_user_decision: YES | NO`
- `proposed_changes`
- `persistence_status: NOT_PERSISTED_BY_GEMINI`

## التسجيل بعد رجوع Gemini

عندما يلصق المستخدم `GEMINI_RESULT_PACKET` في ChatGPT:

1. تحقق من Case ID وVersion ID.
2. لا تغيّر Facts أو Owner Decision بسبب رأي Gemini.
3. سجل رأي Gemini في `ROOMS/YYYY/<CASE_ID>/GEMINI.md`.
4. إذا وجد خلاف حقيقي مع ChatGPT، حدّث `DISAGREEMENTS.md`.
5. حدّث `SYNC_LOG.md` بسجل أن Gemini result تم استلامه يدويًا.
6. حدّث `STATUS.md` فقط إذا كانت هناك حالة Workflow حقيقية تستدعي ذلك.
7. لا تغلق Case ولا تعتمد Final إلا بقرار المستخدم/Customer Evidence.

بعد نجاح الكتابة الفعلية على GitHub، يمكن لـChatGPT أن يقول:

`GEMINI_RESULT_PERSISTED`

## الصور

إذا كان Gemini يحتاج رؤية صورة فعلية ولم يكن لديه Drive/GitHub access:
- يجب أن يرسل المستخدم الصورة نفسها في محادثة Gemini، أو توفرها المنصة لاحقًا.
- Asset ID وحده لا يجعل الصورة مرئية.
- ChatGPT لا يدّعي أن Gemini رأى صورة لم تُرسل له فعليًا.

## تقليل الاحتكاك

الهدف أن المستخدم لا ينسخ ملفات طويلة.

التشغيل المؤقت المطلوب:

1. المستخدم يطلب من ChatGPT: `جهز لجيمناي`.
2. ChatGPT يعطي Packet واحدًا.
3. المستخدم يلصق Packet في Gemini ويضيف الصور المطلوبة إن وجدت.
4. Gemini يرجع `GEMINI_RESULT_PACKET`.
5. المستخدم يلصقه في ChatGPT.
6. ChatGPT يسجله في GitHub ويؤكد `GEMINI_RESULT_PERSISTED`.

## بعد تنفيذ الـAPI Room

عند وجود Orchestrator حقيقي، نفس Packet structure يظل صالحًا داخليًا لكن النقل يصبح أوتوماتيك بدل Copy/Paste.
