import * as React from "react"
import { Block, RichTextBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"

export function RichTextEditor({
    block,
    onChange,
}: {
    block: RichTextBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<RichTextBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <TextareaField
                label="الوصف"
                value={header.description ?? ""}
                onChange={(v) => updateHeader({ description: v || undefined })}
                rows={3}
            />
            <TextareaField label="المحتوى" value={block.body} onChange={(v) => onChange({ ...block, body: v })} rows={6} />

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function RichTextView({ block }: { block: RichTextBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                <div {...blockProps} className={blockProps.className || ""}>
                    {header?.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
                    {header?.description && (
                        <p className={`mb-4 max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                    )}
                    <div className={`max-w-3xl ${nmTheme.textSection.body}`} dangerouslySetInnerHTML={{ __html: block.body }} />
                </div>
            </SectionContainer>
        </>
    )
}
