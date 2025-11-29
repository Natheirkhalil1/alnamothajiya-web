import * as React from "react"
import { Block, StaffGridBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"

export function StaffGridEditor({
    block,
    onChange,
}: {
    block: StaffGridBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<StaffGridBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: StaffGridBlock["items"]) => StaffGridBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <SelectField
                label="الأعمدة"
                value={String(block.columns)}
                onChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
                options={[
                    { value: "2", label: "عمودين" },
                    { value: "3", label: "3 أعمدة" },
                    { value: "4", label: "4 أعمدة" },
                ]}
            />
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
                                    name: "اسم العضو",
                                    role: "الدور",
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
                        <InputField
                            label="صورة"
                            value={item.photoUrl ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, photoUrl: v || undefined } : i)))
                            }
                        />
                        <TextareaField
                            label="نبذة"
                            value={item.bioShort ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, bioShort: v || undefined } : i)))
                            }
                            rows={2}
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

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function StaffGridView({ block }: { block: StaffGridBlock }) {
    const header = block.header
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                {...blockProps}
                className={blockProps.className || ""}
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                        {header.description && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                        )}
                    </div>
                )}
                <div className={`grid ${colsClass} gap-6`}>
                    {block.items.map((item) => (
                        <div key={item.id} className="text-center">
                            {item.photoUrl && (
                                <img
                                    src={item.photoUrl || "/placeholder.svg"}
                                    alt={item.name}
                                    className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-md"
                                />
                            )}
                            <h3 className="mb-1 text-lg font-semibold text-slate-900">{item.name}</h3>
                            <p className="mb-2 text-sm font-medium text-emerald-600">{item.role}</p>
                            {item.bioShort && <p className="text-sm text-slate-600">{item.bioShort}</p>}
                            {item.email && (
                                <a
                                    href={`mailto:${item.email}`}
                                    className="mt-2 inline-block text-xs text-slate-500 hover:text-emerald-600"
                                >
                                    {item.email}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
