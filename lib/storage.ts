import type { ReactNode } from "react"
import {
  getFromFirestore,
  getDocFromFirestore,
  saveToFirestore,
  deleteFromFirestore,
  queryFirestore,
  where,
  COLLECTIONS,
  getFromLocalStorage,
  saveToLocalStorage
} from "./storage-adapter"
import { getDb, FIREBASE_COLLECTIONS, SETTINGS_DOCS, deleteFileFromStorage } from "./firebase"
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, getDoc } from "firebase/firestore"

// Re-export COLLECTIONS for backward compatibility
export { COLLECTIONS }

console.log("[Firebase] Storage module initialized - Firestore mode")

// ============================================
// INTERFACES
// ============================================

export interface EmploymentApplication {
  id: string
  position: string
  fullName: string
  phone: string
  email: string
  nationalId: string
  gender: string
  experience: string
  expectedSalary: string
  coverLetter: string
  submittedAt: string
  status?: "pending" | "reviewed" | "accepted" | "rejected"
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string
  rating: number
  message: string
  submittedAt: string
}

export interface FormField {
  id: string
  type: "text" | "email" | "phone" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date"
  labelAr: string
  labelEn: string
  placeholder?: string
  placeholderEn?: string
  required: boolean
  options?: string[]
  order: number
}

export interface Form {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr?: string
  descriptionEn?: string
  fields: FormField[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FormSubmission {
  id: string
  formId: string
  formTitle: string
  data: Record<string, any>
  submittedAt: string
  status: "new" | "read" | "archived"
}

export interface Testimonial {
  id: string
  name: string
  image: string
  rating: number
  comment: string
  createdAt: string
}

export interface JobCustomField {
  id: string
  labelAr: string
  labelEn: string
  type: "text" | "textarea" | "select" | "file" | "number" | "date" | "email" | "phone"
  required: boolean
  placeholder?: string
  placeholderEn?: string
  options?: { valueAr: string; valueEn: string }[]
  order: number
}

export interface JobPosition {
  id: string
  title: string
  titleEn: string
  type: string
  typeEn: string
  workShift?: string
  workShiftEn?: string
  gender?: "ذكر" | "أنثى" | "لا يهم"
  genderEn?: "Male" | "Female" | "Doesn't matter"
  workDuration?: string
  workDurationEn?: string
  description: string
  descriptionEn: string
  createdAt: string
  requiresCv?: boolean
  requiresCoverLetter?: boolean
  requiresPhoto?: boolean
  customFields?: JobCustomField[]
}

export interface PendingReview {
  id: string
  name: string
  image: string
  rating: number
  comment: string
  submittedAt: string
}

export interface RejectedReview {
  id: string
  name: string
  image: string
  rating: number
  comment: string
  submittedAt: string
  rejectedAt: string
}

export interface ServiceContent {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  type: "education" | "training" | "employment"
  createdAt: string
}

export interface SiteContent {
  id: string
  section: "hero" | "about" | "gallery" | "departments"
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  order: number
  createdAt: string
}

export interface HeroSlide {
  id?: string
  image: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
}

export interface SubsectionBranch {
  titleAr: string
  titleEn: string
  image: string
  descriptionAr: string
  descriptionEn: string
}

export interface Subsection {
  icon: string
  titleAr: string
  titleEn: string
  image: string
  descriptionAr: string
  descriptionEn: string
  branches?: SubsectionBranch[]
}

export interface DepartmentData {
  id: string
  slug: string
  icon: string
  titleAr: string
  titleEn: string
  color: string
  welcomeAr: string
  welcomeEn: string
  descriptionAr: string
  descriptionEn: string
  heroSlides: HeroSlide[]
  subsections: Subsection[]
}

export interface AboutContent {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  features: {
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
  }[]
}

export interface GalleryImage {
  id: string
  image: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  category?: string
  order: number
}

export interface MediaItem {
  id: string
  url: string
  filename: string
  originalName: string
  type: "image" | "video" | "document" | "other"
  mimeType: string
  size: number
  width?: number
  height?: number
  alt?: string
  titleAr?: string
  titleEn?: string
  descriptionAr?: string
  descriptionEn?: string
  category?: string
  tags?: string[]
  uploadedAt: string
  uploadedBy?: string
  source: "upload" | "url" | "ai"
}

export interface DepartmentContent {
  id: string
  type: "medical" | "heart" | "housing" | "activities"
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
}

export interface ContactInfo {
  id: string
  phone: string
  whatsapp: string
  email: string
  address: string
  addressEn: string
  workingHours: string
  workingHoursEn: string
  holidays: string
  holidaysEn: string
  responsiblePerson: string
  responsiblePersonEn: string
  responsibleTitle: string
  responsibleTitleEn: string
}

export interface EnhancedEmploymentApplication {
  id: string
  fullName: string
  birthPlace: string
  birthDate: string
  nationalId: string
  maritalStatus: string
  gender: string
  address: string
  phone: string
  email?: string
  position: string
  expectedSalary: string
  canStayOvernight: string
  education: {
    degree: string
    major: string
    university: string
    graduationYear: string
    gpa?: string
  }[]
  experience: {
    institution: string
    jobTitle: string
    duration: string
    responsibilities: string
  }[]
  cvFileName?: string
  cvFileUrl?: string
  coverLetter?: string
  photoFileName?: string
  photoFileUrl?: string
  customFieldResponses?: { fieldId: string; value: string; fileName?: string }[]
  submittedAt: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  notes?: string
}

export interface ServiceRequest {
  id: string
  name: string
  phone: string
  email: string
  serviceType: string
  message: string
  submittedAt: string
  status: "pending" | "contacted" | "completed" | "cancelled"
  notes?: string
}

export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  position: string
  department: string
  role: "admin" | "hr_manager" | "service_manager" | "content_manager" | "receptionist" | "employee" | "viewer"
  password: string
  permissions: {
    canViewApplications: boolean
    canEditApplications: boolean
    canApproveApplications: boolean
    canDeleteApplications: boolean
    canViewServiceRequests: boolean
    canEditServiceRequests: boolean
    canDeleteServiceRequests: boolean
    canViewMessages: boolean
    canReplyToMessages: boolean
    canDeleteMessages: boolean
    canViewContent: boolean
    canEditContent: boolean
    canPublishContent: boolean
    canDeleteContent: boolean
    canViewEmployees: boolean
    canAddEmployees: boolean
    canEditEmployees: boolean
    canDeleteEmployees: boolean
    canViewReports: boolean
    canExportData: boolean
  }
  createdAt: string
  isActive: boolean
  lastLogin?: string
}

export type Staff = Employee

export interface PageBlock {
  id: string
  type:
  | "heading"
  | "paragraph"
  | "image"
  | "gallery"
  | "video"
  | "quote"
  | "divider"
  | "button"
  | "html"
  | "row"
  | "hero-slider"
  | "statistics"
  | "features"
  | "card"
  | "icon-box"
  | "accordion"
  | "tabs"
  | "alert"
  | "testimonial-card"
  | "team-member"
  | "pricing-card"
  | "cta"
  | "form"
  | "map"
  | "social-links"
  | "spacer"
  order: number
  children?: PageBlock[]
  styles?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    gradientFrom?: string
    gradientTo?: string
    gradientVia?: string
    animation?: string
    animationDelay?: string
    animationDuration?: string
    hoverScale?: string
    hoverRotate?: string
    hoverTranslate?: string
    hoverShadow?: string
    hoverBorderColor?: string
    padding?: string
    margin?: string
    gap?: string
    borderRadius?: string
    borderWidth?: string
    shadow?: string
    textAlign?: "left" | "center" | "right"
    maxWidth?: string
    backdropBlur?: string
    opacity?: string
  }
  content: {
    level?: 1 | 2 | 3 | 4 | 5 | 6
    textAr?: string
    textEn?: string
    imageUrl?: string
    altAr?: string
    altEn?: string
    captionAr?: string
    captionEn?: string
    images?: Array<{ url: string; alt: string; caption?: string }>
    videoUrl?: string
    titleAr?: string
    titleEn?: string
    quoteAr?: string
    quoteEn?: string
    authorAr?: string
    authorEn?: string
    buttonTextAr?: string
    buttonTextEn?: string
    buttonUrl?: string
    buttonStyle?: string
    dividerStyle?: string
    htmlCode?: string
    columns?: number
    columnBlocks?: PageBlock[][]
    gap?: string
    slides?: Array<{
      id: string
      imageUrl: string
      titleAr: string
      titleEn: string
      subtitleAr?: string
      subtitleEn?: string
      descriptionAr?: string
      descriptionEn?: string
    }>
    stats?: Array<{
      id: string
      number: string
      labelAr: string
      labelEn: string
    }>
    features?: Array<{
      id: string
      icon: string
      titleAr: string
      titleEn: string
      descriptionAr: string
      descriptionEn: string
    }>
    cardImageUrl?: string
    cardTitleAr?: string
    cardTitleEn?: string
    cardDescriptionAr?: string
    cardDescriptionEn?: string
    cardButtonTextAr?: string
    cardButtonTextEn?: string
    cardButtonUrl?: string
    icon?: string
    iconColor?: string
    iconSize?: string
    iconBoxSize?: string
    iconBoxBg?: string
    accordionItems?: Array<{
      id: string
      titleAr: string
      titleEn: string
      contentAr: string
      contentEn: string
    }>
    tabItems?: Array<{
      id: string
      labelAr: string
      labelEn: string
      contentAr: string
      contentEn: string
    }>
    alertType?: "info" | "success" | "warning" | "error"
    alertTitleAr?: string
    alertTitleEn?: string
    alertMessageAr?: string
    alertMessageEn?: string
    testimonialName?: string
    testimonialImage?: string
    testimonialRating?: number
    testimonialComment?: string
    testimonialPosition?: string
    memberName?: string
    memberImage?: string
    memberPositionAr?: string
    memberPositionEn?: string
    memberBioAr?: string
    memberBioEn?: string
    memberEmail?: string
    memberPhone?: string
    memberSocial?: Array<{ platform: string; url: string }>
    pricingTitleAr?: string
    pricingTitleEn?: string
    pricingPrice?: string
    pricingPeriodAr?: string
    pricingPeriodEn?: string
    pricingFeatures?: Array<{ textAr: string; textEn: string; included: boolean }>
    pricingButtonTextAr?: string
    pricingButtonTextEn?: string
    pricingButtonUrl?: string
    pricingHighlighted?: boolean
    ctaTitleAr?: string
    ctaTitleEn?: string
    ctaDescriptionAr?: string
    ctaDescriptionEn?: string
    ctaButtonTextAr?: string
    ctaButtonTextEn?: string
    ctaButtonUrl?: string
    ctaBackgroundImage?: string
    formFields?: Array<{
      id: string
      type: "text" | "email" | "tel" | "textarea" | "select"
      labelAr: string
      labelEn: string
      placeholderAr?: string
      placeholderEn?: string
      required?: boolean
      options?: Array<{ labelAr: string; labelEn: string; value: string }>
    }>
    formSubmitTextAr?: string
    formSubmitTextEn?: string
    formSubmitUrl?: string
    mapUrl?: string
    mapHeight?: string
    socialLinks?: Array<{
      platform: string
      url: string
      icon: string
    }>
    spacerHeight?: string
    height?: string
  }
}

