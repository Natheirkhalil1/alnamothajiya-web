"use client"

import { useParams, useRouter } from "next/navigation"
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
  ArrowLeft,
  ArrowRight,
  Users,
  Target,
  Award,
  Lightbulb,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Grid3x3,
  Utensils,
  Droplet,
  Dumbbell,
  Camera,
  Pill,
} from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

const departmentsData = {
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
        titleAr: "المتابعة الصحية",
        titleEn: "Health Monitoring",
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
        icon: Pill,
        titleAr: "الصيدلية",
        titleEn: "Pharmacy",
        descriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً.",
        descriptionEn:
          "The pharmacy contains all medications needed by students, classified by student name, and stored electronically.",
      },
      {
        icon: Activity,
        titleAr: "المتابعة الصحية",
        titleEn: "Health Monitoring",
        descriptionAr:
          "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
        descriptionEn:
          "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
      },
    ],
  },
  heart: {
    icon: Heart,
    titleAr: "قلب المدرسة",
    titleEn: "Heart of the School",
    color: "from-blue-600 via-indigo-600 to-purple-600",
    welcomeAr: "مرحباً بكم في قلب المدرسة - حيث تبدأ رحلة التميز",
    welcomeEn: "Welcome to the Heart of the School - Where Excellence Begins",
    descriptionAr:
      "قلب المدرسة هو المركز الحيوي الذي يضم جميع الأقسام التعليمية والتأهيلية والخدمية، حيث تتكامل الخدمات لتقديم تجربة تعليمية شاملة ومتميزة لجميع الطلاب.",
    descriptionEn:
      "The Heart of the School is the vital center that includes all educational, rehabilitation, and service departments, where services integrate to provide a comprehensive and distinguished educational experience for all students.",
    heroSlides: [
      {
        image: "/special-education-teacher-creating-individualized-.jpg",
        titleAr: "التربية الخاصة",
        titleEn: "Special Education",
        descriptionAr: "صفوف دراسية ووحدات تعديل سلوك متخصصة",
        descriptionEn: "Specialized classrooms and behavior modification units",
      },
      {
        image: "/occupational-therapist-working-one-on-one-with-spe.jpg",
        titleAr: "العلاج الوظيفي",
        titleEn: "Occupational Therapy",
        descriptionAr: "تنمية المهارات الوظيفية والاستقلالية",
        descriptionEn: "Developing functional and independence skills",
      },
      {
        image: "/vocational-training-workshop-with-carpentry-and-me.jpg",
        titleAr: "التأهيل المهني",
        titleEn: "Vocational Rehabilitation",
        descriptionAr: "تدريب على مهن متنوعة لسوق العمل",
        descriptionEn: "Training in various professions for the job market",
      },
    ],
    subsections: [
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
        icon: Heart,
        titleAr: "العلاج الوظيفي",
        titleEn: "Occupational Therapy",
        descriptionAr:
          "يعتبر من أهم أقسام المدرسة والذي يتناول جميع المهارات الوظيفية التي تساعد الطالب لتخطي متطلبات الحياة اليومية. ويندرج تحته: قسم التسوق لتعليم مهارات الشراء واستخدام الأموال، وقسم التكامل الحسي لتنظيم العمليات الحسية لدى الطلاب ذوي الاضطرابات الحسية.",
        descriptionEn:
          "One of the most important school sections addressing all functional skills that help students overcome daily life requirements. It includes: Shopping Section for teaching purchasing skills and money use, and Sensory Integration Section for organizing sensory processes for students with sensory disorders.",
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
        icon: Camera,
        titleAr: "قسم المراقبة والتحكم",
        titleEn: "Surveillance and Control Section",
        descriptionAr:
          "يحتوي هذا القسم على شاشات عرض مربوطة بكاميرات مراقبة في جميع أقسام المدرسة، تضمن مراقبة الطلاب والموظفين على مدار اليوم وبواقع 24/7.",
        descriptionEn:
          "This section contains display screens connected to surveillance cameras in all school sections, ensuring monitoring of students and staff throughout the day 24/7.",
      },
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
        icon: Wrench,
        titleAr: "قسم التأهيل المهني",
        titleEn: "Vocational Rehabilitation Section",
        descriptionAr:
          "يتم تدريب الطلاب على المهارات الرئيسية التي تهيئهم للدخول لسوق العمل. يحتوي على أقسام: الزراعة (بيت بلاستيكي مجهز)، قسم الحاسوب والإلكترونيات (تعليم البرمجة والروبوت)، قسم الحلاقة (للذكور والإناث)، المشغل المهني، قسم العطور، والتدريب المنزلي.",
        descriptionEn:
          "Students are trained in key skills that prepare them to enter the job market. It includes sections: Agriculture (equipped greenhouse), Computer and Electronics (programming and robotics), Barbering (for males and females), Professional Workshop, Perfumes Section, and Home Training.",
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
        icon: Users,
        titleAr: "القسم الاجتماعي",
        titleEn: "Social Section",
        descriptionAr:
          "يقوم الأخصائي الاجتماعي بعمل دراسة الحالة للطلاب لمعرفة احتياجاتهم واهتماماتهم وسلوكياتهم، ويتم وضع خطط اجتماعية وبرامج علاجية وبرامج تعديل السلوك وعمل نشاطات لا منهجية ومتابعتها وتقييمها للوصول لأعلى درجة من التكيف والدمج الاجتماعي.",
        descriptionEn:
          "The social worker conducts case studies of students to understand their needs, interests, and behaviors, developing social plans, therapeutic programs, behavior modification programs, and extracurricular activities to achieve the highest degree of adaptation and social integration.",
      },
      {
        icon: Utensils,
        titleAr: "قسم التغذية والمطبخ",
        titleEn: "Nutrition and Kitchen Section",
        descriptionAr:
          "يتم في هذا القسم إعداد الطعام تحت إشراف طاقم مختص في الطهي من حملة شهادات عليا، مع أخصائية تغذية تحدد الوجبات الغذائية للطلاب حسب حاجتهم الصحية. يشمل: المطبخ، قسم التغذية، صالة الطعام المجهزة بطاولات وكراسي مهيأة لكافة أنواع الإعاقة، والكافيتيريا.",
        descriptionEn:
          "In this section, food is prepared under the supervision of specialized cooking staff with advanced degrees, with a nutritionist who determines students' meals according to their health needs. Includes: Kitchen, Nutrition Section, Dining Hall equipped with tables and chairs suitable for all types of disabilities, and Cafeteria.",
      },
      {
        icon: Droplet,
        titleAr: "قسم المصبغة",
        titleEn: "Laundry Section",
        descriptionAr:
          "هو قسم التعقيم في المدرسة لملابس الطلاب حيث يتم غسل وكوي وتعقيم الملابس على درجات حرارة عالية تضمن نظافة عالية وترتيب مستمر لملابس الطلاب.",
        descriptionEn:
          "This is the sterilization section in the school for students' clothes where clothes are washed, ironed, and sterilized at high temperatures ensuring high cleanliness and continuous organization of students' clothes.",
      },
      {
        icon: Sparkles,
        titleAr: "قسم خدمات التنظيف",
        titleEn: "Cleaning Services Section",
        descriptionAr:
          "يتم في هذا القسم متابعة نظافة المرافق المدرسية (الحمامات، المسرح، الصالة الرياضية، الغرف الصفية، الغرف الفردية، الأجنحة، الملعب وغيرها). ويتم العمل على تعقيم وتنظيف المرافق بشكل دوري وعلى مدار الساعة.",
        descriptionEn:
          "In this section, the cleanliness of school facilities is monitored (bathrooms, theater, gym, classrooms, individual rooms, wings, playground, etc.). Facilities are sterilized and cleaned periodically and around the clock.",
      },
      {
        icon: Activity,
        titleAr: "قسم العلاج الطبيعي",
        titleEn: "Physical Therapy Section",
        descriptionAr:
          "يختص بمعالجة وتأهيل ذوي الإعاقة الحركية والجسدية لتنمية القدرات الحركية والوظيفية. يشمل: العلاج الفيزيائي (غرفتين للذكور والإناث)، العلاج التنفسي (لمعالجة الجهاز التنفسي واستخلاص البلغم)، والعلاج المائي (جاكوزي وبركة مائية لتخفيف الآلام والاسترخاء).",
        descriptionEn:
          "Specializes in treating and rehabilitating those with motor and physical disabilities to develop motor and functional abilities. Includes: Physical Therapy (two rooms for males and females), Respiratory Therapy (for treating respiratory system and phlegm extraction), and Hydrotherapy (jacuzzi and water pool for pain relief and relaxation).",
      },
      {
        icon: Dumbbell,
        titleAr: "قسم الرياضة",
        titleEn: "Sports Section",
        descriptionAr:
          "يعمل قسم التأهيل الرياضي لرفع مستوى الأداء البدني، وممارسة تمرينات وألعاب تسهم في تطور مختلف جوانب اللياقة البدنية. يشمل: صالة كاراتيه، صالة رياضية مجهزة، وملعبين خارجيين.",
        descriptionEn:
          "The sports rehabilitation section works to raise the level of physical performance, practicing exercises and games that contribute to the development of various aspects of physical fitness. Includes: Karate Hall, Equipped Gym, and Two Outdoor Playgrounds.",
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
        titleAr: "الشقق السكنية",
        titleEn: "Residential Apartments",
        descriptionAr:
          "يحتوي القسم الداخلي على شقق سكنية مجهزة تجهيزات فندقية، معدة بأفضل الأثاث ومعقمة بأفضل الطرق، ومجهزة بنظام التدفئة المركزية شتاءً وبمكيفات صيفاً. تحتوي الشقق على غرف نوم مجهزة بأسرة وصالات معيشة فيها جانب ترفيهي كبير ومناسب لجلوس كل طالب حسب حاجته، حيث يتم توزيع الطلاب في كل شقة إلى مجموعات متشابهة في الفئة العمرية وشدة الإعاقة والسلوكيات.",
        descriptionEn:
          "The internal section contains residential apartments equipped with hotel furnishings, prepared with the best furniture and sterilized in the best ways, equipped with central heating in winter and air conditioning in summer. The apartments contain bedrooms equipped with beds and living rooms with a large recreational aspect suitable for each student according to their needs, where students are distributed in each apartment into similar groups in age, disability severity, and behaviors.",
      },
      {
        icon: Sparkles,
        titleAr: "المرافق الترفيهية",
        titleEn: "Recreational Facilities",
        descriptionAr:
          "تتوفر ملاعب وصالات رياضية ملحقة بالسكن من أجل الترفيه، وهناك قاعة سينما تعرض فيها أفلام مناسبة لحاجات الطلاب.",
        descriptionEn:
          "Playgrounds and sports halls are attached to the housing for recreation, and there is a cinema hall showing films suitable for students' needs.",
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
      "يتم في هذا القسم تنظيم رحلات أسبوعية للطلاب خارج المدرسة وترتيب عملية نقلهم وحاجاتهم في الرحلة، بالإضافة إلى الأنشطة الاجتماعية المتنوعة التي تساعد على التكيف والدمج الاجتماعي.",
    descriptionEn:
      "In this section, weekly trips are organized for students outside the school, arranging their transportation and needs. Plus various social activities that help with adaptation and social integration.",
    heroSlides: [
      {
        image: "/special-needs-students-on-educational-field-trip-w.jpg",
        titleAr: "الرحلات الأسبوعية",
        titleEn: "Weekly Trips",
        descriptionAr: "رحلات ترفيهية وتعليمية منظمة",
        descriptionEn: "Organized recreational and educational trips",
      },
      {
        image: "/special-needs-students-in-social-activities-and-ga.jpg",
        titleAr: "الأنشطة الاجتماعية",
        titleEn: "Social Activities",
        descriptionAr: "نشاطات متنوعة للتكيف والدمج الاجتماعي",
        descriptionEn: "Various activities for adaptation and social integration",
      },
      {
        image: "/special-needs-students-enjoying-recreational-activ.jpg",
        titleAr: "الأنشطة الترفيهية",
        titleEn: "Recreational Activities",
        descriptionAr: "أنشطة ممتعة ومفيدة للطلاب",
        descriptionEn: "Fun and beneficial activities for students",
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
    ],
  },
}

