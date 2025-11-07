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

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  activityId?: string
  isRead: boolean
  createdAt: string
}

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

export function saveEmploymentApplication(data: Omit<EmploymentApplication, "id" | "submittedAt">): void {
  if (typeof window !== "undefined") {
    const applications = getEmploymentApplications()
    const newApplication: EmploymentApplication = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    }
    applications.push(newApplication)
    localStorage.setItem("employmentApplications", JSON.stringify(applications))
  }
}

export function getEmploymentApplications(): EmploymentApplication[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("employmentApplications")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function deleteEmploymentApplication(id: string): void {
  if (typeof window !== "undefined") {
    const applications = getEmploymentApplications().filter((app) => app.id !== id)
    localStorage.setItem("employmentApplications", JSON.stringify(applications))
  }
}

export function saveContactMessage(data: Omit<ContactMessage, "id" | "submittedAt">): void {
  if (typeof window !== "undefined") {
    const messages = getContactMessages()
    const newMessage: ContactMessage = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    }
    messages.push(newMessage)
    localStorage.setItem("contactMessages", JSON.stringify(messages))
  }
}

export function getContactMessages(): ContactMessage[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("contactMessages")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function deleteContactMessage(id: string): void {
  if (typeof window !== "undefined") {
    const messages = getContactMessages().filter((msg) => msg.id !== id)
    localStorage.setItem("contactMessages", JSON.stringify(messages))
  }
}

export function saveTestimonial(data: Omit<Testimonial, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const testimonials = getTestimonials()
    const newTestimonial: Testimonial = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    testimonials.push(newTestimonial)
    localStorage.setItem("testimonials", JSON.stringify(testimonials))
  }
}

export function getTestimonials(): Testimonial[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("testimonials")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function deleteTestimonial(id: string): void {
  if (typeof window !== "undefined") {
    const testimonials = getTestimonials().filter((t) => t.id !== id)
    localStorage.setItem("testimonials", JSON.stringify(testimonials))
  }
}

export function saveJobPosition(data: Omit<JobPosition, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const jobs = getJobPositions()
    const newJob: JobPosition = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    jobs.push(newJob)
    localStorage.setItem("jobPositions", JSON.stringify(jobs))
  }
}

export function getJobPositions(): JobPosition[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("jobPositions")
    if (data) {
      return JSON.parse(data)
    }
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
        createdAt: "2025/01/06",
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
        createdAt: "2025/01/06",
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
        createdAt: "2025/01/06",
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
        createdAt: "2025/01/06",
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
        createdAt: "2025/01/06",
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
        createdAt: "2025/01/06",
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
        createdAt: "2025/01/06",
      },
    ]
    localStorage.setItem("jobPositions", JSON.stringify(defaultJobs))
    return defaultJobs
  }
  return []
}

export function getAvailableJobs(): JobPosition[] {
  return getJobPositions()
}

export function deleteJobPosition(id: string): void {
  if (typeof window !== "undefined") {
    const jobs = getJobPositions().filter((job) => job.id !== id)
    localStorage.setItem("jobPositions", JSON.stringify(jobs))
  }
}

export function updateJobPosition(id: string, data: Omit<JobPosition, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const jobs = getJobPositions()
    const index = jobs.findIndex((job) => job.id === id)
    if (index !== -1) {
      jobs[index] = {
        ...jobs[index],
        ...data,
      }
      localStorage.setItem("jobPositions", JSON.stringify(jobs))
    }
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

export function getHeroSlides(): HeroSlide[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("heroSlides")
    if (data) {
      return JSON.parse(data)
    }
    // الشرائح الافتراضية
    const defaultSlides: HeroSlide[] = [
      {
        image: "/modern-special-education-school-classroom-with-div.jpg",
        titleAr: "المدرسة النموذجية",
        titleEn: "Al Namothajia School",
        descriptionAr: "لتعزيز التعليم والإبداع في بيئة مريحة وآمنة تراعي الفروق الفردية وتطور قدرات كل طالب",
        descriptionEn: "To enhance education and creativity in a comfortable and safe environment",
      },
      {
        image: "/happy-special-needs-students-learning-together-wit.jpg",
        titleAr: "تعليم متميز",
        titleEn: "Distinguished Education",
        descriptionAr: "نبني جيلاً واعياً ومبدعاً لمستقبل أفضل",
        descriptionEn: "Building a conscious and creative generation for a better future",
      },
      {
        image: "/modern-special-education-school-facilities-with-ad.jpg",
        titleAr: "بيئة تعليمية حديثة",
        titleEn: "Modern Learning Environment",
        descriptionAr: "نوفر أحدث الوسائل التعليمية لتجربة تعلم فريدة",
        descriptionEn: "We provide the latest educational tools for a unique learning experience",
      },
    ]
    localStorage.setItem("heroSlides", JSON.stringify(defaultSlides))
    return defaultSlides
  }
  return []
}

export function saveHeroSlide(data: Omit<HeroSlide, "id">): void {
  if (typeof window !== "undefined") {
    const slides = getHeroSlides()
    const newSlide: HeroSlide = {
      ...data,
      id: Date.now().toString(),
    }
    slides.push(newSlide)
    localStorage.setItem("heroSlides", JSON.stringify(slides))
    dispatchStorageChange("heroSlides", slides)
  }
}

export function updateHeroSlide(id: string, data: Partial<HeroSlide>): void {
  if (typeof window !== "undefined") {
    const slides = getHeroSlides()
    const index = slides.findIndex((s) => s.id === id)
    if (index !== -1) {
      slides[index] = { ...slides[index], ...data }
      localStorage.setItem("heroSlides", JSON.stringify(slides))
      dispatchStorageChange("heroSlides", slides)
    }
  }
}

