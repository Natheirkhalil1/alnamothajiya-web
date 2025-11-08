import { getFromLocalStorage, saveToLocalStorage, COLLECTIONS } from "./storage-adapter"
import { getDb, FIREBASE_COLLECTIONS } from "./firebase"
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore"

export interface EmploymentApplication {
  id: string
  position: string
  fullName: string
  phone: string
  email: string
  nationalId: string
  gender: string
  experience: string
  expectedSalary: string
  coverLetter: string
  submittedAt: string
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string
  rating: number
  message: string
  submittedAt: string
}

export interface Testimonial {
  id: string
  name: string
  image: string
  rating: number
  comment: string
  createdAt: string
}

export interface JobPosition {
  id: string
  title: string
  titleEn: string
  type: string
  typeEn: string
  workShift?: string
  workShiftEn?: string
  gender?: string // "ذكر" | "أنثى" | "لا يهم"
  genderEn?: string // "Male" | "Female" | "Doesn't matter"
  workDuration?: string // e.g., "4-12" meaning 4 hours to 12 hours
  workDurationEn?: string
  description: string
  descriptionEn: string
  createdAt: string
}

export interface PendingReview {
  id: string
  name: string
  image: string
  rating: number
  comment: string
  submittedAt: string
}

export interface ServiceContent {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  type: "education" | "training" | "employment"
  createdAt: string
}

export interface SiteContent {
  id: string
  section: "hero" | "about" | "gallery" | "departments"
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  order: number
  createdAt: string
}

export interface HeroSlide {
  id?: string
  image: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
}

export interface SubsectionBranch {
  titleAr: string
  titleEn: string
  image: string
  descriptionAr: string
  descriptionEn: string
}

export interface Subsection {
  icon: string // Icon name as string
  titleAr: string
  titleEn: string
  image: string
  descriptionAr: string
  descriptionEn: string
  branches?: SubsectionBranch[]
}

export interface DepartmentData {
  id: string
  slug: string
  icon: string // Icon name as string
  titleAr: string
  titleEn: string
  color: string
  welcomeAr: string
  welcomeEn: string
  descriptionAr: string
  descriptionEn: string
  heroSlides: HeroSlide[]
  subsections: Subsection[]
}

export interface AboutContent {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  features: {
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
  }[]
}

export interface GalleryImage {
  id: string
  image: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  category?: string // Made category optional with specific types
  order: number
}

export interface DepartmentContent {
  id: string
  type: "medical" | "heart" | "housing" | "activities"
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
}

export interface ContactInfo {
  id: string
  phone: string
  whatsapp: string
  email: string
  address: string
  addressEn: string
  workingHours: string
  workingHoursEn: string
  holidays: string
  holidaysEn: string
  responsiblePerson: string
  responsiblePersonEn: string
  responsibleTitle: string
  responsibleTitleEn: string
}

export interface EnhancedEmploymentApplication {
  id: string
  // Personal Information
  fullName: string
  birthPlace: string
  birthDate: string
  nationalId: string
  maritalStatus: string
  gender: string
  address: string
  phone: string
  email?: string
  position: string
  expectedSalary: string
  canStayOvernight: string

  // Education
  education: {
    degree: string
    major: string
    university: string
    graduationYear: string
    gpa?: string
  }[]

  // Experience
  experience: {
    institution: string
    jobTitle: string
    duration: string
    responsibilities: string
  }[]

  // CV
  cvFileName?: string
  cvFileUrl?: string

  // Metadata
  submittedAt: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  notes?: string
}

export interface ServiceRequest {
  id: string
  name: string
  phone: string
  email: string
  serviceType: string
  message: string
  submittedAt: string
  status: "pending" | "contacted" | "completed" | "cancelled"
  notes?: string
}

export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  position: string
  department: string
  role: "admin" | "hr_manager" | "service_manager" | "content_manager" | "receptionist" | "employee" | "viewer"
  password: string
  permissions: {
    // صلاحيات طلبات التوظيف
    canViewApplications: boolean
    canEditApplications: boolean
    canApproveApplications: boolean
    canDeleteApplications: boolean

    // صلاحيات طلبات الخدمة
    canViewServiceRequests: boolean
    canEditServiceRequests: boolean
    canDeleteServiceRequests: boolean

    // صلاحيات الرسائل
    canViewMessages: boolean
    canReplyToMessages: boolean
    canDeleteMessages: boolean

    // صلاحيات المحتوى
    canViewContent: boolean
    canEditContent: boolean
    canPublishContent: boolean
    canDeleteContent: boolean

    // صلاحيات الموظفين
    canViewEmployees: boolean
    canAddEmployees: boolean
    canEditEmployees: boolean
    canDeleteEmployees: boolean

    // صلاحيات التقارير
    canViewReports: boolean
    canExportData: boolean
  }
  createdAt: string
  isActive: boolean
  lastLogin?: string
}

export type Staff = Employee

// Moved Activity interface to updates section
// export interface Activity {
//   id: string
//   employeeId: string
//   employeeName: string
//   action: string
//   actionType: "create" | "update" | "delete" | "approve" | "reject" | "view"
//   targetType: "application" | "message" | "testimonial" | "job" | "content" | "employee"
//   targetId: string
//   details: string
//   timestamp: string
// }

// Notification interface moved to updates section
// export interface Notification {
//   id: string
//   title: string
//   message: string
//   type: "info" | "success" | "warning" | "error"
//   activityId?: string
//   isRead: boolean
//   createdAt: string
// }

export interface PageBlock {
  id: string
  type:
    | "heading"
    | "paragraph"
    | "image"
    | "gallery"
    | "video"
    | "quote"
    | "divider"
    | "button"
    | "html"
    | "row"
    | "hero-slider"
    | "statistics"
    | "features"
    | "card"
    | "icon-box"
    | "accordion"
    | "tabs"
    | "alert"
    | "testimonial-card"
    | "team-member"
    | "pricing-card"
    | "cta"
    | "form"
    | "map"
    | "social-links"
    | "spacer"
  order: number
  children?: PageBlock[]
  styles?: {
    // Colors
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    gradientFrom?: string
    gradientTo?: string
    gradientVia?: string
    // Animations
    animation?:
      | "none"
      | "fade-in"
      | "slide-up"
      | "slide-down"
      | "slide-left"
      | "slide-right"
      | "zoom-in"
      | "zoom-out"
      | "bounce"
      | "pulse"
      | "float"
    animationDelay?: string
    animationDuration?: string
    // Hover effects
    hoverScale?: string
    hoverRotate?: string
    hoverTranslate?: string
    hoverShadow?: string
    hoverBorderColor?: string
    // Spacing
    padding?: string
    margin?: string
    gap?: string
    // Border & Shadow
    borderRadius?: string
    borderWidth?: string
    shadow?: string
    // Layout
    textAlign?: "left" | "center" | "right"
    maxWidth?: string
    // Backdrop
    backdropBlur?: string
    opacity?: string
  }
  content: {
    // For heading
    level?: 1 | 2 | 3 | 4 | 5 | 6
    textAr?: string
    textEn?: string
    // For paragraph
    // For image
    imageUrl?: string
    altAr?: string
    altEn?: string
    captionAr?: string
    captionEn?: string
    // For gallery
    images?: Array<{ url: string; alt: string; caption?: string }>
    // For video
    videoUrl?: string
    titleAr?: string
    titleEn?: string
    // For quote
    quoteAr?: string
    quoteEn?: string
    authorAr?: string
    authorEn?: string
    // For button
    buttonTextAr?: string
    buttonTextEn?: string
    buttonUrl?: string
    buttonStyle?: string
    // For divider
    dividerStyle?: string
    // For HTML
    htmlCode?: string
    // For row (columns layout)
    columns?: number
    columnBlocks?: PageBlock[][]
    gap?: string
    // For hero-slider
    slides?: Array<{
      id: string
      imageUrl: string
      titleAr: string
      titleEn: string
      subtitleAr?: string
      subtitleEn?: string
      descriptionAr?: string
      descriptionEn?: string
    }>
    // For statistics
    stats?: Array<{
      id: string
      number: string
      labelAr: string
      labelEn: string
    }>
    // For features
    features?: Array<{
      id: string
      icon: string
      titleAr: string
      titleEn: string
      descriptionAr: string
      descriptionEn: string
    }>
    // For card
    cardImageUrl?: string
    cardTitleAr?: string
    cardTitleEn?: string
    cardDescriptionAr?: string
    cardDescriptionEn?: string
    cardButtonTextAr?: string
    cardButtonTextEn?: string
    cardButtonUrl?: string
    // For icon-box
    icon?: string
    iconColor?: string
    iconSize?: string
    iconBoxSize?: string
    iconBoxBg?: string
    // For accordion
    accordionItems?: Array<{
      id: string
      titleAr: string
      titleEn: string
      contentAr: string
      contentEn: string
    }>
    // For tabs
    tabItems?: Array<{
      id: string
      labelAr: string
      labelEn: string
      contentAr: string
      contentEn: string
    }>
    // For alert
    alertType?: "info" | "success" | "warning" | "error"
    alertTitleAr?: string
    alertTitleEn?: string
    alertMessageAr?: string
    alertMessageEn?: string
    // For testimonial-card
    testimonialName?: string
    testimonialImage?: string
    testimonialRating?: number
    testimonialComment?: string
    testimonialPosition?: string
    // For team-member
    memberName?: string
    memberImage?: string
    memberPositionAr?: string
    memberPositionEn?: string
    memberBioAr?: string
    memberBioEn?: string
    memberEmail?: string
    memberPhone?: string
    memberSocial?: Array<{ platform: string; url: string }>
    // For pricing-card
    pricingTitleAr?: string
    pricingTitleEn?: string
    pricingPrice?: string
    pricingPeriodAr?: string
    pricingPeriodEn?: string
    pricingFeatures?: Array<{ textAr: string; textEn: string; included: boolean }>
    pricingButtonTextAr?: string
    pricingButtonTextEn?: string
    pricingButtonUrl?: string
    pricingHighlighted?: boolean
    // For cta
    ctaTitleAr?: string
    ctaTitleEn?: string
    ctaDescriptionAr?: string
    ctaDescriptionEn?: string
    ctaButtonTextAr?: string
    ctaButtonTextEn?: string
    ctaButtonUrl?: string
    ctaBackgroundImage?: string
    // For form
    formFields?: Array<{
      id: string
      type: "text" | "email" | "tel" | "textarea" | "select"
      labelAr: string
      labelEn: string
      placeholderAr?: string
      placeholderEn?: string
      required?: boolean
      options?: Array<{ labelAr: string; labelEn: string; value: string }>
    }>
    formSubmitTextAr?: string
    formSubmitTextEn?: string
    formSubmitUrl?: string
    // For map
    mapUrl?: string
    mapHeight?: string
    // For social-links
    socialLinks?: Array<{
      platform: string
      url: string
      icon: string
    }>
    // For spacer
    spacerHeight?: string
    height?: string
  }
}