console.log("[v0] Available departments:", Object.keys(departmentsData))
console.log("[v0] Heart department subsections count:", departmentsData.heart.subsections.length)

export default function DepartmentPage() {
  const params = useParams()
  const router = useRouter() // إضافة useRouter للتنقل الصحيح
  const { language, t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false) // State for scroll animation
  const [selectedSubsection, setSelectedSubsection] = useState<number | "all">("all")
  const slug = params.slug as string

  const department = departmentsData[slug as keyof typeof departmentsData]

  useEffect(() => {
    console.log("[v0] Current slug:", slug)
    console.log("[v0] Current department:", department ? department.titleAr : "Not found")
    if (department) {
      console.log("[v0] Department subsections:", department.subsections.length)
    }

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
    // Navigate to home page with contact hash
    router.push("/#contact")
    // Wait for navigation then scroll
    setTimeout(() => {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 300)
  }

  const handleHomeClick = () => {
    router.push("/")
  }

  const handleSubsectionSelect = (index: number | "all") => {
    setSelectedSubsection(index)
    // Smooth scroll to subsections
    setTimeout(() => {
      const element = document.getElementById("subsections-content")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  // Ensure we handle the case where department.subsections might be undefined
  const departmentSubsections = department?.subsections || []

  const displayedSubsections =
    selectedSubsection === "all"
      ? departmentSubsections
      : selectedSubsection >= 0 && selectedSubsection < departmentSubsections.length
        ? [departmentSubsections[selectedSubsection as number]]
        : []

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
        {/* Simplified background with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95" />

        {/* Background image with better overlay */}
        {department.heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-30" : "opacity-0"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            {/* Simplified department badge */}
            <div
              className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${department.color} rounded-full mb-8 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
              onClick={() => scrollToSection("subsections")}
            >
              <Icon className="w-8 h-8" />
              <span className="text-xl font-bold">{language === "ar" ? department.titleAr : department.titleEn}</span>
            </div>

            {/* Cleaner title with better sizing */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {language === "ar"
                ? department.heroSlides[currentSlide].titleAr
                : department.heroSlides[currentSlide].titleEn}
            </h1>

            {/* Better readable description */}
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-200">
              {language === "ar"
                ? department.heroSlides[currentSlide].descriptionAr
                : department.heroSlides[currentSlide].descriptionEn}
            </p>

            {/* Simplified feature badges */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{language === "ar" ? "معتمد دولياً" : "Internationally Accredited"}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Star className="w-5 h-5" />
                <span className="font-medium">{language === "ar" ? "كوادر متخصصة" : "Specialized Staff"}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Award className="w-5 h-5" />
                <span className="font-medium">{language === "ar" ? "برامج متطورة" : "Advanced Programs"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified navigation dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {department.heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Cleaner navigation arrows */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + department.heroSlides.length) % department.heroSlides.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % department.heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
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
                      {departmentSubsections.length}+
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
          <div className="text-center mb-16">
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

          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Grid3x3 className="w-6 h-6 text-primary animate-pulse" />
              <h3 className="text-2xl font-bold text-center">{language === "ar" ? "اختر القسم" : "Select Section"}</h3>
            </div>

            <div className="flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
              {/* All button */}
              <button
                onClick={() => handleSubsectionSelect("all")}
                className={`group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-110 hover:-translate-y-1 overflow-hidden ${
                  selectedSubsection === "all"
                    ? `bg-gradient-to-r ${department.color} text-white shadow-2xl scale-105`
                    : "bg-muted/50 hover:bg-muted text-foreground border-2 border-border hover:border-primary/50"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center gap-3 relative z-10">
                  <Grid3x3 className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>{language === "ar" ? "عرض الكل" : "Show All"}</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{departmentSubsections.length}</span>
                </div>
              </button>

              {/* Individual subsection buttons */}
              {departmentSubsections.map((subsection, index) => {
                const SubIcon = subsection.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleSubsectionSelect(index)}
                    className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-110 hover:-translate-y-1 overflow-hidden ${
                      selectedSubsection === index
                        ? `bg-gradient-to-r ${department.color} text-white shadow-2xl scale-105`
                        : "bg-muted/50 hover:bg-muted text-foreground border-2 border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <div className="flex items-center gap-2 relative z-10">
                      <SubIcon className="w-5 h-5 group-hover:scale-125 transition-transform" />
                      <span className="text-sm md:text-base">
                        {language === "ar" ? subsection.titleAr : subsection.titleEn}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div id="subsections-content" className="scroll-mt-32">
            {selectedSubsection === "all" ? (
              <div className="grid md:grid-cols-2 gap-8">
                {displayedSubsections.map((subsection, index) => {
                  const SubIcon = subsection.icon
                  return (
                    <Card
                      key={index}
                      className="group relative p-8 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-primary/30 hover:-translate-y-2 cursor-pointer rounded-2xl"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleSubsectionSelect(index)}
                    >
                      <div className="flex items-start gap-6">
                        {/* Simple gradient icon box */}
                        <div
                          className={`flex-shrink-0 p-5 bg-gradient-to-br ${department.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <SubIcon className="w-10 h-10 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {language === "ar" ? subsection.titleAr : subsection.titleEn}
                          </h3>
                          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                            {language === "ar" ? subsection.descriptionAr : subsection.descriptionEn}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="animate-fade-in">
                {displayedSubsections.map((subsection, index) => {
                  const SubIcon = subsection.icon
                  return (
                    <Card
                      key={index}
                      className="p-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-3xl"
                    >
                      {/* Icon and title */}
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                        <div className={`p-10 bg-gradient-to-br ${department.color} rounded-3xl shadow-xl`}>
                          <SubIcon className="w-20 h-20 text-white" />
                        </div>

                        <div className="flex-1 text-center md:text-right">
                          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            {language === "ar" ? subsection.titleAr : subsection.titleEn}
                          </h3>
                          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <div className="px-5 py-2 bg-primary/10 rounded-full border border-primary/30">
                              <span className="text-primary font-semibold text-sm">
                                {language === "ar" ? "خدمة متخصصة" : "Specialized Service"}
                              </span>
                            </div>
                            <div className="px-5 py-2 bg-accent/10 rounded-full border border-accent/30">
                              <span className="text-accent font-semibold text-sm">
                                {language === "ar" ? "كوادر مؤهلة" : "Qualified Staff"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl mb-8">
                        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                          {language === "ar" ? subsection.descriptionAr : subsection.descriptionEn}
                        </p>
                      </div>

                      {/* Features grid */}
                      <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                          <CheckCircle className="w-10 h-10 text-primary mb-3" />
                          <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                            {language === "ar" ? "برامج متطورة" : "Advanced Programs"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === "ar" ? "أحدث الأساليب والتقنيات" : "Latest methods and techniques"}
                          </p>
                        </div>

                        <div className="p-6 bg-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 hover:shadow-md transition-all duration-300">
                          <Users className="w-10 h-10 text-accent mb-3" />
                          <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                            {language === "ar" ? "فريق متخصص" : "Specialized Team"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === "ar" ? "خبراء في المجال" : "Field experts"}
                          </p>
                        </div>

                        <div className="p-6 bg-secondary/5 rounded-xl border border-secondary/20 hover:border-secondary/40 hover:shadow-md transition-all duration-300">
                          <Award className="w-10 h-10 text-secondary-foreground mb-3" />
                          <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                            {language === "ar" ? "نتائج مميزة" : "Outstanding Results"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === "ar" ? "تحقيق أفضل النتائج" : "Achieving best results"}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="text-center">
                        <Button
                          size="lg"
                          onClick={handleContactClick}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-10 py-6 rounded-full"
                        >
                          <Phone className={`w-6 h-6 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                          {language === "ar" ? "استفسر عن هذه الخدمة" : "Inquire About This Service"}
                          <ArrowIcon className={`w-6 h-6 ${language === "ar" ? "mr-2" : "ml-2"}`} />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
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
