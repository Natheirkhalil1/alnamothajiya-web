import * as React from "react"
import { Block, HeroBasicBlock } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"

export function HeroBasicEditor({
    block,
    onChange,
}: {
    block: HeroBasicBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<HeroBasicBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان الفرعي" value={block.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v || undefined })} />
            <InputField label="العنوان" value={block.title} onChange={(v) => update({ title: v })} />
            <TextareaField
                label="الوصف"
                value={block.subtitle ?? ""}
                onChange={(v) => update({ subtitle: v || undefined })}
            />
            <SelectField
                label="المحاذاة"
                value={block.align ?? "left"}
                onChange={(v) => update({ align: v as HeroBasicBlock["align"] })}
                options={[
                    { value: "left", label: "يسار" },
                    { value: "center", label: "وسط" },
                ]}
            />
            <div className="grid gap-2 md:grid-cols-2">
                <InputField
                    label="نص الزر الأساسي"
                    value={block.primaryCtaLabel ?? ""}
                    onChange={(v) => update({ primaryCtaLabel: v || undefined })}
                />
                <InputField
                    label="رابط الزر الأساسي"
                    value={block.primaryCtaHref ?? ""}
                    onChange={(v) => update({ primaryCtaHref: v || undefined })}
                />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
                <InputField
                    label="نص الزر الثانوي"
                    value={block.secondaryCtaLabel ?? ""}
                    onChange={(v) => update({ secondaryCtaLabel: v || undefined })}
                />
                <InputField
                    label="رابط الزر الثانوي"
                    value={block.secondaryCtaHref ?? ""}
                    onChange={(v) => update({ secondaryCtaHref: v || undefined })}
                />
            </div>
            <InputField
                label="رابط الصورة"
                value={block.imageUrl ?? ""}
                onChange={(v) => update({ imageUrl: v || undefined })}
            />
            <InputField
                label="وصف الصورة (Alt)"
                value={block.imageAlt ?? ""}
                onChange={(v) => update({ imageAlt: v || undefined })}
            />

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function HeroBasicView({ block }: { block: HeroBasicBlock }) {
    const alignCenter = block.align === "center"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

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
                >
                    <div>
                        {block.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{block.eyebrow}</p>}
                        <h1 className={`mb-3 ${nmTheme.hero.title}`}>{block.title}</h1>
                        {block.subtitle && <p className={`mb-6 max-w-xl ${nmTheme.hero.subtitle}`}>{block.subtitle}</p>}
                        <div className={`flex flex-wrap gap-3 ${alignCenter ? "justify-center" : ""}`}>
                            {block.primaryCtaLabel && block.primaryCtaHref && (
                                <a href={block.primaryCtaHref} className={nmTheme.hero.primaryBtn}>
                                    {block.primaryCtaLabel}
                                </a>
                            )}
                            {block.secondaryCtaLabel && block.secondaryCtaHref && (
                                <a href={block.secondaryCtaHref} className={nmTheme.hero.secondaryBtn}>
                                    {block.secondaryCtaLabel}
                                </a>
                            )}
                        </div>
                    </div>

                    {block.imageUrl && (
                        <div className={nmTheme.hero.imageWrapper}>
                            <img
                                src={block.imageUrl || "/placeholder.svg"}
                                alt={block.imageAlt ?? ""}
                                className={nmTheme.hero.imageCard}
                            />
                        </div>
                    )}
                </div>
            </SectionContainer>
        </>
    )
}
