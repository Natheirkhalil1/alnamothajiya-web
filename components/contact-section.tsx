"use client"

import type React from "react"
import { saveContactMessage } from "@/lib/storage"
import { useState } from "react"
import { Phone, Mail, Clock, MapPin, Star } from "lucide-react"
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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })

  const contactInfo = [
    {
      icon: Phone,
      titleAr: "رقم الهاتف",
      titleEn: "Phone Number",
      value: "+972595864023",
      link: "tel:+972595864023",
    },
    {
      icon: Mail,
      titleAr: "البريد الإلكتروني",
      titleEn: "Email",
      value: "mmm460286@gmail.com",
      link: "mailto:mmm460286@gmail.com",
    },
    {
      icon: Clock,
      titleAr: "أوقات العمل",
      titleEn: "Working Hours",
      valueAr: "الأحد - الخميس: 7:00 ص - 3:00 م",
      valueEn: "Sunday - Thursday: 7:00 AM - 3:00 PM",
    },
    {
      icon: MapPin,
      titleAr: "أيام العطل",
      titleEn: "Holidays",
      valueAr: "الجمعة والسبت",
      valueEn: "Friday and Saturday",
    },
  ]

  const testimonials = [
    {
      nameAr: "أحمد محمد",
      nameEn: "Ahmad Mohammad",
      image: "/male-parent-portrait.jpg",
      rating: 5,
      commentAr: "مدرسة رائعة بكل المقاييس. الكادر التعليمي متميز والبيئة التعليمية محفزة للإبداع.",
      commentEn:
        "An excellent school by all standards. Distinguished teaching staff and a stimulating learning environment.",
    },
    {
      nameAr: "فاطمة علي",
      nameEn: "Fatima Ali",
      image: "/female-parent-portrait.png",
      rating: 5,
      commentAr: "أفضل قرار اتخذته هو تسجيل أبنائي في هذه المدرسة. تطور ملحوظ في مستواهم الدراسي.",
      commentEn:
        "The best decision I made was enrolling my children in this school. Noticeable improvement in their academic level.",
    },
    {
      nameAr: "خالد حسن",
      nameEn: "Khaled Hassan",
      image: "/male-teacher-portrait.png",
      rating: 4,
      commentAr: "مرافق حديثة وأنشطة متنوعة. المدرسة تهتم بالجانب الأكاديمي والشخصي للطالب.",
      commentEn:
        "Modern facilities and diverse activities. The school cares about both academic and personal aspects of students.",
    },
  ]

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

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">{language === "ar" ? "تواصل معنا" : "Contact Us"}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {language === "ar" ? "نسعد بالتواصل معكم" : "We're Happy to Hear from You"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {language === "ar"
              ? "لأي استفسار أو ملاحظة، نحن هنا للإجابة على جميع أسئلتكم"
              : "For any inquiry or feedback, we are here to answer all your questions"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {language === "ar" ? info.titleAr : info.titleEn}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? info.valueAr : info.valueEn}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.5!2d35.9!3d31.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzAwLjAiTiAzNcKwNTQnMDAuMCJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>

            {/* Location & Responsible Person */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-6 bg-primary/5">
                <h3 className="font-bold text-foreground mb-2">{language === "ar" ? "الموقع" : "Location"}</h3>
                <p className="text-muted-foreground">{language === "ar" ? "الأردن - عمان" : "Jordan - Amman"}</p>
              </Card>
              <Card className="p-6 bg-primary/5">
                <h3 className="font-bold text-foreground mb-2">
                  {language === "ar" ? "المسؤول عن التواصل" : "Contact Person"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? "أ. محمد أحمد - مدير العلاقات العامة" : "Mr. Mohammad Ahmad - PR Manager"}
                </p>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{language === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{language === "ar" ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+972xxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "ar" ? "تقييم المدرسة" : "School Rating"}</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{language === "ar" ? "رسالتك" : "Your Message"}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {language === "ar" ? "إرسال الرسالة" : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            {language === "ar" ? "آراء أولياء الأمور" : "Parent Reviews"}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={language === "ar" ? testimonial.nameAr : testimonial.nameEn}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-foreground">
                      {language === "ar" ? testimonial.nameAr : testimonial.nameEn}
                    </h4>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "{language === "ar" ? testimonial.commentAr : testimonial.commentEn}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
