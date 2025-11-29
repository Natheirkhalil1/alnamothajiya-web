import * as React from "react"
import { Block, BlockKind, BaseBlock } from "./types"
import { nmTheme } from "./theme"
import { motion } from "framer-motion"

export function createId() {
    return Math.random().toString(36).slice(2)
}

const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

export function SectionContainer({
    children,
    className = "",
    style,
    backgroundColor,
    padding = "md",
    containerWidth = "default",
}: {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    backgroundColor?: string
    padding?: "none" | "sm" | "md" | "lg" | "xl"
    containerWidth?: "default" | "narrow" | "full"
}) {
    const paddingClass = {
        none: "py-0",
        sm: "py-8 md:py-12",
        md: "py-12 md:py-16",
        lg: "py-16 md:py-24",
        xl: "py-24 md:py-32",
    }[padding] || "py-12 md:py-16"

    const widthClass = {
        default: "container mx-auto px-4",
        narrow: "container mx-auto px-4 max-w-4xl",
        full: "w-full px-4",
    }[containerWidth] || "container mx-auto px-4"

    // Handle background color
    const isTailwindClass = backgroundColor?.startsWith("bg-")
    const bgClass = isTailwindClass ? backgroundColor : ""
    const bgStyle = !isTailwindClass && backgroundColor ? { backgroundColor } : {}

    return (
        <section
            className={`relative overflow-hidden ${paddingClass} ${bgClass} ${className}`}
            style={{ ...bgStyle, ...style }}
        >
            <div className={`${widthClass} relative z-10`}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                    transition={nmTheme.transitions.sectionMotion}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    )
}

/**
 * Utility function to apply block styles including custom ID, backgrounds, and hover effects
 * Returns props to spread onto block wrapper elements
 */
export function applyBlockStyles(blockStyles?: any) {
    if (!blockStyles) return {}

    const {
        backgroundColor,
        backgroundImage,
        textColor,
        padding,
        paddingTop,
        paddingBottom,
        margin,
        marginTop,
        marginBottom,
        borderRadius,
        borderWidth,
        borderColor,
        shadow,
        maxWidth,
        width,
        height,
        minHeight,
        className,
        customId,
        fontSize,
        fontWeight,
        textAlign,
        hoverBackgroundColor,
        hoverTextColor,
        hoverBorderColor,
        hoverShadow,
        hoverScale,
        hoverTransition,
    } = blockStyles

    // Build inline styles
    const style: React.CSSProperties = {}

    // Build className from Tailwind classes
    const classes: string[] = []

    // Background - check if it's a Tailwind class or inline value
    if (backgroundColor) {
        if (backgroundColor.startsWith('bg-') || ['white', 'transparent', 'primary', 'secondary', 'accent'].includes(backgroundColor)) {
            classes.push(backgroundColor.startsWith('bg-') ? backgroundColor : `bg-${backgroundColor}`)
        } else {
            style.backgroundColor = backgroundColor
        }
    }

    if (backgroundImage) {
        style.backgroundImage = backgroundImage
        style.backgroundSize = 'cover'
        style.backgroundPosition = 'center'
    }

    // Text Color
    if (textColor) {
        if (textColor.startsWith('text-') || ['slate-900', 'slate-700', 'slate-600', 'slate-400', 'white', 'primary', 'emerald-600', 'blue-600'].includes(textColor)) {
            classes.push(textColor.startsWith('text-') ? textColor : `text-${textColor}`)
        } else {
            style.color = textColor
        }
    }

    if (fontSize) style.fontSize = fontSize
    if (fontWeight) style.fontWeight = fontWeight
    if (textAlign) style.textAlign = textAlign

    // Spacing - apply as inline styles (these are rem values from dropdowns)
    if (padding) style.padding = padding
    if (paddingTop) style.paddingTop = paddingTop
    if (paddingBottom) style.paddingBottom = paddingBottom
    if (margin) style.margin = margin
    if (marginTop) style.marginTop = marginTop
    if (marginBottom) style.marginBottom = marginBottom

    // Borders & Shadows - check if Tailwind classes
    if (borderRadius) {
        if (borderRadius.startsWith('rounded-')) {
            classes.push(borderRadius)
        } else {
            style.borderRadius = borderRadius
        }
    }

    if (borderWidth) {
        if (borderWidth.startsWith('border-') || borderWidth === 'border') {
            classes.push(borderWidth)
        } else {
            style.borderWidth = borderWidth
        }
    }

    if (borderColor) style.borderColor = borderColor

    if (shadow) {
        if (shadow.startsWith('shadow-') || shadow === 'shadow-none') {
            classes.push(shadow)
        } else {
            style.boxShadow = shadow
        }
    }

    // Dimensions
    if (maxWidth) style.maxWidth = maxWidth
    if (width) style.width = width
    if (height) style.height = height
    if (minHeight) style.minHeight = minHeight

    // Transition for hover effects
    if (hoverTransition || hoverScale || hoverBackgroundColor || hoverTextColor) {
        style.transition = hoverTransition || '0.3s ease'
    }

    // Build CSS for hover effects
    let hoverStyles = ''
    if (customId && (hoverBackgroundColor || hoverTextColor || hoverBorderColor || hoverShadow || hoverScale)) {
        const hoverRules: string[] = []
        if (hoverBackgroundColor) hoverRules.push(`background-color: ${hoverBackgroundColor} !important`)
        if (hoverTextColor) hoverRules.push(`color: ${hoverTextColor} !important`)
        if (hoverBorderColor) hoverRules.push(`border-color: ${hoverBorderColor} !important`)
        if (hoverShadow) {
            // Handle Tailwind shadow classes
            if (hoverShadow.startsWith('shadow-')) {
                // Can't easily convert Tailwind shadow to inline, skip or use a default
                hoverRules.push(`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important`)
            } else {
                hoverRules.push(`box-shadow: ${hoverShadow} !important`)
            }
        }
        if (hoverScale) hoverRules.push(`transform: scale(${hoverScale})`)

        if (hoverRules.length > 0) {
            hoverStyles = `#${customId}:hover { ${hoverRules.join('; ')} }`
        }
    }

    // Add custom className
    if (className) classes.push(className)

    return {
        id: customId,
        className: classes.join(' '),
        style,
        hoverStyles, // This can be injected as a <style> tag if needed
    }
}

