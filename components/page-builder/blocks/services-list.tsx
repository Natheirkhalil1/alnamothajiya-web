import * as React from "react"
import { Block, ServicesListBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"
import { IconPicker } from "../icon-picker"
import { IconByName } from "../icon-system"

export function ServicesListEditor({
    block,
    onChange,
}: {
    block: ServicesListBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<ServicesListBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: ServicesListBlock["items"]) => ServicesListBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <SelectField
                label="التخطيط (Layout)"
                value={block.layout ?? "grid"}
                onChange={(v) => update({ layout: v as ServicesListBlock["layout"] })}
                options={[
                    { value: "grid", label: "شبكة" },
                    { value: "list", label: "قائمة" },
                ]}
            />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الخدمات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    title: "خدمة جديدة",
                                    description: "وصف مختصر.",
                                    icon: "zap",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة خدمة
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
                            label="عنوان الخدمة"
                            value={item.title}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, title: v } : it)))
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
                            حذف الخدمة
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function ServicesListView({ block }: { block: ServicesListBlock }) {
    const header = block.header
    const isGrid = block.layout !== "list"
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
                    <div className="mb-6 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                    </div>
                )}
                <div className={isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-4"}>
                    {block.items.map((item) => (
                        <div key={item.id} className={nmTheme.services.card}>
                            {item.icon && (
                                <div className={nmTheme.services.icon}>
                                    <IconByName name={item.icon} className="h-7 w-7" />
                                </div>
                            )}
                            <div>
                                <h3 className={nmTheme.services.title}>{item.title}</h3>
                                <p className={nmTheme.services.description}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
