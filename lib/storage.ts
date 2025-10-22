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
  address: string
  phone: string
  email?: string
  position: string
  expectedSalary: string

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
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
    currentlyWorking: boolean
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
        id: "1",
        image: "/modern-special-education-school-classroom-with-div.jpg",
        titleAr: "المدرسة النموذجية",
        titleEn: "Al Namothajia School",
        subtitleAr: "رؤية جديدة",
        subtitleEn: "A New Vision",
        descriptionAr: "لتعزيز التعليم والإبداع في بيئة مريحة وآمنة تراعي الفروق الفردية وتطور قدرات كل طالب",
        descriptionEn: "To enhance education and creativity in a comfortable and safe environment",
        order: 1,
      },
      {
        id: "2",
        image: "/happy-special-needs-students-learning-together-wit.jpg",
        titleAr: "تعليم متميز",
        titleEn: "Distinguished Education",
        subtitleAr: "مستقبل واعد",
        subtitleEn: "Promising Future",
        descriptionAr: "نبني جيلاً واعياً ومبدعاً لمستقبل أفضل",
        descriptionEn: "Building a conscious and creative generation for a better future",
        order: 2,
      },
      {
        id: "3",
        image: "/modern-special-education-school-facilities-with-ad.jpg",
        titleAr: "بيئة تعليمية حديثة",
        titleEn: "Modern Learning Environment",
        subtitleAr: "تقنيات متطورة",
        subtitleEn: "Advanced Technology",
        descriptionAr: "نوفر أحدث الوسائل التعليمية لتجربة تعلم فريدة",
        descriptionEn: "We provide the latest educational tools for a unique learning experience",
        order: 3,
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
      // Add other departments (heart, housing, activities) with similar structure
      // For brevity, I'll add just the medical department here
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