export function deleteHeroSlide(id: string): void {
  if (typeof window !== "undefined") {
    const slides = getHeroSlides().filter((s) => s.id !== id)
    localStorage.setItem("heroSlides", JSON.stringify(slides))
    dispatchStorageChange("heroSlides", slides)
  }
}

export function getDepartmentContents(): DepartmentContent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("departmentContents")

    if (data) {
      const existingContents = JSON.parse(data)
      if (existingContents.length !== 4 || !existingContents.some((c: DepartmentContent) => c.type === "heart")) {
        // إعادة تحميل البيانات الافتراضية الجديدة
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
        localStorage.setItem("departmentContents", JSON.stringify(defaultContents))
        dispatchStorageChange("departmentContents", defaultContents)
        return defaultContents
      }
      return existingContents
    }

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
    localStorage.setItem("departmentContents", JSON.stringify(defaultContents))
    dispatchStorageChange("departmentContents", defaultContents)
    return defaultContents
  }
  return []
}

export function updateDepartmentContent(id: string, data: Partial<DepartmentContent>): void {
  if (typeof window !== "undefined") {
    const contents = getDepartmentContents()
    const index = contents.findIndex((c) => c.id === id)
    if (index !== -1) {
      contents[index] = { ...contents[index], ...data }
      localStorage.setItem("departmentContents", JSON.stringify(contents))
      dispatchStorageChange("departmentContents", contents)
    }
  }
}

export function getContactInfo(): ContactInfo | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("contactInfo")
    if (data) {
      return JSON.parse(data)
    }
    // المعلومات الافتراضية
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
    localStorage.setItem("contactInfo", JSON.stringify(defaultInfo))
    return defaultInfo
  }
  return null
}

export function updateContactInfo(data: ContactInfo): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("contactInfo", JSON.stringify(data))
    dispatchStorageChange("contactInfo", data)
  }
}

export function getAboutContent(): AboutContent | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("aboutContent")
    if (data) {
      return JSON.parse(data)
    }
    // المحتوى الافتراضي لقسم "عن المدرسة"
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
          descriptionEn: "Specialized and qualified staff of teachers and specialists experienced in special education",
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
    localStorage.setItem("aboutContent", JSON.stringify(defaultContent))
    return defaultContent
  }
  return null
}

export function updateAboutContent(data: AboutContent): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("aboutContent", JSON.stringify(data))
    dispatchStorageChange("aboutContent", data)
  }
}

export function getGalleryImages(): GalleryImage[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("galleryImages")
    if (data) {
      return JSON.parse(data)
    }
    // الصور الافتراضية للمعرض
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
    localStorage.setItem("galleryImages", JSON.stringify(defaultImages))
    return defaultImages
  }
  return []
}

export function saveGalleryImage(data: Omit<GalleryImage, "id">): void {
  if (typeof window !== "undefined") {
    const images = getGalleryImages()
    const newImage: GalleryImage = {
      ...data,
      id: Date.now().toString(),
    }
    images.push(newImage)
    localStorage.setItem("galleryImages", JSON.stringify(images))
    dispatchStorageChange("galleryImages", images)
  }
}

export function updateGalleryImage(id: string, data: Partial<GalleryImage>): void {
  if (typeof window !== "undefined") {
    const images = getGalleryImages()
    const index = images.findIndex((img) => img.id === id)
    if (index !== -1) {
      images[index] = { ...images[index], ...data }
      localStorage.setItem("galleryImages", JSON.stringify(images))
      dispatchStorageChange("galleryImages", images)
    }
  }
}

export function deleteGalleryImage(id: string): void {
  if (typeof window !== "undefined") {
    const images = getGalleryImages().filter((img) => img.id !== id)
    localStorage.setItem("galleryImages", JSON.stringify(images))
    dispatchStorageChange("galleryImages", images)
  }
}

export function saveEnhancedEmploymentApplication(
  data: Omit<EnhancedEmploymentApplication, "id" | "submittedAt" | "status">,
): EnhancedEmploymentApplication {
  if (typeof window !== "undefined") {
    const applications = getEnhancedEmploymentApplications()
    const newApplication: EnhancedEmploymentApplication = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    applications.push(newApplication)
    localStorage.setItem("enhancedEmploymentApplications", JSON.stringify(applications))
    dispatchStorageChange("enhancedEmploymentApplications", applications)
    return newApplication
  }
  return {} as EnhancedEmploymentApplication
}

export function getEnhancedEmploymentApplications(): EnhancedEmploymentApplication[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("enhancedEmploymentApplications")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function updateEmploymentApplicationStatus(
  id: string,
  status: EnhancedEmploymentApplication["status"],
  notes?: string,
): void {
  if (typeof window !== "undefined") {
    const applications = getEnhancedEmploymentApplications()
    const index = applications.findIndex((app) => app.id === id)
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        status,
        notes: notes || applications[index].notes,
      }
      localStorage.setItem("enhancedEmploymentApplications", JSON.stringify(applications))
      dispatchStorageChange("enhancedEmploymentApplications", applications)
    }
  }
}

export function updateEnhancedEmploymentApplication(
  id: string,
  updates: Partial<Omit<EnhancedEmploymentApplication, "id" | "submittedAt">>,
): void {
  if (typeof window !== "undefined") {
    const applications = getEnhancedEmploymentApplications()
    const index = applications.findIndex((app) => app.id === id)
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...updates,
      }
      localStorage.setItem("enhancedEmploymentApplications", JSON.stringify(applications))
      dispatchStorageChange("enhancedEmploymentApplications", applications)
    }
  }
}

