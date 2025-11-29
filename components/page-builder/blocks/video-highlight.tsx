import * as React from "react"
import { Block, VideoHighlightBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SectionContainer, applyBlockStyles } from "../utils"

export function VideoHighlightEditor({
    block,
    onChange,
}: {
    block: VideoHighlightBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<VideoHighlightBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <InputField
                label="رابط الفيديو المضمن"
                value={block.embedUrl ?? ""}
                onChange={(v) => update({ embedUrl: v || undefined })}
            />
            <InputField
                label="رابط الفيديو"
                value={block.videoUrl ?? ""}
                onChange={(v) => update({ videoUrl: v || undefined })}
            />
            <InputField
                label="صورة مصغرة"
                value={block.thumbnailUrl ?? ""}
                onChange={(v) => update({ thumbnailUrl: v || undefined })}
            />
            <InputField label="التعليق" value={block.caption ?? ""} onChange={(v) => update({ caption: v || undefined })} />
        </div>
    )
}

export function VideoHighlightView({ block }: { block: VideoHighlightBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                {header?.title && (
                    <div className="mb-6 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                        {header.description && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                        )}
                    </div>
                )}
                <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                    {block.thumbnailUrl ? (
                        <div className="group relative h-full w-full cursor-pointer">
                            <img
                                src={block.thumbnailUrl || "/placeholder.svg"}
                                alt={block.title ?? ""}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                                <div className="rounded-full bg-white/90 p-4">
                                    <svg className="h-12 w-12 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ) : block.embedUrl || block.videoUrl ? (
                        <iframe
                            src={block.embedUrl || block.videoUrl}
                            className="h-full w-full"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : null}
                </div>
                {block.caption && <p className="mt-4 text-center text-sm text-slate-600">{block.caption}</p>}
            </SectionContainer>
        </>
    )
}
