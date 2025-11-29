// LocalStorage-only implementation for v0 development (active)
// This script is designed to run in the browser console or as a client-side function

// FIREBASE: Original Firebase Admin implementation (preserved for future production use)
/*
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin (uses environment variables)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()
*/

import { saveDynamicPage } from "@/lib/storage"
import type { DynamicPage, PageBlock } from "@/lib/storage"

const homePageTemplate = {
  id: `page_${Date.now()}`,
  title: "Home Page Template",
  slug: "home-template",
  language: "ar" as const,
  status: "draft" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [
    // Hero Slider Block
    {
      id: "block_1",
      type: "hero-slider" as const,
      content: {
        slides: [
          {
            id: "slide_1",
            imageUrl: "/school-building-exterior.png",
            titleAr: "مرحباً بكم في مدرستنا",
            titleEn: "Welcome to Our School",
            subtitleAr: "نحن نقدم أفضل التجارب التعليمية",
            subtitleEn: "We provide the best educational experiences",
            descriptionAr: "",
            descriptionEn: "",
          },
          {
            id: "slide_2",
            imageUrl: "/diverse-students-classroom.png",
            titleAr: "التميز الأكاديمي",
            titleEn: "Academic Excellence",
            subtitleAr: "برامج تعليمية متقدمة",
            subtitleEn: "Advanced educational programs",
            descriptionAr: "",
            descriptionEn: "",
          },
          {
            id: "slide_3",
            imageUrl: "/modern-school-facilities.png",
            titleAr: "بيئة تعليمية حديثة",
            titleEn: "Modern Learning Environment",
            subtitleAr: "مرافق متطورة وتقنيات حديثة",
            subtitleEn: "Advanced facilities and modern technologies",
            descriptionAr: "",
            descriptionEn: "",
          },
        ],
      },
      styles: {
        animation: "fade-in" as const,
        animationDelay: "0s",
        animationDuration: "1s",
        backgroundColor: "transparent",
        textColor: "white",
        padding: "0",
        margin: "0",
      },
      order: 0,
    } as PageBlock,

    // About Section Block
    {
      id: "block_2",
      type: "paragraph" as const,
      content: {
        textAr:
          "نحن مؤسسة تعليمية رائدة نسعى لتقديم أفضل الخدمات التعليمية لأبنائنا الطلاب. نؤمن بأن التعليم هو المفتاح لبناء مستقبل أفضل، ونعمل على توفير بيئة تعليمية محفزة وداعمة للإبداع والتميز.",
        textEn:
          "We are a leading educational institution striving to provide the best educational services to our students. We believe that education is the key to building a better future.",
      },
      styles: {
        animation: "slide-up" as const,
        animationDelay: "0.2s",
        animationDuration: "0.8s",
        backgroundColor: "bg-gradient-to-b from-blue-50 to-white",
        textColor: "text-gray-800",
        padding: "py-20 px-5",
        margin: "0",
        textAlign: "center" as const,
      },
      order: 1,
    } as PageBlock,

    // Features Cards Block
    {
      id: "block_3",
      type: "features" as const,
      content: {
        features: [
          {
            id: "feature_1",
            icon: "BookOpen",
            titleAr: "تعليم متميز",
            titleEn: "Distinguished Education",
            descriptionAr: "منهج تعليمي حديث ومتطور",
            descriptionEn: "Modern and advanced curriculum",
          },
          {
            id: "feature_2",
            icon: "Users",
            titleAr: "معلمون مؤهلون",
            titleEn: "Qualified Teachers",
            descriptionAr: "كادر تعليمي على أعلى مستوى",
            descriptionEn: "Teaching staff at the highest level",
          },
          {
            id: "feature_3",
            icon: "Building",
            titleAr: "مرافق حديثة",
            titleEn: "Modern Facilities",
            descriptionAr: "بنية تحتية متطورة",
            descriptionEn: "Advanced infrastructure",
          },
          {
            id: "feature_4",
            icon: "Activity",
            titleAr: "أنشطة متنوعة",
            titleEn: "Diverse Activities",
            descriptionAr: "برامج لا صفية شاملة",
            descriptionEn: "Comprehensive extracurricular programs",
          },
        ],
      },
      styles: {
        animation: "slide-up" as const,
        animationDelay: "0.4s",
        animationDuration: "0.8s",
        backgroundColor: "white",
        textColor: "text-gray-800",
        padding: "py-16 px-5",
        margin: "0",
      },
      order: 2,
    } as PageBlock,

    // Gallery Block
    {
      id: "block_5",
      type: "gallery" as const,
      content: {
        images: [
          { url: "/vibrant-school-campus.png", alt: "الحرم المدرسي", caption: "" },
          { url: "/diverse-students-studying.png", alt: "طلاب يدرسون", caption: "" },
          { url: "/science-lab.png", alt: "مختبر العلوم", caption: "" },
          { url: "/generic-sports-field.png", alt: "الملاعب الرياضية", caption: "" },
          { url: "/grand-library.png", alt: "المكتبة", caption: "" },
          { url: "/classroom-technology.jpg", alt: "التقنية في الصف", caption: "" },
        ],
      },
      styles: {
        animation: "fade-in" as const,
        animationDelay: "0.3s",
        animationDuration: "1s",
        backgroundColor: "white",
        textColor: "text-gray-800",
        padding: "py-20 px-5",
        margin: "0",
      },
      order: 4,
    } as PageBlock,

    // CTA Block
    {
      id: "block_7",
      type: "cta" as const,
      content: {
        ctaTitleAr: "انضم إلى فريقنا",
        ctaTitleEn: "Join Our Team",
        ctaDescriptionAr: "نبحث عن معلمين وموظفين متميزين للانضمام إلى عائلتنا التعليمية",
        ctaDescriptionEn: "We are looking for distinguished teachers and staff to join our educational family",
        ctaButtonTextAr: "التقدم للوظائف",
        ctaButtonTextEn: "Apply for Jobs",
        ctaButtonUrl: "/jobs/employment",
      },
      styles: {
        animation: "fade-in" as const,
        animationDelay: "0.3s",
        animationDuration: "1s",
        backgroundColor: "bg-gray-900",
        textColor: "text-white",
        padding: "py-16 px-5",
        margin: "0",
      },
      order: 6,
    } as PageBlock,
  ],
}

async function importTemplate() {
  try {
    console.log("[v0] Starting home page template import to localStorage...")

    // LocalStorage implementation (active)
    const pageData: Omit<DynamicPage, "id" | "createdAt" | "updatedAt"> = {
      slug: homePageTemplate.slug,
      titleAr: homePageTemplate.title,
      titleEn: "Home Page Template",
      descriptionAr: "صفحة رئيسية قالب",
      descriptionEn: "Home page template",
      contentAr: "",
      contentEn: "",
      blocks: homePageTemplate.blocks,
      isPublished: false,
    }

    await saveDynamicPage(pageData)

    console.log("[v0] Successfully imported home page template to localStorage!")
    console.log("[v0] Page slug:", homePageTemplate.slug)
    console.log("[v0] Go to your dashboard to view and edit the page.")

    // FIREBASE: Original Firebase implementation
    // await db.collection("pages").doc(homePageTemplate.id).set(homePageTemplate)
    // console.log("[v0] Successfully imported home page template!")
    // console.log("[v0] Page ID:", homePageTemplate.id)
  } catch (error) {
    console.error("[v0] Error importing template:", error)
    throw error
  }
}

// Export the function for use in browser or Node environment
export { importTemplate }

// Auto-run if in Node environment (for npm run scripts)
if (typeof window === "undefined" && typeof process !== "undefined") {
  importTemplate()
}
