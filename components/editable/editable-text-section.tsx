"use client"

import * as Icons from "lucide-react"

interface Feature {
  icon?: string
  iconColor?: string
  iconGradientFrom?: string
  iconGradientTo?: string
  title?: { ar?: string; en?: string }
  description?: { ar?: string; en?: string }
}

interface EditableTextSectionProps {
  title?: { ar?: string; en?: string }
  subtitle?: { ar?: string; en?: string }
  description?: { ar?: string; en?: string }
  features?: Feature[]
  language?: "ar" | "en"
  layout?: "centered" | "left" | "right"
  showFeatures?: boolean
  backgroundColor?: string
  textColor?: string
  padding?: string
}

export function EditableTextSection({
  title,
  subtitle,
  description,
  features = [],
  language = "ar",
  layout = "centered",
  showFeatures = true,
  backgroundColor = "bg-gradient-to-b from-white to-blue-50/30",
  textColor = "text-gray-900",
  padding = "py-20",
}: EditableTextSectionProps) {
  const titleText = language === "ar" ? title?.ar : title?.en
  const subtitleText = language === "ar" ? subtitle?.ar : subtitle?.en
  const descriptionText = language === "ar" ? description?.ar : description?.en

  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = (Icons as any)[iconName]
    return Icon ? <Icon className="w-6 h-6" /> : null
  }

  return (
    <section className={`${backgroundColor} ${padding}`}>
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl ${layout === "centered" ? "mx-auto text-center" : layout === "right" ? "ml-auto text-right" : "text-left"}`}
        >
          {subtitleText && <p className="text-blue-600 font-semibold mb-3 tracking-wide">{subtitleText}</p>}
          {titleText && <h2 className={`text-4xl md:text-5xl font-bold ${textColor} mb-6`}>{titleText}</h2>}
          {descriptionText && <p className="text-lg text-gray-600 leading-relaxed mb-12">{descriptionText}</p>}
        </div>

        {showFeatures && features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => {
              const featureTitle = language === "ar" ? feature.title?.ar : feature.title?.en
              const featureDesc = language === "ar" ? feature.description?.ar : feature.description?.en

              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      feature.iconGradientFrom && feature.iconGradientTo
                        ? `bg-gradient-to-br from-${feature.iconGradientFrom} to-${feature.iconGradientTo}`
                        : feature.iconColor
                          ? `bg-${feature.iconColor}`
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                    } text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {getIcon(feature.icon)}
                  </div>
                  {featureTitle && <h3 className="text-xl font-bold text-gray-900 mb-3">{featureTitle}</h3>}
                  {featureDesc && <p className="text-gray-600 leading-relaxed">{featureDesc}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default EditableTextSection
