# LESSONS — DESIGN-2026-000001

> لا تعتبر أي Lesson قاعدة عامة نهائية بدون Evidence مناسب.

## Case-specific lessons

### L001
- `lesson_id`: `L001`
- `lesson_type`: `CASE_SPECIFIC`
- `rule`: طلب حذف سطر الاسم يجب تنفيذه كوحدة كاملة، لا تغيير الاسم فقط.
- `evidence_case_id`: `DESIGN-2026-000001`
- `evidence_version_id`: `V1`, `V2`
- `evidence_type`: `OWNER_DECISION`
- `confidence`: HIGH
- `promoted_to_global_rules`: NO

### L002
- `lesson_id`: `L002`
- `lesson_type`: `CASE_SPECIFIC`
- `rule`: المحاولة التي لا تنتج ملفًا/صورة قابلة للمراجعة لا تعتبر Version ناجحة أو Final.
- `evidence_case_id`: `DESIGN-2026-000001`
- `evidence_version_id`: `V1`, `V2`
- `evidence_type`: `REJECTION`
- `confidence`: HIGH
- `promoted_to_global_rules`: NO

## Reusable candidates

### L003
- `lesson_id`: `L003`
- `lesson_type`: `REUSABLE`
- `rule`: عند تعديل تصميم موجود، لا تغيّر عناصر غير مطلوبة إلا إذا طلب المستخدم ذلك بوضوح.
- `evidence_case_id`: `DESIGN-2026-000001`
- `evidence_version_id`: `V1`, `V2`
- `evidence_type`: `OWNER_DECISION`
- `confidence`: MEDIUM
- `promoted_to_global_rules`: NO

> الحالة ليست `CLOSED` بعد، لذلك هذه الدروس لا تعتبر Closing Lessons نهائية. عند الإغلاق يجب إعادة مراجعتها مقابل القرار النهائي والنسخة المعتمدة إن وجدت.
