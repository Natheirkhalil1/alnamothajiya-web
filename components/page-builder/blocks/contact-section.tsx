import * as React from "react"
import { Block, ContactSectionBlock, SectionHeader } from "../types"
import { InputField, TextareaField, applyBlockStyles } from "../utils"
import { SectionHeaderView } from "./section-header"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { saveContactMessage } from "@/lib/storage"

export function ContactSectionEditor({
    block,
    onChange,
}: {
    block: ContactSectionBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const header = block.header ?? {}
    const info = block.info ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateInfo = (patch: Partial<ContactSectionBlock["info"]>) =>
        onChange({ ...block, info: { ...info, ...patch } })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "عنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <TextareaField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (header.description ?? "") : (header.descriptionEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { description: v || undefined } : { descriptionEn: v || undefined })}
                rows={2}
            />

            <div className="mt-3 space-y-2">
                <span className="font-medium text-slate-700">{isAr ? "معلومات الاتصال" : "Contact Information"}</span>
                <InputField
                    label={isAr ? "العنوان" : "Address"}
                    value={isAr ? (info.address ?? "") : (info.addressEn ?? "")}
                    onChange={(v) => updateInfo(isAr ? { address: v || undefined } : { addressEn: v || undefined })}
                    placeholder={isAr ? "123 Main St, City" : "123 Main St, City"}
                />
                <div className="grid grid-cols-2 gap-2">
                    <InputField
                        label={isAr ? "الهاتف" : "Phone"}
                        value={info.phone ?? ""}
                        onChange={(v) => updateInfo({ phone: v || undefined })}
                        placeholder="+1234567890"
                    />
                    <InputField
                        label={isAr ? "البريد الإلكتروني" : "Email"}
                        value={info.email ?? ""}
                        onChange={(v) => updateInfo({ email: v || undefined })}
                        placeholder="info@example.com"
                    />
                </div>
                <InputField
                    label={isAr ? "واتساب" : "WhatsApp"}
                    value={info.whatsapp ?? ""}
                    onChange={(v) => updateInfo({ whatsapp: v || undefined })}
                    placeholder="+1234567890"
                />
                <TextareaField
                    label={isAr ? "ساعات العمل" : "Working Hours"}
                    value={isAr ? (info.workingHours ?? "") : (info.workingHoursEn ?? "")}
                    onChange={(v) => updateInfo(isAr ? { workingHours: v || undefined } : { workingHoursEn: v || undefined })}
                    rows={2}
                    placeholder={isAr ? "الأحد - الخميس: 8 صباحاً - 3 مساءً" : "Sun-Thu: 8AM-3PM"}
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
                        {isAr ? "إظهار نموذج الاتصال" : "Show Contact Form"}
                    </label>
                </div>
            </div>
        </div>
    )
}

