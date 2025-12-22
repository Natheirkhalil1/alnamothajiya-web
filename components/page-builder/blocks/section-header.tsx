import * as React from "react"
import { Block, SectionHeaderBlock } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function SectionHeaderEditor({
    block,
    onChange,
}: {
    block: SectionHeaderBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const update = (patch: Partial<SectionHeaderBlock>) => onChange({ ...block, ...patch })
    const isAr = editingLanguage === "ar"

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان الفرعي" : "Eyebrow"}
                value={isAr ? (block.eyebrowAr ?? "") : (block.eyebrowEn ?? "")}
                onChange={(v) => update(isAr ? { eyebrowAr: v || undefined } : { eyebrowEn: v || undefined })}
            />
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (block.titleAr ?? "") : (block.titleEn ?? "")}
                onChange={(v) => update(isAr ? { titleAr: v || undefined } : { titleEn: v || undefined })}
            />
            <TextareaField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (block.descriptionAr ?? "") : (block.descriptionEn ?? "")}
                onChange={(v) => update(isAr ? { descriptionAr: v || undefined } : { descriptionEn: v || undefined })}
                rows={3}
            />
            <SelectField
                label={isAr ? "المحاذاة" : "Alignment"}
                value={block.align ?? "center"}
                onChange={(v) => update({ align: v as "left" | "center" | "right" })}
                options={[
                    { value: "left", label: isAr ? "يسار" : "Left" },
                    { value: "center", label: isAr ? "وسط" : "Center" },
                    { value: "right", label: isAr ? "يمين" : "Right" },
                ]}
            />
        </div>
    )
}

export function SectionHeaderView({ block }: { block: SectionHeaderBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Get language-specific content with fallback
    const eyebrow = language === "ar" ? (block.eyebrowAr || block.eyebrow) : (block.eyebrowEn || block.eyebrow)
    const title = language === "ar" ? (block.titleAr || block.title) : (block.titleEn || block.title)
    const description = language === "ar" ? (block.descriptionAr || block.description) : (block.descriptionEn || block.description)

    // Use logical properties for RTL support
    const getAlignment = () => {
        if (block.align === "center") return "text-center"
        if (block.align === "right") return "text-end"
        return "text-start"
    }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer>
                <div
                    {...blockProps}
                    className={`mb-8 ${getAlignment()} ${blockProps.className || ""}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                >
                    {eyebrow && (
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">{eyebrow}</p>
                    )}
                    {title && <h2 className={nmTheme.textSection.title}>{title}</h2>}
                    {description && (
                        <p
                            className={`mt-3 ${block.align === "center" ? "mx-auto" : ""} max-w-2xl ${nmTheme.textSection.description}`}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </SectionContainer>
        </>
    )
}
