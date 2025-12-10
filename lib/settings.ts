/**
 * Settings management for General, Header and Footer
 * Settings are stored in Firestore collection: web_settings
 * Documents: header, footer, general, contact
 */

import type { HeaderSettings, FooterSettings, GeneralSettings } from "./storage"
import { getDb, SETTINGS_DOCS } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

// Firestore collection for all settings
const SETTINGS_COLLECTION = "web_settings"

// In-memory cache for settings (to avoid repeated Firestore reads)
let headerSettingsCache: HeaderSettings | null = null
let footerSettingsCache: FooterSettings | null = null
let generalSettingsCache: GeneralSettings | null = null

// ============================================
// DEFAULT SETTINGS
// ============================================

export function getDefaultGeneralSettings(): GeneralSettings {
  return {
    // Site Identity
    siteName: 'المدرسة النموذجية للتربية الخاصة',
    siteNameEn: 'Al Namothajia School',
    siteTagline: 'للتربية الخاصة',
    siteTaglineEn: 'For Special Education',
    siteLogo: '/logo.webp',
    favicon: '/favicon.ico',

    // Localization
    defaultLanguage: 'ar',
    timeZone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',

    // Copyright
    copyrightText: '© 2024 المدرسة النموذجية للتربية الخاصة. جميع الحقوق محفوظة.',
    copyrightTextEn: '© 2024 Al Namothajia School. All rights reserved.',

    // SEO
    seoDescription: 'المدرسة النموذجية للتربية الخاصة - مؤسسة تعليمية رائدة تقدم خدمات تعليمية متميزة للطلاب من ذوي الاحتياجات الخاصة.',
    seoDescriptionEn: 'Al Namothajia School for Special Education - A leading educational institution providing distinguished educational services for students with special needs.',
    seoKeywords: 'تربية خاصة، مدرسة، تعليم، ذوي الاحتياجات الخاصة',
    seoKeywordsEn: 'special education, school, education, special needs',

    // Analytics
    googleAnalyticsId: '',

    // Social Media Links
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      whatsapp: '',
      tiktok: '',
    },

    // Theme
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
  }
}

export function getDefaultHeaderSettings(): HeaderSettings {
  return {
    // Note: Site identity (logo, siteName, tagline) comes from GeneralSettings
    menuItems: [
      {
        id: '1',
        labelAr: 'الرئيسية',
        labelEn: 'Home',
        linkType: 'page',
        pageSlug: 'home',
        openInNewTab: false,
        order: 1,
      },
      {
        id: '2',
        labelAr: 'من نحن',
        labelEn: 'About',
        linkType: 'section',
        sectionId: 'about',
        openInNewTab: false,
        order: 2,
      },
      {
        id: '3',
        labelAr: 'الأقسام',
        labelEn: 'Departments',
        linkType: 'section',
        sectionId: 'departments',
        openInNewTab: false,
        order: 3,
      },
      {
        id: '4',
        labelAr: 'المعرض',
        labelEn: 'Gallery',
        linkType: 'section',
        sectionId: 'gallery',
        openInNewTab: false,
        order: 4,
      },
      {
        id: '5',
        labelAr: 'الوظائف',
        labelEn: 'Jobs',
        linkType: 'section',
        sectionId: 'jobs',
        openInNewTab: false,
        order: 5,
      },
      {
        id: '6',
        labelAr: 'اتصل بنا',
        labelEn: 'Contact',
        linkType: 'section',
        sectionId: 'contact',
        openInNewTab: false,
        order: 6,
      },
    ],
    style: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      hoverColor: '#3b82f6',
      activeColor: '#2563eb',
      font: 'Cairo',
      height: 80,
      isSticky: true,
      isTransparent: false,
      shadow: 'md',
    },
    showLanguageSwitcher: true,
    languageSwitcherPosition: 'right',
    showSearch: false,
  }
}

