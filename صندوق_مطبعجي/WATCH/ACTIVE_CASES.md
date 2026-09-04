# Active Cases Watch — صندوق مطبعجي

> الفهرس المؤقت للحالات التي يجب متابعتها حتى اعتماد القرار النهائي.

## DESIGN-2026-000001

- `case_id`: `DESIGN-2026-000001`
- `order_id`: `UNKNOWN`
- `room_path`: `صندوق_مطبعجي/ROOMS/2026/DESIGN-2026-000001/`
- `room_status`: `OPEN`
- `case_phase`: `OPEN`
- `watch_status`: `ACTIVE`
- `approval_status`: `NOT_CONFIRMED`
- `ai_authority`: `ADVISORY_ONLY`
- `current_version`: `NONE`
- `next_version`: `V3`
- `chatgpt_status`: `PENDING_SYNC`
- `gemini_status`: `PENDING_SYNC`
- `user_decision`: `PENDING`
- `open_disagreements`: `0`
- `close_condition`: explicit user final approval / `تم` / `اعتمد نهائي` / `اقفل الكيس`

## Watch rule

- الحالات المفتوحة أو تحت المراجعة أو المنتظرة أو المعاد فتحها تظل هنا.
- `watch_status` يظل `ACTIVE` خلال: `OPEN`, `UNDER_REVIEW`, `REVISION_REQUIRED`, `WAITING_CUSTOMER_APPROVAL`, `FINAL_APPROVED`, `REOPENED` حتى الإغلاق الفعلي.
- عند `CLOSED` يتحول `watch_status` إلى `STOPPED` ولا تستمر المتابعة الدورية لها.
- إذا أعيد فتحها، تعود `ACTIVE` بنفس Case ID ويبدأ Version جديد بعد آخر Version محفوظة.
- أي خلاف بين ChatGPT وGemini لا يغلق المتابعة؛ يسجل في `DISAGREEMENTS.md` ويحتاج حسم المستخدم أو Customer Evidence.
