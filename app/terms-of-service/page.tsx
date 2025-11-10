"use client"

import { useLanguage } from "@/lib/language-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useMemo } from "react"
import {
  CheckCircle,
  Users,
  Lock,
  FileText,
  AlertTriangle,
  Calendar,
  MessageCircle,
  DollarSign,
  Gift,
  Info,
} from "lucide-react"

export default function TermsOfServicePage() {
  const { language } = useLanguage()

  const content = useMemo(
    () => ({
      ar: {
        title: "شروط الاستخدام",
        subtitle: "آخر تحديث: 10 نوفمبر 2025",
        sections: [
          {
            icon: Info,
            title: "مقدمة",
            content:
              "مرحباً بك في تطبيق المدرسة النموذجية للتربية الخاصة. باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام. يُرجى قراءتها بعناية قبل استخدام التطبيق.",
          },
          {
            icon: CheckCircle,
            title: "قبول الشروط",
            subsections: [
              {
                subtitle: "الموافقة الملزمة:",
                items: [
                  "بتنزيل التطبيق أو استخدامه، تُقر بموافقتك على هذه الشروط",
                  "إذا كنت قاصراً (دون 18 عاماً)، يجب موافقة ولي الأمر",
                  "تُعتبر موافقتك ملزمة قانونياً",
                  "الاستمرار في استخدام التطبيق يعني قبول أي تحديثات",
                ],
              },
              {
                subtitle: "حقك في الرفض:",
                items: [
                  "إذا لم توافق على هذه الشروط، يُرجى عدم استخدام التطبيق",
                  "يمكنك إلغاء الحساب في أي وقت",
                  "الإلغاء لا يؤثر على الالتزامات السابقة",
                ],
              },
            ],
          },
          {
            icon: DollarSign,
            title: "الغرض من التطبيق",
            subsections: [
              {
                subtitle: "الأغراض المصرح بها:",
                content: "",
              },
              {
                subtitle: "1. الإدارة التعليمية:",
                items: [
                  "تنظيم العملية التعليمية للطلاب ذوي الاحتياجات الخاصة",
                  "إعداد وتتبع الخطط التربوية الفردية",
                  "توثيق التقدم الأكاديمي والتأهيلي",
                ],
              },
              {
                subtitle: "2. التواصل:",
                items: [
                  "التواصل الفعال بين المدرسة والطلاب",
                  "التواصل مع أولياء الأمور",
                  "إرسال الإشعارات والتنبيهات المهمة",
                ],
              },
              {
                subtitle: "3. الإدارة الإدارية:",
                items: ["إدارة المخزون المدرسي", "معالجة عمليات الشراء", "إعداد التقارير الإدارية"],
              },
              {
                subtitle: "الاستخدام المحظور:",
                items: [
                  "استخدام التطبيق لأغراض غير تعليمية",
                  "التلاعب أو محاولة اختراق النظام",
                  "نشر محتوى مسيء أو غير لائق",
                  "انتهاك خصوصية المستخدمين الآخرين",
                ],
              },
            ],
          },
          {
            icon: FileText,
            title: "أنواع المستخدمين وواجباتهم",
            subsections: [
              {
                subtitle: "1. الطلاب:",
                items: [
                  "الحقوق: الوصول لبياناتهم الشخصية، الخطط، التقارير، الفيديوهات التعليمية",
                  "الواجبات: الحفاظ على سرية كلمة المرور، استخدام التطبيق بمسؤولية",
                  "القيود: لا يمكن تعديل البيانات الأساسية، محدود بصلاحيات العرض فقط",
                ],
              },
              {
                subtitle: "2. الموظفون:",
                items: [
                  "الحقوق: إدارة بيانات الطلاب، إنشاء الخطط والتقارير، رفع المحتوى التعليمي",
                  "الواجبات: الدقة في إدخال البيانات، احترام خصوصية الطلاب، الاستخدام المهني",
                  "المسؤوليات: مسؤولون عن صحة البيانات المدخلة",
                ],
              },
              {
                subtitle: "3. موظفو المخزن:",
                items: [
                  "الحقوق: إدارة المخزون، تحديث الكميات، إصدار التنبيهات",
                  "الواجبات: تحديث المخزون بانتظام، دقة البيانات",
                  "القيود: الوصول محصور في قسم المخزون فقط",
                ],
              },
              {
                subtitle: "4. موظفو المشتريات:",
                items: [
                  "الحقوق: إدارة عمليات الشراء، معالجة الطلبات",
                  "الواجبات: توثيق العمليات، الامتثال لسياسات الشراء",
                  "القيود: الوصول محصور في قسم المشتريات فقط",
                ],
              },
            ],
          },
          {
            icon: Lock,
            title: "أمان الحسابات",
            subsections: [
              {
                subtitle: "مسؤوليات المستخدم:",
                items: [
                  "أنت المسؤول الوحيد عن أمان حسابك",
                  "يجب عليك اختيار كلمة مرور قوية (8 أحرف على الأقل)",
                  "لا تشارك بيانات دخولك مع أي شخص",
                  "أبلغنا فوراً عن أي استخدام مشبوه",
                ],
              },
              {
                subtitle: "مسؤوليات المدرسة:",
                items: [
                  "نحمي بياناتك بأعلى معايير الأمان",
                  "نراقب الأنشطة المشبوهة",
                  "نوفر آليات استرجاع الحساب",
                  "نتحقق في أي انتهاكات أمنية",
                ],
              },
              {
                subtitle: "إجراءات عند الاختراق:",
                items: [
                  "أبلغنا فوراً على: info@namothajia.com",
                  "سنوقف الحساب مؤقتاً للحماية",
                  "سنساعدك في استرجاع الحساب بأمان",
                  "سنتحقق في الحادثة ونتخذ الإجراءات اللازمة",
                ],
              },
            ],
          },
          {
            icon: Users,
            title: "المحتوى والملكية الفكرية",
            subsections: [
              {
                subtitle: "ملكية المحتوى:",
                items: [
                  "جميع المحتويات التعليمية (نصوص، صور، فيديوهات) ملك للمدرسة",
                  "الخطط التربوية والتقارير ملك للمدرسة",
                  "حقوق الطبع والنشر محفوظة ©2025",
                ],
              },
              {
                subtitle: "استخدام المحتوى:",
                items: [
                  "يمكنك عرض المحتوى لأغراض تعليمية شخصية",
                  "يمكنك تحميل ملفاتك الشخصية",
                  "يُمنع نسخ أو توزيع المحتوى بدون إذن كتابي",
                  "يُمنع استخدام المحتوى لأغراض تجارية",
                ],
              },
              {
                subtitle: "المحتوى الذي ترفعه:",
                items: [
                  "أنت مسؤول عن المحتوى الذي ترفعه",
                  "يجب أن يكون ملائماً وقانونياً",
                  "المدرسة تحتفظ بحق حذف أي محتوى غير مناسب",
                  "قد نستخدم محتواك لأغراض تعليمية داخلية",
                ],
              },
            ],
          },
          {
            icon: Gift,
            title: "قواعد السلوك المقبول",
            subsections: [
              {
                subtitle: "السلوكيات المحظورة:",
                content: "",
              },
              {
                subtitle: "1. المحتوى المحظور:",
                items: [
                  "محتوى مسيء أو عنصري أو تمييزي",
                  "محتوى جنسي أو عنيف أو غير لائق",
                  "معلومات كاذبة أو مضللة",
                  "محتوى يحرض على الكراهية أو العنف",
                  "محتوى ينتهك حقوق الآخرين",
                ],
              },
              {
                subtitle: "2. الأنشطة المحظورة:",
                items: [
                  "التحرش أو التنمر على المستخدمين الآخرين",
                  "انتحال الشخصية أو الاحتيال",
                  "محاولة اختراق أو تعطيل النظام",
                  "استخدام برامج آلية أو روبوتات",
                  "جمع بيانات المستخدمين الآخرين",
                ],
              },
              {
                subtitle: "3. إساءة الاستخدام:",
                items: [
                  "الإفراط في استخدام الموارد",
                  "إرسال رسائل غير مرغوبة (spam)",
                  "نشر فيروسات أو برامج ضارة",
                  "التلاعب بالبيانات أو التقارير",
                ],
              },
              {
                subtitle: "العقوبات:",
                items: [
                  "تحذير أولي للمخالفات البسيطة",
                  "تعليق الحساب مؤقتاً للمخالفات المتكررة",
                  "إيقاف الحساب نهائياً للمخالفات الجسيمة",
                  "اتخاذ إجراءات قانونية عند الضرورة",
                ],
              },
            ],
          },
          {
            icon: AlertTriangle,
            title: "إخلاء المسؤولية",
            subsections: [
              {
                subtitle: "حدود المسؤولية:",
                content: "",
              },
              {
                subtitle: "1. توفر الخدمة:",
                items: [
                  'التطبيق مقدم "كما هو" بدون ضمانات صريحة أو ضمنية',
                  "لا نضمن أن التطبيق خالٍ من الأخطاء أو الانقطاعات",
                  "قد نوقف الخدمة مؤقتاً للصيانة أو التحديثات",
                  "نبذل قصارى جهدنا لضمان استمرارية الخدمة",
                ],
              },
              {
                subtitle: "2. دقة المعلومات:",
                items: [
                  "نسعى لتوفير معلومات دقيقة ومحدثة",
                  "لا نضمن دقة أو اكتمال جميع المعلومات",
                  "أنت مسؤول عن التحقق من المعلومات المهمة",
                  "لا نتحمل مسؤولية الأخطاء في البيانات",
                ],
              },
              {
                subtitle: "3. الأضرار:",
                items: [
                  "لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة",
                  "لا نتحمل مسؤولية فقدان البيانات (نوصي بالنسخ الاحتياطي)",
                  "لا نتحمل مسؤولية الأضرار الناتجة عن سوء الاستخدام",
                  "مسؤوليتنا محدودة بالقيمة المدفوعة (إن وجدت)",
                ],
              },
              {
                subtitle: "4. الروابط الخارجية:",
                items: [
                  "قد يحتوي التطبيق على روابط لمواقع خارجية",
                  "لا نتحمل مسؤولية محتوى أو سياسات المواقع الخارجية",
                  "استخدام الروابط الخارجية على مسؤوليتك الخاصة",
                ],
              },
            ],
          },
          {
            icon: MessageCircle,
            title: "التحديثات والتعديلات",
            subsections: [
              {
                subtitle: "التحديثات التلقائية:",
                items: [
                  "قد نحدّث التطبيق دورياً لتحسين الأداء والأمان",
                  "بعض التحديثات قد تكون إلزامية",
                  "سنشعرك بالتحديثات المهمة مسبقاً",
                  "الاستمرار في الاستخدام يعني قبول التحديثات",
                ],
              },
              {
                subtitle: "تعديل الشروط:",
                items: [
                  "نحتفظ بالحق في تعديل هذه الشروط في أي وقت",
                  "سنشعرك بالتغييرات الجوهرية عبر التطبيق أو البريد الإلكتروني",
                  "لديك 30 يوماً للاعتراض على التغييرات",
                  "الاستمرار في الاستخدام بعد التعديلات يعني قبولها",
                ],
              },
              {
                subtitle: "إنهاء الخدمة:",
                items: [
                  "نحتفظ بالحق في إنهاء الخدمة في أي وقت",
                  "سنشعرك قبل 30 يوماً من الإنهاء (إن أمكن)",
                  "يمكنك تصدير بياناتك قبل الإنهاء",
                ],
              },
            ],
          },
          {
            icon: FileText,
            title: "القانون الحاكم وحل النزاعات",
            subsections: [
              {
                subtitle: "الاختصاص القانوني:",
                items: [
                  "تخضع هذه الشروط لقوانين المملكة الأردنية الهاشمية",
                  "المحاكم الأردنية في عمان هي صاحبة الاختصاص",
                ],
              },
              {
                subtitle: "حل النزاعات:",
                items: [
                  "نشجع على الحل الودي أولاً",
                  "يمكنك التواصل معنا لحل أي خلاف",
                  "الوساطة قبل اللجوء للقضاء مُستحسنة",
                  "اللغة العربية هي المرجع عند الاختلاف",
                ],
              },
            ],
          },
          {
            icon: Calendar,
            title: "آخر تحديث وإصدار",
            content: "آخر تحديث: نوفمبر 2025\nرقم الإصدار: 1.0",
          },
          {
            icon: Info,
            title: "تعديلات على الشروط",
            content:
              "تحتفظ المدرسة بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار أولياء الأمور بالتغييرات الهامة قبل 30 يوماً على الأقل.",
          },
        ],
      },
      en: {
        title: "Terms of Service",
        subtitle: "Last Updated: November 10, 2025",
        sections: [
          {
            icon: Info,
            title: "Introduction",
            content:
              "Welcome to Al-Namoothajia School for Special Education app. By using this app, you agree to comply with these terms and conditions. Please read them carefully before using the app.",
          },
          {
            icon: CheckCircle,
            title: "Acceptance of Terms",
            subsections: [
              {
                subtitle: "Binding Agreement:",
                items: [
                  "By downloading or using the app, you acknowledge your agreement to these terms",
                  "If you are a minor (under 18), parental consent is required",
                  "Your agreement is legally binding",
                  "Continued use means acceptance of any updates",
                ],
              },
              {
                subtitle: "Right to Refuse:",
                items: [
                  "If you do not agree to these terms, please do not use the app",
                  "You may close your account at any time",
                  "Cancellation does not affect prior obligations",
                ],
              },
            ],
          },
          {
            icon: DollarSign,
            title: "Purpose of the App",
            subsections: [
              {
                subtitle: "Authorized Purposes:",
                content: "",
              },
              {
                subtitle: "1. Educational Management:",
                items: [
                  "Organizing educational process for students with special needs",
                  "Creating and tracking Individual Education Plans (IEPs)",
                  "Documenting academic and rehabilitation progress",
                ],
              },
              {
                subtitle: "2. Communication:",
                items: [
                  "Effective communication between school and students",
                  "Communication with parents",
                  "Sending important notifications and alerts",
                ],
              },
              {
                subtitle: "3. Administrative Management:",
                items: [
                  "Managing school inventory",
                  "Processing purchase operations",
                  "Preparing administrative reports",
                ],
              },
              {
                subtitle: "Prohibited Use:",
                items: [
                  "Using the app for non-educational purposes",
                  "Tampering or attempting to hack the system",
                  "Posting offensive or inappropriate content",
                  "Violating other users' privacy",
                ],
              },
            ],
          },
          {
            icon: FileText,
            title: "User Types and Duties",
            subsections: [
              {
                subtitle: "1. Students:",
                items: [
                  "Rights: Access to personal data, plans, reports, educational videos",
                  "Duties: Maintain password confidentiality, use app responsibly",
                  "Restrictions: Cannot edit basic data, limited to view-only permissions",
                ],
              },
              {
                subtitle: "2. Employees:",
                items: [
                  "Rights: Manage student data, create plans and reports, upload educational content",
                  "Duties: Accuracy in data entry, respect student privacy, professional use",
                  "Responsibilities: Responsible for accuracy of entered data",
                ],
              },
              {
                subtitle: "3. Warehouse Staff:",
                items: [
                  "Rights: Manage inventory, update quantities, issue alerts",
                  "Duties: Regular inventory updates, data accuracy",
                  "Restrictions: Access limited to warehouse section only",
                ],
              },
              {
                subtitle: "4. Purchasing Staff:",
                items: [
                  "Rights: Manage purchase operations, process orders",
                  "Duties: Document operations, comply with purchasing policies",
                  "Restrictions: Access limited to purchasing section only",
                ],
              },
            ],
          },
          {
            icon: Lock,
            title: "Account Security",
            subsections: [
              {
                subtitle: "User Responsibilities:",
                items: [
                  "You are solely responsible for your account security",
                  "Must choose a strong password (minimum 8 characters)",
                  "Do not share your login credentials with anyone",
                  "Report any suspicious activity immediately",
                ],
              },
              {
                subtitle: "School Responsibilities:",
                items: [
                  "We protect your data with highest security standards",
                  "We monitor suspicious activities",
                  "We provide account recovery mechanisms",
                  "We investigate any security breaches",
                ],
              },
              {
                subtitle: "Breach Procedures:",
                items: [
                  "Report immediately to: info@namothajia.com",
                  "We will temporarily suspend account for protection",
                  "We will help you recover account securely",
                  "We will investigate incident and take necessary actions",
                ],
              },
            ],
          },
          {
            icon: Users,
            title: "Content and Intellectual Property",
            subsections: [
              {
                subtitle: "Content Ownership:",
                items: [
                  "All educational content (texts, images, videos) belongs to the school",
                  "Educational plans and reports belong to the school",
                  "Copyright reserved ©2025",
                ],
              },
              {
                subtitle: "Content Usage:",
                items: [
                  "You may view content for personal educational purposes",
                  "You may download your personal files",
                  "Copying or distributing content without written permission is prohibited",
                  "Using content for commercial purposes is prohibited",
                ],
              },
              {
                subtitle: "Content You Upload:",
                items: [
                  "You are responsible for content you upload",
                  "Must be appropriate and legal",
                  "School reserves right to remove any inappropriate content",
                  "We may use your content for internal educational purposes",
                ],
              },
            ],
          },
          {
            icon: Gift,
            title: "Acceptable Use Policy",
            subsections: [
              {
                subtitle: "Prohibited Behaviors:",
                content: "",
              },
              {
                subtitle: "1. Prohibited Content:",
                items: [
                  "Offensive, racist, or discriminatory content",
                  "Sexual, violent, or inappropriate content",
                  "False or misleading information",
                  "Content inciting hatred or violence",
                  "Content violating others' rights",
                ],
              },
              {
                subtitle: "2. Prohibited Activities:",
                items: [
                  "Harassing or bullying other users",
                  "Impersonation or fraud",
                  "Attempting to hack or disrupt the system",
                  "Using automated programs or bots",
                  "Collecting other users' data",
                ],
              },
              {
                subtitle: "3. Abuse:",
                items: [
                  "Excessive resource usage",
                  "Sending spam messages",
                  "Distributing viruses or malware",
                  "Manipulating data or reports",
                ],
              },
              {
                subtitle: "Penalties:",
                items: [
                  "Initial warning for minor violations",
                  "Temporary account suspension for repeated violations",
                  "Permanent account termination for serious violations",
                  "Legal action when necessary",
                ],
              },
            ],
          },
          {
            icon: AlertTriangle,
            title: "Disclaimer",
            subsections: [
              {
                subtitle: "Liability Limits:",
                content: "",
              },
              {
                subtitle: "1. Service Availability:",
                items: [
                  'App provided "as is" without express or implied warranties',
                  "We do not guarantee error-free or uninterrupted app",
                  "We may temporarily suspend service for maintenance or updates",
                  "We strive to ensure service continuity",
                ],
              },
              {
                subtitle: "2. Information Accuracy:",
                items: [
                  "We strive to provide accurate and updated information",
                  "We do not guarantee accuracy or completeness of all information",
                  "You are responsible for verifying important information",
                  "We are not responsible for data errors",
                ],
              },
              {
                subtitle: "3. Damages:",
                items: [
                  "We are not liable for any direct or indirect damages",
                  "We are not responsible for data loss (backup recommended)",
                  "We are not responsible for damages from misuse",
                  "Our liability is limited to amount paid (if any)",
                ],
              },
              {
                subtitle: "4. External Links:",
                items: [
                  "App may contain links to external sites",
                  "We are not responsible for content or policies of external sites",
                  "Use external links at your own risk",
                ],
              },
            ],
          },
          {
            icon: MessageCircle,
            title: "Updates and Modifications",
            subsections: [
              {
                subtitle: "Automatic Updates:",
                items: [
                  "We may update app periodically to improve performance and security",
                  "Some updates may be mandatory",
                  "We will notify you of important updates in advance",
                  "Continued use means acceptance of updates",
                ],
              },
              {
                subtitle: "Terms Modification:",
                items: [
                  "We reserve right to modify these terms at any time",
                  "We will notify you of material changes via app or email",
                  "You have 30 days to object to changes",
                  "Continued use after modifications means acceptance",
                ],
              },
              {
                subtitle: "Service Termination:",
                items: [
                  "We reserve right to terminate service at any time",
                  "We will notify you 30 days before termination (if possible)",
                  "You can export your data before termination",
                ],
              },
            ],
          },
          {
            icon: Calendar,
            title: "Last Updated / Version",
            content: "Last Updated: November 2025\nVersion: 1.0",
          },
          {
            icon: Info,
            title: "Amendments to Terms",
            content:
              "The school reserves the right to amend these terms at any time. Parents will be notified of significant changes at least 30 days in advance.",
          },
        ],
      },
    }),
    [],
  )

  const currentContent = useMemo(() => content[language], [language, content])

  return (
    <LayoutWrapper>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 pt-32 pb-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />

          <div className="container mx-auto max-w-5xl relative">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl mb-8 shadow-2xl border border-white/30">
                <FileText className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
                {currentContent.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 font-medium drop-shadow-lg">{currentContent.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="space-y-6">
              {currentContent.sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
                          {section.content && (
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                              {section.content}
                            </p>
                          )}
                          {section.subsections && (
                            <div className="space-y-6 mt-4">
                              {section.subsections.map((subsection, subIndex) => (
                                <div key={subIndex}>
                                  {subsection.subtitle && (
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                                      {subsection.subtitle}
                                    </h3>
                                  )}
                                  {subsection.content && (
                                    <p className="text-gray-700 leading-relaxed mb-2">{subsection.content}</p>
                                  )}
                                  {subsection.items && (
                                    <ul className="space-y-2.5">
                                      {subsection.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-3 text-gray-700 text-base">
                                          <span className="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
                                          <span className="flex-1 leading-relaxed">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">{language === "ar" ? "اتصل بنا" : "Contact Us"}</h2>
                <p className="text-lg text-white/90">
                  {language === "ar"
                    ? "إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا:"
                    : "If you have any questions about these Terms of Service, please contact us:"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-base">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="font-semibold mb-3 text-lg">
                    {language === "ar" ? "معلومات التواصل" : "Contact Details"}
                  </h3>
                  <div className="space-y-2 text-white/95">
                    <p>
                      <strong>{language === "ar" ? "البريد الإلكتروني:" : "Email:"}</strong>{" "}
                      <a href="mailto:info@namothajia.com" className="underline hover:text-white">
                        info@namothajia.com
                      </a>
                    </p>
                    <p>
                      <strong>{language === "ar" ? "الهاتف:" : "Phone:"}</strong> +962 6 412 2002
                    </p>
                    <p>
                      <strong>{language === "ar" ? "العنوان:" : "Address:"}</strong>{" "}
                      {language === "ar"
                        ? "شارع المطار / حي الأمير علي - عمان - الأردن"
                        : "Airport Road / Prince Ali District - Amman - Jordan"}
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="font-semibold mb-3 text-lg">{language === "ar" ? "ساعات العمل" : "Working Hours"}</h3>
                  <p className="text-white/95">
                    {language === "ar" ? "الأحد - الخميس (8 صباحاً - 4 مساءً)" : "Sunday - Thursday (8 AM - 3 PM)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LayoutWrapper>
  )
}