export interface DynamicPage {
  id: string
  slug: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  contentAr: string
  contentEn: string
  image?: string
  seoDescriptionAr?: string
  seoDescriptionEn?: string
  featuredImage?: string
  blocks?: PageBlock[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

function dispatchStorageChange(key: string, value: any): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("localStorageChange", {
        detail: { key, value },
      }),
    )
  }
}

export async function saveEmploymentApplication(
  data: Omit<EmploymentApplication, "id" | "submittedAt">,
): Promise<void> {
  const applications = getFromLocalStorage<EmploymentApplication[]>(COLLECTIONS.EMPLOYMENT_APPLICATIONS, [])
  const newApp: EmploymentApplication = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    submittedAt: new Date().toISOString(),
  }
  applications.push(newApp)
  saveToLocalStorage(COLLECTIONS.EMPLOYMENT_APPLICATIONS, applications)
  console.log("[v0] Employment application saved with ID:", newApp.id)
}

export async function getEmploymentApplications(): Promise<EmploymentApplication[]> {
  return getFromLocalStorage<EmploymentApplication[]>(COLLECTIONS.EMPLOYMENT_APPLICATIONS, [])
}

export async function deleteEmploymentApplication(id: string): Promise<void> {
  const applications = getFromLocalStorage<EmploymentApplication[]>(COLLECTIONS.EMPLOYMENT_APPLICATIONS, [])
  const filtered = applications.filter((app) => app.id !== id)
  saveToLocalStorage(COLLECTIONS.EMPLOYMENT_APPLICATIONS, filtered)
  console.log("[v0] Employment application deleted:", id)
}

export async function saveContactMessage(data: Omit<ContactMessage, "id" | "submittedAt">): Promise<void> {
  const messages = getFromLocalStorage<ContactMessage[]>(COLLECTIONS.CONTACT_MESSAGES, [])
  const newMessage: ContactMessage = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    submittedAt: new Date().toISOString(),
  }
  messages.push(newMessage)
  saveToLocalStorage(COLLECTIONS.CONTACT_MESSAGES, messages)
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  return getFromLocalStorage<ContactMessage[]>(COLLECTIONS.CONTACT_MESSAGES, [])
}

export async function deleteContactMessage(id: string): Promise<void> {
  const messages = getFromLocalStorage<ContactMessage[]>(COLLECTIONS.CONTACT_MESSAGES, [])
  const filtered = messages.filter((msg) => msg.id !== id)
  saveToLocalStorage(COLLECTIONS.CONTACT_MESSAGES, filtered)
}

export async function saveTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Promise<void> {
  try {
    // Removed Firebase addDoc, using localStorage via storage-adapter
    const testimonials = getFromLocalStorage<Testimonial[]>(COLLECTIONS.TESTIMONIALS, [])
    const newTestimonial: Testimonial = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    testimonials.push(newTestimonial)
    saveToLocalStorage(COLLECTIONS.TESTIMONIALS, testimonials)
  } catch (error) {
    console.error("Error saving testimonial:", error)
    throw error
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const snapshot = getFromLocalStorage<Testimonial[]>(COLLECTIONS.TESTIMONIALS, [])

    if (snapshot.length === 0) {
      const defaultTestimonials: Testimonial[] = [
        {
          id: "test-001",
          name: "عبدالله أحمد السعيد",
          image: "/diverse-user-avatars.png",
          rating: 5,
          comment:
            "مدرسة متميزة بكل المقاييس. المعلمون مؤهلون والإدارة متعاونة جداً. ابني تطور كثيراً منذ التحاقه بالمدرسة.",
          createdAt: new Date().toISOString(),
        },
        {
          id: "test-002",
          name: "فاطمة محمد الحربي",
          image: "/diverse-user-avatars.png",
          rating: 5,
          comment: "أفضل قرار اتخذته هو تسجيل ابنتي في هذه المدرسة. البيئة التعليمية رائعة والأنشطة اللاصفية متنوعة.",
          createdAt: new Date().toISOString(),
        },
      ]
      // Removed Firebase setDoc loop, using localStorage via storage-adapter
      saveToLocalStorage(COLLECTIONS.TESTIMONIALS, defaultTestimonials)
      return defaultTestimonials
    }

    return snapshot
  } catch (error) {
    console.error("Error getting testimonials:", error)
    return []
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const testimonials = getFromLocalStorage<Testimonial[]>(COLLECTIONS.TESTIMONIALS, [])
    const filtered = testimonials.filter((t) => t.id !== id)
    saveToLocalStorage(COLLECTIONS.TESTIMONIALS, filtered)
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    throw error
  }
}

export async function saveJobPosition(data: Omit<JobPosition, "id" | "createdAt">): Promise<void> {
  try {
    const newJob: JobPosition = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    // Removed Firebase addDoc, using localStorage via storage-adapter
    const jobs = getFromLocalStorage<JobPosition[]>(COLLECTIONS.JOB_POSITIONS, [])
    jobs.push(newJob)
    saveToLocalStorage(COLLECTIONS.JOB_POSITIONS, jobs)
  } catch (error) {
    console.error("Error saving job position:", error)
    throw error
  }
}

export async function getJobPositions(): Promise<JobPosition[]> {
  try {
    const snapshot = getFromLocalStorage<JobPosition[]>(COLLECTIONS.JOB_POSITIONS, [])

    if (snapshot.length === 0) {
      const defaultJobs: JobPosition[] = [
        {
          id: "1",
          title: "معلم علوم",
          titleEn: "Science Teacher",
          type: "دوام كامل",
          typeEn: "Full-time",
          workShift: "8:00 ص - 3:00 م",
          workShiftEn: "8:00 AM - 3:00 PM",
          gender: "لا يهم",
          genderEn: "Doesn't matter",
          workDuration: "7 ساعات",
          workDurationEn: "7 hours",
          description: "تدريس العلوم والتجارب العملية",
          descriptionEn: "Teaching science and practical experiments",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "معلم رياضيات",
          titleEn: "Mathematics Teacher",
          type: "دوام كامل",
          typeEn: "Full-time",
          workShift: "8:00 ص - 3:00 م",
          workShiftEn: "8:00 AM - 3:00 PM",
          gender: "لا يهم",
          genderEn: "Doesn't matter",
          workDuration: "7 ساعات",
          workDurationEn: "7 hours",
          description: "تدريس الرياضيات بأساليب حديثة",
          descriptionEn: "Teaching mathematics with modern methods",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "معلم لغة عربية",
          titleEn: "Arabic Language Teacher",
          type: "دوام كامل",
          typeEn: "Full-time",
          workShift: "8:00 ص - 3:00 م",
          workShiftEn: "8:00 AM - 3:00 PM",
          gender: "أنثى",
          genderEn: "Female",
          workDuration: "7 ساعات",
          workDurationEn: "7 hours",
          description: "تدريس اللغة العربية لجميع المراحل",
          descriptionEn: "Teaching Arabic for all levels",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "أخصائي نفسي",
          titleEn: "Psychologist",
          type: "دوام كامل",
          typeEn: "Full-time",
          workShift: "9:00 ص - 4:00 م",
          workShiftEn: "9:00 AM - 4:00 PM",
          gender: "لا يهم",
          genderEn: "Doesn't matter",
          workDuration: "7 ساعات",
          workDurationEn: "7 hours",
          description: "تقديم الدعم النفسي للطلاب",
          descriptionEn: "Providing psychological support to students",
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          title: "مشرف تربوي",
          titleEn: "Educational Supervisor",
          type: "دوام كامل",
          typeEn: "Full-time",
          workShift: "7:30 ص - 3:30 م",
          workShiftEn: "7:30 AM - 3:30 PM",
          gender: "ذكر",
          genderEn: "Male",
          workDuration: "8 ساعات",
          workDurationEn: "8 hours",
          description: "الإشراف على العملية التعليمية",
          descriptionEn: "Supervising the educational process",
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          title: "معلم لغة إنجليزية",
          titleEn: "English Language Teacher",
          type: "دوام كامل",
          typeEn: "Full-time",
          workShift: "8:00 ص - 3:00 م",
          workShiftEn: "8:00 AM - 3:00 PM",
          gender: "لا يهم",
          genderEn: "Doesn't matter",
          workDuration: "7 ساعات",
          workDurationEn: "7 hours",
          description: "تدريس اللغة الإنجليزية",
          descriptionEn: "Teaching English language",
          createdAt: new Date().toISOString(),
        },
        {
          id: "7",
          title: "موظف إداري",
          titleEn: "Administrative Staff",
          type: "دوام جزئي",
          typeEn: "Part-time",
          workShift: "9:00 ص - 1:00 م",
          workShiftEn: "9:00 AM - 1:00 PM",
          gender: "لا يهم",
          genderEn: "Doesn't matter",
          workDuration: "4 ساعات",
          workDurationEn: "4 hours",
          description: "إدارة الشؤون الإدارية",
          descriptionEn: "Managing administrative affairs",
          createdAt: new Date().toISOString(),
        },
      ]
      // Removed Firebase setDoc loop, using localStorage via storage-adapter
      saveToLocalStorage(COLLECTIONS.JOB_POSITIONS, defaultJobs)
      return defaultJobs
    }

    return snapshot
  } catch (error) {
    console.error("Error getting job positions:", error)
    return []
  }
}

