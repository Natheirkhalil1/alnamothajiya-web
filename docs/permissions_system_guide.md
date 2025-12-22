# دليل شامل: نظام الصلاحيات والأدوار 🔐

## 📖 مقدمة بسيطة

تخيل أنك مدير مدرسة، وعندك موظفين كثير. كل واحد له وظيفة مختلفة:
- **المدير** 👨‍💼 - يقدر يعمل كل شي
- **مدير الموارد البشرية** 👔 - يقدر يشوف طلبات التوظيف بس
- **موظف الاستقبال** 📞 - يقدر يرد على الرسائل بس
- **المشاهد** 👀 - يقدر يشوف بس، ما يقدر يعدل

**نظام الصلاحيات** = طريقة للتحكم بـ "مين يقدر يعمل إيه"

---

## 🎯 الفكرة الأساسية

### التشبيه بالحياة الواقعية

فكر في نظام الصلاحيات مثل **مفاتيح الغرف في فندق**:

```
🏨 الفندق = النظام
🔑 المفتاح = الصلاحية
🚪 الغرفة = الميزة (مثل: حذف، تعديل، عرض)
👤 الموظف = المستخدم
```

**مثال:**
- **المدير** عنده مفتاح رئيسي (Master Key) → يفتح كل الغرف
- **موظف التنظيف** عنده مفاتيح محددة → يفتح الغرف العادية بس
- **الضيف** عنده مفتاح واحد → يفتح غرفته بس

---

## 🏗️ البنية الأساسية

### 1️⃣ الأدوار (Roles) - 7 أدوار

```typescript
type Role = 
  | "admin"              // مدير النظام
  | "hr_manager"         // مدير الموارد البشرية
  | "service_manager"    // مدير الخدمات
  | "content_manager"    // مدير المحتوى
  | "receptionist"       // موظف استقبال
  | "employee"           // موظف عادي
  | "viewer"             // مشاهد فقط
```

### 2️⃣ الصلاحيات (Permissions) - 20 صلاحية

```typescript
interface Permissions {
  // طلبات التوظيف (4 صلاحيات)
  canViewApplications: boolean       // عرض
  canEditApplications: boolean       // تعديل
  canApproveApplications: boolean    // موافقة/رفض
  canDeleteApplications: boolean     // حذف
  
  // طلبات الخدمات (3 صلاحيات)
  canViewServiceRequests: boolean    // عرض
  canEditServiceRequests: boolean    // تعديل
  canDeleteServiceRequests: boolean  // حذف
  
  // الرسائل (3 صلاحيات)
  canViewMessages: boolean           // عرض
  canReplyToMessages: boolean        // رد
  canDeleteMessages: boolean         // حذف
  
  // المحتوى (4 صلاحيات)
  canViewContent: boolean            // عرض
  canEditContent: boolean            // تعديل
  canPublishContent: boolean         // نشر
  canDeleteContent: boolean          // حذف
  
  // الموظفين (4 صلاحيات)
  canViewEmployees: boolean          // عرض
  canAddEmployees: boolean           // إضافة
  canEditEmployees: boolean          // تعديل
  canDeleteEmployees: boolean        // حذف
  
  // التقارير (2 صلاحيات)
  canViewReports: boolean            // عرض التقارير
  canExportData: boolean             // تصدير البيانات
}
```

---

## 👥 الأدوار بالتفصيل

### 1. Admin (مدير النظام) 👨‍💼

**الوصف:** السوبر مان! يقدر يعمل كل شي

**الصلاحيات:**
```javascript
{
  // طلبات التوظيف
  canViewApplications: true,        ✅
  canEditApplications: true,        ✅
  canApproveApplications: true,     ✅
  canDeleteApplications: true,      ✅
  
  // طلبات الخدمات
  canViewServiceRequests: true,     ✅
  canEditServiceRequests: true,     ✅
  canDeleteServiceRequests: true,   ✅
  
  // الرسائل
  canViewMessages: true,            ✅
  canReplyToMessages: true,         ✅
  canDeleteMessages: true,          ✅
  
  // المحتوى
  canViewContent: true,             ✅
  canEditContent: true,             ✅
  canPublishContent: true,          ✅
  canDeleteContent: true,           ✅
  
  // الموظفين
  canViewEmployees: true,           ✅
  canAddEmployees: true,            ✅
  canEditEmployees: true,           ✅
  canDeleteEmployees: true,         ✅
  
  // التقارير
  canViewReports: true,             ✅
  canExportData: true               ✅
}
```

