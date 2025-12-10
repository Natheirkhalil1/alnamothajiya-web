# مهمة: فصل محتوى اللغات في محرر الصفحات

## الوضع الحالي

### ✅ ما هو موجود:
1. **البنية الأساسية جاهزة:**
   - `PageBlocksValue` يحتوي على `blocksAr` و `blocksEn` منفصلين
   - تبويبات اللغة موجودة في المحرر (العربية / English)
   - `editingLanguage` state موجود ويتغير عند الضغط على التبويب
   - `createDefaultBlock(kind, language)` تقبل اللغة كـ parameter

2. **المحرر يعمل بشكل صحيح:**
   - عند إضافة بلوك، يُضاف للغة المحددة فقط
   - كل لغة لها قائمة بلوكات مستقلة

### ❌ ما ينقص:
1. **زر نسخ المحتوى من لغة للغة** - غير موجود
2. **المحتوى الافتراضي للبلوكات** - يجب التأكد أنه يتغير حسب اللغة المختارة

---

## تحليل المشكلة

### المطلوب:
1. عند إنشاء صفحة جديدة، أبني المحتوى العربي بشكل مستقل عن الإنجليزي
2. أقدر أنسخ محتوى من لغة للغة كنقطة بداية
3. المحتوى الافتراضي للبلوك الجديد يكون باللغة المحددة حالياً

### الحل:
البنية الأساسية **موجودة وتعمل**! المطلوب فقط:
1. إضافة زر "نسخ من اللغة الأخرى"
2. التأكد من أن `createDefaultBlock` ترسل اللغة الصحيحة (موجود بالسطر 251)

---

## خطوات التنفيذ

### المرحلة 1: إضافة زر نسخ المحتوى (Copy Content)

**الملف:** `components/page-blocks-editor-core.tsx`

**الموقع:** بجانب تبويبات اللغة (سطر 332-354)

**المهام:**
1. إضافة زر "نسخ من العربية" يظهر عند اختيار تبويب English
2. إضافة زر "نسخ من الإنجليزية" يظهر عند اختيار تبويب العربية
3. عند الضغط على الزر:
   - نسخ `blocksAr` إلى `blocksEn` (أو العكس)
   - إعادة توليد IDs للبلوكات المنسوخة (لتجنب التعارض)
4. إضافة dialog تأكيد قبل النسخ (لأن النسخ سيمسح المحتوى الحالي)

**الكود المقترح:**
\`\`\`tsx
// داخل div تبويبات اللغة
{editingLanguage === "en" && (value.blocksAr?.length > 0) && (
  <button
    type="button"
    onClick={() => handleCopyFromLanguage("ar")}
    className="..."
    title="نسخ المحتوى من العربية"
  >
    <CopyIcon /> نسخ من العربية
  </button>
)}

{editingLanguage === "ar" && (value.blocksEn?.length > 0) && (
  <button
    type="button"
    onClick={() => handleCopyFromLanguage("en")}
    className="..."
    title="Copy content from English"
  >
    <CopyIcon /> Copy from English
  </button>
)}
\`\`\`

**دالة النسخ:**
\`\`\`tsx
const handleCopyFromLanguage = (sourceLanguage: "ar" | "en") => {
  if (!onChange) return

  const sourceBlocks = sourceLanguage === "ar" ? value.blocksAr : value.blocksEn
  if (!sourceBlocks || sourceBlocks.length === 0) return

  // Deep clone with new IDs
  const copiedBlocks = sourceBlocks.map(block => ({
    ...JSON.parse(JSON.stringify(block)),
    id: `${block.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  }))

  if (editingLanguage === "ar") {
    onChange({ ...value, blocksAr: copiedBlocks })
  } else {
    onChange({ ...value, blocksEn: copiedBlocks })
  }
}
\`\`\`

---

### المرحلة 2: إضافة Confirmation Dialog

**المهام:**
1. إضافة state للـ dialog: `const [copyConfirmOpen, setCopyConfirmOpen] = useState(false)`
2. إضافة state لحفظ اللغة المصدر: `const [copySourceLang, setCopySourceLang] = useState<"ar" | "en">("ar")`
3. إضافة Dialog component للتأكيد

**الكود:**
\`\`\`tsx
<Dialog open={copyConfirmOpen} onOpenChange={setCopyConfirmOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {editingLanguage === "ar" ? "نسخ المحتوى من الإنجليزية؟" : "Copy content from Arabic?"}
      </DialogTitle>
    </DialogHeader>
    <p className="text-slate-600">
      {editingLanguage === "ar"
        ? "سيتم استبدال المحتوى العربي الحالي بنسخة من المحتوى الإنجليزي."
        : "This will replace the current English content with a copy of the Arabic content."}
    </p>
    <div className="flex gap-2 justify-end mt-4">
      <Button variant="outline" onClick={() => setCopyConfirmOpen(false)}>
        {editingLanguage === "ar" ? "إلغاء" : "Cancel"}
      </Button>
      <Button onClick={() => {
        handleCopyFromLanguage(copySourceLang)
        setCopyConfirmOpen(false)
      }}>
        {editingLanguage === "ar" ? "نسخ" : "Copy"}
      </Button>
    </div>
  </DialogContent>
</Dialog>
\`\`\`

---

### المرحلة 3: التحقق من المحتوى الافتراضي

**الملف:** `components/page-builder/utils.tsx`

**الموقع:** دالة `createDefaultBlock` (سطر 540+)

**المهام:**
1. مراجعة كل البلوكات والتأكد أن لها محتوى افتراضي بالعربي والإنجليزي
2. التأكد أن الدالة تستخدم parameter `language` بشكل صحيح

**مثال للتحقق:**
\`\`\`tsx5
// يجب أن يكون هكذا:
case "hero-basic":
  return {
    id: createId(),
    kind: "hero-basic",
    titleAr: isAr ? "عنوان رئيسي" : "",
    titleEn: isAr ? "" : "Main Title",
    // ...
  }
\`\`\`

---

### المرحلة 4 (اختياري): تحسينات UX

1. **مؤشر للمحتوى الفارغ:**
   - عرض رسالة "لا يوجد محتوى" عندما تكون قائمة البلوكات فارغة
   - اقتراح "نسخ من اللغة الأخرى" إذا كانت اللغة الأخرى تحتوي على محتوى

2. **عداد البلوكات لكل لغة:**
   - عرض عدد البلوكات بجانب كل تبويب لغة
   \`\`\`tsx
   العربية ({value.blocksAr?.length || 0})
   English ({value.blocksEn?.length || 0})
   \`\`\`

---

## ملخص الملفات المطلوب تعديلها

| الملف | التعديل |
|-------|---------|
| `components/page-blocks-editor-core.tsx` | إضافة زر النسخ + دالة النسخ + Dialog التأكيد |
| `components/page-builder/utils.tsx` | مراجعة `createDefaultBlock` (إذا لزم) |

---

## الوقت المتوقع

- المرحلة 1: 15-20 دقيقة
- المرحلة 2: 10 دقائق
- المرحلة 3: 10-15 دقيقة (مراجعة فقط)
- المرحلة 4: 10 دقائق (اختياري)

**المجموع:** 35-55 دقيقة

---

## ملاحظات مهمة

1. **البنية الأساسية جاهزة** - لا نحتاج تغيير بنية البيانات
2. **السطر 251 يمرر اللغة الصحيحة** - `createDefaultBlock(kind, editingLanguage)`
3. **كل لغة مستقلة تماماً** - يمكن أن يكون عدد البلوكات مختلف بين اللغتين