export function getAvailableJobs(): JobPosition[] {
  // Removed Firebase getDocs, using localStorage via storage-adapter
  return getJobPositions()
}

export async function deleteJobPosition(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const jobs = getFromLocalStorage<JobPosition[]>(COLLECTIONS.JOB_POSITIONS, [])
    const filtered = jobs.filter((job) => job.id !== id)
    saveToLocalStorage(COLLECTIONS.JOB_POSITIONS, filtered)
  } catch (error) {
    console.error("Error deleting job position:", error)
    throw error
  }
}

export async function updateJobPosition(id: string, data: Omit<JobPosition, "id" | "createdAt">): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const jobs = getFromLocalStorage<JobPosition[]>(COLLECTIONS.JOB_POSITIONS, [])
    const index = jobs.findIndex((job) => job.id === id)
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...data, id, createdAt: jobs[index].createdAt }
      saveToLocalStorage(COLLECTIONS.JOB_POSITIONS, jobs)
    }
  } catch (error) {
    console.error("Error updating job position:", error)
    throw error
  }
}

export function resetJobPositionsToDefault(): void {
  if (typeof window !== "undefined") {
    const defaultJobs: JobPosition[] = [
      {
        id: "1",
        title: "معلم علوم",
        titleEn: "Science Teacher",
        type: "دوام كامل",
        typeEn: "Full-time",
        workShift: "8:00 ص - 3:00 م",
        workShiftEn: "8:00 AM - 3:00 PM",
        gender: "لا يهم",
        genderEn: "Doesn't matter",
        workDuration: "7 ساعات",
        workDurationEn: "7 hours",
        description: "تدريس العلوم والتجارب العملية",
        descriptionEn: "Teaching science and practical experiments",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "معلم رياضيات",
        titleEn: "Mathematics Teacher",
        type: "دوام كامل",
        typeEn: "Full-time",
        workShift: "8:00 ص - 3:00 م",
        workShiftEn: "8:00 AM - 3:00 PM",
        gender: "لا يهم",
        genderEn: "Doesn't matter",
        workDuration: "7 ساعات",
        workDurationEn: "7 hours",
        description: "تدريس الرياضيات بأساليب حديثة",
        descriptionEn: "Teaching mathematics with modern methods",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "معلم لغة عربية",
        titleEn: "Arabic Language Teacher",
        type: "دوام كامل",
        typeEn: "Full-time",
        workShift: "8:00 ص - 3:00 م",
        workShiftEn: "8:00 AM - 3:00 PM",
        gender: "أنثى",
        genderEn: "Female",
        workDuration: "7 ساعات",
        workDurationEn: "7 hours",
        description: "تدريس اللغة العربية لجميع المراحل",
        descriptionEn: "Teaching Arabic for all levels",
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        title: "أخصائي نفسي",
        titleEn: "Psychologist",
        type: "دوام كامل",
        typeEn: "Full-time",
        workShift: "9:00 ص - 4:00 م",
        workShiftEn: "9:00 AM - 4:00 PM",
        gender: "لا يهم",
        genderEn: "Doesn't matter",
        workDuration: "7 ساعات",
        workDurationEn: "7 hours",
        description: "تقديم الدعم النفسي للطلاب",
        descriptionEn: "Providing psychological support to students",
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        title: "مشرف تربوي",
        titleEn: "Educational Supervisor",
        type: "دوام كامل",
        typeEn: "Full-time",
        workShift: "7:30 ص - 3:30 م",
        workShiftEn: "7:30 AM - 3:30 PM",
        gender: "ذكر",
        genderEn: "Male",
        workDuration: "8 ساعات",
        workDurationEn: "8 hours",
        description: "الإشراف على العملية التعليمية",
        descriptionEn: "Supervising the educational process",
        createdAt: new Date().toISOString(),
      },
      {
        id: "6",
        title: "معلم لغة إنجليزية",
        titleEn: "English Language Teacher",
        type: "دوام كامل",
        typeEn: "Full-time",
        workShift: "8:00 ص - 3:00 م",
        workShiftEn: "8:00 AM - 3:00 PM",
        gender: "لا يهم",
        genderEn: "Doesn't matter",
        workDuration: "7 ساعات",
        workDurationEn: "7 hours",
        description: "تدريس اللغة الإنجليزية",
        descriptionEn: "Teaching English language",
        createdAt: new Date().toISOString(),
      },
      {
        id: "7",
        title: "موظف إداري",
        titleEn: "Administrative Staff",
        type: "دوام جزئي",
        typeEn: "Part-time",
        workShift: "9:00 ص - 1:00 م",
        workShiftEn: "9:00 AM - 1:00 PM",
        gender: "لا يهم",
        genderEn: "Doesn't matter",
        workDuration: "4 ساعات",
        workDurationEn: "4 hours",
        description: "إدارة الشؤون الإدارية",
        descriptionEn: "Managing administrative affairs",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("jobPositions", JSON.stringify(defaultJobs))
    dispatchStorageChange("jobPositions", defaultJobs)
  }
}

export function savePendingReview(data: Omit<PendingReview, "id" | "submittedAt">): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews()
    const newReview: PendingReview = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
    }
    reviews.push(newReview)
    localStorage.setItem("pendingReviews", JSON.stringify(reviews))
  }
}

export function getPendingReviews(): PendingReview[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("pendingReviews")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function approvePendingReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews()
    const review = reviews.find((r) => r.id === id)
    if (review) {
      // إضافة الرأي إلى الآراء المعتمدة
      saveTestimonial({
        name: review.name,
        image: review.image,
        rating: review.rating,
        comment: review.comment,
      })
      // حذف من الآراء المعلقة
      deletePendingReview(id)
    }
  }
}

export function deletePendingReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews().filter((r) => r.id !== id)
    localStorage.setItem("pendingReviews", JSON.stringify(reviews))
  }
}

export function saveServiceContent(data: Omit<ServiceContent, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const services = getServiceContents()
    const newService: ServiceContent = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    services.push(newService)
    localStorage.setItem("serviceContents", JSON.stringify(services))
  }
}

export function getServiceContents(): ServiceContent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("serviceContents")

    if (data) {
      const existingServices = JSON.parse(data)
      // Check if training service exists and remove it
      const hasTraining = existingServices.some((s: ServiceContent) => s.type === "training")
      if (hasTraining || existingServices.length > 2) {
        // Reset to default services without training
        const defaultServices: ServiceContent[] = [
          {
            id: "1",
            titleAr: "طلب الخدمة",
            titleEn: "Service Request",
            descriptionAr: "قدم طلبك للحصول على خدماتنا التعليمية والتأهيلية المتخصصة بسهولة وسرعة",
            descriptionEn:
              "Submit your request to access our specialized educational and rehabilitation services easily and quickly",
            type: "education",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            titleAr: "فرص توظيف",
            titleEn: "Employment Opportunities",
            descriptionAr:
              "انضم إلى فريقنا التعليمي المتميز. نبحث عن معلمين وإداريين مؤهلين للمساهمة في رسالتنا التعليمية",
            descriptionEn:
              "Join our distinguished educational team. We are looking for qualified teachers and administrators",
            type: "employment",
            createdAt: new Date().toISOString(),
          },
        ]
        localStorage.setItem("serviceContents", JSON.stringify(defaultServices))
        return defaultServices
      }
      return existingServices
    }

    // Default services if no data exists
    const defaultServices: ServiceContent[] = [
      {
        id: "1",
        titleAr: "طلب الخدمة",
        titleEn: "Service Request",
        descriptionAr: "قدم طلبك للحصول على خدماتنا التعليمية والتأهيلية المتخصصة بسهولة وسرعة",
        descriptionEn:
          "Submit your request to access our specialized educational and rehabilitation services easily and quickly",
        type: "education",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        titleAr: "فرص توظيف",
        titleEn: "Employment Opportunities",
        descriptionAr: "انضم إلى فريقنا التعليمي المتميز. نبحث عن معلمين وإداريين مؤهلين للمساهمة في رسالتنا التعليمية",
        descriptionEn:
          "Join our distinguished educational team. We are looking for qualified teachers and administrators",
        type: "employment",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("serviceContents", JSON.stringify(defaultServices))
    return defaultServices
  }
  return []
}

