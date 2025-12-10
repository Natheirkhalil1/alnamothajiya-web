import * as React from "react"
import { Block, StatsBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function StatsEditor({
    block,
    onChange,
}: {
    block: StatsBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: StatsBlock["items"]) => StatsBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-2 text-[11px]">
            <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-700">الإحصائيات</span>
                    <button
                        type="button"
                        onClick={() => updateItems((items) => [...items, { id: createId(), label: "وصف", value: "0" }])}
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة رقم
                    </button>
                </div>
                {block.items.map((item) => (
                    <div
                        key={item.id}
                        className="grid gap-1 rounded-md border border-slate-200 bg-slate-50/60 p-2 md:grid-cols-3"
                    >
                        <InputField
                            label="Label"
                            value={item.label}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, label: v } : it)))
                            }
                        />
                        <InputField
                            label="Value"
                            value={item.value}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, value: v } : it)))
                            }
                        />
                        <InputField
                            label="Suffix"
                            value={item.suffix ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, suffix: v || undefined } : it)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
                            className="col-span-full text-[11px] text-red-500"
                        >
                            حذف الرقم
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StatsView({ block }: { block: StatsBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                {header && (
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        {header.title && <h2 className={nmTheme.textSection.title}>{header.title}</h2>}
                        {header.description && <p className="max-w-md text-xs md:text-sm text-slate-600">{header.description}</p>}
                    </div>
                )}
                <dl className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                    {block.items.map((item) => (
                        <div key={item.id} className={nmTheme.stats.card}>
                            <dt className={nmTheme.stats.label}>{item.label}</dt>
                            <dd className={nmTheme.stats.value}>
                                {item.value}
                                {item.suffix && <span className={nmTheme.stats.suffix}>{item.suffix}</span>}
                            </dd>
                        </div>
                    ))}
                </dl>
            </SectionContainer>
        </>
    )
}
