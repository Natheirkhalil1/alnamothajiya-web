// All Firebase functionality is replaced with localStorage

// FIREBASE: Original Firebase initialization code (preserved for future production use)
/*
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from "firebase/auth"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCrfXi8bkZ-_c9hspk4Nw0P9-HFuB-od0s",
  authDomain: "aapp-1827e.firebaseapp.com",
  projectId: "aapp-1827e",
  storageBucket: "aapp-1827e.firebasestorage.app",
  messagingSenderId: "87450977016",
  appId: "1:87450977016:web:815358999bb84ae4c7710d"
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

export { getDb as db, getFirebaseAuth as auth, getFirebaseStorage as storage }
*/

// LocalStorage-only implementation (active for v0 development)
console.log("[v0] Firebase disabled - using localStorage for all data operations")

// Collection names with web_ prefix (for consistency with Firebase structure)
export const FIREBASE_COLLECTIONS = {
  HERO_SLIDES: "web_hero_slides",
  TESTIMONIALS: "web_testimonials",
  JOB_POSITIONS: "web_job_positions",
  GALLERY_IMAGES: "web_gallery_images",
  DEPARTMENTS: "web_departments",
  CONTACT_INFO: "web_contact_info",
  ABOUT_CONTENT: "web_about_content",
  CONTACT_MESSAGES: "web_contact_messages",
  EMPLOYEES: "web_employees",
  DYNAMIC_PAGES: "web_dynamic_pages",
  ACTIVITIES: "web_activities",
  NOTIFICATIONS: "web_notifications",
  EMPLOYMENT_APPLICATIONS: "web_employment_applications",
  SERVICE_REQUESTS: "web_service_requests",
  ENHANCED_APPLICATIONS: "web_enhanced_applications",
  DEPARTMENT_CONTENTS: "web_department_contents",
  PAGES: "web_pages",
}

// Stub functions that throw errors if called (Firebase is completely disabled)
export function getDb(): never {
  throw new Error("Firebase is disabled in v0 development. Use localStorage instead.")
}

export function getFirebaseAuth(): never {
  throw new Error("Firebase Auth is disabled in v0 development. Use localStorage instead.")
}

export function getFirebaseStorage(): never {
  throw new Error("Firebase Storage is disabled in v0 development. Use localStorage instead.")
}

export { getDb as db, getFirebaseAuth as auth, getFirebaseStorage as storage }
