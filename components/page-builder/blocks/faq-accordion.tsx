import * as React from "react"
import { Block, FaqAccordionBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function FaqAccordionEditor({
    block,
    onChange,
}: {
    block: FaqAccordionBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: FaqAccordionBlock["items"]) => FaqAccordionBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

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
                    <span className="font-medium text-slate-700">الأسئلة</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    question: "سؤال جديد",
                                    answer: "الإجابة...",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة سؤال
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="السؤال"
                            value={item.question}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, question: v } : i)))
                            }
                        />
                        <TextareaField
                            label="الإجابة"
                            value={item.answer}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, answer: v } : i)))}
                            rows={3}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف السؤال
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function FaqAccordionView({ block }: { block: FaqAccordionBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={`${nmTheme.faq.sectionBg} ${blockProps.className || ""}`}>
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                        {header.description && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                        )}
                    </div>
                )}
                <div className="mx-auto max-w-3xl space-y-4">
                    {block.items.map((item) => (
                        <details key={item.id} className={nmTheme.faq.item}>
                            <summary className={nmTheme.faq.question}>{item.question}</summary>
                            <p className={nmTheme.faq.answer}>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
