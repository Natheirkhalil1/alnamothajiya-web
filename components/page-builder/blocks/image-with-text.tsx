import * as React from "react"
import { Block, ImageWithTextBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, ImageField, SelectField, TextareaField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"
import { MonolingualSectionHeaderEditor, getLocalizedHeader } from "../bilingual-helpers"
import { useLanguage } from "@/lib/language-context"
import { useEditingLanguage } from "../editing-language-context"

export function ImageWithTextEditor({
    block,
    onChange,
}: {
    block: ImageWithTextBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"

    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<ImageWithTextBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <MonolingualSectionHeaderEditor header={header} onChange={updateHeader} language={editingLanguage} />

            {isAr ? (
                <TextareaField label="النص" value={block.textAr} onChange={(v) => update({ textAr: v })} rows={4} />
            ) : (
                <TextareaField label="Text" value={block.textEn} onChange={(v) => update({ textEn: v })} rows={4} />
            )}

            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label={isAr ? "موقع الصورة" : "Image Side"}
                    value={block.imageSide ?? "right"}
                    onChange={(v) => update({ imageSide: v as ImageWithTextBlock["imageSide"] })}
                    options={[
                        { value: "left", label: isAr ? "يسار" : "Left" },
                        { value: "right", label: isAr ? "يمين" : "Right" },
                    ]}
                />
            </div>

            <ImageField label={isAr ? "الصورة" : "Image"} value={block.imageUrl} onChange={(v) => update({ imageUrl: v })} />
            <InputField
                label={isAr ? "وصف الصورة (Alt)" : "Image Alt Text"}
                value={block.imageAlt ?? ""}
                onChange={(v) => update({ imageAlt: v || undefined })}
            />

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function ImageWithTextView({ block }: { block: ImageWithTextBlock }) {
    const { language } = useLanguage()
    const imageRight = block.imageSide !== "left"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = getLocalizedHeader(block.header, language)
    const text = language === "ar" ? (block.textAr || block.text) : (block.textEn || block.text)

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
                <div
                    className={`grid items-center gap-10 md:grid-cols-2 ${imageRight ? "" : "md:grid-flow-col-dense"}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                >
                    {!imageRight && (
                        <div>
                            {header.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{header.eyebrow}</p>}
                            {header.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
                            {text && <p className={nmTheme.textSection.body}>{text}</p>}
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
                            {header.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{header.eyebrow}</p>}
                            {header.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
                            {text && <p className={nmTheme.textSection.body}>{text}</p>}
                        </div>
                    )}
                </div>
            </SectionContainer>
        </>
    )
}
