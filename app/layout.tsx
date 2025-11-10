import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { FloatingElements } from "@/components/floating-elements"
import { ScrollProgress } from "@/components/scroll-progress"
import { PageTransition } from "@/components/page-transition"
import { SetupChecker } from "@/components/setup-checker"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "المدرسة النموذجية للتربية الخاصة - Al Namothajia School",
  description: "المدرسة النموذجية للتربية الخاصة - لتعزيز التعليم والإبداع في بيئة مريحة وآمنة",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="smooth-scroll">
      <body className={`${cairo.variable} font-sans antialiased`}>
        <ScrollProgress />
        <FloatingElements />
        <AuthProvider>
          <LanguageProvider>
            <SetupChecker>
              <PageTransition>
                <Suspense fallback={null}>{children}</Suspense>
              </PageTransition>
            </SetupChecker>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
