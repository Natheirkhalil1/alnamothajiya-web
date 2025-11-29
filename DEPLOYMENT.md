# دليل النشر

## النشر على Vercel (موصى به)

### الخطوات:

1. **تجهيز المشروع:**
\`\`\`bash
# تأكد من أن جميع الملفات محفوظة
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

2. **إنشاء حساب Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول باستخدام GitHub

3. **استيراد المشروع:**
   - اضغط "New Project"
   - اختر المستودع من GitHub
   - Vercel سيكتشف تلقائياً أنه مشروع Next.js

4. **إعدادات المشروع:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **المتغيرات البيئية (Firebase):**
   - Settings > Environment Variables
   - أضف متغيرات Firebase:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`

6. **النشر:**
   - اضغط "Deploy"
   - انتظر حتى ينتهي البناء (2-3 دقائق)
   - ستحصل على رابط الموقع

### التحديثات التلقائية:
- كل push إلى branch `main` سيؤدي إلى نشر تلقائي
- يمكنك إيقاف هذا من إعدادات Vercel

## النشر على Netlify

### الخطوات:

1. **تجهيز المشروع:**
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

2. **إنشاء حساب Netlify:**
   - اذهب إلى [netlify.com](https://netlify.com)
   - سجل دخول باستخدام GitHub

3. **استيراد المشروع:**
   - اضغط "New site from Git"
   - اختر GitHub
   - اختر المستودع

4. **إعدادات البناء:**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

5. **المتغيرات البيئية:**
   - Site settings > Environment variables
   - أضف متغيرات Firebase من `.env.example`

6. **النشر:**
   - اضغط "Deploy site"

## النشر على خادم خاص (VPS)

### المتطلبات:
- Ubuntu 20.04+ أو Debian 11+
- Node.js 18+
- Nginx
- PM2

### الخطوات:

1. **تثبيت Node.js:**
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

2. **تثبيت PM2:**
\`\`\`bash
sudo npm install -g pm2
\`\`\`

3. **استنساخ المشروع:**
\`\`\`bash
cd /var/www
git clone https://github.com/your-username/model-school.git
cd model-school
\`\`\`

4. **تثبيت التبعيات:**
\`\`\`bash
npm install
\`\`\`

5. **إعداد المتغيرات البيئية:**
\`\`\`bash
cp .env.example .env.local
# ثم قم بتعديل .env.local وإضافة بيانات Firebase
\`\`\`

6. **بناء المشروع:**
\`\`\`bash
npm run build
\`\`\`

7. **تشغيل المشروع بـ PM2:**
\`\`\`bash
pm2 start npm --name "model-school" -- start
pm2 save
pm2 startup
\`\`\`

8. **إعداد Nginx:**
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

9. **تفعيل SSL (اختياري):**
\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

## إعداد Firebase للإنتاج

### 1. قواعد الأمان لـ Firestore:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // قاعدة عامة: السماح بالقراءة للجميع
    match /{document=**} {
      allow read: if true;
      // السماح بالكتابة للمستخدمين المصادقين فقط
      allow write: if request.auth != null;
    }
    
    // حماية بيانات الموظفين
    match /web_employees/{employee} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
\`\`\`

### 2. قواعد الأمان لـ Storage:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

### 3. إعداد Firebase Authentication:

- فعّل Email/Password من Authentication > Sign-in method
- (اختياري) فعّل Google Sign-in للتسهيل

## استكشاف الأخطاء

### المشكلة: الموقع لا يعمل بعد النشر
**الحل:**
- تحقق من logs في Vercel/Netlify
- تأكد من أن جميع متغيرات Firebase البيئية مضافة بشكل صحيح
- تأكد من أن `package.json` يحتوي على جميع التبعيات

### المشكلة: Firebase يعطي خطأ "Permission Denied"
**الحل:**
- تحقق من قواعد الأمان في Firestore و Storage
- تأكد من أن المستخدم مصادق عليه
- راجع Firebase Console > Firestore > Rules

### المشكلة: الصور لا تظهر
**الحل:**
- تأكد من أن Firebase Storage مفعّل
- تحقق من قواعد Storage
- تأكد من صحة رابط الصورة

### المشكلة: localStorage لا يعمل
**الحل:**
- localStorage يعمل فقط في المتصفح (client-side)
- تأكد من استخدام `'use client'` في المكونات التي تستخدم localStorage
- للإنتاج، استخدم Firebase بدلاً من localStorage

## النسخ الاحتياطي

### نسخ احتياطي من Firebase:
\`\`\`bash
# استخدم Firebase CLI
npm install -g firebase-tools
firebase login
firebase backup:export
\`\`\`

### نسخ احتياطي لـ localStorage (للتطوير):
\`\`\`javascript
// في console المتصفح
const backup = {
  employees: localStorage.getItem('employees'),
  applications: localStorage.getItem('employmentApplications'),
  // ... إلخ
};
console.log(JSON.stringify(backup));
\`\`\`

## الأمان

### توصيات الأمان:
1. **لا تشارك ملف `.env.local`** - يحتوي على بيانات Firebase الحساسة
2. **استخدم HTTPS** - دائماً في الإنتاج (Vercel يوفر هذا تلقائياً)
3. **فعّل قواعد الأمان في Firebase** - لا تترك قواعد البيانات مفتوحة للجميع
4. **غيّر كلمات السر الافتراضية** - خاصة للمدير
5. **فعّل المصادقة الثنائية** - في GitHub و Vercel و Firebase Console
6. **راجع الصلاحيات** - تأكد من أن الموظفين لديهم الصلاحيات المناسبة فقط
7. **راقب استخدام Firebase** - تحقق من Usage & Billing في Firebase Console

## الصيانة

### تحديث التبعيات:
\`\`\`bash
npm update
npm audit fix
\`\`\`

### مراقبة الأداء:
- استخدم Vercel Analytics
- راقب Firebase Console > Performance
- راقع logs بانتظام
- تحقق من سرعة التحميل

### حدود Firebase المجانية:
- **Firestore**: 1GB تخزين، 50K قراءة/يوم، 20K كتابة/يوم
- **Storage**: 5GB تخزين، 1GB تنزيل/يوم
- **Authentication**: غير محدود

## الدعم

للمساعدة في النشر:
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- البريد الإلكتروني: admin@namothajia.com
