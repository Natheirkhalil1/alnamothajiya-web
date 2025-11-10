"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  id: string
  nameAr?: string
  nameEn?: string
  roleAr?: string
  roleEn?: string
  textAr?: string
  textEn?: string
  rating?: number
  avatar?: string
}

interface EditableTestimonialsSectionProps {
  sectionTitle?: { ar?: string; en?: string }
  sectionSubtitle?: { ar?: string; en?: string }
  testimonials?: Testimonial[]
  lang?: "ar" | "en"
  showRatings?: boolean
  columns?: number
  className?: string
}

export function EditableTestimonialsSection({
  sectionTitle,
  sectionSubtitle,
  testimonials = [],
  lang = "en",
  showRatings = true,
  columns = 3,
  className = "",
}: EditableTestimonialsSectionProps) {
  return (
    <section
      className={`py-20 bg-gradient-to-b from-background to-muted/30 ${className}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(sectionTitle?.ar || sectionTitle?.en) && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {lang === "ar" ? sectionTitle?.ar : sectionTitle?.en}
            </h2>
            {(sectionSubtitle?.ar || sectionSubtitle?.en) && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {lang === "ar" ? sectionSubtitle?.ar : sectionSubtitle?.en}
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} gap-8`}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />

                <div className="relative z-10">
                  {/* Rating */}
                  {showRatings && testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{lang === "ar" ? testimonial.textAr : testimonial.textEn}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {(lang === "ar" ? testimonial.nameAr : testimonial.nameEn)?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{lang === "ar" ? testimonial.nameAr : testimonial.nameEn}</h4>
                      <p className="text-sm text-muted-foreground">
                        {lang === "ar" ? testimonial.roleAr : testimonial.roleEn}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد شهادات" : "No testimonials found"}</p>
          </div>
        )}
      </div>
    </section>
  )
}
