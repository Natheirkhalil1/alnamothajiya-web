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
]
