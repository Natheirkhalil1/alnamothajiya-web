"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Slide {
  image: string
  titleAr?: string
  titleEn?: string
  subtitleAr?: string
  subtitleEn?: string
  descriptionAr?: string
  descriptionEn?: string
  cta?: {
    textAr?: string
    textEn?: string
    link?: string
  }
}

interface EditableHeroSliderProps {
  slides: Slide[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  language?: "ar" | "en"
  height?: string
  overlayOpacity?: number
  textAlign?: "left" | "center" | "right"
}

export function EditableHeroSlider({
  slides = [],
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  language = "ar",
  height = "h-[600px]",
  overlayOpacity = 0.5,
  textAlign = "center",
}: EditableHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoplay || slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div
        className={`relative ${height} bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center`}
      >
        <p className="text-gray-400">No slides configured</p>
      </div>
    )
  }

  const slide = slides[currentSlide]
  const title = language === "ar" ? slide.titleAr : slide.titleEn
  const subtitle = language === "ar" ? slide.subtitleAr : slide.subtitleEn
  const description = language === "ar" ? slide.descriptionAr : slide.descriptionEn
  const ctaText = language === "ar" ? slide.cta?.textAr : slide.cta?.textEn

  return (
    <div className={`relative ${height} overflow-hidden`}>
      {/* Slide Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className={`container mx-auto px-4 text-${textAlign}`}>
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {subtitle && <p className="text-blue-400 font-medium text-lg tracking-wide animate-slide-up">{subtitle}</p>}
            {title && (
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-slide-up animation-delay-100">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                {description}
              </p>
            )}
            {ctaText && (
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all animate-slide-up animation-delay-300"
              >
                {ctaText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default EditableHeroSlider
