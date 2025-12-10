"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createPage } from "@/lib/storage"
import { FileText, Download, CheckCircle, Shield, Scale, Home } from "lucide-react"

export default function ImportTemplatePage() {
  const [importing, setImporting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<"home" | "privacy" | "terms">("home")
  const router = useRouter()

  const homePageTemplate = {
    title: "Home Page Template",
    titleEn: "Home Page Template",
    slug: "home-template",
    language: "ar" as const,
    status: "draft" as const,
    blocks: [
      {
        id: `block_${Date.now()}_1`,
        type: "hero" as const,
        content: {
          slides: [
            {
              titleAr: "مرحباً بكم في مدرستنا",
              titleEn: "Welcome to Our School",
              subtitleAr: "نحن نقدم أفضل التجارب التعليمية",
              subtitleEn: "We Provide the Best Educational Experiences",
              descriptionAr: "تميز أكاديمي وبيئة تعليمية محفزة لبناء مستقبل أفضل لأبنائنا",
              descriptionEn:
                "Academic excellence and a stimulating educational environment to build a better future for our children",
              image: "/school-building-exterior.png",
              cta: { textAr: "اكتشف المزيد", textEn: "Discover More", link: "/about" },
              badge: "Welcome",
            },
            {
              titleAr: "التميز الأكاديمي",
              titleEn: "Academic Excellence",
              subtitleAr: "برامج تعليمية متقدمة",
              subtitleEn: "Advanced Educational Programs",
              descriptionAr: "مناهج حديثة ومتطورة تواكب أحدث المعايير العالمية",
              descriptionEn: "Modern curricula that keep pace with the latest international standards",
              image: "/diverse-students-classroom.png",
              cta: { textAr: "تعرف على البرامج", textEn: "Learn More", link: "/programs" },
              badge: "Excellence",
            },
            {
              titleAr: "بيئة تعليمية حديثة",
              titleEn: "Modern Learning Environment",
              subtitleAr: "مرافق متطورة وتقنيات حديثة",
              subtitleEn: "Advanced Facilities and Modern Technologies",
              descriptionAr: "مختبرات حديثة ومرافق تعليمية متكاملة لتجربة تعليمية فريدة",
              descriptionEn:
                "Modern laboratories and integrated educational facilities for a unique learning experience",
              image: "/modern-school-facilities.png",
              cta: { textAr: "جولة افتراضية", textEn: "Virtual Tour", link: "/tour" },
              badge: "Modern",
            },
          ],
        },
        styles: {
          animation: "fade-in",
          animationDelay: 0,
          animationDuration: 1000,
          backgroundColor: "transparent",
          textColor: "white",
          padding: "p-0",
          margin: "m-0",
        },
        order: 0,
      },

      {
        id: `block_${Date.now()}_2`,
        type: "text" as const,
        content: {
          titleAr: "من نحن",
          titleEn: "About Us",
          textAr:
            "نحن مؤسسة تعليمية رائدة نسعى لتقديم أفضل الخدمات التعليمية لأبنائنا الطلاب. نؤمن بأن التعليم هو المفتاح لبناء مستقبل أفضل.",
          textEn:
            "We are a leading educational institution striving to provide the best educational services to our students. We believe that education is the key to building a better future.",
          badge: "About Us",
          features: [
            {
              titleAr: "تعليم متميز",
              titleEn: "Distinguished Education",
              descriptionAr: "منهج تعليمي حديث ومتطور يواكب أحدث المعايير العالمية",
              descriptionEn: "Modern and advanced curriculum that keeps pace with the latest international standards",
              icon: "🎯",
              iconColor: "from-blue-500 to-cyan-500",
              iconBg: "from-blue-500/20 to-cyan-500/20",
            },
            {
              titleAr: "معلمون مؤهلون",
              titleEn: "Qualified Teachers",
              descriptionAr: "كادر تعليمي على أعلى مستوى من الخبرة والكفاءة",
              descriptionEn: "Teaching staff at the highest level of experience and competence",
              icon: "❤️",
              iconColor: "from-pink-500 to-rose-500",
              iconBg: "from-pink-500/20 to-rose-500/20",
            },
            {
              titleAr: "مرافق حديثة",
              titleEn: "Modern Facilities",
              descriptionAr: "بنية تحتية متطورة ومجهزة بأحدث التقنيات",
              descriptionEn: "Advanced infrastructure equipped with the latest technologies",
              icon: "🏆",
              iconColor: "from-amber-500 to-orange-500",
              iconBg: "from-amber-500/20 to-orange-500/20",
            },
            {
              titleAr: "أنشطة متنوعة",
              titleEn: "Diverse Activities",
              descriptionAr: "برامج لا صفية شاملة لتنمية مهارات الطلاب",
              descriptionEn: "Comprehensive extracurricular programs to develop students' skills",
              icon: "👥",
              iconColor: "from-purple-500 to-violet-500",
              iconBg: "from-purple-500/20 to-violet-500/20",
            },
          ],
        },
        styles: {
          animation: "fade-in-up",
          animationDelay: 200,
          animationDuration: 800,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-primary/5",
          gradientVia: "via-accent/5",
          gradientTo: "to-secondary/5",
          textColor: "text-foreground",
          padding: "p-16",
          margin: "m-0",
        },
        order: 1,
      },

      {
        id: `block_${Date.now()}_3`,
        type: "cards" as const,
        content: {
          titleAr: "الأقسام",
          titleEn: "Departments",
          subtitleAr: "اكتشف أقسامنا المتميزة",
          subtitleEn: "Discover Our Distinguished Departments",
          columns: 3,
          cards: [
            {
              titleAr: "القسم الطبي",
              titleEn: "Medical Department",
              descriptionAr: "برامج تعليمية في المجال الطبي والعلوم الصحية مع مختبرات متطورة",
              descriptionEn: "Educational programs in the medical field and health sciences with advanced laboratories",
              image: "/medical-department.jpg",
              link: "/departments/medical",
              category: "Specialized",
              categoryAr: "متخصص",
              icon: "🏥",
              gradient: "from-rose-500/20 via-pink-500/20 to-red-500/20",
              iconGradient: "from-rose-500 to-pink-600",
              shadowColor: "shadow-rose-500/50",
              borderColor: "border-rose-500/30 hover:border-rose-500",
            },
            {
              titleAr: "القسم العلمي",
              titleEn: "Science Department",
              descriptionAr: "برامج متقدمة في العلوم والتكنولوجيا مع معامل حديثة",
              descriptionEn: "Advanced programs in science and technology with modern laboratories",
              image: "/science-laboratory.png",
              link: "/departments/science",
              category: "Advanced",
              categoryAr: "متقدم",
              icon: "🔬",
              gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
              iconGradient: "from-blue-500 to-cyan-600",
              shadowColor: "shadow-blue-500/50",
              borderColor: "border-blue-500/30 hover:border-blue-500",
            },
            {
              titleAr: "القسم التجريبي",
              titleEn: "Experimental Department",
              descriptionAr: "برامج تجريبية ومبتكرة للطلاب المتميزين",
              descriptionEn: "Experimental and innovative programs for distinguished students",
              image: "/experimental-lab.jpg",
              link: "/departments/experimental",
              category: "Innovation",
              categoryAr: "ابتكار",
              icon: "🧪",
              gradient: "from-purple-500/20 via-violet-500/20 to-fuchsia-500/20",
              iconGradient: "from-purple-500 to-violet-600",
              shadowColor: "shadow-purple-500/50",
              borderColor: "border-purple-500/30 hover:border-purple-500",
            },
          ],
        },
        styles: {
          animation: "fade-in-up",
          animationDelay: 200,
          animationDuration: 1000,
          backgroundColor: "bg-background",
          textColor: "text-foreground",
          padding: "p-16",
          margin: "m-0",
          hoverScale: "hover:scale-105",
          hoverShadow: "hover:shadow-2xl",
          hoverTranslate: "hover:-translate-y-3",
        },
        order: 2,
      },

      {
        id: `block_${Date.now()}_4`,
        type: "gallery" as const,
        content: {
          titleAr: "معرض الصور",
          titleEn: "Photo Gallery",
          subtitleAr: "استكشف مرافقنا التعليمية",
          subtitleEn: "Explore Our Educational Facilities",
          columns: 3,
          images: [
            {
              url: "/vibrant-school-campus.png",
              alt: "الحرم المدرسي",
              titleAr: "الحرم المدرسي",
              titleEn: "School Campus",
              descriptionAr: "حرم مدرسي واسع ومجهز",
              descriptionEn: "Spacious and equipped school campus",
              category: "Campus",
              categoryAr: "الحرم",
            },
            {
              url: "/diverse-students-studying.png",
              alt: "طلاب يدرسون",
              titleAr: "طلاب يدرسون",
              titleEn: "Students Studying",
              descriptionAr: "بيئة تعليمية محفزة",
              descriptionEn: "Stimulating learning environment",
              category: "Students",
              categoryAr: "الطلاب",
            },
            {
              url: "/science-lab.png",
              alt: "مختبر العلوم",
              titleAr: "مختبر العلوم",
              titleEn: "Science Laboratory",
              descriptionAr: "معامل مجهزة بأحدث التقنيات",
              descriptionEn: "Laboratories equipped with the latest technologies",
              category: "Labs",
              categoryAr: "المختبرات",
            },
            {
              url: "/generic-sports-field.png",
              alt: "الملاعب الرياضية",
              titleAr: "الملاعب الرياضية",
              titleEn: "Sports Fields",
              descriptionAr: "ملاعب متنوعة للأنشطة",
              descriptionEn: "Various fields for activities",
              category: "Sports",
              categoryAr: "الرياضة",
            },
            {
              url: "/grand-library.png",
              alt: "المكتبة",
              titleAr: "المكتبة",
              titleEn: "Library",
              descriptionAr: "مكتبة غنية بالمراجع",
              descriptionEn: "Library rich with references",
              category: "Library",
              categoryAr: "المكتبة",
            },
            {
              url: "/classroom-technology.jpg",
              alt: "التقنية في الصف",
              titleAr: "التقنية في الصف",
              titleEn: "Classroom Technology",
              descriptionAr: "صفوف ذكية متطورة",
              descriptionEn: "Advanced smart classrooms",
              category: "Technology",
              categoryAr: "التقنية",
            },
          ],
        },
        styles: {
          animation: "fade-in",
          animationDelay: 300,
          animationDuration: 1000,
          backgroundColor: "bg-gradient-to-b",
          gradientFrom: "from-background",
          gradientVia: "via-muted/20",
          gradientTo: "to-background",
          textColor: "text-foreground",
          padding: "p-16",
          margin: "m-0",
          hoverScale: "hover:scale-110",
          hoverShadow: "hover:shadow-2xl",
        },
        order: 3,
      },

      {
        id: `block_${Date.now()}_5`,
        type: "testimonials" as const,
        content: {
          titleAr: "آراء أولياء الأمور",
          titleEn: "Parent Reviews",
          subtitleAr: "ماذا يقول عملاؤنا",
          subtitleEn: "What Our Clients Say",
          testimonials: [
            {
              nameAr: "أحمد محمد",
              nameEn: "Ahmed Mohammed",
              roleAr: "ولي أمر",
              roleEn: "Parent",
              commentAr: "مدرسة رائعة بكل المقاييس. أبنائي سعداء جداً بالتعليم والمعاملة الطيبة.",
              commentEn:
                "A wonderful school in every way. My children are very happy with the education and good treatment.",
              rating: 5,
              image: "/parent-testimonial-man.jpg",
            },
            {
              nameAr: "فاطمة أحمد",
              nameEn: "Fatima Ahmed",
              roleAr: "ولي أمر",
              roleEn: "Parent",
              commentAr: "تطور ملحوظ في مستوى ابنتي الدراسي. شكراً للكادر التعليمي المتميز.",
              commentEn:
                "Noticeable improvement in my daughter's academic level. Thanks to the distinguished teaching staff.",
              rating: 5,
              image: "/parent-testimonial-woman.jpg",
            },
            {
              nameAr: "محمد علي",
              nameEn: "Mohammed Ali",
              roleAr: "ولي أمر",
              roleEn: "Parent",
              commentAr: "المرافق ممتازة والأنشطة متنوعة. بيئة مثالية لتنمية مهارات الأطفال.",
              commentEn:
                "Excellent facilities and diverse activities. An ideal environment for developing children's skills.",
              rating: 5,
              image: "/parent-testimonial-man-2.jpg",
            },
          ],
        },
        styles: {
          animation: "slide-up",
          animationDelay: 200,
          animationDuration: 800,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-primary/5",
          gradientVia: "via-accent/5",
          gradientTo: "to-secondary/5",
          textColor: "text-foreground",
          padding: "p-24",
          margin: "m-0",
          hoverScale: "hover:scale-105",
          hoverTranslate: "hover:-translate-y-2",
          hoverShadow: "hover:shadow-2xl",
        },
        order: 4,
      },

      {
        id: `block_${Date.now()}_6`,
        type: "cta" as const,
        content: {
          icon: "📧",
          titleAr: "انضم إلى فريقنا",
          titleEn: "Join Our Team",
          descriptionAr: "نبحث عن معلمين وموظفين متميزين للانضمام إلى عائلتنا التعليمية",
          descriptionEn: "We are looking for distinguished teachers and staff to join our educational family",
          primaryButton: { textAr: "التقدم للوظائف", textEn: "Apply for Jobs", link: "/jobs/employment" },
          secondaryButton: { textAr: "طلب خدمة", textEn: "Request Service", link: "/jobs/service-request" },
        },
        styles: {
          animation: "fade-in",
          animationDelay: 300,
          animationDuration: 1000,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-primary/10",
          gradientVia: "via-accent/5",
          gradientTo: "to-primary/5",
          textColor: "text-foreground",
          padding: "p-20",
          margin: "m-0",
          shadow: "shadow-2xl",
        },
        order: 5,
      },

      {
        id: `block_${Date.now()}_7`,
        type: "contact" as const,
        content: {
          badge: "Get In Touch",
          titleAr: "اتصل بنا",
          titleEn: "Contact Us",
          descriptionAr: "نسعد بالرد على استفساراتكم",
          descriptionEn: "We are happy to answer your inquiries",
          fields: [
            { name: "name", labelAr: "الاسم", labelEn: "Name", type: "text" as const, required: true },
            { name: "email", labelAr: "البريد الإلكتروني", labelEn: "Email", type: "email" as const, required: true },
            { name: "phone", labelAr: "رقم الهاتف", labelEn: "Phone", type: "text" as const, required: false },
            { name: "message", labelAr: "الرسالة", labelEn: "Message", type: "textarea" as const, required: true },
          ],
          submitTextAr: "إرسال",
          submitTextEn: "Send",
          contactInfo: {
            phone: "+962 6 4122002",
            phone2: "+962 6 4122003",
            email: "info@namothajia.com",
            addressAr: "عمان - طريق المطار - ضاحية الأمير علي",
            addressEn: "Amman - Airport Road - Prince Ali District",
            workingHoursAr: "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً",
            workingHoursEn: "Sunday - Thursday: 7:00 AM - 3:00 PM",
          },
        },
        styles: {
          animation: "slide-up",
          animationDelay: 200,
          animationDuration: 800,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-background",
          gradientVia: "via-muted/20",
          gradientTo: "to-background",
          textColor: "text-foreground",
          padding: "p-16",
          margin: "m-0",
        },
        order: 6,
      },
    ],
  }

  const privacyPageTemplate = {
    title: "Privacy Policy",
    titleEn: "Privacy Policy",
    slug: "privacy-policy",
    language: "ar" as const,
    status: "draft" as const,
    blocks: [
      {
        id: `block_${Date.now()}_1`,
        type: "hero" as const,
        content: {
          slides: [
            {
              titleAr: "سياسة الخصوصية",
              titleEn: "Privacy Policy",
              subtitleAr: "نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية",
              subtitleEn: "We respect your privacy and are committed to protecting your personal data",
              descriptionAr: "آخر تحديث: يناير 2025",
              descriptionEn: "Last Updated: January 2025",
              image: "/privacy-security-shield.jpg",
              badge: "Privacy",
            },
          ],
        },
        styles: {
          animation: "fade-in",
          animationDelay: 0,
          animationDuration: 1000,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-blue-600",
          gradientVia: "via-purple-600",
          gradientTo: "to-pink-600",
          textColor: "text-white",
          padding: "p-20",
          margin: "m-0",
        },
        order: 0,
      },
      {
        id: `block_${Date.now()}_2`,
        type: "cards" as const,
        content: {
          titleAr: "",
          titleEn: "",
          columns: 1,
          cards: [
            {
              titleAr: "المعلومات التي نجمعها",
              titleEn: "Information We Collect",
              descriptionAr: `نقوم بجمع المعلومات التالية عند استخدامك لخدماتنا:

• المعلومات الشخصية: الاسم، العنوان، رقم الهاتف، البريد الإلكتروني
• معلومات الطالب: تاريخ الميلاد، الرقم الوطني، المعلومات الطبية ذات الصلة
• معلومات التوظيف: السيرة الذاتية، المؤهلات، الخبرات السابقة
• معلومات الاستخدام: كيفية تفاعلك مع موقعنا الإلكتروني وخدماتنا`,
              descriptionEn: `We collect the following information when you use our services:

• Personal Information: Name, address, phone number, email
• Student Information: Date of birth, national ID, relevant medical information
• Employment Information: Resume, qualifications, previous experience
• Usage Information: How you interact with our website and services`,
              icon: "🛡️",
              gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
              iconGradient: "from-blue-500 to-cyan-600",
            },
            {
              titleAr: "كيف نستخدم معلوماتك",
              titleEn: "How We Use Your Information",
              descriptionAr: `نستخدم المعلومات التي نجمعها للأغراض التالية:

• تقديم الخدمات التعليمية والتأهيلية
• التواصل معك بخصوص الخدمات والبرامج
• معالجة طلبات التوظيف والخدمات
• تحسين جودة خدماتنا وتطوير برامجنا
• الامتثال للمتطلبات القانونية والتنظيمية`,
              descriptionEn: `We use the information we collect for the following purposes:

• Providing educational and rehabilitation services
• Communicating with you about services and programs
• Processing employment and service requests
• Improving the quality of our services and developing our programs
• Complying with legal and regulatory requirements`,
              icon: "🔒",
              gradient: "from-purple-500/20 via-violet-500/20 to-fuchsia-500/20",
              iconGradient: "from-purple-500 to-violet-600",
            },
            {
              titleAr: "حماية البيانات",
              titleEn: "Data Protection",
              descriptionAr: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:

• تشفير البيانات أثناء النقل والتخزين
• الوصول المحدود للموظفين المصرح لهم فقط
• مراجعات أمنية منتظمة وتحديثات للأنظمة
• الامتثال لمعايير ISO 9001:2015
• نسخ احتياطية منتظمة للبيانات`,
              descriptionEn: `We take strict security measures to protect your information:

• Data encryption during transmission and storage
• Limited access to authorized personnel only
• Regular security reviews and system updates
• Compliance with ISO 9001:2015 standards
• Regular data backups`,
              icon: "👁️",
              gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
              iconGradient: "from-green-500 to-emerald-600",
            },
          ],
        },
        styles: {
          animation: "fade-in-up",
          animationDelay: 200,
          animationDuration: 800,
          backgroundColor: "bg-background",
          textColor: "text-foreground",
          padding: "p-16",
          margin: "m-0",
        },
        order: 1,
      },
      {
        id: `block_${Date.now()}_3`,
        type: "contact" as const,
        content: {
          badge: "Contact",
          titleAr: "تواصل معنا",
          titleEn: "Contact Us",
          descriptionAr: "إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا",
          descriptionEn: "If you have any questions about our privacy policy, please contact us",
          contactInfo: {
            phone: "+962 6 4122002",
            phone2: "+962 6 4122003",
            email: "info@namothajia.com",
            addressAr: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
            addressEn: "Amman - Airport Road - Prince Ali District, Jordan",
          },
        },
        styles: {
          animation: "slide-up",
          animationDelay: 300,
          animationDuration: 800,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-blue-600",
          gradientTo: "to-purple-600",
          textColor: "text-white",
          padding: "p-16",
          margin: "m-0",
        },
        order: 2,
      },
    ],
  }

  const termsPageTemplate = {
    title: "Terms & Conditions",
    titleEn: "Terms & Conditions",
    slug: "terms-conditions",
    language: "ar" as const,
    status: "draft" as const,
    blocks: [
      {
        id: `block_${Date.now()}_1`,
        type: "hero" as const,
        content: {
          slides: [
            {
              titleAr: "الشروط والأحكام",
              titleEn: "Terms & Conditions",
              subtitleAr: "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا",
              subtitleEn: "Please read these terms and conditions carefully before using our services",
              descriptionAr: "آخر تحديث: يناير 2025",
              descriptionEn: "Last Updated: January 2025",
              image: "/legal-documents-terms.jpg",
              badge: "Terms",
            },
          ],
        },
        styles: {
          animation: "fade-in",
          animationDelay: 0,
          animationDuration: 1000,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-purple-600",
          gradientVia: "via-pink-600",
          gradientTo: "to-orange-600",
          textColor: "text-white",
          padding: "p-20",
          margin: "m-0",
        },
        order: 0,
      },
      {
        id: `block_${Date.now()}_2`,
        type: "cards" as const,
        content: {
          titleAr: "",
          titleEn: "",
          columns: 1,
          cards: [
            {
              titleAr: "قبول الشروط",
              titleEn: "Acceptance of Terms",
              descriptionAr: `باستخدامك لخدمات المدرسة النموذجية للتربية الخاصة، فإنك توافق على الالتزام بهذه الشروط والأحكام:

• هذه الشروط تشكل اتفاقية ملزمة قانونياً بينك وبين المدرسة
• إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا
• نحتفظ بالحق في تعديل هذه الشروط في أي وقت
• استمرارك في استخدام الخدمات يعني موافقتك على الشروط المحدثة`,
              descriptionEn: `By using the services of Al-Namothajia School for Special Education, you agree to comply with these terms and conditions:

• These terms constitute a legally binding agreement between you and the school
• If you do not agree to any of these terms, please do not use our services
• We reserve the right to modify these terms at any time
• Your continued use of the services means your acceptance of the updated terms`,
              icon: "📄",
              gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
              iconGradient: "from-purple-500 to-pink-600",
            },
            {
              titleAr: "الخدمات المقدمة",
              titleEn: "Services Provided",
              descriptionAr: `نقدم مجموعة شاملة من الخدمات التعليمية والتأهيلية:

• برامج تعليمية متخصصة لذوي الإعاقة
• خدمات العلاج الطبيعي والوظيفي
• خدمات النطق واللغة
• الإرشاد النفسي والاجتماعي
• برامج التأهيل المهني
• خدمات الإقامة الداخلية`,
              descriptionEn: `We provide a comprehensive range of educational and rehabilitation services:

• Specialized educational programs for people with disabilities
• Physical and occupational therapy services
• Speech and language services
• Psychological and social counseling
• Vocational rehabilitation programs
• Residential services`,
              icon: "✅",
              gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
              iconGradient: "from-green-500 to-emerald-600",
            },
            {
              titleAr: "مسؤوليات المستخدم",
              titleEn: "User Responsibilities",
              descriptionAr: `عند استخدام خدماتنا، فإنك توافق على:

• تقديم معلومات دقيقة وصحيحة
• الالتزام بسياسات وإجراءات المدرسة
• احترام حقوق الآخرين وخصوصيتهم
• عدم إساءة استخدام الخدمات أو المرافق
• دفع الرسوم المستحقة في الوقت المحدد
• الإبلاغ عن أي مشاكل أو مخاوف فوراً`,
              descriptionEn: `When using our services, you agree to:

• Provide accurate and correct information
• Comply with school policies and procedures
• Respect the rights and privacy of others
• Not misuse services or facilities
• Pay fees on time
• Report any problems or concerns immediately`,
              icon: "⚠️",
              gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
              iconGradient: "from-orange-500 to-amber-600",
            },
            {
              titleAr: "حدود المسؤولية",
              titleEn: "Limitation of Liability",
              descriptionAr: `نلتزم بتقديم أفضل الخدمات، ولكن:

• لا نضمن نتائج محددة للبرامج التعليمية
• لا نتحمل المسؤولية عن الأضرار غير المباشرة
• مسؤوليتنا محدودة بقيمة الخدمات المدفوعة
• نحتفظ بالحق في تعليق الخدمات في حالات معينة
• نلتزم بمعايير ISO 9001:2015 في جميع خدماتنا`,
              descriptionEn: `We are committed to providing the best services, but:

• We do not guarantee specific results for educational programs
• We are not responsible for indirect damages
• Our liability is limited to the value of paid services
• We reserve the right to suspend services in certain cases
• We comply with ISO 9001:2015 standards in all our services`,
              icon: "🛡️",
              gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
              iconGradient: "from-blue-500 to-indigo-600",
            },
          ],
        },
        styles: {
          animation: "fade-in-up",
          animationDelay: 200,
          animationDuration: 800,
          backgroundColor: "bg-background",
          textColor: "text-foreground",
          padding: "p-16",
          margin: "m-0",
        },
        order: 1,
      },
      {
        id: `block_${Date.now()}_3`,
        type: "contact" as const,
        content: {
          badge: "Contact",
          titleAr: "تواصل معنا",
          titleEn: "Contact Us",
          descriptionAr: "إذا كان لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا",
          descriptionEn: "If you have any questions about the terms and conditions, please contact us",
          contactInfo: {
            phone: "+962 6 4122002",
            phone2: "+962 6 4122003",
            email: "info@namothajia.com",
            addressAr: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
            addressEn: "Amman - Airport Road - Prince Ali District, Jordan",
          },
        },
        styles: {
          animation: "slide-up",
          animationDelay: 300,
          animationDuration: 800,
          backgroundColor: "bg-gradient-to-br",
          gradientFrom: "from-purple-600",
          gradientTo: "to-pink-600",
          textColor: "text-white",
          padding: "p-16",
          margin: "m-0",
        },
        order: 2,
      },
    ],
  }

  const handleImport = async () => {
    setImporting(true)
    setError("")
    setSuccess(false)

    try {
      const template =
        selectedTemplate === "home"
          ? homePageTemplate
          : selectedTemplate === "privacy"
            ? privacyPageTemplate
            : termsPageTemplate

      await createPage(template)
      setSuccess(true)

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import template")
    } finally {
      setImporting(false)
    }
  }

  const templates = {
    home: {
      icon: Home,
      title: "Home Page",
      description: "Complete home page with hero, about, departments, gallery, testimonials, and contact",
      color: "blue",
      sections: [
        "Hero Slider with 3 slides",
        "About Section with features",
        "Departments Cards with images",
        "Photo Gallery with 6 images",
        "Testimonials Section",
        "Jobs/Career CTA",
        "Contact Form",
      ],
    },
    privacy: {
      icon: Shield,
      title: "Privacy Policy",
      description: "Privacy policy page with sections covering data collection, usage, and protection",
      color: "purple",
      sections: [
        "Hero Section with gradient",
        "Information Collection section",
        "Data Usage section",
        "Data Protection measures",
        "Contact Information",
      ],
    },
    terms: {
      icon: Scale,
      title: "Terms & Conditions",
      description: "Terms and conditions page with legal sections and user responsibilities",
      color: "pink",
      sections: [
        "Hero Section with gradient",
        "Acceptance of Terms",
        "Services Provided",
        "User Responsibilities",
        "Limitation of Liability",
        "Contact Information",
      ],
    },
  }

  const currentTemplate = templates[selectedTemplate]
  const IconComponent = currentTemplate.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Import Page Templates
            </CardTitle>
            <CardDescription>
              Choose a template to import with pre-built sections, styles, and animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(templates).map(([key, template]) => {
                const Icon = template.icon
                const isSelected = selectedTemplate === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key as typeof selectedTemplate)}
                    className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <h3 className="font-semibold mb-1">{template.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                  </button>
                )
              })}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg">{currentTemplate.title}</h3>
                  <p className="text-sm text-blue-700">{currentTemplate.description}</p>
                </div>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Template Includes:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                {currentTemplate.sections.map((section, index) => (
                  <li key={index}>• {section}</li>
                ))}
              </ul>
            </div>

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Template imported successfully! Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleImport} disabled={importing || success} className="w-full" size="lg">
              <Download className="mr-2 h-5 w-5" />
              {importing ? "Importing..." : success ? "Imported!" : `Import ${currentTemplate.title}`}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              After importing, you can edit the template in the dashboard and customize it to your needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
