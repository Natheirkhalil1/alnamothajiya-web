import * as React from "react"
import { Block, DownloadsListBlock, SectionHeader } from "../types"
import { InputField, SectionContainer, createId, applyBlockStyles } from "../utils"
import { SectionHeaderView } from "./section-header"

export function DownloadsListEditor({
    block,
    onChange,
}: {
    block: DownloadsListBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: DownloadsListBlock["items"]) => DownloadsListBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الملفات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    title: "ملف جديد",
                                    fileUrl: "/file.pdf",
                                    fileType: "PDF",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة ملف
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="العنوان"
                            value={item.title}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
                        />
                        <InputField
                            label="الوصف"
                            value={item.description ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
                            }
                        />
                        <InputField
                            label="رابط الملف"
                            value={item.fileUrl}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, fileUrl: v } : i)))}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="النوع"
                                value={item.fileType ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, fileType: v || undefined } : i)))
                                }
                            />
                            <InputField
                                label="الحجم"
                                value={item.fileSize ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, fileSize: v || undefined } : i)))
                                }
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الملف
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function DownloadsListView({ block }: { block: DownloadsListBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section {...blockProps} className={`py-12 ${blockProps.className || ""}`}>
                {block.header && (
                    <SectionHeaderView block={{ ...block, kind: "section-header", id: `${block.id}-header`, ...block.header }} />
                )}
                <div className="container mx-auto px-4">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {block.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e40af] transition-colors"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                                    {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>}
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        {item.fileType && <span className="uppercase font-medium">{item.fileType}</span>}
                                        {item.fileSize && <span>{item.fileSize}</span>}
                                    </div>
                                </div>
                                <a
                                    href={item.fileUrl}
                                    download
                                    className="flex-shrink-0 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors text-sm font-medium"
                                >
                                    تحميل
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
