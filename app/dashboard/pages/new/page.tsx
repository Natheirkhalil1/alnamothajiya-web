"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Eye, X, ArrowLeft, Copy } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
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
      alert("الرجاء ملء جميع الحقول المطلوبة (العنوان بالعربية، العنوان بالإنجليزية، والرابط)")
      return
    }

    setSaving(true)
    try {
      const page = {
        id: `${pageData.slug}-${Date.now()}`,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveDynamicPage(page)
      alert("تم حفظ الصفحة بنجاح!")
      router.push("/dashboard/pages")
    } catch (error) {
      console.error("Error saving page:", error)
      alert("حدث خطأ أثناء حفظ الصفحة")
    } finally {
      setSaving(false)
    }
  }

  const handleCopyBlocks = (from: "ar" | "en") => {
    if (from === "ar") {
      setBlocksEn([...blocksAr])
      alert("تم نسخ البلوكات من العربية إلى الإنجليزية")
    } else {
      setBlocksAr([...blocksEn])
      alert("تم نسخ البلوكات من الإنجليزية إلى العربية")
    }
  }

  if (isPreviewMode) {
    const blocksToPreview = activeLanguage === "ar" ? blocksAr : blocksEn
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-4 right-4 z-50 flex gap-2 shadow-lg">
          <Button onClick={() => setIsPreviewMode(false)} variant="default">
            <X className="h-4 w-4 ml-2" />
            إغلاق المعاينة
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="secondary">
            {saving ? "جاري الحفظ..." : "حفظ الصفحة"}
          </Button>
        </div>

        <div className="pt-20">
          {blocksToPreview.length > 0 ? (
            <PageBlocks mode="view" value={{ blocks: blocksToPreview }} />
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-2xl text-muted-foreground mb-4">لا توجد بلوكات بعد</p>
                <p className="text-muted-foreground">أضف بلوكات لرؤية المعاينة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">إنشاء صفحة جديدة</h1>
              <p className="text-sm text-slate-600">استخدم محرر البلوكات لبناء صفحتك</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard/pages")}>
                <ArrowLeft className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
              <Button variant="outline" onClick={() => setIsPreviewMode(true)}>
                <Eye className="h-4 w-4 ml-2" />
                معاينة
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ الصفحة"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Settings */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">معلومات الصفحة</h2>
          <div className="space-y-4">
            {/* Title Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>العنوان بالعربية *</Label>
                <Input
                  value={pageData.titleAr}
                  onChange={(e) => setPageData({ ...pageData, titleAr: e.target.value })}
                  placeholder="مثال: برامجنا التعليمية"
                  required
                />
              </div>
              <div>
                <Label>العنوان بالإنجليزية *</Label>
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
              <Label>الرابط (Slug) *</Label>
              <Input
                value={pageData.slug}
                onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                placeholder="our-programs"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                سيكون رابط الصفحة: /ar/{pageData.slug || "your-slug"} و /en/{pageData.slug || "your-slug"}
              </p>
            </div>

            {/* SEO Description */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>وصف SEO بالعربية</Label>
                <Textarea
                  value={pageData.seoDescriptionAr}
                  onChange={(e) => setPageData({ ...pageData, seoDescriptionAr: e.target.value })}
                  placeholder="وصف قصير للصفحة لمحركات البحث"
                  rows={3}
                />
              </div>
              <div>
                <Label>وصف SEO بالإنجليزية</Label>
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
                <Label>الكلمات المفتاحية بالعربية</Label>
                <Input
                  value={pageData.keywordsAr}
                  onChange={(e) => setPageData({ ...pageData, keywordsAr: e.target.value })}
                  placeholder="مدرسة, تعليم, الرياض (مفصولة بفواصل)"
                />
              </div>
              <div>
                <Label>الكلمات المفتاحية بالإنجليزية</Label>
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
              <Label>نشر الصفحة</Label>
            </div>
          </div>
        </Card>

        {/* Language Tabs for Blocks */}
        <Card className="p-6">
          <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as "ar" | "en")}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="ar">المحتوى العربي</TabsTrigger>
                <TabsTrigger value="en">English Content</TabsTrigger>
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyBlocks(activeLanguage === "ar" ? "en" : "ar")}
              >
                <Copy className="h-4 w-4 ml-2" />
                {activeLanguage === "ar" ? "نسخ من الإنجليزية" : "Copy from Arabic"}
              </Button>
            </div>

            <TabsContent value="ar">
              <PageBlocksEditor blocks={blocksAr} onChange={setBlocksAr} />
            </TabsContent>

            <TabsContent value="en">
              <PageBlocksEditor blocks={blocksEn} onChange={setBlocksEn} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
