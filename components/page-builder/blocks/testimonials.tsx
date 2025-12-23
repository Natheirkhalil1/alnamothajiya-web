import * as React from "react"
import { Block, TestimonialsBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import { InputField, ImageField, SelectField, TextareaField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { getTestimonials, type Testimonial, type PendingReview } from "@/lib/storage"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage-adapter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Star, Plus, Upload, X, User, Flame } from "lucide-react"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { app } from "@/lib/firebase"

// Firebase review interface
interface FirebaseReview {
    id: string
    comment: string
    imageUrl?: string
    isVisible?: boolean
    publishedAt?: any
    rating: number
}

export function TestimonialsEditor({
    block,
    onChange,
}: {
    block: TestimonialsBlock
    onChange: (b: Block) => void
}) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const [dashboardTestimonials, setDashboardTestimonials] = React.useState<Testimonial[]>([])
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<TestimonialsBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: TestimonialsBlock["items"]) => TestimonialsBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    // Load testimonials from dashboard
    React.useEffect(() => {
        const loadTestimonials = async () => {
            const testimonials = await getTestimonials()
            setDashboardTestimonials(testimonials)
        }
        loadTestimonials()
    }, [])

    // Load testimonials from dashboard
    const loadFromDashboard = async () => {
        const testimonials = await getTestimonials()
        const newItems = testimonials.map((t) => ({
            id: t.id,
            quote: t.comment,
            quoteEn: t.comment,
            author: t.name,
            authorEn: t.name,
            avatarUrl: t.image,
            rating: t.rating,
        }))
        onChange({ ...block, items: newItems, useTestimonialsFromDashboard: true })
    }

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
            />
            <TextareaField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (header.description ?? "") : (header.descriptionEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { description: v || undefined } : { descriptionEn: v || undefined })}
                rows={2}
            />

            {/* Option to load from dashboard */}
            <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-amber-700">
                        {isAr ? "تحميل الآراء من لوحة التحكم" : "Load Reviews from Dashboard"}
                    </span>
                    <button
                        type="button"
                        onClick={loadFromDashboard}
                        className="rounded-full bg-amber-500 text-white px-3 py-1 text-[11px] hover:bg-amber-600"
                    >
                        {isAr ? "تحميل" : "Load"} ({dashboardTestimonials.length})
                    </button>
                </div>
                <p className="text-[10px] text-amber-600">
                    {isAr
                        ? "سيتم تحميل الآراء المعتمدة من قسم التقييمات في لوحة التحكم"
                        : "Load approved reviews from the Testimonials section in dashboard"
                    }
                </p>
            </div>

            {/* Enable Firebase reviews */}
            <div className="p-2 bg-orange-50 rounded-md border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="enableFirebaseReviews"
                        checked={block.enableFirebaseReviews ?? true}
                        onChange={(e) => update({ enableFirebaseReviews: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600"
                    />
                    <label htmlFor="enableFirebaseReviews" className="font-medium text-orange-700">
                        {isAr ? "تضمين التقييمات من Firebase" : "Include Firebase Reviews"}
                    </label>
                </div>
                <p className="text-[10px] text-orange-600">
                    {isAr
                        ? "سيتم تحميل التقييمات من مجموعة school_reviews في Firebase"
                        : "Load reviews from school_reviews collection in Firebase"
                    }
                </p>
            </div>

            {/* Enable public submission */}
            <div className="p-2 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="enablePublicSubmission"
                        checked={block.enablePublicSubmission ?? false}
                        onChange={(e) => update({ enablePublicSubmission: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                    />
                    <label htmlFor="enablePublicSubmission" className="font-medium text-green-700">
                        {isAr ? "السماح بإضافة تقييمات من الزوار" : "Allow Public Review Submissions"}
                    </label>
                </div>
                <p className="text-[10px] text-green-600">
                    {isAr
                        ? "سيتمكن الزوار من إضافة تقييماتهم، وستظهر في لوحة التحكم للموافقة عليها"
                        : "Visitors can submit reviews which will appear in dashboard for approval"
                    }
                </p>
            </div>

            <SelectField
                label={isAr ? "التخطيط (Layout)" : "Layout"}
                value={block.layout ?? "grid"}
                onChange={(v) => update({ layout: v as "grid" | "slider" })}
                options={[
                    { value: "grid", label: isAr ? "شبكة" : "Grid" },
                    { value: "slider", label: isAr ? "سلايدر" : "Slider" },
                ]}
            />

            {block.layout === "grid" && (
                <SelectField
                    label={isAr ? "الأعمدة" : "Columns"}
                    value={String(block.columns ?? 3)}
                    onChange={(v) => update({ columns: Number(v) as 2 | 3 })}
                    options={[
                        { value: "2", label: isAr ? "عمودين" : "2 Columns" },
                        { value: "3", label: isAr ? "3 أعمدة" : "3 Columns" },
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
                            {isAr ? "تشغيل تلقائي" : "Autoplay"}
                        </label>
                    </div>
                    {block.autoplay && (
                        <InputField
                            label={isAr ? "الفاصل الزمني (ms)" : "Interval (ms)"}
                            value={(block.interval ?? 5000).toString()}
                            onChange={(v) => update({ interval: parseInt(v) || 5000 })}
                            type="number"
                        />
                    )}
                </div>
            )}

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{isAr ? "الآراء" : "Testimonials"}</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    quote: "رأي رائع...",
                                    quoteEn: "Great testimonial...",
                                    author: "اسم",
                                    authorEn: "Name",
                                    rating: 5,
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        {isAr ? "+ إضافة رأي" : "+ Add Testimonial"}
                    </button>
                </div>
                {(block.items || []).map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <TextareaField
                            label={isAr ? "النص" : "Quote"}
                            value={isAr ? item.quote : (item.quoteEn ?? "")}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, quote: v } : { ...i, quoteEn: v }) : i)))}
                            rows={3}
                        />
                        <InputField
                            label={isAr ? "الكاتب" : "Author"}
                            value={isAr ? item.author : (item.authorEn ?? "")}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, author: v } : { ...i, authorEn: v }) : i)))}
                        />
                        <InputField
                            label={isAr ? "الدور" : "Role"}
                            value={isAr ? (item.role ?? "") : (item.roleEn ?? "")}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? (isAr ? { ...i, role: v || undefined } : { ...i, roleEn: v || undefined }) : i)))
                            }
                        />
                        <ImageField
                            label={isAr ? "الصورة الشخصية" : "Avatar"}
                            value={item.avatarUrl ?? ""}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, avatarUrl: v || undefined } : i)))
                            }
                        />
                        <SelectField
                            label={isAr ? "التقييم" : "Rating"}
                            value={String(item.rating ?? 5)}
                            onChange={(v) =>
                                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, rating: Number(v) } : i)))
                            }
                            options={[
                                { value: "5", label: isAr ? "5 نجوم" : "5 Stars" },
                                { value: "4", label: isAr ? "4 نجوم" : "4 Stars" },
                                { value: "3", label: isAr ? "3 نجوم" : "3 Stars" },
                                { value: "2", label: isAr ? "نجمتان" : "2 Stars" },
                                { value: "1", label: isAr ? "نجمة واحدة" : "1 Star" },
                            ]}
                        />
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            {isAr ? "حذف الرأي" : "Delete Testimonial"}
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update as any} />
        </div>
    )
}