export function deleteEnhancedEmploymentApplication(id: string): void {
  if (typeof window !== "undefined") {
    const applications = getEnhancedEmploymentApplications().filter((app) => app.id !== id)
    localStorage.setItem("enhancedEmploymentApplications", JSON.stringify(applications))
    dispatchStorageChange("enhancedEmploymentApplications", applications)
  }
}

export function saveServiceRequest(data: Omit<ServiceRequest, "id" | "submittedAt" | "status">): ServiceRequest {
  if (typeof window !== "undefined") {
    const requests = getServiceRequests()
    const newRequest: ServiceRequest = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    requests.push(newRequest)
    localStorage.setItem("serviceRequests", JSON.stringify(requests))
    dispatchStorageChange("serviceRequests", requests)
    return newRequest
  }
  return {} as ServiceRequest
}

export function getServiceRequests(): ServiceRequest[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("serviceRequests")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function updateServiceRequestStatus(id: string, status: ServiceRequest["status"], notes?: string): void {
  if (typeof window !== "undefined") {
    const requests = getServiceRequests()
    const index = requests.findIndex((req) => req.id === id)
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status,
        notes: notes || requests[index].notes,
      }
      localStorage.setItem("serviceRequests", JSON.stringify(requests))
      dispatchStorageChange("serviceRequests", requests)
    }
  }
}

export function updateServiceRequest(id: string, updates: Partial<Omit<ServiceRequest, "id" | "submittedAt">>): void {
  if (typeof window !== "undefined") {
    const requests = getServiceRequests()
    const index = requests.findIndex((req) => req.id === id)
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        ...updates,
      }
      localStorage.setItem("serviceRequests", JSON.stringify(requests))
      dispatchStorageChange("serviceRequests", requests)
    }
  }
}

export function deleteServiceRequest(id: string): void {
  if (typeof window !== "undefined") {
    const requests = getServiceRequests().filter((req) => req.id !== id)
    localStorage.setItem("serviceRequests", JSON.stringify(requests))
    dispatchStorageChange("serviceRequests", requests)
  }
}

export function getFullDepartmentsData(): DepartmentData[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("fullDepartmentsData")
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

    localStorage.setItem("fullDepartmentsData", JSON.stringify(defaultData))
    dispatchStorageChange("fullDepartmentsData", defaultData)
    return defaultData
  }
  return []
}

export function updateFullDepartmentData(slug: string, data: Partial<DepartmentData>): void {
  if (typeof window !== "undefined") {
    const departments = getFullDepartmentsData()
    const index = departments.findIndex((d) => d.slug === slug)
    if (index !== -1) {
      departments[index] = { ...departments[index], ...data }
      localStorage.setItem("fullDepartmentsData", JSON.stringify(departments))
      dispatchStorageChange("fullDepartmentsData", departments)
    }
  }
}

export function updateSubsection(slug: string, subsectionIndex: number, data: Partial<Subsection>): void {
  if (typeof window !== "undefined") {
    const departments = getFullDepartmentsData()
    const deptIndex = departments.findIndex((d) => d.slug === slug)
    if (deptIndex !== -1 && departments[deptIndex].subsections[subsectionIndex]) {
      departments[deptIndex].subsections[subsectionIndex] = {
        ...departments[deptIndex].subsections[subsectionIndex],
        ...data,
      }
      localStorage.setItem("fullDepartmentsData", JSON.stringify(departments))
      dispatchStorageChange("fullDepartmentsData", departments)
    }
  }
}

export function addSubsectionBranch(slug: string, subsectionIndex: number, branch: SubsectionBranch): void {
  if (typeof window !== "undefined") {
    const departments = getFullDepartmentsData()
    const deptIndex = departments.findIndex((d) => d.slug === slug)
    if (deptIndex !== -1 && departments[deptIndex].subsections[subsectionIndex]) {
      if (!departments[deptIndex].subsections[subsectionIndex].branches) {
        departments[deptIndex].subsections[subsectionIndex].branches = []
      }
      departments[deptIndex].subsections[subsectionIndex].branches!.push(branch)
      localStorage.setItem("fullDepartmentsData", JSON.stringify(departments))
      dispatchStorageChange("fullDepartmentsData", departments)
    }
  }
}

export function updateSubsectionBranch(
  slug: string,
  subsectionIndex: number,
  branchIndex: number,
  data: Partial<SubsectionBranch>,
): void {
  if (typeof window !== "undefined") {
    const departments = getFullDepartmentsData()
    const deptIndex = departments.findIndex((d) => d.slug === slug)
    if (
      deptIndex !== -1 &&
      departments[deptIndex].subsections[subsectionIndex] &&
      departments[deptIndex].subsections[subsectionIndex].branches &&
      departments[deptIndex].subsections[subsectionIndex].branches![branchIndex]
    ) {
      departments[deptIndex].subsections[subsectionIndex].branches![branchIndex] = {
        ...departments[deptIndex].subsections[subsectionIndex].branches![branchIndex],
        ...data,
      }
      localStorage.setItem("fullDepartmentsData", JSON.stringify(departments))
      dispatchStorageChange("fullDepartmentsData", departments)
    }
  }
}

export function deleteSubsectionBranch(slug: string, subsectionIndex: number, branchIndex: number): void {
  if (typeof window !== "undefined") {
    const departments = getFullDepartmentsData()
    const deptIndex = departments.findIndex((d) => d.slug === slug)
    if (
      deptIndex !== -1 &&
      departments[deptIndex].subsections[subsectionIndex] &&
      departments[deptIndex].subsections[subsectionIndex].branches
    ) {
      departments[deptIndex].subsections[subsectionIndex].branches!.splice(branchIndex, 1)
      localStorage.setItem("fullDepartmentsData", JSON.stringify(departments))
      dispatchStorageChange("fullDepartmentsData", departments)
    }
  }
}

