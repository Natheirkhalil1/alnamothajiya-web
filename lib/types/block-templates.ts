import type { Block as PageBlock } from "../../components/page-blocks-editor-core"

export interface BlockTemplate {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  category: "hero" | "about" | "features" | "testimonials" | "cta" | "stats" | "complex"
  thumbnail: string
  blocks: PageBlock[]
  tags: string[]
}

export const blockTemplates: BlockTemplate[] = [
  // Hero Slider - Exact match to home page
  {
    id: "hero-slider-premium",
    nameEn: "Premium Hero Slider",
    nameAr: "سلايدر رئيسي متميز",
    descriptionEn: "Full-screen hero slider with animations and decorative elements - exactly like home page",
    descriptionAr: "سلايدر بملء الشاشة مع رسوم متحركة وعناصر زخرفية - مطابق للصفحة الرئيسية",
    category: "hero",
    thumbnail: "/modern-school-exterior.png",
    tags: ["hero", "slider", "animated", "premium", "full-screen"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "مرحباً بكم في المدرسة النموذجية",
            subtitle: "التميز في التعليم",
            description: "نقدم تعليماً عالي الجودة ونُنشئ قادة المستقبل منذ عام 1990",
            imageUrl: "/modern-school-exterior.png",
          },
          {
            id: crypto.randomUUID(),
            title: "مرافق حديثة",
            subtitle: "تعلم متطور",
            description: "مجهزة بأحدث التقنيات والموارد لتجارب تعليمية محسّنة",
            imageUrl: "/modern-school-facilities-and-technology.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "كادر مؤهل",
            subtitle: "معلمون خبراء",
            description: "فريقنا المتفاني من المحترفين ملتزم بنجاح الطلاب",
            imageUrl: "/happy-students-learning-together.jpg",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "100vh",
        },
      },
    ],
  },

  // About Section - Like home page
  {
    id: "about-section-premium",
    nameEn: "About Section with Features",
    nameAr: "قسم من نحن مع المميزات",
    descriptionEn: "Comprehensive about section with image, features grid, and stats - like home page",
    descriptionAr: "قسم شامل عن المدرسة مع صورة وشبكة مميزات وإحصائيات - مثل الصفحة الرئيسية",
    category: "about",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["about", "features", "stats", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "image-with-text",
        header: {
          title: "عن المدرسة النموذجية",
          description: "قصتنا ورؤيتنا",
        },
        text: "مدرسة نموذجية كانت منارة للتميز التعليمي لأكثر من 30 عاماً. نحن ملتزمون بتوفير بيئة تعليمية شاملة تعزز التحصيل الأكاديمي والنمو الشخصي والمسؤولية الاجتماعية. مرافقنا الحديثة والمعلمون ذوو الخبرة يعملون معاً لإعداد الطلاب للنجاح في عالم متغير.",
        imageUrl: "/modern-school-classroom-with-students.jpg",
        imageSide: "left",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "3rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "مميزاتنا",
          description: "ما يجعلنا مميزين",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "graduation-cap",
            title: "التميز الأكاديمي",
            description: "منهج صارم مصمم لتحدي وإلهام الطلاب",
          },
          {
            id: crypto.randomUUID(),
            icon: "trophy",
            title: "تطوير الشخصية",
            description: "بناء القيم والأخلاق ومهارات القيادة",
          },
          {
            id: crypto.randomUUID(),
            icon: "school",
            title: "مرافق حديثة",
            description: "فصول دراسية ومختبرات ومرافق رياضية حديثة",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "هيئة تدريس متخصصة",
            description: "معلمون مؤهلون وذوو خبرة عالية",
          },
          {
            id: crypto.randomUUID(),
            icon: "star",
            title: "تعليم شامل",
            description: "نهج متوازن للأكاديميات والفنون والرياضة",
          },
          {
            id: crypto.randomUUID(),
            icon: "globe",
            title: "منظور عالمي",
            description: "إعداد الطلاب لعالم مترابط",
          },
        ],
        blockStyles: {
          paddingTop: "2rem",
          paddingBottom: "3rem",
          backgroundColor: "transparent",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "stats",
        header: {
          title: "إنجازاتنا",
          description: "أرقام تتحدث عن نفسها",
        },
        items: [
          {
            id: crypto.randomUUID(),
            value: "30+",
            label: "سنة من التميز",
          },
          {
            id: crypto.randomUUID(),
            value: "8",
            label: "أقسام متخصصة",
          },
          {
            id: crypto.randomUUID(),
            value: "50+",
            label: "كادر متخصص",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "التزام بالجودة",
          },
        ],
        blockStyles: {
          paddingTop: "2rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Hero Templates
  {
    id: "hero-basic-modern",
    nameEn: "Modern Hero Section",
    nameAr: "قسم رئيسي حديث",
    descriptionEn: "Clean hero section with title, subtitle, and CTA buttons",
    descriptionAr: "قسم رئيسي نظيف مع عنوان ونص فرعي وأزرار",
    category: "hero",
    thumbnail: "/modern-school-exterior.png",
    tags: ["hero", "modern", "clean"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "مرحباً بكم في المدرسة النموذجية",
        subtitle: "التميز في التعليم منذ عام 1990",
        primaryCtaLabel: "اعرف المزيد",
        primaryCtaHref: "#about",
        secondaryCtaLabel: "قدم الآن",
        secondaryCtaHref: "/apply",
        imageUrl: "/modern-school-exterior.png",
        align: "center",
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5",
        },
      },
    ],
  },

  // Features Section
  {
    id: "icon-points-features",
    nameEn: "Features Grid",
    nameAr: "شبكة المميزات",
    descriptionEn: "Grid of features with icons and descriptions",
    descriptionAr: "شبكة من المميزات مع أيقونات وأوصاف",
    category: "features",
    thumbnail: "/students-in-science-lab.jpg",
    tags: ["features", "grid", "icons"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "لماذا تختارنا",
          description: "اكتشف ما يجعل مدرستنا مميزة",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "check",
            title: "منهج معتمد",
            description: "برامج تعليمية معترف بها دولياً",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "معلمون خبراء",
            description: "مربون مؤهلون وذوو خبرة عالية",
          },
          {
            id: crypto.randomUUID(),
            icon: "trophy",
            title: "حائزة على جوائز",
            description: "معترف بها للتميز في التعليم",
          },
          {
            id: crypto.randomUUID(),
            icon: "globe",
            title: "منظور عالمي",
            description: "إعداد الطلاب لعالم مترابط",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5",
        },
      },
    ],
  },

  // Testimonials
  {
    id: "testimonials-modern",
    nameEn: "Testimonials Section",
    nameAr: "قسم الآراء",
    descriptionEn: "Display what parents say about us",
    descriptionAr: "عرض ما يقوله أولياء الأمور عنا",
    category: "testimonials",
    thumbnail: "/happy-students-learning-together.jpg",
    tags: ["testimonials", "reviews", "parents"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "testimonials",
        header: {
          title: "آراء أولياء الأمور",
          description: "ثقة العائلات في مجتمعنا",
        },
        items: [
          {
            id: crypto.randomUUID(),
            author: "سارة أحمد",
            role: "ولي أمر",
            quote: "لقد ازدهر أطفالي في المدرسة النموذجية. المعلمون داعمون للغاية والمنهج ممتاز.",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "محمد علي",
            role: "ولي أمر",
            quote: "أفضل استثمار تعليمي قمنا به لأطفالنا. يحبون الذهاب إلى المدرسة كل يوم!",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "فاطمة حسن",
            role: "ولي أمر",
            quote: "مرافق متميزة وبيئة رعاية. أنصح بها بشدة!",
            rating: 5,
            avatarUrl: "",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-background to-accent/5",
        },
      },
    ],
  },

  // Stats Section
  {
    id: "stats-section",
    nameEn: "Statistics Section",
    nameAr: "قسم الإحصائيات",
    descriptionEn: "Showcase impressive numbers and achievements",
    descriptionAr: "عرض الأرقام والإنجازات المثيرة للإعجاب",
    category: "about",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["stats", "numbers", "achievements"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "stats",
        header: {
          title: "تأثيرنا",
          description: "أرقام تتحدث عن نفسها",
        },
        items: [
          {
            id: crypto.randomUUID(),
            value: "30+",
            label: "سنوات من التميز",
          },
          {
            id: crypto.randomUUID(),
            value: "1000+",
            label: "طالب سعيد",
          },
          {
            id: crypto.randomUUID(),
            value: "95%",
            label: "معدل النجاح",
          },
          {
            id: crypto.randomUUID(),
            value: "50+",
            label: "معلم خبير",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          className: "relative overflow-hidden",
          borderRadius: "0",
        },
      },
    ],
  },

  // CTA Section
  {
    id: "cta-strip-modern",
    nameEn: "Call to Action",
    nameAr: "دعوة للعمل",
    descriptionEn: "Encourage visitors to take action",
    descriptionAr: "تشجيع الزوار على اتخاذ إجراء",
    category: "cta",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["cta", "contact", "action"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "هل أنت مستعد للانضمام إلى مجتمعنا؟",
        text: "قدم اليوم واضمن مستقبلاً مشرقاً لطفلك",
        primaryCtaLabel: "قدم الآن",
        primaryCtaHref: "/apply",
        secondaryCtaLabel: "حدد موعد زيارة",
        secondaryCtaHref: "/contact",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary",
        },
      },
    ],
  },

  // Jobs Hero Section
  {
    id: "jobs-hero-gradient",
    nameEn: "Jobs Hero Section",
    nameAr: "قسم رئيسي للوظائف",
    descriptionEn: "Eye-catching gradient hero for employment/careers page",
    descriptionAr: "قسم رئيسي جذاب بتدرج لوني لصفحة التوظيف",
    category: "hero",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["hero", "jobs", "gradient", "careers"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "فرص التوظيف",
        subtitle: "انضم إلى فريقنا",
        primaryCtaLabel: "تصفح الوظائف",
        primaryCtaHref: "#jobs",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white",
        },
      },
    ],
  },

  // Contact Section Full
  {
    id: "contact-section-full",
    nameEn: "Contact Section with Form",
    nameAr: "قسم التواصل مع النموذج",
    descriptionEn: "Complete contact section with info cards, form, and map",
    descriptionAr: "قسم تواصل كامل مع بطاقات معلومات ونموذج وخريطة",
    category: "cta",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["contact", "form", "map", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
        },
      },
    ],
  },

  // Gallery Modern
  {
    id: "gallery-modern",
    nameEn: "Photo Gallery",
    nameAr: "معرض الصور",
    descriptionEn: "Beautiful photo gallery with category filters",
    descriptionAr: "معرض صور جميل مع فلاتر الفئات",
    category: "features",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["gallery", "photos", "masonry", "filters"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "gallery-masonry",
        header: {
          title: "معرض الصور",
        },
        items: [
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-exterior.png",
            caption: "مبنى المدرسة",
            alt: "مبنى المدرسة الحديث",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-facilities-and-technology.jpg",
            caption: "المرافق التقنية",
            alt: "مختبرات الحاسوب والتكنولوجيا",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-classroom-with-students.jpg",
            caption: "البيئة الصفية",
            alt: "فصول دراسية حديثة ومجهزة",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-science-lab-experiment.jpg",
            caption: "المختبرات العلمية",
            alt: "تجارب علمية في المختبرات",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background",
        },
      },
    ],
  },

  // Services Cards Premium
  {
    id: "services-cards-premium",
    nameEn: "Services Cards",
    nameAr: "بطاقات الخدمات",
    descriptionEn: "Premium service cards with gradient icons",
    descriptionAr: "بطاقات خدمات متميزة مع أيقونات متدرجة",
    category: "features",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["services", "cards", "gradient", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "services-list",
        header: {
          title: "خدماتنا",
        },
        layout: "grid",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "التوظيف",
            description: "فرص عمل متميزة في بيئة تعليمية احترافية",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "التدريب",
            description: "برامج تدريبية متخصصة لتطوير المهارات",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background",
        },
      },
    ],
  },

  // Alternative CTA
  {
    id: "cta-alternative",
    nameEn: "Alternative CTA",
    nameAr: "دعوة بديلة للعمل",
    descriptionEn: "Subtle CTA for when visitors don't find what they need",
    descriptionAr: "دعوة للعمل عندما لا يجد الزوار ما يبحثون عنه",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["cta", "alternative", "subtle"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "لم تجد ما تبحث عنه؟",
        text: "يمكنك التواصل معنا وسنساعدك في إيجاد ما تحتاجه",
        primaryCtaLabel: "تواصل معنا",
        primaryCtaHref: "/contact",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
          className: "relative overflow-hidden",
        },
      },
    ],
  },

  // Stats Horizontal Bar
  {
    id: "stats-horizontal",
    nameEn: "Stats Horizontal Bar",
    nameAr: "شريط الإحصائيات الأفقي",
    descriptionEn: "Horizontal stats bar with gradient background",
    descriptionAr: "شريط إحصائيات أفقي مع خلفية متدرجة",
    category: "stats",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["stats", "horizontal", "gradient"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "stats",
        header: {
          title: "إنجازاتنا بالأرقام",
        },
        items: [
          {
            id: crypto.randomUUID(),
            value: "30+",
            label: "سنة من التميز",
          },
          {
            id: crypto.randomUUID(),
            value: "8",
            label: "أقسام متخصصة",
          },
          {
            id: crypto.randomUUID(),
            value: "50+",
            label: "كادر متخصص",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "التزام بالجودة",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          className: "relative overflow-hidden",
        },
      },
    ],
  },

  // Features Showcase Premium
  {
    id: "features-showcase-premium",
    nameEn: "Features Showcase",
    nameAr: "عرض المميزات",
    descriptionEn: "Premium features grid with gradient cards",
    descriptionAr: "شبكة مميزات متميزة مع بطاقات متدرجة",
    category: "features",
    thumbnail: "/students-in-science-lab.jpg",
    tags: ["features", "premium", "gradient", "cards"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "مميزاتنا الفريدة",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "graduation-cap",
            title: "التميز الأكاديمي",
            description: "منهج صارم مصمم لتحدي وإلهام الطلاب",
          },
          {
            id: crypto.randomUUID(),
            icon: "trophy",
            title: "تطوير الشخصية",
            description: "بناء القيم والأخلاق ومهارات القيادة",
          },
          {
            id: crypto.randomUUID(),
            icon: "school",
            title: "مرافق حديثة",
            description: "فصول دراسية ومختبرات ومرافق رياضية حديثة",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "هيئة تدريس متخصصة",
            description: "معلمون مؤهلون وذوو خبرة عالية",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5",
        },
      },
    ],
  },

  // --- Department Templates ---

  // Department Hero
  {
    id: "department-hero-premium",
    nameEn: "Department Hero Slider",
    nameAr: "سلايدر القسم الرئيسي",
    descriptionEn: "Full-screen hero slider designed for department pages",
    descriptionAr: "سلايدر بملء الشاشة مصمم لصفحات الأقسام",
    category: "hero",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["hero", "department", "slider", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "القسم الطبي",
            subtitle: "صحة طلابنا أولويتنا",
            description: "كوادر طبية ذوي كفاءات عالية ومعدات شاملة",
            imageUrl: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "رعاية متكاملة",
            subtitle: "خدمات على مدار الساعة",
            description: "فريق من الأطباء والممرضين لضمان سلامة الجميع",
            imageUrl: "/school-pharmacy-with-organized-medications-and-pha.jpg",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "90vh",
          className: "relative",
        },
      },
    ],
  },

  // Department Welcome
  {
    id: "department-welcome-premium",
    nameEn: "Department Welcome",
    nameAr: "ترحيب القسم",
    descriptionEn: "Welcome section with image and text for departments",
    descriptionAr: "قسم الترحيب مع صورة ونص للأقسام",
    category: "about",
    thumbnail: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
    tags: ["about", "department", "welcome"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "image-with-text",
        header: {
          title: "مرحباً بكم في القسم",
          description: "رؤيتنا ورسالتنا",
        },
        text: "يتميز هذا القسم بكوادر متخصصة وتجهيزات عالية المستوى لضمان تقديم أفضل الخدمات للطلاب. نحن نلتزم بأعلى معايير الجودة والسلامة في جميع مرافقنا.",
        imageUrl: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
        imageSide: "left",
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50",
        },
      },
    ],
  },

  // Department Subsections
  {
    id: "department-subsections-grid",
    nameEn: "Department Subsections",
    nameAr: "أقسام فرعية",
    descriptionEn: "Grid layout for department subsections or services",
    descriptionAr: "تخطيط شبكي للأقسام الفرعية أو الخدمات",
    category: "features",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["features", "department", "grid"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "وحدات القسم",
          description: "تعرف على خدماتنا المتخصصة",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "stethoscope",
            title: "العيادة الطبية",
            description: "مجهزة بأحدث المعدات وكادر طبي متخصص",
          },
          {
            id: crypto.randomUUID(),
            icon: "pill",
            title: "الصيدلية",
            description: "توفير كافة الأدوية والمستلزمات الطبية",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            title: "المتابعة الصحية",
            description: "رعاية حثيثة ومراقبة مستمرة للحالات",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden",
        },
      },
    ],
  },

  // Department CTA
  {
    id: "department-cta-premium",
    nameEn: "Department CTA",
    nameAr: "دعوة للتواصل (قسم)",
    descriptionEn: "Call to action strip for department pages",
    descriptionAr: "شريط دعوة للعمل لصفحات الأقسام",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["cta", "department", "contact"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "هل لديك استفسار طبي؟",
        text: "فريقنا الطبي جاهز للإجابة على جميع استفساراتكم",
        primaryCtaLabel: "تواصل معنا",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "حجز موعد",
        secondaryCtaHref: "/appointment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-pink-600",
        },
      },
    ],
  },

  // Full Department Page Template
  {
    id: "department-page-full",
    nameEn: "Full Department Page",
    nameAr: "صفحة قسم كاملة",
    descriptionEn: "Complete department page layout with Hero, Welcome, Subsections, and CTA",
    descriptionAr: "تخطيط صفحة قسم كامل مع السلايدر والترحيب والأقسام الفرعية والدعوة للعمل",
    category: "complex",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["department", "full-page", "complex"],
    blocks: [
      // Hero
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "القسم الطبي",
            subtitle: "صحة طلابنا أولويتنا",
            description: "كوادر طبية ذوي كفاءات عالية ومعدات شاملة",
            imageUrl: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "رعاية متكاملة",
            subtitle: "خدمات على مدار الساعة",
            description: "فريق من الأطباء والممرضين لضمان سلامة الجميع",
            imageUrl: "/school-pharmacy-with-organized-medications-and-pha.jpg",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "90vh",
          className: "relative",
        },
      },
      // Welcome
      {
        id: crypto.randomUUID(),
        kind: "image-with-text",
        header: {
          title: "مرحباً بكم في القسم الطبي",
          description: "رؤيتنا ورسالتنا",
        },
        text: "يتميز القسم الطبي بكوادر طبية ذوي كفاءات عالية من أطباء وممرضين متواجدين على مدار الساعة، مع معدات طبية شاملة لجميع الحالات الطارئة واليومية، وسيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية.",
        imageUrl: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
        imageSide: "left",
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50",
        },
      },
      // Subsections
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "وحدات القسم",
          description: "تعرف على خدماتنا المتخصصة",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "stethoscope",
            title: "العيادة الطبية",
            description: "مجهزة بأحدث المعدات وكادر طبي متخصص",
          },
          {
            id: crypto.randomUUID(),
            icon: "pill",
            title: "الصيدلية",
            description: "توفير كافة الأدوية والمستلزمات الطبية",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            title: "المتابعة الصحية",
            description: "رعاية حثيثة ومراقبة مستمرة للحالات",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden",
        },
      },
      // CTA
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "هل لديك استفسار طبي؟",
        text: "فريقنا الطبي جاهز للإجابة على جميع استفساراتكم",
        primaryCtaLabel: "تواصل معنا",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "حجز موعد",
        secondaryCtaHref: "/appointment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-pink-600",
        },
      },
    ],
  },
  {
    id: "department-cards-premium",
    nameEn: "Department Cards (Premium)",
    nameAr: "بطاقات الأقسام (متميز)",
    descriptionEn: "Premium department cards with hover effects and CTA",
    descriptionAr: "بطاقات أقسام متميزة مع تأثيرات تحويم وقسم دعوة للعمل",
    category: "features",
    thumbnail: "/previews/department-cards.png",
    tags: ["departments", "cards", "premium", "grid"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "departments-grid",
        items: [
          {
            id: "dept-1",
            type: "medical",
            titleEn: "Medical Section",
            titleAr: "القسم الطبي",
            descriptionEn: "Comprehensive medical care for students.",
            descriptionAr: "رعاية طبية شاملة للطلاب.",
            image: "/images/medical-dept.jpg",
            href: "/departments/medical",
          },
          {
            id: "dept-2",
            type: "heart",
            titleEn: "School Heart",
            titleAr: "قلب المدرسة",
            descriptionEn: "The core of our educational system.",
            descriptionAr: "جوهر نظامنا التعليمي.",
            image: "/images/heart-dept.jpg",
            href: "/departments/heart",
          },
          {
            id: "dept-3",
            type: "housing",
            titleEn: "Student Housing",
            titleAr: "السكن الداخلي",
            descriptionEn: "Comfortable and safe accommodation.",
            descriptionAr: "سكن مريح وآمن.",
            image: "/images/housing-dept.jpg",
            href: "/departments/housing",
          },
          {
            id: "dept-4",
            type: "activities",
            titleEn: "Activities",
            titleAr: "الأنشطة اللاصفية",
            descriptionEn: "Engaging extracurricular activities.",
            descriptionAr: "أنشطة لاصفية ممتعة.",
            image: "/images/activities-dept.jpg",
            href: "/departments/activities",
          },
        ],
        showCTA: true,
        ctaTitle: "هل لديك استفسار؟",
        ctaText: "فريقنا المتخصص جاهز على مدار الساعة للإجابة على جميع استفساراتكم",
        ctaButtonLabel: "تواصل معنا الآن",
        ctaButtonHref: "/contact",
        badgeText: "قسم متخصص",
        header: {
          title: "أقسامنا المتخصصة",
        },
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
    ],
  },

  // Medical Department Page Premium
  {
    id: "department-page-medical-premium",
    nameEn: "Medical Department Page (Premium)",
    nameAr: "صفحة القسم الطبي (متميزة)",
    descriptionEn: "Complete medical department page with hero slider, welcome section, subsections, and CTA",
    descriptionAr: "صفحة كاملة للقسم الطبي مع سلايدر، ترحيب، أقسام فرعية، ودعوة للعمل",
    category: "complex",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["department", "medical", "premium", "full-page"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "العيادة الطبية",
            subtitle: "صحة طلابنا أولويتنا",
            description: "عيادة مجهزة بأحدث المعدات الطبية",
            imageUrl: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
            badgeText: "القسم الطبي",
          },
          {
            id: crypto.randomUUID(),
            title: "الصيدلية",
            subtitle: "رعاية شاملة",
            description: "صيدلية شاملة لجميع احتياجات الطلاب الدوائية",
            imageUrl: "/school-pharmacy-with-organized-medications-and-pha.jpg",
            badgeText: "القسم الطبي",
          },
          {
            id: crypto.randomUUID(),
            title: "المتابعة الصحية",
            subtitle: "على مدار الساعة",
            description: "وحدة عناية مركزة للمتابعة الصحية على مدار الساعة",
            imageUrl: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
            badgeText: "القسم الطبي",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "90vh",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-welcome",
        icon: "stethoscope",
        title: "مرحباً بكم في القسم الطبي - صحة طلابنا أولويتنا",
        description: "يتميز القسم الطبي بكوادر طبية ذوي كفاءات عالية من أطباء وممرضين متواجدين على مدار الساعة، مع معدات طبية شاملة لجميع الحالات الطارئة واليومية، وسيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية.",
        stats: [
          {
            id: crypto.randomUUID(),
            value: "3+",
            label: "قسم فرعي",
            onClick: "#subsections",
          },
          {
            id: crypto.randomUUID(),
            value: "24/7",
            label: "خدمة مستمرة",
            onClick: "#contact",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "التزام بالجودة",
            onClick: "#cta",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-subsections",
        header: {
          title: "استكشف خدماتنا",
          description: "الأقسام الفرعية",
        },
        departmentColor: "from-red-600 via-rose-600 to-pink-600",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "stethoscope",
            titleAr: "العيادة",
            titleEn: "Clinic",
            descriptionAr: "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)",
            descriptionEn: "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7)",
            detailedDescriptionAr: "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)، وفيها معدات طبية شاملة لجميع الحالات الطارئة واليومية، ويتوفر فيها سيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية على مدار الساعة.",
            detailedDescriptionEn: "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7), comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies available 24/7.",
            image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            icon: "pill",
            titleAr: "الصيدلية",
            titleEn: "Pharmacy",
            descriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً",
            descriptionEn: "The pharmacy contains all medications needed by students, classified by student name, and stored electronically",
            detailedDescriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً. يتم تخزين جميع الأدوية بطريقة آمنة ومنظمة لضمان سهولة الوصول إليها عند الحاجة.",
            detailedDescriptionEn: "The pharmacy contains all medications needed by students, classified by student name, and stored electronically. All medications are stored safely and organized to ensure easy access when needed.",
            image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            titleAr: "المتابعة الصحية",
            titleEn: "Health Monitoring",
            descriptionAr: "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية",
            descriptionEn: "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed",
            detailedDescriptionAr: "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
            detailedDescriptionEn: "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
            image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
          },
        ],
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-cta",
        title: "هل لديك استفسار؟",
        description: "نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في اختيار البرنامج المناسب لاحتياجاتكم",
        primaryButtonLabel: "تواصل معنا الآن",
        primaryButtonHref: "#contact",
        secondaryButtonLabel: "العودة للرئيسية",
        secondaryButtonHref: "/",
        contactInfo: {
          phone: "4122002",
          email: "info@namothajia.com",
          address: "عمان، الأردن",
        },
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
    ],
  },

  // Jobs Page Premium
  {
    id: "jobs-page-premium",
    nameEn: "Jobs Page (Premium)",
    nameAr: "صفحة الوظائف (متميزة)",
    descriptionEn: "Complete jobs page with hero, job listings, and CTA",
    descriptionAr: "صفحة كاملة للوظائف مع سلايدر، قائمة الوظائف، ودعوة للعمل",
    category: "complex",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["jobs", "employment", "careers", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "فرص التوظيف",
        subtitle: "انضم إلى فريقنا التعليمي المتميز",
        primaryCtaLabel: "تصفح الوظائف",
        primaryCtaHref: "#jobs",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          title: "الوظائف المتاحة",
        },
        emptyStateMessage: "لا توجد وظائف متاحة حالياً",
        items: [
          {
            id: crypto.randomUUID(),
            title: "معلم رياضيات",
            titleEn: "Mathematics Teacher",
            type: "دوام كامل",
            typeEn: "Full Time",
            description: "نبحث عن معلم رياضيات متمرس للانضمام إلى فريقنا التعليمي",
            descriptionEn: "We are looking for an experienced mathematics teacher to join our educational team",
            workShift: "صباحي",
            workShiftEn: "Morning",
            workDuration: "8 ساعات",
            workDurationEn: "8 hours",
            gender: "ذكر/أنثى",
            genderEn: "Male/Female",
            applyLink: "/jobs/employment",
          },
          {
            id: crypto.randomUUID(),
            title: "معلم لغة إنجليزية",
            titleEn: "English Teacher",
            type: "دوام كامل",
            typeEn: "Full Time",
            description: "مطلوب معلم لغة إنجليزية بخبرة لا تقل عن 3 سنوات",
            descriptionEn: "English teacher required with at least 3 years of experience",
            workShift: "صباحي",
            workShiftEn: "Morning",
            workDuration: "8 ساعات",
            workDurationEn: "8 hours",
            gender: "ذكر/أنثى",
            genderEn: "Male/Female",
            applyLink: "/jobs/employment",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "لم تجد الوظيفة المناسبة؟",
        text: "يمكنك إرسال سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة",
        primaryCtaLabel: "إرسال السيرة الذاتية",
        primaryCtaHref: "/jobs/employment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // Gallery with Category Filters
  {
    id: "gallery-filtered-premium",
    nameEn: "Gallery with Filters (Premium)",
    nameAr: "معرض صور مع فلاتر (متميز)",
    descriptionEn: "Image gallery with category filtering and masonry layout",
    descriptionAr: "معرض صور مع فلترة حسب الفئات وتخطيط متدرج",
    category: "features",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["gallery", "images", "filters", "categories", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "gallery-masonry",
        header: {
          title: "معرض الصور",
          description: "استعرض صورنا حسب الفئة",
        },
        showFilters: true,
        captionPosition: "over",
        showLightbox: true,
        items: [
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-exterior.png",
            alt: "مبنى المدرسة",
            caption: "مبنى المدرسة الحديث",
            category: "مرافق",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-facilities-and-technology.jpg",
            alt: "المرافق التقنية",
            caption: "مختبرات الحاسوب",
            category: "مرافق",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-classroom-with-students.jpg",
            alt: "الفصول الدراسية",
            caption: "فصول دراسية حديثة",
            category: "فصول",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/happy-students-learning-together.jpg",
            alt: "طلاب سعداء",
            caption: "طلابنا المتميزون",
            category: "طلاب",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-science-lab-experiment.jpg",
            alt: "المختبر العلمي",
            caption: "تجارب علمية",
            category: "مرافق",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/students-in-science-lab.jpg",
            alt: "طلاب في المختبر",
            caption: "التعلم العملي",
            category: "طلاب",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background",
        },
      },
    ],
  },

  // Image Albums Premium
  {
    id: "image-albums-premium",
    nameEn: "Image Albums (Premium)",
    nameAr: "ألبومات الصور (متميزة)",
    descriptionEn: "Organize images into albums with covers and lightbox viewing",
    descriptionAr: "تنظيم الصور في ألبومات مع أغلفة وعرض بحجم كامل",
    category: "features",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["albums", "gallery", "images", "photos", "premium"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "image-albums",
        header: {
          title: "ألبومات الصور",
          description: "استعرض ألبوماتنا المتنوعة",
        },
        albums: [
          {
            id: crypto.randomUUID(),
            title: "الفعاليات والأنشطة",
            titleEn: "Events & Activities",
            description: "صور من فعالياتنا وأنشطتنا المدرسية المتنوعة",
            descriptionEn: "Photos from our diverse school events and activities",
            coverImage: "/happy-students-learning-together.jpg",
            images: [
              {
                id: crypto.randomUUID(),
                imageUrl: "/happy-students-learning-together.jpg",
                alt: "طلاب سعداء",
                caption: "فعالية اليوم المفتوح",
              },
              {
                id: crypto.randomUUID(),
                imageUrl: "/modern-school-classroom-with-students.jpg",
                alt: "الفصول الدراسية",
                caption: "نشاط صفي تفاعلي",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            title: "المرافق والتجهيزات",
            titleEn: "Facilities & Equipment",
            description: "جولة في مرافقنا الحديثة والمجهزة بأحدث التقنيات",
            descriptionEn: "Tour of our modern facilities equipped with the latest technology",
            coverImage: "/modern-school-facilities-and-technology.jpg",
            images: [
              {
                id: crypto.randomUUID(),
                imageUrl: "/modern-school-facilities-and-technology.jpg",
                alt: "المرافق التقنية",
                caption: "مختبرات الحاسوب",
              },
              {
                id: crypto.randomUUID(),
                imageUrl: "/modern-school-science-lab-experiment.jpg",
                alt: "المختبر العلمي",
                caption: "مختبر العلوم المتطور",
              },
              {
                id: crypto.randomUUID(),
                imageUrl: "/modern-school-exterior.png",
                alt: "مبنى المدرسة",
                caption: "المبنى الخارجي",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            title: "الحياة الطلابية",
            titleEn: "Student Life",
            description: "لحظات من الحياة اليومية لطلابنا",
            descriptionEn: "Moments from our students' daily life",
            coverImage: "/students-in-science-lab.jpg",
            images: [
              {
                id: crypto.randomUUID(),
                imageUrl: "/students-in-science-lab.jpg",
                alt: "طلاب في المختبر",
                caption: "التعلم العملي",
              },
            ],
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // About Section Premium (Home Page Style)
  {
    id: "about-section-premium-v2",
    nameEn: "About Section (Premium)",
    nameAr: "قسم عن المدرسة (متميز)",
    descriptionEn: "Complete about section with image, stats, and feature cards - matches home page style",
    descriptionAr: "قسم كامل عن المدرسة مع صورة، إحصائيات، وبطاقات المميزات - يطابق تصميم الصفحة الرئيسية",
    category: "features",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["about", "features", "stats", "premium", "home"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "about-section",
        titleEn: "About Our School",
        titleAr: "عن مدرستنا",
        descriptionEn:
          "Namothajia School has been a beacon of educational excellence for over 30 years. We are committed to providing a comprehensive learning environment that nurtures academic achievement, personal growth, and social responsibility. Our state-of-the-art facilities and experienced educators work together to prepare students for success in an ever-changing world.",
        descriptionAr:
          "مدرسة نموذجية كانت منارة للتميز التعليمي لأكثر من 30 عاماً. نحن ملتزمون بتوفير بيئة تعليمية شاملة تعزز التحصيل الأكاديمي والنمو الشخصي والمسؤولية الاجتماعية. مرافقنا الحديثة والمعلمون ذوو الخبرة يعملون معاً لإعداد الطلاب للنجاح في عالم متغير.",
        image: "/modern-school-classroom-with-students.jpg",
        showBadge: true,
        badgeText: "ISO 9001:2015",
        stats: [
          {
            id: crypto.randomUUID(),
            number: "30+",
            labelEn: "Years of Excellence",
            labelAr: "سنة من التميز",
          },
          {
            id: crypto.randomUUID(),
            number: "8",
            labelEn: "Specialized Departments",
            labelAr: "أقسام متخصصة",
          },
          {
            id: crypto.randomUUID(),
            number: "50+",
            labelEn: "Specialized Staff",
            labelAr: "كادر متخصص",
          },
          {
            id: crypto.randomUUID(),
            number: "100%",
            labelEn: "Quality Commitment",
            labelAr: "التزام بالجودة",
          },
        ],
        featureCards: [
          {
            id: crypto.randomUUID(),
            icon: "target",
            titleEn: "Academic Excellence",
            titleAr: "التميز الأكاديمي",
            descriptionEn: "Rigorous curriculum designed to challenge and inspire students",
            descriptionAr: "منهج صارم مصمم لتحدي وإلهام الطلاب",
          },
          {
            id: crypto.randomUUID(),
            icon: "heart",
            titleEn: "Character Development",
            titleAr: "تطوير الشخصية",
            descriptionEn: "Building values, ethics, and leadership skills",
            descriptionAr: "بناء القيم والأخلاق ومهارات القيادة",
          },
          {
            id: crypto.randomUUID(),
            icon: "award",
            titleEn: "Modern Facilities",
            titleAr: "مرافق حديثة",
            descriptionEn: "State-of-the-art classrooms, labs, and sports facilities",
            descriptionAr: "فصول دراسية ومختبرات ومرافق رياضية حديثة",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            titleEn: "Expert Faculty",
            titleAr: "هيئة تدريس متخصصة",
            descriptionEn: "Highly qualified and experienced educators",
            descriptionAr: "معلمون مؤهلون وذوو خبرة عالية",
          },
          {
            id: crypto.randomUUID(),
            icon: "building",
            titleEn: "Holistic Education",
            titleAr: "تعليم شامل",
            descriptionEn: "Balanced approach to academics, arts, and athletics",
            descriptionAr: "نهج متوازن للأكاديميات والفنون والرياضة",
          },
          {
            id: crypto.randomUUID(),
            icon: "globe",
            titleEn: "Global Perspective",
            titleAr: "منظور عالمي",
            descriptionEn: "Preparing students for an interconnected world",
            descriptionAr: "إعداد الطلاب لعالم مترابط",
          },
        ],
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
    ],
  },

  // === ENGLISH VERSIONS OF TEMPLATES ===

  // Hero Slider - English
  {
    id: "hero-slider-premium-en",
    nameEn: "Premium Hero Slider (English)",
    nameAr: "سلايدر رئيسي متميز (إنجليزي)",
    descriptionEn: "Full-screen hero slider with animations - English version",
    descriptionAr: "سلايدر بملء الشاشة مع رسوم متحركة - نسخة إنجليزية",
    category: "hero",
    thumbnail: "/modern-school-exterior.png",
    tags: ["hero", "slider", "animated", "premium", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "Welcome to Al Namothajia School",
            subtitle: "Excellence in Education",
            description: "Providing high-quality education and nurturing future leaders since 1990",
            imageUrl: "/modern-school-exterior.png",
          },
          {
            id: crypto.randomUUID(),
            title: "Modern Facilities",
            subtitle: "Advanced Learning",
            description: "Equipped with cutting-edge technology and resources for enhanced learning experiences",
            imageUrl: "/modern-school-facilities-and-technology.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Qualified Staff",
            subtitle: "Expert Teachers",
            description: "Our dedicated team of professionals committed to student success",
            imageUrl: "/happy-students-learning-together.jpg",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "100vh",
        },
      },
    ],
  },

  // Features Grid - English
  {
    id: "icon-points-features-en",
    nameEn: "Features Grid (English)",
    nameAr: "شبكة المميزات (إنجليزي)",
    descriptionEn: "Grid of features with icons and descriptions",
    descriptionAr: "شبكة من المميزات مع أيقونات وأوصاف",
    category: "features",
    thumbnail: "/students-in-science-lab.jpg",
    tags: ["features", "grid", "icons", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "Why Choose Us",
          description: "Discover what makes our school special",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "check",
            title: "Accredited Curriculum",
            description: "Internationally recognized educational programs",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "Expert Teachers",
            description: "Highly qualified and experienced educators",
          },
          {
            id: crypto.randomUUID(),
            icon: "trophy",
            title: "Award-Winning",
            description: "Recognized for excellence in education",
          },
          {
            id: crypto.randomUUID(),
            icon: "globe",
            title: "Global Perspective",
            description: "Preparing students for an interconnected world",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5",
        },
      },
    ],
  },

  // Testimonials - English
  {
    id: "testimonials-modern-en",
    nameEn: "Testimonials Section (English)",
    nameAr: "قسم الآراء (إنجليزي)",
    descriptionEn: "Display what parents say about us",
    descriptionAr: "عرض ما يقوله أولياء الأمور عنا",
    category: "testimonials",
    thumbnail: "/happy-students-learning-together.jpg",
    tags: ["testimonials", "reviews", "parents", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "testimonials",
        header: {
          title: "Parent Testimonials",
          description: "Families Trust in Our Community",
        },
        items: [
          {
            id: crypto.randomUUID(),
            author: "Sarah Ahmed",
            role: "Parent",
            quote: "My children have thrived at Al Namothajia School. The teachers are incredibly supportive and the curriculum is excellent.",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "Mohammed Ali",
            role: "Parent",
            quote: "Best educational investment we've made for our children. They love going to school every day!",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "Fatima Hassan",
            role: "Parent",
            quote: "Outstanding facilities and nurturing environment. Highly recommend!",
            rating: 5,
            avatarUrl: "",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-background to-accent/5",
        },
      },
    ],
  },

  // Stats Section - English
  {
    id: "stats-section-en",
    nameEn: "Statistics Section (English)",
    nameAr: "قسم الإحصائيات (إنجليزي)",
    descriptionEn: "Showcase impressive numbers and achievements",
    descriptionAr: "عرض الأرقام والإنجازات المثيرة للإعجاب",
    category: "about",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["stats", "numbers", "achievements", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "stats",
        header: {
          title: "Our Impact",
          description: "Numbers That Speak for Themselves",
        },
        items: [
          {
            id: crypto.randomUUID(),
            value: "30+",
            label: "Years of Excellence",
          },
          {
            id: crypto.randomUUID(),
            value: "1000+",
            label: "Happy Students",
          },
          {
            id: crypto.randomUUID(),
            value: "95%",
            label: "Success Rate",
          },
          {
            id: crypto.randomUUID(),
            value: "50+",
            label: "Expert Teachers",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          className: "relative overflow-hidden",
          borderRadius: "0",
        },
      },
    ],
  },

  // CTA Section - English
  {
    id: "cta-strip-modern-en",
    nameEn: "Call to Action (English)",
    nameAr: "دعوة للعمل (إنجليزي)",
    descriptionEn: "Encourage visitors to take action",
    descriptionAr: "تشجيع الزوار على اتخاذ إجراء",
    category: "cta",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["cta", "contact", "action", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "Ready to Join Our Community?",
        text: "Apply today and secure a bright future for your child",
        primaryCtaLabel: "Apply Now",
        primaryCtaHref: "/apply",
        secondaryCtaLabel: "Schedule a Visit",
        secondaryCtaHref: "/contact",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary",
        },
      },
    ],
  },

  // Contact Section - English
  {
    id: "contact-section-full-en",
    nameEn: "Contact Section with Form (English)",
    nameAr: "قسم التواصل مع النموذج (إنجليزي)",
    descriptionEn: "Complete contact section with info cards, form, and map",
    descriptionAr: "قسم تواصل كامل مع بطاقات معلومات ونموذج وخريطة",
    category: "cta",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["contact", "form", "map", "premium", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "Contact Us",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "Sunday - Thursday: 7:00 AM - 3:00 PM",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
        },
      },
    ],
  },

  // Gallery - English
  {
    id: "gallery-modern-en",
    nameEn: "Photo Gallery (English)",
    nameAr: "معرض الصور (إنجليزي)",
    descriptionEn: "Beautiful photo gallery with category filters",
    descriptionAr: "معرض صور جميل مع فلاتر الفئات",
    category: "features",
    thumbnail: "/modern-school-classroom-with-students.jpg",
    tags: ["gallery", "photos", "masonry", "filters", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "gallery-masonry",
        header: {
          title: "Photo Gallery",
        },
        items: [
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-exterior.png",
            caption: "School Building",
            alt: "Modern School Building",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-facilities-and-technology.jpg",
            caption: "Technology Facilities",
            alt: "Computer and Technology Labs",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-classroom-with-students.jpg",
            caption: "Classroom Environment",
            alt: "Modern and Equipped Classrooms",
          },
          {
            id: crypto.randomUUID(),
            imageUrl: "/modern-school-science-lab-experiment.jpg",
            caption: "Science Labs",
            alt: "Scientific Experiments in Labs",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "transparent",
          className: "relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background",
        },
      },
    ],
  },

  // ========================================
  // PUBLIC PAGES AS TEMPLATES
  // ========================================

  // --- PRIVACY POLICY PAGE TEMPLATES ---

  // Privacy Policy Full Page - Arabic
  // Matches static page: /app/(root)/privacy/page.tsx
  // 5 sections: Information Collected, How We Use, Data Protection, Information Sharing, Your Rights
  {
    id: "privacy-policy-page-ar",
    nameEn: "Privacy Policy Page (Arabic)",
    nameAr: "صفحة سياسة الخصوصية (عربي)",
    descriptionEn: "Complete privacy policy page with hero, 5 content sections, and contact footer - Arabic version - matches static page exactly",
    descriptionAr: "صفحة كاملة لسياسة الخصوصية مع قسم رئيسي و5 أقسام محتوى وتذييل تواصل - النسخة العربية - تطابق الصفحة الثابتة",
    category: "complex",
    thumbnail: "/modern-school-exterior.png",
    tags: ["privacy", "policy", "legal", "full-page", "arabic"],
    blocks: [
      // Hero with Shield icon styling
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "سياسة الخصوصية",
        subtitle: "نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600",
        },
      },
      // Section 1: Information We Collect (Shield icon in static)
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "المعلومات التي نجمعها",
        },
        content: `نقوم بجمع المعلومات التالية عند استخدامك لخدماتنا:

• المعلومات الشخصية: الاسم، العنوان، رقم الهاتف، البريد الإلكتروني
• معلومات الطالب: تاريخ الميلاد، الرقم الوطني، المعلومات الطبية ذات الصلة
• معلومات التوظيف: السيرة الذاتية، المؤهلات، الخبرات السابقة
• معلومات الاستخدام: كيفية تفاعلك مع موقعنا الإلكتروني وخدماتنا`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 2: How We Use Your Information (Lock icon in static)
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "كيف نستخدم معلوماتك",
        },
        content: `نستخدم المعلومات التي نجمعها للأغراض التالية:

• تقديم الخدمات التعليمية والتأهيلية
• التواصل معك بخصوص الخدمات والبرامج
• معالجة طلبات التوظيف والخدمات
• تحسين جودة خدماتنا وتطوير برامجنا
• الامتثال للمتطلبات القانونية والتنظيمية`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 3: Data Protection (Eye icon in static)
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "حماية البيانات",
        },
        content: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:

