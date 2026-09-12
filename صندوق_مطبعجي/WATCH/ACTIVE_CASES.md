# Active Cases Watch — صندوق مطبعجي

> فهرس مشتق من Case/Room evidence. عند التعارض اقرأ Case + Room + Decision ثم حدّث هذا الملف؛ لا تعتبره Source of Truth مستقلًا.

## Active / Open

### DESIGN-2026-000001
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: NONE
- `next_version`: V3

### DESIGN-2026-000003
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2

### DESIGN-2026-000004
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2

### DESIGN-2026-000006
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2

### DESIGN-2026-000008
- `case_phase`: UNDER_REVIEW
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V3
- `latest_failed_attempt`: V4 / FAILED_NO_RESULT
- `next_version`: V5
- `unresolved`: حذف سطر الاسم بالكامل

### DESIGN-2026-000010
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2

### DESIGN-2026-000011
- `case_phase`: REVISION_REQUIRED
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2
- `required_correction`: A4 / الصور والعناصر + الاسم فقط / بدون موكاب ملابس

### DESIGN-2026-000012
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2

### DESIGN-2026-000014
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V2
- `next_version`: V3

### DESIGN-2026-000100
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2

### DESIGN-2026-904530
- `case_phase`: OPEN
- `watch_status`: ACTIVE
- `approval_status`: NOT_CONFIRMED
- `current_version`: V1
- `next_version`: V2
- `risk`: face/identity fidelity requires review

## Saved / liked but not closed

### DESIGN-2026-000002
- `case_status`: SAVED
- `approval_status`: EXPLICITLY_LIKED
- `watch_status`: REVIEW_AS_NEEDED
- `note`: ليس CLOSED حسب Case record، لكنه ليس في انتظار تعديل موثق حاليًا.

## Final approved — closure evidence incomplete/needs lifecycle reconciliation

### DESIGN-2026-000009
- `case_phase`: FINAL_APPROVED
- `approval_status`: FINAL_APPROVED
- `watch_status`: RECONCILE_CLOSURE
- `note`: Case file يثبت FINAL_APPROVED لكن لا يوجد CLOSED evidence كافٍ في الفهرس؛ لا نختلق الإغلاق.

## Recently closed

### DESIGN-2026-000013
- `case_phase`: CLOSED
- `watch_status`: STOPPED
- `approval_status`: FINAL_APPROVED
- `current_version`: V2
- `knowledge_status`: PENDING_EXTRACTION
- `closed_at`: 2026-09-04T06:07:41+03:00

### DESIGN-2026-000007
- `case_phase`: CLOSED
- `watch_status`: STOPPED
- `approval_status`: FINAL_APPROVED
- `current_version`: V1
- `knowledge_status`: NO_REUSABLE_KNOWLEDGE
- `closed_at`: 2026-09-04T05:36:43+03:00

### DESIGN-2026-000005
- `case_phase`: CLOSED
- `watch_status`: STOPPED
- `approval_status`: FINAL_APPROVED
- `current_version`: V2

## Watch Rules

- OPEN / UNDER_REVIEW / REVISION_REQUIRED / WAITING_* / REOPENED = ACTIVE.
- FINAL_APPROVED لا يساوي CLOSED تلقائيًا؛ الإغلاق يحتاج Evidence المستخدم حسب lifecycle contract.
- CLOSED = STOPPED.
- `AI_AUTHORITY = ADVISORY_ONLY`.
- أي اختلاف مع Case/Room evidence يتم تصحيحه في هذا الفهرس ولا يتم تغيير الحقيقة لتناسب الفهرس.
