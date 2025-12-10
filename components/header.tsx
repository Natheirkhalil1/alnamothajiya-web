"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe, LogIn, LayoutDashboard, Phone, Mail, Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { getHeaderSettingsAsync, getGeneralSettingsAsync } from "@/lib/settings"
import type { HeaderSettings, GeneralSettings, MenuItem } from "@/lib/storage"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<HeaderSettings | null>(null)
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Load header settings and general settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [headerSettings, general] = await Promise.all([
          getHeaderSettingsAsync(),
          getGeneralSettingsAsync()
        ])
        console.log("[Header] Loaded settings:", {
          backgroundColor: headerSettings.style.backgroundColor,
          textColor: headerSettings.style.textColor,
          hoverColor: headerSettings.style.hoverColor,
          siteName: general.siteName,
          siteLogo: general.siteLogo
        })
        setSettings(headerSettings)
        setGeneralSettings(general)
      } catch (error) {
        console.error("[v0] Failed to load header settings:", error)
      }
    }

    // Load settings on mount
    loadSettings()

    // Listen for storage changes (for live updates from dashboard)
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.key === "headerSettings" || customEvent.detail?.key === "generalSettings") {
        loadSettings()
      }
    }

    window.addEventListener("localStorageChange", handleStorageChange as EventListener)

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLanguageChange = (newLang: "ar" | "en") => {
    // Get current path without language prefix
    const currentPath = pathname || "/"

    // Remove current language prefix if exists
    let pathWithoutLang = currentPath
    if (currentPath.startsWith("/ar/") || currentPath.startsWith("/en/")) {
      pathWithoutLang = currentPath.substring(3) // Remove "/ar" or "/en"
    } else if (currentPath === "/ar" || currentPath === "/en") {
      pathWithoutLang = ""
    }

    // Build new path with new language
    let newPath = pathWithoutLang ? `/${newLang}${pathWithoutLang}` : `/${newLang}`

    // Preserve query parameters (e.g., ?id=xxx for job applications)
    const queryString = searchParams.toString()
    if (queryString) {
      newPath = `${newPath}?${queryString}`
    }

    // Update language context
    setLanguage(newLang)

    // Navigate to new path
    router.push(newPath)
  }

  // Helper function to get link from menu item
  const getMenuItemLink = (item: MenuItem): string => {
    if (item.linkType === "page") {
      // Support hybrid localization
      const slug = language === "ar" ? (item.pageSlugAr || item.pageSlug) : (item.pageSlugEn || item.pageSlug)
      return slug ? `/${language}/${slug}` : `/${language}`
    } else if (item.linkType === "section") {
      return `#${item.sectionId}`
    } else {
      return item.url || "#"
    }
  }

  // Get menu items from settings or use fallback
  const navItems = settings?.menuItems || []

  // If no settings loaded yet, return loading state
  if (!settings || !generalSettings) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </div>
      </header>
    )
  }

  // Get site identity from general settings
  const siteLogo = generalSettings.siteLogo
  const siteName = language === "ar" ? generalSettings.siteName : generalSettings.siteNameEn
  const siteTagline = language === "ar" ? generalSettings.siteTagline : generalSettings.siteTaglineEn

  // Apply styling from settings
  const headerStyle = {
    backgroundColor: (settings.style.isTransparent && !isScrolled) ? "transparent" : settings.style.backgroundColor,
    height: `${settings.style.height}px`,
    boxShadow: isScrolled ? (
      settings.style.shadow === "none" ? "none" :
      settings.style.shadow === "sm" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" :
      settings.style.shadow === "md" ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" :
      settings.style.shadow === "lg" ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" :
      "0 20px 25px -5px rgb(0 0 0 / 0.1)"
    ) : "none"
  }

  const textStyle = {
    color: settings.style.textColor,
    fontFamily: settings.style.font
  }

  return (
    <header
      className={`${settings.style.isSticky ? "fixed" : "absolute"} top-0 ${language === "ar" ? "right-0 left-0" : "left-0 right-0"} z-50 transition-all duration-300 ${
        isScrolled && !settings.style.isTransparent ? "backdrop-blur-md border-b border-border" : ""
      }`}
      style={headerStyle}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between" style={{ height: `${settings.style.height}px` }}>
          <Link href={`/${language}`} className="flex items-center gap-3 group">
            {siteLogo && (
              <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={siteLogo}
                  alt={siteName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div className="hidden md:block">
              <h1 className="text-lg font-bold leading-tight" style={textStyle}>
                {siteName}
              </h1>
              {siteTagline && (
                <p className="text-xs" style={{ ...textStyle, opacity: 0.7 }}>
                  {siteTagline}
                </p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const href = getMenuItemLink(item)
              const label = language === "ar" ? item.labelAr : item.labelEn
              return (
                <Link
                  key={item.id}
                  href={href}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="relative px-4 py-2 text-sm font-medium transition-colors group"
                  style={{
                    color: settings.style.textColor,
                    fontFamily: settings.style.font
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = settings.style.hoverColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = settings.style.textColor
                  }}
                >
                  {label}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: settings.style.hoverColor }}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/* Contact Info */}
            {settings.contactInfo?.showPhone && settings.contactInfo.phone && (
              <a href={`tel:${settings.contactInfo.phone}`} className="flex items-center gap-1 text-sm" style={textStyle}>
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">{settings.contactInfo.phone}</span>
              </a>
            )}
            {settings.contactInfo?.showEmail && settings.contactInfo.email && (
              <a href={`mailto:${settings.contactInfo.email}`} className="flex items-center gap-1 text-sm" style={textStyle}>
                <Mail className="w-4 h-4" />
                <span className="hidden xl:inline">{settings.contactInfo.email}</span>
              </a>
            )}

            {/* Search */}
            {settings.showSearch && (
              <Button variant="ghost" size="icon" style={{ color: settings.style.textColor }}>
                <Search className="w-4 h-4" />
              </Button>
            )}

            {/* Language Switcher */}
            {settings.showLanguageSwitcher && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                    style={{ color: settings.style.textColor }}
                  >
                    <Globe className="w-4 h-4" />
                    <span>{language === "ar" ? "العربية" : "English"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("ar")}
                    className={language === "ar" ? "bg-primary/10 text-primary font-semibold" : ""}
                  >
                    العربية
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("en")}
                    className={language === "en" ? "bg-primary/10 text-primary font-semibold" : ""}
                  >
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* CTA Button */}
            {settings.ctaButton?.labelAr && settings.ctaButton?.labelEn && (
              <Link href={settings.ctaButton.link || "#"}>
                <Button
                  size="sm"
                  className="gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                  style={{
                    backgroundColor: settings.style.activeColor,
                    color: "#ffffff"
                  }}
                >
                  {language === "ar" ? settings.ctaButton.labelAr : settings.ctaButton.labelEn}
                </Button>
              </Link>
            )}

            {/* Login/Dashboard Button */}
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 text-white font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{language === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 text-white font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.nav.login}</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            style={{ color: settings.style.textColor }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-in slide-in-from-top-5 duration-300" style={{ borderColor: settings.style.textColor + "20" }}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const href = getMenuItemLink(item)
                const label = language === "ar" ? item.labelAr : item.labelEn
                return (
                  <Link
                    key={item.id}
                    href={href}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                    style={{
                      color: settings.style.textColor,
                      fontFamily: settings.style.font
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = settings.style.hoverColor + "10"
                      e.currentTarget.style.color = settings.style.hoverColor
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = settings.style.textColor
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )
              })}

              {/* Language Switcher */}
              {settings.showLanguageSwitcher && (
                <div className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        style={{ color: settings.style.textColor }}
                      >
                        <Globe className="w-4 h-4" />
                        <span>{language === "ar" ? "العربية" : "English"}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[120px]">
                      <DropdownMenuItem
                        onClick={() => handleLanguageChange("ar")}
                        className={language === "ar" ? "bg-primary/10 text-primary font-semibold" : ""}
                      >
                        العربية
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLanguageChange("en")}
                        className={language === "en" ? "bg-primary/10 text-primary font-semibold" : ""}
                      >
                        English
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* CTA Button */}
              {settings.ctaButton?.labelAr && settings.ctaButton?.labelEn && (
                <div className="px-4 py-2">
                  <Link href={settings.ctaButton.link || "#"} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full gap-2 font-semibold"
                      style={{
                        backgroundColor: settings.style.activeColor,
                        color: "#ffffff"
                      }}
                    >
                      {language === "ar" ? settings.ctaButton.labelAr : settings.ctaButton.labelEn}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Login/Dashboard Button */}
              <div className="px-4 py-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg text-white font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{language === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg text-white font-semibold"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t.nav.login}</span>
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
