import * as React from "react"
import { Block, SpacerBlock } from "../types"
import { InputField, applyBlockStyles } from "../utils"

export function SpacerEditor({ block, onChange }: { block: SpacerBlock; onChange: (b: Block) => void }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Height (px)</label>
                <input
                    type="number"
                    value={block.height}
                    onChange={(e) => onChange({ ...block, height: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
            </div>
        </div>
    )
}

export function SpacerView({ block }: { block: SpacerBlock }) {
    const height = block.height || 50
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <div {...blockProps} style={{ height: `${height}px`, ...blockProps.style }} className={blockProps.className || ""} />
        </>
    )
}
