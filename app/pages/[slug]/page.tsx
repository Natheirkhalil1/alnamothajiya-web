"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import type { DynamicPage } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeroSlider } from "@/components/hero-slider"
import { AboutSection } from "@/components/about-section"
import { DepartmentsSection } from "@/components/departments-section"
import { GallerySection } from "@/components/gallery-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { JobsSection } from "@/components/jobs-section"
import { ContactSection } from "@/components/contact-section"
import { ArrowRight, ArrowLeft, Star, Mail, Phone, MapPin, Shield, Lock, Eye, FileText } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

function renderBlock(block: any, language: string) {
  const content = block.content || {}
  const styles = block.styles || {}

  const styleClasses = [
    styles.backgroundColor,
    styles.gradientFrom,
    styles.gradientVia,
    styles.gradientTo,
    styles.textColor,
    styles.padding,
    styles.margin,
    styles.borderRadius,
    styles.borderWidth,
    styles.borderColor,
    styles.shadow,
    styles.animation,
    styles.textAlign,
    styles.maxWidth,
    styles.backdropBlur,
    styles.opacity,
  ]
    .filter(Boolean)
    .join(" ")

  switch (block.type) {
    case "hero":
      return <HeroSlider key={block.id} />

    case "text":
      if (content.features && content.features.length > 0) {
        return <AboutSection key={block.id} />
      }
      return (
        <section key={block.id} className={`py-20 ${styleClasses}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {content.titleAr && content.titleEn && (
                <h2 className="text-4xl font-bold mb-6">{language === "ar" ? content.titleAr : content.titleEn}</h2>
              )}
              {content.textAr && content.textEn && (
                <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                  {language === "ar" ? content.textAr : content.textEn}
                </p>
              )}
            </div>
          </div>
        </section>
      )

    case "cards":
      if (content.cards?.[0]?.category || content.cards?.[0]?.image) {
        return <DepartmentsSection key={block.id} />
      }
      return (
        <section key={block.id} className={styleClasses}>
          <div className="container mx-auto px-4">
            {content.titleAr && content.titleEn && (
              <h2 className="text-4xl font-bold text-center mb-12">
                {language === "ar" ? content.titleAr : content.titleEn}
              </h2>
            )}
            <div className="space-y-8">
              {content.cards?.map((card: any, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-card rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${card.gradient || "from-blue-500 to-purple-500"} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      {card.icon === "shield" && <Shield className="w-6 h-6 text-white" />}
                      {card.icon === "lock" && <Lock className="w-6 h-6 text-white" />}
                      {card.icon === "eye" && <Eye className="w-6 h-6 text-white" />}
                      {card.icon === "file" && <FileText className="w-6 h-6 text-white" />}
                      {card.icon === "mail" && <Mail className="w-6 h-6 text-white" />}
                      {!card.icon && <Star className="w-6 h-6 text-white" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {language === "ar" ? card.titleAr : card.titleEn}
                    </h2>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line pl-16">
                    {language === "ar" ? card.descriptionAr : card.descriptionEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case "gallery":
      return <GallerySection key={block.id} />

    case "testimonials":
      return <TestimonialsSection key={block.id} />

    case "cta":
      return <JobsSection key={block.id} />

    case "contact":
      if (content.hasForm) {
        return <ContactSection key={block.id} />
      }
      return (
        <section key={block.id} className={styleClasses}>
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{language === "ar" ? content.titleAr : content.titleEn}</h2>
              <p className="mb-6 text-blue-100">{language === "ar" ? content.descriptionAr : content.descriptionEn}</p>
              <div className="space-y-3">
                {content.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <a href={`mailto:${content.email}`} className="hover:text-blue-200 transition-colors">
                      {content.email}
                    </a>
                  </div>
                )}
                {content.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>{content.phone}</span>
                  </div>
                )}
                {(content.addressAr || content.addressEn) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>{language === "ar" ? content.addressAr : content.addressEn}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )

    default:
      return null
  }
}

export default function DynamicPageView() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [page, setPage] = useState<DynamicPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPage() {
      const slug = params.slug as string
      console.log("[v0] Loading page with slug:", slug)

      try {
        const pagesRef = collection(db, "web_pages")
        const q = query(pagesRef, where("slug", "==", slug))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          const pageData = { id: doc.id, ...doc.data() } as DynamicPage
          console.log("[v0] Found page in Firestore:", pageData.titleEn || pageData.titleAr)
          console.log("[v0] Page blocks:", pageData.blocks?.length || 0)
          setPage(pageData)
        } else {
          console.log("[v0] Page not found in Firestore")
          setPage(null)
        }
      } catch (error) {
        console.error("[v0] Error loading page:", error)
        setPage(null)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [params.slug])

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!page) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">{language === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}</h1>
            <p className="text-muted-foreground mb-6">
              {language === "ar"
                ? "عذراً، الصفحة التي تبحث عنها غير موجودة"
                : "Sorry, the page you're looking for doesn't exist"}
            </p>
            <Button onClick={() => router.push("/")} className="gap-2">
              {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              {language === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </Card>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <main className="min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
        {page.blocks && page.blocks.length > 0 ? (
          page.blocks.sort((a, b) => (a.order || 0) - (b.order || 0)).map((block: any) => renderBlock(block, language))
        ) : (
          <div className="min-h-screen bg-background">
            {page.image && (
              <div className="relative w-full h-96 overflow-hidden">
                <Image
                  src={page.image || "/placeholder.svg"}
                  alt={language === "ar" ? page.titleAr : page.titleEn}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="container mx-auto">
                    <h1 className="text-5xl font-bold text-foreground mb-4">
                      {language === "ar" ? page.titleAr : page.titleEn}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                      {language === "ar" ? page.descriptionAr : page.descriptionEn}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="container mx-auto px-4 py-12">
              {!page.image && (
                <div className="mb-12">
                  <h1 className="text-5xl font-bold text-foreground mb-4">
                    {language === "ar" ? page.titleAr : page.titleEn}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {language === "ar" ? page.descriptionAr : page.descriptionEn}
                  </p>
                </div>
              )}

              <Card className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {language === "ar" ? page.contentAr : page.contentEn}
                  </div>
                </div>
              </Card>

              <div className="mt-8 flex justify-center">
                <Button onClick={() => router.push("/")} variant="outline" size="lg" className="gap-2">
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                  {language === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </LayoutWrapper>
  )
}