• تشفير البيانات أثناء النقل والتخزين
• الوصول المحدود للموظفين المصرح لهم فقط
• مراجعات أمنية منتظمة وتحديثات للأنظمة
• الامتثال لمعايير ISO 9001:2015
• نسخ احتياطية منتظمة للبيانات`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 4: Information Sharing (FileText icon in static)
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "مشاركة المعلومات",
        },
        content: `لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:

• بموافقتك الصريحة
• عند الضرورة لتقديم الخدمات المطلوبة
• للامتثال للقوانين والأنظمة
• لحماية حقوقنا وسلامة الآخرين
• مع مقدمي الخدمات الموثوقين الذين يلتزمون بحماية البيانات`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 5: Your Rights (Mail icon in static)
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "حقوقك",
        },
        content: `لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:

• الوصول إلى معلوماتك الشخصية
• تصحيح المعلومات غير الدقيقة
• طلب حذف معلوماتك
• الاعتراض على معالجة معلوماتك
• طلب نقل بياناتك
• سحب موافقتك في أي وقت`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Contact Footer with gradient
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
          description: "إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا:",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
          phone: "4122002 / 4122003",
          email: "info@namothajia.com",
        },
        showForm: false,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl mx-4 md:mx-auto max-w-4xl",
        },
      },
    ],
  },

  // Privacy Policy Full Page - English
  // Matches static page: /app/(root)/privacy/page.tsx
  // 5 sections: Information Collected, How We Use, Data Protection, Information Sharing, Your Rights
  {
    id: "privacy-policy-page-en",
    nameEn: "Privacy Policy Page (English)",
    nameAr: "صفحة سياسة الخصوصية (إنجليزي)",
    descriptionEn: "Complete privacy policy page with hero, 5 content sections, and contact footer - English version - matches static page exactly",
    descriptionAr: "صفحة كاملة لسياسة الخصوصية مع قسم رئيسي و5 أقسام محتوى وتذييل تواصل - النسخة الإنجليزية - تطابق الصفحة الثابتة",
    category: "complex",
    thumbnail: "/modern-school-exterior.png",
    tags: ["privacy", "policy", "legal", "full-page", "english"],
    blocks: [
      // Hero with Shield icon styling
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "Privacy Policy",
        subtitle: "We respect your privacy and are committed to protecting your personal data",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600",
        },
      },
      // Section 1: Information We Collect
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Information We Collect",
        },
        content: `We collect the following information when you use our services:

