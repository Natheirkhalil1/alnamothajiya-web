"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Block, FirebaseNewsBlock } from "../types"
import { SelectField, SectionContainer, applyBlockStyles, createId } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { Newspaper, Calendar, ChevronRight, ChevronLeft, Loader2, X, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Theme configurations for News
const newsThemes = {
    rose: {
        gradient: "from-rose-500 via-pink-500 to-rose-600",
        cardBg: "from-rose-50 to-pink-50",
        accent: "rose-500",
        text: "rose-600",
        shadow: "shadow-rose-200/50",
        hover: "hover:shadow-rose-300/60",
        border: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
        categoryBadge: "bg-rose-500 text-white",
        nav: "bg-rose-500 hover:bg-rose-600",
        navDisabled: "bg-rose-200",
        dots: "bg-rose-500",
        dotsInactive: "bg-rose-200",
        overlay: "from-rose-900/95 via-rose-900/70 to-transparent",
    },
    blue: {
        gradient: "from-blue-500 via-indigo-500 to-blue-600",
        cardBg: "from-blue-50 to-indigo-50",
        accent: "blue-500",
        text: "blue-600",
        shadow: "shadow-blue-200/50",
        hover: "hover:shadow-blue-300/60",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        categoryBadge: "bg-blue-500 text-white",
        nav: "bg-blue-500 hover:bg-blue-600",
        navDisabled: "bg-blue-200",
        dots: "bg-blue-500",
        dotsInactive: "bg-blue-200",
        overlay: "from-blue-900/95 via-blue-900/70 to-transparent",
    },
    emerald: {
        gradient: "from-emerald-500 via-teal-500 to-emerald-600",
        cardBg: "from-emerald-50 to-teal-50",
        accent: "emerald-500",
        text: "emerald-600",
        shadow: "shadow-emerald-200/50",
        hover: "hover:shadow-emerald-300/60",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
        categoryBadge: "bg-emerald-500 text-white",
        nav: "bg-emerald-500 hover:bg-emerald-600",
        navDisabled: "bg-emerald-200",
        dots: "bg-emerald-500",
        dotsInactive: "bg-emerald-200",
        overlay: "from-emerald-900/95 via-emerald-900/70 to-transparent",
    },
    purple: {
        gradient: "from-purple-500 via-violet-500 to-purple-600",
        cardBg: "from-purple-50 to-violet-50",
        accent: "purple-500",
        text: "purple-600",
        shadow: "shadow-purple-200/50",
        hover: "hover:shadow-purple-300/60",
        border: "border-purple-200",
        badge: "bg-purple-100 text-purple-700",
        categoryBadge: "bg-purple-500 text-white",
        nav: "bg-purple-500 hover:bg-purple-600",
        navDisabled: "bg-purple-200",
        dots: "bg-purple-500",
        dotsInactive: "bg-purple-200",
        overlay: "from-purple-900/95 via-purple-900/70 to-transparent",
    },
    amber: {
        gradient: "from-amber-500 via-orange-500 to-amber-600",
        cardBg: "from-amber-50 to-orange-50",
        accent: "amber-500",
        text: "amber-600",
        shadow: "shadow-amber-200/50",
        hover: "hover:shadow-amber-300/60",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700",
        categoryBadge: "bg-amber-500 text-white",
        nav: "bg-amber-500 hover:bg-amber-600",
        navDisabled: "bg-amber-200",
        dots: "bg-amber-500",
        dotsInactive: "bg-amber-200",
        overlay: "from-amber-900/95 via-amber-900/70 to-transparent",
    },
    cyan: {
        gradient: "from-cyan-500 via-sky-500 to-cyan-600",
        cardBg: "from-cyan-50 to-sky-50",
        accent: "cyan-500",
        text: "cyan-600",
        shadow: "shadow-cyan-200/50",
        hover: "hover:shadow-cyan-300/60",
        border: "border-cyan-200",
        badge: "bg-cyan-100 text-cyan-700",
        categoryBadge: "bg-cyan-500 text-white",
        nav: "bg-cyan-500 hover:bg-cyan-600",
        navDisabled: "bg-cyan-200",
        dots: "bg-cyan-500",
        dotsInactive: "bg-cyan-200",
        overlay: "from-cyan-900/95 via-cyan-900/70 to-transparent",
    },
}

interface MediaItem {
    url: string
    type?: string
    name?: string
}

interface NewsItem {
    id: string
    title?: string
    titleAr?: string
    titleEn?: string
    description?: string
    descriptionAr?: string
    descriptionEn?: string
    content?: string
    contentAr?: string
    contentEn?: string
    image?: string
    imageUrl?: string
    images?: string[]
    mediaItems?: MediaItem[]
    date?: string
    createdAt?: any
    category?: string
    categoryAr?: string
    categoryEn?: string
}

export function FirebaseNewsEditor({
    block,
    onChange,
}: {
    block: FirebaseNewsBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<FirebaseNewsBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-md bg-blue-50 border border-blue-200 p-2 text-blue-700 text-[10px]">
                <Newspaper className="w-3 h-3 inline-block mr-1" />
                {isAr
                    ? "يتم جلب الأخبار تلقائياً من Firebase"
                    : "News are automatically fetched from Firebase"}
            </div>

            <SelectField
                label={isAr ? "عدد الأعمدة" : "Columns per Row"}
                value={String(block.columns || 3)}
                onChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
                options={[
                    { value: "2", label: isAr ? "2 أعمدة" : "2 Columns" },
                    { value: "3", label: isAr ? "3 أعمدة" : "3 Columns" },
                    { value: "4", label: isAr ? "4 أعمدة" : "4 Columns" },
                ]}
            />

            <SelectField
                label={isAr ? "عدد الصفوف" : "Number of Rows"}
                value={String(block.maxRows || 2)}
                onChange={(v) => update({ maxRows: Number(v) as 1 | 2 | 3 })}
                options={[
                    { value: "1", label: isAr ? "صف واحد" : "1 Row" },
                    { value: "2", label: isAr ? "صفين" : "2 Rows" },
                    { value: "3", label: isAr ? "3 صفوف" : "3 Rows" },
                ]}
            />

            <SelectField
                label={isAr ? "لون السمة" : "Theme Color"}
                value={block.themeColor || "rose"}
                onChange={(v) => update({ themeColor: v as FirebaseNewsBlock["themeColor"] })}
                options={[
                    { value: "rose", label: isAr ? "وردي" : "Rose" },
                    { value: "blue", label: isAr ? "أزرق" : "Blue" },
                    { value: "emerald", label: isAr ? "زمردي" : "Emerald" },
                    { value: "purple", label: isAr ? "بنفسجي" : "Purple" },
                    { value: "amber", label: isAr ? "كهرماني" : "Amber" },
                    { value: "cyan", label: isAr ? "سماوي" : "Cyan" },
                ]}
            />

            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="show-date"
                    checked={block.showDate !== false}
                    onChange={(e) => update({ showDate: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="show-date" className="text-[11px]">
                    {isAr ? "إظهار التاريخ" : "Show Date"}
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="show-image"
                    checked={block.showImage !== false}
                    onChange={(e) => update({ showImage: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="show-image" className="text-[11px]">
                    {isAr ? "إظهار الصورة" : "Show Image"}
                </label>
            </div>
        </div>
    )
}

// Mini image slider component for card with autoplay
function CardImageSlider({
    images,
    alt,
    theme,
    isAr,
}: {
    images: string[]
    alt: string
    theme: typeof newsThemes.rose
    isAr: boolean
}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Autoplay with pause on hover
    useEffect(() => {
        if (images.length <= 1 || isPaused) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [images.length, isPaused])

    if (images.length === 0) return null

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div
            className="relative h-80 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    src={images[currentIndex]}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </AnimatePresence>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`} />

            {/* Slider controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={isAr ? nextImage : prevImage}
                        className={`absolute ${isAr ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100`}
                    >
                        {isAr ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
                    </button>
                    <button
                        onClick={isAr ? prevImage : nextImage}
                        className={`absolute ${isAr ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100`}
                    >
                        {isAr ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentIndex(idx)
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? "bg-white w-4" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export function FirebaseNewsView({ block }: { block: FirebaseNewsBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const isAr = language === "ar"
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0) // Will be initialized after news is fetched
    const [isResetting, setIsResetting] = useState(false)
    const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)
    const [dialogImageIndex, setDialogImageIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    const theme = newsThemes[block.themeColor || "rose"]
    const columns = block.columns || 3
    const maxRows = block.maxRows || 2
    const itemsPerView = columns * maxRows

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const db = getFirestore(app)
                const newsRef = collection(db, "school_info", "namothajia", "news")
                const snapshot = await getDocs(newsRef)
                const items: NewsItem[] = []
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    // Only include visible items
                    if (data.isVisible !== false) {
                        items.push({ id: doc.id, ...data } as NewsItem)
                    }
                })
                // Sort by date if available
                items.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(a.date || 0)
                    const dateB = b.createdAt?.toDate?.() || new Date(b.date || 0)
                    return dateB.getTime() - dateA.getTime()
                })
                setNews(items)
                // Initialize index to middle of tripled array for infinite effect
                if (items.length > 0) {
                    setCurrentIndex(items.length)
                }
            } catch (error) {
                console.error("Error fetching news:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    // Lock body scroll when dialog is open
    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [selectedItem])

    // Auto-slide every 3 seconds, pause on hover (infinity slider)
    useEffect(() => {
        if (news.length <= itemsPerView || isPaused) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1)
        }, 8000)
        return () => clearInterval(interval)
    }, [news.length, itemsPerView, isPaused])

    // Get visible items for infinity slider
    const getVisibleItems = () => {
        if (news.length === 0) return []
        if (news.length <= itemsPerView) return news

        const items: NewsItem[] = []
        for (let i = 0; i < itemsPerView; i++) {
            const index = (currentIndex + i) % news.length
            items.push(news[index])
        }
        return items
    }

    const visibleItems = getVisibleItems()
    const hasMultipleItems = news.length > itemsPerView

    const nextSlide = () => {
        if (news.length === 0) return
        setCurrentIndex((prev) => prev + 1)
    }

    const prevSlide = () => {
        if (news.length === 0) return
        setCurrentIndex((prev) => prev - 1)
    }

    // Handle infinite loop silent reset
    const handleAnimationComplete = () => {
        if (news.length === 0) return

        // If we reached the end of the middle set or the start of the middle set
        if (currentIndex >= news.length * 2) {
            setIsResetting(true)
            setCurrentIndex(news.length)
            setTimeout(() => setIsResetting(false), 50)
        } else if (currentIndex < news.length) {
            setIsResetting(true)
            setCurrentIndex(news.length * 2 - 1)
            setTimeout(() => setIsResetting(false), 50)
        }
    }

    const getTitle = (item: NewsItem) => {
        if (isAr) return item.titleAr || item.title || ""
        return item.titleEn || item.title || ""
    }

    const getDescription = (item: NewsItem) => {
        if (isAr) return item.descriptionAr || item.description || ""
        return item.descriptionEn || item.description || ""
    }

    const getContent = (item: NewsItem) => {
        if (isAr) return item.contentAr || item.content || item.descriptionAr || item.description || ""
        return item.contentEn || item.content || item.descriptionEn || item.description || ""
    }

    const getCategory = (item: NewsItem) => {
        if (isAr) return item.categoryAr || item.category || ""
        return item.categoryEn || item.category || ""
    }

    const getItemImages = (item: NewsItem): string[] => {
        // First check mediaItems array (each has a url field)
        if (item.mediaItems && item.mediaItems.length > 0) {
            return item.mediaItems.map(m => m.url).filter(Boolean)
        }
        // Fallback to images array or single image
        const mainImage = item.image || item.imageUrl || ""
        if (item.images && item.images.length > 0) {
            return mainImage ? [mainImage, ...item.images] : item.images
        }
        return mainImage ? [mainImage] : []
    }

    const formatDate = (item: NewsItem) => {
        const date = item.createdAt?.toDate?.() || (item.date ? new Date(item.date) : null)
        if (!date) return ""
        return new Intl.DateTimeFormat(isAr ? "ar" : "en", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }).format(date)
    }

    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
    }[columns]

    const openDialog = (item: NewsItem) => {
        setSelectedItem(item)
        setDialogImageIndex(0)
    }

    const closeDialog = () => {
        setSelectedItem(null)
        setDialogImageIndex(0)
    }

    const nextDialogImage = () => {
        if (selectedItem) {
            const images = getItemImages(selectedItem)
            setDialogImageIndex((prev) => (prev + 1) % images.length)
        }
    }

    const prevDialogImage = () => {
        if (selectedItem) {
            const images = getItemImages(selectedItem)
            setDialogImageIndex((prev) => (prev - 1 + images.length) % images.length)
        }
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedItem) return
            if (e.key === "Escape") closeDialog()
            if (e.key === "ArrowRight") isAr ? prevDialogImage() : nextDialogImage()
            if (e.key === "ArrowLeft") isAr ? nextDialogImage() : prevDialogImage()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedItem, isAr])

    if (loading) {
        return (
            <SectionContainer
                {...blockProps}
                className={blockProps.className || ""}
                dir={isAr ? "rtl" : "ltr"}
            >
                <div className="flex items-center justify-center py-20">
                    <Loader2 className={`w-8 h-8 animate-spin text-${theme.accent}`} />
                </div>
            </SectionContainer>
        )
    }

    // Calculate translation percentage for the tripled array
    const displayNews = [...news, ...news, ...news]
    const translationPerItem = (1 / Math.max(1, displayNews.length)) * 100
    const xTranslation = isAr ? (currentIndex * translationPerItem) : -(currentIndex * translationPerItem)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                {...blockProps}
                className={blockProps.className || ""}
                dir={isAr ? "rtl" : "ltr"}
            >
                {/* Header */}
                {block.header?.titleAr || block.header?.titleEn ? (
                    <div className="text-center mb-12">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.badge} mb-4`}>
                            <Newspaper className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {isAr ? "آخر الأخبار" : "Latest News"}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            {isAr ? block.header.titleAr : block.header.titleEn}
                        </h2>
                        {(block.header.descriptionAr || block.header.descriptionEn) && (
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                {isAr ? block.header.descriptionAr : block.header.descriptionEn}
                            </p>
                        )}
                    </div>
                ) : null}

                {/* News Grid */}
                {news.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        {isAr ? "لا توجد أخبار حالياً" : "No news available"}
                    </div>
                ) : (
                    <div
                        className="relative"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Navigation Arrows */}
                        {hasMultipleItems && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className={`absolute ${isAr ? "-right-4 md:-right-12" : "-left-4 md:-left-12"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full ${theme.nav} text-white flex items-center justify-center shadow-lg transition-all hover:scale-110`}
                                >
                                    {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className={`absolute ${isAr ? "-left-4 md:-left-12" : "-right-4 md:-right-12"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full ${theme.nav} text-white flex items-center justify-center shadow-lg transition-all hover:scale-110`}
                                >
                                    {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>
                            </>
                        )}

                        {/* Continuous Slider Wrapper */}
                        <div className="overflow-hidden -mx-3 px-3 py-4">
                            <motion.div
                                ref={sliderRef}
                                className="flex flex-nowrap"
                                animate={{ x: `${xTranslation}%` }}
                                style={{ width: `${(displayNews.length / columns) * 100}%` }}
                                onAnimationComplete={handleAnimationComplete}
                                transition={isResetting ? { duration: 0 } : {
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30,
                                    mass: 1
                                }}
                            >
                                {displayNews.map((item, idx) => {
                                    const itemImages = getItemImages(item)
                                    const category = getCategory(item)

                                    return (
                                        <div
                                            key={`${item.id}-${idx}`}
                                            className="px-3 flex-shrink-0"
                                            style={{ width: `${(1 / displayNews.length) * 100}%` }}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                className={`group relative bg-gradient-to-br ${theme.cardBg} rounded-2xl overflow-hidden shadow-lg ${theme.shadow} ${theme.hover} hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full`}
                                                onClick={() => openDialog(item)}
                                            >
                                                {/* Image Slider */}
                                                {block.showImage !== false && itemImages.length > 0 && (
                                                    <div className="relative">
                                                        <CardImageSlider
                                                            images={itemImages}
                                                            alt={getTitle(item)}
                                                            theme={theme}
                                                            isAr={isAr}
                                                        />

                                                        {/* Category Badge */}
                                                        {category && (
                                                            <div className={`absolute top-3 ${isAr ? "right-3" : "left-3"}`}>
                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${theme.categoryBadge} shadow-lg`}>
                                                                    <Tag className="w-3 h-3" />
                                                                    {category}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Floating badge */}
                                                        <div className={`absolute bottom-3 ${isAr ? "left-3" : "right-3"}`}>
                                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
                                                                <Newspaper className="w-5 h-5 text-white" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="p-6">
                                                    {/* Date */}
                                                    {block.showDate !== false && formatDate(item) && (
                                                        <div className={`flex items-center gap-2 text-sm text-${theme.text} mb-3`}>
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatDate(item)}</span>
                                                        </div>
                                                    )}

                                                    {/* Title */}
                                                    <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-slate-900 transition-colors">
                                                        {getTitle(item)}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                                                        {getDescription(item)}
                                                    </p>

                                                    {/* Read More */}
                                                    <div className={`flex items-center gap-2 text-${theme.text} font-medium text-sm group-hover:gap-3 transition-all mt-auto`}>
                                                        <span>{isAr ? "اقرأ المزيد" : "Read More"}</span>
                                                        <ChevronRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                                                    </div>
                                                </div>

                                                {/* Hover gradient overlay */}
                                                <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                                            </motion.div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        </div>

                        {/* Dots pagination - show current position in infinite loop */}
                        {hasMultipleItems && (
                            <div className="flex justify-center gap-2 mt-8">
                                {news.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(news.length + idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === (currentIndex % news.length)
                                            ? `${theme.dots} w-8`
                                            : `${theme.dotsInactive} hover:${theme.dots}`
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Detail Dialog - rendered via portal to escape stacking context */}
                {typeof document !== "undefined" && createPortal(
                    <AnimatePresence>
                        {selectedItem && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 overflow-y-auto"
                                style={{ zIndex: 99999, isolation: "isolate" }}
                                onClick={closeDialog}
                            >
                                {/* Close button */}
                                <button
                                    onClick={closeDialog}
                                    className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>

                                <div
                                    className="relative w-full max-w-4xl my-8"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Image Slider */}
                                    {(() => {
                                        const images = getItemImages(selectedItem)
                                        const hasMultipleImages = images.length > 1
                                        const category = getCategory(selectedItem)

                                        return (
                                            <div className="relative">
                                                {images.length > 0 ? (
                                                    <div className="relative aspect-video rounded-t-2xl overflow-hidden">
                                                        {/* Navigation buttons */}
                                                        {hasMultipleImages && (
                                                            <>
                                                                <button
                                                                    onClick={isAr ? nextDialogImage : prevDialogImage}
                                                                    className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors`}
                                                                >
                                                                    {isAr ? <ChevronRight className="w-6 h-6 text-white" /> : <ChevronLeft className="w-6 h-6 text-white" />}
                                                                </button>
                                                                <button
                                                                    onClick={isAr ? prevDialogImage : nextDialogImage}
                                                                    className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors`}
                                                                >
                                                                    {isAr ? <ChevronLeft className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                                                                </button>
                                                            </>
                                                        )}

                                                        {/* Image */}
                                                        <AnimatePresence mode="wait">
                                                            <motion.img
                                                                key={dialogImageIndex}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                src={images[dialogImageIndex]}
                                                                alt={getTitle(selectedItem)}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </AnimatePresence>

                                                        {/* Overlay gradient - only lower fourth */}
                                                        <div className={`absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent`} />

                                                        {/* Category badge */}
                                                        {category && (
                                                            <div className={`absolute top-4 ${isAr ? "right-4" : "left-4"}`}>
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${theme.categoryBadge} shadow-lg`}>
                                                                    <Tag className="w-4 h-4" />
                                                                    {category}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Image counter */}
                                                        {hasMultipleImages && (
                                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                                                                <span className="text-white text-sm">
                                                                    {dialogImageIndex + 1} / {images.length}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Content overlay at bottom */}
                                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                                            {/* Date */}
                                                            {formatDate(selectedItem) && (
                                                                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>{formatDate(selectedItem)}</span>
                                                                </div>
                                                            )}
                                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                                {getTitle(selectedItem)}
                                                            </h3>
                                                        </div>

                                                        {/* Dots for images */}
                                                        {hasMultipleImages && (
                                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                                {images.map((_, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => setDialogImageIndex(idx)}
                                                                        className={`w-2 h-2 rounded-full transition-all ${idx === dialogImageIndex
                                                                            ? "bg-white w-6"
                                                                            : "bg-white/50 hover:bg-white/70"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null}

                                                {/* Content section */}
                                                <div className="bg-white rounded-b-2xl p-6">
                                                    <div className="prose prose-slate max-w-none" dir={isAr ? "rtl" : "ltr"}>
                                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                            {getContent(selectedItem)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </SectionContainer>
        </>
    )
}