export function getDefaultFooterSettings(): FooterSettings {
  return {
    layout: '3-column',
    columns: [
      {
        id: '1',
        titleAr: 'عن المدرسة',
        titleEn: 'About School',
        type: 'text',
        order: 1,
        content: {
          textAr: 'المدرسة النموذجية للتربية الخاصة - مؤسسة تعليمية رائدة تقدم خدمات تعليمية متميزة للطلاب من ذوي الاحتياجات الخاصة.',
          textEn: 'Al Namothajia School for Special Education - A leading educational institution providing distinguished educational services for students with special needs.',
        },
      },
      {
        id: '2',
        titleAr: 'روابط سريعة',
        titleEn: 'Quick Links',
        type: 'links',
        order: 2,
        content: {
          links: [
            {
              labelAr: 'الرئيسية',
              labelEn: 'Home',
              linkType: 'page',
              pageSlug: 'home',
            },
            {
              labelAr: 'من نحن',
              labelEn: 'About',
              linkType: 'url',
              url: '/#about',
            },
            {
              labelAr: 'الأقسام',
              labelEn: 'Departments',
              linkType: 'url',
              url: '/#departments',
            },
            {
              labelAr: 'اتصل بنا',
              labelEn: 'Contact',
              linkType: 'url',
              url: '/#contact',
            },
          ],
        },
      },
      {
        id: '3',
        titleAr: 'اتصل بنا',
        titleEn: 'Contact Us',
        type: 'contact',
        order: 3,
        content: {
          contactItems: [
            {
              icon: 'phone',
              labelAr: 'الهاتف',
              labelEn: 'Phone',
              value: '+966 XX XXX XXXX',
            },
            {
              icon: 'mail',
              labelAr: 'البريد الإلكتروني',
              labelEn: 'Email',
              value: 'info@namothajia.edu.sa',
            },
            {
              icon: 'map-pin',
              labelAr: 'العنوان',
              labelEn: 'Address',
              value: 'الرياض، المملكة العربية السعودية',
            },
          ],
        },
      },
    ],
    style: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      linkColor: '#60a5fa',
      linkHoverColor: '#93c5fd',
      font: 'Cairo',
      padding: 48,
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      whatsapp: '',
    },
    contactInfo: {
      showAddress: true,
      addressAr: 'الرياض، المملكة العربية السعودية',
      addressEn: 'Riyadh, Saudi Arabia',
      showPhone: true,
      phone: '+966 XX XXX XXXX',
      showEmail: true,
      email: 'info@namothajia.edu.sa',
      showWorkingHours: true,
      workingHoursAr: 'السبت - الخميس: 7:00 صباحاً - 2:00 مساءً',
      workingHoursEn: 'Saturday - Thursday: 7:00 AM - 2:00 PM',
    },
    showLogo: true,
    showNewsletter: false,
    copyrightAr: '© 2024 المدرسة النموذجية للتربية الخاصة. جميع الحقوق محفوظة.',
    copyrightEn: '© 2024 Al Namothajia School. All rights reserved.',
    showBackToTop: true,
  }
}

// ============================================
// ASYNC GETTER FUNCTIONS (Firestore)
// ============================================

export async function getGeneralSettingsAsync(forceRefresh: boolean = false): Promise<GeneralSettings> {
  // Return cached if available and not forcing refresh
  if (generalSettingsCache && !forceRefresh) {
    return generalSettingsCache
  }

  if (typeof window === "undefined") {
    return getDefaultGeneralSettings()
  }

  try {
    console.log('[Settings] Getting general settings from Firestore...')
    const db = getDb()
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCS.GENERAL)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log('[Settings] No general settings found, creating defaults...')
      const defaultSettings = getDefaultGeneralSettings()
      await saveGeneralSettingsAsync(defaultSettings)
      return defaultSettings
    }

    const settings = docSnap.data() as GeneralSettings

    // Ensure all properties exist (migration for old settings)
    const defaultSettings = getDefaultGeneralSettings()
    let needsSave = false

    if (!settings.socialLinks) {
      settings.socialLinks = defaultSettings.socialLinks
      needsSave = true
    }

    if (!settings.primaryColor) {
      settings.primaryColor = defaultSettings.primaryColor
      needsSave = true
    }

    if (!settings.secondaryColor) {
      settings.secondaryColor = defaultSettings.secondaryColor
      needsSave = true
    }

    if (needsSave) {
      await saveGeneralSettingsAsync(settings)
    }

    generalSettingsCache = settings
    console.log('[Settings] General settings loaded from Firestore')
    return settings
  } catch (error) {
    console.error('[Settings] Error getting general settings:', error)
    return getDefaultGeneralSettings()
  }
}

export async function getHeaderSettingsAsync(): Promise<HeaderSettings> {
  // Return cached if available
  if (headerSettingsCache) {
    return headerSettingsCache
  }

  if (typeof window === "undefined") {
    return getDefaultHeaderSettings()
  }

  try {
    console.log('[Settings] Getting header settings from Firestore...')
    const db = getDb()
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCS.HEADER)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log('[Settings] No header settings found, creating defaults...')
      const defaultSettings = getDefaultHeaderSettings()
      await saveHeaderSettingsAsync(defaultSettings)
      return defaultSettings
    }

    const settings = docSnap.data() as HeaderSettings
    headerSettingsCache = settings
    console.log('[Settings] Header settings loaded from Firestore:', {
      backgroundColor: settings.style?.backgroundColor,
      textColor: settings.style?.textColor
    })
    return settings
  } catch (error) {
    console.error('[Settings] Error getting header settings:', error)
    return getDefaultHeaderSettings()
  }
}

