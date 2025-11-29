import * as React from "react"
import { Block, GalleryGridBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function GalleryGridEditor({
    block,
    onChange,
}: {
    block: GalleryGridBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: GalleryGridBlock["items"]) => GalleryGridBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <SelectField
                label="الأعمدة"
                value={String(block.columns)}
                onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
                options={[
                    { value: "2", label: "عمودين" },
                    { value: "3", label: "3 أعمدة" },
                    { value: "4", label: "4 أعمدة" },
                ]}
            />
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
                                    imageUrl: "/photo.jpg",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة صورة
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="رابط الصورة"
                            value={item.imageUrl}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v } : i)))}
                        />
                        <InputField
                            label="النص البديل"
                            value={item.alt ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
                            }
                        />
                        <InputField
                            label="التعليق"
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
                            حذف الصورة
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function GalleryGridView({ block }: { block: GalleryGridBlock }) {
    const header = block.header
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

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
                <div className={`grid ${colsClass} gap-4`}>
                    {block.items.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-lg">
                            <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.alt ?? ""}
                                className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                            {item.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <p className="text-sm font-medium text-white">{item.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
