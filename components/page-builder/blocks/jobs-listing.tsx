import * as React from "react"
import { Block, JobsListingBlock } from "../types"
import { InputField, TextareaField, createId, StylingGroup, applyBlockStyles, SelectField } from "../utils"
import { Briefcase, Clock, Users, Timer, Calendar, ArrowRight, ArrowLeft, Building2 } from "lucide-react"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { getJobPositions, type JobPosition } from "@/lib/storage"

export function JobsListingEditor({ block, onChange }: { block: JobsListingBlock; onChange: (b: Block) => void }) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const [dashboardJobs, setDashboardJobs] = React.useState<JobPosition[]>([])
    const header = block.header ?? {}
    const items = block.items || []
    const updateHeader = (patch: Partial<typeof header>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<JobsListingBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: JobsListingBlock["items"]) => JobsListingBlock["items"]) =>
        onChange({ ...block, items: updater(items) })

    // Load jobs from dashboard
    React.useEffect(() => {
        const loadJobs = async () => {
            const jobs = await getJobPositions()
            setDashboardJobs(jobs)
        }
        loadJobs()
    }, [])

    // Load jobs from dashboard
    const loadFromDashboard = async () => {
        const jobs = await getJobPositions()
        const newItems = jobs.map((job) => ({
            id: job.id,
            title: job.title,
            titleEn: job.titleEn,
            type: job.type,
            typeEn: job.typeEn,
            description: job.description,
            descriptionEn: job.descriptionEn,
            workShift: job.workShift,
            workShiftEn: job.workShiftEn,
            workDuration: job.workDuration,
            workDurationEn: job.workDurationEn,
            gender: job.gender,
            genderEn: job.genderEn,
            applyLink: "/jobs/employment",
        }))
        onChange({ ...block, items: newItems, useJobsFromDashboard: true })
    }

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <InputField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (header.description ?? "") : (header.descriptionEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { description: v || undefined } : { descriptionEn: v || undefined })}
            />
            <TextareaField
                label={isAr ? "رسالة عدم وجود وظائف" : "No Jobs Message"}
                value={isAr ? (block.emptyStateMessage ?? "") : (block.emptyStateMessageEn ?? "")}
                onChange={(v) => update(isAr ? { emptyStateMessage: v || undefined } : { emptyStateMessageEn: v || undefined })}
                rows={2}
                placeholder={isAr ? "لا توجد وظائف متاحة حالياً" : "No jobs available at this time"}
            />

            {/* Option to use jobs from dashboard */}
            <div className="p-2 bg-cyan-50 rounded-md border border-cyan-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-cyan-700">
                        {isAr ? "استخدام الوظائف من لوحة التحكم" : "Use Jobs from Dashboard"}
                    </span>
                    <button
                        type="button"
                        onClick={loadFromDashboard}
                        className="rounded-full bg-cyan-500 text-white px-3 py-1 text-[11px] hover:bg-cyan-600"
                    >
                        {isAr ? "تحميل الوظائف" : "Load Jobs"} ({dashboardJobs.length})
                    </button>
                </div>
                <p className="text-[10px] text-cyan-600">
                    {isAr
                        ? "سيتم تحميل جميع الوظائف من قسم الوظائف في لوحة التحكم"
                        : "This will load all jobs from the Jobs section in the dashboard"
                    }
                </p>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الوظائف" : "Jobs"} ({items.length})</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((currentItems) => [
                                ...currentItems,
                                {
                                    id: createId(),
                                    title: "وظيفة جديدة",
                                    titleEn: "New Job",
                                    type: "دوام كامل",
                                    typeEn: "Full Time",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة وظيفة يدوياً" : "+ Add Job Manually"}
                    </button>
                </div>
                {items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <InputField
                            label={isAr ? "العنوان" : "Title"}
                            value={isAr ? item.title : (item.titleEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? (isAr ? { ...it, title: v } : { ...it, titleEn: v || undefined }) : it)))
                            }
                        />
                        <InputField
                            label={isAr ? "النوع" : "Type"}
                            value={isAr ? item.type : (item.typeEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? (isAr ? { ...it, type: v } : { ...it, typeEn: v || undefined }) : it)))
                            }
                        />
                        <TextareaField
                            label={isAr ? "الوصف" : "Description"}
                            value={isAr ? (item.description ?? "") : (item.descriptionEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? (isAr ? { ...it, description: v || undefined } : { ...it, descriptionEn: v || undefined }) : it)))
                            }
                            rows={2}
                        />
                        <InputField
                            label={isAr ? "فترة الدوام" : "Work Shift"}
                            value={isAr ? (item.workShift ?? "") : (item.workShiftEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? (isAr ? { ...it, workShift: v || undefined } : { ...it, workShiftEn: v || undefined }) : it)))
                            }
                        />
                        <InputField
                            label={isAr ? "مدة الدوام" : "Work Duration"}
                            value={isAr ? (item.workDuration ?? "") : (item.workDurationEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? (isAr ? { ...it, workDuration: v || undefined } : { ...it, workDurationEn: v || undefined }) : it)))
                            }
                        />
                        <InputField
                            label={isAr ? "الجنس المطلوب" : "Gender Required"}
                            value={isAr ? (item.gender ?? "") : (item.genderEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((it) => (it.id === item.id ? (isAr ? { ...it, gender: v || undefined } : { ...it, genderEn: v || undefined }) : it)))
                            }
                        />
                        <InputField
                            label={isAr ? "رابط التقديم" : "Application Link"}
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
                            {isAr ? "حذف الوظيفة" : "Delete Job"}
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function JobsListingView({ block }: { block: JobsListingBlock }) {
    const { language } = useLanguage()
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const header = block.header
    const [liveJobs, setLiveJobs] = React.useState<JobPosition[]>([])

    // Always load jobs from dashboard on mount
    React.useEffect(() => {
        const loadJobs = async () => {
            const jobs = await getJobPositions()
            setLiveJobs(jobs)
        }
        loadJobs()
    }, [])

    // Use live jobs from dashboard, fallback to block items if any
    const jobs = liveJobs.length > 0 ? liveJobs.map(job => ({
        id: job.id,
        title: job.title,
        titleEn: job.titleEn,
        type: job.type,
        typeEn: job.typeEn,
        description: job.description,
        descriptionEn: job.descriptionEn,
        workShift: job.workShift,
        workShiftEn: job.workShiftEn,
        workDuration: job.workDuration,
        workDurationEn: job.workDurationEn,
        gender: job.gender,
        genderEn: job.genderEn,
        applyLink: `/${language}/jobs/apply?id=${job.id}`,
    })) : (block.items || [])

    // Language-specific helpers
    const getHeaderTitle = () => language === "ar" ? header?.title : (header?.titleEn || header?.title)
    const getEmptyMessage = () => language === "ar" ? (block.emptyStateMessage || "لا توجد وظائف متاحة حالياً") : (block.emptyStateMessageEn || block.emptyStateMessage || "No jobs available at this time")
    const getCheckLaterText = () => language === "ar" ? "يرجى المراجعة لاحقاً للاطلاع على الفرص الجديدة" : "Please check back later for new opportunities"
    const getJobCountText = (count: number) => language === "ar" ? (count === 1 ? "وظيفة" : "وظائف") : (count === 1 ? "job" : "jobs")
    const getApplyText = () => language === "ar" ? "تقديم طلب التوظيف" : "Apply Now"
    const getWorkShiftLabel = () => language === "ar" ? "فترة الدوام" : "Work Shift"
    const getWorkDurationLabel = () => language === "ar" ? "مدة الدوام" : "Duration"
    const getGenderLabel = () => language === "ar" ? "الجنس المطلوب" : "Gender Required"
    const getJobTypeLabel = () => language === "ar" ? "نوع الوظيفة" : "Job Type"

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <section className="py-16 px-4" {...blockProps} dir={language === "ar" ? "rtl" : "ltr"}>
                <div className="container mx-auto max-w-6xl">
                    {header && (
                        <div className="flex items-center justify-between mb-8">
                            {getHeaderTitle() && <h2 className="text-3xl font-bold">{getHeaderTitle()}</h2>}
                            {jobs.length > 0 && (
                                <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold">
                                    {jobs.length} {getJobCountText(jobs.length)}
                                </div>
                            )}
                        </div>
                    )}

                    {jobs.length === 0 ? (
                        <div className="p-12 text-center bg-card border-2 border-border rounded-2xl">
                            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">
                                {getEmptyMessage()}
                            </h3>
                            <p className="text-muted-foreground">{getCheckLaterText()}</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {jobs.map((job) => {
                                const jobTitle = language === "ar" ? job.title : (job.titleEn || job.title)
                                const jobType = language === "ar" ? job.type : (job.typeEn || job.type)
                                const jobDescription = language === "ar" ? job.description : (job.descriptionEn || job.description)
                                const jobWorkShift = language === "ar" ? job.workShift : (job.workShiftEn || job.workShift)
                                const jobWorkDuration = language === "ar" ? job.workDuration : (job.workDurationEn || job.workDuration)
                                const jobGender = language === "ar" ? job.gender : (job.genderEn || job.gender)

                                return (
                                    <div
                                        key={job.id}
                                        className="p-6 bg-card border-2 border-border hover:border-cyan-500/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                <div className="flex-1 min-w-[200px]">
                                                    <h3 className="text-2xl font-bold mb-2">{jobTitle}</h3>
                                                    <div className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-base font-semibold">
                                                        {jobType}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                                                </div>
                                            </div>

                                            {jobDescription && (
                                                <div className="bg-muted/30 rounded-lg p-4">
                                                    <p className="text-muted-foreground leading-relaxed">{jobDescription}</p>
                                                </div>
                                            )}

                                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                                                {jobWorkShift && (
                                                    <div className="flex items-center gap-3 bg-blue-500/5 rounded-lg p-3">
                                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Clock className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-muted-foreground mb-1">{getWorkShiftLabel()}</p>
                                                            <p className="font-semibold text-sm truncate">{jobWorkShift}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {jobWorkDuration && (
                                                    <div className="flex items-center gap-3 bg-green-500/5 rounded-lg p-3">
                                                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Timer className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-muted-foreground mb-1">{getWorkDurationLabel()}</p>
                                                            <p className="font-semibold text-sm truncate">{jobWorkDuration}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {jobGender && (
                                                    <div className="flex items-center gap-3 bg-purple-500/5 rounded-lg p-3">
                                                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Users className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-muted-foreground mb-1">{getGenderLabel()}</p>
                                                            <p className="font-semibold text-sm truncate">{jobGender}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 bg-cyan-500/5 rounded-lg p-3">
                                                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Briefcase className="w-5 h-5 text-cyan-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground mb-1">{getJobTypeLabel()}</p>
                                                        <p className="font-semibold text-sm truncate">{jobType}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <a
                                                    href={job.applyLink || "/jobs/employment"}
                                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                                >
                                                    {getApplyText()}
                                                    {language === "ar" ? (
                                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                                    ) : (
                                                        <ArrowRight className="w-5 h-5 ml-2" />
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
