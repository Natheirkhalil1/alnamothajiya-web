"use client"

import { useParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Brain,
  Wrench,
  Heart,
  Stethoscope,
  Home,
  Sparkles,
  Activity,
  Laptop,
  ArrowLeft,
  ArrowRight,
  Users,
  Target,
  Award,
  Lightbulb,
  Shield,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

const departmentsData = {
  technical: {
    icon: Brain,
    titleAr: "القسم الفني",
    titleEn: "Technical Department",
    color: "from-blue-600 via-indigo-600 to-purple-600",
    welcomeAr: "مرحباً بكم في القسم الفني - قلب العملية التعليمية والتأهيلية",
    welcomeEn: "Welcome to the Technical Department - The Heart of Educational and Rehabilitation Process",
    descriptionAr:
      "القسم الفني هو العمود الفقري للمدرسة النموذجية، حيث يضم 8 أقسام متخصصة تعمل بتكامل تام لتقديم خدمات تعليمية وتأهيلية شاملة لجميع الطلاب. يعمل فريق من الأخصائيين المؤهلين على تقييم وتطوير قدرات كل طالب بشكل فردي.",
    descriptionEn:
      "The Technical Department is the backbone of Al Namothajia School, comprising 8 specialized sections working in complete integration to provide comprehensive educational and rehabilitation services for all students. A team of qualified specialists works to assess and develop each student's abilities individually.",
    heroSlides: [
      {
        image: "/professional-psychologist-conducting-assessment-wi.jpg",
        titleAr: "التقييم النفسي الشامل",
        titleEn: "Comprehensive Psychological Assessment",
        descriptionAr: "تطبيق الاختبارات والمقاييس النفسية المختلفة لتقييم قدرات الطلبة",
        descriptionEn: "Applying various psychological tests and scales to assess students' abilities",
      },
      {
        image: "/special-education-teacher-creating-individualized-.jpg",
        titleAr: "الخطط التربوية الفردية",
        titleEn: "Individual Educational Plans",
        descriptionAr: "إعداد برامج تربوية مخصصة لكل طالب حسب قدراته",
        descriptionEn: "Preparing customized educational programs for each student according to their abilities",
      },
      {
        image: "/counselor-providing-psychological-support-to-speci.jpg",
        titleAr: "الإرشاد النفسي والدعم",
        titleEn: "Psychological Counseling and Support",
        descriptionAr: "جلسات إرشادية وعلاجية لمساعدة الطلاب في حل المشكلات النفسية",
        descriptionEn: "Counseling and therapeutic sessions to help students solve psychological problems",
      },
    ],
    subsections: [
      {
        icon: Brain,
        titleAr: "قسم التقييم النفسي",
        titleEn: "Psychological Assessment Section",
        descriptionAr:
          "يقوم الأخصائي النفسي في هذا القسم على تطبيق الاختبارات والمقاييس النفسية المختلفة، ويعمل على تحليل نتائج الاختبارات والمقاييس وتفسيرها بهدف تقييم قدرات الطلبة العقلية واضطراباتهم النفسية والسلوكية ثم يقوم بإعداد التقرير التشخيصي الشامل.",
        descriptionEn:
          "The psychologist in this section applies various psychological tests and scales, analyzes and interprets test results to assess students' mental abilities and psychological and behavioral disorders, then prepares a comprehensive diagnostic report.",
      },
      {
        icon: Target,
        titleAr: "قسم الخطط والبرامج",
        titleEn: "Plans and Programs Section",
        descriptionAr:
          "يقوم هذا القسم بالتقييم التربوي وإعداد الخطط التربوية الفردية وخطط تعديل السلوك لكل طالب، ويقوم هذا القسم بالاجتماع مع فريق متعدد التخصصات لإعداد البرنامج التربوي الشامل.",
        descriptionEn:
          "This section conducts educational assessment and prepares individual educational plans and behavior modification plans for each student, meeting with a multidisciplinary team to prepare a comprehensive educational program.",
      },
      {
        icon: Users,
        titleAr: "القسم الاجتماعي",
        titleEn: "Social Section",
        descriptionAr:
          "يقوم الأخصائي الاجتماعي بعمل دراسة الحالة للطلاب لمعرفة احتياجاتهم واهتماماتهم وسلوكياتهم، ويتم وضع خطط اجتماعية وبرامج علاجية وبرامج تعديل السلوك وعمل نشاطات لا منهجية ومتابعتها وتقييمها للوصول لأعلى درجة من التكيف والدمج الاجتماعي.",
        descriptionEn:
          "The social worker conducts case studies of students to understand their needs, interests, and behaviors, developing social plans, therapeutic programs, behavior modification programs, and extracurricular activities to achieve the highest degree of adaptation and social integration.",
      },
      {
        icon: Heart,
        titleAr: "قسم الإرشاد النفسي",
        titleEn: "Psychological Counseling Section",
        descriptionAr:
          "يقوم قسم الإرشاد النفسي على وضع خطط إرشادية تأهيلية تساعد الطلاب في حل المشكلات النفسية التي تنعكس على سلوكهم، وعمل جلسات استرخاء نفسية ممنهجة لهم.",
        descriptionEn:
          "The psychological counseling section develops rehabilitative counseling plans to help students solve psychological problems that affect their behavior, and conducts systematic psychological relaxation sessions.",
      },
      {
        icon: Award,
        titleAr: "قسم التربية الخاصة",
        titleEn: "Special Education Section",
        descriptionAr:
          "يحتوي هذا القسم على صفوف دراسية ووحدات تعديل سلوك، بحيث يتم تقسيم الطلاب في الصفوف الدراسية حسب درجة إعاقتهم وأعمارهم، ويتم تدريبهم على المهارات الأكاديمية والمهارات الاستقلالية الموجودة حسب البرنامج التربوي الفردي، ويعمل هذا القسم بشكل متكامل مع جميع أقسام المدرسة.",
        descriptionEn:
          "This section contains classrooms and behavior modification units, where students are divided into classes according to their disability level and age, trained in academic and independence skills according to the individual educational program, working in integration with all school departments.",
      },
      {
        icon: Lightbulb,
        titleAr: "قسم النطق واللغة",
        titleEn: "Speech and Language Section",
        descriptionAr:
          "يعمل القسم على الاكتشاف المبكر لأية اختلالات لغوية أو لفظية لدى الطلاب بالاستعانة بأخصائيين نطق ولغة وتدريب الأشخاص حتى يتمكنوا من اكتساب المهارات اللغوية الأساسية والفردية لهم والتي تمكنهم من تطوير قدراتهم اللغوية والتعليمية.",
        descriptionEn:
          "The section works on early detection of any linguistic or verbal disorders in students with the help of speech and language specialists, training individuals to acquire basic and individual language skills that enable them to develop their linguistic and educational abilities.",
      },
      {
        icon: Wrench,
        titleAr: "قسم التأهيل المهني",
        titleEn: "Vocational Rehabilitation Section",
        descriptionAr:
          "يتم تدريب الطلاب على المهارات الرئيسية التي تهيئهم للدخول للقسم المهني بشكل كامل وتمكنهم من الدخول إلى سوق العمل، حيث يحتوي على أقسام: الزراعة، الحدادة، النجارة، التدبير المنزلي، والخياطة.",
        descriptionEn:
          "Students are trained in key skills that prepare them to fully enter the vocational section and enable them to enter the job market, including sections: Agriculture, Blacksmithing, Carpentry, Home Management, and Sewing.",
      },
      {
        icon: Heart,
        titleAr: "العلاج الوظيفي",
        titleEn: "Occupational Therapy",
        descriptionAr:
          "يعتبر من أهم أقسام المدرسة والذي يتناول جميع المهارات الوظيفية التي تساعد الطالب لتخطي متطلبات الحياة اليومية. ويندرج تحته: قسم التسوق، قسم التكامل الحسي، وقسم الجلسات الفردية.",
        descriptionEn:
          "One of the most important school sections addressing all functional skills that help students overcome daily life requirements, including: Shopping Section, Sensory Integration Section, and Individual Sessions Section.",
      },
    ],
  },
  vocational: {
    icon: Wrench,
    titleAr: "التأهيل المهني",
    titleEn: "Vocational Rehabilitation",
    color: "from-amber-600 via-orange-600 to-red-600",
    welcomeAr: "مرحباً بكم في قسم التأهيل المهني - بوابتك نحو المستقبل المهني",
    welcomeEn: "Welcome to Vocational Rehabilitation - Your Gateway to Professional Future",
    descriptionAr:
      "قسم التأهيل المهني يهدف إلى تدريب الطلاب على مهن معينة تساعد في إعدادهم لسوق العمل. يحتوي القسم على التهيئة المهنية والتدريب العملي في مجالات متنوعة مع مراعاة السلامة العامة بما يلائم احتياجات الطلبة ذوي الإعاقة.",
    descriptionEn:
      "The Vocational Rehabilitation section aims to train students in specific professions that help prepare them for the job market. The section includes vocational preparation and practical training in various fields while considering general safety suitable for students with disabilities.",
    heroSlides: [
      {
        image: "/special-needs-students-learning-agriculture-in-gre.jpg",
        titleAr: "التدريب الزراعي",
        titleEn: "Agricultural Training",
        descriptionAr: "بيت بلاستيكي مجهز لتعليم الطلاب جميع مهارات الزراعة",
        descriptionEn: "Equipped greenhouse for teaching students all agricultural skills",
      },
      {
        image: "/vocational-training-workshop-with-carpentry-and-me.jpg",
        titleAr: "ورش العمل المهنية",
        titleEn: "Professional Workshops",
        descriptionAr: "تدريب عملي على الحدادة والنجارة والخياطة",
        descriptionEn: "Practical training in blacksmithing, carpentry, and sewing",
      },
      {
        image: "/special-needs-students-learning-home-management-an.jpg",
        titleAr: "التدبير المنزلي",
        titleEn: "Home Management",
        descriptionAr: "تدريب على العناية الشخصية والمنزلية",
        descriptionEn: "Training in personal and home care",
      },
    ],
    subsections: [
      {
        icon: Lightbulb,
        titleAr: "قسم التهيئة المهنية",
        titleEn: "Vocational Preparation Section",
        descriptionAr:
          "يتم تدريب الطلاب على المهارات الرئيسية التي تهيئهم للدخول للقسم المهني بشكل كامل وتمكنهم من الدخول إلى قسم التأهيل المهني، والجاهزية المهنية.",
        descriptionEn:
          "Students are trained in key skills that prepare them to fully enter the vocational section and enable them to enter the vocational rehabilitation section and vocational readiness.",
      },
      {
        icon: Sparkles,
        titleAr: "قسم الزراعة",
        titleEn: "Agriculture Section",
        descriptionAr:
          "يحتوي هذا القسم على بيت بلاستيكي، يتم فيه زراعة نباتات من خلال خطوات تُعد الطالب لسوق العمل، ويتعرف الطالب على جميع الأدوات الزراعية، حيث تمكنه من ممارسة الأعمال الزراعية بنجاح.",
        descriptionEn:
          "This section contains a greenhouse where plants are grown through steps that prepare the student for the job market. The student learns about all agricultural tools, enabling them to successfully practice agricultural work.",
      },
      {
        icon: Wrench,
        titleAr: "قسم الحدادة",
        titleEn: "Blacksmithing Section",
        descriptionAr:
          "في هذا القسم يتم تدريب الطلاب على جميع الأدوات المتعلقة بهذه المهنة ومن خلال هذا التدريب يتمكن الطالب من تنفيذ أعمال حدادة مبسطة.",
        descriptionEn:
          "In this section, students are trained on all tools related to this profession, and through this training, the student can perform simple blacksmithing work.",
      },
      {
        icon: Award,
        titleAr: "قسم النجارة",
        titleEn: "Carpentry Section",
        descriptionAr: "يتم تعريف وتدريب الطالب على كل ما يتعلق بالمهنة وإعدادهم لها.",
        descriptionEn:
          "Students are introduced and trained in everything related to the profession and prepared for it.",
      },
      {
        icon: Home,
        titleAr: "التدبير المنزلي",
        titleEn: "Home Management",
        descriptionAr:
          "هذا القسم يستهدف الإناث، بحيث يتم تدريبهم على كل ما يخص العناية الشخصية والمنزل وإعداد الواجبات.",
        descriptionEn:
          "This section targets females, where they are trained in everything related to personal care, home management, and meal preparation.",
      },
      {
        icon: Shield,
        titleAr: "قسم الخياطة",
        titleEn: "Sewing Section",
        descriptionAr: "تعريف الطالب على أدوات الخياطة والمهارات الأساسية لاستعمالها.",
        descriptionEn: "Introducing students to sewing tools and basic skills for using them.",
      },
    ],
  },
  occupational: {
    icon: Heart,
    titleAr: "العلاج الوظيفي",
    titleEn: "Occupational Therapy",
    color: "from-rose-600 via-pink-600 to-fuchsia-600",
    welcomeAr: "مرحباً بكم في قسم العلاج الوظيفي - نحو استقلالية أفضل",
    welcomeEn: "Welcome to Occupational Therapy - Towards Better Independence",
    descriptionAr:
      "يعتبر هذا القسم من أهم أقسام المدرسة والذي يتناول جميع المهارات الوظيفية التي تساعد الطالب لتخطي متطلبات الحياة اليومية. يركز القسم على تنمية المهارات الاستقلالية والإدراكية والحركية.",
    descriptionEn:
      "This section is one of the most important school sections addressing all functional skills that help students overcome daily life requirements. The section focuses on developing independence, cognitive, and motor skills.",
    heroSlides: [
      {
        image: "/special-needs-students-learning-shopping-skills-in.jpg",
        titleAr: "قسم التسوق",
        titleEn: "Shopping Section",
        descriptionAr: "سوبر ماركت مصغر لتعليم مهارات التسوق والاستقلالية",
        descriptionEn: "Mini supermarket for teaching shopping skills and independence",
      },
      {
        image: "/sensory-integration-therapy-room-with-special-equi.jpg",
        titleAr: "التكامل الحسي",
        titleEn: "Sensory Integration",
        descriptionAr: "تنظيم العمليات الحسية لدى الطلاب",
        descriptionEn: "Organizing sensory processes for students",
      },
      {
        image: "/occupational-therapist-working-one-on-one-with-spe.jpg",
        titleAr: "الجلسات الفردية",
        titleEn: "Individual Sessions",
        descriptionAr: "جلسات تفاعلية لتنمية المهارات الوظيفية",
        descriptionEn: "Interactive sessions for developing functional skills",
      },
    ],
    subsections: [
      {
        icon: Sparkles,
        titleAr: "قسم التسوق",
        titleEn: "Shopping Section",
        descriptionAr:
          "ويتم من خلال هذا القسم تعليم الطلاب مهارات ما قبل الشراء وبعدها، وكيفية استخدام الأموال للوصول إلى الاستقلالية الكاملة، ويحتوي هذا القسم على سوبر ماركت فيه كاشير وبضائع تجعل الطالب يجد نفسه أنه في سوق مصغر.",
        descriptionEn:
          "Through this section, students are taught pre and post-purchase skills, and how to use money to achieve complete independence. This section contains a supermarket with a cashier and goods that make the student feel they are in a miniature market.",
      },
      {
        icon: Brain,
        titleAr: "قسم التكامل الحسي",
        titleEn: "Sensory Integration Section",
        descriptionAr:
          "يقوم هذا القسم على تنظيم العمليات الحسية لدى الطلاب ذوي الاضطرابات الحسية، والعمل على تحقيق حل للمشاكل التي تتولد منها.",
        descriptionEn:
          "This section organizes sensory processes for students with sensory disorders and works to solve the problems that arise from them.",
      },
      {
        icon: Users,
        titleAr: "قسم الجلسات الفردية",
        titleEn: "Individual Sessions Section",
        descriptionAr:
          "هي جلسات تفاعلية بين الأخصائي والطالب، تقوم على تنمية المهارات الوظيفية الاستقلالية الإدراكية والحركية وغيرها من المهارات.",
        descriptionEn:
          "Interactive sessions between the specialist and the student, focusing on developing functional independence, cognitive, motor, and other skills.",
      },
    ],
  },
  medical: {
    icon: Stethoscope,
    titleAr: "القسم الطبي",
    titleEn: "Medical Department",
    color: "from-red-600 via-rose-600 to-pink-600",
    welcomeAr: "مرحباً بكم في القسم الطبي - صحة طلابنا أولويتنا",
    welcomeEn: "Welcome to Medical Department - Our Students' Health is Our Priority",
    descriptionAr:
      "يتميز القسم الطبي بكوادر طبية ذوي كفاءات عالية من أطباء وممرضين متواجدين على مدار الساعة، مع معدات طبية شاملة لجميع الحالات الطارئة واليومية، وسيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية.",
    descriptionEn:
      "The Medical Department features highly qualified medical staff of doctors and nurses available 24/7, with comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies.",
    heroSlides: [
      {
        image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
        titleAr: "العيادة الطبية",
        titleEn: "Medical Clinic",
        descriptionAr: "عيادة مجهزة بأحدث المعدات الطبية",
        descriptionEn: "Clinic equipped with the latest medical equipment",
      },
      {
        image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
        titleAr: "الصيدلية",
        titleEn: "Pharmacy",
        descriptionAr: "صيدلية شاملة لجميع احتياجات الطلاب الدوائية",
        descriptionEn: "Comprehensive pharmacy for all students' medication needs",
      },
      {
        image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
        titleAr: "المتابعة العلاجية",
        titleEn: "Medical Follow-up",
        descriptionAr: "وحدة عناية مركزة للمتابعة الصحية على مدار الساعة",
        descriptionEn: "Intensive care unit for 24/7 health monitoring",
      },
    ],
    subsections: [
      {
        icon: Stethoscope,
        titleAr: "العيادة",
        titleEn: "Clinic",
        descriptionAr:
          "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)، وفيها معدات طبية شاملة لجميع الحالات الطارئة واليومية، ويتوفر فيها سيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية على مدار الساعة.",
        descriptionEn:
          "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7), comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies available 24/7.",
      },
      {
        icon: Heart,
        titleAr: "الصيدلية",
        titleEn: "Pharmacy",
        descriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً.",
        descriptionEn:
          "The pharmacy contains all medications needed by students, classified by student name, and stored electronically.",
      },
      {
        icon: Shield,
        titleAr: "المتابعة العلاجية",
        titleEn: "Medical Follow-up",
        descriptionAr:
          "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
        descriptionEn:
          "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
      },
    ],
  },
  housing: {
    icon: Home,
    titleAr: "السكن الداخلي",
    titleEn: "Internal Housing",
    color: "from-teal-600 via-cyan-600 to-blue-600",
    welcomeAr: "مرحباً بكم في السكن الداخلي - بيتك الثاني",
    welcomeEn: "Welcome to Internal Housing - Your Second Home",
    descriptionAr:
      "يحتوي القسم الداخلي على شقق سكنية مجهزة تجهيزات فندقية، معدة بأفضل الأثاث ومعقمة بأفضل الطرق، ومجهزة بنظام التدفئة المركزية شتاءً وبمكيفات صيفاً، مع خدمات شاملة تشمل النظافة والمصبغة والمطبخ والمكالمات المرئية والمراقبة.",
    descriptionEn:
      "The internal section contains residential apartments equipped with hotel-standard furnishings, prepared with the best furniture and sterilized in the best ways, equipped with central heating in winter and air conditioning in summer, with comprehensive services including cleaning, laundry, kitchen, video calls, and surveillance.",
    heroSlides: [
      {
        image: "/comfortable-residential-apartment-for-special-need.jpg",
        titleAr: "الشقق السكنية",
        titleEn: "Residential Apartments",
        descriptionAr: "شقق مجهزة بتجهيزات فندقية فاخرة",
        descriptionEn: "Apartments equipped with luxurious hotel furnishings",
      },
      {
        image: "/recreational-facilities-with-sports-hall-and-cinem.jpg",
        titleAr: "المرافق الترفيهية",
        titleEn: "Recreational Facilities",
        descriptionAr: "ملاعب وصالات رياضية وقاعة سينما",
        descriptionEn: "Playgrounds, sports halls, and cinema hall",
      },
      {
        image: "/modern-kitchen-and-laundry-services-for-special-ne.jpg",
        titleAr: "الخدمات المتكاملة",
        titleEn: "Integrated Services",
        descriptionAr: "خدمات النظافة والمصبغة والمطبخ",
        descriptionEn: "Cleaning, laundry, and kitchen services",
      },
    ],
    subsections: [
      {
        icon: Home,
        titleAr: "القسم الداخلي",
        titleEn: "Internal Section",
        descriptionAr:
          "يحتوي القسم الداخلي بالمدرسة على شقق سكنية مجهزة تجهيزات فندقية، معدة بأفضل الأثاث ومعقمة بأفضل الطرق، ومجهزة بنظام التدفئة المركزية شتاءً وبمكيفات صيفاً، حيث يحتوي السكن الداخلي على شقق مكونة من غرف نوم مجهزة بأسرة وصالات معيشة فيها جانب ترفيهي كبير ومناسب لجلوس كل طالب فيها حسب حاجته، حيث يتم توزيع الطلاب في كل شقة إلى مجموعات متشابهة في الفئة العمرية وشدة الإعاقة والسلوكيات، بالإضافة إلى الملاعب والصالات الرياضية الملحقة بالسكن من أجل الترفيه، وهناك قاعة سينما تعرض فيها أفلام مناسبة لحاجات الطلاب.",
        descriptionEn:
          "The internal section contains residential apartments equipped with hotel furnishings, prepared with the best furniture and sterilized in the best ways, equipped with central heating in winter and air conditioning in summer. The internal housing contains apartments consisting of bedrooms equipped with beds and living rooms with a large recreational aspect suitable for each student according to their needs. Students are distributed in each apartment into similar groups in age, disability severity, and behaviors. In addition to playgrounds and sports halls attached to the housing for recreation, there is a cinema hall showing films suitable for students' needs.",
      },
      {
        icon: Sparkles,
        titleAr: "قسم الخدمات",
        titleEn: "Services Section",
        descriptionAr:
          "ويتم في هذا القسم متابعة نظافة المرافق المدرسية (الحمامات، المسرح، الصالة الرياضية، الغرف الصفية، الغرف الفردية، المسرح، الأجنحة، الملعب وغيرها...). ويتم العمل على تعقيم وتنظيف المرافق بشكل دوري وعلى مدار الساعة.",
        descriptionEn:
          "In this section, the cleanliness of school facilities is monitored (bathrooms, theater, gym, classrooms, individual rooms, theater, wings, playground, etc.). Facilities are sterilized and cleaned periodically and around the clock.",
      },
      {
        icon: Shield,
        titleAr: "قسم المصبغة",
        titleEn: "Laundry Section",
        descriptionAr:
          "هو قسم التعقيم في المدرسة لملابس الطلاب حيث يتم غسل وكوي وتعقيم الملابس على درجات حرارة عالية تضمن نظافة عالية وترتيب مستمر لملابس الطلاب.",
        descriptionEn:
          "This is the sterilization section in the school for students' clothes where clothes are washed, ironed, and sterilized at high temperatures ensuring high cleanliness and continuous organization of students' clothes.",
      },
      {
        icon: Heart,
        titleAr: "المطبخ",
        titleEn: "Kitchen",
        descriptionAr:
          "ويتم في هذا القسم إعداد الطعام، حيث يشرف على إعداده طاقم مختص في الطهي من حملة شهادات عليا بالمجال، ويتم تزويد المطبخ بالمواد الغذائية اللازمة من خلال قسم الثلاجة المركزية التي تحفظ فيها الخضار والفواكه الطازجة والمواد التموينية ويتم تجهيزها من مستودع المواد، ويتم ضبط أعمال تحضير الطعام من خلال أخصائية تغذية تقوم بتحديد الوجبات الغذائية للطلاب حسب حاجتهم الصحية، ويتم تناول الطعام في صالات طعام مجهزة بطاولات وكراسي مهيأة بكافة أنواع الإعاقة.",
        descriptionEn:
          "In this section, food is prepared under the supervision of a specialized cooking staff with advanced degrees in the field. The kitchen is supplied with necessary food materials through the central refrigerator section where fresh vegetables, fruits, and supplies are stored and prepared from the materials warehouse. Food preparation is controlled by a nutritionist who determines students' meals according to their health needs. Food is eaten in dining halls equipped with tables and chairs suitable for all types of disabilities.",
      },
      {
        icon: Users,
        titleAr: "قسم المكالمات المرئية",
        titleEn: "Video Calls Section",
        descriptionAr:
          "قسم خاص بالتواصل المرئي بين الطلاب وأهاليهم بشكل مباشر على شاشة عرض، حيث تساعد على التواصل المستمر بين الطالب وأهله.",
        descriptionEn:
          "A special section for visual communication between students and their families directly on a display screen, helping maintain continuous communication between the student and their family.",
      },
      {
        icon: Shield,
        titleAr: "قسم المراقبة والتحكم",
        titleEn: "Surveillance and Control Section",
        descriptionAr:
          "يحتوي هذا القسم على شاشات عرض مربوطة بكاميرات مراقبة في جميع أقسام المدرسة، تضمن مراقبة الطلاب والموظفين على مدار اليوم وبواقع 24/7.",
        descriptionEn:
          "This section contains display screens connected to surveillance cameras in all school sections, ensuring monitoring of students and staff throughout the day 24/7.",
      },
    ],
  },
  activities: {
    icon: Sparkles,
    titleAr: "الأنشطة اللامنهجية",
    titleEn: "Extracurricular Activities",
    color: "from-purple-600 via-violet-600 to-indigo-600",
    welcomeAr: "مرحباً بكم في قسم الأنشطة اللامنهجية - حيث المتعة والتعلم",
    welcomeEn: "Welcome to Extracurricular Activities - Where Fun Meets Learning",
    descriptionAr:
      "يتم في هذا القسم تنظيم رحلات أسبوعية للطلاب خارج المدرسة وترتيب عملية نقلهم وحاجاتهم في الرحلة. نقدم مجموعة متنوعة من الأنشطة الترفيهية والتعليمية التي تساعد على تنمية المهارات الاجتماعية والترفيهية للطلاب.",
    descriptionEn:
      "In this section, weekly trips are organized for students outside the school, arranging their transportation and needs during the trip. We offer a variety of recreational and educational activities that help develop students' social and recreational skills.",
    heroSlides: [
      {
        image: "/special-needs-students-on-educational-field-trip-w.jpg",
        titleAr: "الرحلات الأسبوعية",
        titleEn: "Weekly Trips",
        descriptionAr: "رحلات ترفيهية وتعليمية منظمة",
        descriptionEn: "Organized recreational and educational trips",
      },
      {
        image: "/special-needs-students-participating-in-recreation.jpg",
        titleAr: "الأنشطة الترفيهية",
        titleEn: "Recreational Activities",
        descriptionAr: "أنشطة متنوعة لتنمية المهارات الاجتماعية",
        descriptionEn: "Various activities for developing social skills",
      },
      {
        image: "/special-needs-students-celebrating-special-event-w.jpg",
        titleAr: "الفعاليات الخاصة",
        titleEn: "Special Events",
        descriptionAr: "احتفالات ومناسبات خاصة للطلاب",
        descriptionEn: "Celebrations and special occasions for students",
      },
    ],
    subsections: [
      {
        icon: Sparkles,
        titleAr: "الرحلات الأسبوعية",
        titleEn: "Weekly Trips",
        descriptionAr:
          "يتم في هذا القسم تنظيم رحلات أسبوعية للطلاب خارج المدرسة وترتيب عملية نقلهم وحاجاتهم في الرحلة.",
        descriptionEn:
          "In this section, weekly trips are organized for students outside the school, arranging their transportation and needs during the trip.",
      },
      {
        icon: Users,
        titleAr: "الأنشطة الاجتماعية",
        titleEn: "Social Activities",
        descriptionAr: "نشاطات لا منهجية متنوعة تساعد على التكيف والدمج الاجتماعي.",
        descriptionEn: "Various extracurricular activities that help with adaptation and social integration.",
      },
      {
        icon: Heart,
        titleAr: "الفعاليات الترفيهية",
        titleEn: "Recreational Events",
        descriptionAr: "احتفالات ومناسبات خاصة تعزز روح الفريق والانتماء.",
        descriptionEn: "Celebrations and special occasions that enhance team spirit and belonging.",
      },
    ],
  },
  physical: {
    icon: Activity,
    titleAr: "العلاج الطبيعي",
    titleEn: "Physical Therapy",
    color: "from-green-600 via-emerald-600 to-teal-600",
    welcomeAr: "مرحباً بكم في قسم العلاج الطبيعي - نحو حركة أفضل",
    welcomeEn: "Welcome to Physical Therapy - Towards Better Movement",
    descriptionAr:
      "هو أحد أقسام المدرسة الذي يختص بمعالجة وتأهيل ذوي الإعاقة الحركية والجسدية لتنمية القدرات الحركية والوظيفية، وتمكين الأفراد على الاعتماد على أنفسهم في نواحي الحياة المختلفة، ويتوفر في المدرسة غرفتين علاج طبيعي غرفة للذكور وأخرى للإناث.",
    descriptionEn:
      "One of the school sections specializing in treating and rehabilitating those with motor and physical disabilities to develop motor and functional abilities, enabling individuals to depend on themselves in various aspects of life. The school has two physical therapy rooms, one for males and one for females.",
    heroSlides: [
      {
        image: "/hydrotherapy-pool-with-jacuzzi-for-special-needs-s.jpg",
        titleAr: "العلاج المائي",
        titleEn: "Hydrotherapy",
        descriptionAr: "جاكوزي وبركة مائية للعلاج الطبيعي",
        descriptionEn: "Jacuzzi and water pool for physical therapy",
      },
      {
        image: "/sports-rehabilitation-gym-with-equipment-for-speci.jpg",
        titleAr: "التأهيل الرياضي",
        titleEn: "Sports Rehabilitation",
        descriptionAr: "صالات رياضية وملاعب مجهزة",
        descriptionEn: "Equipped sports halls and playgrounds",
      },
      {
        image: "/respiratory-treatment-unit-with-therapist-helping-.jpg",
        titleAr: "المعالجة التنفسية",
        titleEn: "Respiratory Treatment",
        descriptionAr: "وحدة متخصصة للمعالجة التنفسية",
        descriptionEn: "Specialized respiratory treatment unit",
      },
    ],
    subsections: [
      {
        icon: Activity,
        titleAr: "قسم العلاج المائي",
        titleEn: "Hydrotherapy Section",
        descriptionAr:
          "يتضمن الجاكوزي والبركة المائية، يتم فيه استخدام الماء بدرجات حرارة متفاوتة لغايات صحية متنوعة، يعتبر هذا القسم من أهم العلاجات الطبيعية لتخفيف الآلام والأعراض، حيث يتم معالجة المشاكل العضوية والتنفسية والاسترخاء الجسدي وإعادة التأهيل البدني، بالإضافة لاستخدام هذا القسم لأغراض الترفيه.",
        descriptionEn:
          "Includes jacuzzi and water pool, where water is used at varying temperatures for various health purposes. This section is one of the most important natural treatments for pain and symptom relief, treating organic and respiratory problems, physical relaxation, and physical rehabilitation, in addition to using this section for recreational purposes.",
      },
      {
        icon: Target,
        titleAr: "قسم التأهيل الرياضي العلاجي",
        titleEn: "Therapeutic Sports Rehabilitation Section",
        descriptionAr:
          "يعمل قسم التأهيل الرياضي لرفع مستوى الأداء البدني، وممارسة تمرينات وألعاب تسهم في تطور مختلف جوانب اللياقة البدنية لدى طلاب الإعاقة ويتوفر في المدرسة صالتي أنشطة وألعاب وملعبين خارجيين.",
        descriptionEn:
          "The sports rehabilitation section works to raise the level of physical performance, practicing exercises and games that contribute to the development of various aspects of physical fitness for students with disabilities. The school has two activity and game halls and two outdoor playgrounds.",
      },
      {
        icon: Heart,
        titleAr: "وحدة المعالجة التنفسية",
        titleEn: "Respiratory Treatment Unit",
        descriptionAr:
          "تهتم بمعالجة الجهاز التنفسي الرئوي من حيث استخلاص البلغم وتحسين طريقة التنفس بشكل يومي للحالات التي تحتاج ذلك.",
        descriptionEn:
          "Focuses on treating the pulmonary respiratory system in terms of phlegm extraction and improving breathing methods daily for cases that need it.",
      },
    ],
  },
  computer: {
    icon: Laptop,
    titleAr: "الحاسوب",
    titleEn: "Computer Department",
    color: "from-sky-600 via-blue-600 to-indigo-600",
    welcomeAr: "مرحباً بكم في قسم الحاسوب - نحو مستقبل رقمي",
    welcomeEn: "Welcome to Computer Department - Towards a Digital Future",
    descriptionAr:
      "يقدم قسم الحاسوب للطلاب والطالبات فرص تعلم المهارات الأساسية والمتقدمة في مجال التكنولوجيا، من التحكم بحركة الماوس والتعرف على أجزاء الحاسوب إلى البرمجة والروبوت، مع توظيف هذه المهارات في النواحي التعليمية والترفيهية.",
    descriptionEn:
      "The Computer Department offers students opportunities to learn basic and advanced skills in technology, from mouse control and computer parts recognition to programming and robotics, employing these skills in educational and recreational aspects.",
    heroSlides: [
      {
        image: "/special-needs-students-learning-computer-skills-in.jpg",
        titleAr: "قسم الكمبيوتر",
        titleEn: "Computer Section",
        descriptionAr: "تعلم المهارات الأساسية والبرامج الحديثة",
        descriptionEn: "Learning basic skills and modern programs",
      },
      {
        image: "/placeholder.svg?height=800&width=1600",
        titleAr: "قسم الإلكترونيات",
        titleEn: "Electronics Section",
        descriptionAr: "تعليم علوم الروبوت والبرمجة",
        descriptionEn: "Teaching robotics and programming",
      },
      {
        image: "/placeholder.svg?height=800&width=1600",
        titleAr: "المختبر العملي",
        titleEn: "Practical Laboratory",
        descriptionAr: "بيئة عملية لتطبيق المهارات التقنية",
        descriptionEn: "Practical environment for applying technical skills",
      },
    ],
    subsections: [
      {
        icon: Laptop,
        titleAr: "قسم الكمبيوتر",
        titleEn: "Computer Section",
        descriptionAr:
          "يقدم هذا القسم للطلاب والطالبات فرص تعلم المهارات الأساسية، مثل التحكم بحركة الماوس والتعرف على أجزاء الحاسوب. وكذلك التعامل مع برنامج فوتوشوب وبرامج تعديل الصور. حيث يعمل الفريق الفني المشرف بالقسم على توظيف هذه المهارات في النواحي التعليمية والنواحي الترفيهية وفقاً لقدرات كل طالب على حدى.",
        descriptionEn:
          "This section offers students opportunities to learn basic skills, such as mouse control and computer parts recognition. As well as dealing with Photoshop and image editing programs. The technical team supervising the section works to employ these skills in educational and recreational aspects according to each student's abilities.",
      },
      {
        icon: Brain,
        titleAr: "قسم الإلكترونيات",
        titleEn: "Electronics Section",
        descriptionAr:
          "توفر المدرسة بيئة مخبرية عملية وعلمية متخصصة بتعليم علوم الروبوت (وهو فرع من فروع الفيزياء والهندسة)؛ ويهدف هذا المختبر إلى تطوير مهارات التفكير لدى الطلبة ذوي الإعاقة، واكتشاف مواطن القوة والعمل على تطويرها، حيث يقوم الطالب ببناء نماذج مصغرة (روبوتات) لتطبيقات في المجالات الصناعية والعلمية. مما يساعد في فهم طريقة عمل الروبوتات من حولنا. أيضاً في هذا المختبر يتعلم الطلاب مبادئ البرمجة باستخدام الروبوت، بالإضافة إلى تعلم مبادئ الميكانيك باستخدام الروبوت بطريقة عملية وسهلة وممتعة.",
        descriptionEn:
          "The school provides a practical and scientific laboratory environment specialized in teaching robotics (a branch of physics and engineering); this laboratory aims to develop thinking skills for students with disabilities, discover strengths and work on developing them, where the student builds miniature models (robots) for applications in industrial and scientific fields. This helps understand how robots around us work. Also in this laboratory, students learn programming principles using robots, in addition to learning mechanics principles using robots in a practical, easy, and fun way.",
      },
    ],
  },
}

export default function DepartmentPage() {
  const params = useParams()
  const { language, t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false) // State for scroll animation
  const slug = params.slug as string

  const department = departmentsData[slug as keyof typeof departmentsData]

  useEffect(() => {
    if (!department) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % department.heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [department])

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const elements = document.querySelectorAll(".scroll-animate")
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // Add 'visible' class when element is within the viewport (80% threshold)
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add("visible")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger initial check on component mount
    handleScroll()

    // Cleanup scroll listener
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleContactClick = () => {
    // If we are on the home page, scroll directly
    setTimeout(() => {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
    window.location.href = "/#contact"
  }

  const handleHomeClick = () => {
    window.location.href = "/"
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{language === "ar" ? "القسم غير موجود" : "Department Not Found"}</h1>
          <Link href="/">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-105">
              {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = department.icon
  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative h-[90vh] overflow-hidden">
        {/* Multi-layered animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 animate-gradient-x" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.15),transparent_50%)] animate-pulse-slow delay-1000" />

        {/* Floating decorative particles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

        {department.heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white">
                {/* Enhanced icon badge with 3D effect */}
                <div
                  className={`inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r ${department.color} rounded-full mb-12 shadow-2xl backdrop-blur-sm border-2 border-white/30 animate-scale-in cursor-pointer hover:scale-110 hover:rotate-3 transition-all duration-500 relative overflow-hidden group`}
                  onClick={() => scrollToSection("subsections")}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <Icon className="w-12 h-12 animate-pulse relative z-10" />
                  <span className="text-2xl font-bold relative z-10">
                    {language === "ar" ? department.titleAr : department.titleEn}
                  </span>
                  <Zap className="w-6 h-6 animate-bounce relative z-10" />
                </div>

                {/* Enhanced title with gradient animation */}
                <h1 className="text-6xl md:text-8xl font-bold mb-10 animate-slide-up text-balance leading-tight drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient-x">
                  {language === "ar" ? slide.titleAr : slide.titleEn}
                </h1>

                {/* Enhanced description */}
                <p className="text-2xl md:text-4xl mb-12 max-w-5xl mx-auto animate-fade-in text-pretty leading-relaxed drop-shadow-lg font-light">
                  {language === "ar" ? slide.descriptionAr : slide.descriptionEn}
                </p>

                {/* Enhanced badges with glow effects */}
                <div className="flex flex-wrap gap-6 justify-center animate-slide-in-bottom">
                  <button
                    onClick={() => scrollToSection("welcome")}
                    className="flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/25 hover:scale-110 hover:border-white/50 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CheckCircle className="w-6 h-6 group-hover:rotate-12 transition-transform relative z-10" />
                    <span className="text-lg font-semibold relative z-10">
                      {language === "ar" ? "معتمد دولياً" : "Internationally Accredited"}
                    </span>
                  </button>
                  <button
                    onClick={() => scrollToSection("subsections")}
                    className="flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/25 hover:scale-110 hover:border-white/50 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Star className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                    <span className="text-lg font-semibold relative z-10">
                      {language === "ar" ? "كوادر متخصصة" : "Specialized Staff"}
                    </span>
                  </button>
                  <button
                    onClick={() => scrollToSection("subsections")}
                    className="flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/25 hover:scale-110 hover:border-white/50 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Award className="w-6 h-6 group-hover:scale-125 transition-transform relative z-10" />
                    <span className="text-lg font-semibold relative z-10">
                      {language === "ar" ? "برامج متطورة" : "Advanced Programs"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced navigation dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {department.heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-500 hover:scale-125 relative overflow-hidden ${
                index === currentSlide
                  ? "bg-white w-20 shadow-lg shadow-white/50"
                  : "bg-white/40 w-10 hover:bg-white/60 hover:w-16"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-slide" />
              )}
            </button>
          ))}
        </div>

        {/* Enhanced navigation arrows */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + department.heroSlides.length) % department.heroSlides.length)
          }
          className="absolute left-8 top-1/2 -translate-y-1/2 p-5 bg-white/15 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-125 z-10 group"
          aria-label="Previous slide"
        >
          <ArrowLeft className="w-7 h-7 text-white group-hover:scale-110 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % department.heroSlides.length)}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-5 bg-white/15 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-125 z-10 group"
          aria-label="Next slide"
        >
          <ArrowRight className="w-7 h-7 text-white group-hover:scale-110 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-bounce-slow z-10">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-2 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <section
        id="welcome"
        className="py-24 bg-gradient-to-b from-muted/40 via-background to-muted/40 relative overflow-hidden scroll-animate opacity-0 transition-all duration-1000"
      >
        {/* Animated background patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Card className="p-12 md:p-20 bg-gradient-to-br from-background via-background to-muted/50 border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 backdrop-blur-sm relative overflow-hidden group">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-700 animate-gradient-x" />

            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex flex-col md:flex-row items-start gap-10 relative z-10">
              <div
                className={`p-10 bg-gradient-to-br ${department.color} rounded-3xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-700 cursor-pointer relative overflow-hidden group/icon`}
                onClick={() => scrollToSection("subsections")}
              >
                {/* Pulsing glow effect */}
                <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse-glow" />
                <Icon className="w-20 h-20 text-white relative z-10 group-hover/icon:scale-110 transition-transform" />
                {/* Rotating ring */}
                <div className="absolute inset-0 border-4 border-white/30 rounded-3xl animate-spin-slow" />
              </div>

              <div className="flex-1">
                <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                  {language === "ar" ? department.welcomeAr : department.welcomeEn}
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                  {language === "ar" ? department.descriptionAr : department.descriptionEn}
                </p>

                {/* Enhanced statistics cards */}
                <div className="grid grid-cols-3 gap-6 mt-10">
                  <button
                    onClick={() => scrollToSection("subsections")}
                    className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl hover:from-primary/20 hover:to-primary/10 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-primary/20 hover:border-primary/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="text-4xl font-bold text-primary mb-3 group-hover:scale-125 transition-transform relative z-10">
                      {department.subsections.length}+
                    </div>
                    <div className="text-sm font-medium text-muted-foreground relative z-10">
                      {language === "ar" ? "قسم فرعي" : "Subsections"}
                    </div>
                  </button>

                  <button
                    onClick={handleContactClick}
                    className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl hover:from-accent/20 hover:to-accent/10 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-accent/20 hover:border-accent/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="text-4xl font-bold text-accent mb-3 group-hover:scale-125 transition-transform relative z-10">
                      24/7
                    </div>
                    <div className="text-sm font-medium text-muted-foreground relative z-10">
                      {language === "ar" ? "خدمة مستمرة" : "Continuous Service"}
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection("cta")}
                    className="text-center p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl hover:from-secondary/20 hover:to-secondary/10 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-secondary/20 hover:border-secondary/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="text-4xl font-bold text-secondary-foreground mb-3 group-hover:scale-125 transition-transform relative z-10">
                      100%
                    </div>
                    <div className="text-sm font-medium text-muted-foreground relative z-10">
                      {language === "ar" ? "التزام بالجودة" : "Quality Commitment"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section
        id="subsections"
        className="py-32 relative overflow-hidden scroll-animate opacity-0 transition-all duration-1000"
      >
        {/* Multi-layered animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.08),transparent_70%)]" />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border-4 border-primary/20 rounded-lg animate-spin-slow" />
        <div className="absolute bottom-40 right-20 w-24 h-24 border-4 border-accent/20 rounded-full animate-float-delayed" />
        <div
          className="absolute top-1/2 right-10 w-16 h-16 border-4 border-secondary/20 animate-bounce-slow"
          style={{ borderRadius: "30%" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced section header */}
          <div className="text-center mb-24">
            <div className="inline-block mb-8 relative">
              <div
                className={`px-10 py-4 bg-gradient-to-r ${department.color} rounded-full text-white font-bold text-xl shadow-xl hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden group`}
                onClick={() => scrollToSection("cta")}
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">{language === "ar" ? "استكشف خدماتنا" : "Explore Our Services"}</span>
              </div>
              {/* Orbiting particles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-bounce" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-accent rounded-full animate-bounce delay-1000" />
            </div>

            <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
              {language === "ar" ? "الأقسام الفرعية" : "Subsections"}
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {language === "ar"
                ? "تعرف على جميع الخدمات والبرامج المتخصصة التي نقدمها"
                : "Discover all specialized services and programs we offer"}
            </p>
          </div>

          {/* Enhanced subsection cards with 3D effects */}
          <div className="grid md:grid-cols-2 gap-12">
            {department.subsections.map((subsection, index) => {
              const SubIcon = subsection.icon

              const handleCardClick = () => {
                scrollToSection("cta")
              }

              return (
                <Card
                  key={index}
                  className="group relative p-12 hover:shadow-3xl transition-all duration-700 border-2 border-border/50 hover:border-primary/50 hover:-translate-y-4 hover:scale-[1.02] animate-slide-in-scale overflow-hidden bg-gradient-to-br from-background to-muted/30 cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={handleCardClick}
                >
                  {/* Multi-layer gradient overlays */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${department.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Enhanced shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-glow-expand" />

                  <div className="relative z-10 flex items-start gap-8">
                    {/* Enhanced icon container with 3D effect */}
                    <div
                      className={`p-6 bg-gradient-to-br ${department.color} rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative overflow-hidden`}
                    >
                      {/* Pulsing inner glow */}
                      <div className="absolute inset-0 bg-white/30 rounded-2xl animate-pulse-glow" />

                      {/* Icon with rotation */}
                      <SubIcon className="w-12 h-12 text-white relative z-10 group-hover:rotate-180 transition-transform duration-700" />

                      {/* Orbiting ring */}
                      <div className="absolute inset-0 border-2 border-white/40 rounded-2xl animate-spin-slow" />
                    </div>

                    <div className="flex-1">
                      {/* Enhanced title with gradient */}
                      <h3 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-primary transition-colors duration-500 bg-gradient-to-r from-foreground to-primary bg-clip-text group-hover:text-transparent">
                        {language === "ar" ? subsection.titleAr : subsection.titleEn}
                      </h3>

                      {/* Enhanced description */}
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">
                        {language === "ar" ? subsection.descriptionAr : subsection.descriptionEn}
                      </p>

                      {/* Enhanced CTA with animated arrow */}
                      <div className="mt-8 flex items-center gap-3 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                        <Zap className="w-5 h-5 animate-pulse" />
                        <span className="text-lg">{language === "ar" ? "اتصل بنا للمزيد" : "Contact Us for More"}</span>
                        <ArrowIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 animate-bounce" />
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="py-32 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative overflow-hidden scroll-animate opacity-0 transition-all duration-1000"
      >
        {/* Multi-layered animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 border-4 border-white/20 rounded-lg animate-spin-slow" />
        <div className="absolute bottom-20 right-20 w-20 h-20 border-4 border-white/20 rounded-full animate-float-delayed" />
        <div
          className="absolute top-1/3 right-1/4 w-12 h-12 border-4 border-white/20 animate-bounce-slow"
          style={{ borderRadius: "30%" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced badge */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-4 px-10 py-5 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full shadow-2xl mb-8 hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="w-7 h-7 text-primary animate-pulse relative z-10" />
                <span className="text-xl font-bold relative z-10">
                  {language === "ar" ? "نحن هنا لمساعدتك" : "We're Here to Help"}
                </span>
                <Sparkles className="w-7 h-7 text-accent animate-pulse relative z-10" />
              </div>
            </div>

            {/* Enhanced title */}
            <h2 className="text-6xl md:text-7xl font-bold mb-10 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
              {language === "ar" ? "هل لديك استفسار؟" : "Have a Question?"}
            </h2>

            {/* Enhanced description */}
            <p className="text-2xl md:text-3xl text-muted-foreground mb-14 max-w-4xl mx-auto leading-relaxed font-light">
              {language === "ar"
                ? "نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في اختيار البرنامج المناسب لاحتياجاتكم"
                : "We are here to answer all your questions and help you choose the right program for your needs"}
            </p>

            {/* Enhanced action buttons */}
            <div className="flex flex-wrap gap-8 justify-center mb-16">
              <Button
                size="lg"
                onClick={handleContactClick}
                className="bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 text-xl px-12 py-8 rounded-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Phone
                  className={`w-7 h-7 ${language === "ar" ? "ml-3" : "mr-3"} group-hover:rotate-12 transition-transform relative z-10`}
                />
                <span className="relative z-10">{language === "ar" ? "تواصل معنا الآن" : "Contact Us Now"}</span>
                <ArrowIcon
                  className={`w-7 h-7 ${language === "ar" ? "mr-3" : "ml-3"} group-hover:translate-x-2 transition-transform relative z-10`}
                />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleHomeClick}
                className="border-3 border-primary hover:bg-primary hover:text-white transition-all duration-500 hover:scale-110 text-xl px-12 py-8 rounded-full bg-background/90 backdrop-blur-sm group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/100 transition-all duration-500" />
                <Home
                  className={`w-7 h-7 ${language === "ar" ? "ml-3" : "mr-3"} group-hover:scale-110 transition-transform relative z-10`}
                />
                <span className="relative z-10">{language === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
              </Button>
            </div>

            {/* Enhanced contact cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <a
                href="tel:+96264122002"
                className="flex items-center justify-center gap-4 p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-primary/20 hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Phone className="w-8 h-8 text-primary group-hover:rotate-12 group-hover:scale-125 transition-transform relative z-10" />
                <div className="text-left relative z-10">
                  <div className="text-sm text-muted-foreground font-medium">
                    {language === "ar" ? "اتصل بنا" : "Call Us"}
                  </div>
                  <div className="font-bold text-lg">4122002</div>
                </div>
              </a>

              <a
                href="mailto:info@namothajia.com"
                className="flex items-center justify-center gap-4 p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-accent/20 hover:border-accent/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Mail className="w-8 h-8 text-accent group-hover:scale-125 transition-transform relative z-10" />
                <div className="text-left relative z-10">
                  <div className="text-sm text-muted-foreground font-medium">
                    {language === "ar" ? "راسلنا" : "Email Us"}
                  </div>
                  <div className="font-bold text-sm">info@namothajia.com</div>
                </div>
              </a>

              <button
                onClick={handleContactClick}
                className="flex items-center justify-center gap-4 p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-secondary/20 hover:border-secondary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <MapPin className="w-8 h-8 text-secondary-foreground group-hover:bounce group-hover:scale-125 transition-transform relative z-10" />
                <div className="text-left relative z-10">
                  <div className="text-sm text-muted-foreground font-medium">
                    {language === "ar" ? "زرنا" : "Visit Us"}
                  </div>
                  <div className="font-bold text-sm">{language === "ar" ? "عمان، الأردن" : "Amman, Jordan"}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