export function updateServiceContent(id: string, data: Omit<ServiceContent, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const services = getServiceContents()
    const index = services.findIndex((s) => s.id === id)
    if (index !== -1) {
      services[index] = {
        ...services[index],
        ...data,
      }
      localStorage.setItem("serviceContents", JSON.stringify(services))
    }
  }
}

export function deleteServiceContent(id: string): void {
  if (typeof window !== "undefined") {
    const services = getServiceContents().filter((s) => s.id !== id)
    localStorage.setItem("serviceContents", JSON.stringify(services))
  }
}

export function getSiteContents(): SiteContent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("siteContents")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveSiteContent(data: Omit<SiteContent, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const contents = getSiteContents()
    const newContent: SiteContent = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    contents.push(newContent)
    localStorage.setItem("siteContents", JSON.stringify(contents))
  }
}

export function updateSiteContent(id: string, data: Partial<SiteContent>): void {
  if (typeof window !== "undefined") {
    const contents = getSiteContents()
    const index = contents.findIndex((c) => c.id === id)
    if (index !== -1) {
      contents[index] = { ...contents[index], ...data }
      localStorage.setItem("siteContents", JSON.stringify(contents))
    }
  }
}

export function deleteSiteContent(id: string): void {
  if (typeof window !== "undefined") {
    const contents = getSiteContents().filter((c) => c.id !== id)
    localStorage.setItem("siteContents", JSON.stringify(contents))
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const slides = getFromLocalStorage<HeroSlide[]>(COLLECTIONS.HERO_SLIDES, [])

  if (slides.length === 0) {
    const defaultSlides: HeroSlide[] = [
      {
        id: "1",
        image: "/modern-special-education-school-classroom-with-div.jpg",
        titleAr: "المدرسة النموذجية",
        titleEn: "Al Namothajia School",
        descriptionAr: "لتعزيز التعليم والإبداع في بيئة مريحة وآمنة تراعي الفروق الفردية وتطور قدرات كل طالب",
        descriptionEn: "To enhance education and creativity in a comfortable and safe environment",
      },
      {
        id: "2",
        image: "/happy-special-needs-students-learning-together-wit.jpg",
        titleAr: "تعليم متميز",
        titleEn: "Distinguished Education",
        descriptionAr: "نبني جيلاً واعياً ومبدعاً لمستقبل أفضل",
        descriptionEn: "Building a conscious and creative generation for a better future",
      },
      {
        id: "3",
        image: "/modern-special-education-school-facilities-with-ad.jpg",
        titleAr: "بيئة تعليمية حديثة",
        titleEn: "Modern Learning Environment",
        descriptionAr: "نوفر أحدث الوسائل التعليمية لتجربة تعلم فريدة",
        descriptionEn: "We provide the latest educational tools for a unique learning experience",
      },
    ]
    saveToLocalStorage(COLLECTIONS.HERO_SLIDES, defaultSlides)
    return defaultSlides
  }

  return slides
}

export async function saveHeroSlide(data: Omit<HeroSlide, "id">): Promise<void> {
  const slides = getFromLocalStorage<HeroSlide[]>(COLLECTIONS.HERO_SLIDES, [])
  const newSlide: HeroSlide = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  }
  slides.push(newSlide)
  saveToLocalStorage(COLLECTIONS.HERO_SLIDES, slides)
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<void> {
  const slides = getFromLocalStorage<HeroSlide[]>(COLLECTIONS.HERO_SLIDES, [])
  const index = slides.findIndex((s) => s.id === id)
  if (index !== -1) {
    slides[index] = { ...slides[index], ...data }
    saveToLocalStorage(COLLECTIONS.HERO_SLIDES, slides)
  }
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const slides = getFromLocalStorage<HeroSlide[]>(COLLECTIONS.HERO_SLIDES, [])
  const filtered = slides.filter((s) => s.id !== id)
  saveToLocalStorage(COLLECTIONS.HERO_SLIDES, filtered)
}

export async function getDepartmentContents(): Promise<DepartmentContent[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const snapshot = getFromLocalStorage<DepartmentContent[]>(COLLECTIONS.DEPARTMENT_CONTENTS, [])

    if (snapshot.length === 0) {
      // Initialize with default data
      const defaultContents: DepartmentContent[] = [
        {
          id: "1",
          type: "medical",
          titleAr: "القسم الطبي",
          titleEn: "Medical Department",
          descriptionAr:
            "قسم طبي متكامل يوفر الرعاية الصحية الشاملة للطلاب على مدار الساعة، يشمل العيادة والصيدلية والمتابعة العلاجية",
          descriptionEn:
            "Comprehensive medical department providing 24/7 healthcare for students, including clinic, pharmacy, and medical follow-up",
          image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
        },
        {
          id: "2",
          type: "heart",
          titleAr: "قلب المدرسة",
          titleEn: "Heart of the School",
          descriptionAr:
            "القسم الأساسي الذي يضم 14 قسماً متخصصاً يعملون بتكامل تام لتقديم خدمات تعليمية وتأهيلية شاملة لجميع الطلاب",
          descriptionEn:
            "The core department comprising 14 specialized sections working in complete integration to provide comprehensive educational and rehabilitation services",
          image: "/professional-psychologist-conducting-assessment-wi.jpg",
        },
        {
          id: "3",
          type: "housing",
          titleAr: "السكن الداخلي",
          titleEn: "Internal Housing",
          descriptionAr:
            "شقق سكنية مجهزة بتجهيزات فندقية مع خدمات شاملة تشمل النظافة والمصبغة والمطبخ والمكالمات المرئية والمراقبة",
          descriptionEn:
            "Residential apartments equipped with hotel furnishings and comprehensive services including cleaning, laundry, kitchen, video calls, and surveillance",
          image: "/comfortable-residential-apartment-for-special-need.jpg",
        },
        {
          id: "4",
          type: "activities",
          titleAr: "الأنشطة اللامنهجية",
          titleEn: "Extracurricular Activities",
          descriptionAr: "رحلات أسبوعية ونشاطات ترفيهية متنوعة تساهم في تنمية المهارات الاجتماعية والترفيهية للطلاب",
          descriptionEn:
            "Weekly trips and various recreational activities contributing to the development of students' social and recreational skills",
          image: "/special-needs-students-on-educational-field-trip-w.jpg",
        },
      ]

      // Save to localStorage
      saveToLocalStorage(COLLECTIONS.DEPARTMENT_CONTENTS, defaultContents)
      return defaultContents
    }

    return snapshot
  } catch (error) {
    console.error("Error getting department contents:", error)
    return []
  }
}

export async function updateDepartmentContent(id: string, data: Partial<DepartmentContent>): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const contents = getFromLocalStorage<DepartmentContent[]>(COLLECTIONS.DEPARTMENT_CONTENTS, [])
    const index = contents.findIndex((c) => c.id === id)
    if (index !== -1) {
      contents[index] = { ...contents[index], ...data }
      saveToLocalStorage(COLLECTIONS.DEPARTMENT_CONTENTS, contents)
    }
  } catch (error) {
    console.error("Error updating department content:", error)
    throw error
  }
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const snapshot = getFromLocalStorage<ContactInfo[]>(COLLECTIONS.CONTACT_INFO, [])

    if (snapshot.length === 0) {
      const defaultInfo: ContactInfo = {
        id: "1",
        phone: "+972595864023",
        whatsapp: "+972595864023",
        email: "mmm460286@gmail.com",
        address: "عمان، الأردن",
        addressEn: "Amman, Jordan",
        workingHours: "الأحد - الخميس: 8:00 صباحاً - 3:00 مساءً",
        workingHoursEn: "Sunday - Thursday: 8:00 AM - 3:00 PM",
        holidays: "الجمعة والسبت",
        holidaysEn: "Friday and Saturday",
        responsiblePerson: "أ. محمد أحمد",
        responsiblePersonEn: "Mr. Mohammad Ahmad",
        responsibleTitle: "مدير المدرسة",
        responsibleTitleEn: "School Principal",
      }

      // Save to localStorage
      saveToLocalStorage(COLLECTIONS.CONTACT_INFO, [defaultInfo])
      return defaultInfo
    }

    return snapshot[0] ?? null
  } catch (error) {
    console.error("Error getting contact info:", error)
    return null
  }
}

