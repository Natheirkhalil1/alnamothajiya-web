import * as React from "react"
import { Block, GalleryMasonryBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export function GalleryMasonryEditor({
    block,
    onChange,
}: {
    block: GalleryMasonryBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: GalleryMasonryBlock["items"]) => GalleryMasonryBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <TextareaField
                label="الوصف"
                value={header.description ?? ""}
                onChange={(v) => updateHeader({ description: v || undefined })}
                rows={2}
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showFilters"
                    checked={block.showFilters ?? false}
                    onChange={(e) => onChange({ ...block, showFilters: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="showFilters" className="text-[11px]">
                    إظهار فلاتر الفئات
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showLightbox"
                    checked={block.showLightbox ?? true}
                    onChange={(e) => onChange({ ...block, showLightbox: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="showLightbox" className="text-[11px]">
                    تفعيل عرض الصور بحجم كامل (Lightbox)
                </label>
            </div>

            <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">موضع التعليق</label>
                <select
                    value={block.captionPosition ?? "over"}
                    onChange={(e) => onChange({ ...block, captionPosition: e.target.value as "over" | "under" })}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                >
                    <option value="over">فوق الصورة (Overlay)</option>
                    <option value="under">تحت الصورة</option>
                </select>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الصور</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    imageUrl: "",
                                    alt: "",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة صورة
                    </button>
                </div>
                {(block.items || []).map((item) => (
                    <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <InputField
                            label="رابط الصورة"
                            value={item.imageUrl}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v } : i)))}
                            placeholder="/images/photo.jpg"
                        />
                        <InputField
                            label="النص البديل (Alt)"
                            value={item.alt ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
                            }
                            placeholder="وصف الصورة"
                        />
                        <InputField
                            label="التعليق"
                            value={item.caption ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, caption: v || undefined } : i)))
                            }
                            placeholder="تعليق اختياري"
                        />
                        <InputField
                            label="الفئة"
                            value={item.category ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, category: v || undefined } : i)))
                            }
                            placeholder="مثال: فعاليات، مرافق، طلاب"
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الصورة
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function GalleryMasonryView({ block }: { block: GalleryMasonryBlock }) {
    const [selectedCategory, setSelectedCategory] = React.useState<string | "all">("all")
    const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const captionPosition = block.captionPosition ?? "over"
    const showLightbox = block.showLightbox ?? true

    // Get unique categories
    const categories = React.useMemo(() => {
        const cats = new Set<string>()
        block.items.forEach((item) => {
            if (item.category) {
                cats.add(item.category)
            }
        })
        return Array.from(cats).sort()
    }, [block.items])

    // Filter items based on selected category
    const filteredItems = React.useMemo(() => {
        if (selectedCategory === "all") {
            return block.items
        }
        return block.items.filter((item) => item.category === selectedCategory)
    }, [block.items, selectedCategory])

    // Keyboard navigation for lightbox
    React.useEffect(() => {
        if (lightboxIndex === null) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setLightboxIndex(null)
            } else if (e.key === "ArrowLeft") {
                setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1))
            } else if (e.key === "ArrowRight") {
                setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0))
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [lightboxIndex, filteredItems.length])

    const openLightbox = (index: number) => {
        if (showLightbox) {
            setLightboxIndex(index)
        }
    }

    const closeLightbox = () => setLightboxIndex(null)

    const goToPrevious = () => {
        setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1))
    }

    const goToNext = () => {
        setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0))
    }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                        {header.description && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                        )}
                    </div>
                )}

                {/* Category Filters */}
                {block.showFilters && categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${selectedCategory === "all"
                                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                                    : "bg-muted hover:bg-muted/80 text-foreground border-2 border-border"
                                }`}
                        >
                            الكل ({block.items.length})
                        </button>
                        {categories.map((category) => {
                            const count = block.items.filter((item) => item.category === category).length
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${selectedCategory === category
                                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                                            : "bg-muted hover:bg-muted/80 text-foreground border-2 border-border"
                                        }`}
                                >
                                    {category} ({count})
                                </button>
                            )
                        })}
                    </div>
                )}

                <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                    {filteredItems.map((item, index) => (
                        <div key={item.id} className="mb-4 break-inside-avoid animate-in fade-in duration-500">
                            <div
                                className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${showLightbox ? "cursor-pointer" : ""
                                    }`}
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={item.imageUrl || "/placeholder.svg"}
                                    alt={item.alt ?? ""}
                                    className="w-full transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Category Badge - Top Right */}
                                {item.category && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-semibold shadow-lg">
                                            {item.category}
                                        </span>
                                    </div>
                                )}

                                {/* Caption Over Image */}
                                {captionPosition === "over" && item.caption && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                                        <p className="text-sm font-medium text-white">{item.caption}</p>
                                    </div>
                                )}
                            </div>

                            {/* Caption Under Image */}
                            {captionPosition === "under" && item.caption && (
                                <div className="mt-2 px-2">
                                    <p className="text-sm font-medium text-foreground">{item.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">لا توجد صور في هذه الفئة</p>
                    </div>
                )}
            </SectionContainer>

            {/* Lightbox */}
            {showLightbox && lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Previous Button */}
                    {filteredItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToPrevious()
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            aria-label="Previous"
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>
                    )}

                    {/* Next Button */}
                    {filteredItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToNext()
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            aria-label="Next"
                        >
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>
                    )}

                    {/* Image */}
                    <div className="max-w-7xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={filteredItems[lightboxIndex].imageUrl}
                            alt={filteredItems[lightboxIndex].alt ?? ""}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        {filteredItems[lightboxIndex].caption && (
                            <div className="mt-4 text-center">
                                <p className="text-white text-lg font-medium">{filteredItems[lightboxIndex].caption}</p>
                            </div>
                        )}
                        {filteredItems[lightboxIndex].category && (
                            <div className="mt-2 text-center">
                                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-semibold">
                                    {filteredItems[lightboxIndex].category}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Image Counter */}
                    {filteredItems.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                            <p className="text-white text-sm font-medium">
                                {lightboxIndex + 1} / {filteredItems.length}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
