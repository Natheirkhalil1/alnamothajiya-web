import * as React from "react"
import { Block, CtaStripBlock } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SelectField, SectionContainer, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function CtaStripEditor({
    block,
    onChange,
}: {
    block: CtaStripBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<CtaStripBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            {/* Content Section */}
            <div className="space-y-2">
                <InputField
                    label={isAr ? "العنوان" : "Title"}
                    value={isAr ? block.title : (block.titleEn ?? "")}
                    onChange={(v) => update(isAr ? { title: v } : { titleEn: v })}
                />
                <TextareaField
                    label={isAr ? "النص" : "Text"}
                    value={isAr ? (block.text ?? "") : (block.textEn ?? "")}
                    onChange={(v) => update(isAr ? { text: v || undefined } : { textEn: v || undefined })}
                    rows={3}
                />
            </div>

            {/* Primary CTA */}
            <div className="rounded border border-blue-200 bg-blue-50/30 p-2 space-y-2">
                <div className="text-xs font-semibold text-blue-700">{isAr ? "الزر الأساسي" : "Primary Button"}</div>
                <div className="grid gap-2 md:grid-cols-2">
                    <InputField
                        label={isAr ? "النص" : "Label"}
                        value={isAr ? block.primaryCtaLabel : (block.primaryCtaLabelEn ?? "")}
                        onChange={(v) => update(isAr ? { primaryCtaLabel: v } : { primaryCtaLabelEn: v })}
                    />
                    <InputField
                        label={isAr ? "الرابط" : "Link"}
                        value={block.primaryCtaHref}
                        onChange={(v) => update({ primaryCtaHref: v })}
                    />
                </div>
            </div>

            {/* Secondary CTA */}
            <div className="rounded border border-slate-200 bg-slate-50/30 p-2 space-y-2">
                <div className="text-xs font-semibold text-slate-700">{isAr ? "الزر الثانوي (اختياري)" : "Secondary Button (optional)"}</div>
                <div className="grid gap-2 md:grid-cols-2">
                    <InputField
                        label={isAr ? "النص" : "Label"}
                        value={isAr ? (block.secondaryCtaLabel ?? "") : (block.secondaryCtaLabelEn ?? "")}
                        onChange={(v) => update(isAr ? { secondaryCtaLabel: v || undefined } : { secondaryCtaLabelEn: v || undefined })}
                    />
                    <InputField
                        label={isAr ? "الرابط" : "Link"}
                        value={block.secondaryCtaHref ?? ""}
                        onChange={(v) => update({ secondaryCtaHref: v || undefined })}
                    />
                </div>
            </div>

            {/* Styling Options */}
            <div className="rounded border border-purple-200 bg-purple-50/30 p-2 space-y-2">
                <div className="text-xs font-semibold text-purple-700">{isAr ? "التنسيق" : "Styling"}</div>

                <SelectField
                    label={isAr ? "النمط" : "Variant"}
                    value={block.variant ?? "default"}
                    onChange={(v) => update({ variant: v as "default" | "gradient" | "outlined" })}
                    options={[
                        { value: "default", label: isAr ? "افتراضي" : "Default" },
                        { value: "gradient", label: isAr ? "متدرج" : "Gradient" },
                        { value: "outlined", label: isAr ? "محدد" : "Outlined" },
                    ]}
                />

                <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-slate-700">{isAr ? "لون الخلفية" : "Background Color"}</label>
                        <input
                            type="color"
                            value={block.backgroundColor ?? "#3b82f6"}
                            onChange={(e) => update({ backgroundColor: e.target.value })}
                            className="h-8 w-full rounded border border-slate-300"
                        />
                    </div>

                    <SelectField
                        label={isAr ? "المحاذاة" : "Alignment"}
                        value={block.alignment ?? "left"}
                        onChange={(v) => update({ alignment: v as "left" | "center" | "right" })}
                        options={[
                            { value: "left", label: isAr ? "يسار" : "Left" },
                            { value: "center", label: isAr ? "وسط" : "Center" },
                            { value: "right", label: isAr ? "يمين" : "Right" },
                        ]}
                    />
                </div>

                <SelectField
                    label={isAr ? "الحجم" : "Size"}
                    value={block.size ?? "md"}
                    onChange={(v) => update({ size: v as "sm" | "md" | "lg" })}
                    options={[
                        { value: "sm", label: isAr ? "صغير" : "Small" },
                        { value: "md", label: isAr ? "متوسط" : "Medium" },
                        { value: "lg", label: isAr ? "كبير" : "Large" },
                    ]}
                />
            </div>
        </div>
    )
}

