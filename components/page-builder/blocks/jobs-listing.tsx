import * as React from "react"
import { Block, JobsListingBlock } from "../types"
import { InputField, TextareaField, createId, StylingGroup, applyBlockStyles } from "../utils"
import { Briefcase, Clock, Users, Timer, Calendar, ArrowRight, Building2 } from "lucide-react"

export function JobsListingEditor({ block, onChange }: { block: JobsListingBlock; onChange: (b: Block) => void }) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<typeof header>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<JobsListingBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: JobsListingBlock["items"]) => JobsListingBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <InputField label="الوصف" value={header.description ?? ""} onChange={(v) => updateHeader({ description: v || undefined })} />
            <TextareaField
                label="رسالة عدم وجود وظائف"
                value={block.emptyStateMessage ?? ""}
                onChange={(v) => update({ emptyStateMessage: v || undefined })}
                rows={2}
                placeholder="لا توجد وظائف متاحة حالياً"
            />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الوظائف</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    title: "وظيفة جديدة",
                                    type: "دوام كامل",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة وظيفة
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="العنوان (عربي)"
                                value={item.title}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, title: v } : it)))
                                }
                            />
                            <InputField
                                label="العنوان (English)"
                                value={item.titleEn ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, titleEn: v || undefined } : it)))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="النوع (عربي)"
                                value={item.type}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, type: v } : it)))
                                }
                            />
                            <InputField
                                label="النوع (English)"
                                value={item.typeEn ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, typeEn: v || undefined } : it)))
                                }
                            />
                        </div>
                        <TextareaField
                            label="الوصف (عربي)"
                            value={item.description ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, description: v || undefined } : it)))
                            }
                            rows={2}
                        />
                        <TextareaField
                            label="الوصف (English)"
                            value={item.descriptionEn ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, descriptionEn: v || undefined } : it)))
                            }
                            rows={2}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="فترة الدوام (عربي)"
                                value={item.workShift ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, workShift: v || undefined } : it)))
                                }
                            />
                            <InputField
                                label="فترة الدوام (English)"
                                value={item.workShiftEn ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, workShiftEn: v || undefined } : it)))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="مدة الدوام (عربي)"
                                value={item.workDuration ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, workDuration: v || undefined } : it)))
                                }
                            />
                            <InputField
                                label="مدة الدوام (English)"
                                value={item.workDurationEn ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, workDurationEn: v || undefined } : it)))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="الجنس (عربي)"
                                value={item.gender ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, gender: v || undefined } : it)))
                                }
                            />
                            <InputField
                                label="الجنس (English)"
                                value={item.genderEn ?? ""}
                                onChange={(v) =>
                                    updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, genderEn: v || undefined } : it)))
                                }
                            />
                        </div>
                        <InputField
                            label="رابط التقديم"
                            value={item.applyLink ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, applyLink: v || undefined } : it)))
                            }
                            placeholder="/jobs/employment"
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الوظيفة
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function JobsListingView({ block }: { block: JobsListingBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = block.header

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="py-16 px-4" {...blockProps}>
                <div className="container mx-auto max-w-6xl">
                    {header && (
                        <div className="flex items-center justify-between mb-8">
                            {header.title && <h2 className="text-3xl font-bold">{header.title}</h2>}
                            {block.items.length > 0 && (
                                <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold">
                                    {block.items.length} {block.items.length === 1 ? "وظيفة" : "وظائف"}
                                </div>
                            )}
                        </div>
                    )}

                    {block.items.length === 0 ? (
                        <div className="p-12 text-center bg-card border-2 border-border rounded-2xl">
                            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">
                                {block.emptyStateMessage || "لا توجد وظائف متاحة حالياً"}
                            </h3>
                            <p className="text-muted-foreground">يرجى المراجعة لاحقاً للاطلاع على الفرص الجديدة</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {block.items.map((job) => (
                                <div
                                    key={job.id}
                                    className="p-6 bg-card border-2 border-border hover:border-cyan-500/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div className="flex-1 min-w-[200px]">
                                                <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                                                <div className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-base font-semibold">
                                                    {job.type}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</span>
                                            </div>
                                        </div>

                                        {job.description && (
                                            <div className="bg-muted/30 rounded-lg p-4">
                                                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                                            </div>
                                        )}

                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                                            {job.workShift && (
                                                <div className="flex items-center gap-3 bg-blue-500/5 rounded-lg p-3">
                                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Clock className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground mb-1">فترة الدوام</p>
                                                        <p className="font-semibold text-sm truncate">{job.workShift}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {job.workDuration && (
                                                <div className="flex items-center gap-3 bg-green-500/5 rounded-lg p-3">
                                                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Timer className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground mb-1">مدة الدوام</p>
                                                        <p className="font-semibold text-sm truncate">{job.workDuration}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {job.gender && (
                                                <div className="flex items-center gap-3 bg-purple-500/5 rounded-lg p-3">
                                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Users className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground mb-1">الجنس المطلوب</p>
                                                        <p className="font-semibold text-sm truncate">{job.gender}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 bg-cyan-500/5 rounded-lg p-3">
                                                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Briefcase className="w-5 h-5 text-cyan-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground mb-1">نوع الوظيفة</p>
                                                    <p className="font-semibold text-sm truncate">{job.type}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <a
                                                href={job.applyLink || "/jobs/employment"}
                                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                            >
                                                تقديم طلب التوظيف
                                                <ArrowRight className="w-5 h-5 mr-2" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
