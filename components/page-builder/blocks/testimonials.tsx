"use client"

import * as React from "react"
import type { Block, TestimonialsBlock, SectionHeader } from "../types"
import { nmTheme } from "../theme"
import {
  InputField,
  SelectField,
  TextareaField,
  SectionContainer,
  StylingGroup,
  applyBlockStyles,
} from "../utils"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Star, Upload, X, User, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { collection, getDocs } from "firebase/firestore"
import { app } from "@/lib/firebase"

// Firebase review interface
interface FirebaseReview {
  id: string
  comment: string
  reviewerName?: string
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
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const update = (patch: Partial<TestimonialsBlock>) => onChange({ ...block, ...patch })

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

      {/* Enable Firebase reviews (Always on by default now) */}
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
            {isAr ? "تفعيل التقييمات من Firebase" : "Enable Firebase Reviews"}
          </label>
        </div>
        <p className="text-[10px] text-orange-600">
          {isAr
            ? "سيتم عرض التقييمات المعتمدة من مجموعة school_reviews في Firebase"
            : "Approved reviews from school_reviews collection in Firebase will be displayed"}
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
            : "Visitors can submit reviews which will appear in dashboard for approval"}
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

      {(block.layout === "grid" || block.layout === "slider") && (
        <SelectField
          label={isAr ? "الأعمدة" : "Columns"}
          value={String(block.columns ?? (block.layout === "slider" ? 1 : 3))}
          onChange={(v) => update({ columns: Number(v) as 1 | 2 | 3 })}
          options={[
            { value: "1", label: isAr ? "عمود واحد" : "1 Column" },
            { value: "2", label: isAr ? "عمودين" : "2 Columns" },
            { value: "3", label: isAr ? "3 أعمدة" : "3 Columns" },
          ]}
        />
      )}

      {block.layout === "slider" && (
        <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-2 mt-2">
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
              value={(block.interval ?? 8000).toString()}
              onChange={(v) => update({ interval: Number.parseInt(v) || 8000 })}
              type="number"
            />
          )}
        </div>
      )}

      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-[10px] text-slate-500 text-center italic">
          {isAr
            ? "يتم جلب محتوى الآراء تلقائياً من Firebase. يمكنك إدارة الآراء من لوحة التحكم."
            : "Testimonials content is fetched automatically from Firebase. Manage them in dashboard."}
        </p>
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
  const [firebaseReviews, setFirebaseReviews] = React.useState<TestimonialsBlock["items"]>([])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isAr ? "حجم الصورة يجب أن يكون أقل من 2 ميجابايت" : "Image size must be less than 2MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        alert(isAr ? "الرجاء اختيار ملف صورة" : "Please select an image file")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setFormData((prev) => ({ ...prev, image: base64 }))
        setImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Load Firebase reviews
  React.useEffect(() => {
    const shouldFetch = block.enableFirebaseReviews ?? true
    if (!shouldFetch) {
      setFirebaseReviews([])
      return
    }

    const fetchFirebaseReviews = async () => {
      try {
        const { getDb } = await import("@/lib/firebase")
        const db = getDb()
        const reviewsRef = collection(db, "school_reviews")
        const snapshot = await getDocs(reviewsRef)
        const items: TestimonialsBlock["items"] = []
        snapshot.forEach((doc) => {
          const data = doc.data() as FirebaseReview
          if (data.isVisible !== false) {
            items.push({
              id: doc.id,
              quote: data.comment,
              quoteEn: data.comment,
              author: data.reviewerName || "",
              authorEn: data.reviewerName || "",
              avatarUrl: data.imageUrl,
              rating: data.rating || 5,
            } as any)
          }
        })
        items.sort((a: any, b: any) => {
          const dateA = a.publishedAt?.toDate?.() || new Date(0)
          const dateB = b.publishedAt?.toDate?.() || new Date(0)
          return dateB.getTime() - dateA.getTime()
        })
        setFirebaseReviews(items)
      } catch (error) {
        console.error("Error fetching Firebase reviews:", error)
      }
    }
    fetchFirebaseReviews()
  }, [block.enableFirebaseReviews, block])

  const displayItems = React.useMemo(() => firebaseReviews, [firebaseReviews])

  const getHeaderTitle = () => (language === "ar" ? header?.title : header?.titleEn || header?.title)
  const getHeaderDescription = () =>
    language === "ar" ? header?.description : header?.descriptionEn || header?.description
  const getQuote = (item: TestimonialsBlock["items"][0]) =>
    language === "ar" ? item.quote : item.quoteEn || item.quote
  const getAuthor = (item: TestimonialsBlock["items"][0]) =>
    language === "ar" ? item.author : item.authorEn || item.author
  const getRole = (item: TestimonialsBlock["items"][0]) => (language === "ar" ? item.role : item.roleEn || item.role)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const reviewId = `review-${Date.now()}`
      const submissionData = {
        id: reviewId,
        reviewerName: formData.name,
        imageUrl: formData.image,
        rating: formData.rating,
        comment: formData.comment,
        isVisible: false,
        submittedAt: new Date().toISOString(),
        publishedAt: new Date(),
      }
      const { getDb } = await import("@/lib/firebase")
      const db = getDb()
      const { doc, setDoc } = await import("firebase/firestore")
      await setDoc(doc(db, "school_reviews", reviewId), submissionData)
      setSubmitted(true)
      setFormData({ name: "", comment: "", rating: 5, image: "" })
      setImagePreview(null)
    } catch (error) {
      console.error("[Testimonials] Error submitting review:", error)
      alert(isAr ? "عذراً، حدث خطأ أثناء إرسال تقييمك" : "Sorry, an error occurred while submitting your review")
    }
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
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 mb-4 shadow-sm border border-emerald-200">
              <Star className="w-4 h-4 fill-emerald-500" />
              <span className="text-sm font-medium">
                {isAr ? "آراء عملائنا" : "Customer Reviews"}
              </span>
            </div>
            <h2 className={`mb-4 text-3xl md:text-4xl font-bold text-slate-800`}>{getHeaderTitle()}</h2>
            {getHeaderDescription() && (
              <p className={`mx-auto max-w-2xl text-slate-600 leading-relaxed`}>{getHeaderDescription()}</p>
            )}
          </div>
        )}

        {isSlider ? (
          <div className="-mx-4 sm:-mx-12">
            <TestimonialsSliderView block={block} items={displayItems} isAr={isAr} />
          </div>
        ) : (
          <div className={`grid ${colsClass} gap-6`}>
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 p-8 shadow-md border border-teal-100/50 dark:border-teal-800/30 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col items-center text-center"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10 w-full">
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
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {getAuthor(item)}
                  </h4>
                  {getRole(item) && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{getRole(item)}</p>}
                  <div className="flex justify-center gap-1 mb-6">
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
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-lg line-clamp-4">"{getQuote(item)}"</p>
                </div>
              </div>
            ))}
          </div>
        )}

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
                </button>
              </div>
            )}

            {submitted && (
              <div className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-700 mb-2">{isAr ? "شكراً لك!" : "Thank you!"}</h3>
                <p className="text-green-600 mb-6">{isAr ? "تم إرسال تقييمك وسيتم مراجعته قريباً" : "Your review has been submitted and will be reviewed soon"}</p>
                <button
                  onClick={() => { setSubmitted(false); setShowSubmissionForm(false); }}
                  className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isAr ? "حسناً" : "OK"}
                </button>
              </div>
            )}

            {showSubmissionForm && !submitted && (
              <div className="p-6 bg-white rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">{isAr ? "أضف تقييمك" : "Add Your Review"}</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{isAr ? "الاسم" : "Name"} *</Label>
                    <Input required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder={isAr ? "اسمك الكامل" : "Your full name"} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isAr ? "التقييم" : "Rating"}</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setFormData((prev) => ({ ...prev, rating: star }))} className="text-2xl hover:scale-110 transition-transform">
                          <Star className={`w-8 h-8 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{isAr ? "تعليقك" : "Your Review"} *</Label>
                    <Textarea required rows={4} value={formData.comment} onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))} placeholder={isAr ? "شاركنا تجربتك..." : "Share your experience..."} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isAr ? "صورتك (اختياري)" : "Your Photo (optional)"}</Label>
                    <div className="flex items-center gap-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-20 h-20 rounded-full object-cover border-4 border-teal-200" />
                          <button type="button" onClick={clearImage} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center"><User className="w-8 h-8 text-slate-400" /></div>
                      )}
                      <div className="flex-1">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="photo-upload" />
                        <label htmlFor="photo-upload" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg cursor-pointer">
                          <Upload className="w-4 h-4" />
                          {isAr ? "اختر صورة" : "Choose Photo"}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 py-4 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-lg hover:scale-105 transition-all">
                      {isAr ? "إرسال التقييم" : "Submit Review"}
                    </button>
                    <button type="button" onClick={() => setShowSubmissionForm(false)} className="px-6 py-4 text-base font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
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

function TestimonialsSliderView({ block, items, isAr }: { block: TestimonialsBlock; items: any[]; isAr: boolean }) {
  const [currentIndex, setCurrentIndex] = React.useState(items.length)
  const [isResetting, setIsResetting] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const columns = block.columns || 1

  // Always use 8s as default if not explicitly set, or respect block settings if provided
  const interval = block.interval || 8000

  React.useEffect(() => {
    if (!block.autoplay || items.length <= columns || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, interval)
    return () => clearInterval(timer)
  }, [block.autoplay, interval, items.length, columns, isPaused])

  // Handle infinite loop silent reset
  const handleAnimationComplete = () => {
    if (items.length === 0) return

    if (currentIndex >= items.length * 2) {
      setIsResetting(true)
      setCurrentIndex(items.length)
      setTimeout(() => setIsResetting(false), 50)
    } else if (currentIndex < items.length) {
      setIsResetting(true)
      setCurrentIndex(items.length * 2 - 1)
      setTimeout(() => setIsResetting(false), 50)
    }
  }

  const nextSlide = () => setCurrentIndex(prev => prev + 1)
  const prevSlide = () => setCurrentIndex(prev => prev - 1)

  if (!items.length) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center text-slate-500">
        {isAr ? "لا توجد آراء لعرضها" : "No testimonials to display"}
      </div>
    )
  }

  // Tripled array for infinite effect
  const displayItems = [...items, ...items, ...items]
  const translationPerItem = (1 / Math.max(1, displayItems.length)) * 100
  const xTranslation = isAr ? (currentIndex * translationPerItem) : -(currentIndex * translationPerItem)

  return (
    <div
      className="relative px-4 sm:px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      {items.length > columns && (
        <>
          <button
            onClick={isAr ? nextSlide : prevSlide}
            className={`absolute ${isAr ? "-right-2 sm:right-0" : "-left-2 sm:left-0"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xl border border-emerald-100 transition-all hover:scale-110 active:scale-95 hover:bg-emerald-50`}
          >
            {isAr ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <button
            onClick={isAr ? prevSlide : nextSlide}
            className={`absolute ${isAr ? "-left-2 sm:left-0" : "-right-2 sm:right-0"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xl border border-emerald-100 transition-all hover:scale-110 active:scale-95 hover:bg-emerald-50`}
          >
            {isAr ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </>
      )}

      <div className="overflow-hidden py-4">
        <motion.div
          className="flex flex-nowrap -mx-4"
          animate={{ x: `${xTranslation}%` }}
          style={{ width: `${(displayItems.length / columns) * 100}%` }}
          onAnimationComplete={handleAnimationComplete}
          transition={isResetting ? { duration: 0 } : {
            type: "spring",
            stiffness: 260,
            damping: 30,
            mass: 1
          }}
        >
          {displayItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="px-4 flex-shrink-0"
              style={{ width: `${(1 / displayItems.length) * 100}%` }}
            >
              <div className="group relative rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 p-8 shadow-md border border-teal-100/50 dark:border-teal-800/30 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10 w-full">
                  {/* 1. Avatar */}
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={item.avatarUrl || "/placeholder.svg?height=80&width=80"}
                        alt={isAr ? item.author : (item.authorEn || item.author)}
                        className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-teal-400/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                    </div>
                  </div>

                  {/* 2. Name */}
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {isAr ? item.author : (item.authorEn || item.author)}
                  </h4>
                  {item.role && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{isAr ? item.role : (item.roleEn || item.role)}</p>}

                  {/* 3. Stars */}
                  <div className="flex justify-center gap-1 mb-6">
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

                  {/* 4. Review */}
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-lg line-clamp-4">
                    "{isAr ? item.quote : (item.quoteEn || item.quote)}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {items.length > columns && (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(items.length + index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${index === (currentIndex % items.length) ? "w-8 bg-emerald-600" : "bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
