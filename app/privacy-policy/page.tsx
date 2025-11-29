"use client"

import { useLanguage } from "@/lib/language-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useMemo } from "react"
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  Globe,
  Bell,
  Camera,
  Smartphone,
  XCircle,
  Clock,
  CheckCircle,
} from "lucide-react"

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()

  const content = useMemo(
    () => ({
      ar: {
        title: "سياسة الخصوصية",
        sections: [
          {
            icon: Smartphone,
            title: "نظرة عامة",
            content: `تطبيق المدرسة النموذجية للتربية الخاصة هو تطبيق تعليمي مخصص لإدارة وتنظيم العملية التعليمية للطلاب ذوي الاحتياجات الخاصة. نحن ملتزمون بحماية خصوصية بيانات الطلاب وأولياء الأمور والموظفين.`,
          },
          {
            icon: Users,
            title: "البيانات التي نجمعها",
            subsections: [
              {
                subtitle: "معلومات الطالب:",
                points: [
                  "الاسم الكامل ورقم الهوية الوطنية",
                  "تاريخ الميلاد والعمر",
                  "الصورة الشخصية",
                  "معلومات الاتصال بولي الأمر",
                ],
              },
              {
                subtitle: "المعلومات الطبية والتأهيلية:",
                points: [
                  "نوع الإعاقة ودرجتها",
                  "الطول والوزن (لأغراض تأهيلية)",
                  "الملف الطبي والتقارير الطبية",
                  "خطط العلاج والتأهيل",
                ],
              },
              {
                subtitle: "البيانات الأكاديمية:",
                points: [
                  "الخطط الدراسية الفردية",
                  "تقارير الإنجاز والتقدم",
                  "الفيديوهات والصور التعليمية",
                  "سجلات الحضور والغياب",
                ],
              },
              {
                subtitle: "بيانات الاستخدام:",
                points: [
                  "آخر تسجيل دخول",
                  "حالة الاتصال (متصل/غير متصل)",
                  "الأجهزة المستخدمة",
                  "سجل النشاط في التطبيق",
                ],
              },
            ],
          },
          {
            icon: Lock,
            title: "كيف نحمي البيانات",
            subsections: [
              {
                subtitle: "التدابير الأمنية:",
                points: [
                  "استخدام Firebase (Google Cloud) للتخزين الآمن والمشفر",
                  "تشفير جميع الاتصالات باستخدام SSL/TLS",
                  "جلسات مصادقة آمنة تنتهي تلقائياً بعد 30 يوماً",
                  "نظام صلاحيات متعدد المستويات (طالب، موظف، إدارة، مخزن)",
                  "نسخ احتياطية منتظمة ومشفرة",
                  "مراقبة مستمرة للأنشطة المشبوهة",
                  "حماية ضد الوصول غير المصرح به",
                ],
              },
              {
                subtitle: "سياسة عدم المشاركة:",
                points: [
                  "لا نبيع بياناتك لأي جهة خارجية",
                  "لا نشارك معلوماتك مع شركات إعلانية",
                  "لا نستخدم بياناتك خارج الأغراض التعليمية",
                  "الوصول محصور على الموظفين المصرح لهم فقط",
                ],
              },
            ],
          },
          {
            icon: Eye,
            title: "كيف نستخدم البيانات",
            subsections: [
              {
                subtitle: "الأغراض التعليمية:",
                points: [
                  "تقديم الخدمات التعليمية والتأهيلية المتخصصة",
                  "إعداد الخطط التربوية الفردية",
                  "متابعة وتقييم التقدم الأكاديمي",
                  "توثيق الإنجازات والتطور",
                ],
              },
              {
                subtitle: "الأغراض الإدارية:",
                points: [
                  "التواصل مع أولياء الأمور والطلاب",
                  "إدارة المخزون والمشتريات المدرسية",
                  "إرسال الإشعارات التعليمية المهمة",
                  "إعداد التقارير الإحصائية",
                ],
              },
              {
                subtitle: "الأغراض الأمنية:",
                points: ["حماية حسابات المستخدمين", "منع الاستخدام غير المصرح به", "الامتثال للمتطلبات القانونية"],
              },
            ],
          },
          {
            icon: Shield,
            title: "حماية خصوصية الأطفال",
            content: "نلتزم بحماية خصوصية الأطفال وفقاً لقانون COPPA:",
            subsections: [
              {
                subtitle: "التزاماتنا:",
                points: [
                  "لا نجمع بيانات من أطفال دون 13 عاماً بدون موافقة ولي الأمر الصريحة",
                  "جميع البيانات تُستخدم للأغراض التعليمية والتأهيلية فقط",
                  "نطلب أقل قدر ممكن من المعلومات الضرورية",
                  "الوصول محدود للموظفين المصرح لهم تعليمياً",
                  "لا نشارك معلومات الأطفال مع جهات إعلانية أو تسويقية",
                  "التشفير الكامل لجميع بيانات الطلاب",
                ],
              },
              {
                subtitle: "حقوق أولياء الأمور:",
                points: [
                  "مراجعة بيانات أطفالهم في أي وقت",
                  "طلب تصحيح المعلومات غير الدقيقة",
                  "طلب حذف بيانات أطفالهم نهائياً",
                  "سحب الموافقة على معالجة البيانات",
                  "الحصول على نسخة من البيانات",
                ],
              },
            ],
          },
          {
            icon: Camera,
            title: "الأذونات المطلوبة",
            subsections: [
              {
                subtitle: "أذونات الجهاز:",
                points: [
                  "الكاميرا: لالتقاط الصور الشخصية والمحتوى التعليمي",
                  "التخزين: لحفظ الملفات والوسائط محلياً",
                  "الإشعارات: لإرسال التنبيهات التعليمية والإدارية",
                  "الإنترنت: للمزامنة مع قاعدة البيانات السحابية",
                  "الميكروفون: لتسجيل الملاحظات الصوتية (اختياري)",
                ],
              },
              {
                subtitle: "توضيح الأذونات:",
                points: [
                  "نطلب فقط الأذونات الضرورية للوظائف الأساسية",
                  "يمكنك رفض الأذونات غير الضرورية",
                  "التطبيق يعمل بشكل محدود بدون بعض الأذونات",
                ],
              },
            ],
          },
          {
            icon: XCircle,
            title: "الإعلانات وتتبع البيانات",
            content: "سياسة واضحة:",
            highlights: [
              { type: "negative", text: "هذا التطبيق لا يحتوي على أي إعلانات" },
              { type: "negative", text: "لا نستخدم Google Analytics أو أدوات تتبع خارجية" },
              { type: "negative", text: "لا نستخدم ملفات تعريف الارتباط للتتبع" },
              { type: "negative", text: "لا نبيع أو نشارك بيانات المستخدمين" },
              { type: "positive", text: "التطبيق مخصص للأغراض التعليمية البحتة فقط" },
            ],
          },
          {
            icon: Clock,
            title: "الاحتفاظ بالبيانات",
            subsections: [
              {
                subtitle: "فترات الاحتفاظ:",
                points: [
                  "بيانات الطلاب النشطين: طوال فترة الدراسة + سنة واحدة",
                  "بيانات الطلاب المتخرجين: 5 سنوات للأرشفة والمراجع",
                  "سجلات الدخول: 90 يوماً فقط",
                  "الرسائل والمحادثات: سنة واحدة",
                  "الملفات التعليمية: 6 أشهر (مع خيار الحذف التلقائي)",
                  "النسخ الاحتياطية: 30 يوماً بعد الحذف",
                ],
              },
              {
                subtitle: "حذف البيانات:",
                points: [
                  "يمكنك طلب حذف بياناتك في أي وقت",
                  "نحذف البيانات خلال 30 يوماً من الطلب",
                  "قد تبقى نسخ احتياطية لمدة 30 يوماً إضافية",
                  "الحذف نهائي ولا يمكن التراجع عنه",
                ],
              },
            ],
          },
          {
            icon: FileText,
            title: "حقوق المستخدمين",
            content: "حقوقك الكاملة:",
            rights: [
              {
                title: "1. حق الوصول:",
                points: [
                  "الحصول على نسخة من جميع بياناتك الشخصية",
                  "معرفة كيفية استخدام بياناتك",
                  "الاطلاع على سجل معالجة البيانات",
                ],
              },
              {
                title: "2. حق التصحيح:",
                points: ["تصحيح أي معلومات خاطئة أو غير دقيقة", "تحديث البيانات القديمة", "إكمال المعلومات الناقصة"],
              },
              {
                title: "3. حق الحذف (الحق في النسيان):",
                points: ["طلب حذف بياناتك نهائياً", "حذف البيانات غير الضرورية", "إلغاء الحساب نهائياً"],
              },
              {
                title: "4. حق نقل البيانات:",
                points: [
                  "الحصول على بياناتك بصيغة قابلة للقراءة آلياً",
                  "نقل بياناتك إلى خدمة أخرى",
                  "الحصول على نسخة بصيغة PDF أو JSON",
                ],
              },
              {
                title: "5. حق الاعتراض:",
                points: [
                  "الاعتراض على معالجة بيانات معينة",
                  "رفض استخدام البيانات لأغراض محددة",
                  "سحب الموافقة في أي وقت",
                ],
              },
              {
                title: "6. حق تقديم شكوى:",
                points: [
                  "تقديم شكوى للسلطات المختصة",
                  "الإبلاغ عن انتهاكات الخصوصية",
                  "طلب التحقيق في معالجة البيانات",
                ],
              },
            ],
            exercise: {
              subtitle: "كيفية ممارسة حقوقك:",
              points: ["راسلنا على: info@namothajia.com", "نرد خلال 3 أيام عمل", "نلبي الطلبات خلال 30 يوماً"],
            },
          },
          {
            icon: Globe,
            title: "نقل البيانات الدولي",
            points: [
              "بياناتك قد تُخزّن على خوادم Google Cloud في مواقع مختلفة",
              "نضمن نفس مستوى الحماية في جميع المواقع",
              "الامتثال لقوانين حماية البيانات الدولية",
            ],
          },
          {
            icon: Bell,
            title: "التغييرات على سياسة الخصوصية",
            points: [
              "نحتفظ بالحق في تحديث هذه السياسة",
              "سنشعرك بالتغييرات المهمة عبر التطبيق",
              "آخر تحديث: نوفمبر 2025",
              "مراجعة السياسة دورياً مستحسنة",
            ],
          },
        ],
        contact: {
          title: "تواصل معنا",
          subtitle: "معلومات الاتصال:",
          email: "info@namothajia.com",
          phone: "6 412 2002 962+",
          address: "طريق المطار / ضاحية الأمير علي - عمان - الأردن",
          hours: "ساعات العمل: الأحد - الخميس (8 صباحاً - 3 مساءً)",
          privacyInquiries: "للاستفسارات الخاصة بالخصوصية:",
          privacyPoints: [
            "نرد على جميع الاستفسارات خلال 48 ساعة",
            "نوفر دعماً باللغتين العربية والإنجليزية",
            "جميع الاتصالات سرية ومشفرة",
          ],
        },
      },
      en: {
        title: "Privacy Policy",
        sections: [
          {
            icon: Smartphone,
            title: "Overview",
            content: `Al-Namoothajia School for Special Education app is an educational application designed to manage and organize the educational process for students with special needs. We are committed to protecting the privacy of student, parent, and staff data.`,
          },
          {
            icon: Users,
            title: "Data We Collect",
            subsections: [
              {
                subtitle: "Student Information:",
                points: [
                  "Full name and national ID number",
                  "Date of birth and age",
                  "Profile photo",
                  "Parent/guardian contact information",
                ],
              },
              {
                subtitle: "Medical and Rehabilitation Information:",
                points: [
                  "Type and degree of disability",
                  "Height and weight (for rehabilitation purposes)",
                  "Medical file and reports",
                  "Treatment and rehabilitation plans",
                ],
              },
              {
                subtitle: "Academic Data:",
                points: [
                  "Individual Education Plans (IEPs)",
                  "Achievement and progress reports",
                  "Educational videos and photos",
                  "Attendance records",
                ],
              },
              {
                subtitle: "Usage Data:",
                points: [
                  "Last login timestamp",
                  "Connection status (online/offline)",
                  "Devices used",
                  "Activity log within the app",
                ],
              },
            ],
          },
          {
            icon: Lock,
            title: "How We Protect Data",
            subsections: [
              {
                subtitle: "Security Measures:",
                points: [
                  "Using Firebase (Google Cloud) for secure encrypted storage",
                  "All communications encrypted using SSL/TLS",
                  "Secure authentication sessions expire automatically after 30 days",
                  "Multi-level permission system (student, employee, admin, warehouse)",
                  "Regular encrypted backups",
                  "Continuous monitoring for suspicious activities",
                  "Protection against unauthorized access",
                ],
              },
              {
                subtitle: "No-Sharing Policy:",
                points: [
                  "We do not sell your data to any third parties",
                  "We do not share your information with advertising companies",
                  "We do not use your data outside educational purposes",
                  "Access limited to authorized staff only",
                ],
              },
            ],
          },
          {
            icon: Eye,
            title: "How We Use Data",
            subsections: [
              {
                subtitle: "Educational Purposes:",
                points: [
                  "Providing specialized educational and rehabilitation services",
                  "Creating Individual Education Plans (IEPs)",
                  "Monitoring and evaluating academic progress",
                  "Documenting achievements and development",
                ],
              },
              {
                subtitle: "Administrative Purposes:",
                points: [
                  "Communication with parents and students",
                  "Managing school inventory and purchases",
                  "Sending important educational notifications",
                  "Preparing statistical reports",
                ],
              },
              {
                subtitle: "Security Purposes:",
                points: [
                  "Protecting user accounts",
                  "Preventing unauthorized use",
                  "Compliance with legal requirements",
                ],
              },
            ],
          },
          {
            icon: Shield,
            title: "Children's Privacy Protection",
            content: "We are committed to protecting children's privacy in accordance with COPPA:",
            subsections: [
              {
                subtitle: "Our Commitments:",
                points: [
                  "We do not collect data from children under 13 without explicit parental consent",
                  "All data is used for educational and rehabilitation purposes only",
                  "We request the minimum necessary information",
                  "Access limited to educationally authorized staff",
                  "We do not share children's information with advertising or marketing entities",
                  "Complete encryption of all student data",
                ],
              },
              {
                subtitle: "Parents' Rights:",
                points: [
                  "Review their children's data at any time",
                  "Request correction of inaccurate information",
                  "Request permanent deletion of their children's data",
                  "Withdraw consent for data processing",
                  "Obtain a copy of the data",
                ],
              },
            ],
          },
          {
            icon: Camera,
            title: "Required Permissions",
            subsections: [
              {
                subtitle: "Device Permissions:",
                points: [
                  "Camera: To capture profile photos and educational content",
                  "Storage: To save files and media locally",
                  "Notifications: To send educational and administrative alerts",
                  "Internet: For synchronization with cloud database",
                  "Microphone: For voice note recording (optional)",
                ],
              },
              {
                subtitle: "Permission Clarification:",
                points: [
                  "We only request permissions necessary for core functions",
                  "You can deny non-essential permissions",
                  "The app works with limited functionality without some permissions",
                ],
              },
            ],
          },
          {
            icon: XCircle,
            title: "Advertising and Data Tracking",
            content: "Clear Policy:",
            highlights: [
              { type: "negative", text: "This app contains no advertisements" },
              { type: "negative", text: "We do not use Google Analytics or external tracking tools" },
              { type: "negative", text: "We do not use cookies for tracking" },
              { type: "negative", text: "We do not sell or share user data" },
              { type: "positive", text: "The app is for educational purposes only" },
            ],
          },
          {
            icon: Clock,
            title: "Data Retention",
            subsections: [
              {
                subtitle: "Retention Periods:",
                points: [
                  "Active student data: Throughout study period + 1 year",
                  "Graduate student data: 5 years for archiving and reference",
                  "Login records: 90 days only",
                  "Messages and chats: One year",
                  "Educational files: 6 months (with auto-delete option)",
                  "Backups: 30 days after deletion",
                ],
              },
              {
                subtitle: "Data Deletion:",
                points: [
                  "You can request deletion of your data at any time",
                  "We delete data within 30 days of request",
                  "Backups may remain for additional 30 days",
                  "Deletion is permanent and cannot be undone",
                ],
              },
            ],
          },
          {
            icon: FileText,
            title: "User Rights",
            content: "Your Complete Rights:",
            rights: [
              {
                title: "1. Right to Access:",
                points: [
                  "Obtain a copy of all your personal data",
                  "Know how your data is being used",
                  "Review data processing history",
                ],
              },
              {
                title: "2. Right to Rectification:",
                points: [
                  "Correct any incorrect or inaccurate information",
                  "Update outdated data",
                  "Complete missing information",
                ],
              },
              {
                title: "3. Right to Erasure (Right to be Forgotten):",
                points: [
                  "Request permanent deletion of your data",
                  "Delete unnecessary data",
                  "Permanently close account",
                ],
              },
              {
                title: "4. Right to Data Portability:",
                points: [
                  "Receive your data in machine-readable format",
                  "Transfer your data to another service",
                  "Get a copy in PDF or JSON format",
                ],
              },
              {
                title: "5. Right to Object:",
                points: [
                  "Object to processing of certain data",
                  "Refuse use of data for specific purposes",
                  "Withdraw consent at any time",
                ],
              },
              {
                title: "6. Right to Complain:",
                points: [
                  "File complaint with competent authorities",
                  "Report privacy violations",
                  "Request investigation into data processing",
                ],
              },
            ],
            exercise: {
              subtitle: "How to Exercise Your Rights:",
              points: [
                "Email us: info@namothajia.com",
                "We respond within 3 business days",
                "We fulfill requests within 30 days",
              ],
            },
          },
          {
            icon: Globe,
            title: "International Data Transfer",
            points: [
              "Your data may be stored on Google Cloud servers in different locations",
              "We ensure the same level of protection in all locations",
              "Compliance with international data protection laws",
            ],
          },
          {
            icon: Bell,
            title: "Changes to Privacy Policy",
            points: [
              "We reserve the right to update this policy",
              "We will notify you of significant changes via the app",
              "Last updated: November 2025",
              "Regular policy review recommended",
            ],
          },
        ],
        contact: {
          title: "Contact Us",
          subtitle: "Contact Information:",
          email: "info@namothajia.com",
          phone: "+962 6 412 2002",
          address: "Airport Road / Prince Ali District - Amman - Jordan",
          hours: "Working Hours: Sunday - Thursday (8 AM - 3 PM)",
          privacyInquiries: "For Privacy-Specific Inquiries:",
          privacyPoints: [
            "We respond to all inquiries within 48 hours",
            "We provide support in Arabic and English",
            "All communications are confidential and encrypted",
          ],
        },
      },
    }),
    [],
  )

  const data = useMemo(() => (language === "ar" ? content.ar : content.en), [language, content])

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="w-full bg-gradient-to-br from-blue-600 via-purple-600 to-violet-600 text-white py-24 px-8 mb-12 shadow-2xl">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center">{data.title}</h1>
            <p className="text-xl md:text-2xl opacity-95 text-center">
              {language === "ar" ? "آخر تحديث: 10 نوفمبر 2025" : "Last Updated: November 10, 2025"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16 max-w-7xl">
          {/* Content */}
          <div className="space-y-6">
            {data.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    {section.icon && <section.icon className="w-7 h-7 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{section.title}</h2>
                    {section.content && <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>}
                  </div>
                </div>

                <div className={language === "ar" ? "pr-20" : "pl-20"}>
                  {/* Subsections */}
                  {section.subsections && (
                    <div className="space-y-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex}>
                          <h3 className="font-semibold text-gray-900 mb-2">{subsection.subtitle}</h3>
                          <ul className="space-y-2">
                            {subsection.points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Simple Points */}
                  {section.points && (
                    <ul className="space-y-2">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-500 mt-1.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Highlights (for advertising section) */}
                  {section.highlights && (
                    <div className="space-y-2">
                      {section.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-start gap-2">
                          {highlight.type === "negative" ? (
                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-gray-700">{highlight.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rights (for user rights section) */}
                  {section.rights && (
                    <div className="space-y-4">
                      {section.rights.map((right, rIndex) => (
                        <div key={rIndex}>
                          <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                          <ul className="space-y-2">
                            {right.points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {section.exercise && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-2">{section.exercise.subtitle}</h3>
                          <ul className="space-y-2">
                            {section.exercise.points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-br from-blue-600 via-purple-600 to-violet-600 text-white rounded-2xl p-10 shadow-2xl">
            <h2 className="text-4xl font-bold mb-6 text-center">{data.contact.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold mb-4">{data.contact.subtitle}</h3>
                <p className="text-lg flex items-center gap-3">
                  <span className="font-semibold">{language === "ar" ? "البريد الإلكتروني:" : "Email:"}</span>
                  <a href={`mailto:${data.contact.email}`} className="hover:underline">
                    {data.contact.email}
                  </a>
                </p>
                <p className="text-lg flex items-center gap-3">
                  <span className="font-semibold">{language === "ar" ? "الهاتف:" : "Phone:"}</span>
                  <a href={`tel:${data.contact.phone}`} className="hover:underline">
                    {data.contact.phone}
                  </a>
                </p>
                <p className="text-lg">
                  <span className="font-semibold">{language === "ar" ? "العنوان:" : "Address:"}</span>{" "}
                  {data.contact.address}
                </p>
                <p className="text-lg">{data.contact.hours}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold mb-4">{data.contact.privacyInquiries}</h3>
                <ul className="space-y-3">
                  {data.contact.privacyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-lg">
                      <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
