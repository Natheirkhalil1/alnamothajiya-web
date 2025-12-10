"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowUp,
  Clock,
  Sparkles,
  Award,
  Heart,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getFooterSettingsAsync } from "@/lib/settings"
import type { FooterSettings } from "@/lib/storage"
import { Button } from "@/components/ui/button"

export function Footer() {
  const { language, t } = useLanguage()
  const [settings, setSettings] = useState<FooterSettings | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const footerSettings = await getFooterSettingsAsync()
        console.log("[Footer] Loaded settings:", {
          backgroundColor: footerSettings.style.backgroundColor,
          textColor: footerSettings.style.textColor,
          linkColor: footerSettings.style.linkColor,
          copyrightAr: footerSettings.copyrightAr
        })
        setSettings(footerSettings)
      } catch (error) {
        console.error("[v0] Failed to load footer settings:", error)
      }
    }

    // Load settings on mount
    loadSettings()

    // Listen for storage changes (for live updates from dashboard)
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.key === "footerSettings") {
        loadSettings()
      }
    }

    window.addEventListener("localStorageChange", handleStorageChange as EventListener)

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange as EventListener)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get social icon component
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook": return Facebook
      case "twitter": return Twitter
      case "instagram": return Instagram
      case "youtube": return Youtube
      case "linkedin": return Linkedin
      default: return null
    }
  }

  // Get contact icon
  const getContactIcon = (iconName: string) => {
    switch (iconName) {
      case "phone": return Phone
      case "mail": return Mail
      case "map-pin": return MapPin
      case "clock": return Clock
      default: return Mail
    }
  }

  if (!settings) {
    return (
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/50"></div>
        </div>
      </footer>
    )
  }

  const footerStyle = {
    backgroundColor: settings.style.backgroundColor,
    color: settings.style.textColor,
    fontFamily: settings.style.font,
    padding: `${settings.style.padding}px 0`
  }

  const gridCols = settings.layout === "1-column" ? "grid-cols-1" :
                   settings.layout === "2-column" ? "md:grid-cols-2" :
                   settings.layout === "3-column" ? "md:grid-cols-2 lg:grid-cols-3" :
                   "md:grid-cols-2 lg:grid-cols-4"

  // Get social media colors
  const getSocialColor = (platform: string) => {
    switch (platform) {
      case "facebook": return { from: "#1877F2", to: "#0d5dbf" }
      case "twitter": return { from: "#1DA1F2", to: "#0c85d0" }
      case "instagram": return { from: "#F58529", via: "#DD2A7B", to: "#8134AF" }
      case "youtube": return { from: "#FF0000", to: "#cc0000" }
      case "linkedin": return { from: "#0077B5", to: "#005582" }
      default: return { from: settings.style.linkColor, to: settings.style.linkColor }
    }
  }

  return (
    <footer className="relative overflow-hidden" style={footerStyle}>
      {/* Enhanced decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse-slow" />

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Fancy Header Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400/30 blur-xl animate-pulse" />
            </div>
            {settings.showLogo ? (
              <Image
                src="/logo.webp"
                alt="Logo"
                width={60}
                height={60}
                className="mx-2"
              />
            ) : null}
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              {language === "ar" ? "المدرسة النموذجية للتربية الخاصة" : "Al-Namothajia School"}
            </h2>
            <div className="relative">
              <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
              <div className="absolute inset-0 bg-pink-400/30 blur-xl animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-400 animate-bounce" />
            <p className="text-xl font-semibold text-blue-300">
              {language === "ar" ? "أكثر من 30 عاماً من التميز والريادة" : "Over 30 Years of Excellence"}
            </p>
            <Award className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: settings.style.textColor, opacity: 0.9 }}>
            {language === "ar"
              ? "مؤسسة تعليمية رائدة معتمدة بشهادة ISO 9001:2015 في خدمة ذوي الإعاقة"
              : "Leading Educational Institution Certified with ISO 9001:2015"}
          </p>
        </div>

        {/* Glass-morphism Cards for Columns */}
        <div className={`grid ${gridCols} gap-8 mb-20`}>
          {settings.columns && settings.columns.length > 0 && settings.columns.map((column, index) => {
            const gradientColors = [
              "from-blue-500/30 to-purple-500/30",
              "from-purple-500/30 to-pink-500/30",
              "from-pink-500/30 to-orange-500/30",
              "from-teal-500/30 to-cyan-500/30"
            ]
            const gradient = gradientColors[index % gradientColors.length]

            return (
              <div key={column.id} className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100`} />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  <h4 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: settings.style.textColor }}>
                    <div className={`w-3 h-3 bg-gradient-to-r ${gradient.replace('/30', '/100')} rounded-full animate-pulse shadow-lg`} />
                    {language === "ar" ? column.titleAr : column.titleEn}
                  </h4>

                  {/* Text Column */}
                  {column.type === "text" && (
                    <p className="text-sm leading-relaxed" style={{ color: settings.style.textColor, opacity: 0.8 }}>
                      {language === "ar" ? column.content.textAr : column.content.textEn}
                    </p>
                  )}

                  {/* Links Column */}
                  {column.type === "links" && column.content.links && (
                    <ul className="space-y-2">
                      {column.content.links.map((link: any, idx: number) => {
                        const href = link.linkType === "page" ? `/${language}/${link.pageSlug}` : link.url
                        const label = language === "ar" ? link.labelAr : link.labelEn
                        return (
                          <li key={idx}>
                            <Link
                              href={href || "#"}
                              className="group flex items-center gap-2 text-sm transition-colors"
                              style={{ color: settings.style.linkColor }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = settings.style.linkHoverColor
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = settings.style.linkColor
                              }}
                            >
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              {label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {/* Contact Column */}
                  {column.type === "contact" && column.content.contactItems && (
                    <ul className="space-y-3">
                      {column.content.contactItems.map((item: any, idx: number) => {
                        const IconComponent = getContactIcon(item.icon)
                        return (
                          <li key={idx} className="flex items-center gap-3 group/contact">
                            <div className="relative">
                              <IconComponent className="w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover/contact:scale-125 group-hover/contact:rotate-12" style={{ color: settings.style.linkColor }} />
                              <div className="absolute inset-0 blur-lg opacity-0 group-hover/contact:opacity-60 transition-opacity duration-300" style={{ backgroundColor: settings.style.linkColor }} />
                            </div>
                            <span className="text-sm transition-colors duration-300" style={{ color: settings.style.textColor, opacity: 0.8 }}>
                              {item.value}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Fancy Social Media with Platform-Specific Gradients */}
        {settings.socialMedia && Object.values(settings.socialMedia).some(val => val) && (
          <div className="flex justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { platform: 'facebook', icon: Facebook, url: settings.socialMedia.facebook },
              { platform: 'twitter', icon: Twitter, url: settings.socialMedia.twitter },
              { platform: 'instagram', icon: Instagram, url: settings.socialMedia.instagram },
              { platform: 'youtube', icon: Youtube, url: settings.socialMedia.youtube },
              { platform: 'linkedin', icon: Linkedin, url: settings.socialMedia.linkedin },
            ].map((social, index) => {
              if (!social.url) return null
              const colors = getSocialColor(social.platform)
              const IconComponent = social.icon

              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 group/social animate-fade-in-up shadow-lg hover:shadow-2xl"
                  style={{
                    background: colors.via
                      ? `linear-gradient(135deg, ${colors.from} 0%, ${colors.via} 50%, ${colors.to} 100%)`
                      : `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                    animationDelay: `${0.5 + index * 0.1}s`
                  }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover/social:opacity-80 transition-opacity duration-500"
                    style={{
                      background: colors.via
                        ? `linear-gradient(135deg, ${colors.from} 0%, ${colors.via} 50%, ${colors.to} 100%)`
                        : `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
                    }}
                  />
                  <IconComponent className="w-7 h-7 text-white relative z-10 group-hover/social:animate-bounce" />
                </a>
              )
            })}
          </div>
        )}

        {/* Contact Info */}
        {settings.contactInfo && (settings.contactInfo.showAddress || settings.contactInfo.showPhone || settings.contactInfo.showEmail || settings.contactInfo.showWorkingHours) && (
          <div className="text-center mb-8 space-y-2">
            {settings.contactInfo.showAddress && (
              <p className="text-sm" style={{ color: settings.style.textColor, opacity: 0.8 }}>
                <MapPin className="w-4 h-4 inline mr-2" />
                {language === "ar" ? settings.contactInfo.addressAr : settings.contactInfo.addressEn}
              </p>
            )}
            {settings.contactInfo.showPhone && (
              <p className="text-sm" style={{ color: settings.style.textColor, opacity: 0.8 }}>
                <Phone className="w-4 h-4 inline mr-2" />
                <a href={`tel:${settings.contactInfo.phone}`} style={{ color: settings.style.linkColor }}>
                  {settings.contactInfo.phone}
                </a>
              </p>
            )}
            {settings.contactInfo.showEmail && (
              <p className="text-sm" style={{ color: settings.style.textColor, opacity: 0.8 }}>
                <Mail className="w-4 h-4 inline mr-2" />
                <a href={`mailto:${settings.contactInfo.email}`} style={{ color: settings.style.linkColor }}>
                  {settings.contactInfo.email}
                </a>
              </p>
            )}
            {settings.contactInfo.showWorkingHours && (
              <p className="text-sm" style={{ color: settings.style.textColor, opacity: 0.8 }}>
                <Clock className="w-4 h-4 inline mr-2" />
                {language === "ar" ? settings.contactInfo.workingHoursAr : settings.contactInfo.workingHoursEn}
              </p>
            )}
          </div>
        )}

        {/* Newsletter */}
        {settings.showNewsletter && (
          <div className="text-center mb-8 max-w-md mx-auto">
            <h4 className="text-lg font-bold mb-3" style={{ color: settings.style.textColor }}>
              {language === "ar" ? "اشترك في نشرتنا البريدية" : "Subscribe to our newsletter"}
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-white/40"
                style={{ color: settings.style.textColor }}
              />
              <Button style={{ backgroundColor: settings.style.linkColor, color: settings.style.backgroundColor }}>
                {language === "ar" ? "اشتراك" : "Subscribe"}
              </Button>
            </div>
          </div>
        )}

        {/* Payment Icons */}
        {settings.paymentIcons && settings.paymentIcons.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {settings.paymentIcons.map((icon, idx) => (
              <Image key={idx} src={icon} alt="Payment method" width={50} height={30} className="opacity-70" />
            ))}
          </div>
        )}

        {/* Copyright with ISO Badge */}
        <div className="relative">
          <div className="relative border-t pt-8" style={{ borderColor: settings.style.textColor + "20" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright with Heart Animation */}
              <div className="flex flex-col items-center md:items-start gap-3">
                <p className="text-sm text-center md:text-left flex items-center gap-2 animate-fade-in-left" style={{ color: settings.style.textColor, opacity: 0.7 }}>
                  {language === "ar" ? settings.copyrightAr : settings.copyrightEn}
                  <Heart className="w-4 h-4 text-red-400 animate-pulse inline-block" />
                </p>

                {/* ISO Certification Badge */}
                <div className="flex items-center gap-3 animate-fade-in-left bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
                  <Award className="w-5 h-5 text-yellow-400 animate-bounce" />
                  <span className="text-sm font-semibold" style={{ color: settings.style.textColor }}>
                    ISO 9001:2015 {language === "ar" ? "معتمد" : "Certified"}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                </div>
              </div>

              {/* Back to Top with enhanced animation */}
              {settings.showBackToTop && (
                <Button
                  onClick={scrollToTop}
                  size="sm"
                  className="gap-2 transition-all duration-500 hover:scale-110 hover:-translate-y-1 animate-fade-in-right shadow-lg hover:shadow-2xl group/top"
                  style={{ backgroundColor: settings.style.linkColor, color: settings.style.backgroundColor }}
                >
                  <ArrowUp className="w-4 h-4 group-hover/top:animate-bounce" />
                  {language === "ar" ? "العودة للأعلى" : "Back to Top"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
