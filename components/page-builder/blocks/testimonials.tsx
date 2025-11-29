import * as React from "react"
import { Block, TestimonialsBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"

export function TestimonialsEditor({
    block,
    onChange,
}: {
    block: TestimonialsBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<TestimonialsBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: TestimonialsBlock["items"]) => TestimonialsBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <TextareaField label="الوصف" value={header.description ?? ""} onChange={(v) => updateHeader({ description: v || undefined })} rows={2} />

            <SelectField
                label="التخطيط (Layout)"
                value={block.layout ?? "grid"}
                onChange={(v) => update({ layout: v as "grid" | "slider" })}
                options={[
                    { value: "grid", label: "شبكة" },
                    { value: "slider", label: "سلايدر" },
                ]}
            />

            {block.layout === "grid" && (
                <SelectField
                    label="الأعمدة"
                    value={String(block.columns ?? 3)}
                    onChange={(v) => update({ columns: Number(v) as 2 | 3 })}
                    options={[
                        { value: "2", label: "عمودين" },
                        { value: "3", label: "3 أعمدة" },
                    ]}
                />
            )}

            {block.layout === "slider" && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="autoplay"
                            checked={block.autoplay ?? false}
                            onChange={(e) => update({ autoplay: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        <label htmlFor="autoplay" className="text-[11px]">
                            تشغيل تلقائي
                        </label>
                    </div>
                    {block.autoplay && (
                        <InputField
                            label="الفاصل الزمني (ms)"
                            value={(block.interval ?? 5000).toString()}
                            onChange={(v) => update({ interval: parseInt(v) || 5000 })}
                            type="number"
                        />
                    )}
                </div>
            )}

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الآراء</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    quote: "رأي رائع...",
                                    author: "اسم",
                                    rating: 5,
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة رأي
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <TextareaField
                            label="النص"
                            value={item.quote}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, quote: v } : i)))}
                            rows={3}
                        />
                        <InputField
                            label="الكاتب"
                            value={item.author}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, author: v } : i)))}
                        />
                        <InputField
                            label="الدور"
                            value={item.role ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, role: v || undefined } : i)))
                            }
                        />
                        <SelectField
                            label="التقييم"
                            value={String(item.rating ?? 5)}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, rating: Number(v) } : i)))
                            }
                            options={[
                                { value: "5", label: "5 نجوم" },
                                { value: "4", label: "4 نجوم" },
                                { value: "3", label: "3 نجوم" },
                                { value: "2", label: "نجمتان" },
                                { value: "1", label: "نجمة واحدة" },
                            ]}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الرأي
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as any} />
        </div>
    )
}

export function TestimonialsView({ block }: { block: TestimonialsBlock }) {
    const header = block.header
    const isSlider = block.layout === "slider"

    if (isSlider) {
        return <TestimonialsSliderView block={block} />
    }

    const colsClass = block.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                {...blockProps}
                className={blockProps.className || ""}
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                {header?.title && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                        {header.description && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                        )}
                    </div>
                )}
                <div className={`grid ${colsClass} gap-6`}>
                    {block.items.map((item) => (
                        <div key={item.id} className="rounded-2xl bg-white p-6 shadow-sm">
                            <p className="mb-4 italic text-slate-700">"{item.quote}"</p>
                            <div className="flex items-center gap-3">
                                {item.avatarUrl && (
                                    <img
                                        src={item.avatarUrl || "/placeholder.svg"}
                                        alt={item.author}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold text-slate-900">{item.author}</p>
                                    {item.role && <p className="text-sm text-slate-600">{item.role}</p>}
                                </div>
                            </div>
                            {item.rating && (
                                <div className="mt-3 text-yellow-400">
                                    {"★".repeat(item.rating)}
                                    {"☆".repeat(5 - item.rating)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}

function TestimonialsSliderView({ block }: { block: TestimonialsBlock }) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const header = block.header

    // Auto-advance slides
    React.useEffect(() => {
        if (!block.autoplay || block.items.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % block.items.length)
        }, block.interval || 5000)
        return () => clearInterval(timer)
    }, [block.autoplay, block.interval, block.items.length])

    const goToSlide = (index: number) => setCurrentIndex(index)
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % block.items.length)
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + block.items.length) % block.items.length)

    if (!block.items.length) {
        return (
            <SectionContainer
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center text-slate-500">
                    لا توجد آراء لعرضها
                </div>
            </SectionContainer>
        )
    }

    const currentItem = block.items[currentIndex]

    return (
        <SectionContainer
            backgroundColor={block.backgroundColor}
            padding={block.padding}
            containerWidth={block.containerWidth}
        >
            {header?.title && (
                <div className="mb-8 text-center">
                    <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                    {header.description && (
                        <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
                    )}
                </div>
            )}

            <div className="relative mx-auto max-w-4xl">
                {/* Main testimonial card */}
                <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
                    {/* Rating stars */}
                    <div className="mb-4 flex justify-center gap-1">
                        {[...Array(currentItem.rating || 5)].map((_, i) => (
                            <span key={i} className="text-2xl text-yellow-400">
                                ★
                            </span>
                        ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="mb-6 text-center text-xl italic leading-relaxed text-slate-700 md:text-2xl">
                        "{currentItem.quote}"
                    </blockquote>

                    {/* Author info */}
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{currentItem.author}</p>
                        {currentItem.role && <p className="mt-1 text-sm text-slate-500">{currentItem.role}</p>}
                    </div>
                </div>

                {/* Navigation arrows */}
                {block.items.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-emerald-50"
                            aria-label="السابق"
                        >
                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-emerald-50"
                            aria-label="التالي"
                        >
                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Dots navigation */}
                {block.items.length > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {block.items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all ${index === currentIndex ? "w-8 bg-emerald-600" : "bg-slate-300 hover:bg-slate-400"
                                    }`}
                                aria-label={`الشريحة ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SectionContainer>
    )
}
