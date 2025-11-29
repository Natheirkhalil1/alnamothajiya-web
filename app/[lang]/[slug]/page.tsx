"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { DynamicPage } from "@/lib/storage"
import { getDynamicPageBySlug } from "@/lib/storage"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageBlocks } from "@/components/page-blocks-editor-core"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function DynamicPageView({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = use(params)
    const router = useRouter()
    const [page, setPage] = useState<DynamicPage | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPage() {
            console.log("[v0] Loading page with slug:", slug, "lang:", lang)

            try {
                const pageData = await getDynamicPageBySlug(slug)

                if (pageData) {
                    console.log("[v0] Found page:", pageData.titleEn || pageData.titleAr)
                    setPage(pageData)
                } else {
                    console.log("[v0] Page not found")
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
    }, [slug, lang])

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
                        <h1 className="text-3xl font-bold mb-4">{lang === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}</h1>
                        <p className="text-muted-foreground mb-6">
                            {lang === "ar"
                                ? "عذراً، الصفحة التي تبحث عنها غير موجودة"
                                : "Sorry, the page you're looking for doesn't exist"}
                        </p>
                        <Button onClick={() => router.push(`/${lang}`)} className="gap-2">
                            {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
                            {lang === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </Button>
                    </Card>
                </div>
            </LayoutWrapper>
        )
    }

    // Determine which blocks to render based on language
    // Priority: blocksAr/blocksEn > blocks (fallback for backward compatibility)
    const blocksToRender = lang === "ar"
        ? (page.blocksAr && page.blocksAr.length > 0 ? page.blocksAr : page.blocks || [])
        : (page.blocksEn && page.blocksEn.length > 0 ? page.blocksEn : page.blocks || [])

    return (
        <LayoutWrapper>
            <main className="min-h-screen" dir={lang === "ar" ? "rtl" : "ltr"}>
                {blocksToRender.length > 0 ? (
                    <PageBlocks mode="view" value={{ blocks: blocksToRender }} />
                ) : (
                    <div className="min-h-screen bg-background">
                        <div className="container mx-auto px-4 py-12">
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold text-foreground mb-4">
                                    {lang === "ar" ? page.titleAr : page.titleEn}
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    {lang === "ar" ? page.descriptionAr : page.descriptionEn}
                                </p>
                            </div>

                            <Card className="p-8 md:p-12">
                                <div className="prose prose-lg max-w-none dark:prose-invert">
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {lang === "ar" ? page.contentAr : page.contentEn}
                                    </div>
                                </div>
                            </Card>

                            <div className="mt-8 flex justify-center">
                                <Button onClick={() => router.push(`/${lang}`)} variant="outline" size="lg" className="gap-2">
                                    {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
                                    {lang === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </LayoutWrapper>
    )
}
