"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, GraduationCap, Mail, Sparkles, Heart, Home, Activity, Stethoscope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getDepartmentContents, type DepartmentContent } from "@/lib/storage"

export function DepartmentsSection() {
  const { language, t } = useLanguage()
  const [departments, setDepartments] = useState<DepartmentContent[]>([])

  useEffect(() => {
    const loadDepartmentsData = () => {
      const depts = getDepartmentContents()
      setDepartments(depts)
    }

    loadDepartmentsData()

    const handleStorageChange = () => {
      loadDepartmentsData()
    }

    window.addEventListener("localStorageChange", handleStorageChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  const getDepartmentIcon = (type: string) => {
    const icons: Record<string, any> = {
      medical: Stethoscope,
      heart: Heart,
      housing: Home,
      activities: Activity,
    }
    return icons[type] || GraduationCap
  }

  const getColorScheme = (type: string) => {
    const schemes: Record<
      string,
      {
        gradient: string
        cardGradient: string
        iconGradient: string
        glowColor: string
        borderColor: string
      }
    > = {
      medical: {
        gradient: "from-rose-500/20 via-pink-500/20 to-red-500/20",
        cardGradient: "from-rose-500/10 to-pink-500/10",
        iconGradient: "from-rose-500 to-pink-600",
        glowColor: "shadow-rose-500/50",
        borderColor: "border-rose-500/30 hover:border-rose-500",
      },
      heart: {
        gradient: "from-purple-500/20 via-violet-500/20 to-fuchsia-500/20",
        cardGradient: "from-purple-500/10 to-violet-500/10",
        iconGradient: "from-purple-500 to-violet-600",
        glowColor: "shadow-purple-500/50",
        borderColor: "border-purple-500/30 hover:border-purple-500",
      },
      housing: {
        gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
        cardGradient: "from-blue-500/10 to-cyan-500/10",
        iconGradient: "from-blue-500 to-cyan-600",
        glowColor: "shadow-blue-500/50",
        borderColor: "border-blue-500/30 hover:border-blue-500",
      },
      activities: {
        gradient: "from-amber-500/20 via-orange-500/20 to-yellow-500/20",
        cardGradient: "from-amber-500/10 to-orange-500/10",
        iconGradient: "from-amber-500 to-orange-600",
        glowColor: "shadow-amber-500/50",
        borderColor: "border-amber-500/30 hover:border-amber-500",
      },
    }
    return (
      schemes[type] || {
        gradient: "from-primary/20 via-accent/20 to-primary/20",
        cardGradient: "from-primary/10 to-accent/10",
        iconGradient: "from-primary to-accent",
        glowColor: "shadow-primary/50",
        borderColor: "border-primary/30 hover:border-primary",
      }
    )
  }

  return (
    <section id="departments" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 opacity-0 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full mb-8 border-2 border-primary/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-base font-bold text-primary tracking-wide">{t.departments.title}</span>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          <h2 className="text-6xl md:text-7xl font-black mb-8 text-balance bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text">
            {t.departments.subtitle}
          </h2>

          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            {language === "ar"
              ? "أقسام متخصصة تقدم خدمات شاملة ومتكاملة لجميع الطلاب بأعلى معايير الجودة والاحترافية"
              : "Specialized departments providing comprehensive and integrated services for all students with the highest standards of quality and professionalism"}
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
            <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد أقسام</h3>
            <p className="text-muted-foreground">لم يتم إضافة أقسام بعد</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {departments.map((dept, index) => {
              const colorScheme = getColorScheme(dept.type)
              const Icon = getDepartmentIcon(dept.type)

              return (
                <Card
                  key={dept.id}
                  className={`group relative overflow-hidden border-2 ${colorScheme.borderColor} transition-all duration-700 hover:shadow-2xl ${colorScheme.glowColor} opacity-0 animate-fade-in-up backdrop-blur-sm bg-card/50`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                  />

                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={dept.image || "/placeholder.svg"}
                      alt={language === "ar" ? dept.titleAr : dept.titleEn}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div
                      className={`absolute top-6 ${language === "ar" ? "right-6" : "left-6"} w-16 h-16 bg-gradient-to-br ${colorScheme.iconGradient} rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div
                      className={`absolute bottom-6 ${language === "ar" ? "left-6" : "right-6"} px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full border border-white/20 shadow-lg transform transition-all duration-700 group-hover:scale-110`}
                    >
                      <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {language === "ar" ? "قسم متخصص" : "Specialized"}
                      </span>
                    </div>
                  </div>

                  <div className="relative p-8 space-y-6">
                    <h3 className="text-3xl font-black text-foreground transition-all duration-500 group-hover:text-primary group-hover:translate-x-2">
                      {language === "ar" ? dept.titleAr : dept.titleEn}
                    </h3>

                    <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                      {language === "ar" ? dept.descriptionAr : dept.descriptionEn}
                    </p>

                    <Link href={`/departments/${dept.type}`} className="block">
                      <Button
                        size="lg"
                        className={`w-full group/btn relative overflow-hidden bg-gradient-to-r ${colorScheme.iconGradient} hover:shadow-xl transition-all duration-500 hover:scale-105 text-white border-0`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />

                        <span className="relative font-bold text-lg">{t.departments.viewDetails}</span>
                        <ArrowIcon
                          className={`relative w-5 h-5 ${language === "ar" ? "mr-3" : "ml-3"} transition-transform duration-500 group-hover/btn:${language === "ar" ? "-translate-x-2" : "translate-x-2"}`}
                        />
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-24 text-center opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-card dark:via-card dark:to-blue-950/20 rounded-3xl p-12 shadow-2xl border-2 border-blue-500/20 backdrop-blur-sm">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50 transform hover:scale-110 transition-transform duration-500">
                  <Mail className="w-12 h-12 text-white" />
                </div>
              </div>

              <h3 className="text-4xl font-black mb-6 text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {language === "ar" ? "هل لديك استفسار؟" : "Have a Question?"}
              </h3>

              <p className="text-muted-foreground mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
                {language === "ar"
                  ? "فريقنا المتخصص جاهز على مدار الساعة للإجابة على جميع استفساراتكم وتقديم أفضل الحلول"
                  : "Our specialized team is ready 24/7 to answer all your questions and provide the best solutions"}
              </p>

              <Button
                size="lg"
                onClick={() => {
                  const contactSection = document.getElementById("contact")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                className="px-12 py-7 text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all duration-500 hover:scale-110 border-0 text-white relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                <span className="relative">{language === "ar" ? "تواصل معنا الآن" : "Contact Us Now"}</span>
                <ArrowLeft
                  className={`relative w-6 h-6 ${language === "ar" ? "mr-3" : "ml-3"} transition-transform duration-500 group-hover:${language === "ar" ? "-translate-x-2" : "translate-x-2"}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