export interface DynamicPage {
  id: string
  slug: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  contentAr: string
  contentEn: string
  image?: string
  seoDescriptionAr?: string
  seoDescriptionEn?: string
  keywordsAr?: string
  keywordsEn?: string
  featuredImage?: string
  blocks?: PageBlock[]
  blocksAr?: PageBlock[]
  blocksEn?: PageBlock[]
  customCss?: string
  customJs?: string
  isPublished: boolean
  isHome?: boolean
  migratedFrom?: string
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  labelAr: string
  labelEn: string
  linkType: 'page' | 'url' | 'section'
  pageSlug?: string
  pageSlugAr?: string
  pageSlugEn?: string
  url?: string
  sectionId?: string
  openInNewTab: boolean
  icon?: string
  order: number
  children?: MenuItem[]
}

export interface GeneralSettings {
  siteName: string
  siteNameEn: string
  siteTagline: string
  siteTaglineEn: string
  siteLogo: string
  favicon: string
  defaultLanguage: "ar" | "en"
  timeZone: string
  dateFormat: string
  copyrightText: string
  copyrightTextEn: string
  seoDescription: string
  seoDescriptionEn: string
  seoKeywords: string
  seoKeywordsEn: string
  googleAnalyticsId: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
    whatsapp: string
    tiktok: string
  }
  primaryColor: string
  secondaryColor: string
}

export interface HeaderSettings {
  // Note: Site identity (logo, siteName, tagline) comes from GeneralSettings
  menuItems: MenuItem[]
  style: {
    backgroundColor: string
    textColor: string
    hoverColor: string
    activeColor?: string
    font: string
    height: number
    isSticky: boolean
    isTransparent: boolean
    shadow: string
  }
  showLanguageSwitcher: boolean
  languageSwitcherPosition: 'left' | 'right'
  showSearch: boolean
  ctaButton?: {
    labelAr: string
    labelEn: string
    link: string
    style: 'primary' | 'secondary' | 'outline'
  }
  contactInfo?: {
    showPhone: boolean
    showEmail: boolean
    phone?: string
    email?: string
  }
}

export interface FooterColumn {
  id: string
  titleAr: string
  titleEn: string
  type: 'links' | 'text' | 'contact' | 'custom'
  order: number
  content: {
    links?: Array<{
      labelAr: string
      labelEn: string
      linkType: 'page' | 'url'
      pageSlug?: string
      pageSlugAr?: string
      pageSlugEn?: string
      url?: string
    }>
    textAr?: string
    textEn?: string
    contactItems?: Array<{
      icon: string
      labelAr: string
      labelEn: string
      value: string
    }>
    htmlAr?: string
    htmlEn?: string
  }
}

