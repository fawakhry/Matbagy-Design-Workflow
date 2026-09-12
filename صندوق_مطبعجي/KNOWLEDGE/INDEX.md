# Matbagy Knowledge Registry — صندوق مطبعجي

> السجل المركزي للمعرفة المستخرجة من الحالات المغلقة.

## الحالة الحالية

`knowledge_registry_status: ACTIVE`

تم تحديث هذا السجل في `2026-09-12` بعد مراجعة الـCases الفعلية.

## Canonical rules

- كل Candidate يأخذ `KNOW-YYYY-NNNNNN` عند إنشائه رسميًا.
- كل Rule يجب أن تشير إلى Case/Version/Evidence.
- لا تحفظ صور العملاء هنا.
- AI Opinion وحدها لا تصبح Global Rule.
- الرفض والفشل = Negative Learning.
- عند تكرار نفس المعنى، أضف Evidence بدل Duplicate Rule.

## Closed Cases State

### DESIGN-2026-000005
- status: CLOSED / FINAL_APPROVED
- knowledge_extraction: REQUIRED_REVIEW
- notable lessons موجودة في Case:
  - مطابقة إضاءة/لون/قص الشخص المضاف مع البوستر الأصلي.
  - عند طلب تعديل محدد مثل ضبط العين لا تغيّر باقي التصميم دون طلب.
  - تصنيف `كارت فرح شبابي` محفوظ كتصنيف تشغيلي من المستخدم.
- registry_action: أنشئ Candidates فقط بعد مراجعة Evidence/LESSONS وعدم اختراع تعميم أوسع.

### DESIGN-2026-000007
- status: CLOSED / FINAL_APPROVED
- knowledge_status: NO_REUSABLE_KNOWLEDGE
- registry_action: NONE

### DESIGN-2026-000013
- status: CLOSED / FINAL_APPROVED
- knowledge_status: PENDING_EXTRACTION
- notable evidence:
  - V1 مزينة.
  - المستخدم طلب خلفية بيضاء بدون أي تزيين.
  - V2 تم اعتمادها وإغلاق الحالة.
- candidate directions for extraction:
  - `REJECTION_PATTERN`: الزينة في هذه الحالة استُبعدت بعد طلب صريح.
  - `APPROVAL_PATTERN`: النسخة البيضاء النظيفة بدون زينة هي النسخة المعتمدة لهذه Case.
- scope initially: `CASE_ONLY` أو `PRODUCT` فقط إذا دعمتها Cases إضافية؛ لا ترقي إلى GLOBAL تلقائيًا.

## Active Knowledge

لا توجد حتى الآن Knowledge Rule مرفوعة رسميًا إلى `PROMOTED / GLOBAL_ACTIVE` داخل هذا السجل.

## Proposed / Review Required

لا توجد Knowledge IDs رسمية منشأة بعد. الحالات أعلاه هي Extraction Queue وليست قواعد مروجة.

## Superseded / Rejected Knowledge

لا يوجد حاليًا.

## Extraction Queue

1. `DESIGN-2026-000013` — PENDING_EXTRACTION — أولوية أولى.
2. `DESIGN-2026-000005` — CLOSED/FINAL — راجع LESSONS واستخرج Candidates إذا كان Evidence كافيًا.
3. `DESIGN-2026-000007` — NO_REUSABLE_KNOWLEDGE — لا عمل إضافي حاليًا.

## Important distinction

`Case Lesson != Knowledge Candidate != Validated Knowledge != Promoted Rule`

لا يتم إنشاء Knowledge ID أو رفع Confidence إلا بعد تنفيذ عقد:
`SCHEMA/KNOWLEDGE_EXTRACTION_CONTRACT.md`

## Canonical Contract

راجع:
`صندوق_مطبعجي/SCHEMA/KNOWLEDGE_EXTRACTION_CONTRACT.md`
