"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { language, t } = useLanguage()

  const slides = [
    {
      image: "/modern-special-education-school-classroom-with-div.jpg",
      titleAr: "المدرسة النموذجية",
      titleEn: "Al Namothajia School",
      subtitleAr: "رؤية جديدة",
      subtitleEn: "A New Vision",
      descriptionAr: "لتعزيز التعليم والإبداع في بيئة مريحة وآمنة",
      descriptionEn: "To enhance education and creativity in a comfortable and safe environment",
    },
    {
      image: "/happy-special-needs-students-learning-together-wit.jpg",
      titleAr: "تعليم متميز",
      titleEn: "Distinguished Education",
      subtitleAr: "مستقبل واعد",
      subtitleEn: "Promising Future",
      descriptionAr: "نبني جيلاً واعياً ومبدعاً لمستقبل أفضل",
      descriptionEn: "Building a conscious and creative generation for a better future",
    },
    {
      image: "/modern-special-education-school-facilities-with-ad.jpg",
      titleAr: "بيئة تعليمية حديثة",
      titleEn: "Modern Learning Environment",
      subtitleAr: "تقنيات متطورة",
      subtitleEn: "Advanced Technology",
      descriptionAr: "نوفر أحدث الوسائل التعليمية لتجربة تعلم فريدة",
      descriptionEn: "We provide the latest educational tools for a unique learning experience",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/75 to-background/40" />
          <img
            src={slide.image || "/placeholder.svg"}
            alt={language === "ar" ? slide.titleAr : slide.titleEn}
            className="w-full h-full object-cover"
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className={`max-w-2xl ${language === "ar" ? "mr-auto" : "ml-auto"}`}>
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md rounded-full border border-primary/30 shadow-lg animate-float">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {language === "ar" ? "مرحباً بكم" : "Welcome"}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
                    {language === "ar" ? slide.titleAr : slide.titleEn}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mt-2 animate-shimmer">
                      {language === "ar" ? slide.subtitleAr : slide.subtitleEn}
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-pretty">
                    {language === "ar" ? slide.descriptionAr : slide.descriptionEn}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <Button
                      size="lg"
                      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-lg px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {t.hero.cta}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-lg px-8 bg-background/50 backdrop-blur-sm border-2 hover:bg-accent/10 hover:border-accent transition-all duration-300 hover:scale-105"
                    >
                      {language === "ar" ? "تواصل معنا" : "Contact Us"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className={`absolute ${language === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background/60 backdrop-blur-md hover:bg-primary hover:text-primary-foreground border border-border/50 shadow-lg transition-all duration-300 hover:scale-110`}
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute ${language === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background/60 backdrop-blur-md hover:bg-primary hover:text-primary-foreground border border-border/50 shadow-lg transition-all duration-300 hover:scale-110`}
        onClick={goToNext}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-background/40 backdrop-blur-md px-4 py-3 rounded-full border border-border/50">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-10 shadow-lg shadow-primary/50"
                : "bg-muted-foreground/40 w-2.5 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
