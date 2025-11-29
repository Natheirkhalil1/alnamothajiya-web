"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import Image from "next/image"
import { LayoutDashboard, Briefcase, MessageSquare, Download, Trash2, LogOut, Star, Calendar, Mail, Phone, User, FileText, Plus, MessageCircle, Edit, Settings, Clock, ImageIcon, Info, Contact, Home, Building2, GraduationCap, Menu, X, Save, Eye, Sparkles, Users, ActivityIcon, Bell, Check, CheckCircle2, Rocket, AlertCircle, Copy, EyeOff, ExternalLink, Database } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
// import { isAuthenticated, logout, getUsername } from "@/lib/auth" // REMOVED old auth imports
import { useAuth } from "@/lib/auth-context" // LocalStorage-based auth context
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
  getServiceRequests,
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
  // Types
  type Employee,
  type Activity,
  type Notification,
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
  type DynamicPage,
  // Dynamic page functions
  getDynamicPages,
  saveDynamicPage,
  updateDynamicPage,
  deleteDynamicPage,
  // Mockup data function
  loadMockupData,
  // Added functions for enhanced employment applications and service requests
  deleteEnhancedEmploymentApplication,
  updateEnhancedEmploymentApplication,
  deleteServiceRequest,
  updateServiceRequest,
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
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language].dashboard

  const { currentUser, employee, logout: firebaseLogout } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")

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

  const [dynamicPages, setDynamicPages] = useState<DynamicPage[]>([])
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null)

  const [pageSearchQuery, setPageSearchQuery] = useState("")
  const [pageFilterStatus, setPageFilterStatus] = useState<"all" | "published" | "draft">("all")

  // USE FIREBASE AUTH CONTEXT INSTEAD OF LOCALSTORAGE-BASED AUTH
  // const { currentUser, isAdmin, logout: authLogout } = useAuth()

  useEffect(() => {
    // CHECK FIREBASE AUTHENTICATION STATE INSTEAD OF LOCALSTORAGE
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUsername(currentUser.fullName || currentUser.email)
    loadData()

    getEnhancedEmploymentApplications().then(setEmploymentApplications)
    getServiceRequests().then(setServiceRequests)

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
      if (e.detail.key === "dynamicPages") {
        setDynamicPages(e.detail.value)
      }
      // Handle messages storage changes
      if (e.detail.key === "contactMessages") {
        setMessages(e.detail.value)
      }
      // Handle pending reviews storage changes
      if (e.detail.key === "pendingReviews") {
        setPendingReviews(e.detail.value)
      }
    }

    window.addEventListener("localStorageChange", handleStorageChange as EventListener)

    getEmployees().then((employees) => {
      setEmployees(employees)
      setStaff(employees) // Initialize staff state
    })
    getActivities(50).then(setActivities) // آخر 50 نشاط
    getNotifications().then(setNotifications)
    getUnreadNotifications().then((unread) => setUnreadCount(unread.length))
    getDynamicPages().then(setDynamicPages)

    return () => window.removeEventListener("localStorageChange", handleStorageChange as EventListener)
  }, [router, currentUser]) // Added currentUser to dependency array

  const loadData = async () => {
    console.log("[v0] Dashboard: Loading data from localStorage...")
    setApplications(await getEmploymentApplications())
    setMessages(await getContactMessages())
    setTestimonials(await getTestimonials())
    setJobs(await getJobPositions())
    setPendingReviews(await getPendingReviews())
    setServices(await getServiceContents())
    setHeroSlides(await getHeroSlides())
    setAboutContent(await getAboutContent())
    setGalleryImages(await getGalleryImages())
    setDepartmentContents(await getDepartmentContents())
    setContactInfo(await getContactInfo())
    const dynamicPagesData = await getDynamicPages()
    console.log("[v0] Dashboard: Loaded pages from localStorage:", dynamicPagesData.length)
    setDynamicPages(dynamicPagesData)
  }

  // Handle Logout
  const handleLogout = () => {
    // logout() // REMOVED old logout
    firebaseLogout() // LocalStorage auth context logout
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
    loadData() // Reload data to reflect deletion
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
      workShift: editingJob.workShift || "",
      workShiftEn: editingJob.workShiftEn || "",
      gender: editingJob.gender || "",
      genderEn: editingJob.genderEn || "",
      workDuration: editingJob.workDuration || "",
      workDurationEn: editingJob.workDurationEn || "",
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

  const handleSavePage = () => {
    if (!editingPage) return

    if (editingPage.id) {
      // Update existing page
      updateDynamicPage(editingPage.id, editingPage)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث الصفحة بنجاح" : "Page updated successfully",
      })
    } else {
      // Create new page
      saveDynamicPage({
        slug: editingPage.slug,
        titleAr: editingPage.titleAr,
        titleEn: editingPage.titleEn,
        descriptionAr: editingPage.descriptionAr,
        descriptionEn: editingPage.descriptionEn,
        contentAr: editingPage.contentAr,
        contentEn: editingPage.contentEn,
        image: editingPage.image,
        isPublished: editingPage.isPublished,
      })
      toast({
        title: language === "ar" ? "تم الإنشاء" : "Created",
        description: language === "ar" ? "تم إنشاء الصفحة بنجاح" : "Page created successfully",
      })
    }

    setIsPageDialogOpen(false)
    setEditingPage(null)
    loadData()
  }

  // Updated handleDeletePage to use async/await and handle errors
  const handleDeletePage = async (id: string) => {
    if (
      !confirm(language === "ar" ? "هل أنت متأكد من حذف هذه الصفحة؟" : "Are you sure you want to delete this page?")
    ) {
      return
    }

    try {
      await deleteDynamicPage(id)
      setDynamicPages(dynamicPages.filter((p) => p.id !== id))
      toast({
        title: language === "ar" ? "تم الحذف" : "Deleted",
        description: language === "ar" ? "تم حذف الصفحة بنجاح" : "Page deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete page:", error)
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل حذف الصفحة" : "Failed to delete page",
      })
    }
  }

  const handleDuplicatePage = async (page: DynamicPage) => {
    try {
      // Construct the new page data, ensuring to copy relevant fields and modify others
      const duplicatedPage: Omit<DynamicPage, "id" | "createdAt" | "updatedAt"> = {
        titleAr: `${page.titleAr} (نسخة)`, // Append '(Copy)' to the Arabic title
        titleEn: `${page.titleEn} (Copy)`, // Append '(Copy)' to the English title
        slug: `${page.slug}-copy-${Date.now()}`, // Append '-copy-timestamp' to the slug to ensure uniqueness
        descriptionAr: page.descriptionAr,
        descriptionEn: page.descriptionEn,
        blocks: page.blocks, // Deep copy blocks if they are complex objects
        isPublished: false, // New pages should be drafts by default
        seoTitleAr: page.seoTitleAr,
        seoTitleEn: page.seoTitleEn,
        seoDescriptionAr: page.seoDescriptionAr,
        seoDescriptionEn: page.seoDescriptionEn,
        image: page.image,
        // Assuming contentAr and contentEn are part of blocks now, otherwise copy them too
      }

      const newPage = await saveDynamicPage(duplicatedPage)
      setDynamicPages([...dynamicPages, newPage]) // Add the new page to the state

      toast({
        title: language === "ar" ? "تم النسخ" : "Duplicated",
        description: language === "ar" ? "تم نسخ الصفحة بنجاح" : "Page duplicated successfully",
      })
    } catch (error) {
      console.error("Failed to duplicate page:", error)
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل نسخ الصفحة" : "Failed to duplicate page",
      })
    }
  }

  const filteredPages = dynamicPages.filter((page) => {
    // Filter by search query
    const searchMatch =
      pageSearchQuery === "" ||
      page.titleAr.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
      page.titleEn.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(pageSearchQuery.toLowerCase())

    // Filter by status
    const statusMatch =
      pageFilterStatus === "all" ||
      (pageFilterStatus === "published" && page.isPublished) ||
      (pageFilterStatus === "draft" && !page.isPublished)

    return searchMatch && statusMatch
  })

  const navigationItems = [
    {
      id: "overview",
      label: language === "ar" ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "pages",
      label: language === "ar" ? "إدارة الصفحات" : "Pages Management",
      icon: FileText,
      color: "from-violet-500 to-violet-600",
      badge: dynamicPages.length,
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
      badge: employmentApplications.filter((app) => app.status === "pending").length,
    },
    {
      id: "messages",
      label: language === "ar" ? "الرسائل" : "Messages",
      icon: MessageSquare,
      color: "from-teal-500 to-teal-600",
      badge: messages.length, // Add badge for messages
    },
    {
      id: "pending",
      label: language === "ar" ? "آراء معلقة" : "Pending Reviews",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      badge: pendingReviews.length,
    },
    {
      id: "employees",
      label: language === "ar" ? "الموظفون" : "Employees",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      badge: employees.filter((emp) => emp.isActive).length,
    },
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

  // Function to handle loading mockup data
  const handleLoadMockupData = async () => {
    await loadMockupData()
    loadData() // Reload data to reflect changes
    toast({
      title: language === "ar" ? "تم تحميل البيانات" : "Mockup data loaded",
      description: language === "ar" ? "تم تحميل البيانات النموذجية بنجاح" : "Mockup data loaded successfully",
    })
  }

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
                variant={activeSection === "applications" ? "default" : "ghost"}
                onClick={() => {
                  // router.push(`?section=applications`) // REMOVED
                  setActiveSection("applications")
                  // setActiveTab("applications") // REMOVED
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
                variant={activeSection === "service-requests" ? "default" : "ghost"}
                onClick={() => {
                  // router.push(`?section=service-requests`) // REMOVED
                  setActiveSection("service-requests")
                  // setActiveTab("service-requests") // REMOVED
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
                variant={activeSection === "employees" ? "default" : "ghost"}
                onClick={() => {
                  // router.push(`?section=employees`) // REMOVED
                  setActiveSection("employees")
                  // setActiveTab("employees") // REMOVED
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
              <Card className="p-6 bg-gradient-to-br from-blue-50 via-muted/20 to-background dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {language === "ar" ? "بيانات تجريبية" : "Mockup Data"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar"
                          ? "قم بتحميل بيانات نموذجية للاختبار والعرض التوضيحي"
                          : "Load sample data for testing and demonstration"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLoadMockupData}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    {language === "ar" ? "تحميل البيانات التجريبية" : "Load Mockup Data"}
                  </Button>
                </div>
              </Card>

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
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-500/50"
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
                      {language === "ar" ? "تعديل معلومات المدرسة والرؤية والرسالة" : "Edit school information and vision"}
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
                        className="h-12"
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

                        <div className="space-y-2 mb-4">
                          {job.workShift && (
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                {language === "ar" ? job.workShift : job.workShiftEn}
                              </Badge>
                            </div>
                          )}
                          {job.gender && (
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                                {language === "ar" ? job.gender : job.genderEn}
                              </Badge>
                            </div>
                          )}
                          {job.workDuration && (
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                                {language === "ar" ? job.workDuration : job.workDurationEn}
                              </Badge>
                            </div>
                          )}
                        </div>

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

          {/* Job Applications Section */}
          {activeSection === "applications" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "طلبات التوظيف" : "Job Applications"}</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {employmentApplications.length} {language === "ar" ? "طلب" : "applications"}
                </Badge>
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
                    <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{app.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              app.status === "pending" && "bg-yellow-500/10 text-yellow-600",
                              app.status === "approved" && "bg-green-500/10 text-green-600",
                              app.status === "rejected" && "bg-red-500/10 text-red-600",
                            )}
                          >
                            {app.status === "pending" && (language === "ar" ? "قيد المراجعة" : "Pending")}
                            {app.status === "approved" && (language === "ar" ? "مقبول" : "Approved")}
                            {app.status === "rejected" && (language === "ar" ? "مرفوض" : "Rejected")}
                          </Badge>
                        </div>

                        {/* Personal Info */}
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{language === "ar" ? "الهاتف" : "Phone"}</p>
                            <p className="font-medium">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "تاريخ الميلاد" : "Birth Date"}
                            </p>
                            <p className="font-medium">{app.birthDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "الجنسية" : "Nationality"}
                            </p>
                            <p className="font-medium">{app.nationality}</p>
                          </div>
                        </div>

                        {/* Education */}
                        {app.education && app.education.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              {language === "ar" ? "المؤهلات العلمية" : "Education"}
                            </h4>
                            <div className="space-y-2">
                              {app.education.map((edu, idx) => (
                                <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                                  <p className="font-medium">{edu.degree}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {edu.institution} • {edu.graduationYear}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {app.experience && app.experience.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              {language === "ar" ? "الخبرات العملية" : "Experience"}
                            </h4>
                            <div className="space-y-2">
                              {app.experience.map((exp, idx) => (
                                <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                                  <p className="font-medium">{exp.position}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {exp.company} • {exp.duration}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          {app.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateEnhancedEmploymentApplication(app.id, { status: "approved" })
                                  setEmploymentApplications(getEnhancedEmploymentApplications())
                                }}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {language === "ar" ? "قبول" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  updateEnhancedEmploymentApplication(app.id, { status: "rejected" })
                                  setEmploymentApplications(getEnhancedEmploymentApplications())
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                {language === "ar" ? "رفض" : "Reject"}
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
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

          {/* Service Requests Section */}
          {activeSection === "service-requests" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "طلبات الخدمة" : "Service Requests"}</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {serviceRequests.length} {language === "ar" ? "طلب" : "requests"}
                </Badge>
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
                    <Card key={req.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{req.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{req.email}</p>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              req.status === "pending" && "bg-yellow-500/10 text-yellow-600",
                              req.status === "approved" && "bg-green-500/10 text-green-600",
                              req.status === "rejected" && "bg-red-500/10 text-red-600",
                            )}
                          >
                            {req.status === "pending" && (language === "ar" ? "قيد المراجعة" : "Pending")}
                            {req.status === "approved" && (language === "ar" ? "مقبول" : "Approved")}
                            {req.status === "rejected" && (language === "ar" ? "مرفوض" : "Rejected")}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{language === "ar" ? "الهاتف" : "Phone"}</p>
                            <p className="font-medium">{req.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === "ar" ? "نوع الخدمة" : "Service Type"}
                            </p>
                            <p className="font-medium">{req.serviceType}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {language === "ar" ? "التفاصيل" : "Details"}
                          </p>
                          <p className="bg-muted/30 p-4 rounded-lg">{req.message}</p>
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                          {req.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateServiceRequest(req.id, { status: "approved" })
                                  setServiceRequests(getServiceRequests())
                                }}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {language === "ar" ? "قبول" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  updateServiceRequest(req.id, { status: "rejected" })
                                  setServiceRequests(getServiceRequests())
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                {language === "ar" ? "رفض" : "Reject"}
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
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

          {/* Messages Section */}
          {activeSection === "messages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "الرسائل" : "Messages"}</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {messages.length} {language === "ar" ? "رسالة" : "messages"}
                </Badge>
              </div>

              <div className="grid gap-4">
                {messages.length === 0 ? (
                  <Card className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد رسائل" : "No messages yet"}
                    </p>
                  </Card>
                ) : (
                  messages.map((msg) => (
                    <Card key={msg.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1 space-y-3 w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{msg.name}</h3>
                              <p className="text-sm text-muted-foreground">{msg.email}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{language === "ar" ? "الهاتف" : "Phone"}</p>
                              <p className="font-medium">{msg.phone}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{language === "ar" ? "التاريخ" : "Date"}</p>
                              <p className="font-medium">{new Date(msg.createdAt).toLocaleDateString("ar-EG")}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{language === "ar" ? "الرسالة" : "Message"}</p>
                            <p className="text-base bg-muted/30 p-4 rounded-lg">{msg.message}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              window.open(`mailto:${msg.email}`, "_blank")
                            }}
                            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            {language === "ar" ? "رد بالبريد" : "Reply via Email"}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(`https://wa.me/${msg.phone}`, "_blank")
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {language === "ar" ? "واتساب" : "WhatsApp"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(language === "ar" ? "هل تريد حذف هذه الرسالة؟" : "Delete this message?")) {
                                deleteContactMessage(msg.id)
                                setMessages(getContactMessages()) // Refresh messages
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

          {/* Pending Reviews Section */}
          {activeSection === "pending" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{language === "ar" ? "آراء معلقة" : "Pending Reviews"}</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {pendingReviews.length} {language === "ar" ? "رأي" : "reviews"}
                </Badge>
              </div>

              <div className="grid gap-4">
                {pendingReviews.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد آراء معلقة" : "No pending reviews"}
                    </p>
                  </Card>
                ) : (
                  pendingReviews.map((review) => (
                    <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1 space-y-3 w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{review.name}</h3>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-base bg-muted/30 p-4 rounded-lg">{review.comment}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.submittedAt).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              handleApprovePendingReview(review.id)
                              // No need to reload data as handleApprovePendingReview does it
                            }}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {language === "ar" ? "موافقة" : "Approve"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(language === "ar" ? "هل تريد رفض هذا الرأي؟" : "Reject this review?")) {
                                handleRejectPendingReview(review.id)
                                // No need to reload data as handleRejectPendingReview does it
                              }
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            {language === "ar" ? "رفض" : "Reject"}
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

          {activeSection === "pages" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-violet-500/5 to-purple-500/5 border-2 border-violet-500/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === "ar" ? "إدارة الصفحات" : "Pages Management"}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === "ar"
                          ? `إدارة ${dynamicPages.length} صفحة ديناميكية`
                          : `Manage ${dynamicPages.length} dynamic pages`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/dashboard/pages/new")}
                    size="lg"
                    className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    {language === "ar" ? "إضافة صفحة جديدة" : "Add New Page"}
                  </Button>
                </div>

                <div className="mb-6 grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={language === "ar" ? "بحث في الصفحات..." : "Search pages..."}
                      value={pageSearchQuery}
                      onChange={(e) => setPageSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={pageFilterStatus === "all" ? "default" : "outline"}
                      onClick={() => setPageFilterStatus("all")}
                      size="sm"
                      className={pageFilterStatus === "all" ? "bg-violet-500" : ""}
                    >
                      {language === "ar" ? "الكل" : "All"}
                    </Button>
                    <Button
                      variant={pageFilterStatus === "published" ? "default" : "outline"}
                      onClick={() => setPageFilterStatus("published")}
                      size="sm"
                      className={pageFilterStatus === "published" ? "bg-green-500" : ""}
                    >
                      {language === "ar" ? "منشورة" : "Published"}
                    </Button>
                    <Button
                      variant={pageFilterStatus === "draft" ? "default" : "outline"}
                      onClick={() => setPageFilterStatus("draft")}
                      size="sm"
                      className={pageFilterStatus === "draft" ? "bg-gray-500" : ""}
                    >
                      {language === "ar" ? "مسودة" : "Draft"}
                    </Button>
                  </div>
                </div>

                {filteredPages.length === 0 ? (
                  <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed border-border">
                    <FileText className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {pageSearchQuery || pageFilterStatus !== "all"
                        ? language === "ar"
                          ? "لا توجد صفحات مطابقة"
                          : "No matching pages"
                        : language === "ar"
                          ? "لا توجد صفحات"
                          : "No Pages"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {pageSearchQuery || pageFilterStatus !== "all"
                        ? language === "ar"
                          ? "جرب تغيير معايير البحث أو التصفية"
                          : "Try changing your search or filter criteria"
                        : language === "ar"
                          ? "ابدأ بإضافة الصفحة الأولى"
                          : "Start by adding your first page"}
                    </p>
                    {!pageSearchQuery && pageFilterStatus === "all" && (
                      <Button
                        onClick={() => router.push("/dashboard/pages/new")}
                        className="bg-gradient-to-r from-violet-500 to-violet-600"
                      >
                        <Plus className="w-5 h-5 ml-2" />
                        {language === "ar" ? "إضافة صفحة جديدة" : "Add New Page"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPages.map((page) => (
                      <Card
                        key={page.id}
                        className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-violet-500/50"
                      >
                        {page.image && (
                          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
                            <Image
                              src={page.image || "/placeholder.svg"}
                              alt={page.titleAr}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            className={cn(
                              page.isPublished
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                : "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
                            )}
                          >
                            {page.isPublished
                              ? language === "ar"
                                ? "منشورة"
                                : "Published"
                              : language === "ar"
                                ? "مسودة"
                                : "Draft"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {(page.blocksAr?.length || 0) + (page.blocksEn?.length || 0) || page.blocks?.length || 0}{" "}
                            {language === "ar" ? "كتلة" : "blocks"}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mb-3">
                          <Button
                            onClick={() => router.push(`/dashboard/pages/edit/${page.id}`)}
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            {language === "ar" ? "تحرير" : "Edit"}
                          </Button>
                          <Button
                            onClick={() => handleDuplicatePage(page)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
                            title={language === "ar" ? "نسخ الصفحة" : "Duplicate page"}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeletePage(page.id)}
                            variant="destructive"
                            size="sm"
                            className="hover:scale-105 transition-transform"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <h3 className="font-bold text-xl text-foreground mb-2">
                          {language === "ar" ? page.titleAr : page.titleEn}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {language === "ar" ? page.descriptionAr : page.descriptionEn}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(page.updatedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                          <code className="text-xs bg-muted px-2 py-1 rounded">/pages/{page.slug}</code>
                          {page.isPublished && (
                            <Button
                              onClick={() => window.open(`/pages/${page.slug}`, "_blank")}
                              variant="link"
                              size="sm"
                              className="mt-2 w-full text-violet-600 hover:text-violet-700"
                            >
                              <ExternalLink className="w-3 h-3 ml-1" />
                              {language === "ar" ? "عرض الصفحة" : "View Page"}
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ... existing sections ... */}
        </div>
      </main>

      {/* Dynamic Pages Dialog */}
      <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage?.id
                ? language === "ar"
                  ? "تعديل الصفحة"
                  : "Edit Page"
                : language === "ar"
                  ? "إضافة صفحة جديدة"
                  : "Add New Page"}
            </DialogTitle>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                  <Input
                    value={editingPage.titleAr}
                    onChange={(e) => setEditingPage({ ...editingPage, titleAr: e.target.value })}
                    placeholder={language === "ar" ? "أدخل العنوان بالعربية" : "Enter title in Arabic"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                  <Input
                    value={editingPage.titleEn}
                    onChange={(e) => setEditingPage({ ...editingPage, titleEn: e.target.value })}
                    placeholder={language === "ar" ? "أدخل العنوان بالإنجليزية" : "Enter title in English"}
                  />
                </div>
              </div>

              <div>
                <Label>{language === "ar" ? "رابط الصفحة (Slug)" : "Page Slug"}</Label>
                <Input
                  value={editingPage.slug}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  placeholder="page-url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "ar" ? "سيكون رابط الصفحة:" : "Page URL will be:"} /{editingPage.slug}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                  <Textarea
                    value={editingPage.descriptionAr}
                    onChange={(e) => setEditingPage({ ...editingPage, descriptionAr: e.target.value })}
                    rows={3}
                    placeholder={language === "ar" ? "وصف مختصر بالعربية" : "Short description in Arabic"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                  <Textarea
                    value={editingPage.descriptionEn}
                    onChange={(e) => setEditingPage({ ...editingPage, descriptionEn: e.target.value })}
                    rows={3}
                    placeholder={language === "ar" ? "وصف مختصر بالإنجليزية" : "Short description in English"}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{language === "ar" ? "المحتوى (عربي)" : "Content (Arabic)"}</Label>
                  <Textarea
                    value={editingPage.contentAr}
                    onChange={(e) => setEditingPage({ ...editingPage, contentAr: e.target.value })}
                    rows={8}
                    placeholder={language === "ar" ? "المحتوى الكامل بالعربية" : "Full content in Arabic"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "المحتوى (إنجليزي)" : "Content (English)"}</Label>
                  <Textarea
                    value={editingPage.contentEn}
                    onChange={(e) => setEditingPage({ ...editingPage, contentEn: e.target.value })}
                    rows={8}
                    placeholder={language === "ar" ? "المحتوى الكامل بالإنجليزية" : "Full content in English"}
                  />
                </div>
              </div>

              <div>
                <Label>{language === "ar" ? "صورة الصفحة" : "Page Image"}</Label>
                <Input
                  value={editingPage.image || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, image: e.target.value })}
                  placeholder={language === "ar" ? "رابط الصورة" : "Image URL"}
                />
                {editingPage.image && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mt-3 border-2 border-border">
                    <Image src={editingPage.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingPage.isPublished}
                  onCheckedChange={(checked) => setEditingPage({ ...editingPage, isPublished: checked })}
                />
                <Label>{language === "ar" ? "نشر الصفحة" : "Publish Page"}</Label>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSavePage} className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600">
                  <Save className="w-4 h-4 ml-2" />
                  {language === "ar" ? "حفظ" : "Save"}
                </Button>
                <Button onClick={() => setIsPageDialogOpen(false)} variant="outline" className="flex-1">
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "فترة الدوام (عربي)" : "Work Shift (Arabic)"}</Label>
                <Input
                  value={editingJob?.workShift || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, workShift: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="8:00 ص - 3:00 م"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "فترة الدوام (إنجليزي)" : "Work Shift (English)"}</Label>
                <Input
                  value={editingJob?.workShiftEn || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, workShiftEn: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="8:00 AM - 3:00 PM"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "الجنس المطلوب (عربي)" : "Required Gender (Arabic)"}</Label>
                <select
                  value={editingJob?.gender || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, gender: e.target.value } : ({} as JobPosition))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                  <option value="لا يهم">لا يهم</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "الجنس المطلوب (إنجليزي)" : "Required Gender (English)"}</Label>
                <select
                  value={editingJob?.genderEn || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, genderEn: e.target.value } : ({} as JobPosition))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Doesn't matter">Doesn't matter</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "مدة الدوام (عربي)" : "Work Duration (Arabic)"}</Label>
                <Input
                  value={editingJob?.workDuration || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, workDuration: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="7 ساعات"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "مدة الدوام (إنجليزي)" : "Work Duration (English)"}</Label>
                <Input
                  value={editingJob?.workDurationEn || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, workDurationEn: e.target.value } : ({} as JobPosition))
                  }
                  placeholder="7 hours"
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

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {language === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button type="submit">{language === "ar" ? "حفظ" : "Save"}</Button>
      </div>
    </form>
  )
}
