import { getDb, FIREBASE_COLLECTIONS } from "./firebase"
import { collection, getDocs, doc, setDoc } from "firebase/firestore"
import type { Employee, DynamicPage } from "./storage"

// Pre-configured admin credentials
// NOTE: For Firebase Auth, you need to create this user in Firebase Console
// or through Firebase Auth SDK with createUserWithEmailAndPassword
export const ADMIN_CREDENTIALS = {
  email: "admin@namothjia.com",
  password: "admin123",
  fullName: "School Admin"
}

// Initialize admin user in Firestore if it doesn't exist
export async function initializeAdminUser() {
  if (typeof window === "undefined") return

  console.log("[Firebase] Checking if admin user exists...")

  try {
    const db = getDb()
    const employeesRef = collection(db, FIREBASE_COLLECTIONS.EMPLOYEES)
    const snapshot = await getDocs(employeesRef)

    // Check if admin already exists
    let adminExists = false
    snapshot.forEach((doc) => {
      const data = doc.data()
      if (data.email === ADMIN_CREDENTIALS.email) {
        adminExists = true
      }
    })

    if (!adminExists) {
      console.log("[Firebase] Creating default admin user in Firestore...")

      const adminId = "admin-" + Date.now().toString()
      const adminEmployee: Employee = {
        id: adminId,
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

      await setDoc(doc(db, FIREBASE_COLLECTIONS.EMPLOYEES, adminId), adminEmployee)
      console.log("[Firebase] Default admin user created successfully in Firestore")
      console.log("[Firebase] IMPORTANT: Remember to create this user in Firebase Authentication!")
    } else {
      console.log("[Firebase] Admin user already exists in Firestore")
    }

    await initializeSamplePages()
  } catch (error) {
    console.error("[Firebase] Error initializing admin user:", error)
  }
}

async function initializeSamplePages() {
  console.log("[Firebase] Checking sample pages...")

  try {
    const db = getDb()
    const pagesRef = collection(db, FIREBASE_COLLECTIONS.DYNAMIC_PAGES)
    const snapshot = await getDocs(pagesRef)

    // Check if sample pages already exist
    if (snapshot.empty) {
      console.log("[Firebase] Creating sample pages in Firestore...")

      const samplePageId = "sample-about-" + Date.now().toString()
      const samplePage: DynamicPage = {
        id: samplePageId,
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
            type: "heading",
            content: {
              textAr: "مرحباً بكم في مدرسة نموذجية",
              textEn: "Welcome to Namothajia School",
              level: 1,
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
            type: "paragraph",
            content: {
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

      await setDoc(doc(db, FIREBASE_COLLECTIONS.DYNAMIC_PAGES, samplePageId), samplePage)
      console.log("[Firebase] Sample pages created successfully in Firestore")
    } else {
      console.log("[Firebase] Pages already exist in Firestore:", snapshot.size, "pages found")
    }
  } catch (error) {
    console.error("[Firebase] Error initializing sample pages:", error)
  }
}