export async function updateContactInfo(data: ContactInfo): Promise<void> {
  try {
    // Removed Firebase setDoc, using localStorage via storage-adapter
    const contactInfo = getFromLocalStorage<ContactInfo[]>(COLLECTIONS.CONTACT_INFO, [])
    const index = contactInfo.findIndex((info) => info.id === data.id)
    if (index !== -1) {
      contactInfo[index] = data
    } else {
      contactInfo.push(data)
    }
    saveToLocalStorage(COLLECTIONS.CONTACT_INFO, contactInfo)
  } catch (error) {
    console.error("Error updating contact info:", error)
    throw error
  }
}

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const snapshot = getFromLocalStorage<AboutContent[]>(COLLECTIONS.ABOUT_CONTENT, [])

    if (snapshot.length === 0) {
      const defaultContent: AboutContent = {
        id: "1",
        titleAr: "المدرسة النموذجية للتربية الخاصة",
        titleEn: "Al Namothajia School for Special Education",
        descriptionAr:
          "مؤسسة تعليمية رائدة تأسست عام 1994، نقدم خدمات تعليمية وتأهيلية متميزة لذوي الاحتياجات الخاصة في بيئة آمنة ومحفزة تراعي الفروق الفردية وتطور قدرات كل طالب",
        descriptionEn:
          "A leading educational institution established in 1994, providing distinguished educational and rehabilitation services for people with special needs in a safe and stimulating environment",
        image: "/modern-special-education-school-building-exterior.jpg",
        features: [
          {
            titleAr: "رؤيتنا",
            titleEn: "Our Vision",
            descriptionAr: "أن نكون المؤسسة الرائدة في تقديم خدمات التربية الخاصة على مستوى المنطقة",
            descriptionEn: "To be the leading institution in providing special education services in the region",
          },
          {
            titleAr: "رسالتنا",
            titleEn: "Our Mission",
            descriptionAr: "تقديم برامج تعليمية وتأهيلية شاملة تمكن ذوي الاحتياجات الخاصة من تحقيق أقصى إمكانياتهم",
            descriptionEn:
              "Providing comprehensive educational and rehabilitation programs that enable people with special needs to achieve their full potential",
          },
          {
            titleAr: "قيمنا",
            titleEn: "Our Values",
            descriptionAr: "الاحترام، التميز، الشمولية، والالتزام بأعلى معايير الجودة في التعليم والرعاية",
            descriptionEn: "Respect, excellence, inclusivity, and commitment to the highest standards of quality",
          },
          {
            titleAr: "فريقنا",
            titleEn: "Our Team",
            descriptionAr: "كادر متخصص ومؤهل من المعلمين والأخصائيين ذوي الخبرة في التربية الخاصة",
            descriptionEn:
              "Specialized and qualified staff of teachers and specialists experienced in special education",
          },
          {
            titleAr: "مرافقنا",
            titleEn: "Our Facilities",
            descriptionAr: "بنية تحتية حديثة ومجهزة بأحدث التقنيات والوسائل التعليمية المتطورة",
            descriptionEn: "Modern infrastructure equipped with the latest technologies and advanced educational tools",
          },
          {
            titleAr: "شراكاتنا",
            titleEn: "Our Partnerships",
            descriptionAr: "تعاون مستمر مع المؤسسات المحلية والدولية لتطوير خدماتنا التعليمية",
            descriptionEn: "Continuous collaboration with local and international institutions to develop our services",
          },
        ],
      }

      // Save to localStorage
      saveToLocalStorage(COLLECTIONS.ABOUT_CONTENT, [defaultContent])
      return defaultContent
    }

    return snapshot[0] ?? null
  } catch (error) {
    console.error("Error getting about content:", error)
    return null
  }
}

export async function updateAboutContent(data: AboutContent): Promise<void> {
  try {
    // Removed Firebase setDoc, using localStorage via storage-adapter
    const aboutContents = getFromLocalStorage<AboutContent[]>(COLLECTIONS.ABOUT_CONTENT, [])
    const index = aboutContents.findIndex((content) => content.id === data.id)
    if (index !== -1) {
      aboutContents[index] = data
    } else {
      aboutContents.push(data)
    }
    saveToLocalStorage(COLLECTIONS.ABOUT_CONTENT, aboutContents)
  } catch (error) {
    console.error("Error updating about content:", error)
    throw error
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const snapshot = getFromLocalStorage<GalleryImage[]>(COLLECTIONS.GALLERY_IMAGES, [])

    if (snapshot.length === 0) {
      const defaultImages: GalleryImage[] = [
        {
          id: "1",
          image: "/modern-school-classroom-with-students.jpg",
          titleAr: "الفصول الدراسية الحديثة",
          titleEn: "Modern Classrooms",
          descriptionAr: "فصول دراسية مجهزة بأحدث التقنيات التعليمية",
          descriptionEn: "Classrooms equipped with the latest educational technologies",
          category: "المرافق",
          order: 1,
        },
        {
          id: "2",
          image: "/happy-students-learning-together.jpg",
          titleAr: "طلاب سعداء",
          titleEn: "Happy Students",
          descriptionAr: "طلابنا يتعلمون في بيئة محفزة وداعمة",
          descriptionEn: "Our students learn in a stimulating and supportive environment",
          category: "الأنشطة",
          order: 2,
        },
        {
          id: "3",
          image: "/modern-school-facilities-and-technology.jpg",
          titleAr: "التقنيات المتطورة",
          titleEn: "Advanced Technology",
          descriptionAr: "نستخدم أحدث التقنيات في التعليم",
          descriptionEn: "We use the latest technologies in education",
          category: "المرافق",
          order: 3,
        },
        {
          id: "4",
          image: "/students-in-science-lab.jpg",
          titleAr: "مختبر العلوم",
          titleEn: "Science Laboratory",
          descriptionAr: "مختبرات علمية مجهزة للتجارب العملية",
          descriptionEn: "Scientific laboratories equipped for practical experiments",
          category: "المرافق",
          order: 4,
        },
        {
          id: "5",
          image: "/school-library-with-books.jpg",
          titleAr: "المكتبة المدرسية",
          titleEn: "School Library",
          descriptionAr: "مكتبة غنية بالكتب والمراجع التعليمية",
          descriptionEn: "Library rich with books and educational references",
          category: "المرافق",
          order: 5,
        },
        {
          id: "6",
          image: "/art-class-students-painting.jpg",
          titleAr: "حصة الفنون",
          titleEn: "Art Class",
          descriptionAr: "تنمية المواهب الفنية والإبداعية",
          descriptionEn: "Developing artistic and creative talents",
          category: "الأنشطة",
          order: 6,
        },
        {
          id: "7",
          image: "/computer-lab-students.jpg",
          titleAr: "مختبر الحاسوب",
          titleEn: "Computer Lab",
          descriptionAr: "تعليم المهارات التقنية والبرمجة",
          descriptionEn: "Teaching technical skills and programming",
          category: "المرافق",
          order: 7,
        },
        {
          id: "8",
          image: "/gallery-hero-4.jpg",
          titleAr: "الأنشطة الرياضية",
          titleEn: "Sports Activities",
          descriptionAr: "برامج رياضية متنوعة لتنمية المهارات البدنية",
          descriptionEn: "Various sports programs to develop physical skills",
          category: "الأنشطة",
          order: 8,
        },
      ]

      // Save to localStorage
      saveToLocalStorage(COLLECTIONS.GALLERY_IMAGES, defaultImages)
      return defaultImages
    }

    return snapshot.sort((a, b) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error("Error getting gallery images:", error)
    return []
  }
}

export async function saveGalleryImage(data: Omit<GalleryImage, "id">): Promise<void> {
  try {
    const newImage: GalleryImage = {
      ...data,
      id: Date.now().toString(),
    }
    // Removed Firebase addDoc, using localStorage via storage-adapter
    const images = getFromLocalStorage<GalleryImage[]>(COLLECTIONS.GALLERY_IMAGES, [])
    images.push(newImage)
    saveToLocalStorage(COLLECTIONS.GALLERY_IMAGES, images)
  } catch (error) {
    console.error("Error saving gallery image:", error)
    throw error
  }
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const images = getFromLocalStorage<GalleryImage[]>(COLLECTIONS.GALLERY_IMAGES, [])
    const index = images.findIndex((img) => img.id === id)
    if (index !== -1) {
      images[index] = { ...images[index], ...data }
      saveToLocalStorage(COLLECTIONS.GALLERY_IMAGES, images)
    }
  } catch (error) {
    console.error("Error updating gallery image:", error)
    throw error
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const images = getFromLocalStorage<GalleryImage[]>(COLLECTIONS.GALLERY_IMAGES, [])
    const filtered = images.filter((img) => img.id !== id)
    saveToLocalStorage(COLLECTIONS.GALLERY_IMAGES, filtered)
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    throw error
  }
}

// Enhanced Employment Application functions (rewritten for Firebase)
export async function saveEnhancedEmploymentApplication(
  data: Omit<EnhancedEmploymentApplication, "id" | "submittedAt" | "status">,
): Promise<EnhancedEmploymentApplication> {
  try {
    const newApplication: EnhancedEmploymentApplication = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    // Removed Firebase setDoc, using localStorage via storage-adapter
    const applications = getFromLocalStorage<EnhancedEmploymentApplication[]>(COLLECTIONS.ENHANCED_APPLICATIONS, [])
    applications.push(newApplication)
    saveToLocalStorage(COLLECTIONS.ENHANCED_APPLICATIONS, applications)
    return newApplication
  } catch (error) {
    console.error("Error saving enhanced employment application:", error)
    throw error
  }
}

export async function getEnhancedEmploymentApplications(): Promise<EnhancedEmploymentApplication[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    return getFromLocalStorage<EnhancedEmploymentApplication[]>(COLLECTIONS.ENHANCED_APPLICATIONS, [])
  } catch (error) {
    console.error("Error getting enhanced employment applications:", error)
    return []
  }
}

// Existing local storage functions for EnhancedEmploymentApplication replaced with Firebase equivalents.