• Personal Information: Name, address, phone number, email
• Student Information: Date of birth, national ID, relevant medical information
• Employment Information: Resume, qualifications, previous experience
• Usage Information: How you interact with our website and services`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 2: How We Use Your Information
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "How We Use Your Information",
        },
        content: `We use the information we collect for the following purposes:

• Providing educational and rehabilitation services
• Communicating with you about services and programs
• Processing employment and service requests
• Improving the quality of our services and developing our programs
• Complying with legal and regulatory requirements`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 3: Data Protection
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Data Protection",
        },
        content: `We take strict security measures to protect your information:

• Data encryption during transmission and storage
• Limited access to authorized personnel only
• Regular security reviews and system updates
• Compliance with ISO 9001:2015 standards
• Regular data backups`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 4: Information Sharing
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Information Sharing",
        },
        content: `We do not share your personal information with third parties except in the following cases:

• With your explicit consent
• When necessary to provide requested services
• To comply with laws and regulations
• To protect our rights and the safety of others
• With trusted service providers who commit to data protection`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 5: Your Rights
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Your Rights",
        },
        content: `You have the following rights regarding your personal information:

• Access your personal information
• Correct inaccurate information
• Request deletion of your information
• Object to processing of your information
• Request data portability
• Withdraw your consent at any time`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Contact Footer with gradient
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "Contact Us",
          description: "If you have any questions about our privacy policy, please contact us:",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District, Jordan",
          phone: "4122002 / 4122003",
          email: "info@namothajia.com",
        },
        showForm: false,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl mx-4 md:mx-auto max-w-4xl",
        },
      },
    ],
  },

  // --- TERMS & CONDITIONS PAGE TEMPLATES ---

  // Terms & Conditions Full Page - Arabic
  // Matches static page: /app/(root)/terms/page.tsx
  // 6 sections: Acceptance, Services, User Responsibilities, Fees, Liability, Intellectual Property
  {
    id: "terms-conditions-page-ar",
    nameEn: "Terms & Conditions Page (Arabic)",
    nameAr: "صفحة الشروط والأحكام (عربي)",
    descriptionEn: "Complete terms and conditions page with hero, 6 content sections, and contact footer - Arabic version - matches static page exactly",
    descriptionAr: "صفحة كاملة للشروط والأحكام مع قسم رئيسي و6 أقسام محتوى وتذييل تواصل - النسخة العربية - تطابق الصفحة الثابتة",
    category: "complex",
    thumbnail: "/modern-school-exterior.png",
    tags: ["terms", "conditions", "legal", "full-page", "arabic"],
    blocks: [
      // Hero with Scale icon styling (purple-pink-orange gradient)
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "الشروط والأحكام",
        subtitle: "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
        },
      },
      // Section 1: Acceptance of Terms
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "قبول الشروط",
        },
        content: `باستخدامك لخدمات المدرسة النموذجية للتربية الخاصة، فإنك توافق على الالتزام بهذه الشروط والأحكام:

