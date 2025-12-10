import * as React from "react"
import { BlockKind } from "./types"
import { blockCategories } from "./block-categories"
import { useLanguage } from "@/lib/language-context"

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
    const { language, t } = useLanguage()

    const filteredCategories = blockCategories
        .map((category) => ({
            ...category,
            blocks: category.blocks.filter((block) => {
                const label = language === "ar" ? block.labelAr : block.labelEn
                const description = language === "ar" ? block.descriptionAr : block.descriptionEn
                return (
                    label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    description.toLowerCase().includes(searchTerm.toLowerCase())
                )
            }),
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
                        <h2 className="text-xl font-bold text-white">{language === "ar" ? "اختر نوع البلوك" : "Select Block Type"}</h2>
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
                            placeholder={language === "ar" ? "بحث عن بلوك..." : "Search for a block..."}
                            className="w-full rounded-md border-0 bg-white/20 px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto p-6 bg-slate-50">
                    <div className="space-y-8">
                        {filteredCategories.map((category) => (
                            <div key={category.id}>
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                                    {language === "ar" ? category.nameAr : category.nameEn}
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {category.blocks.map((block) => (
                                        <button
                                            key={block.kind}
                                            onClick={() => {
                                                onAddBlock(block.kind)
                                                onClose()
                                            }}
                                            className="group flex flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-start shadow-sm transition-all hover:border-blue-500 hover:shadow-md hover:ring-1 hover:ring-blue-500"
                                        >
                                            <div className="mb-3 rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                                <block.icon className="h-6 w-6" />
                                            </div>
                                            <div className="font-semibold text-slate-900">
                                                {language === "ar" ? block.labelAr : block.labelEn}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                                                {language === "ar" ? block.descriptionAr : block.descriptionEn}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {filteredCategories.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <svg
                                    className="mb-4 h-12 w-12 opacity-20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p>{language === "ar" ? "لا توجد نتائج" : "No results found"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