export function saveEmployee(data: Omit<Employee, "id" | "createdAt">): Employee {
  if (typeof window !== "undefined") {
    const employees = getEmployees()
    const newEmployee: Employee = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    employees.push(newEmployee)
    localStorage.setItem("employees", JSON.stringify(employees))

    // تسجيل النشاط
    logActivity({
      employeeId: "admin",
      employeeName: "المدير",
      action: `تم إضافة موظف جديد: ${data.fullName}`,
      actionType: "create",
      targetType: "employee",
      targetId: newEmployee.id,
      details: `القسم: ${data.department}, الوظيفة: ${data.position}`,
    })

    dispatchStorageChange("employees", employees)
    return newEmployee
  }
  return {} as Employee
}

export function getEmployees(): Employee[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("employees")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function updateEmployee(id: string, data: Partial<Employee>): void {
  if (typeof window !== "undefined") {
    const employees = getEmployees()
    const index = employees.findIndex((emp) => emp.id === id)
    if (index !== -1) {
      const oldEmployee = employees[index]
      employees[index] = { ...employees[index], ...data }
      localStorage.setItem("employees", JSON.stringify(employees))

      // تسجيل النشاط
      logActivity({
        employeeId: "admin",
        employeeName: "المدير",
        action: `تم تحديث بيانات الموظف: ${oldEmployee.fullName}`,
        actionType: "update",
        targetType: "employee",
        targetId: id,
        details: `التغييرات: ${Object.keys(data).join(", ")}`,
      })

      dispatchStorageChange("employees", employees)
    }
  }
}

export function deleteEmployee(id: string): void {
  if (typeof window !== "undefined") {
    const employees = getEmployees()
    const employee = employees.find((emp) => emp.id === id)
    if (employee) {
      const filtered = employees.filter((emp) => emp.id !== id)
      localStorage.setItem("employees", JSON.stringify(filtered))

      // تسجيل النشاط
      logActivity({
        employeeId: "admin",
        employeeName: "المدير",
        action: `تم حذف الموظف: ${employee.fullName}`,
        actionType: "delete",
        targetType: "employee",
        targetId: id,
        details: `القسم: ${employee.department}`,
      })

      dispatchStorageChange("employees", filtered)
    }
  }
}

export function getEmployeeById(id: string): Employee | null {
  const employees = getEmployees()
  return employees.find((emp) => emp.id === id) || null
}

export function getStaff(): Staff[] {
  return getEmployees()
}

export function getDefaultPermissions(role: Employee["role"]): Employee["permissions"] {
  const allPermissions: Employee["permissions"] = {
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
  }

  const hrManagerPermissions: Employee["permissions"] = {
    canViewApplications: true,
    canEditApplications: true,
    canApproveApplications: true,
    canDeleteApplications: true,
    canViewServiceRequests: true,
    canEditServiceRequests: false,
    canDeleteServiceRequests: false,
    canViewMessages: true,
    canReplyToMessages: true,
    canDeleteMessages: false,
    canViewContent: false,
    canEditContent: false,
    canPublishContent: false,
    canDeleteContent: false,
    canViewEmployees: true,
    canAddEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewReports: true,
    canExportData: true,
  }

  const serviceManagerPermissions: Employee["permissions"] = {
    canViewApplications: true,
    canEditApplications: false,
    canApproveApplications: false,
    canDeleteApplications: false,
    canViewServiceRequests: true,
    canEditServiceRequests: true,
    canDeleteServiceRequests: true,
    canViewMessages: true,
    canReplyToMessages: true,
    canDeleteMessages: false,
    canViewContent: false,
    canEditContent: false,
    canPublishContent: false,
    canDeleteContent: false,
    canViewEmployees: false,
    canAddEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewReports: true,
    canExportData: true,
  }

  const contentManagerPermissions: Employee["permissions"] = {
    canViewApplications: false,
    canEditApplications: false,
    canApproveApplications: false,
    canDeleteApplications: false,
    canViewServiceRequests: false,
    canEditServiceRequests: false,
    canDeleteServiceRequests: false,
    canViewMessages: true,
    canReplyToMessages: false,
    canDeleteMessages: false,
    canViewContent: true,
    canEditContent: true,
    canPublishContent: true,
    canDeleteContent: true,
    canViewEmployees: false,
    canAddEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewReports: false,
    canExportData: false,
  }

  const receptionistPermissions: Employee["permissions"] = {
    canViewApplications: true,
    canEditApplications: false,
    canApproveApplications: false,
    canDeleteApplications: false,
    canViewServiceRequests: true,
    canEditServiceRequests: false,
    canDeleteServiceRequests: false,
    canViewMessages: true,
    canReplyToMessages: true,
    canDeleteMessages: false,
    canViewContent: false,
    canEditContent: false,
    canPublishContent: false,
    canDeleteContent: false,
    canViewEmployees: false,
    canAddEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewReports: false,
    canExportData: false,
  }

  const viewerPermissions: Employee["permissions"] = {
    canViewApplications: true,
    canEditApplications: false,
    canApproveApplications: false,
    canDeleteApplications: false,
    canViewServiceRequests: true,
    canEditServiceRequests: false,
    canDeleteServiceRequests: false,
    canViewMessages: true,
    canReplyToMessages: false,
    canDeleteMessages: false,
    canViewContent: true,
    canEditContent: false,
    canPublishContent: false,
    canDeleteContent: false,
    canViewEmployees: false,
    canAddEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewReports: false,
    canExportData: false,
  }

  switch (role) {
    case "admin":
      return allPermissions
    case "hr_manager":
      return hrManagerPermissions
    case "service_manager":
      return serviceManagerPermissions
    case "content_manager":
      return contentManagerPermissions
    case "receptionist":
      return receptionistPermissions
    case "viewer":
      return viewerPermissions
    default:
      return viewerPermissions
  }
}

export function getRolePermissions(role: Employee["role"]): string[] {
  const permissions: Record<Employee["role"], string[]> = {
    admin: [
      "عرض جميع الطلبات",
      "تعديل جميع الطلبات",
      "الموافقة على الطلبات",
      "حذف الطلبات",
      "إدارة الموظفين",
      "إدارة المحتوى",
      "عرض التقارير",
      "تصدير البيانات",
    ],
    hr_manager: [
      "عرض طلبات التوظيف",
      "تعديل طلبات التوظيف",
      "الموافقة على طلبات التوظيف",
      "حذف طلبات التوظيف",
      "عرض الرسائل",
      "الرد على الرسائل",
      "عرض التقارير",
      "تصدير البيانات",
    ],
    service_manager: [
      "عرض طلبات الخدمة",
      "تعديل طلبات الخدمة",
      "حذف طلبات الخدمة",
      "عرض الرسائل",
      "الرد على الرسائل",
      "عرض التقارير",
      "تصدير البيانات",
    ],
    content_manager: ["عرض المحتوى", "تعديل المحتوى", "نشر المحتوى", "حذف المحتوى", "عرض الرسائل"],
    receptionist: ["عرض طلبات التوظيف", "عرض طلبات الخدمة", "عرض الرسائل", "الرد على الرسائل"],
    employee: ["عرض طلبات التوظيف", "عرض طلبات الخدمة", "عرض الرسائل"],
    viewer: ["عرض طلبات التوظيف", "عرض طلبات الخدمة", "عرض الرسائل", "عرض المحتوى"],
  }

  return permissions[role] || permissions.viewer
}

export function logActivity(data: Omit<Activity, "id" | "timestamp">): void {
  if (typeof window !== "undefined") {
    const activities = getActivities()
    const newActivity: Activity = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }
    activities.unshift(newActivity) // إضافة في البداية

    // الاحتفاظ بآخر 1000 نشاط فقط
    if (activities.length > 1000) {
      activities.splice(1000)
    }

    localStorage.setItem("activities", JSON.stringify(activities))

    // إنشاء إشعار للمدير
    if (data.employeeId !== "admin") {
      createNotification({
        title: "نشاط جديد",
        message: data.action,
        type: "info",
        activityId: newActivity.id,
      })
    }

    dispatchStorageChange("activities", activities)
  }
}

