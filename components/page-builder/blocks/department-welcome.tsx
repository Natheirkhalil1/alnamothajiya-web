import * as React from "react"
import { Block, DepartmentWelcomeBlock } from "../types"
import { InputField, TextareaField, SelectField, createId, StylingGroup, applyBlockStyles } from "../utils"
import { Stethoscope, Heart, Home, Activity, GraduationCap, Book, Library, PenTool, Calculator, FlaskConical, Microscope, Dna, Palette, Music, Camera, Drama, Brush, Trophy, Medal, Dumbbell, Laptop, Cpu, Code, Wifi, Database, User, Users, Star, Sun, Moon, Globe, Map, Phone, Calendar, Clock, Bell, Search, Settings, Info, HelpCircle, CheckCircle, AlertCircle, XCircle, Pill, Syringe, Thermometer, Ambulance, Hospital, Briefcase, Building, Bus, Car, Coffee, CreditCard, DollarSign, FileText, Gift, Headphones, Image, Key, Lock, MapPin, Mic, Monitor, MousePointer, Package, Printer, Radio, Scissors, ShoppingBag, ShoppingCart, Smartphone, Speaker, Tag, Ticket, Wrench, Truck, Tv, Umbrella, Video, Wallet, Watch, Zap } from "lucide-react"

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

export function DepartmentWelcomeEditor({ block, onChange }: { block: DepartmentWelcomeBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<DepartmentWelcomeBlock>) => onChange({ ...block, ...patch })
    const updateStats = (updater: (stats: DepartmentWelcomeBlock["stats"]) => DepartmentWelcomeBlock["stats"]) =>
        onChange({ ...block, stats: updater(block.stats) })

    const iconOptions = Object.keys(iconMap).sort().map(name => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1)
    }))

    return (
        <div className="space-y-3 text-[11px]">
            <SelectField
                label="الأيقونة"
                value={block.icon || ""}
                onChange={(v) => update({ icon: v || undefined })}
                options={[{ value: "", label: "بدون أيقونة" }, ...iconOptions]}
            />
            <InputField label="العنوان" value={block.title} onChange={(v) => update({ title: v })} />
            <TextareaField label="الوصف" value={block.description} onChange={(v) => update({ description: v })} rows={3} />
            <InputField label="رابط الصورة (اختياري)" value={block.imageUrl ?? ""} onChange={(v) => update({ imageUrl: v || undefined })} />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الإحصائيات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateStats((stats) => [
                                ...stats,
                                { id: createId(), value: "0", label: "إحصائية جديدة", onClick: "" },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة إحصائية
                    </button>
                </div>
                {block.stats.map((stat) => (
                    <div key={stat.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="القيمة"
                                value={stat.value}
                                onChange={(v) =>
                                    updateStats((stats) => stats.map((s) => (s.id === stat.id ? { ...s, value: v } : s)))
                                }
                            />
                            <InputField
                                label="التسمية"
                                value={stat.label}
                                onChange={(v) =>
                                    updateStats((stats) => stats.map((s) => (s.id === stat.id ? { ...s, label: v } : s)))
                                }
                            />
                        </div>
                        <InputField
                            label="onClick (اختياري)"
                            value={stat.onClick ?? ""}
                            onChange={(v) =>
                                updateStats((stats) => stats.map((s) => (s.id === stat.id ? { ...s, onClick: v || undefined } : s)))
                            }
                            placeholder="#section-id"
                        />
                        <button
                            type="button"
                            onClick={() => updateStats((stats) => stats.filter((s) => s.id !== stat.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function DepartmentWelcomeView({ block }: { block: DepartmentWelcomeBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const Icon = block.icon && iconMap[block.icon] ? iconMap[block.icon] : Stethoscope

    const scrollToSection = (sectionId: string) => {
        if (!sectionId) return
        const element = document.getElementById(sectionId.replace('#', ''))
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="py-24 bg-gradient-to-b from-muted/40 via-background to-muted/40 relative overflow-hidden" {...blockProps}>
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="p-12 md:p-20 bg-gradient-to-br from-background via-background to-muted/50 border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 backdrop-blur-sm relative overflow-hidden group rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-700 animate-gradient-x" />
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="flex flex-col md:flex-row items-start gap-10 relative z-10">
                            {block.icon && (
                                <div
                                    className="p-10 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-700 cursor-pointer relative overflow-hidden group/icon"
                                    onClick={() => block.stats[0]?.onClick && scrollToSection(block.stats[0].onClick)}
                                >
                                    <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse-glow" />
                                    <Icon className="w-20 h-20 text-white relative z-10 group-hover/icon:scale-110 transition-transform" />
                                    <div className="absolute inset-0 border-4 border-white/30 rounded-3xl animate-spin-slow" />
                                </div>
                            )}

                            <div className="flex-1">
                                <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                                    {block.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                                    {block.description}
                                </p>

                                <div className="grid grid-cols-3 gap-6 mt-10">
                                    {block.stats.map((stat, index) => (
                                        <button
                                            key={stat.id}
                                            onClick={() => stat.onClick && scrollToSection(stat.onClick)}
                                            className={`text-center p-6 bg-gradient-to-br ${index === 0 ? "from-primary/10 to-primary/5" :
                                                index === 1 ? "from-accent/10 to-accent/5" :
                                                    "from-secondary/10 to-secondary/5"
                                                } rounded-2xl hover:${index === 0 ? "from-primary/20 hover:to-primary/10" :
                                                    index === 1 ? "from-accent/20 hover:to-accent/10" :
                                                        "from-secondary/20 hover:to-secondary/10"
                                                } transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden border-2 ${index === 0 ? "border-primary/20 hover:border-primary/40" :
                                                    index === 1 ? "border-accent/20 hover:border-accent/40" :
                                                        "border-secondary/20 hover:border-secondary/40"
                                                }`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${index === 0 ? "primary" : index === 1 ? "accent" : "secondary"
                                                }/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500`} />
                                            <div className={`text-4xl font-bold ${index === 0 ? "text-primary" : index === 1 ? "text-accent" : "text-secondary-foreground"
                                                } mb-3 group-hover:scale-125 transition-transform relative z-10`}>
                                                {stat.value}
                                            </div>
                                            <div className="text-sm font-medium text-muted-foreground relative z-10">
                                                {stat.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
