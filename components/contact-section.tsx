"use client"

import type React from "react"

import { saveContactMessage } from "@/lib/storage"
import { sendNotifications } from "@/lib/notifications"
import { useState } from "react"
import { Phone, Mail, Clock, Send, MapPin, MessageCircle, CheckCircle2, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"

interface ContactSectionProps {
  sectionTitle?: { en: string; ar: string }
  sectionSubtitle?: { en: string; ar: string }
  contactInfo?: Array<{
    icon: any
    titleAr: string
    titleEn: string
    value?: string
    value2?: string
    valueAr?: string
    valueEn?: string
    value2Ar?: string
    value2En?: string
    link?: string
    gradient: string
    bgGradient: string
    descAr: string
    descEn: string
  }>
  showForm?: boolean
}

export function ContactSection({
  sectionTitle,
  sectionSubtitle,
  contactInfo = [
    {
      icon: Phone,
      titleAr: "اتصل بنا",
      titleEn: "Call Us",
      value: "+962 6 4122002",
      value2: "+962 6 4122003",
      link: "tel:+96264122002",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      bgGradient: "from-blue-500/10 via-blue-600/5 to-cyan-500/10",
      descAr: "متاحون للرد على استفساراتكم",
      descEn: "Available to answer your inquiries",
    },
    {
      icon: Mail,
      titleAr: "راسلنا",
      titleEn: "Email Us",
      value: "info@namothajia.com",
      link: "mailto:info@namothajia.com",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      bgGradient: "from-purple-500/10 via-purple-600/5 to-pink-500/10",
      descAr: "نرد على رسائلكم خلال 24 ساعة",
      descEn: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      titleAr: "موقعنا",
      titleEn: "Our Location",
      valueAr: "عمان - طريق المطار",
      valueEn: "Amman - Airport Road",
      value2Ar: "ضاحية الأمير علي",
      value2En: "Prince Ali District",
      gradient: "from-green-500 via-emerald-600 to-teal-500",
      bgGradient: "from-green-500/10 via-emerald-600/5 to-teal-500/10",
      descAr: "المملكة الأردنية الهاشمية",
      descEn: "Hashemite Kingdom of Jordan",
    },
    {
      icon: Clock,
      titleAr: "أوقات العمل",
      titleEn: "Working Hours",
      valueAr: "الأحد - الخميس",
      valueEn: "Sunday - Thursday",
      value2Ar: "7:00 صباحاً - 3:00 مساءً",
      value2En: "7:00 AM - 3:00 PM",
      gradient: "from-orange-500 via-amber-600 to-yellow-500",
      bgGradient: "from-orange-500/10 via-amber-600/5 to-yellow-500/10",
      descAr: "نستقبل الزوار خلال أوقات الدوام",
      descEn: "We welcome visitors during working hours",
    },
  ],
  showForm = true,
}: ContactSectionProps) {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    saveContactMessage({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    })

    sendNotifications({
      type: "contact",
      data: formData,
    })

    toast({
      title: language === "ar" ? "تم إرسال رسالتك بنجاح" : "Message sent successfully",
      description: language === "ar" ? "سنتواصل معك في أقرب وقت ممكن" : "We will contact you as soon as possible",
    })

    setFormData({ name: "", phone: "", email: "", message: "" })
  }

  const displayTitle = sectionTitle
    ? language === "ar"
      ? sectionTitle.ar
      : sectionTitle.en
    : language === "ar"
      ? "تواصل معنا"
      : "Contact Us"

  const displaySubtitle = sectionSubtitle
    ? language === "ar"
      ? sectionSubtitle.ar
      : sectionSubtitle.en
    : language === "ar"
      ? "نحن هنا لمساعدتك"
      : "We're Here to Help"

  return (
    <section
      id="contact"
      className="py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 relative overflow-hidden"
    >
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-slow" />
      <div
        className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-green-400/15 via-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-scale-pulse" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full mb-8 animate-gradient-x border-2 border-blue-500/20 shadow-xl backdrop-blur-sm">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce" />
            <span className="text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {displayTitle}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-balance leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              {displaySubtitle}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed text-pretty max-w-3xl mx-auto">
            {language === "ar"
              ? "فريقنا جاهز للإجابة على جميع استفساراتكم وتقديم المساعدة التي تحتاجونها"
              : "Our team is ready to answer all your questions and provide the assistance you need"}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-7xl mx-auto mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6 animate-slide-in-bottom">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className={`group p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 animate-fade-in-left relative overflow-hidden`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${info.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                  <div className="flex items-start gap-5 relative z-10">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}
                    >
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {language === "ar" ? info.titleAr : info.titleEn}
                      </h3>
                      {info.link ? (
                        <div className="space-y-1">
                          <a
                            href={info.link}
                            className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-base group-hover:underline"
                          >
                            {info.value}
                          </a>
                          {info.value2 && (
                            <a
                              href={info.link}
                              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-base group-hover:underline"
                            >
                              {info.value2}
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-slate-700 dark:text-slate-300 font-semibold text-base">
                            {language === "ar" ? info.valueAr : info.valueEn}
                          </p>
                          {(info.value2Ar || info.value2En) && (
                            <p className="text-slate-700 dark:text-slate-300 font-semibold text-base">
                              {language === "ar" ? info.value2Ar : info.value2En}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {language === "ar" ? info.descAr : info.descEn}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {showForm && (
            <Card className="lg:col-span-3 p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-right border-2 border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 relative overflow-hidden group">
              {/* Decorative corner accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Form header */}
              <div className="mb-8 relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {language === "ar" ? "أرسل لنا رسالة" : "Send Us a Message"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {language === "ar"
                    ? "املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن"
                    : "Fill out the form below and we'll get back to you as soon as possible"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-3 group/field">
                  <Label
                    htmlFor="name"
                    className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"
                  >
                    {language === "ar" ? "الاسم الكامل" : "Full Name"}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                    className="h-14 text-base transition-all duration-300 focus:scale-[1.01] focus:shadow-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-slate-800/50"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 group/field">
                    <Label
                      htmlFor="phone"
                      className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"
                    >
                      {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+962xxxxxxxxx"
                      className="h-14 text-base transition-all duration-300 focus:scale-[1.01] focus:shadow-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-slate-800/50"
                    />
                  </div>

                  <div className="space-y-3 group/field">
                    <Label
                      htmlFor="email"
                      className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"
                    >
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="example@email.com"
                      className="h-14 text-base transition-all duration-300 focus:scale-[1.01] focus:shadow-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-slate-800/50"
                    />
                  </div>
                </div>

                <div className="space-y-3 group/field">
                  <Label
                    htmlFor="message"
                    className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"
                  >
                    {language === "ar" ? "رسالتك" : "Your Message"}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                    rows={6}
                    className="text-base transition-all duration-300 focus:scale-[1.01] focus:shadow-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none bg-white/50 dark:bg-slate-800/50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-2xl transition-all duration-500 group/button text-lg font-bold relative overflow-hidden"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/button:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-6 h-6 group-hover/button:scale-110 transition-transform duration-300" />
                    {language === "ar" ? "إرسال الرسالة" : "Send Message"}
                    <Send className="w-6 h-6 group-hover/button:translate-x-2 group-hover/button:-translate-y-2 transition-transform duration-300" />
                  </span>
                </Button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  {language === "ar"
                    ? "سنقوم بالرد على رسالتك خلال 24 ساعة من أيام العمل"
                    : "We will respond to your message within 24 business hours"}
                </p>
              </form>
            </Card>
          )}
        </div>

        {/* Full-width Map Section */}
        <div className="relative z-10 mt-16">
          <div className="container mx-auto px-4 mb-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-full mb-6 animate-gradient-x border-2 border-green-500/20 shadow-lg backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 animate-bounce" />
                <span className="text-base font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {language === "ar" ? "موقعنا على الخريطة" : "Find Us on Map"}
                </span>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 text-pretty">
                {language === "ar"
                  ? "عمان - طريق المطار - ضاحية الأمير علي، المملكة الأردنية الهاشمية"
                  : "Amman - Airport Road - Prince Ali District, Hashemite Kingdom of Jordan"}
              </p>
            </div>
          </div>

          <div className="relative group">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

            {/* Map container with border */}
            <div className="border-y-4 border-blue-500/20 dark:border-blue-400/20 group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40 transition-colors duration-500 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              <div className="aspect-[21/9] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.5!2d35.9!3d31.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzAwLjAiTiAzNcKwNTQnMDAuMCJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative z-0 group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </div>

            {/* Action button overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-300 group/btn border-2 border-white/20"
                onClick={() => window.open("https://maps.google.com/?q=31.95,35.9", "_blank")}
              >
                <MapPin className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                <span className="font-bold text-lg">
                  {language === "ar" ? "فتح في خرائط Google" : "Open in Google Maps"}
                </span>
                <ExternalLink className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
