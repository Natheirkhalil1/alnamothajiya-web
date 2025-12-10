/**
 * Migration utilities for converting old dashboard sections to new page builder system
 *
 * This handles:
 * - Hero slides → Hero basic blocks
 * - About content → Rich text + Image blocks
 * - Gallery → Image albums block
 * - Departments → Separate dynamic pages
 */

import type { HeroSlide, AboutContent, GalleryImage, DepartmentContent } from "./storage"
import { COLLECTIONS, getFromLocalStorage, saveToLocalStorage } from "./storage-adapter"
import type { Block } from "@/components/page-builder/types"

const MIGRATION_VERSION = "1.0.0"

export interface MigrationResult {
  success: boolean
  homepageId?: string
  departmentPageIds?: string[]
  error?: string
}

/**
 * Check if migration is needed
 */
export function needsMigration(): boolean {
  // Check if migration already completed
  const status = getFromLocalStorage(COLLECTIONS.MIGRATION_STATUS, null)
  if (status?.completed) {
    console.log("[v0] Migration already completed")
    return false
  }

  // Check if old data exists
  const hasHeroSlides = !!getFromLocalStorage(COLLECTIONS.HERO_SLIDES, null)
  const hasAboutContent = !!getFromLocalStorage(COLLECTIONS.ABOUT_CONTENT, null)
  const hasGalleryImages = !!getFromLocalStorage(COLLECTIONS.GALLERY_IMAGES, null)
  const hasDepartments = !!getFromLocalStorage(COLLECTIONS.DEPARTMENT_CONTENTS, null)

  const needsMig = hasHeroSlides || hasAboutContent || hasGalleryImages || hasDepartments

  console.log("[v0] Migration check:", {
    needsMig,
    hasHeroSlides,
    hasAboutContent,
    hasGalleryImages,
    hasDepartments
  })

  return needsMig
}

/**
 * Create backup of old data before migration
 */
export function createBackup(): boolean {
  try {
    const backup = {
      heroSlides: getFromLocalStorage(COLLECTIONS.HERO_SLIDES, null),
      aboutContent: getFromLocalStorage(COLLECTIONS.ABOUT_CONTENT, null),
      galleryImages: getFromLocalStorage(COLLECTIONS.GALLERY_IMAGES, null),
      departments: getFromLocalStorage(COLLECTIONS.DEPARTMENT_CONTENTS, null),
      timestamp: new Date().toISOString(),
      version: MIGRATION_VERSION
    }

    saveToLocalStorage(COLLECTIONS.MIGRATION_BACKUP, backup)
    console.log("[v0] Backup created successfully")
    return true
  } catch (error) {
    console.error("[v0] Backup creation failed:", error)
    return false
  }
}

/**
 * Convert hero slides to hero-basic blocks
 */
function convertHeroSlides(heroSlides: HeroSlide[]): Block[] {
  if (!heroSlides || heroSlides.length === 0) return []

  // Use first slide as hero-basic block
  const firstSlide = heroSlides[0]

  return [{
    id: `hero-${Date.now()}`,
    kind: 'hero-basic' as const,
    data: {
      heading: firstSlide.titleAr || firstSlide.titleEn,
      headingEn: firstSlide.titleEn,
      subheading: firstSlide.descriptionAr || firstSlide.descriptionEn,
      subheadingEn: firstSlide.descriptionEn,
      backgroundImage: firstSlide.image,
      overlay: true,
      cta: {
        text: 'اكتشف المزيد',
        textEn: 'Learn More',
        link: '#about'
      }
    }
  }]
}

/**
 * Convert about content to rich-text and image-with-text blocks
 */
