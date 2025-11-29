"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Lightbulb, Rocket, Sparkles, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export default function ExperimentalDepartmentPage() {
  const { language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/innovative-experimental-learning-classroom.jpg",
      titleAr: "القسم التجريبي",
      titleEn: "Experimental Department",
      descAr: "الابتكار والإبداع في التعليم الحديث",
      descEn: "Innovation and creativity in modern education",
    },
    {
      image: "/students-working-on-creative-projects.jpg",
      titleAr: "مشاريع إبداعية",
      titleEn: "Creative Projects",
      descAr: "تشجيع الطلاب على التفكير الإبداعي والابتكار",
      descEn: "Encouraging students to think creatively and innovate",
    },
    {
      image: "/modern-technology-in-education.jpg",
      titleAr: "تقنيات متقدمة",
      titleEn: "Advanced Technologies",
      descAr: "استخدام أحدث التقنيات في العملية التعليمية",
      descEn: "Using the latest technologies in the educational process",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <LayoutWrapper>
      <section className="relative h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
            <img
              src={slide.image || "/placeholder.svg"}
              alt={language === "ar" ? slide.titleAr : slide.titleEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {language === "ar" ? slide.titleAr : slide.titleEn}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
                  {language === "ar" ? slide.descAr : slide.descEn}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {language === "ar" ? "القسم التجريبي" : "Experimental Department"}
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === "ar" ? "الابتكار والإبداع في التعليم" : "Innovation and creativity in education"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: language === "ar" ? "أفكار مبتكرة" : "Innovative Ideas",
                  description:
                    language === "ar"
                      ? "تشجيع الطلاب على التفكير الإبداعي"
                      : "Encouraging students to think creatively",
                },
                {
                  icon: Rocket,
                  title: language === "ar" ? "مشاريع تجريبية" : "Experimental Projects",
                  description:
                    language === "ar" ? "مشاريع تجريبية لتطبيق المعرفة" : "Experimental projects to apply knowledge",
                },
                {
                  icon: Sparkles,
                  title: language === "ar" ? "تقنيات حديثة" : "Modern Technologies",
                  description:
                    language === "ar"
                      ? "استخدام أحدث التقنيات في التعليم"
                      : "Using the latest technologies in education",
                },
                {
                  icon: Zap,
                  title: language === "ar" ? "تعلم تفاعلي" : "Interactive Learning",
                  description:
                    language === "ar"
                      ? "أساليب تعليمية تفاعلية ومبتكرة"
                      : "Interactive and innovative teaching methods",
                },
              ].map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </LayoutWrapper>
  )
}
