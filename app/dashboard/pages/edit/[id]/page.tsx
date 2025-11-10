"use client"
import { useState, useEffect } from "react"

import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { getDynamicPages, updateDynamicPage, type PageBlock } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Type,
  ImageIcon,
  Video,
  Quote,
  Minus,
  LinkIcon,
  Code,
  Trash2,
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
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { JSX } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import EditableHeroSlider from "@/components/editable/editable-hero-slider"
import EditableTextSection from "@/components/editable/editable-text-section"
import EditableCardsSection from "@/components/editable/editable-cards-section"

export default function EditPagePage() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string
  const { language } = useLanguage()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [contentLanguage, setContentLanguage] = useState<"ar" | "en">("ar")
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null)
  const [tempBlockChanges, setTempBlockChanges] = useState<Partial<PageBlock> | null>(null)
  const [activeContainer, setActiveContainer] = useState<{ blockId: string; columnIndex?: number } | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

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
    { type: "row", icon: Columns, label: language === "ar" ? "صف (أعمدة)" : "Row (Columns)", category: "layout" },
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
    // New blocks for homepage sections
    { type: "hero", icon: Presentation, label: language === "ar" ? "بطل" : "Hero", category: "homepage" },
    { type: "text", icon: Type, label: language === "ar" ? "نص" : "Text", category: "homepage" },
    { type: "cards", icon: Columns, label: language === "ar" ? "بطاقات" : "Cards", category: "homepage" },
    { type: "gallery", icon: ImagePlus, label: language === "ar" ? "معرض" : "Gallery", category: "homepage" },
    {
      type: "testimonials",
      icon: MessageSquare,
      label: language === "ar" ? "شهادات" : "Testimonials",
      category: "homepage",
    },
    { type: "cta", icon: Phone, label: language === "ar" ? "دعوة للعمل" : "Call to Action", category: "homepage" },
    { type: "contact", icon: Phone, label: language === "ar" ? "اتصل بنا" : "Contact", category: "homepage" },
  ]

  const basicBlocks = blockTypes.filter((b) => b.category === "basic")
  const layoutBlocks = blockTypes.filter((b) => b.category === "layout")
  const componentBlocks = blockTypes.filter((b) => b.category === "components")
  const homepageBlocks = blockTypes.filter((b) => b.category === "homepage")

  useEffect(() => {
    loadPage()
  }, [pageId])

  const loadPage = async () => {
    try {
      console.log("[v0] Loading page for edit:", pageId)
      const pages = await getDynamicPages()
      const page = pages.find((p) => p.id === pageId)

      if (!page) {
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description: language === "ar" ? "الصفحة غير موجودة" : "Page not found",
          variant: "destructive",
        })
        router.push("/dashboard?section=pages")
        return
      }

      console.log("[v0] Page loaded for edit:", page)
      setPageData({
        titleAr: page.titleAr || "",
        titleEn: page.titleEn || "",
        slug: page.slug || "",
        descriptionAr: page.descriptionAr || "",
        descriptionEn: page.descriptionEn || "",
        seoDescriptionAr: page.seoDescriptionAr || "",
        seoDescriptionEn: page.seoDescriptionEn || "",
        featuredImage: page.featuredImage || page.image || "",
        isPublished: page.isPublished || false,
      })
      setBlocks(page.blocks || [])
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error loading page:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل تحميل الصفحة" : "Failed to load page",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!pageData.titleAr || !pageData.titleEn || !pageData.slug) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    console.log("[v0] Attempting to update page in Firebase:", pageId)
    try {
      await updateDynamicPage(pageId, {
        ...pageData,
        image: pageData.featuredImage,
        featuredImage: pageData.featuredImage,
        blocks,
      })
      console.log("[v0] Page successfully saved to Firebase")

      toast({
        title: language === "ar" ? "تم الحفظ" : "Saved",
        description: language === "ar" ? "تم تحديث الصفحة بنجاح" : "Page updated successfully",
      })

      // No redirect - user stays on the edit page
    } catch (error) {
      console.error("[v0] Error saving page to Firebase:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في حفظ الصفحة" : "Failed to save page",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addBlock = (type: PageBlock["type"], containerId?: string, columnIndex?: number) => {
    const newBlock: PageBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      order: blocks.length,
      content: {},
      styles: {},
      ...(type === "row" && { children: [] }),
    }

    if (containerId) {
      setBlocks(
        blocks.map((block) => {
          if (block.id === containerId) {
            const children = block.children || []
            newBlock.order = columnIndex !== undefined ? columnIndex : children.length
            return { ...block, children: [...children, newBlock] }
          }
          if (block.children) {
            return { ...block, children: addBlockToNestedChildren(block.children, type, containerId, columnIndex) }
          }
          return block
        }),
      )
    } else {
      setBlocks([...blocks, newBlock])
    }

    setShowBlockModal(false)
    setEditingBlock(newBlock)
  }

  const addBlockToNestedChildren = (
    blockList: PageBlock[],
    type: PageBlock["type"],
    containerId: string,
    columnIndex?: number,
  ): PageBlock[] => {
    return blockList.map((block) => {
      if (block.id === containerId) {
        const children = block.children || []
        const newBlock: PageBlock = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type,
          order: columnIndex !== undefined ? columnIndex : children.length,
          content: {},
          styles: {},
          ...(type === "row" && { children: [] }),
        }
        return { ...block, children: [...children, newBlock] }
      }
      if (block.children) {
        return { ...block, children: addBlockToNestedChildren(block.children, type, containerId, columnIndex) }
      }
      return block
    })
  }

  const updateBlock = (id: string, content: Partial<PageBlock["content"]>, styles?: Partial<PageBlock["styles"]>) => {
    const updateBlockRecursive = (blockList: PageBlock[]): PageBlock[] => {
      return blockList.map((block) => {
        if (block.id === id) {
          return { ...block, content: { ...block.content, ...content }, styles: { ...block.styles, ...styles } }
        }
        if (block.children) {
          return { ...block, children: updateBlockRecursive(block.children) }
        }
        return block
      })
    }
    setBlocks(updateBlockRecursive(blocks))
  }

  const removeBlock = (id: string) => {
    const removeBlockRecursive = (blockList: PageBlock[]): PageBlock[] => {
      return blockList.filter((block) => {
        if (block.id === id) return false
        if (block.children) {
          block.children = removeBlockRecursive(block.children)
        }
        return true
      })
    }
    setBlocks(removeBlockRecursive(blocks))
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const moveBlockRecursive = (blockList: PageBlock[]): PageBlock[] => {
      const index = blockList.findIndex((b) => b.id === id)
      if (index === -1) {
        return blockList.map((block) => ({
          ...block,
          children: block.children ? moveBlockRecursive(block.children) : undefined,
        }))
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= blockList.length) return blockList

      const newBlocks = [...blockList]
      ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
      return newBlocks
    }
    setBlocks(moveBlockRecursive(blocks))
  }

  const duplicateBlock = (id: string) => {
    const duplicateBlockRecursive = (blockList: PageBlock[]): PageBlock[] => {
      const result: PageBlock[] = []
      for (const block of blockList) {
        result.push(block)
        if (block.id === id) {
          const newBlock = {
            ...block,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          }
          result.push(newBlock)
        }
        if (block.children) {
          block.children = duplicateBlockRecursive(block.children)
        }
      }
      return result
    }
    setBlocks(duplicateBlockRecursive(blocks))
  }

  const renderBlockSettings = (block: PageBlock) => {
    if (!block) return null

    const lang = contentLanguage

    const workingBlock = tempBlockChanges
      ? {
          ...block,
          content: { ...block.content, ...tempBlockChanges.content },
          styles: { ...block.styles, ...tempBlockChanges.styles },
        }
      : block

    const currentLanguage = contentLanguage
    const currentLanguageText =
      (currentLanguage === "ar" ? workingBlock.content?.textAr : workingBlock.content?.textEn) || ""
    const currentLanguageTitle =
      (currentLanguage === "ar" ? workingBlock.content?.titleAr : workingBlock.content?.titleEn) || ""
    const currentLanguageDescription =
      (currentLanguage === "ar" ? workingBlock.content?.descriptionAr : workingBlock.content?.descriptionEn) || ""

    console.log("[v0] Working block content:", JSON.stringify(workingBlock.content).substring(0, 500))
    console.log("[v0] Working block styles:", workingBlock.styles)
    console.log("[v0] Current language:", currentLanguage)
    console.log("[v0] Current text:", currentLanguageText)
    console.log("[v0] Current title:", currentLanguageTitle)
    console.log("[v0] Current description:", currentLanguageDescription)

    const handleContentChange = (field: string, value: any) => {
      setTempBlockChanges((prev) => ({
        ...prev,
        content: {
          ...(prev?.content || workingBlock.content || {}),
          [field]: value,
        },
      }))
    }

    const handleStyleChange = (field: keyof PageBlock["styles"], value: string) => {
      setTempBlockChanges((prev) => ({
        ...prev,
        styles: {
          ...(prev?.styles || workingBlock.styles || {}),
          [field]: value,
        },
      }))
    }

    // FIX: Fix variable calculations to properly access nested content
    const currentLanguageButtonText =
      (currentLanguage === "ar" ? workingBlock.content?.buttonTextAr : workingBlock.content?.buttonTextEn) || ""
    const currentLanguageAuthor =
      (currentLanguage === "ar" ? workingBlock.content?.authorAr : workingBlock.content?.authorEn) || ""

    const renderStyleTab = () => {
      return (
        <div className="space-y-6">
          {/* Background & Colors */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">
              {language === "ar" ? "الخلفية والألوان" : "Background & Colors"}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{language === "ar" ? "لون الخلفية" : "Background Color"}</Label>
                <select
                  value={workingBlock.styles?.backgroundColor || ""}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="bg-transparent">Transparent</option>
                  <option value="bg-background">Background</option>
                  <option value="bg-card">Card</option>
                  <option value="bg-muted">Muted</option>
                  <option value="bg-primary">Primary</option>
                  <option value="bg-secondary">Secondary</option>
                  <option value="bg-accent">Accent</option>
                  <option value="bg-primary/10">Primary Light</option>
                  <option value="bg-accent/10">Accent Light</option>
                  <option value="bg-muted/50">Muted 50%</option>
                  <option value="bg-gradient-to-br">Gradient (use gradient options below)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{language === "ar" ? "لون النص" : "Text Color"}</Label>
                <select
                  value={workingBlock.styles?.textColor || ""}
                  onChange={(e) => handleStyleChange("textColor", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="text-foreground">Foreground</option>
                  <option value="text-muted-foreground">Muted</option>
                  <option value="text-primary">Primary</option>
                  <option value="text-secondary">Secondary</option>
                  <option value="text-accent">Accent</option>
                  <option value="text-white">White</option>
                  <option value="text-black">Black</option>
                </select>
              </div>
            </div>

            {/* Gradient Controls */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">{lang === "ar" ? "من" : "From"}</Label>
                <select
                  value={workingBlock.styles?.gradientFrom || ""}
                  onChange={(e) => handleStyleChange("gradientFrom", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="from-primary">Primary</option>
                  <option value="from-secondary">Secondary</option>
                  <option value="from-accent">Accent</option>
                  <option value="from-blue-500">Blue</option>
                  <option value="from-purple-500">Purple</option>
                  <option value="from-pink-500">Pink</option>
                  <option value="from-orange-500">Orange</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">{lang === "ar" ? "عبر" : "Via"}</Label>
                <select
                  value={workingBlock.styles?.gradientVia || ""}
                  onChange={(e) => handleStyleChange("gradientVia", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="via-primary">Primary</option>
                  <option value="via-secondary">Secondary</option>
                  <option value="via-accent">Accent</option>
                  <option value="via-purple-500">Purple</option>
                  <option value="via-pink-500">Pink</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">{lang === "ar" ? "إلى" : "To"}</Label>
                <select
                  value={workingBlock.styles?.gradientTo || ""}
                  onChange={(e) => handleStyleChange("gradientTo", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="to-primary">Primary</option>
                  <option value="to-secondary">Secondary</option>
                  <option value="to-accent">Accent</option>
                  <option value="to-blue-600">Blue</option>
                  <option value="to-purple-600">Purple</option>
                  <option value="to-pink-600">Pink</option>
                </select>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">{lang === "ar" ? "المسافات" : "Spacing"}</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "الحشو الداخلي" : "Padding"}</Label>
                <select
                  value={workingBlock.styles?.padding || ""}
                  onChange={(e) => handleStyleChange("padding", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="p-2">Small (8px)</option>
                  <option value="p-4">Medium (16px)</option>
                  <option value="p-6">Large (24px)</option>
                  <option value="p-8">X-Large (32px)</option>
                  <option value="p-12">2X-Large (48px)</option>
                  <option value="p-16">3X-Large (64px)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "الهامش الخارجي" : "Margin"}</Label>
                <select
                  value={workingBlock.styles?.margin || ""}
                  onChange={(e) => handleStyleChange("margin", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="m-2">Small (8px)</option>
                  <option value="m-4">Medium (16px)</option>
                  <option value="m-6">Large (24px)</option>
                  <option value="m-8">X-Large (32px)</option>
                  <option value="my-8">Vertical Only</option>
                  <option value="my-12">Vertical Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Border & Shadow */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">
              {lang === "ar" ? "الحدود والظل" : "Border & Shadow"}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "نصف القطر" : "Border Radius"}</Label>
                <select
                  value={workingBlock.styles?.borderRadius || ""}
                  onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="rounded-sm">Small</option>
                  <option value="rounded-md">Medium</option>
                  <option value="rounded-lg">Large</option>
                  <option value="rounded-xl">X-Large</option>
                  <option value="rounded-2xl">2X-Large</option>
                  <option value="rounded-full">Full</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "عرض الحدود" : "Border Width"}</Label>
                <select
                  value={workingBlock.styles?.borderWidth || ""}
                  onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="border">1px</option>
                  <option value="border-2">2px</option>
                  <option value="border-4">4px</option>
                  <option value="border-8">8px</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "لون الحدود" : "Border Color"}</Label>
                <select
                  value={workingBlock.styles?.borderColor || ""}
                  onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="border-primary">Primary</option>
                  <option value="border-secondary">Secondary</option>
                  <option value="border-accent">Accent</option>
                  <option value="border-muted">Muted</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "الظل" : "Shadow"}</Label>
                <select
                  value={workingBlock.styles?.shadow || ""}
                  onChange={(e) => handleStyleChange("shadow", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="shadow-sm">Small</option>
                  <option value="shadow-md">Medium</option>
                  <option value="shadow-lg">Large</option>
                  <option value="shadow-xl">X-Large</option>
                  <option value="shadow-2xl">2X-Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Animations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">{lang === "ar" ? "الحركة" : "Animations"}</h4>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "نوع الحركة" : "Animation Type"}</Label>
                <select
                  value={workingBlock.styles?.animation || ""}
                  onChange={(e) => handleStyleChange("animation", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="animate-fade-in">Fade In</option>
                  <option value="animate-slide-in-up">Slide In Up</option>
                  <option value="animate-slide-in-down">Slide In Down</option>
                  <option value="animate-slide-in-left">Slide In Left</option>
                  <option value="animate-slide-in-right">Slide In Right</option>
                  <option value="animate-scale-in">Scale In</option>
                  <option value="animate-bounce">Bounce</option>
                  <option value="animate-pulse">Pulse</option>
                  <option value="animate-float">Float</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">{lang === "ar" ? "تأخير الحركة" : "Animation Delay"}</Label>
                  <select
                    value={workingBlock.styles?.animationDelay || ""}
                    onChange={(e) => handleStyleChange("animationDelay", e.target.value)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="">None</option>
                    <option value="delay-100">100ms</option>
                    <option value="delay-200">200ms</option>
                    <option value="delay-300">300ms</option>
                    <option value="delay-500">500ms</option>
                    <option value="delay-700">700ms</option>
                    <option value="delay-1000">1000ms</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs">{lang === "ar" ? "مدة الحركة" : "Animation Duration"}</Label>
                  <select
                    value={workingBlock.styles?.animationDuration || ""}
                    onChange={(e) => handleStyleChange("animationDuration", e.target.value)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="">Default</option>
                    <option value="duration-300">300ms</option>
                    <option value="duration-500">500ms</option>
                    <option value="duration-700">700ms</option>
                    <option value="duration-1000">1000ms</option>
                    <option value="duration-1500">1500ms</option>
                    <option value="duration-2000">2000ms</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Effects */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">
              {lang === "ar" ? "تأثيرات التمرير" : "Hover Effects"}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "تكبير عند التمرير" : "Hover Scale"}</Label>
                <select
                  value={workingBlock.styles?.hoverScale || ""}
                  onChange={(e) => handleStyleChange("hoverScale", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="hover:scale-105">105%</option>
                  <option value="hover:scale-110">110%</option>
                  <option value="hover:scale-125">125%</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "دوران عند التمرير" : "Hover Rotate"}</Label>
                <select
                  value={workingBlock.styles?.hoverRotate || ""}
                  onChange={(e) => handleStyleChange("hoverRotate", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="hover:rotate-3">3 degrees</option>
                  <option value="hover:rotate-6">6 degrees</option>
                  <option value="hover:-rotate-3">-3 degrees</option>
                  <option value="hover:-rotate-6">-6 degrees</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "حركة عند التمرير" : "Hover Translate"}</Label>
                <select
                  value={workingBlock.styles?.hoverTranslate || ""}
                  onChange={(e) => handleStyleChange("hoverTranslate", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="hover:-translate-y-1">Up Small</option>
                  <option value="hover:-translate-y-2">Up Medium</option>
                  <option value="hover:-translate-y-4">Up Large</option>
                  <option value="hover:translate-x-1">Right Small</option>
                  <option value="hover:translate-x-2">Right Medium</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "ظل عند التمرير" : "Hover Shadow"}</Label>
                <select
                  value={workingBlock.styles?.hoverShadow || ""}
                  onChange={(e) => handleStyleChange("hoverShadow", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="hover:shadow-lg">Large</option>
                  <option value="hover:shadow-xl">X-Large</option>
                  <option value="hover:shadow-2xl">2X-Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">{lang === "ar" ? "متقدم" : "Advanced"}</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "محاذاة النص" : "Text Align"}</Label>
                <select
                  value={workingBlock.styles?.textAlign || ""}
                  onChange={(e) => handleStyleChange("textAlign", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="text-left">Left</option>
                  <option value="text-center">Center</option>
                  <option value="text-right">Right</option>
                  <option value="text-justify">Justify</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "العرض الأقصى" : "Max Width"}</Label>
                <select
                  value={workingBlock.styles?.maxWidth || ""}
                  onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="max-w-sm">Small (384px)</option>
                  <option value="max-w-md">Medium (448px)</option>
                  <option value="max-w-lg">Large (512px)</option>
                  <option value="max-w-xl">X-Large (576px)</option>
                  <option value="max-w-2xl">2X-Large (672px)</option>
                  <option value="max-w-4xl">4X-Large (896px)</option>
                  <option value="max-w-6xl">6X-Large (1152px)</option>
                  <option value="max-w-full">Full</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "ضبابية الخلفية" : "Backdrop Blur"}</Label>
                <select
                  value={workingBlock.styles?.backdropBlur || ""}
                  onChange={(e) => handleStyleChange("backdropBlur", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="backdrop-blur-sm">Small</option>
                  <option value="backdrop-blur-md">Medium</option>
                  <option value="backdrop-blur-lg">Large</option>
                  <option value="backdrop-blur-xl">X-Large</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "الشفافية" : "Opacity"}</Label>
                <select
                  value={workingBlock.styles?.opacity || ""}
                  onChange={(e) => handleStyleChange("opacity", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">100%</option>
                  <option value="opacity-90">90%</option>
                  <option value="opacity-80">80%</option>
                  <option value="opacity-70">70%</option>
                  <option value="opacity-60">60%</option>
                  <option value="opacity-50">50%</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">{lang === "ar" ? "المحتوى" : "Content"}</TabsTrigger>
          <TabsTrigger value="style">{lang === "ar" ? "التنسيق" : "Style"}</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-4">
            {(block.type === "heading" || block.type === "paragraph") && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "النص" : "Text"}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={currentLanguageText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "textAr" : "textEn", e.target.value)}
                  rows={block.type === "heading" ? 2 : 5}
                  placeholder={lang === "ar" ? "أدخل النص هنا..." : "Enter text here..."}
                />
                {block.type === "heading" && (
                  <>
                    <Label className="text-sm font-medium mt-4">
                      {lang === "ar" ? "مستوى العنوان" : "Heading Level"}
                    </Label>
                    <select
                      value={workingBlock.content.headingLevel || "h2"}
                      onChange={(e) => handleContentChange("headingLevel", e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="h1">H1</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                      <option value="h4">H4</option>
                      <option value="h5">H5</option>
                      <option value="h6">H6</option>
                    </select>
                  </>
                )}
              </>
            )}

            {block.type === "quote" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "نص الاقتباس" : "Quote Text"}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={currentLanguageText}
                  onChange={(e) => handleContentChange(lang === "ar" ? "textAr" : "textEn", e.target.value)}
                  rows={4}
                  placeholder={lang === "ar" ? "أدخل الاقتباس هنا..." : "Enter quote text here..."}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "اسم الكاتب" : "Author Name"}</Label>
                <Input
                  value={currentLanguageAuthor}
                  onChange={(e) => handleContentChange(lang === "ar" ? "authorAr" : "authorEn", e.target.value)}
                  placeholder={lang === "ar" ? "اسم الكاتب" : "Author name"}
                />
              </>
            )}

            {block.type === "image" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "صورة" : "Image"}
                  <span className="text-destructive">*</span>
                </Label>
                <ImageUpload
                  value={workingBlock.content?.imageUrl || ""}
                  onChange={(url) => handleContentChange("imageUrl", url)}
                  language={lang}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نص بديل (Alt Text)" : "Alt Text"}</Label>
                <Input
                  value={workingBlock.content?.altText || ""}
                  onChange={(e) => handleContentChange("altText", e.target.value)}
                  placeholder={lang === "ar" ? "وصف للصورة" : "Description for the image"}
                />
              </>
            )}

            {block.type === "video" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "عنوان الفيديو" : "Video Title"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={currentLanguageTitle}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان الفيديو" : "Video title"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رابط الفيديو (YouTube/Vimeo)" : "Video URL (YouTube/Vimeo)"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={workingBlock.content?.videoUrl || ""}
                  onChange={(e) => handleContentChange("videoUrl", e.target.value)}
                  placeholder={
                    lang === "ar" ? "https://www.youtube.com/watch?v=..." : "https://www.youtube.com/watch?v=..."
                  }
                />
              </>
            )}

            {block.type === "button" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "نص الزر" : "Button Text"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={currentLanguageButtonText}
                  onChange={(e) => handleContentChange(lang === "ar" ? "buttonTextAr" : "buttonTextEn", e.target.value)}
                  placeholder={lang === "ar" ? "نص الزر" : "Button text"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رابط الزر" : "Button URL"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={workingBlock.content?.buttonUrl || ""}
                  onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com" : "https://example.com"}
                />
              </>
            )}

            {block.type === "divider" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "نمط الفاصل" : "Divider Style"}</Label>
                <select
                  value={workingBlock.content?.dividerStyle || "solid"}
                  onChange={(e) => handleContentChange("dividerStyle", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </>
            )}

            {block.type === "spacer" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "الارتفاع (px)" : "Height (px)"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={workingBlock.content?.height || 20}
                  onChange={(e) => handleContentChange("height", Number.parseInt(e.target.value, 10))}
                  placeholder="20"
                />
              </>
            )}

            {block.type === "card" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "العنوان" : "Title"}</Label>
                <Input
                  value={currentLanguageTitle}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان البطاقة" : "Card title"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "النص" : "Text"}</Label>
                <Textarea
                  value={currentLanguageDescription}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={4}
                  placeholder={lang === "ar" ? "وصف البطاقة" : "Card description"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "الصورة (اختياري)" : "Image (Optional)"}
                </Label>
                <ImageUpload
                  value={workingBlock.content?.imageUrl || ""}
                  onChange={(url) => handleContentChange("imageUrl", url)}
                  language={lang}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رابط الزر (اختياري)" : "Button Link (Optional)"}
                </Label>
                <Input
                  value={workingBlock.content?.buttonUrl || ""}
                  onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com" : "https://example.com"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "نص الزر (اختياري)" : "Button Text (Optional)"}
                </Label>
                <Input
                  value={currentLanguageButtonText}
                  onChange={(e) => handleContentChange(lang === "ar" ? "buttonTextAr" : "buttonTextEn", e.target.value)}
                  placeholder={lang === "ar" ? "اقرأ المزيد" : "Read More"}
                />
              </>
            )}

            {block.type === "html" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "كود HTML" : "HTML Code"}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={workingBlock.content?.html || ""}
                  onChange={(e) => handleContentChange("html", e.target.value)}
                  rows={10}
                  placeholder={lang === "ar" ? "أدخل كود HTML هنا..." : "Enter HTML code here..."}
                  className="font-mono text-sm"
                />
              </>
            )}

            {/* Homepage Block Settings */}
            {block.type === "hero" && (
              <div className="space-y-6">
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "الشرائح" : "Slides"}
                  <span className="text-destructive">*</span>
                </Label>

                {(workingBlock.content?.slides || []).map((slide: any, index: number) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        {lang === "ar" ? `شريحة ${index + 1}` : `Slide ${index + 1}`}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides.splice(index, 1)
                          handleContentChange("slides", newSlides)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Title - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                      <Input
                        value={slide.titleAr || slide.title?.ar || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            titleAr: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "العنوان بالعربي" : "Title in Arabic"}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                      <Input
                        value={slide.titleEn || slide.title?.en || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            titleEn: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "العنوان بالإنجليزي" : "Title in English"}
                      />
                    </div>

                    {/* Subtitle - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}</Label>
                      <Textarea
                        value={slide.subtitleAr || slide.subtitle?.ar || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            subtitleAr: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        rows={2}
                        placeholder={lang === "ar" ? "العنوان الفرعي بالعربي" : "Subtitle in Arabic"}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">
                        {lang === "ar" ? "العنوان الفرعي (إنجليزي)" : "Subtitle (English)"}
                      </Label>
                      <Textarea
                        value={slide.subtitleEn || slide.subtitle?.en || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            subtitleEn: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        rows={2}
                        placeholder={lang === "ar" ? "العنوان الفرعي بالإنجليزي" : "Subtitle in English"}
                      />
                    </div>

                    {/* Description - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                      <Textarea
                        value={slide.descriptionAr || slide.description?.ar || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            descriptionAr: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        rows={3}
                        placeholder={lang === "ar" ? "الوصف بالعربي" : "Description in Arabic"}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                      <Textarea
                        value={slide.descriptionEn || slide.description?.en || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            descriptionEn: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        rows={3}
                        placeholder={lang === "ar" ? "الوصف بالإنجليزي" : "Description in English"}
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الشارة" : "Badge"}</Label>
                      <Input
                        value={slide.badge || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            badge: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "نص الشارة" : "Badge text"}
                      />
                    </div>

                    {/* CTA Button - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "نص الزر (عربي)" : "Button Text (Arabic)"}</Label>
                      <Input
                        value={slide.cta?.textAr || slide.cta?.text?.ar || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            cta: {
                              ...newSlides[index].cta,
                              textAr: e.target.value,
                            },
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "نص الزر بالعربي" : "Button text in Arabic"}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "نص الزر (إنجليزي)" : "Button Text (English)"}</Label>
                      <Input
                        value={slide.cta?.textEn || slide.cta?.text?.en || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            cta: {
                              ...newSlides[index].cta,
                              textEn: e.target.value,
                            },
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "نص الزر بالإنجليزي" : "Button text in English"}
                      />
                    </div>

                    {/* CTA Link */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "رابط الزر" : "Button Link"}</Label>
                      <Input
                        value={slide.cta?.link || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            cta: {
                              ...newSlides[index].cta,
                              link: e.target.value,
                            },
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "رابط الزر" : "Button link"}
                      />
                    </div>

                    {/* Image */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الصورة" : "Image"}</Label>
                      <Input
                        value={slide.image || ""}
                        onChange={(e) => {
                          const newSlides = [...(workingBlock.content?.slides || [])]
                          newSlides[index] = {
                            ...newSlides[index],
                            image: e.target.value,
                          }
                          handleContentChange("slides", newSlides)
                        }}
                        placeholder={lang === "ar" ? "رابط الصورة" : "Image URL"}
                      />
                    </div>
                  </Card>
                ))}

                <Button
                  onClick={() => {
                    const newSlides = [
                      ...(workingBlock.content?.slides || []),
                      {
                        titleAr: "",
                        titleEn: "",
                        subtitleAr: "",
                        subtitleEn: "",
                        descriptionAr: "",
                        descriptionEn: "",
                        image: "",
                        cta: { textAr: "", textEn: "", link: "" },
                        badge: "",
                      },
                    ]
                    handleContentChange("slides", newSlides)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {lang === "ar" ? "إضافة شريحة" : "Add Slide"}
                </Button>

                {/* Hero Slider Settings */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold text-sm">{lang === "ar" ? "إعدادات السلايدر" : "Slider Settings"}</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoplay"
                        checked={workingBlock.content?.autoplay !== false}
                        onChange={(e) => handleContentChange("autoplay", e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="autoplay" className="text-xs">
                        {lang === "ar" ? "تشغيل تلقائي" : "Autoplay"}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showDots"
                        checked={workingBlock.content?.showDots !== false}
                        onChange={(e) => handleContentChange("showDots", e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showDots" className="text-xs">
                        {lang === "ar" ? "إظهار النقاط" : "Show Dots"}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showArrows"
                        checked={workingBlock.content?.showArrows !== false}
                        onChange={(e) => handleContentChange("showArrows", e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showArrows" className="text-xs">
                        {lang === "ar" ? "إظهار الأسهم" : "Show Arrows"}
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "مدة العرض (ملي ثانية)" : "Interval (ms)"}</Label>
                    <Input
                      type="number"
                      value={workingBlock.content?.interval || 5000}
                      onChange={(e) => handleContentChange("interval", Number.parseInt(e.target.value))}
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "الارتفاع" : "Height"}</Label>
                    <Input
                      value={workingBlock.content?.height || "h-[600px]"}
                      onChange={(e) => handleContentChange("height", e.target.value)}
                      placeholder="h-[600px]"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "شفافية الطبقة (0-1)" : "Overlay Opacity (0-1)"}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={workingBlock.content?.overlayOpacity || 0.5}
                      onChange={(e) => handleContentChange("overlayOpacity", Number.parseFloat(e.target.value))}
                      placeholder="0.5"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "محاذاة النص" : "Text Alignment"}</Label>
                    <select
                      value={workingBlock.content?.textAlign || "center"}
                      onChange={(e) => handleContentChange("textAlign", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="left">{lang === "ar" ? "يسار" : "Left"}</option>
                      <option value="center">{lang === "ar" ? "وسط" : "Center"}</option>
                      <option value="right">{lang === "ar" ? "يمين" : "Right"}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {block.type === "text" && (
              <div className="space-y-6">
                {/* Title - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">{lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                  <Input
                    value={workingBlock.content?.title?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("title", {
                        ...workingBlock.content?.title,
                        ar: e.target.value,
                      })
                    }}
                    placeholder={lang === "ar" ? "العنوان بالعربي" : "Title in Arabic"}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.title?.en || ""}
                    onChange={(e) => {
                      handleContentChange("title", {
                        ...workingBlock.content?.title,
                        en: e.target.value,
                      })
                    }}
                    placeholder={lang === "ar" ? "العنوان بالإنجليزي" : "Title in English"}
                  />
                </div>

                {/* Description - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                  </Label>
                  <Textarea
                    value={workingBlock.content?.description?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("description", {
                        ...workingBlock.content?.description,
                        ar: e.target.value,
                      })
                    }}
                    rows={4}
                    placeholder={lang === "ar" ? "الوصف بالعربي" : "Description in Arabic"}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
                  </Label>
                  <Textarea
                    value={workingBlock.content?.description?.en || ""}
                    onChange={(e) => {
                      handleContentChange("description", {
                        ...workingBlock.content?.description,
                        en: e.target.value,
                      })
                    }}
                    rows={4}
                    placeholder={lang === "ar" ? "الوصف بالإنجليزي" : "Description in English"}
                  />
                </div>

                {/* Features */}
                <Label className="text-sm font-medium">{lang === "ar" ? "المميزات" : "Features"}</Label>

                {(workingBlock.content?.features || []).map((feature: any, index: number) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        {lang === "ar" ? `ميزة ${index + 1}` : `Feature ${index + 1}`}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFeatures = [...(workingBlock.content?.features || [])]
                          newFeatures.splice(index, 1)
                          handleContentChange("features", newFeatures)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Feature Title - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                      <Input
                        value={feature.title?.ar || ""}
                        onChange={(e) => {
                          const newFeatures = [...(workingBlock.content?.features || [])]
                          newFeatures[index] = {
                            ...newFeatures[index],
                            title: { ...newFeatures[index].title, ar: e.target.value },
                          }
                          handleContentChange("features", newFeatures)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                      <Input
                        value={feature.title?.en || ""}
                        onChange={(e) => {
                          const newFeatures = [...(workingBlock.content?.features || [])]
                          newFeatures[index] = {
                            ...newFeatures[index],
                            title: { ...newFeatures[index].title, en: e.target.value },
                          }
                          handleContentChange("features", newFeatures)
                        }}
                      />
                    </div>

                    {/* Feature Description - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                      <Textarea
                        value={feature.description?.ar || ""}
                        onChange={(e) => {
                          const newFeatures = [...(workingBlock.content?.features || [])]
                          newFeatures[index] = {
                            ...newFeatures[index],
                            description: { ...newFeatures[index].description, ar: e.target.value },
                          }
                          handleContentChange("features", newFeatures)
                        }}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                      <Textarea
                        value={feature.description?.en || ""}
                        onChange={(e) => {
                          const newFeatures = [...(workingBlock.content?.features || [])]
                          newFeatures[index] = {
                            ...newFeatures[index],
                            description: { ...newFeatures[index].description, en: e.target.value },
                          }
                          handleContentChange("features", newFeatures)
                        }}
                        rows={2}
                      />
                    </div>

                    {/* Icon and Colors */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{lang === "ar" ? "أيقونة" : "Icon"}</Label>
                        <Input
                          value={feature.icon || ""}
                          onChange={(e) => {
                            const newFeatures = [...(workingBlock.content?.features || [])]
                            newFeatures[index] = { ...newFeatures[index], icon: e.target.value }
                            handleContentChange("features", newFeatures)
                          }}
                          placeholder="lucide-icon-name"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{lang === "ar" ? "لون الأيقونة" : "Icon Color"}</Label>
                        <Input
                          value={feature.iconColor || ""}
                          onChange={(e) => {
                            const newFeatures = [...(workingBlock.content?.features || [])]
                            newFeatures[index] = { ...newFeatures[index], iconColor: e.target.value }
                            handleContentChange("features", newFeatures)
                          }}
                          placeholder="text-blue-500"
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFeatures = [
                      ...(workingBlock.content?.features || []),
                      {
                        title: { ar: "", en: "" },
                        description: { ar: "", en: "" },
                        icon: "",
                        iconColor: "",
                      },
                    ]
                    handleContentChange("features", newFeatures)
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {lang === "ar" ? "إضافة ميزة" : "Add Feature"}
                </Button>

                {/* Text Section Settings */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold text-sm">{lang === "ar" ? "إعدادات القسم" : "Section Settings"}</h4>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "التخطيط" : "Layout"}</Label>
                    <select
                      value={workingBlock.content?.layout || "centered"}
                      onChange={(e) => handleContentChange("layout", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="centered">{lang === "ar" ? "في الوسط" : "Centered"}</option>
                      <option value="left">{lang === "ar" ? "يسار" : "Left"}</option>
                      <option value="right">{lang === "ar" ? "يمين" : "Right"}</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showFeatures"
                      checked={workingBlock.content?.showFeatures !== false}
                      onChange={(e) => handleContentChange("showFeatures", e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="showFeatures" className="text-xs">
                      {lang === "ar" ? "إظهار الميزات" : "Show Features"}
                    </Label>
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "لون الخلفية" : "Background Color"}</Label>
                    <Input
                      value={workingBlock.content?.backgroundColor || "bg-gradient-to-b from-white to-blue-50/30"}
                      onChange={(e) => handleContentChange("backgroundColor", e.target.value)}
                      placeholder="bg-gradient-to-b from-white to-blue-50/30"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "لون النص" : "Text Color"}</Label>
                    <Input
                      value={workingBlock.content?.textColor || "text-gray-900"}
                      onChange={(e) => handleContentChange("textColor", e.target.value)}
                      placeholder="text-gray-900"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "المسافة الداخلية" : "Padding"}</Label>
                    <Input
                      value={workingBlock.content?.padding || "py-20"}
                      onChange={(e) => handleContentChange("padding", e.target.value)}
                      placeholder="py-20"
                    />
                  </div>
                </div>

                {/* Feature Icon Settings */}
                {workingBlock.content?.features && workingBlock.content.features.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-semibold text-sm">
                      {lang === "ar" ? "إعدادات أيقونات الميزات" : "Feature Icon Settings"}
                    </h4>
                    {workingBlock.content.features.map((feature: any, index: number) => (
                      <Card key={index} className="p-4 space-y-3">
                        <h5 className="font-semibold text-xs">
                          {lang === "ar" ? `ميزة ${index + 1}` : `Feature ${index + 1}`}
                        </h5>

                        <div>
                          <Label className="text-xs">{lang === "ar" ? "الأيقونة" : "Icon"}</Label>
                          <Input
                            value={feature.icon || ""}
                            onChange={(e) => {
                              const newFeatures = [...(workingBlock.content?.features || [])]
                              newFeatures[index] = { ...newFeatures[index], icon: e.target.value }
                              handleContentChange("features", newFeatures)
                            }}
                            placeholder="BookOpen, Users, Award, etc."
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{lang === "ar" ? "لون الأيقونة" : "Icon Color"}</Label>
                          <Input
                            value={feature.iconColor || ""}
                            onChange={(e) => {
                              const newFeatures = [...(workingBlock.content?.features || [])]
                              newFeatures[index] = { ...newFeatures[index], iconColor: e.target.value }
                              handleContentChange("features", newFeatures)
                            }}
                            placeholder="blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">{lang === "ar" ? "تدرج من" : "Gradient From"}</Label>
                            <Input
                              value={feature.iconGradientFrom || ""}
                              onChange={(e) => {
                                const newFeatures = [...(workingBlock.content?.features || [])]
                                newFeatures[index] = { ...newFeatures[index], iconGradientFrom: e.target.value }
                                handleContentChange("features", newFeatures)
                              }}
                              placeholder="blue-500"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{lang === "ar" ? "تدرج إلى" : "Gradient To"}</Label>
                            <Input
                              value={feature.iconGradientTo || ""}
                              onChange={(e) => {
                                const newFeatures = [...(workingBlock.content?.features || [])]
                                newFeatures[index] = { ...newFeatures[index], iconGradientTo: e.target.value }
                                handleContentChange("features", newFeatures)
                              }}
                              placeholder="purple-600"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {block.type === "cards" && (
              <div className="space-y-6">
                {/* Section Title - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.en || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                {/* Cards */}
                <Label className="text-sm font-medium">{lang === "ar" ? "البطاقات" : "Cards"}</Label>

                {(workingBlock.content?.cards || []).map((card: any, index: number) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        {lang === "ar" ? `بطاقة ${index + 1}` : `Card ${index + 1}`}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards.splice(index, 1)
                          handleContentChange("cards", newCards)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Card Title - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                      <Input
                        value={card.title?.ar || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = {
                            ...newCards[index],
                            title: { ...newCards[index].title, ar: e.target.value },
                          }
                          handleContentChange("cards", newCards)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                      <Input
                        value={card.title?.en || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = {
                            ...newCards[index],
                            title: { ...newCards[index].title, en: e.target.value },
                          }
                          handleContentChange("cards", newCards)
                        }}
                      />
                    </div>

                    {/* Card Description - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                      <Textarea
                        value={card.description?.ar || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = {
                            ...newCards[index],
                            description: { ...newCards[index].description, ar: e.target.value },
                          }
                          handleContentChange("cards", newCards)
                        }}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                      <Textarea
                        value={card.description?.en || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = {
                            ...newCards[index],
                            description: { ...newCards[index].description, en: e.target.value },
                          }
                          handleContentChange("cards", newCards)
                        }}
                        rows={3}
                      />
                    </div>

                    {/* Category - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الفئة (عربي)" : "Category (Arabic)"}</Label>
                      <Input
                        value={card.category?.ar || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = {
                            ...newCards[index],
                            category: { ...newCards[index].category, ar: e.target.value },
                          }
                          handleContentChange("cards", newCards)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الفئة (إنجليزي)" : "Category (English)"}</Label>
                      <Input
                        value={card.category?.en || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = {
                            ...newCards[index],
                            category: { ...newCards[index].category, en: e.target.value },
                          }
                          handleContentChange("cards", newCards)
                        }}
                      />
                    </div>

                    {/* Image and Styling */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "صورة" : "Image"}</Label>
                      <ImageUpload
                        value={card.image || ""}
                        onChange={(url) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = { ...newCards[index], image: url }
                          handleContentChange("cards", newCards)
                        }}
                        language={lang}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">{lang === "ar" ? "لون البداية" : "Gradient From"}</Label>
                        <Input
                          value={card.gradientFrom || ""}
                          onChange={(e) => {
                            const newCards = [...(workingBlock.content?.cards || [])]
                            newCards[index] = { ...newCards[index], gradientFrom: e.target.value }
                            handleContentChange("cards", newCards)
                          }}
                          placeholder="from-blue-500"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{lang === "ar" ? "لون النهاية" : "Gradient To"}</Label>
                        <Input
                          value={card.gradientTo || ""}
                          onChange={(e) => {
                            const newCards = [...(workingBlock.content?.cards || [])]
                            newCards[index] = { ...newCards[index], gradientTo: e.target.value }
                            handleContentChange("cards", newCards)
                          }}
                          placeholder="to-cyan-500"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{lang === "ar" ? "لون الظل" : "Shadow Color"}</Label>
                        <Input
                          value={card.shadowColor || ""}
                          onChange={(e) => {
                            const newCards = [...(workingBlock.content?.cards || [])]
                            newCards[index] = { ...newCards[index], shadowColor: e.target.value }
                            handleContentChange("cards", newCards)
                          }}
                          placeholder="shadow-blue-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "رابط" : "Link"}</Label>
                      <Input
                        value={card.link || ""}
                        onChange={(e) => {
                          const newCards = [...(workingBlock.content?.cards || [])]
                          newCards[index] = { ...newCards[index], link: e.target.value }
                          handleContentChange("cards", newCards)
                        }}
                        placeholder="/departments/medical"
                      />
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCards = [
                      ...(workingBlock.content?.cards || []),
                      {
                        title: { ar: "", en: "" },
                        description: { ar: "", en: "" },
                        category: { ar: "", en: "" },
                        image: "",
                        gradientFrom: "",
                        gradientTo: "",
                        shadowColor: "",
                        link: "",
                      },
                    ]
                    handleContentChange("cards", newCards)
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {lang === "ar" ? "إضافة بطاقة" : "Add Card"}
                </Button>

                {/* Cards Section Settings */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold text-sm">{lang === "ar" ? "إعدادات البطاقات" : "Cards Settings"}</h4>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "عدد الأعمدة" : "Number of Columns"}</Label>
                    <select
                      value={workingBlock.content?.columns || 3}
                      onChange={(e) => handleContentChange("columns", Number.parseInt(e.target.value))}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "نمط البطاقة" : "Card Style"}</Label>
                    <select
                      value={workingBlock.content?.cardStyle || "hover-lift"}
                      onChange={(e) => handleContentChange("cardStyle", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="default">{lang === "ar" ? "افتراضي" : "Default"}</option>
                      <option value="hover-lift">{lang === "ar" ? "رفع عند التحويم" : "Hover Lift"}</option>
                      <option value="border">{lang === "ar" ? "إطار" : "Border"}</option>
                      <option value="shadow">{lang === "ar" ? "ظل" : "Shadow"}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showImages"
                        checked={workingBlock.content?.showImages !== false}
                        onChange={(e) => handleContentChange("showImages", e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showImages" className="text-xs">
                        {lang === "ar" ? "الصور" : "Images"}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showIcons"
                        checked={workingBlock.content?.showIcons !== false}
                        onChange={(e) => handleContentChange("showIcons", e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showIcons" className="text-xs">
                        {lang === "ar" ? "الأيقونات" : "Icons"}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showCategory"
                        checked={workingBlock.content?.showCategory !== false}
                        onChange={(e) => handleContentChange("showCategory", e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showCategory" className="text-xs">
                        {lang === "ar" ? "الفئة" : "Category"}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Card-specific styling */}
                {workingBlock.content?.cards && workingBlock.content.cards.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-semibold text-sm">{lang === "ar" ? "تنسيق البطاقات" : "Card Styling"}</h4>
                    {workingBlock.content.cards.map((card: any, index: number) => (
                      <Card key={index} className="p-4 space-y-3">
                        <h5 className="font-semibold text-xs">
                          {lang === "ar" ? `بطاقة ${index + 1}` : `Card ${index + 1}`}
                        </h5>

                        <div>
                          <Label className="text-xs">{lang === "ar" ? "الأيقونة" : "Icon"}</Label>
                          <Input
                            value={card.icon || ""}
                            onChange={(e) => {
                              const newCards = [...(workingBlock.content?.cards || [])]
                              newCards[index] = { ...newCards[index], icon: e.target.value }
                              handleContentChange("cards", newCards)
                            }}
                            placeholder="GraduationCap, Users, Award"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{lang === "ar" ? "لون الفئة" : "Category Color"}</Label>
                          <Input
                            value={card.categoryColor || ""}
                            onChange={(e) => {
                              const newCards = [...(workingBlock.content?.cards || [])]
                              newCards[index] = { ...newCards[index], categoryColor: e.target.value }
                              handleContentChange("cards", newCards)
                            }}
                            placeholder="blue-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">{lang === "ar" ? "تدرج من" : "Gradient From"}</Label>
                            <Input
                              value={card.gradientFrom || ""}
                              onChange={(e) => {
                                const newCards = [...(workingBlock.content?.cards || [])]
                                newCards[index] = { ...newCards[index], gradientFrom: e.target.value }
                                handleContentChange("cards", newCards)
                              }}
                              placeholder="blue-600"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{lang === "ar" ? "تدرج إلى" : "Gradient To"}</Label>
                            <Input
                              value={card.gradientTo || ""}
                              onChange={(e) => {
                                const newCards = [...(workingBlock.content?.cards || [])]
                                newCards[index] = { ...newCards[index], gradientTo: e.target.value }
                                handleContentChange("cards", newCards)
                              }}
                              placeholder="purple-600"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {block.type === "gallery" && (
              <div className="space-y-4">
                {/* Section Title - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.en || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                {/* Gallery Images */}
                <Label className="text-sm font-medium">{lang === "ar" ? "الصور" : "Images"}</Label>

                {(workingBlock.content?.images || []).map((img: any, index: number) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        {lang === "ar" ? `صورة ${index + 1}` : `Image ${index + 1}`}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newImages = [...(workingBlock.content?.images || [])]
                          newImages.splice(index, 1)
                          handleContentChange("images", newImages)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "رابط الصورة" : "Image URL"}</Label>
                      <ImageUpload
                        value={img.url || ""}
                        onChange={(url) => {
                          const newImages = [...(workingBlock.content?.images || [])]
                          newImages[index] = { ...newImages[index], url }
                          handleContentChange("images", newImages)
                        }}
                        language={lang}
                      />
                    </div>

                    {/* Alt Text - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "النص البديل (عربي)" : "Alt Text (Arabic)"}</Label>
                      <Input
                        value={img.alt?.ar || ""}
                        onChange={(e) => {
                          const newImages = [...(workingBlock.content?.images || [])]
                          newImages[index] = {
                            ...newImages[index],
                            alt: { ...newImages[index].alt, ar: e.target.value },
                          }
                          handleContentChange("images", newImages)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">
                        {lang === "ar" ? "النص البديل (إنجليزي)" : "Alt Text (English)"}
                      </Label>
                      <Input
                        value={img.alt?.en || ""}
                        onChange={(e) => {
                          const newImages = [...(workingBlock.content?.images || [])]
                          newImages[index] = {
                            ...newImages[index],
                            alt: { ...newImages[index].alt, en: e.target.value },
                          }
                          handleContentChange("images", newImages)
                        }}
                      />
                    </div>

                    {/* Category - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الفئة (عربي)" : "Category (Arabic)"}</Label>
                      <Input
                        value={img.category?.ar || ""}
                        onChange={(e) => {
                          const newImages = [...(workingBlock.content?.images || [])]
                          newImages[index] = {
                            ...newImages[index],
                            category: { ...newImages[index].category, ar: e.target.value },
                          }
                          handleContentChange("images", newImages)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الفئة (إنجليزي)" : "Category (English)"}</Label>
                      <Input
                        value={img.category?.en || ""}
                        onChange={(e) => {
                          const newImages = [...(workingBlock.content?.images || [])]
                          newImages[index] = {
                            ...newImages[index],
                            category: { ...newImages[index].category, en: e.target.value },
                          }
                          handleContentChange("images", newImages)
                        }}
                      />
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newImages = [
                      ...(workingBlock.content?.images || []),
                      {
                        url: "",
                        alt: { ar: "", en: "" },
                        category: { ar: "", en: "" },
                      },
                    ]
                    handleContentChange("images", newImages)
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {lang === "ar" ? "إضافة صورة" : "Add Image"}
                </Button>
              </div>
            )}

            {block.type === "testimonials" && (
              <div className="space-y-4">
                {/* Section Title - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.en || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                {/* Testimonials */}
                <Label className="text-sm font-medium">{lang === "ar" ? "الشهادات" : "Testimonials"}</Label>

                {(workingBlock.content?.testimonials || []).map((testimonial: any, index: number) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        {lang === "ar" ? `شهادة ${index + 1}` : `Testimonial ${index + 1}`}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials.splice(index, 1)
                          handleContentChange("testimonials", newTestimonials)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Name - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
                      <Input
                        value={testimonial.name?.ar || ""}
                        onChange={(e) => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials[index] = {
                            ...newTestimonials[index],
                            name: { ...newTestimonials[index].name, ar: e.target.value },
                          }
                          handleContentChange("testimonials", newTestimonials)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
                      <Input
                        value={testimonial.name?.en || ""}
                        onChange={(e) => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials[index] = {
                            ...newTestimonials[index],
                            name: { ...newTestimonials[index].name, en: e.target.value },
                          }
                          handleContentChange("testimonials", newTestimonials)
                        }}
                      />
                    </div>

                    {/* Role - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "المنصب (عربي)" : "Role (Arabic)"}</Label>
                      <Input
                        value={testimonial.role?.ar || ""}
                        onChange={(e) => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials[index] = {
                            ...newTestimonials[index],
                            role: { ...newTestimonials[index].role, ar: e.target.value },
                          }
                          handleContentChange("testimonials", newTestimonials)
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "المنصب (إنجليزي)" : "Role (English)"}</Label>
                      <Input
                        value={testimonial.role?.en || ""}
                        onChange={(e) => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials[index] = {
                            ...newTestimonials[index],
                            role: { ...newTestimonials[index].role, en: e.target.value },
                          }
                          handleContentChange("testimonials", newTestimonials)
                        }}
                      />
                    </div>

                    {/* Text - Both Languages */}
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "النص (عربي)" : "Text (Arabic)"}</Label>
                      <Textarea
                        value={testimonial.text?.ar || ""}
                        onChange={(e) => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials[index] = {
                            ...newTestimonials[index],
                            text: { ...newTestimonials[index].text, ar: e.target.value },
                          }
                          handleContentChange("testimonials", newTestimonials)
                        }}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">{lang === "ar" ? "النص (إنجليزي)" : "Text (English)"}</Label>
                      <Textarea
                        value={testimonial.text?.en || ""}
                        onChange={(e) => {
                          const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                          newTestimonials[index] = {
                            ...newTestimonials[index],
                            text: { ...newTestimonials[index].text, en: e.target.value },
                          }
                          handleContentChange("testimonials", newTestimonials)
                        }}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{lang === "ar" ? "صورة" : "Image"}</Label>
                        <ImageUpload
                          value={testimonial.image || ""}
                          onChange={(url) => {
                            const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                            newTestimonials[index] = { ...newTestimonials[index], image: url }
                            handleContentChange("testimonials", newTestimonials)
                          }}
                          language={lang}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{lang === "ar" ? "التقييم" : "Rating"}</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonial.rating || 5}
                          onChange={(e) => {
                            const newTestimonials = [...(workingBlock.content?.testimonials || [])]
                            newTestimonials[index] = { ...newTestimonials[index], rating: Number(e.target.value) }
                            handleContentChange("testimonials", newTestimonials)
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newTestimonials = [
                      ...(workingBlock.content?.testimonials || []),
                      {
                        name: { ar: "", en: "" },
                        role: { ar: "", en: "" },
                        text: { ar: "", en: "" },
                        image: "",
                        rating: 5,
                      },
                    ]
                    handleContentChange("testimonials", newTestimonials)
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {lang === "ar" ? "إضافة شهادة" : "Add Testimonial"}
                </Button>
              </div>
            )}

            {block.type === "cta" && (
              <div className="space-y-4">
                {/* Title - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">{lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                  <Input
                    value={workingBlock.content?.title?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("title", {
                        ...workingBlock.content?.title,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.title?.en || ""}
                    onChange={(e) => {
                      handleContentChange("title", {
                        ...workingBlock.content?.title,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                {/* Description - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                  </Label>
                  <Textarea
                    value={workingBlock.content?.description?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("description", {
                        ...workingBlock.content?.description,
                        ar: e.target.value,
                      })
                    }}
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
                  </Label>
                  <Textarea
                    value={workingBlock.content?.description?.en || ""}
                    onChange={(e) => {
                      handleContentChange("description", {
                        ...workingBlock.content?.description,
                        en: e.target.value,
                      })
                    }}
                    rows={3}
                  />
                </div>

                {/* Button Text - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "نص الزر (عربي)" : "Button Text (Arabic)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.buttonText?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("buttonText", {
                        ...workingBlock.content?.buttonText,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "نص الزر (إنجليزي)" : "Button Text (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.buttonText?.en || ""}
                    onChange={(e) => {
                      handleContentChange("buttonText", {
                        ...workingBlock.content?.buttonText,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">{lang === "ar" ? "رابط الزر" : "Button URL"}</Label>
                  <Input
                    value={workingBlock.content?.buttonUrl || ""}
                    onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">{lang === "ar" ? "صورة الخلفية" : "Background Image"}</Label>
                  <ImageUpload
                    value={workingBlock.content?.backgroundImage || ""}
                    onChange={(url) => handleContentChange("backgroundImage", url)}
                    language={lang}
                  />
                </div>
              </div>
            )}

            {/* Contact Block */}
            {block.type === "contact" && (
              <div className="space-y-4">
                {/* Section Title - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.sectionTitle?.en || ""}
                    onChange={(e) => {
                      handleContentChange("sectionTitle", {
                        ...workingBlock.content?.sectionTitle,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                {/* Description - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                  </Label>
                  <Textarea
                    value={workingBlock.content?.description?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("description", {
                        ...workingBlock.content?.description,
                        ar: e.target.value,
                      })
                    }}
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
                  </Label>
                  <Textarea
                    value={workingBlock.content?.description?.en || ""}
                    onChange={(e) => {
                      handleContentChange("description", {
                        ...workingBlock.content?.description,
                        en: e.target.value,
                      })
                    }}
                    rows={3}
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      value={workingBlock.content?.email || ""}
                      onChange={(e) => handleContentChange("email", e.target.value)}
                      placeholder="info@school.com"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">{lang === "ar" ? "الهاتف" : "Phone"}</Label>
                    <Input
                      value={workingBlock.content?.phone || ""}
                      onChange={(e) => handleContentChange("phone", e.target.value)}
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>
                </div>

                {/* Address - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">{lang === "ar" ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                  <Input
                    value={workingBlock.content?.address?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("address", {
                        ...workingBlock.content?.address,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "العنوان (إنجليزي)" : "Address (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.address?.en || ""}
                    onChange={(e) => {
                      handleContentChange("address", {
                        ...workingBlock.content?.address,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>

                {/* Hours - Both Languages */}
                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "ساعات العمل (عربي)" : "Hours (Arabic)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.hours?.ar || ""}
                    onChange={(e) => {
                      handleContentChange("hours", {
                        ...workingBlock.content?.hours,
                        ar: e.target.value,
                      })
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "ساعات العمل (إنجليزي)" : "Hours (English)"}
                  </Label>
                  <Input
                    value={workingBlock.content?.hours?.en || ""}
                    onChange={(e) => {
                      handleContentChange("hours", {
                        ...workingBlock.content?.hours,
                        en: e.target.value,
                      })
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="style" className="mt-4">
          {renderStyleTab()}
        </TabsContent>
      </Tabs>
    )
  }

  const renderBlock = (block: PageBlock, depth = 0) => {
    const lang = contentLanguage

    return (
      <Card key={block.id} className="p-4 mb-4" style={{ marginLeft: depth * 20 }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium capitalize text-sm">
              {blockTypes.find((t) => t.type === block.type)?.label || block.type}
            </span>
            {block.type === "row" && (
              <span className="text-xs text-muted-foreground">({block.children?.length || 0} items)</span>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, "up")}>
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, "down")}>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => duplicateBlock(block.id)}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingBlock(block)
                setTempBlockChanges(null)
              }}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground line-clamp-2">
          {lang === "ar"
            ? block.content?.textAr || block.content?.titleAr || block.content?.descriptionAr || "لا يوجد محتوى"
            : block.content?.textEn || block.content?.titleEn || block.content?.descriptionEn || "No content"}
        </div>

        {block.type === "row" && block.children && (
          <div className="mt-4 space-y-2">
            {block.children.map((child) => renderBlock(child, depth + 1))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveContainer({ blockId: block.id })
                setShowBlockModal(true)
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 ml-2" />
              {language === "ar" ? "إضافة عنصر للعمود" : "Add Block to Column"}
            </Button>
          </div>
        )}
      </Card>
    )
  }

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const renderBlockForPreview = (block: PageBlock, lang: "ar" | "en") => {
    const styleClasses = [
      block.styles?.backgroundColor || "",
      block.styles?.textColor || "",
      block.styles?.padding || "p-0",
      block.styles?.margin || "",
      block.styles?.borderRadius || "",
      block.styles?.borderWidth || "",
      block.styles?.borderColor || "",
      block.styles?.shadow || "",
      block.styles?.animation || "",
      block.styles?.animationDelay || "",
      block.styles?.animationDuration || "",
      block.styles?.hoverScale || "",
      block.styles?.hoverRotate || "",
      block.styles?.hoverTranslate || "",
      block.styles?.hoverShadow || "",
      block.styles?.textAlign || "",
      block.styles?.maxWidth || "",
      block.styles?.backdropBlur || "",
      block.styles?.opacity || "",
      block.styles?.gradientFrom || "",
      block.styles?.gradientVia || "",
      block.styles?.gradientTo || "",
      "transition-all duration-300",
    ]
      .filter(Boolean)
      .join(" ")

    if (block.type === "hero") {
      return <EditableHeroSlider slides={block.content?.slides || []} lang={lang} className={styleClasses} />
    }

    if (block.type === "text") {
      return (
        <EditableTextSection
          badge={block.content?.badge}
          title={block.content?.title}
          description={block.content?.description}
          features={block.content?.features}
          lang={lang}
          className={styleClasses}
        />
      )
    }

    if (block.type === "cards") {
      return (
        <EditableCardsSection
          cards={block.content?.cards || []}
          sectionTitle={block.content?.sectionTitle}
          subtitle={block.content?.subtitle}
          columns={block.content?.columns || 3}
          lang={lang}
          className={styleClasses}
        />
      )
    }

    // Original block types (heading, paragraph, image, etc.)
    switch (block.type) {
      case "heading":
        const HeadingTag = (block.content.headingLevel || "h2") as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={block.id} className={`font-bold ${styleClasses}`}>
            {lang === "ar" ? block.content?.textAr : block.content?.textEn}
          </HeadingTag>
        )

      case "paragraph":
        return (
          <p key={block.id} className={`text-base ${styleClasses}`}>
            {lang === "ar" ? block.content?.textAr : block.content?.textEn}
          </p>
        )

      case "image":
        return block.content?.imageUrl ? (
          <div key={block.id} className={styleClasses}>
            <img
              src={block.content.imageUrl || "/placeholder.svg"}
              alt={block.content.altText || ""}
              className="w-full h-auto rounded-lg"
            />
          </div>
        ) : null

      case "video":
        return block.content?.videoUrl ? (
          <div key={block.id} className={styleClasses}>
            <AspectRatio ratio={16 / 9}>
              <iframe src={block.content.videoUrl} className="w-full h-full rounded-lg" allowFullScreen />
            </AspectRatio>
          </div>
        ) : null

      case "quote":
        return (
          <blockquote key={block.id} className={`border-l-4 border-primary pl-4 italic ${styleClasses}`}>
            <p>{lang === "ar" ? block.content?.textAr : block.content?.textEn}</p>
            {(block.content?.authorAr || block.content?.authorEn) && (
              <footer className="text-sm text-muted-foreground mt-2">
                — {lang === "ar" ? block.content?.authorAr : block.content?.authorEn}
              </footer>
            )}
          </blockquote>
        )

      case "button":
        return (
          <div key={block.id} className={styleClasses}>
            <Button asChild>
              <a href={block.content?.buttonUrl || "#"}>
                {lang === "ar" ? block.content?.buttonTextAr : block.content?.buttonTextEn}
              </a>
            </Button>
          </div>
        )

      case "divider":
        return (
          <hr
            key={block.id}
            className={`my-4 ${
              block.content?.dividerStyle === "dashed"
                ? "border-dashed"
                : block.content?.dividerStyle === "dotted"
                  ? "border-dotted"
                  : ""
            } ${styleClasses}`}
          />
        )

      case "spacer":
        return <div key={block.id} style={{ height: `${block.content?.height || 20}px` }} className={styleClasses} />

      case "card":
        return (
          <Card key={block.id} className={`p-6 ${styleClasses}`}>
            {block.content?.imageUrl && (
              <img
                src={block.content.imageUrl || "/placeholder.svg"}
                alt=""
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {(block.content?.titleAr || block.content?.titleEn) && (
              <h3 className="text-xl font-bold mb-2">
                {lang === "ar" ? block.content?.titleAr : block.content?.titleEn}
              </h3>
            )}
            {(block.content?.descriptionAr || block.content?.descriptionEn) && (
              <p className="text-muted-foreground mb-4">
                {lang === "ar" ? block.content?.descriptionAr : block.content?.descriptionEn}
              </p>
            )}
            {block.content?.buttonUrl && (
              <Button asChild>
                <a href={block.content?.buttonUrl}>
                  {lang === "ar" ? block.content?.buttonTextAr : block.content?.buttonTextEn || "اقرأ المزيد"}
                </a>
              </Button>
            )}
          </Card>
        )

      case "html":
        return block.content?.html ? (
          <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content.html }} className={styleClasses} />
        ) : null

      case "row":
        return block.children && block.children.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${styleClasses}`}>
            {block.children.map((child) => renderBlockForPreview(child, lang))}
          </div>
        ) : null

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{language === "ar" ? "تعديل الصفحة" : "Edit Page"}</h1>
          <p className="text-muted-foreground">{language === "ar" ? "عدّل محتوى صفحتك" : "Edit your page content"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewToggle}>
            {isPreviewMode
              ? language === "ar"
                ? "وضع التحرير"
                : "Edit Mode"
              : language === "ar"
                ? "معاينة"
                : "Preview"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard?section=pages")}>
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (language === "ar" ? "جاري الحفظ..." : "Saving...") : language === "ar" ? "حفظ" : "Save"}
          </Button>
        </div>
      </div>

      {!isPreviewMode ? (
        <div className="grid grid-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Info Card */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{language === "ar" ? "معلومات الصفحة" : "Page Information"}</h2>
              <div className="space-y-4">
                <div>
                  <Label>
                    {language === "ar" ? "عنوان الصفحة (عربي)" : "Page Title (Arabic)"}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={pageData.titleAr}
                    onChange={(e) => setPageData({ ...pageData, titleAr: e.target.value })}
                    placeholder={language === "ar" ? "أدخل العنوان بالعربية" : "Enter title in Arabic"}
                  />
                </div>
                <div>
                  <Label>
                    {language === "ar" ? "عنوان الصفحة (إنجليزي)" : "Page Title (English)"}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={pageData.titleEn}
                    onChange={(e) => setPageData({ ...pageData, titleEn: e.target.value })}
                    placeholder={language === "ar" ? "أدخل العنوان بالإنجليزية" : "Enter title in English"}
                  />
                </div>
                <div>
                  <Label>
                    {language === "ar" ? "رابط الصفحة (Slug)" : "Page Slug"}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={pageData.slug}
                    onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                    placeholder={language === "ar" ? "مثال: about-us" : "Example: about-us"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "وصف الصفحة (عربي)" : "Page Description (Arabic)"}</Label>
                  <Textarea
                    value={pageData.descriptionAr}
                    onChange={(e) => setPageData({ ...pageData, descriptionAr: e.target.value })}
                    rows={3}
                    placeholder={language === "ar" ? "وصف مختصر للصفحة" : "Brief description of the page"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "وصف الصفحة (إنجليزي)" : "Page Description (English)"}</Label>
                  <Textarea
                    value={pageData.descriptionEn}
                    onChange={(e) => setPageData({ ...pageData, descriptionEn: e.target.value })}
                    rows={3}
                    placeholder={language === "ar" ? "وصف مختصر للصفحة" : "Brief description of the page"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "صورة مميزة" : "Featured Image"}</Label>
                  <ImageUpload
                    value={pageData.featuredImage}
                    onChange={(url) => setPageData({ ...pageData, featuredImage: url })}
                    language={language}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={pageData.isPublished}
                    onChange={(e) => setPageData({ ...pageData, isPublished: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isPublished">{language === "ar" ? "منشور" : "Published"}</Label>
                </div>
              </div>
            </Card>

            {/* Content Blocks Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{language === "ar" ? "كتل المحتوى" : "Content Blocks"}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContentLanguage(contentLanguage === "ar" ? "en" : "ar")}
                  >
                    {contentLanguage === "ar" ? "AR" : "EN"}
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveContainer(null)
                      setShowBlockModal(true)
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {language === "ar" ? "إضافة كتلة" : "Add Block"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {blocks.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {language === "ar"
                      ? "لا توجد كتل محتوى. ابدأ بإضافة كتلة جديدة."
                      : "No content blocks. Start by adding a new block."}
                  </div>
                ) : (
                  blocks.map((block) => renderBlock(block))
                )}
              </div>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{language === "ar" ? "إعدادات SEO" : "SEO Settings"}</h2>
              <div className="space-y-4">
                <div>
                  <Label>{language === "ar" ? "وصف SEO (عربي)" : "SEO Description (Arabic)"}</Label>
                  <Textarea
                    value={pageData.seoDescriptionAr}
                    onChange={(e) => setPageData({ ...pageData, seoDescriptionAr: e.target.value })}
                    rows={3}
                    placeholder={language === "ar" ? "وصف للصفحة في محركات البحث" : "Description for search engines"}
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "وصف SEO (إنجليزي)" : "SEO Description (English)"}</Label>
                  <Textarea
                    value={pageData.seoDescriptionEn}
                    onChange={(e) => setPageData({ ...pageData, seoDescriptionEn: e.target.value })}
                    rows={3}
                    placeholder={language === "ar" ? "وصف للصفحة في محركات البحث" : "Description for search engines"}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        // Preview Mode
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">{language === "ar" ? "معاينة" : "Preview"}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContentLanguage(contentLanguage === "ar" ? "en" : "ar")}
            >
              {contentLanguage === "ar" ? "AR" : "EN"}
            </Button>
          </div>

          {pageData.featuredImage && (
            <img
              src={pageData.featuredImage || "/placeholder.svg"}
              alt=""
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{contentLanguage === "ar" ? pageData.titleAr : pageData.titleEn}</h1>

          <p className="text-lg text-muted-foreground mb-8">
            {contentLanguage === "ar" ? pageData.descriptionAr : pageData.descriptionEn}
          </p>

          <div className="space-y-6">{blocks.map((block) => renderBlockForPreview(block, contentLanguage))}</div>
        </Card>
      )}

      {/* Add Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{language === "ar" ? "إضافة كتلة جديدة" : "Add New Block"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowBlockModal(false)}>
                <span className="text-xl">×</span>
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "ar" ? "عناصر أساسية" : "Basic Elements"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {basicBlocks.map((blockType) => (
                    <Button
                      key={blockType.type}
                      variant="outline"
                      className="flex items-center justify-start gap-2 h-auto py-3 bg-transparent"
                      onClick={() =>
                        addBlock(
                          blockType.type as PageBlock["type"],
                          activeContainer?.blockId,
                          activeContainer?.columnIndex,
                        )
                      }
                    >
                      <blockType.icon className="w-4 h-4" />
                      <span className="text-sm">{blockType.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "ar" ? "تخطيط" : "Layout"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {layoutBlocks.map((blockType) => (
                    <Button
                      key={blockType.type}
                      variant="outline"
                      className="flex items-center justify-start gap-2 h-auto py-3 bg-transparent"
                      onClick={() =>
                        addBlock(
                          blockType.type as PageBlock["type"],
                          activeContainer?.blockId,
                          activeContainer?.columnIndex,
                        )
                      }
                    >
                      <blockType.icon className="w-4 h-4" />
                      <span className="text-sm">{blockType.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "ar" ? "مكونات" : "Components"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {componentBlocks.map((blockType) => (
                    <Button
                      key={blockType.type}
                      variant="outline"
                      className="flex items-center justify-start gap-2 h-auto py-3 bg-transparent"
                      onClick={() =>
                        addBlock(
                          blockType.type as PageBlock["type"],
                          activeContainer?.blockId,
                          activeContainer?.columnIndex,
                        )
                      }
                    >
                      <blockType.icon className="w-4 h-4" />
                      <span className="text-sm">{blockType.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "ar" ? "صفحات رئيسية" : "Homepage Blocks"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {homepageBlocks.map((blockType) => (
                    <Button
                      key={blockType.type}
                      variant="outline"
                      className="flex items-center justify-start gap-2 h-auto py-3 bg-transparent"
                      onClick={() =>
                        addBlock(
                          blockType.type as PageBlock["type"],
                          activeContainer?.blockId,
                          activeContainer?.columnIndex,
                        )
                      }
                    >
                      <blockType.icon className="w-4 h-4" />
                      <span className="text-sm">{blockType.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Block Settings Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{language === "ar" ? "إعدادات الكتلة" : "Block Settings"}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingBlock(null)
                  setTempBlockChanges(null)
                }}
              >
                <span className="text-xl">×</span>
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex gap-2">
                <Button
                  variant={contentLanguage === "ar" ? "default" : "outline"}
                  onClick={() => setContentLanguage("ar")}
                  size="sm"
                >
                  {language === "ar" ? "عربي" : "Arabic"}
                </Button>
                <Button
                  variant={contentLanguage === "en" ? "default" : "outline"}
                  onClick={() => setContentLanguage("en")}
                  size="sm"
                >
                  {language === "ar" ? "إنجليزي" : "English"}
                </Button>
              </div>
            </div>

            {renderBlockSettings(editingBlock)}

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => {
                  if (tempBlockChanges) {
                    updateBlock(editingBlock.id, tempBlockChanges.content || {}, tempBlockChanges.styles)
                  }
                  setEditingBlock(null)
                  setTempBlockChanges(null)
                }}
                className="flex-1"
              >
                {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingBlock(null)
                  setTempBlockChanges(null)
                }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
