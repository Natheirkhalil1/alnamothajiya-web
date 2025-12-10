import * as React from "react"
import { Block, StepsHorizontalBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function StepsHorizontalEditor({
    block,
    onChange,
}: {
    block: StepsHorizontalBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const items = block.items || []
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: StepsHorizontalBlock["items"]) => StepsHorizontalBlock["items"]) =>
        onChange({ ...block, items: updater(items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الخطوات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((currentItems) => [
                                ...currentItems,
                                {
                                    id: createId(),
                                    stepNumber: currentItems.length + 1,
                                    title: "خطوة جديدة",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة خطوة
                    </button>
                </div>
                {items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="العنوان"
                            value={item.title}
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
                            حذف الخطوة
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StepsHorizontalView({ block }: { block: StepsHorizontalBlock }) {
    const header = block.header
    const items = block.items || []
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
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {items.map((item, index) => (
                        <div key={item.id} className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                    {index + 1}
                                </div>
                                {index < items.length - 1 && <div className="hidden h-0.5 flex-grow bg-slate-200 md:block"></div>}
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                            <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
