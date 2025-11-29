import * as React from "react"
import { Block, DepartmentSubsectionsBlock } from "../types"
import { InputField, TextareaField, SelectField, createId, StylingGroup, applyBlockStyles } from "../utils"
import { Stethoscope, Heart, Home, Activity, GraduationCap, Book, Library, PenTool, Calculator, FlaskConical, Microscope, Dna, Palette, Music, Camera, Drama, Brush, Trophy, Medal, Dumbbell, Laptop, Cpu, Code, Wifi, Database, User, Users, Star, Sun, Moon, Globe, Map, Phone, Calendar, Clock, Bell, Search, Settings, Info, HelpCircle, CheckCircle, AlertCircle, XCircle, Pill, Syringe, Thermometer, Ambulance, Hospital, Briefcase, Building, Bus, Car, Coffee, CreditCard, DollarSign, FileText, Gift, Headphones, Image, Key, Lock, MapPin, Mic, Monitor, MousePointer, Package, Printer, Radio, Scissors, ShoppingBag, ShoppingCart, Smartphone, Speaker, Tag, Ticket, Wrench, Truck, Tv, Umbrella, Video, Wallet, Watch, Zap, Grid3x3, ArrowLeft, Sparkles } from "lucide-react"

const iconMap: Record<string, any> = {
    stethoscope: Stethoscope, heart: Heart, pill: Pill, syringe: Syringe, thermometer: Thermometer,
    ambulance: Ambulance, hospital: Hospital, dna: Dna, microscope: Microscope, flask: FlaskConical,
    graduation: GraduationCap, book: Book, library: Library, pen: PenTool, calculator: Calculator,
    palette: Palette, music: Music, camera: Camera, drama: Drama, brush: Brush,
    trophy: Trophy, medal: Medal, dumbbell: Dumbbell, activity: Activity,
    laptop: Laptop, cpu: Cpu, code: Code, wifi: Wifi, database: Database, monitor: Monitor, smartphone: Smartphone,
    home: Home, user: User, users: Users, star: Star, sun: Sun, moon: Moon, globe: Globe, map: Map,
    phone: Phone, calendar: Calendar, clock: Clock, bell: Bell, search: Search, settings: Settings,
    info: Info, help: HelpCircle, check: CheckCircle, alert: AlertCircle, x: XCircle,
    briefcase: Briefcase, building: Building, bus: Bus, car: Car, coffee: Coffee, credit: CreditCard,
    dollar: DollarSign, file: FileText, gift: Gift, headphones: Headphones, image: Image, key: Key,
    lock: Lock, pin: MapPin, mic: Mic, mouse: MousePointer, package: Package, printer: Printer,
    radio: Radio, scissors: Scissors, bag: ShoppingBag, cart: ShoppingCart, speaker: Speaker,
    tag: Tag, ticket: Ticket, tool: Wrench, truck: Truck, tv: Tv, umbrella: Umbrella,
    video: Video, wallet: Wallet, watch: Watch, zap: Zap,
}

