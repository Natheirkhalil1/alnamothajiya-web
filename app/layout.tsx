import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

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
            <body className={`${cairo.variable} font-sans antialiased`} suppressHydrationWarning>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