function convertAboutContent(aboutContent: AboutContent): Block[] {
  if (!aboutContent) return []

  const blocks: Block[] = []

  // Section header
  blocks.push({
    id: `header-${Date.now()}`,
    kind: 'section-header' as const,
    data: {
      title: aboutContent.titleAr || 'من نحن',
      titleEn: aboutContent.titleEn || 'About Us',
      subtitle: '',
      subtitleEn: '',
      alignment: 'center'
    }
  })

  // Image with text
  blocks.push({
    id: `image-text-${Date.now()}`,
    kind: 'image-with-text' as const,
    data: {
      image: aboutContent.image || '',
      imagePosition: 'right',
      title: aboutContent.titleAr,
      titleEn: aboutContent.titleEn,
      content: aboutContent.descriptionAr,
      contentEn: aboutContent.descriptionEn
    }
  })

  // Features as icon-points if they exist
  if (aboutContent.features && aboutContent.features.length > 0) {
    blocks.push({
      id: `features-${Date.now()}`,
      kind: 'icon-points' as const,
      data: {
        title: 'مميزاتنا',
        titleEn: 'Our Features',
        points: aboutContent.features.map((f, i) => ({
          id: `feature-${i}`,
          icon: '✓',
          title: f.titleAr,
          titleEn: f.titleEn,
          description: f.descriptionAr,
          descriptionEn: f.descriptionEn
        }))
      }
    })
  }

  return blocks
}

/**
 * Convert gallery images to image-albums block
 */
function convertGallery(galleryImages: GalleryImage[]): Block[] {
  if (!galleryImages || galleryImages.length === 0) return []

  // Group by category
  const albums: Record<string, GalleryImage[]> = {}
  galleryImages.forEach(img => {
    const category = img.category || 'default'
    if (!albums[category]) albums[category] = []
    albums[category].push(img)
  })

  return [{
    id: `gallery-${Date.now()}`,
    kind: 'image-albums' as const,
    data: {
      title: 'معرض الصور',
      titleEn: 'Photo Gallery',
      albums: Object.entries(albums).map(([category, images], idx) => ({
        id: `album-${idx}`,
        title: category === 'default' ? 'المعرض' : category,
        titleEn: category === 'default' ? 'Gallery' : category,
        images: images.map(img => ({
          id: img.id || `img-${idx}`,
          url: img.image,
          caption: img.titleAr,
          captionEn: img.titleEn
        }))
      }))
    }
  }]
}

/**
 * Create homepage from migrated content
 */
