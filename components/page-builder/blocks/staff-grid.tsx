import * as React from "react"
import { Block, StaffGridBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, ImageField, SelectField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function StaffGridEditor({
    block,
    onChange,
}: {
    block: StaffGridBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<StaffGridBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: StaffGridBlock["items"]) => StaffGridBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <SelectField
                label={isAr ? "الأعمدة" : "Columns"}
                value={String(block.columns)}
                onChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
                options={[
                    { value: "2", label: isAr ? "عمودين" : "2 Columns" },
                    { value: "3", label: isAr ? "3 أعمدة" : "3 Columns" },
                    { value: "4", label: isAr ? "4 أعمدة" : "4 Columns" },
                ]}
            />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الأعضاء" : "Members"}</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    name: "اسم العضو",
                                    nameEn: "Member Name",
                                    role: "الدور",
                                    roleEn: "Role",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة عضو" : "+ Add Member"}
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label={isAr ? "الاسم" : "Name"}
                            value={isAr ? item.name : (item.nameEn ?? "")}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, name: v } : { ...i, nameEn: v }) : i)))}
                        />
                        <InputField
                            label={isAr ? "الدور" : "Role"}
                            value={isAr ? item.role : (item.roleEn ?? "")}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, role: v } : { ...i, roleEn: v }) : i)))}
                        />
                        <ImageField
                            label={isAr ? "الصورة" : "Photo"}
                            value={item.photoUrl ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, photoUrl: v || undefined } : i)))
                            }
                        />
                        <TextareaField
                            label={isAr ? "نبذة" : "Bio"}
                            value={isAr ? (item.bioShort ?? "") : (item.bioShortEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, bioShort: v || undefined } : { ...i, bioShortEn: v || undefined }) : i)))
                            }
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            {isAr ? "حذف العضو" : "Delete Member"}
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function StaffGridView({ block }: { block: StaffGridBlock }) {
    const { language } = useLanguage()
    const header = block.header
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Language-specific helpers
    const getHeaderTitle = () => language === "ar" ? header?.title : (header?.titleEn || header?.title)
    const getHeaderDescription = () => language === "ar" ? header?.description : (header?.descriptionEn || header?.description)
    const getName = (item: StaffGridBlock["items"][0]) => language === "ar" ? item.name : (item.nameEn || item.name)
    const getRole = (item: StaffGridBlock["items"][0]) => language === "ar" ? item.role : (item.roleEn || item.role)
    const getBio = (item: StaffGridBlock["items"][0]) => language === "ar" ? item.bioShort : (item.bioShortEn || item.bioShort)

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
                {getHeaderTitle() && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{getHeaderTitle()}</h2>
                        {getHeaderDescription() && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{getHeaderDescription()}</p>
                        )}
                    </div>
                )}
                <div className={`grid ${colsClass} gap-6`} dir={language === "ar" ? "rtl" : "ltr"}>
                    {block.items.map((item) => (
                        <div key={item.id} className="text-center">
                            {item.photoUrl && (
                                <img
                                    src={item.photoUrl || "/placeholder.svg"}
                                    alt={getName(item)}
                                    className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-md"
                                />
                            )}
                            <h3 className="mb-1 text-lg font-semibold text-slate-900">{getName(item)}</h3>
                            <p className="mb-2 text-sm font-medium text-emerald-600">{getRole(item)}</p>
                            {getBio(item) && <p className="text-sm text-slate-600">{getBio(item)}</p>}
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
