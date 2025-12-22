"use client"

import type React from "react"
import { LanguageProvider } from "@/lib/language-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth check is handled in the dashboard page itself
  return (
    <LanguageProvider initialLanguage="ar">
      {children}
    </LanguageProvider>
  )
}
