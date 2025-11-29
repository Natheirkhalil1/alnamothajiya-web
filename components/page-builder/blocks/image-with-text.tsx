import * as React from "react"
import { Block, ImageWithTextBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"

export function ImageWithTextEditor({
    block,
    onChange,
}: {
    block: ImageWithTextBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<ImageWithTextBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <InputField label="العنوان الفرعي" value={header.eyebrow ?? ""} onChange={(v) => updateHeader({ eyebrow: v || undefined })} />
            <TextareaField label="النص" value={block.text} onChange={(v) => update({ text: v })} rows={4} />

            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="موقع الصورة"
                    value={block.imageSide ?? "right"}
                    onChange={(v) => update({ imageSide: v as ImageWithTextBlock["imageSide"] })}
                    options={[
                        { value: "left", label: "يسار" },
                        { value: "right", label: "يمين" },
                    ]}
                />
            </div>

            <InputField label="رابط الصورة" value={block.imageUrl} onChange={(v) => update({ imageUrl: v })} />
            <InputField
                label="وصف الصورة (Alt)"
                value={block.imageAlt ?? ""}
                onChange={(v) => update({ imageAlt: v || undefined })}
            />

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function ImageWithTextView({ block }: { block: ImageWithTextBlock }) {
    const imageRight = block.imageSide !== "left"
    const header = block.header
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
                <div className={`grid items-center gap-10 md:grid-cols-2 ${imageRight ? "" : "md:grid-flow-col-dense"}`}>
                    {!imageRight && (
                        <div>
                            {header?.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{header.eyebrow}</p>}
                            {header?.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
                            <p className={nmTheme.textSection.body}>{block.text}</p>
                        </div>
                    )}
                    <div className="relative h-64 w-full md:h-80">
                        <img
                            src={block.imageUrl || "/placeholder.svg"}
                            alt={block.imageAlt ?? ""}
                            className="h-full w-full rounded-3xl object-cover shadow-lg ring-1 ring-slate-200"
                        />
                    </div>
                    {imageRight && (
                        <div>
                            {header?.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{header.eyebrow}</p>}
                            {header?.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
                            <p className={nmTheme.textSection.body}>{block.text}</p>
                        </div>
                    )}
                </div>
            </SectionContainer>
        </>
    )
}
