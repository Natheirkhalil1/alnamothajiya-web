"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Sparkles, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getHeroSlides, type HeroSlide } from "@/lib/storage"

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { language, t } = useLanguage()
  const [slides, setSlides] = useState<HeroSlide[]>([])

  useEffect(() => {
    const loadSlides = () => {
      const loadedSlides = getHeroSlides()
      setSlides(loadedSlides.sort((a, b) => a.order - b.order))
    }

    loadSlides()

    const handleStorageChange = () => {
      loadSlides()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("localStorageChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localStorageChange", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-primary/20 rounded-lg rotate-12 animate-float" />
        <div className="absolute bottom-1/3 right-16 w-16 h-16 border-2 border-accent/20 rounded-full animate-float animation-delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg rotate-45 animate-float animation-delay-3000" />
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Improved overlay background with better gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

          <img
            src={slide.image || "/placeholder.svg"}
            alt={language === "ar" ? slide.titleAr : slide.titleEn}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {/* Improved badge design to be more attractive */}
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 backdrop-blur-xl rounded-full border-2 border-primary/40 shadow-2xl shadow-primary/20 animate-float">
                    <div className="relative">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      <Star className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-ping" />
                    </div>
                    <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {language === "ar" ? "مرحباً بكم" : "Welcome"}
                    </span>
                    <Zap className="w-4 h-4 text-accent animate-pulse animation-delay-500" />
                  </div>
                  {/* Improved main title size and formatting */}
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                    <span className="block text-foreground drop-shadow-lg">
                      {language === "ar" ? slide.titleAr : slide.titleEn}
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mt-3 animate-shimmer drop-shadow-2xl">
                      {language === "ar" ? slide.subtitleAr : slide.subtitleEn}
                    </span>
                  </h2>
                  {/* Improved descriptive text */}
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto drop-shadow-md">
                    {language === "ar" ? slide.descriptionAr : slide.descriptionEn}
                  </p>
                  {/* Improved button design to be more modern */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                    <Button
                      size="lg"
                      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                      className="group relative text-lg px-10 py-6 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all duration-500 hover:scale-105 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t.hero.cta}
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="group text-lg px-10 py-6 border-2 border-primary/50 hover:border-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        {language === "ar" ? "تواصل معنا" : "Contact Us"}
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Improved navigation button design */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute ${language === "ar" ? "left-6" : "right-6"} top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background/70 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground border-2 border-primary/30 hover:border-primary shadow-2xl hover:shadow-3xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 group`}
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform duration-300" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute ${language === "ar" ? "right-6" : "left-6"} top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background/70 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground border-2 border-primary/30 hover:border-primary shadow-2xl hover:shadow-3xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 group`}
        onClick={goToNext}
      >
        <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>

      {/* Improved slider indicators design */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 bg-background/60 backdrop-blur-xl px-6 py-4 rounded-full border-2 border-primary/30 shadow-2xl">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-gradient-to-r from-primary to-accent w-12 shadow-lg shadow-primary/50"
                : "bg-muted-foreground/40 w-3 hover:bg-muted-foreground/70 hover:w-6"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
