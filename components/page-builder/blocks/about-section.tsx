import * as React from "react"
import { Block, AboutSectionBlock } from "../types"
import { nmTheme } from "../theme"
import {
    InputField,
    TextareaField,
    SectionContainer,
    createId,
    StylingGroup,
    applyBlockStyles,
} from "../utils"
import { IconPicker } from "../icon-picker"
import { IconByName } from "../icon-system"

export function AboutSectionEditor({
    block,
    onChange,
}: {
    block: AboutSectionBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<AboutSectionBlock>) => onChange({ ...block, ...patch })
    const updateFeatures = (updater: (features: AboutSectionBlock["featureCards"]) => AboutSectionBlock["featureCards"]) =>
        onChange({ ...block, featureCards: updater(block.featureCards) })
    const updateStats = (updater: (stats: AboutSectionBlock["stats"]) => AboutSectionBlock["stats"]) =>
        onChange({ ...block, stats: updater(block.stats) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={block.titleAr} onChange={(v) => update({ titleAr: v })} />
            <TextareaField label="الوصف" value={block.descriptionAr} onChange={(v) => update({ descriptionAr: v })} rows={3} />

            <InputField label="رابط الصورة" value={block.image} onChange={(v) => update({ image: v })} />

            {/* Features */}
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">المميزات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateFeatures((features) => [
                                ...features,
                                {
                                    id: createId(),
                                    icon: "star",
                                    titleEn: "Feature",
                                    titleAr: "ميزة",
                                    descriptionEn: "Description",
                                    descriptionAr: "الوصف",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة ميزة
                    </button>
                </div>
                {block.featureCards.map((feature) => (
                    <div key={feature.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-slate-700">الأيقونة</span>
                            <IconPicker
                                value={feature.icon ?? undefined}
                                onChange={(v) =>
                                    updateFeatures((features) =>
                                        features.map((f) => (f.id === feature.id ? { ...f, icon: v || null } : f))
                                    )
                                }
                            />
                        </div>
                        <InputField
                            label="العنوان"
                            value={feature.titleAr}
                            onChange={(v) =>
                                updateFeatures((features) => features.map((f) => (f.id === feature.id ? { ...f, titleAr: v } : f)))
                            }
                        />
                        <TextareaField
                            label="الوصف"
                            value={feature.descriptionAr}
                            onChange={(v) =>
                                updateFeatures((features) => features.map((f) => (f.id === feature.id ? { ...f, descriptionAr: v } : f)))
                            }
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => updateFeatures((features) => features.filter((f) => f.id !== feature.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الميزة
                        </button>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الإحصائيات</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateStats((stats) => [
                                ...stats,
                                {
                                    id: createId(),
                                    number: "0",
                                    labelEn: "Label",
                                    labelAr: "عنوان",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة إحصائية
                    </button>
                </div>
                {block.stats.map((stat) => (
                    <div key={stat.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label="الرقم"
                            value={stat.number}
                            onChange={(v) =>
                                updateStats((stats) => stats.map((s) => (s.id === stat.id ? { ...s, number: v } : s)))
                            }
                        />
                        <InputField
                            label="العنوان"
                            value={stat.labelAr}
                            onChange={(v) =>
                                updateStats((stats) => stats.map((s) => (s.id === stat.id ? { ...s, labelAr: v } : s)))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => updateStats((stats) => stats.filter((s) => s.id !== stat.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الإحصائية
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showBadge"
                    checked={block.showBadge ?? true}
                    onChange={(e) => update({ showBadge: e.target.checked })}
                    className="h-4 w-4"
                />
                <label htmlFor="showBadge" className="text-[11px] text-slate-700">
                    عرض شارة ISO
                </label>
            </div>

            {block.showBadge && (
                <InputField
                    label="نص الشارة"
                    value={block.badgeText ?? "ISO 9001:2015"}
                    onChange={(v) => update({ badgeText: v })}
                />
            )}

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function AboutSectionView({ block }: { block: AboutSectionBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    const gradients = [
        { gradient: "from-blue-500/20 to-cyan-500/20", iconBg: "from-blue-500 to-cyan-500" },
        { gradient: "from-pink-500/20 to-rose-500/20", iconBg: "from-pink-500 to-rose-500" },
        { gradient: "from-amber-500/20 to-orange-500/20", iconBg: "from-amber-500 to-orange-500" },
        { gradient: "from-purple-500/20 to-violet-500/20", iconBg: "from-purple-500 to-violet-500" },
        { gradient: "from-green-500/20 to-emerald-500/20", iconBg: "from-green-500 to-emerald-500" },
        { gradient: "from-indigo-500/20 to-blue-500/20", iconBg: "from-indigo-500 to-blue-500" },
    ]

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="relative py-32 overflow-hidden" {...blockProps}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 animate-gradient-shift" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.1),transparent_50%)]" />

                <div className="container relative mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image Side */}
                        <div className="relative order-2 lg:order-1 group">
                            {/* Animated background blobs */}
                            <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-[3rem] blur-3xl animate-pulse-slow opacity-60" />
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-2xl animate-spin-slow opacity-40" />

                            {/* Main image container */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm bg-card/30">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img
                                    src={block.image || "/placeholder.svg"}
                                    alt={block.titleAr}
                                    className="w-full h-auto transform group-hover:scale-110 transition-transform duration-1000"
                                />

                                {/* Floating badge */}
                                {block.showBadge && (
                                    <div className="absolute top-6 right-6 bg-gradient-to-br from-primary to-accent text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl border border-primary/20 backdrop-blur-md animate-float">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{block.badgeText || "ISO 9001:2015"}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Floating stats */}
                            <div className="absolute -bottom-8 -right-8 left-8 grid grid-cols-2 gap-4">
                                {block.stats.slice(0, 2).map((stat, index) => (
                                    <div
                                        key={stat.id}
                                        className="bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-border/50 hover:scale-105 transition-all duration-300 animate-slide-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                                            {stat.number}
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground mt-1">
                                            {stat.labelAr}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="space-y-10 order-1 lg:order-2">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-6xl font-bold leading-tight animate-slide-up">
                                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                                        {block.titleAr}
                                    </span>
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
                                    {block.descriptionAr}
                                </p>

                                {/* Additional stats */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    {block.stats.slice(2).map((stat, index) => (
                                        <div
                                            key={stat.id}
                                            className="text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in"
                                            style={{ animationDelay: `${(index + 2) * 100}ms` }}
                                        >
                                            <div className="text-2xl font-bold text-primary">{stat.number}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{stat.labelAr}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Feature Cards */}
                            <div className="grid sm:grid-cols-2 gap-5">
                                {block.featureCards.map((feature, index) => {
                                    const colorScheme = gradients[index % gradients.length]
                                    return (
                                        <div
                                            key={feature.id}
                                            className={`relative p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 border-border/50 bg-gradient-to-br ${colorScheme.gradient} backdrop-blur-sm group overflow-hidden animate-fade-in rounded-lg`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-primary/5 transition-all duration-700" />

                                            <div className="relative flex items-start gap-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${colorScheme.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                                    {feature.icon && <IconByName name={feature.icon} className="w-7 h-7 text-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                                        {feature.titleAr}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {feature.descriptionAr}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
