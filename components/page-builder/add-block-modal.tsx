import * as React from "react"
import { BlockKind } from "./types"
import { blockCategories } from "./block-categories"

export function AddBlockModal({
    isOpen,
    onClose,
    onAddBlock,
}: {
    isOpen: boolean
    onClose: () => void
    onAddBlock: (kind: BlockKind) => void
}) {
    const [searchTerm, setSearchTerm] = React.useState("")

    const filteredCategories = blockCategories
        .map((category) => ({
            ...category,
            blocks: category.blocks.filter(
                (block) =>
                    block.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    block.description.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        }))
        .filter((category) => category.blocks.length > 0)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="max-h-[90vh] w-full max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">اختر نوع البلوك</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Search */}
                    <div className="mt-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن بلوك..."
                            className="w-full rounded-md border-0 bg-white/20 px-4 py-2 text-white placeholder-white/60 backdrop-blur-sm focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
                    {filteredCategories.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">لا توجد نتائج للبحث</div>
                    ) : (
                        <div className="space-y-6">
                            {filteredCategories.map((category) => (
                                <div key={category.name}>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <category.icon className="h-5 w-5" />
                                        {category.name}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {category.blocks.map((block) => (
                                            <button
                                                key={block.kind}
                                                type="button"
                                                onClick={() => {
                                                    onAddBlock(block.kind)
                                                    onClose()
                                                }}
                                                className="group relative overflow-hidden rounded-lg border-2 border-slate-200 bg-white p-4 text-right transition-all hover:border-blue-500 hover:shadow-lg"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 transition-transform group-hover:scale-110">
                                                        <block.icon className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <div className="font-semibold text-slate-800">{block.label}</div>
                                                        <div className="mt-1 text-xs text-slate-500">{block.description}</div>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 transition-opacity group-hover:opacity-10" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
