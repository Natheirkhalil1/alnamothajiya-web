import * as React from "react"
import { Block, HeroSplitBlock } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, applyBlockStyles } from "../utils"

export function HeroSplitEditor({
    block,
    onChange,
}: {
    block: HeroSplitBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<HeroSplitBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-2 text-[11px]">
            <InputField label="Title" value={block.title} onChange={(v) => update({ title: v })} />
            <TextareaField
                label="Subtitle"
                value={block.subtitle ?? ""}
                onChange={(v) => update({ subtitle: v || undefined })}
            />
            <SelectField
                label="Image side"
                value={block.imageSide ?? "right"}
                onChange={(v) => update({ imageSide: v as HeroSplitBlock["imageSide"] })}
                options={[
                    { value: "left", label: "يسار" },
                    { value: "right", label: "يمين" },
                ]}
            />
            <InputField
                label="Image URL"
                value={block.imageUrl ?? ""}
                onChange={(v) => update({ imageUrl: v || undefined })}
            />
            <InputField
                label="Image Alt"
                value={block.imageAlt ?? ""}
                onChange={(v) => update({ imageAlt: v || undefined })}
            />
        </div>
    )
}

export function HeroSplitView({ block }: { block: HeroSplitBlock }) {
    const imageRight = block.imageSide !== "left"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={`${nmTheme.hero.section} ${blockProps.className || ""}`}>
                <div className={`grid items-center gap-10 md:grid-cols-2 ${imageRight ? "" : "md:grid-flow-col-dense"}`}>
                    {!imageRight && block.imageUrl && (
                        <div className={nmTheme.hero.imageWrapper}>
                            <img
                                src={block.imageUrl || "/placeholder.svg"}
                                alt={block.imageAlt ?? ""}
                                className={nmTheme.hero.imageCard}
                            />
                        </div>
                    )}
                    <div>
                        <h1 className={`mb-3 ${nmTheme.hero.title}`}>{block.title}</h1>
                        {block.subtitle && <p className={`mb-6 max-w-xl ${nmTheme.hero.subtitle}`}>{block.subtitle}</p>}
                    </div>
                    {imageRight && block.imageUrl && (
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
