import * as React from "react"
import { Block, BoardOrTeamListBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function BoardOrTeamListEditor({
    block,
    onChange,
}: {
    block: BoardOrTeamListBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: BoardOrTeamListBlock["items"]) => BoardOrTeamListBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الأعضاء</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    name: "اسم",
                                    role: "دور",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة عضو
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="الاسم"
                            value={item.name}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, name: v } : i)))}
                        />
                        <InputField
                            label="الدور"
                            value={item.role}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, role: v } : i)))}
                        />
                        <TextareaField
                            label="وصف"
                            value={item.description ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
                            }
                            rows={2}
                        />
                        <InputField
                            label="صورة"
                            value={item.imageUrl ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v || undefined } : i)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف العضو
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function BoardOrTeamListView({ block }: { block: BoardOrTeamListBlock }) {
    const header = block.header
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
                <div className="space-y-4">
                    {block.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl || "/placeholder.svg"}
                                    alt={item.name}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            )}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                <p className="text-sm text-emerald-600">{item.role}</p>
                                {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