export function ContactSectionView({ block }: { block: ContactSectionBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const [formData, setFormData] = React.useState({ name: "", email: "", phone: "", message: "" })
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submitStatus, setSubmitStatus] = React.useState<"idle" | "success" | "error">("idle")

    // Language-specific helpers
    const getContactInfoTitle = () => language === "ar" ? "معلومات الاتصال" : "Contact Information"
    const getAddressLabel = () => language === "ar" ? "العنوان" : "Address"
    const getPhoneLabel = () => language === "ar" ? "الهاتف" : "Phone"
    const getEmailLabel = () => language === "ar" ? "البريد الإلكتروني" : "Email"
    const getWhatsAppLabel = () => language === "ar" ? "واتساب" : "WhatsApp"
    const getAddress = () => language === "ar" ? (block.info?.address) : (block.info?.addressEn || block.info?.address)

    // Form labels
    const getFormTitle = () => language === "ar" ? "أرسل لنا رسالة" : "Send us a Message"
    const getNameLabel = () => language === "ar" ? "الاسم" : "Name"
    const getEmailFieldLabel = () => language === "ar" ? "البريد الإلكتروني" : "Email"
    const getPhoneFieldLabel = () => language === "ar" ? "رقم الهاتف" : "Phone Number"
    const getMessageLabel = () => language === "ar" ? "الرسالة" : "Message"
    const getSubmitLabel = () => language === "ar" ? "إرسال" : "Send Message"
    const getSubmittingLabel = () => language === "ar" ? "جاري الإرسال..." : "Sending..."
    const getSuccessMessage = () => language === "ar" ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!"
    const getErrorMessage = () => language === "ar" ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again."

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus("idle")

        try {
            // Save contact message to storage
            await saveContactMessage({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                rating: 0, // Contact form doesn't have rating
            })
            setSubmitStatus("success")
            setFormData({ name: "", email: "", phone: "", message: "" })
        } catch (error) {
            console.error("Error saving contact message:", error)
            setSubmitStatus("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const info = block.info || {}
    const showForm = block.showForm !== false // Default to true

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section {...blockProps} className={`py-12 bg-gray-50 ${blockProps.className || ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
                {block.header && (
                    <SectionHeaderView block={{ ...block, kind: "section-header", id: `${block.id}-header`, ...block.header }} />
                )}
                <div className="container mx-auto px-4">
                    <div className={`grid ${showForm ? "md:grid-cols-2" : "md:grid-cols-1"} gap-8 max-w-6xl mx-auto`}>
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-start">{getContactInfoTitle()}</h3>
                            {getAddress() && (
                                <div className="group flex items-start gap-4 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{getAddressLabel()}</p>
                                        <p className="text-gray-600 dark:text-gray-400">{getAddress()}</p>
                                    </div>
                                </div>
                            )}
                            {info.phone && (
                                <div className="group flex items-start gap-4 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{getPhoneLabel()}</p>
                                        <p className="text-gray-600 dark:text-gray-400" dir="ltr">{info.phone}</p>
                                    </div>
                                </div>
                            )}
                            {info.email && (
                                <div className="group flex items-start gap-4 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{getEmailLabel()}</p>
                                        <p className="text-gray-600 dark:text-gray-400">{info.email}</p>
                                    </div>
                                </div>
                            )}
                            {info.whatsapp && (
                                <div className="group flex items-start gap-4 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.55" />
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{getWhatsAppLabel()}</p>
                                        <p className="text-gray-600 dark:text-gray-400" dir="ltr">{info.whatsapp}</p>
                                    </div>
                                </div>
                            )}
                            {info.workingHours && (
                                <div className="group flex items-start gap-4 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{language === "ar" ? "ساعات العمل" : "Working Hours"}</p>
                                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{language === "ar" ? info.workingHours : (info.workingHoursEn || info.workingHours)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Form */}
                        {showForm && (
                            <div className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1 p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-400 relative overflow-hidden">
                                {/* Decorative corner accents */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-start">{getFormTitle()}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-start">{language === "ar" ? "املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن" : "Fill out the form below and we'll get back to you soon"}</p>

                                {submitStatus === "success" && (
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                                        {getSuccessMessage()}
                                    </div>
                                )}

                                {submitStatus === "error" && (
                                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                                        {getErrorMessage()}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 text-start">
                                            {getNameLabel()} <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-14 px-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:focus:border-pink-400 transition-all duration-300 outline-none"
                                            placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 text-start">
                                                {getPhoneFieldLabel()} <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full h-14 px-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:focus:border-pink-400 transition-all duration-300 outline-none"
                                                placeholder="+962xxxxxxxxx"
                                                dir="ltr"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 text-start">
                                                {getEmailFieldLabel()} <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full h-14 px-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:focus:border-pink-400 transition-all duration-300 outline-none"
                                                placeholder="example@email.com"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 text-start">
                                            {getMessageLabel()} <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:focus:border-pink-400 transition-all duration-300 resize-none outline-none"
                                            placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-16 py-4 px-8 bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:from-teal-600 hover:via-emerald-600 hover:to-blue-600 text-white text-lg font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                {getSubmittingLabel()}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                {getSubmitLabel()}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                        {language === "ar" ? "سنقوم بالرد على رسالتك خلال 24 ساعة من أيام العمل" : "We will respond within 24 business hours"}
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
