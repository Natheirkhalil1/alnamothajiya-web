import * as React from "react"
import { Block, MapBlock } from "../types"
import { InputField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"
import { nmTheme } from "../theme"

export function MapEditor({ block, onChange }: { block: MapBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<MapBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={block.title ?? ""} onChange={(v) => update({ title: v || undefined })} />
            <InputField label="رابط التضمين (Embed URL)" value={block.embedUrl} onChange={(v) => update({ embedUrl: v })} />
            <InputField label="الارتفاع" value={block.height ?? "400px"} onChange={(v) => update({ height: v || undefined })} />

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function MapView({ block }: { block: MapBlock }) {
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
                {block.title && (
                    <div className="mb-6 text-center">
                        <h2 className={`${nmTheme.textSection.title}`}>{block.title}</h2>
                    </div>
                )}
                <div
                    className="w-full rounded-lg overflow-hidden shadow-lg"
                    style={{ height: block.height || "400px" }}
                >
                    <iframe
                        src={block.embedUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </SectionContainer>
        </>
    )
}
