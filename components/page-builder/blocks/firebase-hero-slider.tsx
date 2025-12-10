"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Block, FirebaseHeroSliderBlock } from "../types"
import { SelectField, SectionContainer, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { Image as ImageIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

interface HeroImage {
    id: string
    imageName?: string
    imageUrl?: string
    isVisible?: boolean
    order?: number
}

export function FirebaseHeroSliderEditor({
    block,
    onChange,
}: {
    block: FirebaseHeroSliderBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<FirebaseHeroSliderBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-md bg-blue-50 border border-blue-200 p-2 text-blue-700 text-[10px]">
                <ImageIcon className="w-3 h-3 inline-block mr-1" />
                {isAr
                    ? "يتم جلب الصور تلقائياً من Firebase (/school_info/namothajia/hero_images)"
                    : "Hero images are automatically fetched from Firebase (/school_info/namothajia/hero_images)"}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="autoplay"
                        checked={block.autoplay ?? true}
                        onChange={(e) => update({ autoplay: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor="autoplay" className="text-[11px]">
                        {isAr ? "تشغيل تلقائي" : "Autoplay"}
                    </label>
                </div>
                {block.autoplay && (
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1">
                            {isAr ? "الفاصل الزمني (ms)" : "Interval (ms)"}
                        </label>
                        <input
                            type="number"
                            value={block.interval ?? 5000}
                            onChange={(e) => update({ interval: parseInt(e.target.value) || 5000 })}
                            className="w-full px-2 py-1 text-[11px] border border-gray-300 rounded"
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showDots"
                        checked={block.showDots ?? true}
                        onChange={(e) => update({ showDots: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor="showDots" className="text-[11px]">
                        {isAr ? "إظهار النقاط" : "Show Dots"}
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showArrows"
                        checked={block.showArrows ?? true}
                        onChange={(e) => update({ showArrows: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor="showArrows" className="text-[11px]">
                        {isAr ? "إظهار الأسهم" : "Show Arrows"}
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showTitle"
                    checked={block.showTitle ?? true}
                    onChange={(e) => update({ showTitle: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="showTitle" className="text-[11px]">
                    {isAr ? "إظهار عنوان الصورة" : "Show Image Title"}
                </label>
            </div>

            <SelectField
                label={isAr ? "موضع العنوان" : "Title Position"}
                value={block.titlePosition || "center"}
                onChange={(v) => update({ titlePosition: v as "top" | "center" | "bottom" })}
                options={[
                    { value: "top", label: isAr ? "أعلى" : "Top" },
                    { value: "center", label: isAr ? "وسط" : "Center" },
                    { value: "bottom", label: isAr ? "أسفل" : "Bottom" },
                ]}
            />

            <SelectField
                label={isAr ? "ارتفاع السلايدر" : "Slider Height"}
                value={block.height || "screen"}
                onChange={(v) => update({ height: v as "screen" | "large" | "medium" })}
                options={[
                    { value: "screen", label: isAr ? "كامل الشاشة" : "Full Screen" },
                    { value: "large", label: isAr ? "كبير (80vh)" : "Large (80vh)" },
                    { value: "medium", label: isAr ? "متوسط (60vh)" : "Medium (60vh)" },
                ]}
            />
        </div>
    )
}

export function FirebaseHeroSliderView({ block }: { block: FirebaseHeroSliderBlock }) {
    const { language } = useLanguage()
    const [heroImages, setHeroImages] = useState<HeroImage[]>([])
    const [loading, setLoading] = useState(true)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const isAr = language === "ar"

    // Fetch hero images from Firebase
    useEffect(() => {
        const fetchHeroImages = async () => {
            try {
                const db = getFirestore(app)
                const heroImagesRef = collection(db, "school_info", "namothajia", "hero_images")
                const snapshot = await getDocs(heroImagesRef)
                const items: HeroImage[] = []
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    // Only include visible images
                    if (data.isVisible !== false) {
                        items.push({ id: doc.id, ...data } as HeroImage)
                    }
                })
                // Sort by order if available
                items.sort((a, b) => (a.order || 0) - (b.order || 0))
                setHeroImages(items)
            } catch (error) {
                console.error("Error fetching hero images:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHeroImages()
    }, [])

    const changeSlide = useCallback((newIndex: number) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentSlide(newIndex)
        setTimeout(() => setIsTransitioning(false), 800)
    }, [isTransitioning])

    // Autoplay
    useEffect(() => {
        if (heroImages.length === 0 || !block.autoplay) return

        const timer = setInterval(() => {
            changeSlide((currentSlide + 1) % heroImages.length)
        }, block.interval || 5000)
        return () => clearInterval(timer)
    }, [heroImages.length, block.autoplay, block.interval, currentSlide, changeSlide])

    const goToSlide = (index: number) => changeSlide(index)
    const goToPrevious = () => changeSlide((currentSlide - 1 + heroImages.length) % heroImages.length)
    const goToNext = () => changeSlide((currentSlide + 1) % heroImages.length)

    const heightClass = {
        screen: "h-screen",
        large: "h-[80vh]",
        medium: "h-[60vh]",
    }[block.height || "screen"]

    const titlePositionClass = {
        top: "items-start pt-32",
        center: "items-center",
        bottom: "items-end pb-32",
    }[block.titlePosition || "center"]

    if (loading) {
        return (
            <>
                {hoverStyles && <style>{hoverStyles}</style>}
                <section
                    {...blockProps}
                    className={`relative ${heightClass} w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center ${blockProps.className || ""}`}
                    dir={isAr ? "rtl" : "ltr"}
                >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </section>
            </>
        )
    }

    if (heroImages.length === 0) {
        return (
            <>
                {hoverStyles && <style>{hoverStyles}</style>}
                <section
                    {...blockProps}
                    className={`relative ${heightClass} w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center ${blockProps.className || ""}`}
                    dir={isAr ? "rtl" : "ltr"}
                >
                    <p className="text-muted-foreground">
                        {isAr ? "لا توجد صور متاحة" : "No images available"}
                    </p>
                </section>
            </>
        )
    }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <style>{`
                @keyframes kenburns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .firebase-slide-active .slide-image {
                    animation: kenburns 8s ease-out forwards;
                }
                .firebase-slide-active .slide-title {
                    animation: fadeInUp 0.6s ease-out 0.2s both;
                }
            `}</style>
            <section
                {...blockProps}
                className={`relative ${heightClass} w-full overflow-hidden ${blockProps.className || ""}`}
                dir={isAr ? "rtl" : "ltr"}
            >
                {/* Slides */}
                {heroImages.map((image, index) => {
                    const isActive = index === currentSlide
                    return (
                        <div
                            key={image.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${isActive ? "opacity-100 z-10 firebase-slide-active" : "opacity-0 z-0"}`}
                        >
                            {/* Background Image with Ken Burns */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={image.imageUrl || "/placeholder.svg"}
                                    alt={image.imageName || "Hero image"}
                                    className={`slide-image w-full h-full object-cover ${!isActive ? "scale-100" : ""}`}
                                />
                            </div>

                            {/* Multi-layer Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                            {/* Title Content */}
                            {block.showTitle !== false && image.imageName && (
                                <div className={`absolute inset-0 flex ${titlePositionClass} justify-center z-10`}>
                                    <div className="container mx-auto px-4">
                                        <div className="max-w-5xl mx-auto text-center">
                                            <h2 className="slide-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                                                <span className="block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                                    {image.imageName}
                                                </span>
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20 pointer-events-none" />

                {/* Navigation Dots */}
                {block.showDots !== false && heroImages.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                disabled={isTransitioning}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? "w-8 bg-white"
                                    : "w-2 bg-white/50 hover:bg-white/70"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation Arrows */}
                {block.showArrows !== false && heroImages.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            disabled={isTransitioning}
                            className={`absolute ${isAr ? "right-4 md:right-8" : "left-4 md:left-8"} top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 hover:scale-110 z-30 group`}
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={isTransitioning}
                            className={`absolute ${isAr ? "left-4 md:left-8" : "right-4 md:right-8"} top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 hover:scale-110 z-30 group`}
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </>
                )}
            </section>
        </>
    )
}
