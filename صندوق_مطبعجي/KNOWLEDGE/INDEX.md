# Matbagy Knowledge Registry — صندوق مطبعجي

> السجل المركزي للمعرفة المستخرجة من الحالات المغلقة.

## الحالة الحالية

`knowledge_registry_status: ACTIVE`

حتى الآن لا توجد Knowledge Candidates معتمدة؛ أول Case محفوظة ما زالت غير مغلقة نهائيًا، لذلك لا يتم اختراع قواعد منها.

## قواعد التسجيل

- كل Knowledge Candidate يأخذ ID من الشكل `KNOW-YYYY-NNNNNN`.
- كل Rule يجب أن تشير إلى `source_case_id` وEvidence.
- لا تحفظ صور العملاء هنا.
- لا تتحول Recommendation من AI وحدها إلى Global Rule.
- Negative Learning يبقى محفوظًا كـFailure/Rejection Pattern.
- إذا تكررت نفس القاعدة، أضف Evidence للمعرفة القائمة بدل إنشاء Duplicate غير لازم.

## Active Knowledge

لا يوجد حاليًا.

## Proposed / Review Required

لا يوجد حاليًا.

## Superseded / Rejected Knowledge

لا يوجد حاليًا.

## Canonical contract

راجع:

`صندوق_مطبعجي/SCHEMA/KNOWLEDGE_EXTRACTION_CONTRACT.md`
