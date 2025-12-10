import * as React from "react"
import { Block, HeroSliderBlock } from "../types"
import { InputField, ImageField, TextareaField, createId, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function HeroSliderEditor({ block, onChange }: { block: HeroSliderBlock; onChange: (b: Block) => void }) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const updateSlides = (updater: (slides: HeroSliderBlock["slides"]) => HeroSliderBlock["slides"]) =>
        onChange({ ...block, slides: updater(block.slides) })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="autoplay"
                        checked={block.autoplay ?? true}
                        onChange={(e) => onChange({ ...block, autoplay: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor="autoplay" className="text-[11px]">
                        {isAr ? "تشغيل تلقائي" : "Autoplay"}
                    </label>
                </div>
                {block.autoplay && (
                    <InputField
                        label={isAr ? "الفاصل الزمني (ms)" : "Interval (ms)"}
                        value={(block.interval ?? 5000).toString()}
                        onChange={(v) => onChange({ ...block, interval: parseInt(v) || 5000 })}
                        type="number"
                    />
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showDots"
                        checked={block.showDots ?? true}
                        onChange={(e) => onChange({ ...block, showDots: e.target.checked })}
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
                        onChange={(e) => onChange({ ...block, showArrows: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor="showArrows" className="text-[11px]">
                        {isAr ? "إظهار الأسهم" : "Show Arrows"}
                    </label>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الشرائح" : "Slides"}</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateSlides((slides) => [
                                ...slides,
                                {
                                    id: createId(),
                                    title: "عنوان جديد",
                                    titleEn: "New Title",
                                    subtitle: "عنوان فرعي",
                                    subtitleEn: "Subtitle",
                                    description: "",
                                    descriptionEn: "",
                                    imageUrl: "",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة شريحة" : "+ Add Slide"}
                    </button>
                </div>
                {(block.slides || []).map((slide, index) => (
                    <div key={slide.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-600">{isAr ? `شريحة ${index + 1}` : `Slide ${index + 1}`}</span>
                            <button
                                type="button"
                                onClick={() => updateSlides((slides) => slides.filter((s) => s.id !== slide.id))}
                                className="text-[11px] text-red-500"
                            >
                                {isAr ? "حذف" : "Delete"}
                            </button>
                        </div>
                        <InputField
                            label={isAr ? "العنوان" : "Title"}
                            value={isAr ? slide.title : (slide.titleEn ?? "")}
                            onChange={(v) => updateSlides((slides) => slides.map((s) => (s.id === slide.id ? (isAr ? { ...s, title: v } : { ...s, titleEn: v }) : s)))}
                        />
                        <InputField
                            label={isAr ? "العنوان الفرعي" : "Subtitle"}
                            value={isAr ? slide.subtitle : (slide.subtitleEn ?? "")}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? (isAr ? { ...s, subtitle: v } : { ...s, subtitleEn: v }) : s)))
                            }
                        />
                        <TextareaField
                            label={isAr ? "الوصف" : "Description"}
                            value={isAr ? slide.description : (slide.descriptionEn ?? "")}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? (isAr ? { ...s, description: v } : { ...s, descriptionEn: v }) : s)))
                            }
                            rows={2}
                        />
                        <ImageField
                            label={isAr ? "الصورة" : "Image"}
                            value={slide.imageUrl}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, imageUrl: v } : s)))
                            }
                        />
                        <InputField
                            label={isAr ? "نص الشارة (اختياري)" : "Badge Text (optional)"}
                            value={isAr ? (slide.badgeText ?? "") : (slide.badgeTextEn ?? "")}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? (isAr ? { ...s, badgeText: v || undefined } : { ...s, badgeTextEn: v || undefined }) : s)))
                            }
                            placeholder={isAr ? "مرحباً بكم" : "Welcome"}
                        />
                        <InputField
                            label={isAr ? "نص الزر الأساسي" : "Primary Button Text"}
                            value={isAr ? (slide.primaryCtaLabel ?? "") : (slide.primaryCtaLabelEn ?? "")}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? (isAr ? { ...s, primaryCtaLabel: v || undefined } : { ...s, primaryCtaLabelEn: v || undefined }) : s)))
                            }
                            placeholder={isAr ? "اعرف المزيد" : "Learn More"}
                        />
                        <InputField
                            label={isAr ? "رابط الزر الأساسي" : "Primary Button Link"}
                            value={slide.primaryCtaHref ?? ""}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, primaryCtaHref: v || undefined } : s)))
                            }
                            placeholder="/about"
                        />
                        <InputField
                            label={isAr ? "نص الزر الثانوي" : "Secondary Button Text"}
                            value={isAr ? (slide.secondaryCtaLabel ?? "") : (slide.secondaryCtaLabelEn ?? "")}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? (isAr ? { ...s, secondaryCtaLabel: v || undefined } : { ...s, secondaryCtaLabelEn: v || undefined }) : s)))
                            }
                            placeholder={isAr ? "تواصل معنا" : "Contact Us"}
                        />
                        <InputField
                            label={isAr ? "رابط الزر الثانوي" : "Secondary Button Link"}
                            value={slide.secondaryCtaHref ?? ""}
                            onChange={(v) =>
                                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, secondaryCtaHref: v || undefined } : s)))
                            }
                            placeholder="/contact"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function HeroSliderView({ block }: { block: HeroSliderBlock }) {
    const { language } = useLanguage()
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [isTransitioning, setIsTransitioning] = React.useState(false)
    const slides = block.slides || []
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Language-specific helpers
    const getSlideTitle = (slide: typeof slides[0]) => language === "ar" ? slide.title : (slide.titleEn || slide.title)
    const getSlideSubtitle = (slide: typeof slides[0]) => language === "ar" ? slide.subtitle : (slide.subtitleEn || slide.subtitle)
    const getSlideDescription = (slide: typeof slides[0]) => language === "ar" ? slide.description : (slide.descriptionEn || slide.description)
    const getSlideBadge = (slide: typeof slides[0]) => language === "ar" ? (slide.badgeText || "مرحباً بكم") : (slide.badgeTextEn || slide.badgeText || "Welcome")
    const getPrimaryCtaLabel = (slide: typeof slides[0]) => language === "ar" ? (slide.primaryCtaLabel || "اعرف المزيد") : (slide.primaryCtaLabelEn || slide.primaryCtaLabel || "Learn More")
    const getSecondaryCtaLabel = (slide: typeof slides[0]) => language === "ar" ? (slide.secondaryCtaLabel || "تواصل معنا") : (slide.secondaryCtaLabelEn || slide.secondaryCtaLabel || "Contact Us")
    const getNoSlidesText = () => language === "ar" ? "لا توجد شرائح" : "No slides available"

    const changeSlide = React.useCallback((newIndex: number) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentSlide(newIndex)
        setTimeout(() => setIsTransitioning(false), 800)
    }, [isTransitioning])

    React.useEffect(() => {
        if (slides.length === 0 || !block.autoplay) return

        const timer = setInterval(() => {
            changeSlide((currentSlide + 1) % slides.length)
        }, block.interval || 5000)
        return () => clearInterval(timer)
    }, [slides.length, block.autoplay, block.interval, currentSlide, changeSlide])

    const goToSlide = (index: number) => changeSlide(index)
    const goToPrevious = () => changeSlide((currentSlide - 1 + slides.length) % slides.length)
    const goToNext = () => changeSlide((currentSlide + 1) % slides.length)

    if (slides.length === 0) {
        return (
            <>
                {hoverStyles && <style>{hoverStyles}</style>}
                <section {...blockProps} className={`relative h-screen w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center ${blockProps.className || ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
                    <p className="text-muted-foreground">{getNoSlidesText()}</p>
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
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .slide-active .slide-image {
                    animation: kenburns 8s ease-out forwards;
                }
                .slide-active .slide-badge {
                    animation: fadeInDown 0.6s ease-out 0.1s both;
                }
                .slide-active .slide-title {
                    animation: fadeInUp 0.6s ease-out 0.2s both;
                }
                .slide-active .slide-subtitle {
                    animation: fadeInUp 0.6s ease-out 0.35s both;
                }
                .slide-active .slide-description {
                    animation: fadeInUp 0.6s ease-out 0.5s both;
                }
                .slide-active .slide-buttons {
                    animation: fadeInUp 0.6s ease-out 0.65s both;
                }
            `}</style>
            <section {...blockProps} className={`relative h-screen w-full overflow-hidden ${blockProps.className || ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
                {/* Slides */}
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide
                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${isActive ? "opacity-100 z-10 slide-active" : "opacity-0 z-0"}`}
                        >
                            {/* Background Image with Ken Burns */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={slide.imageUrl || "/placeholder.svg"}
                                    alt={getSlideTitle(slide)}
                                    className={`slide-image w-full h-full object-cover ${!isActive ? "scale-100" : ""}`}
                                />
                            </div>

                            {/* Multi-layer Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-5xl mx-auto text-center">
                                        <div className="space-y-6">
                                            {/* Badge */}
                                            <div className="slide-badge inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                                                <span className="text-sm font-semibold text-white">
                                                    {getSlideBadge(slide)}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="slide-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                                                <span className="block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                                    {getSlideTitle(slide)}
                                                </span>
                                            </h2>

                                            {/* Subtitle */}
                                            {getSlideSubtitle(slide) && (
                                                <h3 className="slide-subtitle text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                                                    {getSlideSubtitle(slide)}
                                                </h3>
                                            )}

                                            {/* Description */}
                                            {getSlideDescription(slide) && (
                                                <p className="slide-description text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                                                    {getSlideDescription(slide)}
                                                </p>
                                            )}

                                            {/* Buttons */}
                                            <div className="slide-buttons flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                                                {slide.primaryCtaHref && (
                                                    <a
                                                        href={slide.primaryCtaHref}
                                                        className="group inline-flex items-center justify-center gap-2 text-base px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                                                    >
                                                        {getPrimaryCtaLabel(slide)}
                                                        <svg className={`w-4 h-4 transition-transform duration-300 ${language === "ar" ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {slide.secondaryCtaHref && (
                                                    <a
                                                        href={slide.secondaryCtaHref}
                                                        className="inline-flex items-center justify-center gap-2 text-base px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105"
                                                    >
                                                        {getSecondaryCtaLabel(slide)}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20 pointer-events-none" />

                {/* Navigation Dots */}
                {block.showDots && slides.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {slides.map((_, index) => (
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
                {block.showArrows && slides.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            disabled={isTransitioning}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 hover:scale-110 z-30 group"
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={isTransitioning}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 hover:scale-110 z-30 group"
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </section>
        </>
    )
}