**متى تستخدمه؟**
- مدير المدرسة
- المالك
- المطور

---

### 2. HR Manager (مدير الموارد البشرية) 👔

**الوصف:** مسؤول عن التوظيف والموظفين

**الصلاحيات:**
```javascript
{
  // طلبات التوظيف - كل شي ✅
  canViewApplications: true,        ✅
  canEditApplications: true,        ✅
  canApproveApplications: true,     ✅
  canDeleteApplications: true,      ✅
  
  // طلبات الخدمات - لا ❌
  canViewServiceRequests: false,    ❌
  canEditServiceRequests: false,    ❌
  canDeleteServiceRequests: false,  ❌
  
  // الرسائل - عرض فقط
  canViewMessages: true,            ✅
  canReplyToMessages: false,        ❌
  canDeleteMessages: false,         ❌
  
  // المحتوى - لا ❌
  canViewContent: false,            ❌
  canEditContent: false,            ❌
  canPublishContent: false,         ❌
  canDeleteContent: false,          ❌
  
  // الموظفين - كل شي ✅
  canViewEmployees: true,           ✅
  canAddEmployees: true,            ✅
  canEditEmployees: true,           ✅
  canDeleteEmployees: true,         ✅
  
  // التقارير - عرض فقط
  canViewReports: true,             ✅
  canExportData: true               ✅
}
```

**متى تستخدمه؟**
- مدير الموارد البشرية
- مسؤول التوظيف

---

### 3. Service Manager (مدير الخدمات) 🛠️

**الوصف:** مسؤول عن طلبات الخدمات

**الصلاحيات:**
```javascript
{
  // طلبات التوظيف - عرض فقط
  canViewApplications: true,        ✅
  canEditApplications: false,       ❌
  canApproveApplications: false,    ❌
  canDeleteApplications: false,     ❌
  
  // طلبات الخدمات - كل شي ✅
  canViewServiceRequests: true,     ✅
  canEditServiceRequests: true,     ✅
  canDeleteServiceRequests: true,   ✅
  
  // الرسائل - كل شي ✅
  canViewMessages: true,            ✅
  canReplyToMessages: true,         ✅
  canDeleteMessages: true,          ✅
  
  // المحتوى - لا ❌
  canViewContent: false,            ❌
  canEditContent: false,            ❌
  canPublishContent: false,         ❌
  canDeleteContent: false,          ❌
  
  // الموظفين - عرض فقط
  canViewEmployees: true,           ✅
  canAddEmployees: false,           ❌
  canEditEmployees: false,          ❌
  canDeleteEmployees: false,        ❌
  
  // التقارير
  canViewReports: true,             ✅
  canExportData: true               ✅
}
```

**متى تستخدمه؟**
- مدير خدمة العملاء
- مسؤول الدعم الفني

---

### 4. Content Manager (مدير المحتوى) ✍️

**الوصف:** مسؤول عن محتوى الموقع

**الصلاحيات:**
```javascript
{
  // طلبات التوظيف - لا ❌
  canViewApplications: false,       ❌
  canEditApplications: false,       ❌
  canApproveApplications: false,    ❌
  canDeleteApplications: false,     ❌
  
  // طلبات الخدمات - لا ❌
  canViewServiceRequests: false,    ❌
  canEditServiceRequests: false,    ❌
  canDeleteServiceRequests: false,  ❌
  
  // الرسائل - عرض فقط
  canViewMessages: true,            ✅
  canReplyToMessages: false,        ❌
  canDeleteMessages: false,         ❌
  
  // المحتوى - كل شي ✅
  canViewContent: true,             ✅
  canEditContent: true,             ✅
  canPublishContent: true,          ✅
  canDeleteContent: true,           ✅
  
  // الموظفين - لا ❌
  canViewEmployees: false,          ❌
  canAddEmployees: false,           ❌
  canEditEmployees: false,          ❌
  canDeleteEmployees: false,        ❌
  
  // التقارير - لا ❌
  canViewReports: false,            ❌
  canExportData: false              ❌
}
```

