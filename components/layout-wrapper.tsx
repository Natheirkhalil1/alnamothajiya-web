"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { getHeaderSettingsAsync } from "@/lib/settings"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage()
  const [headerHeight, setHeaderHeight] = useState(80) // Default height

  useEffect(() => {
    const loadHeaderHeight = async () => {
      try {
        const settings = await getHeaderSettingsAsync()
        if (settings?.style?.height) {
          setHeaderHeight(settings.style.height)
        }
      } catch (error) {
        console.error("[LayoutWrapper] Failed to load header settings:", error)
      }
    }

    loadHeaderHeight()

    // Listen for header settings changes
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.key === "headerSettings") {
        loadHeaderHeight()
      }
    }

    window.addEventListener("localStorageChange", handleStorageChange as EventListener)

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange as EventListener)
    }
  }, [])

  return (
    <div dir={dir} className="min-h-screen">
      <Header />
      <main style={{ paddingTop: `${headerHeight}px` }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