export function getActivities(limit?: number): Activity[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("activities")
    const activities = data ? JSON.parse(data) : []
    return limit ? activities.slice(0, limit) : activities
  }
  return []
}

export function getActivitiesByEmployee(employeeId: string, limit?: number): Activity[] {
  const activities = getActivities()
  const filtered = activities.filter((act) => act.employeeId === employeeId)
  return limit ? filtered.slice(0, limit) : filtered
}

export function clearActivities(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("activities", JSON.stringify([]))
    dispatchStorageChange("activities", [])
  }
}

export function createNotification(data: Omit<Notification, "id" | "createdAt" | "isRead">): void {
  if (typeof window !== "undefined") {
    const notifications = getNotifications()
    const newNotification: Notification = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false,
    }
    notifications.unshift(newNotification)

    // الاحتفاظ بآخر 100 إشعار فقط
    if (notifications.length > 100) {
      notifications.splice(100)
    }

    localStorage.setItem("notifications", JSON.stringify(notifications))
    dispatchStorageChange("notifications", notifications)
  }
}

export function getNotifications(): Notification[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("notifications")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function getUnreadNotifications(): Notification[] {
  return getNotifications().filter((n) => !n.isRead)
}

export function markNotificationAsRead(id: string): void {
  if (typeof window !== "undefined") {
    const notifications = getNotifications()
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications[index].isRead = true
      localStorage.setItem("notifications", JSON.stringify(notifications))
      dispatchStorageChange("notifications", notifications)
    }
  }
}

export function markAllNotificationsAsRead(): void {
  if (typeof window !== "undefined") {
    const notifications = getNotifications()
    notifications.forEach((n) => (n.isRead = true))
    localStorage.setItem("notifications", JSON.stringify(notifications))
    dispatchStorageChange("notifications", notifications)
  }
}

export function deleteNotification(id: string): void {
  if (typeof window !== "undefined") {
    const notifications = getNotifications().filter((n) => n.id !== id)
    localStorage.setItem("notifications", JSON.stringify(notifications))
    dispatchStorageChange("notifications", notifications)
  }
}

