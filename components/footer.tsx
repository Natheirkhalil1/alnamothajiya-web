"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { language, t } = useLanguage()

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">{language === "ar" ? "م" : "A"}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === "ar" ? "المدرسة النموذجية" : "Al Namothajia School"}
                </h3>
                <p className="text-sm opacity-80">
                  {language === "ar" ? "رؤية جديدة للتعليم" : "A New Vision for Education"}
                </p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {language === "ar"
                ? "مؤسسة تعليمية رائدة تسعى لتقديم تعليم متميز يجمع بين الأصالة والمعاصرة في بيئة آمنة ومحفزة."
                : "A leading educational institution seeking to provide distinguished education combining authenticity and modernity in a safe and stimulating environment."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href="#departments" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {t.nav.departments}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">{language === "ar" ? "خدماتنا" : "Our Services"}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs/education" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {language === "ar" ? "البرامج التعليمية" : "Educational Programs"}
                </Link>
              </li>
              <li>
                <Link href="/jobs/employment" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {language === "ar" ? "فرص التوظيف" : "Employment Opportunities"}
                </Link>
              </li>
              <li>
                <Link href="/jobs/training" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {language === "ar" ? "التدريب والتطوير" : "Training & Development"}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {language === "ar" ? "تواصل معنا" : "Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">{language === "ar" ? "تواصل معنا" : "Contact Us"}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 opacity-80" />
                <a href="tel:+972595864023" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  +972595864023
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 opacity-80" />
                <a
                  href="mailto:mmm460286@gmail.com"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  mmm460286@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 opacity-80 mt-1 flex-shrink-0" />
                <span className="text-sm opacity-80">{language === "ar" ? "الأردن - عمان" : "Jordan - Amman"}</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] hover:bg-[#1877F2]/90 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/50"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1DA1F2]/50"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#DD2A7B]/50"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#FF0000] hover:bg-[#FF0000]/90 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/50"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm opacity-80">
            {language === "ar"
              ? "© 2025 المدرسة النموذجية. جميع الحقوق محفوظة."
              : "© 2025 Al Namothajia School. All Rights Reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
