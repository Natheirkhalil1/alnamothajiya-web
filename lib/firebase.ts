import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp
let db: Firestore
let auth: Auth
let storage: FirebaseStorage

const { app: firebaseApp, db: firebaseDb, auth: firebaseAuth, storage: firebaseStorage } = initializeFirebase()

export { firebaseDb as db, firebaseAuth as auth, firebaseStorage as storage, firebaseApp as app }

export function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
    storage = getStorage(app)
  } else {
    app = getApps()[0]
    db = getFirestore(app)
    auth = getAuth(app)
    storage = getStorage(app)
  }
  return { app, db, auth, storage }
}

export function getDb(): Firestore {
  if (!db) {
    initializeFirebase()
  }
  return db
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase()
  }
  return auth
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    initializeFirebase()
  }
  return storage
}

// Collection names with web_ prefix
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
