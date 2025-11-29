import * as React from "react"
import { Block, ColumnsBlock } from "../types"
import { SelectField, SectionContainer, StylingGroup, applyBlockStyles } from "../utils"
import { getBlockView } from "../registry"

export function ColumnsEditor({
    block,
    onChange,
}: {
    block: ColumnsBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<ColumnsBlock>) => onChange({ ...block, ...patch })

    const handleColumnsChange = (newCount: number) => {
        const currentSlots = block.columnSlots || []
        const newSlots = [...currentSlots]

        // Add empty slots if increasing
        while (newSlots.length < newCount) {
            newSlots.push([])
        }

        // Remove extra slots if decreasing (keep the blocks from removed columns)
        if (newSlots.length > newCount) {
            newSlots.splice(newCount)
        }

        update({ columns: newCount as 2 | 3 | 4, columnSlots: newSlots })
    }

    return (
        <div className="space-y-3 text-[11px]">
            <SelectField
                label="عدد الأعمدة"
                value={String(block.columns)}
                onChange={(v) => handleColumnsChange(Number(v))}
                options={[
                    { value: "2", label: "عمودين" },
                    { value: "3", label: "3 أعمدة" },
                    { value: "4", label: "4 أعمدة" },
                ]}
            />
            <SelectField
                label="المسافة بين الأعمدة"
                value={block.gap ?? "md"}
                onChange={(v) => update({ gap: v as "sm" | "md" | "lg" })}
                options={[
                    { value: "sm", label: "صغيرة" },
                    { value: "md", label: "متوسطة" },
                    { value: "lg", label: "كبيرة" },
                ]}
            />

            <div className="mt-4 rounded border border-blue-200 bg-blue-50/50 p-3 text-center text-xs text-blue-700">
                <p>💡 يمكنك إضافة وتحرير البلوكات المتداخلة مباشرة من محرر الصفحة الرئيسي</p>
            </div>

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function ColumnsView({ block }: { block: ColumnsBlock }) {
    const gapClass = block.gap === "sm" ? "gap-4" : block.gap === "lg" ? "gap-10" : "gap-6"
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
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
                <div className={`grid ${colsClass} ${gapClass}`}>
                    {block.columnSlots.map((columnBlocks, columnIndex) => (
                        <div key={columnIndex} className="space-y-4">
                            {columnBlocks.map((nestedBlock) => {
                                const ViewComponent = getBlockView(nestedBlock.kind)
                                return <ViewComponent key={nestedBlock.id} block={nestedBlock} />
                            })}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
