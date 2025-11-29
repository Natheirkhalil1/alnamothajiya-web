import * as React from "react"
import { Block, ImageAlbumsBlock } from "../types"
import { InputField, TextareaField, createId, StylingGroup, applyBlockStyles } from "../utils"
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, FolderOpen } from "lucide-react"

export function ImageAlbumsEditor({ block, onChange }: { block: ImageAlbumsBlock; onChange: (b: Block) => void }) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<typeof header>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<ImageAlbumsBlock>) => onChange({ ...block, ...patch })
    const updateAlbums = (updater: (albums: ImageAlbumsBlock["albums"]) => ImageAlbumsBlock["albums"]) =>
        onChange({ ...block, albums: updater(block.albums) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <InputField
                label="الوصف"
                value={header.description ?? ""}
                onChange={(v) => updateHeader({ description: v || undefined })}
            />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الألبومات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateAlbums((albums) => [
                                ...albums,
                                {
                                    id: createId(),
                                    title: "ألبوم جديد",
                                    coverImage: "",
                                    images: [],
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة ألبوم
                    </button>
                </div>
                {block.albums.map((album) => (
                    <div key={album.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="العنوان (عربي)"
                                value={album.title}
                                onChange={(v) =>
                                    updateAlbums((albums) => albums.map((a) => (a.id === album.id ? { ...a, title: v } : a)))
                                }
                            />
                            <InputField
                                label="العنوان (English)"
                                value={album.titleEn ?? ""}
                                onChange={(v) =>
                                    updateAlbums((albums) =>
                                        albums.map((a) => (a.id === album.id ? { ...a, titleEn: v || undefined } : a))
                                    )
                                }
                            />
                        </div>
                        <TextareaField
                            label="الوصف (عربي)"
                            value={album.description ?? ""}
                            onChange={(v) =>
                                updateAlbums((albums) =>
                                    albums.map((a) => (a.id === album.id ? { ...a, description: v || undefined } : a))
                                )
                            }
                            rows={2}
                        />
                        <InputField
                            label="صورة الغلاف"
                            value={album.coverImage}
                            onChange={(v) =>
                                updateAlbums((albums) => albums.map((a) => (a.id === album.id ? { ...a, coverImage: v } : a)))
                            }
                            placeholder="/images/cover.jpg"
                        />

                        {/* Images in Album */}
                        <div className="mt-2 space-y-1 border-t pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium text-slate-600">صور الألبوم ({album.images.length})</span>
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
                                    + صورة
                                </button>
                            </div>
                            {album.images.map((image) => (
                                <div key={image.id} className="space-y-1 rounded border border-slate-200 bg-white p-2">
                                    <InputField
                                        label="رابط الصورة"
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
                                        label="التعليق"
                                        value={image.caption ?? ""}
                                        onChange={(v) =>
                                            updateAlbums((albums) =>
                                                albums.map((a) =>
                                                    a.id === album.id
                                                        ? {
                                                            ...a,
                                                            images: a.images.map((img) =>
                                                                img.id === image.id ? { ...img, caption: v || undefined } : img
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
                                        حذف
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => updateAlbums((albums) => albums.filter((a) => a.id !== album.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الألبوم
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function ImageAlbumsView({ block }: { block: ImageAlbumsBlock }) {
    const [expandedAlbumId, setExpandedAlbumId] = React.useState<string | null>(null)
    const [lightboxData, setLightboxData] = React.useState<{ albumId: string; imageIndex: number } | null>(null)
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = block.header

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
            <section className="py-16 px-4" {...blockProps}>
                <div className="container mx-auto max-w-7xl">
                    {header && (
                        <div className="text-center mb-12">
                            {header.title && <h2 className="text-4xl font-bold mb-4">{header.title}</h2>}
                            {header.description && <p className="text-lg text-muted-foreground">{header.description}</p>}
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
                                            alt={album.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                                            <div className="text-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FolderOpen className="w-5 h-5" />
                                                    <span className="text-sm font-semibold">{album.images.length} صور</span>
                                                </div>
                                                <h3 className="text-2xl font-bold">{album.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    {album.description && (
                                        <div className="p-6">
                                            <p className="text-muted-foreground">{album.description}</p>
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
                                    <h3 className="text-3xl font-bold mb-2">{expandedAlbum.title}</h3>
                                    {expandedAlbum.description && (
                                        <p className="text-muted-foreground">{expandedAlbum.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setExpandedAlbumId(null)}
                                    className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-full font-semibold transition-colors"
                                >
                                    عودة للألبومات
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
                                        {image.caption && (
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-medium">{image.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {expandedAlbum.images.length === 0 && (
                                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                                    <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground text-lg">لا توجد صور في هذا الألبوم</p>
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
                        {lightboxImages[lightboxData.imageIndex].caption && (
                            <div className="mt-4 text-center">
                                <p className="text-white text-lg font-medium">{lightboxImages[lightboxData.imageIndex].caption}</p>
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
