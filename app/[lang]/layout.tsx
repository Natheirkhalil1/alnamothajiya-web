import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { PageTransition } from "@/components/page-transition"
import { SetupChecker } from "@/components/setup-checker"

const supportedLanguages = ["ar", "en"]

export const metadata: Metadata = {
    title: "المدرسة النموذجية للتربية الخاصة - Al Namothajia School",
    description: "المدرسة النموذجية للتربية الخاصة - لتعزيز التعليم والإبداع في بيئة مريحة وآمنة",
    generator: "v0.app",
}

export default async function LangLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ lang: string }>
}>) {
    const { lang } = await params

    if (!supportedLanguages.includes(lang)) {
        notFound()
    }

    return (
        <AuthProvider>
            <LanguageProvider initialLanguage={lang as "ar" | "en"}>
                <SetupChecker>
                    <PageTransition>
                        <Suspense fallback={null}>{children}</Suspense>
                    </PageTransition>
                </SetupChecker>
            </LanguageProvider>
        </AuthProvider>
    )
}
