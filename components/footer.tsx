"use client"

import Link from "next/link"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  Heart,
  Award,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { language, t } = useLanguage()

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
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
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400/30 blur-xl animate-pulse" />
            </div>
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
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {language === "ar"
              ? "مؤسسة تعليمية رائدة معتمدة بشهادة ISO 9001:2015 في خدمة ذوي الإعاقة"
              : "Leading Educational Institution Certified with ISO 9001:2015"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {/* About Card */}
          <div className="group relative animate-fade-in-up stagger-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:shadow-purple-500/50 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">{language === "ar" ? "م" : "A"}</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-blue-300 transition-colors">
                    {language === "ar" ? "المدرسة النموذجية" : "Al-Namothajia"}
                  </h3>
                  <p className="text-sm text-gray-400">{language === "ar" ? "رؤية جديدة للتعليم" : "New Vision"}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {language === "ar"
                  ? "تأسست عام 1985 في عمان على مساحة 5000م² كصرح تعليمي وتأهيلي شامل معتمد بشهادة ISO 9001:2015"
                  : "Established in 1985 in Amman on 5000m² as a comprehensive educational institution certified with ISO 9001:2015"}
              </p>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="group relative animate-fade-in-up stagger-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" />
                {language === "ar" ? "روابط سريعة" : "Quick Links"}
              </h4>
              <ul className="space-y-4">
                {[
                  { href: "#home", label: t.nav.home },
                  { href: "#about", label: t.nav.about },
                  { href: "#departments", label: t.nav.departments },
                  { href: "#gallery", label: t.nav.gallery },
                  { href: "#contact", label: t.nav.contact },
                ].map((link, index) => (
                  <li key={link.href} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      href={link.href}
                      className="group/link flex items-center gap-3 text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-3"
                    >
                      <ArrowRight className="w-5 h-5 text-purple-400 opacity-0 group-hover/link:opacity-100 -translate-x-3 group-hover/link:translate-x-0 transition-all duration-300" />
                      <span className="group-hover/link:text-purple-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services Card */}
          <div className="group relative animate-fade-in-up stagger-3">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
              <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50" />
                {language === "ar" ? "خدماتنا" : "Our Services"}
              </h4>
              <ul className="space-y-4">
                {[
                  { href: "/jobs/service-request", label: language === "ar" ? "طلب الخدمة" : "Service Request" },
                  { href: "/jobs/employment", label: language === "ar" ? "فرص التوظيف" : "Employment" },
                ].map((link, index) => (
                  <li key={link.href} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      href={link.href}
                      className="group/link flex items-center gap-3 text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-3"
                    >
                      <ArrowRight className="w-5 h-5 text-pink-400 opacity-0 group-hover/link:opacity-100 -translate-x-3 group-hover/link:translate-x-0 transition-all duration-300" />
                      <span className="group-hover/link:text-pink-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Card */}
          <div className="group relative animate-fade-in-up stagger-4">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20">
              <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-teal-400/50" />
                {language === "ar" ? "تواصل معنا" : "Contact Us"}
              </h4>
              <ul className="space-y-5">
                <li className="group/item flex items-center gap-4 animate-fade-in-right stagger-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover/item:bg-blue-500/40 group-hover/item:scale-110 transition-all duration-300 shadow-lg">
                    <Phone className="w-6 h-6 text-blue-300 group-hover/item:animate-bounce" />
                  </div>
                  <div className="flex flex-col">
                    <a href="tel:+96264122002" className="text-sm text-gray-300 hover:text-blue-300 transition-all">
                      4122002
                    </a>
                    <a href="tel:+96264122003" className="text-sm text-gray-300 hover:text-blue-300 transition-all">
                      4122003
                    </a>
                  </div>
                </li>
                <li className="group/item flex items-center gap-4 animate-fade-in-right stagger-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl flex items-center justify-center group-hover/item:bg-purple-500/40 group-hover/item:scale-110 transition-all duration-300 shadow-lg">
                    <Mail className="w-6 h-6 text-purple-300 group-hover/item:animate-bounce" />
                  </div>
                  <a
                    href="mailto:info@namothajia.com"
                    className="text-sm text-gray-300 hover:text-purple-300 transition-all"
                  >
                    info@namothajia.com
                  </a>
                </li>
                <li className="group/item flex items-start gap-4 animate-fade-in-right stagger-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500/30 to-pink-600/30 rounded-xl flex items-center justify-center group-hover/item:bg-pink-500/40 group-hover/item:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6 text-pink-300 group-hover/item:animate-bounce" />
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">
                    {language === "ar"
                      ? "عمان - طريق المطار - ضاحية الأمير علي، الأردن"
                      : "Amman - Airport Road - Prince Ali District, Jordan"}
                  </span>
                </li>
              </ul>

              <div className="flex gap-4 mt-8">
                {[
                  {
                    icon: Facebook,
                    href: "https://facebook.com",
                    color: "from-[#1877F2] to-[#0d5dbf]",
                  },
                  {
                    icon: Twitter,
                    href: "https://twitter.com",
                    color: "from-[#1DA1F2] to-[#0c85d0]",
                  },
                  {
                    icon: Instagram,
                    href: "https://instagram.com",
                    color: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
                  },
                  {
                    icon: Youtube,
                    href: "https://youtube.com",
                    color: "from-[#FF0000] to-[#cc0000]",
                  },
                ].map((social, index) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 group/social animate-fade-in-up shadow-lg hover:shadow-2xl`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-xl blur-xl opacity-0 group-hover/social:opacity-80 transition-opacity duration-500`}
                    />
                    <social.icon className="w-6 h-6 text-white relative z-10 group-hover/social:animate-bounce" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
          <div className="relative border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-base text-gray-300 text-center md:text-left animate-fade-in-left flex items-center gap-2">
                {language === "ar"
                  ? "© 1985-2025 المدرسة النموذجية للتربية الخاصة. جميع الحقوق محفوظة."
                  : "© 1985-2025 Al-Namothajia School. All Rights Reserved."}
                <Heart className="w-4 h-4 text-red-400 animate-pulse inline" />
              </p>
              <div className="flex items-center gap-3 animate-fade-in-right bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                <Award className="w-5 h-5 text-yellow-400 animate-bounce" />
                <span className="text-sm font-semibold text-gray-200">
                  {language === "ar" ? "معتمدون بشهادة" : "Certified with"} ISO 9001:2015
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
