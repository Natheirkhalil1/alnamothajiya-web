import * as React from "react"
import { Block, LogosStripBlock, SectionHeader } from "../types"
import { InputField, ImageField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function LogosStripEditor({
    block,
    onChange,
}: {
    block: LogosStripBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: LogosStripBlock["items"]) => LogosStripBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الشعارات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    logoUrl: "/logo.png",
                                    alt: "شعار",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة شعار
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <ImageField
                            label="الشعار"
                            value={item.logoUrl}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, logoUrl: v } : i)))}
                        />
                        <InputField
                            label="النص البديل"
                            value={item.alt ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
                            }
                        />
                        <InputField
                            label="رابط الموقع"
                            value={item.href ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, href: v || undefined } : i)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الشعار
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function LogosStripView({ block }: { block: LogosStripBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500`}>{header.title}</h2>
                    </div>
                )}
                <div className="flex flex-wrap items-center justify-center gap-8">
                    {block.items.map((logo) => (
                        <div key={logo.id} className="grayscale transition hover:grayscale-0">
                            <img src={logo.logoUrl || "/placeholder.svg"} alt={logo.alt ?? ""} className="h-12 w-auto object-contain" />
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