export interface FooterSettings {
  layout: '1-column' | '2-column' | '3-column' | '4-column'
  columns: FooterColumn[]
  style: {
    backgroundColor: string
    textColor: string
    linkColor: string
    linkHoverColor: string
    font: string
    padding: number
  }
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
    tiktok?: string
    whatsapp?: string
  }
  contactInfo: {
    showAddress: boolean
    addressAr?: string
    addressEn?: string
    showPhone: boolean
    phone?: string
    showEmail: boolean
    email?: string
    showWorkingHours: boolean
    workingHoursAr?: string
    workingHoursEn?: string
  }
  showLogo: boolean
  showNewsletter: boolean
  newsletterTitleAr?: string
  newsletterTitleEn?: string
  copyrightAr: string
  copyrightEn: string
  showBackToTop: boolean
  paymentIcons?: string[]
}

export interface MaintenanceSettings {
  enabled: boolean
  titleAr: string
  titleEn: string
  messageAr: string
  messageEn: string
  showCountdown: boolean
  countdownDate?: string
  showContactInfo: boolean
  contactEmail?: string
  contactPhone?: string
  showSocialLinks: boolean
  backgroundImage?: string
  logoImage?: string
  primaryColor: string
  secondaryColor: string
}

export interface MigrationStatus {
  completed: boolean
  timestamp: string
  migratedPages: string[]
  backupCreated: boolean
  version: string
}

export interface Activity {
  id: string
  employeeId: string
  employeeName: string
  action: string
  actionType: "create" | "update" | "delete" | "approve" | "reject" | "view"
  targetType: "application" | "message" | "testimonial" | "job" | "content" | "employee"
  targetId: string
  details: string
  timestamp: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  link?: string
}

export interface LocalizedPage {
  id: string
  slug: string
  title: string
  description: string
  content: string
  blocks: PageBlock[]
  image?: string
  seoDescription?: string
  keywords?: string
  featuredImage?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  lang: "ar" | "en"
  dir: "rtl" | "ltr"
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

function dispatchStorageChange(key: string, value: any): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("localStorageChange", {
        detail: { key, value },
      }),
    )
  }
}

// ============================================
// EMPLOYMENT APPLICATIONS (web_applications)
// ============================================

export async function saveEmploymentApplication(
  data: Omit<EmploymentApplication, "id" | "submittedAt">,
): Promise<void> {
  try {
    const db = getDb()
    const newApp: EmploymentApplication = {
      ...data,
      id: generateId(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.EMPLOYMENT_APPLICATIONS, newApp.id), newApp)
    console.log("[Firebase] Employment application saved with ID:", newApp.id)
  } catch (error) {
    console.error("[Firebase] Error saving employment application:", error)
    throw error
  }
}

export async function getEmploymentApplications(): Promise<EmploymentApplication[]> {
  try {
    return await getFromFirestore<EmploymentApplication[]>(FIREBASE_COLLECTIONS.EMPLOYMENT_APPLICATIONS, [])
  } catch (error) {
    console.error("[Firebase] Error getting employment applications:", error)
    return []
  }
}

export async function deleteEmploymentApplication(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.EMPLOYMENT_APPLICATIONS, id)
    console.log("[Firebase] Employment application deleted:", id)
  } catch (error) {
    console.error("[Firebase] Error deleting employment application:", error)
    throw error
  }
}

export async function updateEmploymentApplicationStatus(
  id: string,
  status: EmploymentApplication["status"],
): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.EMPLOYMENT_APPLICATIONS, id, { status })
  } catch (error) {
    console.error("[Firebase] Error updating employment application status:", error)
    throw error
  }
}

// ============================================
// CONTACT MESSAGES (web_contact_messages)
// ============================================

export async function saveContactMessage(data: Omit<ContactMessage, "id" | "submittedAt">): Promise<void> {
  try {
    const db = getDb()
    const newMessage: ContactMessage = {
      ...data,
      id: generateId(),
      submittedAt: new Date().toISOString(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.CONTACT_MESSAGES, newMessage.id), newMessage)
  } catch (error) {
    console.error("[Firebase] Error saving contact message:", error)
    throw error
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    return await getFromFirestore<ContactMessage[]>(FIREBASE_COLLECTIONS.CONTACT_MESSAGES, [])
  } catch (error) {
    console.error("[Firebase] Error getting contact messages:", error)
    return []
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.CONTACT_MESSAGES, id)
  } catch (error) {
    console.error("[Firebase] Error deleting contact message:", error)
    throw error
  }
}

// ============================================
// TESTIMONIALS (web_testimonials)
// ============================================

export async function saveTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Promise<void> {
  try {
    const db = getDb()
    const newTestimonial: Testimonial = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.TESTIMONIALS, newTestimonial.id), newTestimonial)
  } catch (error) {
    console.error("[Firebase] Error saving testimonial:", error)
    throw error
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await getFromFirestore<Testimonial[]>(FIREBASE_COLLECTIONS.TESTIMONIALS, [])
  } catch (error) {
    console.error("[Firebase] Error getting testimonials:", error)
    return []
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.TESTIMONIALS, id)
  } catch (error) {
    console.error("[Firebase] Error deleting testimonial:", error)
    throw error
  }
}

// ============================================
// JOB POSITIONS (web_job_positions)
// ============================================

export async function saveJobPosition(data: Omit<JobPosition, "id" | "createdAt">): Promise<void> {
  try {
    const db = getDb()
    const newJob: JobPosition = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.JOB_POSITIONS, newJob.id), newJob)
  } catch (error) {
    console.error("[Firebase] Error saving job position:", error)
    throw error
  }
}

export async function getJobPositions(): Promise<JobPosition[]> {
  try {
    const jobs = await getFromFirestore<JobPosition[]>(FIREBASE_COLLECTIONS.JOB_POSITIONS, [])
    return jobs
  } catch (error) {
    console.error("[Firebase] Error getting job positions:", error)
    return []
  }
}

export function getAvailableJobs(): Promise<JobPosition[]> {
  return getJobPositions()
}

export async function deleteJobPosition(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.JOB_POSITIONS, id)
  } catch (error) {
    console.error("[Firebase] Error deleting job position:", error)
    throw error
  }
}

export async function updateJobPosition(id: string, data: Omit<JobPosition, "id" | "createdAt">): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.JOB_POSITIONS, id, data)
  } catch (error) {
    console.error("[Firebase] Error updating job position:", error)
    throw error
  }
}

export function resetJobPositionsToDefault(): void {
  console.log("[Firebase] resetJobPositionsToDefault - This function is deprecated in Firebase mode")
}

