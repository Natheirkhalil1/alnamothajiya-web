"use client"

import Link from "next/link"
import { Briefcase, Users, GraduationCap, ArrowLeft, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function JobsSection() {
  const { language, t } = useLanguage()

  const services = [
    {
      icon: GraduationCap,
      titleAr: "برامج تعليمية متميزة",
      titleEn: "Distinguished Educational Programs",
      descriptionAr: "نقدم برامج تعليمية شاملة تغطي جميع المراحل الدراسية بأحدث المناهج والأساليب التعليمية المتطورة",
      descriptionEn:
        "We offer comprehensive educational programs covering all academic stages with the latest curricula",
      link: "/jobs/education",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      titleAr: "فرص توظيف",
      titleEn: "Employment Opportunities",
      descriptionAr: "انضم إلى فريقنا التعليمي المتميز. نبحث عن معلمين وإداريين مؤهلين للمساهمة في رسالتنا التعليمية",
      descriptionEn:
        "Join our distinguished educational team. We are looking for qualified teachers and administrators",
      link: "/jobs/employment",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Briefcase,
      titleAr: "التدريب والتطوير",
      titleEn: "Training & Development",
      descriptionAr: "برامج تدريبية مستمرة لتطوير مهارات الكادر التعليمي والإداري لضمان أعلى مستويات الجودة",
      descriptionEn: "Continuous training programs to develop educational and administrative staff skills",
      link: "/jobs/training",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <section id="jobs" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-4 border border-primary/20">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t.jobs.title}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{t.jobs.subtitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {language === "ar"
              ? "خدماتنا التعليمية وفرص العمل المتاحة"
              : "Our educational services and available job opportunities"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-2xl transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-2"
            >
              <div className="space-y-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {language === "ar" ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {language === "ar" ? service.descriptionAr : service.descriptionEn}
                  </p>
                </div>
                <Link href={service.link}>
                  <Button className="w-full group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300">
                    <span>{t.jobs.learnMore}</span>
                    <ArrowIcon
                      className={`w-4 h-4 ${language === "ar" ? "mr-2" : "ml-2"} group-hover/btn:${language === "ar" ? "-translate-x-1" : "translate-x-1"} transition-transform`}
                    />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
