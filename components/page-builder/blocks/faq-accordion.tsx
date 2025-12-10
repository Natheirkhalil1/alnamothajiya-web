import * as React from "react"
import { Block, FaqAccordionBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SectionContainer, createId, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

export function FaqAccordionEditor({
    block,
    onChange,
}: {
    block: FaqAccordionBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: FaqAccordionBlock["items"]) => FaqAccordionBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "عنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <TextareaField
                label={isAr ? "وصف" : "Description"}
                value={isAr ? (header.description ?? "") : (header.descriptionEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { description: v || undefined } : { descriptionEn: v || undefined })}
                rows={2}
            />
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الأسئلة" : "Questions"}</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    question: "سؤال جديد",
                                    questionEn: "New Question",
                                    answer: "الإجابة...",
                                    answerEn: "Answer...",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة سؤال" : "+ Add Question"}
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label={isAr ? "السؤال" : "Question"}
                            value={isAr ? item.question : (item.questionEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, question: v } : { ...i, questionEn: v }) : i)))
                            }
                        />
                        <TextareaField
                            label={isAr ? "الإجابة" : "Answer"}
                            value={isAr ? item.answer : (item.answerEn ?? "")}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, answer: v } : { ...i, answerEn: v }) : i)))}
                            rows={3}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            {isAr ? "حذف السؤال" : "Delete Question"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function FaqAccordionView({ block }: { block: FaqAccordionBlock }) {
    const { language } = useLanguage()
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Language-specific helpers
    const getHeaderTitle = () => language === "ar" ? header?.title : (header?.titleEn || header?.title)
    const getHeaderDescription = () => language === "ar" ? header?.description : (header?.descriptionEn || header?.description)
    const getQuestion = (item: FaqAccordionBlock["items"][0]) => language === "ar" ? item.question : (item.questionEn || item.question)
    const getAnswer = (item: FaqAccordionBlock["items"][0]) => language === "ar" ? item.answer : (item.answerEn || item.answer)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={`${nmTheme.faq.sectionBg} ${blockProps.className || ""}`}>
                {getHeaderTitle() && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{getHeaderTitle()}</h2>
                        {getHeaderDescription() && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{getHeaderDescription()}</p>
                        )}
                    </div>
                )}
                <div className="mx-auto max-w-3xl space-y-4" dir={language === "ar" ? "rtl" : "ltr"}>
                    {block.items.map((item) => (
                        <details key={item.id} className={nmTheme.faq.item}>
                            <summary className={nmTheme.faq.question}>{getQuestion(item)}</summary>
                            <p className={nmTheme.faq.answer}>{getAnswer(item)}</p>
                        </details>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