export async function getFooterSettingsAsync(): Promise<FooterSettings> {
  // Return cached if available
  if (footerSettingsCache) {
    return footerSettingsCache
  }

  if (typeof window === "undefined") {
    return getDefaultFooterSettings()
  }

  try {
    console.log('[Settings] Getting footer settings from Firestore...')
    const db = getDb()
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCS.FOOTER)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log('[Settings] No footer settings found, creating defaults...')
      const defaultSettings = getDefaultFooterSettings()
      await saveFooterSettingsAsync(defaultSettings)
      return defaultSettings
    }

    let settings = docSnap.data() as FooterSettings

    // Ensure required properties exist (migration for old settings)
    const defaultSettings = getDefaultFooterSettings()
    let needsSave = false

    if (!settings.columns || !Array.isArray(settings.columns)) {
      settings.columns = defaultSettings.columns
      needsSave = true
    }

    if (!settings.socialMedia) {
      settings.socialMedia = defaultSettings.socialMedia
      needsSave = true
    }

    if (!settings.contactInfo) {
      settings.contactInfo = defaultSettings.contactInfo
      needsSave = true
    }

    if (!settings.style) {
      settings.style = defaultSettings.style
      needsSave = true
    }

    if (needsSave) {
      await saveFooterSettingsAsync(settings)
    }

    footerSettingsCache = settings
    console.log('[Settings] Footer settings loaded from Firestore:', {
      backgroundColor: settings.style?.backgroundColor,
      textColor: settings.style?.textColor
    })
    return settings
  } catch (error) {
    console.error('[Settings] Error getting footer settings:', error)
    return getDefaultFooterSettings()
  }
}

// ============================================
// SYNC GETTER FUNCTIONS (returns cached or defaults)
// These are for components that can't be async
// ============================================

export function getGeneralSettings(): GeneralSettings {
  if (generalSettingsCache) {
    return generalSettingsCache
  }
  // Trigger async load in background
  if (typeof window !== "undefined") {
    getGeneralSettingsAsync().catch(console.error)
  }
  return getDefaultGeneralSettings()
}

export function getHeaderSettings(): HeaderSettings {
  if (headerSettingsCache) {
    return headerSettingsCache
  }
  // Trigger async load in background
  if (typeof window !== "undefined") {
    getHeaderSettingsAsync().catch(console.error)
  }
  return getDefaultHeaderSettings()
}

export function getFooterSettings(): FooterSettings {
  if (footerSettingsCache) {
    return footerSettingsCache
  }
  // Trigger async load in background
  if (typeof window !== "undefined") {
    getFooterSettingsAsync().catch(console.error)
  }
  return getDefaultFooterSettings()
}

// ============================================
// ASYNC SETTER FUNCTIONS (Firestore)
// ============================================

export async function saveGeneralSettingsAsync(settings: GeneralSettings): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const db = getDb()
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCS.GENERAL)
    await setDoc(docRef, settings)
    generalSettingsCache = settings
    console.log('[Settings] General settings saved to Firestore')
  } catch (error) {
    console.error('[Settings] Error saving general settings:', error)
    throw error
  }
}

export async function saveHeaderSettingsAsync(settings: HeaderSettings): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const db = getDb()
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCS.HEADER)
    await setDoc(docRef, settings)
    headerSettingsCache = settings
    console.log('[Settings] Header settings saved to Firestore')
  } catch (error) {
    console.error('[Settings] Error saving header settings:', error)
    throw error
  }
}

export async function saveFooterSettingsAsync(settings: FooterSettings): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const db = getDb()
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOCS.FOOTER)
    await setDoc(docRef, settings)
    footerSettingsCache = settings
    console.log('[Settings] Footer settings saved to Firestore')
  } catch (error) {
    console.error('[Settings] Error saving footer settings:', error)
    throw error
  }
}

// ============================================
// SYNC SETTER FUNCTIONS (for backward compatibility)
// ============================================

export function saveGeneralSettings(settings: GeneralSettings): void {
  generalSettingsCache = settings
  saveGeneralSettingsAsync(settings).catch(console.error)
}

export function saveHeaderSettings(settings: HeaderSettings): void {
  headerSettingsCache = settings
  saveHeaderSettingsAsync(settings).catch(console.error)
}

export function saveFooterSettings(settings: FooterSettings): void {
  footerSettingsCache = settings
  saveFooterSettingsAsync(settings).catch(console.error)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export async function resetGeneralSettingsAsync(): Promise<GeneralSettings> {
  const defaultSettings = getDefaultGeneralSettings()
  await saveGeneralSettingsAsync(defaultSettings)
  return defaultSettings
}

export async function resetHeaderSettingsAsync(): Promise<HeaderSettings> {
  const defaultSettings = getDefaultHeaderSettings()
  await saveHeaderSettingsAsync(defaultSettings)
  return defaultSettings
}

export async function resetFooterSettingsAsync(): Promise<FooterSettings> {
  const defaultSettings = getDefaultFooterSettings()
  await saveFooterSettingsAsync(defaultSettings)
  return defaultSettings
}

// Sync versions for backward compatibility
export function resetGeneralSettings(): GeneralSettings {
  const defaultSettings = getDefaultGeneralSettings()
  saveGeneralSettings(defaultSettings)
  return defaultSettings
}

export function resetHeaderSettings(): HeaderSettings {
  const defaultSettings = getDefaultHeaderSettings()
  saveHeaderSettings(defaultSettings)
  return defaultSettings
}

export function resetFooterSettings(): FooterSettings {
  const defaultSettings = getDefaultFooterSettings()
  saveFooterSettings(defaultSettings)
  return defaultSettings
}

// Clear cache (useful for forcing reload from Firestore)
export function clearSettingsCache(): void {
  headerSettingsCache = null
  footerSettingsCache = null
  generalSettingsCache = null
  console.log('[Settings] Cache cleared')
}
