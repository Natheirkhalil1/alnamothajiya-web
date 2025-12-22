import type { BlockStyles, BlockAnimations } from "@/lib/types/blocks"

export type BlockKind =
    | "hero-basic"
    | "hero-split"
    | "section-header"
    | "rich-text"
    | "image-with-text"
    | "highlight-banner"
    | "programs-grid"
    | "services-list"
    | "curriculum-overview"
    | "stats"
    | "icon-points"
    | "testimonials"
    | "logos-strip"
    | "gallery-grid"
    | "video-highlight"
    | "staff-grid"
    | "board-or-team-list"
    | "steps-horizontal"
    | "timeline-vertical"
    | "faq-accordion"
    | "downloads-list"
    | "contact-section"
    | "map"
    | "cta-strip"
    | "columns"
    | "grid"
    // Added types from updates
    // | "testimonials-slider" - MERGED INTO TESTIMONIALS
    | "gallery-masonry"
    // | "map-embed" - MERGED INTO MAP
    | "pricing-table"
    | "download-list"
    // | "social-feed" // Kept social-feed to avoid breaking existing code, will remove in final implementation - REMOVED
    | "newsletter-signup"
    | "video-embed"
    | "divider"
    | "spacer"
    | "custom-html"
    | "hero-slider"
    | "social-icons"
    | "departments-grid"
    | "about-section"
    // New blocks for public page sections
    | "jobs-listing"
    | "department-welcome"
    | "department-subsections"
    | "department-cta"
    | "image-albums"
    // Form Blocks
    | "form-container"
    | "form-input"
    | "form-textarea"
    | "form-select"
    | "form-checkbox"
    | "form-radio"
    | "form-button"
    | "dynamic-form"
    | "job-application-form"
    | "info-card"
    // Firebase Data Blocks
    | "firebase-news"
    | "firebase-achievements"
    | "firebase-gallery"
    | "firebase-hero-slider"

export interface BaseBlock {
    id: string
    kind: BlockKind
    blockStyles?: BlockStyles
    blockAnimations?: BlockAnimations
    // Standard Styling Props
    backgroundColor?: string
    padding?: "none" | "sm" | "md" | "lg" | "xl"
    containerWidth?: "default" | "narrow" | "full"
}

export interface SectionHeader {
    eyebrowAr?: string
    eyebrowEn?: string
    titleAr?: string
    titleEn?: string
    descriptionAr?: string
    descriptionEn?: string
    imageUrl?: string
    imageAlt?: string
    align?: "left" | "center" | "right"
    // Deprecated fields for backward compatibility
    eyebrow?: string
    title?: string
    description?: string
}

export interface HeroSliderBlock extends BaseBlock {
    kind: "hero-slider"
    slides: {
        id: string
        title: string
        titleEn?: string
        subtitle: string
        subtitleEn?: string
        description: string
        descriptionEn?: string
        imageUrl: string
        badgeText?: string
        badgeTextEn?: string
        primaryCtaLabel?: string
        primaryCtaLabelEn?: string
        primaryCtaHref?: string
        secondaryCtaLabel?: string
        secondaryCtaLabelEn?: string
        secondaryCtaHref?: string
    }[]
    autoplay?: boolean
    interval?: number
    showDots?: boolean
    showArrows?: boolean
}

export interface HeroSplitBlock extends BaseBlock {
    kind: "hero-split"
    eyebrow?: string
    title: string
    subtitle?: string
    primaryCtaLabel?: string
    primaryCtaHref?: string
    secondaryCtaLabel?: string
    secondaryCtaHref?: string
    imageUrl?: string
    imageAlt?: string
    imageSide?: "left" | "right"
}

export interface SectionHeaderBlock extends BaseBlock, SectionHeader {
    kind: "section-header"
}

export interface RichTextBlock extends BaseBlock {
    kind: "rich-text"
    header?: SectionHeader
    bodyAr: string
    bodyEn: string
    // Backward compatibility
    body?: string
}