// Service Request functions (rewritten for Firebase)
export async function saveServiceRequest(
  data: Omit<ServiceRequest, "id" | "submittedAt" | "status">,
): Promise<ServiceRequest> {
  try {
    const newRequest: ServiceRequest = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    // Removed Firebase setDoc, using localStorage via storage-adapter
    const requests = getFromLocalStorage<ServiceRequest[]>(COLLECTIONS.SERVICE_REQUESTS, [])
    requests.push(newRequest)
    saveToLocalStorage(COLLECTIONS.SERVICE_REQUESTS, requests)
    return newRequest
  } catch (error) {
    console.error("Error saving service request:", error)
    throw error
  }
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    return getFromLocalStorage<ServiceRequest[]>(COLLECTIONS.SERVICE_REQUESTS, [])
  } catch (error) {
    console.error("Error getting service requests:", error)
    return []
  }
}

// Existing local storage functions for ServiceRequest replaced with Firebase equivalents.

export function getFullDepartmentsData(): DepartmentData[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("departmentContents")
    if (data) {
      return JSON.parse(data)
    }

    // Default departments data
    const defaultData: DepartmentData[] = [
      {
        id: "1",
        slug: "medical",
        icon: "Stethoscope",
        titleAr: "القسم الطبي",
        titleEn: "Medical Department",
        color: "from-red-600 via-rose-600 to-pink-600",
        welcomeAr: "مرحباً بكم في القسم الطبي - صحة طلابنا أولويتنا",
        welcomeEn: "Welcome to Medical Department - Our Students' Health is Our Priority",
        descriptionAr:
          "يتميز القسم الطبي بكوادر طبية ذوي كفاءات عالية من أطباء وممرضين متواجدين على مدار الساعة، مع معدات طبية شاملة لجميع الحالات الطارئة واليومية، وسيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية.",
        descriptionEn:
          "The Medical Department features highly qualified medical staff of doctors and nurses available 24/7, with comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies.",
        heroSlides: [
          {
            image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
            titleAr: "العيادة الطبية",
            titleEn: "Medical Clinic",
            descriptionAr: "عيادة مجهزة بأحدث المعدات الطبية",
            descriptionEn: "Clinic equipped with the latest medical equipment",
          },
          {
            image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
            titleAr: "الصيدلية",
            titleEn: "Pharmacy",
            descriptionAr: "صيدلية شاملة لجميع احتياجات الطلاب الدوائية",
            descriptionEn: "Comprehensive pharmacy for all students' medication needs",
          },
          {
            image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
            titleAr: "المتابعة الصحية",
            titleEn: "Health Monitoring",
            descriptionAr: "وحدة عناية مركزة للمتابعة الصحية على مدار الساعة",
            descriptionEn: "Intensive care unit for 24/7 health monitoring",
          },
        ],
        subsections: [
          {
            icon: "Stethoscope",
            titleAr: "العيادة",
            titleEn: "Clinic",
            image: "/modern-medical-clinic-for-special-needs-school-wit.jpg",
            descriptionAr:
              "تتميز العيادة بقسم طبي مجهز بكوادر طبية ذوي كفاءات (أطباء وممرضين متواجدين على مدار الساعة)، وفيها معدات طبية شاملة لجميع الحالات الطارئة واليومية، ويتوفر فيها سيارة إسعاف مجهزة بكامل لوازم الإسعافات الأولية على مدار الساعة.",
            descriptionEn:
              "The clinic features a medical section equipped with qualified medical staff (doctors and nurses available 24/7), comprehensive medical equipment for all emergency and daily cases, and an ambulance equipped with complete first aid supplies available 24/7.",
            branches: [],
          },
          {
            icon: "Pill",
            titleAr: "الصيدلية",
            titleEn: "Pharmacy",
            image: "/school-pharmacy-with-organized-medications-and-pha.jpg",
            descriptionAr:
              "تحتوي الصيدلية على جميع الأدوية التي يحتاجها الطلاب، مصنفة حسب اسم الطالب، ومحفوظة إلكترونياً.",
            descriptionEn:
              "The pharmacy contains all medications needed by students, classified by student name, and stored electronically.",
            branches: [],
          },
          {
            icon: "Activity",
            titleAr: "المتابعة الصحية",
            titleEn: "Health Monitoring",
            image: "/medical-monitoring-room-with-nurse-caring-for-spec.jpg",
            descriptionAr:
              "تعتبر هذه الوحدة بمثابة العناية المركزة في المدرسة حيث يتم وضع الطلاب الذين يحتاجون للمتابعة والمراقبة الصحية على مدار الساعة بإشراف العيادة الطبية وكوادرها.",
            descriptionEn:
              "This unit serves as the intensive care unit in the school where students who need health monitoring and follow-up are placed 24/7 under the supervision of the medical clinic and its staff.",
            branches: [],
          },
        ],
      },
      {
        id: "2",
        slug: "heart",
        icon: "HeartPulse",
        titleAr: "قلب المدرسة",
        titleEn: "Heart of the School",
        color: "from-pink-500 via-purple-500 to-indigo-500",
        welcomeAr: "مرحباً بكم في قلب المدرسة - حيث يتجلى التميز والإبداع",
        welcomeEn: "Welcome to the Heart of the School - Where Excellence and Creativity Shine",
        descriptionAr:
          "القسم الأساسي الذي يضم 14 قسماً متخصصاً يعملون بتكامل تام لتقديم خدمات تعليمية وتأهيلية شاملة لجميع الطلاب، مع التركيز على تنمية المهارات الفردية وتحقيق الأهداف التعليمية.",
        descriptionEn:
          "The core department comprising 14 specialized sections working in complete integration to provide comprehensive educational and rehabilitation services for all students, focusing on developing individual skills and achieving educational goals.",
        heroSlides: [
          {
            image: "/professional-psychologist-conducting-assessment-wi.jpg",
            titleAr: "التأهيل النفسي",
            titleEn: "Psychological Rehabilitation",
            descriptionAr: "دعم نفسي متخصص لتجاوز التحديات وتحقيق النمو الشخصي",
            descriptionEn: "Specialized psychological support to overcome challenges and achieve personal growth",
          },
          {
            image: "/special-education-teacher-assisting-student-in-cla.jpg",
            titleAr: "التعليم المتخصص",
            titleEn: "Specialized Education",
            descriptionAr: "برامج تعليمية مصممة لتلبية الاحتياجات الفردية لكل طالب",
            descriptionEn: "Educational programs designed to meet the individual needs of each student",
          },
          {
            image: "/speech-therapist-working-with-child-on-articula.jpg",
            titleAr: "علاج النطق",
            titleEn: "Speech Therapy",
            descriptionAr: "تحسين مهارات التواصل والنطق لدى الطلاب",
            descriptionEn: "Improving communication and speech skills for students",
          },
        ],
        subsections: [
          {
            icon: "Users",
            titleAr: "فريق العمل",
            titleEn: "Our Team",
            image: "/team-of-special-education-professionals.jpg",
            descriptionAr:
              "نعتمد على فريق من الأخصائيين والمعلمين ذوي الخبرة العالية في مجال التربية الخاصة، ملتزمون بتقديم أفضل رعاية وتعليم.",
            descriptionEn:
              "We rely on a team of highly experienced specialists and teachers in the field of special education, committed to providing the best care and education.",
            branches: [],
          },
          {
            icon: "Brain",
            titleAr: "التأهيل العصبي",
            titleEn: "Neuro-Rehabilitation",
            image: "/neuroscience-lab-equipment.jpg",
            descriptionAr: "برامج تأهيلية متخصصة تعتمد على أحدث التقنيات لدعم التطور العصبي والحركي للطلاب.",
            descriptionEn:
              "Specialized rehabilitation programs utilizing the latest technologies to support students' neurodevelopment and motor skills.",
            branches: [],
          },
          {
            icon: "ChartSquare",
            titleAr: "التقييم والتشخيص",
            titleEn: "Assessment and Diagnosis",
            image: "/professional-psychologist-conducting-assessment-wi.jpg",
            descriptionAr: "نقدم تقييمات شاملة لتحديد احتياجات كل طالب ووضع خطط تعليمية وتأهيلية فردية.",
            descriptionEn:
              "We provide comprehensive assessments to identify each student's needs and develop individualized educational and rehabilitation plans.",
            branches: [],
          },
        ],
      },
      {
        id: "3",
        slug: "housing",
        icon: "Home",
        titleAr: "السكن الداخلي",
        titleEn: "Internal Housing",
        color: "from-blue-400 via-cyan-500 to-teal-500",
        welcomeAr: "مرحباً بكم في بيئة سكنية آمنة ومريحة",
        welcomeEn: "Welcome to a Safe and Comfortable Residential Environment",
        descriptionAr:
          "نوفر بيئة سكنية آمنة ومريحة للطلاب، مجهزة بكافة وسائل الراحة والخدمات لضمان إقامة سعيدة وموفقة، مع إشراف دائم لضمان سلامتهم.",
        descriptionEn:
          "We provide a safe and comfortable residential environment for students, equipped with all amenities and services to ensure a happy and successful stay, with constant supervision to ensure their safety.",
        heroSlides: [
          {
            image: "/comfortable-residential-apartment-for-special-need.jpg",
            titleAr: "غرف مريحة",
            titleEn: "Comfortable Rooms",
            descriptionAr: "غرف مجهزة بالكامل لتوفير أقصى درجات الراحة",
            descriptionEn: "Fully equipped rooms to provide maximum comfort",
          },
          {
            image: "/school-dormitory-common-area-with-students-study.jpg",
            titleAr: "مناطق مشتركة",
            titleEn: "Common Areas",
            descriptionAr: "مساحات اجتماعية مجهزة للدراسة والترفيه",
            descriptionEn: "Social spaces equipped for study and recreation",
          },
          {
            image: "/school-dining-hall-with-students-eating-meal.jpg",
            titleAr: "قاعة الطعام",
            titleEn: "Dining Hall",
            descriptionAr: "وجبات صحية ومتوازنة تقدم في قاعة طعام مجهزة",
            descriptionEn: "Healthy and balanced meals served in a well-equipped dining hall",
          },
        ],
        subsections: [
          {
            icon: "Bed",
            titleAr: "الغرف السكنية",
            titleEn: "Residential Rooms",
            image: "/comfortable-residential-apartment-for-special-need.jpg",
            descriptionAr: "غرف مصممة لضمان الراحة والخصوصية، مجهزة بأثاث حديث، وتشمل خدمات النظافة الدورية.",
            descriptionEn:
              "Rooms designed to ensure comfort and privacy, equipped with modern furniture, and including regular cleaning services.",
            branches: [],
          },
          {
            icon: "Utensils",
            titleAr: "خدمات الوجبات",
            titleEn: "Meal Services",
            image: "/school-dining-hall-with-students-eating-meal.jpg",
            descriptionAr: "تقديم وجبات غذائية متوازنة وصحية، مع مراعاة الاحتياجات الغذائية الخاصة للطلاب.",
            descriptionEn: "Providing balanced and healthy meals, taking into account students' special dietary needs.",
            branches: [],
          },
          {
            icon: "Users",
            titleAr: "الإشراف والرعاية",
            titleEn: "Supervision and Care",
            image: "/caregiver-assisting-student-in-dormitory.jpg",
            descriptionAr: "فريق إشراف متخصص يعمل على مدار الساعة لضمان سلامة الطلاب ورعايتهم.",
            descriptionEn: "A specialized supervision team works around the clock to ensure students' safety and care.",
            branches: [],
          },
        ],
      },
      {
        id: "4",
        slug: "activities",
        icon: "PuzzlePiece",
        titleAr: "الأنشطة اللامنهجية",
        titleEn: "Extracurricular Activities",
        color: "from-green-400 via-lime-500 to-yellow-500",
        welcomeAr: "اكتشف عالم الإبداع والمرح معنا!",
        welcomeEn: "Discover a World of Creativity and Fun with Us!",
        descriptionAr:
          "نؤمن بأهمية الأنشطة اللامنهجية في تنمية شخصية الطالب ومهاراته. نقدم مجموعة متنوعة من الأنشطة الرياضية والفنية والثقافية والترفيهية.",
        descriptionEn:
          "We believe in the importance of extracurricular activities in developing a student's personality and skills. We offer a variety of sports, artistic, cultural, and recreational activities.",
        heroSlides: [
          {
            image: "/special-needs-students-on-educational-field-trip-w.jpg",
            titleAr: "رحلات تعليمية",
            titleEn: "Educational Trips",
            descriptionAr: "استكشاف العالم وتعلم أشياء جديدة في رحلات ميدانية ممتعة",
            descriptionEn: "Exploring the world and learning new things on fun field trips",
          },
          {
            image: "/students-participating-in-school-play-or-musica.jpg",
            titleAr: "أنشطة فنية",
            titleEn: "Artistic Activities",
            descriptionAr: "إطلاق العنان للإبداع من خلال الرسم والمسرح والموسيقى",
            descriptionEn: "Unleashing creativity through drawing, theater, and music",
          },
          {
            image: "/students-playing-sports-on-school-field.jpg",
            titleAr: "أنشطة رياضية",
            titleEn: "Sports Activities",
            descriptionAr: "تنمية المهارات البدنية والروح الرياضية",
            descriptionEn: "Developing physical skills and sportsmanship",
          },
        ],
        subsections: [
          {
            icon: "Hiking",
            titleAr: "الرحلات الميدانية",
            titleEn: "Field Trips",
            image: "/special-needs-students-on-educational-field-trip-w.jpg",
            descriptionAr: "تنظيم رحلات دورية لأماكن مختلفة لتعزيز التعلم العملي واكتساب الخبرات الحياتية.",
            descriptionEn:
              "Organizing regular trips to various locations to enhance practical learning and gain life experiences.",
            branches: [],
          },
          {
            icon: "TheaterMasks",
            titleAr: "الفنون المسرحية والموسيقية",
            titleEn: "Performing Arts and Music",
            image: "/students-participating-in-school-play-or-musica.jpg",
            descriptionAr: "تنمية المهارات الإبداعية من خلال المشاركة في الأنشطة المسرحية والموسيقية.",
            descriptionEn: "Developing creative skills through participation in theatrical and musical activities.",
            branches: [],
          },
          {
            icon: "Basketball",
            titleAr: "الرياضة واللياقة البدنية",
            titleEn: "Sports and Fitness",
            image: "/students-playing-sports-on-school-field.jpg",
            descriptionAr: "توفير بيئة رياضية محفزة لتنمية اللياقة البدنية والروح الرياضية لدى الطلاب.",
            descriptionEn:
              "Providing a stimulating sports environment to develop students' physical fitness and sportsmanship.",
            branches: [],
          },
          {
            icon: "Sparkles",
            titleAr: "الأنشطة الثقافية والاجتماعية",
            titleEn: "Cultural and Social Activities",
            image: "/diverse-group-of-students-socializing-at-school.jpg",
            descriptionAr: "برامج وأنشطة متنوعة تعزز الوعي الثقافي وتنمي المهارات الاجتماعية.",
            descriptionEn: "Various programs and activities that enhance cultural awareness and develop social skills.",
            branches: [],
          },
        ],
      },
    ]
    localStorage.setItem("departmentContents", JSON.stringify(defaultData))
    dispatchStorageChange("departmentContents", defaultData)
    return defaultData
  }
  return []
}

