"use client"

import type React from "react"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ClipboardList,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  User,
  FileText,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ServiceRequestPage() {
  const { language } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    studentName: "",
    studentAge: "",
    serviceType: "",
    address: "",
    preferredDate: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `
طلب خدمة جديد:
الاسم: ${formData.fullName}
الهاتف: ${formData.phone}
البريد الإلكتروني: ${formData.email}
اسم الطالب: ${formData.studentName}
عمر الطالب: ${formData.studentAge}
نوع الخدمة: ${formData.serviceType}
العنوان: ${formData.address}
التاريخ المفضل: ${formData.preferredDate}
ملاحظات: ${formData.notes}
    `.trim()

    const whatsappUrl = `https://wa.me/972595864023?text=${encodeURIComponent(message)}`
    const emailSubject = language === "ar" ? "طلب خدمة جديد" : "New Service Request"
    const emailBody = encodeURIComponent(message)
    const emailUrl = `mailto:mmm460286@gmail.com?subject=${emailSubject}&body=${emailBody}`

    window.open(whatsappUrl, "_blank")
    window.open(emailUrl, "_blank")

    setIsSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const serviceTypes = [
    { ar: "التقييم التربوي", en: "Educational Assessment" },
    { ar: "العلاج الوظيفي", en: "Occupational Therapy" },
    { ar: "العلاج الطبيعي", en: "Physical Therapy" },
    { ar: "علاج النطق واللغة", en: "Speech and Language Therapy" },
    { ar: "التأهيل المهني", en: "Vocational Rehabilitation" },
    { ar: "الدعم النفسي", en: "Psychological Support" },
    { ar: "البرامج التعليمية الخاصة", en: "Special Education Programs" },
    { ar: "الأنشطة اللامنهجية", en: "Extracurricular Activities" },
  ]

  if (isSubmitted) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center py-16 px-4">
          <Card className="max-w-md w-full p-8 text-center space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === "ar" ? "تم إرسال طلبك بنجاح!" : "Request Submitted Successfully!"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "شكراً لتواصلك معنا. سنقوم بمراجعة طلبك والتواصل معك في أقرب وقت ممكن."
                  : "Thank you for contacting us. We will review your request and get back to you as soon as possible."}
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Card>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/30">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white">
                {language === "ar" ? "خدمات متميزة" : "Distinguished Services"}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance drop-shadow-lg">
              {language === "ar" ? "طلب الخدمة" : "Service Request"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-pretty">
              {language === "ar"
                ? "نحن هنا لخدمتك. قدم طلبك وسنتواصل معك في أقرب وقت"
                : "We are here to serve you. Submit your request and we will contact you soon"}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[
                {
                  icon: ClipboardList,
                  title: language === "ar" ? "سهولة التقديم" : "Easy Application",
                  desc: language === "ar" ? "نموذج بسيط وسريع" : "Simple and quick form",
                  gradient: "from-emerald-500 to-teal-500",
                },
                {
                  icon: Phone,
                  title: language === "ar" ? "تواصل سريع" : "Quick Response",
                  desc: language === "ar" ? "رد خلال 24 ساعة" : "Reply within 24 hours",
                  gradient: "from-teal-500 to-cyan-500",
                },
                {
                  icon: CheckCircle2,
                  title: language === "ar" ? "خدمة مميزة" : "Premium Service",
                  desc: language === "ar" ? "فريق متخصص ومحترف" : "Specialized professional team",
                  gradient: "from-cyan-500 to-blue-500",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>

            {/* Form Card */}
            <Card className="p-8 md:p-10 shadow-2xl border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {language === "ar" ? "نموذج طلب الخدمة" : "Service Request Form"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "املأ النموذج أدناه وسنتواصل معك قريباً"
                    : "Fill out the form below and we will contact you soon"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground font-semibold">
                      <User className="w-4 h-4 text-primary" />
                      {language === "ar" ? "اسم ولي الأمر" : "Guardian Name"}
                    </Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                      placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-foreground font-semibold">
                      <Phone className="w-4 h-4 text-primary" />
                      {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                      placeholder={language === "ar" ? "+972XXXXXXXXX" : "+972XXXXXXXXX"}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-semibold">
                      <Mail className="w-4 h-4 text-primary" />
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                      placeholder={language === "ar" ? "example@email.com" : "example@email.com"}
                    />
                  </div>

                  {/* Student Name */}
                  <div className="space-y-2">
                    <Label htmlFor="studentName" className="flex items-center gap-2 text-foreground font-semibold">
                      <User className="w-4 h-4 text-primary" />
                      {language === "ar" ? "اسم الطالب" : "Student Name"}
                    </Label>
                    <Input
                      id="studentName"
                      required
                      value={formData.studentName}
                      onChange={(e) => handleChange("studentName", e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                      placeholder={language === "ar" ? "أدخل اسم الطالب" : "Enter student name"}
                    />
                  </div>

                  {/* Student Age */}
                  <div className="space-y-2">
                    <Label htmlFor="studentAge" className="flex items-center gap-2 text-foreground font-semibold">
                      <Calendar className="w-4 h-4 text-primary" />
                      {language === "ar" ? "عمر الطالب" : "Student Age"}
                    </Label>
                    <Input
                      id="studentAge"
                      type="number"
                      required
                      value={formData.studentAge}
                      onChange={(e) => handleChange("studentAge", e.target.value)}
                      className="border-border/50 focus:border-primary transition-colors"
                      placeholder={language === "ar" ? "العمر بالسنوات" : "Age in years"}
                    />
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="flex items-center gap-2 text-foreground font-semibold">
                      <FileText className="w-4 h-4 text-primary" />
                      {language === "ar" ? "نوع الخدمة" : "Service Type"}
                    </Label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                      <SelectTrigger className="border-border/50 focus:border-primary transition-colors">
                        <SelectValue placeholder={language === "ar" ? "اختر نوع الخدمة" : "Select service type"} />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type, index) => (
                          <SelectItem key={index} value={language === "ar" ? type.ar : type.en}>
                            {language === "ar" ? type.ar : type.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-foreground font-semibold">
                    <MapPin className="w-4 h-4 text-primary" />
                    {language === "ar" ? "العنوان" : "Address"}
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="border-border/50 focus:border-primary transition-colors"
                    placeholder={language === "ar" ? "المدينة، المنطقة" : "City, Area"}
                  />
                </div>

                {/* Preferred Date */}
                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="flex items-center gap-2 text-foreground font-semibold">
                    <Calendar className="w-4 h-4 text-primary" />
                    {language === "ar" ? "التاريخ المفضل للبدء" : "Preferred Start Date"}
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => handleChange("preferredDate", e.target.value)}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2 text-foreground font-semibold">
                    <FileText className="w-4 h-4 text-primary" />
                    {language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="min-h-[120px] border-border/50 focus:border-primary transition-colors resize-none"
                    placeholder={
                      language === "ar"
                        ? "أي معلومات إضافية تود مشاركتها معنا..."
                        : "Any additional information you would like to share..."
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <Send className={`w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                  {language === "ar" ? "إرسال الطلب" : "Submit Request"}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  {language === "ar"
                    ? "سيتم إرسال طلبك عبر الواتساب والبريد الإلكتروني"
                    : "Your request will be sent via WhatsApp and email"}
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  )
}
