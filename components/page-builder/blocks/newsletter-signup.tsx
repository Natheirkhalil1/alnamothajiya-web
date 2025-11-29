import * as React from "react"
import { Block, NewsletterSignupBlock } from "../types"
import { InputField, TextareaField, SelectField, SectionContainer, applyBlockStyles } from "../utils"

export function NewsletterSignupEditor({
    block,
    onChange,
}: {
    block: NewsletterSignupBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<NewsletterSignupBlock>) => onChange({ ...block, ...patch })
    const updateHeader = (headerPatch: Partial<typeof block.header>) =>
        update({ header: { ...block.header, ...headerPatch } })

    return (
        <div className="space-y-3 text-[11px]">
            {/* Header Section */}
            <div className="rounded border border-emerald-200 bg-emerald-50/30 p-2 space-y-2">
                <div className="text-xs font-semibold text-emerald-700">العنوان</div>
                <InputField
                    label="عنوان فرعي"
                    value={block.header?.eyebrow ?? ""}
                    onChange={(v) => updateHeader({ eyebrow: v || undefined })}
                />
                <InputField
                    label="العنوان الرئيسي"
                    value={block.header?.title ?? ""}
                    onChange={(v) => updateHeader({ title: v || undefined })}
                />
                <TextareaField
                    label="الوصف"
                    value={block.header?.description ?? ""}
                    onChange={(v) => updateHeader({ description: v || undefined })}
                    rows={2}
                />
            </div>

            {/* Form Fields */}
            <div className="rounded border border-blue-200 bg-blue-50/30 p-2 space-y-2">
                <div className="text-xs font-semibold text-blue-700">النموذج</div>
                <InputField
                    label="نص حقل الإدخال"
                    value={block.placeholder ?? ""}
                    onChange={(v) => update({ placeholder: v || undefined })}
                />
                <InputField
                    label="نص الزر"
                    value={block.buttonText ?? ""}
                    onChange={(v) => update({ buttonText: v || undefined })}
                />
            </div>

            {/* Styling Options */}
            <div className="rounded border border-purple-200 bg-purple-50/30 p-2 space-y-2">
                <div className="text-xs font-semibold text-purple-700">التنسيق</div>

                <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-700">لون الخلفية</label>
                    <input
                        type="color"
                        value={block.backgroundColor ?? "#10b981"}
                        onChange={(e) => update({ backgroundColor: e.target.value })}
                        className="h-8 w-full rounded border border-slate-300"
                    />
                </div>

                <SelectField
                    label="التخطيط"
                    value={block.layout ?? "inline"}
                    onChange={(v) => update({ layout: v as "inline" | "stacked" })}
                    options={[
                        { value: "inline", label: "أفقي" },
                        { value: "stacked", label: "عمودي" },
                    ]}
                />

                <SelectField
                    label="النمط"
                    value={block.variant ?? "default"}
                    onChange={(v) => update({ variant: v as "default" | "minimal" | "card" })}
                    options={[
                        { value: "default", label: "افتراضي" },
                        { value: "minimal", label: "بسيط" },
                        { value: "card", label: "بطاقة" },
                    ]}
                />
            </div>
        </div>
    )
}

export function NewsletterSignupView({ block }: { block: NewsletterSignupBlock }) {
    const header = block.header
    const bgColor = block.backgroundColor ?? "#10b981"
    const layout = block.layout ?? "inline"
    const variant = block.variant ?? "default"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    const containerClass = variant === "card"
        ? "mx-auto max-w-3xl rounded-2xl shadow-2xl p-8 md:p-12"
        : "mx-auto max-w-2xl"

    const formClass = layout === "inline"
        ? "flex flex-col gap-3 sm:flex-row"
        : "flex flex-col gap-3"

    const inputClass = variant === "minimal"
        ? "flex-1 rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        : "flex-1 rounded-lg border-0 px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white"

    const buttonClass = variant === "minimal"
        ? "rounded-lg border-2 border-white bg-transparent px-6 py-3 font-semibold text-white transition hover:bg-white/10"
        : "rounded-lg bg-white px-6 py-3 font-semibold transition hover:opacity-90"

    const buttonStyle = variant === "minimal"
        ? {}
        : { color: bgColor }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                {...blockProps}
                className={`${variant === "card" ? "py-16" : ""} ${blockProps.className || ""}`}
                style={{ backgroundColor: variant === "card" ? "transparent" : bgColor, ...blockProps.style }}
            >
                <div className={containerClass} style={variant === "card" ? { backgroundColor: bgColor } : {}}>
                    <div className="text-center mb-6">
                        {header?.eyebrow && (
                            <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">
                                {header.eyebrow}
                            </div>
                        )}
                        {header?.title && (
                            <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                                {header.title}
                            </h2>
                        )}
                        {header?.description && (
                            <p className={`text-lg ${variant === "minimal" ? "text-white/80" : "text-white/90"}`}>
                                {header.description}
                            </p>
                        )}
                    </div>
                    <form className={formClass}>
                        <input
                            type="email"
                            placeholder={block.placeholder || "أدخل بريدك الإلكتروني"}
                            className={inputClass}
                        />
                        <button
                            type="submit"
                            className={buttonClass}
                            style={buttonStyle}
                        >
                            {block.buttonText || "اشترك"}
                        </button>
                    </form>
                </div>
            </SectionContainer>
        </>
    )
}
