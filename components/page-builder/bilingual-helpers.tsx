import * as React from "react"
import { InputField, TextareaField } from "./utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionHeader } from "./types"

interface BilingualSectionHeaderEditorProps {
    header: SectionHeader
    onChange: (header: Partial<SectionHeader>) => void
}

export function BilingualSectionHeaderEditor({ header, onChange }: BilingualSectionHeaderEditorProps) {
    return (
        <div className="space-y-3">
            <Tabs defaultValue="ar" dir="rtl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="ar" className="space-y-3 mt-3">
                    <InputField
                        label="العنوان الفرعي"
                        value={header.eyebrowAr ?? ""}
                        onChange={(v) => onChange({ eyebrowAr: v || undefined })}
                    />
                    <InputField
                        label="العنوان"
                        value={header.titleAr ?? ""}
                        onChange={(v) => onChange({ titleAr: v || undefined })}
                    />
                    <TextareaField
                        label="الوصف"
                        value={header.descriptionAr ?? ""}
                        onChange={(v) => onChange({ descriptionAr: v || undefined })}
                        rows={3}
                    />
                </TabsContent>

                <TabsContent value="en" className="space-y-3 mt-3" dir="ltr">
                    <InputField
                        label="Eyebrow"
                        value={header.eyebrowEn ?? ""}
                        onChange={(v) => onChange({ eyebrowEn: v || undefined })}
                    />
                    <InputField
                        label="Title"
                        value={header.titleEn ?? ""}
                        onChange={(v) => onChange({ titleEn: v || undefined })}
                    />
                    <TextareaField
                        label="Description"
                        value={header.descriptionEn ?? ""}
                        onChange={(v) => onChange({ descriptionEn: v || undefined })}
                        rows={3}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Monolingual Section Header Editor - shows only one language based on editingLanguage
interface MonolingualSectionHeaderEditorProps {
    header: SectionHeader
    onChange: (header: Partial<SectionHeader>) => void
    language: "ar" | "en"
}

export function MonolingualSectionHeaderEditor({ header, onChange, language }: MonolingualSectionHeaderEditorProps) {
    const isAr = language === "ar"

    return (
        <div className="space-y-3" dir={isAr ? "rtl" : "ltr"}>
            {isAr ? (
                <>
                    <InputField
                        label="العنوان الفرعي"
                        value={header.eyebrowAr ?? ""}
                        onChange={(v) => onChange({ eyebrowAr: v || undefined })}
                    />
                    <InputField
                        label="العنوان"
                        value={header.titleAr ?? ""}
                        onChange={(v) => onChange({ titleAr: v || undefined })}
                    />
                    <TextareaField
                        label="الوصف"
                        value={header.descriptionAr ?? ""}
                        onChange={(v) => onChange({ descriptionAr: v || undefined })}
                        rows={3}
                    />
                </>
            ) : (
                <>
                    <InputField
                        label="Eyebrow"
                        value={header.eyebrowEn ?? ""}
                        onChange={(v) => onChange({ eyebrowEn: v || undefined })}
                    />
                    <InputField
                        label="Title"
                        value={header.titleEn ?? ""}
                        onChange={(v) => onChange({ titleEn: v || undefined })}
                    />
                    <TextareaField
                        label="Description"
                        value={header.descriptionEn ?? ""}
                        onChange={(v) => onChange({ descriptionEn: v || undefined })}
                        rows={3}
                    />
                </>
            )}
        </div>
    )
}

// Helper function to get language-specific header content
export function getLocalizedHeader(header: SectionHeader | undefined, language: "ar" | "en") {
    if (!header) return { eyebrow: undefined, title: undefined, description: undefined }

    return {
        eyebrow: language === "ar" ? (header.eyebrowAr || header.eyebrow) : (header.eyebrowEn || header.eyebrow),
        title: language === "ar" ? (header.titleAr || header.title) : (header.titleEn || header.title),
        description: language === "ar" ? (header.descriptionAr || header.description) : (header.descriptionEn || header.description),
    }
}