/* Inputs used in editors */

export function InputField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    step,
    onBlur,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    type?: string
    placeholder?: string
    step?: number
    onBlur?: () => void
}) {
    return (
        <label className="flex flex-col gap-1 text-[11px] text-slate-700">
            <span>{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                step={step}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px]"
            />
        </label>
    )
}

export function TextareaField({
    label,
    value,
    onChange,
    rows = 4,
    placeholder,
    className = "",
    onBlur,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    rows?: number
    placeholder?: string
    className?: string
    onBlur?: () => void
}) {
    return (
        <label className={`flex flex-col gap-1 text-[11px] text-slate-700 ${className}`}>
            <span>{label}</span>
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px]"
            />
        </label>
    )
}

export function SelectField({
    label,
    value,
    onChange,
    options,
    placeholder,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
}) {
    return (
        <label className="flex flex-col gap-1 text-[11px] text-slate-700">
            <span>{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px]"
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </label>
    )
}

export const BLOCK_COLORS = [
    { value: "transparent", label: "شفاف", class: "bg-transparent border border-slate-200" },
    { value: "white", label: "أبيض", class: "bg-white border border-slate-200" },
    { value: "slate-50", label: "رمادي فاتح", class: "bg-slate-50" },
    { value: "emerald-50", label: "زمردي فاتح", class: "bg-emerald-50" },
    { value: "blue-50", label: "أزرق فاتح", class: "bg-blue-50" },
    { value: "amber-50", label: "عسلي فاتح", class: "bg-amber-50" },
    { value: "rose-50", label: "وردي فاتح", class: "bg-rose-50" },
    { value: "purple-50", label: "بنفسجي فاتح", class: "bg-purple-50" },
    { value: "primary", label: "اللون الأساسي", class: "bg-primary" },
    { value: "secondary", label: "اللون الثانوي", class: "bg-secondary" },
    { value: "accent", label: "لون التمييز", class: "bg-accent" },
    { value: "slate-900", label: "داكن", class: "bg-slate-900" },
]

