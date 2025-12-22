"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { Code, AlertTriangle } from "lucide-react"

interface CustomJsModalProps {
    open: boolean
    onClose: () => void
    initialJs: string
    onSave: (js: string) => void
    language?: "ar" | "en"
}

export function CustomJsModal({ open, onClose, initialJs, onSave, language = "ar" }: CustomJsModalProps) {
    const [jsCode, setJsCode] = useState(initialJs)
    const isAr = language === "ar"

    const handleSave = () => {
        onSave(jsCode)
        onClose()
    }

    const handleCancel = () => {
        setJsCode(initialJs)
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
                        <h2 className="text-xl font-bold">{isAr ? "محرر JavaScript المخصص" : "Custom JavaScript Editor"}</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                <div className="m-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800" dir={isAr ? "rtl" : "ltr"}>
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">{isAr ? "تحذير أمني:" : "Security Warning:"}</p>
                        <p>{isAr ? "سيتم تنفيذ الكود JavaScript فقط في الصفحة المعاينة والصفحة المنشورة. تأكد من كتابة كود آمن وموثوق." : "JavaScript code will be executed only on preview and published pages. Make sure to write safe and trusted code."}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden border rounded-lg mx-4" dir="ltr">
                    <CodeMirror
                        value={jsCode}
                        height="500px"
                        extensions={[javascript()]}
                        onChange={(value) => setJsCode(value)}
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

                <div className="mx-4 my-4 text-xs text-slate-500 space-y-1 p-3 bg-slate-50 rounded-lg border" dir={isAr ? "rtl" : "ltr"}>
                    <p className="font-semibold">💡 {isAr ? "نصائح:" : "Tips:"}</p>
                    <ul className={`list-disc list-inside space-y-1 ${isAr ? "mr-2" : "ml-2"}`}>
                        <li>{isAr ? <>يمكنك استخدام <code className="bg-slate-200 px-1 rounded">document.querySelector()</code> للوصول إلى عناصر الصفحة</> : <>Use <code className="bg-slate-200 px-1 rounded">document.querySelector()</code> to access page elements</>}</li>
                        <li>{isAr ? <>استخدم <code className="bg-slate-200 px-1 rounded">addEventListener()</code> لإضافة مستمعي الأحداث</> : <>Use <code className="bg-slate-200 px-1 rounded">addEventListener()</code> to add event listeners</>}</li>
                        <li>{isAr ? "سيتم تنفيذ الكود بعد تحميل الصفحة بالكامل" : "Code will execute after the page is fully loaded"}</li>
                        <li>{isAr ? "تجنب الكود الذي قد يؤثر على أداء الصفحة" : "Avoid code that may impact page performance"}</li>
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
