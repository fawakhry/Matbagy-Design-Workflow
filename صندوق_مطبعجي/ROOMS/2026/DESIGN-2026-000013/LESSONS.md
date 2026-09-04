# LESSONS — DESIGN-2026-000013

## L001
- `lesson_id`: L001
- `lesson_type`: CASE_SPECIFIC
- `rule`: عند تعديل هذا التصميم، طلب المستخدم لخلفية بيضاء بدون أي تزيين ألغى اتجاه الزينة الموجود في المرجع وV1.
- `evidence_case_id`: DESIGN-2026-000013
- `evidence_version_id`: V1 -> V2
- `evidence_type`: REJECTION
- `confidence`: HIGH
- `promoted_to_global_rules`: NO

## L002
- `lesson_id`: L002
- `lesson_type`: REUSABLE
- `rule`: إذا طلب المستخدم صراحة `خلفية بيضاء بدون أي تزيين` بعد تقديم مرجع مزخرف، يُعامل الطلب كـOverride مباشر للزخارف مع الحفاظ فقط على العناصر التي لم يُلغها المستخدم.
- `evidence_case_id`: DESIGN-2026-000013
- `evidence_version_id`: V2
- `evidence_type`: OWNER_DECISION
- `confidence`: HIGH
- `promoted_to_global_rules`: NO

## L003
- `lesson_id`: L003
- `lesson_type`: REUSABLE
- `rule`: النسخة المرفوضة بسبب الزينة تحفظ كـNegative Learning ولا تُستخدم كمرجع إيجابي للتصميمات المشابهة.
- `evidence_case_id`: DESIGN-2026-000013
- `evidence_version_id`: V1
- `evidence_type`: REJECTION
- `confidence`: HIGH
- `promoted_to_global_rules`: NO

## Closure
- `final_version`: V2
- `final_asset`: DESIGN-2026-000013-A005
- `closed_at`: 2026-09-04T06:07:41+03:00
- `knowledge_status`: PENDING_EXTRACTION
