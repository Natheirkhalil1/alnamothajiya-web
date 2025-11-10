import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin (uses environment variables)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()

const homePageTemplate = {
  id: `page_${Date.now()}`,
  title: "Home Page Template",
  slug: "home-template",
  language: "ar",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [
    // Hero Slider Block
    {
      id: "block_1",
      type: "hero",
      content: {
        slides: [
          {
            title: "مرحباً بكم في مدرستنا",
            subtitle: "نحن نقدم أفضل التجارب التعليمية",
            image: "/school-building-exterior.png",
            cta: { text: "اكتشف المزيد", link: "/about" },
          },
          {
            title: "التميز الأكاديمي",
            subtitle: "برامج تعليمية متقدمة",
            image: "/diverse-students-classroom.png",
            cta: { text: "تعرف على البرامج", link: "/programs" },
          },
          {
            title: "بيئة تعليمية حديثة",
            subtitle: "مرافق متطورة وتقنيات حديثة",
            image: "/modern-school-facilities.png",
            cta: { text: "جولة افتراضية", link: "/tour" },
          },
        ],
      },
      styles: {
        animation: "fade-in",
        animationDelay: 0,
        animationDuration: 1000,
        backgroundColor: "transparent",
        textColor: "white",
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      order: 0,
    },

    // About Section Block
    {
      id: "block_2",
      type: "text",
      content: {
        title: "من نحن",
        text: "نحن مؤسسة تعليمية رائدة نسعى لتقديم أفضل الخدمات التعليمية لأبنائنا الطلاب. نؤمن بأن التعليم هو المفتاح لبناء مستقبل أفضل، ونعمل على توفير بيئة تعليمية محفزة وداعمة للإبداع والتميز.",
        alignment: "center",
      },
      styles: {
        animation: "slide-up",
        animationDelay: 200,
        animationDuration: 800,
        backgroundColor: "from-blue-50 to-white",
        backgroundType: "gradient",
        gradientDirection: "to-b",
        textColor: "gray-800",
        padding: { top: 80, right: 20, bottom: 80, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        shadow: "none",
      },
      order: 1,
    },

    // Features Cards Block
    {
      id: "block_3",
      type: "cards",
      content: {
        title: "مميزاتنا",
        cards: [
          {
            title: "تعليم متميز",
            description: "منهج تعليمي حديث ومتطور",
            icon: "📚",
            link: "",
          },
          {
            title: "معلمون مؤهلون",
            description: "كادر تعليمي على أعلى مستوى",
            icon: "👨‍🏫",
            link: "",
          },
          {
            title: "مرافق حديثة",
            description: "بنية تحتية متطورة",
            icon: "🏫",
            link: "",
          },
          {
            title: "أنشطة متنوعة",
            description: "برامج لا صفية شاملة",
            icon: "⚽",
            link: "",
          },
        ],
        columns: 4,
      },
      styles: {
        animation: "slide-up",
        animationDelay: 400,
        animationDuration: 800,
        backgroundColor: "white",
        textColor: "gray-800",
        padding: { top: 60, right: 20, bottom: 60, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        shadow: "none",
        hoverEffect: {
          scale: 1.05,
          shadow: "xl",
          translateY: -8,
        },
      },
      order: 2,
    },

    // Departments Section Block
    {
      id: "block_4",
      type: "cards",
      content: {
        title: "الأقسام",
        cards: [
          {
            title: "القسم الطبي",
            description: "برامج تعليمية في المجال الطبي والعلوم الصحية",
            image: "/medical-department.jpg",
            link: "/departments/medical",
          },
          {
            title: "القسم العلمي",
            description: "برامج متقدمة في العلوم والتكنولوجيا",
            image: "/science-laboratory.png",
            link: "/departments/science",
          },
          {
            title: "القسم التجريبي",
            description: "برامج تجريبية ومبتكرة للطلاب المتميزين",
            image: "/experimental-lab.jpg",
            link: "/departments/experimental",
          },
        ],
        columns: 3,
      },
      styles: {
        animation: "slide-up",
        animationDelay: 200,
        animationDuration: 1000,
        backgroundColor: "from-gray-50 to-blue-50",
        backgroundType: "gradient",
        gradientDirection: "to-br",
        textColor: "gray-800",
        padding: { top: 80, right: 20, bottom: 80, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 16,
        shadow: "lg",
        hoverEffect: {
          scale: 1.05,
          shadow: "2xl",
          translateY: -8,
        },
      },
      order: 3,
    },

    // Gallery Block
    {
      id: "block_5",
      type: "gallery",
      content: {
        title: "معرض الصور",
        images: [
          { url: "/vibrant-school-campus.png", alt: "الحرم المدرسي" },
          { url: "/diverse-students-studying.png", alt: "طلاب يدرسون" },
          { url: "/science-lab.png", alt: "مختبر العلوم" },
          { url: "/generic-sports-field.png", alt: "الملاعب الرياضية" },
          { url: "/grand-library.png", alt: "المكتبة" },
          { url: "/classroom-technology.jpg", alt: "التقنية في الصف" },
        ],
        columns: 3,
      },
      styles: {
        animation: "fade-in",
        animationDelay: 300,
        animationDuration: 1000,
        backgroundColor: "white",
        textColor: "gray-800",
        padding: { top: 80, right: 20, bottom: 80, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        shadow: "none",
        hoverEffect: {
          scale: 1.1,
          shadow: "2xl",
        },
      },
      order: 4,
    },

    // Testimonials Block
    {
      id: "block_6",
      type: "testimonials",
      content: {
        title: "آراء أولياء الأمور",
        testimonials: [
          {
            name: "أحمد محمد",
            role: "ولي أمر",
            content: "مدرسة رائعة بكل المقاييس. أبنائي سعداء جداً بالتعليم والمعاملة الطيبة.",
            rating: 5,
            image: "/parent-testimonial-man.jpg",
          },
          {
            name: "فاطمة أحمد",
            role: "ولية أمر",
            content: "تطور ملحوظ في مستوى ابنتي الدراسي. شكراً للكادر التعليمي المتميز.",
            rating: 5,
            image: "/parent-testimonial-woman.jpg",
          },
          {
            name: "محمد علي",
            role: "ولي أمر",
            content: "المرافق ممتازة والأنشطة متنوعة. بيئة مثالية لتنمية مهارات الأطفال.",
            rating: 5,
            image: "/parent-testimonial-man-2.jpg",
          },
        ],
      },
      styles: {
        animation: "slide-up",
        animationDelay: 200,
        animationDuration: 800,
        backgroundColor: "from-blue-600 to-purple-600",
        backgroundType: "gradient",
        gradientDirection: "to-br",
        textColor: "white",
        padding: { top: 80, right: 20, bottom: 80, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        shadow: "none",
      },
      order: 5,
    },

    // Jobs/Career Section Block
    {
      id: "block_7",
      type: "cta",
      content: {
        title: "انضم إلى فريقنا",
        description: "نبحث عن معلمين وموظفين متميزين للانضمام إلى عائلتنا التعليمية",
        primaryButton: { text: "التقدم للوظائف", link: "/jobs/employment" },
        secondaryButton: { text: "طلب خدمة", link: "/jobs/service-request" },
      },
      styles: {
        animation: "fade-in",
        animationDelay: 300,
        animationDuration: 1000,
        backgroundColor: "gray-900",
        textColor: "white",
        padding: { top: 60, right: 20, bottom: 60, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        shadow: "none",
      },
      order: 6,
    },

    // Contact Form Block
    {
      id: "block_8",
      type: "contact",
      content: {
        title: "اتصل بنا",
        description: "نسعد بالرد على استفساراتكم",
        fields: [
          { name: "name", label: "الاسم", type: "text", required: true },
          { name: "email", label: "البريد الإلكتروني", type: "email", required: true },
          { name: "phone", label: "رقم الهاتف", type: "tel", required: false },
          { name: "message", label: "الرسالة", type: "textarea", required: true },
        ],
        submitText: "إرسال",
        contactInfo: {
          phone: "+966 50 123 4567",
          email: "info@school.edu.sa",
          address: "الرياض، المملكة العربية السعودية",
        },
      },
      styles: {
        animation: "slide-up",
        animationDelay: 200,
        animationDuration: 800,
        backgroundColor: "from-gray-50 to-white",
        backgroundType: "gradient",
        gradientDirection: "to-b",
        textColor: "gray-800",
        padding: { top: 80, right: 20, bottom: 80, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        shadow: "none",
      },
      order: 7,
    },
  ],
}

async function importTemplate() {
  try {
    console.log("[v0] Starting home page template import...")

    // Add the page to Firestore
    await db.collection("pages").doc(homePageTemplate.id).set(homePageTemplate)

    console.log("[v0] Successfully imported home page template!")
    console.log("[v0] Page ID:", homePageTemplate.id)
    console.log("[v0] Go to your dashboard to view and edit the page.")
  } catch (error) {
    console.error("[v0] Error importing template:", error)
    throw error
  }
}

importTemplate()