export interface ImageWithTextBlock extends BaseBlock {
    kind: "image-with-text"
    header?: SectionHeader
    textAr: string
    textEn: string
    imageUrl: string
    imageAlt?: string
    imageSide?: "left" | "right"
    // Backward compatibility
    text?: string
}

export interface HighlightBannerBlock extends BaseBlock {
    kind: "highlight-banner"
    title: string
    text?: string
    variant?: "primary" | "muted"
    ctaLabel?: string
    ctaHref?: string
}

export interface ProgramsGridBlock extends BaseBlock {
    kind: "programs-grid"
    header?: SectionHeader
    columns: 2 | 3 | 4
    items: {
        id: string
        icon?: string | null
        title: string
        description: string
        ageRange?: string
        href?: string
    }[]
}

export interface ServicesListBlock extends BaseBlock {
    kind: "services-list"
    header?: SectionHeader
    layout?: "list" | "grid"
    items: {
        id: string
        icon?: string | null
        title: string
        description: string
    }[]
}

export interface CurriculumOverviewBlock extends BaseBlock {
    kind: "curriculum-overview"
    header?: SectionHeader
    areas: {
        id: string
        title: string
        description?: string
        bulletPoints?: string[]
    }[]
}

export interface StatsBlock extends BaseBlock {
    kind: "stats"
    header?: SectionHeader
    items: {
        id: string
        label: string
        value: string
        suffix?: string
    }[]
}

export interface IconPointsBlock extends BaseBlock {
    kind: "icon-points"
    header?: SectionHeader
    items: {
        id: string
        icon?: string | null
        title: string
        description: string
    }[]
}

export interface TestimonialsBlock extends BaseBlock {
    kind: "testimonials"
    header?: SectionHeader
    columns?: 2 | 3
    layout?: "grid" | "slider"
    autoplay?: boolean
    interval?: number
    enablePublicSubmission?: boolean
    enableFirebaseReviews?: boolean
    useTestimonialsFromDashboard?: boolean
    items: {
        id: string
        quote: string
        quoteEn?: string
        author: string
        authorEn?: string
        role?: string
        roleEn?: string
        avatarUrl?: string
        rating?: number
    }[]
}

export interface LogosStripBlock extends BaseBlock {
    kind: "logos-strip"
    header?: SectionHeader
    title?: string // Added title for LogosStripBlock
    items: {
        id: string
        logoUrl: string
        alt?: string
        href?: string
    }[]
}

export interface GalleryGridBlock extends BaseBlock {
    kind: "gallery-grid"
    header?: SectionHeader
    columns: 2 | 3 | 4
    items: {
        id: string
        imageUrl: string
        alt?: string
        caption?: string
    }[]
}

export interface VideoHighlightBlock extends BaseBlock {
    kind: "video-highlight"
    header?: SectionHeader
    embedUrl?: string
    videoUrl?: string
    thumbnailUrl?: string
    caption?: string
}

export interface VideoEmbedBlock extends BaseBlock {
    kind: "video-embed"
    url?: string
    title?: string
    embedUrl?: string
    caption?: string
}

export interface StaffGridBlock extends BaseBlock {
    kind: "staff-grid"
    header?: SectionHeader
    columns: 2 | 3 | 4
    items: {
        id: string
        name: string
        nameEn?: string
        role: string
        roleEn?: string
        photoUrl?: string
        bioShort?: string
        bioShortEn?: string
        email?: string
        phone?: string
    }[]
}

export interface BoardOrTeamListBlock extends BaseBlock {
    kind: "board-or-team-list"
    header?: SectionHeader
    items: {
        id: string
        name: string
        role: string
        description?: string
        imageUrl?: string
    }[]
}

export interface StepsHorizontalBlock extends BaseBlock {
    kind: "steps-horizontal"
    header?: SectionHeader
    items: {
        id: string
        stepNumber: number
        title: string
        description?: string
    }[]
}

export interface TimelineVerticalBlock extends BaseBlock {
    kind: "timeline-vertical"
    header?: SectionHeader
    items: {
        id: string
        label: string
        date?: string
        icon?: string | null
        title?: string
        description?: string
    }[]
}

