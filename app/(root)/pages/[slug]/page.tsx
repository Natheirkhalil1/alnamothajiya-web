"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import Image from "next/image"
import type { DynamicPage } from "@/lib/storage"
import { getDynamicPageBySlug } from "@/lib/storage"
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
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Send } from 'lucide-react'

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

  console.log("[v0] Rendering block type:", block.type)
  console.log("[v0] Block content:", content)

  switch (block.type) {
    case "hero-slider":
    case "hero":
      return (
        <HeroSlider
          key={block.id}
          slides={content.slides || []}
          autoplay={content.autoplay ?? true}
          interval={content.interval || 5000}
          showDots={content.showDots ?? true}
          showArrows={content.showArrows ?? true}
        />
      )

    case "about":
      return (
        <AboutSection
          key={block.id}
          titleEn={content.sectionTitle?.en || content.titleEn || "About Our School"}
          titleAr={content.sectionTitle?.ar || content.titleAr || "عن مدرستنا"}
          descriptionEn={content.subtitle?.en || content.descriptionEn || content.description || ""}
          descriptionAr={content.subtitle?.ar || content.descriptionAr || content.description || ""}
          image={content.imageUrl || content.image || "/placeholder.svg"}
          features={content.features || []}
        />
      )

    case "text":
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

    case "departments":
    case "cards":
      return <DepartmentsSection key={block.id} content={content} />

    case "gallery-section":
    case "gallery":
      return <GallerySection key={block.id} content={content} />

    case "testimonials-section":
    case "testimonials":
      return <TestimonialsSection key={block.id} content={content} />

    case "jobs":
    case "cta":
      return <JobsSection key={block.id} content={content} />

    case "contact-section":
    case "contact":
      return <ContactSection key={block.id} content={content} />

    case "social-links": {
      const links = content.links || []
      const iconSize = content.iconSize || 'medium'
      const sizeClasses = {
        small: 'w-8 h-8 text-sm',
        medium: 'w-10 h-10 text-base',
        large: 'w-12 h-12 text-lg'
      }
      
      const alignClass = styles.textAlign === 'left' ? 'justify-start' : 
                        styles.textAlign === 'right' ? 'justify-end' : 
                        'justify-center'
      
      const paddingClass = styles.padding ? `p-${styles.padding}` : 'p-4'
      const marginClass = styles.margin ? `m-${styles.margin}` : 'm-0'
      const radiusClass = styles.borderRadius === 'full' ? 'rounded-full' : 
                         styles.borderRadius ? `rounded-${styles.borderRadius}` : 'rounded-lg'
      const shadowClass = styles.shadow && styles.shadow !== 'none' ? `shadow-${styles.shadow}` : ''
      
      const animationClass = styles.animation && styles.animation !== 'none' ? 
                            `animate-${styles.animation}` : ''
      
      const containerStyle: React.CSSProperties = {
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        animationDelay: styles.animationDelay ? `${styles.animationDelay}ms` : undefined,
        animationDuration: styles.animationDuration ? `${styles.animationDuration}ms` : undefined,
      }
      
      return (
        <section 
          key={block.id} 
          className={`${paddingClass} ${marginClass} ${animationClass}`}
          style={containerStyle}
        >
          <div className="container mx-auto">
            <div className={`flex gap-3 ${alignClass} flex-wrap`}>
              {links.map((link: any, idx: number) => {
                const IconComponent = getPlatformIcon(link.platform)
                const label = language === 'ar' ? link.labelAr : link.labelEn
                
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${sizeClasses[iconSize as keyof typeof sizeClasses]} ${radiusClass} ${shadowClass} 
                               flex items-center justify-center transition-all duration-300 group`}
                    style={{
                      backgroundColor: styles.backgroundColor || '#f3f4f6',
                      color: styles.textColor || '#1f2937',
                      borderWidth: styles.borderWidth || '1px',
                      borderColor: styles.borderColor || 'transparent',
                    }}
                    title={label || link.platform}
                  >
                    <IconComponent className="w-5 h-5 transition-transform duration-300" 
                      style={{
                        transform: styles.hoverScale ? `scale(${parseFloat(styles.hoverScale) / 100})` : undefined,
                      }}
                    />
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )
    }

    default:
      console.log("[v0] Unknown block type:", block.type)
      return null
  }
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return Facebook
    case 'twitter':
      return Twitter
    case 'instagram':
      return Instagram
    case 'linkedin':
      return Linkedin
    case 'youtube':
      return Youtube
    case 'whatsapp':
      return MessageCircle
    case 'telegram':
      return Send
    case 'tiktok':
      return () => <span className="font-bold text-current">TT</span>
    default:
      return () => <span>🔗</span>
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
        const pageData = await getDynamicPageBySlug(slug)
        
        if (pageData) {
          console.log("[v0] Found page in localStorage:", pageData.titleEn || pageData.titleAr)
          console.log("[v0] Page blocks:", pageData.blocks?.length || 0)
          setPage(pageData)
        } else {
          console.log("[v0] Page not found in localStorage")
          setPage(null)
        }

        // FIREBASE: Original Firestore query code
        /*
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
        */
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
