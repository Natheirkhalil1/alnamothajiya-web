"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GalleryImage {
  id: string
  url: string
  titleAr?: string
  titleEn?: string
  category?: string
  categoryAr?: string
  categoryEn?: string
}

interface EditableGallerySectionProps {
  sectionTitle?: { ar?: string; en?: string }
  sectionSubtitle?: { ar?: string; en?: string }
  images?: GalleryImage[]
  lang?: "ar" | "en"
  columns?: number
  showCategories?: boolean
  className?: string
}

export function EditableGallerySection({
  sectionTitle,
  sectionSubtitle,
  images = [],
  lang = "en",
  columns = 3,
  showCategories = true,
  className = "",
}: EditableGallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = showCategories
    ? [
        { id: "all", labelAr: "الكل", labelEn: "All" },
        ...Array.from(new Set(images.map((img) => img.category).filter(Boolean))).map((cat) => ({
          id: cat!,
          labelAr: images.find((img) => img.category === cat)?.categoryAr || cat!,
          labelEn: images.find((img) => img.category === cat)?.categoryEn || cat!,
        })),
      ]
    : []

  const filteredImages = selectedCategory === "all" ? images : images.filter((img) => img.category === selectedCategory)

  return (
    <section className={`py-20 ${className}`} dir={lang === "ar" ? "rtl" : "ltr"}>
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

        {/* Category Filter */}
        {showCategories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {lang === "ar" ? category.labelAr : category.labelEn}
              </Button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-6`}>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={lang === "ar" ? image.titleAr || "" : image.titleEn || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {(image.titleAr || image.titleEn) && (
                    <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-lg font-bold">{lang === "ar" ? image.titleAr : image.titleEn}</h3>
                      {image.category && (
                        <Badge variant="secondary" className="mt-2">
                          {lang === "ar" ? image.categoryAr : image.categoryEn}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{lang === "ar" ? "لا توجد صور" : "No images found"}</p>
          </div>
        )}
      </div>
    </section>
  )
}
