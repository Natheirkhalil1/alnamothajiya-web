import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from "firebase/auth"
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type FirebaseStorage,
  type UploadTaskSnapshot,
} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCrfXi8bkZ-_c9hspk4Nw0P9-HFuB-od0s",
  authDomain: "aapp-1827e.firebaseapp.com",
  projectId: "aapp-1827e",
  storageBucket: "aapp-1827e.firebasestorage.app",
  messagingSenderId: "87450977016",
  appId: "1:87450977016:web:815358999bb84ae4c7710d",
}

let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined
let storage: FirebaseStorage | undefined

function getOrInitializeApp(): FirebaseApp {
  if (!app) {
    try {
      const existingApps = getApps()
      if (existingApps.length === 0) {
        app = initializeApp(firebaseConfig)
      } else {
        app = existingApps[0]
      }
    } catch (error) {
      console.error("Error initializing Firebase app:", error)
      throw error
    }
  }
  return app
}

export function getDb(): Firestore {
  if (!db) {
    try {
      const firebaseApp = getOrInitializeApp()
      db = getFirestore(firebaseApp)
    } catch (error) {
      console.error("Error initializing Firestore:", error)
      throw error
    }
  }
  return db
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    try {
      const firebaseApp = getOrInitializeApp()
      auth = getAuth(firebaseApp)
      setPersistence(auth, browserLocalPersistence).catch((error: any) => {
        console.error("Error setting auth persistence:", error)
      })
    } catch (error) {
      console.error("Error initializing Firebase Auth:", error)
      throw error
    }
  }
  return auth
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    try {
      const firebaseApp = getOrInitializeApp()
      storage = getStorage(firebaseApp)
    } catch (error) {
      console.error("Error initializing Firebase Storage:", error)
      throw error
    }
  }
  return storage
}

// Collection names with web_ prefix
export const FIREBASE_COLLECTIONS = {
  EMPLOYEES: "web_employees",
  DYNAMIC_PAGES: "web_dynamic_pages",
  PAGES: "web_pages",
  ACTIVITIES: "web_activities",
  NOTIFICATIONS: "web_notifications",
  HEADER_SETTINGS: "web_settings",
  FOOTER_SETTINGS: "web_settings",
  GENERAL_SETTINGS: "web_settings",
  SETTINGS: "web_settings",
  EMPLOYMENT_APPLICATIONS: "web_applications",
  ENHANCED_APPLICATIONS: "web_enhanced_applications",
  SERVICE_REQUESTS: "web_service_requests",
  CONTACT_MESSAGES: "web_contact_messages",
  JOB_POSITIONS: "web_job_positions",
  TESTIMONIALS: "web_testimonials",
  CONTACT_INFO: "web_settings",
  REJECTED_REVIEWS: "web_rejected_reviews",
  MEDIA: "web_media",
  HERO_SLIDES: "web_hero_slides",
  GALLERY_IMAGES: "web_gallery_images",
  DEPARTMENTS: "web_departments",
  ABOUT_CONTENT: "web_about_content",
  DEPARTMENT_CONTENTS: "web_department_contents",
}

// Settings document IDs within web_settings collection
export const SETTINGS_DOCS = {
  HEADER: "header",
  FOOTER: "footer",
  GENERAL: "general",
  CONTACT: "contact",
}

export { getDb as db, getFirebaseAuth as auth, getFirebaseStorage as storage }

export function getApp(): FirebaseApp {
  return getOrInitializeApp()
}

// For backward compatibility with direct app imports
export { getOrInitializeApp as app }

// Client-side upload function for use in browser components
export async function uploadFileToStorage(
  file: File,
  folder = "general",
  onProgress?: (progress: number) => void,
): Promise<{ url: string; filename: string; path: string; size: number; type: string }> {
  const storage = getFirebaseStorage()

  // Create unique filename with timestamp and random suffix
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 9)
  const fileExtension = file.name.split(".").pop()
  const fileName = `${timestamp}_${randomSuffix}.${fileExtension}`

  // Store in web_uploads folder with subfolder
  const storagePath = `web_uploads/${folder}/${fileName}`
  const storageRef = ref(storage, storagePath)

  // Use resumable upload with progress tracking if callback provided
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      })

      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress(progress)
        },
        (error) => {
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve({
              url: downloadURL,
              filename: file.name,
              path: storagePath,
              size: file.size,
              type: file.type,
            })
          } catch (error) {
            reject(error)
          }
        },
      )
    })
  }

  // Fallback to simple upload without progress
  await uploadBytes(storageRef, file, {
    contentType: file.type,
  })

  // Get public download URL
  const downloadURL = await getDownloadURL(storageRef)

  return {
    url: downloadURL,
    filename: file.name,
    path: storagePath,
    size: file.size,
    type: file.type,
  }
}

// Delete a file from Firebase Storage by URL
export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  const storage = getFirebaseStorage()

  // Extract the storage path from the Firebase Storage URL
  // URL format: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?token=...
  // The path is URL-encoded between /o/ and ?
  try {
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)$/)
    if (pathMatch) {
      const storagePath = decodeURIComponent(pathMatch[1])
      const storageRef = ref(storage, storagePath)
      await deleteObject(storageRef)
      console.log("[Firebase] File deleted from storage:", storagePath)
    }
  } catch (error) {
    console.error("[Firebase] Error deleting file from storage:", error)
    throw error
  }
}