export interface FaqAccordionBlock extends BaseBlock {
    kind: "faq-accordion"
    header?: SectionHeader
    items: {
        id: string
        question: string
        questionEn?: string
        answer: string
        answerEn?: string
    }[]
}

export interface DownloadsListBlock extends BaseBlock {
    kind: "downloads-list"
    header?: SectionHeader
    items: {
        id: string
        title: string
        description?: string
        fileUrl: string
        fileType?: string
        fileSize?: string
    }[]
}

export interface ContactSectionBlock extends BaseBlock {
    kind: "contact-section"
    header?: SectionHeader
    info: {
        address?: string
        addressEn?: string
        phone?: string
        email?: string
        whatsapp?: string
        workingHours?: string
        workingHoursEn?: string
    }
    showForm?: boolean
}

export interface MapBlock extends BaseBlock {
    kind: "map"
    title?: string
    embedUrl: string
    height?: string
}

export interface CtaStripBlock extends BaseBlock {
    kind: "cta-strip"
    title: string
    titleEn?: string
    text?: string
    textEn?: string
    primaryCtaLabel: string
    primaryCtaLabelEn?: string
    primaryCtaHref: string
    secondaryCtaLabel?: string
    secondaryCtaLabelEn?: string
    secondaryCtaHref?: string
    variant?: "default" | "gradient" | "outlined"
    backgroundColor?: string
    alignment?: "left" | "center" | "right"
    size?: "sm" | "md" | "lg"
}

export interface ColumnsBlock extends BaseBlock {
    kind: "columns"
    columns: 2 | 3 | 4
    gap?: "sm" | "md" | "lg"
    columnSlots: Block[][] // Array of arrays - each inner array holds blocks for that column
    blocks?: Block[] // Deprecated - kept for backward compatibility
}

export interface GridBlock extends BaseBlock {
    kind: "grid"
    columns: 2 | 3 | 4
    gap?: "sm" | "md" | "lg"
    columnSlots: Block[][] // Array of arrays - each inner array holds blocks for that column
    blocks?: Block[] // Deprecated - kept for backward compatibility
}

// Added block interfaces from updates
// TestimonialsSliderBlock merged into TestimonialsBlock

export interface GalleryMasonryBlock extends BaseBlock {
    kind: "gallery-masonry"
    header?: SectionHeader
    showFilters?: boolean
    captionPosition?: "over" | "under"
    showLightbox?: boolean
    items: {
        id: string
        imageUrl: string
        alt?: string
        caption?: string
        category?: string
    }[]
}

// MapEmbedBlock removed - merged into MapBlock

export interface PricingTableBlock extends BaseBlock {
    kind: "pricing-table"
    header?: SectionHeader
    title: string
    description?: string
    columns?: 2 | 3
    items: {
        id: string
        title: string
        price: string
        features: string[]
        ctaLabel?: string
        ctaHref?: string
        isFeatured?: boolean
    }[]
}

export interface NewsletterSignupBlock extends BaseBlock {
    kind: "newsletter-signup"
    header?: SectionHeader
    placeholder?: string
    buttonText?: string
    successMessage?: string
    errorMessage?: string
    backgroundColor?: string
    layout?: "inline" | "stacked"
    variant?: "default" | "minimal" | "card"
}

export interface DividerBlock extends BaseBlock {
    kind: "divider"
    style?: "solid" | "dashed" | "dotted"
    color?: string
    thickness?: number // in pixels
}

export interface SpacerBlock extends BaseBlock {
    kind: "spacer"
    height?: number // in pixels
}

export interface CustomHtmlBlock extends BaseBlock {
    kind: "custom-html"
    html: string
}