export function DepartmentSubsectionsEditor({ block, onChange }: { block: DepartmentSubsectionsBlock; onChange: (b: Block) => void }) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<typeof header>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<DepartmentSubsectionsBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: DepartmentSubsectionsBlock["items"]) => DepartmentSubsectionsBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    const iconOptions = Object.keys(iconMap).sort().map(name => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1)
    }))

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <InputField label="الوصف" value={header.description ?? ""} onChange={(v) => updateHeader({ description: v || undefined })} />
            <InputField label="لون القسم (gradient)" value={block.departmentColor ?? ""} onChange={(v) => update({ departmentColor: v || undefined })} placeholder="from-red-600 via-rose-600 to-pink-600" />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الأقسام الفرعية</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    titleAr: "قسم فرعي جديد",
                                    titleEn: "New Subsection",
                                    descriptionAr: "الوصف",
                                    descriptionEn: "Description",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة قسم فرعي
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <SelectField
                            label="الأيقونة"
                            value={item.icon || ""}
                            onChange={(v) =>
                                updateItems((items) =>
                                    items.map((it) => (it.id === item.id ? { ...it, icon: v || undefined } : it))
                                )
                            }
                            options={[{ value: "", label: "بدون أيقونة" }, ...iconOptions]}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="العنوان (عربي)"
                                value={item.titleAr}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, titleAr: v } : it)))
                                }
                            />
                            <InputField
                                label="العنوان (English)"
                                value={item.titleEn}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, titleEn: v } : it)))
                                }
                            />
                        </div>
                        <TextareaField
                            label="الوصف (عربي)"
                            value={item.descriptionAr}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, descriptionAr: v } : it)))
                            }
                            rows={2}
                        />
                        <TextareaField
                            label="الوصف (English)"
                            value={item.descriptionEn}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, descriptionEn: v } : it)))
                            }
                            rows={2}
                        />
                        <TextareaField
                            label="الوصف التفصيلي (عربي - اختياري)"
                            value={item.detailedDescriptionAr ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, detailedDescriptionAr: v || undefined } : it)))
                            }
                            rows={3}
                        />
                        <TextareaField
                            label="الوصف التفصيلي (English - اختياري)"
                            value={item.detailedDescriptionEn ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, detailedDescriptionEn: v || undefined } : it)))
                            }
                            rows={3}
                        />
                        <InputField
                            label="رابط الصورة (اختياري)"
                            value={item.image ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, image: v || undefined } : it)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف القسم الفرعي
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function DepartmentSubsectionsView({ block }: { block: DepartmentSubsectionsBlock }) {
    const [selectedSubsection, setSelectedSubsection] = React.useState<number | "all">("all")
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = block.header

    const displayedSubsections =
        selectedSubsection === "all"
            ? block.items
            : selectedSubsection >= 0 && selectedSubsection < block.items.length
                ? [block.items[selectedSubsection as number]]
                : []

    const handleSubsectionSelect = (index: number | "all") => {
        setSelectedSubsection(index)
        setTimeout(() => {
            const element = document.getElementById("subsections-content")
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }, 100)
    }

    const departmentColor = block.departmentColor || "from-primary via-accent to-primary"

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="py-32 relative overflow-hidden" {...blockProps}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse-slow delay-1000" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.08),transparent_70%)]" />

                <div className="container mx-auto px-4 relative z-10">
                    {header && (
                        <div className="text-center mb-16">
                            <div className="inline-block mb-8 relative">
                                <div
                                    className={`px-10 py-4 bg-gradient-to-r ${departmentColor} rounded-full text-white font-bold text-xl shadow-xl hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden group`}
                                >
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <span className="relative z-10">{header.title || "استكشف خدماتنا"}</span>
                                </div>
                            </div>

                            <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                                {header.description || "الأقسام الفرعية"}
                            </h2>
                        </div>
                    )}

                    <div className="mb-16">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <Grid3x3 className="w-6 h-6 text-primary animate-pulse" />
                            <h3 className="text-2xl font-bold text-center">اختر القسم</h3>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
                            <button
                                onClick={() => handleSubsectionSelect("all")}
                                className={`group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-110 hover:-translate-y-1 overflow-hidden ${selectedSubsection === "all"
                                    ? `bg-gradient-to-r ${departmentColor} text-white shadow-2xl scale-105`
                                    : "bg-muted/50 hover:bg-muted text-foreground border-2 border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <Grid3x3 className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                    <span>عرض الكل</span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{block.items.length}</span>
                                </div>
                            </button>

                            {block.items.map((subsection, index) => {
                                const SubIcon = subsection.icon && iconMap[subsection.icon] ? iconMap[subsection.icon] : Activity
                                return (
                                    <button
                                        key={subsection.id}
                                        onClick={() => handleSubsectionSelect(index)}
                                        className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-110 hover:-translate-y-1 overflow-hidden ${selectedSubsection === index
                                            ? `bg-gradient-to-r ${departmentColor} text-white shadow-2xl scale-105`
                                            : "bg-muted/50 hover:bg-muted text-foreground border-2 border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        <div className="flex items-center gap-2 relative z-10">
                                            <SubIcon className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                            <span className="text-sm md:text-base">{subsection.titleAr}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div id="subsections-content" className="scroll-mt-32">
                        {selectedSubsection === "all" ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedSubsections.map((subsection, index) => {
                                    const SubIcon = subsection.icon && iconMap[subsection.icon] ? iconMap[subsection.icon] : Activity
                                    return (
                                        <div
                                            key={subsection.id}
                                            className="group relative overflow-hidden bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:-translate-y-4 cursor-pointer rounded-3xl"
                                            onClick={() => handleSubsectionSelect(index)}
                                        >
                                            {subsection.image && (
                                                <div className="relative h-64 overflow-hidden">
                                                    <img
                                                        src={subsection.image}
                                                        alt={subsection.titleAr}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                                    <div className={`absolute top-4 right-4 p-4 bg-gradient-to-br ${departmentColor} rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                                                        <SubIcon className="w-8 h-8 text-white" />
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                                        <h3 className="text-2xl font-bold text-white mb-2">{subsection.titleAr}</h3>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6">
                                                {!subsection.image && (
                                                    <h3 className="text-2xl font-bold mb-4">{subsection.titleAr}</h3>
                                                )}
                                                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                                                    {subsection.descriptionAr}
                                                </p>

                                                <div className="mt-4 flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                                                    <span>عرض التفاصيل</span>
                                                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                {displayedSubsections.map((subsection) => {
                                    const SubIcon = subsection.icon && iconMap[subsection.icon] ? iconMap[subsection.icon] : Activity
                                    return (
                                        <div key={subsection.id} className="space-y-12">
                                            {subsection.image && (
                                                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
                                                    <img
                                                        src={subsection.image}
                                                        alt={subsection.titleAr}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                                                    <div className="absolute inset-0 flex flex-col justify-end p-12">
                                                        <div className="flex items-end gap-8">
                                                            <div className={`p-8 bg-gradient-to-br ${departmentColor} rounded-3xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-500 relative overflow-hidden group/icon`}>
                                                                <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse-glow" />
                                                                <SubIcon className="w-16 h-16 text-white relative z-10" />
                                                                <div className="absolute inset-0 border-4 border-white/30 rounded-3xl animate-spin-slow" />
                                                            </div>

                                                            <div className="flex-1">
                                                                <h3 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                                                                    {subsection.titleAr}
                                                                </h3>
                                                                <div className="flex flex-wrap gap-3">
                                                                    <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                                                        <span className="text-white font-semibold">خدمة متخصصة</span>
                                                                    </div>
                                                                    <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                                                        <span className="text-white font-semibold">كوادر مؤهلة</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-10 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />

                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
                                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">نبذة عن القسم</h4>
                                                    </div>

                                                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {subsection.detailedDescriptionAr || subsection.descriptionAr}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/20 rounded-3xl text-center relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                <div className="relative z-10">
                                                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full mb-6">
                                                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                                        <span className="text-xl font-bold">هل أنت مهتم؟</span>
                                                    </div>

                                                    <h4 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                                                        تواصل معنا للمزيد من المعلومات
                                                    </h4>

                                                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                                        فريقنا المتخصص جاهز للإجابة على جميع استفساراتكم ومساعدتكم
                                                    </p>

                                                    <button className="inline-flex items-center justify-center px-12 py-7 text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 rounded-full group relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                        <Phone className="w-7 h-7 ml-3 group-hover:rotate-12 transition-transform relative z-10" />
                                                        <span className="relative z-10">استفسر عن هذه الخدمة</span>
                                                        <ArrowLeft className="w-7 h-7 mr-3 group-hover:translate-x-2 transition-transform relative z-10" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
