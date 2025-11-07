"use client"

import { useLanguage } from "@/lib/language-context"
import { FileText, CheckCircle, AlertCircle, Scale, Shield, Mail, Phone } from "lucide-react"

export default function TermsPage() {
  const { language } = useLanguage()

  const content = {
    ar: {
      title: "الشروط والأحكام",
      subtitle: "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا",
      lastUpdated: "آخر تحديث: يناير 2025",
      sections: [
        {
          icon: FileText,
          title: "قبول الشروط",
          content: `باستخدامك لخدمات المدرسة النموذجية للتربية الخاصة، فإنك توافق على الالتزام بهذه الشروط والأحكام:

• هذه الشروط تشكل اتفاقية ملزمة قانونياً بينك وبين المدرسة
• إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا
• نحتفظ بالحق في تعديل هذه الشروط في أي وقت
• استمرارك في استخدام الخدمات يعني موافقتك على الشروط المحدثة`,
        },
        {
          icon: CheckCircle,
          title: "الخدمات المقدمة",
          content: `نقدم مجموعة شاملة من الخدمات التعليمية والتأهيلية:

• برامج تعليمية متخصصة لذوي الإعاقة
• خدمات العلاج الطبيعي والوظيفي
• خدمات النطق واللغة
• الإرشاد النفسي والاجتماعي
• برامج التأهيل المهني
• خدمات الإقامة الداخلية`,
        },
        {
          icon: AlertCircle,
          title: "مسؤوليات المستخدم",
          content: `عند استخدام خدماتنا، فإنك توافق على:

• تقديم معلومات دقيقة وصحيحة
• الالتزام بسياسات وإجراءات المدرسة
• احترام حقوق الآخرين وخصوصيتهم
• عدم إساءة استخدام الخدمات أو المرافق
• دفع الرسوم المستحقة في الوقت المحدد
• الإبلاغ عن أي مشاكل أو مخاوف فوراً`,
        },
        {
          icon: Scale,
          title: "الرسوم والدفع",
          content: `شروط الرسوم والدفع:

• يتم تحديد الرسوم بناءً على نوع الخدمة والبرنامج
• يجب دفع الرسوم في المواعيد المحددة
• قد تطبق رسوم إضافية على الخدمات الخاصة
• سياسة الاسترداد تخضع لشروط محددة
• نحتفظ بالحق في تعديل الرسوم مع إشعار مسبق`,
        },
        {
          icon: Shield,
          title: "حدود المسؤولية",
          content: `نلتزم بتقديم أفضل الخدمات، ولكن:

• لا نضمن نتائج محددة للبرامج التعليمية
• لا نتحمل المسؤولية عن الأضرار غير المباشرة
• مسؤوليتنا محدودة بقيمة الخدمات المدفوعة
• نحتفظ بالحق في تعليق الخدمات في حالات معينة
• نلتزم بمعايير ISO 9001:2015 في جميع خدماتنا`,
        },
        {
          icon: FileText,
          title: "الملكية الفكرية",
          content: `جميع المحتويات والمواد محمية بحقوق الملكية الفكرية:

• المواد التعليمية والبرامج ملك للمدرسة
• لا يجوز نسخ أو توزيع المواد دون إذن
• الشعارات والعلامات التجارية محمية قانونياً
• يحظر استخدام محتوى الموقع لأغراض تجارية
• نحتفظ بجميع الحقوق غير الممنوحة صراحة`,
        },
      ],
      contact: {
        title: "تواصل معنا",
        description: "إذا كان لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا:",
        email: "info@namothajia.com",
        phone: "4122002 / 4122003",
        address: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
      },
    },
    en: {
      title: "Terms & Conditions",
      subtitle: "Please read these terms and conditions carefully before using our services",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          icon: FileText,
          title: "Acceptance of Terms",
          content: `By using the services of Al-Namothajia School for Special Education, you agree to comply with these terms and conditions:

• These terms constitute a legally binding agreement between you and the school
• If you do not agree to any of these terms, please do not use our services
• We reserve the right to modify these terms at any time
• Your continued use of the services means your acceptance of the updated terms`,
        },
        {
          icon: CheckCircle,
          title: "Services Provided",
          content: `We provide a comprehensive range of educational and rehabilitation services:

• Specialized educational programs for people with disabilities
• Physical and occupational therapy services
• Speech and language services
• Psychological and social counseling
• Vocational rehabilitation programs
• Residential services`,
        },
        {
          icon: AlertCircle,
          title: "User Responsibilities",
          content: `When using our services, you agree to:

• Provide accurate and correct information
• Comply with school policies and procedures
• Respect the rights and privacy of others
• Not misuse services or facilities
• Pay fees on time
• Report any problems or concerns immediately`,
        },
        {
          icon: Scale,
          title: "Fees and Payment",
          content: `Terms of fees and payment:

• Fees are determined based on the type of service and program
• Fees must be paid on the specified dates
• Additional fees may apply for special services
• Refund policy is subject to specific conditions
• We reserve the right to modify fees with prior notice`,
        },
        {
          icon: Shield,
          title: "Limitation of Liability",
          content: `We are committed to providing the best services, but:

• We do not guarantee specific results for educational programs
• We are not responsible for indirect damages
• Our liability is limited to the value of paid services
• We reserve the right to suspend services in certain cases
• We comply with ISO 9001:2015 standards in all our services`,
        },
        {
          icon: FileText,
          title: "Intellectual Property",
          content: `All content and materials are protected by intellectual property rights:

• Educational materials and programs are owned by the school
• Materials may not be copied or distributed without permission
• Logos and trademarks are legally protected
• Use of website content for commercial purposes is prohibited
• We reserve all rights not expressly granted`,
        },
      ],
      contact: {
        title: "Contact Us",
        description: "If you have any questions about the terms and conditions, please contact us:",
        email: "info@namothajia.com",
        phone: "4122002 / 4122003",
        address: "Amman - Airport Road - Prince Ali District, Jordan",
      },
    },
  }

  const data = language === "ar" ? content.ar : content.en

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="w-20 h-20 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.title}</h1>
            <p className="text-xl text-purple-100 mb-4">{data.subtitle}</p>
            <p className="text-sm text-purple-200">{data.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {data.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-16">{section.content}</div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{data.contact.title}</h2>
              <p className="mb-6 text-purple-100">{data.contact.description}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${data.contact.email}`} className="hover:text-purple-200 transition-colors">
                    {data.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>{data.contact.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>{data.contact.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
