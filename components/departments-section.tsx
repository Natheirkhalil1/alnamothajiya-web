"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, GraduationCap, Mail, Sparkles } from "lucide-react"
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

    // Listen for localStorage changes from dashboard
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

  const getColorScheme = (type: string) => {
    const schemes: Record<string, { gradient: string; hover: string; shadow: string }> = {
      medical: {
        gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
        hover: "group-hover:border-rose-400 dark:group-hover:border-rose-600",
        shadow: "group-hover:shadow-rose-200/50 dark:group-hover:shadow-rose-900/30",
      },
      science: {
        gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
        hover: "group-hover:border-blue-400 dark:group-hover:border-blue-600",
        shadow: "group-hover:shadow-blue-200/50 dark:group-hover:shadow-blue-900/30",
      },
      experimental: {
        gradient: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
        hover: "group-hover:border-purple-400 dark:group-hover:border-purple-600",
        shadow: "group-hover:shadow-purple-200/50 dark:group-hover:shadow-purple-900/30",
      },
    }
    return (
      schemes[type] || {
        gradient: "from-primary/5 to-accent/5",
        hover: "group-hover:border-primary",
        shadow: "group-hover:shadow-primary/20",
      }
    )
  }

  return (
    <section id="departments" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">{t.departments.title}</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">{t.departments.subtitle}</h2>

          <p className="text-lg text-muted-foreground text-pretty">
            {language === "ar"
              ? "أقسام متخصصة تقدم خدمات شاملة ومتكاملة لجميع الطلاب"
              : "Specialized departments providing comprehensive and integrated services for all students"}
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
            <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد أقسام</h3>
            <p className="text-muted-foreground">لم يتم إضافة أقسام بعد</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => {
              const colorScheme = getColorScheme(dept.type)
              return (
                <Card
                  key={dept.id}
                  className={`group relative overflow-hidden border-2 transition-all duration-500 hover:shadow-xl ${colorScheme.hover} ${colorScheme.shadow} opacity-0 animate-fade-in-up`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={dept.image || "/placeholder.svg"}
                      alt={language === "ar" ? dept.titleAr : dept.titleEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  <div className="relative p-6 space-y-4">
                    <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {language === "ar" ? dept.titleAr : dept.titleEn}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {language === "ar" ? dept.descriptionAr : dept.descriptionEn}
                    </p>

                    <Link href={`/departments/${dept.type}`}>
                      <Button
                        variant="outline"
                        className="w-full group/btn transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent"
                      >
                        <span className="font-semibold">{t.departments.viewDetails}</span>
                        <ArrowIcon
                          className={`w-4 h-4 ${language === "ar" ? "mr-2" : "ml-2"} transition-transform duration-300 group-hover/btn:${language === "ar" ? "-translate-x-1" : "translate-x-1"}`}
                        />
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-20 text-center opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="max-w-2xl mx-auto bg-card rounded-2xl p-10 border shadow-lg">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />

            <h3 className="text-2xl font-bold mb-3">{language === "ar" ? "هل لديك استفسار؟" : "Have a Question?"}</h3>

            <p className="text-muted-foreground mb-6 text-base">
              {language === "ar"
                ? "فريقنا جاهز للإجابة على جميع استفساراتكم وتقديم المساعدة"
                : "Our team is ready to answer all your questions and provide assistance"}
            </p>

            <Button
              size="lg"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8"
            >
              <span className="font-semibold">{language === "ar" ? "تواصل معنا الآن" : "Contact Us Now"}</span>
              <ArrowIcon className={`w-5 h-5 ${language === "ar" ? "mr-2" : "ml-2"}`} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
