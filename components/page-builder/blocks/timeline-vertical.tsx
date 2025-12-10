import * as React from "react"
import { Block, TimelineVerticalBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"
import { IconPicker } from "../icon-picker"
import { IconByName } from "../icon-system"

export function TimelineVerticalEditor({
    block,
    onChange,
}: {
    block: TimelineVerticalBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<TimelineVerticalBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: TimelineVerticalBlock["items"]) => TimelineVerticalBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الأحداث</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    label: "حدث جديد",
                                    date: "2024",
                                    icon: "calendar",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة حدث
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <InputField
                            label="التاريخ"
                            value={item.date ?? ""}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, date: v } : i)))}
                            placeholder="2024"
                        />
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-slate-700">الأيقونة</span>
                            <IconPicker
                                value={item.icon ?? undefined}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, icon: v || null } : it)))
                                }
                            />
                        </div>
                        <InputField
                            label="العنوان"
                            value={item.title ?? ""}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
                        />
                        <TextareaField
                            label="الوصف"
                            value={item.description ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
                            }
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الحدث
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function TimelineVerticalView({ block }: { block: TimelineVerticalBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                    </div>
                )}
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200 md:before:ml-20">
                    {block.items.map((item) => (
                        <div key={item.id} className="relative flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white md:w-40">
                                {item.icon ? (
                                    <IconByName name={item.icon} className="h-5 w-5" />
                                ) : (
                                    item.date || item.label
                                )}
                            </div>
                            <div className="flex-grow pb-8">
                                <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title || item.label}</h3>
                                <p className="text-sm text-slate-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
