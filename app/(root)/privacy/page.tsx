"use client"

import { useLanguage } from "@/lib/language-context"
import { Shield, Lock, Eye, FileText, Mail, Phone } from "lucide-react"

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    ar: {
      title: "سياسة الخصوصية",
      subtitle: "نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية",
      lastUpdated: "آخر تحديث: يناير 2025",
      sections: [
        {
          icon: Shield,
          title: "المعلومات التي نجمعها",
          content: `نقوم بجمع المعلومات التالية عند استخدامك لخدماتنا:
          
• المعلومات الشخصية: الاسم، العنوان، رقم الهاتف، البريد الإلكتروني
• معلومات الطالب: تاريخ الميلاد، الرقم الوطني، المعلومات الطبية ذات الصلة
• معلومات التوظيف: السيرة الذاتية، المؤهلات، الخبرات السابقة
• معلومات الاستخدام: كيفية تفاعلك مع موقعنا الإلكتروني وخدماتنا`,
        },
        {
          icon: Lock,
          title: "كيف نستخدم معلوماتك",
          content: `نستخدم المعلومات التي نجمعها للأغراض التالية:

• تقديم الخدمات التعليمية والتأهيلية
• التواصل معك بخصوص الخدمات والبرامج
• معالجة طلبات التوظيف والخدمات
• تحسين جودة خدماتنا وتطوير برامجنا
• الامتثال للمتطلبات القانونية والتنظيمية`,
        },
        {
          icon: Eye,
          title: "حماية البيانات",
          content: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:

• تشفير البيانات أثناء النقل والتخزين
• الوصول المحدود للموظفين المصرح لهم فقط
• مراجعات أمنية منتظمة وتحديثات للأنظمة
• الامتثال لمعايير ISO 9001:2015
• نسخ احتياطية منتظمة للبيانات`,
        },
        {
          icon: FileText,
          title: "مشاركة المعلومات",
          content: `لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:

• بموافقتك الصريحة
• عند الضرورة لتقديم الخدمات المطلوبة
• للامتثال للقوانين والأنظمة
• لحماية حقوقنا وسلامة الآخرين
• مع مقدمي الخدمات الموثوقين الذين يلتزمون بحماية البيانات`,
        },
        {
          icon: Mail,
          title: "حقوقك",
          content: `لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:

• الوصول إلى معلوماتك الشخصية
• تصحيح المعلومات غير الدقيقة
• طلب حذف معلوماتك
• الاعتراض على معالجة معلوماتك
• طلب نقل بياناتك
• سحب موافقتك في أي وقت`,
        },
      ],
      contact: {
        title: "تواصل معنا",
        description: "إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا:",
        email: "info@namothajia.com",
        phone: "4122002 / 4122003",
        address: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
      },
    },
    en: {
      title: "Privacy Policy",
      subtitle: "We respect your privacy and are committed to protecting your personal data",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          icon: Shield,
          title: "Information We Collect",
          content: `We collect the following information when you use our services:

• Personal Information: Name, address, phone number, email
• Student Information: Date of birth, national ID, relevant medical information
• Employment Information: Resume, qualifications, previous experience
• Usage Information: How you interact with our website and services`,
        },
        {
          icon: Lock,
          title: "How We Use Your Information",
          content: `We use the information we collect for the following purposes:

• Providing educational and rehabilitation services
• Communicating with you about services and programs
• Processing employment and service requests
• Improving the quality of our services and developing our programs
• Complying with legal and regulatory requirements`,
        },
        {
          icon: Eye,
          title: "Data Protection",
          content: `We take strict security measures to protect your information:

• Data encryption during transmission and storage
• Limited access to authorized personnel only
• Regular security reviews and system updates
• Compliance with ISO 9001:2015 standards
• Regular data backups`,
        },
        {
          icon: FileText,
          title: "Information Sharing",
          content: `We do not share your personal information with third parties except in the following cases:

• With your explicit consent
• When necessary to provide requested services
• To comply with laws and regulations
• To protect our rights and the safety of others
• With trusted service providers who commit to data protection`,
        },
        {
          icon: Mail,
          title: "Your Rights",
          content: `You have the following rights regarding your personal information:

• Access your personal information
• Correct inaccurate information
• Request deletion of your information
• Object to processing of your information
• Request data portability
• Withdraw your consent at any time`,
        },
      ],
      contact: {
        title: "Contact Us",
        description: "If you have any questions about our privacy policy, please contact us:",
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
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
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
            <Shield className="w-20 h-20 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.title}</h1>
            <p className="text-xl text-blue-100 mb-4">{data.subtitle}</p>
            <p className="text-sm text-blue-200">{data.lastUpdated}</p>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-16">{section.content}</div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{data.contact.title}</h2>
              <p className="mb-6 text-blue-100">{data.contact.description}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${data.contact.email}`} className="hover:text-blue-200 transition-colors">
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
