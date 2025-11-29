import { getFromLocalStorage, saveToLocalStorage, COLLECTIONS } from "./storage-adapter"
import type { Employee, DynamicPage } from "./storage"

// Pre-configured admin credentials
export const ADMIN_CREDENTIALS = {
  email: "admin@namothjia.com",
  password: "admin123",
  fullName: "School Admin"
}

// Initialize admin user in localStorage if it doesn't exist
export function initializeAdminUser() {
  if (typeof window === "undefined") return
  
  console.log("[v0] Initializing admin user...")
  
  const employees = getFromLocalStorage<Employee[]>(COLLECTIONS.EMPLOYEES, [])
  
  // Check if admin already exists
  const adminExists = employees.some(emp => emp.email === ADMIN_CREDENTIALS.email)
  
  if (!adminExists) {
    console.log("[v0] Creating default admin user...")
    
    const adminEmployee: Employee = {
      id: "admin-" + Date.now().toString(),
      fullName: ADMIN_CREDENTIALS.fullName,
      email: ADMIN_CREDENTIALS.email,
      phone: "",
      position: "System Administrator",
      department: "Administration",
      role: "admin",
      password: ADMIN_CREDENTIALS.password,
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
    
    employees.push(adminEmployee)
    saveToLocalStorage(COLLECTIONS.EMPLOYEES, employees)
    
    console.log("[v0] Default admin user created successfully")
  } else {
    console.log("[v0] Admin user already exists")
  }
  
  initializeSamplePages()
}

function initializeSamplePages() {
  console.log("[v0] Initializing sample pages...")
  
  const pages = getFromLocalStorage<DynamicPage[]>(COLLECTIONS.PAGES, [])
  
  // Check if sample pages already exist
  if (pages.length === 0) {
    console.log("[v0] Creating sample pages...")
    
    const samplePage: DynamicPage = {
      id: "sample-about-" + Date.now().toString(),
      slug: "about-us",
      titleAr: "عن المدرسة",
      titleEn: "About Us",
      descriptionAr: "تعرف على مدرسة نموذجية وتاريخها ورؤيتها ورسالتها",
      descriptionEn: "Learn about Namothajia School, its history, vision, and mission",
      contentAr: "محتوى الصفحة بالعربية",
      contentEn: "Page content in English",
      seoDescriptionAr: "تعرف على مدرسة نموذجية - مدرسة رائدة في التعليم الحديث",
      seoDescriptionEn: "Learn about Namothajia School - A leading school in modern education",
      featuredImage: "/modern-school-exterior.png",
      blocks: [
        {
          id: "block-1",
          type: "hero",
          content: {
            headingAr: "مرحباً بكم في مدرسة نموذجية",
            headingEn: "Welcome to Namothajia School",
            subheadingAr: "نحن نقدم تعليماً متميزاً يبني المستقبل",
            subheadingEn: "We provide excellent education that builds the future",
            backgroundImage: "/modern-school-exterior.png",
          },
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#1a1a1a",
            padding: "large",
          },
          order: 0,
        },
        {
          id: "block-2",
          type: "text",
          content: {
            headingAr: "رؤيتنا",
            headingEn: "Our Vision",
            textAr: "أن نكون مؤسسة تعليمية رائدة تقدم تعليماً عصرياً يواكب التطورات العالمية ويحافظ على الهوية الثقافية.",
            textEn: "To be a leading educational institution that provides modern education keeping pace with global developments while preserving cultural identity.",
          },
          styles: {
            backgroundColor: "#f8f9fa",
            textColor: "#1a1a1a",
            padding: "medium",
          },
          order: 1,
        },
      ],
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    pages.push(samplePage)
    saveToLocalStorage(COLLECTIONS.PAGES, pages)
    
    console.log("[v0] Sample pages created successfully")
  } else {
    console.log("[v0] Sample pages already exist")
  }
}
