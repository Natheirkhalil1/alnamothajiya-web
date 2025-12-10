import * as React from "react"
import { Block, VideoEmbedBlock } from "../types"
import { InputField, SectionContainer } from "../utils"

export function VideoEmbedEditor({ block, onChange }: { block: VideoEmbedBlock; onChange: (b: Block) => void }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Video URL (YouTube/Vimeo)</label>
                <InputField value={block.url} onChange={(v) => onChange({ ...block, url: v })} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <InputField value={block.title} onChange={(v) => onChange({ ...block, title: v })} />
            </div>
        </div>
    )
}

export function VideoEmbedView({ block }: { block: VideoEmbedBlock }) {
    return (
        <SectionContainer>
            <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                <iframe
                    src={block.embedUrl}
                    className="h-full w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
            {block.caption && <p className="mt-4 text-center text-sm text-slate-600">{block.caption}</p>}
        </SectionContainer>
    )
}
