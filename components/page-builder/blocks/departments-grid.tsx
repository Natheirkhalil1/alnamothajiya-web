import * as React from "react"
import { Block, DepartmentsGridBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import {
    InputField,
    SelectField,
    TextareaField,
    SectionContainer,
    createId,
    StylingGroup,
    applyBlockStyles,
} from "../utils"
import {
    Stethoscope, Heart, Home, Activity, GraduationCap, ArrowLeft, ArrowRight, Mail, Sparkles,
    Book, Library, PenTool, Calculator, FlaskConical, Microscope, Dna,
    Palette, Music, Camera, Drama, Brush,
    Trophy, Medal, Dumbbell,
    Laptop, Cpu, Code, Wifi, Database,
    User, Users, Star, Sun, Moon, Globe, Map, Phone, Calendar, Clock, Bell, Search, Settings, Info, HelpCircle, CheckCircle, AlertCircle, XCircle,
    Pill, Syringe, Thermometer, Ambulance, Hospital,
    Briefcase, Building, Bus, Car, Coffee, CreditCard, DollarSign, FileText, Gift, Headphones, Image, Key, Lock, MapPin, Mic, Monitor, MousePointer, Package, Printer, Radio, Scissors, ShoppingBag, ShoppingCart, Smartphone, Speaker, Tag, Ticket, Tool, Truck, Tv, Umbrella, Video, Wallet, Watch, Zap
} from "lucide-react"

// Map of all available icons
const iconMap: Record<string, any> = {
    // Medical
    stethoscope: Stethoscope,
    heart: Heart,
    pill: Pill,
    syringe: Syringe,
    thermometer: Thermometer,
    ambulance: Ambulance,
    hospital: Hospital,
    dna: Dna,
    microscope: Microscope,
    flask: FlaskConical,

    // Academic
    graduation: GraduationCap,
    book: Book,
    library: Library,
    pen: PenTool,
    calculator: Calculator,

    // Arts & Sports
    palette: Palette,
    music: Music,
    camera: Camera,
    drama: Drama,
    brush: Brush,
    trophy: Trophy,
    medal: Medal,
    dumbbell: Dumbbell,
    activity: Activity,

    // Tech
    laptop: Laptop,
    cpu: Cpu,
    code: Code,
    wifi: Wifi,
    database: Database,
    monitor: Monitor,
    smartphone: Smartphone,

    // General
    home: Home,
    user: User,
    users: Users,
    star: Star,
    sun: Sun,
    moon: Moon,
    globe: Globe,
    map: Map,
    phone: Phone,
    mail: Mail,
    calendar: Calendar,
    clock: Clock,
    bell: Bell,
    search: Search,
    settings: Settings,
    info: Info,
    help: HelpCircle,
    check: CheckCircle,
    alert: AlertCircle,
    x: XCircle,
    briefcase: Briefcase,
    building: Building,
    bus: Bus,
    car: Car,
    coffee: Coffee,
    credit: CreditCard,
    dollar: DollarSign,
    file: FileText,
    gift: Gift,
    headphones: Headphones,
    image: Image,
    key: Key,
    lock: Lock,
    pin: MapPin,
    mic: Mic,
    mouse: MousePointer,
    package: Package,
    printer: Printer,
    radio: Radio,
    scissors: Scissors,
    bag: ShoppingBag,
    cart: ShoppingCart,
    speaker: Speaker,
    tag: Tag,
    ticket: Ticket,
    tool: Tool,
    truck: Truck,
    tv: Tv,
    umbrella: Umbrella,
    video: Video,
    wallet: Wallet,
    watch: Watch,
    zap: Zap,
}

const getDepartmentIcon = (type: string, iconName?: string) => {
    if (iconName && iconMap[iconName]) {
        return iconMap[iconName]
    }

    // Fallback for legacy "type" based selection
    const legacyIcons: Record<string, any> = {
        medical: Stethoscope,
        heart: Heart,
        housing: Home,
        activities: Activity,
    }
    return legacyIcons[type] || GraduationCap
}

const getColorScheme = (type: string, theme?: string) => {
    // If a specific theme is selected, use it
    if (theme) {
        const themes: Record<string, any> = {
            red: {
                gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20",
                cardGradient: "from-red-500/10 to-rose-500/10",
                iconGradient: "from-red-500 to-rose-600",
                glowColor: "shadow-red-500/50",
                borderColor: "border-red-500/30 hover:border-red-500",
            },
            blue: {
                gradient: "from-blue-500/20 via-cyan-500/20 to-sky-500/20",
                cardGradient: "from-blue-500/10 to-cyan-500/10",
                iconGradient: "from-blue-500 to-cyan-600",
                glowColor: "shadow-blue-500/50",
                borderColor: "border-blue-500/30 hover:border-blue-500",
            },
            green: {
                gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
                cardGradient: "from-green-500/10 to-emerald-500/10",
                iconGradient: "from-green-500 to-emerald-600",
                glowColor: "shadow-green-500/50",
                borderColor: "border-green-500/30 hover:border-green-500",
            },
            purple: {
                gradient: "from-purple-500/20 via-violet-500/20 to-fuchsia-500/20",
                cardGradient: "from-purple-500/10 to-violet-500/10",
                iconGradient: "from-purple-500 to-violet-600",
                glowColor: "shadow-purple-500/50",
                borderColor: "border-purple-500/30 hover:border-purple-500",
            },
            orange: {
                gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
                cardGradient: "from-orange-500/10 to-amber-500/10",
                iconGradient: "from-orange-500 to-amber-600",
                glowColor: "shadow-orange-500/50",
                borderColor: "border-orange-500/30 hover:border-orange-500",
            },
            pink: {
                gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
                cardGradient: "from-pink-500/10 to-rose-500/10",
                iconGradient: "from-pink-500 to-rose-600",
                glowColor: "shadow-pink-500/50",
                borderColor: "border-pink-500/30 hover:border-pink-500",
            },
            teal: {
                gradient: "from-teal-500/20 via-emerald-500/20 to-green-500/20",
                cardGradient: "from-teal-500/10 to-emerald-500/10",
                iconGradient: "from-teal-500 to-emerald-600",
                glowColor: "shadow-teal-500/50",
                borderColor: "border-teal-500/30 hover:border-teal-500",
            },
            cyan: {
                gradient: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
                cardGradient: "from-cyan-500/10 to-sky-500/10",
                iconGradient: "from-cyan-500 to-sky-600",
                glowColor: "shadow-cyan-500/50",
                borderColor: "border-cyan-500/30 hover:border-cyan-500",
            },
        }
        if (themes[theme]) return themes[theme]
    }

    // Fallback to type-based schemes
    const schemes: Record<
        string,
        {
            gradient: string
            cardGradient: string
            iconGradient: string
            glowColor: string
            borderColor: string
        }
    > = {
        medical: {
            gradient: "from-rose-500/20 via-pink-500/20 to-red-500/20",
            cardGradient: "from-rose-500/10 to-pink-500/10",
            iconGradient: "from-rose-500 to-pink-600",
            glowColor: "shadow-rose-500/50",
            borderColor: "border-rose-500/30 hover:border-rose-500",
        },
        heart: {
            gradient: "from-purple-500/20 via-violet-500/20 to-fuchsia-500/20",
            cardGradient: "from-purple-500/10 to-violet-500/10",
            iconGradient: "from-purple-500 to-violet-600",
            glowColor: "shadow-purple-500/50",
            borderColor: "border-purple-500/30 hover:border-purple-500",
        },
        housing: {
            gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
            cardGradient: "from-blue-500/10 to-cyan-500/10",
            iconGradient: "from-blue-500 to-cyan-600",
            glowColor: "shadow-blue-500/50",
            borderColor: "border-blue-500/30 hover:border-blue-500",
        },
        activities: {
            gradient: "from-amber-500/20 via-orange-500/20 to-yellow-500/20",
            cardGradient: "from-amber-500/10 to-orange-500/10",
            iconGradient: "from-amber-500 to-orange-600",
            glowColor: "shadow-amber-500/50",
            borderColor: "border-amber-500/30 hover:border-amber-500",
        },
    }
    return (
        schemes[type] || {
            gradient: "from-primary/20 via-accent/20 to-primary/20",
            cardGradient: "from-primary/10 to-accent/10",
            iconGradient: "from-primary to-accent",
            glowColor: "shadow-primary/50",
            borderColor: "border-primary/30 hover:border-primary",
        }
    )
}

export function DepartmentsGridEditor({
    block,
    onChange,
}: {
    block: DepartmentsGridBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<DepartmentsGridBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: DepartmentsGridBlock["items"]) => DepartmentsGridBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    // Generate icon options
    const iconOptions = Object.keys(iconMap).sort().map(name => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1)
    }))

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <InputField label="نص الشارة الافتراضي (Badge)" value={block.badgeText ?? "قسم متخصص"} onChange={(v) => update({ badgeText: v })} />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الأقسام</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    type: "medical",
                                    titleEn: "New Department",
                                    titleAr: "قسم جديد",
                                    descriptionEn: "Description",
                                    descriptionAr: "الوصف",
                                    image: "/placeholder.svg",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة قسم
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <div className="grid grid-cols-2 gap-2">
                            <SelectField
                                label="الأيقونة"
                                value={item.icon || ""}
                                onChange={(v) =>
                                    updateItems((items) =>
                                        items.map((it) =>
                                            it.id === item.id ? { ...it, icon: v || undefined } : it
                                        )
                                    )
                                }
                                options={[
                                    { value: "", label: "افتراضي (حسب النوع)" },
                                    ...iconOptions
                                ]}
                            />
                            <SelectField
                                label="لون الثيم"
                                value={item.colorTheme ?? ""}
                                onChange={(v) =>
                                    updateItems((items) =>
                                        items.map((it) =>
                                            it.id === item.id ? { ...it, colorTheme: v as any || undefined } : it
                                        )
                                    )
                                }
                                options={[
                                    { value: "", label: "تلقائي (حسب النوع)" },
                                    { value: "red", label: "أحمر" },
                                    { value: "blue", label: "أزرق" },
                                    { value: "green", label: "أخضر" },
                                    { value: "purple", label: "بنفسجي" },
                                    { value: "orange", label: "برتقالي" },
                                    { value: "pink", label: "وردي" },
                                    { value: "teal", label: "تركواز" },
                                    { value: "cyan", label: "سماوي" },
                                ]}
                            />
                        </div>

                        {/* Legacy Type Selection - kept for backward compatibility but deemphasized */}
                        {!item.icon && (
                            <SelectField
                                label="النوع (تلقائي)"
                                value={item.type}
                                onChange={(v) =>
                                    updateItems((items) =>
                                        items.map((it) =>
                                            it.id === item.id ? { ...it, type: v as typeof item.type } : it
                                        )
                                    )
                                }
                                options={[
                                    { value: "medical", label: "طبي (Stethoscope)" },
                                    { value: "heart", label: "قلب (Heart)" },
                                    { value: "housing", label: "سكن (Home)" },
                                    { value: "activities", label: "أنشطة (Activity)" },
                                ]}
                            />
                        )}

                        <InputField
                            label="العنوان"
                            value={item.titleAr}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, titleAr: v } : it)))
                            }
                        />
                        <TextareaField
                            label="الوصف"
                            value={item.descriptionAr}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, descriptionAr: v } : it)))
                            }
                            rows={2}
                        />
                        <InputField
                            label="نص الشارة (اختياري)"
                            value={item.badgeText ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, badgeText: v || undefined } : it)))
                            }
                            placeholder="اتركه فارغاً لاستخدام النص الافتراضي"
                        />
                        <InputField
                            label="رابط الصورة"
                            value={item.image}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, image: v } : it)))
                            }
                        />
                        <InputField
                            label="الرابط (اختياري)"
                            value={item.href ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, href: v || undefined } : it)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف القسم
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-3 space-y-2 border-t pt-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showCTA"
                        checked={block.showCTA ?? true}
                        onChange={(e) => update({ showCTA: e.target.checked })}
                        className="h-4 w-4"
                    />
                    <label htmlFor="showCTA" className="text-[11px] font-medium text-slate-700">
                        عرض قسم "تواصل معنا"
                    </label>
                </div>

                {block.showCTA && (
                    <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                        <InputField label="عنوان CTA" value={block.ctaTitle ?? "هل لديك استفسار؟"} onChange={(v) => update({ ctaTitle: v })} />
                        <TextareaField label="نص CTA" value={block.ctaText ?? "فريقنا المتخصص جاهز على مدار الساعة للإجابة على جميع استفساراتكم"} onChange={(v) => update({ ctaText: v })} />
                        <div className="grid grid-cols-2 gap-2">
                            <InputField label="نص الزر" value={block.ctaButtonLabel ?? "تواصل معنا الآن"} onChange={(v) => update({ ctaButtonLabel: v })} />
                            <InputField label="رابط الزر" value={block.ctaButtonHref ?? "#contact"} onChange={(v) => update({ ctaButtonHref: v })} />
                        </div>
                    </div>
                )}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function DepartmentsGridView({ block }: { block: DepartmentsGridBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="relative py-32 overflow-hidden" {...blockProps}>
                <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />

                {/* Floating gradient blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

                <div className="container mx-auto px-4 relative z-10">
                    {header?.title && (
                        <div className="text-center max-w-4xl mx-auto mb-20 opacity-0 animate-fade-in">
                            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full mb-8 border-2 border-primary/20 backdrop-blur-sm shadow-lg">
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                <span className="text-base font-bold text-primary tracking-wide">{header.title}</span>
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {block.items.map((dept, index) => {
                            const colorScheme = getColorScheme(dept.type, dept.colorTheme)
                            const Icon = getDepartmentIcon(dept.type, dept.icon)

                            return (
                                <div
                                    key={dept.id}
                                    className={`group relative overflow-hidden border-2 ${colorScheme.borderColor} transition-all duration-700 hover:shadow-2xl ${colorScheme.glowColor} opacity-0 animate-fade-in-up backdrop-blur-sm bg-card/50 rounded-lg`}
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={dept.image || "/placeholder.svg"}
                                            alt={dept.titleAr}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        <div className={`absolute top-6 right-6 w-16 h-16 bg-gradient-to-br ${colorScheme.iconGradient} rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full border border-white/20 shadow-lg transform transition-all duration-700 group-hover:scale-110">
                                            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                                {dept.badgeText || block.badgeText || "قسم متخصص"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative p-8 space-y-6">
                                        <h3 className="text-3xl font-black text-foreground transition-all duration-500 group-hover:text-primary group-hover:translate-x-2">
                                            {dept.titleAr}
                                        </h3>
                                        <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                                            {dept.descriptionAr}
                                        </p>

                                        {dept.href && (
                                            <a
                                                href={dept.href}
                                                className={`block w-full py-3 px-6 text-center rounded-lg bg-gradient-to-r ${colorScheme.iconGradient} text-white font-bold hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group/btn`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                                                <span className="relative flex items-center justify-center gap-2">
                                                    عرض التفاصيل
                                                    <ArrowLeft className="w-5 h-5 transition-transform duration-500 group-hover/btn:-translate-x-2" />
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {block.showCTA && (
                        <div className="mt-24 text-center opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
                            <div className="max-w-3xl mx-auto relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

                                <div className="relative bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-card dark:via-card dark:to-blue-950/20 rounded-3xl p-12 shadow-2xl border-2 border-blue-500/20 backdrop-blur-sm">
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl animate-pulse" />
                                        <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50 transform hover:scale-110 transition-transform duration-500">
                                            <Mail className="w-12 h-12 text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-black mb-6 text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                        {block.ctaTitle || "هل لديك استفسار؟"}
                                    </h3>
                                    <p className="text-muted-foreground mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
                                        {block.ctaText || "فريقنا المتخصص جاهز على مدار الساعة للإجابة على جميع استفساراتكم"}
                                    </p>
                                    <a
                                        href={block.ctaButtonHref || "#contact"}
                                        className="inline-flex items-center justify-center px-12 py-7 text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all duration-500 hover:scale-110 border-0 text-white relative overflow-hidden group rounded-lg"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                        <span className="relative flex items-center gap-3">
                                            {block.ctaButtonLabel || "تواصل معنا الآن"}
                                            <ArrowLeft className="w-6 h-6 transition-transform duration-500 group-hover:-translate-x-2" />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
