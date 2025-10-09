"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Upload, Send, Briefcase, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { saveEmploymentApplication } from "@/lib/storage"

export default function EmploymentPage() {
  const { toast } = useToast()
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    position: "",
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    gender: "",
    experience: "",
    expectedSalary: "",
    coverLetter: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    saveEmploymentApplication({
      position: formData.position,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      nationalId: formData.nationalId,
      gender: formData.gender,
      experience: formData.experience,
      expectedSalary: formData.expectedSalary,
      coverLetter: formData.coverLetter,
    })

    const whatsappMessage = `
${language === "ar" ? "طلب توظيف جديد" : "New Employment Application"}:
${language === "ar" ? "الوظيفة المطلوبة" : "Position"}: ${formData.position}
${language === "ar" ? "الاسم" : "Name"}: ${formData.fullName}
${language === "ar" ? "الهاتف" : "Phone"}: ${formData.phone}
${language === "ar" ? "البريد" : "Email"}: ${formData.email}
${language === "ar" ? "الرقم الوطني" : "National ID"}: ${formData.nationalId}
${language === "ar" ? "الجنس" : "Gender"}: ${formData.gender}
${language === "ar" ? "الخبرة" : "Experience"}: ${formData.experience}
${language === "ar" ? "الراتب المتوقع" : "Expected Salary"}: ${formData.expectedSalary}
${language === "ar" ? "نبذة" : "About"}: ${formData.coverLetter}
    `.trim()

    const whatsappUrl = `https://wa.me/970595864023?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")

    const emailSubject =
      language === "ar" ? "طلب توظيف جديد - المدرسة النموذجية" : "New Employment Application - Al Namothajia School"
    const emailBody = whatsappMessage
    const mailtoUrl = `mailto:mmm460286@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoUrl

    toast({
      title: t.employment.successTitle,
      description: t.employment.successDesc,
    })

    setFormData({
      position: "",
      fullName: "",
      phone: "",
      email: "",
      nationalId: "",
      gender: "",
      experience: "",
      expectedSalary: "",
      coverLetter: "",
    })
  }

  const ArrowIcon = language === "ar" ? ArrowRight : ArrowLeft

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-accent text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-all hover:gap-3"
          >
            <ArrowIcon className="w-5 h-5" />
            <span>{t.employment.backHome}</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">{t.employment.title}</h1>
          </div>
          <p className="text-xl text-primary-foreground/90 max-w-3xl leading-relaxed text-pretty">
            {t.employment.subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Section */}
          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20 shadow-lg">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                </div>
                {t.employment.whyJoin}
              </h2>
              <ul className="space-y-4">
                {t.employment.benefits.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-primary-foreground text-sm font-bold">✓</span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 shadow-lg border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                {t.employment.availableJobs}
              </h3>
              <div className="space-y-3">
                {t.employment.jobs.map((job: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl hover:from-primary/5 hover:to-accent/5 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                      <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setFormData({ ...formData, position: job.title })}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all"
                    >
                      {t.employment.apply}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="p-8 shadow-xl border-border/50 sticky top-24">
            <h2 className="text-3xl font-bold text-foreground mb-6">{t.employment.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-base font-semibold">
                  {t.employment.position} *
                </Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                  required
                >
                  <SelectTrigger id="position" className="h-12">
                    <SelectValue placeholder={language === "ar" ? "اختر الوظيفة" : "Select Position"} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.employment.jobs.map((job: any, index: number) => (
                      <SelectItem key={index} value={job.title}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold">
                  {t.employment.fullName} *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  className="h-12"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-semibold">
                    {t.employment.phone} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="05xxxxxxxx"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold">
                    {t.employment.email} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="example@email.com"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId" className="text-base font-semibold">
                  {t.employment.nationalId} *
                </Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  required
                  placeholder={language === "ar" ? "أدخل رقمك الوطني" : "Enter your national ID"}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-semibold">
                  {t.employment.gender} *
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  required
                >
                  <SelectTrigger id="gender" className="h-12">
                    <SelectValue placeholder={language === "ar" ? "اختر الجنس" : "Select Gender"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t.employment.male}</SelectItem>
                    <SelectItem value="female">{t.employment.female}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-base font-semibold">
                    {t.employment.experience} *
                  </Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    required
                  >
                    <SelectTrigger id="experience" className="h-12">
                      <SelectValue placeholder={language === "ar" ? "اختر الخبرة" : "Select Experience"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">{language === "ar" ? "أقل من سنة" : "Less than 1 year"}</SelectItem>
                      <SelectItem value="1-3">{language === "ar" ? "1-3 سنوات" : "1-3 years"}</SelectItem>
                      <SelectItem value="3-5">{language === "ar" ? "3-5 سنوات" : "3-5 years"}</SelectItem>
                      <SelectItem value="5-10">{language === "ar" ? "5-10 سنوات" : "5-10 years"}</SelectItem>
                      <SelectItem value="10+">
                        {language === "ar" ? "أكثر من 10 سنوات" : "More than 10 years"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary" className="text-base font-semibold">
                    {t.employment.expectedSalary} *
                  </Label>
                  <Input
                    id="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                    required
                    placeholder={language === "ar" ? "مثال: 3000 شيكل" : "Example: 3000 ILS"}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter" className="text-base font-semibold">
                  {t.employment.coverLetter} *
                </Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required
                  placeholder={
                    language === "ar"
                      ? "اكتب نبذة مختصرة عن خبراتك ومهاراتك..."
                      : "Write a brief about your experience and skills..."
                  }
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv" className="text-base font-semibold">
                  {t.employment.cv}
                </Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {t.employment.uploadCV}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t.employment.cvFormat}</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary via-primary/95 to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Send className={`w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                {t.employment.submitApplication}
              </Button>

              <p className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-lg">
                {t.employment.submitNote}
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
