import * as React from "react"
import { Block, InfoCardBlock } from "../types"
import { InputField, TextareaField, SelectField, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import {
    Users, Briefcase, GraduationCap, Heart, Home, Star,
    Phone, Mail, MapPin, Calendar, Clock, Award,
    BookOpen, Lightbulb, Target, Shield, Zap, Gift,
    MessageCircle, FileText, Settings, Globe, Camera, Music
} from "lucide-react"

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    users: Users,
    briefcase: Briefcase,
    graduation: GraduationCap,
    heart: Heart,
    home: Home,
    star: Star,
    phone: Phone,
    mail: Mail,
    location: MapPin,
    calendar: Calendar,
    clock: Clock,
    award: Award,
    book: BookOpen,
    lightbulb: Lightbulb,
    target: Target,
    shield: Shield,
    zap: Zap,
    gift: Gift,
    message: MessageCircle,
    file: FileText,
    settings: Settings,
    globe: Globe,
    camera: Camera,
    music: Music,
}

// Theme color configurations
const themeColors = {
    pink: {
        gradient: "from-pink-400 via-rose-400 to-pink-500",
        iconBg: "from-pink-500 to-rose-500",
        button: "from-pink-500 via-rose-500 to-pink-600",
        buttonHover: "from-pink-600 via-rose-600 to-pink-700",
        shadow: "shadow-pink-500/25",
        shadowHover: "shadow-pink-500/40",
    },
    blue: {
        gradient: "from-blue-400 via-indigo-400 to-blue-500",
        iconBg: "from-blue-500 to-indigo-500",
        button: "from-blue-500 via-indigo-500 to-blue-600",
        buttonHover: "from-blue-600 via-indigo-600 to-blue-700",
        shadow: "shadow-blue-500/25",
        shadowHover: "shadow-blue-500/40",
    },
    teal: {
        gradient: "from-teal-400 via-emerald-400 to-teal-500",
        iconBg: "from-teal-500 to-emerald-500",
        button: "from-teal-500 via-emerald-500 to-teal-600",
        buttonHover: "from-teal-600 via-emerald-600 to-teal-700",
        shadow: "shadow-teal-500/25",
        shadowHover: "shadow-teal-500/40",
    },
    purple: {
        gradient: "from-purple-400 via-violet-400 to-purple-500",
        iconBg: "from-purple-500 to-violet-500",
        button: "from-purple-500 via-violet-500 to-purple-600",
        buttonHover: "from-purple-600 via-violet-600 to-purple-700",
        shadow: "shadow-purple-500/25",
        shadowHover: "shadow-purple-500/40",
    },
    orange: {
        gradient: "from-orange-400 via-amber-400 to-orange-500",
        iconBg: "from-orange-500 to-amber-500",
        button: "from-orange-500 via-amber-500 to-orange-600",
        buttonHover: "from-orange-600 via-amber-600 to-orange-700",
        shadow: "shadow-orange-500/25",
        shadowHover: "shadow-orange-500/40",
    },
    green: {
        gradient: "from-green-400 via-emerald-400 to-green-500",
        iconBg: "from-green-500 to-emerald-500",
        button: "from-green-500 via-emerald-500 to-green-600",
        buttonHover: "from-green-600 via-emerald-600 to-green-700",
        shadow: "shadow-green-500/25",
        shadowHover: "shadow-green-500/40",
    },
    red: {
        gradient: "from-red-400 via-rose-400 to-red-500",
        iconBg: "from-red-500 to-rose-500",
        button: "from-red-500 via-rose-500 to-red-600",
        buttonHover: "from-red-600 via-rose-600 to-red-700",
        shadow: "shadow-red-500/25",
        shadowHover: "shadow-red-500/40",
    },
    cyan: {
        gradient: "from-cyan-400 via-sky-400 to-cyan-500",
        iconBg: "from-cyan-500 to-sky-500",
        button: "from-cyan-500 via-sky-500 to-cyan-600",
        buttonHover: "from-cyan-600 via-sky-600 to-cyan-700",
        shadow: "shadow-cyan-500/25",
        shadowHover: "shadow-cyan-500/40",
    },
}