• هذه الشروط تشكل اتفاقية ملزمة قانونياً بينك وبين المدرسة
• إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا
• نحتفظ بالحق في تعديل هذه الشروط في أي وقت
• استمرارك في استخدام الخدمات يعني موافقتك على الشروط المحدثة`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 2: Services Provided
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "الخدمات المقدمة",
        },
        content: `نقدم مجموعة شاملة من الخدمات التعليمية والتأهيلية:

• برامج تعليمية متخصصة لذوي الإعاقة
• خدمات العلاج الطبيعي والوظيفي
• خدمات النطق واللغة
• الإرشاد النفسي والاجتماعي
• برامج التأهيل المهني
• خدمات الإقامة الداخلية`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 3: User Responsibilities
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "مسؤوليات المستخدم",
        },
        content: `عند استخدام خدماتنا، فإنك توافق على:

• تقديم معلومات دقيقة وصحيحة
• الالتزام بسياسات وإجراءات المدرسة
• احترام حقوق الآخرين وخصوصيتهم
• عدم إساءة استخدام الخدمات أو المرافق
• دفع الرسوم المستحقة في الوقت المحدد
• الإبلاغ عن أي مشاكل أو مخاوف فوراً`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 4: Fees and Payment
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "الرسوم والدفع",
        },
        content: `شروط الرسوم والدفع:

• يتم تحديد الرسوم بناءً على نوع الخدمة والبرنامج
• يجب دفع الرسوم في المواعيد المحددة
• قد تطبق رسوم إضافية على الخدمات الخاصة
• سياسة الاسترداد تخضع لشروط محددة
• نحتفظ بالحق في تعديل الرسوم مع إشعار مسبق`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 5: Limitation of Liability
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "حدود المسؤولية",
        },
        content: `نلتزم بتقديم أفضل الخدمات، ولكن:

• لا نضمن نتائج محددة للبرامج التعليمية
• لا نتحمل المسؤولية عن الأضرار غير المباشرة
• مسؤوليتنا محدودة بقيمة الخدمات المدفوعة
• نحتفظ بالحق في تعليق الخدمات في حالات معينة
• نلتزم بمعايير ISO 9001:2015 في جميع خدماتنا`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 6: Intellectual Property
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "الملكية الفكرية",
        },
        content: `جميع المحتويات والمواد محمية بحقوق الملكية الفكرية:

• المواد التعليمية والبرامج ملك للمدرسة
• لا يجوز نسخ أو توزيع المواد دون إذن
• الشعارات والعلامات التجارية محمية قانونياً
• يحظر استخدام محتوى الموقع لأغراض تجارية
• نحتفظ بجميع الحقوق غير الممنوحة صراحة`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Contact Footer with gradient
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
          description: "إذا كان لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا:",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
          phone: "4122002 / 4122003",
          email: "info@namothajia.com",
        },
        showForm: false,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl mx-4 md:mx-auto max-w-4xl",
        },
      },
    ],
  },

  // Terms & Conditions Full Page - English
  // Matches static page: /app/(root)/terms/page.tsx
  // 6 sections: Acceptance, Services, User Responsibilities, Fees, Liability, Intellectual Property
  {
    id: "terms-conditions-page-en",
    nameEn: "Terms & Conditions Page (English)",
    nameAr: "صفحة الشروط والأحكام (إنجليزي)",
    descriptionEn: "Complete terms and conditions page with hero, 6 content sections, and contact footer - English version - matches static page exactly",
    descriptionAr: "صفحة كاملة للشروط والأحكام مع قسم رئيسي و6 أقسام محتوى وتذييل تواصل - النسخة الإنجليزية - تطابق الصفحة الثابتة",
    category: "complex",
    thumbnail: "/modern-school-exterior.png",
    tags: ["terms", "conditions", "legal", "full-page", "english"],
    blocks: [
      // Hero with Scale icon styling (purple-pink-orange gradient)
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "Terms & Conditions",
        subtitle: "Please read these terms and conditions carefully before using our services",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
        },
      },
      // Section 1: Acceptance of Terms
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Acceptance of Terms",
        },
        content: `By using the services of Al-Namothajia School for Special Education, you agree to comply with these terms and conditions:

• These terms constitute a legally binding agreement between you and the school
• If you do not agree to any of these terms, please do not use our services
• We reserve the right to modify these terms at any time
• Your continued use of the services means your acceptance of the updated terms`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 2: Services Provided
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Services Provided",
        },
        content: `We provide a comprehensive range of educational and rehabilitation services:

• Specialized educational programs for people with disabilities
• Physical and occupational therapy services
• Speech and language services
• Psychological and social counseling
• Vocational rehabilitation programs
• Residential services`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 3: User Responsibilities
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "User Responsibilities",
        },
        content: `When using our services, you agree to:

• Provide accurate and correct information
• Comply with school policies and procedures
• Respect the rights and privacy of others
• Not misuse services or facilities
• Pay fees on time
• Report any problems or concerns immediately`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 4: Fees and Payment
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Fees and Payment",
        },
        content: `Terms of fees and payment:

• Fees are determined based on the type of service and program
• Fees must be paid on the specified dates
• Additional fees may apply for special services
• Refund policy is subject to specific conditions
• We reserve the right to modify fees with prior notice`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 5: Limitation of Liability
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Limitation of Liability",
        },
        content: `We are committed to providing the best services, but:

• We do not guarantee specific results for educational programs
• We are not responsible for indirect damages
• Our liability is limited to the value of paid services
• We reserve the right to suspend services in certain cases
• We comply with ISO 9001:2015 standards in all our services`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Section 6: Intellectual Property
      {
        id: crypto.randomUUID(),
        kind: "rich-text",
        header: {
          title: "Intellectual Property",
        },
        content: `All content and materials are protected by intellectual property rights:

