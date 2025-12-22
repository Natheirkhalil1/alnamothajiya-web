"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Block, FirebaseAchievementsBlock } from "../types"
import { SelectField, SectionContainer, applyBlockStyles, createId } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { Trophy, Star, Calendar, Award, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Theme configurations for Achievements
const achievementThemes = {
    gold: {
        gradient: "from-amber-400 via-yellow-400 to-amber-500",
        cardBg: "from-amber-50 to-yellow-50",
        accent: "amber-500",
        text: "amber-600",
        shadow: "shadow-amber-200/50",
        hover: "hover:shadow-amber-300/60",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700",
        icon: "text-amber-500",
        ring: "ring-amber-400/30",
        nav: "bg-amber-500 hover:bg-amber-600",
        dots: "bg-amber-500",
        dotsInactive: "bg-amber-200",
        overlay: "from-amber-900/95 via-amber-900/70 to-transparent",
    },
    emerald: {
        gradient: "from-emerald-400 via-green-400 to-emerald-500",
        cardBg: "from-emerald-50 to-green-50",
        accent: "emerald-500",
        text: "emerald-600",
        shadow: "shadow-emerald-200/50",
        hover: "hover:shadow-emerald-300/60",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
        icon: "text-emerald-500",
        ring: "ring-emerald-400/30",
        nav: "bg-emerald-500 hover:bg-emerald-600",
        dots: "bg-emerald-500",
        dotsInactive: "bg-emerald-200",
        overlay: "from-emerald-900/95 via-emerald-900/70 to-transparent",
    },
    blue: {
        gradient: "from-blue-400 via-indigo-400 to-blue-500",
        cardBg: "from-blue-50 to-indigo-50",
        accent: "blue-500",
        text: "blue-600",
        shadow: "shadow-blue-200/50",
        hover: "hover:shadow-blue-300/60",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        icon: "text-blue-500",
        ring: "ring-blue-400/30",
        nav: "bg-blue-500 hover:bg-blue-600",
        dots: "bg-blue-500",
        dotsInactive: "bg-blue-200",
        overlay: "from-blue-900/95 via-blue-900/70 to-transparent",
    },
    purple: {
        gradient: "from-purple-400 via-violet-400 to-purple-500",
        cardBg: "from-purple-50 to-violet-50",
        accent: "purple-500",
        text: "purple-600",
        shadow: "shadow-purple-200/50",
        hover: "hover:shadow-purple-300/60",
        border: "border-purple-200",
        badge: "bg-purple-100 text-purple-700",
        icon: "text-purple-500",
        ring: "ring-purple-400/30",
        nav: "bg-purple-500 hover:bg-purple-600",
        dots: "bg-purple-500",
        dotsInactive: "bg-purple-200",
        overlay: "from-purple-900/95 via-purple-900/70 to-transparent",
    },
    rose: {
        gradient: "from-rose-400 via-pink-400 to-rose-500",
        cardBg: "from-rose-50 to-pink-50",
        accent: "rose-500",
        text: "rose-600",
        shadow: "shadow-rose-200/50",
        hover: "hover:shadow-rose-300/60",
        border: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
        icon: "text-rose-500",
        ring: "ring-rose-400/30",
        nav: "bg-rose-500 hover:bg-rose-600",
        dots: "bg-rose-500",
        dotsInactive: "bg-rose-200",
        overlay: "from-rose-900/95 via-rose-900/70 to-transparent",
    },
    orange: {
        gradient: "from-orange-400 via-amber-400 to-orange-500",
        cardBg: "from-orange-50 to-amber-50",
        accent: "orange-500",
        text: "orange-600",
        shadow: "shadow-orange-200/50",
        hover: "hover:shadow-orange-300/60",
        border: "border-orange-200",
        badge: "bg-orange-100 text-orange-700",
        icon: "text-orange-500",
        ring: "ring-orange-400/30",
        nav: "bg-orange-500 hover:bg-orange-600",
        dots: "bg-orange-500",
        dotsInactive: "bg-orange-200",
        overlay: "from-orange-900/95 via-orange-900/70 to-transparent",
    },
}

interface AchievementItem {
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
    date?: string
    createdAt?: any
    category?: string
    winner?: string
    winnerAr?: string
    winnerEn?: string
}

export function FirebaseAchievementsEditor({
    block,
    onChange,
}: {
    block: FirebaseAchievementsBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<FirebaseAchievementsBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-md bg-amber-50 border border-amber-200 p-2 text-amber-700 text-[10px]">
                <Trophy className="w-3 h-3 inline-block mr-1" />
                {isAr
                    ? "يتم جلب الإنجازات تلقائياً من Firebase"
                    : "Achievements are automatically fetched from Firebase"}
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
                value={block.themeColor || "gold"}
                onChange={(v) => update({ themeColor: v as FirebaseAchievementsBlock["themeColor"] })}
                options={[
                    { value: "gold", label: isAr ? "ذهبي" : "Gold" },
                    { value: "emerald", label: isAr ? "زمردي" : "Emerald" },
                    { value: "blue", label: isAr ? "أزرق" : "Blue" },
                    { value: "purple", label: isAr ? "بنفسجي" : "Purple" },
                    { value: "rose", label: isAr ? "وردي" : "Rose" },
                    { value: "orange", label: isAr ? "برتقالي" : "Orange" },
                ]}
            />

            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="show-date-ach"
                    checked={block.showDate !== false}
                    onChange={(e) => update({ showDate: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="show-date-ach" className="text-[11px]">
                    {isAr ? "إظهار التاريخ" : "Show Date"}
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="show-image-ach"
                    checked={block.showImage !== false}
                    onChange={(e) => update({ showImage: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="show-image-ach" className="text-[11px]">
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
    theme: typeof achievementThemes.gold
    isAr: boolean
}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Autoplay with pause on hover
    useEffect(() => {
        if (images.length <= 1 || isPaused) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 3000)
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
            className="relative h-72 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    src={images[currentIndex]}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </AnimatePresence>
            <div className={`absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent`} />

            {/* Slider controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={isAr ? nextImage : prevImage}
                        className={`absolute ${isAr ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100`}
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={isAr ? prevImage : nextImage}
                        className={`absolute ${isAr ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100`}
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
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
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    idx === currentIndex ? "bg-white w-4" : "bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export function FirebaseAchievementsView({ block }: { block: FirebaseAchievementsBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const isAr = language === "ar"
    const [achievements, setAchievements] = useState<AchievementItem[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedItem, setSelectedItem] = useState<AchievementItem | null>(null)
    const [dialogImageIndex, setDialogImageIndex] = useState(0)
    const sliderRef = useRef<HTMLDivElement>(null)

    const theme = achievementThemes[block.themeColor || "gold"]
    const columns = block.columns || 3
    const maxRows = block.maxRows || 2
    const itemsPerPage = columns * maxRows

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const db = getFirestore(app)
                const achievementsRef = collection(db, "school_info", "namothajia", "achievements")
                const snapshot = await getDocs(achievementsRef)
                const items: AchievementItem[] = []
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    // Only include visible items
                    if (data.isVisible !== false) {
                        items.push({ id: doc.id, ...data } as AchievementItem)
                    }
                })
                // Sort by date if available
                items.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(a.date || 0)
                    const dateB = b.createdAt?.toDate?.() || new Date(b.date || 0)
                    return dateB.getTime() - dateA.getTime()
                })
                setAchievements(items)
            } catch (error) {
                console.error("Error fetching achievements:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAchievements()
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

    const totalPages = Math.ceil(achievements.length / itemsPerPage)
    const hasMultiplePages = totalPages > 1

    const currentItems = achievements.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    const getTitle = (item: AchievementItem) => {
        if (isAr) return item.titleAr || item.title || ""
        return item.titleEn || item.title || ""
    }

    const getDescription = (item: AchievementItem) => {
        if (isAr) return item.descriptionAr || item.description || ""
        return item.descriptionEn || item.description || ""
    }

    const getContent = (item: AchievementItem) => {
        if (isAr) return item.contentAr || item.content || item.descriptionAr || item.description || ""
        return item.contentEn || item.content || item.descriptionEn || item.description || ""
    }

    const getWinner = (item: AchievementItem) => {
        if (isAr) return item.winnerAr || item.winner || ""
        return item.winnerEn || item.winner || ""
    }

    const getItemImages = (item: AchievementItem): string[] => {
        const mainImage = item.image || item.imageUrl || ""
        if (item.images && item.images.length > 0) {
            return mainImage ? [mainImage, ...item.images] : item.images
        }
        return mainImage ? [mainImage] : []
    }

    const formatDate = (item: AchievementItem) => {
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

    const openDialog = (item: AchievementItem) => {
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
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {isAr ? "إنجازاتنا" : "Our Achievements"}
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

                {/* Achievements Grid */}
                {achievements.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        {isAr ? "لا توجد إنجازات حالياً" : "No achievements available"}
                    </div>
                ) : (
                    <div className="relative">
                        {/* Navigation Arrows */}
                        {hasMultiplePages && (
                            <>
                                <button
                                    onClick={prevPage}
                                    className={`absolute ${isAr ? "-right-4 md:-right-12" : "-left-4 md:-left-12"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full ${theme.nav} text-white flex items-center justify-center shadow-lg transition-all hover:scale-110`}
                                >
                                    {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={nextPage}
                                    className={`absolute ${isAr ? "-left-4 md:-left-12" : "-right-4 md:-right-12"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full ${theme.nav} text-white flex items-center justify-center shadow-lg transition-all hover:scale-110`}
                                >
                                    {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>
                            </>
                        )}

                        {/* Grid */}
                        <motion.div
                            ref={sliderRef}
                            key={currentPage}
                            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isAr ? 20 : -20 }}
                            transition={{ duration: 0.3 }}
                            className={`grid gap-6 ${gridCols}`}
                        >
                            {currentItems.map((item, index) => {
                                const itemImages = getItemImages(item)

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05, type: "spring" }}
                                        className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl ${theme.shadow} ${theme.hover} hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer`}
                                        onClick={() => openDialog(item)}
                                    >
                                        {/* Decorative top gradient bar */}
                                        <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />

                                        {/* Trophy badge */}
                                        <div className={`absolute top-6 ${isAr ? "left-6" : "right-6"} z-10`}>
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg ring-4 ${theme.ring} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                                                <Trophy className="w-7 h-7 text-white" />
                                            </div>
                                        </div>

                                        {/* Image */}
                                        {block.showImage !== false && itemImages.length > 0 && (
                                            <CardImageSlider
                                                images={itemImages}
                                                alt={getTitle(item)}
                                                theme={theme}
                                                isAr={isAr}
                                            />
                                        )}

                                        {/* Content */}
                                        <div className={`p-6 ${itemImages.length === 0 || block.showImage === false ? "pt-16" : "-mt-8 relative z-10"}`}>
                                            {/* Stars decoration */}
                                            <div className={`flex gap-1 mb-3 text-${theme.text}`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-slate-900 transition-colors">
                                                {getTitle(item)}
                                            </h3>

                                            {/* Winner */}
                                            {getWinner(item) && (
                                                <div className={`flex items-center gap-2 text-sm ${theme.badge} rounded-full px-3 py-1 w-fit mb-3`}>
                                                    <Award className="w-4 h-4" />
                                                    <span>{getWinner(item)}</span>
                                                </div>
                                            )}

                                            {/* Description */}
                                            <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                                                {getDescription(item)}
                                            </p>

                                            {/* Date */}
                                            {block.showDate !== false && formatDate(item) && (
                                                <div className={`flex items-center gap-2 text-sm text-slate-500`}>
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(item)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover particles effect */}
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className={`absolute top-1/4 ${isAr ? "right-1/4" : "left-1/4"} w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} animate-ping`} />
                                            <div className={`absolute top-1/2 ${isAr ? "left-1/3" : "right-1/3"} w-1.5 h-1.5 rounded-full bg-gradient-to-r ${theme.gradient} animate-ping delay-300`} />
                                            <div className={`absolute bottom-1/4 ${isAr ? "right-1/2" : "left-1/2"} w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} animate-ping delay-500`} />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>

                        {/* Dots pagination */}
                        {hasMultiplePages && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                                            idx === currentPage
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
                                    const winner = getWinner(selectedItem)

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
                                                                <ChevronLeft className="w-6 h-6 text-white" />
                                                            </button>
                                                            <button
                                                                onClick={isAr ? prevDialogImage : nextDialogImage}
                                                                className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors`}
                                                            >
                                                                <ChevronRight className="w-6 h-6 text-white" />
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

                                                    {/* Trophy badge */}
                                                    <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"}`}>
                                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
                                                            <Trophy className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>

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
                                                        {/* Stars */}
                                                        <div className="flex gap-1 mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                            ))}
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                            {getTitle(selectedItem)}
                                                        </h3>
                                                        {winner && (
                                                            <div className="flex items-center gap-2 text-white/90">
                                                                <Award className="w-5 h-5" />
                                                                <span className="font-medium">{winner}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Dots for images */}
                                                    {hasMultipleImages && (
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                            {images.map((_, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setDialogImageIndex(idx)}
                                                                    className={`w-2 h-2 rounded-full transition-all ${
                                                                        idx === dialogImageIndex
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
                                                {/* Date */}
                                                {formatDate(selectedItem) && (
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(selectedItem)}</span>
                                                    </div>
                                                )}
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