export function TestimonialsView({ block }: { block: TestimonialsBlock }) {
    const { language } = useLanguage()
    const isAr = language === "ar"
    const header = block.header
    const isSlider = block.layout === "slider"
    const [showSubmissionForm, setShowSubmissionForm] = React.useState(false)
    const [submitted, setSubmitted] = React.useState(false)
    const [formData, setFormData] = React.useState({ name: "", comment: "", rating: 5, image: "" })
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert(isAr ? "حجم الصورة يجب أن يكون أقل من 2 ميجابايت" : "Image size must be less than 2MB")
                return
            }
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert(isAr ? "الرجاء اختيار ملف صورة" : "Please select an image file")
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                setFormData(prev => ({ ...prev, image: base64 }))
                setImagePreview(base64)
            }
            reader.readAsDataURL(file)
        }
    }

    const clearImage = () => {
        setFormData(prev => ({ ...prev, image: "" }))
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    const [liveTestimonials, setLiveTestimonials] = React.useState<TestimonialsBlock["items"]>([])
    const [firebaseReviews, setFirebaseReviews] = React.useState<TestimonialsBlock["items"]>([])

    // Load Firebase reviews from school_reviews collection
    React.useEffect(() => {
        // Enable by default if not explicitly set
        const shouldFetch = block.enableFirebaseReviews ?? true

        if (!shouldFetch) {
            setFirebaseReviews([])
            return
        }

        const fetchFirebaseReviews = async () => {
            try {
                const db = getFirestore(app)
                const reviewsRef = collection(db, "school_reviews")
                console.log("[Testimonials] Fetching Firebase reviews from /school_reviews")
                const snapshot = await getDocs(reviewsRef)
                console.log("[Testimonials] Found", snapshot.size, "documents")
                const items: TestimonialsBlock["items"] = []
                snapshot.forEach((doc) => {
                    const data = doc.data() as FirebaseReview
                    console.log("[Testimonials] Document:", doc.id, data)
                    // Only include visible reviews
                    if (data.isVisible !== false) {
                        items.push({
                            id: doc.id,
                            quote: data.comment,
                            quoteEn: data.comment,
                            author: "", // Firebase reviews don't have author name
                            authorEn: "",
                            avatarUrl: data.imageUrl,
                            rating: data.rating || 5,
                            isFirebaseReview: true,
                        } as any)
                    }
                })
                // Sort by publishedAt if available
                items.sort((a: any, b: any) => {
                    const dateA = a.publishedAt?.toDate?.() || new Date(0)
                    const dateB = b.publishedAt?.toDate?.() || new Date(0)
                    return dateB.getTime() - dateA.getTime()
                })
                console.log("[Testimonials] Final items:", items.length)
                setFirebaseReviews(items)
            } catch (error) {
                console.error("Error fetching Firebase reviews:", error)
            }
        }
        fetchFirebaseReviews()
    }, [block.enableFirebaseReviews, block])

    // Always load approved testimonials from dashboard
    React.useEffect(() => {
        const loadApprovedTestimonials = async () => {
            const approvedReviews = await getTestimonials()
            // Convert Testimonial format to block item format
            const items = approvedReviews.map((t) => ({
                id: t.id,
                quote: t.comment,
                quoteEn: t.comment,
                author: t.name,
                authorEn: t.name,
                avatarUrl: t.image,
                rating: t.rating,
            }))
            setLiveTestimonials(items)
        }
        loadApprovedTestimonials()

        // Listen for storage changes to update live
        const handleStorageChange = () => {
            loadApprovedTestimonials()
        }
        window.addEventListener("localStorageChange" as any, handleStorageChange)
        return () => window.removeEventListener("localStorageChange" as any, handleStorageChange)
    }, [])

    // Combine dashboard testimonials with Firebase reviews
    const displayItems = React.useMemo(() => {
        const dashboardItems = liveTestimonials.length > 0 ? liveTestimonials : (block.items || [])
        return [...dashboardItems, ...firebaseReviews]
    }, [liveTestimonials, firebaseReviews, block.items])

    // Language-specific helpers
    const getHeaderTitle = () => language === "ar" ? header?.title : (header?.titleEn || header?.title)
    const getHeaderDescription = () => language === "ar" ? header?.description : (header?.descriptionEn || header?.description)
    const getQuote = (item: TestimonialsBlock["items"][0]) => language === "ar" ? item.quote : (item.quoteEn || item.quote)
    const getAuthor = (item: TestimonialsBlock["items"][0]) => language === "ar" ? item.author : (item.authorEn || item.author)
    const getRole = (item: TestimonialsBlock["items"][0]) => language === "ar" ? item.role : (item.roleEn || item.role)

    // Handle public submission
    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault()
        const pendingReviews = getFromLocalStorage<PendingReview[]>("pendingReviews", [])
        const newReview: PendingReview = {
            id: `review-${Date.now()}`,
            name: formData.name,
            image: formData.image,
            rating: formData.rating,
            comment: formData.comment,
            submittedAt: new Date().toISOString(),
        }
        pendingReviews.push(newReview)
        saveToLocalStorage("pendingReviews", pendingReviews)
        setSubmitted(true)
        setFormData({ name: "", comment: "", rating: 5, image: "" })
        setImagePreview(null)
    }

    if (isSlider) {
        return <TestimonialsSliderView block={block} items={displayItems} />
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
                dir={isAr ? "rtl" : "ltr"}
            >
                {getHeaderTitle() && (
                    <div className="mb-8 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{getHeaderTitle()}</h2>
                        {getHeaderDescription() && (
                            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{getHeaderDescription()}</p>
                        )}
                    </div>
                )}
                <div className={`grid ${colsClass} gap-6`}>
                    {displayItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 p-6 shadow-sm border border-teal-100/50 dark:border-teal-800/30 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                            {/* Content */}
                            <div className="relative z-10 text-center">
                                {/* Avatar */}
                                <div className="mb-4 flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={item.avatarUrl || "/placeholder.svg?height=80&width=80"}
                                            alt={getAuthor(item)}
                                            className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 rounded-full border-2 border-teal-400/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                                    </div>
                                </div>

                                {/* Name */}
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors duration-300">
                                    {getAuthor(item)}
                                </h4>

                                {/* Role if exists */}
                                {getRole(item) && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{getRole(item)}</p>
                                )}

                                {/* Stars Rating */}
                                <div className="flex justify-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 transition-all duration-300 ${star <= (item.rating || 5)
                                                ? "fill-amber-400 text-amber-400 group-hover:scale-110"
                                                : "text-slate-300 dark:text-slate-600"
                                                }`}
                                            style={{ transitionDelay: `${star * 50}ms` }}
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                    "{getQuote(item)}"
                                </p>
                            </div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Public Submission Form */}
                {block.enablePublicSubmission && (
                    <div className="mt-12 max-w-xl mx-auto">
                        {!showSubmissionForm && !submitted && (
                            <div className="text-center">
                                <button
                                    onClick={() => setShowSubmissionForm(true)}
                                    className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:from-teal-600 hover:via-emerald-600 hover:to-blue-600 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>{isAr ? "شارك رأيك" : "Share Your Review"}</span>
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {submitted && (
                            <div className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-green-700 mb-2">
                                    {isAr ? "شكراً لك!" : "Thank you!"}
                                </h3>
                                <p className="text-green-600 mb-6">
                                    {isAr
                                        ? "تم إرسال تقييمك وسيتم مراجعته قريباً"
                                        : "Your review has been submitted and will be reviewed soon"}
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false)
                                        setShowSubmissionForm(false)
                                    }}
                                    className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full shadow-lg shadow-green-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    {isAr ? "حسناً" : "OK"}
                                </button>
                            </div>
                        )}

                        {showSubmissionForm && !submitted && (
                            <div className="p-6 bg-white rounded-2xl shadow-lg border">
                                <h3 className="text-xl font-bold mb-4">
                                    {isAr ? "أضف تقييمك" : "Add Your Review"}
                                </h3>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{isAr ? "الاسم" : "Name"} *</Label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder={isAr ? "اسمك الكامل" : "Your full name"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{isAr ? "التقييم" : "Rating"}</Label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                    className="text-2xl transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{isAr ? "تعليقك" : "Your Review"} *</Label>
                                        <Textarea
                                            required
                                            rows={4}
                                            value={formData.comment}
                                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder={isAr ? "شاركنا تجربتك..." : "Share your experience..."}
                                        />
                                    </div>
                                    {/* Photo Upload */}
                                    <div className="space-y-2">
                                        <Label>{isAr ? "صورتك (اختياري)" : "Your Photo (optional)"}</Label>
                                        <div className="flex items-center gap-4">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-20 h-20 rounded-full object-cover border-4 border-teal-200 shadow-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={clearImage}
                                                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                    <User className="w-8 h-8 text-slate-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="photo-upload"
                                                />
                                                <label
                                                    htmlFor="photo-upload"
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    {isAr ? "اختر صورة" : "Choose Photo"}
                                                </label>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {isAr ? "الحد الأقصى: 2 ميجابايت" : "Max size: 2MB"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="group flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:from-teal-600 hover:via-emerald-600 hover:to-blue-600 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            {isAr ? "إرسال التقييم" : "Submit Review"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowSubmissionForm(false)}
                                            className="px-6 py-4 text-base font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full hover:scale-105 transition-all duration-300"
                                        >
                                            {isAr ? "إلغاء" : "Cancel"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </SectionContainer>
        </>
    )
}

function TestimonialsSliderView({ block, items }: { block: TestimonialsBlock; items: TestimonialsBlock["items"] }) {
    const { language } = useLanguage()
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const header = block.header

    // Language-specific helpers
    const getHeaderTitle = () => language === "ar" ? header?.title : (header?.titleEn || header?.title)
    const getHeaderDescription = () => language === "ar" ? header?.description : (header?.descriptionEn || header?.description)
    const getQuote = (item: TestimonialsBlock["items"][0]) => language === "ar" ? item.quote : (item.quoteEn || item.quote)
    const getAuthor = (item: TestimonialsBlock["items"][0]) => language === "ar" ? item.author : (item.authorEn || item.author)
    const getRole = (item: TestimonialsBlock["items"][0]) => language === "ar" ? item.role : (item.roleEn || item.role)
    const getNoTestimonialsText = () => language === "ar" ? "لا توجد آراء لعرضها" : "No testimonials to display"
    const getPrevLabel = () => language === "ar" ? "السابق" : "Previous"
    const getNextLabel = () => language === "ar" ? "التالي" : "Next"
    const getSlideLabel = (index: number) => language === "ar" ? `الشريحة ${index + 1}` : `Slide ${index + 1}`

    // Auto-advance slides
    React.useEffect(() => {
        if (!block.autoplay || items.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length)
        }, block.interval || 5000)
        return () => clearInterval(timer)
    }, [block.autoplay, block.interval, items.length])

    const goToSlide = (index: number) => setCurrentIndex(index)
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length)
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)

    if (!items.length) {
        const isArEmpty = language === "ar"
        return (
            <SectionContainer
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
                dir={isArEmpty ? "rtl" : "ltr"}
            >
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center text-slate-500">
                    {getNoTestimonialsText()}
                </div>
            </SectionContainer>
        )
    }

    const currentItem = items[currentIndex]

    const isAr = language === "ar"

    return (
        <SectionContainer
            backgroundColor={block.backgroundColor}
            padding={block.padding}
            containerWidth={block.containerWidth}
            dir={isAr ? "rtl" : "ltr"}
        >
            {getHeaderTitle() && (
                <div className="mb-8 text-center">
                    <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{getHeaderTitle()}</h2>
                    {getHeaderDescription() && (
                        <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{getHeaderDescription()}</p>
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
                        "{getQuote(currentItem)}"
                    </blockquote>

                    {/* Author info */}
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{getAuthor(currentItem)}</p>
                        {getRole(currentItem) && <p className="mt-1 text-sm text-slate-500">{getRole(currentItem)}</p>}
                    </div>
                </div>

                {/* Navigation arrows */}
                {items.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-emerald-50 ${isAr ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`}
                            aria-label={getPrevLabel()}
                        >
                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-emerald-50 ${isAr ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
                            aria-label={getNextLabel()}
                        >
                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                            </svg>
                        </button>
                    </>
                )}

                {/* Dots navigation */}
                {items.length > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all ${index === currentIndex ? "w-8 bg-emerald-600" : "bg-slate-300 hover:bg-slate-400"
                                    }`}
                                aria-label={getSlideLabel(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SectionContainer>
    )
}
