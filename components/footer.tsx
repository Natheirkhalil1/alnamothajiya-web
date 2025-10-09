"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { language, t } = useLanguage()

  return (
    <footer className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
              {language === "ar" ? "المدرسة النموذجية للتربية الخاصة" : "Al Namothajia School For Special Education"}
            </h2>
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </div>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            {language === "ar"
              ? "أكثر من 30 عاماً من التميز في خدمة ذوي الإعاقة"
              : "Over 30 years of excellence in serving people with disabilities"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* About Card */}
          <div className="group relative animate-fade-in-up stagger-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-6 hover:bg-background/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <span className="text-2xl font-bold text-primary-foreground">{language === "ar" ? "م" : "A"}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {language === "ar" ? "المدرسة النموذجية" : "Al Namothajia"}
                  </h3>
                  <p className="text-sm opacity-70">{language === "ar" ? "رؤية جديدة للتعليم" : "New Vision"}</p>
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                {language === "ar"
                  ? "مؤسسة تعليمية رائدة معتمدة بشهادة ISO 9001:2015 تسعى لتقديم تعليم متميز وتأهيل شامل لذوي الإعاقة."
                  : "A leading educational institution certified with ISO 9001:2015, providing distinguished education and comprehensive rehabilitation."}
              </p>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="group relative animate-fade-in-up stagger-2">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-6 hover:bg-background/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {language === "ar" ? "روابط سريعة" : "Quick Links"}
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "#home", label: t.nav.home },
                  { href: "#about", label: t.nav.about },
                  { href: "#gallery", label: t.nav.gallery },
                  { href: "#departments", label: t.nav.departments },
                  { href: "#contact", label: t.nav.contact },
                ].map((link, index) => (
                  <li key={link.href} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      href={link.href}
                      className="group/link flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300 hover:translate-x-2"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all duration-300" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services Card */}
          <div className="group relative animate-fade-in-up stagger-3">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-6 hover:bg-background/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                {language === "ar" ? "خدماتنا" : "Our Services"}
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/jobs/service-request", label: language === "ar" ? "طلب الخدمة" : "Service Request" },
                  { href: "/jobs/employment", label: language === "ar" ? "فرص التوظيف" : "Employment" },
                ].map((link, index) => (
                  <li key={link.href} className="animate-fade-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      href={link.href}
                      className="group/link flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all duration-300 hover:translate-x-2"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all duration-300" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Card */}
          <div className="group relative animate-fade-in-up stagger-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-6 hover:bg-background/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                {language === "ar" ? "تواصل معنا" : "Contact Us"}
              </h4>
              <ul className="space-y-4">
                <li className="group/item flex items-center gap-3 animate-fade-in-right stagger-1">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover/item:bg-primary/30 group-hover/item:scale-110 transition-all duration-300">
                    <Phone className="w-5 h-5 text-primary group-hover/item:animate-bounce" />
                  </div>
                  <a
                    href="tel:+962064122002"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all"
                  >
                    +962 06 4122002
                  </a>
                </li>
                <li className="group/item flex items-center gap-3 animate-fade-in-right stagger-2">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover/item:bg-accent/30 group-hover/item:scale-110 transition-all duration-300">
                    <Mail className="w-5 h-5 text-accent group-hover/item:animate-bounce" />
                  </div>
                  <a
                    href="mailto:info@namothajia.com"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all"
                  >
                    info@namothajia.com
                  </a>
                </li>
                <li className="group/item flex items-start gap-3 animate-fade-in-right stagger-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center group-hover/item:bg-secondary/30 group-hover/item:scale-110 transition-all duration-300 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-secondary group-hover/item:animate-bounce" />
                  </div>
                  <span className="text-sm opacity-80">
                    {language === "ar"
                      ? "عمان - طريق المطار - ضاحية الأمير علي"
                      : "Amman - Airport Road - Prince Ali District"}
                  </span>
                </li>
              </ul>

              <div className="flex gap-3 mt-6">
                {[
                  {
                    icon: Facebook,
                    href: "https://facebook.com",
                    color: "from-[#1877F2] to-[#0d5dbf]",
                    shadow: "[#1877F2]",
                  },
                  {
                    icon: Twitter,
                    href: "https://twitter.com",
                    color: "from-[#1DA1F2] to-[#0c85d0]",
                    shadow: "[#1DA1F2]",
                  },
                  {
                    icon: Instagram,
                    href: "https://instagram.com",
                    color: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
                    shadow: "[#DD2A7B]",
                  },
                  {
                    icon: Youtube,
                    href: "https://youtube.com",
                    color: "from-[#FF0000] to-[#cc0000]",
                    shadow: "[#FF0000]",
                  },
                ].map((social, index) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative w-11 h-11 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 group/social animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-xl blur-lg opacity-0 group-hover/social:opacity-70 transition-opacity duration-500`}
                    />
                    <social.icon className="w-5 h-5 text-white relative z-10 group-hover/social:animate-bounce" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-20 blur-xl" />
          <div className="relative border-t border-background/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm opacity-80 text-center md:text-left animate-fade-in-left">
                {language === "ar"
                  ? "© 2025 المدرسة النموذجية للتربية الخاصة. جميع الحقوق محفوظة."
                  : "© 2025 Al Namothajia School For Special Education. All Rights Reserved."}
              </p>
              <div className="flex items-center gap-2 animate-fade-in-right">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm opacity-80">
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
