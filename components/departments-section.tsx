"use client"

import Link from "next/link"
import { Stethoscope, Calculator, FlaskConical, ArrowLeft, ArrowRight, GraduationCap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function DepartmentsSection() {
  const { language, t } = useLanguage()

  const departments = [
    {
      icon: Stethoscope,
      titleAr: "القسم الطبي",
      titleEn: "Medical Department",
      descriptionAr: "قسم طبي متكامل يوفر الرعاية الصحية للطلاب مع فريق طبي متخصص ومجهز بأحدث المعدات الطبية",
      descriptionEn: "Comprehensive medical department providing healthcare for students with specialized medical team",
      image: "/school-medical-clinic-with-modern-equipment-for-sp.jpg",
      link: "/departments/medical",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Calculator,
      titleAr: "القسم العلمي",
      titleEn: "Scientific Department",
      descriptionAr: "قسم متخصص في العلوم والرياضيات مع مختبرات حديثة وبرامج تعليمية متقدمة لتنمية المهارات العلمية",
      descriptionEn: "Specialized department in science and mathematics with modern laboratories and advanced programs",
      image: "/science-and-mathematics-classroom-with-modern-tech.jpg",
      link: "/departments/science",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FlaskConical,
      titleAr: "القسم التجريبي",
      titleEn: "Experimental Department",
      descriptionAr: "قسم مخصص للتجارب العملية والأبحاث العلمية مع إشراف متخصص لتطوير مهارات البحث والاستكشاف",
      descriptionEn:
        "Department dedicated to practical experiments and scientific research with specialized supervision",
      image: "/science-laboratory-with-experiments-for-special-ne.jpg",
      link: "/departments/experimental",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <section id="departments" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-4 border border-primary/20">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t.departments.title}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{t.departments.subtitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {language === "ar"
              ? "أقسام متنوعة تلبي احتياجات جميع الطلاب"
              : "Diverse departments meeting all students' needs"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <Card
              key={index}
              className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-border/50 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dept.image || "/placeholder.svg"}
                  alt={language === "ar" ? dept.titleAr : dept.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div
                  className={`absolute top-4 ${language === "ar" ? "right-4" : "left-4"} w-14 h-14 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
                >
                  <dept.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  {language === "ar" ? dept.titleAr : dept.titleEn}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "ar" ? dept.descriptionAr : dept.descriptionEn}
                </p>
                <Link href={dept.link}>
                  <Button
                    variant="outline"
                    className="w-full group/btn bg-gradient-to-r from-background to-muted hover:from-primary/10 hover:to-accent/10 border-2 hover:border-primary transition-all duration-300"
                  >
                    <span>{t.departments.viewDetails}</span>
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
