"use client"

import type React from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { getAvailableJobs, saveEnhancedEmploymentApplication } from "@/lib/storage"
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
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Building,
  Plus,
  Trash2,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react"

interface EducationEntry {
  degree: string
  major: string
  university: string
  graduationYear: string
  gpa: string
}

interface ExperienceEntry {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  currentlyWorking: boolean
}

export default function EmploymentPage() {
  const { language, t } = useLanguage()
  const [availableJobs, setAvailableJobs] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [cvFile, setCvFile] = useState<File | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: "",
    birthPlace: "",
    birthDate: "",
    nationalId: "",
    maritalStatus: "",
    address: "",
    phone: "",
    position: "",
    expectedSalary: "",

    // Step 2: Education (array of entries)
    education: [] as EducationEntry[],

    // Step 3: Experience (array of entries)
    experience: [] as ExperienceEntry[],
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

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", major: "", university: "", graduationYear: "", gpa: "" }],
    })
  }

  const removeEducation = (index: number) => {
    const newEducation = formData.education.filter((_, i) => i !== index)
    setFormData({ ...formData, education: newEducation })
  }

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const newEducation = [...formData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setFormData({ ...formData, education: newEducation })
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: "", position: "", startDate: "", endDate: "", description: "", currentlyWorking: false },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const newExperience = formData.experience.filter((_, i) => i !== index)
    setFormData({ ...formData, experience: newExperience })
  }

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string | boolean) => {
    const newExperience = [...formData.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setFormData({ ...formData, experience: newExperience })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const applicationData = {
      fullName: formData.fullName,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      nationalId: formData.nationalId,
      maritalStatus: formData.maritalStatus,
      address: formData.address,
      phone: formData.phone,
      position: formData.position,
      expectedSalary: formData.expectedSalary,
      education: formData.education,
      experience: formData.experience,
      cvFileName: cvFile?.name,
    }

    const savedApplication = saveEnhancedEmploymentApplication(applicationData)

    try {
      const response = await fetch("/api/send-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      if (result.success) {
        console.log("[v0] Application sent successfully")
        // Optionally open WhatsApp
        // window.open(result.whatsappUrl, '_blank')
      }
    } catch (error) {
      console.error("[v0] Error sending application:", error)
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        fullName: "",
        birthPlace: "",
        birthDate: "",
        nationalId: "",
        maritalStatus: "",
        address: "",
        phone: "",
        position: "",
        expectedSalary: "",
        education: [],
        experience: [],
      })
      setSelectedJob("")
      setCvFile(null)
      setCurrentStep(1)
    }, 5000) // Reset form after 5 seconds instead of 3
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size <= 5 * 1024 * 1024) {
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      // Scroll to form
      document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.fullName &&
        formData.birthPlace &&
        formData.birthDate &&
        formData.nationalId &&
        formData.maritalStatus &&
        formData.address &&
        formData.phone &&
        formData.position &&
        formData.expectedSalary
      )
    }
    if (currentStep === 2) {
      return (
        formData.education.length > 0 &&
        formData.education.every((edu) => edu.degree && edu.major && edu.university && edu.graduationYear)
      )
    }
    return true
  }

  const benefitIcons = [Heart, TrendingUp, Award, Users, Star, Briefcase]
  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <LayoutWrapper>
      {/* ... existing hero section code ... */}
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
          {/* ... existing benefits and jobs cards ... */}
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

              <div className="mb-12">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                            currentStep >= step
                              ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-110"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                        </div>
                        <div className="mt-3 text-center">
                          <div
                            className={`text-sm font-bold transition-colors ${
                              currentStep >= step ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {step === 1 && (language === "ar" ? "المعلومات الشخصية" : "Personal Info")}
                            {step === 2 && (language === "ar" ? "المؤهل العلمي" : "Education")}
                            {step === 3 && (language === "ar" ? "الخبرات العملية" : "Experience")}
                          </div>
                        </div>
                      </div>
                      {step < 3 && (
                        <div
                          className={`h-1 flex-1 mx-2 transition-all duration-500 ${
                            currentStep > step ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-700">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                      <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 mx-auto animate-ping opacity-20" />
                  </div>

                  <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent mb-4 animate-in slide-in-from-bottom duration-500">
                    {language === "ar" ? "تم إرسال طلبك بنجاح!" : "Application Submitted Successfully!"}
                  </h3>

                  <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-700 delay-200">
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {language === "ar"
                        ? "شكراً لك على اهتمامك بالانضمام إلى فريقنا"
                        : "Thank you for your interest in joining our team"}
                    </p>

                    <div className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl border-2 border-primary/20">
                      <p className="text-lg font-semibold text-foreground mb-4">
                        {language === "ar" ? "سوف نتواصل معك قريباً عبر:" : "We will contact you soon via:"}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-foreground">
                            {language === "ar" ? "البريد الإلكتروني" : "Email"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-foreground">
                            {language === "ar" ? "الهاتف" : "Phone"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-foreground">
                            {language === "ar" ? "واتساب" : "WhatsApp"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <p className="text-base">
                        {language === "ar"
                          ? "يرجى متابعة هاتفك وبريدك الإلكتروني"
                          : "Please check your phone and email"}
                      </p>
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">
                          {language === "ar" ? "المعلومات الشخصية" : "Personal Information"}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="fullName" className="text-lg font-bold text-foreground">
                          {language === "ar" ? "الاسم *" : "Full Name *"}
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

                      <div className="space-y-3">
                        <Label htmlFor="birthPlace" className="text-lg font-bold text-foreground">
                          {language === "ar" ? "مكان وتاريخ الولادة *" : "Place and Date of Birth *"}
                        </Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            id="birthPlace"
                            value={formData.birthPlace}
                            onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                            placeholder={language === "ar" ? "مكان الولادة" : "Place of birth"}
                            required
                            className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                          />
                          <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            required
                            className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="nationalId" className="text-lg font-bold text-foreground">
                          {language === "ar" ? "رقم الهوية أو الجواز *" : "National ID or Passport *"}
                        </Label>
                        <Input
                          id="nationalId"
                          value={formData.nationalId}
                          onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                          placeholder={language === "ar" ? "أدخل رقم الهوية أو الجواز" : "Enter ID or passport number"}
                          required
                          className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="maritalStatus" className="text-lg font-bold text-foreground">
                          {language === "ar" ? "الحالة الاجتماعية *" : "Marital Status *"}
                        </Label>
                        <Select
                          value={formData.maritalStatus}
                          onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                          required
                        >
                          <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl">
                            <SelectValue placeholder={language === "ar" ? "اختر..." : "Select..."} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">{language === "ar" ? "أعزب/عزباء" : "Single"}</SelectItem>
                            <SelectItem value="married">{language === "ar" ? "متزوج/متزوجة" : "Married"}</SelectItem>
                            <SelectItem value="divorced">{language === "ar" ? "مطلق/مطلقة" : "Divorced"}</SelectItem>
                            <SelectItem value="widowed">{language === "ar" ? "أرمل/أرملة" : "Widowed"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="address" className="text-lg font-bold text-foreground">
                          {language === "ar" ? "عنوان السكن *" : "Address *"}
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder={language === "ar" ? "أدخل عنوان السكن" : "Enter your address"}
                          required
                          className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                        />
                      </div>

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
                        <Label htmlFor="expectedSalary" className="text-lg font-bold text-foreground">
                          {language === "ar" ? "الراتب المتوقع *" : "Expected Salary *"}
                        </Label>
                        <Input
                          id="expectedSalary"
                          value={formData.expectedSalary}
                          onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                          placeholder={language === "ar" ? "أدخل الراتب المتوقع" : "Enter expected salary"}
                          required
                          className="h-14 text-base border-2 hover:border-primary transition-colors rounded-xl"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold">
                            {language === "ar" ? "المؤهل العلمي" : "Educational Qualifications"}
                          </h3>
                        </div>
                        <Button
                          type="button"
                          onClick={addEducation}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          {language === "ar" ? "إضافة مؤهل" : "Add Education"}
                        </Button>
                      </div>

                      {formData.education.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-muted rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5">
                          <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <p className="text-muted-foreground text-lg mb-4">
                            {language === "ar" ? "لم تضف أي مؤهل علمي بعد" : "No education added yet"}
                          </p>
                          <Button
                            type="button"
                            onClick={addEducation}
                            variant="outline"
                            size="lg"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent transition-all duration-300"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            {language === "ar" ? "إضافة مؤهل علمي" : "Add Education"}
                          </Button>
                        </div>
                      )}

                      {formData.education.map((edu, index) => (
                        <Card
                          key={index}
                          className="p-6 border-2 border-primary/20 relative hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEducation(index)}
                            className="absolute top-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>

                          <div className="space-y-6 mt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-base font-semibold">
                                  {language === "ar" ? "الدرجة العلمية *" : "Degree *"}
                                </Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                  placeholder={language === "ar" ? "بكالوريوس، ماجستير..." : "Bachelor, Master..."}
                                  required
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-base font-semibold">
                                  {language === "ar" ? "التخصص *" : "Major *"}
                                </Label>
                                <Input
                                  value={edu.major}
                                  onChange={(e) => updateEducation(index, "major", e.target.value)}
                                  placeholder={language === "ar" ? "التخصص" : "Major"}
                                  required
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-base font-semibold">
                                  {language === "ar" ? "الجامعة *" : "University *"}
                                </Label>
                                <Input
                                  value={edu.university}
                                  onChange={(e) => updateEducation(index, "university", e.target.value)}
                                  placeholder={language === "ar" ? "اسم الجامعة" : "University name"}
                                  required
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-base font-semibold">
                                  {language === "ar" ? "سنة التخرج *" : "Graduation Year *"}
                                </Label>
                                <Input
                                  type="number"
                                  value={edu.graduationYear}
                                  onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                                  placeholder="2020"
                                  required
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-base font-semibold">{language === "ar" ? "المعدل" : "GPA"}</Label>
                              <Input
                                value={edu.gpa}
                                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                                placeholder={language === "ar" ? "المعدل التراكمي" : "GPA"}
                                className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold">
                            {language === "ar" ? "الخبرات العملية" : "Work Experience"}
                          </h3>
                        </div>
                        <Button
                          type="button"
                          onClick={addExperience}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          {language === "ar" ? "إضافة خبرة" : "Add Experience"}
                        </Button>
                      </div>

                      {formData.experience.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-muted rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5">
                          <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <p className="text-muted-foreground text-lg mb-4">
                            {language === "ar" ? "لم تضف أي خبرة عملية بعد" : "No experience added yet"}
                          </p>
                          <Button
                            type="button"
                            onClick={addExperience}
                            variant="outline"
                            size="lg"
                            className="border-2 border-primary hover:bg-primary hover:text-white bg-transparent transition-all duration-300"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            {language === "ar" ? "إضافة خبرة عملية" : "Add Experience"}
                          </Button>
                        </div>
                      )}

                      {formData.experience.map((exp, index) => (
                        <Card
                          key={index}
                          className="p-6 border-2 border-primary/20 relative hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperience(index)}
                            className="absolute top-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>

                          <div className="space-y-6 mt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                  <Building className="w-4 h-4 text-primary" />
                                  {language === "ar" ? "اسم الشركة/المؤسسة" : "Company/Organization"}
                                </Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                                  placeholder={language === "ar" ? "اسم الشركة" : "Company name"}
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-primary" />
                                  {language === "ar" ? "المسمى الوظيفي" : "Job Title"}
                                </Label>
                                <Input
                                  value={exp.position}
                                  onChange={(e) => updateExperience(index, "position", e.target.value)}
                                  placeholder={language === "ar" ? "المسمى الوظيفي" : "Job title"}
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-base font-semibold">
                                  {language === "ar" ? "تاريخ البدء" : "Start Date"}
                                </Label>
                                <Input
                                  type="date"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-base font-semibold">
                                  {language === "ar" ? "تاريخ الانتهاء" : "End Date"}
                                </Label>
                                <Input
                                  type="date"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                                  disabled={exp.currentlyWorking}
                                  className="h-12 border-2 hover:border-primary focus:border-primary transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                              <input
                                type="checkbox"
                                id={`currently-working-${index}`}
                                checked={exp.currentlyWorking}
                                onChange={(e) => {
                                  updateExperience(index, "currentlyWorking", e.target.checked)
                                  if (e.target.checked) {
                                    updateExperience(index, "endDate", "")
                                  }
                                }}
                                className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                              />
                              <Label
                                htmlFor={`currently-working-${index}`}
                                className="text-base cursor-pointer font-medium"
                              >
                                {language === "ar" ? "أعمل حالياً في هذه الوظيفة" : "Currently working here"}
                              </Label>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-base font-semibold">
                                {language === "ar" ? "وصف المهام والمسؤوليات" : "Job Description"}
                              </Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(index, "description", e.target.value)}
                                placeholder={
                                  language === "ar"
                                    ? "اكتب وصفاً مختصراً للمهام والمسؤوليات..."
                                    : "Brief description of responsibilities..."
                                }
                                rows={4}
                                className="border-2 hover:border-primary focus:border-primary transition-colors rounded-xl resize-none"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}

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
                                <p className="text-sm text-muted-foreground">
                                  {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
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
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-8 border-t-2 border-border">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        size="lg"
                        className="border-2 border-primary hover:bg-primary hover:text-white text-lg px-8 py-6 rounded-xl bg-transparent"
                      >
                        {language === "ar" ? (
                          <ArrowRight className="w-6 h-6 ml-2" />
                        ) : (
                          <ArrowLeft className="w-6 h-6 mr-2" />
                        )}
                        {language === "ar" ? "السابق" : "Previous"}
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        size="lg"
                        className="bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-lg px-8 py-6 rounded-xl ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {language === "ar" ? "التالي" : "Next"}
                        {language === "ar" ? (
                          <ArrowLeft className="w-6 h-6 mr-2" />
                        ) : (
                          <ArrowRight className="w-6 h-6 ml-2" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-lg px-8 py-6 rounded-xl ml-auto"
                      >
                        <Send className={`w-6 h-6 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                        {language === "ar" ? "إرسال الطلب" : "Submit Application"}
                      </Button>
                    )}
                  </div>

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
