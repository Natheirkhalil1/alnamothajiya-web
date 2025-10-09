"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Award, Target, Heart, Users, Building2, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { getAboutContent, type AboutContent } from "@/lib/storage"

export function AboutSection() {
  const { language, t } = useLanguage()
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)

  useEffect(() => {
    const loadContent = () => {
      const content = getAboutContent()
      setAboutContent(content)
    }

    loadContent()

    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadContent()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("localStorageChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localStorageChange", handleStorageChange)
    }
  }, [])

  if (!aboutContent) {
    return null
  }

  const iconMap: Record<string, any> = {
    Target,
    Heart,
    Award,
    Users,
    Building2,
    Globe,
  }

  const features = aboutContent.features.map((feature, index) => {
    const icons = [Target, Heart, Award, Users, Building2, Globe]
    const gradients = [
      { gradient: "from-blue-500/20 to-cyan-500/20", iconBg: "from-blue-500 to-cyan-500" },
      { gradient: "from-pink-500/20 to-rose-500/20", iconBg: "from-pink-500 to-rose-500" },
      { gradient: "from-amber-500/20 to-orange-500/20", iconBg: "from-amber-500 to-orange-500" },
      { gradient: "from-purple-500/20 to-violet-500/20", iconBg: "from-purple-500 to-violet-500" },
      { gradient: "from-green-500/20 to-emerald-500/20", iconBg: "from-green-500 to-emerald-500" },
      { gradient: "from-indigo-500/20 to-blue-500/20", iconBg: "from-indigo-500 to-blue-500" },
    ]

    return {
      icon: icons[index % icons.length],
      titleAr: feature.titleAr,
      titleEn: feature.titleEn,
      descriptionAr: feature.descriptionAr,
      descriptionEn: feature.descriptionEn,
      ...gradients[index % gradients.length],
    }
  })

  const stats = [
    { number: "30+", labelAr: "سنة من التميز", labelEn: "Years of Excellence" },
    { number: "8", labelAr: "أقسام متخصصة", labelEn: "Specialized Departments" },
    { number: "50+", labelAr: "كادر متخصص", labelEn: "Specialized Staff" },
    { number: "100%", labelAr: "التزام بالجودة", labelEn: "Quality Commitment" },
  ]

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.1),transparent_50%)]" />

      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1 group">
            {/* Animated background blobs */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-[3rem] blur-3xl animate-pulse-slow opacity-60" />
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-2xl animate-spin-slow opacity-40" />

            {/* Main image container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm bg-card/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img
                src={aboutContent.image || "/placeholder.svg"}
                alt={language === "ar" ? aboutContent.titleAr : aboutContent.titleEn}
                className="w-full h-auto transform group-hover:scale-110 transition-transform duration-1000"
              />

              {/* Floating badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-br from-primary to-accent text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl border border-primary/20 backdrop-blur-md animate-float">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-bold">ISO 9001:2015</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 left-8 grid grid-cols-2 gap-4">
              {stats.slice(0, 2).map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-border/50 hover:scale-105 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">
                    {language === "ar" ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10 order-1 lg:order-2">
            {/* Header */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm animate-fade-in">
                <GraduationCap className="w-5 h-5 text-primary animate-bounce-slow" />
                <span className="text-sm font-bold text-primary tracking-wide">{t.about.title}</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold leading-tight animate-slide-up">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  {language === "ar" ? aboutContent.titleAr : aboutContent.titleEn}
                </span>
              </h2>

              <p
                className="text-xl text-muted-foreground leading-relaxed animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                {language === "ar" ? aboutContent.descriptionAr : aboutContent.descriptionEn}
              </p>

              {/* Additional stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {stats.slice(2).map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                  >
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === "ar" ? stat.labelAr : stat.labelEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`relative p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 border-border/50 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm group overflow-hidden animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-primary/5 transition-all duration-700" />

                  <div className="relative flex items-start gap-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {language === "ar" ? feature.titleAr : feature.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === "ar" ? feature.descriptionAr : feature.descriptionEn}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
