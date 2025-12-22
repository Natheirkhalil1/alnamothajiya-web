"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { LocalizedPage } from "@/lib/storage"
import { getLocalizedPageBySlug, isPageHomepage } from "@/lib/storage"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageBlocks } from "@/components/page-blocks-editor-core"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function DynamicPageView({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = use(params)
    const router = useRouter()
    const [page, setPage] = useState<LocalizedPage | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPage() {
            console.log("[v0] Loading page with slug:", slug, "lang:", lang)

            // Check if this page is the homepage - redirect to root URL
            if (isPageHomepage(slug)) {
                console.log("[v0] Page is homepage, redirecting to root")
                router.replace(`/${lang}`)
                return
            }

            try {
                const pageData = await getLocalizedPageBySlug(slug, lang as "ar" | "en")

                if (pageData) {
                    console.log("[v0] Found page:", pageData.title)
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
    }, [slug, lang, router])

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

    return (
        <LayoutWrapper>
            <main className="min-h-screen" dir={page.dir}>
                {page.blocks.length > 0 ? (
                    <PageBlocks
                        mode="view"
                        value={{
                            blocks: page.blocks as any,
                            blocksAr: page.lang === "ar" ? page.blocks as any : [],
                            blocksEn: page.lang === "en" ? page.blocks as any : []
                        }}
                        editingLanguage={page.lang}
                    />
                ) : (
                    <div className="min-h-screen bg-background">
                        <div className="container mx-auto px-4 py-12">
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold text-foreground mb-4">
                                    {page.title}
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    {page.description}
                                </p>
                            </div>

                            <Card className="p-8 md:p-12">
                                <div className="prose prose-lg max-w-none dark:prose-invert">
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {page.content}
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
