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

5. **المتغيرات البيئية (اختياري):**
   - إذا كنت تستخدم Supabase، أضف المتغيرات من `.env.example`
   - Settings > Environment Variables

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
   - أضف المتغيرات من `.env.example`

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

5. **بناء المشروع:**
\`\`\`bash
npm run build
\`\`\`

6. **تشغيل المشروع بـ PM2:**
\`\`\`bash
pm2 start npm --name "model-school" -- start
pm2 save
pm2 startup
\`\`\`

7. **إعداد Nginx:**
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

8. **تفعيل SSL (اختياري):**
\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

## استكشاف الأخطاء

### المشكلة: الموقع لا يعمل بعد النشر
**الحل:**
- تحقق من logs في Vercel/Netlify
- تأكد من أن جميع المتغيرات البيئية مضافة
- تأكد من أن `package.json` يحتوي على جميع التبعيات

### المشكلة: الصور لا تظهر
**الحل:**
- تأكد من أن الصور في مجلد `public/`
- استخدم مسارات نسبية: `/image.jpg` بدلاً من `./image.jpg`

### المشكلة: localStorage لا يعمل
**الحل:**
- localStorage يعمل فقط في المتصفح (client-side)
- تأكد من استخدام `'use client'` في المكونات التي تستخدم localStorage

## النسخ الاحتياطي

### نسخ احتياطي لـ localStorage:
\`\`\`javascript
// في console المتصفح
const backup = {
  employees: localStorage.getItem('employees'),
  applications: localStorage.getItem('employmentApplications'),
  // ... إلخ
};
console.log(JSON.stringify(backup));
\`\`\`

### استعادة النسخة الاحتياطية:
\`\`\`javascript
const backup = { /* البيانات المحفوظة */ };
Object.keys(backup).forEach(key => {
  localStorage.setItem(key, backup[key]);
});
\`\`\`

## الأمان

### توصيات الأمان:
1. **لا تشارك ملف `.env.local`** - يحتوي على بيانات حساسة
2. **استخدم HTTPS** - دائماً في الإنتاج
3. **غيّر كلمات السر الافتراضية** - خاصة للمدير
4. **فعّل المصادقة الثنائية** - في GitHub و Vercel
5. **راجع الصلاحيات** - تأكد من أن الموظفين لديهم الصلاحيات المناسبة فقط

## الصيانة

### تحديث التبعيات:
\`\`\`bash
npm update
npm audit fix
\`\`\`

### مراقبة الأداء:
- استخدم Vercel Analytics
- راقب logs بانتظام
- تحقق من سرعة التحميل

## الدعم

للمساعدة في النشر:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- البريد الإلكتروني: admin@namothajia.com
