"use client"

import type React from "react"

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
  Star,
  Calendar,
  Mail,
  Phone,
  User,
  FileText,
  Plus,
  MessageCircle,
  ArrowRight,
  Edit,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  ImageIcon,
  Info,
  Contact,
  Home,
  Building2,
  GraduationCap,
  Menu,
  X,
  Save,
  Eye,
  Sparkles,
  Building,
  Users,
  ActivityIcon,
  Bell,
  Check,
  CheckCircle2,
  Rocket,
  AlertCircle,
  Copy,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  updateDepartmentContent,
  getContactInfo,
  updateContactInfo,
  getEnhancedEmploymentApplications,
  updateEmploymentApplicationStatus,
  deleteEnhancedEmploymentApplication,
  getServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
  // Added imports for Employees, Activities, Notifications
  getEmployees,
  saveEmployee,
  updateEmployee,
  deleteEmployee,
  getActivities,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type EnhancedEmploymentApplication,
  type ServiceRequest,
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
  // New types
  type Employee,
  type Activity,
  type Notification,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"
import { logActivity } from "@/lib/storage" // Assuming you have a logger utility

// Mock LayoutWrapper for now, assuming it's a layout component
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex">{children}</div>
)

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language].dashboard

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  // Add new tabs for applications and service requests
  const [activeTab, setActiveTab] = useState("overview")

  const [applications, setApplications] = useState<EmploymentApplication[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [username, setUsername] = useState<string>("")
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [services, setServices] = useState<ServiceContent[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [departmentContents, setDepartmentContents] = useState<DepartmentContent[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  const [employmentApplications, setEmploymentApplications] = useState<EnhancedEmploymentApplication[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])

  // Added state for selected application and dialog visibility
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false)

  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false)
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null)
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false)
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null)
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  // State for staff (employees) section
  const [staff, setStaff] = useState<Employee[]>([])

  // State for displaying new employee credentials
  const [newEmployeeCredentials, setNewEmployeeCredentials] = useState<{
    email: string
    password: string
  } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    setUsername(getUsername() || "")
    loadData()
    setEmploymentApplications(getEnhancedEmploymentApplications())
    setServiceRequests(getServiceRequests())

    // Listen for storage changes
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === "enhancedEmploymentApplications") {
        setEmploymentApplications(e.detail.value)
      }
      if (e.detail.key === "serviceRequests") {
        setServiceRequests(e.detail.value)
      }
      // الاستماع لتغييرات الموظفين
      if (e.detail.key === "employees") {
        setEmployees(e.detail.value)
        setStaff(e.detail.value) // Update staff state as well
      }
      // الاستماع لتغييرات الإشعارات
      if (e.detail.key === "notifications") {
        setNotifications(e.detail.value)
        setUnreadCount(getUnreadNotifications().length)
      }
    }

    window.addEventListener("localStorageChange", handleStorageChange as EventListener)

    setEmployees(getEmployees())
    setStaff(getEmployees()) // Initialize staff state
    setActivities(getActivities(50)) // آخر 50 نشاط
    setNotifications(getNotifications())
    setUnreadCount(getUnreadNotifications().length)

    return () => window.removeEventListener("localStorageChange", handleStorageChange as EventListener)
  }, [router])

  const loadData = () => {
    setApplications(getEmploymentApplications())
    setMessages(getContactMessages())
    setTestimonials(getTestimonials())
    setJobs(getJobPositions())
    setPendingReviews(getPendingReviews())
    setServices(getServiceContents())
    setHeroSlides(getHeroSlides())
    setAboutContent(getAboutContent())
    setGalleryImages(getGalleryImages())
    setDepartmentContents(getDepartmentContents())
    setContactInfo(getContactInfo())
  }

  // Handle Logout
  const handleLogout = () => {
    logout()
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

  const handleSaveJob = () => {
    if (!editingJob) return

    const jobData = {
      title: editingJob.title,
      titleEn: editingJob.titleEn,
      type: editingJob.type,
      typeEn: editingJob.typeEn,
      description: editingJob.description,
      descriptionEn: editingJob.descriptionEn,
    }

    if (editingJob.id) {
      updateJobPosition(editingJob.id, jobData)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث الوظيفة بنجاح" : "Job updated successfully",
      })
    } else {
      saveJobPosition(jobData)
      toast({
        title: language === "ar" ? "تم الإضافة" : "Added",
        description: language === "ar" ? "تم إضافة الوظيفة بنجاح" : "Job added successfully",
      })
    }
    loadData()
    setIsJobDialogOpen(false)
    setEditingJob(null)
  }

  const handleDeleteJob = (id: string) => {
    deleteJobPosition(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الوظيفة بنجاح" : "Job deleted successfully",
    })
  }

  const handleSaveTestimonial = () => {
    if (!editingTestimonial) return

    const testimonialData = {
      name: editingTestimonial.name,
      image: editingTestimonial.image,
      rating: editingTestimonial.rating,
      comment: editingTestimonial.comment,
    }

    saveTestimonial(testimonialData)
    loadData()
    setIsTestimonialDialogOpen(false)
    setEditingTestimonial(null)
    toast({
      title: language === "ar" ? "تم الإضافة" : "Added",
      description: language === "ar" ? "تم إضافة الرأي بنجاح" : "Testimonial added successfully",
    })
  }

  const handleDeleteTestimonial = (id: string) => {
    deleteTestimonial(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الرأي بنجاح" : "Testimonial deleted successfully",
    })
  }

  const handleSaveEmployee = (data: Omit<Employee, "id" | "createdAt"> & { password?: string }) => {
    if (editingEmployee) {
      const updatedEmployee: Employee = {
        ...editingEmployee,
        ...data,
        password: data.password || editingEmployee.password, // الاحتفاظ بكلمة السر القديمة إذا لم يتم تغييرها
      }
      updateEmployee(updatedEmployee)
      logActivity({
        employeeId: "admin", // Or the actual admin user ID
        employeeName: "المدير", // Or the actual admin username
        action: "update",
        target: "employee",
        details: `تم تحديث بيانات الموظف: ${data.fullName}`,
      })
    } else {
      const newEmployee: Employee = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        password: data.password || "123456", // كلمة سر افتراضية إذا لم يتم إدخالها
      }
      saveEmployee(newEmployee)

      setNewEmployeeCredentials({
        email: newEmployee.email,
        password: data.password || "123456",
      })

      logActivity({
        employeeId: "admin", // Or the actual admin user ID
        employeeName: "المدير", // Or the actual admin username
        action: "create",
        target: "employee",
        details: `تم إضافة موظف جديد: ${data.fullName}`,
      })
    }
    setIsEmployeeDialogOpen(false)
    setEditingEmployee(null)
  }

  const handleDeleteEmployee = (id: string) => {
    if (
      confirm(language === "ar" ? "هل أنت متأكد من حذف هذا الموظف؟" : "Are you sure you want to delete this employee?")
    ) {
      deleteEmployee(id)
      setEmployees(getEmployees())
      setStaff(getEmployees()) // Update staff state
      toast({
        title: language === "ar" ? "تم الحذف" : "Deleted",
        description: language === "ar" ? "تم حذف الموظف بنجاح" : "Employee deleted successfully",
      })
      logActivity({
        employeeId: "admin", // Or the actual admin user ID
        employeeName: "المدير", // Or the actual admin username
        action: "delete",
        target: "employee",
        details: `تم حذف الموظف بالمعرف: ${id}`,
      })
    }
  }

  const handleMarkNotificationAsRead = (id: string) => {
    markNotificationAsRead(id)
    setNotifications(getNotifications())
    setUnreadCount(getUnreadNotifications().length)
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications(getNotifications())
    setUnreadCount(0)
    toast({
      title: language === "ar" ? "تم التحديث" : "Updated",
      description: language === "ar" ? "تم تحديد جميع الإشعارات كمقروءة" : "All notifications marked as read",
    })
  }

  const navigationItems = [
    {
      id: "overview",
      label: language === "ar" ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "homepage",
      label: language === "ar" ? "الصفحة الرئيسية" : "Homepage",
      icon: Home,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "about",
      label: language === "ar" ? "حول المدرسة" : "About School",
      icon: Info,
      color: "from-green-500 to-green-600",
    },
    {
      id: "gallery",
      label: language === "ar" ? "المعرض" : "Gallery",
      icon: ImageIcon,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "departments",
      label: language === "ar" ? "الأقسام" : "Departments",
      icon: Building2,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "jobs",
      label: language === "ar" ? "الوظائف" : "Jobs",
      icon: Briefcase,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "testimonials",
      label: language === "ar" ? "آراء الزوار" : "Testimonials",
      icon: MessageCircle,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "contact",
      label: language === "ar" ? "معلومات الاتصال" : "Contact Info",
      icon: Contact,
      color: "from-red-500 to-red-600",
    },
    {
      id: "applications",
      label: language === "ar" ? "طلبات التوظيف" : "Applications",
      icon: FileText,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "messages",
      label: language === "ar" ? "الرسائل" : "Messages",
      icon: MessageSquare,
      color: "from-teal-500 to-teal-600",
    },
    {
      id: "pending",
      label: language === "ar" ? "آراء معلقة" : "Pending Reviews",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      badge: pendingReviews.length,
    },
    // إضافة قسم الموظفين
    {
      id: "employees",
      label: language === "ar" ? "الموظفون" : "Employees",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      badge: employees.filter((emp) => emp.isActive).length,
    },
    // إضافة قسم سجل النشاطات
    {
      id: "activities",
      label: language === "ar" ? "سجل النشاطات" : "Activity Log",
      icon: ActivityIcon,
      color: "from-teal-500 to-teal-600",
    },
  ]

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
    <LayoutWrapper>
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 bg-gradient-to-b from-card to-card/95 border-l border-border shadow-2xl transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative rounded-xl overflow-hidden shadow-lg">
                  <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{t.title}</h2>
                  <p className="text-xs text-muted-foreground">{username}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  // Only update activeTab if it's a relevant tab
                  if (
                    item.id === "applications" ||
                    item.id === "service-requests" ||
                    item.id === "messages" ||
                    item.id === "overview"
                  ) {
                    setActiveTab(item.id)
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  activeSection === item.id
                    ? "bg-gradient-to-r " + item.color + " text-white shadow-lg scale-105"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="mr-auto bg-white text-primary">{item.badge}</Badge>
                )}
                {activeSection === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full justify-start gap-3 hover:bg-muted"
            >
              <Eye className="w-4 h-4" />
              {language === "ar" ? "معاينة الموقع" : "Preview Site"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </Button>
          </div>
        </div>
      </aside>

      <main className={cn("flex-1 transition-all duration-300", sidebarOpen ? "mr-72" : "mr-0")}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  {navigationItems.find((item) => item.id === activeSection)?.label || t.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة محتوى الموقع بسهولة" : "Manage website content easily"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "applications" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("applications")
                  setActiveSection("applications") // Ensure section also updates
                }}
                className="flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                {language === "ar" ? "طلبات التوظيف" : "Job Applications"}
                {employmentApplications.filter((app) => app.status === "pending").length > 0 && (
                  <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                    {employmentApplications.filter((app) => app.status === "pending").length}
                  </span>
                )}
              </Button>

              <Button
                variant={activeTab === "service-requests" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("service-requests")
                  setActiveSection("service-requests") // Changed to 'service-requests'
                }}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                {language === "ar" ? "طلبات الخدمة" : "Service Requests"}
                {serviceRequests.filter((req) => req.status === "pending").length > 0 && (
                  <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                    {serviceRequests.filter((req) => req.status === "pending").length}
                  </span>
                )}
              </Button>

              <Button
                variant={activeSection === "employees" ? "default" : "ghost"} // Changed to 'employees'
                onClick={() => {
                  setActiveSection("employees")
                  setActiveTab("employees") // Also set activeTab for consistency
                }}
                className="flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                {language === "ar" ? "الموظفون" : "Staff"}
                {staff.length > 0 && (
                  <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-bold">
                    {staff.length}
                  </span>
                )}
              </Button>

              {/* زر الإشعارات */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsNotificationsPanelOpen(!isNotificationsPanelOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {isNotificationsPanelOpen && (
            <div className="absolute left-6 top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">{language === "ar" ? "الإشعارات" : "Notifications"}</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
                    {language === "ar" ? "تحديد الكل كمقروء" : "Mark all as read"}
                  </Button>
                )}
              </div>

              <div className="divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {language === "ar" ? "لا توجد إشعارات" : "No notifications"}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                        !notification.isRead && "bg-primary/5",
                      )}
                      onClick={() => handleMarkNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-2", !notification.isRead && "bg-primary")} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.createdAt).toLocaleString("ar-EG")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </header>

        {/* Content Sections */}
        <div className="p-6">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden relative group cursor-pointer"
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity",
                        stat.color,
                      )}
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div
                        className={cn(
                          "w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                          stat.color,
                        )}
                      >
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {language === "ar" ? "مرحباً بك في لوحة التحكم" : "Welcome to Dashboard"}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === "ar"
                        ? "يمكنك إدارة جميع محتويات الموقع من هنا بسهولة"
                        : "Manage all website content easily from here"}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: language === "ar" ? "تحرير سريع" : "Quick Edit",
                      desc: language === "ar" ? "عدّل المحتوى مباشرة" : "Edit content directly",
                      icon: Edit,
                    },
                    {
                      title: language === "ar" ? "معاينة فورية" : "Live Preview",
                      desc: language === "ar" ? "شاهد التغييرات فوراً" : "See changes instantly",
                      icon: Eye,
                    },
                    {
                      title: language === "ar" ? "حفظ تلقائي" : "Auto Save",
                      desc: language === "ar" ? "لا تقلق من فقدان البيانات" : "Don't worry about data loss",
                      icon: Save,
                    },
                  ].map((feature, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <feature.icon className="w-10 h-10 text-primary mb-3" />
                      <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Homepage Section */}
          {activeSection === "homepage" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-2 border-purple-500/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <ImageIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "الشرائح الرئيسية" : "Hero Slides"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar"
                          ? `إدارة ${heroSlides.length} شريحة في الصفحة الرئيسية`
                          : `Manage ${heroSlides.length} slides on homepage`}
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
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    {language === "ar" ? "إضافة شريحة جديدة" : "Add New Slide"}
                  </Button>
                </div>

                {heroSlides.length === 0 ? (
                  <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed border-border">
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {language === "ar" ? "لا توجد شرائح" : "No Slides"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === "ar" ? "ابدأ بإضافة الشريحة الأولى" : "Start by adding your first slide"}
                    </p>
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
                          order: 1,
                        })
                        setIsHeroDialogOpen(true)
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-purple-600"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      {language === "ar" ? "إضافة شريحة" : "Add Slide"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heroSlides.map((slide, index) => (
                      <Card
                        key={slide.id}
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500/50"
                      >
                        <div className="relative w-full h-56 overflow-hidden bg-muted">
                          <Image
                            src={slide.image || "/placeholder.svg?height=224&width=400"}
                            alt={slide.titleAr}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-xl mb-2 line-clamp-1">
                            {language === "ar" ? slide.titleAr : slide.titleEn}
                          </h3>
                          <p className="text-sm text-primary font-semibold mb-2 line-clamp-1">
                            {language === "ar" ? slide.subtitleAr : slide.subtitleEn}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
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
                              className="flex-1 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors"
                            >
                              <Edit className="w-4 h-4 ml-1" />
                              {language === "ar" ? "تعديل" : "Edit"}
                            </Button>
                            <Button
                              onClick={() => handleDeleteHeroSlide(slide.id)}
                              variant="destructive"
                              size="sm"
                              className="hover:scale-105 transition-transform"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* About Section */}
          {activeSection === "about" && aboutContent && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-2 border-green-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Info className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {language === "ar" ? "قسم حول المدرسة" : "About School Section"}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === "ar"
                        ? "تعديل معلومات المدرسة والرؤية والرسالة"
                        : "Edit school information and vision"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-500" />
                        {language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}
                      </Label>
                      <Input
                        value={aboutContent.titleAr}
                        onChange={(e) => setAboutContent({ ...aboutContent, titleAr: e.target.value })}
                        className="text-lg font-bold h-12"
                        placeholder="المدرسة النموذجية"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-500" />
                        {language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                      </Label>
                      <Input
                        value={aboutContent.titleEn}
                        onChange={(e) => setAboutContent({ ...aboutContent, titleEn: e.target.value })}
                        className="text-lg font-bold h-12"
                        placeholder="Al Namothajia School"
                      />
                    </Card>
                  </div>

                  <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                    <Label className="text-sm font-semibold mb-3 block">
                      {language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                    </Label>
                    <Textarea
                      value={aboutContent.descriptionAr}
                      onChange={(e) => setAboutContent({ ...aboutContent, descriptionAr: e.target.value })}
                      rows={6}
                      className="resize-none"
                      placeholder="اكتب وصفاً شاملاً عن المدرسة..."
                    />
                  </Card>

                  <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                    <Label className="text-sm font-semibold mb-3 block">
                      {language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
                    </Label>
                    <Textarea
                      value={aboutContent.descriptionEn}
                      onChange={(e) => setAboutContent({ ...aboutContent, descriptionEn: e.target.value })}
                      rows={6}
                      className="resize-none"
                      placeholder="Write a comprehensive description about the school..."
                    />
                  </Card>

                  <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                    <Label className="text-sm font-semibold mb-4 block flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-green-500" />
                      {language === "ar" ? "صورة القسم" : "Section Image"}
                    </Label>
                    <div className="space-y-4">
                      {aboutContent.image && (
                        <div className="relative w-full h-80 rounded-2xl overflow-hidden border-2 border-border shadow-lg">
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
                        className="h-12"
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
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5 ml-2" />
                    {language === "ar" ? "حفظ جميع التغييرات" : "Save All Changes"}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Gallery Section */}
          {activeSection === "gallery" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-pink-500/5 to-rose-500/5 border-2 border-pink-500/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <ImageIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "معرض الصور" : "Image Gallery"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar"
                          ? `إدارة ${galleryImages.length} صورة في المعرض`
                          : `Manage ${galleryImages.length} images in gallery`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {/* Removed the button that loads default data */}
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
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      {language === "ar" ? "إضافة صورة جديدة" : "Add New Image"}
                    </Button>
                  </div>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed border-border">
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {language === "ar" ? "لا توجد صور" : "No Images"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === "ar" ? "ابدأ بإضافة الصورة الأولى" : "Start by adding your first image"}
                    </p>
                    <Button
                      onClick={() => {
                        setEditingGalleryImage({
                          id: "",
                          titleAr: "",
                          titleEn: "",
                          descriptionAr: "",
                          descriptionEn: "",
                          image: "",
                          order: 1,
                        })
                        setIsGalleryDialogOpen(true)
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-pink-600"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      {language === "ar" ? "إضافة صورة" : "Add Image"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {galleryImages.map((image) => (
                      <Card
                        key={image.id}
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-500/50"
                      >
                        <div className="relative w-full h-48 overflow-hidden bg-muted">
                          <Image
                            src={image.image || "/placeholder.svg?height=192&width=192"}
                            alt={image.titleAr}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm mb-3 line-clamp-1">
                            {language === "ar" ? image.titleAr : image.titleEn}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingGalleryImage(image)
                                setIsGalleryDialogOpen(true)
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1 h-9 text-xs hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors"
                            >
                              <Edit className="w-3 h-3 ml-1" />
                              {language === "ar" ? "تعديل" : "Edit"}
                            </Button>
                            <Button
                              onClick={() => handleDeleteGalleryImage(image.id)}
                              variant="destructive"
                              size="sm"
                              className="h-9 hover:scale-105 transition-transform"
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
            </div>
          )}

          {/* Departments Section */}
          {activeSection === "departments" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-2 border-orange-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {language === "ar" ? "أقسام المدرسة" : "School Departments"}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === "ar" ? "تعديل معلومات الأقسام المختلفة" : "Edit different departments information"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentContents.map((dept) => (
                    <Card
                      key={dept.id}
                      className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-500/50"
                    >
                      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
                        <Image
                          src={dept.image || "/placeholder.svg"}
                          alt={dept.titleAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Badge className="mb-3 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">
                        {dept.type === "medical"
                          ? language === "ar"
                            ? "طبي"
                            : "Medical"
                          : dept.type === "science"
                            ? language === "ar"
                              ? "علمي"
                              : "Science"
                            : language === "ar"
                              ? "تجريبي"
                              : "Experimental"}
                      </Badge>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            {language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}
                          </Label>
                          <Input
                            value={dept.titleAr}
                            onChange={(e) => {
                              const updated = departmentContents.map((d) =>
                                d.id === dept.id ? { ...d, titleAr: e.target.value } : d,
                              )
                              setDepartmentContents(updated)
                            }}
                            className="font-semibold"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            {language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                          </Label>
                          <Input
                            value={dept.titleEn}
                            onChange={(e) => {
                              const updated = departmentContents.map((d) =>
                                d.id === dept.id ? { ...d, titleEn: e.target.value } : d,
                              )
                              setDepartmentContents(updated)
                            }}
                            className="font-semibold"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            {language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                          </Label>
                          <Textarea
                            value={dept.descriptionAr}
                            onChange={(e) => {
                              const updated = departmentContents.map((d) =>
                                d.id === dept.id ? { ...d, descriptionAr: e.target.value } : d,
                              )
                              setDepartmentContents(updated)
                            }}
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            {language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
                          </Label>
                          <Textarea
                            value={dept.descriptionEn}
                            onChange={(e) => {
                              const updated = departmentContents.map((d) =>
                                d.id === dept.id ? { ...d, descriptionEn: e.target.value } : d,
                              )
                              setDepartmentContents(updated)
                            }}
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            {language === "ar" ? "رابط الصورة" : "Image URL"}
                          </Label>
                          <Input
                            value={dept.image}
                            onChange={(e) => {
                              const updated = departmentContents.map((d) =>
                                d.id === dept.id ? { ...d, image: e.target.value } : d,
                              )
                              setDepartmentContents(updated)
                            }}
                            placeholder="https://..."
                          />
                        </div>
                        <Button
                          onClick={() => {
                            updateDepartmentContent(dept.id, dept)
                            toast({
                              title: language === "ar" ? "تم الحفظ" : "Saved",
                              description: language === "ar" ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully",
                            })
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        >
                          <Save className="w-4 h-4 ml-2" />
                          {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Jobs Section */}
          {activeSection === "jobs" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-2 border-cyan-500/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "الوظائف المتاحة" : "Available Jobs"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar"
                          ? `إدارة ${jobs.length} وظيفة متاحة`
                          : `Manage ${jobs.length} available jobs`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingJob({
                        id: "",
                        title: "",
                        titleEn: "",
                        type: "",
                        typeEn: "",
                        description: "",
                        descriptionEn: "",
                        createdAt: new Date().toISOString(),
                      })
                      setIsJobDialogOpen(true)
                    }}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    {language === "ar" ? "إضافة وظيفة جديدة" : "Add New Job"}
                  </Button>
                </div>

                {jobs.length === 0 ? (
                  <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed border-border">
                    <Briefcase className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {language === "ar" ? "لا توجد وظائف" : "No Jobs"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === "ar" ? "ابدأ بإضافة الوظيفة الأولى" : "Start by adding your first job"}
                    </p>
                    <Button
                      onClick={() => {
                        setEditingJob({
                          id: "",
                          title: "",
                          titleEn: "",
                          type: "",
                          typeEn: "",
                          description: "",
                          descriptionEn: "",
                          createdAt: new Date().toISOString(),
                        })
                        setIsJobDialogOpen(true)
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      {language === "ar" ? "إضافة وظيفة" : "Add Job"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <Card
                        key={job.id}
                        className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-cyan-500/50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-2 line-clamp-2">
                              {language === "ar" ? job.title : job.titleEn}
                            </h3>
                            <Badge className="bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20">
                              {language === "ar" ? job.type : job.typeEn}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {language === "ar" ? job.description : job.descriptionEn}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(job.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setEditingJob(job)
                              setIsJobDialogOpen(true)
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-colors"
                          >
                            <Edit className="w-4 h-4 ml-1" />
                            {language === "ar" ? "تعديل" : "Edit"}
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
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Testimonials Section */}
          {activeSection === "testimonials" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border-2 border-yellow-500/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "آراء الزوار" : "Testimonials"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar"
                          ? `إدارة ${testimonials.length} رأي من الزوار`
                          : `Manage ${testimonials.length} testimonials`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingTestimonial({
                        id: "",
                        name: "",
                        image: "",
                        rating: 5,
                        comment: "",
                        createdAt: new Date().toISOString(),
                      })
                      setIsTestimonialDialogOpen(true)
                    }}
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    {language === "ar" ? "إضافة رأي جديد" : "Add New Testimonial"}
                  </Button>
                </div>

                {testimonials.length === 0 ? (
                  <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed border-border">
                    <MessageCircle className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {language === "ar" ? "لا توجد آراء" : "No Testimonials"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === "ar" ? "ابدأ بإضافة الرأي الأول" : "Start by adding your first testimonial"}
                    </p>
                    <Button
                      onClick={() => {
                        setEditingTestimonial({
                          id: "",
                          name: "",
                          image: "",
                          rating: 5,
                          comment: "",
                          createdAt: new Date().toISOString(),
                        })
                        setIsTestimonialDialogOpen(true)
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      {language === "ar" ? "إضافة رأي" : "Add Testimonial"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                      <Card
                        key={testimonial.id}
                        className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-yellow-500/50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={testimonial.image || "/diverse-user-avatars.png"}
                              alt={testimonial.name}
                              className="w-14 h-14 rounded-full object-cover shadow-lg"
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

                        <p className="text-muted-foreground leading-relaxed mb-4">"{testimonial.comment}"</p>

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
            </div>
          )}

          {/* Contact Section */}
          {activeSection === "contact" && contactInfo && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-red-500/5 to-rose-500/5 border-2 border-red-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Contact className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {language === "ar" ? "معلومات الاتصال" : "Contact Information"}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === "ar" ? "تعديل بيانات التواصل مع المدرسة" : "Edit school contact details"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                      </Label>
                      <Input
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        placeholder="+963 11 1234567"
                        className="font-mono h-12"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "واتساب" : "WhatsApp"}
                      </Label>
                      <Input
                        value={contactInfo.whatsapp}
                        onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                        placeholder="+963 999 123456"
                        className="font-mono h-12"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Mail className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "البريد الإلكتروني" : "Email"}
                      </Label>
                      <Input
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        placeholder="info@school.com"
                        type="email"
                        className="h-12"
                      />
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block">
                        {language === "ar" ? "العنوان (عربي)" : "Address (Arabic)"}
                      </Label>
                      <Textarea
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                        rows={3}
                        placeholder="دمشق، سوريا"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block">
                        {language === "ar" ? "العنوان (إنجليزي)" : "Address (English)"}
                      </Label>
                      <Textarea
                        value={contactInfo.addressEn}
                        onChange={(e) => setContactInfo({ ...contactInfo, addressEn: e.target.value })}
                        rows={3}
                        placeholder="Damascus, Syria"
                      />
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "أوقات العمل (عربي)" : "Working Hours (Arabic)"}
                      </Label>
                      <Input
                        value={contactInfo.workingHours}
                        onChange={(e) => setContactInfo({ ...contactInfo, workingHours: e.target.value })}
                        placeholder="الأحد - الخميس: 8 صباحاً - 3 مساءً"
                        className="h-12"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "أوقات العمل (إنجليزي)" : "Working Hours (English)"}
                      </Label>
                      <Input
                        value={contactInfo.workingHoursEn}
                        onChange={(e) => setContactInfo({ ...contactInfo, workingHoursEn: e.target.value })}
                        placeholder="Sun - Thu: 8 AM - 3 PM"
                        className="h-12"
                      />
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "أيام العطل (عربي)" : "Holidays (Arabic)"}
                      </Label>
                      <Input
                        value={contactInfo.holidays}
                        onChange={(e) => setContactInfo({ ...contactInfo, holidays: e.target.value })}
                        placeholder="الجمعة والسبت"
                        className="h-12"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "أيام العطل (إنجليزي)" : "Holidays (English)"}
                      </Label>
                      <Input
                        value={contactInfo.holidaysEn}
                        onChange={(e) => setContactInfo({ ...contactInfo, holidaysEn: e.target.value })}
                        placeholder="Friday and Saturday"
                        className="h-12"
                      />
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <User className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "المسؤول (عربي)" : "Contact Person (Arabic)"}
                      </Label>
                      <Input
                        value={contactInfo.responsiblePerson}
                        onChange={(e) => setContactInfo({ ...contactInfo, responsiblePerson: e.target.value })}
                        placeholder="أحمد محمد"
                        className="h-12 mb-3"
                      />
                      <Input
                        value={contactInfo.responsibleTitle}
                        onChange={(e) => setContactInfo({ ...contactInfo, responsibleTitle: e.target.value })}
                        placeholder="مدير المدرسة"
                        className="h-12"
                      />
                    </Card>
                    <Card className="p-6 bg-background hover:shadow-lg transition-shadow">
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <User className="w-4 h-4 text-red-500" />
                        {language === "ar" ? "المسؤول (إنجليزي)" : "Contact Person (English)"}
                      </Label>
                      <Input
                        value={contactInfo.responsiblePersonEn}
                        onChange={(e) => setContactInfo({ ...contactInfo, responsiblePersonEn: e.target.value })}
                        placeholder="Ahmad Mohammad"
                        className="h-12 mb-3"
                      />
                      <Input
                        value={contactInfo.responsibleTitleEn}
                        onChange={(e) => setContactInfo({ ...contactInfo, responsibleTitleEn: e.target.value })}
                        placeholder="School Director"
                        className="h-12"
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
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5 ml-2" />
                    {language === "ar" ? "حفظ جميع التغييرات" : "Save All Changes"}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "طلبات التوظيف" : "Employment Applications"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar" ? `${applications.length} طلب توظيف` : `${applications.length} applications`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => exportToExcel(applications, "employment-applications")}
                    disabled={applications.length === 0}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Download className="w-5 h-5 ml-2" />
                    {language === "ar" ? "تصدير Excel" : "Export Excel"}
                  </Button>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 rounded-2xl">
                    <FileText className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد طلبات توظيف" : "No applications yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <Card key={app.id} className="p-6 hover:shadow-xl transition-shadow border-2">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{app.fullName}</h3>
                              <Badge className="mt-1 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20">
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
                            <Phone className="w-4 h-4 text-indigo-500" />
                            <span>{app.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4 text-indigo-500" />
                            <span className="truncate">{app.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            <span>
                              {language === "ar" ? "الرقم الوطني" : "National ID"}: {app.nationalId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4 text-indigo-500" />
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
                        </div>

                        <div className="bg-muted/50 rounded-xl p-4 mb-3">
                          <p className="text-sm font-semibold text-foreground mb-2">
                            {language === "ar" ? "نبذة عن المتقدم:" : "About:"}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">{app.coverLetter}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(app.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === "messages" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "رسائل التواصل" : "Contact Messages"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar" ? `${messages.length} رسالة` : `${messages.length} messages`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => exportToExcel(messages, "contact-messages")}
                    disabled={messages.length === 0}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Download className="w-5 h-5 ml-2" />
                    {language === "ar" ? "تصدير Excel" : "Export Excel"}
                  </Button>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 rounded-2xl">
                    <MessageSquare className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد رسائل" : "No messages yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <Card key={msg.id} className="p-6 hover:shadow-xl transition-shadow border-2">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="w-7 h-7 text-white" />
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
                              className="hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-colors"
                            >
                              <ArrowRight className="w-4 h-4 ml-1" />
                              {language === "ar" ? "تحويل لرأي" : "Convert"}
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
                            <Phone className="w-4 h-4 text-teal-500" />
                            <span>{msg.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4 text-teal-500" />
                            <span className="truncate">{msg.email}</span>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-xl p-4 mb-3">
                          <p className="text-sm font-semibold text-foreground mb-2">
                            {language === "ar" ? "الرسالة:" : "Message:"}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">{msg.message}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(msg.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Pending Reviews Section */}
          {activeSection === "pending" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {language === "ar" ? "الآراء المعلقة" : "Pending Reviews"}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === "ar"
                        ? `${pendingReviews.length} رأي بانتظار الموافقة`
                        : `${pendingReviews.length} reviews pending approval`}
                    </p>
                  </div>
                </div>

                {pendingReviews.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 rounded-2xl">
                    <Clock className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد آراء معلقة" : "No pending reviews"}
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingReviews.map((review) => (
                      <Card
                        key={review.id}
                        className="p-6 hover:shadow-2xl transition-shadow border-2 border-amber-500/20"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={review.image || "/diverse-user-avatars.png"}
                              alt={review.name}
                              className="w-14 h-14 rounded-full object-cover shadow-lg"
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

                        <div className="flex gap-2 mb-3">
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

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            </div>
          )}

          {/* Applications Section (Enhanced) */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "طلبات التوظيف" : "Job Applications"}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => exportToExcel(employmentApplications, "enhanced-employment-applications")}
                    disabled={employmentApplications.length === 0}
                  >
                    <Download className="w-4 h-4" />
                    {language === "ar" ? "تصدير" : "Export"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {employmentApplications.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد طلبات توظيف" : "No job applications yet"}
                    </p>
                  </Card>
                ) : (
                  employmentApplications.map((app) => (
                    <Card key={app.id} className="p-6">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1 space-y-4 w-full md:w-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{app.fullName}</h3>
                              <p className="text-muted-foreground">{app.position}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">{language === "ar" ? "الهاتف" : "Phone"}</p>
                              <p className="font-medium">{app.phone}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {language === "ar" ? "الراتب المتوقع" : "Expected Salary"}
                              </p>
                              <p className="font-medium">{app.expectedSalary}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {language === "ar" ? "المؤهلات" : "Education"}
                              </p>
                              <p className="font-medium">
                                {app.education.length} {language === "ar" ? "مؤهل" : "degrees"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {language === "ar" ? "الخبرات" : "Experience"}
                              </p>
                              <p className="font-medium">
                                {app.experience.length} {language === "ar" ? "خبرة" : "positions"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                app.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.status === "reviewed"
                                    ? "bg-blue-100 text-blue-800"
                                    : app.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {app.status === "pending" && (language === "ar" ? "قيد المراجعة" : "Pending")}
                              {app.status === "reviewed" && (language === "ar" ? "تمت المراجعة" : "Reviewed")}
                              {app.status === "accepted" && (language === "ar" ? "مقبول" : "Accepted")}
                              {app.status === "rejected" && (language === "ar" ? "مرفوض" : "Rejected")}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(app.submittedAt).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-col gap-2 mt-4 md:mt-0 w-full md:w-auto">
                          {/* Added Dialog and DialogTrigger for View Details button */}
                          <Dialog
                            open={detailsDialogOpen && selectedApplication?.id === app.id}
                            onOpenChange={(open) => {
                              setDetailsDialogOpen(open)
                              if (!open) setSelectedApplication(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(app)
                                  setDetailsDialogOpen(true)
                                }}
                                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {language === "ar" ? "عرض التفاصيل" : "View Details"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                  {app.fullName}
                                </DialogTitle>
                                <DialogDescription className="text-lg">{app.position}</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6 mt-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                  <h3 className="text-xl font-bold flex items-center gap-2 border-b-2 border-primary/20 pb-2">
                                    <User className="w-5 h-5 text-primary" />
                                    {language === "ar" ? "المعلومات الشخصية" : "Personal Information"}
                                  </h3>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        {language === "ar" ? "الاسم الكامل" : "Full Name"}
                                      </p>
                                      <p className="font-semibold">{app.fullName}</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        {language === "ar" ? "رقم الهاتف" : "Phone"}
                                      </p>
                                      <p className="font-semibold">{app.phone}</p>
                                    </div>
                                    {app.birthPlace && (
                                      <div className="p-4 bg-muted/30 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          {language === "ar" ? "مكان الولادة" : "Birth Place"}
                                        </p>
                                        <p className="font-semibold">{app.birthPlace}</p>
                                      </div>
                                    )}
                                    {app.birthDate && (
                                      <div className="p-4 bg-muted/30 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          {language === "ar" ? "تاريخ الولادة" : "Birth Date"}
                                        </p>
                                        <p className="font-semibold">
                                          {new Date(app.birthDate).toLocaleDateString("ar-EG")}
                                        </p>
                                      </div>
                                    )}
                                    {app.nationalId && (
                                      <div className="p-4 bg-muted/30 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          {language === "ar" ? "رقم الهوية" : "National ID"}
                                        </p>
                                        <p className="font-semibold">{app.nationalId}</p>
                                      </div>
                                    )}
                                    {app.maritalStatus && (
                                      <div className="p-4 bg-muted/30 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          {language === "ar" ? "الحالة الاجتماعية" : "Marital Status"}
                                        </p>
                                        <p className="font-semibold">
                                          {app.maritalStatus === "single" &&
                                            (language === "ar" ? "أعزب/عزباء" : "Single")}
                                          {app.maritalStatus === "married" &&
                                            (language === "ar" ? "متزوج/متزوجة" : "Married")}
                                          {app.maritalStatus === "divorced" &&
                                            (language === "ar" ? "مطلق/مطلقة" : "Divorced")}
                                          {app.maritalStatus === "widowed" &&
                                            (language === "ar" ? "أرمل/أرملة" : "Widowed")}
                                        </p>
                                      </div>
                                    )}
                                    {app.address && (
                                      <div className="p-4 bg-muted/30 rounded-lg md:col-span-2">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          {language === "ar" ? "العنوان" : "Address"}
                                        </p>
                                        <p className="font-semibold">{app.address}</p>
                                      </div>
                                    )}
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        {language === "ar" ? "الوظيفة المطلوبة" : "Position"}
                                      </p>
                                      <p className="font-semibold">{app.position}</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        {language === "ar" ? "الراتب المتوقع" : "Expected Salary"}
                                      </p>
                                      <p className="font-semibold">{app.expectedSalary}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Education */}
                                {app.education && app.education.length > 0 && (
                                  <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2 border-b-2 border-primary/20 pb-2">
                                      <GraduationCap className="w-5 h-5 text-primary" />
                                      {language === "ar" ? "المؤهلات العلمية" : "Education"}
                                    </h3>
                                    <div className="space-y-4">
                                      {app.education.map((edu: any, index: number) => (
                                        <Card key={index} className="p-4 border-2 border-primary/10">
                                          <div className="grid md:grid-cols-2 gap-3">
                                            <div>
                                              <p className="text-sm text-muted-foreground">
                                                {language === "ar" ? "الدرجة العلمية" : "Degree"}
                                              </p>
                                              <p className="font-semibold">{edu.degree}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-muted-foreground">
                                                {language === "ar" ? "التخصص" : "Major"}
                                              </p>
                                              <p className="font-semibold">{edu.major}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-muted-foreground">
                                                {language === "ar" ? "الجامعة" : "University"}
                                              </p>
                                              <p className="font-semibold">{edu.university}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-muted-foreground">
                                                {language === "ar" ? "سنة التخرج" : "Graduation Year"}
                                              </p>
                                              <p className="font-semibold">{edu.graduationYear}</p>
                                            </div>
                                            {edu.gpa && (
                                              <div>
                                                <p className="text-sm text-muted-foreground">
                                                  {language === "ar" ? "المعدل" : "GPA"}
                                                </p>
                                                <p className="font-semibold">{edu.gpa}</p>
                                              </div>
                                            )}
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Experience */}
                                {app.experience && app.experience.length > 0 && (
                                  <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2 border-b-2 border-primary/20 pb-2">
                                      <Building className="w-5 h-5 text-primary" />
                                      {language === "ar" ? "الخبرات العملية" : "Work Experience"}
                                    </h3>
                                    <div className="space-y-4">
                                      {app.experience.map((exp: any, index: number) => (
                                        <Card key={index} className="p-4 border-2 border-primary/10">
                                          <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                              <div>
                                                <h4 className="font-bold text-lg">{exp.position}</h4>
                                                <p className="text-muted-foreground">{exp.company}</p>
                                              </div>
                                              {exp.currentlyWorking && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                                  {language === "ar" ? "حالياً" : "Current"}
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <Calendar className="w-4 h-4" />
                                              <span>
                                                {exp.startDate && new Date(exp.startDate).toLocaleDateString("ar-EG")}
                                                {" - "}
                                                {exp.currentlyWorking
                                                  ? language === "ar"
                                                    ? "حتى الآن"
                                                    : "Present"
                                                  : exp.endDate && new Date(exp.endDate).toLocaleDateString("ar-EG")}
                                              </span>
                                            </div>
                                            {exp.description && (
                                              <div className="p-3 bg-muted/30 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">
                                                  {language === "ar" ? "الوصف" : "Description"}
                                                </p>
                                                <p className="text-sm leading-relaxed">{exp.description}</p>
                                              </div>
                                            )}
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* CV File */}
                                {app.cvFileName && (
                                  <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-6 h-6 text-primary" />
                                      <div>
                                        <p className="text-sm text-muted-foreground">
                                          {language === "ar" ? "السيرة الذاتية" : "CV File"}
                                        </p>
                                        <p className="font-semibold">{app.cvFileName}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Submission Date */}
                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {language === "ar" ? "تاريخ التقديم" : "Submission Date"}
                                  </p>
                                  <p className="font-semibold">{new Date(app.submittedAt).toLocaleString("ar-EG")}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Select
                            value={app.status}
                            onValueChange={(value) => {
                              updateEmploymentApplicationStatus(app.id, value as any)
                              // Optionally update local state immediately for responsiveness
                              setEmploymentApplications((prevApps) =>
                                prevApps.map((a) => (a.id === app.id ? { ...a, status: value as any } : a)),
                              )
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{language === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
                              <SelectItem value="reviewed">
                                {language === "ar" ? "تمت المراجعة" : "Reviewed"}
                              </SelectItem>
                              <SelectItem value="accepted">{language === "ar" ? "مقبول" : "Accepted"}</SelectItem>
                              <SelectItem value="rejected">{language === "ar" ? "مرفوض" : "Rejected"}</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(`https://wa.me/${app.phone}`, "_blank")
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {language === "ar" ? "واتساب" : "WhatsApp"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(language === "ar" ? "هل تريد حذف هذا الطلب؟" : "Delete this application?")) {
                                deleteEnhancedEmploymentApplication(app.id)
                                setEmploymentApplications(getEnhancedEmploymentApplications())
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab for Service Requests */}
          {activeTab === "service-requests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "طلبات الخدمة" : "Service Requests"}</h2>
              </div>

              <div className="grid gap-4">
                {serviceRequests.length === 0 ? (
                  <Card className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد طلبات خدمة" : "No service requests yet"}
                    </p>
                  </Card>
                ) : (
                  serviceRequests.map((req) => (
                    <Card key={req.id} className="p-6">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1 space-y-4 w-full md:w-auto">
                          <div>
                            <h3 className="font-bold text-xl">{req.name}</h3>
                            <p className="text-muted-foreground">{req.serviceType}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">{language === "ar" ? "الهاتف" : "Phone"}</p>
                              <p className="font-medium">{req.phone}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">{language === "ar" ? "البريد" : "Email"}</p>
                              <p className="font-medium">{req.email}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{language === "ar" ? "الرسالة" : "Message"}</p>
                            <p className="text-base">{req.message}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                req.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : req.status === "contacted"
                                    ? "bg-blue-100 text-blue-800"
                                    : req.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {req.status === "pending" && (language === "ar" ? "جديد" : "Pending")}
                              {req.status === "contacted" && (language === "ar" ? "تم التواصل" : "Contacted")}
                              {req.status === "completed" && (language === "ar" ? "مكتمل" : "Completed")}
                              {req.status === "cancelled" && (language === "ar" ? "ملغي" : "Cancelled")}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(req.submittedAt).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-col gap-2 mt-4 md:mt-0 w-full md:w-auto">
                          <Select
                            value={req.status}
                            onValueChange={(value) => {
                              updateServiceRequestStatus(req.id, value as any)
                              // Optionally update local state immediately for responsiveness
                              setServiceRequests((prevReqs) =>
                                prevReqs.map((r) => (r.id === req.id ? { ...r, status: value as any } : r)),
                              )
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{language === "ar" ? "جديد" : "Pending"}</SelectItem>
                              <SelectItem value="contacted">
                                {language === "ar" ? "تم التواصل" : "Contacted"}
                              </SelectItem>
                              <SelectItem value="completed">{language === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                              <SelectItem value="cancelled">{language === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(`https://wa.me/${req.phone}`, "_blank")
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {language === "ar" ? "واتساب" : "WhatsApp"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(language === "ar" ? "هل تريد حذف هذا الطلب؟" : "Delete this request?")) {
                                deleteServiceRequest(req.id)
                                setServiceRequests(getServiceRequests())
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Employee Section */}
          {activeSection === "employees" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 md:p-8 text-white">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                      {language === "ar" ? "إدارة الموظفين" : "Employee Management"}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl">
                      {language === "ar"
                        ? "إدارة فريق العمل ومتابعة أدائهم وصلاحياتهم"
                        : "Manage your team, track performance and permissions"}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingEmployee(null)
                      setIsEmployeeDialogOpen(true)
                    }}
                    size="lg"
                    className="gap-2 bg-white text-indigo-600 hover:bg-white/90 shadow-xl whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      {language === "ar" ? "إضافة موظف جديد" : "Add New Employee"}
                    </span>
                    <span className="sm:hidden">{language === "ar" ? "إضافة" : "Add"}</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 truncate">
                        {language === "ar" ? "إجمالي الموظفين" : "Total Employees"}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
                        {employees.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400 mb-1 truncate">
                        {language === "ar" ? "الموظفون النشطون" : "Active Employees"}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100">
                        {employees.filter((e) => e.isActive).length}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-purple-600 dark:text-purple-400 mb-1 truncate">
                        {language === "ar" ? "الأقسام" : "Departments"}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-blue-100">
                        {new Set(employees.map((e) => e.department)).size}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-orange-600 dark:text-orange-400 mb-1 truncate">
                        {language === "ar" ? "النشاطات اليوم" : "Today's Activities"}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-orange-900 dark:text-orange-100">
                        {
                          activities.filter((a) => new Date(a.timestamp).toDateString() === new Date().toDateString())
                            .length
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                      <ActivityIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid gap-4">
                {employees.length === 0 ? (
                  <div className="space-y-6">
                    <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-dashed">
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
                            <Users className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles className="w-4 h-4 text-yellow-900" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {language === "ar" ? "ابدأ ببناء فريقك!" : "Start Building Your Team!"}
                          </h3>
                          <p className="text-muted-foreground text-lg">
                            {language === "ar"
                              ? "لم تقم بإضافة أي موظفين بعد. أضف أول موظف لبدء إدارة فريق العمل بكفاءة."
                              : "You haven't added any employees yet. Add your first employee to start managing your team efficiently."}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setEditingEmployee(null)
                            setIsEmployeeDialogOpen(true)
                          }}
                          size="lg"
                          className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        >
                          <Plus className="w-5 h-5" />
                          {language === "ar" ? "إضافة أول موظف" : "Add First Employee"}
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-indigo-600" />
                        {language === "ar" ? "دليل البدء السريع" : "Quick Start Guide"}
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{language === "ar" ? "إضافة موظف" : "Add Employee"}</h4>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "أدخل معلومات الموظف الأساسية" : "Enter basic employee information"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">
                              {language === "ar" ? "تحديد الصلاحيات" : "Set Permissions"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "اختر الصلاحيات المناسبة" : "Choose appropriate permissions"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-pink-600 dark:text-pink-400 font-bold">3</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">
                              {language === "ar" ? "تتبع النشاطات" : "Track Activities"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "راقب أداء الفريق" : "Monitor team performance"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  employees.map((employee) => (
                    <Card key={employee.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {employee.fullName.charAt(0)}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-bold text-xl">{employee.fullName}</h3>
                              <p className="text-muted-foreground">{employee.position}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  {language === "ar" ? "القسم:" : "Department:"}
                                </span>
                                <span className="mr-2 font-medium">{employee.department}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{language === "ar" ? "الدور:" : "Role:"}</span>
                                <span className="mr-2 font-medium">
                                  {employee.role === "admin" ? "مدير" : employee.role === "employee" ? "موظف" : "مشاهد"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  {language === "ar" ? "البريد:" : "Email:"}
                                </span>
                                <span className="mr-2 font-medium">{employee.email}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  {language === "ar" ? "الهاتف:" : "Phone:"}
                                </span>
                                <span className="mr-2 font-medium">{employee.phone}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge variant={employee.isActive ? "default" : "secondary"}>
                                {employee.isActive
                                  ? language === "ar"
                                    ? "نشط"
                                    : "Active"
                                  : language === "ar"
                                    ? "غير نشط"
                                    : "Inactive"}
                              </Badge>
                              {employee.permissions.canEdit && (
                                <Badge variant="outline">{language === "ar" ? "تعديل" : "Edit"}</Badge>
                              )}
                              {employee.permissions.canDelete && (
                                <Badge variant="outline">{language === "ar" ? "حذف" : "Delete"}</Badge>
                              )}
                              {employee.permissions.canApprove && (
                                <Badge variant="outline">{language === "ar" ? "موافقة" : "Approve"}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingEmployee(employee)
                              setIsEmployeeDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === "activities" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "سجل النشاطات" : "Activity Log"}</h2>
              </div>

              <div className="space-y-4">
                {activities.length === 0 ? (
                  <Card className="p-12 text-center">
                    <ActivityIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد نشاطات" : "No activities yet"}
                    </p>
                  </Card>
                ) : (
                  activities.map((activity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            activity.actionType === "create" && "bg-green-500/10 text-green-500",
                            activity.actionType === "update" && "bg-blue-500/10 text-blue-500",
                            activity.actionType === "delete" && "bg-red-500/10 text-red-500",
                            activity.actionType === "approve" && "bg-purple-500/10 text-purple-500",
                            activity.actionType === "reject" && "bg-orange-500/10 text-orange-500",
                            activity.actionType === "view" && "bg-gray-500/10 text-gray-500",
                          )}
                        >
                          {activity.actionType === "create" && <Plus className="w-5 h-5" />}
                          {activity.actionType === "update" && <Edit className="w-5 h-5" />}
                          {activity.actionType === "delete" && <Trash2 className="w-5 h-5" />}
                          {activity.actionType === "approve" && <Check className="w-5 h-5" />}
                          {activity.actionType === "reject" && <X className="w-5 h-5" />}
                          {activity.actionType === "view" && <Eye className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{activity.employeeName}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString("ar-EG")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{activity.action}</p>
                          {activity.details && <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      {/* Hero Slide Dialog */}
      <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHeroSlide?.id
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
              <Label>{language === "ar" ? "رابط الصورة" : "Image URL"}</Label>
              <Input
                value={editingHeroSlide?.image || ""}
                onChange={(e) =>
                  setEditingHeroSlide(
                    editingHeroSlide ? { ...editingHeroSlide, image: e.target.value } : ({} as HeroSlide),
                  )
                }
                placeholder="https://..."
              />
              {editingHeroSlide?.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                  <Image
                    src={editingHeroSlide.image || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveHeroSlide} className="flex-1" size="lg">
                <Save className="w-4 h-4 ml-2" />
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsHeroDialogOpen(false)
                  setEditingHeroSlide(null)
                }}
                className="flex-1"
                size="lg"
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
              {editingGalleryImage?.id
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
              <Label>{language === "ar" ? "التصنيف" : "Category"}</Label>
              <select
                value={editingGalleryImage?.category || ""}
                onChange={(e) =>
                  setEditingGalleryImage(
                    editingGalleryImage ? { ...editingGalleryImage, category: e.target.value } : ({} as GalleryImage),
                  )
                }
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">{language === "ar" ? "اختر التصنيف" : "Select Category"}</option>
                <option value="المرافق">{language === "ar" ? "المرافق" : "Facilities"}</option>
                <option value="الأنشطة">{language === "ar" ? "الأنشطة" : "Activities"}</option>
                <option value="الفعاليات">{language === "ar" ? "الفعاليات" : "Events"}</option>
                <option value="البرامج التعليمية">
                  {language === "ar" ? "البرامج التعليمية" : "Educational Programs"}
                </option>
                <option value="التدريب المهني">{language === "ar" ? "التدريب المهني" : "Vocational Training"}</option>
                <option value="العلاج والتأهيل">
                  {language === "ar" ? "العلاج والتأهيل" : "Therapy & Rehabilitation"}
                </option>
              </select>
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
              <Label>{language === "ar" ? "رابط الصورة" : "Image URL"}</Label>
              <Input
                value={editingGalleryImage?.image || ""}
                onChange={(e) =>
                  setEditingGalleryImage(
                    editingGalleryImage ? { ...editingGalleryImage, image: e.target.value } : ({} as GalleryImage),
                  )
                }
                placeholder="https://..."
              />
              {editingGalleryImage?.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                  <Image
                    src={editingGalleryImage.image || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveGalleryImage} className="flex-1" size="lg">
                <Save className="w-4 h-4 ml-2" />
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsGalleryDialogOpen(false)
                  setEditingGalleryImage(null)
                }}
                className="flex-1"
                size="lg"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingJob?.id
                ? language === "ar"
                  ? "تعديل الوظيفة"
                  : "Edit Job"
                : language === "ar"
                  ? "إضافة وظيفة جديدة"
                  : "Add New Job"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "المسمى الوظيفي (عربي)" : "Job Title (Arabic)"}</Label>
                <Input
                  value={editingJob?.title || ""}
                  onChange={(e) =>
                    setEditingJob(
                      editingJob
                        ? { ...editingJob, title: e.target.value }
                        : ({
                            id: "",
                            title: e.target.value,
                            titleEn: "",
                            type: "",
                            typeEn: "",
                            description: "",
                            descriptionEn: "",
                            createdAt: new Date().toISOString(),
                          } as JobPosition),
                    )
                  }
                  placeholder="معلم لغة عربية"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "المسمى الوظيفي (إنجليزي)" : "Job Title (English)"}</Label>
                <Input
                  value={editingJob?.titleEn || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, titleEn: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="Arabic Teacher"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "نوع الوظيفة (عربي)" : "Job Type (Arabic)"}</Label>
                <Input
                  value={editingJob?.type || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, type: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="دوام كامل"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "نوع الوظيفة (إنجليزي)" : "Job Type (English)"}</Label>
                <Input
                  value={editingJob?.typeEn || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, typeEn: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="Full-time"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
              <Textarea
                value={editingJob?.description || ""}
                onChange={(e) =>
                  setEditingJob(editingJob ? { ...editingJob, description: e.target.value } : ({} as JobPosition))
                }
                placeholder="تدريس اللغة العربية لجميع المراحل"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
              <Textarea
                value={editingJob?.descriptionEn || ""}
                onChange={(e) =>
                  setEditingJob(editingJob ? { ...editingJob, descriptionEn: e.target.value } : ({} as JobPosition))
                }
                placeholder="Teaching Arabic for all levels"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveJob} className="flex-1" size="lg">
                <Save className="w-4 h-4 ml-2" />
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsJobDialogOpen(false)
                  setEditingJob(null)
                }}
                className="flex-1"
                size="lg"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{language === "ar" ? "إضافة رأي جديد" : "Add New Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{language === "ar" ? "الاسم" : "Name"}</Label>
              <Input
                value={editingTestimonial?.name || ""}
                onChange={(e) =>
                  setEditingTestimonial(
                    editingTestimonial
                      ? { ...editingTestimonial, name: e.target.value }
                      : ({
                          id: "",
                          name: e.target.value,
                          image: "",
                          rating: 5,
                          comment: "",
                          createdAt: new Date().toISOString(),
                        } as Testimonial),
                  )
                }
                placeholder={language === "ar" ? "أحمد محمد" : "Ahmad Mohammad"}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "رابط الصورة" : "Image URL"}</Label>
              <Input
                value={editingTestimonial?.image || ""}
                onChange={(e) =>
                  setEditingTestimonial(
                    editingTestimonial ? { ...editingTestimonial, image: e.target.value } : ({} as Testimonial),
                  )
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "التقييم" : "Rating"}</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setEditingTestimonial(
                        editingTestimonial ? { ...editingTestimonial, rating: star } : ({} as Testimonial),
                      )
                    }
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8",
                        star <= (editingTestimonial?.rating || 5)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الرأي" : "Comment"}</Label>
              <Textarea
                value={editingTestimonial?.comment || ""}
                onChange={(e) =>
                  setEditingTestimonial(
                    editingTestimonial ? { ...editingTestimonial, comment: e.target.value } : ({} as Testimonial),
                  )
                }
                placeholder={language === "ar" ? "مدرسة رائعة..." : "Great school..."}
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveTestimonial} className="flex-1" size="lg">
                <Save className="w-4 h-4 ml-2" />
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsTestimonialDialogOpen(false)
                  setEditingTestimonial(null)
                }}
                className="flex-1"
                size="lg"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee
                ? language === "ar"
                  ? "تعديل موظف"
                  : "Edit Employee"
                : language === "ar"
                  ? "إضافة موظف جديد"
                  : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSaveEmployee}
            onCancel={() => {
              setIsEmployeeDialogOpen(false)
              setEditingEmployee(null)
            }}
            language={language}
            toast={toast}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!newEmployeeCredentials} onOpenChange={() => setNewEmployeeCredentials(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {language === "ar" ? "تم إضافة الموظف بنجاح" : "Employee Added Successfully"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "يرجى حفظ بيانات تسجيل الدخول التالية وإرسالها للموظف:"
                  : "Please save the following login credentials and send them to the employee:"}
              </p>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={newEmployeeCredentials?.email || ""} readOnly className="bg-white dark:bg-gray-900" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(newEmployeeCredentials?.email || "")
                        toast({ title: language === "ar" ? "تم النسخ" : "Copied" })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {language === "ar" ? "كلمة السر" : "Password"}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={newEmployeeCredentials?.password || ""}
                      readOnly
                      className="bg-white dark:bg-gray-900"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(newEmployeeCredentials?.password || "")
                        toast({ title: language === "ar" ? "تم النسخ" : "Copied" })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 p-3 rounded">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  {language === "ar"
                    ? "تأكد من إرسال هذه البيانات للموظف بشكل آمن. لن تتمكن من رؤية كلمة السر مرة أخرى."
                    : "Make sure to send these credentials to the employee securely. You won't be able to see the password again."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  const message = `مرحباً، تم إنشاء حساب لك في نظام إدارة المدرسة.\n\nالبريد الإلكتروني: ${newEmployeeCredentials?.email}\nكلمة السر: ${newEmployeeCredentials?.password}\n\nرابط تسجيل الدخول: ${window.location.origin}/staff-login`
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {language === "ar" ? "إرسال عبر واتساب" : "Send via WhatsApp"}
              </Button>
              <Button onClick={() => setNewEmployeeCredentials(null)}>{language === "ar" ? "تم" : "Done"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  )
}

function EmployeeForm({
  employee,
  onSave,
  onCancel,
  language,
  toast, // إضافة toast كـ prop
}: {
  employee: Employee | null
  onSave: (data: Omit<Employee, "id" | "createdAt"> & { password?: string }) => void
  onCancel: () => void
  language: string
  toast: any // إضافة نوع toast
}) {
  const [formData, setFormData] = useState<Omit<Employee, "id" | "createdAt"> & { password?: string }>({
    fullName: employee?.fullName || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    position: employee?.position || "",
    department: employee?.department || "",
    role: employee?.role || "employee",
    permissions: employee?.permissions || {
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canViewReports: false,
    },
    isActive: employee?.isActive ?? true,
    lastLogin: employee?.lastLogin,
    password: "", // إضافة حقل كلمة السر
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!employee && formData.password && formData.password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: language === "ar" ? "كلمات السر غير متطابقة" : "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{language === "ar" ? "الهاتف" : "Phone"}</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{language === "ar" ? "الوظيفة" : "Position"}</Label>
          <Input
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{language === "ar" ? "القسم" : "Department"}</Label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md"
            required
          >
            <option value="">{language === "ar" ? "اختر القسم" : "Select Department"}</option>
            <option value="medical">{language === "ar" ? "القسم الطبي" : "Medical"}</option>
            <option value="heart">{language === "ar" ? "قلب المدرسة" : "Heart of School"}</option>
            <option value="housing">{language === "ar" ? "السكن الداخلي" : "Housing"}</option>
            <option value="activities">{language === "ar" ? "الأنشطة" : "Activities"}</option>
            <option value="admin">{language === "ar" ? "الإدارة" : "Administration"}</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>{language === "ar" ? "الدور" : "Role"}</Label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as Employee["role"] })}
            className="w-full px-3 py-2 border border-border rounded-md"
            required
          >
            <option value="viewer">{language === "ar" ? "مشاهد" : "Viewer"}</option>
            <option value="employee">{language === "ar" ? "موظف" : "Employee"}</option>
            <option value="admin">{language === "ar" ? "مدير" : "Admin"}</option>
          </select>
        </div>
      </div>

      {!employee && (
        <>
          <div className="space-y-2">
            <Label>{language === "ar" ? "كلمة السر" : "Password"}</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={language === "ar" ? "أدخل كلمة السر" : "Enter password"}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "ar" ? "يجب أن تكون 6 أحرف على الأقل" : "Must be at least 6 characters"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>{language === "ar" ? "تأكيد كلمة السر" : "Confirm Password"}</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={language === "ar" ? "أعد إدخال كلمة السر" : "Re-enter password"}
              required
              minLength={6}
            />
          </div>
        </>
      )}

      {employee && (
        <div className="col-span-2 space-y-2">
          <Label>{language === "ar" ? "تغيير كلمة السر (اختياري)" : "Change Password (Optional)"}</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={
                language === "ar" ? "اترك فارغاً للاحتفاظ بكلمة السر الحالية" : "Leave empty to keep current password"
              }
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>{language === "ar" ? "الصلاحيات" : "Permissions"}</Label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.permissions.canEdit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permissions: { ...formData.permissions, canEdit: e.target.checked },
                })
              }
            />
            <span className="text-sm">{language === "ar" ? "التعديل" : "Edit"}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.permissions.canDelete}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permissions: { ...formData.permissions, canDelete: e.target.checked },
                })
              }
            />
            <span className="text-sm">{language === "ar" ? "الحذف" : "Delete"}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.permissions.canApprove}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permissions: { ...formData.permissions, canApprove: e.target.checked },
                })
              }
            />
            <span className="text-sm">{language === "ar" ? "الموافقة" : "Approve"}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.permissions.canViewReports}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permissions: { ...formData.permissions, canViewReports: e.target.checked },
                })
              }
            />
            <span className="text-sm">{language === "ar" ? "عرض التقارير" : "View Reports"}</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
        <Label>{language === "ar" ? "الحساب نشط" : "Account Active"}</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {language === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button type="submit">{language === "ar" ? "حفظ" : "Save"}</Button>
      </div>
    </form>
  )
}
