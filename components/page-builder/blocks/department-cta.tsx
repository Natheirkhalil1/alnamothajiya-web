import * as React from "react"
import { Block, DepartmentCTABlock } from "../types"
import { InputField, TextareaField, StylingGroup, applyBlockStyles } from "../utils"
import { Phone, Mail, MapPin, Home, ArrowLeft, Sparkles } from "lucide-react"

export function DepartmentCTAEditor({ block, onChange }: { block: DepartmentCTABlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<DepartmentCTABlock>) => onChange({ ...block, ...patch })
    const updateContactInfo = (patch: Partial<DepartmentCTABlock["contactInfo"]>) =>
        onChange({ ...block, contactInfo: { ...block.contactInfo, ...patch } })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={block.title} onChange={(v) => update({ title: v })} />
            <TextareaField label="الوصف" value={block.description} onChange={(v) => update({ description: v })} rows={2} />

            <div className="grid grid-cols-2 gap-2">
                <InputField
                    label="نص الزر الأساسي"
                    value={block.primaryButtonLabel}
                    onChange={(v) => update({ primaryButtonLabel: v })}
                />
                <InputField
                    label="رابط الزر الأساسي"
                    value={block.primaryButtonHref}
                    onChange={(v) => update({ primaryButtonHref: v })}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <InputField
                    label="نص الزر الثانوي (اختياري)"
                    value={block.secondaryButtonLabel ?? ""}
                    onChange={(v) => update({ secondaryButtonLabel: v || undefined })}
                />
                <InputField
                    label="رابط الزر الثانوي (اختياري)"
                    value={block.secondaryButtonHref ?? ""}
                    onChange={(v) => update({ secondaryButtonHref: v || undefined })}
                />
            </div>

            <div className="mt-3 space-y-2 border-t pt-3">
                <span className="font-medium text-slate-700">معلومات الاتصال</span>
                <InputField
                    label="الهاتف"
                    value={block.contactInfo.phone}
                    onChange={(v) => updateContactInfo({ phone: v })}
                />
                <InputField
                    label="البريد الإلكتروني"
                    value={block.contactInfo.email}
                    onChange={(v) => updateContactInfo({ email: v })}
                />
                <InputField
                    label="العنوان"
                    value={block.contactInfo.address}
                    onChange={(v) => updateContactInfo({ address: v })}
                />
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function DepartmentCTAView({ block }: { block: DepartmentCTABlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    const handleContactClick = () => {
        const contactSection = document.getElementById("contact")
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="py-32 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative overflow-hidden" {...blockProps}>
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-4 px-10 py-5 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full shadow-2xl mb-8 hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <Sparkles className="w-7 h-7 text-primary animate-pulse relative z-10" />
                                <span className="text-xl font-bold relative z-10">نحن هنا لمساعدتك</span>
                                <Sparkles className="w-7 h-7 text-accent animate-pulse relative z-10" />
                            </div>
                        </div>

                        <h2 className="text-6xl md:text-7xl font-bold mb-10 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                            {block.title}
                        </h2>

                        <p className="text-2xl md:text-3xl text-muted-foreground mb-14 max-w-4xl mx-auto leading-relaxed font-light">
                            {block.description}
                        </p>

                        <div className="flex flex-wrap gap-8 justify-center mb-16">
                            <a
                                href={block.primaryButtonHref}
                                className="inline-flex items-center justify-center px-12 py-8 text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 rounded-full group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <Phone className="w-7 h-7 ml-3 group-hover:rotate-12 transition-transform relative z-10" />
                                <span className="relative z-10">{block.primaryButtonLabel}</span>
                                <ArrowLeft className="w-7 h-7 mr-3 group-hover:translate-x-2 transition-transform relative z-10" />
                            </a>

                            {block.secondaryButtonLabel && block.secondaryButtonHref && (
                                <a
                                    href={block.secondaryButtonHref}
                                    className="inline-flex items-center justify-center px-12 py-8 text-xl font-bold border-3 border-primary hover:bg-primary hover:text-white transition-all duration-500 hover:scale-110 rounded-full bg-background/90 backdrop-blur-sm group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/100 transition-all duration-500" />
                                    <Home className="w-7 h-7 ml-3 group-hover:scale-110 transition-transform relative z-10" />
                                    <span className="relative z-10">{block.secondaryButtonLabel}</span>
                                </a>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <a
                                href={`tel:${block.contactInfo.phone}`}
                                className="flex items-center justify-center gap-4 p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-primary/20 hover:border-primary/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Phone className="w-8 h-8 text-primary group-hover:rotate-12 group-hover:scale-125 transition-transform relative z-10" />
                                <div className="text-left relative z-10">
                                    <div className="text-sm text-muted-foreground font-medium">اتصل بنا</div>
                                    <div className="font-bold text-lg">{block.contactInfo.phone}</div>
                                </div>
                            </a>

                            <a
                                href={`mailto:${block.contactInfo.email}`}
                                className="flex items-center justify-center gap-4 p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-accent/20 hover:border-accent/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Mail className="w-8 h-8 text-accent group-hover:scale-125 transition-transform relative z-10" />
                                <div className="text-left relative z-10">
                                    <div className="text-sm text-muted-foreground font-medium">راسلنا</div>
                                    <div className="font-bold text-sm">{block.contactInfo.email}</div>
                                </div>
                            </a>

                            <button
                                onClick={handleContactClick}
                                className="flex items-center justify-center gap-4 p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 border-secondary/20 hover:border-secondary/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <MapPin className="w-8 h-8 text-secondary-foreground group-hover:bounce group-hover:scale-125 transition-transform relative z-10" />
                                <div className="text-left relative z-10">
                                    <div className="text-sm text-muted-foreground font-medium">زرنا</div>
                                    <div className="font-bold text-sm">{block.contactInfo.address}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
