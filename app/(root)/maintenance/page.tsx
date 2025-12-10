"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Wrench, Mail, Phone, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { getMaintenanceSettings, type MaintenanceSettings } from "@/lib/storage"

export default function MaintenancePage() {
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const loadedSettings = getMaintenanceSettings()
    setSettings(loadedSettings)
  }, [])

  useEffect(() => {
    if (!settings?.showCountdown || !settings?.countdownDate) return

    const calculateTimeLeft = () => {
      const difference = new Date(settings.countdownDate!).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [settings?.showCountdown, settings?.countdownDate])

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  const title = language === "ar" ? settings.titleAr : settings.titleEn
  const message = language === "ar" ? settings.messageAr : settings.messageEn

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: settings.backgroundImage
          ? `url(${settings.backgroundImage}) center/cover`
          : `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
      }}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all backdrop-blur-sm border border-white/20"
        >
          {language === "ar" ? "English" : "العربية"}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Logo */}
        {settings.logoImage && (
          <div className="w-32 h-32 mx-auto mb-8 relative animate-bounce-slow">
            <Image
              src={settings.logoImage}
              alt="Logo"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        )}

        {/* Icon */}
        <div className="mb-6">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center animate-pulse"
            style={{ backgroundColor: `${settings.primaryColor}40` }}
          >
            <Wrench className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Countdown */}
        {settings.showCountdown && settings.countdownDate && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">
                {language === "ar" ? "الوقت المتبقي" : "Time Remaining"}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              {[
                { value: timeLeft.days, label: language === "ar" ? "يوم" : "Days" },
                { value: timeLeft.hours, label: language === "ar" ? "ساعة" : "Hours" },
                { value: timeLeft.minutes, label: language === "ar" ? "دقيقة" : "Min" },
                { value: timeLeft.seconds, label: language === "ar" ? "ثانية" : "Sec" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[70px] border border-white/20"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {item.value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {settings.showContactInfo && (settings.contactEmail || settings.contactPhone) && (
          <div className="mb-8 space-y-3">
            <p className="text-white/80 text-sm mb-2">
              {language === "ar" ? "للتواصل معنا" : "Contact Us"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>{settings.contactEmail}</span>
                </a>
              )}
              {settings.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{settings.contactPhone}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {settings.showSocialLinks && (
          <div className="flex justify-center gap-4">
            {[
              { icon: Facebook, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Linkedin, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
    </div>
  )
}
