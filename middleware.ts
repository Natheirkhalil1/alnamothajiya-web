import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const supportedLanguages = ["ar", "en"]
const defaultLanguage = "ar"

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
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|webp|woff|woff2|ttf|eot)$/)
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

  // Detect language from Accept-Language header or use default
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