export interface HeroBasicBlock extends BaseBlock {
    kind: "hero-basic"
    eyebrowAr?: string
    eyebrowEn?: string
    titleAr: string
    titleEn: string
    subtitleAr?: string
    subtitleEn?: string
    descriptionAr?: string
    descriptionEn?: string
    primaryCtaLabelAr?: string
    primaryCtaLabelEn?: string
    primaryCtaHref?: string
    secondaryCtaLabelAr?: string
    secondaryCtaLabelEn?: string
    secondaryCtaHref?: string
    imageUrl?: string
    imageAlt?: string
    align?: "left" | "center"
    // Deprecated fields kept for backward compatibility (optional)
    title?: string
    subtitle?: string
    description?: string
    eyebrow?: string
    primaryCtaLabel?: string
    secondaryCtaLabel?: string
}

export type Block =
    | HeroBasicBlock
    | HeroSliderBlock
    | HeroSplitBlock
    | SectionHeaderBlock
    | RichTextBlock
    | ImageWithTextBlock
    | HighlightBannerBlock
    | ProgramsGridBlock
    | ServicesListBlock
    | CurriculumOverviewBlock
    | StatsBlock
    | IconPointsBlock
    | TestimonialsBlock
    | LogosStripBlock
    | GalleryGridBlock
    | VideoHighlightBlock
    | VideoEmbedBlock
    | StaffGridBlock
    | BoardOrTeamListBlock
    | StepsHorizontalBlock
    | TimelineVerticalBlock
    | FaqAccordionBlock
    | DownloadsListBlock
    | ContactSectionBlock
    | MapBlock
    | CtaStripBlock
    | ColumnsBlock
    | GridBlock
    // Added block types from updates
    | GalleryMasonryBlock
    | PricingTableBlock
    | NewsletterSignupBlock
    | DividerBlock
    | SpacerBlock
    | CustomHtmlBlock
    | HeroSliderBlock
    | SocialIconsBlock
    // New blocks for public page sections
    | AboutSectionBlock
    | DepartmentsGridBlock
    | JobsListingBlock
    | DepartmentWelcomeBlock
    | DepartmentSubsectionsBlock
    | DepartmentCTABlock
    | JobsListingBlock
    | ImageAlbumsBlock
    // Form Blocks
    | FormContainerBlock
    | FormInputBlock
    | FormTextareaBlock
    | FormSelectBlock
    | FormCheckboxBlock
    | FormRadioBlock
    | FormButtonBlock
    | DynamicFormBlock
    | JobApplicationFormBlock
    | InfoCardBlock
    // Firebase Data Blocks
    | FirebaseNewsBlock
    | FirebaseAchievementsBlock
    | FirebaseGalleryBlock
    | FirebaseHeroSliderBlock

// Info Card Block - Feature card with gradient banner, icon, title, description, and button
export interface InfoCardBlock extends BaseBlock {
    kind: "info-card"
    icon?: string // Icon name or URL
    titleAr: string
    titleEn: string
    descriptionAr: string
    descriptionEn: string
    buttonTextAr?: string
    buttonTextEn?: string
    buttonLink?: string
    themeColor: "pink" | "blue" | "teal" | "purple" | "orange" | "green" | "red" | "cyan"
    showButton?: boolean
}

// About Section Block
export interface AboutSectionBlock extends BaseBlock {
    kind: "about-section"
    titleEn: string
    titleAr: string
    descriptionEn: string
    descriptionAr: string
    image: string
    featureCards: {
        id: string
        icon: string | null
        titleEn: string
        titleAr: string
        descriptionEn: string
        descriptionAr: string
    }[]
    stats: {
        id: string
        number: string
        labelEn: string
        labelAr: string
    }[]
    showBadge?: boolean
    badgeText?: string
}

// Departments Grid Block
export interface DepartmentsGridBlock extends BaseBlock {
    kind: "departments-grid"
    header?: SectionHeader
    items: {
        id: string
        type: "medical" | "heart" | "housing" | "activities"
        titleEn: string
        titleAr: string
        descriptionEn: string
        descriptionAr: string
        image: string
        href?: string
        colorTheme?: "red" | "blue" | "green" | "purple" | "orange" | "pink" | "teal" | "cyan"
        badgeText?: string
        icon?: string
    }[]
    showCTA?: boolean
    ctaTitle?: string
    ctaText?: string
    ctaButtonLabel?: string
    ctaButtonHref?: string
    badgeText?: string
}