**متى تستخدمه؟**
- محرر المحتوى
- مسؤول الموقع

---

### 5. Receptionist (موظف استقبال) 📞

**الوصف:** يستقبل الاستفسارات ويرد على الرسائل

**الصلاحيات:**
```javascript
{
  // طلبات التوظيف - عرض فقط
  canViewApplications: true,        ✅
  canEditApplications: false,       ❌
  canApproveApplications: false,    ❌
  canDeleteApplications: false,     ❌
  
  // طلبات الخدمات - عرض وتعديل
  canViewServiceRequests: true,     ✅
  canEditServiceRequests: true,     ✅
  canDeleteServiceRequests: false,  ❌
  
  // الرسائل - عرض ورد
  canViewMessages: true,            ✅
  canReplyToMessages: true,         ✅
  canDeleteMessages: false,         ❌
  
  // المحتوى - عرض فقط
  canViewContent: true,             ✅
  canEditContent: false,            ❌
  canPublishContent: false,         ❌
  canDeleteContent: false,          ❌
  
  // الموظفين - لا ❌
  canViewEmployees: false,          ❌
  canAddEmployees: false,           ❌
  canEditEmployees: false,          ❌
  canDeleteEmployees: false,        ❌
  
  // التقارير - لا ❌
  canViewReports: false,            ❌
  canExportData: false              ❌
}
```

**متى تستخدمه؟**
- موظف الاستقبال
- خدمة العملاء

---

### 6. Employee (موظف عادي) 👤

**الوصف:** موظف عادي بصلاحيات محدودة جداً

**الصلاحيات:**
```javascript
{
  // طلبات التوظيف - عرض فقط
  canViewApplications: true,        ✅
  canEditApplications: false,       ❌
  canApproveApplications: false,    ❌
  canDeleteApplications: false,     ❌
  
  // طلبات الخدمات - عرض فقط
  canViewServiceRequests: true,     ✅
  canEditServiceRequests: false,    ❌
  canDeleteServiceRequests: false,  ❌
  
  // الرسائل - عرض فقط
  canViewMessages: true,            ✅
  canReplyToMessages: false,        ❌
  canDeleteMessages: false,         ❌
  
  // المحتوى - عرض فقط
  canViewContent: true,             ✅
  canEditContent: false,            ❌
  canPublishContent: false,         ❌
  canDeleteContent: false,          ❌
  
  // الموظفين - لا ❌
  canViewEmployees: false,          ❌
  canAddEmployees: false,           ❌
  canEditEmployees: false,          ❌
  canDeleteEmployees: false,        ❌
  
  // التقارير - لا ❌
  canViewReports: false,            ❌
  canExportData: false              ❌
}
```

**متى تستخدمه؟**
- موظف عادي
- متدرب

---

### 7. Viewer (مشاهد فقط) 👀

**الوصف:** يقدر يشوف بس، ما يقدر يعدل أي شي

**الصلاحيات:**
```javascript
{
  // كل شي = عرض فقط ✅
  canViewApplications: true,        ✅
  canEditApplications: false,       ❌
  canApproveApplications: false,    ❌
  canDeleteApplications: false,     ❌
  
  canViewServiceRequests: true,     ✅
  canEditServiceRequests: false,    ❌
  canDeleteServiceRequests: false,  ❌
  
  canViewMessages: true,            ✅
  canReplyToMessages: false,        ❌
  canDeleteMessages: false,         ❌
  
  canViewContent: true,             ✅
  canEditContent: false,            ❌
  canPublishContent: false,         ❌
  canDeleteContent: false,          ❌
  
  canViewEmployees: true,           ✅
  canAddEmployees: false,           ❌
  canEditEmployees: false,          ❌
  canDeleteEmployees: false,        ❌
  
  canViewReports: true,             ✅
  canExportData: false              ❌
}
```

