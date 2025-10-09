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
  id: string
  image: string
  titleAr: string
  titleEn: string
  subtitleAr: string
  subtitleEn: string
  descriptionAr: string
  descriptionEn: string
  order: number
}

// New interfaces for managing page content
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
  order: number
}

export interface DepartmentContent {
  id: string
  type: "medical" | "science" | "experimental"
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
        descriptionAr: "لتعزيز التعليم والإبداع في بيئة مريحة وآمنة",
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
  }
}

export function updateHeroSlide(id: string, data: Partial<HeroSlide>): void {
  if (typeof window !== "undefined") {
    const slides = getHeroSlides()
    const index = slides.findIndex((s) => s.id === id)
    if (index !== -1) {
      slides[index] = { ...slides[index], ...data }
      localStorage.setItem("heroSlides", JSON.stringify(slides))
    }
  }
}

export function deleteHeroSlide(id: string): void {
  if (typeof window !== "undefined") {
    const slides = getHeroSlides().filter((s) => s.id !== id)
    localStorage.setItem("heroSlides", JSON.stringify(slides))
  }
}

// Functions for managing About Content
export function getAboutContent(): AboutContent | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("aboutContent")
    if (data) {
      return JSON.parse(data)
    }
    // المحتوى الافتراضي
    const defaultContent: AboutContent = {
      id: "1",
      titleAr: "المدرسة النموذجية للتربية الخاصة",
      titleEn: "Al Namothajia School for Special Education",
      descriptionAr:
        "مؤسسة تعليمية رائدة مع أكثر من 30 عاماً من التميز في تقديم برامج تعليمية وتأهيلية شاملة للأفراد من ذوي الإعاقة. تهدف المدرسة لتوفير برامج تراعي الفروق الفردية وتصل بالطلاب إلى أقصى ما تسمح به إمكانياتهم من نمو وتحصيل واستقلالية ومساعدتهم على الاندماج بالمجتمع. حاصلون على شهادة ISO 9001:2015 ونخدم الفئات العمرية من 5-55 سنة.",
      descriptionEn:
        "A leading educational institution with over 30 years of excellence in providing comprehensive educational and rehabilitation programs for individuals with disabilities. ISO 9001:2015 certified, serving age groups from 5-55 years.",
      image: "/modern-special-education-school-building-exterior-.jpg",
      features: [
        {
          titleAr: "رسالتنا",
          titleEn: "Our Mission",
          descriptionAr: "توفير برامج تعليمية وتأهيلية تراعي الفروق الفردية وتصل بالطلاب إلى أقصى إمكانياتهم",
          descriptionEn: "Providing educational and rehabilitation programs that respect individual differences",
        },
        {
          titleAr: "رؤيتنا",
          titleEn: "Our Vision",
          descriptionAr: "أن نكون المدرسة الرائدة في التربية الخاصة على مستوى المنطقة والعالم",
          descriptionEn: "To be the leading school in special education regionally and globally",
        },
        {
          titleAr: "الاعتماد الدولي",
          titleEn: "International Accreditation",
          descriptionAr: "حاصلون على شهادة ISO 9001:2015 لضمان الجودة في جميع خدماتنا",
          descriptionEn: "ISO 9001:2015 certified for quality assurance in all our services",
        },
        {
          titleAr: "الفئات المستهدفة",
          titleEn: "Target Groups",
          descriptionAr: "نخدم جميع فئات الإعاقة من عمر 5-55 سنة من مختلف بلدان العالم",
          descriptionEn: "Serving all disability categories aged 5-55 from various countries",
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
  }
}

// Functions for managing Gallery Images
export function getGalleryImages(): GalleryImage[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("galleryImages")
    if (data) {
      return JSON.parse(data)
    }
    // الصور الافتراضية
    const defaultImages: GalleryImage[] = [
      {
        id: "1",
        image: "/modern-special-education-school-classroom-with-div.jpg",
        titleAr: "الفصول الدراسية",
        titleEn: "Classrooms",
        descriptionAr: "فصول دراسية حديثة مجهزة بأحدث التقنيات التعليمية",
        descriptionEn: "Modern classrooms equipped with the latest educational technology",
        order: 1,
      },
      {
        id: "2",
        image: "/happy-special-needs-students-learning-together-wit.jpg",
        titleAr: "الأنشطة التعليمية",
        titleEn: "Educational Activities",
        descriptionAr: "أنشطة تعليمية متنوعة تنمي مهارات الطلاب",
        descriptionEn: "Diverse educational activities that develop students' skills",
        order: 2,
      },
      {
        id: "3",
        image: "/modern-special-education-school-facilities-with-ad.jpg",
        titleAr: "المرافق المدرسية",
        titleEn: "School Facilities",
        descriptionAr: "مرافق حديثة توفر بيئة تعليمية مريحة",
        descriptionEn: "Modern facilities providing a comfortable learning environment",
        order: 3,
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
  }
}

export function updateGalleryImage(id: string, data: Partial<GalleryImage>): void {
  if (typeof window !== "undefined") {
    const images = getGalleryImages()
    const index = images.findIndex((img) => img.id === id)
    if (index !== -1) {
      images[index] = { ...images[index], ...data }
      localStorage.setItem("galleryImages", JSON.stringify(images))
    }
  }
}

export function deleteGalleryImage(id: string): void {
  if (typeof window !== "undefined") {
    const images = getGalleryImages().filter((img) => img.id !== id)
    localStorage.setItem("galleryImages", JSON.stringify(images))
  }
}

// Functions for managing Department Contents
export function getDepartmentContents(): DepartmentContent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("departmentContents")
    if (data) {
      return JSON.parse(data)
    }
    // المحتوى الافتراضي
    const defaultContents: DepartmentContent[] = [
      {
        id: "1",
        type: "medical",
        titleAr: "القسم الطبي",
        titleEn: "Medical Department",
        descriptionAr: "قسم طبي متكامل يوفر الرعاية الصحية للطلاب مع فريق طبي متخصص ومجهز بأحدث المعدات الطبية",
        descriptionEn:
          "Comprehensive medical department providing healthcare for students with specialized medical team",
        image: "/school-medical-clinic-with-modern-equipment-for-sp.jpg",
      },
      {
        id: "2",
        type: "science",
        titleAr: "القسم العلمي",
        titleEn: "Scientific Department",
        descriptionAr: "قسم متخصص في العلوم والرياضيات مع مختبرات حديثة وبرامج تعليمية متقدمة لتنمية المهارات العلمية",
        descriptionEn:
          "Specialized department in science and mathematics with modern laboratories and advanced programs",
        image: "/science-and-mathematics-classroom-with-modern-tech.jpg",
      },
      {
        id: "3",
        type: "experimental",
        titleAr: "القسم التجريبي",
        titleEn: "Experimental Department",
        descriptionAr: "قسم مخصص للتجارب العملية والأبحاث العلمية مع إشراف متخصص لتطوير مهارات البحث والاستكشاف",
        descriptionEn:
          "Department dedicated to practical experiments and scientific research with specialized supervision",
        image: "/science-laboratory-with-experiments-for-special-ne.jpg",
      },
    ]
    localStorage.setItem("departmentContents", JSON.stringify(defaultContents))
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
    }
  }
}

// Functions for managing Contact Info
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
  }
}
