"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Stethoscope,
  Pill,
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Phone,
  Mail,
  MapPin,
  Grid3x3,
  Sparkles,
  Home,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function MedicalDepartmentPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isWelcomeAnimatingOut, setIsWelcomeAnimatingOut] = useState(false)
  const [selectedSubsection, setSelectedSubsection] = useState<number | "all">("all")

  const department = {
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
        image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
        descriptionAr:
          "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)، وفيها معدات طبية شاملة لجميع الحالات الطارئة واليومية، ويتوفر فيها سيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية على مدار الساعة.",
        descriptionEn:
          "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7), comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies available 24/7.",
        branches: [],
      },
      {
        icon: Pill,
        titleAr: "الصيدلية",
        titleEn: "Pharmacy",
        image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
        descriptionAr: "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً.",
        descriptionEn:
          "The pharmacy contains all medications needed by students, classified by student name, and stored electronically.",
        branches: [],
      },
      {
        icon: Activity,
        titleAr: "المتابعة الصحية",
        titleEn: "Health Monitoring",
        image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
        descriptionAr:
          "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
        descriptionEn:
          "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
        branches: [],
      },
    ],
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % department.heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const animateOutTimer = setTimeout(() => {
      setIsWelcomeAnimatingOut(true)
    }, 29000)

    const hideTimer = setTimeout(() => {
      setShowWelcome(false)
    }, 30000)

    return () => {
      clearTimeout(animateOutTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const elements = document.querySelectorAll(".scroll-animate")
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add("visible")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleContactClick = () => {
    router.push("/#contact")
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
    setTimeout(() => {
      const element = document.getElementById("subsections-content")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const departmentSubsections = department.subsections || []

  const displayedSubsections =
    selectedSubsection === "all"
      ? departmentSubsections
      : selectedSubsection >= 0 && selectedSubsection < departmentSubsections.length
        ? [departmentSubsections[selectedSubsection as number]]
        : []

  const Icon = department.icon
  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[90vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95" />

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
              <div
                className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${department.color} rounded-full mb-8 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
                onClick={() => scrollToSection("subsections")}
              >
                <Icon className="w-8 h-8" />
                <span className="text-xl font-bold">{language === "ar" ? department.titleAr : department.titleEn}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {language === "ar"
                  ? department.heroSlides[currentSlide].titleAr
                  : department.heroSlides[currentSlide].titleEn}
              </h1>

              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-200">
                {language === "ar"
                  ? department.heroSlides[currentSlide].descriptionAr
                  : department.heroSlides[currentSlide].descriptionEn}
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    {language === "ar" ? "معتمد دولياً" : "Internationally Accredited"}
                  </span>
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

        {/* Welcome Section */}
        {showWelcome && (
          <section
            id="welcome"
            className={`py-24 bg-gradient-to-b from-muted/40 via-background to-muted/40 relative overflow-hidden scroll-animate transition-all duration-1000 ${
              isWelcomeAnimatingOut ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float-slow" />
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <Card className="p-12 md:p-20 bg-gradient-to-br from-background via-background to-muted/50 border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-700 animate-gradient-x" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="flex flex-col md:flex-row items-start gap-10 relative z-10">
                  <div
                    className={`p-10 bg-gradient-to-br ${department.color} rounded-3xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-700 cursor-pointer relative overflow-hidden group/icon`}
                    onClick={() => scrollToSection("subsections")}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse-glow" />
                    <Icon className="w-20 h-20 text-white relative z-10 group-hover/icon:scale-110 transition-transform" />
                    <div className="absolute inset-0 border-4 border-white/30 rounded-3xl animate-spin-slow" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                      {language === "ar" ? department.welcomeAr : department.welcomeEn}
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                      {language === "ar" ? department.descriptionAr : department.descriptionEn}
                    </p>

                    <div className="grid grid-cols-3 gap-6 mt-10">
                      <button
                        onClick={() => scrollToSection("subsections")}
                        className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl hover:from-primary/20 hover:to-primary/10 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-primary/20 hover:border-primary/40"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
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
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
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
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
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
        )}

        {/* Subsections */}
        <section
          id="subsections"
          className="py-32 relative overflow-hidden scroll-animate opacity-0 transition-all duration-1000"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse-slow" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse-slow delay-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.08),transparent_70%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-8 relative">
                <div
                  className={`px-10 py-4 bg-gradient-to-r ${department.color} rounded-full text-white font-bold text-xl shadow-xl hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden group`}
                  onClick={() => scrollToSection("cta")}
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">{language === "ar" ? "استكشف خدماتنا" : "Explore Our Services"}</span>
                </div>
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
                <h3 className="text-2xl font-bold text-center">
                  {language === "ar" ? "اختر القسم" : "Select Section"}
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedSubsections.map((subsection, index) => {
                    const SubIcon = subsection.icon
                    return (
                      <Card
                        key={index}
                        className="group relative overflow-hidden bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:-translate-y-4 cursor-pointer rounded-3xl"
                        onClick={() => handleSubsectionSelect(index)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={subsection.image || "/placeholder.svg"}
                            alt={language === "ar" ? subsection.titleAr : subsection.titleEn}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                          <div
                            className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} p-4 bg-gradient-to-br ${department.color} rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                          >
                            <SubIcon className="w-8 h-8 text-white" />
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {language === "ar" ? subsection.titleAr : subsection.titleEn}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                            {language === "ar" ? subsection.descriptionAr : subsection.descriptionEn}
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                            <span>{language === "ar" ? "عرض التفاصيل" : "View Details"}</span>
                            <ArrowIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
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
                      <div key={index} className="space-y-12">
                        {subsection.image && (
                          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
                            <img
                              src={subsection.image || "/placeholder.svg"}
                              alt={language === "ar" ? subsection.titleAr : subsection.titleEn}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                            <div className="absolute inset-0 flex flex-col justify-end p-12">
                              <div className="flex items-end gap-8">
                                <div
                                  className={`p-8 bg-gradient-to-br ${department.color} rounded-3xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-500 relative overflow-hidden group/icon`}
                                >
                                  <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse-glow" />
                                  <SubIcon className="w-16 h-16 text-white relative z-10" />
                                  <div className="absolute inset-0 border-4 border-white/30 rounded-3xl animate-spin-slow" />
                                </div>

                                <div className="flex-1">
                                  <h3 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                                    {language === "ar" ? subsection.titleAr : subsection.titleEn}
                                  </h3>
                                  <div className="flex flex-wrap gap-3">
                                    <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                      <span className="text-white font-semibold">
                                        {language === "ar" ? "خدمة متخصصة" : "Specialized Service"}
                                      </span>
                                    </div>
                                    <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                      <span className="text-white font-semibold">
                                        {language === "ar" ? "كوادر مؤهلة" : "Qualified Staff"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <Card className="p-10 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />

                          <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {language === "ar" ? "نبذة عن القسم" : "About the Section"}
                              </h4>
                            </div>

                            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                              {language === "ar" ? subsection.descriptionAr : subsection.descriptionEn}
                            </p>
                          </div>
                        </Card>

                        <Card className="p-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/20 rounded-3xl text-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full mb-6">
                              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                              <span className="text-xl font-bold">
                                {language === "ar" ? "هل أنت مهتم؟" : "Interested?"}
                              </span>
                            </div>

                            <h4 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                              {language === "ar" ? "تواصل معنا للمزيد من المعلومات" : "Contact Us for More Information"}
                            </h4>

                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                              {language === "ar"
                                ? "فريقنا المتخصص جاهز للإجابة على جميع استفساراتكم ومساعدتكم"
                                : "Our specialized team is ready to answer all your questions and assist you"}
                            </p>

                            <Button
                              size="lg"
                              onClick={handleContactClick}
                              className="bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 text-xl px-12 py-7 rounded-full group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                              <Phone
                                className={`w-7 h-7 ${language === "ar" ? "ml-3" : "mr-3"} group-hover:rotate-12 transition-transform relative z-10`}
                              />
                              <span className="relative z-10">
                                {language === "ar" ? "استفسر عن هذه الخدمة" : "Inquire About This Service"}
                              </span>
                              <ArrowIcon
                                className={`w-7 h-7 ${language === "ar" ? "mr-3" : "ml-3"} group-hover:translate-x-2 transition-transform relative z-10`}
                              />
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          className="py-32 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative overflow-hidden scroll-animate opacity-0 transition-all duration-1000"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
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

              <h2 className="text-6xl md:text-7xl font-bold mb-10 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                {language === "ar" ? "هل لديك استفسار؟" : "Have a Question?"}
              </h2>

              <p className="text-2xl md:text-3xl text-muted-foreground mb-14 max-w-4xl mx-auto leading-relaxed font-light">
                {language === "ar"
                  ? "نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في اختيار البرنامج المناسب لاحتياجاتكم"
                  : "We are here to answer all your questions and help you choose the right program for your needs"}
              </p>

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
      </div>
    </LayoutWrapper>
  )
}
