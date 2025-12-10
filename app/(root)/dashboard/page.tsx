"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams, usePathname } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, Briefcase, MessageSquare, Download, Trash2, LogOut, Star, Calendar, Mail, Phone, User, FileText, Plus, MessageCircle, Edit, Settings, Clock, ImageIcon, Info, Contact, Home, Building2, GraduationCap, Menu, X, Save, Eye, Sparkles, Users, ActivityIcon, Bell, Check, CheckCircle2, Rocket, AlertCircle, Copy, EyeOff, ExternalLink, Database, ChevronDown, ChevronRight, ChevronLeft, Layout, Menu as MenuIcon, RotateCcw, Wrench, Palette, Camera, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
  rejectPendingReview,
  getRejectedReviews,
  approveRejectedReview,
  deleteRejectedReview,
  rejectApprovedReview,
  type RejectedReview,
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
  // Forms
  getForms,
  saveForm,
  updateForm,
  deleteForm,
  getFormSubmissions,
  saveFormSubmission,
  updateFormSubmission,
  deleteFormSubmission,
  type Form,
  type FormField,
  type FormSubmission,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"
import { logActivity, getMaintenanceSettings, saveMaintenanceSettings, type MaintenanceSettings } from "@/lib/storage" // Assuming you have a logger utility
import { getHeaderSettingsAsync, saveHeaderSettingsAsync, resetHeaderSettingsAsync, getFooterSettingsAsync, saveFooterSettingsAsync, resetFooterSettingsAsync, getGeneralSettingsAsync, saveGeneralSettingsAsync, resetGeneralSettingsAsync } from "@/lib/settings"
import type { HeaderSettings, FooterSettings, GeneralSettings, MenuItem, FooterColumn } from "@/lib/storage"
import { HeaderEditorContent } from "./settings/header-editor-content"
import { FooterEditorContent } from "./settings/footer-editor-content"
import { MediaLibrary } from "@/components/media-library"
import { MediaPicker } from "@/components/media-picker"