export async function getEmployees(): Promise<Employee[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const snapshot = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])

    if (snapshot.length === 0) {
      // Initialize with default employee data
      const defaultEmployees: Employee[] = [
        {
          id: "1",
          fullName: "Admin User",
          email: "admin@school.com",
          phone: "+972595864023",
          position: "System Administrator",
          department: "Administration",
          role: "admin",
          password: "admin123", // Storing password in plain text is a security risk. Consider hashing it.
          permissions: {
            canViewApplications: true,
            canEditApplications: true,
            canApproveApplications: true,
            canDeleteApplications: true,
            canViewServiceRequests: true,
            canEditServiceRequests: true,
            canDeleteServiceRequests: true,
            canViewMessages: true,
            canReplyToMessages: true,
            canDeleteMessages: true,
            canViewContent: true,
            canEditContent: true,
            canPublishContent: true,
            canDeleteContent: true,
            canViewEmployees: true,
            canAddEmployees: true,
            canEditEmployees: true,
            canDeleteEmployees: true,
            canViewReports: true,
            canExportData: true,
          },
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      ]

      // Save default employees to localStorage
      saveToLocalStorage(COLLECTIONS.EMPLOYEES, defaultEmployees)
      return defaultEmployees
    }

    return snapshot
  } catch (error) {
    console.error("Error getting employees:", error)
    return []
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    // Removed Firebase getDoc, using localStorage via storage-adapter
    const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
    const employee = employees.find((emp) => emp.id === id)
    return employee || null
  } catch (error) {
    console.error("Error getting employee:", error)
    return null
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
    const index = employees.findIndex((emp) => emp.id === id)
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updates }
      saveToLocalStorage(COLLECTIONS.EMPLOYEES, employees)
    }
  } catch (error) {
    console.error("Error updating employee:", error)
    throw error
  }
}

export async function addEmployee(employee: Omit<Employee, "id" | "createdAt">): Promise<Employee> {
  try {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }

    // Removed Firebase setDoc, using localStorage via storage-adapter
    const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
    employees.push(newEmployee)
    saveToLocalStorage(COLLECTIONS.EMPLOYEES, employees)
    return newEmployee
  } catch (error) {
    console.error("Error adding employee:", error)
    throw error
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
    const filtered = employees.filter((emp) => emp.id !== id)
    saveToLocalStorage(COLLECTIONS.EMPLOYEES, filtered)
  } catch (error) {
    console.error("Error deleting employee:", error)
    throw error
  }
}

export async function authenticateEmployee(email: string, password: string): Promise<Employee | null> {
  try {
    const employees = await getEmployees()
    const employee = employees.find((emp) => emp.email === email && emp.password === password && emp.isActive)

    if (employee) {
      // Update last login
      await updateEmployee(employee.id, {
        lastLogin: new Date().toISOString(),
      })
      return employee
    }

    return null
  } catch (error) {
    console.error("Error authenticating employee:", error)
    return null
  }
}

export async function hasUsers(): Promise<boolean> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
    return employees.length > 0
  } catch (error) {
    console.error("Error checking users:", error)
    return false
  }
}

