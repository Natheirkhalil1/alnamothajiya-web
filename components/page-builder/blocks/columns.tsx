import * as React from "react"
import { Block, ColumnsBlock } from "../types"
import { SelectField, SectionContainer, StylingGroup, applyBlockStyles, blockLabel } from "../utils"
import { getBlockView, getBlockEditor } from "../registry"
import { Settings, Trash2, Plus, GripVertical } from "lucide-react"
import { useEditingLanguage } from "../editing-language-context"

// Helper to normalize column slots data that may be corrupted from Firestore
function normalizeColumnSlots(data: any): Block[][] {
    if (!data) return []
    // Handle case where columnSlots itself is an object (corrupted from Firestore)
    let slots = data
    if (!Array.isArray(slots) && typeof slots === "object") {
        const restored: any[] = []
        for (const [key, value] of Object.entries(slots as Record<string, any>)) {
            if (key === "__isNestedArray") continue
            const index = parseInt(key, 10)
            if (!isNaN(index)) {
                restored[index] = value
            }
        }
        slots = restored
    }
    if (!Array.isArray(slots)) return []
    return slots.map(normalizeColumnBlocks)
}

// Helper to normalize column blocks data that may be corrupted from Firestore
function normalizeColumnBlocks(data: any): Block[] {
    if (!data) return []
    // Already an array
    if (Array.isArray(data)) return data
    // JSON string (from previous fix attempt)
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    // Object with __isNestedArray marker or numeric keys
    if (typeof data === "object") {
        const result: Block[] = []
        for (const [key, value] of Object.entries(data)) {
            if (key === "__isNestedArray") continue
            const index = parseInt(key, 10)
            if (!isNaN(index)) {
                result[index] = value as Block
            }
        }
        return result
    }
    return []
}

export function ColumnsEditor({
    block,
    onChange,
    onNestedBlockSettings,
}: {
    block: ColumnsBlock
    onChange: (b: Block) => void
    onNestedBlockSettings?: (path: string[], block: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<ColumnsBlock>) => onChange({ ...block, ...patch })

    // Normalize columnSlots to handle corrupted Firestore data
    const columnSlots = normalizeColumnSlots(block.columnSlots)

    const handleColumnsChange = (newCount: number) => {
        const currentSlots = [...columnSlots]
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

    const handleNestedBlockClick = (columnIndex: number, nestedBlock: Block) => {
        if (onNestedBlockSettings) {
            onNestedBlockSettings([block.id, String(columnIndex), nestedBlock.id], nestedBlock)
        }
    }

    const handleRemoveNestedBlock = (columnIndex: number, blockId: string) => {
        const newSlots = [...columnSlots]
        newSlots[columnIndex] = newSlots[columnIndex].filter(b => b.id !== blockId)
        update({ columnSlots: newSlots })
    }

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <SelectField
                label={isAr ? "عدد الأعمدة" : "Columns"}
                value={String(block.columns)}
                onChange={(v) => handleColumnsChange(Number(v))}
                options={[
                    { value: "2", label: isAr ? "عمودين" : "2 Columns" },
                    { value: "3", label: isAr ? "3 أعمدة" : "3 Columns" },
                    { value: "4", label: isAr ? "4 أعمدة" : "4 Columns" },
                ]}
            />
            <SelectField
                label={isAr ? "المسافة بين الأعمدة" : "Gap"}
                value={block.gap ?? "md"}
                onChange={(v) => update({ gap: v as "sm" | "md" | "lg" })}
                options={[
                    { value: "sm", label: isAr ? "صغيرة" : "Small" },
                    { value: "md", label: isAr ? "متوسطة" : "Medium" },
                    { value: "lg", label: isAr ? "كبيرة" : "Large" },
                ]}
            />

            {/* Nested Blocks Management */}
            <div className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                    {isAr ? "البلوكات المتداخلة" : "Nested Blocks"}
                </label>

                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${block.columns}, 1fr)` }}>
                    {Array.from({ length: block.columns }).map((_, columnIndex) => (
                        <div key={columnIndex} className="space-y-2">
                            <div className="text-[10px] font-medium text-slate-500 text-center">
                                {isAr ? `عمود ${columnIndex + 1}` : `Column ${columnIndex + 1}`}
                            </div>
                            <div className="min-h-[60px] rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-2 space-y-2">
                                {(columnSlots[columnIndex] || []).map((nestedBlock) => (
                                    <div
                                        key={nestedBlock.id}
                                        className="group flex items-center gap-1 rounded-md border border-slate-200 bg-white p-2 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => handleNestedBlockClick(columnIndex, nestedBlock)}
                                    >
                                        <GripVertical className="h-3 w-3 text-slate-300 flex-shrink-0" />
                                        <span className="flex-1 text-[10px] text-slate-600 truncate">
                                            {blockLabel(nestedBlock.kind)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleNestedBlockClick(columnIndex, nestedBlock)
                                            }}
                                            className="p-1 rounded hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors"
                                            title={isAr ? "إعدادات" : "Settings"}
                                        >
                                            <Settings className="h-3 w-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveNestedBlock(columnIndex, nestedBlock.id)
                                            }}
                                            className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                                            title={isAr ? "حذف" : "Delete"}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {(columnSlots[columnIndex] || []).length === 0 && (
                                    <div className="text-[10px] text-slate-400 text-center py-2">
                                        {isAr ? "فارغ" : "Empty"}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded border border-blue-200 bg-blue-50/50 p-2 text-center text-[10px] text-blue-600">
                    {isAr
                        ? "💡 اسحب البلوكات من محرر الصفحة وأفلتها في الأعمدة"
                        : "💡 Drag blocks from the page editor and drop them into columns"
                    }
                </div>
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function ColumnsView({ block }: { block: ColumnsBlock }) {
    const gapClass = block.gap === "sm" ? "gap-4" : block.gap === "lg" ? "gap-10" : "gap-6"
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Normalize columnSlots to handle corrupted Firestore data
    const columnSlots = normalizeColumnSlots(block.columnSlots)

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
                    {columnSlots.map((columnBlocks, columnIndex) => (
                        <div key={columnIndex} className="space-y-4">
                            {columnBlocks.map((nestedBlock) => {
                                const ViewComponent = getBlockView(nestedBlock.kind)
                                if (!ViewComponent) return null
                                return <ViewComponent key={nestedBlock.id} block={nestedBlock} />
                            })}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
