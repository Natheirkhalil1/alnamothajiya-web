"use client"

import type React from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { saveEmploymentApplication, getAvailableJobs } from "@/lib/storage"
import {
  Send,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Briefcase,
  Star,
  Users,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react"

export default function EmploymentPage() {
  const { language, t } = useLanguage()
  const [availableJobs, setAvailableJobs] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    gender: "",
    position: "",
  })

  const heroSlides = [
    {
      image: "/modern-special-education-school-building-exterior-.jpg",
      titleAr: "فرص التوظيف",
      titleEn: "Employment Opportunities",
      descriptionAr: "انضم إلى فريقنا المتميز وكن جزءاً من رؤيتنا التعليمية",
      descriptionEn: "Join our distinguished team and be part of our educational vision",
    },
    {
      image: "/happy-special-needs-students-learning-together-wit.jpg",
      titleAr: "نبحث عن المتميزين",
      titleEn: "We're Looking for Excellence",
      descriptionAr: "نوفر بيئة عمل محفزة ومكافآت تنافسية",
      descriptionEn: "We provide a motivating work environment and competitive rewards",
    },
    {
      image: "/modern-special-education-school-facilities-with-ad.jpg",
      titleAr: "طور مهاراتك معنا",
      titleEn: "Develop Your Skills With Us",
      descriptionAr: "فرص تدريب وتطوير مستمرة لجميع أعضاء الفريق",
      descriptionEn: "Continuous training and development opportunities for all team members",
    },
  ]

  useEffect(() => {
    const jobs = getAvailableJobs()
    setAvailableJobs(jobs)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveEmploymentApplication({
      ...formData,
      experience: "",
      expectedSalary: "",
      coverLetter: "",
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        nationalId: "",
        gender: "",
        position: "",
      })
      setSelectedJob("")
      setCvFile(null)
    }, 3000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        setCvFile(file)
      } else {
        alert(language === "ar" ? "حجم الملف يجب أن يكون أقل من 5MB" : "File size must be less than 5MB")
      }
    }
  }

  const handleJobSelect = (jobTitle: string) => {
    setSelectedJob(jobTitle)
    setFormData({ ...formData, position: jobTitle })
  }

  const benefitIcons = [Heart, TrendingUp, Award, Users, Star, Briefcase]

  return (
    <LayoutWrapper>
      <section className="relative h-[60vh] w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/40" />
            <img
              src={slide.image || "/placeholder.svg"}
              alt={language === "ar" ? slide.titleAr : slide.titleEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                  {language === "ar" ? slide.titleAr : slide.titleEn}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  {language === "ar" ? slide.descriptionAr : slide.descriptionEn}
                </p>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute ${language === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/60 backdrop-blur-md hover:bg-primary hover:text-primary-foreground`}
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute ${language === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/60 backdrop-blur-md hover:bg-primary hover:text-primary-foreground`}
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-primary w-8" : "bg-muted-foreground/40 w-2"
              }`}
            />
          ))}
        </div>
      </section>

      <main className="py-20 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto mb-16">
            <Card className="p-10 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/20 shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {language === "ar" ? "لماذا تنضم إلينا؟" : "Why Join Us?"}
                </h2>
              </div>
              <div className="space-y-5">
                {t.employment.benefits.map((benefit: string, index: number) => {
                  const Icon = benefitIcons[index % benefitIcons.length]
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 group p-4 rounded-xl hover:bg-white/50 transition-all duration-300 hover:shadow-md"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-base text-muted-foreground group-hover:text-foreground transition-colors font-medium leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-10 bg-gradient-to-br from-white to-muted/30 border-2 border-accent/20 shadow-2xl hover:shadow-accent/20 transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {language === "ar" ? "الوظائف المتاحة" : "Available Positions"}
                </h2>
              </div>
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {availableJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-xl ${
                      selectedJob === (language === "ar" ? job.title : job.titleEn)
                        ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/50 bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5"
                    }`}
                    onClick={() => handleJobSelect(language === "ar" ? job.title : job.titleEn)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-xl mb-2 group-hover:text-primary transition-colors">
                          {language === "ar" ? job.title : job.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {language === "ar" ? job.description : job.descriptionEn}
                        </p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-primary/20 text-accent text-sm font-bold rounded-full border border-accent/30">
                            <Star className="w-4 h-4" />
                            {language === "ar" ? job.type || "دوام كامل" : job.typeEn || "Full-time"}
                          </span>
                          {job.createdAt && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {job.createdAt}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 shadow-lg hover:shadow-xl flex-shrink-0 font-bold"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleJobSelect(language === "ar" ? job.title : job.titleEn)
                          document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        {language === "ar" ? "تقديم" : "Apply"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto" id="application-form">
            <Card className="p-12 bg-gradient-to-br from-white via-muted/20 to-white border-2 border-primary/20 shadow-2xl">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                  {language === "ar" ? "نموذج التوظيف" : "Employment Application"}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {language === "ar"
                    ? "املأ البيانات التالية للتقديم على الوظيفة"
                    : "Fill in the details below to apply"}
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-16 animate-in fade-in duration-500">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-3">
                    {language === "ar" ? "تم إرسال طلبك بنجاح!" : "Application Submitted Successfully!"}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {language === "ar"
                      ? "سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف"
                      : "We will contact you soon via email or phone"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="position" className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {language === "ar" ? "الوظيفة المطلوبة *" : "Position Applied For *"}
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => {
                        setFormData({ ...formData, position: value })
                        setSelectedJob(value)
                      }}
                      required
                    >
                      <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl">
                        <SelectValue placeholder={language === "ar" ? "اختر الوظيفة" : "Select Position"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableJobs.map((job) => (
                          <SelectItem
                            key={job.id}
                            value={language === "ar" ? job.title : job.titleEn}
                            className="text-base"
                          >
                            {language === "ar" ? job.title : job.titleEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-lg font-bold text-foreground">
                      {language === "ar" ? "الاسم الكامل *" : "Full Name *"}
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                      required
                      className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-lg font-bold text-foreground">
                        {language === "ar" ? "رقم الهاتف *" : "Phone Number *"}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={language === "ar" ? "05xxxxxxxx" : "05xxxxxxxx"}
                        required
                        className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-lg font-bold text-foreground">
                        {language === "ar" ? "البريد الإلكتروني *" : "Email *"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                        required
                        className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="nationalId" className="text-lg font-bold text-foreground">
                      {language === "ar" ? "الرقم الوطني *" : "National ID *"}
                    </Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder={language === "ar" ? "أدخل رقمك الوطني" : "Enter your national ID"}
                      required
                      className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-lg font-bold text-foreground">
                      {language === "ar" ? "الجنس *" : "Gender *"}
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      required
                    >
                      <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl">
                        <SelectValue placeholder={language === "ar" ? "اختر الجنس" : "Select Gender"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="text-base">
                          {language === "ar" ? "ذكر" : "Male"}
                        </SelectItem>
                        <SelectItem value="female" className="text-base">
                          {language === "ar" ? "أنثى" : "Female"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cv" className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      {language === "ar" ? "السيرة الذاتية" : "Curriculum Vitae"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="cv"
                        className="flex flex-col items-center justify-center w-full h-40 border-3 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 bg-gradient-to-br from-muted/30 to-muted/10 group"
                      >
                        {cvFile ? (
                          <div className="text-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-base font-bold text-foreground mb-1">{cvFile.name}</p>
                            <p className="text-sm text-muted-foreground">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-base font-bold text-foreground mb-1">
                              {language === "ar" ? "اضغط لرفع السيرة الذاتية" : "Click to upload CV"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "PDF, DOC, DOCX (حتى 5MB)" : "PDF, DOC, DOCX (up to 5MB)"}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-xl font-bold shadow-2xl hover:shadow-primary/50 rounded-xl"
                    size="lg"
                  >
                    <Send className={`w-6 h-6 ${language === "ar" ? "ml-3" : "mr-3"}`} />
                    {language === "ar" ? "إرسال الطلب" : "Submit Application"}
                  </Button>

                  <div className="text-center p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-primary/20">
                    <p className="text-base text-muted-foreground font-medium">
                      {language === "ar"
                        ? "سيتم إرسال طلبك عبر البريد الإلكتروني والواتساب"
                        : "Your application will be sent via email and WhatsApp"}
                    </p>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: oklch(0.96 0.005 264);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, oklch(0.52 0.18 264), oklch(0.55 0.12 155));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, oklch(0.55 0.12 155), oklch(0.52 0.18 264));
        }
      `}</style>
    </LayoutWrapper>
  )
}
