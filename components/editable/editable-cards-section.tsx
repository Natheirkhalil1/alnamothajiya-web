"use client"

import * as Icons from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Card {
  image?: string
  icon?: string
  titleAr?: string
  titleEn?: string
  descriptionAr?: string
  descriptionEn?: string
  categoryAr?: string
  categoryEn?: string
  categoryColor?: string
  gradientFrom?: string
  gradientTo?: string
  link?: string
}

interface EditableCardsSectionProps {
  title?: { ar?: string; en?: string }
  subtitle?: { ar?: string; en?: string }
  cards?: Card[]
  language?: "ar" | "en"
  columns?: number
  showImages?: boolean
  showIcons?: boolean
  showCategory?: boolean
  cardStyle?: "default" | "hover-lift" | "border" | "shadow"
}

export function EditableCardsSection({
  title,
  subtitle,
  cards = [],
  language = "ar",
  columns = 3,
  showImages = true,
  showIcons = true,
  showCategory = true,
  cardStyle = "hover-lift",
}: EditableCardsSectionProps) {
  const titleText = language === "ar" ? title?.ar : title?.en
  const subtitleText = language === "ar" ? subtitle?.ar : subtitle?.en

  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = (Icons as any)[iconName]
    return Icon ? <Icon className="w-8 h-8" /> : null
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {subtitleText && <p className="text-blue-600 font-semibold mb-3">{subtitleText}</p>}
          {titleText && <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{titleText}</h2>}
        </div>

        <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-8`}>
          {cards.map((card, index) => {
            const cardTitle = language === "ar" ? card.titleAr : card.titleEn
            const cardDesc = language === "ar" ? card.descriptionAr : card.descriptionEn
            const category = language === "ar" ? card.categoryAr : card.categoryEn

            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  cardStyle === "hover-lift"
                    ? "hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                    : cardStyle === "border"
                      ? "border-2 border-gray-200 hover:border-blue-500"
                      : "shadow-xl"
                }`}
                style={{
                  boxShadow:
                    card.gradientFrom && card.gradientTo ? `0 10px 30px -5px ${card.gradientFrom}40` : undefined,
                }}
              >
                {showImages && card.image && (
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt={cardTitle || ""}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 ${
                        card.gradientFrom && card.gradientTo
                          ? `bg-gradient-to-br from-${card.gradientFrom}/80 to-${card.gradientTo}/80`
                          : "bg-gradient-to-br from-blue-600/80 to-purple-600/80"
                      } opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                    {showCategory && category && (
                      <Badge
                        className={`absolute top-4 right-4 ${
                          card.categoryColor ? `bg-${card.categoryColor}` : "bg-blue-600"
                        } text-white`}
                      >
                        {category}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="p-8">
                  {showIcons && card.icon && (
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                        card.gradientFrom && card.gradientTo
                          ? `bg-gradient-to-br from-${card.gradientFrom} to-${card.gradientTo}`
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      } text-white shadow-lg`}
                    >
                      {getIcon(card.icon)}
                    </div>
                  )}

                  {cardTitle && <h3 className="text-2xl font-bold text-gray-900 mb-4">{cardTitle}</h3>}
                  {cardDesc && <p className="text-gray-600 leading-relaxed">{cardDesc}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default EditableCardsSection
