"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Block, FirebaseGalleryBlock } from "../types"
import { SelectField, SectionContainer, applyBlockStyles, createId } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Loader2, ZoomIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Theme configurations for Gallery
const galleryThemes = {
    violet: {
        gradient: "from-violet-500 via-purple-500 to-violet-600",
        cardBg: "from-violet-50 to-purple-50",
        accent: "violet-500",
        text: "violet-600",
        shadow: "shadow-violet-200/50",
        hover: "hover:shadow-violet-300/60",
        border: "border-violet-200",
        badge: "bg-violet-100 text-violet-700",
        overlay: "from-violet-900/90 via-violet-900/50 to-transparent",
        nav: "bg-violet-500 hover:bg-violet-600",
        dots: "bg-violet-500",
        dotsInactive: "bg-violet-200",
    },
    teal: {
        gradient: "from-teal-500 via-cyan-500 to-teal-600",
        cardBg: "from-teal-50 to-cyan-50",
        accent: "teal-500",
        text: "teal-600",
        shadow: "shadow-teal-200/50",
        hover: "hover:shadow-teal-300/60",
        border: "border-teal-200",
        badge: "bg-teal-100 text-teal-700",
        overlay: "from-teal-900/90 via-teal-900/50 to-transparent",
        nav: "bg-teal-500 hover:bg-teal-600",
        dots: "bg-teal-500",
        dotsInactive: "bg-teal-200",
    },
    pink: {
        gradient: "from-pink-500 via-rose-500 to-pink-600",
        cardBg: "from-pink-50 to-rose-50",
        accent: "pink-500",
        text: "pink-600",
        shadow: "shadow-pink-200/50",
        hover: "hover:shadow-pink-300/60",
        border: "border-pink-200",
        badge: "bg-pink-100 text-pink-700",
        overlay: "from-pink-900/90 via-pink-900/50 to-transparent",
        nav: "bg-pink-500 hover:bg-pink-600",
        dots: "bg-pink-500",
        dotsInactive: "bg-pink-200",
    },
    indigo: {
        gradient: "from-indigo-500 via-blue-500 to-indigo-600",
        cardBg: "from-indigo-50 to-blue-50",
        accent: "indigo-500",
        text: "indigo-600",
        shadow: "shadow-indigo-200/50",
        hover: "hover:shadow-indigo-300/60",
        border: "border-indigo-200",
        badge: "bg-indigo-100 text-indigo-700",
        overlay: "from-indigo-900/90 via-indigo-900/50 to-transparent",
        nav: "bg-indigo-500 hover:bg-indigo-600",
        dots: "bg-indigo-500",
        dotsInactive: "bg-indigo-200",
    },
    sky: {
        gradient: "from-sky-500 via-blue-400 to-sky-600",
        cardBg: "from-sky-50 to-blue-50",
        accent: "sky-500",
        text: "sky-600",
        shadow: "shadow-sky-200/50",
        hover: "hover:shadow-sky-300/60",
        border: "border-sky-200",
        badge: "bg-sky-100 text-sky-700",
        overlay: "from-sky-900/90 via-sky-900/50 to-transparent",
        nav: "bg-sky-500 hover:bg-sky-600",
        dots: "bg-sky-500",
        dotsInactive: "bg-sky-200",
    },
    lime: {
        gradient: "from-lime-500 via-green-500 to-lime-600",
        cardBg: "from-lime-50 to-green-50",
        accent: "lime-500",
        text: "lime-600",
        shadow: "shadow-lime-200/50",
        hover: "hover:shadow-lime-300/60",
        border: "border-lime-200",
        badge: "bg-lime-100 text-lime-700",
        overlay: "from-lime-900/90 via-lime-900/50 to-transparent",
        nav: "bg-lime-500 hover:bg-lime-600",
        dots: "bg-lime-500",
        dotsInactive: "bg-lime-200",
    },
}

interface GalleryItem {
    id: string
    title?: string
    titleAr?: string
    titleEn?: string
    imageTitle?: string
    caption?: string
    captionAr?: string
    captionEn?: string
    description?: string
    descriptionAr?: string
    descriptionEn?: string
    image?: string
    imageUrl?: string
    url?: string
    images?: string[]
    order?: number
}

