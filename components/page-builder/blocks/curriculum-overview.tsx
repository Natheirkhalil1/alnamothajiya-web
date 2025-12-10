import * as React from "react"
import { Block, CurriculumOverviewBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function CurriculumOverviewEditor({
    block,
    onChange,
}: {
    block: CurriculumOverviewBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateAreas = (updater: (areas: CurriculumOverviewBlock["areas"]) => CurriculumOverviewBlock["areas"]) =>
        onChange({ ...block, areas: updater(block.areas) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <TextareaField
                label="وصف"
                value={header.description ?? ""}
                onChange={(v) => updateHeader({ description: v || undefined })}
                rows={2}
            />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">المجالات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateAreas((areas) => [
                                ...areas,
                                {
                                    id: createId(),
                                    title: "مجال جديد",
                                    bulletPoints: [],
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة مجال
                    </button>
                </div>
                {block.areas.map((area) => (
                    <div key={area.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="عنوان المجال"
                            value={area.title}
                            onChange={(v) => updateAreas((areas) => areas.map((a) => (a.id === area.id ? { ...a, title: v } : a)))}
                        />
                        <TextareaField
                            label="وصف"
                            value={area.description ?? ""}
                            onChange={(v) =>
                                updateAreas((areas) => areas.map((a) => (a.id === area.id ? { ...a, description: v || undefined } : a)))
                            }
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => updateAreas((areas) => areas.filter((a) => a.id !== area.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف المجال
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function CurriculumOverviewView({ block }: { block: CurriculumOverviewBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                        {header.description && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                        )}
                    </div>
                )}
                <div className="space-y-6">
                    {block.areas.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                            </div>
                            {item.description && <p className="mb-3 text-slate-600">{item.description}</p>}
                            {item.bulletPoints && item.bulletPoints.length > 0 && (
                                <div>
                                    <p className="mb-2 text-sm font-semibold text-slate-700">المواضيع:</p>
                                    <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                                        {item.bulletPoints.map((topic, i) => (
                                            <li key={i}>{topic}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
