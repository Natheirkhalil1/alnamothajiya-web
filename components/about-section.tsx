"use client"

import { GraduationCap, Award, BookOpen, Target, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { language, t } = useLanguage()

  const features = [
    {
      icon: Target,
      titleAr: "رسالتنا",
      titleEn: "Our Mission",
      descriptionAr: "تقديم تعليم نوعي يلبي احتياجات كل طالب ويطور قدراته الفردية",
      descriptionEn: "Providing quality education that meets the needs of each student",
    },
    {
      icon: Heart,
      titleAr: "رؤيتنا",
      titleEn: "Our Vision",
      descriptionAr: "أن نكون المدرسة الرائدة في التربية الخاصة على مستوى المنطقة",
      descriptionEn: "To be the leading school in special education at the regional level",
    },
    {
      icon: Award,
      titleAr: "قيمنا",
      titleEn: "Our Values",
      descriptionAr: "الاحترام، التميز، الإبداع، والشمولية في كل ما نقوم به",
      descriptionEn: "Respect, Excellence, Creativity, and Inclusivity in everything we do",
    },
    {
      icon: BookOpen,
      titleAr: "مناهج حديثة",
      titleEn: "Modern Curricula",
      descriptionAr: "مناهج تعليمية متطورة تركز على تنمية المهارات والإبداع",
      descriptionEn: "Advanced educational curricula focusing on skill development",
    },
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-3xl blur-3xl animate-pulse" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src="/modern-special-education-school-building-exterior-.jpg"
                alt={language === "ar" ? "المدرسة النموذجية" : "Al Namothajia School"}
                className="w-full h-auto hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary to-accent text-primary-foreground p-6 rounded-2xl shadow-2xl border border-primary/20 hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm font-medium">{language === "ar" ? "سنة من التميز" : "Years of Excellence"}</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{t.about.title}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                {t.about.subtitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{t.about.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
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
