"use client"

import type React from "react"

import { saveContactMessage } from "@/lib/storage"
import { useState } from "react"
import { Phone, Mail, Clock, Send, MapPin, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"

export function ContactSection() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
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
      rating: rating,
      message: formData.message,
    })

    toast({
      title: language === "ar" ? "تم إرسال رسالتك بنجاح" : "Message sent successfully",
      description: language === "ar" ? "سنتواصل معك في أقرب وقت ممكن" : "We will contact you as soon as possible",
    })

    setFormData({ name: "", phone: "", email: "", message: "" })
    setRating(0)
  }

  const contactInfo = [
    {
      icon: Phone,
      titleAr: "رقم الهاتف",
      titleEn: "Phone Number",
      value: "+972595864023",
      link: "tel:+972595864023",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: Mail,
      titleAr: "البريد الإلكتروني",
      titleEn: "Email",
      value: "mmm460286@gmail.com",
      link: "mailto:mmm460286@gmail.com",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: Clock,
      titleAr: "أوقات العمل",
      titleEn: "Working Hours",
      valueAr: "الأحد - الخميس: 7:00 ص - 3:00 م",
      valueEn: "Sunday - Thursday: 7:00 AM - 3:00 PM",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
    },
  ]

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl animate-float-slow" />
      <div
        className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/15 via-primary/15 to-accent/15 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-scale-pulse" />

      <div className="absolute top-32 left-20 animate-float">
        <Sparkles className="w-6 h-6 text-primary/40" />
      </div>
      <div className="absolute bottom-32 right-32 animate-float" style={{ animationDelay: "0.5s" }}>
        <Sparkles className="w-8 h-8 text-accent/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-full mb-6 animate-gradient-x border border-primary/20 shadow-lg">
            <MapPin className="w-4 h-4 text-primary animate-bounce" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
              {language === "ar" ? "نسعد بالتواصل معكم" : "We're Happy to Hear from You"}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
            {language === "ar"
              ? "لأي استفسار أو ملاحظة، نحن هنا للإجابة على جميع أسئلتكم"
              : "For any inquiry or feedback, we are here to answer all your questions"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="grid gap-6 animate-slide-in-bottom">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className={`group p-8 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 bg-gradient-to-br ${info.bgGradient} backdrop-blur-sm border-2 border-transparent hover:border-primary/30 animate-fade-in-left stagger-${index + 1} relative overflow-hidden`}
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="flex items-center gap-6 relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                    >
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {language === "ar" ? info.titleAr : info.titleEn}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-muted-foreground hover:text-primary transition-colors font-medium group-hover:underline"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground font-medium">
                          {language === "ar" ? info.valueAr : info.valueEn}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-in-bottom stagger-4 border-2 hover:border-primary/30 group">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.5!2d35.9!3d31.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzAwLjAiTiAzNcKwNTQnMDAuMCJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative z-0"
                />
              </div>
            </Card>
          </div>

          <Card className="p-10 bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-fade-in-right border-2 hover:border-primary/30 relative overflow-hidden group">
            {/* Animated corner accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-3 group/field">
                <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                  {language === "ar" ? "الاسم الكامل" : "Full Name"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  className="h-12 transition-all duration-300 focus:scale-[1.01] focus:shadow-lg border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-3 group/field">
                <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                  {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+972xxxxxxxxx"
                  className="h-12 transition-all duration-300 focus:scale-[1.01] focus:shadow-lg border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-3 group/field">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="example@email.com"
                  className="h-12 transition-all duration-300 focus:scale-[1.01] focus:shadow-lg border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  {language === "ar" ? "تقييم المدرسة" : "School Rating"}
                </Label>
                <div className="flex gap-2 p-4 bg-muted/50 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-all duration-300 hover:scale-125 active:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                    >
                      <span
                        className={`text-4xl transition-all duration-300 ${
                          star <= (hoveredStar || rating)
                            ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] scale-110"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 group/field">
                <Label htmlFor="message" className="text-base font-semibold flex items-center gap-2">
                  {language === "ar" ? "رسالتك" : "Your Message"}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                  rows={5}
                  className="transition-all duration-300 focus:scale-[1.01] focus:shadow-lg border-2 focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl transition-all duration-500 group/button text-lg font-semibold relative overflow-hidden"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-3">
                  {language === "ar" ? "إرسال الرسالة" : "Send Message"}
                  <Send className="w-5 h-5 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
                </span>
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