**متى تستخدمه؟**
- مراقب
- مدقق
- مستشار خارجي

---

## 🔧 كيف يعمل النظام تقنياً؟

### 1️⃣ بنية البيانات

```typescript
// ملف: lib/storage.ts

interface Employee {
  id: string                    // معرف فريد
  fullName: string              // الاسم الكامل
  email: string                 // البريد الإلكتروني
  phone: string                 // رقم الهاتف
  position: string              // المنصب
  department: string            // القسم
  role: Role                    // الدور (من 7 أدوار)
  password: string              // كلمة السر (مشفرة)
  permissions: Permissions      // الصلاحيات (20 صلاحية)
  createdAt: string             // تاريخ الإنشاء
  isActive: boolean             // نشط أم لا
  lastLogin?: string            // آخر تسجيل دخول
}
```

### 2️⃣ Context (السياق)

```typescript
// ملف: lib/auth-context.tsx

interface AuthContextType {
  currentUser: Employee | null           // المستخدم الحالي
  login: (email, password) => Promise    // تسجيل دخول
  logout: () => void                     // تسجيل خروج
  hasPermission: (permission) => boolean // فحص الصلاحية
}
```

### 3️⃣ كيف يتم فحص الصلاحية؟

```typescript
// ملف: lib/auth-context.tsx (السطر 204)

const hasPermission = (permission: keyof Permissions): boolean => {
  // إذا ما في مستخدم → false
  if (!currentUser) return false
  
  // إذا المستخدم غير نشط → false
  if (!currentUser.isActive) return false
  
  // إرجاع قيمة الصلاحية
  return currentUser.permissions[permission]
}
```

**مثال استخدام:**

```typescript
// في أي مكون

import { useAuth } from '@/lib/auth-context'

function ApplicationsPage() {
  const { hasPermission } = useAuth()
  
  // فحص: هل يقدر يحذف؟
  if (hasPermission('canDeleteApplications')) {
    // عرض زر الحذف
    return <button>حذف</button>
  } else {
    // إخفاء الزر
    return null
  }
}
```

---

## 🎬 سيناريوهات عملية

### السيناريو 1: إضافة موظف جديد

```
المدير يسجل دخول
        ↓
يذهب لـ Dashboard → الموظفون
        ↓
يضغط "إضافة موظف جديد"
        ↓
يملأ النموذج:
  - الاسم: أحمد محمد
  - البريد: ahmed@school.com
  - الدور: hr_manager
        ↓
النظام يعطيه الصلاحيات تلقائياً:
  - canViewApplications: true
  - canEditApplications: true
  - canApproveApplications: true
  - ... (حسب الدور)
        ↓
يحفظ
        ↓
أحمد الآن يقدر يسجل دخول!
```

### السيناريو 2: موظف يحاول الوصول لصفحة

```
أحمد (hr_manager) يحاول يفتح صفحة "المحتوى"
        ↓
النظام يفحص:
  hasPermission('canViewContent')
        ↓
يرجع: false (لأن HR Manager ما عنده صلاحية)
        ↓
النظام يعرض رسالة:
  "ليس لديك صلاحية للوصول لهذه الصفحة"
        ↓
أحمد يتم توجيهه للصفحة الرئيسية
```

### السيناريو 3: تعديل صلاحيات موظف

```
المدير يريد يعطي أحمد صلاحية إضافية
        ↓
يذهب لـ Dashboard → الموظفون
        ↓
يضغط "تعديل" على أحمد
        ↓
يفعّل صلاحية:
  canViewContent: true
        ↓
يحفظ
        ↓
الآن أحمد يقدر يشوف المحتوى!
```

---

## 🛡️ الحماية والأمان

### 1. حماية المسارات (Route Protection)

```typescript
// في كل صفحة محمية

'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { currentUser, hasPermission } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // إذا ما في مستخدم → روح للـ login
    if (!currentUser) {
      router.push('/staff-login')
      return
    }
    
    // إذا ما عنده صلاحية → روح للرئيسية
    if (!hasPermission('canViewApplications')) {
      router.push('/staff-dashboard')
    }
  }, [currentUser, hasPermission, router])
  
  // عرض المحتوى
  return <div>محتوى محمي</div>
}
```