// Jobs Listing Block
export interface JobsListingBlock extends BaseBlock {
    kind: "jobs-listing"
    header?: SectionHeader
    emptyStateMessage?: string
    emptyStateMessageEn?: string
    useJobsFromDashboard?: boolean
    items: {
        id: string
        title: string
        titleEn?: string
        type: string
        typeEn?: string
        description?: string
        descriptionEn?: string
        workShift?: string
        workShiftEn?: string
        workDuration?: string
        workDurationEn?: string
        gender?: string
        genderEn?: string
        applyLink?: string
    }[]
}

// Job Application Form Block
export interface JobApplicationFormBlock extends BaseBlock {
    kind: "job-application-form"
    jobId?: string
    header?: {
        title?: string
        titleEn?: string
        description?: string
        descriptionEn?: string
    }
    submitButtonText?: string
    submitButtonTextEn?: string
    successMessage?: string
    successMessageEn?: string
    showAllJobs?: boolean
}

// Social Icons Block
export type SocialPlatform =
    | "facebook" | "twitter" | "instagram" | "linkedin"
    | "youtube" | "tiktok" | "pinterest" | "snapchat"
    | "whatsapp" | "telegram" | "discord" | "slack"
    | "github" | "gitlab" | "stackoverflow"
    | "email" | "phone" | "website" | "custom"

export interface SocialIcon {
    id: string
    platform: SocialPlatform
    url: string
    customIcon?: string
    customLabel?: string
}

export interface SocialIconsBlock extends BaseBlock {
    kind: "social-icons"
    header?: SectionHeader
    items: SocialIcon[]
    layout: "horizontal" | "vertical" | "grid" | "circular"
    columns?: 2 | 3 | 4
    iconSize: "small" | "medium" | "large" | "xlarge"
    iconStyle: "square" | "rounded" | "circle"
    iconFill: "solid" | "outline" | "ghost"
    gap: "tight" | "normal" | "loose"
    alignment: "left" | "center" | "right"
    hoverEffect: "none" | "scale" | "lift" | "rotate" | "glow"
    useCustomColors: boolean
    customColor?: string
    customHoverColor?: string
}

export interface DepartmentWelcomeBlock extends BaseBlock {
    kind: "department-welcome"
    icon?: string
    title: string
    description: string
    imageUrl?: string
    stats: {
        id: string
        value: string
        label: string
        onClick?: string
    }[]
}

export interface DepartmentSubsectionsBlock extends BaseBlock {
    kind: "department-subsections"
    header?: SectionHeader
    departmentColor?: string
    items: {
        id: string
        icon?: string
        titleAr: string
        titleEn: string
        descriptionAr: string
        descriptionEn: string
        detailedDescriptionAr?: string
        detailedDescriptionEn?: string
        image?: string
    }[]
}

export interface DepartmentCTABlock extends BaseBlock {
    kind: "department-cta"
    title: string
    description: string
    primaryButtonLabel: string
    primaryButtonHref: string
    secondaryButtonLabel?: string
    secondaryButtonHref?: string
    contactInfo: {
        phone: string
        email: string
        address: string
    }
}

export interface ImageAlbumsBlock extends BaseBlock {
    kind: "image-albums"
    header?: SectionHeader
    albums: {
        id: string
        title: string
        titleEn?: string
        description?: string
        descriptionEn?: string
        coverImage: string
        images: {
            id: string
            imageUrl: string
            alt?: string
            caption?: string
        }[]
    }[]
}

// Form Blocks Interfaces

export interface FormContainerBlock extends BaseBlock {
    kind: "form-container"
    title?: string
    description?: string
    submitUrl?: string
    method?: "POST" | "GET"
    successMessage?: string
    errorMessage?: string
    submitButtonText?: string
    children: Block[]
}

