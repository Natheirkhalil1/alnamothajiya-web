"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getTestimonials, savePendingReview } from "@/lib/storage"
import { Star, MessageSquarePlus, Sparkles, Upload, LinkIcon, Quote, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function compressImage(file: File, maxSizeMB = 0.5): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // تقليل الحجم إذا كان كبيراً جداً
        const maxDimension = 800
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // ضغط الصورة
        let quality = 0.7
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality)

        // تقليل الجودة إذا كان الحجم لا يزال كبيراً
        while (compressedDataUrl.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
          quality -= 0.1
          compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        }

        resolve(compressedDataUrl)
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export function TestimonialsSection() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewFormData, setReviewFormData] = useState({
    name: "",
    image: "",
    comment: "",
  })
  const [showThankYou, setShowThankYou] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  useEffect(() => {
    const loadedTestimonials = getTestimonials()
    setTestimonials(loadedTestimonials)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى اختيار ملف صورة" : "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // التحقق من حجم الملف (5 MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description:
          language === "ar" ? "حجم الصورة كبير جداً (الحد الأقصى 5 MB)" : "Image size is too large (max 5 MB)",
        variant: "destructive",
      })
      return
    }

    setIsUploadingImage(true)

    try {
      // ضغط الصورة
      const compressedImage = await compressImage(file, 0.5)
      setImagePreview(compressedImage)
      setReviewFormData({ ...reviewFormData, image: compressedImage })

      toast({
        title: language === "ar" ? "تم رفع الصورة" : "Image Uploaded",
        description: language === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Error compressing image:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل رفع الصورة" : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (reviewRating === 0) {
      toast({
        title: language === "ar" ? "يرجى اختيار التقييم" : "Please select rating",
        variant: "destructive",
      })
      return
    }

    try {
      savePendingReview({
        name: reviewFormData.name,
        image: reviewFormData.image || "/placeholder.svg?height=100&width=100",
        rating: reviewRating,
        comment: reviewFormData.comment,
      })

      setShowThankYou(true)
      setTimeout(() => {
        setShowThankYou(false)
        setIsReviewDialogOpen(false)
        setReviewFormData({ name: "", image: "", comment: "" })
        setReviewRating(0)
        setImagePreview("")
      }, 3000)
    } catch (error) {
      console.error("Error saving review:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description:
          language === "ar" ? "فشل إرسال الرأي. يرجى المحاولة مرة أخرى" : "Failed to submit review. Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-full mb-4 animate-shimmer">
            <Quote className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {language === "ar" ? "آراء أولياء الأمور" : "Parent Reviews"}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {language === "ar" ? "ماذا يقول أولياء الأمور عنا" : "What Parents Say About Us"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {language === "ar"
              ? "نفخر بثقة أولياء الأمور ورضاهم عن خدماتنا التعليمية المتميزة"
              : "We're proud of the trust and satisfaction of parents with our distinguished educational services"}
          </p>
        </div>

        {/* Share Review Button */}
        <div className="flex justify-center mb-12">
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300 gap-2 group"
              >
                <MessageSquarePlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {language === "ar" ? "شارك رأيك" : "Share Your Opinion"}
                <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
              {!showThankYou ? (
                <>
                  <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      {language === "ar" ? "شاركنا رأيك" : "Share Your Opinion"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      {language === "ar"
                        ? "نسعد بسماع آرائكم وتجاربكم معنا"
                        : "We're happy to hear your opinions and experiences"}
                    </DialogDescription>
                  </DialogHeader>
                  {/* padding and improved spacing for scrollable content */}
                  <form onSubmit={handleReviewSubmit} className="space-y-6 mt-4 px-1">
                    <div className="space-y-2">
                      <Label htmlFor="review-name">{language === "ar" ? "الاسم" : "Name"}</Label>
                      <Input
                        id="review-name"
                        value={reviewFormData.name}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })}
                        required
                        placeholder={language === "ar" ? "أدخل اسمك" : "Enter your name"}
                        className="transition-all focus:scale-[1.02]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{language === "ar" ? "الصورة الشخصية (اختياري)" : "Profile Picture (Optional)"}</Label>
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload">
                            <Upload className="w-4 h-4 ml-2" />
                            {language === "ar" ? "رفع صورة" : "Upload"}
                          </TabsTrigger>
                          <TabsTrigger value="url">
                            <LinkIcon className="w-4 h-4 ml-2" />
                            {language === "ar" ? "رابط" : "URL"}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="space-y-4 mt-4">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-all hover:scale-[1.02]">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isUploadingImage}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              {isUploadingImage ? (
                                <div className="space-y-2">
                                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                  <p className="text-sm text-muted-foreground">
                                    {language === "ar" ? "جاري رفع الصورة..." : "Uploading image..."}
                                  </p>
                                </div>
                              ) : imagePreview ? (
                                <div className="space-y-2">
                                  <div className="relative inline-block">
                                    <img
                                      src={imagePreview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary/20"
                                    />
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {language === "ar" ? "انقر لتغيير الصورة" : "Click to change image"}
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                                  <p className="text-sm text-muted-foreground">
                                    {language === "ar" ? "انقر لرفع صورة" : "Click to upload image"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG, WEBP ({language === "ar" ? "حتى" : "up to"} 5MB)
                                  </p>
                                </div>
                              )}
                            </label>
                          </div>
                        </TabsContent>
                        <TabsContent value="url" className="mt-4">
                          <Input
                            value={reviewFormData.image}
                            onChange={(e) => {
                              setReviewFormData({ ...reviewFormData, image: e.target.value })
                              setImagePreview(e.target.value)
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="transition-all focus:scale-[1.02]"
                          />
                          {reviewFormData.image && (
                            <div className="mt-4 text-center">
                              <img
                                src={reviewFormData.image || "/placeholder.svg"}
                                alt="Preview"
                                className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary/20"
                                onError={() => setImagePreview("")}
                              />
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="space-y-3">
                      <Label>{language === "ar" ? "التقييم" : "Rating"}</Label>
                      <div className="flex gap-2 justify-center py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="transition-all hover:scale-125 active:scale-110"
                          >
                            <Star
                              className={`w-10 h-10 transition-all ${
                                star <= reviewRating
                                  ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review-comment">{language === "ar" ? "التعليق" : "Comment"}</Label>
                      <Textarea
                        id="review-comment"
                        value={reviewFormData.comment}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                        required
                        placeholder={language === "ar" ? "شاركنا تجربتك..." : "Share your experience..."}
                        rows={5}
                        className="transition-all focus:scale-[1.02] resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === "ar"
                          ? `${reviewFormData.comment.length} حرف`
                          : `${reviewFormData.comment.length} characters`}
                      </p>
                    </div>

                    {/* sticky footer for the button */}
                    <div className="sticky bottom-0 bg-background pt-4 pb-2">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-xl transition-all"
                        size="lg"
                        disabled={isUploadingImage}
                      >
                        {language === "ar" ? "إرسال الرأي" : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="py-12 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-10 h-10 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      {language === "ar" ? "شكراً لك!" : "Thank You!"}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {language === "ar"
                        ? "نقدر وقتك ورأيك الثمين. تعليقك يساعدنا على التحسين المستمر"
                        : "We appreciate your time and valuable opinion. Your feedback helps us improve continuously"}
                    </p>
                  </div>
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-pulse"
                        style={{ animationDelay: `${star * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-card/80 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <Quote className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">"{testimonial.comment}"</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <MessageSquarePlus className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-float" />
            <p className="text-lg text-muted-foreground">
              {language === "ar" ? "كن أول من يشارك رأيه!" : "Be the first to share your opinion!"}
            </p>
          </Card>
        )}
      </div>
    </section>
  )
}