### 2. حماية الأزرار (Button Protection)

```typescript
// عرض الزر فقط إذا عنده صلاحية

{hasPermission('canDeleteApplications') && (
  <button onClick={handleDelete}>
    حذف
  </button>
)}
```

### 3. حماية API Routes

```typescript
// في API Route

import { getAuth } from '@/lib/auth-context'

export async function DELETE(request: Request) {
  const { currentUser } = getAuth()
  
  // فحص الصلاحية
  if (!currentUser?.permissions.canDeleteApplications) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // تنفيذ الحذف
  // ...
}
```

---

## 📊 جدول مقارنة الأدوار

| الصلاحية | Admin | HR | Service | Content | Reception | Employee | Viewer |
|---------|-------|-----|---------|---------|-----------|----------|--------|
| **طلبات التوظيف** |
| عرض | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| تعديل | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| موافقة | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| حذف | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **طلبات الخدمات** |
| عرض | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| تعديل | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| حذف | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **الرسائل** |
| عرض | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| رد | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| حذف | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **المحتوى** |
| عرض | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| تعديل | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| نشر | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| حذف | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **الموظفين** |
| عرض | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| إضافة | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| تعديل | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| حذف | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **التقارير** |
| عرض | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| تصدير | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔍 استكشاف الأخطاء

### المشكلة: الموظف ما يقدر يسجل دخول

```
الحلول:
1. تأكد أن isActive = true
2. تأكد من البريد وكلمة السر
3. تأكد أنه موجود في قاعدة البيانات
```

### المشكلة: الموظف يشوف صفحات ما المفروض يشوفها

```
الحلول:
1. راجع الصلاحيات في Dashboard
2. تأكد من الدور الصحيح
3. تأكد من حماية المسارات
```

### المشكلة: الأزرار تظهر لكن ما تشتغل

```
الحلول:
1. تأكد من حماية API Routes
2. تأكد من فحص الصلاحيات في الـ backend
```

---

## 💡 نصائح مهمة

### ✅ افعل

1. **استخدم الأدوار الجاهزة** - لا تخترع أدوار جديدة إلا للضرورة
2. **فحص الصلاحيات دائماً** - في الـ frontend والـ backend
3. **سجل النشاطات** - احفظ من عمل إيه ومتى
4. **راجع الصلاحيات دورياً** - تأكد أن كل واحد عنده الصلاحيات الصحيحة

### ❌ لا تفعل

1. **لا تعطي صلاحيات زيادة** - أعطي الحد الأدنى المطلوب
2. **لا تعتمد على الـ frontend فقط** - دائماً فحص في الـ backend
3. **لا تشارك كلمات السر** - كل موظف له حساب خاص
4. **لا تنسى تسجيل الخروج** - خصوصاً على أجهزة مشتركة

---

## 📝 ملخص سريع

```
نظام الصلاحيات = التحكم بمن يقدر يعمل إيه

المكونات:
├── 7 أدوار (Admin, HR, Service, Content, Reception, Employee, Viewer)
├── 20 صلاحية (View, Edit, Delete, Approve, ...)
├── Context للتحقق من الصلاحيات
└── حماية على 3 مستويات (Routes, Buttons, API)

الاستخدام:
1. أضف موظف
2. اختر الدور
3. النظام يعطيه الصلاحيات تلقائياً
4. الموظف يسجل دخول
5. يشوف فقط ما يُسمح له به! 🔒
```

---

## 🎓 الخلاصة

نظام الصلاحيات هو **العمود الفقري** للأمان في المشروع.

**بدونه:**
- أي حد يقدر يعمل أي شي ❌
- فوضى ❌
- خطر على البيانات ❌

**معه:**
- كل واحد يشتغل في نطاقه ✅
- أمان ✅
- تنظيم ✅

**تذكر:** الأمان ليس رفاهية، بل ضرورة! 🔐
