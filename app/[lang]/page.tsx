"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { LocalizedPage } from "@/lib/storage"
import { getHomePage } from "@/lib/storage"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageBlocks } from "@/components/page-blocks-editor-core"
import { DefaultHomePage } from "@/components/default-home-page"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function LanguageHomePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params)
    const router = useRouter()
    const [page, setPage] = useState<LocalizedPage | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPage() {
            try {
                const pageData = await getHomePage(lang as "ar" | "en")

                if (pageData) {
                    setPage(pageData)
                } else {
                    setPage(null)
                }
            } catch (error) {
                console.error("[v0] Error loading home page:", error)
                setPage(null)
            } finally {
                setLoading(false)
            }
        }

        loadPage()
    }, [lang])

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
        // Fallback to default home page content
        return (
            <LayoutWrapper>
                <DefaultHomePage />
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
                        </div>
                    </div>
                )}
            </main>
        </LayoutWrapper>
    )
}
