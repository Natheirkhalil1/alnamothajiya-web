import * as React from "react"
import { Block, ImageAlbumsBlock } from "../types"
import { InputField, ImageField, TextareaField, createId, StylingGroup, applyBlockStyles } from "../utils"
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, FolderOpen } from "lucide-react"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function ImageAlbumsEditor({ block, onChange }: { block: ImageAlbumsBlock; onChange: (b: Block) => void }) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<typeof header>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<ImageAlbumsBlock>) => onChange({ ...block, ...patch })
    const updateAlbums = (updater: (albums: ImageAlbumsBlock["albums"]) => ImageAlbumsBlock["albums"]) =>
        onChange({ ...block, albums: updater(block.albums) })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <InputField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (header.description ?? "") : (header.descriptionEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { description: v || undefined } : { descriptionEn: v || undefined })}
            />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الألبومات" : "Albums"}</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateAlbums((albums) => [
                                ...albums,
                                {
                                    id: createId(),
                                    title: "ألبوم جديد",
                                    titleEn: "New Album",
                                    coverImage: "",
                                    images: [],
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة ألبوم" : "+ Add Album"}
                    </button>
                </div>
                {block.albums.map((album) => (
                    <div key={album.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <InputField
                            label={isAr ? "العنوان" : "Title"}
                            value={isAr ? album.title : (album.titleEn ?? "")}
                            onChange={(v) =>
                                updateAlbums((albums) => albums.map((a) => (a.id === album.id ? (isAr ? { ...a, title: v } : { ...a, titleEn: v || undefined }) : a)))
                            }
                        />
                        <TextareaField
                            label={isAr ? "الوصف" : "Description"}
                            value={isAr ? (album.description ?? "") : (album.descriptionEn ?? "")}
                            onChange={(v) =>
                                updateAlbums((albums) =>
                                    albums.map((a) => (a.id === album.id ? (isAr ? { ...a, description: v || undefined } : { ...a, descriptionEn: v || undefined }) : a))
                                )
                            }
                            rows={2}
                        />
                        <ImageField
                            label={isAr ? "صورة الغلاف" : "Cover Image"}
                            value={album.coverImage}
                            onChange={(v) =>
                                updateAlbums((albums) => albums.map((a) => (a.id === album.id ? { ...a, coverImage: v } : a)))
                            }
                            placeholder="/images/cover.jpg"
                        />

                        {/* Images in Album */}
                        <div className="mt-2 space-y-1 border-t pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium text-slate-600">{isAr ? `صور الألبوم (${album.images.length})` : `Album Photos (${album.images.length})`}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateAlbums((albums) =>
                                            albums.map((a) =>
                                                a.id === album.id
                                                    ? { ...a, images: [...a.images, { id: createId(), imageUrl: "", alt: "" }] }
                                                    : a
                                            )
                                        )
                                    }
                                    className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px]"
                                >
                                    {isAr ? "+ صورة" : "+ Photo"}
                                </button>
                            </div>
                            {album.images.map((image) => (
                                <div key={image.id} className="space-y-1 rounded border border-slate-200 bg-white p-2">
                                    <ImageField
                                        label={isAr ? "رابط الصورة" : "Image URL"}
                                        value={image.imageUrl}
                                        onChange={(v) =>
                                            updateAlbums((albums) =>
                                                albums.map((a) =>
                                                    a.id === album.id
                                                        ? {
                                                            ...a,
                                                            images: a.images.map((img) =>
                                                                img.id === image.id ? { ...img, imageUrl: v } : img
                                                            ),
                                                        }
                                                        : a
                                                )
                                            )
                                        }
                                        placeholder="/images/photo.jpg"
                                    />
                                    <InputField
                                        label={isAr ? "التعليق" : "Caption"}
                                        value={isAr ? (image.caption ?? "") : (image.captionEn ?? "")}
                                        onChange={(v) =>
                                            updateAlbums((albums) =>
                                                albums.map((a) =>
                                                    a.id === album.id
                                                        ? {
                                                            ...a,
                                                            images: a.images.map((img) =>
                                                                img.id === image.id ? (isAr ? { ...img, caption: v || undefined } : { ...img, captionEn: v || undefined }) : img
                                                            ),
                                                        }
                                                        : a
                                                )
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateAlbums((albums) =>
                                                albums.map((a) =>
                                                    a.id === album.id
                                                        ? { ...a, images: a.images.filter((img) => img.id !== image.id) }
                                                        : a
                                                )
                                            )
                                        }
                                        className="text-[10px] text-red-500"
                                    >
                                        {isAr ? "حذف" : "Delete"}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => updateAlbums((albums) => albums.filter((a) => a.id !== album.id))}
                            className="text-[11px] text-red-500"
                        >
                            {isAr ? "حذف الألبوم" : "Delete Album"}
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function ImageAlbumsView({ block }: { block: ImageAlbumsBlock }) {
    const { language } = useLanguage()
    const [expandedAlbumId, setExpandedAlbumId] = React.useState<string | null>(null)
    const [lightboxData, setLightboxData] = React.useState<{ albumId: string; imageIndex: number } | null>(null)
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = block.header

    // Language-specific helpers
    const getHeaderTitle = () => language === "ar" ? header?.title : (header?.titleEn || header?.title)
    const getHeaderDescription = () => language === "ar" ? header?.description : (header?.descriptionEn || header?.description)
    const getAlbumTitle = (album: any) => language === "ar" ? album.title : (album.titleEn || album.title)
    const getAlbumDescription = (album: any) => language === "ar" ? album.description : (album.descriptionEn || album.description)
    const getImageCaption = (image: any) => language === "ar" ? image.caption : (image.captionEn || image.caption)
    const getPhotosText = (count: number) => language === "ar" ? `${count} صور` : `${count} photos`
    const getBackText = () => language === "ar" ? "عودة للألبومات" : "Back to Albums"
    const getNoPhotosText = () => language === "ar" ? "لا توجد صور في هذا الألبوم" : "No photos in this album"

    const expandedAlbum = block.albums.find((a) => a.id === expandedAlbumId)
    const lightboxImages = expandedAlbum?.images ?? []

    // Keyboard navigation for lightbox
    React.useEffect(() => {
        if (!lightboxData) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setLightboxData(null)
            } else if (e.key === "ArrowLeft") {
                setLightboxData((prev) =>
                    prev
                        ? {
                            ...prev,
                            imageIndex: prev.imageIndex > 0 ? prev.imageIndex - 1 : lightboxImages.length - 1,
                        }
                        : null
                )
            } else if (e.key === "ArrowRight") {
                setLightboxData((prev) =>
                    prev
                        ? {
                            ...prev,
                            imageIndex: prev.imageIndex < lightboxImages.length - 1 ? prev.imageIndex + 1 : 0,
                        }
                        : null
                )
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [lightboxData, lightboxImages.length])

    const openLightbox = (albumId: string, imageIndex: number) => {
        setLightboxData({ albumId, imageIndex })
    }

    const closeLightbox = () => setLightboxData(null)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="py-16 px-4" {...blockProps} dir={language === "ar" ? "rtl" : "ltr"}>
                <div className="container mx-auto max-w-7xl">
                    {header && (
                        <div className="text-center mb-12">
                            {getHeaderTitle() && <h2 className="text-4xl font-bold mb-4">{getHeaderTitle()}</h2>}
                            {getHeaderDescription() && <p className="text-lg text-muted-foreground">{getHeaderDescription()}</p>}
                        </div>
                    )}

                    {/* Albums Grid */}
                    {!expandedAlbumId && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {block.albums.map((album) => (
                                <div
                                    key={album.id}
                                    onClick={() => setExpandedAlbumId(album.id)}
                                    className="group cursor-pointer bg-card border-2 border-border hover:border-primary rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={album.coverImage || "/placeholder.svg"}
                                            alt={getAlbumTitle(album)}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                                            <div className="text-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FolderOpen className="w-5 h-5" />
                                                    <span className="text-sm font-semibold">{getPhotosText(album.images.length)}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold">{getAlbumTitle(album)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    {getAlbumDescription(album) && (
                                        <div className="p-6">
                                            <p className="text-muted-foreground">{getAlbumDescription(album)}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Expanded Album */}
                    {expandedAlbumId && expandedAlbum && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">{getAlbumTitle(expandedAlbum)}</h3>
                                    {getAlbumDescription(expandedAlbum) && (
                                        <p className="text-muted-foreground">{getAlbumDescription(expandedAlbum)}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setExpandedAlbumId(null)}
                                    className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-full font-semibold transition-colors"
                                >
                                    {getBackText()}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {expandedAlbum.images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        onClick={() => openLightbox(expandedAlbumId, index)}
                                        className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        <img
                                            src={image.imageUrl || "/placeholder.svg"}
                                            alt={image.alt ?? ""}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {getImageCaption(image) && (
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-medium">{getImageCaption(image)}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {expandedAlbum.images.length === 0 && (
                                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                                    <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground text-lg">{getNoPhotosText()}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightboxData && lightboxImages[lightboxData.imageIndex] && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Previous Button */}
                    {lightboxImages.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setLightboxData((prev) =>
                                    prev
                                        ? {
                                            ...prev,
                                            imageIndex: prev.imageIndex > 0 ? prev.imageIndex - 1 : lightboxImages.length - 1,
                                        }
                                        : null
                                )
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            aria-label="Previous"
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>
                    )}

                    {/* Next Button */}
                    {lightboxImages.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setLightboxData((prev) =>
                                    prev
                                        ? {
                                            ...prev,
                                            imageIndex: prev.imageIndex < lightboxImages.length - 1 ? prev.imageIndex + 1 : 0,
                                        }
                                        : null
                                )
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
                            src={lightboxImages[lightboxData.imageIndex].imageUrl}
                            alt={lightboxImages[lightboxData.imageIndex].alt ?? ""}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        {getImageCaption(lightboxImages[lightboxData.imageIndex]) && (
                            <div className="mt-4 text-center">
                                <p className="text-white text-lg font-medium">{getImageCaption(lightboxImages[lightboxData.imageIndex])}</p>
                            </div>
                        )}
                    </div>

                    {/* Image Counter */}
                    {lightboxImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                            <p className="text-white text-sm font-medium">
                                {lightboxData.imageIndex + 1} / {lightboxImages.length}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
