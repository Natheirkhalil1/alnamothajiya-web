# دليل شامل: كيف تنشئ عنصر جديد في Page Builder؟ 🧱

## 📖 مقدمة

هذا الدليل سيعلمك **خطوة بخطوة** كيف تضيف عنصر جديد للـ Page Builder.

سنبني مثال حقيقي: **عنصر "بطاقة فريق" (Team Card)**

---

## 🎯 نظرة عامة

### ما سنبنيه؟

عنصر يعرض معلومات عضو فريق:
- صورة
- اسم
- منصب
- وصف قصير
- روابط تواصل اجتماعي

### الخطوات الرئيسية (7 خطوات)

\`\`\`
1️⃣ إنشاء ملف العنصر
2️⃣ تعريف الأنواع (Types)
3️⃣ بناء المحرر (Editor)
4️⃣ بناء العارض (View)
5️⃣ التسجيل (Registry)
6️⃣ إضافة للفئة (Category)
7️⃣ الاختبار
\`\`\`

---

## 📁 البنية الأساسية

### أين نضع الملفات؟

\`\`\`
components/page-builder/
├── blocks/
│   └── team-card.tsx          ← هنا نضع العنصر الجديد
├── types.ts                   ← نضيف الأنواع هنا
├── registry.tsx               ← نسجل العنصر هنا
├── block-categories.tsx       ← نضيفه للفئة هنا
└── utils.tsx                  ← أدوات مساعدة
\`\`\`

---

## 🚀 الخطوة 1: إنشاء ملف العنصر

### 1.1 أنشئ الملف

\`\`\`
المسار: components/page-builder/blocks/team-card.tsx
\`\`\`

### 1.2 البنية الأساسية

\`\`\`typescript
import * as React from "react"
import { Block } from "../types"
import { nmTheme } from "../theme"
import { 
  InputField, 
  ImageField, 
  TextareaField, 
  SectionContainer, 
  StylingGroup, 
  applyBlockStyles 
} from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

// سنضيف الكود هنا...
\`\`\`

**شرح الـ imports:**

\`\`\`typescript
// Block = النوع الأساسي لكل عنصر
import { Block } from "../types"

// nmTheme = الأنماط الجاهزة
import { nmTheme } from "../theme"

// أدوات مساعدة لبناء المحرر
import { 
  InputField,      // حقل نصي
  ImageField,      // حقل صورة
  TextareaField,   // منطقة نص
  SectionContainer,// حاوية القسم
  StylingGroup,    // مجموعة التصميم
  applyBlockStyles // تطبيق الأنماط
} from "../utils"

// للحصول على اللغة أثناء التعديل
import { useEditingLanguage } from "../editing-language-context"

// للحصول على اللغة أثناء العرض
import { useLanguage } from "@/lib/language-context"
\`\`\`

---

## 🏗️ الخطوة 2: تعريف الأنواع (Types)

### 2.1 افتح ملف الأنواع

\`\`\`
المسار: components/page-builder/types.ts
\`\`\`

### 2.2 أضف النوع الجديد

\`\`\`typescript
// في آخر الملف، قبل السطر الأخير

export interface TeamCardBlock extends BaseBlock {
  kind: "team-card"
  
  // معلومات العضو
  nameAr: string                    // الاسم بالعربي
  nameEn: string                    // الاسم بالإنجليزي
  
  positionAr: string                // المنصب بالعربي
  positionEn: string                // المنصب بالإنجليزي
  
  bioAr?: string                    // نبذة بالعربي (اختياري)
  bioEn?: string                    // نبذة بالإنجليزي (اختياري)
  
  imageUrl?: string                 // رابط الصورة (اختياري)
  
  // روابط التواصل (كلها اختيارية)
  email?: string
  phone?: string
  linkedin?: string
  twitter?: string
  
  // خيارات التصميم
  cardStyle?: "default" | "minimal" | "modern"  // نمط البطاقة
  showSocial?: boolean              // إظهار روابط التواصل
}
\`\`\`

**شرح:**

\`\`\`typescript
// BaseBlock = النوع الأساسي الذي يحتوي على:
// - id: string
// - blockStyles?: BlockStyles
// - backgroundColor?: string
// - padding?: string
// - containerWidth?: string

// kind = نوع العنصر (فريد لكل عنصر)
kind: "team-card"

// ? = اختياري (يمكن أن يكون undefined)
bioAr?: string
\`\`\`

### 2.3 أضف للـ Union Type

\`\`\`typescript
// ابحث عن هذا السطر في types.ts:
export type Block = 
  | HeroBasicBlock
  | HeroSliderBlock
  | RichTextBlock
  // ... باقي الأنواع
  | TeamCardBlock  // ← أضف هذا السطر

// ابحث عن هذا السطر أيضاً:
export type BlockKind =
  | "hero-basic"
  | "hero-slider"
  | "rich-text"
  // ... باقي الأنواع
  | "team-card"  // ← أضف هذا السطر
\`\`\`

---

## 🎨 الخطوة 3: بناء المحرر (Editor)

### 3.1 الكود الكامل

\`\`\`typescript
// في ملف: components/page-builder/blocks/team-card.tsx

export function TeamCardEditor({
  block,
  onChange,
}: {
  block: TeamCardBlock
  onChange: (b: Block) => void
}) {
  // الحصول على اللغة الحالية للتعديل
  const { editingLanguage } = useEditingLanguage()
  
  // دالة للتحديث
  const update = (patch: Partial<TeamCardBlock>) => 
    onChange({ ...block, ...patch })
  
  // هل اللغة عربي؟
  const isAr = editingLanguage === "ar"
  
  return (
    <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
      {/* قسم المعلومات الأساسية */}
      <div className="rounded-lg border border-slate-200 p-3">
        <h3 className="mb-2 text-xs font-semibold text-slate-700">
          {isAr ? "المعلومات الأساسية" : "Basic Information"}
        </h3>
        
        {/* الاسم */}
        <InputField
          label={isAr ? "الاسم" : "Name"}
          value={isAr ? block.nameAr : block.nameEn}
          onChange={(v) => update(isAr ? { nameAr: v } : { nameEn: v })}
          placeholder={isAr ? "أحمد محمد" : "Ahmed Mohamed"}
        />
        
        {/* المنصب */}
        <InputField
          label={isAr ? "المنصب" : "Position"}
          value={isAr ? block.positionAr : block.positionEn}
          onChange={(v) => update(isAr ? { positionAr: v } : { positionEn: v })}
          placeholder={isAr ? "مدير التسويق" : "Marketing Manager"}
        />
        
        {/* النبذة */}
        <TextareaField
          label={isAr ? "نبذة مختصرة" : "Short Bio"}
          value={isAr ? (block.bioAr ?? "") : (block.bioEn ?? "")}
          onChange={(v) => update(isAr ? { bioAr: v || undefined } : { bioEn: v || undefined })}
          placeholder={isAr ? "خبرة 10 سنوات في..." : "10 years of experience in..."}
          rows={3}
        />
        
        {/* الصورة */}
        <ImageField
          label={isAr ? "الصورة" : "Image"}
          value={block.imageUrl ?? ""}
          onChange={(v) => update({ imageUrl: v || undefined })}
        />
      </div>
      
      {/* قسم معلومات التواصل */}
      <div className="rounded-lg border border-slate-200 p-3">
        <h3 className="mb-2 text-xs font-semibold text-slate-700">
          {isAr ? "معلومات التواصل" : "Contact Information"}
        </h3>
        
        <InputField
          label={isAr ? "البريد الإلكتروني" : "Email"}
          value={block.email ?? ""}
          onChange={(v) => update({ email: v || undefined })}
          placeholder="ahmed@example.com"
        />
        
        <InputField
          label={isAr ? "رقم الهاتف" : "Phone"}
          value={block.phone ?? ""}
          onChange={(v) => update({ phone: v || undefined })}
          placeholder="+962 79 123 4567"
        />
        
        <InputField
          label="LinkedIn"
          value={block.linkedin ?? ""}
          onChange={(v) => update({ linkedin: v || undefined })}
          placeholder="https://linkedin.com/in/username"
        />
        
        <InputField
          label="Twitter"
          value={block.twitter ?? ""}
          onChange={(v) => update({ twitter: v || undefined })}
          placeholder="https://twitter.com/username"
        />
      </div>
      
      {/* قسم الخيارات */}
      <div className="rounded-lg border border-slate-200 p-3">
        <h3 className="mb-2 text-xs font-semibold text-slate-700">
          {isAr ? "خيارات العرض" : "Display Options"}
        </h3>
        
        {/* نمط البطاقة */}
        <div className="mb-2">
          <label className="mb-1 block text-xs font-medium text-slate-700">
            {isAr ? "نمط البطاقة" : "Card Style"}
          </label>
          <select
            value={block.cardStyle ?? "default"}
            onChange={(e) => update({ cardStyle: e.target.value as TeamCardBlock["cardStyle"] })}
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
          >
            <option value="default">{isAr ? "افتراضي" : "Default"}</option>
            <option value="minimal">{isAr ? "بسيط" : "Minimal"}</option>
            <option value="modern">{isAr ? "عصري" : "Modern"}</option>
          </select>
        </div>
        
        {/* إظهار روابط التواصل */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={block.showSocial ?? true}
            onChange={(e) => update({ showSocial: e.target.checked })}
            className="rounded"
          />
          <span className="text-xs">
            {isAr ? "إظهار روابط التواصل الاجتماعي" : "Show Social Links"}
          </span>
        </label>
      </div>
      
      {/* مجموعة التصميم (الألوان، المسافات، الحركات) */}
      <StylingGroup block={block} onChange={update} />
    </div>
  )
}
\`\`\`

**شرح مهم:**

\`\`\`typescript
// لماذا نستخدم ?? "" بدلاً من || "" ؟

// ❌ خطأ:
value={block.email || ""}
// المشكلة: إذا كان email = "" (فارغ)، سيعتبره false ويرجع ""

// ✅ صحيح:
value={block.email ?? ""}
// يفحص فقط null أو undefined، ليس القيم الفارغة

// لماذا نستخدم v || undefined ؟

// عند الحفظ، نريد حذف القيمة إذا كانت فارغة
onChange={(v) => update({ email: v || undefined })}
// إذا v = "" → يحفظ undefined (يحذف الحقل)
// إذا v = "ahmed@..." → يحفظ القيمة
\`\`\`

---

## 👁️ الخطوة 4: بناء العارض (View)

### 4.1 الكود الكامل

\`\`\`typescript
// في نفس الملف: team-card.tsx

export function TeamCardView({ block }: { block: TeamCardBlock }) {
  // الحصول على اللغة الحالية
  const { language } = useLanguage()
  
  // تطبيق الأنماط
  const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
  
  // الحصول على المحتوى حسب اللغة
  const name = language === "ar" ? block.nameAr : block.nameEn
  const position = language === "ar" ? block.positionAr : block.positionEn
  const bio = language === "ar" ? block.bioAr : block.bioEn
  
  // نمط البطاقة
  const cardStyle = block.cardStyle ?? "default"
  const showSocial = block.showSocial ?? true
  
  // أنماط CSS حسب النمط المختار
  const cardStyles = {
    default: "rounded-lg border-2 border-slate-200 bg-white p-6 shadow-md",
    minimal: "rounded-lg bg-slate-50 p-4",
    modern: "rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-xl"
  }
  
  return (
    <>
      {/* إذا في hover styles، نضيفها */}
      {hoverStyles && <style>{hoverStyles}</style>}
      
      <SectionContainer
        backgroundColor={block.backgroundColor}
        padding={block.padding}
        containerWidth={block.containerWidth}
      >
        <div
          {...blockProps}
          className={`${cardStyles[cardStyle]} ${blockProps.className || ""}`}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* الصورة */}
          {block.imageUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={block.imageUrl}
                alt={name}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-slate-100"
              />
            </div>
          )}
          
          {/* الاسم */}
          <h3 className="mb-1 text-center text-2xl font-bold text-slate-900">
            {name}
          </h3>
          
          {/* المنصب */}
          <p className="mb-3 text-center text-sm font-medium text-blue-600">
            {position}
          </p>
          
          {/* النبذة */}
          {bio && (
            <p className="mb-4 text-center text-sm text-slate-600">
              {bio}
            </p>
          )}
          
          {/* روابط التواصل */}
          {showSocial && (block.email || block.phone || block.linkedin || block.twitter) && (
            <div className="mt-4 flex flex-wrap justify-center gap-3 border-t border-slate-200 pt-4">
              {/* البريد */}
              {block.email && (
                <a
                  href={`mailto:${block.email}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                  title={block.email}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
              )}
              
              {/* الهاتف */}
              {block.phone && (
                <a
                  href={`tel:${block.phone}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-green-100 hover:text-green-600"
                  title={block.phone}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </a>
              )}
              
              {/* LinkedIn */}
              {block.linkedin && (
                <a
                  href={block.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-blue-600 hover:text-white"
                  title="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              
              {/* Twitter */}
              {block.twitter && (
                <a
                  href={block.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-sky-500 hover:text-white"
                  title="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </SectionContainer>
    </>
  )
}
\`\`\`

---

## 📝 الخطوة 5: التسجيل (Registry)

### 5.1 افتح ملف التسجيل

\`\`\`
المسار: components/page-builder/registry.tsx
\`\`\`

### 5.2 أضف الـ import

\`\`\`typescript
// في أعلى الملف، مع باقي الـ imports:

import { TeamCardEditor, TeamCardView } from "./blocks/team-card"
\`\`\`

### 5.3 سجل العنصر

\`\`\`typescript
// في blockRegistry object:

export const blockRegistry: Record<BlockKind, BlockRegistryEntry> = {
  // ... باقي العناصر
  
  "team-card": {
    Editor: TeamCardEditor as BlockEditorComponent,
    View: TeamCardView as BlockViewComponent,
  },
  
  // ... باقي العناصر
}
\`\`\`

---

## 🗂️ الخطوة 6: إضافة للفئة (Category)

### 6.1 افتح ملف الفئات

\`\`\`
المسار: components/page-builder/block-categories.tsx
\`\`\`

### 6.2 أضف للفئة المناسبة

\`\`\`typescript
// ابحث عن الفئة "team" (الفريق والأشخاص)

{
  id: "team",
  nameEn: "Team & People",
  nameAr: "الفريق والأشخاص",
  icon: Users,
  blocks: [
    {
      kind: "staff-grid",
      labelAr: "شبكة الطاقم",
      labelEn: "Staff Grid",
      descriptionAr: "عرض أعضاء الفريق",
      descriptionEn: "Display team members",
      icon: Users,
    },
    {
      kind: "board-or-team-list",
      labelAr: "قائمة الفريق",
      labelEn: "Team List",
      descriptionAr: "قائمة أعضاء اللجنة",
      descriptionEn: "Committee members list",
      icon: UserCheck,
    },
    // ← أضف هنا
    {
      kind: "team-card",
      labelAr: "بطاقة عضو فريق",
      labelEn: "Team Card",
      descriptionAr: "بطاقة فردية لعرض معلومات عضو",
      descriptionEn: "Individual card to display member info",
      icon: UserCheck,
    },
  ],
}
\`\`\`

---

## 🧪 الخطوة 7: الاختبار

### 7.1 اختبار المحرر

\`\`\`
1. افتح Dashboard
2. اذهب لـ Pages
3. أنشئ صفحة جديدة أو عدل موجودة
4. اضغط "إضافة بلوك جديد"
5. اختر فئة "الفريق والأشخاص"
6. اختر "بطاقة عضو فريق"
\`\`\`

**ماذا يجب أن تشوف؟**
- نافذة التعديل تفتح ✅
- الحقول كلها موجودة ✅
- التبديل بين العربي والإنجليزي يشتغل ✅

### 7.2 اختبار العارض

\`\`\`
1. املأ المعلومات:
   - الاسم: أحمد محمد
   - المنصب: مدير التسويق
   - البريد: ahmed@example.com
2. احفظ
3. شاهد المعاينة
\`\`\`

**ماذا يجب أن تشوف؟**
- البطاقة تظهر بشكل صحيح ✅
- الصورة تظهر ✅
- روابط التواصل تشتغل ✅

### 7.3 اختبار التخزين

\`\`\`
1. احفظ الصفحة
2. أعد تحميل الصفحة
3. افتح الصفحة مرة أخرى
\`\`\`

**ماذا يجب أن تشوف؟**
- البيانات محفوظة ✅
- العنصر يظهر كما هو ✅

---

## 💾 كيف يتم التخزين؟

### البنية في قاعدة البيانات

\`\`\`json
{
  "id": "page-about",
  "blocksAr": [
    {
      "id": "team-card-1234567890",
      "kind": "team-card",
      "nameAr": "أحمد محمد",
      "nameEn": "Ahmed Mohamed",
      "positionAr": "مدير التسويق",
      "positionEn": "Marketing Manager",
      "bioAr": "خبرة 10 سنوات في التسويق الرقمي",
      "bioEn": "10 years of experience in digital marketing",
      "imageUrl": "https://example.com/ahmed.jpg",
      "email": "ahmed@example.com",
      "phone": "+962791234567",
      "linkedin": "https://linkedin.com/in/ahmed",
      "cardStyle": "modern",
      "showSocial": true,
      "blockStyles": {
        "backgroundColor": "bg-white",
        "padding": "p-8"
      }
    }
  ]
}
\`\`\`

---

## 🎨 تخصيص الأنماط

### إضافة أنماط مخصصة

\`\`\`typescript
// في team-card.tsx

// يمكنك إضافة أنماط ثابتة:
const customStyles = `
  .team-card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
`

// ثم في العارض:
return (
  <>
    <style>{customStyles}</style>
    <div className="team-card-hover">
      {/* ... */}
    </div>
  </>
)
\`\`\`

---

## 🔧 نصائح متقدمة

### 1. استخدام الـ Default Values

\`\`\`typescript
// في utils.tsx، أضف:

export function createDefaultBlock(kind: BlockKind): Block {
  // ... الكود الموجود
  
  if (kind === "team-card") {
    return {
      id: createId(kind),
      kind: "team-card",
      nameAr: "",
      nameEn: "",
      positionAr: "",
      positionEn: "",
      cardStyle: "default",  // قيمة افتراضية
      showSocial: true,      // قيمة افتراضية
    } as TeamCardBlock
  }
  
  // ... باقي الكود
}
\`\`\`

### 2. التحقق من البيانات (Validation)

\`\`\`typescript
// في المحرر:

const isValid = () => {
  if (!block.nameAr || !block.nameEn) {
    alert("الاسم مطلوب!")
    return false
  }
  if (!block.positionAr || !block.positionEn) {
    alert("المنصب مطلوب!")
    return false
  }
  return true
}

// استخدمه قبل الحفظ
\`\`\`

### 3. إضافة معاينة في المحرر

\`\`\`typescript
// في المحرر، أضف قسم معاينة:

<div className="mt-4 rounded-lg border border-slate-200 p-4">
  <h3 className="mb-2 text-xs font-semibold">
    {isAr ? "معاينة" : "Preview"}
  </h3>
  <TeamCardView block={block} />
</div>
\`\`\`

---

## 🐛 استكشاف الأخطاء

### المشكلة: العنصر لا يظهر في القائمة

\`\`\`
الحلول:
1. تأكد من إضافته في registry.tsx ✅
2. تأكد من إضافته في block-categories.tsx ✅
3. تأكد من الـ import صحيح ✅
4. أعد تشغيل السيرفر (npm run dev) ✅
\`\`\`

### المشكلة: خطأ في الـ TypeScript

\`\`\`
الحلول:
1. تأكد من إضافة النوع في types.ts ✅
2. تأكد من إضافته للـ Union Type ✅
3. تأكد من الـ extends BaseBlock ✅
\`\`\`

### المشكلة: البيانات لا تُحفظ

\`\`\`
الحلول:
1. تأكد من استخدام onChange بشكل صحيح ✅
2. تأكد من الـ update function ✅
3. افحص console للأخطاء ✅
\`\`\`

---

## 📋 Checklist (قائمة التحقق)

قبل ما تعتبر العنصر جاهز، تأكد من:

\`\`\`
✅ الملف موجود في blocks/
✅ النوع معرّف في types.ts
✅ النوع مضاف للـ Union Type
✅ المحرر (Editor) مبني بالكامل
✅ العارض (View) مبني بالكامل
✅ العنصر مسجل في registry.tsx
✅ العنصر مضاف للفئة في block-categories.tsx
✅ الاختبار تم بنجاح
✅ التخزين يشتغل
✅ التبديل بين اللغات يشتغل
✅ الأنماط تطبق بشكل صحيح
\`\`\`

---

## 🎓 الخلاصة

إنشاء عنصر جديد يتطلب:

\`\`\`
1. ملف واحد (blocks/your-block.tsx)
2. تعديل 3 ملفات:
   - types.ts (الأنواع)
   - registry.tsx (التسجيل)
   - block-categories.tsx (الفئة)
3. كتابة 2 functions:
   - Editor (المحرر)
   - View (العارض)
\`\`\`

**الوقت المتوقع:** 30-60 دقيقة للعنصر البسيط

**نصيحة أخيرة:** ابدأ بنسخ عنصر موجود (مثل hero-basic) وعدّل عليه! 🚀
