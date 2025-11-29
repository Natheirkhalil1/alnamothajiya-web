import * as React from "react"
import { Block, DividerBlock } from "../types"
import { applyBlockStyles } from "../utils"

export function DividerEditor({ block, onChange }: { block: DividerBlock; onChange: (b: Block) => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="divider-visible"
                    checked={block.visible}
                    onChange={(e) => onChange({ ...block, visible: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="divider-visible" className="text-sm font-medium text-slate-700">Visible Line</label>
            </div>
        </div>
    )
}

export function DividerView({ block }: { block: DividerBlock }) {
    const style = block.style || "solid"
    const color = block.color || "#ccc"
    const thickness = block.thickness || 1
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <div {...blockProps} className={`py-6 ${blockProps.className || ""}`}>
                <hr
                    style={{
                        borderStyle: style,
                        borderColor: color,
                        borderWidth: `${thickness}px 0 0 0`,
                    }}
                />
            </div>
        </>
    )
}
