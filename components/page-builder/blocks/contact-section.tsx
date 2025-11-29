import * as React from "react"
import { Block, ContactSectionBlock, SectionHeader } from "../types"
import { InputField, TextareaField, applyBlockStyles } from "../utils"
import { SectionHeaderView } from "./section-header"

export function ContactSectionEditor({
    block,
    onChange,
}: {
    block: ContactSectionBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const info = block.info ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateInfo = (patch: Partial<ContactSectionBlock["info"]>) =>
        onChange({ ...block, info: { ...info, ...patch } })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <TextareaField
                label="الوصف"
                value={header.description ?? ""}
                onChange={(v) => updateHeader({ description: v || undefined })}
                rows={2}
            />

            <div className="mt-3 space-y-2">
                <span className="font-medium text-slate-700">معلومات الاتصال</span>
                <InputField
                    label="العنوان"
                    value={info.address ?? ""}
                    onChange={(v) => updateInfo({ address: v || undefined })}
                    placeholder="123 Main St, City"
                />
                <div className="grid grid-cols-2 gap-2">
                    <InputField
                        label="الهاتف"
                        value={info.phone ?? ""}
                        onChange={(v) => updateInfo({ phone: v || undefined })}
                        placeholder="+1234567890"
                    />
                    <InputField
                        label="البريد الإلكتروني"
                        value={info.email ?? ""}
                        onChange={(v) => updateInfo({ email: v || undefined })}
                        placeholder="info@example.com"
                    />
                </div>
                <InputField
                    label="واتساب"
                    value={info.whatsapp ?? ""}
                    onChange={(v) => updateInfo({ whatsapp: v || undefined })}
                    placeholder="+1234567890"
                />
                <TextareaField
                    label="ساعات العمل"
                    value={info.workingHours ?? ""}
                    onChange={(v) => updateInfo({ workingHours: v || undefined })}
                    rows={2}
                    placeholder="Mon-Fri: 9AM-5PM"
                />
                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="show-form"
                        checked={block.showForm ?? true}
                        onChange={(e) => onChange({ ...block, showForm: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor="show-form" className="text-[11px]">
                        إظهار نموذج الاتصال
                    </label>
                </div>
            </div>
        </div>
    )
}

export function ContactSectionView({ block }: { block: ContactSectionBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section {...blockProps} className={`py-12 bg-gray-50 ${blockProps.className || ""}`}>
                {block.header && (
                    <SectionHeaderView block={{ ...block, kind: "section-header", id: `${block.id}-header`, ...block.header }} />
                )}
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">معلومات الاتصال</h3>
                            {block.info.address && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">العنوان</p>
                                        <p className="text-gray-600">{block.info.address}</p>
                                    </div>
                                </div>
                            )}
                            {block.info.phone && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">الهاتف</p>
                                        <p className="text-gray-600" dir="ltr">
                                            {block.info.phone}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {block.info.email && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">البريد الإلكتروني</p>
                                        <p className="text-gray-600">{block.info.email}</p>
                                    </div>
                                </div>
                            )}
                            {block.info.whatsapp && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.55" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">واتساب</p>
                                        <p className="text-gray-600" dir="ltr">
                                            {block.info.whatsapp}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
