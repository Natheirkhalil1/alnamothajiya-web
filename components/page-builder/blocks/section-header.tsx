import * as React from "react"
import { Block, SectionHeaderBlock } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, applyBlockStyles } from "../utils"

export function SectionHeaderEditor({
    block,
    onChange,
}: {
    block: SectionHeaderBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<SectionHeaderBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="Eyebrow" value={block.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v || undefined })} />
            <InputField label="عنوان" value={block.title ?? ""} onChange={(v) => update({ title: v || undefined })} />
            <TextareaField
                label="وصف"
                value={block.description ?? ""}
                onChange={(v) => update({ description: v || undefined })}
                rows={3}
            />
            <SelectField
                label="المحاذاة"
                value={block.align ?? "center"}
                onChange={(v) => update({ align: v as "left" | "center" | "right" })}
                options={[
                    { value: "left", label: "يسار" },
                    { value: "center", label: "وسط" },
                    { value: "right", label: "يمين" },
                ]}
            />
        </div>
    )
}

export function SectionHeaderView({ block }: { block: SectionHeaderBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer>
                <div
                    {...blockProps}
                    className={`mb-8 ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left"} ${blockProps.className || ""}`}
                >
                    {block.eyebrow && (
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">{block.eyebrow}</p>
                    )}
                    <h2 className={nmTheme.textSection.title}>{block.title}</h2>
                    {block.description && (
                        <p
                            className={`mt-3 ${block.align === "center" ? "mx-auto" : ""} max-w-2xl ${nmTheme.textSection.description}`}
                        >
                            {block.description}
                        </p>
                    )}
                </div>
            </SectionContainer>
        </>
    )
}