// Mock LayoutWrapper for now, assuming it's a layout component
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex">{children}</div>
)

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language].dashboard

  const { currentUser, employee, logout: firebaseLogout, isLoading, isAuthenticated } = useAuth()

  // Get section from URL path (e.g., /dashboard/reviews) or query param as fallback
  // First try dynamic route param, then extract from pathname, then query param
  const pathSection = params?.section as string | undefined
  const pathnameSection = pathname?.startsWith("/dashboard/")
    ? pathname.split("/")[2] // Get segment after /dashboard/
    : undefined
  const querySection = searchParams.get("section")
  const urlSection = pathSection || pathnameSection || querySection || "overview"

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState(urlSection)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "content",
    "reviews",
    "jobs",
    "forms",
    "settings"
  ])

  // Sync activeSection with URL (path or query param)
  useEffect(() => {
    if (urlSection && urlSection !== activeSection) {
      setActiveSection(urlSection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSection])

  const [applications, setApplications] = useState<EmploymentApplication[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [forms, setForms] = useState<Form[]>([])
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([])
  const [username, setUsername] = useState<string>("")
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [rejectedReviews, setRejectedReviews] = useState<RejectedReview[]>([])
  const [services, setServices] = useState<ServiceContent[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [departmentContents, setDepartmentContents] = useState<DepartmentContent[]>([])

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
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<Form | null>(null)
  const [selectedFormForSubmissions, setSelectedFormForSubmissions] = useState<string | null>(null)

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

  // Settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null)
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null)
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null)
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [isMaintenancePreviewOpen, setIsMaintenancePreviewOpen] = useState(false)

  // USE FIREBASE AUTH CONTEXT INSTEAD OF LOCALSTORAGE-BASED AUTH
  // const { currentUser, isAdmin, logout: authLogout } = useAuth()

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (isLoading) {
      return
    }

    // CHECK AUTHENTICATION STATE
    // Auth context now properly waits for Firebase to restore session
    // So if isLoading is false and isAuthenticated is false, user is definitely not logged in
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // At this point currentUser should exist (auth context ensures this)
    if (!currentUser) {
      return
    }

    setUsername(currentUser.fullName || currentUser.email)
    loadData()

    // Check for section parameter in URL
    const section = searchParams.get("section")
    if (section) {
      setActiveSection(section)
    }

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
        getUnreadNotifications(currentUser?.id || "admin").then((unread) => setUnreadCount(unread.length))
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
    getNotifications(currentUser?.id || "admin").then(setNotifications)
    getUnreadNotifications(currentUser?.id || "admin").then((unread) => setUnreadCount(unread.length))
    getDynamicPages().then(setDynamicPages)

    return () => window.removeEventListener("localStorageChange", handleStorageChange as EventListener)
  }, [router, currentUser, isLoading, isAuthenticated]) // Auth state dependencies

  const loadData = async () => {
    console.log("[v0] Dashboard: Loading data from localStorage...")
    setApplications(await getEmploymentApplications())
    setMessages(await getContactMessages())
    setTestimonials(await getTestimonials())
    setJobs(await getJobPositions())
    setPendingReviews(await getPendingReviews())
    setRejectedReviews(getRejectedReviews())
    setServices(await getServiceContents())
    setHeroSlides(await getHeroSlides())
    setAboutContent(await getAboutContent())
    setGalleryImages(await getGalleryImages())
    setDepartmentContents(await getDepartmentContents())
    const dynamicPagesData = await getDynamicPages()
    console.log("[v0] Dashboard: Loaded pages from localStorage:", dynamicPagesData.length)
    setDynamicPages(dynamicPagesData)
    // Load settings (async)
    getGeneralSettingsAsync().then(setGeneralSettings)
    getHeaderSettingsAsync().then(setHeaderSettings)
    getFooterSettingsAsync().then(setFooterSettings)
    setMaintenanceSettings(getMaintenanceSettings())
    // Load forms and submissions (async)
    getForms().then(setForms)
    getFormSubmissions().then(setFormSubmissions)
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
    rejectPendingReview(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الرفض" : "Rejected",
      description: language === "ar" ? "تم رفض الرأي" : "Review rejected",
    })
  }

  const handleApproveRejectedReview = (id: string) => {
    approveRejectedReview(id)
    loadData()
    toast({
      title: language === "ar" ? "تمت الموافقة" : "Approved",
      description: language === "ar" ? "تم نشر الرأي على الموقع" : "Review published on the website",
    })
  }

  const handleDeleteRejectedReview = (id: string) => {
    deleteRejectedReview(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الرأي نهائياً" : "Review permanently deleted",
    })
  }

  const handleRejectApprovedReview = (id: string) => {
    rejectApprovedReview(id)
    setTimeout(() => {
      loadData()
      toast({
        title: language === "ar" ? "تم الرفض" : "Rejected",
        description: language === "ar" ? "تم نقل الرأي إلى المرفوضة" : "Review moved to rejected",
      })
    }, 100)
  }

  const handleDeleteApprovedReview = async (id: string) => {
    await deleteTestimonial(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الرأي نهائياً" : "Review permanently deleted",
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

  const handleSaveJob = async () => {
    if (!editingJob) return

    // Build job data, only including defined values
    const jobData: Record<string, any> = {
      title: editingJob.title || "",
      titleEn: editingJob.titleEn || "",
      type: editingJob.type || "",
      typeEn: editingJob.typeEn || "",
      description: editingJob.description || "",
      descriptionEn: editingJob.descriptionEn || "",
      requiresCv: editingJob.requiresCv ?? false,
      requiresCoverLetter: editingJob.requiresCoverLetter ?? false,
      requiresPhoto: editingJob.requiresPhoto ?? false,
    }

    // Add optional fields only if they have values
    if (editingJob.workShift) jobData.workShift = editingJob.workShift
    if (editingJob.workShiftEn) jobData.workShiftEn = editingJob.workShiftEn
    if (editingJob.gender) jobData.gender = editingJob.gender
    if (editingJob.genderEn) jobData.genderEn = editingJob.genderEn
    if (editingJob.workDuration) jobData.workDuration = editingJob.workDuration
    if (editingJob.workDurationEn) jobData.workDurationEn = editingJob.workDurationEn

    // Clean custom fields - remove undefined values and ensure options are clean
    if (editingJob.customFields && editingJob.customFields.length > 0) {
      jobData.customFields = editingJob.customFields.map(field => {
        const cleanField: Record<string, any> = {
          id: field.id,
          labelAr: field.labelAr || "",
          labelEn: field.labelEn || "",
          type: field.type || "text",
          required: field.required ?? false,
          order: field.order ?? 0,
        }
        if (field.placeholder) cleanField.placeholder = field.placeholder
        if (field.placeholderEn) cleanField.placeholderEn = field.placeholderEn
        if (field.options && field.options.length > 0) {
          cleanField.options = field.options.map(opt => ({
            valueAr: opt.valueAr || "",
            valueEn: opt.valueEn || "",
          }))
        }
        return cleanField
      })
    } else {
      jobData.customFields = []
    }

    try {
      if (editingJob.id) {
        await updateJobPosition(editingJob.id, jobData as any)
        toast({
          title: language === "ar" ? "تم التحديث" : "Updated",
          description: language === "ar" ? "تم تحديث الوظيفة بنجاح" : "Job updated successfully",
        })
      } else {
        await saveJobPosition(jobData as any)
        toast({
          title: language === "ar" ? "تم الإضافة" : "Added",
          description: language === "ar" ? "تم إضافة الوظيفة بنجاح" : "Job added successfully",
        })
      }
      await loadData()
      setIsJobDialogOpen(false)
      setEditingJob(null)
    } catch (error) {
      console.error("Error saving job:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في حفظ الوظيفة" : "Failed to save job",
        variant: "destructive",
      })
    }
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
      updateEmployee(updatedEmployee.id, updatedEmployee)
      logActivity({
        employeeId: currentUser?.id || "admin",
        employeeName: employee?.fullName || "المدير",
        action: "تحديث موظف",
        actionType: "update",
        targetType: "employee",
        targetId: editingEmployee.id,
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
        employeeId: currentUser?.id || "admin",
        employeeName: employee?.fullName || "المدير",
        action: "إضافة موظف",
        actionType: "create",
        targetType: "employee",
        targetId: newEmployee.id,
        details: `تم إضافة موظف جديد: ${data.fullName}`,
      })
    }
    setIsEmployeeDialogOpen(false)
    setEditingEmployee(null)
  }

  const handleDeleteEmployee = async (id: string) => {
    if (
      confirm(language === "ar" ? "هل أنت متأكد من حذف هذا الموظف؟" : "Are you sure you want to delete this employee?")
    ) {
      deleteEmployee(id)
      setEmployees(await getEmployees())
      setStaff(await getEmployees()) // Update staff state
      toast({
        title: language === "ar" ? "تم الحذف" : "Deleted",
        description: language === "ar" ? "تم حذف الموظف بنجاح" : "Employee deleted successfully",
      })
      logActivity({
        employeeId: currentUser?.id || "admin",
        employeeName: employee?.fullName || "المدير",
        action: "حذف موظف",
        actionType: "delete",
        targetType: "employee",
        targetId: id,
        details: `تم حذف الموظف بالمعرف: ${id}`,
      })
    }
  }

  const handleMarkNotificationAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    const userId = currentUser?.id || "admin"
    setNotifications(await getNotifications(userId))
    setUnreadCount((await getUnreadNotifications(userId)).length)
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(currentUser?.id || "admin")
    setNotifications(await getNotifications(currentUser?.id || "admin"))
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
        contentAr: page.contentAr || "",
        contentEn: page.contentEn || "",
        blocks: page.blocks,
        blocksAr: page.blocksAr,
        blocksEn: page.blocksEn,
        isPublished: false, // New pages should be drafts by default
        seoDescriptionAr: page.seoDescriptionAr,
        seoDescriptionEn: page.seoDescriptionEn,
        image: page.image,
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

  // Export page as JSON
  const handleExportPage = (page: DynamicPage) => {
    const exportData = {
      ...page,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      isHome: undefined,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `page-${page.slug}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: language === "ar" ? "تم التصدير" : "Exported",
      description: language === "ar" ? "تم تصدير الصفحة بنجاح" : "Page exported successfully",
    })
  }

  // Import page from JSON
  const handleImportPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const importedData = JSON.parse(text)
      if (!importedData.titleAr || !importedData.titleEn || !importedData.slug) {
        throw new Error("Invalid page data: missing required fields")
      }
      const newPageData: Omit<DynamicPage, "id" | "createdAt" | "updatedAt"> = {
        titleAr: importedData.titleAr,
        titleEn: importedData.titleEn,
        slug: `${importedData.slug}-imported-${Date.now()}`,
        descriptionAr: importedData.descriptionAr || "",
        descriptionEn: importedData.descriptionEn || "",
        contentAr: importedData.contentAr || "",
        contentEn: importedData.contentEn || "",
        blocks: importedData.blocks,
        blocksAr: importedData.blocksAr,
        blocksEn: importedData.blocksEn,
        isPublished: false,
        seoDescriptionAr: importedData.seoDescriptionAr,
        seoDescriptionEn: importedData.seoDescriptionEn,
        keywordsAr: importedData.keywordsAr,
        keywordsEn: importedData.keywordsEn,
        image: importedData.image,
        customCss: importedData.customCss,
        customJs: importedData.customJs,
      }
      const newPage = await saveDynamicPage(newPageData)
      setDynamicPages([...dynamicPages, newPage])
      toast({
        title: language === "ar" ? "تم الاستيراد" : "Imported",
        description: language === "ar" ? "تم استيراد الصفحة بنجاح" : "Page imported successfully",
      })
    } catch (error) {
      console.error("Failed to import page:", error)
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل استيراد الصفحة" : "Failed to import page",
      })
    }
    event.target.value = ""
  }

  // NEW: Handle setting page as homepage
  const handleSetHomepage = async (pageId: string) => {
    try {
      // First, unset all other pages as homepage
      const updatedPages = await Promise.all(
        dynamicPages.map(async (p) => {
          if (p.isHome && p.id !== pageId) {
            await updateDynamicPage(p.id, { isHome: false })
            return { ...p, isHome: false }
          }
          return p
        })
      )

      // Then set the selected page as homepage AND publish it
      await updateDynamicPage(pageId, { isHome: true, isPublished: true })

      const finalPages = updatedPages.map((p) =>
        p.id === pageId ? { ...p, isHome: true, isPublished: true } : p
      )

      setDynamicPages(finalPages)

      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تعيين الصفحة كصفحة رئيسية" : "Page set as homepage successfully",
      })
    } catch (error) {
      console.error("Failed to set homepage:", error)
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل تعيين الصفحة الرئيسية" : "Failed to set homepage",
      })
    }
  }

  // Settings handlers
  const handleSaveAllSettings = async () => {
    if (!headerSettings || !footerSettings) return
    try {
      if (generalSettings) {
        await saveGeneralSettingsAsync(generalSettings)
      }
      await saveHeaderSettingsAsync(headerSettings)
      await saveFooterSettingsAsync(footerSettings)
      if (maintenanceSettings) {
        saveMaintenanceSettings(maintenanceSettings)
      }
      toast({
        title: language === "ar" ? "تم الحفظ" : "Saved",
        description: language === "ar" ? "تم حفظ جميع الإعدادات بنجاح" : "All settings saved successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل حفظ الإعدادات" : "Failed to save settings"
      })
    }
  }

  const handleResetGeneral = async () => {
    if (confirm(language === "ar" ? "هل أنت متأكد من إعادة تعيين الإعدادات العامة؟" : "Are you sure you want to reset General settings?")) {
      const defaultSettings = await resetGeneralSettingsAsync()
      setGeneralSettings(defaultSettings)
      toast({
        title: language === "ar" ? "تمت الإعادة" : "Reset",
        description: language === "ar" ? "تمت إعادة تعيين الإعدادات العامة" : "General settings reset"
      })
    }
  }

  const handleResetHeader = async () => {
    if (confirm(language === "ar" ? "هل أنت متأكد من إعادة تعيين إعدادات الهيدر؟" : "Are you sure you want to reset Header settings?")) {
      const defaultSettings = await resetHeaderSettingsAsync()
      setHeaderSettings(defaultSettings)
      toast({
        title: language === "ar" ? "تمت الإعادة" : "Reset",
        description: language === "ar" ? "تمت إعادة تعيين إعدادات الهيدر" : "Header settings reset"
      })
    }
  }

  const handleResetFooter = async () => {
    if (confirm(language === "ar" ? "هل أنت متأكد من إعادة تعيين إعدادات الفوتر؟" : "Are you sure you want to reset Footer settings?")) {
      const defaultSettings = await resetFooterSettingsAsync()
      setFooterSettings(defaultSettings)
      toast({
        title: language === "ar" ? "تمت الإعادة" : "Reset",
        description: language === "ar" ? "تمت إعادة تعيين إعدادات الفوتر" : "Footer settings reset"
      })
    }
  }

  const handleResetAllSettings = async () => {
    if (confirm(language === "ar" ? "هل أنت متأكد من إعادة تعيين جميع الإعدادات؟" : "Are you sure you want to reset all settings?")) {
      const defaultGeneral = await resetGeneralSettingsAsync()
      const defaultHeader = await resetHeaderSettingsAsync()
      const defaultFooter = await resetFooterSettingsAsync()
      setGeneralSettings(defaultGeneral)
      setHeaderSettings(defaultHeader)
      setFooterSettings(defaultFooter)
      // Reset maintenance to default (disabled)
      const defaultMaintenance: MaintenanceSettings = {
        enabled: false,
        titleAr: "الموقع تحت الصيانة",
        titleEn: "Site Under Maintenance",
        messageAr: "نقوم حالياً بإجراء بعض التحسينات. سنعود قريباً!",
        messageEn: "We are currently making some improvements. We'll be back soon!",
        showCountdown: false,
        showContactInfo: true,
        contactEmail: "",
        contactPhone: "",
        showSocialLinks: true,
        backgroundImage: "",
        logoImage: "/logo.webp",
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
      }
      setMaintenanceSettings(defaultMaintenance)
      toast({
        title: language === "ar" ? "تمت الإعادة" : "Reset",
        description: language === "ar" ? "تمت إعادة تعيين جميع الإعدادات" : "All settings reset"
      })
    }
  }

  // Maintenance settings update helper
  const updateMaintenanceSettings = (updates: Partial<MaintenanceSettings>) => {
    if (!maintenanceSettings) return
    setMaintenanceSettings({ ...maintenanceSettings, ...updates })
  }

  // Toggle maintenance mode (saves immediately)
  const toggleMaintenanceMode = (enabled: boolean) => {
    if (!maintenanceSettings) return
    const updatedSettings = { ...maintenanceSettings, enabled }
    setMaintenanceSettings(updatedSettings)
    saveMaintenanceSettings(updatedSettings)
    toast({
      title: enabled
        ? (language === "ar" ? "تم تفعيل وضع الصيانة" : "Maintenance Mode Activated")
        : (language === "ar" ? "تم إلغاء وضع الصيانة" : "Maintenance Mode Deactivated"),
      description: enabled
        ? (language === "ar" ? "سيتم توجيه الزوار إلى صفحة الصيانة" : "Visitors will be redirected to the maintenance page")
        : (language === "ar" ? "الموقع متاح الآن للجميع" : "Site is now accessible to everyone"),
    })
  }

  // Form handlers
  const handleSaveForm = () => {
    if (!editingForm) return

    if (!editingForm.titleAr || !editingForm.titleEn) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "الرجاء إدخال العنوان بالعربية والإنجليزية" : "Please enter title in both languages",
      })
      return
    }

    if (!editingForm.fields || editingForm.fields.length === 0) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "الرجاء إضافة حقل واحد على الأقل" : "Please add at least one field",
      })
      return
    }

    if (editingForm.id) {
      updateForm(editingForm.id, editingForm)
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث النموذج بنجاح" : "Form updated successfully",
      })
    } else {
      saveForm(editingForm)
      toast({
        title: language === "ar" ? "تم الإضافة" : "Added",
        description: language === "ar" ? "تم إضافة النموذج بنجاح" : "Form added successfully",
      })
    }
    loadData()
    setIsFormDialogOpen(false)
    setEditingForm(null)
  }

  const handleDeleteForm = (id: string) => {
    if (!confirm(language === "ar" ? "هل تريد حذف هذا النموذج؟" : "Delete this form?")) {
      return
    }
    deleteForm(id)
    loadData()
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف النموذج بنجاح" : "Form deleted successfully",
    })
  }

  const handleToggleFormActive = async (id: string) => {
    const form = forms.find((f) => f.id === id)
    if (!form) return
    await updateForm(id, { isActive: !form.isActive })
    getForms().then(setForms)
    toast({
      title: language === "ar" ? "تم التحديث" : "Updated",
      description: language === "ar"
        ? (form.isActive ? "تم تعطيل النموذج" : "تم تفعيل النموذج")
        : (form.isActive ? "Form deactivated" : "Form activated"),
    })
  }

  const handleViewSubmissions = (formId: string) => {
    setSelectedFormForSubmissions(formId)
  }

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm(language === "ar" ? "هل تريد حذف هذا الطلب؟" : "Delete this submission?")) {
      return
    }
    await deleteFormSubmission(id)
    getFormSubmissions().then(setFormSubmissions)
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الطلب بنجاح" : "Submission deleted successfully",
    })
  }

  const handleUpdateSubmissionStatus = async (id: string, status: "new" | "read" | "archived") => {
    await updateFormSubmission(id, { status })
    getFormSubmissions().then(setFormSubmissions)
    toast({
      title: language === "ar" ? "تم التحديث" : "Updated",
      description: language === "ar" ? "تم تحديث حالة الطلب" : "Submission status updated",
    })
  }

  const addFormField = () => {
    if (!editingForm) return
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      labelAr: "",
      labelEn: "",
      placeholder: "",
      required: false,
      options: [],
      order: (editingForm.fields?.length || 0) + 1,
    }
    setEditingForm({
      ...editingForm,
      fields: [...(editingForm.fields || []), newField],
    })
  }

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    if (!editingForm) return
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    })
  }

  const deleteFormField = (fieldId: string) => {
    if (!editingForm) return
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.filter((field) => field.id !== fieldId),
    })
  }

  const moveFormField = (fieldId: string, direction: "up" | "down") => {
    if (!editingForm) return
    const index = editingForm.fields.findIndex((field) => field.id === fieldId)
    if (index === -1) return

    const newFields = [...editingForm.fields]
    if (direction === "up" && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
    } else if (direction === "down" && index < newFields.length - 1) {
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
    }

    setEditingForm({
      ...editingForm,
      fields: newFields,
    })
  }

  // Header update helpers
  const updateHeaderSettings = (updates: Partial<HeaderSettings>) => {
    setHeaderSettings(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateHeaderStyle = (styleUpdates: Partial<HeaderSettings["style"]>) => {
    setHeaderSettings(prev => prev ? {
      ...prev,
      style: { ...prev.style, ...styleUpdates }
    } : null)
  }

  const updateHeaderCtaButton = (ctaUpdates: Partial<NonNullable<HeaderSettings["ctaButton"]>>) => {
    setHeaderSettings(prev => prev ? {
      ...prev,
      ctaButton: { ...prev.ctaButton, ...ctaUpdates } as any
    } : null)
  }

  const updateHeaderContactInfo = (contactUpdates: Partial<NonNullable<HeaderSettings["contactInfo"]>>) => {
    setHeaderSettings(prev => prev ? {
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactUpdates } as any
    } : null)
  }

  const addMenuItem = () => {
    if (!headerSettings) return
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      labelAr: "عنصر جديد",
      labelEn: "New Item",
      linkType: "url",
      url: "#",
      openInNewTab: false,
      order: headerSettings.menuItems.length + 1
    }
    updateHeaderSettings({ menuItems: [...headerSettings.menuItems, newItem] })
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    if (!headerSettings) return
    updateHeaderSettings({
      menuItems: headerSettings.menuItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    })
  }

  const deleteMenuItem = (id: string) => {
    if (!headerSettings) return
    updateHeaderSettings({
      menuItems: headerSettings.menuItems.filter(item => item.id !== id)
    })
  }

  const moveMenuItem = (id: string, direction: "up" | "down") => {
    if (!headerSettings) return
    const index = headerSettings.menuItems.findIndex(item => item.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === headerSettings.menuItems.length - 1) return

    const newItems = [...headerSettings.menuItems]
    const targetIndex = direction === "up" ? index - 1 : index + 1
      ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]

    newItems.forEach((item, idx) => {
      item.order = idx + 1
    })

    updateHeaderSettings({ menuItems: newItems })
  }

  // Footer update helpers
  const updateFooterSettings = (updates: Partial<FooterSettings>) => {
    setFooterSettings(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateFooterStyle = (styleUpdates: Partial<FooterSettings["style"]>) => {
    setFooterSettings(prev => prev ? {
      ...prev,
      style: { ...prev.style, ...styleUpdates }
    } : null)
  }

  const updateFooterSocialMedia = (socialUpdates: Partial<FooterSettings["socialMedia"]>) => {
    setFooterSettings(prev => prev ? {
      ...prev,
      socialMedia: { ...prev.socialMedia, ...socialUpdates }
    } : null)
  }

  const updateFooterContactInfo = (contactUpdates: Partial<FooterSettings["contactInfo"]>) => {
    setFooterSettings(prev => prev ? {
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactUpdates }
    } : null)
  }

  // General settings update helpers
  const updateGeneralSettings = (updates: Partial<GeneralSettings>) => {
    setGeneralSettings(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateGeneralSocialLinks = (socialUpdates: Partial<GeneralSettings["socialLinks"]>) => {
    setGeneralSettings(prev => prev ? {
      ...prev,
      socialLinks: { ...prev.socialLinks, ...socialUpdates }
    } : null)
  }

  const addFooterColumn = () => {
    if (!footerSettings) return
    const newColumn: FooterColumn = {
      id: `column-${Date.now()}`,
      titleAr: "عمود جديد",
      titleEn: "New Column",
      type: "text",
      order: footerSettings.columns.length + 1,
      content: {
        textAr: "",
        textEn: ""
      }
    }
    updateFooterSettings({ columns: [...footerSettings.columns, newColumn] })
  }

  const updateFooterColumn = (id: string, updates: Partial<FooterColumn>) => {
    if (!footerSettings) return
    updateFooterSettings({
      columns: footerSettings.columns.map(col =>
        col.id === id ? { ...col, ...updates } : col
      )
    })
  }

  const deleteFooterColumn = (id: string) => {
    if (!footerSettings) return
    updateFooterSettings({
      columns: footerSettings.columns.filter(col => col.id !== id)
    })
  }

  const moveFooterColumn = (id: string, direction: "up" | "down") => {
    if (!footerSettings) return
    const index = footerSettings.columns.findIndex(col => col.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === footerSettings.columns.length - 1) return

    const newColumns = [...footerSettings.columns]
    const targetIndex = direction === "up" ? index - 1 : index + 1
      ;[newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]]

    newColumns.forEach((col, idx) => {
      col.order = idx + 1
    })

    updateFooterSettings({ columns: newColumns })
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

  const navigationGroups = [
    {
      type: "single",
      id: "overview",
      label: language === "ar" ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "group",
      id: "content",
      label: language === "ar" ? "إدارة المحتوى" : "Content Management",
      icon: FileText,
      items: [
        {
          id: "pages",
          label: language === "ar" ? "الصفحات" : "Pages",
          icon: FileText,
          color: "from-violet-500 to-violet-600",
          badge: dynamicPages.length,
        },
        {
          id: "media",
          label: language === "ar" ? "مكتبة الوسائط" : "Media Library",
          icon: ImageIcon,
          color: "from-pink-500 to-pink-600",
        },
      ],
    },
    {
      type: "group",
      id: "reviews",
      label: language === "ar" ? "الأشخاص والتقييمات" : "People & Reviews",
      icon: MessageCircle,
      items: [
        {
          id: "pending",
          label: language === "ar" ? "تقييمات معلقة" : "Pending Reviews",
          icon: Clock,
          color: "from-amber-500 to-amber-600",
          badge: pendingReviews.length,
        },
        {
          id: "reviews",
          label: language === "ar" ? "التقييمات" : "Reviews",
          icon: Star,
          color: "from-yellow-500 to-yellow-600",
          badge: testimonials.length + getRejectedReviews().length,
        },
      ],
    },
    {
      type: "group",
      id: "jobs",
      label: language === "ar" ? "الوظائف" : "Jobs",
      icon: Briefcase,
      items: [
        {
          id: "jobs",
          label: language === "ar" ? "الوظائف" : "Job Positions",
          icon: Briefcase,
          color: "from-cyan-500 to-cyan-600",
        },
        {
          id: "applications",
          label: language === "ar" ? "طلبات التوظيف" : "Applications",
          icon: FileText,
          color: "from-indigo-500 to-indigo-600",
          badge: employmentApplications.filter((app) => app.status === "pending").length,
        },
      ],
    },
    {
      type: "group",
      id: "forms",
      label: language === "ar" ? "الرسائل والنماذج" : "Messages & Forms",
      icon: MessageSquare,
      items: [
        {
          id: "messages",
          label: language === "ar" ? "رسائل الاتصال" : "Contact Messages",
          icon: MessageSquare,
          color: "from-teal-500 to-teal-600",
          badge: messages.length,
        },
        {
          id: "forms",
          label: language === "ar" ? "النماذج" : "Forms",
          icon: FileText,
          color: "from-blue-500 to-blue-600",
        },
      ],
    },
    {
      type: "group",
      id: "settings",
      label: language === "ar" ? "الإعدادات" : "Settings",
      icon: Settings,
      items: [
        {
          id: "settings",
          label: language === "ar" ? "إعدادات الموقع" : "Site Settings",
          icon: Settings,
          color: "from-slate-500 to-slate-600",
        },
      ],
    },
  ]

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  // Helper to find active item across all groups
  const getActiveItem = () => {
    for (const item of navigationGroups) {
      if (item.type === "single" && item.id === activeSection) {
        return item
      } else if (item.type === "group" && item.items) {
        const found = item.items.find((subItem) => subItem.id === activeSection)
        if (found) return found
      }
    }
    return null
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

  // Function to handle loading mockup data
  const handleLoadMockupData = async () => {
    await loadMockupData()
    loadData() // Reload data to reflect changes
    toast({
      title: language === "ar" ? "تم تحميل البيانات" : "Mockup data loaded",
      description: language === "ar" ? "تم تحميل البيانات النموذجية بنجاح" : "Mockup data loaded successfully",
    })
  }

  const isAr = language === "ar"

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect in useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <LayoutWrapper>
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-72 bg-gradient-to-b from-card to-card/95 shadow-2xl transition-transform duration-300 ease-in-out",
          isAr ? "right-0 border-l border-border" : "left-0 border-r border-border",
          sidebarOpen
            ? "translate-x-0"
            : isAr ? "translate-x-full" : "-translate-x-full",
        )}
        dir={isAr ? "rtl" : "ltr"}
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

          {/* Navigation Groups */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigationGroups.map((item) => {
              if (item.type === "single") {
                // Render single navigation item
                const ItemIcon = item.icon
                const href = "/dashboard"
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                      activeSection === item.id
                        ? "bg-gradient-to-r " + item.color + " text-white shadow-md scale-[1.02]"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <ItemIcon className="w-4 h-4 relative z-10" />
                    <span className="text-sm font-medium relative z-10 flex-1 text-start">{item.label}</span>
                    {activeSection === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                  </Link>
                )
              } else {
                // Render group with items
                const isExpanded = expandedGroups.includes(item.id)
                const GroupIcon = item.icon

                return (
                  <div key={item.id} className="space-y-1">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(item.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors group"
                    >
                      <GroupIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm flex-1 text-start">{item.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : isAr ? (
                        <ChevronLeft className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Group Items */}
                    {isExpanded && item.items && (
                      <div className={cn("space-y-1", isAr ? "pr-2" : "pl-2")}>
                        {item.items.map((subItem) => {
                          // All sections use path-based routing
                          const href = `/dashboard/${subItem.id}`
                          return (
                            <Link
                              key={subItem.id}
                              href={href}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                activeSection === subItem.id
                                  ? "bg-gradient-to-r " + subItem.color + " text-white shadow-md scale-[1.02]"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <subItem.icon className="w-4 h-4 relative z-10" />
                              <span className="text-sm font-medium relative z-10 flex-1 text-start">{subItem.label}</span>
                              {subItem.badge !== undefined && subItem.badge > 0 && (
                                <Badge className="bg-white text-primary text-xs px-1.5 py-0">{subItem.badge}</Badge>
                              )}
                              {activeSection === subItem.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }
            })}
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

      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen
          ? isAr ? "mr-72" : "ml-72"
          : "mx-0"
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4" dir={isAr ? "rtl" : "ltr"}>
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
                  {getActiveItem()?.label || t.title}
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
                        !notification.read && "bg-primary/5",
                      )}
                      onClick={() => handleMarkNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-2", !notification.read && "bg-primary")} />
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

          {/* Media Library Section */}
          {activeSection === "media" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-pink-500/5 to-rose-500/5 border-2 border-pink-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <ImageIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {language === "ar" ? "مكتبة الوسائط" : "Media Library"}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === "ar"
                        ? "إدارة جميع الصور والملفات في موقعك"
                        : "Manage all images and files on your website"}
                    </p>
                  </div>
                </div>

                <MediaLibrary language={language} showActions={true} />
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
                    <Card key={app.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      {/* Header - Always visible */}
                      <div className="p-4 flex items-center justify-between border-b bg-muted/20">
                        <div className="flex items-center gap-3">
                          {app.photoFileUrl ? (
                            <img
                              src={app.photoFileUrl}
                              alt={app.fullName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-lg">{app.fullName}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-primary font-medium">{app.position}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{app.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              app.status === "pending" && "bg-yellow-500/10 text-yellow-600",
                              app.status === "accepted" && "bg-green-500/10 text-green-600",
                              app.status === "rejected" && "bg-red-500/10 text-red-600",
                              app.status === "reviewed" && "bg-blue-500/10 text-blue-600",
                            )}
                          >
                            {app.status === "pending" && (language === "ar" ? "قيد المراجعة" : "Pending")}
                            {app.status === "reviewed" && (language === "ar" ? "تمت المراجعة" : "Reviewed")}
                            {app.status === "accepted" && (language === "ar" ? "مقبول" : "Accepted")}
                            {app.status === "rejected" && (language === "ar" ? "مرفوض" : "Rejected")}
                          </Badge>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {new Date(app.submittedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                          </span>
                        </div>
                      </div>

                      {/* Accordion Sections */}
                      <Accordion type="multiple" className="px-4">
                        {/* Personal Info */}
                        <AccordionItem value="personal">
                          <AccordionTrigger className="text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4 text-indigo-500" />
                              {language === "ar" ? "المعلومات الشخصية" : "Personal Information"}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                                <p className="font-medium text-sm">{app.email || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "رقم الهوية" : "National ID"}</p>
                                <p className="font-medium text-sm">{app.nationalId}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "الجنس" : "Gender"}</p>
                                <p className="font-medium text-sm">{app.gender || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "تاريخ الميلاد" : "Birth Date"}</p>
                                <p className="font-medium text-sm">{app.birthDate || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "مكان الميلاد" : "Birth Place"}</p>
                                <p className="font-medium text-sm">{app.birthPlace || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "الحالة الاجتماعية" : "Marital Status"}</p>
                                <p className="font-medium text-sm">{app.maritalStatus || "-"}</p>
                              </div>
                              <div className="col-span-2 md:col-span-3">
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "العنوان" : "Address"}</p>
                                <p className="font-medium text-sm">{app.address || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "الراتب المتوقع" : "Expected Salary"}</p>
                                <p className="font-medium text-sm">{app.expectedSalary || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{language === "ar" ? "إمكانية المبيت" : "Can Stay Overnight"}</p>
                                <p className="font-medium text-sm">
                                  {app.canStayOvernight === "yes" ? (language === "ar" ? "نعم" : "Yes") :
                                    app.canStayOvernight === "no" ? (language === "ar" ? "لا" : "No") : "-"}
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Education */}
                        {app.education && app.education.length > 0 && app.education.some(e => e.degree || e.university) && (
                          <AccordionItem value="education">
                            <AccordionTrigger className="text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-blue-500" />
                                {language === "ar" ? "المؤهلات العلمية" : "Education"}
                                <Badge variant="secondary" className="text-xs ml-2">
                                  {app.education.filter(e => e.degree || e.university).length}
                                </Badge>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {app.education.filter(e => e.degree || e.university).map((edu, idx) => (
                                  <div key={idx} className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                                    <p className="font-medium text-sm">{edu.degree} {edu.major && `- ${edu.major}`}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {edu.university} {edu.graduationYear && `• ${edu.graduationYear}`} {edu.gpa && `• GPA: ${edu.gpa}`}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}

                        {/* Experience */}
                        {app.experience && app.experience.length > 0 && app.experience.some(e => e.institution || e.jobTitle) && (
                          <AccordionItem value="experience">
                            <AccordionTrigger className="text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-green-500" />
                                {language === "ar" ? "الخبرات العملية" : "Experience"}
                                <Badge variant="secondary" className="text-xs ml-2">
                                  {app.experience.filter(e => e.institution || e.jobTitle).length}
                                </Badge>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {app.experience.filter(e => e.institution || e.jobTitle).map((exp, idx) => (
                                  <div key={idx} className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                                    <p className="font-medium text-sm">{exp.jobTitle}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {exp.institution} {exp.duration && `• ${exp.duration}`}
                                    </p>
                                    {exp.responsibilities && (
                                      <p className="text-xs mt-1 text-muted-foreground">{exp.responsibilities}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}

                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <AccordionItem value="cover-letter">
                            <AccordionTrigger className="text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-500" />
                                {language === "ar" ? "خطاب التقديم" : "Cover Letter"}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">{app.coverLetter}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}

                        {/* Attachments */}
                        {(app.cvFileUrl || app.photoFileUrl) && (
                          <AccordionItem value="attachments">
                            <AccordionTrigger className="text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <Upload className="w-4 h-4 text-orange-500" />
                                {language === "ar" ? "المرفقات" : "Attachments"}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-wrap gap-2">
                                {app.cvFileUrl && (
                                  <a
                                    href={app.cvFileUrl}
                                    download={app.cvFileName || "cv"}
                                    className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors text-sm"
                                  >
                                    <FileText className="w-4 h-4 text-orange-600" />
                                    <span className="font-medium">{app.cvFileName || (language === "ar" ? "السيرة الذاتية" : "CV")}</span>
                                    <Download className="w-3 h-3 text-orange-600" />
                                  </a>
                                )}
                                {app.photoFileUrl && (
                                  <button
                                    onClick={() => window.open(app.photoFileUrl, "_blank")}
                                    className="flex items-center gap-2 px-3 py-2 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-950/50 transition-colors text-sm"
                                  >
                                    <Camera className="w-4 h-4 text-cyan-600" />
                                    <span className="font-medium">{language === "ar" ? "الصورة الشخصية" : "Photo"}</span>
                                    <Eye className="w-3 h-3 text-cyan-600" />
                                  </button>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}

                        {/* Custom Field Responses */}
                        {app.customFieldResponses && app.customFieldResponses.length > 0 && app.customFieldResponses.some(f => f.value) && (
                          <AccordionItem value="custom-fields">
                            <AccordionTrigger className="text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-teal-500" />
                                {language === "ar" ? "معلومات إضافية" : "Additional Information"}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-2">
                                {app.customFieldResponses.filter(f => f.value).map((field, idx) => {
                                  // Find the job to get the field label
                                  const job = jobs.find(j => (language === "ar" ? j.title : j.titleEn) === app.position)
                                  const customField = job?.customFields?.find(cf => cf.id === field.fieldId)
                                  const fieldLabel = customField
                                    ? (language === "ar" ? customField.labelAr : customField.labelEn)
                                    : field.fieldId
                                  const isFile = field.fileName || (field.value && field.value.startsWith("https://firebasestorage.googleapis.com"))

                                  return (
                                    <div key={idx} className="bg-muted/50 p-2 rounded-lg">
                                      <p className="text-xs text-muted-foreground">{fieldLabel}</p>
                                      {isFile ? (
                                        <a
                                          href={field.value}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          download={field.fileName}
                                          className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/30 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-950/50 transition-colors text-sm font-medium text-teal-700 dark:text-teal-400"
                                        >
                                          <Download className="w-4 h-4" />
                                          {field.fileName || (language === "ar" ? "تحميل الملف" : "Download File")}
                                        </a>
                                      ) : (
                                        <p className="font-medium text-sm">{field.value}</p>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>

                      {/* Actions - Always visible */}
                      <div className="flex flex-wrap gap-2 p-4 border-t bg-muted/10">
                        {app.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={async () => {
                                await updateEnhancedEmploymentApplication(app.id, { status: "accepted" })
                                setEmploymentApplications(await getEnhancedEmploymentApplications())
                              }}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              {language === "ar" ? "قبول" : "Accept"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                await updateEnhancedEmploymentApplication(app.id, { status: "rejected" })
                                setEmploymentApplications(await getEnhancedEmploymentApplications())
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              {language === "ar" ? "رفض" : "Reject"}
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            if (confirm(language === "ar" ? "هل تريد حذف هذا الطلب؟" : "Delete this application?")) {
                              await deleteEnhancedEmploymentApplication(app.id)
                              setEmploymentApplications(await getEnhancedEmploymentApplications())
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                              <h3 className="font-bold text-xl">{req.name}</h3>
                              <p className="text-sm text-muted-foreground">{req.email}</p>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              req.status === "pending" && "bg-yellow-500/10 text-yellow-600",
                              req.status === "contacted" && "bg-blue-500/10 text-blue-600",
                              req.status === "completed" && "bg-green-500/10 text-green-600",
                              req.status === "cancelled" && "bg-red-500/10 text-red-600",
                            )}
                          >
                            {req.status === "pending" && (language === "ar" ? "قيد الانتظار" : "Pending")}
                            {req.status === "contacted" && (language === "ar" ? "تم التواصل" : "Contacted")}
                            {req.status === "completed" && (language === "ar" ? "مكتمل" : "Completed")}
                            {req.status === "cancelled" && (language === "ar" ? "ملغي" : "Cancelled")}
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
                                onClick={async () => {
                                  await updateServiceRequest(req.id, { status: "contacted" })
                                  setServiceRequests(await getServiceRequests())
                                }}
                                className="bg-blue-500 hover:bg-blue-600"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                {language === "ar" ? "تم التواصل" : "Contacted"}
                              </Button>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  await updateServiceRequest(req.id, { status: "completed" })
                                  setServiceRequests(await getServiceRequests())
                                }}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {language === "ar" ? "مكتمل" : "Complete"}
                              </Button>
                            </>
                          )}
                          {req.status === "contacted" && (
                            <Button
                              size="sm"
                              onClick={async () => {
                                await updateServiceRequest(req.id, { status: "completed" })
                                setServiceRequests(await getServiceRequests())
                              }}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {language === "ar" ? "مكتمل" : "Complete"}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (confirm(language === "ar" ? "هل تريد حذف هذا الطلب؟" : "Delete this request?")) {
                                await deleteServiceRequest(req.id)
                                setServiceRequests(await getServiceRequests())
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

          {/* Forms Section */}
          {activeSection === "forms" && !selectedFormForSubmissions && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  {language === "ar" ? "النماذج" : "Forms"}
                </h2>
                <Button
                  onClick={() => {
                    setEditingForm({
                      id: "",
                      titleAr: "",
                      titleEn: "",
                      descriptionAr: "",
                      descriptionEn: "",
                      isActive: true,
                      fields: [],
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    })
                    setIsFormDialogOpen(true)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "ar" ? "إنشاء نموذج جديد" : "Create New Form"}
                </Button>
              </div>

              <div className="grid gap-4">
                {forms.length === 0 ? (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد نماذج بعد" : "No forms yet"}
                    </p>
                  </Card>
                ) : (
                  forms.map((form) => {
                    const submissions = formSubmissions.filter((s) => s.formId === form.id)
                    return (
                      <Card key={form.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                          <div className="flex-1 space-y-3 w-full">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl">
                                  {language === "ar" ? form.titleAr : form.titleEn}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {language === "ar" ? form.descriptionAr : form.descriptionEn}
                                </p>
                              </div>
                              <Badge variant={form.isActive ? "default" : "secondary"}>
                                {form.isActive
                                  ? (language === "ar" ? "نشط" : "Active")
                                  : (language === "ar" ? "غير نشط" : "Inactive")}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  {language === "ar" ? "عدد الحقول" : "Fields"}
                                </p>
                                <p className="font-medium">{form.fields.length}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  {language === "ar" ? "عدد الطلبات" : "Submissions"}
                                </p>
                                <p className="font-medium">{submissions.length}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  {language === "ar" ? "طلبات جديدة" : "New"}
                                </p>
                                <p className="font-medium text-green-600">
                                  {submissions.filter((s) => s.status === "new").length}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setEditingForm(form)
                                setIsFormDialogOpen(true)
                              }}
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              {language === "ar" ? "تعديل" : "Edit"}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewSubmissions(form.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {language === "ar" ? "عرض الطلبات" : "View Submissions"}
                            </Button>

                            <Button
                              variant={form.isActive ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleFormActive(form.id)}
                            >
                              {form.isActive ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  {language === "ar" ? "تعطيل" : "Deactivate"}
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {language === "ar" ? "تفعيل" : "Activate"}
                                </>
                              )}
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteForm(form.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* Form Submissions View */}
          {activeSection === "forms" && selectedFormForSubmissions && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFormForSubmissions(null)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {language === "ar" ? "رجوع" : "Back"}
                </Button>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  {language === "ar"
                    ? forms.find((f) => f.id === selectedFormForSubmissions)?.titleAr
                    : forms.find((f) => f.id === selectedFormForSubmissions)?.titleEn}
                </h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {formSubmissions.filter((s) => s.formId === selectedFormForSubmissions).length}{" "}
                  {language === "ar" ? "طلب" : "submissions"}
                </Badge>
              </div>

              <div className="grid gap-4">
                {formSubmissions.filter((s) => s.formId === selectedFormForSubmissions).length === 0 ? (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ar" ? "لا توجد طلبات بعد" : "No submissions yet"}
                    </p>
                  </Card>
                ) : (
                  formSubmissions
                    .filter((s) => s.formId === selectedFormForSubmissions)
                    .map((submission) => (
                      <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                          <div className="flex-1 space-y-3 w-full">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-xl">
                                    {language === "ar" ? "طلب #" : "Submission #"}
                                    {submission.id.slice(0, 8)}
                                  </h3>
                                  <Badge
                                    variant={
                                      submission.status === "new"
                                        ? "default"
                                        : submission.status === "read"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {submission.status === "new"
                                      ? (language === "ar" ? "جديد" : "New")
                                      : submission.status === "read"
                                        ? (language === "ar" ? "مقروء" : "Read")
                                        : (language === "ar" ? "مؤرشف" : "Archived")}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(submission.submittedAt).toLocaleString(
                                    language === "ar" ? "ar-EG" : "en-US"
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                              {Object.entries(submission.data).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-3 gap-2">
                                  <p className="text-sm font-medium text-muted-foreground">{key}:</p>
                                  <p className="text-sm col-span-2">{String(value)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            {submission.status === "new" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleUpdateSubmissionStatus(submission.id, "read")}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                {language === "ar" ? "تعليم كمقروء" : "Mark as Read"}
                              </Button>
                            )}

                            {submission.status !== "archived" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateSubmissionStatus(submission.id, "archived")}
                              >
                                <Database className="w-4 h-4 mr-2" />
                                {language === "ar" ? "أرشفة" : "Archive"}
                              </Button>
                            )}

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteSubmission(submission.id)}
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
                              <p className="font-medium">{new Date(msg.submittedAt).toLocaleDateString("ar-EG")}</p>
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
                            onClick={async () => {
                              if (confirm(language === "ar" ? "هل تريد حذف هذه الرسالة؟" : "Delete this message?")) {
                                await deleteContactMessage(msg.id)
                                setMessages(await getContactMessages()) // Refresh messages
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
            <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
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
                            {review.image ? (
                              <img
                                src={review.image}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-amber-200 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-xl">{review.name}</h3>
                                <Badge className="bg-amber-500 hover:bg-amber-600 flex-shrink-0">
                                  {language === "ar" ? "معلق" : "Pending"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 flex-shrink-0 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-base bg-muted/30 p-4 rounded-lg text-start">{review.comment}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                            </span>
                          </div>
                        </div>

                        <div className={cn("flex flex-col gap-2 w-full md:w-auto", isAr && "md:mr-4")}>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              handleApprovePendingReview(review.id)
                            }}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {language === "ar" ? "موافقة" : "Approve"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(language === "ar" ? "هل تريد رفض هذا الرأي؟" : "Reject this review?")) {
                                handleRejectPendingReview(review.id)
                              }
                            }}
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
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

          {/* Reviews Section - Approved & Rejected */}
          {activeSection === "reviews" && (
            <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{language === "ar" ? "التقييمات" : "Reviews"}</h2>
                  <p className="text-muted-foreground mt-1">
                    {language === "ar" ? "إدارة التقييمات المعتمدة والمرفوضة" : "Manage approved and rejected reviews"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{testimonials.length} {language === "ar" ? "معتمد" : "Approved"}</span>
                  </Badge>
                  <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center gap-1">
                    <X className="w-4 h-4 text-red-500" />
                    <span>{rejectedReviews.length} {language === "ar" ? "مرفوض" : "Rejected"}</span>
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="approved" className="w-full">
                <TabsList className={cn("grid w-full grid-cols-2 max-w-md", isAr && "mr-auto ml-0")}>
                  <TabsTrigger value="approved" className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {language === "ar" ? "معتمدة" : "Approved"}
                    <Badge variant="secondary">{testimonials.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    {language === "ar" ? "مرفوضة" : "Rejected"}
                    <Badge variant="secondary">{rejectedReviews.length}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="approved" className="mt-6">
                  <div className="grid gap-4">
                    {testimonials.length === 0 ? (
                      <Card className="p-12 text-center">
                        <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          {language === "ar" ? "لا توجد تقييمات معتمدة" : "No approved reviews"}
                        </p>
                      </Card>
                    ) : (
                      testimonials.map((review) => (
                        <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div className="flex-1 space-y-3 w-full">
                              <div className="flex items-center gap-3">
                                {review.image ? (
                                  <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-green-200 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-xl">{review.name}</h3>
                                    <Badge className="bg-green-500 hover:bg-green-600 flex-shrink-0">
                                      {language === "ar" ? "معتمد" : "Approved"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 flex-shrink-0 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-base bg-muted/30 p-4 rounded-lg text-start">{review.comment}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                                </span>
                              </div>
                            </div>

                            <div className={cn("flex flex-col gap-2 w-full md:w-auto", isAr && "md:mr-4")}>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm(language === "ar" ? "هل تريد رفض هذا الرأي؟" : "Reject this review?")) {
                                    handleRejectApprovedReview(review.id)
                                  }
                                }}
                                className="flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                {language === "ar" ? "رفض" : "Reject"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm(language === "ar" ? "هل تريد حذف هذا الرأي نهائياً؟" : "Permanently delete this review?")) {
                                    handleDeleteApprovedReview(review.id)
                                  }
                                }}
                                className="flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                {language === "ar" ? "حذف" : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  <div className="grid gap-4">
                    {rejectedReviews.length === 0 ? (
                      <Card className="p-12 text-center">
                        <X className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          {language === "ar" ? "لا توجد تقييمات مرفوضة" : "No rejected reviews"}
                        </p>
                      </Card>
                    ) : (
                      rejectedReviews.map((review) => (
                        <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div className="flex-1 space-y-3 w-full">
                              <div className="flex items-center gap-3">
                                {review.image ? (
                                  <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-red-200 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-xl">{review.name}</h3>
                                    <Badge variant="destructive" className="flex-shrink-0">
                                      {language === "ar" ? "مرفوض" : "Rejected"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 flex-shrink-0 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-base bg-muted/30 p-4 rounded-lg text-start">{review.comment}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.submittedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                                </span>
                              </div>
                            </div>

                            <div className={cn("flex flex-col gap-2 w-full md:w-auto", isAr && "md:mr-4")}>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveRejectedReview(review.id)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                {language === "ar" ? "موافقة" : "Approve"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm(language === "ar" ? "هل تريد حذف هذا الرأي نهائياً؟" : "Permanently delete this review?")) {
                                    handleDeleteRejectedReview(review.id)
                                  }
                                }}
                                className="flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                {language === "ar" ? "حذف" : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportPage}
                      className="hidden"
                      id="import-page-input"
                    />
                    <Button
                      onClick={() => document.getElementById("import-page-input")?.click()}
                      size="lg"
                      variant="outline"
                      className="border-violet-500/50 hover:bg-violet-500/10"
                    >
                      <Upload className="w-5 h-5 ml-2" />
                      {language === "ar" ? "استيراد JSON" : "Import JSON"}
                    </Button>
                    <Button
                      onClick={() => router.push("/dashboard/pages/new")}
                      size="lg"
                      className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      {language === "ar" ? "إضافة صفحة جديدة" : "Add New Page"}
                    </Button>
                  </div>
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
                            {page.isHome && (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-xs font-bold">
                                  {language === "ar" ? "الرئيسية" : "Homepage"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {!page.image && page.isHome && (
                          <div className="mb-4">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600">
                              <Star className="w-3 h-3 fill-current mr-1" />
                              {language === "ar" ? "الرئيسية" : "Homepage"}
                            </Badge>
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
                          {!page.isHome && (
                            <Button
                              onClick={() => handleSetHomepage(page.id)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-colors"
                              title={language === "ar" ? "تعيين كصفحة رئيسية" : "Set as homepage"}
                            >
                              <Home className="w-4 h-4" />
                            </Button>
                          )}
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
                            onClick={() => handleExportPage(page)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                            title={language === "ar" ? "تصدير JSON" : "Export JSON"}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeletePage(page.id)}
                            variant="destructive"
                            size="sm"
                            className="hover:scale-105 transition-transform"
                            disabled={page.isHome}
                            title={page.isHome ? (language === "ar" ? "لا يمكن حذف الصفحة الرئيسية" : "Cannot delete homepage") : ""}
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

          {/* Settings Section */}
          {activeSection === "settings" && headerSettings && footerSettings && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card className="p-8 bg-gradient-to-br from-slate-500/5 to-slate-600/5 border-2 border-slate-500/10">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Settings className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-foreground">
                          {language === "ar" ? "الإعدادات" : "Settings"}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                          {language === "ar" ? "تخصيص مظهر وسلوك موقعك" : "Customize your site's appearance and behavior"}
                        </p>
                      </div>
                    </div>

                    {/* Save & Reset Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleResetAllSettings}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        {language === "ar" ? "إعادة تعيين الكل" : "Reset All"}
                      </Button>
                      <Button
                        onClick={handleSaveAllSettings}
                        size="lg"
                        className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                      >
                        <Save className="w-5 h-5" />
                        {language === "ar" ? "حفظ جميع التغييرات" : "Save All Changes"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} dir={language === "ar" ? "rtl" : "ltr"}>
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="general" className="gap-2">
                      <Settings className="w-4 h-4" />
                      {language === "ar" ? "عام" : "General"}
                    </TabsTrigger>
                    <TabsTrigger value="header" className="gap-2">
                      <Layout className="w-4 h-4" />
                      {language === "ar" ? "الهيدر" : "Header"}
                    </TabsTrigger>
                    <TabsTrigger value="footer" className="gap-2">
                      <MenuIcon className="w-4 h-4" />
                      {language === "ar" ? "الفوتر" : "Footer"}
                    </TabsTrigger>
                    <TabsTrigger value="maintenance" className="gap-2">
                      <Wrench className="w-4 h-4" />
                      {language === "ar" ? "الصيانة" : "Maintenance"}
                    </TabsTrigger>
                  </TabsList>

                  {/* General Settings Tab */}
                  <TabsContent value="general" className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">{language === "ar" ? "الإعدادات العامة" : "General Settings"}</h2>
                        <Button onClick={handleResetGeneral} variant="outline" size="sm" className="gap-2">
                          <RotateCcw className="w-4 h-4" />
                          {language === "ar" ? "إعادة تعيين" : "Reset"}
                        </Button>
                      </div>

                      {generalSettings && (
                        <div className="space-y-8">
                          {/* Site Identity */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "هوية الموقع" : "Site Identity"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "اسم الموقع (عربي)" : "Site Name (Arabic)"}</Label>
                                <Input
                                  value={generalSettings.siteName}
                                  onChange={(e) => updateGeneralSettings({ siteName: e.target.value })}
                                  dir="rtl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "اسم الموقع (إنجليزي)" : "Site Name (English)"}</Label>
                                <Input
                                  value={generalSettings.siteNameEn}
                                  onChange={(e) => updateGeneralSettings({ siteNameEn: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "الشعار (عربي)" : "Tagline (Arabic)"}</Label>
                                <Input
                                  value={generalSettings.siteTagline}
                                  onChange={(e) => updateGeneralSettings({ siteTagline: e.target.value })}
                                  dir="rtl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "الشعار (إنجليزي)" : "Tagline (English)"}</Label>
                                <Input
                                  value={generalSettings.siteTaglineEn}
                                  onChange={(e) => updateGeneralSettings({ siteTaglineEn: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "شعار الموقع" : "Site Logo"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={generalSettings.siteLogo}
                                    onChange={(e) => updateGeneralSettings({ siteLogo: e.target.value })}
                                    placeholder="/logo.webp"
                                    className="flex-1"
                                  />
                                  <MediaPicker
                                    onSelect={(item) => updateGeneralSettings({ siteLogo: item.url })}
                                    language={language}
                                    filterType="image"
                                    trigger={
                                      <Button type="button" variant="outline" className="h-12 px-6 text-base gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        {language === "ar" ? "اختر من المكتبة" : "Select from Library"}
                                      </Button>
                                    }
                                  />
                                </div>
                                {generalSettings.siteLogo && (
                                  <img src={generalSettings.siteLogo} alt="Logo" className="h-12 mt-2 object-contain" />
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "أيقونة الموقع" : "Favicon"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={generalSettings.favicon}
                                    onChange={(e) => updateGeneralSettings({ favicon: e.target.value })}
                                    placeholder="/favicon.ico"
                                    className="flex-1"
                                  />
                                  <MediaPicker
                                    onSelect={(item) => updateGeneralSettings({ favicon: item.url })}
                                    language={language}
                                    filterType="image"
                                    trigger={
                                      <Button type="button" variant="outline" className="h-12 px-6 text-base gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        {language === "ar" ? "اختر من المكتبة" : "Select from Library"}
                                      </Button>
                                    }
                                  />
                                </div>
                                {generalSettings.favicon && (
                                  <img src={generalSettings.favicon} alt="Favicon" className="h-8 mt-2 object-contain" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Localization */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "الإعدادات المحلية" : "Localization"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "اللغة الافتراضية" : "Default Language"}</Label>
                                <select
                                  className="w-full p-2 border rounded-md bg-background"
                                  value={generalSettings.defaultLanguage}
                                  onChange={(e) => updateGeneralSettings({ defaultLanguage: e.target.value as "ar" | "en" })}
                                >
                                  <option value="ar">{language === "ar" ? "العربية" : "Arabic"}</option>
                                  <option value="en">{language === "ar" ? "الإنجليزية" : "English"}</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "المنطقة الزمنية" : "Time Zone"}</Label>
                                <select
                                  className="w-full p-2 border rounded-md bg-background"
                                  value={generalSettings.timeZone}
                                  onChange={(e) => updateGeneralSettings({ timeZone: e.target.value })}
                                >
                                  <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                                  <option value="Asia/Kuwait">Asia/Kuwait (GMT+3)</option>
                                  <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                                  <option value="Europe/London">Europe/London (GMT+0)</option>
                                  <option value="America/New_York">America/New_York (GMT-5)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "تنسيق التاريخ" : "Date Format"}</Label>
                                <select
                                  className="w-full p-2 border rounded-md bg-background"
                                  value={generalSettings.dateFormat}
                                  onChange={(e) => updateGeneralSettings({ dateFormat: e.target.value })}
                                >
                                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Copyright */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "حقوق النشر" : "Copyright"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "نص حقوق النشر (عربي)" : "Copyright Text (Arabic)"}</Label>
                                <Input
                                  value={generalSettings.copyrightText}
                                  onChange={(e) => updateGeneralSettings({ copyrightText: e.target.value })}
                                  dir="rtl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "نص حقوق النشر (إنجليزي)" : "Copyright Text (English)"}</Label>
                                <Input
                                  value={generalSettings.copyrightTextEn}
                                  onChange={(e) => updateGeneralSettings({ copyrightTextEn: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>

                          {/* SEO */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "تحسين محركات البحث (SEO)" : "SEO Settings"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                                <Textarea
                                  value={generalSettings.seoDescription}
                                  onChange={(e) => updateGeneralSettings({ seoDescription: e.target.value })}
                                  dir="rtl"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                                <Textarea
                                  value={generalSettings.seoDescriptionEn}
                                  onChange={(e) => updateGeneralSettings({ seoDescriptionEn: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "الكلمات المفتاحية (عربي)" : "Keywords (Arabic)"}</Label>
                                <Input
                                  value={generalSettings.seoKeywords}
                                  onChange={(e) => updateGeneralSettings({ seoKeywords: e.target.value })}
                                  dir="rtl"
                                  placeholder={language === "ar" ? "كلمة1، كلمة2، كلمة3" : "keyword1, keyword2, keyword3"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "الكلمات المفتاحية (إنجليزي)" : "Keywords (English)"}</Label>
                                <Input
                                  value={generalSettings.seoKeywordsEn}
                                  onChange={(e) => updateGeneralSettings({ seoKeywordsEn: e.target.value })}
                                  placeholder="keyword1, keyword2, keyword3"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Analytics */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "التحليلات" : "Analytics"}</h3>
                            <div className="space-y-2">
                              <Label>{language === "ar" ? "معرف Google Analytics" : "Google Analytics ID"}</Label>
                              <Input
                                value={generalSettings.googleAnalyticsId}
                                onChange={(e) => updateGeneralSettings({ googleAnalyticsId: e.target.value })}
                                placeholder="G-XXXXXXXXXX"
                              />
                            </div>
                          </div>

                          {/* Theme Colors */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "ألوان السمة" : "Theme Colors"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "اللون الأساسي" : "Primary Color"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={generalSettings.primaryColor}
                                    onChange={(e) => updateGeneralSettings({ primaryColor: e.target.value })}
                                    className="w-16 h-10 p-1"
                                  />
                                  <Input
                                    value={generalSettings.primaryColor}
                                    onChange={(e) => updateGeneralSettings({ primaryColor: e.target.value })}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "اللون الثانوي" : "Secondary Color"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={generalSettings.secondaryColor}
                                    onChange={(e) => updateGeneralSettings({ secondaryColor: e.target.value })}
                                    className="w-16 h-10 p-1"
                                  />
                                  <Input
                                    value={generalSettings.secondaryColor}
                                    onChange={(e) => updateGeneralSettings({ secondaryColor: e.target.value })}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Social Media Links */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{language === "ar" ? "روابط التواصل الاجتماعي" : "Social Media Links"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Facebook</Label>
                                <Input
                                  value={generalSettings.socialLinks.facebook}
                                  onChange={(e) => updateGeneralSocialLinks({ facebook: e.target.value })}
                                  placeholder="https://facebook.com/..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Twitter / X</Label>
                                <Input
                                  value={generalSettings.socialLinks.twitter}
                                  onChange={(e) => updateGeneralSocialLinks({ twitter: e.target.value })}
                                  placeholder="https://twitter.com/..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Instagram</Label>
                                <Input
                                  value={generalSettings.socialLinks.instagram}
                                  onChange={(e) => updateGeneralSocialLinks({ instagram: e.target.value })}
                                  placeholder="https://instagram.com/..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>LinkedIn</Label>
                                <Input
                                  value={generalSettings.socialLinks.linkedin}
                                  onChange={(e) => updateGeneralSocialLinks({ linkedin: e.target.value })}
                                  placeholder="https://linkedin.com/..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>YouTube</Label>
                                <Input
                                  value={generalSettings.socialLinks.youtube}
                                  onChange={(e) => updateGeneralSocialLinks({ youtube: e.target.value })}
                                  placeholder="https://youtube.com/..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>WhatsApp</Label>
                                <Input
                                  value={generalSettings.socialLinks.whatsapp}
                                  onChange={(e) => updateGeneralSocialLinks({ whatsapp: e.target.value })}
                                  placeholder="https://wa.me/..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>TikTok</Label>
                                <Input
                                  value={generalSettings.socialLinks.tiktok}
                                  onChange={(e) => updateGeneralSocialLinks({ tiktok: e.target.value })}
                                  placeholder="https://tiktok.com/..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </TabsContent>

                  <TabsContent value="header" className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">{language === "ar" ? "إعدادات الهيدر" : "Header Settings"}</h2>
                        <Button onClick={handleResetHeader} variant="outline" size="sm" className="gap-2">
                          <RotateCcw className="w-4 h-4" />
                          {language === "ar" ? "إعادة تعيين الهيدر" : "Reset Header"}
                        </Button>
                      </div>

                      <HeaderEditorContent
                        settings={headerSettings}
                        isAr={language === "ar"}
                        updateSettings={updateHeaderSettings}
                        updateStyle={updateHeaderStyle}
                        updateCtaButton={updateHeaderCtaButton}
                        updateContactInfo={updateHeaderContactInfo}
                        addMenuItem={addMenuItem}
                        updateMenuItem={updateMenuItem}
                        deleteMenuItem={deleteMenuItem}
                        moveMenuItem={moveMenuItem}
                      />
                    </Card>
                  </TabsContent>

                  <TabsContent value="footer" className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">{language === "ar" ? "إعدادات الفوتر" : "Footer Settings"}</h2>
                        <Button onClick={handleResetFooter} variant="outline" size="sm" className="gap-2">
                          <RotateCcw className="w-4 h-4" />
                          {language === "ar" ? "إعادة تعيين الفوتر" : "Reset Footer"}
                        </Button>
                      </div>

                      <FooterEditorContent
                        settings={footerSettings}
                        isAr={language === "ar"}
                        updateSettings={updateFooterSettings}
                        updateStyle={updateFooterStyle}
                        updateSocialMedia={updateFooterSocialMedia}
                        updateContactInfo={updateFooterContactInfo}
                        addColumn={addFooterColumn}
                        updateColumn={updateFooterColumn}
                        deleteColumn={deleteFooterColumn}
                        moveColumn={moveFooterColumn}
                      />
                    </Card>
                  </TabsContent>

                  <TabsContent value="maintenance" className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">{language === "ar" ? "إعدادات الصيانة" : "Maintenance Settings"}</h2>
                      </div>

                      {maintenanceSettings && (
                        <div className="space-y-8">
                          {/* Main Toggle */}
                          <div className="p-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${maintenanceSettings.enabled ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                  <Wrench className={`w-6 h-6 ${maintenanceSettings.enabled ? 'text-white' : 'text-gray-500'}`} />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold">
                                    {language === "ar" ? "وضع الصيانة" : "Maintenance Mode"}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {maintenanceSettings.enabled
                                      ? (language === "ar" ? "الموقع حالياً في وضع الصيانة - الزوار سيرون صفحة الصيانة" : "Site is currently in maintenance mode - visitors will see the maintenance page")
                                      : (language === "ar" ? "الموقع متاح للجميع" : "Site is accessible to everyone")
                                    }
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={maintenanceSettings.enabled}
                                onCheckedChange={toggleMaintenanceMode}
                              />
                            </div>
                          </div>

                          {/* Content Settings */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">
                              {language === "ar" ? "محتوى الصفحة" : "Page Content"}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                                <Input
                                  value={maintenanceSettings.titleAr}
                                  onChange={(e) => updateMaintenanceSettings({ titleAr: e.target.value })}
                                  dir="rtl"
                                />
                              </div>
                              <div>
                                <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                                <Input
                                  value={maintenanceSettings.titleEn}
                                  onChange={(e) => updateMaintenanceSettings({ titleEn: e.target.value })}
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>{language === "ar" ? "الرسالة (عربي)" : "Message (Arabic)"}</Label>
                                <Textarea
                                  value={maintenanceSettings.messageAr}
                                  onChange={(e) => updateMaintenanceSettings({ messageAr: e.target.value })}
                                  rows={3}
                                  dir="rtl"
                                />
                              </div>
                              <div>
                                <Label>{language === "ar" ? "الرسالة (إنجليزي)" : "Message (English)"}</Label>
                                <Textarea
                                  value={maintenanceSettings.messageEn}
                                  onChange={(e) => updateMaintenanceSettings({ messageEn: e.target.value })}
                                  rows={3}
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Countdown Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {language === "ar" ? "العد التنازلي" : "Countdown"}
                              </h3>
                              <Switch
                                checked={maintenanceSettings.showCountdown}
                                onCheckedChange={(checked) => updateMaintenanceSettings({ showCountdown: checked })}
                              />
                            </div>

                            {maintenanceSettings.showCountdown && (
                              <div>
                                <Label>{language === "ar" ? "تاريخ الانتهاء المتوقع" : "Expected End Date"}</Label>
                                <Input
                                  type="datetime-local"
                                  value={maintenanceSettings.countdownDate?.slice(0, 16) || ""}
                                  onChange={(e) => updateMaintenanceSettings({ countdownDate: new Date(e.target.value).toISOString() })}
                                />
                              </div>
                            )}
                          </div>

                          {/* Contact Info Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {language === "ar" ? "معلومات التواصل" : "Contact Information"}
                              </h3>
                              <Switch
                                checked={maintenanceSettings.showContactInfo}
                                onCheckedChange={(checked) => updateMaintenanceSettings({ showContactInfo: checked })}
                              />
                            </div>

                            {maintenanceSettings.showContactInfo && (
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Label>{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                                  <Input
                                    type="email"
                                    value={maintenanceSettings.contactEmail || ""}
                                    onChange={(e) => updateMaintenanceSettings({ contactEmail: e.target.value })}
                                    placeholder="support@example.com"
                                  />
                                </div>
                                <div>
                                  <Label>{language === "ar" ? "رقم الهاتف" : "Phone"}</Label>
                                  <Input
                                    type="tel"
                                    value={maintenanceSettings.contactPhone || ""}
                                    onChange={(e) => updateMaintenanceSettings({ contactPhone: e.target.value })}
                                    placeholder="+966 XX XXX XXXX"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Social Links Toggle */}
                          <div className="flex items-center justify-between border-t pt-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {language === "ar" ? "روابط التواصل الاجتماعي" : "Social Media Links"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {language === "ar" ? "عرض أيقونات التواصل الاجتماعي" : "Show social media icons"}
                              </p>
                            </div>
                            <Switch
                              checked={maintenanceSettings.showSocialLinks}
                              onCheckedChange={(checked) => updateMaintenanceSettings({ showSocialLinks: checked })}
                            />
                          </div>

                          {/* Appearance Settings */}
                          <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <Palette className="w-5 h-5" />
                              {language === "ar" ? "المظهر" : "Appearance"}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "رابط الشعار" : "Logo URL"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={maintenanceSettings.logoImage || ""}
                                    onChange={(e) => updateMaintenanceSettings({ logoImage: e.target.value })}
                                    placeholder="/logo.webp"
                                    className="flex-1"
                                  />
                                  <MediaPicker
                                    onSelect={(item) => updateMaintenanceSettings({ logoImage: item.url })}
                                    language={language}
                                    filterType="image"
                                    trigger={
                                      <Button type="button" variant="outline" size="icon">
                                        <ImageIcon className="h-4 w-4" />
                                      </Button>
                                    }
                                  />
                                </div>
                                {maintenanceSettings.logoImage && (
                                  <img src={maintenanceSettings.logoImage} alt="Logo" className="h-12 mt-2 object-contain" />
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>{language === "ar" ? "صورة الخلفية (اختياري)" : "Background Image (optional)"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={maintenanceSettings.backgroundImage || ""}
                                    onChange={(e) => updateMaintenanceSettings({ backgroundImage: e.target.value })}
                                    placeholder="/maintenance-bg.jpg"
                                    className="flex-1"
                                  />
                                  <MediaPicker
                                    onSelect={(item) => updateMaintenanceSettings({ backgroundImage: item.url })}
                                    language={language}
                                    filterType="image"
                                    trigger={
                                      <Button type="button" variant="outline" size="icon">
                                        <ImageIcon className="h-4 w-4" />
                                      </Button>
                                    }
                                  />
                                </div>
                                {maintenanceSettings.backgroundImage && (
                                  <img src={maintenanceSettings.backgroundImage} alt="Background" className="h-20 mt-2 object-cover rounded" />
                                )}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>{language === "ar" ? "اللون الأساسي" : "Primary Color"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={maintenanceSettings.primaryColor}
                                    onChange={(e) => updateMaintenanceSettings({ primaryColor: e.target.value })}
                                    className="w-16 h-10 p-1 cursor-pointer"
                                  />
                                  <Input
                                    value={maintenanceSettings.primaryColor}
                                    onChange={(e) => updateMaintenanceSettings({ primaryColor: e.target.value })}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>{language === "ar" ? "اللون الثانوي" : "Secondary Color"}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={maintenanceSettings.secondaryColor}
                                    onChange={(e) => updateMaintenanceSettings({ secondaryColor: e.target.value })}
                                    className="w-16 h-10 p-1 cursor-pointer"
                                  />
                                  <Input
                                    value={maintenanceSettings.secondaryColor}
                                    onChange={(e) => updateMaintenanceSettings({ secondaryColor: e.target.value })}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Preview Button */}
                          <div className="flex justify-center pt-4">
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={() => setIsMaintenancePreviewOpen(true)}
                            >
                              <Eye className="w-4 h-4" />
                              {language === "ar" ? "معاينة صفحة الصيانة" : "Preview Maintenance Page"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}

          {/* ... existing sections ... */}
        </div>
      </main>

      {/* Maintenance Preview Dialog */}
      <Dialog open={isMaintenancePreviewOpen} onOpenChange={setIsMaintenancePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>
              {language === "ar" ? "معاينة صفحة الصيانة" : "Maintenance Page Preview"}
            </DialogTitle>
          </DialogHeader>
          {maintenanceSettings && (
            <div
              className="relative overflow-auto"
              style={{ height: "70vh" }}
            >
              <div
                className="min-h-full flex flex-col items-center justify-center p-8"
                style={{
                  background: maintenanceSettings.backgroundImage
                    ? `url(${maintenanceSettings.backgroundImage}) center/cover`
                    : `linear-gradient(135deg, ${maintenanceSettings.primaryColor} 0%, ${maintenanceSettings.secondaryColor} 100%)`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="relative z-10 text-center max-w-xl mx-auto">
                  {/* Logo */}
                  {maintenanceSettings.logoImage && (
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <Image
                        src={maintenanceSettings.logoImage}
                        alt="Logo"
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${maintenanceSettings.primaryColor}40` }}
                    >
                      <Wrench className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                    {language === "ar" ? maintenanceSettings.titleAr : maintenanceSettings.titleEn}
                  </h1>

                  {/* Message */}
                  <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    {language === "ar" ? maintenanceSettings.messageAr : maintenanceSettings.messageEn}
                  </p>

                  {/* Countdown Preview */}
                  {maintenanceSettings.showCountdown && (
                    <div className="mb-6">
                      <div className="flex justify-center gap-3">
                        {[
                          { value: "00", label: language === "ar" ? "يوم" : "Days" },
                          { value: "00", label: language === "ar" ? "ساعة" : "Hours" },
                          { value: "00", label: language === "ar" ? "دقيقة" : "Min" },
                          { value: "00", label: language === "ar" ? "ثانية" : "Sec" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="bg-white/20 backdrop-blur-sm rounded-lg p-2 min-w-[50px] border border-white/20"
                          >
                            <div className="text-xl font-bold text-white">{item.value}</div>
                            <div className="text-xs text-white/80">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  {maintenanceSettings.showContactInfo && (maintenanceSettings.contactEmail || maintenanceSettings.contactPhone) && (
                    <div className="mb-6 space-y-2">
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {maintenanceSettings.contactEmail && (
                          <span className="flex items-center gap-2 text-white bg-white/10 px-3 py-1.5 rounded-full text-sm">
                            <Mail className="w-4 h-4" />
                            {maintenanceSettings.contactEmail}
                          </span>
                        )}
                        {maintenanceSettings.contactPhone && (
                          <span className="flex items-center gap-2 text-white bg-white/10 px-3 py-1.5 rounded-full text-sm">
                            <Phone className="w-4 h-4" />
                            {maintenanceSettings.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links Preview */}
                  {maintenanceSettings.showSocialLinks && (
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-white/20 border border-white/20"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

              <div className="space-y-2">
                <Label>{language === "ar" ? "صورة الصفحة" : "Page Image"}</Label>
                <div className="flex gap-2">
                  <Input
                    value={editingPage.image || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, image: e.target.value })}
                    placeholder={language === "ar" ? "رابط الصورة" : "Image URL"}
                    className="flex-1"
                  />
                  <MediaPicker
                    onSelect={(item) => setEditingPage({ ...editingPage, image: item.url })}
                    language={language}
                    filterType="image"
                    trigger={
                      <Button type="button" variant="outline" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
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
              <div className="flex gap-2">
                <Input
                  value={editingHeroSlide?.image || ""}
                  onChange={(e) =>
                    setEditingHeroSlide(
                      editingHeroSlide ? { ...editingHeroSlide, image: e.target.value } : ({} as HeroSlide),
                    )
                  }
                  placeholder="https://..."
                  className="flex-1"
                />
                <MediaPicker
                  onSelect={(item) => setEditingHeroSlide(editingHeroSlide ? { ...editingHeroSlide, image: item.url } : ({} as HeroSlide))}
                  language={language}
                  filterType="image"
                  trigger={
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
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
              <div className="flex gap-2">
                <Input
                  value={editingGalleryImage?.image || ""}
                  onChange={(e) =>
                    setEditingGalleryImage(
                      editingGalleryImage ? { ...editingGalleryImage, image: e.target.value } : ({} as GalleryImage),
                    )
                  }
                  placeholder="https://..."
                  className="flex-1"
                />
                <MediaPicker
                  onSelect={(item) => setEditingGalleryImage(editingGalleryImage ? { ...editingGalleryImage, image: item.url } : ({} as GalleryImage))}
                  language={language}
                  filterType="image"
                  trigger={
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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

            {/* Application Requirements */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {language === "ar" ? "متطلبات التقديم" : "Application Requirements"}
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="requiresCv"
                    checked={editingJob?.requiresCv ?? true}
                    onChange={(e) =>
                      setEditingJob(editingJob ? { ...editingJob, requiresCv: e.target.checked } : ({} as JobPosition))
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="requiresCv" className="cursor-pointer">
                    {language === "ar" ? "السيرة الذاتية (CV)" : "CV"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="requiresCoverLetter"
                    checked={editingJob?.requiresCoverLetter ?? false}
                    onChange={(e) =>
                      setEditingJob(editingJob ? { ...editingJob, requiresCoverLetter: e.target.checked } : ({} as JobPosition))
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="requiresCoverLetter" className="cursor-pointer">
                    {language === "ar" ? "خطاب تغطية" : "Cover Letter"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="requiresPhoto"
                    checked={editingJob?.requiresPhoto ?? false}
                    onChange={(e) =>
                      setEditingJob(editingJob ? { ...editingJob, requiresPhoto: e.target.checked } : ({} as JobPosition))
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="requiresPhoto" className="cursor-pointer">
                    {language === "ar" ? "صورة شخصية" : "Personal Photo"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {language === "ar" ? "حقول إضافية مخصصة" : "Custom Fields"}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newField = {
                      id: Date.now().toString(),
                      labelAr: "",
                      labelEn: "",
                      type: "text" as const,
                      required: false,
                      order: (editingJob?.customFields?.length || 0) + 1,
                    }
                    setEditingJob(
                      editingJob
                        ? { ...editingJob, customFields: [...(editingJob.customFields || []), newField] }
                        : ({} as JobPosition)
                    )
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {language === "ar" ? "إضافة حقل" : "Add Field"}
                </Button>
              </div>

              {editingJob?.customFields && editingJob.customFields.length > 0 && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {editingJob.customFields.map((field, index) => (
                    <Card key={field.id} className="p-3 bg-muted/30">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder={language === "ar" ? "اسم الحقل (عربي)" : "Field Label (Arabic)"}
                              value={field.labelAr}
                              onChange={(e) => {
                                const updated = [...(editingJob.customFields || [])]
                                updated[index] = { ...field, labelAr: e.target.value }
                                setEditingJob({ ...editingJob, customFields: updated })
                              }}
                              className="h-8 text-sm"
                            />
                            <Input
                              placeholder={language === "ar" ? "اسم الحقل (إنجليزي)" : "Field Label (English)"}
                              value={field.labelEn}
                              onChange={(e) => {
                                const updated = [...(editingJob.customFields || [])]
                                updated[index] = { ...field, labelEn: e.target.value }
                                setEditingJob({ ...editingJob, customFields: updated })
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const updated = [...(editingJob.customFields || [])]
                                updated[index] = { ...field, type: e.target.value as any }
                                setEditingJob({ ...editingJob, customFields: updated })
                              }}
                              className="h-8 text-sm rounded-md border border-input bg-background px-2"
                            >
                              <option value="text">{language === "ar" ? "نص قصير" : "Text"}</option>
                              <option value="textarea">{language === "ar" ? "نص طويل" : "Textarea"}</option>
                              <option value="number">{language === "ar" ? "رقم" : "Number"}</option>
                              <option value="email">{language === "ar" ? "بريد إلكتروني" : "Email"}</option>
                              <option value="phone">{language === "ar" ? "هاتف" : "Phone"}</option>
                              <option value="date">{language === "ar" ? "تاريخ" : "Date"}</option>
                              <option value="file">{language === "ar" ? "ملف" : "File"}</option>
                              <option value="select">{language === "ar" ? "قائمة اختيار" : "Select"}</option>
                            </select>
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                id={`required-${field.id}`}
                                checked={field.required}
                                onChange={(e) => {
                                  const updated = [...(editingJob.customFields || [])]
                                  updated[index] = { ...field, required: e.target.checked }
                                  setEditingJob({ ...editingJob, customFields: updated })
                                }}
                                className="w-3 h-3"
                              />
                              <Label htmlFor={`required-${field.id}`} className="text-xs cursor-pointer">
                                {language === "ar" ? "مطلوب" : "Required"}
                              </Label>
                            </div>
                          </div>
                          {field.type === "select" && (
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                {language === "ar" ? "الخيارات (سطر لكل خيار: عربي|إنجليزي)" : "Options (one per line: Arabic|English)"}
                              </Label>
                              <Textarea
                                placeholder={language === "ar" ? "خيار1 عربي|Option1 English\nخيار2 عربي|Option2 English" : "Option1 Arabic|Option1 English\nOption2 Arabic|Option2 English"}
                                value={field.options?.map(o => `${o.valueAr}|${o.valueEn}`).join("\n") || ""}
                                onChange={(e) => {
                                  const lines = e.target.value.split("\n").filter(l => l.trim())
                                  const options = lines.map(line => {
                                    const [valueAr, valueEn] = line.split("|")
                                    return { valueAr: valueAr?.trim() || "", valueEn: valueEn?.trim() || valueAr?.trim() || "" }
                                  })
                                  const updated = [...(editingJob.customFields || [])]
                                  updated[index] = { ...field, options }
                                  setEditingJob({ ...editingJob, customFields: updated })
                                }}
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = editingJob.customFields?.filter((_, i) => i !== index) || []
                            setEditingJob({ ...editingJob, customFields: updated })
                          }}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {(!editingJob?.customFields || editingJob.customFields.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                  {language === "ar" ? "لا توجد حقول مخصصة. اضغط 'إضافة حقل' لإنشاء حقل جديد." : "No custom fields. Click 'Add Field' to create one."}
                </p>
              )}
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
              <div className="flex gap-2">
                <Input
                  value={editingTestimonial?.image || ""}
                  onChange={(e) =>
                    setEditingTestimonial(
                      editingTestimonial ? { ...editingTestimonial, image: e.target.value } : ({} as Testimonial),
                    )
                  }
                  placeholder="https://..."
                  className="flex-1"
                />
                <MediaPicker
                  onSelect={(item) => setEditingTestimonial(editingTestimonial ? { ...editingTestimonial, image: item.url } : ({} as Testimonial))}
                  language={language}
                  filterType="image"
                  trigger={
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
              {editingTestimonial?.image && (
                <img src={editingTestimonial.image} alt="Avatar" className="h-16 w-16 rounded-full mt-2 object-cover" />
              )}
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

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingForm?.id
                ? language === "ar"
                  ? "تعديل النموذج"
                  : "Edit Form"
                : language === "ar"
                  ? "إنشاء نموذج جديد"
                  : "Create New Form"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Form Title and Description */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                <Input
                  value={editingForm?.titleAr || ""}
                  onChange={(e) =>
                    setEditingForm(
                      editingForm
                        ? { ...editingForm, titleAr: e.target.value }
                        : {
                          id: "",
                          titleAr: e.target.value,
                          titleEn: "",
                          descriptionAr: "",
                          descriptionEn: "",
                          isActive: true,
                          fields: [],
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }
                    )
                  }
                  placeholder="نموذج التسجيل"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                <Input
                  value={editingForm?.titleEn || ""}
                  onChange={(e) =>
                    setEditingForm(editingForm ? { ...editingForm, titleEn: e.target.value } : ({} as Form))
                  }
                  placeholder="Registration Form"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                <Textarea
                  value={editingForm?.descriptionAr || ""}
                  onChange={(e) =>
                    setEditingForm(editingForm ? { ...editingForm, descriptionAr: e.target.value } : ({} as Form))
                  }
                  placeholder="نموذج التسجيل في البرامج"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                <Textarea
                  value={editingForm?.descriptionEn || ""}
                  onChange={(e) =>
                    setEditingForm(editingForm ? { ...editingForm, descriptionEn: e.target.value } : ({} as Form))
                  }
                  placeholder="Program registration form"
                  rows={3}
                />
              </div>
            </div>

            {/* Is Active Toggle */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Switch
                checked={editingForm?.isActive || false}
                onCheckedChange={(checked) =>
                  setEditingForm(editingForm ? { ...editingForm, isActive: checked } : ({} as Form))
                }
              />
              <Label className="cursor-pointer">
                {language === "ar" ? "النموذج نشط (يمكن للزوار إرساله)" : "Form is active (visitors can submit)"}
              </Label>
            </div>

            {/* Form Fields Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "حقول النموذج" : "Form Fields"}
                </h3>
                <Button onClick={addFormField} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "ar" ? "إضافة حقل" : "Add Field"}
                </Button>
              </div>

              {editingForm?.fields && editingForm.fields.length > 0 ? (
                <div className="space-y-3">
                  {editingForm.fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {language === "ar" ? `حقل ${index + 1}` : `Field ${index + 1}`}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveFormField(field.id, "up")}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveFormField(field.id, "down")}
                              disabled={index === editingForm.fields.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteFormField(field.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">
                              {language === "ar" ? "نوع الحقل" : "Field Type"}
                            </Label>
                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateFormField(field.id, {
                                  type: e.target.value as FormField["type"],
                                })
                              }
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                              <option value="text">{language === "ar" ? "نص" : "Text"}</option>
                              <option value="email">{language === "ar" ? "بريد إلكتروني" : "Email"}</option>
                              <option value="tel">{language === "ar" ? "هاتف" : "Phone"}</option>
                              <option value="number">{language === "ar" ? "رقم" : "Number"}</option>
                              <option value="textarea">{language === "ar" ? "نص طويل" : "Textarea"}</option>
                              <option value="select">{language === "ar" ? "قائمة منسدلة" : "Select"}</option>
                              <option value="radio">{language === "ar" ? "اختيار واحد" : "Radio"}</option>
                              <option value="checkbox">{language === "ar" ? "مربع اختيار" : "Checkbox"}</option>
                              <option value="date">{language === "ar" ? "تاريخ" : "Date"}</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">
                              {language === "ar" ? "التسمية (عربي)" : "Label (Arabic)"}
                            </Label>
                            <Input
                              value={field.labelAr}
                              onChange={(e) => updateFormField(field.id, { labelAr: e.target.value })}
                              placeholder="الاسم الكامل"
                              className="h-9"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">
                              {language === "ar" ? "التسمية (إنجليزي)" : "Label (English)"}
                            </Label>
                            <Input
                              value={field.labelEn}
                              onChange={(e) => updateFormField(field.id, { labelEn: e.target.value })}
                              placeholder="Full Name"
                              className="h-9"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">
                              {language === "ar" ? "نص توضيحي" : "Placeholder"}
                            </Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                              placeholder={language === "ar" ? "أدخل النص هنا..." : "Enter text here..."}
                              className="h-9"
                            />
                          </div>
                        </div>

                        {/* Options for select, radio, checkbox */}
                        {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                          <div className="space-y-2">
                            <Label className="text-xs">
                              {language === "ar" ? "الخيارات (واحد في كل سطر)" : "Options (one per line)"}
                            </Label>
                            <Textarea
                              value={field.options?.join("\n") || ""}
                              onChange={(e) =>
                                updateFormField(field.id, {
                                  options: e.target.value.split("\n").filter((o) => o.trim() !== ""),
                                })
                              }
                              placeholder={
                                language === "ar"
                                  ? "خيار 1\nخيار 2\nخيار 3"
                                  : "Option 1\nOption 2\nOption 3"
                              }
                              rows={3}
                              className="text-sm"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateFormField(field.id, { required: checked })}
                          />
                          <Label className="text-xs cursor-pointer">
                            {language === "ar" ? "حقل إلزامي" : "Required field"}
                          </Label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "لا توجد حقول بعد. اضغط 'إضافة حقل' للبدء" : "No fields yet. Click 'Add Field' to start"}
                  </p>
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSaveForm} className="flex-1" size="lg">
                <Save className="w-4 h-4 ml-2" />
                {language === "ar" ? "حفظ النموذج" : "Save Form"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsFormDialogOpen(false)
                  setEditingForm(null)
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