export function InfoCardEditor({
    block,
    onChange,
}: {
    block: InfoCardBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const update = (patch: Partial<InfoCardBlock>) => onChange({ ...block, ...patch })

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <SelectField
                label={isAr ? "الأيقونة" : "Icon"}
                value={block.icon || "users"}
                onChange={(v) => update({ icon: v })}
                options={[
                    { value: "users", label: isAr ? "مستخدمين" : "Users" },
                    { value: "briefcase", label: isAr ? "حقيبة عمل" : "Briefcase" },
                    { value: "graduation", label: isAr ? "تخرج" : "Graduation" },
                    { value: "heart", label: isAr ? "قلب" : "Heart" },
                    { value: "home", label: isAr ? "منزل" : "Home" },
                    { value: "star", label: isAr ? "نجمة" : "Star" },
                    { value: "phone", label: isAr ? "هاتف" : "Phone" },
                    { value: "mail", label: isAr ? "بريد" : "Mail" },
                    { value: "location", label: isAr ? "موقع" : "Location" },
                    { value: "calendar", label: isAr ? "تقويم" : "Calendar" },
                    { value: "clock", label: isAr ? "ساعة" : "Clock" },
                    { value: "award", label: isAr ? "جائزة" : "Award" },
                    { value: "book", label: isAr ? "كتاب" : "Book" },
                    { value: "lightbulb", label: isAr ? "فكرة" : "Lightbulb" },
                    { value: "target", label: isAr ? "هدف" : "Target" },
                    { value: "shield", label: isAr ? "درع" : "Shield" },
                    { value: "zap", label: isAr ? "برق" : "Zap" },
                    { value: "gift", label: isAr ? "هدية" : "Gift" },
                    { value: "message", label: isAr ? "رسالة" : "Message" },
                    { value: "file", label: isAr ? "ملف" : "File" },
                    { value: "settings", label: isAr ? "إعدادات" : "Settings" },
                    { value: "globe", label: isAr ? "عالم" : "Globe" },
                    { value: "camera", label: isAr ? "كاميرا" : "Camera" },
                    { value: "music", label: isAr ? "موسيقى" : "Music" },
                ]}
            />

            <SelectField
                label={isAr ? "لون السمة" : "Theme Color"}
                value={block.themeColor || "pink"}
                onChange={(v) => update({ themeColor: v as InfoCardBlock["themeColor"] })}
                options={[
                    { value: "pink", label: isAr ? "وردي" : "Pink" },
                    { value: "blue", label: isAr ? "أزرق" : "Blue" },
                    { value: "teal", label: isAr ? "أزرق مخضر" : "Teal" },
                    { value: "purple", label: isAr ? "بنفسجي" : "Purple" },
                    { value: "orange", label: isAr ? "برتقالي" : "Orange" },
                    { value: "green", label: isAr ? "أخضر" : "Green" },
                    { value: "red", label: isAr ? "أحمر" : "Red" },
                    { value: "cyan", label: isAr ? "سماوي" : "Cyan" },
                ]}
            />

            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? block.titleAr : block.titleEn}
                onChange={(v) => update(isAr ? { titleAr: v } : { titleEn: v })}
                placeholder={isAr ? "عنوان البطاقة" : "Card title"}
            />

            <TextareaField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? block.descriptionAr : block.descriptionEn}
                onChange={(v) => update(isAr ? { descriptionAr: v } : { descriptionEn: v })}
                rows={3}
                placeholder={isAr ? "وصف البطاقة..." : "Card description..."}
            />

            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="show-button"
                    checked={block.showButton !== false}
                    onChange={(e) => update({ showButton: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="show-button" className="text-[11px]">
                    {isAr ? "إظهار الزر" : "Show Button"}
                </label>
            </div>

            {block.showButton !== false && (
                <>
                    <InputField
                        label={isAr ? "نص الزر" : "Button Text"}
                        value={isAr ? (block.buttonTextAr || "") : (block.buttonTextEn || "")}
                        onChange={(v) => update(isAr ? { buttonTextAr: v } : { buttonTextEn: v })}
                        placeholder={isAr ? "انقر للمزيد" : "Click for more"}
                    />

                    <InputField
                        label={isAr ? "رابط الزر" : "Button Link"}
                        value={block.buttonLink || ""}
                        onChange={(v) => update({ buttonLink: v })}
                        placeholder="/page-link"
                    />
                </>
            )}
        </div>
    )
}

export function InfoCardView({ block }: { block: InfoCardBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const isAr = language === "ar"

    const title = isAr ? block.titleAr : block.titleEn
    const description = isAr ? block.descriptionAr : block.descriptionEn
    const buttonText = isAr
        ? (block.buttonTextAr || "انقر للمزيد")
        : (block.buttonTextEn || "Click for more")

    const theme = themeColors[block.themeColor || "pink"]
    const IconComponent = iconMap[block.icon || "users"] || Users

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <div
                {...blockProps}
                className={`group relative bg-white dark:bg-slate-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 ${blockProps.className || ""}`}
                dir={isAr ? "rtl" : "ltr"}
            >
                {/* Blurred color orbs inside the card */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Main large blur orb - top area */}
                    <div className={`absolute -top-20 ${isAr ? "-left-20" : "-right-20"} w-64 h-64 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700`} />
                    {/* Secondary smaller orb */}
                    <div className={`absolute top-10 ${isAr ? "right-10" : "left-10"} w-32 h-32 bg-gradient-to-br ${theme.iconBg} rounded-full blur-3xl opacity-20 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500`} />
                    {/* Bottom accent orb */}
                    <div className={`absolute -bottom-16 ${isAr ? "-right-16" : "-left-16"} w-48 h-48 bg-gradient-to-tr ${theme.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-all duration-700`} />
                </div>

                {/* Icon Badge - Positioned at top */}
                <div className={`relative z-10 flex justify-center pt-8`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${theme.iconBg} rounded-2xl flex items-center justify-center shadow-xl ${theme.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 pt-6 text-center">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                        {description}
                    </p>

                    {/* Button */}
                    {block.showButton !== false && (
                        <a
                            href={block.buttonLink || "#"}
                            className={`group/btn inline-flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r ${theme.button} hover:${theme.buttonHover} rounded-full shadow-lg ${theme.shadow} hover:${theme.shadowHover} hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                            <span>{buttonText}</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none z-20" />
            </div>
        </>
    )
}