// ============================================
// PENDING/REJECTED REVIEWS (localStorage for now - can migrate later)
// ============================================

export function savePendingReview(data: Omit<PendingReview, "id" | "submittedAt">): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews()
    const newReview: PendingReview = {
      ...data,
      id: generateId(),
      submittedAt: new Date().toISOString(),
    }
    reviews.push(newReview)
    localStorage.setItem("pendingReviews", JSON.stringify(reviews))
  }
}

export function getPendingReviews(): PendingReview[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("pendingReviews")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function approvePendingReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews()
    const review = reviews.find((r) => r.id === id)
    if (review) {
      saveTestimonial({
        name: review.name,
        image: review.image,
        rating: review.rating,
        comment: review.comment,
      })
      deletePendingReview(id)
    }
  }
}

export function deletePendingReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews().filter((r) => r.id !== id)
    localStorage.setItem("pendingReviews", JSON.stringify(reviews))
  }
}

export function rejectPendingReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getPendingReviews()
    const review = reviews.find((r) => r.id === id)
    if (review) {
      const rejectedReview: RejectedReview = {
        ...review,
        rejectedAt: new Date().toISOString(),
      }
      saveRejectedReview(rejectedReview)
      deletePendingReview(id)
    }
  }
}

export function saveRejectedReview(review: RejectedReview): void {
  if (typeof window !== "undefined") {
    const reviews = getRejectedReviews()
    reviews.push(review)
    localStorage.setItem("web_rejected_reviews", JSON.stringify(reviews))
  }
}

export function getRejectedReviews(): RejectedReview[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("web_rejected_reviews")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function deleteRejectedReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getRejectedReviews().filter((r) => r.id !== id)
    localStorage.setItem("web_rejected_reviews", JSON.stringify(reviews))
  }
}

export function approveRejectedReview(id: string): void {
  if (typeof window !== "undefined") {
    const reviews = getRejectedReviews()
    const review = reviews.find((r) => r.id === id)
    if (review) {
      saveTestimonial({
        name: review.name,
        image: review.image,
        rating: review.rating,
        comment: review.comment,
      })
      deleteRejectedReview(id)
    }
  }
}

export function rejectApprovedReview(id: string): void {
  if (typeof window !== "undefined") {
    getTestimonials().then((testimonials) => {
      const testimonial = testimonials.find((t) => t.id === id)
      if (testimonial) {
        const rejectedReview: RejectedReview = {
          id: testimonial.id,
          name: testimonial.name,
          image: testimonial.image,
          rating: testimonial.rating,
          comment: testimonial.comment,
          submittedAt: testimonial.createdAt,
          rejectedAt: new Date().toISOString(),
        }
        saveRejectedReview(rejectedReview)
        deleteTestimonial(id)
      }
    })
  }
}

// ============================================
// SERVICE CONTENT (localStorage - can migrate later)
// ============================================

export function saveServiceContent(data: Omit<ServiceContent, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const services = getServiceContents()
    const newService: ServiceContent = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    services.push(newService)
    localStorage.setItem("serviceContents", JSON.stringify(services))
  }
}

export function getServiceContents(): ServiceContent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("serviceContents")
    if (data) {
      return JSON.parse(data)
    }
    const defaultServices: ServiceContent[] = [
      {
        id: "1",
        titleAr: "طلب الخدمة",
        titleEn: "Service Request",
        descriptionAr: "قدم طلبك للحصول على خدماتنا التعليمية والتأهيلية المتخصصة بسهولة وسرعة",
        descriptionEn: "Submit your request to access our specialized educational and rehabilitation services easily and quickly",
        type: "education",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        titleAr: "فرص توظيف",
        titleEn: "Employment Opportunities",
        descriptionAr: "انضم إلى فريقنا التعليمي المتميز. نبحث عن معلمين وإداريين مؤهلين للمساهمة في رسالتنا التعليمية",
        descriptionEn: "Join our distinguished educational team. We are looking for qualified teachers and administrators",
        type: "employment",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("serviceContents", JSON.stringify(defaultServices))
    return defaultServices
  }
  return []
}

export function updateServiceContent(id: string, data: Omit<ServiceContent, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const services = getServiceContents()
    const index = services.findIndex((s) => s.id === id)
    if (index !== -1) {
      services[index] = { ...services[index], ...data }
      localStorage.setItem("serviceContents", JSON.stringify(services))
    }
  }
}

export function deleteServiceContent(id: string): void {
  if (typeof window !== "undefined") {
    const services = getServiceContents().filter((s) => s.id !== id)
    localStorage.setItem("serviceContents", JSON.stringify(services))
  }
}

// ============================================
// SITE CONTENT (localStorage - can migrate later)
// ============================================

export function getSiteContents(): SiteContent[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("siteContents")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveSiteContent(data: Omit<SiteContent, "id" | "createdAt">): void {
  if (typeof window !== "undefined") {
    const contents = getSiteContents()
    const newContent: SiteContent = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    contents.push(newContent)
    localStorage.setItem("siteContents", JSON.stringify(contents))
  }
}

export function updateSiteContent(id: string, data: Partial<SiteContent>): void {
  if (typeof window !== "undefined") {
    const contents = getSiteContents()
    const index = contents.findIndex((c) => c.id === id)
    if (index !== -1) {
      contents[index] = { ...contents[index], ...data }
      localStorage.setItem("siteContents", JSON.stringify(contents))
    }
  }
}

export function deleteSiteContent(id: string): void {
  if (typeof window !== "undefined") {
    const contents = getSiteContents().filter((c) => c.id !== id)
    localStorage.setItem("siteContents", JSON.stringify(contents))
  }
}

// ============================================
// HERO SLIDES (web_hero_slides)
// ============================================

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const slides = await getFromFirestore<HeroSlide[]>(FIREBASE_COLLECTIONS.HERO_SLIDES, [])
    if (slides.length === 0) {
      const defaultSlides: HeroSlide[] = [
        {
          id: "1",
          image: "/modern-special-education-school-classroom-with-div.jpg",
          titleAr: "المدرسة النموذجية",
          titleEn: "Al Namothajia School",
          descriptionAr: "لتعزيز التعليم والإبداع في بيئة مريحة وآمنة تراعي الفروق الفردية وتطور قدرات كل طالب",
          descriptionEn: "To enhance education and creativity in a comfortable and safe environment",
        },
      ]
      return defaultSlides
    }
    return slides
  } catch (error) {
    console.error("[Firebase] Error getting hero slides:", error)
    return []
  }
}

export async function saveHeroSlide(data: Omit<HeroSlide, "id">): Promise<void> {
  try {
    const db = getDb()
    const newSlide: HeroSlide = {
      ...data,
      id: generateId(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.HERO_SLIDES, newSlide.id!), newSlide)
  } catch (error) {
    console.error("[Firebase] Error saving hero slide:", error)
    throw error
  }
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.HERO_SLIDES, id, data)
  } catch (error) {
    console.error("[Firebase] Error updating hero slide:", error)
    throw error
  }
}