export const TEXT_COLORS = [
    { value: "slate-900", label: "Dark", class: "text-slate-900", bgClass: "bg-slate-900" },
    { value: "slate-700", label: "Medium Dark", class: "text-slate-700", bgClass: "bg-slate-700" },
    { value: "slate-600", label: "Medium", class: "text-slate-600", bgClass: "bg-slate-600" },
    { value: "slate-400", label: "Light", class: "text-slate-400", bgClass: "bg-slate-400" },
    { value: "white", label: "White", class: "text-white", bgClass: "bg-white border border-slate-300" },
    { value: "primary", label: "Primary", class: "text-primary", bgClass: "bg-primary" },
    { value: "emerald-600", label: "Green", class: "text-emerald-600", bgClass: "bg-emerald-600" },
    { value: "blue-600", label: "Blue", class: "text-blue-600", bgClass: "bg-blue-600" },
]

export const SPACING_PRESETS = [
    { value: "none", label: "None", class: "0" },
    { value: "xs", label: "Extra Small", class: "0.5rem" },
    { value: "sm", label: "Small", class: "1rem" },
    { value: "md", label: "Medium", class: "2rem" },
    { value: "lg", label: "Large", class: "3rem" },
    { value: "xl", label: "Extra Large", class: "4rem" },
    { value: "2xl", label: "2X Large", class: "6rem" },
]

export const SHADOW_PRESETS = [
    { value: "none", label: "None", class: "shadow-none" },
    { value: "sm", label: "Small", class: "shadow-sm" },
    { value: "md", label: "Medium", class: "shadow-md" },
    { value: "lg", label: "Large", class: "shadow-lg" },
    { value: "xl", label: "Extra Large", class: "shadow-xl" },
    { value: "2xl", label: "2X Large", class: "shadow-2xl" },
]

export const BORDER_WIDTH_PRESETS = [
    { value: "0", label: "None", class: "border-0" },
    { value: "1", label: "1px", class: "border" },
    { value: "2", label: "2px", class: "border-2" },
    { value: "4", label: "4px", class: "border-4" },
    { value: "8", label: "8px", class: "border-8" },
]

export const BORDER_RADIUS_PRESETS = [
    { value: "none", label: "None", class: "rounded-none" },
    { value: "sm", label: "Small", class: "rounded-sm" },
    { value: "md", label: "Medium", class: "rounded-md" },
    { value: "lg", label: "Large", class: "rounded-lg" },
    { value: "xl", label: "Extra Large", class: "rounded-xl" },
    { value: "2xl", label: "2X Large", class: "rounded-2xl" },
    { value: "full", label: "Full", class: "rounded-full" },
]

export const ANIMATION_PRESETS = [
    { value: "none", label: "None" },
    { value: "fade-in", label: "Fade In" },
    { value: "fade-up", label: "Fade Up" },
    { value: "fade-down", label: "Fade Down" },
    { value: "fade-left", label: "Fade Left" },
    { value: "fade-right", label: "Fade Right" },
    { value: "slide-up", label: "Slide Up" },
    { value: "slide-down", label: "Slide Down" },
    { value: "slide-left", label: "Slide Left" },
    { value: "slide-right", label: "Slide Right" },
    { value: "scale", label: "Scale" },
    { value: "rotate", label: "Rotate" },
    { value: "bounce", label: "Bounce" },
]

export const DURATION_PRESETS = [
    { value: "150", label: "Fast (150ms)" },
    { value: "300", label: "Normal (300ms)" },
    { value: "500", label: "Slow (500ms)" },
    { value: "700", label: "Slower (700ms)" },
    { value: "1000", label: "Very Slow (1s)" },
]

