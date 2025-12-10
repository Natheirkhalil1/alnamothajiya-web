"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import { Code } from "lucide-react"

interface CustomCssModalProps {
    open: boolean
    onClose: () => void
    initialCss: string
    onSave: (css: string) => void
    language?: "ar" | "en"
}

export function CustomCssModal({ open, onClose, initialCss, onSave, language = "ar" }: CustomCssModalProps) {
    const [cssCode, setCssCode] = useState(initialCss)
    const isAr = language === "ar"

    const handleSave = () => {
        onSave(cssCode)
        onClose()
    }

    const handleCancel = () => {
        setCssCode(initialCss)
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="max-h-[90vh] w-full max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b p-4 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        <h2 className="text-xl font-bold">{isAr ? "محرر CSS المخصص" : "Custom CSS Editor"}</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden border rounded-lg m-4" dir="ltr">
                    <CodeMirror
                        value={cssCode}
                        height="500px"
                        extensions={[css()]}
                        onChange={(value) => setCssCode(value)}
                        theme="light"
                        className="text-sm text-left"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                        basicSetup={{
                            lineNumbers: true,
                            highlightActiveLineGutter: true,
                            highlightSpecialChars: true,
                            foldGutter: true,
                            drawSelection: true,
                            dropCursor: true,
                            allowMultipleSelections: true,
                            indentOnInput: true,
                            syntaxHighlighting: true,
                            bracketMatching: true,
                            closeBrackets: true,
                            autocompletion: true,
                            rectangularSelection: true,
                            crosshairCursor: true,
                            highlightActiveLine: true,
                            highlightSelectionMatches: true,
                            closeBracketsKeymap: true,
                            searchKeymap: true,
                            foldKeymap: true,
                            completionKeymap: true,
                            lintKeymap: true,
                        }}
                    />
                </div>

                <div className="mx-4 mb-4 text-xs text-slate-500 space-y-1 p-3 bg-slate-50 rounded-lg border" dir={isAr ? "rtl" : "ltr"}>
                    <p className="font-semibold">💡 {isAr ? "نصائح:" : "Tips:"}</p>
                    <ul className={`list-disc list-inside space-y-1 ${isAr ? "mr-2" : "ml-2"}`}>
                        <li>{isAr ? "يمكنك استهداف البلوكات باستخدام الأسماء والمعرفات المولدة تلقائياً" : "You can target blocks using auto-generated class names and IDs"}</li>
                        <li>{isAr ? "سيتم تطبيق الأنماط على الصفحة المعاينة والصفحة المنشورة" : "Styles will be applied to preview and published pages"}</li>
                        <li>{isAr ? "استخدم أدوات المطور في المتصفح لمعرفة أسماء الفئات" : "Use browser DevTools to find class names"}</li>
                    </ul>
                </div>

                <div className="border-t p-4 flex justify-end gap-2 bg-gray-50">
                    <Button variant="outline" onClick={handleCancel}>
                        {isAr ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {isAr ? "حفظ التغييرات" : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