export async function deleteHeroSlide(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.HERO_SLIDES, id)
  } catch (error) {
    console.error("[Firebase] Error deleting hero slide:", error)
    throw error
  }
}

// ============================================
// DEPARTMENT CONTENTS (web_department_contents)
// ============================================

export async function getDepartmentContents(): Promise<DepartmentContent[]> {
  try {
    return await getFromFirestore<DepartmentContent[]>(FIREBASE_COLLECTIONS.DEPARTMENT_CONTENTS, [])
  } catch (error) {
    console.error("[Firebase] Error getting department contents:", error)
    return []
  }
}

export async function updateDepartmentContent(id: string, data: Partial<DepartmentContent>): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.DEPARTMENT_CONTENTS, id, data)
  } catch (error) {
    console.error("[Firebase] Error updating department content:", error)
    throw error
  }
}

// ============================================
// CONTACT INFO (web_settings/contact)
// ============================================

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const db = getDb()
    const docRef = doc(db, FIREBASE_COLLECTIONS.SETTINGS, SETTINGS_DOCS.CONTACT)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: "contact", ...docSnap.data() } as ContactInfo
    }
    return null
  } catch (error) {
    console.error("[Firebase] Error getting contact info:", error)
    return null
  }
}

export async function updateContactInfo(data: ContactInfo): Promise<void> {
  try {
    const db = getDb()
    await setDoc(doc(db, FIREBASE_COLLECTIONS.SETTINGS, SETTINGS_DOCS.CONTACT), data)
  } catch (error) {
    console.error("[Firebase] Error updating contact info:", error)
    throw error
  }
}

// ============================================
// ABOUT CONTENT (web_about_content)
// ============================================

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const contents = await getFromFirestore<AboutContent[]>(FIREBASE_COLLECTIONS.ABOUT_CONTENT, [])
    return contents[0] || null
  } catch (error) {
    console.error("[Firebase] Error getting about content:", error)
    return null
  }
}

export async function updateAboutContent(data: AboutContent): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.ABOUT_CONTENT, data.id, data)
  } catch (error) {
    console.error("[Firebase] Error updating about content:", error)
    throw error
  }
}

// ============================================
// GALLERY IMAGES (web_gallery_images)
// ============================================

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const images = await getFromFirestore<GalleryImage[]>(FIREBASE_COLLECTIONS.GALLERY_IMAGES, [])
    return images.sort((a, b) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error("[Firebase] Error getting gallery images:", error)
    return []
  }
}

export async function saveGalleryImage(data: Omit<GalleryImage, "id">): Promise<void> {
  try {
    const db = getDb()
    const newImage: GalleryImage = {
      ...data,
      id: generateId(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.GALLERY_IMAGES, newImage.id), newImage)
  } catch (error) {
    console.error("[Firebase] Error saving gallery image:", error)
    throw error
  }
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.GALLERY_IMAGES, id, data)
  } catch (error) {
    console.error("[Firebase] Error updating gallery image:", error)
    throw error
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.GALLERY_IMAGES, id)
  } catch (error) {
    console.error("[Firebase] Error deleting gallery image:", error)
    throw error
  }
}

// ============================================
// MEDIA LIBRARY (web_media)
// ============================================

export async function getMediaItems(): Promise<MediaItem[]> {
  try {
    const items = await getFromFirestore<MediaItem[]>(FIREBASE_COLLECTIONS.MEDIA, [])
    return items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  } catch (error) {
    console.error("[Firebase] Error getting media items:", error)
    return []
  }
}

export async function getMediaItem(id: string): Promise<MediaItem | null> {
  try {
    return await getDocFromFirestore<MediaItem | null>(FIREBASE_COLLECTIONS.MEDIA, id, null)
  } catch (error) {
    console.error("[Firebase] Error getting media item:", error)
    return null
  }
}

export async function saveMediaItem(data: Omit<MediaItem, "id" | "uploadedAt">): Promise<MediaItem> {
  try {
    const db = getDb()
    const newItem: MediaItem = {
      ...data,
      id: generateId(),
      uploadedAt: new Date().toISOString(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.MEDIA, newItem.id), newItem)
    return newItem
  } catch (error) {
    console.error("[Firebase] Error saving media item:", error)
    throw error
  }
}

export async function updateMediaItem(id: string, data: Partial<MediaItem>): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.MEDIA, id, data)
  } catch (error) {
    console.error("[Firebase] Error updating media item:", error)
    throw error
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  try {
    // First get the media item to get the file URL
    const item = await getMediaItem(id)

    // Delete from Firestore
    await deleteFromFirestore(FIREBASE_COLLECTIONS.MEDIA, id)

    // Delete file from Storage if it was an upload (not external URL)
    if (item && item.source === "upload" && item.url) {
      try {
        await deleteFileFromStorage(item.url)
      } catch (storageError) {
        // Log but don't fail if storage deletion fails
        console.error("[Firebase] Error deleting file from storage (item still removed from library):", storageError)
      }
    }
  } catch (error) {
    console.error("[Firebase] Error deleting media item:", error)
    throw error
  }
}

export async function getMediaByCategory(category: string): Promise<MediaItem[]> {
  try {
    const items = await getMediaItems()
    return items.filter((item) => item.category === category)
  } catch (error) {
    console.error("[Firebase] Error getting media by category:", error)
    return []
  }
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  try {
    const items = await getMediaItems()
    const lowerQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.originalName.toLowerCase().includes(lowerQuery) ||
        item.titleAr?.toLowerCase().includes(lowerQuery) ||
        item.titleEn?.toLowerCase().includes(lowerQuery) ||
        item.descriptionAr?.toLowerCase().includes(lowerQuery) ||
        item.descriptionEn?.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  } catch (error) {
    console.error("[Firebase] Error searching media:", error)
    return []
  }
}

export async function getMediaCategories(): Promise<string[]> {
  try {
    const items = await getMediaItems()
    const categories = new Set<string>()
    items.forEach((item) => {
      if (item.category) {
        categories.add(item.category)
      }
    })
    return Array.from(categories)
  } catch (error) {
    console.error("[Firebase] Error getting media categories:", error)
    return []
  }
}

// ============================================
// ENHANCED EMPLOYMENT APPLICATIONS (web_enhanced_applications)
// ============================================

export async function saveEnhancedEmploymentApplication(
  data: Omit<EnhancedEmploymentApplication, "id" | "submittedAt" | "status">,
): Promise<EnhancedEmploymentApplication> {
  try {
    const db = getDb()
    const newApplication: EnhancedEmploymentApplication = {
      ...data,
      id: generateId(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.ENHANCED_APPLICATIONS, newApplication.id), newApplication)
    return newApplication
  } catch (error) {
    console.error("[Firebase] Error saving enhanced employment application:", error)
    throw error
  }
}

