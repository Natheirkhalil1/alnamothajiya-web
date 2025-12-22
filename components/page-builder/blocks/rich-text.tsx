import * as React from "react"
import { Block, RichTextBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { TextareaField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"
import { MonolingualSectionHeaderEditor, getLocalizedHeader } from "../bilingual-helpers"
import { useLanguage } from "@/lib/language-context"
import { useEditingLanguage } from "../editing-language-context"

export function RichTextEditor({
    block,
    onChange,
}: {
    block: RichTextBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"

    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<RichTextBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <MonolingualSectionHeaderEditor header={header} onChange={updateHeader} language={editingLanguage} />

            {isAr ? (
                <TextareaField label="المحتوى" value={block.bodyAr} onChange={(v) => update({ bodyAr: v })} rows={6} />
            ) : (
                <TextareaField label="Content" value={block.bodyEn} onChange={(v) => update({ bodyEn: v })} rows={6} />
            )}

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function RichTextView({ block }: { block: RichTextBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = getLocalizedHeader(block.header, language)
    const body = language === "ar" ? (block.bodyAr || block.body) : (block.bodyEn || block.body)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                <div {...blockProps} className={blockProps.className || ""} dir={language === "ar" ? "rtl" : "ltr"}>
                    {header.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
                    {header.description && (
                        <p className={`mb-4 max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                    )}
                    {body && <div className={`max-w-3xl ${nmTheme.textSection.body}`} dangerouslySetInnerHTML={{ __html: body }} />}
                </div>
            </SectionContainer>
        </>
    )
}