export function createMigratedHomepage(
  heroSlides: HeroSlide[],
  aboutContent: AboutContent,
  galleryImages: GalleryImage[]
): string | null {
  try {
    const blocks: Block[] = [
      ...convertHeroSlides(heroSlides),
      ...convertAboutContent(aboutContent),
      ...convertGallery(galleryImages)
    ]

    const pages = getFromLocalStorage(COLLECTIONS.PAGES, [])

    // Check if homepage already exists
    const existingHome = pages.find((p: any) => p.isHome === true)
    if (existingHome) {
      console.log("[v0] Homepage already exists, skipping creation")
      return existingHome.id
    }

    const newPage = {
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug: 'home',
      titleAr: 'الصفحة الرئيسية',
      titleEn: 'Home',
      descriptionAr: 'الصفحة الرئيسية للموقع',
      descriptionEn: 'Website Homepage',
      contentAr: '',
      contentEn: '',
      seoDescriptionAr: 'المدرسة النموذجية للتربية الخاصة - الصفحة الرئيسية',
      seoDescriptionEn: 'Al Namothajia School - Home Page',
      blocksAr: blocks,
      blocksEn: blocks, // Same for both languages initially
      blocks: blocks, // Legacy
      isPublished: true,
      isHome: true,
      migratedFrom: 'legacy_homepage',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    pages.push(newPage)
    saveToLocalStorage(COLLECTIONS.PAGES, pages)

    console.log("[v0] Migrated homepage created:", newPage.id)
    return newPage.id
  } catch (error) {
    console.error("[v0] Failed to create migrated homepage:", error)
    return null
  }
}

/**
 * Create department pages from department content
 */
export function createDepartmentPages(departments: DepartmentContent[]): string[] {
  if (!departments || departments.length === 0) return []

  const departmentIds: string[] = []
  const pages = getFromLocalStorage(COLLECTIONS.PAGES, [])

  departments.forEach(dept => {
    try {
      const blocks: Block[] = [
        {
          id: `header-${Date.now()}`,
          kind: 'section-header' as const,
          data: {
            title: dept.titleAr,
            titleEn: dept.titleEn,
            subtitle: dept.descriptionAr,
            subtitleEn: dept.descriptionEn,
            alignment: 'center'
          }
        },
        {
          id: `content-${Date.now()}`,
          kind: 'rich-text' as const,
          data: {
            content: dept.descriptionAr,
            contentEn: dept.descriptionEn
          }
        }
      ]

      if (dept.image) {
        blocks.push({
          id: `image-${Date.now()}`,
          kind: 'image-with-text' as const,
          data: {
            image: dept.image,
            imagePosition: 'right',
            title: dept.titleAr,
            titleEn: dept.titleEn,
            content: dept.descriptionAr,
            contentEn: dept.descriptionEn
          }
        })
      }

      const newPage = {
        id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        slug: `departments/${dept.type}`,
        titleAr: dept.titleAr,
        titleEn: dept.titleEn,
        descriptionAr: dept.descriptionAr,
        descriptionEn: dept.descriptionEn,
        contentAr: '',
        contentEn: '',
        blocksAr: blocks,
        blocksEn: blocks,
        blocks: blocks,
        isPublished: true,
        isHome: false,
        migratedFrom: 'legacy_departments',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      pages.push(newPage)
      departmentIds.push(newPage.id)

      console.log(`[v0] Migrated department page: ${dept.type}`)
    } catch (error) {
      console.error(`[v0] Failed to migrate department ${dept.type}:`, error)
    }
  })

  saveToLocalStorage(COLLECTIONS.PAGES, pages)
  return departmentIds
}

/**
 * Main migration function
 */
export async function runMigration(): Promise<MigrationResult> {
  console.log("[v0] Starting migration...")

  try {
    // Create backup first
    if (!createBackup()) {
      return { success: false, error: "Failed to create backup" }
    }

    // Load old data
    const heroSlides = getFromLocalStorage(COLLECTIONS.HERO_SLIDES, [])
    const aboutContent = getFromLocalStorage(COLLECTIONS.ABOUT_CONTENT, null)
    const galleryImages = getFromLocalStorage(COLLECTIONS.GALLERY_IMAGES, [])
    const departments = getFromLocalStorage(COLLECTIONS.DEPARTMENT_CONTENTS, [])

    // Create migrated pages
    const homepageId = createMigratedHomepage(heroSlides, aboutContent, galleryImages)
    const departmentPageIds = createDepartmentPages(departments)

    // Mark migration as complete
    const migrationStatus = {
      completed: true,
      timestamp: new Date().toISOString(),
      migratedPages: [homepageId, ...departmentPageIds].filter(Boolean),
      backupCreated: true,
      version: MIGRATION_VERSION
    }

    saveToLocalStorage(COLLECTIONS.MIGRATION_STATUS, migrationStatus)

    // Clean up old data (optional - commented out for safety)
    // localStorage.removeItem(COLLECTIONS.HERO_SLIDES)
    // localStorage.removeItem(COLLECTIONS.ABOUT_CONTENT)
    // localStorage.removeItem(COLLECTIONS.GALLERY_IMAGES)
    // localStorage.removeItem(COLLECTIONS.DEPARTMENT_CONTENTS)

    console.log("[v0] Migration completed successfully!")

    return {
      success: true,
      homepageId: homepageId || undefined,
      departmentPageIds
    }
  } catch (error: any) {
    console.error("[v0] Migration failed:", error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Restore from backup
 */
export function restoreFromBackup(): boolean {
  try {
    const backup = getFromLocalStorage(COLLECTIONS.MIGRATION_BACKUP, null)
    if (!backup) {
      console.error("[v0] No backup found")
      return false
    }

    if (backup.heroSlides) {
      saveToLocalStorage(COLLECTIONS.HERO_SLIDES, backup.heroSlides)
    }
    if (backup.aboutContent) {
      saveToLocalStorage(COLLECTIONS.ABOUT_CONTENT, backup.aboutContent)
    }
    if (backup.galleryImages) {
      saveToLocalStorage(COLLECTIONS.GALLERY_IMAGES, backup.galleryImages)
    }
    if (backup.departments) {
      saveToLocalStorage(COLLECTIONS.DEPARTMENT_CONTENTS, backup.departments)
    }

    // Remove migration status
    localStorage.removeItem(COLLECTIONS.MIGRATION_STATUS)

    console.log("[v0] Restored from backup successfully")
    return true
  } catch (error) {
    console.error("[v0] Restore from backup failed:", error)
    return false
  }
}