export async function getEnhancedEmploymentApplications(): Promise<EnhancedEmploymentApplication[]> {
  try {
    return await getFromFirestore<EnhancedEmploymentApplication[]>(FIREBASE_COLLECTIONS.ENHANCED_APPLICATIONS, [])
  } catch (error) {
    console.error("[Firebase] Error getting enhanced employment applications:", error)
    return []
  }
}

export async function deleteEnhancedEmploymentApplication(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.ENHANCED_APPLICATIONS, id)
  } catch (error) {
    console.error("[Firebase] Error deleting enhanced employment application:", error)
    throw error
  }
}

export async function updateEnhancedEmploymentApplication(
  id: string,
  updates: Partial<EnhancedEmploymentApplication>,
): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.ENHANCED_APPLICATIONS, id, updates)
  } catch (error) {
    console.error("[Firebase] Error updating enhanced employment application:", error)
    throw error
  }
}

// ============================================
// SERVICE REQUESTS (web_service_requests)
// ============================================

export async function saveServiceRequest(
  data: Omit<ServiceRequest, "id" | "submittedAt" | "status">,
): Promise<ServiceRequest> {
  try {
    const db = getDb()
    const newRequest: ServiceRequest = {
      ...data,
      id: generateId(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.SERVICE_REQUESTS, newRequest.id), newRequest)
    return newRequest
  } catch (error) {
    console.error("[Firebase] Error saving service request:", error)
    throw error
  }
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  try {
    return await getFromFirestore<ServiceRequest[]>(FIREBASE_COLLECTIONS.SERVICE_REQUESTS, [])
  } catch (error) {
    console.error("[Firebase] Error getting service requests:", error)
    return []
  }
}

export async function deleteServiceRequest(id: string): Promise<void> {
  try {
    await deleteFromFirestore(FIREBASE_COLLECTIONS.SERVICE_REQUESTS, id)
  } catch (error) {
    console.error("[Firebase] Error deleting service request:", error)
    throw error
  }
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.SERVICE_REQUESTS, id, updates)
  } catch (error) {
    console.error("[Firebase] Error updating service request:", error)
    throw error
  }
}

export async function updateServiceRequestStatus(id: string, status: ServiceRequest["status"]): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.SERVICE_REQUESTS, id, { status })
  } catch (error) {
    console.error("[Firebase] Error updating service request status:", error)
    throw error
  }
}

// ============================================
// DEPARTMENT DATA (localStorage for complex structure)
// ============================================

export function getFullDepartmentsData(): DepartmentData[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("departmentContents")
    if (data) {
      return JSON.parse(data)
    }
    return []
  }
  return []
}

// ============================================
// EMPLOYEES (web_employees)
// ============================================

export async function getEmployees(): Promise<Employee[]> {
  try {
    console.log("[Firebase] Fetching employees from Firestore...")
    const employees = await getFromFirestore<Employee[]>(FIREBASE_COLLECTIONS.EMPLOYEES, [])
    console.log("[Firebase] Fetched", employees.length, "employees from Firestore")
    return employees
  } catch (error) {
    console.error("[Firebase] Error getting employees:", error)
    return []
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    return await getDocFromFirestore<Employee | null>(FIREBASE_COLLECTIONS.EMPLOYEES, id, null)
  } catch (error) {
    console.error("[Firebase] Error getting employee by ID:", error)
    return null
  }
}

export async function getEmployeeByEmail(email: string): Promise<Employee | null> {
  try {
    console.log("[Firebase] Fetching employee by email:", email)
    const employees = await getEmployees()
    const employee = employees.find((emp) => emp.email === email)
    if (employee) {
      console.log("[Firebase] Employee found:", employee.fullName)
    } else {
      console.log("[Firebase] No employee found with email:", email)
    }
    return employee || null
  } catch (error) {
    console.error("[Firebase] Error getting employee by email:", error)
    return null
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<void> {
  try {
    console.log("[Firebase] Updating employee:", id)
    await saveToFirestore(FIREBASE_COLLECTIONS.EMPLOYEES, id, updates)
    console.log("[Firebase] Employee updated successfully")
  } catch (error) {
    console.error("[Firebase] Error updating employee:", error)
    throw error
  }
}

export async function saveEmployee(employee: Employee): Promise<void> {
  try {
    console.log("[Firebase] Saving employee:", employee.email)
    const db = getDb()
    await setDoc(doc(db, FIREBASE_COLLECTIONS.EMPLOYEES, employee.id), employee)
    console.log("[Firebase] Employee saved successfully")
  } catch (error) {
    console.error("[Firebase] Error saving employee:", error)
    throw error
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    console.log("[Firebase] Deleting employee:", id)
    await deleteFromFirestore(FIREBASE_COLLECTIONS.EMPLOYEES, id)
    console.log("[Firebase] Employee deleted successfully")
  } catch (error) {
    console.error("[Firebase] Error deleting employee:", error)
    throw error
  }
}

export async function addEmployee(employee: Omit<Employee, "id" | "createdAt">): Promise<Employee> {
  try {
    const newEmployee: Employee = {
      ...employee,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    console.log("[Firebase] Adding new employee:", newEmployee.email)
    await saveEmployee(newEmployee)
    return newEmployee
  } catch (error) {
    console.error("[Firebase] Error adding employee:", error)
    throw error
  }
}

export async function authenticateEmployee(email: string, password: string): Promise<Employee | null> {
  try {
    const employees = await getEmployees()
    const employee = employees.find((emp) => emp.email === email && emp.password === password && emp.isActive)
    if (employee) {
      await updateEmployee(employee.id, { lastLogin: new Date().toISOString() })
      return employee
    }
    return null
  } catch (error) {
    console.error("[Firebase] Error authenticating employee:", error)
    return null
  }
}

export async function hasUsers(): Promise<boolean> {
  try {
    console.log("[Firebase] Checking if users exist...")
    const employees = await getEmployees()
    const hasFirebaseUsers = employees.length > 0
    console.log("[Firebase] Users found:", hasFirebaseUsers)
    return hasFirebaseUsers
  } catch (error) {
    console.error("[Firebase] Error checking users:", error)
    return false
  }
}

export async function createFirstAdmin(
  fullName: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[Firebase] Creating first admin...")
    const newEmployee: Employee = {
      id: generateId(),
      fullName,
      email,
      phone: "",
      position: "System Administrator",
      department: "Administration",
      role: "admin",
      password: password,
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
    await saveEmployee(newEmployee)
    console.log("[Firebase] First admin created successfully")
    return { success: true }
  } catch (error: any) {
    console.error("[Firebase] Error creating first admin:", error)
    return { success: false, error: error.message || "Failed to create admin user" }
  }
}

// ============================================
// DYNAMIC PAGES (web_dynamic_pages)
// ============================================

// Helper function to recursively clean data for Firestore
// - Removes undefined values
// - Converts nested arrays to objects with numeric keys (Firestore doesn't support nested arrays)
function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  if (Array.isArray(obj)) {
    // Check if this array contains other arrays (nested array)
    const hasNestedArray = obj.some(item => Array.isArray(item))
    if (hasNestedArray) {
      // Convert array of arrays to object with __isNestedArray marker
      const converted: Record<string, any> = { __isNestedArray: true }
      obj.forEach((item, index) => {
        converted[index.toString()] = cleanForFirestore(item)
      })
      return converted as T
    }
    // Regular array - just clean each item
    return obj.map(item => cleanForFirestore(item)) as T
  }
  if (typeof obj === "object") {
    const cleaned: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value)
      }
    }
    return cleaned as T
  }
  return obj
}

