import type React from "react"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { FloatingElements } from "@/components/floating-elements"
import { ScrollProgress } from "@/components/scroll-progress"
import { PageTransition } from "@/components/page-transition"
import { SetupChecker } from "@/components/setup-checker"
import { MaintenanceChecker } from "@/components/maintenance-checker"

export default function RootGroupLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <ScrollProgress />
            <FloatingElements />
            <AuthProvider>
                <LanguageProvider>
                    <SetupChecker>
                        <MaintenanceChecker>
                            <PageTransition>
                                <Suspense fallback={null}>{children}</Suspense>
                            </PageTransition>
                        </MaintenanceChecker>
                    </SetupChecker>
                </LanguageProvider>
            </AuthProvider>
        </>
    )
}
