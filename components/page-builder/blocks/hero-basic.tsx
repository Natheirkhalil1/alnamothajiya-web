import * as React from "react"
import { Block, HeroBasicBlock } from "../types"
import { nmTheme } from "../theme"
import { InputField, ImageField, SelectField, TextareaField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function HeroBasicEditor({
    block,
    onChange,
}: {
    block: HeroBasicBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const update = (patch: Partial<HeroBasicBlock>) => onChange({ ...block, ...patch })
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
                value={isAr ? block.titleAr : block.titleEn}
                onChange={(v) => update(isAr ? { titleAr: v } : { titleEn: v })}
            />
            <TextareaField
                label={isAr ? "العنوان الفرعي" : "Subtitle"}
                value={isAr ? (block.subtitleAr ?? "") : (block.subtitleEn ?? "")}
                onChange={(v) => update(isAr ? { subtitleAr: v || undefined } : { subtitleEn: v || undefined })}
            />
            <TextareaField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (block.descriptionAr ?? "") : (block.descriptionEn ?? "")}
                onChange={(v) => update(isAr ? { descriptionAr: v || undefined } : { descriptionEn: v || undefined })}
            />
            <div className="grid gap-2 md:grid-cols-2">
                <InputField
                    label={isAr ? "نص الزر الأساسي" : "Primary CTA Label"}
                    value={isAr ? (block.primaryCtaLabelAr ?? "") : (block.primaryCtaLabelEn ?? "")}
                    onChange={(v) => update(isAr ? { primaryCtaLabelAr: v || undefined } : { primaryCtaLabelEn: v || undefined })}
                />
                <InputField
                    label={isAr ? "رابط الزر الأساسي" : "Primary CTA Link"}
                    value={block.primaryCtaHref ?? ""}
                    onChange={(v) => update({ primaryCtaHref: v || undefined })}
                />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
                <InputField
                    label={isAr ? "نص الزر الثانوي" : "Secondary CTA Label"}
                    value={isAr ? (block.secondaryCtaLabelAr ?? "") : (block.secondaryCtaLabelEn ?? "")}
                    onChange={(v) => update(isAr ? { secondaryCtaLabelAr: v || undefined } : { secondaryCtaLabelEn: v || undefined })}
                />
                <InputField
                    label={isAr ? "رابط الزر الثانوي" : "Secondary CTA Link"}
                    value={block.secondaryCtaHref ?? ""}
                    onChange={(v) => update({ secondaryCtaHref: v || undefined })}
                />
            </div>

            <SelectField
                label={isAr ? "المحاذاة" : "Alignment"}
                value={block.align ?? "center"}
                onChange={(v) => update({ align: v as HeroBasicBlock["align"] })}
                options={[
                    { value: "left", label: isAr ? "يسار" : "Left" },
                    { value: "center", label: isAr ? "وسط" : "Center" },
                ]}
            />
            <ImageField
                label={isAr ? "الصورة" : "Image"}
                value={block.imageUrl ?? ""}
                onChange={(v) => update({ imageUrl: v || undefined })}
            />
            <InputField
                label={isAr ? "وصف الصورة (Alt)" : "Image Alt Text"}
                value={block.imageAlt ?? ""}
                onChange={(v) => update({ imageAlt: v || undefined })}
            />

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function HeroBasicView({ block }: { block: HeroBasicBlock }) {
    const { language } = useLanguage()
    const alignCenter = block.align === "center"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Get language-specific content with fallback
    const eyebrow = language === "ar" ? (block.eyebrowAr || block.eyebrow) : (block.eyebrowEn || block.eyebrow)
    const title = language === "ar" ? (block.titleAr || block.title) : (block.titleEn || block.title)
    const subtitle = language === "ar" ? (block.subtitleAr || block.subtitle) : (block.subtitleEn || block.subtitle)
    const description = language === "ar" ? (block.descriptionAr || block.description) : (block.descriptionEn || block.description)
    const primaryCtaLabel = language === "ar" ? (block.primaryCtaLabelAr || block.primaryCtaLabel) : (block.primaryCtaLabelEn || block.primaryCtaLabel)
    const secondaryCtaLabel = language === "ar" ? (block.secondaryCtaLabelAr || block.secondaryCtaLabel) : (block.secondaryCtaLabelEn || block.secondaryCtaLabel)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                className={nmTheme.hero.section}
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                <div
                    {...blockProps}
                    className={`grid items-center gap-10 md:grid-cols-2 ${alignCenter ? "text-center" : ""} ${blockProps.className || ""}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                >
                    <div>
                        {eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{eyebrow}</p>}
                        <h1 className={`mb-3 ${nmTheme.hero.title}`}>{title}</h1>
                        {subtitle && <p className={`mb-6 max-w-xl ${nmTheme.hero.subtitle}`}>{subtitle}</p>}
                        {description && <p className={`mb-6 max-w-xl ${nmTheme.hero.subtitle}`}>{description}</p>}
                        <div className={`flex flex-wrap gap-3 ${alignCenter ? "justify-center" : ""}`}>
                            {primaryCtaLabel && block.primaryCtaHref && (
                                <a href={block.primaryCtaHref} className={nmTheme.hero.primaryBtn}>
                                    {primaryCtaLabel}
                                </a>
                            )}
                            {secondaryCtaLabel && block.secondaryCtaHref && (
                                <a href={block.secondaryCtaHref} className={nmTheme.hero.secondaryBtn}>
                                    {secondaryCtaLabel}
                                </a>
                            )}
                        </div>
                    </div>
                    {block.imageUrl && (
                        <div>
                            <img src={block.imageUrl} alt={block.imageAlt || title || ""} className="w-full rounded-lg" />
                        </div>
                    )}
                </div>
            </SectionContainer>
        </>
    )
}
