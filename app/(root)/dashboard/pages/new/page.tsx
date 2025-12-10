"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageBlocksEditor } from "@/components/page-blocks-editor"
import { PageBlocks } from "@/components/page-blocks-editor-core"
import { saveDynamicPage } from "@/lib/storage"
import type { Block } from "@/components/page-blocks-editor"
import { Eye, X, ArrowLeft, Copy, ExternalLink } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [blocksAr, setBlocksAr] = useState<Block[]>([])
  const [blocksEn, setBlocksEn] = useState<Block[]>([])
  const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">("ar")
  const [saving, setSaving] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // SEO fields state
  const [pageData, setPageData] = useState({
    titleAr: "",
    titleEn: "",
    slug: "",
    seoDescriptionAr: "",
    seoDescriptionEn: "",
    keywordsAr: "",
    keywordsEn: "",
    isPublished: false,
  })

  const handleSave = async () => {
    if (!pageData.titleAr.trim() || !pageData.titleEn.trim() || !pageData.slug.trim()) {
      toast({
        title: "حقول مطلوبة",
        description: "الرجاء ملء جميع الحقول المطلوبة (العنوان بالعربية، العنوان بالإنجليزية، والرابط)",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const page = {
        titleAr: pageData.titleAr,
        titleEn: pageData.titleEn,
        slug: pageData.slug,
        descriptionAr: pageData.seoDescriptionAr,
        descriptionEn: pageData.seoDescriptionEn,
        contentAr: "",
        contentEn: "",
        seoDescriptionAr: pageData.seoDescriptionAr,
        seoDescriptionEn: pageData.seoDescriptionEn,
        keywordsAr: pageData.keywordsAr,
        keywordsEn: pageData.keywordsEn,
        blocksAr,
        blocksEn,
        isPublished: pageData.isPublished,
      }

      const savedPage = await saveDynamicPage(page)
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الصفحة بنجاح!",
      })
      router.push(`/dashboard/pages/edit/${savedPage.id}`)
    } catch (error) {
      console.error("Error saving page:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الصفحة",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCopyBlocks = (from: "ar" | "en") => {
    if (from === "ar") {
      setBlocksEn([...blocksAr])
      toast({
        title: "تم النسخ",
        description: "تم نسخ البلوكات من العربية إلى الإنجليزية",
      })
    } else {
      setBlocksAr([...blocksEn])
      toast({
        title: "تم النسخ",
        description: "تم نسخ البلوكات من الإنجليزية إلى العربية",
      })
    }
  }

  if (isPreviewMode) {
    const blocksToPreview = activeLanguage === "ar" ? blocksAr : blocksEn
    const previewValue = activeLanguage === "ar"
      ? { blocksAr: blocksToPreview, blocksEn: [], blocks: blocksToPreview }
      : { blocksAr: [], blocksEn: blocksToPreview, blocks: blocksToPreview }
    return (
      <div className="min-h-screen bg-white" dir={activeLanguage === "ar" ? "rtl" : "ltr"}>
        <div className="fixed top-4 right-4 z-50 flex gap-2 shadow-lg">
          <Button onClick={() => setIsPreviewMode(false)} variant="default">
            <X className="h-4 w-4 ml-2" />
            {activeLanguage === "ar" ? "إغلاق المعاينة" : "Close Preview"}
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="secondary">
            {saving ? (activeLanguage === "ar" ? "جاري الحفظ..." : "Saving...") : (activeLanguage === "ar" ? "حفظ الصفحة" : "Save Page")}
          </Button>
        </div>

        <div className="pt-20">
          {blocksToPreview.length > 0 ? (
            <PageBlocks mode="view" value={previewValue} editingLanguage={activeLanguage} />
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-2xl text-muted-foreground mb-4">
                  {activeLanguage === "ar" ? "لا توجد بلوكات بعد" : "No blocks yet"}
                </p>
                <p className="text-muted-foreground">
                  {activeLanguage === "ar" ? "أضف بلوكات لرؤية المعاينة" : "Add blocks to see the preview"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const isAr = activeLanguage === "ar"

  return (
    <div className="min-h-screen bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isAr ? "إنشاء صفحة جديدة" : "Create New Page"}
              </h1>
              <p className="text-sm text-slate-600">
                {isAr ? "استخدم محرر البلوكات لبناء صفحتك" : "Use the block editor to build your page"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard/pages")}>
                <ArrowLeft className={`h-4 w-4 ${isAr ? "ml-2" : "mr-2"}`} />
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button variant="outline" onClick={() => setIsPreviewMode(true)}>
                <Eye className={`h-4 w-4 ${isAr ? "ml-2" : "mr-2"}`} />
                {isAr ? "معاينة" : "Preview"}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ الصفحة" : "Save Page")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Preview Links */}
        {pageData.slug && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {isAr ? "معاينة الصفحة المنشورة" : "Preview Published Page"}
                </h3>
                <p className="text-sm text-slate-600">
                  {isAr ? "افتح الصفحة في تاب جديد لمعاينتها" : "Open page in new tab to preview"}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/ar/${pageData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <span>{isAr ? "عربي" : "Arabic"}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`/en/${pageData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <span>{isAr ? "إنجليزي" : "English"}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>
        )}

        {/* Page Settings */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{isAr ? "معلومات الصفحة" : "Page Information"}</h2>
          <div className="space-y-4">
            {/* Title Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{isAr ? "العنوان بالعربية *" : "Arabic Title *"}</Label>
                <Input
                  value={pageData.titleAr}
                  onChange={(e) => setPageData({ ...pageData, titleAr: e.target.value })}
                  placeholder={isAr ? "مثال: برامجنا التعليمية" : "Example: Our Educational Programs"}
                  required
                />
              </div>
              <div>
                <Label>{isAr ? "العنوان بالإنجليزية *" : "English Title *"}</Label>
                <Input
                  value={pageData.titleEn}
                  onChange={(e) => setPageData({ ...pageData, titleEn: e.target.value })}
                  placeholder="Example: Our Educational Programs"
                  required
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <Label>{isAr ? "الرابط (Slug) *" : "URL Slug *"}</Label>
              <Input
                value={pageData.slug}
                onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                placeholder="our-programs"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isAr
                  ? `سيكون رابط الصفحة: /ar/${pageData.slug || "your-slug"} و /en/${pageData.slug || "your-slug"}`
                  : `Page URL will be: /ar/${pageData.slug || "your-slug"} and /en/${pageData.slug || "your-slug"}`}
              </p>
            </div>

            {/* SEO Description */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{isAr ? "وصف SEO بالعربية" : "Arabic SEO Description"}</Label>
                <Textarea
                  value={pageData.seoDescriptionAr}
                  onChange={(e) => setPageData({ ...pageData, seoDescriptionAr: e.target.value })}
                  placeholder={isAr ? "وصف قصير للصفحة لمحركات البحث" : "Short page description for search engines"}
                  rows={3}
                />
              </div>
              <div>
                <Label>{isAr ? "وصف SEO بالإنجليزية" : "English SEO Description"}</Label>
                <Textarea
                  value={pageData.seoDescriptionEn}
                  onChange={(e) => setPageData({ ...pageData, seoDescriptionEn: e.target.value })}
                  placeholder="Short page description for search engines"
                  rows={3}
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{isAr ? "الكلمات المفتاحية بالعربية" : "Arabic Keywords"}</Label>
                <Input
                  value={pageData.keywordsAr}
                  onChange={(e) => setPageData({ ...pageData, keywordsAr: e.target.value })}
                  placeholder={isAr ? "مدرسة, تعليم, الرياض (مفصولة بفواصل)" : "school, education, riyadh (comma-separated)"}
                />
              </div>
              <div>
                <Label>{isAr ? "الكلمات المفتاحية بالإنجليزية" : "English Keywords"}</Label>
                <Input
                  value={pageData.keywordsEn}
                  onChange={(e) => setPageData({ ...pageData, keywordsEn: e.target.value })}
                  placeholder="school, education, riyadh (comma-separated)"
                />
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={pageData.isPublished}
                onCheckedChange={(checked) => setPageData({ ...pageData, isPublished: checked })}
              />
              <Label>{isAr ? "نشر الصفحة" : "Publish Page"}</Label>
            </div>
          </div>
        </Card>

        {/* Language Tabs for Blocks */}
        <Card className="p-6">
          <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as "ar" | "en")}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="ar">{isAr ? "المحتوى العربي" : "Arabic Content"}</TabsTrigger>
                <TabsTrigger value="en">{isAr ? "المحتوى الإنجليزي" : "English Content"}</TabsTrigger>
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyBlocks(activeLanguage === "ar" ? "en" : "ar")}
              >
                <Copy className={`h-4 w-4 ${isAr ? "ml-2" : "mr-2"}`} />
                {isAr
                  ? (activeLanguage === "ar" ? "نسخ من الإنجليزية" : "نسخ من العربية")
                  : (activeLanguage === "ar" ? "Copy from English" : "Copy from Arabic")}
              </Button>
            </div>

            <TabsContent value="ar">
              <PageBlocksEditor blocks={blocksAr} onChange={setBlocksAr} editingLanguage="ar" />
            </TabsContent>

            <TabsContent value="en">
              <PageBlocksEditor blocks={blocksEn} onChange={setBlocksEn} editingLanguage="en" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