// Helper function to restore nested arrays from Firestore format
function restoreFromFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(item => restoreFromFirestore(item)) as T
  }
  if (typeof obj === "object") {
    const record = obj as Record<string, any>
    // Check if this is a converted nested array
    if (record.__isNestedArray === true) {
      const restored: any[] = []
      for (const [key, value] of Object.entries(record)) {
        if (key !== "__isNestedArray") {
          const index = parseInt(key, 10)
          if (!isNaN(index)) {
            restored[index] = restoreFromFirestore(value)
          }
        }
      }
      return restored as T
    }
    // Regular object - restore each property
    const cleaned: Record<string, any> = {}
    for (const [key, value] of Object.entries(record)) {
      cleaned[key] = restoreFromFirestore(value)
    }
    return cleaned as T
  }
  return obj
}

export async function getDynamicPage(id: string): Promise<DynamicPage | null> {
  try {
    console.log("[Firebase] Fetching dynamic page:", id)
    const page = await getDocFromFirestore<DynamicPage | null>(FIREBASE_COLLECTIONS.DYNAMIC_PAGES, id, null)
    // Restore nested arrays that were converted for Firestore storage
    return page ? restoreFromFirestore(page) : null
  } catch (error) {
    console.error("[Firebase] Error getting dynamic page:", error)
    return null
  }
}

export async function getDynamicPages(): Promise<DynamicPage[]> {
  try {
    console.log("[Firebase] Fetching dynamic pages...")
    const pages = await getFromFirestore<DynamicPage[]>(FIREBASE_COLLECTIONS.DYNAMIC_PAGES, [])
    console.log("[Firebase] Fetched", pages.length, "pages")
    // Restore nested arrays that were converted for Firestore storage
    return pages.map(page => restoreFromFirestore(page))
  } catch (error) {
    console.error("[Firebase] Error getting dynamic pages:", error)
    return []
  }
}

export async function saveDynamicPage(page: Omit<DynamicPage, "id" | "createdAt" | "updatedAt">): Promise<DynamicPage> {
  try {
    const db = getDb()
    const newPage: DynamicPage = {
      ...page,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    // Clean data for Firestore (remove undefined, handle nested arrays)
    const cleanedPage = cleanForFirestore(newPage)
    console.log("[Firebase] Saving dynamic page...")
    await setDoc(doc(db, FIREBASE_COLLECTIONS.DYNAMIC_PAGES, newPage.id), cleanedPage)
    console.log("[Firebase] Dynamic page saved:", newPage.id)
    // Return the original page structure (not the cleaned version with markers)
    return newPage
  } catch (error) {
    console.error("[Firebase] Error saving dynamic page:", error)
    throw error
  }
}

export async function updateDynamicPage(id: string, updates: Partial<DynamicPage>): Promise<void> {
  try {
    console.log("[Firebase] Updating dynamic page:", id)
    // Clean data for Firestore (remove undefined, handle nested arrays)
    const cleanedUpdates = cleanForFirestore({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    await saveToFirestore(FIREBASE_COLLECTIONS.DYNAMIC_PAGES, id, cleanedUpdates)
    console.log("[Firebase] Dynamic page updated:", id)
  } catch (error) {
    console.error("[Firebase] Error updating dynamic page:", error)
    throw error
  }
}

export async function deleteDynamicPage(id: string): Promise<void> {
  try {
    console.log("[Firebase] Deleting dynamic page:", id)
    await deleteFromFirestore(FIREBASE_COLLECTIONS.DYNAMIC_PAGES, id)
    console.log("[Firebase] Dynamic page deleted:", id)
  } catch (error) {
    console.error("[Firebase] Error deleting dynamic page:", error)
    throw error
  }
}

export async function createPage(pageData: {
  title: string
  slug: string
  language: "ar" | "en"
  status: "draft" | "published"
  blocks: PageBlock[]
}): Promise<DynamicPage> {
  console.log("[Firebase] Creating new page from template...")
  const newPage: Omit<DynamicPage, "id" | "createdAt" | "updatedAt"> = {
    slug: pageData.slug,
    titleAr: pageData.language === "ar" ? pageData.title : "",
    titleEn: pageData.language === "en" ? pageData.title : "",
    descriptionAr: "",
    descriptionEn: "",
    contentAr: "",
    contentEn: "",
    blocks: pageData.blocks,
    isPublished: pageData.status === "published",
    isHome: false,
  }
  return await saveDynamicPage(newPage)
}

export async function getDynamicPageBySlug(slug: string): Promise<DynamicPage | null> {
  try {
    console.log("[Firebase] Fetching page by slug:", slug)
    const pages = await getDynamicPages()
    const page = pages.find((p) => p.slug === slug)
    if (page) {
      console.log("[Firebase] Found page:", page.titleAr)
    } else {
      console.log("[Firebase] No page found with slug:", slug)
    }
    return page || null
  } catch (error) {
    console.error("[Firebase] Error getting page by slug:", error)
    return null
  }
}

export async function getLocalizedPageBySlug(slug: string, lang: "ar" | "en"): Promise<LocalizedPage | null> {
  const page = await getDynamicPageBySlug(slug)
  if (!page) return null

  const isAr = lang === "ar"
  let blocks = isAr ? page.blocksAr : page.blocksEn
  if (!blocks || blocks.length === 0) {
    blocks = isAr ? page.blocksEn : page.blocksAr
  }
  if (!blocks || blocks.length === 0) {
    blocks = page.blocks
  }

  return {
    id: page.id,
    slug: page.slug,
    title: isAr ? (page.titleAr || page.titleEn) : (page.titleEn || page.titleAr),
    description: isAr ? (page.descriptionAr || page.descriptionEn) : (page.descriptionEn || page.descriptionAr),
    content: isAr ? (page.contentAr || page.contentEn) : (page.contentEn || page.contentAr),
    blocks: blocks || [],
    image: page.image,
    seoDescription: isAr ? page.seoDescriptionAr : page.seoDescriptionEn,
    keywords: isAr ? page.keywordsAr : page.keywordsEn,
    featuredImage: page.featuredImage,
    isPublished: page.isPublished,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    lang: lang,
    dir: isAr ? "rtl" : "ltr"
  }
}

export async function getHomePage(lang: "ar" | "en"): Promise<LocalizedPage | null> {
  const pages = await getDynamicPages()
  const homePage = pages.find(p => p.isHome === true && p.isPublished)
  if (!homePage) {
    console.log("[Firebase] No published home page found")
    return null
  }
  return getLocalizedPageBySlug(homePage.slug, lang)
}

export function isPageHomepage(slug: string): boolean {
  // This is a sync function, we'll need to use localStorage cache
  if (typeof window !== "undefined") {
    const cachedPages = localStorage.getItem("cachedPages")
    if (cachedPages) {
      const pages = JSON.parse(cachedPages) as DynamicPage[]
      const page = pages.find(p => p.slug === slug)
      return page?.isHome === true
    }
  }
  return false
}

// ============================================
// ACTIVITIES (web_activities)
// ============================================

export async function getActivities(limit = 50): Promise<Activity[]> {
  try {
    console.log("[Firebase] Fetching activities...")
    const activities = await getFromFirestore<Activity[]>(FIREBASE_COLLECTIONS.ACTIVITIES, [])
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error("[Firebase] Error getting activities:", error)
    return []
  }
}

export async function logActivity(activity: Omit<Activity, "id" | "timestamp">): Promise<void> {
  try {
    console.log("[Firebase] Logging activity:", activity.action)
    const db = getDb()
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      timestamp: new Date().toISOString(),
    }
    await setDoc(doc(db, FIREBASE_COLLECTIONS.ACTIVITIES, newActivity.id), newActivity)
  } catch (error) {
    console.error("[Firebase] Error logging activity:", error)
  }
}

// ============================================
// NOTIFICATIONS (web_notifications)
// ============================================

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const notifications = await getFromFirestore<Notification[]>(FIREBASE_COLLECTIONS.NOTIFICATIONS, [])
    return notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("[Firebase] Error getting notifications:", error)
    return []
  }
}

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  try {
    const notifications = await getNotifications(userId)
    return notifications.filter((n) => !n.read)
  } catch (error) {
    console.error("[Firebase] Error getting unread notifications:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await saveToFirestore(FIREBASE_COLLECTIONS.NOTIFICATIONS, notificationId, { read: true })
  } catch (error) {
    console.error("[Firebase] Error marking notification as read:", error)
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notifications = await getNotifications(userId)
    const db = getDb()
    for (const notification of notifications) {
      if (!notification.read) {
        await setDoc(doc(db, FIREBASE_COLLECTIONS.NOTIFICATIONS, notification.id), { ...notification, read: true })
      }
    }
  } catch (error) {
    console.error("[Firebase] Error marking all notifications as read:", error)
  }
}