export function CtaStripView({ block }: { block: CtaStripBlock }) {
    const { language } = useLanguage()
    const variant = block.variant ?? "default"
    const alignment = block.alignment ?? "left"
    const size = block.size ?? "md"
    const bgColor = block.backgroundColor ?? "#3b82f6"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Language-specific helpers
    const getTitle = () => language === "ar" ? block.title : (block.titleEn || block.title)
    const getText = () => language === "ar" ? block.text : (block.textEn || block.text)
    const getPrimaryLabel = () => language === "ar" ? block.primaryCtaLabel : (block.primaryCtaLabelEn || block.primaryCtaLabel)
    const getSecondaryLabel = () => language === "ar" ? block.secondaryCtaLabel : (block.secondaryCtaLabelEn || block.secondaryCtaLabel)

    // Size classes
    const sizeClasses = {
        sm: { padding: "py-8", title: "text-xl md:text-2xl", text: "text-sm", button: "px-4 py-2 text-sm" },
        md: { padding: "py-12", title: "text-2xl md:text-3xl", text: "text-base", button: "px-6 py-3 text-base" },
        lg: { padding: "py-16", title: "text-3xl md:text-4xl", text: "text-lg", button: "px-8 py-4 text-lg" },
    }

    const sizes = sizeClasses[size]

    // Alignment classes
    const alignClasses = {
        left: "text-left items-start",
        center: "text-center items-center",
        right: "text-right items-end",
    }

    // Variant styles
    const getVariantStyles = () => {
        switch (variant) {
            case "gradient":
                return {
                    background: `linear-gradient(135deg, ${bgColor}, ${adjustColor(bgColor, -30)})`,
                    border: "none",
                }
            case "outlined":
                return {
                    background: "transparent",
                    border: `2px solid ${bgColor}`,
                }
            default:
                return {
                    background: bgColor,
                    border: "none",
                }
        }
    }

    const variantStyles = getVariantStyles()
    const textColor = variant === "outlined" ? bgColor : "white"

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={`${sizes.padding} ${blockProps.className || ""}`} style={{ ...variantStyles, ...blockProps.style }}>
                <div className={`flex flex-col gap-4 md:flex-row md:justify-between ${alignClasses[alignment]}`} dir={language === "ar" ? "rtl" : "ltr"}>
                    <div className="flex-1">
                        <h2 className={`${sizes.title} font-bold mb-2`} style={{ color: textColor }}>
                            {getTitle()}
                        </h2>
                        {getText() && (
                            <p className={`${sizes.text} opacity-90`} style={{ color: textColor }}>
                                {getText()}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={block.primaryCtaHref}
                            className={`${sizes.button} rounded-lg font-semibold transition hover:opacity-90`}
                            style={{
                                background: variant === "outlined" ? bgColor : "white",
                                color: variant === "outlined" ? "white" : bgColor,
                            }}
                        >
                            {getPrimaryLabel()}
                        </a>
                        {getSecondaryLabel() && block.secondaryCtaHref && (
                            <a
                                href={block.secondaryCtaHref}
                                className={`${sizes.button} rounded-lg font-semibold transition hover:opacity-80`}
                                style={{
                                    background: "transparent",
                                    color: textColor,
                                    border: `2px solid ${textColor}`,
                                }}
                            >
                                {getSecondaryLabel()}
                            </a>
                        )}
                    </div>
                </div>
            </SectionContainer>
        </>
    )
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
    const num = parseInt(color.replace("#", ""), 16)
    const r = Math.max(0, Math.min(255, (num >> 16) + amount))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount))
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}
