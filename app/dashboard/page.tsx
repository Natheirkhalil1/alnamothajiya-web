"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Download,
  Trash2,
  LogOut,
  TrendingUp,
  Star,
  Calendar,
  Mail,
  Phone,
  User,
  FileText,
  DollarSign,
  Plus,
  MessageCircle,
  ArrowRight,
  Edit,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
  ImageIcon,
  Info,
  Contact,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { isAuthenticated, logout, getUsername } from "@/lib/auth"
import {
  getEmploymentApplications,
  getContactMessages,
  deleteEmploymentApplication,
  deleteContactMessage,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getJobPositions,
  saveJobPosition,
  deleteJobPosition,
  updateJobPosition,
  getPendingReviews,
  approvePendingReview,
  deletePendingReview,
  getServiceContents,
  updateServiceContent,
  getHeroSlides,
  saveHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getAboutContent,
  updateAboutContent,
  getGalleryImages,
  saveGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getDepartmentContents,
  getContactInfo,
  updateContactInfo,
  type EmploymentApplication,
  type ContactMessage,
  type Testimonial,
  type JobPosition,
  type PendingReview,
  type ServiceContent,
  type HeroSlide,
  type AboutContent,
  type GalleryImage,
  type DepartmentContent,
  type ContactInfo,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { ImageUpload } from "@/components/image-upload"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language].dashboard
  const [applications, setApplications] = useState<EmploymentApplication[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [username, setUsername] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null)
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    image: "",
    rating: 5,
    comment: "",
  })
  const [newJob, setNewJob] = useState({
    title: "",
    titleEn: "",
    type: "",
    typeEn: "",
    description: "",
    descriptionEn: "",
  })

  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [services, setServices] = useState<ServiceContent[]>([])
  const [editingService, setEditingService] = useState<ServiceContent | null>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [newService, setNewService] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    type: "education" as "education" | "training" | "employment",
  })

  // ADDED STATE FOR PAGES
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [departmentContents, setDepartmentContents] = useState<DepartmentContent[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  // ADDED STATE FOR DIALOGS
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false)
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null)
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false)
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    setUsername(getUsername() || "")
    loadData()
  }, [router])

  const loadData = () => {
    setApplications(getEmploymentApplications())
    setMessages(getContactMessages())
    setTestimonials(getTestimonials())
    setJobs(getJobPositions())
    setPendingReviews(getPendingReviews())
    setServices(getServiceContents())
    // LOAD PAGE DATA
    setHeroSlides(getHeroSlides())
    setAboutContent(getAboutContent())
    setGalleryImages(getGalleryImages())
    setDepartmentContents(getDepartmentContents())
    setContactInfo(getContactInfo())
  }

  const handleLogout = () => {
    logout()
    toast({
      title: language === "ar" ? "تم تسجيل الخروج" : "Logged out",
      description: language === "ar" ? "نراك قريباً" : "See you soon",
    })
    router.push("/login")
  }

  const exportToExcel = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {})
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()

    toast({
      title: language === "ar" ? "تم التصدير بنجاح" : "Exported successfully",
      description: `${filename}.csv`,
    })
  }

  const handleDeleteApplication = (id: string) => {
    deleteEmploymentApplication(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف طلب التوظيف بنجاح" : "Application deleted successfully",
    })
  }

  const handleDeleteMessage = (id: string) => {
    deleteContactMessage(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الرسالة بنجاح" : "Message deleted successfully",
    })
  }

  const handleDeleteTestimonial = (id: string) => {
    deleteTestimonial(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: t.testimonialDeleted,
    })
  }

  const handleSaveTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.comment) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    saveTestimonial(newTestimonial)
    loadData()
    setIsDialogOpen(false)
    setNewTestimonial({ name: "", image: "", rating: 5, comment: "" })
    toast({
      title: language === "ar" ? "تم الحفظ" : "Saved",
      description: t.testimonialAdded,
    })
  }

  const handleConvertMessageToTestimonial = (message: ContactMessage) => {
    const testimonial = {
      name: message.name,
      image: "/diverse-user-avatars.png",
      rating: message.rating,
      comment: message.message,
    }

    saveTestimonial(testimonial)
    loadData()
    toast({
      title: language === "ar" ? "تم التحويل" : "Converted",
      description:
        language === "ar" ? "تم تحويل الرسالة إلى رأي زائر بنجاح" : "Message converted to testimonial successfully",
    })
  }

  const handleSaveJob = () => {
    if (!newJob.title || !newJob.titleEn || !newJob.type || !newJob.typeEn) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    if (editingJob) {
      updateJobPosition(editingJob.id, newJob)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: t.jobUpdated,
      })
    } else {
      saveJobPosition(newJob)
      toast({
        title: language === "ar" ? "تم الحفظ" : "Saved",
        description: t.jobAdded,
      })
    }

    loadData()
    setIsJobDialogOpen(false)
    setEditingJob(null)
    setNewJob({
      title: "",
      titleEn: "",
      type: "",
      typeEn: "",
      description: "",
      descriptionEn: "",
    })
  }

  const handleEditJob = (job: JobPosition) => {
    setEditingJob(job)
    setNewJob({
      title: job.title,
      titleEn: job.titleEn,
      type: job.type,
      typeEn: job.typeEn,
      description: job.description,
      descriptionEn: job.descriptionEn,
    })
    setIsJobDialogOpen(true)
  }

  const handleDeleteJob = (id: string) => {
    deleteJobPosition(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: t.jobDeleted,
    })
  }

  const handleApprovePendingReview = (id: string) => {
    approvePendingReview(id)
    loadData()
    toast({
      title: language === "ar" ? "تمت الموافقة" : "Approved",
      description: language === "ar" ? "تم نشر الرأي على الموقع" : "Review published on the website",
    })
  }

  const handleRejectPendingReview = (id: string) => {
    deletePendingReview(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الرفض" : "Rejected",
      description: language === "ar" ? "تم رفض الرأي" : "Review rejected",
    })
  }

  const handleEditService = (service: ServiceContent) => {
    setEditingService(service)
    setNewService({
      titleAr: service.titleAr,
      titleEn: service.titleEn,
      descriptionAr: service.descriptionAr,
      descriptionEn: service.descriptionEn,
      type: service.type,
    })
    setIsServiceDialogOpen(true)
  }

  const handleSaveService = () => {
    if (!newService.titleAr || !newService.titleEn) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    if (editingService) {
      updateServiceContent(editingService.id, newService)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث الخدمة بنجاح" : "Service updated successfully",
      })
    }

    loadData()
    setIsServiceDialogOpen(false)
    setEditingService(null)
    setNewService({
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      type: "education",
    })
  }

  // HANDLERS FOR PAGES
  const handleSaveHeroSlide = () => {
    if (!editingHeroSlide) return

    if (editingHeroSlide.id) {
      updateHeroSlide(editingHeroSlide.id, editingHeroSlide)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث الشريحة بنجاح" : "Slide updated successfully",
      })
    } else {
      saveHeroSlide({
        ...editingHeroSlide,
        order: heroSlides.length + 1,
      })
      toast({
        title: language === "ar" ? "تم الإضافة" : "Added",
        description: language === "ar" ? "تم إضافة الشريحة بنجاح" : "Slide added successfully",
      })
    }
    loadData()
    setIsHeroDialogOpen(false)
    setEditingHeroSlide(null)
  }

  const handleDeleteHeroSlide = (id: string) => {
    deleteHeroSlide(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الشريحة بنجاح" : "Slide deleted successfully",
    })
  }

  const handleSaveGalleryImage = () => {
    if (!editingGalleryImage) return

    if (editingGalleryImage.id) {
      updateGalleryImage(editingGalleryImage.id, editingGalleryImage)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث الصورة بنجاح" : "Image updated successfully",
      })
    } else {
      saveGalleryImage({
        ...editingGalleryImage,
        order: galleryImages.length + 1,
      })
      toast({
        title: language === "ar" ? "تم الإضافة" : "Added",
        description: language === "ar" ? "تم إضافة الصورة بنجاح" : "Image added successfully",
      })
    }
    loadData()
    setIsGalleryDialogOpen(false)
    setEditingGalleryImage(null)
  }

  const handleDeleteGalleryImage = (id: string) => {
    deleteGalleryImage(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الصورة بنجاح" : "Image deleted successfully",
    })
  }

  const stats = [
    {
      title: language === "ar" ? "طلبات التوظيف" : "Applications",
      value: applications.length,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: language === "ar" ? "الرسائل" : "Messages",
      value: messages.length,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
    },
    {
      title: language === "ar" ? "آراء الزوار" : "Testimonials",
      value: testimonials.length,
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: language === "ar" ? "الوظائف المتاحة" : "Available Jobs",
      value: jobs.length,
      icon: Settings,
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative">
                <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6" />
                  {t.title}
                </h1>
                <p className="text-sm text-primary-foreground/80">
                  {t.welcome}, {username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="secondary"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                {language === "ar" ? "الصفحة الرئيسية" : "Home"}
              </Button>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <LogOut className="w-4 h-4 ml-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full max-w-7xl mx-auto grid-cols-7 h-12">
            <TabsTrigger value="applications" className="text-sm">
              <Briefcase className="w-4 h-4 ml-2" />
              {language === "ar" ? "الطلبات" : "Apps"}
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">
              <MessageSquare className="w-4 h-4 ml-2" />
              {language === "ar" ? "الرسائل" : "Messages"}
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">
              <Clock className="w-4 h-4 ml-2" />
              {language === "ar" ? "معلقة" : "Pending"} ({pendingReviews.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="text-sm">
              <MessageCircle className="w-4 h-4 ml-2" />
              {language === "ar" ? "الآراء" : "Reviews"}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-sm">
              <Settings className="w-4 h-4 ml-2" />
              {language === "ar" ? "الوظائف" : "Jobs"}
            </TabsTrigger>
            <TabsTrigger value="services" className="text-sm">
              <FileEdit className="w-4 h-4 ml-2" />
              {language === "ar" ? "الخدمات" : "Services"}
            </TabsTrigger>
            <TabsTrigger value="pages" className="text-sm">
              <Layers className="w-4 h-4 ml-2" />
              {language === "ar" ? "الصفحات" : "Pages"}
            </TabsTrigger>
          </TabsList>

          {/* Employment Applications */}
          <TabsContent value="applications" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  {t.applications}
                </h2>
                <Button
                  onClick={() => exportToExcel(applications, "employment-applications")}
                  disabled={applications.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  {t.export}
                </Button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t.noData}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{app.fullName}</h3>
                            <Badge className="mt-1 bg-primary/10 text-primary hover:bg-primary/20">
                              {app.position}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteApplication(app.id)}
                          variant="destructive"
                          size="sm"
                          className="hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="truncate">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>
                            {language === "ar" ? "الرقم الوطني" : "National ID"}: {app.nationalId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4 text-primary" />
                          <span>
                            {language === "ar" ? "الجنس" : "Gender"}:{" "}
                            {app.gender === "male"
                              ? language === "ar"
                                ? "ذكر"
                                : "Male"
                              : language === "ar"
                                ? "أنثى"
                                : "Female"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span>
                            {language === "ar" ? "الخبرة" : "Experience"}: {app.experience}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span>
                            {language === "ar" ? "الراتب المتوقع" : "Expected Salary"}: {app.expectedSalary}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          {language === "ar" ? "نبذة عن المتقدم:" : "About the applicant:"}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">{app.coverLetter}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {language === "ar" ? "تاريخ التقديم" : "Submitted"}:{" "}
                          {new Date(app.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Contact Messages */}
          <TabsContent value="messages" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  {t.messages}
                </h2>
                <Button
                  onClick={() => exportToExcel(messages, "contact-messages")}
                  disabled={messages.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  {t.export}
                </Button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t.noData}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{msg.name}</h3>
                            <div className="flex gap-1 mt-1">
                              {Array.from({ length: msg.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleConvertMessageToTestimonial(msg)}
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-transform bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20"
                          >
                            <ArrowRight className="w-4 h-4 ml-1" />
                            {language === "ar" ? "تحويل لرأي" : "Convert to Review"}
                          </Button>
                          <Button
                            onClick={() => handleDeleteMessage(msg.id)}
                            variant="destructive"
                            size="sm"
                            className="hover:scale-105 transition-transform"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{msg.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="truncate">{msg.email}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          {language === "ar" ? "الرسالة:" : "Message:"}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">{msg.message}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {language === "ar" ? "تاريخ الإرسال" : "Sent"}:{" "}
                          {new Date(msg.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  {language === "ar" ? "الآراء المعلقة" : "Pending Reviews"}
                </h2>
              </div>

              {pendingReviews.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t.noData}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingReviews.map((review) => (
                    <Card
                      key={review.id}
                      className="p-6 hover:shadow-lg transition-shadow border-2 border-orange-500/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.image || "/placeholder.svg"}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-foreground">{review.name}</h3>
                            <div className="flex gap-1 mt-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-4">"{review.comment}"</p>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprovePendingReview(review.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 ml-1" />
                          {language === "ar" ? "موافقة" : "Approve"}
                        </Button>
                        <Button
                          onClick={() => handleRejectPendingReview(review.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 ml-1" />
                          {language === "ar" ? "رفض" : "Reject"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(review.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Testimonials */}
          <TabsContent value="testimonials" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  {t.testimonials}
                </h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      <Plus className="w-4 h-4 ml-2" />
                      {t.addTestimonial}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{t.addTestimonial}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-name">{t.testimonialName}</Label>
                        <Input
                          id="testimonial-name"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          placeholder={language === "ar" ? "أحمد محمد" : "Ahmad Mohammad"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-image">{t.testimonialImage}</Label>
                        <Input
                          id="testimonial-image"
                          value={newTestimonial.image}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
                          placeholder={t.imagePlaceholder}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.testimonialRating}</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= newTestimonial.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-comment">{t.testimonialComment}</Label>
                        <Textarea
                          id="testimonial-comment"
                          value={newTestimonial.comment}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                          placeholder={
                            language === "ar"
                              ? "مدرسة رائعة بكل المقاييس..."
                              : "An excellent school by all standards..."
                          }
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveTestimonial} className="flex-1">
                          {t.saveTestimonial}
                        </Button>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                          {t.cancel}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {testimonials.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t.noData}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                            <div className="flex gap-1 mt-1">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          variant="destructive"
                          size="sm"
                          className="hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-3">"{testimonial.comment}"</p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(testimonial.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  {t.jobsManagement}
                </h2>
                <Dialog
                  open={isJobDialogOpen}
                  onOpenChange={(open) => {
                    setIsJobDialogOpen(open)
                    if (!open) {
                      setEditingJob(null)
                      setNewJob({
                        title: "",
                        titleEn: "",
                        type: "",
                        typeEn: "",
                        description: "",
                        descriptionEn: "",
                      })
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      <Plus className="w-4 h-4 ml-2" />
                      {t.addJob}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingJob ? t.editJob : t.addJob}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="job-title">{t.jobTitle}</Label>
                          <Input
                            id="job-title"
                            value={newJob.title}
                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                            placeholder={language === "ar" ? "معلم لغة عربية" : "Arabic Teacher"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-title-en">{t.jobTitleEn}</Label>
                          <Input
                            id="job-title-en"
                            value={newJob.titleEn}
                            onChange={(e) => setNewJob({ ...newJob, titleEn: e.target.value })}
                            placeholder="Arabic Language Teacher"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="job-type">{t.jobType}</Label>
                          <Input
                            id="job-type"
                            value={newJob.type}
                            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                            placeholder={language === "ar" ? "دوام كامل" : "Full-time"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job-type-en">{t.jobTypeEn}</Label>
                          <Input
                            id="job-type-en"
                            value={newJob.typeEn}
                            onChange={(e) => setNewJob({ ...newJob, typeEn: e.target.value })}
                            placeholder="Full-time"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="job-description">{t.jobDescription}</Label>
                        <Textarea
                          id="job-description"
                          value={newJob.description}
                          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                          placeholder={language === "ar" ? "تدريس اللغة العربية لجميع المراحل" : "Teaching Arabic"}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="job-description-en">{t.jobDescriptionEn}</Label>
                        <Textarea
                          id="job-description-en"
                          value={newJob.descriptionEn}
                          onChange={(e) => setNewJob({ ...newJob, descriptionEn: e.target.value })}
                          placeholder="Teaching Arabic for all levels"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveJob} className="flex-1">
                          {t.saveJob}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsJobDialogOpen(false)
                            setEditingJob(null)
                            setNewJob({
                              title: "",
                              titleEn: "",
                              type: "",
                              typeEn: "",
                              description: "",
                              descriptionEn: "",
                            })
                          }}
                          className="flex-1"
                        >
                          {t.cancel}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t.noData}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-lg mb-1">
                            {language === "ar" ? job.title : job.titleEn}
                          </h3>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {language === "ar" ? job.type : job.typeEn}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditJob(job)}
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-transform"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteJob(job.id)}
                            variant="destructive"
                            size="sm"
                            className="hover:scale-105 transition-transform"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        {language === "ar" ? job.description : job.descriptionEn}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(job.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <FileEdit className="w-6 h-6 text-primary" />
                  {language === "ar" ? "إدارة محتوى الخدمات" : "Services Content Management"}
                </h2>
              </div>

              <div className="space-y-6">
                {services.map((service) => (
                  <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-foreground text-xl">
                            {language === "ar" ? service.titleAr : service.titleEn}
                          </h3>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {service.type === "education"
                              ? language === "ar"
                                ? "تعليم"
                                : "Education"
                              : service.type === "training"
                                ? language === "ar"
                                  ? "تدريب"
                                  : "Training"
                                : language === "ar"
                                  ? "توظيف"
                                  : "Employment"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {language === "ar" ? service.descriptionAr : service.descriptionEn}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleEditService(service)}
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform ml-4"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Pages Content Management - MODERNIZED */}
          <TabsContent value="pages" className="space-y-6">
            <Card className="p-8 border-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                      <Layers className="w-6 h-6 text-primary-foreground" />
                    </div>
                    {language === "ar" ? "إدارة محتوى الصفحات" : "Pages Content Management"}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {language === "ar"
                      ? "تحكم كامل في جميع محتويات صفحات الموقع"
                      : "Full control over all website page content"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Hero Slides Section */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {language === "ar" ? "الشرائح الرئيسية" : "Hero Slides"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? `${heroSlides.length} شريحة` : `${heroSlides.length} slides`}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingHeroSlide({
                          id: "",
                          titleAr: "",
                          titleEn: "",
                          subtitleAr: "",
                          subtitleEn: "",
                          descriptionAr: "",
                          descriptionEn: "",
                          image: "",
                          order: heroSlides.length + 1,
                        })
                        setIsHeroDialogOpen(true)
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      {language === "ar" ? "إضافة شريحة" : "Add Slide"}
                    </Button>
                  </div>

                  {heroSlides.length === 0 ? (
                    <div className="text-center py-12 bg-background/50 rounded-xl border-2 border-dashed border-border">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === "ar" ? "لا توجد شرائح. أضف الشريحة الأولى!" : "No slides. Add your first slide!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {heroSlides.map((slide, index) => (
                        <Card
                          key={slide.id}
                          className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50"
                        >
                          <div className="relative w-full h-48 overflow-hidden bg-muted">
                            <Image
                              src={slide.image || "/placeholder.svg?height=200&width=400"}
                              alt={slide.titleAr}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              #{index + 1}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-lg mb-2 line-clamp-1">
                              {language === "ar" ? slide.titleAr : slide.titleEn}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                              {language === "ar" ? slide.subtitleAr : slide.subtitleEn}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                              {language === "ar" ? slide.descriptionAr : slide.descriptionEn}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  setEditingHeroSlide(slide)
                                  setIsHeroDialogOpen(true)
                                }}
                                variant="outline"
                                size="sm"
                                className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Edit className="w-3 h-3 ml-1" />
                                {language === "ar" ? "تعديل" : "Edit"}
                              </Button>
                              <Button
                                onClick={() => handleDeleteHeroSlide(slide.id)}
                                variant="destructive"
                                size="sm"
                                className="hover:scale-105 transition-transform"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>

                {/* About Section */}
                <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-2 border-green-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {language === "ar" ? "قسم حول المدرسة" : "About Section"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? "معلومات عن المدرسة" : "School information"}
                      </p>
                    </div>
                  </div>

                  {aboutContent && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-4 bg-background">
                          <Label className="text-sm font-semibold mb-2 block">
                            {language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}
                          </Label>
                          <Input
                            value={aboutContent.titleAr}
                            onChange={(e) => setAboutContent({ ...aboutContent, titleAr: e.target.value })}
                            className="text-lg font-bold"
                            placeholder="عن المدرسة"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-sm font-semibold mb-2 block">
                            {language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                          </Label>
                          <Input
                            value={aboutContent.titleEn}
                            onChange={(e) => setAboutContent({ ...aboutContent, titleEn: e.target.value })}
                            className="text-lg font-bold"
                            placeholder="About School"
                          />
                        </Card>
                      </div>

                      <Card className="p-4 bg-background">
                        <Label className="text-sm font-semibold mb-2 block">
                          {language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                        </Label>
                        <Textarea
                          value={aboutContent.descriptionAr}
                          onChange={(e) => setAboutContent({ ...aboutContent, descriptionAr: e.target.value })}
                          rows={5}
                          className="resize-none"
                          placeholder="اكتب وصفاً شاملاً عن المدرسة..."
                        />
                      </Card>

                      <Card className="p-4 bg-background">
                        <Label className="text-sm font-semibold mb-2 block">
                          {language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
                        </Label>
                        <Textarea
                          value={aboutContent.descriptionEn}
                          onChange={(e) => setAboutContent({ ...aboutContent, descriptionEn: e.target.value })}
                          rows={5}
                          className="resize-none"
                          placeholder="Write a comprehensive description about the school..."
                        />
                      </Card>

                      <Card className="p-4 bg-background">
                        <Label className="text-sm font-semibold mb-3 block">
                          {language === "ar" ? "صورة القسم" : "Section Image"}
                        </Label>
                        <div className="space-y-3">
                          {aboutContent.image && (
                            <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-border">
                              <Image
                                src={aboutContent.image || "/placeholder.svg"}
                                alt="About"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <Input
                            value={aboutContent.image}
                            onChange={(e) => setAboutContent({ ...aboutContent, image: e.target.value })}
                            placeholder={language === "ar" ? "رابط الصورة" : "Image URL"}
                          />
                        </div>
                      </Card>

                      <Button
                        onClick={() => {
                          updateAboutContent(aboutContent)
                          toast({
                            title: language === "ar" ? "تم الحفظ بنجاح" : "Saved Successfully",
                            description:
                              language === "ar" ? "تم حفظ تغييرات قسم حول المدرسة" : "About section changes saved",
                          })
                        }}
                        className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <CheckCircle className="w-5 h-5 ml-2" />
                        {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Gallery Section */}
                <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2 border-purple-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {language === "ar" ? "معرض الصور" : "Image Gallery"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? `${galleryImages.length} صورة` : `${galleryImages.length} images`}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingGalleryImage({
                          id: "",
                          titleAr: "",
                          titleEn: "",
                          descriptionAr: "",
                          descriptionEn: "",
                          image: "",
                          order: galleryImages.length + 1,
                        })
                        setIsGalleryDialogOpen(true)
                      }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      {language === "ar" ? "إضافة صورة" : "Add Image"}
                    </Button>
                  </div>

                  {galleryImages.length === 0 ? (
                    <div className="text-center py-12 bg-background/50 rounded-xl border-2 border-dashed border-border">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === "ar" ? "لا توجد صور. أضف الصورة الأولى!" : "No images. Add your first image!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryImages.map((image) => (
                        <Card
                          key={image.id}
                          className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500/50"
                        >
                          <div className="relative w-full h-40 overflow-hidden bg-muted">
                            <Image
                              src={image.image || "/placeholder.svg?height=160&width=160"}
                              alt={image.titleAr}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-sm mb-2 line-clamp-1">
                              {language === "ar" ? image.titleAr : image.titleEn}
                            </h4>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  setEditingGalleryImage(image)
                                  setIsGalleryDialogOpen(true)
                                }}
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteGalleryImage(image.id)}
                                variant="destructive"
                                size="sm"
                                className="h-8"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Contact Info Section */}
                <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-red-500/5 border-2 border-orange-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Contact className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {language === "ar" ? "معلومات الاتصال" : "Contact Information"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? "بيانات التواصل مع المدرسة" : "School contact details"}
                      </p>
                    </div>
                  </div>

                  {contactInfo && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <Phone className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "رقم الهاتف" : "Phone"}
                          </Label>
                          <Input
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                            placeholder="+963 11 1234567"
                            className="font-mono"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <MessageSquare className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "واتساب" : "WhatsApp"}
                          </Label>
                          <Input
                            value={contactInfo.whatsapp}
                            onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                            placeholder="+963 999 123456"
                            className="font-mono"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <Mail className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "البريد الإلكتروني" : "Email"}
                          </Label>
                          <Input
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                            placeholder="info@school.com"
                            type="email"
                          />
                        </Card>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            {language === "ar" ? "العنوان (عربي)" : "Address (Arabic)"}
                          </Label>
                          <Textarea
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                            rows={2}
                            placeholder="دمشق، سوريا"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            {language === "ar" ? "العنوان (إنجليزي)" : "Address (English)"}
                          </Label>
                          <Textarea
                            value={contactInfo.addressEn}
                            onChange={(e) => setContactInfo({ ...contactInfo, addressEn: e.target.value })}
                            rows={2}
                            placeholder="Damascus, Syria"
                          />
                        </Card>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <Clock className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "أوقات العمل (عربي)" : "Working Hours (Arabic)"}
                          </Label>
                          <Input
                            value={contactInfo.workingHours}
                            onChange={(e) => setContactInfo({ ...contactInfo, workingHours: e.target.value })}
                            placeholder="الأحد - الخميس: 8 صباحاً - 3 مساءً"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <Clock className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "أوقات العمل (إنجليزي)" : "Working Hours (English)"}
                          </Label>
                          <Input
                            value={contactInfo.workingHoursEn}
                            onChange={(e) => setContactInfo({ ...contactInfo, workingHoursEn: e.target.value })}
                            placeholder="Sun - Thu: 8 AM - 3 PM"
                          />
                        </Card>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <Calendar className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "أيام العطل (عربي)" : "Holidays (Arabic)"}
                          </Label>
                          <Input
                            value={contactInfo.holidays}
                            onChange={(e) => setContactInfo({ ...contactInfo, holidays: e.target.value })}
                            placeholder="الجمعة والسبت"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <Calendar className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "أيام العطل (إنجليزي)" : "Holidays (English)"}
                          </Label>
                          <Input
                            value={contactInfo.holidaysEn}
                            onChange={(e) => setContactInfo({ ...contactInfo, holidaysEn: e.target.value })}
                            placeholder="Friday and Saturday"
                          />
                        </Card>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <User className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "المسؤول (عربي)" : "Contact Person (Arabic)"}
                          </Label>
                          <Input
                            value={contactInfo.responsiblePerson}
                            onChange={(e) => setContactInfo({ ...contactInfo, responsiblePerson: e.target.value })}
                            placeholder="أحمد محمد"
                          />
                          <Input
                            value={contactInfo.responsibleTitle}
                            onChange={(e) => setContactInfo({ ...contactInfo, responsibleTitle: e.target.value })}
                            placeholder="مدير المدرسة"
                            className="mt-2"
                          />
                        </Card>
                        <Card className="p-4 bg-background">
                          <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
                            <User className="w-3 h-3 inline ml-1" />
                            {language === "ar" ? "المسؤول (إنجليزي)" : "Contact Person (English)"}
                          </Label>
                          <Input
                            value={contactInfo.responsiblePersonEn}
                            onChange={(e) => setContactInfo({ ...contactInfo, responsiblePersonEn: e.target.value })}
                            placeholder="Ahmad Mohammad"
                          />
                          <Input
                            value={contactInfo.responsibleTitleEn}
                            onChange={(e) => setContactInfo({ ...contactInfo, responsibleTitleEn: e.target.value })}
                            placeholder="School Director"
                            className="mt-2"
                          />
                        </Card>
                      </div>

                      <Button
                        onClick={() => {
                          updateContactInfo(contactInfo)
                          toast({
                            title: language === "ar" ? "تم الحفظ بنجاح" : "Saved Successfully",
                            description: language === "ar" ? "تم حفظ معلومات الاتصال" : "Contact information saved",
                          })
                        }}
                        className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <CheckCircle className="w-5 h-5 ml-2" />
                        {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hero Slide Dialog */}
      <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHeroSlide
                ? language === "ar"
                  ? "تعديل الشريحة"
                  : "Edit Slide"
                : language === "ar"
                  ? "إضافة شريحة جديدة"
                  : "Add New Slide"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                <Input
                  value={editingHeroSlide?.titleAr || ""}
                  onChange={(e) =>
                    setEditingHeroSlide(
                      editingHeroSlide
                        ? { ...editingHeroSlide, titleAr: e.target.value }
                        : ({
                            id: "",
                            titleAr: e.target.value,
                            titleEn: "",
                            subtitleAr: "",
                            subtitleEn: "",
                            descriptionAr: "",
                            descriptionEn: "",
                            image: "",
                            order: 1,
                          } as HeroSlide),
                    )
                  }
                  placeholder="المدرسة النموذجية"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                <Input
                  value={editingHeroSlide?.titleEn || ""}
                  onChange={(e) =>
                    setEditingHeroSlide(
                      editingHeroSlide ? { ...editingHeroSlide, titleEn: e.target.value } : ({} as HeroSlide),
                    )
                  }
                  placeholder="Al Namothajia School"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}</Label>
                <Input
                  value={editingHeroSlide?.subtitleAr || ""}
                  onChange={(e) =>
                    setEditingHeroSlide(
                      editingHeroSlide ? { ...editingHeroSlide, subtitleAr: e.target.value } : ({} as HeroSlide),
                    )
                  }
                  placeholder="رؤية جديدة"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان الفرعي (إنجليزي)" : "Subtitle (English)"}</Label>
                <Input
                  value={editingHeroSlide?.subtitleEn || ""}
                  onChange={(e) =>
                    setEditingHeroSlide(
                      editingHeroSlide ? { ...editingHeroSlide, subtitleEn: e.target.value } : ({} as HeroSlide),
                    )
                  }
                  placeholder="A New Vision"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
              <Textarea
                value={editingHeroSlide?.descriptionAr || ""}
                onChange={(e) =>
                  setEditingHeroSlide(
                    editingHeroSlide ? { ...editingHeroSlide, descriptionAr: e.target.value } : ({} as HeroSlide),
                  )
                }
                placeholder="لتعزيز التعليم والإبداع في بيئة مريحة وآمنة"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
              <Textarea
                value={editingHeroSlide?.descriptionEn || ""}
                onChange={(e) =>
                  setEditingHeroSlide(
                    editingHeroSlide ? { ...editingHeroSlide, descriptionEn: e.target.value } : ({} as HeroSlide),
                  )
                }
                placeholder="To enhance education and creativity in a comfortable and safe environment"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الصورة" : "Image"}</Label>
              <ImageUpload
                value={editingHeroSlide?.image || ""}
                onChange={(url) =>
                  setEditingHeroSlide(editingHeroSlide ? { ...editingHeroSlide, image: url } : ({} as HeroSlide))
                }
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveHeroSlide} className="flex-1">
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsHeroDialogOpen(false)
                  setEditingHeroSlide(null)
                }}
                className="flex-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Image Dialog */}
      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingGalleryImage
                ? language === "ar"
                  ? "تعديل الصورة"
                  : "Edit Image"
                : language === "ar"
                  ? "إضافة صورة جديدة"
                  : "Add New Image"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                <Input
                  value={editingGalleryImage?.titleAr || ""}
                  onChange={(e) =>
                    setEditingGalleryImage(
                      editingGalleryImage
                        ? { ...editingGalleryImage, titleAr: e.target.value }
                        : ({
                            id: "",
                            titleAr: e.target.value,
                            titleEn: "",
                            descriptionAr: "",
                            descriptionEn: "",
                            image: "",
                            order: 1,
                          } as GalleryImage),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                <Input
                  value={editingGalleryImage?.titleEn || ""}
                  onChange={(e) =>
                    setEditingGalleryImage(
                      editingGalleryImage ? { ...editingGalleryImage, titleEn: e.target.value } : ({} as GalleryImage),
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
              <Textarea
                value={editingGalleryImage?.descriptionAr || ""}
                onChange={(e) =>
                  setEditingGalleryImage(
                    editingGalleryImage
                      ? { ...editingGalleryImage, descriptionAr: e.target.value }
                      : ({} as GalleryImage),
                  )
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
              <Textarea
                value={editingGalleryImage?.descriptionEn || ""}
                onChange={(e) =>
                  setEditingGalleryImage(
                    editingGalleryImage
                      ? { ...editingGalleryImage, descriptionEn: e.target.value }
                      : ({} as GalleryImage),
                  )
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الصورة" : "Image"}</Label>
              <ImageUpload
                value={editingGalleryImage?.image || ""}
                onChange={(url) =>
                  setEditingGalleryImage(
                    editingGalleryImage ? { ...editingGalleryImage, image: url } : ({} as GalleryImage),
                  )
                }
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveGalleryImage} className="flex-1">
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsGalleryDialogOpen(false)
                  setEditingGalleryImage(null)
                }}
                className="flex-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