// ============================================
// FORMS (web_forms)
// ============================================

export async function getForms(): Promise<Form[]> {
  try {
    return await getFromFirestore<Form[]>("web_forms", [])
  } catch (error) {
    console.error("[Firebase] Error getting forms:", error)
    return []
  }
}

export async function saveForm(form: Omit<Form, "id" | "createdAt" | "updatedAt">): Promise<Form> {
  try {
    const db = getDb()
    const newForm: Form = {
      ...form,
      id: `form-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await setDoc(doc(db, "web_forms", newForm.id), newForm)
    return newForm
  } catch (error) {
    console.error("[Firebase] Error saving form:", error)
    throw error
  }
}

export async function updateForm(id: string, updates: Partial<Omit<Form, "id" | "createdAt">>): Promise<void> {
  try {
    await saveToFirestore("web_forms", id, { ...updates, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error("[Firebase] Error updating form:", error)
    throw error
  }
}

export async function deleteForm(id: string): Promise<void> {
  try {
    await deleteFromFirestore("web_forms", id)
    // Also delete all submissions for this form
    const submissions = await getFormSubmissions(id)
    for (const submission of submissions) {
      await deleteFormSubmission(submission.id)
    }
  } catch (error) {
    console.error("[Firebase] Error deleting form:", error)
    throw error
  }
}

// ============================================
// FORM SUBMISSIONS (web_form_submissions)
// ============================================

export async function getFormSubmissions(formId?: string): Promise<FormSubmission[]> {
  try {
    const submissions = await getFromFirestore<FormSubmission[]>("web_form_submissions", [])
    if (formId) {
      return submissions.filter((s) => s.formId === formId)
    }
    return submissions
  } catch (error) {
    console.error("[Firebase] Error getting form submissions:", error)
    return []
  }
}

export async function saveFormSubmission(submission: Omit<FormSubmission, "id" | "submittedAt" | "status">): Promise<FormSubmission> {
  try {
    const db = getDb()
    const newSubmission: FormSubmission = {
      ...submission,
      id: `submission-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "new",
    }
    await setDoc(doc(db, "web_form_submissions", newSubmission.id), newSubmission)
    return newSubmission
  } catch (error) {
    console.error("[Firebase] Error saving form submission:", error)
    throw error
  }
}

export async function updateFormSubmission(id: string, updates: Partial<Omit<FormSubmission, "id" | "submittedAt">>): Promise<void> {
  try {
    await saveToFirestore("web_form_submissions", id, updates)
  } catch (error) {
    console.error("[Firebase] Error updating form submission:", error)
    throw error
  }
}

export async function deleteFormSubmission(id: string): Promise<void> {
  try {
    await deleteFromFirestore("web_form_submissions", id)
  } catch (error) {
    console.error("[Firebase] Error deleting form submission:", error)
    throw error
  }
}

// ============================================
// MAINTENANCE SETTINGS
// ============================================

const DEFAULT_MAINTENANCE_SETTINGS: MaintenanceSettings = {
  enabled: false,
  titleAr: "الموقع تحت الصيانة",
  titleEn: "Site Under Maintenance",
  messageAr: "نقوم حالياً بإجراء بعض التحسينات. سنعود قريباً!",
  messageEn: "We are currently making some improvements. We'll be back soon!",
  showCountdown: false,
  countdownDate: undefined,
  showContactInfo: true,
  contactEmail: "",
  contactPhone: "",
  showSocialLinks: true,
  backgroundImage: "",
  logoImage: "/logo.webp",
  primaryColor: "#3b82f6",
  secondaryColor: "#8b5cf6",
}

export function getMaintenanceSettings(): MaintenanceSettings {
  return getFromLocalStorage<MaintenanceSettings>("maintenanceSettings", DEFAULT_MAINTENANCE_SETTINGS)
}

export function saveMaintenanceSettings(settings: MaintenanceSettings): void {
  saveToLocalStorage("maintenanceSettings", settings)
  dispatchStorageChange("maintenanceSettings", settings)
}

export function isMaintenanceMode(): boolean {
  const settings = getMaintenanceSettings()
  return settings.enabled
}

// ============================================
// MOCK DATA (deprecated)
// ============================================

export async function loadMockupData(): Promise<void> {
  console.log("[Firebase] loadMockupData is deprecated in Firebase mode")
}
