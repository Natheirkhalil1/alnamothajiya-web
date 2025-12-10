import * as React from "react"
import { Block, PricingTableBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, TextareaField, SelectField, SectionContainer, createId, applyBlockStyles } from "../utils"

export function PricingTableEditor({ block, onChange }: { block: PricingTableBlock; onChange: (b: Block) => void }) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const updateItems = (updater: (items: PricingTableBlock["items"]) => PricingTableBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
            <TextareaField
                label="الوصف"
                value={header.description ?? ""}
                onChange={(v) => updateHeader({ description: v || undefined })}
                rows={2}
            />

            <SelectField
                label="عدد الأعمدة"
                value={block.columns.toString()}
                onChange={(v) => onChange({ ...block, columns: parseInt(v) as 2 | 3 })}
                options={[
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                ]}
            />

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الخطط</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    title: "خطة جديدة",
                                    price: "$0",
                                    features: [],
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة خطة
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                        <InputField
                            label="اسم الخطة"
                            value={item.title}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <InputField
                                label="السعر"
                                value={item.price}
                                onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, price: v } : i)))}
                                placeholder="$99/mo"
                            />
                            <div className="flex items-center gap-2 pt-4">
                                <input
                                    type="checkbox"
                                    id={`featured-${item.id}`}
                                    checked={item.isFeatured ?? false}
                                    onChange={(e) =>
                                        updateItems((items) =>
                                            items.map((i) => (i.id === item.id ? { ...i, isFeatured: e.target.checked } : i))
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                />
                                <label htmlFor={`featured-${item.id}`} className="text-[11px]">
                                    مميزة
                                </label>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium text-slate-600">الميزات</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateItems((items) =>
                                            items.map((i) =>
                                                i.id === item.id ? { ...i, features: [...i.features, "ميزة جديدة"] } : i
                                            )
                                        )
                                    }
                                    className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px]"
                                >
                                    + ميزة
                                </button>
                            </div>
                            {item.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) =>
                                            updateItems((items) =>
                                                items.map((i) =>
                                                    i.id === item.id
                                                        ? { ...i, features: i.features.map((f, fi) => (fi === idx ? e.target.value : f)) }
                                                        : i
                                                )
                                            )
                                        }
                                        className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-[10px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateItems((items) =>
                                                items.map((i) =>
                                                    i.id === item.id ? { ...i, features: i.features.filter((_, fi) => fi !== idx) } : i
                                                )
                                            )
                                        }
                                        className="text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الخطة
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function PricingTableView({ block }: { block: PricingTableBlock }) {
    const header = block.header
    const colsClass = block.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer {...blockProps} className={blockProps.className || ""}>
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
                        <div
                            key={item.id}
                            className={`rounded-2xl border-2 p-8 ${item.isFeatured
                                ? "border-emerald-600 bg-emerald-50 shadow-xl scale-105"
                                : "border-slate-200 bg-white shadow-sm"
                                }`}
                        >
                            {item.isFeatured && (
                                <div className="mb-4 inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                                    الأكثر شعبية
                                </div>
                            )}
                            <h3 className="mb-2 text-2xl font-bold text-slate-900">{item.title}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-slate-900">{item.price}</span>
                                <span className="text-slate-600">/شهرياً</span>
                            </div>
                            <ul className="mb-8 space-y-3">
                                {item.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <svg
                                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm text-slate-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            {item.ctaLabel && item.ctaHref && (
                                <a
                                    href={item.ctaHref}
                                    className={`block w-full rounded-lg py-3 text-center font-semibold transition ${item.isFeatured
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "border-2 border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                        }`}
                                >
                                    {item.ctaLabel}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