export interface FormInputBlock extends BaseBlock {
    kind: "form-input"
    label: string
    name: string
    type: "text" | "email" | "password" | "number" | "tel" | "url" | "date"
    placeholder?: string
    required?: boolean
    helperText?: string
    defaultValue?: string
}

export interface FormTextareaBlock extends BaseBlock {
    kind: "form-textarea"
    label: string
    name: string
    placeholder?: string
    required?: boolean
    rows?: number
    helperText?: string
    defaultValue?: string
}

export interface FormSelectBlock extends BaseBlock {
    kind: "form-select"
    label: string
    name: string
    required?: boolean
    helperText?: string
    options: {
        label: string
        value: string
    }[]
    defaultValue?: string
}

export interface FormCheckboxBlock extends BaseBlock {
    kind: "form-checkbox"
    label: string
    name: string
    required?: boolean
    helperText?: string
    options?: {
        label: string
        value: string
    }[] // If multiple options, renders as group. If empty/undefined, renders as single checkbox (boolean)
    checked?: boolean // For single checkbox default
}

export interface FormRadioBlock extends BaseBlock {
    kind: "form-radio"
    label: string
    name: string
    required?: boolean
    helperText?: string
    options: {
        label: string
        value: string
    }[]
    defaultValue?: string
}

export interface FormButtonBlock extends BaseBlock {
    kind: "form-button"
    text: string
    type: "submit" | "reset" | "button"
    variant?: "primary" | "secondary" | "outline" | "ghost"
    fullWidth?: boolean
}

// Dynamic Form Block - Loads form from dashboard forms
export interface DynamicFormBlock extends BaseBlock {
    kind: "dynamic-form"
    formId: string
    submitButtonText?: string
    submitButtonTextEn?: string
    successMessage?: string
    successMessageEn?: string
    // Customization options for hover effects
    hoverBorderColor?: "pink" | "purple" | "blue" | "teal" | "emerald" | "orange"
    hoverShadowColor?: "pink" | "purple" | "blue" | "teal" | "emerald" | "orange"
}

// Firebase News Block - Displays news from /school_info/namothajia/news
export interface FirebaseNewsBlock extends BaseBlock {
    kind: "firebase-news"
    header?: SectionHeader
    columns: 2 | 3 | 4
    maxRows: 1 | 2 | 3
    themeColor: "rose" | "blue" | "emerald" | "purple" | "amber" | "cyan"
    showDate?: boolean
    showImage?: boolean
}

// Firebase Achievements Block - Displays achievements from /school_info/namothajia/achievements
export interface FirebaseAchievementsBlock extends BaseBlock {
    kind: "firebase-achievements"
    header?: SectionHeader
    columns: 2 | 3 | 4
    maxRows: 1 | 2 | 3
    themeColor: "gold" | "emerald" | "blue" | "purple" | "rose" | "orange"
    showDate?: boolean
    showImage?: boolean
}

// Firebase Gallery Block - Displays gallery from /school_info/namothajia/gallery
export interface FirebaseGalleryBlock extends BaseBlock {
    kind: "firebase-gallery"
    header?: SectionHeader
    columns: 2 | 3 | 4
    maxRows: 1 | 2 | 3
    themeColor: "violet" | "teal" | "pink" | "indigo" | "sky" | "lime"
    showCaption?: boolean
    enableLightbox?: boolean
}

// Firebase Hero Slider Block - Displays hero images from /school_info/namothajia/hero_images
export interface FirebaseHeroSliderBlock extends BaseBlock {
    kind: "firebase-hero-slider"
    autoplay?: boolean
    interval?: number
    showDots?: boolean
    showArrows?: boolean
    showTitle?: boolean
    titlePosition?: "top" | "center" | "bottom"
    height?: "screen" | "large" | "medium"
}

export interface PageBlocksValue {
    blocksAr: Block[]
    blocksEn: Block[]
    // Deprecated - for backward compatibility
    blocks?: Block[]
}

export type PageBlocksMode = "view" | "edit"
