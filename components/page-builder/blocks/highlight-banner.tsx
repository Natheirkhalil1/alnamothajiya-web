import * as React from "react"
import { Block, HighlightBannerBlock } from "../types"
import { InputField, SelectField, TextareaField, applyBlockStyles } from "../utils"

export function HighlightBannerEditor({
    block,
    onChange,
}: {
    block: HighlightBannerBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<HighlightBannerBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={block.title} onChange={(v) => update({ title: v })} />
            <TextareaField label="نص" value={block.text ?? ""} onChange={(v) => update({ text: v || undefined })} rows={2} />
            <SelectField
                label="النمط"
                value={block.variant ?? "primary"}
                onChange={(v) => update({ variant: v as "primary" | "muted" })}
                options={[
                    { value: "primary", label: "رئيسي" },
                    { value: "muted", label: "هادئ" },
                ]}
            />
            <InputField label="نص الزر" value={block.ctaLabel ?? ""} onChange={(v) => update({ ctaLabel: v || undefined })} />
            <InputField label="رابط الزر" value={block.ctaHref ?? ""} onChange={(v) => update({ ctaHref: v || undefined })} />
        </div>
    )
}

export function HighlightBannerView({ block }: { block: HighlightBannerBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <div
                {...blockProps}
                className={`mb-4 rounded-lg p-4 shadow-sm ${block.variant === "muted" ? "bg-slate-100" : "bg-gradient-to-r from-emerald-50 to-blue-50"
                    } ${blockProps.className || ""}`}
            >
                <div className="flex items-center gap-3">
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-900">{block.title}</p>
                        {block.text && <p className="text-sm text-slate-700">{block.text}</p>}
                    </div>
                    {block.ctaLabel && block.ctaHref && (
                        <a
                            href={block.ctaHref}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            {block.ctaLabel}
                        </a>
                    )}
                </div>
            </div>
        </>
    )
}
