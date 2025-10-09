"use client"

import Link from "next/link"
import {
  Stethoscope,
  Brain,
  Wrench,
  Heart,
  Home,
  Sparkles,
  Activity,
  Laptop,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Mail,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function DepartmentsSection() {
  const { language, t } = useLanguage()

  const departments = [
    {
      icon: Brain,
      titleAr: "القسم الفني",
      titleEn: "Technical Department",
      descriptionAr:
        "يضم 8 أقسام متخصصة: التقييم النفسي، الخطط والبرامج، الاجتماعي، الإرشاد النفسي، التربية الخاصة، النطق واللغة، التأهيل المهني، والعلاج الوظيفي",
      descriptionEn:
        "Includes 8 specialized sections: Psychological Assessment, Plans & Programs, Social, Psychological Counseling, Special Education, Speech & Language, Vocational Rehabilitation, and Occupational Therapy",
      image: "/special-education-classroom-with-teacher-and-stude.jpg",
      link: "/departments/technical",
      color: "from-blue-600 to-indigo-600",
      gradient: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
    },
    {
      icon: Wrench,
      titleAr: "التأهيل المهني",
      titleEn: "Vocational Rehabilitation",
      descriptionAr:
        "يشمل التهيئة المهنية والتدريب على مهن متنوعة: الزراعة، الحدادة، النجارة، التدبير المنزلي، والخياطة",
      descriptionEn:
        "Includes vocational preparation and training in various professions: Agriculture, Blacksmithing, Carpentry, Home Management, and Sewing",
      image: "/vocational-training-workshop-for-special-needs-stu.jpg",
      link: "/departments/vocational",
      color: "from-amber-600 to-orange-600",
      gradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
    },
    {
      icon: Heart,
      titleAr: "العلاج الوظيفي",
      titleEn: "Occupational Therapy",
      descriptionAr: "يتناول المهارات الوظيفية اليومية ويشمل: قسم التسوق، التكامل الحسي، والجلسات الفردية",
      descriptionEn:
        "Addresses daily functional skills including: Shopping Section, Sensory Integration, and Individual Sessions",
      image: "/occupational-therapy-session-with-special-needs-st.jpg",
      link: "/departments/occupational",
      color: "from-rose-600 to-pink-600",
      gradient: "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
    },
    {
      icon: Stethoscope,
      titleAr: "القسم الطبي",
      titleEn: "Medical Department",
      descriptionAr: "يضم العيادة الطبية، الصيدلية، والمتابعة العلاجية مع كوادر طبية متخصصة على مدار الساعة",
      descriptionEn: "Includes Medical Clinic, Pharmacy, and Medical Follow-up with specialized medical staff 24/7",
      image: "/school-medical-clinic-with-modern-equipment-for-sp.jpg",
      link: "/departments/medical",
      color: "from-red-600 to-rose-600",
      gradient: "bg-gradient-to-br from-red-500/10 to-rose-500/10",
    },
    {
      icon: Home,
      titleAr: "السكن الداخلي",
      titleEn: "Internal Housing",
      descriptionAr:
        "شقق سكنية مجهزة بتجهيزات فندقية مع خدمات شاملة: النظافة، المصبغة، المطبخ، المكالمات المرئية، والمراقبة",
      descriptionEn:
        "Fully equipped residential apartments with comprehensive services: Cleaning, Laundry, Kitchen, Video Calls, and Surveillance",
      image: "/modern-residential-housing-facilities-for-special-.jpg",
      link: "/departments/housing",
      color: "from-teal-600 to-cyan-600",
      gradient: "bg-gradient-to-br from-teal-500/10 to-cyan-500/10",
    },
    {
      icon: Sparkles,
      titleAr: "الأنشطة اللامنهجية",
      titleEn: "Extracurricular Activities",
      descriptionAr: "رحلات أسبوعية ونشاطات ترفيهية متنوعة لتنمية المهارات الاجتماعية والترفيهية للطلاب",
      descriptionEn:
        "Weekly trips and various recreational activities to develop students' social and recreational skills",
      image: "/special-needs-students-enjoying-extracurricular-ac.jpg",
      link: "/departments/activities",
      color: "from-purple-600 to-violet-600",
      gradient: "bg-gradient-to-br from-purple-500/10 to-violet-500/10",
    },
    {
      icon: Activity,
      titleAr: "العلاج الطبيعي",
      titleEn: "Physical Therapy",
      descriptionAr: "يشمل العلاج المائي، التأهيل الرياضي العلاجي، ووحدة المعالجة التنفسية لتنمية القدرات الحركية",
      descriptionEn:
        "Includes Hydrotherapy, Therapeutic Sports Rehabilitation, and Respiratory Treatment Unit for motor skills development",
      image: "/physical-therapy-session-with-special-needs-studen.jpg",
      link: "/departments/physical",
      color: "from-green-600 to-emerald-600",
      gradient: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
    },
    {
      icon: Laptop,
      titleAr: "الحاسوب",
      titleEn: "Computer Department",
      descriptionAr: "يضم قسم الكمبيوتر وقسم الإلكترونيات (الروبوت) لتعليم المهارات التقنية والبرمجة",
      descriptionEn:
        "Includes Computer Section and Electronics Section (Robotics) for teaching technical skills and programming",
      image: "/computer-lab-with-special-needs-students-learning-.jpg",
      link: "/departments/computer",
      color: "from-sky-600 to-blue-600",
      gradient: "bg-gradient-to-br from-sky-500/10 to-blue-500/10",
    },
  ]

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <section id="departments" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_40%)] animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_40%)] animate-pulse-slow delay-1000" />

      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float-delayed" />
      <div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-float-delayed"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl animate-spin-slow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-slide-in-scale">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full mb-8 border-2 border-primary/30 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105">
            <GraduationCap className="w-6 h-6 text-primary animate-bounce-slow" />
            <span className="text-base font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
              {t.departments.title}
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-8 text-balance leading-tight animate-gradient-x">
            {t.departments.subtitle}
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto">
            {language === "ar"
              ? "ثمانية أقسام متخصصة تقدم خدمات شاملة ومتكاملة لجميع الطلاب"
              : "Eight specialized departments providing comprehensive and integrated services for all students"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-3xl transition-all duration-700 border-2 border-border/50 hover:border-primary/50 hover:-translate-y-3 hover:scale-105 animate-slide-in-scale backdrop-blur-sm bg-card/80"
              style={{
                animationDelay: `${index * 150}ms`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10 animate-gradient-x" />

              <div
                className={`absolute inset-0 ${dept.gradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}
              />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide" />
              </div>

              {/* Image with enhanced effects */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dept.image || "/placeholder.svg"}
                  alt={language === "ar" ? dept.titleAr : dept.titleEn}
                  className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent group-hover:from-black/80 transition-all duration-700" />

                <div
                  className={`absolute top-6 ${language === "ar" ? "right-6" : "left-6"} w-20 h-20 bg-gradient-to-br ${dept.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-[360deg] transition-all duration-1000 animate-glow-expand`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <dept.icon className="w-10 h-10 text-white drop-shadow-2xl" />
                </div>

                <div
                  className={`absolute bottom-0 ${language === "ar" ? "left-0" : "right-0"} w-32 h-32 bg-gradient-to-tl ${dept.color} opacity-20 blur-2xl group-hover:opacity-40 group-hover:scale-150 transition-all duration-700`}
                />
              </div>

              <div className="relative p-8 space-y-5">
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-all duration-500 group-hover:translate-x-1">
                  {language === "ar" ? dept.titleAr : dept.titleEn}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-500">
                  {language === "ar" ? dept.descriptionAr : dept.descriptionEn}
                </p>

                <Link href={dept.link}>
                  <Button
                    variant="outline"
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-background to-muted hover:from-primary/20 hover:to-accent/20 border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-shimmer-slide" />

                    <span className="font-bold relative z-10">{t.departments.viewDetails}</span>
                    <ArrowIcon
                      className={`w-5 h-5 ${language === "ar" ? "mr-2" : "ml-2"} group-hover/btn:${language === "ar" ? "-translate-x-2" : "translate-x-2"} transition-transform duration-500 relative z-10`}
                    />
                  </Button>
                </Link>
              </div>

              <div
                className={`absolute top-0 ${language === "ar" ? "left-0" : "right-0"} w-24 h-24 bg-gradient-to-br ${dept.color} opacity-10 blur-3xl group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 animate-pulse-slow`}
              />
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center animate-slide-in-bottom">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-[2rem] blur-3xl animate-pulse-slow" />

            <div className="relative bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-2xl rounded-[2rem] p-16 border-2 border-primary/30 shadow-2xl hover:shadow-primary/20 transition-all duration-700 hover:scale-[1.02]">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl mb-8 shadow-2xl animate-float-slow hover:rotate-12 transition-transform duration-500">
                <Mail className="w-12 h-12 text-white drop-shadow-2xl" />
              </div>

              <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                {language === "ar" ? "هل لديك استفسار؟" : "Have a Question?"}
              </h3>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                {language === "ar"
                  ? "فريقنا جاهز للإجابة على جميع استفساراتكم وتقديم المساعدة"
                  : "Our team is ready to answer all your questions and provide assistance"}
              </p>

              <Button
                size="lg"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="relative text-xl px-12 py-8 bg-gradient-to-r from-primary via-accent to-primary hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-110 overflow-hidden group/cta animate-gradient-x"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/cta:opacity-100 group-hover/cta:animate-shimmer-slide" />

                <span className="relative z-10 font-bold">
                  {language === "ar" ? "تواصل معنا الآن" : "Contact Us Now"}
                </span>
                <ArrowIcon
                  className={`w-6 h-6 ${language === "ar" ? "mr-3" : "ml-3"} relative z-10 group-hover/cta:${language === "ar" ? "-translate-x-2" : "translate-x-2"} transition-transform duration-500`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