export function getDynamicPages(): DynamicPage[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("dynamicPages")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveDynamicPage(data: Omit<DynamicPage, "id" | "createdAt" | "updatedAt">): DynamicPage {
  if (typeof window !== "undefined") {
    const pages = getDynamicPages()
    const newPage: DynamicPage = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    pages.push(newPage)
    localStorage.setItem("dynamicPages", JSON.stringify(pages))
    dispatchStorageChange("dynamicPages", pages)
    return newPage
  }
  return {} as DynamicPage
}

export function updateDynamicPage(id: string, data: Partial<DynamicPage>): void {
  if (typeof window !== "undefined") {
    const pages = getDynamicPages()
    const index = pages.findIndex((page) => page.id === id)
    if (index !== -1) {
      pages[index] = {
        ...pages[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("dynamicPages", JSON.stringify(pages))
      dispatchStorageChange("dynamicPages", pages)
    }
  }
}

export function deleteDynamicPage(id: string): void {
  if (typeof window !== "undefined") {
    const pages = getDynamicPages().filter((page) => page.id !== id)
    localStorage.setItem("dynamicPages", JSON.stringify(pages))
    dispatchStorageChange("dynamicPages", pages)
  }
}

export function getDynamicPageBySlug(slug: string): DynamicPage | null {
  const pages = getDynamicPages()
  return pages.find((page) => page.slug === slug && page.isPublished) || null
}

export function generateMockupEmployees(): Employee[] {
  return [
    {
      id: "emp-001",
      fullName: "أحمد محمد العلي",
      email: "ahmed.ali@school.edu",
      phone: "+966501234567",
      position: "مدير الموارد البشرية",
      department: "الموارد البشرية",
      role: "hr_manager",
      password: "password123",
      permissions: {
        canViewApplications: true,
        canEditApplications: true,
        canApproveApplications: true,
        canDeleteApplications: true,
        canViewServiceRequests: true,
        canEditServiceRequests: true,
        canDeleteServiceRequests: false,
        canViewMessages: true,
        canReplyToMessages: true,
        canDeleteMessages: false,
        canViewContent: true,
        canEditContent: false,
        canPublishContent: false,
        canDeleteContent: false,
        canViewEmployees: true,
        canAddEmployees: true,
        canEditEmployees: true,
        canDeleteEmployees: false,
        canViewReports: true,
        canExportData: true,
      },
      createdAt: new Date(2024, 0, 15).toISOString(),
      isActive: true,
      lastLogin: new Date(2025, 0, 5, 9, 30).toISOString(),
    },
    {
      id: "emp-002",
      fullName: "فاطمة حسن السعيد",
      email: "fatima.hassan@school.edu",
      phone: "+966502345678",
      position: "مديرة المحتوى",
      department: "التسويق والإعلام",
      role: "content_manager",
      password: "password123",
      permissions: {
        canViewApplications: false,
        canEditApplications: false,
        canApproveApplications: false,
        canDeleteApplications: false,
        canViewServiceRequests: false,
        canEditServiceRequests: false,
        canDeleteServiceRequests: false,
        canViewMessages: true,
        canReplyToMessages: true,
        canDeleteMessages: false,
        canViewContent: true,
        canEditContent: true,
        canPublishContent: true,
        canDeleteContent: true,
        canViewEmployees: false,
        canAddEmployees: false,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewReports: false,
        canExportData: false,
      },
      createdAt: new Date(2024, 1, 20).toISOString(),
      isActive: true,
      lastLogin: new Date(2025, 0, 5, 10, 15).toISOString(),
    },
    {
      id: "emp-003",
      fullName: "خالد عبدالله المطيري",
      email: "khaled.mutairi@school.edu",
      phone: "+966503456789",
      position: "مدير الخدمات",
      department: "خدمة العملاء",
      role: "service_manager",
      password: "password123",
      permissions: {
        canViewApplications: false,
        canEditApplications: false,
        canApproveApplications: false,
        canDeleteApplications: false,
        canViewServiceRequests: true,
        canEditServiceRequests: true,
        canDeleteServiceRequests: true,
        canViewMessages: true,
        canReplyToMessages: true,
        canDeleteMessages: true,
        canViewContent: false,
        canEditContent: false,
        canPublishContent: false,
        canDeleteContent: false,
        canViewEmployees: false,
        canAddEmployees: false,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewReports: true,
        canExportData: true,
      },
      createdAt: new Date(2024, 2, 10).toISOString(),
      isActive: true,
      lastLogin: new Date(2025, 0, 4, 16, 45).toISOString(),
    },
    {
      id: "emp-004",
      fullName: "نورة سعد القحطاني",
      email: "noura.qahtani@school.edu",
      phone: "+966504567890",
      position: "موظفة استقبال",
      department: "الاستقبال",
      role: "receptionist",
      password: "password123",
      permissions: {
        canViewApplications: true,
        canEditApplications: false,
        canApproveApplications: false,
        canDeleteApplications: false,
        canViewServiceRequests: true,
        canEditServiceRequests: false,
        canDeleteServiceRequests: false,
        canViewMessages: true,
        canReplyToMessages: false,
        canDeleteMessages: false,
        canViewContent: true,
        canEditContent: false,
        canPublishContent: false,
        canDeleteContent: false,
        canViewEmployees: false,
        canAddEmployees: false,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewReports: false,
        canExportData: false,
      },
      createdAt: new Date(2024, 3, 5).toISOString(),
      isActive: true,
      lastLogin: new Date(2025, 0, 5, 8, 0).toISOString(),
    },
    {
      id: "emp-005",
      fullName: "محمد عمر الشمري",
      email: "mohammed.shamri@school.edu",
      phone: "+966505678901",
      position: "موظف إداري",
      department: "الشؤون الإدارية",
      role: "employee",
      password: "password123",
      permissions: {
        canViewApplications: true,
        canEditApplications: false,
        canApproveApplications: false,
        canDeleteApplications: false,
        canViewServiceRequests: true,
        canEditServiceRequests: false,
        canDeleteServiceRequests: false,
        canViewMessages: true,
        canReplyToMessages: false,
        canDeleteMessages: false,
        canViewContent: true,
        canEditContent: false,
        canPublishContent: false,
        canDeleteContent: false,
        canViewEmployees: false,
        canAddEmployees: false,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewReports: false,
        canExportData: false,
      },
      createdAt: new Date(2024, 4, 12).toISOString(),
      isActive: false,
      lastLogin: new Date(2024, 11, 20, 14, 30).toISOString(),
    },
  ]
}

export function generateMockupPendingReviews(): PendingReview[] {
  return [
    {
      id: "pr-001",
      name: "سارة أحمد الغامدي",
      image: "/diverse-user-avatars.png",
      rating: 5,
      comment: "مدرسة رائعة جداً، المعلمون متميزون والمناهج حديثة. ابنتي سعيدة جداً بالدراسة هنا.",
      submittedAt: new Date(2025, 0, 3, 14, 30).toISOString(),
    },
    {
      id: "pr-002",
      name: "عبدالرحمن خالد",
      image: "/diverse-user-avatars.png",
      rating: 4,
      comment: "تجربة تعليمية ممتازة، لكن أتمنى تحسين المرافق الرياضية.",
      submittedAt: new Date(2025, 0, 4, 10, 15).toISOString(),
    },
    {
      id: "pr-003",
      name: "منى عبدالله السالم",
      image: "/diverse-user-avatars.png",
      rating: 5,
      comment: "أفضل مدرسة في المنطقة! الاهتمام بالطلاب والتواصل مع أولياء الأمور ممتاز.",
      submittedAt: new Date(2025, 0, 4, 16, 45).toISOString(),
    },
    {
      id: "pr-004",
      name: "يوسف محمد العتيبي",
      image: "/diverse-user-avatars.png",
      rating: 5,
      comment: "مستوى تعليمي عالي وكادر تدريسي محترف. أنصح بها بشدة.",
      submittedAt: new Date(2025, 0, 5, 9, 20).toISOString(),
    },
    {
      id: "pr-005",
      name: "ليلى حسن الدوسري",
      image: "/diverse-user-avatars.png",
      rating: 4,
      comment: "مدرسة جيدة جداً، البيئة التعليمية محفزة والأنشطة متنوعة.",
      submittedAt: new Date(2025, 0, 5, 11, 0).toISOString(),
    },
  ]
}

export function generateMockupMessages(): ContactMessage[] {
  return [
    {
      id: "msg-001",
      name: "عمر سعيد الزهراني",
      phone: "+966501111111",
      email: "omar.zahrani@email.com",
      rating: 5,
      message: "أود الاستفسار عن إمكانية تسجيل ابني في الصف الثالث الابتدائي للعام القادم. هل هناك مقاعد متاحة؟",
      submittedAt: new Date(2025, 0, 2, 10, 30).toISOString(),
    },
    {
      id: "msg-002",
      name: "هند محمد القرني",
      phone: "+966502222222",
      email: "hind.qarni@email.com",
      rating: 4,
      message: "السلام عليكم، أرغب في معرفة المزيد عن البرامج الإثرائية المتاحة للطلاب الموهوبين.",
      submittedAt: new Date(2025, 0, 3, 14, 15).toISOString(),
    },
    {
      id: "msg-003",
      name: "فهد عبدالعزيز الشهري",
      phone: "+966503333333",
      email: "fahad.shehri@email.com",
      rating: 5,
      message: "مدرسة ممتازة! أشكركم على الاهتمام بابنتي وتطوير مهاراتها. أتمنى لكم التوفيق.",
      submittedAt: new Date(2025, 0, 4, 9, 0).toISOString(),
    },
    {
      id: "msg-004",
      name: "ريم خالد العمري",
      phone: "+966504444444",
      email: "reem.omari@email.com",
      rating: 3,
      message: "هل يمكن توفير معلومات عن الرسوم الدراسية والخصومات المتاحة للإخوة؟",
      submittedAt: new Date(2025, 0, 4, 16, 30).toISOString(),
    },
    {
      id: "msg-005",
      name: "طارق أحمد الحربي",
      phone: "+966505555555",
      email: "tariq.harbi@email.com",
      rating: 5,
      message: "أود حجز موعد لزيارة المدرسة والاطلاع على المرافق قبل التسجيل. متى يمكنني الحضور؟",
      submittedAt: new Date(2025, 0, 5, 11, 45).toISOString(),
    },
  ]
}

export function generateMockupEmploymentApplications(): EnhancedEmploymentApplication[] {
  return [
    {
      id: "app-001",
      fullName: "أحمد عبدالله المالكي",
      birthPlace: "الرياض",
      birthDate: "1990-05-15",
      nationalId: "1234567890",
      maritalStatus: "متزوج",
      gender: "ذكر",
      address: "الرياض، حي النرجس، شارع التخصصي",
      phone: "+966506666666",
      email: "ahmed.malki@email.com",
      position: "معلم رياضيات",
      expectedSalary: "8000 ريال",
      canStayOvernight: "نعم",
      education: [
        {
          degree: "بكالوريوس",
          major: "رياضيات",
          university: "جامعة الملك سعود",
          graduationYear: "2012",
          gpa: "4.5",
        },
        {
          degree: "ماجستير",
          major: "تعليم الرياضيات",
          university: "جامعة الملك عبدالعزيز",
          graduationYear: "2015",
          gpa: "4.8",
        },
      ],
      experience: [
        {
          institution: "مدرسة الأمل الأهلية",
          jobTitle: "معلم رياضيات",
          duration: "5 سنوات",
          responsibilities: "تدريس الرياضيات للمرحلة المتوسطة والثانوية، إعداد الاختبارات، متابعة الطلاب",
        },
        {
          institution: "مركز التميز التعليمي",
          jobTitle: "مدرب رياضيات",
          duration: "سنتان",
          responsibilities: "تدريب الطلاب على المسابقات الرياضية، إعداد المناهج الإثرائية",
        },
      ],
      cvFileName: "ahmed_cv.pdf",
      submittedAt: new Date(2025, 0, 1, 10, 0).toISOString(),
      status: "pending",
    },
    {
      id: "app-002",
      fullName: "مريم سعد الغامدي",
      birthPlace: "جدة",
      birthDate: "1992-08-22",
      nationalId: "2345678901",
      maritalStatus: "عزباء",
      gender: "أنثى",
      address: "جدة، حي الروضة، شارع الأمير سلطان",
      phone: "+966507777777",
      email: "mariam.ghamdi@email.com",
      position: "معلمة لغة إنجليزية",
      expectedSalary: "7500 ريال",
      canStayOvernight: "لا",
      education: [
        {
          degree: "بكالوريوس",
          major: "اللغة الإنجليزية وآدابها",
          university: "جامعة الملك عبدالعزيز",
          graduationYear: "2014",
          gpa: "4.7",
        },
      ],
      experience: [
        {
          institution: "مدرسة النور الأهلية",
          jobTitle: "معلمة لغة إنجليزية",
          duration: "4 سنوات",
          responsibilities: "تدريس اللغة الإنجليزية للمرحلة الابتدائية والمتوسطة، تنظيم الأنشطة اللغوية",
        },
      ],
      submittedAt: new Date(2025, 0, 2, 14, 30).toISOString(),
      status: "reviewed",
    },
    {
      id: "app-003",
      fullName: "خالد محمد العتيبي",
      birthPlace: "الدمام",
      birthDate: "1988-03-10",
      nationalId: "3456789012",
      maritalStatus: "متزوج",
      gender: "ذكر",
      address: "الدمام، حي الفيصلية، شارع الملك فهد",
      phone: "+966508888888",
      email: "khaled.otaibi@email.com",
      position: "مدير إداري",
      expectedSalary: "10000 ريال",
      canStayOvernight: "نعم",
      education: [
        {
          degree: "بكالوريوس",
          major: "إدارة أعمال",
          university: "جامعة الدمام",
          graduationYear: "2010",
          gpa: "4.3",
        },
        {
          degree: "ماجستير",
          major: "الإدارة التربوية",
          university: "جامعة الملك فيصل",
          graduationYear: "2013",
          gpa: "4.6",
        },
      ],
      experience: [
        {
          institution: "مدارس الفيصل العالمية",
          jobTitle: "مساعد مدير",
          duration: "6 سنوات",
          responsibilities: "الإشراف على العمليات الإدارية، إدارة الموارد البشرية، التنسيق مع أولياء الأمور",
        },
        {
          institution: "مجمع التميز التعليمي",
          jobTitle: "منسق إداري",
          duration: "3 سنوات",
          responsibilities: "تنظيم الفعاليات المدرسية، إدارة الجداول الدراسية، متابعة الحضور والغياب",
        },
      ],
      submittedAt: new Date(2025, 0, 3, 9, 15).toISOString(),
      status: "accepted",
    },
    {
      id: "app-004",
      fullName: "نورة حسن الشهري",
      birthPlace: "أبها",
      birthDate: "1995-11-30",
      nationalId: "4567890123",
      maritalStatus: "عزباء",
      gender: "أنثى",
      address: "أبها، حي المنسك، شارع الملك عبدالله",
      phone: "+966509999999",
      email: "noura.shehri@email.com",
      position: "معلمة علوم",
      expectedSalary: "7000 ريال",
      canStayOvernight: "لا",
      education: [
        {
          degree: "بكالوريوس",
          major: "الأحياء",
          university: "جامعة الملك خالد",
          graduationYear: "2017",
          gpa: "4.6",
        },
      ],
      experience: [
        {
          institution: "مدرسة الرواد الأهلية",
          jobTitle: "معلمة علوم",
          duration: "3 سنوات",
          responsibilities: "تدريس مادة العلوم للمرحلة المتوسطة، الإشراف على المختبر العلمي",
        },
      ],
      submittedAt: new Date(2025, 0, 4, 11, 0).toISOString(),
      status: "pending",
    },
  ]
}

export function generateMockupTestimonials(): Testimonial[] {
  return [
    {
      id: "test-001",
      name: "عبدالله أحمد السعيد",
      image: "/diverse-user-avatars.png",
      rating: 5,
      comment: "مدرسة متميزة بكل المقاييس. المعلمون مؤهلون والإدارة متعاونة جداً. ابني تطور كثيراً منذ التحاقه بالمدرسة.",
      createdAt: new Date(2024, 11, 15).toISOString(),
    },
    {
      id: "test-002",
      name: "فاطمة محمد الحربي",
      image: "/diverse-user-avatars.png",
      rating: 5,
      comment: "أفضل قرار اتخذته هو تسجيل ابنتي في هذه المدرسة. البيئة التعليمية رائعة والأنشطة اللاصفية متنوعة.",
      createdAt: new Date(2024, 11, 20).toISOString(),
    },
    {
      id: "test-003",
      name: "سعد عبدالرحمن القحطاني",
      image: "/diverse-user-avatars.png",
      rating: 4,
      comment: "مدرسة جيدة جداً، المناهج حديثة والمرافق ممتازة. أتمنى المزيد من التركيز على الأنشطة الرياضية.",
      createdAt: new Date(2024, 11, 25).toISOString(),
    },
    {
      id: "test-004",
      name: "هدى خالد العمري",
      image: "/diverse-user-avatars.png",
      rating: 5,
      comment: "شكراً لكل القائمين على هذه المدرسة الرائعة. التواصل مع أولياء الأمور ممتاز والمتابعة مستمرة.",
      createdAt: new Date(2025, 0, 1).toISOString(),
    },
  ]
}

export function loadMockupData(): void {
  // Load employees
  const employees = generateMockupEmployees()
  employees.forEach((emp) => saveEmployee(emp))

  // Load pending reviews
  const pendingReviews = generateMockupPendingReviews()
  localStorage.setItem("pendingReviews", JSON.stringify(pendingReviews))

  // Load messages
  const messages = generateMockupMessages()
  messages.forEach((msg) => saveContactMessage(msg))

  // Load employment applications
  const applications = generateMockupEmploymentApplications()
  applications.forEach((app) => saveEnhancedEmploymentApplication(app))

  // Load testimonials
  const testimonials = generateMockupTestimonials()
  testimonials.forEach((test) => saveTestimonial(test))
}