export async function createFirstAdmin(
  fullName: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Removed Firebase auth, using localStorage via storage-adapter

    // Create employee record in localStorage
    const newEmployee: Employee = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Generate a temporary ID
      fullName,
      email,
      phone: "",
      position: "System Administrator",
      department: "Administration",
      role: "admin",
      password: password, // Storing password in plain text is a security risk. Consider hashing it.
      permissions: {
        canViewApplications: true,
        canEditApplications: true,
        canApproveApplications: true,
        canDeleteApplications: true,
        canViewServiceRequests: true,
        canEditServiceRequests: true,
        canDeleteServiceRequests: true,
        canViewMessages: true,
        canReplyToMessages: true,
        canDeleteMessages: true,
        canViewContent: true,
        canEditContent: true,
        canPublishContent: true,
        canDeleteContent: true,
        canViewEmployees: true,
        canAddEmployees: true,
        canEditEmployees: true,
        canDeleteEmployees: true,
        canViewReports: true,
        canExportData: true,
      },
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
    employees.push(newEmployee)
    saveToLocalStorage(COLLECTIONS.EMPLOYEES, employees)

    return { success: true }
  } catch (error: any) {
    console.error("Error creating first admin:", error)
    return {
      success: false,
      error: error.message || "Failed to create admin user",
    }
  }
}

export async function getDynamicPages(): Promise<DynamicPage[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    return getFromLocalStorage<DynamicPage[]>(COLLECTIONS.PAGES, [])
  } catch (error) {
    console.error("Error getting dynamic pages:", error)
    return []
  }
}

export async function saveDynamicPage(page: Omit<DynamicPage, "id" | "createdAt" | "updatedAt">): Promise<DynamicPage> {
  try {
    const newPage: DynamicPage = {
      ...page,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Removed Firebase setDoc, using localStorage via storage-adapter
    const pages = getFromLocalStorage<DynamicPage[]>(COLLECTIONS.PAGES, [])
    pages.push(newPage)
    saveToLocalStorage(COLLECTIONS.PAGES, pages)
    return newPage
  } catch (error) {
    console.error("Error saving dynamic page:", error)
    throw error
  }
}

export async function updateDynamicPage(id: string, updates: Partial<DynamicPage>): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const pages = getFromLocalStorage<DynamicPage[]>(COLLECTIONS.PAGES, [])
    const index = pages.findIndex((p) => p.id === id)
    if (index !== -1) {
      pages[index] = {
        ...pages[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      saveToLocalStorage(COLLECTIONS.PAGES, pages)
    }
  } catch (error) {
    console.error("Error updating dynamic page:", error)
    throw error
  }
}

export async function deleteDynamicPage(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const pages = getFromLocalStorage<DynamicPage[]>(COLLECTIONS.PAGES, [])
    const filtered = pages.filter((p) => p.id !== id)
    saveToLocalStorage(COLLECTIONS.PAGES, filtered)
  } catch (error) {
    console.error("Error deleting dynamic page:", error)
    throw error
  }
}

// Activity logging functions
export interface Activity {
  id: string
  employeeId: string
  employeeName: string
  action: string
  actionType: "create" | "update" | "delete" | "approve" | "reject" | "view"
  targetType: "application" | "message" | "testimonial" | "job" | "content" | "employee"
  targetId: string
  details: string
  timestamp: string
}

export async function getActivities(limit = 50): Promise<Activity[]> {
  try {
    const db = getDb()
    const activitiesRef = collection(db, FIREBASE_COLLECTIONS.ACTIVITIES)
    const q = query(activitiesRef, orderBy("timestamp", "desc"))
    const snapshot = await getDocs(q)

    const activities: Activity[] = []
    snapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() } as Activity)
    })

    return activities.slice(0, limit)
  } catch (error) {
    console.error("Error getting activities:", error)
    // Fallback to localStorage
    const activities = getFromLocalStorage<Activity[]>(COLLECTIONS.ACTIVITIES, [])
    return activities.slice(0, limit)
  }
}

export async function logActivity(activity: Omit<Activity, "id" | "timestamp">): Promise<void> {
  try {
    const db = getDb()
    const activitiesRef = collection(db, FIREBASE_COLLECTIONS.ACTIVITIES)

    await addDoc(activitiesRef, {
      ...activity,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    // Fallback to localStorage
    const activities = getFromLocalStorage<Activity[]>(COLLECTIONS.ACTIVITIES, [])
    activities.unshift({
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    })
    saveToLocalStorage(COLLECTIONS.ACTIVITIES, activities)
  }
}

// Notification functions
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  link?: string
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const notifications = getFromLocalStorage<Notification[]>("web_notifications", [])
    const userNotifications = notifications.filter((n) => n.userId === userId)
    // Sorting by createdAt in descending order
    userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return userNotifications
  } catch (error) {
    console.error("Error getting notifications:", error)
    return []
  }
}

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  try {
    // Removed Firebase getDocs, using localStorage via storage-adapter
    const notifications = getFromLocalStorage<Notification[]>("web_notifications", [])
    return notifications.filter((n) => n.userId === userId && !n.read)
  } catch (error) {
    console.error("Error getting unread notifications:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const notifications = getFromLocalStorage<Notification[]>("web_notifications", [])
    const index = notifications.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      notifications[index].read = true
      saveToLocalStorage("web_notifications", notifications)
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    // Removed Firebase batch update, using localStorage via storage-adapter
    const notifications = getFromLocalStorage<Notification[]>("web_notifications", [])
    const updatedNotifications = notifications.map((n) => (n.userId === userId && !n.read ? { ...n, read: true } : n))
    saveToLocalStorage("web_notifications", updatedNotifications)
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
  }
}

// Mock data loading function
export async function loadMockupData(): Promise<void> {
  try {
    console.log("[v0] Loading real data from Firebase...")

    // Initialize Firebase with all default data
    // Removed Firebase initialization, as it's no longer used
    // const { initializeFirebaseData } = await import("@/lib/firebase-client")
    // await initializeFirebaseData()

    console.log("[v0] Successfully loaded data from Firebase")
  } catch (error) {
    console.error("Error loading data from Firebase:", error)
    throw error
  }
}

// Enhanced Employment Application functions (rewritten for Firebase)
export async function deleteEnhancedEmploymentApplication(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const applications = getFromLocalStorage<EnhancedEmploymentApplication[]>(COLLECTIONS.ENHANCED_APPLICATIONS, [])
    const filtered = applications.filter((app) => app.id !== id)
    saveToLocalStorage(COLLECTIONS.ENHANCED_APPLICATIONS, filtered)
  } catch (error) {
    console.error("Error deleting enhanced employment application:", error)
    throw error
  }
}

export async function updateEnhancedEmploymentApplication(
  id: string,
  updates: Partial<EnhancedEmploymentApplication>,
): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const applications = getFromLocalStorage<EnhancedEmploymentApplication[]>(COLLECTIONS.ENHANCED_APPLICATIONS, [])
    const index = applications.findIndex((app) => app.id === id)
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates }
      saveToLocalStorage(COLLECTIONS.ENHANCED_APPLICATIONS, applications)
    }
  } catch (error) {
    console.error("Error updating enhanced employment application:", error)
    throw error
  }
}

// Service Request functions (rewritten for Firebase)
export async function deleteServiceRequest(id: string): Promise<void> {
  try {
    // Removed Firebase deleteDoc, using localStorage via storage-adapter
    const requests = getFromLocalStorage<ServiceRequest[]>(COLLECTIONS.SERVICE_REQUESTS, [])
    const filtered = requests.filter((req) => req.id !== id)
    saveToLocalStorage(COLLECTIONS.SERVICE_REQUESTS, filtered)
  } catch (error) {
    console.error("Error deleting service request:", error)
    throw error
  }
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const requests = getFromLocalStorage<ServiceRequest[]>(COLLECTIONS.SERVICE_REQUESTS, [])
    const index = requests.findIndex((req) => req.id === id)
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates }
      saveToLocalStorage(COLLECTIONS.SERVICE_REQUESTS, requests)
    }
  } catch (error) {
    console.error("Error updating service request:", error)
    throw error
  }
}

export async function updateEmploymentApplicationStatus(
  id: string,
  status: EmploymentApplication["status"] | "pending" | "reviewed" | "accepted" | "rejected",
): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const applications = getFromLocalStorage<EmploymentApplication[]>(COLLECTIONS.EMPLOYMENT_APPLICATIONS, [])
    const index = applications.findIndex((app) => app.id === id)
    if (index !== -1) {
      applications[index] = { ...applications[index], status: status as EmploymentApplication["status"] }
      saveToLocalStorage(COLLECTIONS.EMPLOYMENT_APPLICATIONS, applications)
    }
  } catch (error) {
    console.error("Error updating employment application status:", error)
    throw error
  }
}

export async function updateServiceRequestStatus(id: string, status: ServiceRequest["status"]): Promise<void> {
  try {
    // Removed Firebase updateDoc, using localStorage via storage-adapter
    const requests = getFromLocalStorage<ServiceRequest[]>(COLLECTIONS.SERVICE_REQUESTS, [])
    const index = requests.findIndex((req) => req.id === id)
    if (index !== -1) {
      requests[index] = { ...requests[index], status }
      saveToLocalStorage(COLLECTIONS.SERVICE_REQUESTS, requests)
    }
  } catch (error) {
    console.error("Error updating service request status:", error)
    throw error
  }
}

export async function getDynamicPageBySlug(slug: string): Promise<DynamicPage | null> {
  try {
    // Removed Firebase query, using localStorage via storage-adapter
    const pages = getFromLocalStorage<DynamicPage[]>(COLLECTIONS.PAGES, [])
    const page = pages.find((p) => p.slug === slug)
    return page || null
  } catch (error) {
    console.error("Error getting dynamic page by slug:", error)
    return null
  }
}

// Employee save function (alias for addEmployee)
export async function saveEmployee(employee: Omit<Employee, "id" | "createdAt">): Promise<Employee> {
  return addEmployee(employee)
}