• Educational materials and programs are owned by the school
• Materials may not be copied or distributed without permission
• Logos and trademarks are legally protected
• Use of website content for commercial purposes is prohibited
• We reserve all rights not expressly granted`,
        blockStyles: {
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#ffffff",
          className: "rounded-2xl shadow-lg mx-4 md:mx-auto max-w-4xl",
        },
      },
      // Contact Footer with gradient
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "Contact Us",
          description: "If you have any questions about the terms and conditions, please contact us:",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District, Jordan",
          phone: "4122002 / 4122003",
          email: "info@namothajia.com",
        },
        showForm: false,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl mx-4 md:mx-auto max-w-4xl",
        },
      },
    ],
  },

  // --- JOBS LISTING PAGE TEMPLATES ---

  // Jobs Page Full - Arabic
  {
    id: "jobs-page-ar",
    nameEn: "Jobs Listing Page (Arabic)",
    nameAr: "صفحة الوظائف المتاحة (عربي)",
    descriptionEn: "Complete jobs listing page with hero, job cards, and CTA - Arabic version",
    descriptionAr: "صفحة كاملة لقائمة الوظائف مع قسم رئيسي وبطاقات الوظائف ودعوة للعمل - النسخة العربية",
    category: "complex",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["jobs", "careers", "employment", "full-page", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "فرص التوظيف",
        subtitle: "انضم إلى فريقنا التعليمي المتميز وكن جزءاً من رسالتنا في تقديم تعليم نوعي",
        primaryCtaLabel: "تصفح الوظائف",
        primaryCtaHref: "#jobs",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          title: "الوظائف المتاحة",
        },
        emptyStateMessage: "لا توجد وظائف متاحة حالياً. يرجى المراجعة لاحقاً",
        items: [],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "لم تجد الوظيفة المناسبة؟",
        text: "يمكنك إرسال سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة",
        primaryCtaLabel: "إرسال السيرة الذاتية",
        primaryCtaHref: "/jobs/employment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // Jobs Page Full - English
  {
    id: "jobs-page-en",
    nameEn: "Jobs Listing Page (English)",
    nameAr: "صفحة الوظائف المتاحة (إنجليزي)",
    descriptionEn: "Complete jobs listing page with hero, job cards, and CTA - English version",
    descriptionAr: "صفحة كاملة لقائمة الوظائف مع قسم رئيسي وبطاقات الوظائف ودعوة للعمل - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["jobs", "careers", "employment", "full-page", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "Employment Opportunities",
        subtitle: "Join our distinguished educational team and be part of our mission to provide quality education",
        primaryCtaLabel: "Browse Jobs",
        primaryCtaHref: "#jobs",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          title: "Available Positions",
        },
        emptyStateMessage: "No jobs available currently. Please check back later",
        items: [],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "Didn't Find the Right Job?",
        text: "You can send your CV and we'll contact you when a suitable opportunity arises",
        primaryCtaLabel: "Send Your CV",
        primaryCtaHref: "/jobs/employment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // --- SERVICE REQUEST PAGE TEMPLATES ---

  // Service Request Page Full - Arabic
  {
    id: "service-request-page-ar",
    nameEn: "Service Request Page (Arabic)",
    nameAr: "صفحة طلب الخدمة (عربي)",
    descriptionEn: "Complete service request page with hero, info cards, and form - Arabic version",
    descriptionAr: "صفحة كاملة لطلب الخدمة مع قسم رئيسي وبطاقات معلومات ونموذج - النسخة العربية",
    category: "complex",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["service", "request", "form", "full-page", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "طلب الخدمة",
        subtitle: "نحن هنا لخدمتك. قدم طلبك وسنتواصل معك في أقرب وقت",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "لماذا تختارنا",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "clipboard",
            title: "سهولة التقديم",
            description: "نموذج بسيط وسريع لتقديم طلبك",
          },
          {
            id: crypto.randomUUID(),
            icon: "phone",
            title: "تواصل سريع",
            description: "رد خلال 24 ساعة على جميع الطلبات",
          },
          {
            id: crypto.randomUUID(),
            icon: "check-circle",
            title: "خدمة مميزة",
            description: "فريق متخصص ومحترف لخدمتك",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "services-list",
        header: {
          title: "خدماتنا المتاحة",
          description: "اختر الخدمة التي تناسب احتياجاتك",
        },
        layout: "grid",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "book",
            title: "التقييم التربوي",
            description: "تقييم شامل للقدرات التعليمية",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            title: "العلاج الوظيفي",
            description: "تحسين المهارات الحركية والوظيفية",
          },
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "العلاج الطبيعي",
            description: "إعادة التأهيل والعلاج الحركي",
          },
          {
            id: crypto.randomUUID(),
            icon: "message-circle",
            title: "علاج النطق واللغة",
            description: "تحسين مهارات التواصل والنطق",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "التأهيل المهني",
            description: "إعداد الطلاب لسوق العمل",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "الدعم النفسي",
            description: "الإرشاد والدعم النفسي المتخصص",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Service Request Page Full - English
  {
    id: "service-request-page-en",
    nameEn: "Service Request Page (English)",
    nameAr: "صفحة طلب الخدمة (إنجليزي)",
    descriptionEn: "Complete service request page with hero, info cards, and form - English version",
    descriptionAr: "صفحة كاملة لطلب الخدمة مع قسم رئيسي وبطاقات معلومات ونموذج - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["service", "request", "form", "full-page", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "Service Request",
        subtitle: "We are here to serve you. Submit your request and we will contact you soon",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "Why Choose Us",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "clipboard",
            title: "Easy Application",
            description: "Simple and quick form to submit your request",
          },
          {
            id: crypto.randomUUID(),
            icon: "phone",
            title: "Quick Response",
            description: "Reply within 24 hours on all requests",
          },
          {
            id: crypto.randomUUID(),
            icon: "check-circle",
            title: "Premium Service",
            description: "Specialized professional team to serve you",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "services-list",
        header: {
          title: "Our Available Services",
          description: "Choose the service that suits your needs",
        },
        layout: "grid",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "book",
            title: "Educational Assessment",
            description: "Comprehensive educational abilities assessment",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            title: "Occupational Therapy",
            description: "Improving motor and functional skills",
          },
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "Physical Therapy",
            description: "Rehabilitation and motor therapy",
          },
          {
            id: crypto.randomUUID(),
            icon: "message-circle",
            title: "Speech & Language Therapy",
            description: "Improving communication and speech skills",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "Vocational Rehabilitation",
            description: "Preparing students for the job market",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "Psychological Support",
            description: "Specialized psychological counseling and support",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "Contact Us",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "Sunday - Thursday: 7:00 AM - 3:00 PM",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // --- EMPLOYMENT APPLICATION PAGE TEMPLATES ---

  // Employment Application Page - Arabic
  {
    id: "employment-application-page-ar",
    nameEn: "Employment Application Page (Arabic)",
    nameAr: "صفحة طلب التوظيف (عربي)",
    descriptionEn: "Complete employment application page with hero slider, benefits, and jobs list - Arabic version",
    descriptionAr: "صفحة كاملة لطلب التوظيف مع سلايدر وفوائد وقائمة الوظائف - النسخة العربية",
    category: "complex",
    thumbnail: "/modern-special-education-school-building-exterior-.jpg",
    tags: ["employment", "application", "jobs", "careers", "full-page", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "فرص التوظيف",
            subtitle: "انضم إلى فريقنا",
            description: "انضم إلى فريقنا المتميز وكن جزءاً من رؤيتنا التعليمية",
            imageUrl: "/modern-special-education-school-building-exterior-.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "نبحث عن المتميزين",
            subtitle: "بيئة عمل محفزة",
            description: "نوفر بيئة عمل محفزة ومكافآت تنافسية",
            imageUrl: "/happy-special-needs-students-learning-together-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "طور مهاراتك معنا",
            subtitle: "فرص تدريب مستمرة",
            description: "فرص تدريب وتطوير مستمرة لجميع أعضاء الفريق",
            imageUrl: "/modern-special-education-school-facilities-with-ad.jpg",
          },
        ],
        autoplay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "60vh",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "لماذا تنضم إلينا؟",
          description: "مميزات العمل في المدرسة النموذجية",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "بيئة عمل داعمة",
            description: "بيئة عمل إيجابية تشجع على الإبداع والتطوير",
          },
          {
            id: crypto.randomUUID(),
            icon: "trending-up",
            title: "فرص للنمو",
            description: "فرص تدريب وتطوير مهني مستمرة",
          },
          {
            id: crypto.randomUUID(),
            icon: "award",
            title: "رواتب تنافسية",
            description: "حزمة رواتب ومزايا تنافسية",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "فريق متميز",
            description: "العمل مع فريق من المحترفين المتميزين",
          },
          {
            id: crypto.randomUUID(),
            icon: "star",
            title: "تأثير إيجابي",
            description: "المساهمة في صنع فرق في حياة الطلاب",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "استقرار وظيفي",
            description: "أمان وظيفي واستقرار مهني",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          title: "الوظائف المتاحة",
          description: "اختر الوظيفة المناسبة لك",
        },
        emptyStateMessage: "لا توجد وظائف متاحة حالياً",
        items: [],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "جاهز للانضمام؟",
        text: "املأ نموذج التقديم وسنتواصل معك في أقرب وقت",
        primaryCtaLabel: "قدم الآن",
        primaryCtaHref: "#application-form",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "bg-gradient-to-r from-primary via-accent to-primary",
        },
      },
    ],
  },

  // Employment Application Page - English
  {
    id: "employment-application-page-en",
    nameEn: "Employment Application Page (English)",
    nameAr: "صفحة طلب التوظيف (إنجليزي)",
    descriptionEn: "Complete employment application page with hero slider, benefits, and jobs list - English version",
    descriptionAr: "صفحة كاملة لطلب التوظيف مع سلايدر وفوائد وقائمة الوظائف - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/modern-special-education-school-building-exterior-.jpg",
    tags: ["employment", "application", "jobs", "careers", "full-page", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "Employment Opportunities",
            subtitle: "Join Our Team",
            description: "Join our distinguished team and be part of our educational vision",
            imageUrl: "/modern-special-education-school-building-exterior-.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "We're Looking For Excellence",
            subtitle: "Motivating Environment",
            description: "We provide a motivating work environment and competitive rewards",
            imageUrl: "/happy-special-needs-students-learning-together-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Develop Your Skills With Us",
            subtitle: "Continuous Training",
            description: "Continuous training and development opportunities for all team members",
            imageUrl: "/modern-special-education-school-facilities-with-ad.jpg",
          },
        ],
        autoplay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "60vh",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "Why Join Us?",
          description: "Benefits of working at Al-Namothajia School",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "Supportive Environment",
            description: "Positive work environment that encourages creativity and development",
          },
          {
            id: crypto.randomUUID(),
            icon: "trending-up",
            title: "Growth Opportunities",
            description: "Continuous professional training and development opportunities",
          },
          {
            id: crypto.randomUUID(),
            icon: "award",
            title: "Competitive Salaries",
            description: "Competitive salary and benefits package",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "Distinguished Team",
            description: "Work with a team of distinguished professionals",
          },
          {
            id: crypto.randomUUID(),
            icon: "star",
            title: "Positive Impact",
            description: "Contribute to making a difference in students' lives",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "Job Stability",
            description: "Job security and career stability",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          title: "Available Positions",
          description: "Choose the right position for you",
        },
        emptyStateMessage: "No jobs available currently",
        items: [],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "Ready to Join?",
        text: "Fill out the application form and we'll contact you soon",
        primaryCtaLabel: "Apply Now",
        primaryCtaHref: "#application-form",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "bg-gradient-to-r from-primary via-accent to-primary",
        },
      },
    ],
  },

  // --- MEDICAL DEPARTMENT PAGE TEMPLATES ---

  // Medical Department Page - Arabic
  {
    id: "medical-department-page-ar",
    nameEn: "Medical Department Page (Arabic)",
    nameAr: "صفحة القسم الطبي (عربي)",
    descriptionEn: "Complete medical department page with hero slider, welcome, subsections, and CTA - Arabic version",
    descriptionAr: "صفحة كاملة للقسم الطبي مع سلايدر وترحيب وأقسام فرعية ودعوة للعمل - النسخة العربية",
    category: "complex",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["department", "medical", "health", "full-page", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "العيادة الطبية",
            subtitle: "صحة طلابنا أولويتنا",
            description: "عيادة مجهزة بأحدث المعدات الطبية",
            imageUrl: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
            badgeText: "القسم الطبي",
          },
          {
            id: crypto.randomUUID(),
            title: "الصيدلية",
            subtitle: "رعاية شاملة",
            description: "صيدلية شاملة لجميع احتياجات الطلاب الدوائية",
            imageUrl: "/school-pharmacy-with-organized-medications-and-pha.jpg",
            badgeText: "القسم الطبي",
          },
          {
            id: crypto.randomUUID(),
            title: "المتابعة الصحية",
            subtitle: "على مدار الساعة",
            description: "وحدة عناية مركزة للمتابعة الصحية على مدار الساعة",
            imageUrl: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
            badgeText: "القسم الطبي",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "90vh",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-welcome",
        icon: "stethoscope",
        title: "مرحباً بكم في القسم الطبي - صحة طلابنا أولويتنا",
        description: "يتميز القسم الطبي بكوادر طبية ذوي كفاءات عالية من أطباء وممرضين متواجدين على مدار الساعة، مع معدات طبية شاملة لجميع الحالات الطارئة واليومية، وسيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية.",
        stats: [
          {
            id: crypto.randomUUID(),
            value: "3+",
            label: "قسم فرعي",
          },
          {
            id: crypto.randomUUID(),
            value: "24/7",
            label: "خدمة مستمرة",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "التزام بالجودة",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-subsections",
        header: {
          title: "استكشف خدماتنا",
          description: "الأقسام الفرعية",
        },
        departmentColor: "from-red-600 via-rose-600 to-pink-600",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "stethoscope",
            titleAr: "العيادة",
            titleEn: "Clinic",
            descriptionAr: "قسم طبي مجهز بكوادر طبية ذوي كفاءات متواجدين على مدار الساعة",
            descriptionEn: "Medical section equipped with qualified staff available 24/7",
            detailedDescriptionAr: "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)، وفيها معدات طبية شاملة لجميع الحالات الطارئة واليومية، ويتوفر فيها سيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية على مدار الساعة.",
            detailedDescriptionEn: "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7), comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies available 24/7.",
            image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            icon: "pill",
            titleAr: "الصيدلية",
            titleEn: "Pharmacy",
            descriptionAr: "جميع الأدوية التي يحتاجها الطلاب مصنفة ومحفوظة إلكترونياً",
            descriptionEn: "All medications needed by students classified and stored electronically",
            detailedDescriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً.",
            detailedDescriptionEn: "The pharmacy contains all medications needed by students, classified by student name, and stored electronically.",
            image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            titleAr: "المتابعة الصحية",
            titleEn: "Health Monitoring",
            descriptionAr: "وحدة عناية مركزة للمتابعة والمراقبة الصحية على مدار الساعة",
            descriptionEn: "Intensive care unit for health monitoring 24/7",
            detailedDescriptionAr: "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
            detailedDescriptionEn: "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
            image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
          },
        ],
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-cta",
        title: "هل لديك استفسار؟",
        description: "نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في اختيار البرنامج المناسب لاحتياجاتكم",
        primaryButtonLabel: "تواصل معنا الآن",
        primaryButtonHref: "#contact",
        secondaryButtonLabel: "العودة للرئيسية",
        secondaryButtonHref: "/",
        contactInfo: {
          phone: "4122002",
          email: "info@namothajia.com",
          address: "عمان، الأردن",
        },
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
    ],
  },

  // Medical Department Page - English
  {
    id: "medical-department-page-en",
    nameEn: "Medical Department Page (English)",
    nameAr: "صفحة القسم الطبي (إنجليزي)",
    descriptionEn: "Complete medical department page with hero slider, welcome, subsections, and CTA - English version",
    descriptionAr: "صفحة كاملة للقسم الطبي مع سلايدر وترحيب وأقسام فرعية ودعوة للعمل - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["department", "medical", "health", "full-page", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "Medical Clinic",
            subtitle: "Our Students' Health is Our Priority",
            description: "Clinic equipped with the latest medical equipment",
            imageUrl: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
            badgeText: "Medical Department",
          },
          {
            id: crypto.randomUUID(),
            title: "Pharmacy",
            subtitle: "Comprehensive Care",
            description: "Comprehensive pharmacy for all students' medication needs",
            imageUrl: "/school-pharmacy-with-organized-medications-and-pha.jpg",
            badgeText: "Medical Department",
          },
          {
            id: crypto.randomUUID(),
            title: "Health Monitoring",
            subtitle: "24/7 Service",
            description: "Intensive care unit for 24/7 health monitoring",
            imageUrl: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
            badgeText: "Medical Department",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "90vh",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-welcome",
        icon: "stethoscope",
        title: "Welcome to Medical Department - Our Students' Health is Our Priority",
        description: "The Medical Department features highly qualified medical staff of doctors and nurses available 24/7, with comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies.",
        stats: [
          {
            id: crypto.randomUUID(),
            value: "3+",
            label: "Subsections",
          },
          {
            id: crypto.randomUUID(),
            value: "24/7",
            label: "Continuous Service",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "Quality Commitment",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-subsections",
        header: {
          title: "Explore Our Services",
          description: "Subsections",
        },
        departmentColor: "from-red-600 via-rose-600 to-pink-600",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "stethoscope",
            titleAr: "العيادة",
            titleEn: "Clinic",
            descriptionAr: "قسم طبي مجهز بكوادر طبية ذوي كفاءات متواجدين على مدار الساعة",
            descriptionEn: "Medical section equipped with qualified staff available 24/7",
            detailedDescriptionAr: "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)، وفيها معدات طبية شاملة لجميع الحالات الطارئة واليومية، ويتوفر فيها سيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية على مدار الساعة.",
            detailedDescriptionEn: "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7), comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies available 24/7.",
            image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
          },
          {
            id: crypto.randomUUID(),
            icon: "pill",
            titleAr: "الصيدلية",
            titleEn: "Pharmacy",
            descriptionAr: "جميع الأدوية التي يحتاجها الطلاب مصنفة ومحفوظة إلكترونياً",
            descriptionEn: "All medications needed by students classified and stored electronically",
            detailedDescriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً.",
            detailedDescriptionEn: "The pharmacy contains all medications needed by students, classified by student name, and stored electronically.",
            image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            titleAr: "المتابعة الصحية",
            titleEn: "Health Monitoring",
            descriptionAr: "وحدة عناية مركزة للمتابعة والمراقبة الصحية على مدار الساعة",
            descriptionEn: "Intensive care unit for health monitoring 24/7",
            detailedDescriptionAr: "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
            detailedDescriptionEn: "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
            image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
          },
        ],
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "department-cta",
        title: "Have a Question?",
        description: "We are here to answer all your questions and help you choose the right program for your needs",
        primaryButtonLabel: "Contact Us Now",
        primaryButtonHref: "#contact",
        secondaryButtonLabel: "Back to Home",
        secondaryButtonHref: "/",
        contactInfo: {
          phone: "4122002",
          email: "info@namothajia.com",
          address: "Amman, Jordan",
        },
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
    ],
  },

  // ========================================
  // INDIVIDUAL REUSABLE BLOCKS
  // ========================================

  // --- HERO BLOCKS ---

  // Legal/Policy Hero - Blue/Purple Gradient
  {
    id: "hero-legal-blue-purple",
    nameEn: "Legal Hero (Blue/Purple)",
    nameAr: "قسم رئيسي قانوني (أزرق/بنفسجي)",
    descriptionEn: "Hero section with blue to purple gradient for legal pages",
    descriptionAr: "قسم رئيسي بتدرج أزرق إلى بنفسجي للصفحات القانونية",
    category: "hero",
    thumbnail: "/modern-school-exterior.png",
    tags: ["hero", "legal", "privacy", "gradient"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "سياسة الخصوصية",
        subtitle: "نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600",
        },
      },
    ],
  },

  // Legal/Policy Hero - Purple/Pink/Orange Gradient
  {
    id: "hero-legal-purple-pink",
    nameEn: "Legal Hero (Purple/Pink)",
    nameAr: "قسم رئيسي قانوني (بنفسجي/وردي)",
    descriptionEn: "Hero section with purple to orange gradient for terms pages",
    descriptionAr: "قسم رئيسي بتدرج بنفسجي إلى برتقالي لصفحات الشروط",
    category: "hero",
    thumbnail: "/modern-school-exterior.png",
    tags: ["hero", "legal", "terms", "gradient"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "الشروط والأحكام",
        subtitle: "يرجى قراءة هذه الشروط والأحكام بعناية",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
        },
      },
    ],
  },

  // Service Hero - Emerald/Teal Gradient
  {
    id: "hero-service-emerald",
    nameEn: "Service Hero (Emerald/Teal)",
    nameAr: "قسم رئيسي للخدمات (أخضر زمردي)",
    descriptionEn: "Hero section with emerald to teal gradient for service pages",
    descriptionAr: "قسم رئيسي بتدرج أخضر زمردي لصفحات الخدمات",
    category: "hero",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["hero", "service", "gradient", "emerald"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "طلب الخدمة",
        subtitle: "نحن هنا لخدمتك. قدم طلبك وسنتواصل معك في أقرب وقت",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
        },
      },
    ],
  },

  // --- INFO CARDS BLOCKS ---

  // Service Info Cards - 3 Cards
  {
    id: "service-info-cards",
    nameEn: "Service Info Cards",
    nameAr: "بطاقات معلومات الخدمة",
    descriptionEn: "Three info cards for service pages - Easy Application, Quick Response, Premium Service",
    descriptionAr: "ثلاث بطاقات معلومات لصفحات الخدمات - سهولة التقديم، تواصل سريع، خدمة مميزة",
    category: "features",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["info", "cards", "service", "features"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "لماذا تختارنا",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "clipboard",
            title: "سهولة التقديم",
            description: "نموذج بسيط وسريع لتقديم طلبك",
          },
          {
            id: crypto.randomUUID(),
            icon: "phone",
            title: "تواصل سريع",
            description: "رد خلال 24 ساعة على جميع الطلبات",
          },
          {
            id: crypto.randomUUID(),
            icon: "check-circle",
            title: "خدمة مميزة",
            description: "فريق متخصص ومحترف لخدمتك",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Employment Benefits Cards
  {
    id: "employment-benefits-cards",
    nameEn: "Employment Benefits Cards",
    nameAr: "بطاقات مزايا التوظيف",
    descriptionEn: "Six benefit cards for employment pages",
    descriptionAr: "ست بطاقات مزايا لصفحات التوظيف",
    category: "features",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["employment", "benefits", "cards", "features"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "لماذا تنضم إلينا؟",
          description: "مميزات العمل في المدرسة النموذجية",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "بيئة عمل داعمة",
            description: "بيئة عمل إيجابية تشجع على الإبداع والتطوير",
          },
          {
            id: crypto.randomUUID(),
            icon: "trending-up",
            title: "فرص للنمو",
            description: "فرص تدريب وتطوير مهني مستمرة",
          },
          {
            id: crypto.randomUUID(),
            icon: "award",
            title: "رواتب تنافسية",
            description: "حزمة رواتب ومزايا تنافسية",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "فريق متميز",
            description: "العمل مع فريق من المحترفين المتميزين",
          },
          {
            id: crypto.randomUUID(),
            icon: "star",
            title: "تأثير إيجابي",
            description: "المساهمة في صنع فرق في حياة الطلاب",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "استقرار وظيفي",
            description: "أمان وظيفي واستقرار مهني",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5",
        },
      },
    ],
  },

  // --- SERVICE LIST BLOCKS ---

  // Available Services List - Arabic
  {
    id: "services-list-ar",
    nameEn: "Available Services List (Arabic)",
    nameAr: "قائمة الخدمات المتاحة (عربي)",
    descriptionEn: "List of available services - Educational Assessment, Therapy, etc.",
    descriptionAr: "قائمة الخدمات المتاحة - التقييم التربوي، العلاج، إلخ",
    category: "features",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["services", "list", "features", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "services-list",
        header: {
          title: "خدماتنا المتاحة",
          description: "اختر الخدمة التي تناسب احتياجاتك",
        },
        layout: "grid",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "book",
            title: "التقييم التربوي",
            description: "تقييم شامل للقدرات التعليمية",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            title: "العلاج الوظيفي",
            description: "تحسين المهارات الحركية والوظيفية",
          },
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "العلاج الطبيعي",
            description: "إعادة التأهيل والعلاج الحركي",
          },
          {
            id: crypto.randomUUID(),
            icon: "message-circle",
            title: "علاج النطق واللغة",
            description: "تحسين مهارات التواصل والنطق",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "التأهيل المهني",
            description: "إعداد الطلاب لسوق العمل",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "الدعم النفسي",
            description: "الإرشاد والدعم النفسي المتخصص",
          },
          {
            id: crypto.randomUUID(),
            icon: "graduation-cap",
            title: "البرامج التعليمية الخاصة",
            description: "برامج تعليمية مخصصة لاحتياجات كل طالب",
          },
          {
            id: crypto.randomUUID(),
            icon: "star",
            title: "الأنشطة اللامنهجية",
            description: "أنشطة ترفيهية وتطويرية متنوعة",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // Available Services List - English
  {
    id: "services-list-en",
    nameEn: "Available Services List (English)",
    nameAr: "قائمة الخدمات المتاحة (إنجليزي)",
    descriptionEn: "List of available services - Educational Assessment, Therapy, etc.",
    descriptionAr: "قائمة الخدمات المتاحة - التقييم التربوي، العلاج، إلخ",
    category: "features",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["services", "list", "features", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "services-list",
        header: {
          title: "Our Available Services",
          description: "Choose the service that suits your needs",
        },
        layout: "grid",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "book",
            title: "Educational Assessment",
            description: "Comprehensive educational abilities assessment",
          },
          {
            id: crypto.randomUUID(),
            icon: "activity",
            title: "Occupational Therapy",
            description: "Improving motor and functional skills",
          },
          {
            id: crypto.randomUUID(),
            icon: "heart",
            title: "Physical Therapy",
            description: "Rehabilitation and motor therapy",
          },
          {
            id: crypto.randomUUID(),
            icon: "message-circle",
            title: "Speech & Language Therapy",
            description: "Improving communication and speech skills",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "Vocational Rehabilitation",
            description: "Preparing students for the job market",
          },
          {
            id: crypto.randomUUID(),
            icon: "users",
            title: "Psychological Support",
            description: "Specialized psychological counseling and support",
          },
          {
            id: crypto.randomUUID(),
            icon: "graduation-cap",
            title: "Special Education Programs",
            description: "Customized educational programs for each student's needs",
          },
          {
            id: crypto.randomUUID(),
            icon: "star",
            title: "Extracurricular Activities",
            description: "Various recreational and developmental activities",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // --- CTA BLOCKS ---

  // Jobs Alternative CTA - Arabic
  {
    id: "jobs-alternative-cta-ar",
    nameEn: "Jobs Alternative CTA (Arabic)",
    nameAr: "دعوة بديلة للتوظيف (عربي)",
    descriptionEn: "CTA for when users don't find the right job - send CV",
    descriptionAr: "دعوة للعمل عندما لا يجد المستخدم الوظيفة المناسبة - إرسال السيرة الذاتية",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["cta", "jobs", "employment", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "لم تجد الوظيفة المناسبة؟",
        text: "يمكنك إرسال سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة",
        primaryCtaLabel: "إرسال السيرة الذاتية",
        primaryCtaHref: "/jobs/employment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // Jobs Alternative CTA - English
  {
    id: "jobs-alternative-cta-en",
    nameEn: "Jobs Alternative CTA (English)",
    nameAr: "دعوة بديلة للتوظيف (إنجليزي)",
    descriptionEn: "CTA for when users don't find the right job - send CV",
    descriptionAr: "دعوة للعمل عندما لا يجد المستخدم الوظيفة المناسبة - إرسال السيرة الذاتية",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["cta", "jobs", "employment", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "Didn't Find the Right Job?",
        text: "You can send your CV and we'll contact you when a suitable opportunity arises",
        primaryCtaLabel: "Send Your CV",
        primaryCtaHref: "/jobs/employment",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },

  // Ready to Join CTA - Arabic
  {
    id: "ready-to-join-cta-ar",
    nameEn: "Ready to Join CTA (Arabic)",
    nameAr: "جاهز للانضمام (عربي)",
    descriptionEn: "CTA encouraging users to apply for employment",
    descriptionAr: "دعوة للعمل لتشجيع التقديم على الوظائف",
    category: "cta",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["cta", "employment", "apply", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "جاهز للانضمام؟",
        text: "املأ نموذج التقديم وسنتواصل معك في أقرب وقت",
        primaryCtaLabel: "قدم الآن",
        primaryCtaHref: "#application-form",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "bg-gradient-to-r from-primary via-accent to-primary",
        },
      },
    ],
  },

  // Ready to Join CTA - English
  {
    id: "ready-to-join-cta-en",
    nameEn: "Ready to Join CTA (English)",
    nameAr: "جاهز للانضمام (إنجليزي)",
    descriptionEn: "CTA encouraging users to apply for employment",
    descriptionAr: "دعوة للعمل لتشجيع التقديم على الوظائف",
    category: "cta",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["cta", "employment", "apply", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "cta-strip",
        title: "Ready to Join?",
        text: "Fill out the application form and we'll contact you soon",
        primaryCtaLabel: "Apply Now",
        primaryCtaHref: "#application-form",
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "bg-gradient-to-r from-primary via-accent to-primary",
        },
      },
    ],
  },

  // ========================================
  // ADDITIONAL DEPARTMENT PAGE TEMPLATES
  // ========================================

  // --- SCIENCE DEPARTMENT PAGE TEMPLATES ---

  // Science Department Page - Arabic
  {
    id: "science-department-page-ar",
    nameEn: "Science Department Page (Arabic)",
    nameAr: "صفحة القسم العلمي (عربي)",
    descriptionEn: "Complete science department page with hero slider and feature cards - Arabic version",
    descriptionAr: "صفحة كاملة للقسم العلمي مع سلايدر وبطاقات الميزات - النسخة العربية",
    category: "complex",
    thumbnail: "/science-and-mathematics-classroom-with-modern-tech.jpg",
    tags: ["department", "science", "education", "full-page", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "القسم العلمي",
            subtitle: "تعليم العلوم والرياضيات",
            description: "تعليم العلوم والرياضيات بأحدث الأساليب التعليمية",
            imageUrl: "/science-and-mathematics-classroom-with-modern-tech.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "مختبرات علمية متطورة",
            subtitle: "أحدث الأجهزة العلمية",
            description: "مختبرات مجهزة بأحدث الأجهزة العلمية",
            imageUrl: "/students-in-science-lab-doing-experiments.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "تعليم تفاعلي",
            subtitle: "أساليب تعليمية حديثة",
            description: "أساليب تعليمية تفاعلية لتعزيز الفهم العلمي",
            imageUrl: "/mathematics-and-physics-classroom.jpg",
          },
        ],
        autoplay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "500px",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "section-header",
        title: "القسم العلمي",
        subtitle: "تعليم العلوم والرياضيات بأحدث الأساليب",
        align: "center",
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "2rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "microscope",
            title: "مختبرات حديثة",
            description: "مختبرات علمية مجهزة بأحدث الأجهزة",
          },
          {
            id: crypto.randomUUID(),
            icon: "atom",
            title: "تجارب عملية",
            description: "تجارب علمية عملية لتعزيز الفهم",
          },
          {
            id: crypto.randomUUID(),
            icon: "flask-conical",
            title: "كيمياء وفيزياء",
            description: "تدريس الكيمياء والفيزياء بطرق تفاعلية",
          },
          {
            id: crypto.randomUUID(),
            icon: "calculator",
            title: "رياضيات متقدمة",
            description: "برامج رياضيات متقدمة لجميع المستويات",
          },
        ],
        blockStyles: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // Science Department Page - English
  {
    id: "science-department-page-en",
    nameEn: "Science Department Page (English)",
    nameAr: "صفحة القسم العلمي (إنجليزي)",
    descriptionEn: "Complete science department page with hero slider and feature cards - English version",
    descriptionAr: "صفحة كاملة للقسم العلمي مع سلايدر وبطاقات الميزات - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/science-and-mathematics-classroom-with-modern-tech.jpg",
    tags: ["department", "science", "education", "full-page", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "Science Department",
            subtitle: "Science and Mathematics Education",
            description: "Teaching science and mathematics with the latest educational methods",
            imageUrl: "/science-and-mathematics-classroom-with-modern-tech.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Advanced Science Labs",
            subtitle: "Latest Scientific Equipment",
            description: "Laboratories equipped with the latest scientific equipment",
            imageUrl: "/students-in-science-lab-doing-experiments.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Interactive Learning",
            subtitle: "Modern Teaching Methods",
            description: "Interactive teaching methods to enhance scientific understanding",
            imageUrl: "/mathematics-and-physics-classroom.jpg",
          },
        ],
        autoplay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "500px",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "section-header",
        title: "Science Department",
        subtitle: "Teaching science and mathematics with the latest methods",
        align: "center",
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "2rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "microscope",
            title: "Modern Labs",
            description: "Scientific laboratories equipped with the latest devices",
          },
          {
            id: crypto.randomUUID(),
            icon: "atom",
            title: "Practical Experiments",
            description: "Practical scientific experiments to enhance understanding",
          },
          {
            id: crypto.randomUUID(),
            icon: "flask-conical",
            title: "Chemistry & Physics",
            description: "Teaching chemistry and physics with interactive methods",
          },
          {
            id: crypto.randomUUID(),
            icon: "calculator",
            title: "Advanced Mathematics",
            description: "Advanced mathematics programs for all levels",
          },
        ],
        blockStyles: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // --- EXPERIMENTAL DEPARTMENT PAGE TEMPLATES ---

  // Experimental Department Page - Arabic
  {
    id: "experimental-department-page-ar",
    nameEn: "Experimental Department Page (Arabic)",
    nameAr: "صفحة القسم التجريبي (عربي)",
    descriptionEn: "Complete experimental department page with hero slider and feature cards - Arabic version",
    descriptionAr: "صفحة كاملة للقسم التجريبي مع سلايدر وبطاقات الميزات - النسخة العربية",
    category: "complex",
    thumbnail: "/innovative-experimental-learning-classroom.jpg",
    tags: ["department", "experimental", "innovation", "full-page", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "القسم التجريبي",
            subtitle: "الابتكار والإبداع",
            description: "الابتكار والإبداع في التعليم الحديث",
            imageUrl: "/innovative-experimental-learning-classroom.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "مشاريع إبداعية",
            subtitle: "التفكير الإبداعي",
            description: "تشجيع الطلاب على التفكير الإبداعي والابتكار",
            imageUrl: "/students-working-on-creative-projects.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "تقنيات متقدمة",
            subtitle: "أحدث التقنيات",
            description: "استخدام أحدث التقنيات في العملية التعليمية",
            imageUrl: "/modern-technology-in-education.jpg",
          },
        ],
        autoplay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "500px",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "section-header",
        title: "القسم التجريبي",
        subtitle: "الابتكار والإبداع في التعليم",
        align: "center",
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "2rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "lightbulb",
            title: "أفكار مبتكرة",
            description: "تشجيع الطلاب على التفكير الإبداعي",
          },
          {
            id: crypto.randomUUID(),
            icon: "rocket",
            title: "مشاريع تجريبية",
            description: "مشاريع تجريبية لتطبيق المعرفة",
          },
          {
            id: crypto.randomUUID(),
            icon: "sparkles",
            title: "تقنيات حديثة",
            description: "استخدام أحدث التقنيات في التعليم",
          },
          {
            id: crypto.randomUUID(),
            icon: "zap",
            title: "تعلم تفاعلي",
            description: "أساليب تعليمية تفاعلية ومبتكرة",
          },
        ],
        blockStyles: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // Experimental Department Page - English
  {
    id: "experimental-department-page-en",
    nameEn: "Experimental Department Page (English)",
    nameAr: "صفحة القسم التجريبي (إنجليزي)",
    descriptionEn: "Complete experimental department page with hero slider and feature cards - English version",
    descriptionAr: "صفحة كاملة للقسم التجريبي مع سلايدر وبطاقات الميزات - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/innovative-experimental-learning-classroom.jpg",
    tags: ["department", "experimental", "innovation", "full-page", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "Experimental Department",
            subtitle: "Innovation and Creativity",
            description: "Innovation and creativity in modern education",
            imageUrl: "/innovative-experimental-learning-classroom.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Creative Projects",
            subtitle: "Creative Thinking",
            description: "Encouraging students to think creatively and innovate",
            imageUrl: "/students-working-on-creative-projects.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Advanced Technologies",
            subtitle: "Latest Technologies",
            description: "Using the latest technologies in the educational process",
            imageUrl: "/modern-technology-in-education.jpg",
          },
        ],
        autoplay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "500px",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "section-header",
        title: "Experimental Department",
        subtitle: "Innovation and creativity in education",
        align: "center",
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "2rem",
        },
      },
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "lightbulb",
            title: "Innovative Ideas",
            description: "Encouraging students to think creatively",
          },
          {
            id: crypto.randomUUID(),
            icon: "rocket",
            title: "Experimental Projects",
            description: "Experimental projects to apply knowledge",
          },
          {
            id: crypto.randomUUID(),
            icon: "sparkles",
            title: "Modern Technologies",
            description: "Using the latest technologies in education",
          },
          {
            id: crypto.randomUUID(),
            icon: "zap",
            title: "Interactive Learning",
            description: "Interactive and innovative teaching methods",
          },
        ],
        blockStyles: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // ========================================
  // ADDITIONAL INDIVIDUAL BLOCKS
  // ========================================

  // --- HERO BLOCKS ---

  // Jobs Hero - Cyan/Blue Gradient - Arabic
  {
    id: "hero-jobs-cyan-ar",
    nameEn: "Jobs Hero (Cyan/Blue) - Arabic",
    nameAr: "قسم رئيسي للوظائف (سماوي/أزرق) - عربي",
    descriptionEn: "Hero section with cyan to blue gradient for jobs pages - Arabic",
    descriptionAr: "قسم رئيسي بتدرج سماوي إلى أزرق لصفحات الوظائف - عربي",
    category: "hero",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["hero", "jobs", "careers", "gradient", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "فرص التوظيف",
        subtitle: "انضم إلى فريقنا التعليمي المتميز وكن جزءاً من رسالتنا",
        primaryCtaLabel: "تصفح الوظائف",
        primaryCtaHref: "#jobs",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600",
        },
      },
    ],
  },

  // Jobs Hero - Cyan/Blue Gradient - English
  {
    id: "hero-jobs-cyan-en",
    nameEn: "Jobs Hero (Cyan/Blue) - English",
    nameAr: "قسم رئيسي للوظائف (سماوي/أزرق) - إنجليزي",
    descriptionEn: "Hero section with cyan to blue gradient for jobs pages - English",
    descriptionAr: "قسم رئيسي بتدرج سماوي إلى أزرق لصفحات الوظائف - إنجليزي",
    category: "hero",
    thumbnail: "/modern-school-facilities-and-technology.jpg",
    tags: ["hero", "jobs", "careers", "gradient", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "hero-basic",
        title: "Employment Opportunities",
        subtitle: "Join our distinguished educational team and be part of our mission",
        primaryCtaLabel: "Browse Jobs",
        primaryCtaHref: "#jobs",
        align: "center",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "transparent",
          textColor: "#ffffff",
          className: "relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600",
        },
      },
    ],
  },

  // --- CONTENT BLOCKS ---

  // Privacy Policy Content Sections - Arabic
  {
    id: "privacy-content-sections-ar",
    nameEn: "Privacy Policy Content (Arabic)",
    nameAr: "محتوى سياسة الخصوصية (عربي)",
    descriptionEn: "Privacy policy content sections with icons - Information, Usage, Protection - Arabic",
    descriptionAr: "أقسام محتوى سياسة الخصوصية مع أيقونات - المعلومات، الاستخدام، الحماية - عربي",
    category: "features",
    thumbnail: "/modern-school-exterior.png",
    tags: ["privacy", "policy", "content", "legal", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "المعلومات التي نجمعها",
          description: "نقوم بجمع المعلومات التالية عند استخدامك لخدماتنا",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "user",
            title: "المعلومات الشخصية",
            description: "الاسم، العنوان، رقم الهاتف، البريد الإلكتروني",
          },
          {
            id: crypto.randomUUID(),
            icon: "graduation-cap",
            title: "معلومات الطالب",
            description: "تاريخ الميلاد، الرقم الوطني، المعلومات الطبية ذات الصلة",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "معلومات التوظيف",
            description: "السيرة الذاتية، المؤهلات، الخبرات السابقة",
          },
          {
            id: crypto.randomUUID(),
            icon: "monitor",
            title: "معلومات الاستخدام",
            description: "كيفية تفاعلك مع موقعنا الإلكتروني وخدماتنا",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Privacy Policy Content Sections - English
  {
    id: "privacy-content-sections-en",
    nameEn: "Privacy Policy Content (English)",
    nameAr: "محتوى سياسة الخصوصية (إنجليزي)",
    descriptionEn: "Privacy policy content sections with icons - Information, Usage, Protection - English",
    descriptionAr: "أقسام محتوى سياسة الخصوصية مع أيقونات - المعلومات، الاستخدام، الحماية - إنجليزي",
    category: "features",
    thumbnail: "/modern-school-exterior.png",
    tags: ["privacy", "policy", "content", "legal", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "Information We Collect",
          description: "We collect the following information when you use our services",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "user",
            title: "Personal Information",
            description: "Name, address, phone number, email",
          },
          {
            id: crypto.randomUUID(),
            icon: "graduation-cap",
            title: "Student Information",
            description: "Date of birth, national ID, relevant medical information",
          },
          {
            id: crypto.randomUUID(),
            icon: "briefcase",
            title: "Employment Information",
            description: "Resume, qualifications, previous experience",
          },
          {
            id: crypto.randomUUID(),
            icon: "monitor",
            title: "Usage Information",
            description: "How you interact with our website and services",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Terms Content Sections - Arabic
  {
    id: "terms-content-sections-ar",
    nameEn: "Terms Content (Arabic)",
    nameAr: "محتوى الشروط والأحكام (عربي)",
    descriptionEn: "Terms and conditions content sections with icons - Arabic",
    descriptionAr: "أقسام محتوى الشروط والأحكام مع أيقونات - عربي",
    category: "features",
    thumbnail: "/modern-school-exterior.png",
    tags: ["terms", "conditions", "content", "legal", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "قبول الشروط",
          description: "باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "file-text",
            title: "اتفاقية ملزمة",
            description: "هذه الشروط تشكل اتفاقية ملزمة قانونياً بينك وبين المدرسة",
          },
          {
            id: crypto.randomUUID(),
            icon: "alert-circle",
            title: "عدم الموافقة",
            description: "إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا",
          },
          {
            id: crypto.randomUUID(),
            icon: "edit",
            title: "حق التعديل",
            description: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت",
          },
          {
            id: crypto.randomUUID(),
            icon: "check",
            title: "الموافقة المستمرة",
            description: "استمرارك في استخدام الخدمات يعني موافقتك على الشروط المحدثة",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Terms Content Sections - English
  {
    id: "terms-content-sections-en",
    nameEn: "Terms Content (English)",
    nameAr: "محتوى الشروط والأحكام (إنجليزي)",
    descriptionEn: "Terms and conditions content sections with icons - English",
    descriptionAr: "أقسام محتوى الشروط والأحكام مع أيقونات - إنجليزي",
    category: "features",
    thumbnail: "/modern-school-exterior.png",
    tags: ["terms", "conditions", "content", "legal", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "Acceptance of Terms",
          description: "By using our services, you agree to comply with these terms",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "file-text",
            title: "Binding Agreement",
            description: "These terms constitute a legally binding agreement between you and the school",
          },
          {
            id: crypto.randomUUID(),
            icon: "alert-circle",
            title: "Non-Agreement",
            description: "If you do not agree to any of these terms, please do not use our services",
          },
          {
            id: crypto.randomUUID(),
            icon: "edit",
            title: "Right to Modify",
            description: "We reserve the right to modify these terms at any time",
          },
          {
            id: crypto.randomUUID(),
            icon: "check",
            title: "Continued Acceptance",
            description: "Your continued use of the services means your acceptance of the updated terms",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Data Protection Section - Arabic
  {
    id: "data-protection-section-ar",
    nameEn: "Data Protection Section (Arabic)",
    nameAr: "قسم حماية البيانات (عربي)",
    descriptionEn: "Data protection information with security icons - Arabic",
    descriptionAr: "معلومات حماية البيانات مع أيقونات الأمان - عربي",
    category: "features",
    thumbnail: "/modern-school-exterior.png",
    tags: ["data", "protection", "security", "privacy", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "حماية البيانات",
          description: "نتخذ إجراءات أمنية صارمة لحماية معلوماتك",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "lock",
            title: "تشفير البيانات",
            description: "تشفير البيانات أثناء النقل والتخزين",
          },
          {
            id: crypto.randomUUID(),
            icon: "shield",
            title: "الوصول المحدود",
            description: "الوصول المحدود للموظفين المصرح لهم فقط",
          },
          {
            id: crypto.randomUUID(),
            icon: "check-circle",
            title: "معايير ISO",
            description: "الامتثال لمعايير ISO 9001:2015",
          },
          {
            id: crypto.randomUUID(),
            icon: "database",
            title: "نسخ احتياطية",
            description: "نسخ احتياطية منتظمة للبيانات",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Data Protection Section - English
  {
    id: "data-protection-section-en",
    nameEn: "Data Protection Section (English)",
    nameAr: "قسم حماية البيانات (إنجليزي)",
    descriptionEn: "Data protection information with security icons - English",
    descriptionAr: "معلومات حماية البيانات مع أيقونات الأمان - إنجليزي",
    category: "features",
    thumbnail: "/modern-school-exterior.png",
    tags: ["data", "protection", "security", "privacy", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        header: {
          title: "Data Protection",
          description: "We take strict security measures to protect your information",
        },
        items: [
          {
            id: crypto.randomUUID(),
            icon: "lock",
            title: "Data Encryption",
            description: "Data encryption during transmission and storage",
          },
          {
            id: crypto.randomUUID(),
            icon: "shield",
            title: "Limited Access",
            description: "Limited access to authorized personnel only",
          },
          {
            id: crypto.randomUUID(),
            icon: "check-circle",
            title: "ISO Standards",
            description: "Compliance with ISO 9001:2015 standards",
          },
          {
            id: crypto.randomUUID(),
            icon: "database",
            title: "Regular Backups",
            description: "Regular data backups",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Science Features Block - Arabic
  {
    id: "science-features-ar",
    nameEn: "Science Features (Arabic)",
    nameAr: "ميزات القسم العلمي (عربي)",
    descriptionEn: "Science department feature cards - Labs, Experiments, Chemistry, Math - Arabic",
    descriptionAr: "بطاقات ميزات القسم العلمي - المختبرات، التجارب، الكيمياء، الرياضيات - عربي",
    category: "features",
    thumbnail: "/science-and-mathematics-classroom-with-modern-tech.jpg",
    tags: ["science", "features", "education", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "microscope",
            title: "مختبرات حديثة",
            description: "مختبرات علمية مجهزة بأحدث الأجهزة",
          },
          {
            id: crypto.randomUUID(),
            icon: "atom",
            title: "تجارب عملية",
            description: "تجارب علمية عملية لتعزيز الفهم",
          },
          {
            id: crypto.randomUUID(),
            icon: "flask-conical",
            title: "كيمياء وفيزياء",
            description: "تدريس الكيمياء والفيزياء بطرق تفاعلية",
          },
          {
            id: crypto.randomUUID(),
            icon: "calculator",
            title: "رياضيات متقدمة",
            description: "برامج رياضيات متقدمة لجميع المستويات",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
    ],
  },

  // Science Features Block - English
  {
    id: "science-features-en",
    nameEn: "Science Features (English)",
    nameAr: "ميزات القسم العلمي (إنجليزي)",
    descriptionEn: "Science department feature cards - Labs, Experiments, Chemistry, Math - English",
    descriptionAr: "بطاقات ميزات القسم العلمي - المختبرات، التجارب، الكيمياء، الرياضيات - إنجليزي",
    category: "features",
    thumbnail: "/science-and-mathematics-classroom-with-modern-tech.jpg",
    tags: ["science", "features", "education", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "microscope",
            title: "Modern Labs",
            description: "Scientific laboratories equipped with the latest devices",
          },
          {
            id: crypto.randomUUID(),
            icon: "atom",
            title: "Practical Experiments",
            description: "Practical scientific experiments to enhance understanding",
          },
          {
            id: crypto.randomUUID(),
            icon: "flask-conical",
            title: "Chemistry & Physics",
            description: "Teaching chemistry and physics with interactive methods",
          },
          {
            id: crypto.randomUUID(),
            icon: "calculator",
            title: "Advanced Mathematics",
            description: "Advanced mathematics programs for all levels",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
    ],
  },

  // Experimental Features Block - Arabic
  {
    id: "experimental-features-ar",
    nameEn: "Experimental Features (Arabic)",
    nameAr: "ميزات القسم التجريبي (عربي)",
    descriptionEn: "Experimental department feature cards - Innovation, Projects, Tech, Learning - Arabic",
    descriptionAr: "بطاقات ميزات القسم التجريبي - الابتكار، المشاريع، التقنيات، التعلم - عربي",
    category: "features",
    thumbnail: "/innovative-experimental-learning-classroom.jpg",
    tags: ["experimental", "features", "innovation", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "lightbulb",
            title: "أفكار مبتكرة",
            description: "تشجيع الطلاب على التفكير الإبداعي",
          },
          {
            id: crypto.randomUUID(),
            icon: "rocket",
            title: "مشاريع تجريبية",
            description: "مشاريع تجريبية لتطبيق المعرفة",
          },
          {
            id: crypto.randomUUID(),
            icon: "sparkles",
            title: "تقنيات حديثة",
            description: "استخدام أحدث التقنيات في التعليم",
          },
          {
            id: crypto.randomUUID(),
            icon: "zap",
            title: "تعلم تفاعلي",
            description: "أساليب تعليمية تفاعلية ومبتكرة",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
    ],
  },

  // Experimental Features Block - English
  {
    id: "experimental-features-en",
    nameEn: "Experimental Features (English)",
    nameAr: "ميزات القسم التجريبي (إنجليزي)",
    descriptionEn: "Experimental department feature cards - Innovation, Projects, Tech, Learning - English",
    descriptionAr: "بطاقات ميزات القسم التجريبي - الابتكار، المشاريع، التقنيات، التعلم - إنجليزي",
    category: "features",
    thumbnail: "/innovative-experimental-learning-classroom.jpg",
    tags: ["experimental", "features", "innovation", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "icon-points",
        items: [
          {
            id: crypto.randomUUID(),
            icon: "lightbulb",
            title: "Innovative Ideas",
            description: "Encouraging students to think creatively",
          },
          {
            id: crypto.randomUUID(),
            icon: "rocket",
            title: "Experimental Projects",
            description: "Experimental projects to apply knowledge",
          },
          {
            id: crypto.randomUUID(),
            icon: "sparkles",
            title: "Modern Technologies",
            description: "Using the latest technologies in education",
          },
          {
            id: crypto.randomUUID(),
            icon: "zap",
            title: "Interactive Learning",
            description: "Interactive and innovative teaching methods",
          },
        ],
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
      },
    ],
  },

  // --- CONTACT BLOCKS ---

  // Contact Section with Form - Arabic
  {
    id: "contact-with-form-ar",
    nameEn: "Contact Section with Form (Arabic)",
    nameAr: "قسم التواصل مع نموذج (عربي)",
    descriptionEn: "Contact section with address, phone, email, and contact form - Arabic",
    descriptionAr: "قسم التواصل مع العنوان والهاتف والبريد ونموذج اتصال - عربي",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["contact", "form", "cta", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Contact Section with Form - English
  {
    id: "contact-with-form-en",
    nameEn: "Contact Section with Form (English)",
    nameAr: "قسم التواصل مع نموذج (إنجليزي)",
    descriptionEn: "Contact section with address, phone, email, and contact form - English",
    descriptionAr: "قسم التواصل مع العنوان والهاتف والبريد ونموذج اتصال - إنجليزي",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["contact", "form", "cta", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "Contact Us",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "Sunday - Thursday: 7:00 AM - 3:00 PM",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
        },
      },
    ],
  },

  // Contact Footer (Gradient) - Arabic
  {
    id: "contact-footer-gradient-ar",
    nameEn: "Contact Footer (Gradient) - Arabic",
    nameAr: "تذييل التواصل (متدرج) - عربي",
    descriptionEn: "Contact section with gradient background for page footers - Arabic",
    descriptionAr: "قسم التواصل بخلفية متدرجة لتذييل الصفحات - عربي",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["contact", "footer", "gradient", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي، الأردن",
          phone: "4122002 / 4122003",
          email: "info@namothajia.com",
        },
        showForm: false,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white",
        },
      },
    ],
  },

  // Contact Footer (Gradient) - English
  {
    id: "contact-footer-gradient-en",
    nameEn: "Contact Footer (Gradient) - English",
    nameAr: "تذييل التواصل (متدرج) - إنجليزي",
    descriptionEn: "Contact section with gradient background for page footers - English",
    descriptionAr: "قسم التواصل بخلفية متدرجة لتذييل الصفحات - إنجليزي",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["contact", "footer", "gradient", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "Contact Us",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District, Jordan",
          phone: "4122002 / 4122003",
          email: "info@namothajia.com",
        },
        showForm: false,
        blockStyles: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "transparent",
          className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white",
        },
      },
    ],
  },

  // --- DEPARTMENT BLOCKS ---

  // Department Welcome Block - Arabic
  {
    id: "department-welcome-ar",
    nameEn: "Department Welcome Block (Arabic)",
    nameAr: "قسم الترحيب بالقسم (عربي)",
    descriptionEn: "Welcome section for department pages with icon, title, description, and stats - Arabic",
    descriptionAr: "قسم ترحيبي لصفحات الأقسام مع أيقونة وعنوان ووصف وإحصائيات - عربي",
    category: "about",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["department", "welcome", "about", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "department-welcome",
        icon: "building",
        title: "مرحباً بكم في القسم",
        description: "نقدم أفضل الخدمات والبرامج المتخصصة لتلبية احتياجاتكم",
        stats: [
          {
            id: crypto.randomUUID(),
            value: "10+",
            label: "سنوات خبرة",
          },
          {
            id: crypto.randomUUID(),
            value: "24/7",
            label: "خدمة مستمرة",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "التزام بالجودة",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // Department Welcome Block - English
  {
    id: "department-welcome-en",
    nameEn: "Department Welcome Block (English)",
    nameAr: "قسم الترحيب بالقسم (إنجليزي)",
    descriptionEn: "Welcome section for department pages with icon, title, description, and stats - English",
    descriptionAr: "قسم ترحيبي لصفحات الأقسام مع أيقونة وعنوان ووصف وإحصائيات - إنجليزي",
    category: "about",
    thumbnail: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
    tags: ["department", "welcome", "about", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "department-welcome",
        icon: "building",
        title: "Welcome to Our Department",
        description: "We provide the best specialized services and programs to meet your needs",
        stats: [
          {
            id: crypto.randomUUID(),
            value: "10+",
            label: "Years of Experience",
          },
          {
            id: crypto.randomUUID(),
            value: "24/7",
            label: "Continuous Service",
          },
          {
            id: crypto.randomUUID(),
            value: "100%",
            label: "Quality Commitment",
          },
        ],
        blockStyles: {
          paddingTop: "6rem",
          paddingBottom: "6rem",
        },
      },
    ],
  },

  // Department CTA Block - Arabic
  {
    id: "department-cta-ar",
    nameEn: "Department CTA Block (Arabic)",
    nameAr: "قسم دعوة للعمل للقسم (عربي)",
    descriptionEn: "Call-to-action section for department pages with contact info - Arabic",
    descriptionAr: "قسم دعوة للعمل لصفحات الأقسام مع معلومات التواصل - عربي",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["department", "cta", "contact", "arabic"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "department-cta",
        title: "هل لديك استفسار؟",
        description: "نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في اختيار البرنامج المناسب",
        primaryButtonLabel: "تواصل معنا الآن",
        primaryButtonHref: "#contact",
        secondaryButtonLabel: "العودة للرئيسية",
        secondaryButtonHref: "/",
        contactInfo: {
          phone: "4122002",
          email: "info@namothajia.com",
          address: "عمان، الأردن",
        },
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
    ],
  },

  // Department CTA Block - English
  {
    id: "department-cta-en",
    nameEn: "Department CTA Block (English)",
    nameAr: "قسم دعوة للعمل للقسم (إنجليزي)",
    descriptionEn: "Call-to-action section for department pages with contact info - English",
    descriptionAr: "قسم دعوة للعمل لصفحات الأقسام مع معلومات التواصل - إنجليزي",
    category: "cta",
    thumbnail: "/modern-school-exterior.png",
    tags: ["department", "cta", "contact", "english"],
    blocks: [
      {
        id: crypto.randomUUID(),
        kind: "department-cta",
        title: "Have a Question?",
        description: "We are here to answer all your questions and help you choose the right program",
        primaryButtonLabel: "Contact Us Now",
        primaryButtonHref: "#contact",
        secondaryButtonLabel: "Back to Home",
        secondaryButtonHref: "/",
        contactInfo: {
          phone: "4122002",
          email: "info@namothajia.com",
          address: "Amman, Jordan",
        },
        blockStyles: {
          paddingTop: "8rem",
          paddingBottom: "8rem",
        },
      },
    ],
  },

  // ========================================
  // HOME PAGE FULL TEMPLATES
  // ========================================

  // Home Page Full Template - Arabic
  {
    id: "home-page-full-ar",
    nameEn: "Home Page (Arabic)",
    nameAr: "الصفحة الرئيسية (عربي)",
    descriptionEn: "Complete home page with hero slider, about section, departments, gallery, testimonials, jobs, and contact - Arabic version",
    descriptionAr: "صفحة رئيسية كاملة مع سلايدر رئيسي، قسم عن المدرسة، الأقسام، معرض الصور، آراء أولياء الأمور، الوظائف، والتواصل - النسخة العربية",
    category: "complex",
    thumbnail: "/modern-school-exterior.png",
    tags: ["home", "full-page", "arabic", "complete"],
    blocks: [
      // Hero Slider
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "مرحباً بكم في المدرسة النموذجية",
            subtitle: "التميز في التعليم",
            description: "نقدم تعليماً عالي الجودة ونُنشئ قادة المستقبل منذ عام 1990",
            imageUrl: "/modern-school-exterior.png",
          },
          {
            id: crypto.randomUUID(),
            title: "مرافق حديثة",
            subtitle: "تعلم متطور",
            description: "مجهزة بأحدث التقنيات والموارد لتجارب تعليمية محسّنة",
            imageUrl: "/modern-school-facilities-and-technology.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "كادر مؤهل",
            subtitle: "معلمون خبراء",
            description: "فريقنا المتفاني من المحترفين ملتزم بنجاح الطلاب",
            imageUrl: "/happy-students-learning-together.jpg",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "100vh",
        },
      },
      // About Section
      {
        id: crypto.randomUUID(),
        kind: "about-section",
        titleAr: "عن المدرسة النموذجية",
        titleEn: "About Namothajia School",
        descriptionAr: "مدرسة نموذجية كانت منارة للتميز التعليمي لأكثر من 30 عاماً. نحن ملتزمون بتوفير بيئة تعليمية شاملة تعزز التحصيل الأكاديمي والنمو الشخصي والمسؤولية الاجتماعية. مرافقنا الحديثة والمعلمون ذوو الخبرة يعملون معاً لإعداد الطلاب للنجاح في عالم متغير.",
        descriptionEn: "Namothajia School has been a beacon of educational excellence for over 30 years. We are committed to providing a comprehensive learning environment that nurtures academic achievement, personal growth, and social responsibility.",
        image: "/modern-school-classroom-with-students.jpg",
        showBadge: true,
        badgeText: "ISO 9001:2015",
        stats: [
          { id: crypto.randomUUID(), number: "30+", labelAr: "سنة من التميز", labelEn: "Years of Excellence" },
          { id: crypto.randomUUID(), number: "8", labelAr: "أقسام متخصصة", labelEn: "Specialized Departments" },
          { id: crypto.randomUUID(), number: "50+", labelAr: "كادر متخصص", labelEn: "Specialized Staff" },
          { id: crypto.randomUUID(), number: "100%", labelAr: "التزام بالجودة", labelEn: "Quality Commitment" },
        ],
        featureCards: [
          { id: crypto.randomUUID(), icon: "target", titleAr: "التميز الأكاديمي", titleEn: "Academic Excellence", descriptionAr: "منهج صارم مصمم لتحدي وإلهام الطلاب", descriptionEn: "Rigorous curriculum designed to challenge and inspire" },
          { id: crypto.randomUUID(), icon: "heart", titleAr: "تطوير الشخصية", titleEn: "Character Development", descriptionAr: "بناء القيم والأخلاق ومهارات القيادة", descriptionEn: "Building values, ethics, and leadership skills" },
          { id: crypto.randomUUID(), icon: "award", titleAr: "مرافق حديثة", titleEn: "Modern Facilities", descriptionAr: "فصول دراسية ومختبرات ومرافق رياضية حديثة", descriptionEn: "State-of-the-art classrooms, labs, and sports facilities" },
          { id: crypto.randomUUID(), icon: "users", titleAr: "هيئة تدريس متخصصة", titleEn: "Expert Faculty", descriptionAr: "معلمون مؤهلون وذوو خبرة عالية", descriptionEn: "Highly qualified and experienced educators" },
          { id: crypto.randomUUID(), icon: "building", titleAr: "تعليم شامل", titleEn: "Holistic Education", descriptionAr: "نهج متوازن للأكاديميات والفنون والرياضة", descriptionEn: "Balanced approach to academics, arts, and athletics" },
          { id: crypto.randomUUID(), icon: "globe", titleAr: "منظور عالمي", titleEn: "Global Perspective", descriptionAr: "إعداد الطلاب لعالم مترابط", descriptionEn: "Preparing students for an interconnected world" },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
      },
      // Departments Grid
      {
        id: crypto.randomUUID(),
        kind: "departments-grid",
        header: {
          title: "أقسامنا المتخصصة",
          titleEn: "Our Specialized Departments",
          description: "اكتشف أقسامنا المتخصصة لخدمة جميع الاحتياجات",
          descriptionEn: "Discover our specialized departments serving all needs",
        },
        items: [
          { id: crypto.randomUUID(), type: "medical", titleAr: "القسم الطبي", titleEn: "Medical Department", descriptionAr: "خدمات طبية وتأهيلية متخصصة", descriptionEn: "Specialized medical and rehabilitation services", image: "/occupational-therapy-room.jpg", href: "/departments/medical", colorTheme: "red" },
          { id: crypto.randomUUID(), type: "heart", titleAr: "قسم العلوم", titleEn: "Science Department", descriptionAr: "برامج علمية متطورة ومختبرات حديثة", descriptionEn: "Advanced scientific programs and modern laboratories", image: "/students-in-science-lab.jpg", href: "/departments/science", colorTheme: "blue" },
          { id: crypto.randomUUID(), type: "activities", titleAr: "القسم التجريبي", titleEn: "Experimental Department", descriptionAr: "أنشطة تعليمية مبتكرة وتجريبية", descriptionEn: "Innovative and experimental educational activities", image: "/modern-school-facilities-and-technology.jpg", href: "/departments/experimental", colorTheme: "green" },
          { id: crypto.randomUUID(), type: "housing", titleAr: "قسم الإقامة", titleEn: "Residential Department", descriptionAr: "خدمات إقامة داخلية متكاملة", descriptionEn: "Comprehensive residential services", image: "/modern-school-exterior.png", href: "/departments/residential", colorTheme: "purple" },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          className: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
        },
      },
      // Gallery Section
      {
        id: crypto.randomUUID(),
        kind: "gallery-masonry",
        header: {
          title: "معرض الصور",
          titleEn: "Photo Gallery",
          description: "لمحات من حياتنا المدرسية",
          descriptionEn: "Glimpses of our school life",
        },
        items: [
          { id: crypto.randomUUID(), imageUrl: "/modern-school-exterior.png", caption: "مبنى المدرسة", alt: "مبنى المدرسة الحديث" },
          { id: crypto.randomUUID(), imageUrl: "/modern-school-facilities-and-technology.jpg", caption: "المرافق التقنية", alt: "مختبرات الحاسوب" },
          { id: crypto.randomUUID(), imageUrl: "/modern-school-classroom-with-students.jpg", caption: "الفصول الدراسية", alt: "فصول دراسية حديثة" },
          { id: crypto.randomUUID(), imageUrl: "/happy-students-learning-together.jpg", caption: "الطلاب", alt: "طلاب سعداء" },
          { id: crypto.randomUUID(), imageUrl: "/students-in-science-lab.jpg", caption: "المختبرات العلمية", alt: "مختبرات علمية" },
          { id: crypto.randomUUID(), imageUrl: "/occupational-therapy-room.jpg", caption: "غرف العلاج", alt: "غرف العلاج الوظيفي" },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
      },
      // Testimonials Section
      {
        id: crypto.randomUUID(),
        kind: "testimonials",
        header: {
          title: "آراء أولياء الأمور",
          titleEn: "Parent Testimonials",
          description: "ثقة العائلات في مجتمعنا",
          descriptionEn: "Families trust our community",
        },
        items: [
          {
            id: crypto.randomUUID(),
            author: "سارة أحمد",
            role: "ولي أمر",
            quote: "لقد ازدهر أطفالي في المدرسة النموذجية. المعلمون داعمون للغاية والمنهج ممتاز.",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "محمد علي",
            role: "ولي أمر",
            quote: "أفضل استثمار تعليمي قمنا به لأطفالنا. يحبون الذهاب إلى المدرسة كل يوم!",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "فاطمة حسن",
            role: "ولي أمر",
            quote: "مرافق متميزة وبيئة رعاية. أنصح بها بشدة!",
            rating: 5,
            avatarUrl: "",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          className: "bg-gradient-to-br from-slate-50 via-background to-accent/5",
        },
      },
      // Jobs Section
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          title: "فرص التوظيف",
          titleEn: "Employment Opportunities",
          description: "انضم إلى فريقنا التعليمي المتميز",
          descriptionEn: "Join our distinguished educational team",
        },
        showLatestJobs: true,
        maxJobs: 3,
        ctaLabel: "عرض جميع الوظائف",
        ctaLabelEn: "View All Jobs",
        ctaHref: "/jobs",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
      },
      // Contact Section
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          title: "تواصل معنا",
          titleEn: "Contact Us",
        },
        info: {
          address: "عمان - طريق المطار - ضاحية الأمير علي",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          className: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
        },
      },
    ],
  },

  // Home Page Full Template - English
  {
    id: "home-page-full-en",
    nameEn: "Home Page (English)",
    nameAr: "الصفحة الرئيسية (إنجليزي)",
    descriptionEn: "Complete home page with hero slider, about section, departments, gallery, testimonials, jobs, and contact - English version",
    descriptionAr: "صفحة رئيسية كاملة مع سلايدر رئيسي، قسم عن المدرسة، الأقسام، معرض الصور، آراء أولياء الأمور، الوظائف، والتواصل - النسخة الإنجليزية",
    category: "complex",
    thumbnail: "/modern-school-exterior.png",
    tags: ["home", "full-page", "english", "complete"],
    blocks: [
      // Hero Slider
      {
        id: crypto.randomUUID(),
        kind: "hero-slider",
        slides: [
          {
            id: crypto.randomUUID(),
            title: "Welcome to Namothajia School",
            titleEn: "Welcome to Namothajia School",
            subtitle: "Excellence in Education",
            subtitleEn: "Excellence in Education",
            description: "Providing quality education and nurturing future leaders since 1990",
            descriptionEn: "Providing quality education and nurturing future leaders since 1990",
            imageUrl: "/modern-school-exterior.png",
          },
          {
            id: crypto.randomUUID(),
            title: "Modern Facilities",
            titleEn: "Modern Facilities",
            subtitle: "State-of-the-Art Learning",
            subtitleEn: "State-of-the-Art Learning",
            description: "Equipped with the latest technology and resources for enhanced learning experiences",
            descriptionEn: "Equipped with the latest technology and resources for enhanced learning experiences",
            imageUrl: "/modern-school-facilities-and-technology.jpg",
          },
          {
            id: crypto.randomUUID(),
            title: "Qualified Staff",
            titleEn: "Qualified Staff",
            subtitle: "Expert Educators",
            subtitleEn: "Expert Educators",
            description: "Our dedicated team of professionals is committed to student success",
            descriptionEn: "Our dedicated team of professionals is committed to student success",
            imageUrl: "/happy-students-learning-together.jpg",
          },
        ],
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        blockStyles: {
          paddingTop: "0",
          paddingBottom: "0",
          minHeight: "100vh",
        },
      },
      // About Section
      {
        id: crypto.randomUUID(),
        kind: "about-section",
        titleEn: "About Namothajia School",
        titleAr: "عن المدرسة النموذجية",
        descriptionEn: "Namothajia School has been a beacon of educational excellence for over 30 years. We are committed to providing a comprehensive learning environment that nurtures academic achievement, personal growth, and social responsibility. Our state-of-the-art facilities and experienced educators work together to prepare students for success in an ever-changing world.",
        descriptionAr: "مدرسة نموذجية كانت منارة للتميز التعليمي لأكثر من 30 عاماً. نحن ملتزمون بتوفير بيئة تعليمية شاملة تعزز التحصيل الأكاديمي والنمو الشخصي والمسؤولية الاجتماعية.",
        image: "/modern-school-classroom-with-students.jpg",
        showBadge: true,
        badgeText: "ISO 9001:2015",
        stats: [
          { id: crypto.randomUUID(), number: "30+", labelEn: "Years of Excellence", labelAr: "سنة من التميز" },
          { id: crypto.randomUUID(), number: "8", labelEn: "Specialized Departments", labelAr: "أقسام متخصصة" },
          { id: crypto.randomUUID(), number: "50+", labelEn: "Specialized Staff", labelAr: "كادر متخصص" },
          { id: crypto.randomUUID(), number: "100%", labelEn: "Quality Commitment", labelAr: "التزام بالجودة" },
        ],
        featureCards: [
          { id: crypto.randomUUID(), icon: "target", titleEn: "Academic Excellence", titleAr: "التميز الأكاديمي", descriptionEn: "Rigorous curriculum designed to challenge and inspire students", descriptionAr: "منهج صارم مصمم لتحدي وإلهام الطلاب" },
          { id: crypto.randomUUID(), icon: "heart", titleEn: "Character Development", titleAr: "تطوير الشخصية", descriptionEn: "Building values, ethics, and leadership skills", descriptionAr: "بناء القيم والأخلاق ومهارات القيادة" },
          { id: crypto.randomUUID(), icon: "award", titleEn: "Modern Facilities", titleAr: "مرافق حديثة", descriptionEn: "State-of-the-art classrooms, labs, and sports facilities", descriptionAr: "فصول دراسية ومختبرات ومرافق رياضية حديثة" },
          { id: crypto.randomUUID(), icon: "users", titleEn: "Expert Faculty", titleAr: "هيئة تدريس متخصصة", descriptionEn: "Highly qualified and experienced educators", descriptionAr: "معلمون مؤهلون وذوو خبرة عالية" },
          { id: crypto.randomUUID(), icon: "building", titleEn: "Holistic Education", titleAr: "تعليم شامل", descriptionEn: "Balanced approach to academics, arts, and athletics", descriptionAr: "نهج متوازن للأكاديميات والفنون والرياضة" },
          { id: crypto.randomUUID(), icon: "globe", titleEn: "Global Perspective", titleAr: "منظور عالمي", descriptionEn: "Preparing students for an interconnected world", descriptionAr: "إعداد الطلاب لعالم مترابط" },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
      },
      // Departments Grid
      {
        id: crypto.randomUUID(),
        kind: "departments-grid",
        header: {
          titleEn: "Our Specialized Departments",
          title: "أقسامنا المتخصصة",
          descriptionEn: "Discover our specialized departments serving all needs",
          description: "اكتشف أقسامنا المتخصصة لخدمة جميع الاحتياجات",
        },
        items: [
          { id: crypto.randomUUID(), type: "medical", titleEn: "Medical Department", titleAr: "القسم الطبي", descriptionEn: "Specialized medical and rehabilitation services", descriptionAr: "خدمات طبية وتأهيلية متخصصة", image: "/occupational-therapy-room.jpg", href: "/departments/medical", colorTheme: "red" },
          { id: crypto.randomUUID(), type: "heart", titleEn: "Science Department", titleAr: "قسم العلوم", descriptionEn: "Advanced scientific programs and modern laboratories", descriptionAr: "برامج علمية متطورة ومختبرات حديثة", image: "/students-in-science-lab.jpg", href: "/departments/science", colorTheme: "blue" },
          { id: crypto.randomUUID(), type: "activities", titleEn: "Experimental Department", titleAr: "القسم التجريبي", descriptionEn: "Innovative and experimental educational activities", descriptionAr: "أنشطة تعليمية مبتكرة وتجريبية", image: "/modern-school-facilities-and-technology.jpg", href: "/departments/experimental", colorTheme: "green" },
          { id: crypto.randomUUID(), type: "housing", titleEn: "Residential Department", titleAr: "قسم الإقامة", descriptionEn: "Comprehensive residential services", descriptionAr: "خدمات إقامة داخلية متكاملة", image: "/modern-school-exterior.png", href: "/departments/residential", colorTheme: "purple" },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          className: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
        },
      },
      // Gallery Section
      {
        id: crypto.randomUUID(),
        kind: "gallery-masonry",
        header: {
          titleEn: "Photo Gallery",
          title: "معرض الصور",
          descriptionEn: "Glimpses of our school life",
          description: "لمحات من حياتنا المدرسية",
        },
        items: [
          { id: crypto.randomUUID(), imageUrl: "/modern-school-exterior.png", caption: "School Building", alt: "Modern school building" },
          { id: crypto.randomUUID(), imageUrl: "/modern-school-facilities-and-technology.jpg", caption: "Technology Facilities", alt: "Computer labs" },
          { id: crypto.randomUUID(), imageUrl: "/modern-school-classroom-with-students.jpg", caption: "Classrooms", alt: "Modern classrooms" },
          { id: crypto.randomUUID(), imageUrl: "/happy-students-learning-together.jpg", caption: "Students", alt: "Happy students" },
          { id: crypto.randomUUID(), imageUrl: "/students-in-science-lab.jpg", caption: "Science Labs", alt: "Science laboratories" },
          { id: crypto.randomUUID(), imageUrl: "/occupational-therapy-room.jpg", caption: "Therapy Rooms", alt: "Occupational therapy rooms" },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
      },
      // Testimonials Section
      {
        id: crypto.randomUUID(),
        kind: "testimonials",
        header: {
          titleEn: "Parent Testimonials",
          title: "آراء أولياء الأمور",
          descriptionEn: "Families trust our community",
          description: "ثقة العائلات في مجتمعنا",
        },
        items: [
          {
            id: crypto.randomUUID(),
            author: "Sarah Ahmed",
            role: "Parent",
            quote: "My children have flourished at Namothajia School. The teachers are incredibly supportive and the curriculum is excellent.",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "Mohammed Ali",
            role: "Parent",
            quote: "The best educational investment we made for our children. They love going to school every day!",
            rating: 5,
            avatarUrl: "",
          },
          {
            id: crypto.randomUUID(),
            author: "Fatima Hassan",
            role: "Parent",
            quote: "Outstanding facilities and nurturing environment. Highly recommended!",
            rating: 5,
            avatarUrl: "",
          },
        ],
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          className: "bg-gradient-to-br from-slate-50 via-background to-accent/5",
        },
      },
      // Jobs Section
      {
        id: crypto.randomUUID(),
        kind: "jobs-listing",
        header: {
          titleEn: "Employment Opportunities",
          title: "فرص التوظيف",
          descriptionEn: "Join our distinguished educational team",
          description: "انضم إلى فريقنا التعليمي المتميز",
        },
        showLatestJobs: true,
        maxJobs: 3,
        ctaLabelEn: "View All Jobs",
        ctaLabel: "عرض جميع الوظائف",
        ctaHref: "/jobs",
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
      },
      // Contact Section
      {
        id: crypto.randomUUID(),
        kind: "contact-section",
        header: {
          titleEn: "Contact Us",
          title: "تواصل معنا",
        },
        info: {
          address: "Amman - Airport Road - Prince Ali District",
          phone: "+962 6 4122002",
          email: "info@namothajia.com",
          workingHours: "Sunday - Thursday: 7:00 AM - 3:00 PM",
        },
        showForm: true,
        blockStyles: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          className: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20",
        },
      },
    ],
  },
]
