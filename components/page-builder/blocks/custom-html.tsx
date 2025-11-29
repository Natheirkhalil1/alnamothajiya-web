import * as React from "react"
import DOMPurify from "dompurify"
import { Block, CustomHtmlBlock } from "../types"
import { TextareaField, SectionContainer, applyBlockStyles } from "../utils"

export function CustomHtmlEditor({
    block,
    onChange,
}: {
    block: CustomHtmlBlock
    onChange: (b: Block) => void
}) {
    const [draft, setDraft] = React.useState(block.html)
    const [showPreview, setShowPreview] = React.useState(false)

    const handleBlur = () => {
        onChange({ ...block, html: draft })
    }

    const sanitizedHtml = DOMPurify.sanitize(draft, {
        ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "em",
            "u",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "a",
            "img",
            "div",
            "span",
            "table",
            "thead",
            "tbody",
            "tr",
            "td",
            "th",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
        ALLOW_DATA_ATTR: false,
    })

    return (
        <div className="space-y-3 text-[11px]">
            {/* تحذير أمني */}
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                <div className="flex gap-2 items-start">
                    <span className="text-amber-600">⚠️</span>
                    <div className="text-amber-800 text-[10px]">
                        <strong>تحذير أمني:</strong> سيتم تنقية HTML تلقائياً لحمايتك من XSS. العلامات والخصائص الخطرة سيتم حذفها.
                    </div>
                </div>
            </div>

            {/* أزرار التبديل */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`px-3 py-1 rounded text-[10px] ${!showPreview ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                    تحرير HTML
                </button>
                <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={`px-3 py-1 rounded text-[10px] ${showPreview ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                    معاينة
                </button>
            </div>

            {!showPreview ? (
                <TextareaField
                    label="HTML (سيتم تنقيته تلقائياً)"
                    value={draft}
                    onChange={setDraft}
                    rows={8}
                    onBlur={handleBlur}
                    className="font-mono text-[10px]"
                />
            ) : (
                <div className="border rounded-md p-3 bg-white min-h-[200px]">
                    <div className="text-[9px] text-gray-500 mb-2">المعاينة (بعد التنقية):</div>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                </div>
            )}

            {/* معلومات */}
            <div className="text-[9px] text-gray-500">
                العلامات المسموح بها: p, br, strong, em, u, h1-h6, ul, ol, li, a, img, div, span, table
            </div>
        </div>
    )
}

export function CustomHtmlView({ block }: { block: CustomHtmlBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // تنقية HTML قبل عرضه
    const sanitizedHtml = DOMPurify.sanitize(block.html, {
        ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "em",
            "u",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "a",
            "img",
            "div",
            "span",
            "table",
            "thead",
            "tbody",
            "tr",
            "td",
            "th",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
        ALLOW_DATA_ATTR: false,
    })

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </SectionContainer>
        </>
    )
}