export function ColorPalette({
    label,
    value,
    onChange,
    colors = BLOCK_COLORS,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    colors?: typeof BLOCK_COLORS
}) {
    return (
        <div className="space-y-2">
            <span className="text-[11px] text-slate-700">{label}</span>
            <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                    // Use bgClass if available (for text colors), otherwise use class (for bg colors)
                    const displayClass = (color as any).bgClass || color.class
                    return (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => onChange(color.value)}
                            className={`h-6 w-6 rounded-full shadow-sm transition-all hover:scale-110 ${displayClass} ${value === color.value ? "ring-2 ring-emerald-500 ring-offset-1" : ""
                                }`}
                            title={color.label}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export function StylingGroup({
    block,
    onChange,
}: {
    block: Block
    onChange: (patch: Partial<Block>) => void
}) {
    return (
        <div className="rounded border border-slate-200 bg-slate-50/50 p-3 space-y-3">
            <div className="text-xs font-semibold text-slate-700">التنسيق</div>
            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="الحشوة (Padding)"
                    value={block.padding ?? "md"}
                    onChange={(v) => onChange({ padding: v as any })}
                    options={[
                        { value: "none", label: "بدون" },
                        { value: "sm", label: "صغيرة" },
                        { value: "md", label: "متوسطة" },
                        { value: "lg", label: "كبيرة" },
                        { value: "xl", label: "كبيرة جداً" },
                    ]}
                />
                <SelectField
                    label="عرض المحتوى"
                    value={block.containerWidth ?? "default"}
                    onChange={(v) => onChange({ containerWidth: v as any })}
                    options={[
                        { value: "default", label: "افتراضي" },
                        { value: "narrow", label: "ضيق" },
                        { value: "full", label: "كامل العرض" },
                    ]}
                />
            </div>
        </div>
    )
}

export function blockLabel(kind: BlockKind, language: "ar" | "en" = "ar"): string {
    const labels: Record<BlockKind, { ar: string; en: string }> = {
        "hero-basic": { ar: "Hero أساسي", en: "Basic Hero" },
        "hero-slider": { ar: "Hero Slider", en: "Hero Slider" },
        "hero-split": { ar: "Hero منقسم", en: "Split Hero" },
        "section-header": { ar: "عنوان قسم", en: "Section Header" },
        "rich-text": { ar: "نص", en: "Rich Text" },
        "image-with-text": { ar: "صورة + نص", en: "Image & Text" },
        "highlight-banner": { ar: "شريط مميز", en: "Highlight Banner" },
        "programs-grid": { ar: "برامج", en: "Programs" },
        "services-list": { ar: "خدمات", en: "Services" },
        "curriculum-overview": { ar: "منهاج", en: "Curriculum" },
        "stats": { ar: "إحصائيات", en: "Stats" },
        "icon-points": { ar: "نقاط أيقونية", en: "Icon Points" },
        "testimonials": { ar: "آراء", en: "Testimonials" },
        "logos-strip": { ar: "شريط شعارات", en: "Logos Strip" },
        "gallery-grid": { ar: "معرض", en: "Gallery" },
        "video-highlight": { ar: "فيديو مميز", en: "Video Highlight" },
        "staff-grid": { ar: "طاقم", en: "Staff" },
        "board-or-team-list": { ar: "فريق / لجنة", en: "Team / Board" },
        "steps-horizontal": { ar: "خطوات", en: "Steps" },
        "timeline-vertical": { ar: "جدول زمني", en: "Timeline" },
        "faq-accordion": { ar: "أسئلة شائعة", en: "FAQ" },
        "downloads-list": { ar: "قائمة تحميلات", en: "Downloads" },
        "contact-section": { ar: "تواصل", en: "Contact" },
        "map": { ar: "خريطة", en: "Map" },
        "cta-strip": { ar: "CTA", en: "CTA" },
        "columns": { ar: "أعمدة", en: "Columns" },
        "grid": { ar: "شبكة", en: "Grid" },
        "testimonials-slider": { ar: "آراء (سلايدر)", en: "Testimonials (Slider)" },
        "gallery-masonry": { ar: "معرض حر", en: "Masonry Gallery" },
        "map-embed": { ar: "خريطة مضمنة", en: "Map Embed" },
        "pricing-table": { ar: "جدول الأسعار", en: "Pricing Table" },
        "video-embed": { ar: "فيديو مضمن", en: "Video Embed" },
        "download-list": { ar: "قائمة التحميلات", en: "Download List" },
        "newsletter-signup": { ar: "اشتراك نشرة", en: "Newsletter Signup" },
        "divider": { ar: "فاصل", en: "Divider" },
        "spacer": { ar: "مسافة", en: "Spacer" },
        "custom-html": { ar: "HTML مخصص", en: "Custom HTML" },
        "department-welcome": { ar: "ترحيب القسم", en: "Dept Welcome" },
        "department-subsections": { ar: "أقسام فرعية", en: "Subsections" },
        "department-cta": { ar: "CTA القسم", en: "Dept CTA" },
        "image-albums": { ar: "ألبومات صور", en: "Image Albums" },
        "jobs-listing": { ar: "قائمة وظائف", en: "Jobs Listing" },
        "about-section": { ar: "عن القسم", en: "About Section" },
        "departments-grid": { ar: "شبكة الأقسام", en: "Departments Grid" },
        "form-container": { ar: "حاوية نموذج", en: "Form Container" },
        "form-input": { ar: "حقل إدخال", en: "Input Field" },
        "form-textarea": { ar: "منطقة نص", en: "Text Area" },
        "form-select": { ar: "قائمة منسدلة", en: "Select Menu" },
        "form-checkbox": { ar: "مربع اختيار", en: "Checkbox" },
        "form-radio": { ar: "زر اختيار", en: "Radio Button" },
        "form-button": { ar: "زر نموذج", en: "Form Button" },
    }

    return labels[kind]?.[language] || labels[kind]?.ar || kind
}

// Create default block instances
// import type { Block } from "./types"

export function createDefaultBlock(kind: BlockKind, language: "ar" | "en" = "ar"): Block {
    // Helper to generate a short, readable ID
    const generateCustomId = () => `block-${createId().slice(0, 6)}`

    const isAr = language === "ar"

    switch (kind) {
        case "hero-basic":
            return {
                id: createId(),
                kind: "hero-basic",
                title: isAr ? "عنوان رئيسي" : "Main Headline",
                description: isAr ? "نص تعريفي قصير عن المدرسة أو الصفحة." : "Short introductory text about the school or page.",
                align: isAr ? "right" : "left",
                blockStyles: { customId: generateCustomId() },
            }
        case "hero-slider":
            return {
                id: createId(),
                kind: "hero-slider",
                slides: [],
                autoplay: true,
                interval: 5000,
                blockStyles: { customId: generateCustomId() },
            }
        case "hero-split":
            return {
                id: createId(),
                kind: "hero-split",
                title: isAr ? "عنوان رئيسي" : "Main Headline",
                subtitle: isAr ? "نص تعريفي قصير." : "Short introductory text.",
                imageSide: isAr ? "left" : "right",
                blockStyles: { customId: generateCustomId() },
            }
        case "section-header":
            return {
                id: createId(),
                kind: "section-header",
                title: isAr ? "عنوان القسم" : "Section Title",
                description: "",
                align: "center",
                blockStyles: { customId: generateCustomId() },
            }
        case "rich-text":
            return {
                id: createId(),
                kind: "rich-text",
                header: { title: isAr ? "عنوان القسم" : "Section Title", description: "" },
                body: isAr ? "نص الفقرة هنا..." : "Paragraph text here...",
                blockStyles: { customId: generateCustomId() },
            }
        case "image-with-text":
            return {
                id: createId(),
                kind: "image-with-text",
                header: { title: isAr ? "عنوان" : "Title", description: "" },
                text: isAr ? "نص يشرح الصورة والمحتوى." : "Text explaining the image and content.",
                imageUrl: "/placeholder.jpg",
                imageSide: isAr ? "left" : "right",
                blockStyles: { customId: generateCustomId() },
            }
        case "highlight-banner":
            return {
                id: createId(),
                kind: "highlight-banner",
                title: isAr ? "رسالة مهمة" : "Important Message",
                text: isAr ? "نص مختصر." : "Short text.",
                variant: "primary",
                blockStyles: { customId: generateCustomId() },
            }
        case "programs-grid":
            return {
                id: createId(),
                kind: "programs-grid",
                header: { eyebrow: isAr ? "برامجنا" : "Our Programs", title: isAr ? "البرامج التعليمية" : "Educational Programs" },
                columns: 3,
                items: [
                    {
                        id: createId(),
                        title: isAr ? "برنامج 1" : "Program 1",
                        description: isAr ? "وصف مختصر." : "Short description.",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "services-list":
            return {
                id: createId(),
                kind: "services-list",
                header: { title: isAr ? "الخدمات" : "Services" },
                layout: "grid",
                items: [
                    {
                        id: createId(),
                        title: isAr ? "خدمة 1" : "Service 1",
                        description: isAr ? "وصف مختصر للخدمة." : "Short description of the service.",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "curriculum-overview":
            return {
                id: createId(),
                kind: "curriculum-overview",
                header: { title: isAr ? "المنهاج" : "Curriculum" },
                areas: [
                    {
                        id: createId(),
                        title: isAr ? "منطقة تعليمية" : "Educational Area",
                        bulletPoints: isAr ? ["نقطة 1", "نقطة 2"] : ["Point 1", "Point 2"],
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "stats":
            return {
                id: createId(),
                kind: "stats",
                header: { eyebrow: isAr ? "أرقام" : "Numbers", title: isAr ? "أثرنا" : "Our Impact" },
                items: [
                    { id: createId(), label: isAr ? "الطلاب" : "Students", value: "120", suffix: "+" },
                    { id: createId(), label: isAr ? "سنوات الخبرة" : "Years Experience", value: "10", suffix: "+" },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "icon-points":
            return {
                id: createId(),
                kind: "icon-points",
                header: { title: isAr ? "نقاط القوة" : "Strengths" },
                items: [{ id: createId(), icon: "⭐", title: isAr ? "ميزة" : "Feature", description: isAr ? "وصف." : "Description." }],
                blockStyles: { customId: generateCustomId() },
            }
        case "testimonials":
            return {
                id: createId(),
                kind: "testimonials",
                header: { title: isAr ? "آراء أولياء الأمور" : "Parent Testimonials" },
                items: [
                    {
                        id: createId(),
                        quote: isAr ? "تجربة رائعة مع المدرسة." : "Great experience with the school.",
                        author: isAr ? "ولي أمر" : "Parent",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "logos-strip":
            return {
                id: createId(),
                kind: "logos-strip",
                header: { title: isAr ? "شركاؤنا" : "Our Partners" },
                title: isAr ? "شركاؤنا" : "Our Partners",
                items: [
                    {
                        id: createId(),
                        logoUrl: "/logo1.png",
                        alt: isAr ? "شعار" : "Logo",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "social-icons":
            return {
                id: createId(),
                kind: "social-icons",
                header: { title: isAr ? "تابعنا" : "Follow Us" },
                items: [
                    {
                        id: createId(),
                        platform: "facebook",
                        url: "https://facebook.com",
                    },
                    {
                        id: createId(),
                        platform: "twitter",
                        url: "https://twitter.com",
                    },
                    {
                        id: createId(),
                        platform: "instagram",
                        url: "https://instagram.com",
                    },
                ],
                layout: "horizontal",
                iconSize: "medium",
                iconStyle: "circle",
                iconFill: "solid",
                gap: "normal",
                alignment: "center",
                hoverEffect: "scale",
                useCustomColors: false,
                blockStyles: { customId: generateCustomId() },
            }
        case "video-highlight":
            return {
                id: createId(),
                kind: "video-highlight",
                header: { title: isAr ? "فيديو تعريفي" : "Intro Video" },
                videoUrl: "https://www.youtube.com/embed/XXXXXXX",
                blockStyles: { customId: generateCustomId() },
            }
        case "staff-grid":
            return {
                id: createId(),
                kind: "staff-grid",
                header: { title: isAr ? "طاقم المدرسة" : "School Staff" },
                columns: 3,
                items: [{ id: createId(), name: isAr ? "اسم المعلم" : "Teacher Name", role: isAr ? "معلم" : "Teacher" }],
                blockStyles: { customId: generateCustomId() },
            }
        case "board-or-team-list":
            return {
                id: createId(),
                kind: "board-or-team-list",
                header: { title: "اللجنة / الفريق" },
                items: [{ id: createId(), name: "اسم", role: "دور" }],
                blockStyles: { customId: generateCustomId() },
            }
        case "steps-horizontal":
            return {
                id: createId(),
                kind: "steps-horizontal",
                header: { title: "خطوات التسجيل" },
                items: [{ id: createId(), stepNumber: 1, title: "الخطوة الأولى" }],
                blockStyles: { customId: generateCustomId() },
            }
        case "timeline-vertical":
            return {
                id: createId(),
                kind: "timeline-vertical",
                header: { title: "رحلة الطالب" },
                items: [{ id: createId(), label: "2024", date: "2024", title: "حدث", description: "وصف" }],
                blockStyles: { customId: generateCustomId() },
            }
        case "faq-accordion":
            return {
                id: createId(),
                kind: "faq-accordion",
                header: { title: "الأسئلة الشائعة" },
                items: [
                    {
                        id: createId(),
                        question: "كيف يتم التسجيل؟",
                        answer: "يتم التسجيل عبر التواصل مع الإدارة.",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "downloads-list":
            return {
                id: createId(),
                kind: "downloads-list",
                header: { title: "ملفات مهمة" },
                items: [
                    {
                        id: createId(),
                        title: "نموذج التسجيل",
                        fileUrl: "/downloads/app.pdf",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "contact-section":
            return {
                id: createId(),
                kind: "contact-section",
                header: { title: "تواصل معنا" },
                info: {
                    address: "العنوان هنا",
                    phone: "06-000000",
                    email: "info@example.com",
                },
                showForm: true,
                blockStyles: { customId: generateCustomId() },
            }
        case "map":
            return {
                id: createId(),
                kind: "map",
                title: "موقعنا على الخريطة",
                embedUrl: "https://www.google.com/maps/embed?pb=...",
                blockStyles: { customId: generateCustomId() },
            }
        case "cta-strip":
            return {
                id: createId(),
                kind: "cta-strip",
                title: "جاهز لزيارة المدرسة؟",
                text: "تواصل معنا لتحديد موعد.",
                primaryCtaLabel: "احجز موعدًا",
                primaryCtaHref: "/contact",
                blockStyles: { customId: generateCustomId() },
            }
        case "columns":
            return {
                id: createId(),
                kind: "columns",
                columns: 2,
                columnSlots: [[], []],  // Initialize 2 empty columns
                blockStyles: { customId: generateCustomId() },
            }
        case "grid":
            return {
                id: createId(),
                kind: "grid",
                columns: 3,
                columnSlots: [[], [], []],  // Initialize 3 empty columns
                blockStyles: { customId: generateCustomId() },
            }
        case "testimonials-slider":
            return {
                id: createId(),
                kind: "testimonials",
                header: { title: "ماذا يقولون عنا؟", description: "آراء عملائنا الكرام" },
                items: [
                    {
                        id: createId(),
                        quote: "تجربة رائعة!",
                        author: "عميل سعيد",
                        role: "دور العميل",
                        rating: 5,
                    },
                ],
                layout: "slider",
                autoplay: true,
                interval: 5000,
                blockStyles: { customId: generateCustomId() },
            }
        case "gallery-masonry":
            return {
                id: createId(),
                kind: "gallery-masonry",
                header: { title: "صور من فعالياتنا" },
                items: [
                    { id: createId(), imageUrl: "/gallery-1.jpg", caption: "فعالية 1" },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "gallery-grid":
            return {
                id: createId(),
                kind: "gallery-grid",
                header: { title: "معرض الصور" },
                columns: 3,
                items: [
                    { id: createId(), imageUrl: "/placeholder.jpg", caption: "صورة 1" },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "map-embed":
            return {
                id: createId(),
                kind: "map",
                title: "موقعنا",
                embedUrl: "https://maps.google.com/maps?q=...",
                blockStyles: { customId: generateCustomId() },
            }
        case "pricing-table":
            return {
                id: createId(),
                kind: "pricing-table",
                title: "خطط الأسعار",
                header: { title: "خططنا", description: "اختر الخطة المناسبة لك" },
                items: [
                    {
                        id: createId(),
                        title: "أساسي",
                        price: "$10",
                        features: ["ميزة 1", "ميزة 2"],
                        ctaLabel: "ابدأ الآن",
                        ctaHref: "/signup",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "video-embed":
            return {
                id: createId(),
                kind: "video-embed",
                embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                blockStyles: { customId: generateCustomId() },
            }
        case "download-list":
            return {
                id: createId(),
                kind: "downloads-list",
                header: { title: "ملفات مفيدة" },
                items: [
                    {
                        id: createId(),
                        title: "دليل المستخدم",
                        fileUrl: "/docs/user-guide.pdf",
                        fileType: "PDF",
                        fileSize: "2MB",
                    },
                ],
                blockStyles: { customId: generateCustomId() },
            }
        case "newsletter-signup":
            return {
                id: createId(),
                kind: "newsletter-signup",
                placeholder: "أدخل بريدك الإلكتروني",
                buttonText: "اشترك",
                blockStyles: { customId: generateCustomId() },
            }
        case "divider":
            return {
                id: createId(),
                kind: "divider",
                style: "solid",
                color: "#ccc",
                thickness: 1,
                blockStyles: { customId: generateCustomId() },
            }
        case "spacer":
            return {
                id: createId(),
                kind: "spacer",
                height: 50,
                blockStyles: { customId: generateCustomId() },
            }
        case "custom-html":
            return {
                id: createId(),
                kind: "custom-html",
                html: "<p>محتوى HTML هنا...</p>",
                blockStyles: { customId: generateCustomId() },
            }
        case "department-welcome":
            return {
                id: createId(),
                kind: "department-welcome",
                title: "مرحباً بكم",
                description: "وصف ترحيبي...",
                stats: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "department-subsections":
            return {
                id: createId(),
                kind: "department-subsections",
                items: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "department-cta":
            return {
                id: createId(),
                kind: "department-cta",
                title: "تواصل معنا",
                description: "نحن هنا للمساعدة",
                primaryButtonLabel: "اتصل بنا",
                primaryButtonHref: "/contact",
                contactInfo: { phone: "", email: "", address: "" },
                blockStyles: { customId: generateCustomId() },
            }
        case "image-albums":
            return {
                id: createId(),
                kind: "image-albums",
                albums: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "jobs-listing":
            return {
                id: createId(),
                kind: "jobs-listing",
                items: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "about-section":
            return {
                id: createId(),
                kind: "about-section",
                titleEn: "About",
                titleAr: "عن",
                descriptionEn: "Description",
                descriptionAr: "وصف",
                image: "/placeholder.jpg",
                featureCards: [],
                stats: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "departments-grid":
            return {
                id: createId(),
                kind: "departments-grid",
                items: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "form-container":
            return {
                id: createId(),
                kind: "form-container",
                title: "نموذج جديد",
                children: [],
                blockStyles: { customId: generateCustomId() },
            }
        case "form-input":
            return {
                id: createId(),
                kind: "form-input",
                label: "الاسم",
                name: "name",
                type: "text",
                placeholder: "أدخل الاسم",
                blockStyles: { customId: generateCustomId() },
            }
        case "form-textarea":
            return {
                id: createId(),
                kind: "form-textarea",
                label: "الرسالة",
                name: "message",
                placeholder: "أدخل رسالتك",
                blockStyles: { customId: generateCustomId() },
            }
        case "form-select":
            return {
                id: createId(),
                kind: "form-select",
                label: "اختر",
                name: "select",
                options: [{ label: "خيار 1", value: "opt1" }],
                blockStyles: { customId: generateCustomId() },
            }
        case "form-checkbox":
            return {
                id: createId(),
                kind: "form-checkbox",
                label: "موافق",
                name: "agree",
                blockStyles: { customId: generateCustomId() },
            }
        case "form-radio":
            return {
                id: createId(),
                kind: "form-radio",
                label: "اختر",
                name: "radio",
                options: [{ label: "خيار 1", value: "opt1" }],
                blockStyles: { customId: generateCustomId() },
            }
        case "form-button":
            return {
                id: createId(),
                kind: "form-button",
                text: "إرسال",
                type: "submit",
                variant: "primary",
                blockStyles: { customId: generateCustomId() },
            }
        default: {
            const _never: never = kind
            throw new Error(`Unknown block kind: ${_never}`)
        }
    }
}
