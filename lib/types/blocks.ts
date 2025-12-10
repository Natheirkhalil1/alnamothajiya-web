export type RealBlockType =
  | "hero-slider"
  | "about"
  | "departments"
  | "gallery-section"
  | "testimonials-section"
  | "jobs"
  | "contact-section"
  | "feature-card"
  | "stat-item"
  | "department-card"
  | "gallery-item"

export interface HeroSlide {
  id: string
  titleAr: string
  titleEn: string
  subtitleAr: string
  subtitleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  order: number
}

export interface HeroSliderBlock {
  type: "hero-slider"
  slides: HeroSlide[]
  autoplay: boolean
  interval: number
  showDots: boolean
  showArrows: boolean
  height: string
  overlayOpacity: number
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface AboutBlock {
  type: "about"
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  features: Array<{
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
    icon: string
  }>
  stats: Array<{
    number: string
    labelAr: string
    labelEn: string
  }>
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface DepartmentsBlock {
  type: "departments"
  departments: Array<{
    id: string
    type: string
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
    image: string
    slug: string
  }>
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface GalleryBlock {
  type: "gallery-section"
  images: Array<{
    id: string
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
    image: string
    category: string
  }>
  categories: string[]
  showFilters: boolean
  itemsPerPage: number
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface TestimonialsBlock {
  type: "testimonials-section"
  testimonials: Array<{
    id: string
    name: string
    image: string
    rating: number
    comment: string
  }>
  allowSubmissions: boolean
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface JobsBlock {
  type: "jobs"
  services: Array<{
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
    icon: string
    link: string
    gradient: string
  }>
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface ContactBlock {
  type: "contact-section"
  phone: string
  phone2?: string
  email: string
  locationAr: string
  locationEn: string
  mapUrl: string
  workingHoursAr: string
  workingHoursEn: string
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export type RealBlock =
  | HeroSliderBlock
  | AboutBlock
  | DepartmentsBlock
  | GalleryBlock
  | TestimonialsBlock
  | JobsBlock
  | ContactBlock

export interface PageBlockNew {
  id: string
  type: RealBlockType
  order: number
  content: Partial<RealBlock>
  styles: {
    backgroundColor?: string
    padding?: string
    margin?: string
    [key: string]: any
  }
  blockStyles?: BlockStyles
  blockAnimations?: BlockAnimations
}

export interface BlockStyles {
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
  padding?: string
  margin?: string
  borderWidth?: string
  borderColor?: string
  shadow?: string
  maxWidth?: string
  paddingTop?: string
  paddingBottom?: string
  marginTop?: string
  marginBottom?: string
  className?: string
  customId?: string
  width?: string
  height?: string
  minHeight?: string
  textAlign?: "left" | "center" | "right"
  fontSize?: string
  fontWeight?: string
  backgroundImage?: string
  // Hover effects
  hoverBackgroundColor?: string
  hoverTextColor?: string
  hoverBorderColor?: string
  hoverShadow?: string
  hoverScale?: string
  hoverTransform?: string
  hoverTransition?: string
}


export interface ElementAnimation {
  selector: string // CSS selector for element (e.g., "h2", ".card", ".button")
  animation: string // Animation type (fade-in, slide-up, etc.)
  delay?: number // Animation delay in ms
  duration?: number // Animation duration in ms
  stagger?: number // Stagger delay between multiple elements in ms
}

export interface BlockAnimations {
  // Block-level animations (applied to entire block)
  type?: string // Animation type (fade-in, fade-up, etc.)
  duration?: number // Animation duration in seconds
  delay?: number // Animation delay in seconds
  entranceAnimation?: string
  entranceDuration?: string
  entranceDelay?: string
  hoverAnimation?: string
  scrollAnimation?: boolean
  scrollOffset?: string

  // Element-level animations (applied to specific elements within block)
  elementAnimations?: ElementAnimation[]
}
