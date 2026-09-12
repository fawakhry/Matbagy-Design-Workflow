# AGENTS.md

## Repository zones

هذا المستودع يحتوي ثلاث مناطق منفصلة ويجب عدم خلطها:

1. Root static MVP (`index.html`, `app.js`, `styles.css`)
   - واجهة تجريبية قديمة مستقلة.
   - بياناتها اختبارية ومحلية في المتصفح.
   - ليست Source of Truth لذاكرة التصميمات.

2. `صندوق_مطبعجي/`
   - الذاكرة الرسمية للمشروع: Cases / Rooms / Knowledge / Schemas / Project Book.
   - Repository/Branch الرسمي: `fawakhry/Matbagy-Design-Workflow@agent/initial-mvp`.

3. `runtime/`
   - طبقة Orchestrator قابلة للاختبار.
   - يجب أن يبقى الـCore deterministic ومستقلًا عن مزودي الخدمات.

## Safety rules

- لا تضع real customer images أو secrets أو API keys أو tokens أو credentials في GitHub العام.
- صور العملاء الفعلية تبقى في Google Drive حسب عقود صندوق مطبعجي؛ GitHub يحتفظ metadata/IDs/links فقط.
- لا تعتبر أي Runtime integration Production إلا بعد deploy + runtime verification موثق.
- لا تجعل AI يغلق Case أو ينشئ Final Approval من نفسه؛ `AI_AUTHORITY = ADVISORY_ONLY`.
- لا تخلط TrendOS/EasyStore/Matbagy Photo Sheets مع Design Case Memory.
- أي اتصال فعلي بـOpenAI/Gemini/Google Drive/GitHub writes يجب أن يكون Server-side، مع أسرار خارج Frontend والمستودع العام.
- لا تفعل production integrations أو webhooks أو automation مؤثرة بدون تعليمات مستخدم صريحة تخص هذا الربط.

## Development sequence

يفضل الترتيب:

`Pure Core -> Mock Adapters -> Provider Interfaces -> Test Environment -> Auth/Audit -> Runtime Verification -> Controlled Production Activation`

## Test data

- استخدم بيانات صناعية في اختبارات Runtime والـMVP.
- لا تنسخ بيانات عميل حقيقية إلى fixtures أو screenshots أو test logs.

## Project continuity

قبل عمل جوهري اقرأ:

1. `صندوق_مطبعجي.md`
2. `صندوق_مطبعجي/PROJECT_BOOK.md`
3. العقود ذات الصلة داخل `صندوق_مطبعجي/SCHEMA/`
4. `runtime/README.md` إذا كانت المهمة تخص البناء التقني.

بعد أي تقدم جوهري حدّث `PROJECT_BOOK.md` بخلاصة عالية المستوى فقط.
