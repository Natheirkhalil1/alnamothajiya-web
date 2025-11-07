"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { saveDynamicPage, type PageBlock } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  Plus,
  Type,
  ImageIcon,
  Video,
  Quote,
  Minus,
  LinkIcon,
  Code,
  GripVertical,
  Trash2,
  Eye,
  Copy,
  Settings,
  Columns,
  Presentation,
  Info,
  Building2,
  ImagePlus,
  MessageSquare,
  Phone,
  BarChart3,
  Star,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"

export default function NewPageEditor() {
  const router = useRouter()
  const { language } = useLanguage()
  const { toast } = useToast()

  const [contentLanguage, setContentLanguage] = useState<"ar" | "en">("ar")
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  const [pageData, setPageData] = useState({
    titleAr: "",
    titleEn: "",
    slug: "",
    descriptionAr: "",
    descriptionEn: "",
    seoDescriptionAr: "",
    seoDescriptionEn: "",
    featuredImage: "",
    isPublished: false,
  })

  const [blocks, setBlocks] = useState<PageBlock[]>([])

  const blockTypes = [
    // Basic blocks
    { type: "heading", icon: Type, label: language === "ar" ? "عنوان" : "Heading", category: "basic" },
    { type: "paragraph", icon: Type, label: language === "ar" ? "فقرة" : "Paragraph", category: "basic" },
    { type: "image", icon: ImageIcon, label: language === "ar" ? "صورة" : "Image", category: "basic" },
    { type: "gallery", icon: ImagePlus, label: language === "ar" ? "معرض صور" : "Gallery", category: "basic" },
    { type: "video", icon: Video, label: language === "ar" ? "فيديو" : "Video", category: "basic" },
    { type: "quote", icon: Quote, label: language === "ar" ? "اقتباس" : "Quote", category: "basic" },
    { type: "button", icon: LinkIcon, label: language === "ar" ? "زر" : "Button", category: "basic" },
    { type: "divider", icon: Minus, label: language === "ar" ? "فاصل" : "Divider", category: "basic" },
    { type: "html", icon: Code, label: language === "ar" ? "HTML" : "HTML", category: "basic" },
    { type: "spacer", icon: Minus, label: language === "ar" ? "مسافة" : "Spacer", category: "basic" },
    // Layout blocks
    { type: "row", icon: Columns, label: language === "ar" ? "صف (أعمدة)" : "Row (Columns)", category: "layout" },
    // Component blocks
    {
      type: "card",
      icon: Building2,
      label: language === "ar" ? "بطاقة" : "Card",
      category: "components",
    },
    {
      type: "icon-box",
      icon: Star,
      label: language === "ar" ? "صندوق أيقونة" : "Icon Box",
      category: "components",
    },
    {
      type: "hero-slider",
      icon: Presentation,
      label: language === "ar" ? "سلايدر رئيسي" : "Hero Slider",
      category: "components",
    },
    {
      type: "statistics",
      icon: BarChart3,
      label: language === "ar" ? "إحصائيات" : "Statistics",
      category: "components",
    },
    {
      type: "features",
      icon: Star,
      label: language === "ar" ? "مميزات" : "Features",
      category: "components",
    },
    {
      type: "accordion",
      icon: Info,
      label: language === "ar" ? "أكورديون" : "Accordion",
      category: "components",
    },
    {
      type: "tabs",
      icon: Columns,
      label: language === "ar" ? "تبويبات" : "Tabs",
      category: "components",
    },
    {
      type: "alert",
      icon: Info,
      label: language === "ar" ? "تنبيه" : "Alert",
      category: "components",
    },
    {
      type: "testimonial-card",
      icon: MessageSquare,
      label: language === "ar" ? "بطاقة رأي" : "Testimonial Card",
      category: "components",
    },
    {
      type: "team-member",
      icon: Building2,
      label: language === "ar" ? "عضو فريق" : "Team Member",
      category: "components",
    },
    {
      type: "pricing-card",
      icon: BarChart3,
      label: language === "ar" ? "بطاقة سعر" : "Pricing Card",
      category: "components",
    },
    {
      type: "cta",
      icon: Phone,
      label: language === "ar" ? "دعوة لإجراء" : "Call-to-Action",
      category: "components",
    },
    {
      type: "form",
      icon: Phone,
      label: language === "ar" ? "نموذج" : "Form",
      category: "components",
    },
    {
      type: "map",
      icon: Building2,
      label: language === "ar" ? "خريطة" : "Map",
      category: "components",
    },
    {
      type: "social-links",
      icon: LinkIcon,
      label: language === "ar" ? "روابط اجتماعية" : "Social Links",
      category: "components",
    },
  ]

  const copyContent = (from: "ar" | "en", to: "ar" | "en") => {
    const updatedBlocks = blocks.map((block) => {
      const newContent = { ...block.content }

      // Copy text content
      if (from === "ar" && to === "en") {
        if (block.content.textAr) newContent.textEn = block.content.textAr
        if (block.content.quoteAr) newContent.quoteEn = block.content.quoteAr
        if (block.content.authorAr) newContent.authorEn = block.content.authorAr
        if (block.content.buttonTextAr) newContent.buttonTextEn = block.content.buttonTextAr
        if (block.content.titleAr) newContent.titleEn = block.content.titleAr
        if (block.content.subtitleAr) newContent.subtitleEn = block.content.subtitleAr
        if (block.content.descriptionAr) newContent.descriptionEn = block.content.descriptionAr
        if (block.content.labelAr) newContent.labelEn = block.content.labelAr
        if (block.content.captionAr) newContent.captionEn = block.content.captionAr
      } else if (from === "en" && to === "ar") {
        if (block.content.textEn) newContent.textAr = block.content.textEn
        if (block.content.quoteEn) newContent.quoteAr = block.content.quoteEn
        if (block.content.authorEn) newContent.authorAr = block.content.authorEn
        if (block.content.buttonTextEn) newContent.buttonTextAr = block.content.buttonTextEn
        if (block.content.titleEn) newContent.titleAr = block.content.titleEn
        if (block.content.subtitleEn) newContent.subtitleAr = block.content.subtitleEn
        if (block.content.descriptionEn) newContent.descriptionAr = block.content.descriptionEn
        if (block.content.labelEn) newContent.labelAr = block.content.labelEn
        if (block.content.captionEn) newContent.captionAr = block.content.captionEn
      }

      return { ...block, content: newContent }
    })

    setBlocks(updatedBlocks)
    toast({
      title: language === "ar" ? "تم النسخ" : "Copied",
      description:
        language === "ar"
          ? `تم نسخ المحتوى من ${from === "ar" ? "العربية" : "الإنجليزية"} إلى ${to === "ar" ? "العربية" : "الإنجليزية"}`
          : `Content copied from ${from === "ar" ? "Arabic" : "English"} to ${to === "ar" ? "Arabic" : "English"}`,
    })
  }

  const addBlock = (type: PageBlock["type"]) => {
    const newBlock: PageBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      order: blocks.length,
      content: {},
    }
    setBlocks([...blocks, newBlock])
    setShowBlockMenu(false)
    // Open settings modal for the new block
    setEditingBlock(newBlock)
  }

  const updateBlock = (id: string, content: Partial<PageBlock["content"]>) => {
    setBlocks(
      blocks.map((block) => (block.id === id ? { ...block, content: { ...block.content, ...content } } : block)),
    )
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
      return
    }

    const newBlocks = [...blocks]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]

    newBlocks.forEach((block, i) => {
      block.order = i
    })

    setBlocks(newBlocks)
  }

  const handleSave = () => {
    if (!pageData.titleAr || !pageData.titleEn || !pageData.slug) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    saveDynamicPage({
      ...pageData,
      contentAr: "",
      contentEn: "",
      blocks,
    })

    toast({
      title: language === "ar" ? "تم الحفظ" : "Saved",
      description: language === "ar" ? "تم حفظ الصفحة بنجاح" : "Page saved successfully",
    })

    router.push("/dashboard?section=pages")
  }

  const basicBlocks = blockTypes.filter((b) => b.category === "basic")
  const layoutBlocks = blockTypes.filter((b) => b.category === "layout")
  const componentBlocks = blockTypes.filter((b) => b.category === "components")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard?section=pages")}>
                <ArrowLeft className="w-4 h-4 ml-2" />
                {language === "ar" ? "رجوع" : "Back"}
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{language === "ar" ? "صفحة جديدة" : "New Page"}</h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar"
                    ? "أنشئ صفحة جديدة باستخدام منشئ المحتوى"
                    : "Create a new page using the content builder"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 ml-2" />
                {language === "ar" ? "معاينة" : "Preview"}
              </Button>
              <Button onClick={handleSave} size="sm" className="bg-violet-600 hover:bg-violet-700">
                <Save className="w-4 h-4 ml-2" />
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 max-w-[1800px] mx-auto">
          {/* Sidebar - Page Settings */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">{language === "ar" ? "إعدادات الصفحة" : "Page Settings"}</h2>

              <div className="space-y-4">
                <Tabs defaultValue="ar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ar" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium">
                        {language === "ar" ? "العنوان" : "Title"}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={pageData.titleAr}
                        onChange={(e) => setPageData({ ...pageData, titleAr: e.target.value })}
                        placeholder={language === "ar" ? "أدخل العنوان" : "Enter title"}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">{language === "ar" ? "وصف SEO" : "SEO Description"}</Label>
                      <Textarea
                        value={pageData.seoDescriptionAr}
                        onChange={(e) => setPageData({ ...pageData, seoDescriptionAr: e.target.value })}
                        rows={3}
                        placeholder={language === "ar" ? "وصف للمحركات البحث" : "Description for search engines"}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Title
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={pageData.titleEn}
                        onChange={(e) => setPageData({ ...pageData, titleEn: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">SEO Description</Label>
                      <Textarea
                        value={pageData.seoDescriptionEn}
                        onChange={(e) => setPageData({ ...pageData, seoDescriptionEn: e.target.value })}
                        rows={3}
                        placeholder="Description for search engines"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <Label className="text-sm font-medium">
                    {language === "ar" ? "رابط الصفحة" : "Page Slug"}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={pageData.slug}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    placeholder="page-url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">/pages/{pageData.slug || "..."}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {language === "ar" ? "صورة مميزة (SEO)" : "Featured Image (SEO)"}
                  </Label>
                  <ImageUpload
                    value={pageData.featuredImage}
                    onChange={(url) => setPageData({ ...pageData, featuredImage: url })}
                    language={language === "ar" ? "ar" : "en"}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Label className="text-sm font-medium">{language === "ar" ? "نشر الصفحة" : "Publish Page"}</Label>
                  <Switch
                    checked={pageData.isPublished}
                    onCheckedChange={(checked) => setPageData({ ...pageData, isPublished: checked })}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Block Builder with Language Tabs */}
          <div className="space-y-6">
            <Card className="p-8">
              <Tabs value={contentLanguage} onValueChange={(v) => setContentLanguage(v as "ar" | "en")}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold">{language === "ar" ? "محتوى الصفحة" : "Page Content"}</h2>
                    <TabsList>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex items-center gap-2">
                    {contentLanguage === "ar" ? (
                      <Button
                        onClick={() => copyContent("en", "ar")}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        disabled={blocks.length === 0}
                      >
                        <Copy className="w-3 h-3 ml-1" />
                        {language === "ar" ? "نسخ من الإنجليزية" : "Copy from English"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => copyContent("ar", "en")}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        disabled={blocks.length === 0}
                      >
                        <Copy className="w-3 h-3 ml-1" />
                        {language === "ar" ? "نسخ من العربية" : "Copy from Arabic"}
                      </Button>
                    )}
                    <Button onClick={() => setShowBlockMenu(!showBlockMenu)} size="sm" variant="outline">
                      <Plus className="w-4 h-4 ml-2" />
                      {language === "ar" ? "إضافة عنصر" : "Add Block"}
                    </Button>
                  </div>
                </div>

                {/* Block Type Menu */}
                {showBlockMenu && (
                  <div className="mb-6 p-6 bg-muted rounded-lg space-y-6">
                    {/* Basic Blocks */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">
                        {language === "ar" ? "عناصر أساسية" : "Basic Blocks"}
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        {basicBlocks.map((blockType) => (
                          <Button
                            key={blockType.type}
                            onClick={() => addBlock(blockType.type as PageBlock["type"])}
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-4 bg-background"
                          >
                            <blockType.icon className="w-5 h-5" />
                            <span className="text-xs">{blockType.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Layout Blocks */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">
                        {language === "ar" ? "عناصر التخطيط" : "Layout Blocks"}
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        {layoutBlocks.map((blockType) => (
                          <Button
                            key={blockType.type}
                            onClick={() => addBlock(blockType.type as PageBlock["type"])}
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-4 bg-background"
                          >
                            <blockType.icon className="w-5 h-5" />
                            <span className="text-xs">{blockType.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Component Blocks */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">{language === "ar" ? "مكونات" : "Components"}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {componentBlocks.map((blockType) => (
                          <Button
                            key={blockType.type}
                            onClick={() => addBlock(blockType.type as PageBlock["type"])}
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-4 bg-background"
                          >
                            <blockType.icon className="w-5 h-5" />
                            <span className="text-xs">{blockType.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <TabsContent value="ar" className="mt-0">
                  {blocks.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                      <Type className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {language === "ar" ? "ابدأ بإضافة محتوى" : "Start adding content"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {language === "ar"
                          ? "اضغط على 'إضافة عنصر' لبناء صفحتك"
                          : "Click 'Add Block' to build your page"}
                      </p>
                      <Button onClick={() => setShowBlockMenu(true)} variant="outline">
                        <Plus className="w-4 h-4 ml-2" />
                        {language === "ar" ? "إضافة عنصر" : "Add Block"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blocks.map((block, index) => (
                        <BlockPreview
                          key={block.id}
                          block={block}
                          language={language}
                          contentLanguage="ar"
                          onEdit={() => setEditingBlock(block)}
                          onDelete={() => deleteBlock(block.id)}
                          onMoveUp={() => moveBlock(block.id, "up")}
                          onMoveDown={() => moveBlock(block.id, "down")}
                          isFirst={index === 0}
                          isLast={index === blocks.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="en" className="mt-0">
                  {blocks.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                      <Type className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start adding content</h3>
                      <p className="text-muted-foreground mb-4">Click 'Add Block' to build your page</p>
                      <Button onClick={() => setShowBlockMenu(true)} variant="outline">
                        <Plus className="w-4 h-4 ml-2" />
                        Add Block
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blocks.map((block, index) => (
                        <BlockPreview
                          key={block.id}
                          block={block}
                          language={language}
                          contentLanguage="en"
                          onEdit={() => setEditingBlock(block)}
                          onDelete={() => deleteBlock(block.id)}
                          onMoveUp={() => moveBlock(block.id, "up")}
                          onMoveDown={() => moveBlock(block.id, "down")}
                          isFirst={index === 0}
                          isLast={index === blocks.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Block Settings Modal */}
      {editingBlock && (
        <Dialog open={!!editingBlock} onOpenChange={() => setEditingBlock(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {language === "ar" ? "تعديل العنصر" : "Edit Block"} - {editingBlock.type}
              </DialogTitle>
            </DialogHeader>
            <BlockSettingsEditor
              block={editingBlock}
              language={language}
              onUpdate={(content) => {
                updateBlock(editingBlock.id, content)
                setEditingBlock({ ...editingBlock, content: { ...editingBlock.content, ...content } })
              }}
              onClose={() => setEditingBlock(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function BlockPreview({
  block,
  language,
  contentLanguage,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: PageBlock
  language: string
  contentLanguage: "ar" | "en"
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const getBlockPreview = () => {
    const text = contentLanguage === "ar" ? block.content.textAr : block.content.textEn
    const quote = contentLanguage === "ar" ? block.content.quoteAr : block.content.quoteEn
    const buttonText = contentLanguage === "ar" ? block.content.buttonTextAr : block.content.buttonTextEn
    const title = contentLanguage === "ar" ? block.content.titleAr : block.content.titleEn
    const subtitle = contentLanguage === "ar" ? block.content.subtitleAr : block.content.subtitleEn
    const description = contentLanguage === "ar" ? block.content.descriptionAr : block.content.descriptionEn
    const label = contentLanguage === "ar" ? block.content.labelAr : block.content.labelEn
    const caption = contentLanguage === "ar" ? block.content.captionAr : block.content.captionEn

    switch (block.type) {
      case "heading":
        return <div className="font-bold text-lg">{text || (language === "ar" ? "عنوان" : "Heading")}</div>
      case "paragraph":
        return <div className="text-muted-foreground">{text || (language === "ar" ? "فقرة" : "Paragraph")}</div>
      case "image":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            {block.content.imageUrl || (language === "ar" ? "صورة" : "Image")}
          </div>
        )
      case "gallery":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="w-4 h-4" />
            {language === "ar" ? "معرض صور" : "Gallery"} ({block.content.images?.length || 0}{" "}
            {language === "ar" ? "صور" : "images"})
          </div>
        )
      case "video":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="w-4 h-4" />
            {title || (language === "ar" ? "فيديو" : "Video")}
          </div>
        )
      case "quote":
        return (
          <div className="flex flex-col gap-1">
            <blockquote className="text-sm italic text-muted-foreground">
              "{quote || (language === "ar" ? "اقتباس" : "Quote")}"
            </blockquote>
            <span className="text-xs font-medium text-muted-foreground">
              -{" "}
              {contentLanguage === "ar"
                ? block.content.authorAr
                : block.content.authorEn || (language === "ar" ? "مجهول" : "Unknown")}
            </span>
          </div>
        )
      case "button":
        return (
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-4 h-4 text-primary" />
            {buttonText || (language === "ar" ? "زر" : "Button")}
          </div>
        )
      case "divider":
        return <hr className={`my-2 border-t ${block.content.dividerStyle || "solid"}`} />
      case "html":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code className="w-4 h-4" />
            HTML Content
          </div>
        )
      case "spacer":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Minus className="w-4 h-4" />
            {language === "ar" ? "مساحة فارغة" : "Spacer"} ({block.content.height || 20}px)
          </div>
        )
      case "row":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Columns className="w-4 h-4" />
            {language === "ar" ? "صف (أعمدة)" : "Row (Columns)"} ({block.content.columns || 2} columns)
          </div>
        )
      case "card":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            {title || (language === "ar" ? "بطاقة" : "Card")}
          </div>
        )
      case "icon-box":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4" />
            {title || (language === "ar" ? "صندوق أيقونة" : "Icon Box")}
          </div>
        )
      case "hero-slider":
        return (
          <div className="text-sm text-muted-foreground">
            {title || (language === "ar" ? "سلايدر رئيسي" : "Hero Slider")} ({block.content.slides?.length || 0}{" "}
            {language === "ar" ? "شرائح" : "slides"})
          </div>
        )
      case "statistics":
        return (
          <div className="text-sm text-muted-foreground">
            {title || (language === "ar" ? "قسم الإحصائيات" : "Statistics Section")} ({block.content.stats?.length || 0}{" "}
            stats)
          </div>
        )
      case "features":
        return (
          <div className="text-sm text-muted-foreground">
            {title || (language === "ar" ? "قسم المميزات" : "Features Section")} ({block.content.features?.length || 0}{" "}
            features)
          </div>
        )
      case "accordion":
        return (
          <div className="text-sm text-muted-foreground">
            <Info className="w-4 h-4 inline-block mr-1" />
            {title || (language === "ar" ? "أكورديون" : "Accordion")} ({block.content.items?.length || 0} items)
          </div>
        )
      case "tabs":
        return (
          <div className="text-sm text-muted-foreground">
            <Columns className="w-4 h-4 inline-block mr-1" />
            {title || (language === "ar" ? "تبويبات" : "Tabs")} ({block.content.tabs?.length || 0} tabs)
          </div>
        )
      case "alert":
        return (
          <div className="text-sm text-muted-foreground">
            <Info className="w-4 h-4 inline-block mr-1" />
            {block.content.alertType || "info"} ({title || (language === "ar" ? "تنبيه" : "Alert")})
          </div>
        )
      case "testimonial-card":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            {block.content.name || (language === "ar" ? "بطاقة رأي" : "Testimonial Card")}
          </div>
        )
      case "team-member":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            {block.content.name || (language === "ar" ? "عضو فريق" : "Team Member")}
          </div>
        )
      case "pricing-card":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            {title || (language === "ar" ? "بطاقة سعر" : "Pricing Card")}
          </div>
        )
      case "cta":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            {block.content.textAr || block.content.textEn || (language === "ar" ? "دعوة لإجراء" : "Call-to-Action")}
          </div>
        )
      case "form":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            {title || (language === "ar" ? "نموذج" : "Form")}
          </div>
        )
      case "map":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            {language === "ar" ? "خريطة" : "Map"}
          </div>
        )
      case "social-links":
        return (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <LinkIcon className="w-4 h-4" />
            {language === "ar" ? "روابط اجتماعية" : "Social Links"}
          </div>
        )
      default:
        return <div className="text-sm text-muted-foreground capitalize">{block.type}</div>
    }
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow group">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
          <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={isFirst} className="h-6 w-6 p-0">
            <GripVertical className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={isLast} className="h-6 w-6 p-0">
            <GripVertical className="w-4 h-4 -rotate-180" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">{block.type}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {getBlockPreview()}
        </div>
      </div>
    </Card>
  )
}

function BlockSettingsEditor({
  block,
  language,
  onUpdate,
  onClose,
}: {
  block: PageBlock
  language: string
  onUpdate: (content: Partial<PageBlock["content"]>) => void
  onClose: () => void
}) {
  const router = useRouter()

  const renderEditor = () => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "المستوى" : "Level"}</Label>
              <Select
                value={block.content.level?.toString() || "2"}
                onValueChange={(value) => onUpdate({ level: Number.parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {language === "ar" ? `عنوان ${level}` : `Heading ${level}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === "ar" ? "النص بالعربية" : "Text in Arabic"}</Label>
              <Input
                value={block.content.textAr || ""}
                onChange={(e) => onUpdate({ textAr: e.target.value })}
                placeholder={language === "ar" ? "أدخل النص" : "Enter text"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "النص بالإنجليزية" : "Text in English"}</Label>
              <Input
                value={block.content.textEn || ""}
                onChange={(e) => onUpdate({ textEn: e.target.value })}
                placeholder="Enter text"
              />
            </div>
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "النص بالعربية" : "Text in Arabic"}</Label>
              <Textarea
                value={block.content.textAr || ""}
                onChange={(e) => onUpdate({ textAr: e.target.value })}
                rows={6}
                placeholder={language === "ar" ? "أدخل النص" : "Enter text"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "النص بالإنجليزية" : "Text in English"}</Label>
              <Textarea
                value={block.content.textEn || ""}
                onChange={(e) => onUpdate({ textEn: e.target.value })}
                rows={6}
                placeholder="Enter text"
              />
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <ImageUpload
              value={block.content.imageUrl || ""}
              onChange={(url) => onUpdate({ imageUrl: url })}
              label={language === "ar" ? "الصورة" : "Image"}
              language={language === "ar" ? "ar" : "en"}
            />
            <div>
              <Label>{language === "ar" ? "نص بديل (عربي)" : "Alt Text (Arabic)"}</Label>
              <Input
                value={block.content.altAr || ""}
                onChange={(e) => onUpdate({ altAr: e.target.value })}
                placeholder={language === "ar" ? "وصف الصورة" : "Image description"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "نص بديل (إنجليزي)" : "Alt Text (English)"}</Label>
              <Input
                value={block.content.altEn || ""}
                onChange={(e) => onUpdate({ altEn: e.target.value })}
                placeholder="Image description"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "تعليق (عربي)" : "Caption (Arabic)"}</Label>
              <Input
                value={block.content.captionAr || ""}
                onChange={(e) => onUpdate({ captionAr: e.target.value })}
                placeholder={language === "ar" ? "تعليق اختياري" : "Optional caption"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "تعليق (إنجليزي)" : "Caption (English)"}</Label>
              <Input
                value={block.content.captionEn || ""}
                onChange={(e) => onUpdate({ captionEn: e.target.value })}
                placeholder="Optional caption"
              />
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "الصور" : "Images"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const images = block.content.images || []
                  onUpdate({
                    images: [
                      ...images,
                      {
                        url: "",
                        alt: "",
                        caption: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة صورة" : "Add Image"}
              </Button>
            </div>
            {(block.content.images || []).map((image, index) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "صورة" : "Image"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const images = block.content.images || []
                      onUpdate({ images: images.filter((_, i) => i !== index) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <ImageUpload
                  value={image.url}
                  onChange={(url) => {
                    const images = block.content.images || []
                    onUpdate({
                      images: images.map((img, i) => (i === index ? { ...img, url } : img)),
                    })
                  }}
                  label={language === "ar" ? "رابط الصورة" : "Image URL"}
                  language={language === "ar" ? "ar" : "en"}
                />
                <Input
                  value={image.alt}
                  onChange={(e) => {
                    const images = block.content.images || []
                    onUpdate({
                      images: images.map((img, i) => (i === index ? { ...img, alt: e.target.value } : img)),
                    })
                  }}
                  placeholder={language === "ar" ? "نص بديل" : "Alt text"}
                />
                <Input
                  value={image.caption || ""}
                  onChange={(e) => {
                    const images = block.content.images || []
                    onUpdate({
                      images: images.map((img, i) => (i === index ? { ...img, caption: e.target.value } : img)),
                    })
                  }}
                  placeholder={language === "ar" ? "تعليق (اختياري)" : "Caption (optional)"}
                />
              </Card>
            ))}
          </div>
        )

      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "رابط الفيديو" : "Video URL"}</Label>
              <Input
                value={block.content.videoUrl || ""}
                onChange={(e) => onUpdate({ videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "عنوان الفيديو" : "Video title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Video title"
              />
            </div>
          </div>
        )

      case "quote":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "الاقتباس (عربي)" : "Quote (Arabic)"}</Label>
              <Textarea
                value={block.content.quoteAr || ""}
                onChange={(e) => onUpdate({ quoteAr: e.target.value })}
                rows={4}
                placeholder={language === "ar" ? "نص الاقتباس" : "Quote text"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الاقتباس (إنجليزي)" : "Quote (English)"}</Label>
              <Textarea
                value={block.content.quoteEn || ""}
                onChange={(e) => onUpdate({ quoteEn: e.target.value })}
                rows={4}
                placeholder="Quote text"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "المؤلف (عربي)" : "Author (Arabic)"}</Label>
              <Input
                value={block.content.authorAr || ""}
                onChange={(e) => onUpdate({ authorAr: e.target.value })}
                placeholder={language === "ar" ? "اسم المؤلف" : "Author name"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "المؤلف (إنجليزي)" : "Author (English)"}</Label>
              <Input
                value={block.content.authorEn || ""}
                onChange={(e) => onUpdate({ authorEn: e.target.value })}
                placeholder="Author name"
              />
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "نص الزر (عربي)" : "Button Text (Arabic)"}</Label>
              <Input
                value={block.content.buttonTextAr || ""}
                onChange={(e) => onUpdate({ buttonTextAr: e.target.value })}
                placeholder={language === "ar" ? "اضغط هنا" : "Click here"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "نص الزر (إنجليزي)" : "Button Text (English)"}</Label>
              <Input
                value={block.content.buttonTextEn || ""}
                onChange={(e) => onUpdate({ buttonTextEn: e.target.value })}
                placeholder="Click here"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الرابط" : "URL"}</Label>
              <Input
                value={block.content.buttonUrl || ""}
                onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>{language === "ar" ? "النمط" : "Style"}</Label>
              <Select
                value={block.content.buttonStyle || "default"}
                onValueChange={(value) => onUpdate({ buttonStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{language === "ar" ? "افتراضي" : "Default"}</SelectItem>
                  <SelectItem value="outline">{language === "ar" ? "محدد" : "Outline"}</SelectItem>
                  <SelectItem value="ghost">{language === "ar" ? "شفاف" : "Ghost"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "divider":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "النمط" : "Style"}</Label>
              <Select
                value={block.content.dividerStyle || "solid"}
                onValueChange={(value) => onUpdate({ dividerStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">{language === "ar" ? "خط متصل" : "Solid"}</SelectItem>
                  <SelectItem value="dashed">{language === "ar" ? "خط متقطع" : "Dashed"}</SelectItem>
                  <SelectItem value="dotted">{language === "ar" ? "نقاط" : "Dotted"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "html":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "كود HTML" : "HTML Code"}</Label>
              <Textarea
                value={block.content.htmlCode || ""}
                onChange={(e) => onUpdate({ htmlCode: e.target.value })}
                rows={10}
                placeholder="<div>...</div>"
                className="font-mono text-sm"
              />
            </div>
          </div>
        )

      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "الارتفاع (بكسل)" : "Height (px)"}</Label>
              <Input
                type="number"
                value={block.content.height || 20}
                onChange={(e) => onUpdate({ height: Number.parseInt(e.target.value) })}
                placeholder="20"
              />
            </div>
          </div>
        )

      case "row":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "عدد الأعمدة" : "Number of Columns"}</Label>
              <Select
                value={block.content.columns?.toString() || "2"}
                onValueChange={(value) => onUpdate({ columns: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "يمكنك إضافة عناصر داخل كل عمود بعد الحفظ"
                : "You can add blocks inside each column after saving"}
            </p>
          </div>
        )

      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "عنوان البطاقة" : "Card title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Card title"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}</Label>
              <Textarea
                value={block.content.descriptionAr || ""}
                onChange={(e) => onUpdate({ descriptionAr: e.target.value })}
                rows={4}
                placeholder={language === "ar" ? "وصف البطاقة" : "Card description"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}</Label>
              <Textarea
                value={block.content.descriptionEn || ""}
                onChange={(e) => onUpdate({ descriptionEn: e.target.value })}
                rows={4}
                placeholder="Card description"
              />
            </div>
            <ImageUpload
              value={block.content.imageUrl || ""}
              onChange={(url) => onUpdate({ imageUrl: url })}
              label={language === "ar" ? "صورة البطاقة" : "Card Image"}
              language={language === "ar" ? "ar" : "en"}
            />
            <div>
              <Label>{language === "ar" ? "نص الزر (عربي)" : "Button Text (Arabic)"}</Label>
              <Input
                value={block.content.buttonTextAr || ""}
                onChange={(e) => onUpdate({ buttonTextAr: e.target.value })}
                placeholder={language === "ar" ? "نص الزر" : "Button text"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "نص الزر (إنجليزي)" : "Button Text (English)"}</Label>
              <Input
                value={block.content.buttonTextEn || ""}
                onChange={(e) => onUpdate({ buttonTextEn: e.target.value })}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "رابط الزر" : "Button URL"}</Label>
              <Input
                value={block.content.buttonUrl || ""}
                onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        )

      case "icon-box":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "عنوان الصندوق" : "Box title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Box title"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}</Label>
              <Textarea
                value={block.content.descriptionAr || ""}
                onChange={(e) => onUpdate({ descriptionAr: e.target.value })}
                rows={4}
                placeholder={language === "ar" ? "وصف الصندوق" : "Box description"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}</Label>
              <Textarea
                value={block.content.descriptionEn || ""}
                onChange={(e) => onUpdate({ descriptionEn: e.target.value })}
                rows={4}
                placeholder="Box description"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الأيقونة" : "Icon"}</Label>
              <Input
                value={block.content.icon || ""}
                onChange={(e) => onUpdate({ icon: e.target.value })}
                placeholder="lucide-icon-name (e.g., star)"
              />
            </div>
          </div>
        )

      case "hero-slider":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "الشرائح" : "Slides"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const slides = block.content.slides || []
                  onUpdate({
                    slides: [
                      ...slides,
                      {
                        id: Date.now().toString(),
                        imageUrl: "",
                        titleAr: "",
                        titleEn: "",
                        subtitleAr: "",
                        subtitleEn: "",
                        descriptionAr: "",
                        descriptionEn: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة شريحة" : "Add Slide"}
              </Button>
            </div>
            {(block.content.slides || []).map((slide, index) => (
              <Card key={slide.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "شريحة" : "Slide"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const slides = block.content.slides || []
                      onUpdate({ slides: slides.filter((s) => s.id !== slide.id) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <ImageUpload
                  value={slide.imageUrl}
                  onChange={(url) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, imageUrl: url } : s)),
                    })
                  }}
                  label={language === "ar" ? "صورة الشريحة" : "Slide Image"}
                  language={language === "ar" ? "ar" : "en"}
                />
                <Input
                  value={slide.titleAr}
                  onChange={(e) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, titleAr: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}
                />
                <Input
                  value={slide.titleEn}
                  onChange={(e) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, titleEn: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}
                />
                <Textarea
                  value={slide.subtitleAr}
                  onChange={(e) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, subtitleAr: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "عنوان فرعي بالعربية" : "Subtitle in Arabic"}
                  rows={2}
                />
                <Textarea
                  value={slide.subtitleEn}
                  onChange={(e) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, subtitleEn: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "عنوان فرعي بالإنجليزية" : "Subtitle in English"}
                  rows={2}
                />
                <Textarea
                  value={slide.descriptionAr}
                  onChange={(e) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, descriptionAr: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}
                  rows={3}
                />
                <Textarea
                  value={slide.descriptionEn}
                  onChange={(e) => {
                    const slides = block.content.slides || []
                    onUpdate({
                      slides: slides.map((s) => (s.id === slide.id ? { ...s, descriptionEn: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}
                  rows={3}
                />
              </Card>
            ))}
          </div>
        )

      case "statistics":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "الإحصائيات" : "Statistics"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const stats = block.content.stats || []
                  onUpdate({
                    stats: [
                      ...stats,
                      {
                        id: Date.now().toString(),
                        number: "",
                        labelAr: "",
                        labelEn: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة إحصائية" : "Add Statistic"}
              </Button>
            </div>
            {(block.content.stats || []).map((stat, index) => (
              <Card key={stat.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "إحصائية" : "Statistic"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const stats = block.content.stats || []
                      onUpdate({ stats: stats.filter((s) => s.id !== stat.id) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={stat.number}
                  onChange={(e) => {
                    const stats = block.content.stats || []
                    onUpdate({
                      stats: stats.map((s) => (s.id === stat.id ? { ...s, number: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "الرقم (مثال: 1000+)" : "Number (e.g., 1000+)"}
                />
                <Input
                  value={stat.labelAr}
                  onChange={(e) => {
                    const stats = block.content.stats || []
                    onUpdate({
                      stats: stats.map((s) => (s.id === stat.id ? { ...s, labelAr: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "التسمية بالعربية" : "Label in Arabic"}
                />
                <Input
                  value={stat.labelEn}
                  onChange={(e) => {
                    const stats = block.content.stats || []
                    onUpdate({
                      stats: stats.map((s) => (s.id === stat.id ? { ...s, labelEn: e.target.value } : s)),
                    })
                  }}
                  placeholder={language === "ar" ? "التسمية بالإنجليزية" : "Label in English"}
                />
              </Card>
            ))}
          </div>
        )

      case "features":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "المميزات" : "Features"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const features = block.content.features || []
                  onUpdate({
                    features: [
                      ...features,
                      {
                        id: Date.now().toString(),
                        icon: "star",
                        titleAr: "",
                        titleEn: "",
                        descriptionAr: "",
                        descriptionEn: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة ميزة" : "Add Feature"}
              </Button>
            </div>
            {(block.content.features || []).map((feature, index) => (
              <Card key={feature.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "ميزة" : "Feature"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const features = block.content.features || []
                      onUpdate({ features: features.filter((f) => f.id !== feature.id) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>{language === "ar" ? "الأيقونة" : "Icon"}</Label>
                  <Input
                    value={feature.icon}
                    onChange={(e) => {
                      const features = block.content.features || []
                      onUpdate({
                        features: features.map((f) => (f.id === feature.id ? { ...f, icon: e.target.value } : f)),
                      })
                    }}
                    placeholder="lucide-icon-name (e.g., star)"
                  />
                </div>
                <Input
                  value={feature.titleAr}
                  onChange={(e) => {
                    const features = block.content.features || []
                    onUpdate({
                      features: features.map((f) => (f.id === feature.id ? { ...f, titleAr: e.target.value } : f)),
                    })
                  }}
                  placeholder={language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}
                />
                <Input
                  value={feature.titleEn}
                  onChange={(e) => {
                    const features = block.content.features || []
                    onUpdate({
                      features: features.map((f) => (f.id === feature.id ? { ...f, titleEn: e.target.value } : f)),
                    })
                  }}
                  placeholder={language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}
                />
                <Textarea
                  value={feature.descriptionAr}
                  onChange={(e) => {
                    const features = block.content.features || []
                    onUpdate({
                      features: features.map((f) =>
                        f.id === feature.id ? { ...f, descriptionAr: e.target.value } : f,
                      ),
                    })
                  }}
                  placeholder={language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}
                  rows={2}
                />
                <Textarea
                  value={feature.descriptionEn}
                  onChange={(e) => {
                    const features = block.content.features || []
                    onUpdate({
                      features: features.map((f) =>
                        f.id === feature.id ? { ...f, descriptionEn: e.target.value } : f,
                      ),
                    })
                  }}
                  placeholder={language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}
                  rows={2}
                />
              </Card>
            ))}
          </div>
        )

      case "accordion":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "العناصر" : "Items"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const items = block.content.items || []
                  onUpdate({
                    items: [
                      ...items,
                      {
                        id: Date.now().toString(),
                        titleAr: "",
                        titleEn: "",
                        descriptionAr: "",
                        descriptionEn: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة عنصر" : "Add Item"}
              </Button>
            </div>
            {(block.content.items || []).map((item, index) => (
              <Card key={item.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "عنصر" : "Item"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const items = block.content.items || []
                      onUpdate({ items: items.filter((i) => i.id !== item.id) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={item.titleAr}
                  onChange={(e) => {
                    const items = block.content.items || []
                    onUpdate({
                      items: items.map((i) => (i.id === item.id ? { ...i, titleAr: e.target.value } : i)),
                    })
                  }}
                  placeholder={language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}
                />
                <Input
                  value={item.titleEn}
                  onChange={(e) => {
                    const items = block.content.items || []
                    onUpdate({
                      items: items.map((i) => (i.id === item.id ? { ...i, titleEn: e.target.value } : i)),
                    })
                  }}
                  placeholder={language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}
                />
                <Textarea
                  value={item.descriptionAr}
                  onChange={(e) => {
                    const items = block.content.items || []
                    onUpdate({
                      items: items.map((i) => (i.id === item.id ? { ...i, descriptionAr: e.target.value } : i)),
                    })
                  }}
                  placeholder={language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}
                  rows={3}
                />
                <Textarea
                  value={item.descriptionEn}
                  onChange={(e) => {
                    const items = block.content.items || []
                    onUpdate({
                      items: items.map((i) => (i.id === item.id ? { ...i, descriptionEn: e.target.value } : i)),
                    })
                  }}
                  placeholder={language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}
                  rows={3}
                />
              </Card>
            ))}
          </div>
        )

      case "tabs":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "التبويبات" : "Tabs"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const tabs = block.content.tabs || []
                  onUpdate({
                    tabs: [
                      ...tabs,
                      {
                        id: Date.now().toString(),
                        titleAr: "",
                        titleEn: "",
                        contentAr: "",
                        contentEn: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة تبويب" : "Add Tab"}
              </Button>
            </div>
            {(block.content.tabs || []).map((tab, index) => (
              <Card key={tab.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "تبويب" : "Tab"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const tabs = block.content.tabs || []
                      onUpdate({ tabs: tabs.filter((t) => t.id !== tab.id) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={tab.titleAr}
                  onChange={(e) => {
                    const tabs = block.content.tabs || []
                    onUpdate({
                      tabs: tabs.map((t) => (t.id === tab.id ? { ...t, titleAr: e.target.value } : t)),
                    })
                  }}
                  placeholder={language === "ar" ? "عنوان التبويب بالعربية" : "Tab title in Arabic"}
                />
                <Input
                  value={tab.titleEn}
                  onChange={(e) => {
                    const tabs = block.content.tabs || []
                    onUpdate({
                      tabs: tabs.map((t) => (t.id === tab.id ? { ...t, titleEn: e.target.value } : t)),
                    })
                  }}
                  placeholder={language === "ar" ? "عنوان التبويب بالإنجليزية" : "Tab title in English"}
                />
                <Textarea
                  value={tab.contentAr}
                  onChange={(e) => {
                    const tabs = block.content.tabs || []
                    onUpdate({
                      tabs: tabs.map((t) => (t.id === tab.id ? { ...t, contentAr: e.target.value } : t)),
                    })
                  }}
                  placeholder={language === "ar" ? "محتوى التبويب بالعربية" : "Tab content in Arabic"}
                  rows={3}
                />
                <Textarea
                  value={tab.contentEn}
                  onChange={(e) => {
                    const tabs = block.content.tabs || []
                    onUpdate({
                      tabs: tabs.map((t) => (t.id === tab.id ? { ...t, contentEn: e.target.value } : t)),
                    })
                  }}
                  placeholder={language === "ar" ? "محتوى التبويب بالإنجليزية" : "Tab content in English"}
                  rows={3}
                />
              </Card>
            ))}
          </div>
        )

      case "alert":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "النوع" : "Type"}</Label>
              <Select
                value={block.content.alertType || "info"}
                onValueChange={(value) => onUpdate({ alertType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">{language === "ar" ? "معلومة" : "Info"}</SelectItem>
                  <SelectItem value="warning">{language === "ar" ? "تحذير" : "Warning"}</SelectItem>
                  <SelectItem value="error">{language === "ar" ? "خطأ" : "Error"}</SelectItem>
                  <SelectItem value="success">{language === "ar" ? "نجاح" : "Success"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "عنوان التنبيه" : "Alert title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Alert title"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}</Label>
              <Textarea
                value={block.content.descriptionAr || ""}
                onChange={(e) => onUpdate({ descriptionAr: e.target.value })}
                rows={4}
                placeholder={language === "ar" ? "وصف التنبيه" : "Alert description"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}</Label>
              <Textarea
                value={block.content.descriptionEn || ""}
                onChange={(e) => onUpdate({ descriptionEn: e.target.value })}
                rows={4}
                placeholder="Alert description"
              />
            </div>
          </div>
        )

      case "testimonial-card":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "اسم الشخص بالعربية" : "Name in Arabic"}</Label>
              <Input
                value={block.content.nameAr || ""}
                onChange={(e) => onUpdate({ nameAr: e.target.value })}
                placeholder={language === "ar" ? "اسم العميل" : "Client's name"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "اسم الشخص بالإنجليزية" : "Name in English"}</Label>
              <Input
                value={block.content.nameEn || ""}
                onChange={(e) => onUpdate({ nameEn: e.target.value })}
                placeholder="Client's name"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "منصبه بالعربية" : "Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "منصب العميل" : "Client's title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "منصبه بالإنجليزية" : "Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Client's title"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الاقتباس بالعربية" : "Quote in Arabic"}</Label>
              <Textarea
                value={block.content.quoteAr || ""}
                onChange={(e) => onUpdate({ quoteAr: e.target.value })}
                rows={4}
                placeholder={language === "ar" ? "اقتباس العميل" : "Client's quote"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الاقتباس بالإنجليزية" : "Quote in English"}</Label>
              <Textarea
                value={block.content.quoteEn || ""}
                onChange={(e) => onUpdate({ quoteEn: e.target.value })}
                rows={4}
                placeholder="Client's quote"
              />
            </div>
            <ImageUpload
              value={block.content.imageUrl || ""}
              onChange={(url) => onUpdate({ imageUrl: url })}
              label={language === "ar" ? "صورة العميل" : "Client Image"}
              language={language === "ar" ? "ar" : "en"}
            />
          </div>
        )

      case "team-member":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "الاسم بالعربية" : "Name in Arabic"}</Label>
              <Input
                value={block.content.nameAr || ""}
                onChange={(e) => onUpdate({ nameAr: e.target.value })}
                placeholder={language === "ar" ? "اسم عضو الفريق" : "Team member's name"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الاسم بالإنجليزية" : "Name in English"}</Label>
              <Input
                value={block.content.nameEn || ""}
                onChange={(e) => onUpdate({ nameEn: e.target.value })}
                placeholder="Team member's name"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "المنصب بالعربية" : "Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "منصب عضو الفريق" : "Team member's title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "المنصب بالإنجليزية" : "Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Team member's title"
              />
            </div>
            <ImageUpload
              value={block.content.imageUrl || ""}
              onChange={(url) => onUpdate({ imageUrl: url })}
              label={language === "ar" ? "صورة عضو الفريق" : "Team member's image"}
              language={language === "ar" ? "ar" : "en"}
            />
            <div>
              <Label>{language === "ar" ? "روابط التواصل" : "Social Links"}</Label>
              <div className="space-y-2">
                <Input
                  value={block.content.linkedinUrl || ""}
                  onChange={(e) => onUpdate({ linkedinUrl: e.target.value })}
                  placeholder="LinkedIn URL"
                />
                <Input
                  value={block.content.twitterUrl || ""}
                  onChange={(e) => onUpdate({ twitterUrl: e.target.value })}
                  placeholder="Twitter URL"
                />
                <Input
                  value={block.content.facebookUrl || ""}
                  onChange={(e) => onUpdate({ facebookUrl: e.target.value })}
                  placeholder="Facebook URL"
                />
              </div>
            </div>
          </div>
        )

      case "pricing-card":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "اسم الخطة بالعربية" : "Plan Name in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "اسم الخطة" : "Plan name"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "اسم الخطة بالإنجليزية" : "Plan Name in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Plan name"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "السعر" : "Price"}</Label>
              <Input
                value={block.content.price || ""}
                onChange={(e) => onUpdate({ price: e.target.value })}
                placeholder="e.g., $19.99"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}</Label>
              <Textarea
                value={block.content.descriptionAr || ""}
                onChange={(e) => onUpdate({ descriptionAr: e.target.value })}
                rows={3}
                placeholder={language === "ar" ? "وصف الخطة" : "Plan description"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}</Label>
              <Textarea
                value={block.content.descriptionEn || ""}
                onChange={(e) => onUpdate({ descriptionEn: e.target.value })}
                rows={3}
                placeholder="Plan description"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "المميزات" : "Features"}</Label>
              <div className="flex flex-col gap-2">
                {(block.content.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature.text || ""}
                      onChange={(e) => {
                        const features = block.content.features || []
                        onUpdate({
                          features: features.map((f, i) => (i === index ? { ...f, text: e.target.value } : f)),
                        })
                      }}
                      placeholder={language === "ar" ? "ميزة" : "Feature"}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const features = block.content.features || []
                        onUpdate({ features: features.filter((_, i) => i !== index) })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const features = block.content.features || []
                    onUpdate({ features: [...features, { text: "" }] })
                  }}
                >
                  <Plus className="w-4 h-4" /> {language === "ar" ? "إضافة ميزة" : "Add Feature"}
                </Button>
              </div>
            </div>
            <div>
              <Label>{language === "ar" ? "نص زر الدعوة لإجراء" : "Call-to-Action Button Text"}</Label>
              <Input
                value={block.content.buttonTextAr || ""}
                onChange={(e) => onUpdate({ buttonTextAr: e.target.value })}
                placeholder={language === "ar" ? "اشترك الآن" : "Sign Up Now"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "رابط زر الدعوة لإجراء" : "Call-to-Action Button URL"}</Label>
              <Input
                value={block.content.buttonUrl || ""}
                onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        )

      case "cta":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "العنوان الرئيسي بالعربية" : "Main Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "عنوان جذاب" : "Catchy title"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "العنوان الرئيسي بالإنجليزية" : "Main Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Catchy title"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالعربية" : "Description in Arabic"}</Label>
              <Textarea
                value={block.content.descriptionAr || ""}
                onChange={(e) => onUpdate({ descriptionAr: e.target.value })}
                rows={4}
                placeholder={language === "ar" ? "وصف قصير ومقنع" : "Short, compelling description"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "الوصف بالإنجليزية" : "Description in English"}</Label>
              <Textarea
                value={block.content.descriptionEn || ""}
                onChange={(e) => onUpdate({ descriptionEn: e.target.value })}
                rows={4}
                placeholder="Short, compelling description"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "نص زر الدعوة لإجراء" : "Call-to-Action Button Text"}</Label>
              <Input
                value={block.content.buttonTextAr || ""}
                onChange={(e) => onUpdate({ buttonTextAr: e.target.value })}
                placeholder={language === "ar" ? "اضغط هنا" : "Click Here"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "رابط زر الدعوة لإجراء" : "Call-to-Action Button URL"}</Label>
              <Input
                value={block.content.buttonUrl || ""}
                onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>{language === "ar" ? "صورة خلفية (اختياري)" : "Background Image (Optional)"}</Label>
              <ImageUpload
                value={block.content.imageUrl || ""}
                onChange={(url) => onUpdate({ imageUrl: url })}
                language={language === "ar" ? "ar" : "en"}
              />
            </div>
          </div>
        )

      case "form":
        return (
          <div className="space-y-4">
            <div>
              <Label>{language === "ar" ? "عنوان النموذج بالعربية" : "Form Title in Arabic"}</Label>
              <Input
                value={block.content.titleAr || ""}
                onChange={(e) => onUpdate({ titleAr: e.target.value })}
                placeholder={language === "ar" ? "نموذج الاتصال" : "Contact Form"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "عنوان النموذج بالإنجليزية" : "Form Title in English"}</Label>
              <Input
                value={block.content.titleEn || ""}
                onChange={(e) => onUpdate({ titleEn: e.target.value })}
                placeholder="Contact Form"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "وصف النموذج بالعربية" : "Form Description in Arabic"}</Label>
              <Textarea
                value={block.content.descriptionAr || ""}
                onChange={(e) => onUpdate({ descriptionAr: e.target.value })}
                rows={3}
                placeholder={language === "ar" ? "املأ الحقول أدناه" : "Fill in the fields below"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "وصف النموذج بالإنجليزية" : "Form Description in English"}</Label>
              <Textarea
                value={block.content.descriptionEn || ""}
                onChange={(e) => onUpdate({ descriptionEn: e.target.value })}
                rows={3}
                placeholder="Fill in the fields below"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "تسمية زر الإرسال" : "Submit Button Label"}</Label>
              <Input
                value={block.content.buttonTextAr || ""}
                onChange={(e) => onUpdate({ buttonTextAr: e.target.value })}
                placeholder={language === "ar" ? "إرسال" : "Submit"}
              />
            </div>
          </div>
        )

      case "map":
        return (
          <div className="space-y-4">
            <div>
              <Label>Latitude</Label>
              <Input
                value={block.content.latitude || ""}
                onChange={(e) => onUpdate({ latitude: e.target.value })}
                placeholder="e.g., 31.5204"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={block.content.longitude || ""}
                onChange={(e) => onUpdate({ longitude: e.target.value })}
                placeholder="e.g., 74.3587"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "مستوى التكبير" : "Zoom Level"}</Label>
              <Input
                type="number"
                value={block.content.zoom || 12}
                onChange={(e) => onUpdate({ zoom: Number.parseInt(e.target.value) })}
                placeholder="12"
              />
            </div>
            <div>
              <Label>{language === "ar" ? "نص علامة الخريطة (عربي)" : "Map Marker Text (Arabic)"}</Label>
              <Input
                value={block.content.markerTextAr || ""}
                onChange={(e) => onUpdate({ markerTextAr: e.target.value })}
                placeholder={language === "ar" ? "موقعنا" : "Our Location"}
              />
            </div>
            <div>
              <Label>{language === "ar" ? "نص علامة الخريطة (إنجليزي)" : "Map Marker Text (English)"}</Label>
              <Input
                value={block.content.markerTextEn || ""}
                onChange={(e) => onUpdate({ markerTextEn: e.target.value })}
                placeholder="Our Location"
              />
            </div>
          </div>
        )

      case "social-links":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === "ar" ? "الروابط" : "Links"}</Label>
              <Button
                size="sm"
                onClick={() => {
                  const links = block.content.links || []
                  onUpdate({
                    links: [
                      ...links,
                      {
                        id: Date.now().toString(),
                        platform: "",
                        url: "",
                      },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                {language === "ar" ? "إضافة رابط" : "Add Link"}
              </Button>
            </div>
            {(block.content.links || []).map((link, index) => (
              <Card key={link.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "ar" ? "رابط" : "Link"} {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const links = block.content.links || []
                      onUpdate({ links: links.filter((l) => l.id !== link.id) })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={link.platform}
                  onChange={(e) => {
                    const links = block.content.links || []
                    onUpdate({
                      links: links.map((l) => (l.id === link.id ? { ...l, platform: e.target.value } : l)),
                    })
                  }}
                  placeholder={language === "ar" ? "المنصة (مثل: فيسبوك، تويتر)" : "Platform (e.g., Facebook, Twitter)"}
                />
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const links = block.content.links || []
                    onUpdate({
                      links: links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)),
                    })
                  }}
                  placeholder="URL"
                />
              </Card>
            ))}
          </div>
        )

      // Section blocks (now treated as components but with specific editors if needed)
      case "about-section":
      case "departments-section":
      case "gallery-section":
      case "testimonials-section":
      case "jobs-section":
      case "contact-section":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{language === "ar" ? "قسم متقدم" : "Advanced Section Block"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "ar"
                  ? "هذا القسم يحتوي على محتوى معقد. يمكنك تعديله من لوحة التحكم الرئيسية."
                  : "This section contains complex content. You can edit it from the main dashboard."}
              </p>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                {language === "ar" ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            {language === "ar" ? "محرر هذا العنصر قيد التطوير" : "Editor for this block type is under development"}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderEditor()}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          {language === "ar" ? "إغلاق" : "Close"}
        </Button>
        <Button onClick={onClose}>{language === "ar" ? "حفظ" : "Save"}</Button>
      </div>
    </div>
  )
}
