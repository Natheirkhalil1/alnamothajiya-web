"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe, LogIn } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: t.nav.home, href: "#home" },
    { name: t.nav.about, href: "#about" },
    { name: t.nav.departments, href: "#departments" },
    { name: t.nav.gallery, href: "#gallery" },
    { name: t.nav.jobs, href: "#jobs" },
    { name: t.nav.contact, href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 ${language === "ar" ? "right-0 left-0" : "left-0 right-0"} z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
              <Image src="/logo.webp" alt="المدرسة النموذجية" fill className="object-contain drop-shadow-lg" priority />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                {language === "ar" ? "المدرسة النموذجية" : "Al Namothajia School"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "للتربية الخاصة" : "For Special Education"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "ar" ? "العربية" : "English"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem
                  onClick={() => setLanguage("ar")}
                  className={language === "ar" ? "bg-primary/10 text-primary font-semibold" : ""}
                >
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "bg-primary/10 text-primary font-semibold" : ""}
                >
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/login">
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 text-white font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>{t.nav.login}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-primary/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-in slide-in-from-top-5 duration-300">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="px-4 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 bg-gradient-to-r from-primary/10 to-accent/10"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{language === "ar" ? "العربية" : "English"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[120px]">
                    <DropdownMenuItem
                      onClick={() => setLanguage("ar")}
                      className={language === "ar" ? "bg-primary/10 text-primary font-semibold" : ""}
                    >
                      العربية
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setLanguage("en")}
                      className={language === "en" ? "bg-primary/10 text-primary font-semibold" : ""}
                    >
                      English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="px-4 py-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg text-white font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.nav.login}</span>
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
