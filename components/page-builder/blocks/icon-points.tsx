import * as React from "react"
import { Block, IconPointsBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"
import { IconPicker } from "../icon-picker"
import { IconByName } from "../icon-system"

export function IconPointsEditor({
    block,
    onChange,
}: {
    block: IconPointsBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const items = block.items || []
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: IconPointsBlock["items"]) => IconPointsBlock["items"]) =>
        onChange({ ...block, items: updater(items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">النقاط</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    icon: "star",
                                    title: "نقطة جديدة",
                                    description: "وصف...",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة نقطة
                    </button>
                </div>
                {items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-slate-700">الأيقونة</span>
                            <IconPicker
                                value={item.icon ?? undefined}
                                onChange={(v) =>
                                    updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, icon: v || null } : i)))
                                }
                            />
                        </div>
                        <InputField
                            label="عنوان"
                            value={item.title}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
                        />
                        <TextareaField
                            label="وصف"
                            value={item.description}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v } : i)))
                            }
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف النقطة
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function IconPointsView({ block }: { block: IconPointsBlock }) {
    const header = block.header
    const items = block.items || []
    const itemCount = items.length
    let colsClass = "grid-cols-1"
    if (itemCount >= 2) colsClass = "md:grid-cols-2"
    if (itemCount >= 3) colsClass = "lg:grid-cols-3"
    if (itemCount >= 4) colsClass = "xl:grid-cols-4"
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
                <div className={`grid ${colsClass} gap-6`}>
                    {items.map((item) => (
                        <div key={item.id} className="text-center">
                            {item.icon && (
                                <div className="mb-3 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconByName name={item.icon} className="h-8 w-8" />
                                    </div>
                                </div>
                            )}
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                            <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
