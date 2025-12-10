import * as React from "react"
import { Block, ProgramsGridBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"
import { IconPicker } from "../icon-picker"
import { IconByName } from "../icon-system"

export function ProgramsGridEditor({
    block,
    onChange,
}: {
    block: ProgramsGridBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<ProgramsGridBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: ProgramsGridBlock["items"]) => ProgramsGridBlock["items"]) =>
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
                    <span className="font-medium text-slate-700">البرامج</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    title: "برنامج جديد",
                                    description: "",
                                    icon: "book-open",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة برنامج
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
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
                            label="عنوان البرنامج"
                            value={item.title}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, title: v } : it)))
                            }
                        />
                        <InputField
                            label="الفئة العمرية"
                            value={item.ageRange ?? ""}
                            onChange={(v) =>
                                updateItems((items) =>
                                    items.map((it) => (it.id === item.id ? { ...it, ageRange: v || undefined } : it)),
                                )
                            }
                        />
                        <TextareaField
                            label="الوصف"
                            value={item.description}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, description: v } : it)))
                            }
                            rows={3}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف البرنامج
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div >
    )
}

export function ProgramsGridView({ block }: { block: ProgramsGridBlock }) {
    const header = block.header
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={`${!block.backgroundColor ? nmTheme.programs.sectionBg : ""} ${blockProps.className || ""}`}>
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                    </div>
                )}
                <div className={`grid gap-6 ${colsClass}`}>
                    {block.items.map((item) => (
                        <div key={item.id} className={nmTheme.programs.card}>
                            {item.icon && (
                                <div className={nmTheme.programs.icon}>
                                    <IconByName name={item.icon} className="h-8 w-8" />
                                </div>
                            )}
                            <h3 className={nmTheme.programs.title}>{item.title}</h3>
                            {item.ageRange && <p className={nmTheme.programs.ageRange}>{item.ageRange}</p>}
                            <p className={nmTheme.programs.description}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
