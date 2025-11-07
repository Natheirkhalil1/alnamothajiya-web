"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { getDynamicPageBySlug, type DynamicPage } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function DynamicPageView() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [page, setPage] = useState<DynamicPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = params.slug as string
    const foundPage = getDynamicPageBySlug(slug)

    if (foundPage) {
      setPage(foundPage)
    }
    setLoading(false)
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!page) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Hero Section */}
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

      {/* Content Section */}
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
  )
}