export function FirebaseGalleryEditor({
    block,
    onChange,
}: {
    block: FirebaseGalleryBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<FirebaseGalleryBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-md bg-violet-50 border border-violet-200 p-2 text-violet-700 text-[10px]">
                <ImageIcon className="w-3 h-3 inline-block mr-1" />
                {isAr
                    ? "يتم جلب الصور تلقائياً من Firebase"
                    : "Gallery images are automatically fetched from Firebase"}
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
                value={block.themeColor || "violet"}
                onChange={(v) => update({ themeColor: v as FirebaseGalleryBlock["themeColor"] })}
                options={[
                    { value: "violet", label: isAr ? "بنفسجي" : "Violet" },
                    { value: "teal", label: isAr ? "أزرق مخضر" : "Teal" },
                    { value: "pink", label: isAr ? "وردي" : "Pink" },
                    { value: "indigo", label: isAr ? "نيلي" : "Indigo" },
                    { value: "sky", label: isAr ? "سماوي" : "Sky" },
                    { value: "lime", label: isAr ? "ليموني" : "Lime" },
                ]}
            />

            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="show-caption"
                    checked={block.showCaption !== false}
                    onChange={(e) => update({ showCaption: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="show-caption" className="text-[11px]">
                    {isAr ? "إظهار العنوان" : "Show Caption"}
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="enable-lightbox"
                    checked={block.enableLightbox !== false}
                    onChange={(e) => update({ enableLightbox: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="enable-lightbox" className="text-[11px]">
                    {isAr ? "تفعيل العرض الكامل" : "Enable Lightbox"}
                </label>
            </div>
        </div>
    )
}

export function FirebaseGalleryView({ block }: { block: FirebaseGalleryBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const isAr = language === "ar"
    const [gallery, setGallery] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [dialogImageIndex, setDialogImageIndex] = useState(0)
    const sliderRef = useRef<HTMLDivElement>(null)

    const theme = galleryThemes[block.themeColor || "violet"]
    const columns = block.columns || 3
    const maxRows = block.maxRows || 2
    const itemsPerPage = columns * maxRows

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const db = getFirestore(app)
                const galleryRef = collection(db, "school_info", "namothajia", "gallery")
                const snapshot = await getDocs(galleryRef)
                const items: GalleryItem[] = []
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    // Only include visible items
                    if (data.isVisible !== false) {
                        items.push({ id: doc.id, ...data } as GalleryItem)
                    }
                })
                // Sort by order if available
                items.sort((a, b) => (a.order || 0) - (b.order || 0))
                setGallery(items)
            } catch (error) {
                console.error("Error fetching gallery:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchGallery()
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

    const totalPages = Math.ceil(gallery.length / itemsPerPage)
    const hasMultiplePages = totalPages > 1

    const currentItems = gallery.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    const getCaption = (item: GalleryItem) => {
        if (isAr) return item.imageTitle || item.captionAr || item.titleAr || item.caption || item.title || ""
        return item.imageTitle || item.captionEn || item.titleEn || item.caption || item.title || ""
    }

    const getDescription = (item: GalleryItem) => {
        if (isAr) return item.descriptionAr || item.description || ""
        return item.descriptionEn || item.description || ""
    }

    const getImageUrl = (item: GalleryItem) => {
        return item.image || item.imageUrl || item.url || ""
    }

    const getItemImages = (item: GalleryItem): string[] => {
        const mainImage = getImageUrl(item)
        if (item.images && item.images.length > 0) {
            return mainImage ? [mainImage, ...item.images] : item.images
        }
        return mainImage ? [mainImage] : []
    }

    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
    }[columns]

    const openDialog = (item: GalleryItem) => {
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

    // Navigate to next gallery item
    const nextGalleryItem = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (selectedItem) {
            const currentIndex = gallery.findIndex(item => item.id === selectedItem.id)
            const nextIndex = (currentIndex + 1) % gallery.length
            setSelectedItem(gallery[nextIndex])
            setDialogImageIndex(0)
        }
    }

    // Navigate to previous gallery item
    const prevGalleryItem = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (selectedItem) {
            const currentIndex = gallery.findIndex(item => item.id === selectedItem.id)
            const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length
            setSelectedItem(gallery[prevIndex])
            setDialogImageIndex(0)
        }
    }

    // Get current gallery item index for counter
    const getCurrentGalleryIndex = () => {
        if (!selectedItem) return 0
        return gallery.findIndex(item => item.id === selectedItem.id)
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedItem) return
            if (e.key === "Escape") closeDialog()
            if (e.key === "ArrowRight") isAr ? prevGalleryItem(e as unknown as React.MouseEvent) : nextGalleryItem(e as unknown as React.MouseEvent)
            if (e.key === "ArrowLeft") isAr ? nextGalleryItem(e as unknown as React.MouseEvent) : prevGalleryItem(e as unknown as React.MouseEvent)
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedItem, isAr, gallery])

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
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {isAr ? "معرض الصور" : "Photo Gallery"}
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

                {/* Gallery Grid */}
                {gallery.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        {isAr ? "لا توجد صور حالياً" : "No images available"}
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
                            className={`grid gap-4 ${gridCols}`}
                        >
                            {currentItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group relative aspect-square rounded-2xl overflow-hidden shadow-lg ${theme.shadow} ${theme.hover} hover:shadow-2xl transition-all duration-500 cursor-pointer`}
                                    onClick={() => openDialog(item)}
                                >
                                    {/* Image */}
                                    <img
                                        src={getImageUrl(item)}
                                        alt={getCaption(item)}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Caption Overlay with Gradient - only lower fourth */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent`}>
                                        {/* Caption at bottom */}
                                        {block.showCaption !== false && getCaption(item) && (
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-lg">
                                                    {getCaption(item)}
                                                </p>
                                                {getDescription(item) && (
                                                    <p className="text-white/70 text-xs line-clamp-1 mt-1">
                                                        {getDescription(item)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Zoom icon on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500`}>
                                            <ZoomIn className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Corner accent */}
                                    <div className={`absolute top-0 ${isAr ? "left-0" : "right-0"} w-16 h-16 overflow-hidden`}>
                                        <div className={`absolute top-0 ${isAr ? "left-0" : "right-0"} w-24 h-24 bg-gradient-to-br ${theme.gradient} transform ${isAr ? "-translate-x-12 -translate-y-12 rotate-45" : "translate-x-12 -translate-y-12 -rotate-45"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    </div>
                                </motion.div>
                            ))}
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
                                className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
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

                            {/* Gallery navigation arrows - outside the content box */}
                            {gallery.length > 1 && (
                                <>
                                    <button
                                        onClick={isAr ? nextGalleryItem : prevGalleryItem}
                                        className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors`}
                                    >
                                        {isAr ? <ChevronRight className="w-8 h-8 text-white" /> : <ChevronLeft className="w-8 h-8 text-white" />}
                                    </button>
                                    <button
                                        onClick={isAr ? prevGalleryItem : nextGalleryItem}
                                        className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors`}
                                    >
                                        {isAr ? <ChevronLeft className="w-8 h-8 text-white" /> : <ChevronRight className="w-8 h-8 text-white" />}
                                    </button>
                                </>
                            )}

                            {/* Gallery counter */}
                            {gallery.length > 1 && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 z-20">
                                    <span className="text-white text-sm font-medium">
                                        {getCurrentGalleryIndex() + 1} / {gallery.length}
                                    </span>
                                </div>
                            )}

                            <div
                                className="relative w-full max-w-4xl max-h-[90vh] flex flex-col mx-16"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Image */}
                                <div className="relative flex-1 min-h-0">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={selectedItem.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            src={getImageUrl(selectedItem)}
                                            alt={getCaption(selectedItem)}
                                            className="w-full max-h-[70vh] object-contain rounded-t-xl"
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Content Overlay */}
                                <div className={`bg-gradient-to-t ${theme.gradient} rounded-b-xl p-6`}>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {getCaption(selectedItem)}
                                    </h3>
                                    {getDescription(selectedItem) && (
                                        <p className="text-white/90 text-sm">
                                            {getDescription(selectedItem)}
                                        </p>
                                    )}
                                </div>
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
