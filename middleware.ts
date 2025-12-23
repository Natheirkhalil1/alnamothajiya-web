import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { initializeApp, getApps } from "firebase/app"

const supportedLanguages = ["ar", "en"]

// Firebase config (must be here since middleware runs in Edge Runtime)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Cache for default language (to avoid repeated Firestore reads)
let cachedDefaultLanguage: string | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Paths that should bypass language routing
const excludedPaths = [
  "/dashboard",
  "/login",
  "/api",
  "/setup",
  "/staff-login",
  "/staff-dashboard",
  "/reset-password",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/terms-of-service",
  "/check-storage",
  "/maintenance",
  "/jobs",
  "/departments",
  "/pages",
]

async function getDefaultLanguage(): Promise<string> {
  // Return cached value if still valid
  const now = Date.now()
  if (cachedDefaultLanguage && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedDefaultLanguage
  }

  try {
    const db = getFirestore(app)
    const docRef = doc(db, "web_settings", "general")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      const defaultLang = data.defaultLanguage || "ar"

      // Update cache
      cachedDefaultLanguage = defaultLang
      cacheTimestamp = now

      console.log("[Middleware] Default language from settings:", defaultLang)
      return defaultLang
    }
  } catch (error) {
    console.error("[Middleware] Error fetching default language:", error)
  }

  // Fallback to Arabic
  return "ar"
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|webp|woff|woff2|ttf|eot|html)$/)
  ) {
    return NextResponse.next()
  }

  // Skip middleware for excluded paths
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if the pathname already starts with a supported language
  const pathnameHasLanguage = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  if (pathnameHasLanguage) {
    return NextResponse.next()
  }

  // Get default language from settings
  const defaultLanguage = await getDefaultLanguage()

  // Detect language from Accept-Language header or use default from settings
  const acceptLanguage = request.headers.get("accept-language")
  let detectedLanguage = defaultLanguage

  if (acceptLanguage) {
    // Simple language detection - check if "en" appears before "ar"
    const enIndex = acceptLanguage.indexOf("en")
    const arIndex = acceptLanguage.indexOf("ar")

    if (enIndex !== -1 && (arIndex === -1 || enIndex < arIndex)) {
      detectedLanguage = "en"
    }
  }

  // Redirect to language-prefixed URL
  const url = request.nextUrl.clone()
  url.pathname = `/${detectedLanguage}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
