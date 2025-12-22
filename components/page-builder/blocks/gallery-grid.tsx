import * as React from "react"
import { Block, GalleryGridBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, ImageField, SelectField, SectionContainer, createId, applyBlockStyles } from "../utils"
import { getGalleryImages, type GalleryImage } from "@/lib/storage"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { ZoomIn } from "lucide-react"

export function GalleryGridEditor({
    block,
    onChange,
}: {
    block: GalleryGridBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const [galleryImages, setGalleryImages] = React.useState<GalleryImage[]>([])
    const header = block.header ?? {}
    const items = block.items || []
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: GalleryGridBlock["items"]) => GalleryGridBlock["items"]) =>
        onChange({ ...block, items: updater(items) })
    const update = (patch: Partial<GalleryGridBlock>) => onChange({ ...block, ...patch })

    // Load gallery images from dashboard
    React.useEffect(() => {
        const loadImages = async () => {
            const images = await getGalleryImages()
            setGalleryImages(images)
        }
        loadImages()
    }, [])

    // Load images from dashboard gallery
    const loadFromDashboard = async () => {
        const images = await getGalleryImages()
        const newItems = images.map((img) => ({
            id: img.id,
            imageUrl: img.image,
            alt: isAr ? img.titleAr : img.titleEn,
            caption: isAr ? img.descriptionAr : img.descriptionEn,
        }))
        onChange({ ...block, items: newItems, useGalleryFromDashboard: true })
    }

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <SelectField
                label={isAr ? "الأعمدة" : "Columns"}
                value={String(block.columns)}
                onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
                options={[
                    { value: "2", label: isAr ? "عمودين" : "2 Columns" },
                    { value: "3", label: isAr ? "3 أعمدة" : "3 Columns" },
                    { value: "4", label: isAr ? "4 أعمدة" : "4 Columns" },
                ]}
            />

            {/* Option to use gallery from dashboard */}
            <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-700">
                        {isAr ? "استخدام المعرض من لوحة التحكم" : "Use Gallery from Dashboard"}
                    </span>
                    <button
                        type="button"
                        onClick={loadFromDashboard}
                        className="rounded-full bg-blue-500 text-white px-3 py-1 text-[11px] hover:bg-blue-600"
                    >
                        {isAr ? "تحميل الصور" : "Load Images"} ({galleryImages.length})
                    </button>
                </div>
                <p className="text-[10px] text-blue-600">
                    {isAr
                        ? "سيتم تحميل جميع الصور من قسم المعارض في لوحة التحكم"
                        : "This will load all images from the Galleries section in the dashboard"
                    }
                </p>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الصور" : "Images"} ({items.length})</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    imageUrl: "/photo.jpg",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة صورة يدوياً" : "+ Add Image Manually"}
                    </button>
                </div>
                {items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <ImageField
                            label={isAr ? "الصورة" : "Image"}
                            value={item.imageUrl}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v } : i)))}
                        />
                        <InputField
                            label={isAr ? "النص البديل" : "Alt Text"}
                            value={item.alt ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
                            }
                        />
                        <InputField
                            label={isAr ? "التعليق" : "Caption"}
                            value={item.caption ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, caption: v || undefined } : i)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            {isAr ? "حذف الصورة" : "Delete Image"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function GalleryGridView({ block }: { block: GalleryGridBlock }) {
    const { language } = useLanguage()
    const isAr = language === "ar"
    const header = block.header
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Get localized text
    const getHeaderTitle = () => isAr ? header?.title : (header?.titleEn || header?.title)
    const getHeaderDescription = () => isAr ? header?.description : (header?.descriptionEn || header?.description)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""} dir={isAr ? "rtl" : "ltr"}>
                {getHeaderTitle() && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{getHeaderTitle()}</h2>
                        {getHeaderDescription() && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{getHeaderDescription()}</p>
                        )}
                    </div>
                )}
                <div className={`grid ${colsClass} gap-6`}>
                    {block.items.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:border-teal-400 dark:hover:border-teal-400 relative"
                        >
                            {/* Decorative corner accents */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none z-10" />

                            {/* Image Container */}
                            <div className="relative overflow-hidden">
                                {/* Category Badge */}
                                <div className="absolute top-4 end-4 z-20">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-teal-500 text-white shadow-lg">
                                        {isAr ? "المرافق" : "Facilities"}
                                    </span>
                                </div>

                                {/* Image */}
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.imageUrl || "/placeholder.svg"}
                                        alt={item.alt ?? ""}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Hover Overlay with Zoom Icon - only visible on hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                        <ZoomIn className="w-6 h-6 text-teal-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            {(item.alt || item.caption) && (
                                <div className="p-5 text-start">
                                    {item.alt && (
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                                            {item.alt}
                                        </h3>
                                    )}
                                    {item.caption && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {item.caption}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
