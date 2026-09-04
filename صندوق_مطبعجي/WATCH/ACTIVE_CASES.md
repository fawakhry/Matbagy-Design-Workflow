# Active Cases Watch — صندوق مطبعجي

> الفهرس المؤقت للحالات التي يجب متابعتها حتى اعتماد القرار النهائي.

## DESIGN-2026-000001

- `case_id`: `DESIGN-2026-000001`
- `order_id`: `UNKNOWN`
- `room_path`: `صندوق_مطبعجي/ROOMS/2026/DESIGN-2026-000001/`
- `room_status`: `OPEN`
- `watch_status`: `ACTIVE`
- `approval_status`: `NOT_CONFIRMED`
- `chatgpt_status`: `PENDING_SYNC`
- `gemini_status`: `PENDING_SYNC`
- `user_decision`: `PENDING`
- `close_condition`: explicit user final approval / `تم` / `اعتمد نهائي` / `اقفل الكيس`

## Watch rule

- الحالات المفتوحة أو المنتظرة أو المعاد فتحها تظل هنا.
- عند `CLOSED` تتحول `watch_status` إلى `STOPPED` ولا تستمر المتابعة الدورية لها.
- إذا أعيد فتحها، تعود `ACTIVE` بنفس Case ID.
