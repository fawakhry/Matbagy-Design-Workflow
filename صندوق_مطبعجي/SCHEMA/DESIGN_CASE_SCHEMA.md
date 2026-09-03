# Design Case Schema — صندوق مطبعجي

> **Canonical schema for all extracted design conversations.**

كل Design Case يجب أن يستخدم نفس البناء حتى تصبح الذاكرة قابلة للبحث والتحليل والتعلم لاحقًا.

## Identity

- `case_id`: مثل `DESIGN-2026-000001`
- `case_status`: DRAFT | APPROVED_FOR_SAVE | SAVED | NOT_CONFIRMED
- `conversation_date`: إذا كانت معروفة
- `extraction_date`: تاريخ استخراج الحالة
- `source`: CHATGPT_CHAT | OTHER_CHAT | MANUAL
- `source_reference`: مرجع غير حساس للمحادثة إن توفر

## Customer / Order Context

- `customer_id`: إن كان معروفًا فقط
- `customer_name`: إن ذكر صراحة وكان مسموحًا حفظه
- `order_id`: إن وجد بوضوح
- `repeat_customer`: YES | NO | UNKNOWN

> لا تستخدم اسم العميل أو الهاتف كمفتاح منطقي بديلًا عن Order ID عند وجود ربط بـTrendOS مستقبلًا.

## Request

- `customer_request_raw`: الطلب الأصلي بصياغة المستخدم قدر الإمكان دون اختراع
- `request_summary`: ملخص منظم
- `product_type`
- `dimensions`
- `unit`
- `quantity`: إن وجدت
- `required_text`: النصوص المطلوب استخدامها حرفيًا

## Design Intent

- `layout_intent`
- `style_intent`
- `color_preferences`
- `font_preferences`
- `composition_notes`
- `print_or_cut_requirements`

## Constraints

### Must Keep
قائمة بكل ما يجب الحفاظ عليه، مثل:
- ملامح الوجه
- النص كما هو
- اتجاه الصورة
- عنصر محدد

### Must Avoid
قائمة بكل ما تم منعه أو رفضه، مثل:
- لا فلاتر
- لا تغيير ملامح
- لا خلفية مزخرفة
- لا قص للرأس

## Assets

لكل Asset:

- `asset_id`
- `source_role`
- `conversation_position`
- `purpose`
- `instructions`
- `persisted`
- `storage_ref`
- `privacy_class`: PUBLIC_SAFE | CUSTOMER_PRIVATE | UNKNOWN

## Attempts Timeline

لكل محاولة:

- `attempt_id`: V1 / V2 / V3 ...
- `input_basis`: ما الذي بنيت عليه المحاولة
- `prompt_or_instruction_used`: إن كان معلومًا
- `result_description`
- `result_asset_id`: إن وجد
- `customer_feedback_raw`
- `feedback_class`: LIKED | PARTIAL | REJECTED | UNKNOWN
- `requested_changes`
- `what_worked`
- `what_failed`

## Approval

- `approval.status`: FINAL_APPROVED | EXPLICITLY_LIKED | PARTIAL_ACCEPTANCE | REJECTED | NOT_CONFIRMED
- `approval.final_attempt_id`
- `approval.final_asset_id`
- `approval.evidence`: وصف قصير لما يثبت الحالة

## Learning

- `reusable_rules`: قواعد عامة قابلة للاستخدام في شغل مشابه
- `customer_preferences`: تفضيلات تخص العميل إذا كان العميل معروفًا
- `negative_preferences`: ما يكرهه/يرفضه العميل
- `product_patterns`: أنماط خاصة بنوع المنتج
- `search_tags`: Tags عربية/إنجليزية للبحث
- `confidence_notes`: ما هو مؤكد وما هو مستنتج

## Truth Labels

عند الحاجة ضع أمام الحقل:

- `EXPLICIT`
- `INFERRED`
- `UNKNOWN`

## Save Format

بعد اعتماد المستخدم، تحفظ كل حالة في ملف Markdown واحد على الأقل:

`CASES/YYYY/DESIGN-YYYY-NNNNNN.md`

ويفضل أن يحتوي أعلى الملف على YAML front matter للحقول القابلة للفهرسة، ثم تفاصيل الحالة البشرية أسفلها.

مثال:

```yaml
---
case_id: DESIGN-2026-000001
case_status: SAVED
product_type: mug
approval_status: FINAL_APPROVED
search_tags:
  - مج
  - 20x9
  - صورتين
  - بدون تغيير ملامح
---
```

ثم أقسام Markdown للتفاصيل والتايملاين والـAssets والتعلم.

## Learning Priority

عند استخدام الحالات لاحقًا:

1. FINAL_APPROVED
2. EXPLICITLY_LIKED
3. PARTIAL_ACCEPTANCE
4. REJECTED

لا تستخدم نتيجة مرفوضة كنموذج إيجابي، لكن استخدمها كـnegative example لما يجب تجنبه.