"use client"
import { useState } from "react"
import type { JSX } from "react"
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
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { EditableHeroSlider } from "@/components/editable/editable-hero-slider"
import { EditableTextSection } from "@/components/editable/editable-text-section"
import { EditableCardsSection } from "@/components/editable/editable-cards-section"

export default function NewPageEditor() {
  const router = useRouter()
  const { language } = useLanguage()
  const { toast } = useToast()

  const [contentLanguage, setContentLanguage] = useState<"ar" | "en">("ar")
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null)
  const [tempBlockChanges, setTempBlockChanges] = useState<Partial<PageBlock> | null>(null)
  const [activeContainer, setActiveContainer] = useState<{ blockId: string; columnIndex?: number } | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
    // Adding new block types for home page
    { type: "hero", icon: Presentation, label: "Hero", category: "home" },
    { type: "text", icon: Type, label: "Text Section", category: "home" },
    { type: "cards", icon: Building2, label: "Cards Section", category: "home" },
  ]

  const copyContent = (from: "ar" | "en", to: "ar" | "en") => {
    const updatedBlocks = blocks.map((block) => {
      const newContent = { ...block.content }

      if (from === "ar" && to === "en") {
        if (block.content.textAr) newContent.textEn = block.content.textAr
        if (block.content.quoteAr) newContent.quoteEn = block.content.quoteAr
        if (block.content.authorAr) newContent.authorEn = block.content.authorAr
        if (block.content.buttonTextAr) newContent.buttonTextEn = block.content.buttonTextAr
        if (block.content.titleAr) newContent.titleEn = block.content.titleAr
        if (block.content.subtitleAr) newContent.subtitleEn = block.content.subtitleAr
        if (block.content.descriptionAr) newContent.descriptionEn = block.content.descriptionAr
        if (block.content.labelAr) newContent.labelEn = block.content.labelAr
        if (block.content.captionAr) newContent.captionAr = block.content.captionAr
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

  const deleteBlock = (id: string, parentId?: string) => {
    if (parentId) {
      setBlocks(
        blocks.map((block) => {
          if (block.id === parentId) {
            return { ...block, children: (block.children || []).filter((child) => child.id !== id) }
          }
          if (block.children) {
            return { ...block, children: deleteBlockFromNestedChildren(block.children, id) }
          }
          return block
        }),
      )
    } else {
      setBlocks(blocks.filter((block) => block.id !== id))
    }
  }

  const deleteBlockFromNestedChildren = (blockList: PageBlock[], id: string): PageBlock[] => {
    return blockList.filter((block) => {
      if (block.id === id) return false
      if (block.children) {
        block.children = deleteBlockFromNestedChildren(block.children, id)
      }
      return true
    })
  }

  const moveBlock = (id: string, direction: "up" | "down", parentId?: string) => {
    const moveInList = (blockList: PageBlock[]) => {
      const index = blockList.findIndex((block) => block.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === blockList.length - 1)) {
        return blockList
      }

      const newBlocks = [...blockList]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]

      newBlocks.forEach((block, i) => {
        block.order = i
      })

      return newBlocks
    }

    if (parentId) {
      setBlocks(
        blocks.map((block) => {
          if (block.id === parentId) {
            return { ...block, children: moveInList(block.children || []) }
          }
          if (block.children) {
            return { ...block, children: moveBlockInNestedChildren(block.children, id, direction) }
          }
          return block
        }),
      )
    } else {
      setBlocks(moveInList(blocks))
    }
  }

  const moveBlockInNestedChildren = (blockList: PageBlock[], id: string, direction: "up" | "down"): PageBlock[] => {
    return blockList.map((block) => {
      if (block.id === id) {
        const index = blockList.findIndex((b) => b.id === id)
        if ((direction === "up" && index === 0) || (direction === "down" && index === blockList.length - 1)) {
          return block
        }
        const newBlocks = [...blockList]
        const targetIndex = direction === "up" ? index - 1 : index + 1
        ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
        newBlocks.forEach((b, i) => {
          b.order = i
        })
        return { ...block, children: newBlocks }
      }
      if (block.children) {
        block.children = moveBlockInNestedChildren(block.children, id, direction)
      }
      return block
    })
  }

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
    console.log("[v0] Attempting to save new page to Firebase...")
    try {
      const savedPage = await saveDynamicPage({
        ...pageData,
        contentAr: "",
        contentEn: "",
        blocks,
      })

      console.log("[v0] New page successfully saved to Firebase:", savedPage.id)

      toast({
        title: language === "ar" ? "تم الحفظ" : "Saved",
        description: language === "ar" ? "تم حفظ الصفحة بنجاح" : "Page saved successfully",
      })

      router.push(`/dashboard/pages/edit/${savedPage.id}`)
    } catch (error) {
      console.error("[v0] Error saving new page to Firebase:", error)
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في حفظ الصفحة" : "Failed to save page",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const basicBlocks = blockTypes.filter((b) => b.category === "basic")
  const layoutBlocks = blockTypes.filter((b) => b.category === "layout")
  const componentBlocks = blockTypes.filter((b) => b.category === "components")
  const homeBlocks = blockTypes.filter((b) => b.category === "home") // Filter for home blocks

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const handleContainerAdd = (type: PageBlock["type"], container: { blockId: string; columnIndex?: number } | null) => {
    const newBlock: PageBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content: {},
      styles: {},
      ...(type === "row" && { children: [] }),
    }

    if (container) {
      setBlocks((prevBlocks) => handleNestedContainerAdd(prevBlocks, type, container))
    } else {
      newBlock.order = blocks.length
      setBlocks((prevBlocks) => [...prevBlocks, newBlock])
    }

    setShowBlockMenu(false)
    setEditingBlock(newBlock)
    setActiveContainer(null)
  }

  const handleNestedContainerAdd = (
    blockList: PageBlock[],
    type: PageBlock["type"],
    container: { blockId: string; columnIndex?: number } | null,
  ): PageBlock[] => {
    if (!container) return blockList

    return blockList.map((block) => {
      if (block.id === container.blockId) {
        const children = block.children || []
        const newBlock: PageBlock = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type,
          order: container.columnIndex !== undefined ? container.columnIndex : children.length,
          content: {},
          styles: {},
          ...(type === "row" && { children: [] }),
        }
        return { ...block, children: [...children, newBlock] }
      }
      if (block.children) {
        return { ...block, children: handleNestedContainerAdd(block.children, type, container) }
      }
      return block
    })
  }

  const getBlockPreview = (block: PageBlock) => {
    const text = contentLanguage === "ar" ? block.content.textAr : block.content.textEn
    const quote = contentLanguage === "ar" ? block.content.quoteAr : block.content.quoteEn
    const buttonText = contentLanguage === "ar" ? block.content.buttonTextAr : block.content.buttonTextEn
    const title = contentLanguage === "ar" ? block.content.titleAr : block.content.titleEn
    const subtitle = contentLanguage === "ar" ? block.content.subtitleAr : block.content.subtitleEn
    const description = contentLanguage === "ar" ? block.content.descriptionAr : block.content.descriptionEn

    switch (block.type) {
      case "hero":
        return <EditableHeroSlider slides={block.content.slides || []} language={contentLanguage} />

      case "text":
        return (
          <EditableTextSection
            title={block.content.title || {}}
            subtitle={block.content.subtitle || {}}
            description={block.content.description || {}}
            features={block.content.features || []}
            language={contentLanguage}
            styles={block.styles}
          />
        )

      case "cards":
        return (
          <EditableCardsSection
            title={block.content.title || {}}
            subtitle={block.content.subtitle || {}}
            cards={block.content.cards || []}
            language={contentLanguage}
            styles={block.styles}
          />
        )

      case "gallery":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="w-4 h-4" />
            {language === "ar" ? "معرض صور" : "Gallery"} ({block.content.images?.length || 0}{" "}
            {language === "ar" ? "صور" : "images"})
          </div>
        )

      case "testimonials":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            {language === "ar" ? "شهادات" : "Testimonials"} ({block.content.testimonials?.length || 0}{" "}
            {language === "ar" ? "عناصر" : "items"})
          </div>
        )

      case "cta":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            {language === "ar" ? "دعوة لإجراء" : "Call-to-Action"}
          </div>
        )

      case "contact":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            {language === "ar" ? "اتصل بنا" : "Contact"}
          </div>
        )

      case "heading":
        return <div className="font-bold text-lg">{text || (language === "ar" ? "عنوان" : "Heading")}</div>
      case "paragraph":
        return <div className="text-sm text-muted-foreground">{text || (language === "ar" ? "فقرة" : "Paragraph")}</div>
      case "image":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            {block.content.imageUrl || (language === "ar" ? "صورة" : "Image")}
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
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm">{title || (language === "ar" ? "بطاقة" : "Card")}</div>
            {description && <div className="text-xs text-muted-foreground line-clamp-2">{description}</div>}
          </div>
        )
      case "icon-box":
        return (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">{title || (language === "ar" ? "صندوق أيقونة" : "Icon Box")}</div>
              {description && <div className="text-xs text-muted-foreground line-clamp-1">{description}</div>}
            </div>
          </div>
        )
      case "hero-slider":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Presentation className="w-4 h-4" />
            {language === "ar" ? "سلايدر رئيسي" : "Hero Slider"} ({block.content.slides?.length || 0}{" "}
            {language === "ar" ? "شرائح" : "slides"})
          </div>
        )
      case "statistics":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            {language === "ar" ? "إحصائيات" : "Statistics"} ({block.content.stats?.length || 0}{" "}
            {language === "ar" ? "عناصر" : "items"})
          </div>
        )
      case "features":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4" />
            {language === "ar" ? "مميزات" : "Features"} ({block.content.features?.length || 0}{" "}
            {language === "ar" ? "عناصر" : "items"})
          </div>
        )
      case "accordion":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            {language === "ar" ? "أكورديون" : "Accordion"} ({block.content.items?.length || 0}{" "}
            {language === "ar" ? "عناصر" : "items"})
          </div>
        )
      case "tabs":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Columns className="w-4 h-4" />
            {language === "ar" ? "تبويبات" : "Tabs"} ({block.content.tabs?.length || 0}{" "}
            {language === "ar" ? "عناصر" : "items"})
          </div>
        )
      case "alert":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            {title || (language === "ar" ? "تنبيه" : "Alert")} - {block.content.alertType || "info"}
          </div>
        )
      case "testimonial-card":
        return (
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">{block.content.name || (language === "ar" ? "شهادة" : "Testimonial")}</div>
              {block.content.position && <div className="text-xs text-muted-foreground">{block.content.position}</div>}
            </div>
          </div>
        )
      case "team-member":
        return (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">
                {block.content.name || (language === "ar" ? "عضو فريق" : "Team Member")}
              </div>
              {block.content.position && <div className="text-xs text-muted-foreground">{block.content.position}</div>}
            </div>
          </div>
        )
      case "pricing-card":
        return (
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">{title || (language === "ar" ? "بطاقة سعر" : "Pricing")}</div>
              <div className="text-xs text-muted-foreground">
                {block.content.currency || "$"}
                {block.content.price || "0"}
              </div>
            </div>
          </div>
        )
      case "cta":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            {language === "ar" ? "دعوة لإجراء" : "Call-to-Action"}
          </div>
        )
      case "form":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            {title || (language === "ar" ? "نموذج" : "Form")}
          </div>
        )
      case "map":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            {title || (language === "ar" ? "خريطة" : "Map")}
          </div>
        )
      case "social-links":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LinkIcon className="w-4 h-4" />
            {language === "ar" ? "روابط اجتماعية" : "Social Links"} ({block.content.links?.length || 0}{" "}
            {language === "ar" ? "روابط" : "links"})
          </div>
        )
      default:
        return <div className="text-sm text-muted-foreground">{block.type}</div>
    }
  }

  const duplicateBlock = (blockToDuplicate: PageBlock) => {
    const duplicate: PageBlock = JSON.parse(JSON.stringify(blockToDuplicate))
    duplicate.id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    if (duplicate.type === "row" && duplicate.children) {
      duplicate.children = duplicate.children.map((child) => {
        const clonedChild: PageBlock = JSON.parse(JSON.stringify(child))
        clonedChild.id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        return clonedChild
      })
    }

    const parentId = undefined

    if (parentId) {
      setBlocks((prevBlocks) =>
        prevBlocks.map((b) => {
          if (b.id === parentId) {
            const children = b.children || []
            duplicate.order = children.length
            return { ...b, children: [...children, duplicate] }
          }
          if (b.children) {
            return { ...b, children: cloneNestedChildren(b.children, duplicate) }
          }
          return b
        }),
      )
    } else {
      duplicate.order = blocks.length
      setBlocks((prevBlocks) => [...prevBlocks, duplicate])
    }
  }

  const renderBlockItem = (block: PageBlock, parentId?: string, depth = 0) => {
    const isRow = block.type === "row"
    const columns = block.content.columns || 2

    return (
      <div key={block.id} className={`${depth > 0 ? "ml-4 mt-2" : ""}`}>
        <div
          className={`p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors ${isRow ? "bg-muted/30 border-dashed" : ""}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">{getBlockPreview(block)}</div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => moveBlock(block.id, "up", parentId)}
                size="icon"
                variant="ghost"
                disabled={block.order === 0}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button onClick={() => moveBlock(block.id, "down", parentId)} size="icon" variant="ghost">
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button onClick={() => setEditingBlock(block)} size="icon" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
              <Button onClick={() => duplicateBlock(block)} size="icon" variant="ghost">
                <Copy className="w-4 h-4" />
              </Button>
              <Button onClick={() => deleteBlock(block.id, parentId)} size="icon" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isRow && (
            <div className="mt-4 space-y-2">
              <div className={`grid grid-cols-${columns} gap-4`}>
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const childrenInColumn = (block.children || []).filter((child) => child.order === colIndex)
                  return (
                    <div key={colIndex} className="border-2 border-dashed border-muted rounded-lg p-3 min-h-[100px]">
                      <div className="text-xs text-muted-foreground mb-2">
                        {language === "ar" ? `عمود ${colIndex + 1}` : `Column ${colIndex + 1}`}
                      </div>
                      {childrenInColumn.map((child) => renderBlockItem(child, block.id, depth + 1))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 bg-transparent"
                        onClick={() => {
                          setShowBlockModal(true)
                          setActiveContainer({ blockId: block.id, columnIndex: colIndex })
                        }}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        {language === "ar" ? "إضافة محتوى" : "Add Content"}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const cloneNestedChildren = (children: PageBlock[], blockToClone: PageBlock): PageBlock[] => {
    return children.map((child) => {
      if (child.id === blockToClone.id) {
        const clonedChild: PageBlock = JSON.parse(JSON.stringify(blockToClone))
        clonedChild.id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        if (clonedChild.type === "row" && clonedChild.children) {
          clonedChild.children = cloneNestedChildren(clonedChild.children, blockToClone)
        }
        return clonedChild
      }
      if (child.children) {
        return { ...child, children: cloneNestedChildren(child.children, blockToClone) }
      }
      return child
    })
  }

  const renderBlockForPreview = (block: PageBlock, language: "ar" | "en") => {
    const text = language === "ar" ? block.content.textAr : block.content.textEn
    const quote = language === "ar" ? block.content.quoteAr : block.content.quoteEn
    const buttonText = language === "ar" ? block.content.buttonTextAr : block.content.buttonTextEn
    const title = language === "ar" ? block.content.titleAr : block.content.titleEn
    const subtitle = language === "ar" ? block.content.subtitleAr : block.content.subtitleEn
    const description = language === "ar" ? block.content.descriptionAr : block.content.descriptionEn
    const author = language === "ar" ? block.content.authorAr : block.content.authorEn

    const blockStyles = block.styles || {}
    const combinedStyleClasses = [
      blockStyles.backgroundColor,
      blockStyles.textColor,
      blockStyles.gradientFrom,
      blockStyles.gradientVia,
      blockStyles.gradientTo,
      blockStyles.padding,
      blockStyles.margin,
      blockStyles.borderRadius,
      blockStyles.borderWidth,
      blockStyles.borderColor,
      blockStyles.shadow,
      blockStyles.animation,
      blockStyles.animationDelay,
      blockStyles.animationDuration,
      blockStyles.hoverScale,
      blockStyles.hoverRotate,
      blockStyles.hoverTranslate,
      blockStyles.hoverShadow,
      blockStyles.textAlign,
      blockStyles.maxWidth,
      blockStyles.backdropBlur,
      blockStyles.opacity,
    ]
      .filter(Boolean)
      .join(" ")

    switch (block.type) {
      // Rendering editable components
      case "hero":
        return <EditableHeroSlider slides={block.content.slides || []} language={contentLanguage} />

      case "text":
        return (
          <EditableTextSection
            title={block.content.title || {}}
            subtitle={block.content.subtitle || {}}
            description={block.content.description || {}}
            features={block.content.features || []}
            language={contentLanguage}
            styles={block.styles}
          />
        )

      case "cards":
        return (
          <EditableCardsSection
            title={block.content.title || {}}
            subtitle={block.content.subtitle || {}}
            cards={block.content.cards || []}
            language={contentLanguage}
            styles={block.styles}
          />
        )

      case "heading":
        const HeadingTag = (block.content.headingLevel || "h2") as keyof JSX.IntrinsicElements
        return (
          <HeadingTag
            key={block.id}
            className={`font-bold text-2xl md:text-3xl lg:text-4xl mb-4 ${combinedStyleClasses}`}
          >
            {text || (language === "ar" ? "عنوان" : "Heading")}
          </HeadingTag>
        )

      case "paragraph":
        return (
          <p key={block.id} className={`text-base leading-relaxed text-muted-foreground mb-4 ${combinedStyleClasses}`}>
            {text || (language === "ar" ? "فقرة نصية" : "Paragraph text")}
          </p>
        )

      case "image":
        return block.content.imageUrl ? (
          <div key={block.id} className={`my-6 ${combinedStyleClasses}`}>
            <img
              src={block.content.imageUrl || "/placeholder.svg"}
              alt={block.content.altText || ""}
              className="w-full h-auto rounded-lg shadow-md"
            />
            {block.content.altText && (
              <p className="text-sm text-center text-muted-foreground mt-2">{block.content.altText}</p>
            )}
          </div>
        ) : (
          <div
            key={block.id}
            className={`w-full h-64 bg-muted rounded-lg flex items-center justify-center my-6 ${combinedStyleClasses}`}
          >
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )

      case "gallery":
        return (
          <div
            key={block.id}
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 ${combinedStyleClasses}`}
          >
            {(block.content.images || []).map((img: string, idx: number) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden shadow-md">
                <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )

      case "video":
        return block.content.videoUrl ? (
          <div key={block.id} className={`my-6 ${combinedStyleClasses}`}>
            {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
              <iframe src={block.content.videoUrl} className="w-full h-full" allowFullScreen title={title || "Video"} />
            </AspectRatio>
          </div>
        ) : null

      case "quote":
        return (
          <blockquote
            key={block.id}
            className={`border-l-4 border-primary pl-6 py-4 my-6 italic text-lg ${combinedStyleClasses}`}
          >
            <p className="mb-2">"{quote || text || (language === "ar" ? "اقتباس" : "Quote")}"</p>
            {author && <footer className="text-sm text-muted-foreground font-normal not-italic">— {author}</footer>}
          </blockquote>
        )

      case "button":
        return (
          <div key={block.id} className={`my-6 ${combinedStyleClasses}`}>
            <Button asChild size="lg">
              <a href={block.content.buttonUrl || "#"}>{buttonText || (language === "ar" ? "زر" : "Button")}</a>
            </Button>
          </div>
        )

      case "divider":
        const dividerClass =
          block.content.dividerStyle === "dashed"
            ? "border-dashed"
            : block.content.dividerStyle === "dotted"
              ? "border-dotted"
              : ""
        return <hr key={block.id} className={`my-8 border-t ${dividerClass} ${combinedStyleClasses}`} />

      case "spacer":
        return (
          <div
            key={block.id}
            className={`${combinedStyleClasses}`}
            style={{ height: `${block.content.height || 20}px` }}
          />
        )

      case "html":
        return block.content.html ? (
          <div
            key={block.id}
            className={`my-6 ${combinedStyleClasses}`}
            dangerouslySetInnerHTML={{ __html: block.content.html }}
          />
        ) : null

      case "row":
        const columns = block.content.columns || 2
        return block.children && block.children.length > 0 ? (
          <div key={block.id} className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 my-6 ${combinedStyleClasses}`}>
            {block.children.map((child) => (
              <div key={child.id}>{renderBlockForPreview(child, language)}</div>
            ))}
          </div>
        ) : null

      case "card":
        return (
          <Card key={block.id} className={`p-6 my-6 ${combinedStyleClasses}`}>
            {block.content.imageUrl && (
              <img
                src={block.content.imageUrl || "/placeholder.svg"}
                alt=""
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
            {description && <p className="text-muted-foreground mb-4">{description}</p>}
            {block.content.buttonUrl && (
              <Button asChild>
                <a href={block.content.buttonUrl}>{buttonText || (language === "ar" ? "اقرأ المزيد" : "Read More")}</a>
              </Button>
            )}
          </Card>
        )

      case "icon-box":
        return (
          <div key={block.id} className={`flex gap-4 p-6 rounded-lg bg-muted/50 my-6 ${combinedStyleClasses}`}>
            <div className="flex-shrink-0">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <div>
              {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          </div>
        )

      case "hero-slider":
        return (
          <div
            key={block.id}
            className={`relative w-full h-96 rounded-lg overflow-hidden my-6 ${combinedStyleClasses}`}
          >
            {(block.content.slides || [])[0] ? (
              <div className="w-full h-full">
                <img
                  src={(block.content.slides[0].imageUrl as string) || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
                  <h2 className="text-4xl font-bold mb-4">{block.content.slides[0].title}</h2>
                  <p className="text-lg mb-4">{block.content.slides[0].description}</p>
                  {block.content.slides[0].link && (
                    <Button asChild size="lg" variant="secondary">
                      <a href={block.content.slides[0].link as string}>
                        {language === "ar" ? "اعرف المزيد" : "Learn More"}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Presentation className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        )

      case "statistics":
        return (
          <div key={block.id} className={`my-8 ${combinedStyleClasses}`}>
            {title && <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(block.content.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-6 rounded-lg bg-muted/50">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case "features":
        return (
          <div key={block.id} className={`my-8 ${combinedStyleClasses}`}>
            {title && <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(block.content.features || []).map((feature: any, idx: number) => (
                <div key={idx} className="p-6 rounded-lg bg-muted/50">
                  <Star className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "accordion":
        return (
          <div key={block.id} className={`my-6 space-y-2 ${combinedStyleClasses}`}>
            {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
            {(block.content.items || []).map((item: any, idx: number) => (
              <Card key={idx} className="p-4">
                <div className="font-bold mb-2">{item.title}</div>
                <p className="text-muted-foreground text-sm">{item.content}</p>
              </Card>
            ))}
          </div>
        )

      case "tabs":
        return (
          <div key={block.id} className={`my-6 ${combinedStyleClasses}`}>
            {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
            {(block.content.tabs || [])[0] && (
              <Card className="p-6">
                <h3 className="font-bold mb-4">{block.content.tabs[0].title}</h3>
                <p className="text-muted-foreground">{block.content.tabs[0].content}</p>
              </Card>
            )}
          </div>
        )

      case "alert":
        const alertColors = {
          info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          success: "bg-green-500/10 text-green-600 border-green-500/20",
          warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          error: "bg-red-500/10 text-red-600 border-red-500/20",
        }
        const alertType = block.content.alertType || "info"
        return (
          <div
            key={block.id}
            className={`p-4 rounded-lg border my-6 ${alertColors[alertType as keyof typeof alertColors]} ${combinedStyleClasses}`}
          >
            {title && <div className="font-bold mb-2">{title}</div>}
            {description && <p>{description}</p>}
          </div>
        )

      case "testimonial-card":
        return (
          <Card key={block.id} className={`p-6 my-6 ${combinedStyleClasses}`}>
            <div className="flex gap-4">
              {block.content.imageUrl && (
                <img
                  src={block.content.imageUrl || "/placeholder.svg"}
                  alt={block.content.name || ""}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <blockquote className="italic mb-4">"{quote || text}"</blockquote>
                <div className="font-bold">{block.content.name}</div>
                {block.content.position && (
                  <div className="text-sm text-muted-foreground">{block.content.position}</div>
                )}
              </div>
            </div>
          </Card>
        )

      case "team-member":
        return (
          <Card key={block.id} className={`p-6 text-center my-6 ${combinedStyleClasses}`}>
            {block.content.imageUrl && (
              <img
                src={block.content.imageUrl || "/placeholder.svg"}
                alt={block.content.name || ""}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h3 className="text-xl font-bold mb-1">{block.content.name}</h3>
            {block.content.position && <p className="text-sm text-primary mb-2">{block.content.position}</p>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </Card>
        )

      case "pricing-card":
        return (
          <Card key={block.id} className={`p-6 text-center my-6 ${combinedStyleClasses}`}>
            {title && <h3 className="text-2xl font-bold mb-4">{title}</h3>}
            <div className="text-4xl font-bold text-primary mb-6">
              {block.content.currency || "$"}
              {block.content.price || "0"}
            </div>
            {description && <p className="text-muted-foreground mb-6 whitespace-pre-line">{description}</p>}
            {block.content.buttonUrl && (
              <Button asChild className="w-full">
                <a href={block.content.buttonUrl}>{buttonText || (language === "ar" ? "اشترك" : "Subscribe")}</a>
              </Button>
            )}
          </Card>
        )

      case "cta":
        return (
          <div
            key={block.id}
            className={`bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12 text-center my-8 ${combinedStyleClasses}`}
          >
            <p className="text-2xl mb-6">{text}</p>
            {block.content.buttonUrl && (
              <Button asChild size="lg">
                <a href={block.content.buttonUrl}>{buttonText || (language === "ar" ? "ابدأ الآن" : "Get Started")}</a>
              </Button>
            )}
          </div>
        )

      case "form":
        return (
          <Card key={block.id} className={`p-8 my-6 ${combinedStyleClasses}`}>
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {description && <p className="text-muted-foreground mb-6">{description}</p>}
            <div className="space-y-4">
              <Input placeholder={language === "ar" ? "الاسم" : "Name"} />
              <Input type="email" placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} />
              <Textarea placeholder={language === "ar" ? "الرسالة" : "Message"} rows={4} />
              <Button className="w-full">{language === "ar" ? "إرسال" : "Submit"}</Button>
            </div>
          </Card>
        )

      case "map":
        return (
          <div key={block.id} className={`my-6 ${combinedStyleClasses}`}>
            {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
            <div
              className="w-full bg-muted rounded-lg flex items-center justify-center"
              style={{ height: `${block.content.height || 400}px` }}
            >
              <Building2 className="w-16 h-16 text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">
                {block.content.address || (language === "ar" ? "خريطة" : "Map")}
              </span>
            </div>
          </div>
        )

      case "social-links":
        return (
          <div key={block.id} className={`flex justify-center gap-4 my-6 ${combinedStyleClasses}`}>
            {(block.content.links || []).map((link: any, idx: number) => (
              <Button key={idx} variant="outline" size="icon" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="w-4 h-4" />
                </a>
              </Button>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const renderBlockSettings = (block: PageBlock, lang: "ar" | "en") => {
    // Use workingBlock to reflect temporary changes before saving
    const workingBlock = tempBlockChanges
      ? {
          ...block,
          ...tempBlockChanges,
          content: { ...block.content, ...(tempBlockChanges.content || {}) },
          styles: { ...block.styles, ...(tempBlockChanges.styles || {}) },
        }
      : block

    const currentLanguageText = lang === "ar" ? workingBlock.content.textAr : workingBlock.content.textEn
    const currentLanguageQuote = lang === "ar" ? workingBlock.content.quoteAr : workingBlock.content.quoteEn
    const currentLanguageAuthor = lang === "ar" ? workingBlock.content.authorAr : workingBlock.content.authorEn
    const currentLanguageButtonText =
      lang === "ar" ? workingBlock.content.buttonTextAr : workingBlock.content.buttonTextEn
    const currentLanguageTitle = lang === "ar" ? workingBlock.content.titleAr : workingBlock.content.titleEn
    const currentLanguageSubtitle = lang === "ar" ? workingBlock.content.subtitleAr : workingBlock.content.subtitleEn
    const currentLanguageDescription =
      lang === "ar" ? workingBlock.content.descriptionAr : workingBlock.content.descriptionEn

    const handleContentChange = (field: keyof PageBlock["content"], value: any) => {
      setTempBlockChanges((prev) => ({
        ...prev,
        content: {
          ...(prev?.content || {}),
          [field]: value,
        },
      }))
    }

    const handleStyleChange = (field: keyof PageBlock["styles"], value: string) => {
      setTempBlockChanges((prev) => ({
        ...prev,
        styles: {
          ...(prev?.styles || {}),
          [field]: value,
        },
      }))
    }

    const renderStyleTab = () => {
      return (
        <div className="space-y-6">
          {/* Background & Colors */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">
              {lang === "ar" ? "الخلفية والألوان" : "Background & Colors"}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "لون الخلفية" : "Background Color"}</Label>
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
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "لون النص" : "Text Color"}</Label>
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

            <div>
              <Label className="text-xs">{lang === "ar" ? "تدرج الخلفية" : "Background Gradient"}</Label>
              <select
                value={workingBlock.styles?.gradientFrom || ""}
                onChange={(e) => {
                  const value = e.target.value
                  if (value) {
                    handleStyleChange("gradientFrom", value)
                    // Auto-set gradient direction
                    if (!workingBlock.styles?.backgroundColor?.includes("gradient")) {
                      handleStyleChange("backgroundColor", "bg-gradient-to-br")
                    }
                  } else {
                    handleStyleChange("gradientFrom", "")
                  }
                }}
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="">No Gradient</option>
                <option value="from-primary">From Primary</option>
                <option value="from-accent">From Accent</option>
                <option value="from-secondary">From Secondary</option>
                <option value="from-primary/20">From Primary Light</option>
                <option value="from-accent/20">From Accent Light</option>
                <option value="from-muted">From Muted</option>
              </select>
            </div>

            {workingBlock.styles?.gradientFrom && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">{lang === "ar" ? "عبر" : "Via"}</Label>
                  <select
                    value={workingBlock.styles?.gradientVia || ""}
                    onChange={(e) => handleStyleChange("gradientVia", e.target.value)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="">Skip</option>
                    <option value="via-primary">Via Primary</option>
                    <option value="via-accent">Via Accent</option>
                    <option value="via-secondary">Via Secondary</option>
                    <option value="via-muted">Via Muted</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs">{lang === "ar" ? "إلى" : "To"}</Label>
                  <select
                    value={workingBlock.styles?.gradientTo || ""}
                    onChange={(e) => handleStyleChange("gradientTo", e.target.value)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="">Transparent</option>
                    <option value="to-primary">To Primary</option>
                    <option value="to-accent">To Accent</option>
                    <option value="to-secondary">To Secondary</option>
                    <option value="to-primary/20">To Primary Light</option>
                    <option value="to-accent/20">To Accent Light</option>
                    <option value="to-transparent">To Transparent</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">{lang === "ar" ? "التباعد" : "Spacing"}</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "الحشو (Padding)" : "Padding"}</Label>
                <select
                  value={workingBlock.styles?.padding || ""}
                  onChange={(e) => handleStyleChange("padding", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="p-0">None</option>
                  <option value="p-2">XS (8px)</option>
                  <option value="p-4">SM (16px)</option>
                  <option value="p-6">MD (24px)</option>
                  <option value="p-8">LG (32px)</option>
                  <option value="p-10">XL (40px)</option>
                  <option value="p-12">2XL (48px)</option>
                  <option value="p-16">3XL (64px)</option>
                  <option value="p-20">4XL (80px)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "الهامش (Margin)" : "Margin"}</Label>
                <select
                  value={workingBlock.styles?.margin || ""}
                  onChange={(e) => handleStyleChange("margin", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="m-0">None</option>
                  <option value="my-2">Y-XS (8px)</option>
                  <option value="my-4">Y-SM (16px)</option>
                  <option value="my-6">Y-MD (24px)</option>
                  <option value="my-8">Y-LG (32px)</option>
                  <option value="my-12">Y-XL (48px)</option>
                  <option value="my-16">Y-2XL (64px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Border & Shadow */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">
              {lang === "ar" ? "الحدود والظلال" : "Border & Shadow"}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "الحواف المستديرة" : "Border Radius"}</Label>
                <select
                  value={workingBlock.styles?.borderRadius || ""}
                  onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="rounded-none">None</option>
                  <option value="rounded-sm">SM</option>
                  <option value="rounded">MD</option>
                  <option value="rounded-lg">LG</option>
                  <option value="rounded-xl">XL</option>
                  <option value="rounded-2xl">2XL</option>
                  <option value="rounded-3xl">3XL</option>
                  <option value="rounded-full">Full</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "سمك الحدود" : "Border Width"}</Label>
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
            </div>

            {workingBlock.styles?.borderWidth && (
              <div>
                <Label className="text-xs">{lang === "ar" ? "لون الحدود" : "Border Color"}</Label>
                <select
                  value={workingBlock.styles?.borderColor || ""}
                  onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="border-border">Border</option>
                  <option value="border-primary">Primary</option>
                  <option value="border-secondary">Secondary</option>
                  <option value="border-accent">Accent</option>
                  <option value="border-primary/20">Primary Light</option>
                  <option value="border-accent/20">Accent Light</option>
                  <option value="border-muted">Muted</option>
                </select>
              </div>
            )}

            <div>
              <Label className="text-xs">{lang === "ar" ? "الظل" : "Shadow"}</Label>
              <select
                value={workingBlock.styles?.shadow || ""}
                onChange={(e) => handleStyleChange("shadow", e.target.value)}
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="">None</option>
                <option value="shadow-sm">SM</option>
                <option value="shadow">MD</option>
                <option value="shadow-md">MD+</option>
                <option value="shadow-lg">LG</option>
                <option value="shadow-xl">XL</option>
                <option value="shadow-2xl">2XL</option>
              </select>
            </div>
          </div>

          {/* Animation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">{lang === "ar" ? "الحركة" : "Animation"}</h4>

            <div>
              <Label className="text-xs">{lang === "ar" ? "نوع الحركة" : "Animation Type"}</Label>
              <select
                value={workingBlock.styles?.animation || "none"}
                onChange={(e) => handleStyleChange("animation", e.target.value)}
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="none">None</option>
                <option value="animate-fade-in">Fade In</option>
                <option value="animate-fade-in-up">Fade In Up</option>
                <option value="animate-scale-in">Scale In</option>
                <option value="animate-float">Float</option>
                <option value="animate-pulse">Pulse</option>
                <option value="animate-bounce">Bounce</option>
                <option value="animate-pulse-slow">Pulse Slow</option>
                <option value="animate-gradient-x">Gradient X</option>
              </select>
            </div>

            {workingBlock.styles?.animation && workingBlock.styles.animation !== "none" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">{lang === "ar" ? "تأخير الحركة" : "Animation Delay"}</Label>
                  <select
                    value={workingBlock.styles?.animationDelay || ""}
                    onChange={(e) => handleStyleChange("animationDelay", e.target.value)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="">None</option>
                    <option value="animation-delay-150">150ms</option>
                    <option value="animation-delay-300">300ms</option>
                    <option value="animation-delay-500">500ms</option>
                    <option value="animation-delay-1000">1s</option>
                    <option value="animation-delay-2000">2s</option>
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
                    <option value="duration-1000">1s</option>
                  </select>
                </div>
              </div>
            )}
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
                  <option value="hover:rotate-6">6°</option>
                  <option value="hover:rotate-12">12°</option>
                  <option value="hover:-rotate-6">-6°</option>
                  <option value="hover:-rotate-12">-12°</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "إزاحة عند التمرير" : "Hover Translate"}</Label>
                <select
                  value={workingBlock.styles?.hoverTranslate || ""}
                  onChange={(e) => handleStyleChange("hoverTranslate", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="hover:-translate-y-1">Up Small</option>
                  <option value="hover:-translate-y-2">Up Medium</option>
                  <option value="hover:-translate-y-4">Up Large</option>
                  <option value="hover:translate-x-2">Right</option>
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
                  <option value="hover:shadow-lg">LG</option>
                  <option value="hover:shadow-xl">XL</option>
                  <option value="hover:shadow-2xl">2XL</option>
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
                  onChange={(e) => handleStyleChange("textAlign", e.target.value as any)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Default</option>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">{lang === "ar" ? "العرض الأقصى" : "Max Width"}</Label>
                <select
                  value={workingBlock.styles?.maxWidth || ""}
                  onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">Full</option>
                  <option value="max-w-sm">SM (384px)</option>
                  <option value="max-w-md">MD (448px)</option>
                  <option value="max-w-lg">LG (512px)</option>
                  <option value="max-w-xl">XL (576px)</option>
                  <option value="max-w-2xl">2XL (672px)</option>
                  <option value="max-w-4xl">4XL (896px)</option>
                  <option value="max-w-6xl">6XL (1152px)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "ضبابية الخلفية" : "Backdrop Blur"}</Label>
                <select
                  value={workingBlock.styles?.backdropBlur || ""}
                  onChange={(e) => handleStyleChange("backdropBlur", e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="">None</option>
                  <option value="backdrop-blur-sm">SM</option>
                  <option value="backdrop-blur">MD</option>
                  <option value="backdrop-blur-md">MD+</option>
                  <option value="backdrop-blur-lg">LG</option>
                  <option value="backdrop-blur-xl">XL</option>
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
          <TabsTrigger value="content" className="text-xs">
            {lang === "ar" ? "المحتوى" : "Content"}
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            {lang === "ar" ? "التصميم" : "Style"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Original content settings */}
          <>
            {(block.type === "heading" || block.type === "paragraph" || block.type === "quote") && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "النص" : "Text"}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={currentLanguageText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "textAr" : "textEn", e.target.value)}
                  rows={5}
                  placeholder={lang === "ar" ? "أدخل النص هنا..." : "Enter text here..."}
                />
                {block.type === "quote" && (
                  <>
                    <Label className="text-sm font-medium mt-4">{lang === "ar" ? "الاقتباس" : "Quote"}</Label>
                    <Textarea
                      value={currentLanguageQuote || ""}
                      onChange={(e) => handleContentChange(lang === "ar" ? "quoteAr" : "quoteEn", e.target.value)}
                      rows={3}
                      placeholder={lang === "ar" ? "أدخل الاقتباس هنا..." : "Enter quote here..."}
                    />
                    <Label className="text-sm font-medium mt-4">{lang === "ar" ? "اسم الكاتب" : "Author Name"}</Label>
                    <Input
                      value={currentLanguageAuthor || ""}
                      onChange={(e) => handleContentChange(lang === "ar" ? "authorAr" : "authorEn", e.target.value)}
                      placeholder={lang === "ar" ? "اسم الكاتب" : "Author name"}
                    />
                  </>
                )}
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

            {block.type === "image" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "رابط الصورة" : "Image URL"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={workingBlock.content.imageUrl || ""}
                  onChange={(e) => handleContentChange("imageUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com/image.jpg" : "https://example.com/image.jpg"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نص بديل (Alt Text)" : "Alt Text"}</Label>
                <Input
                  value={workingBlock.content.altText || ""}
                  onChange={(e) => handleContentChange("altText", e.target.value)}
                  placeholder={lang === "ar" ? "وصف للصورة" : "Description for the image"}
                />
              </>
            )}

            {block.type === "gallery" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "الصور" : "Images"}</Label>
                <div className="space-y-2">
                  {(workingBlock.content.images || []).map((img: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={img}
                        onChange={(e) => {
                          const updatedImages = [...(workingBlock.content.images || [])]
                          updatedImages[index] = e.target.value
                          handleContentChange("images", updatedImages)
                        }}
                        placeholder={lang === "ar" ? "رابط الصورة" : "Image URL"}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updatedImages = [...(workingBlock.content.images || [])]
                          updatedImages.splice(index, 1)
                          handleContentChange("images", updatedImages)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full bg-transparent"
                  onClick={() => {
                    handleContentChange("images", [...(workingBlock.content.images || []), ""])
                  }}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {lang === "ar" ? "إضافة صورة" : "Add Image"}
                </Button>
              </>
            )}

            {block.type === "video" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "عنوان الفيديو" : "Video Title"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان الفيديو" : "Video title"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رابط الفيديو (YouTube/Vimeo)" : "Video URL (YouTube/Vimeo)"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={workingBlock.content.videoUrl || ""}
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
                  value={currentLanguageButtonText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "buttonTextAr" : "buttonTextEn", e.target.value)}
                  placeholder={lang === "ar" ? "نص الزر" : "Button text"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رابط الزر" : "Button URL"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={workingBlock.content.buttonUrl || ""}
                  onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com" : "https://example.com"}
                />
              </>
            )}

            {block.type === "divider" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "نمط الفاصل" : "Divider Style"}</Label>
                <select
                  value={workingBlock.content.dividerStyle || "solid"}
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
                  value={workingBlock.content.height || 20}
                  onChange={(e) => handleContentChange("height", Number.parseInt(e.target.value, 10))}
                  placeholder="20"
                />
              </>
            )}

            {block.type === "row" && (
              <>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "عدد الأعمدة" : "Number of Columns"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={workingBlock.content.columns || 2}
                  onChange={(e) => {
                    const newColumns = Number.parseInt(e.target.value, 10)
                    handleContentChange("columns", newColumns)
                    // Adjust children's order if columns change
                    if (workingBlock.children) {
                      const updatedChildren = workingBlock.children.map((child) => {
                        if (child.order >= newColumns) {
                          child.order = newColumns - 1
                        }
                        return child
                      })
                      // Using tempBlockChanges to update the children array within the current block's context
                      setTempBlockChanges((prev) => ({
                        ...prev,
                        children: updatedChildren,
                      }))
                    }
                  }}
                  placeholder="2"
                />
              </>
            )}

            {block.type === "card" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "العنوان" : "Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان البطاقة" : "Card title"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "النص" : "Text"}</Label>
                <Textarea
                  value={currentLanguageDescription || ""}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={4}
                  placeholder={lang === "ar" ? "وصف البطاقة" : "Card description"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رابط الزر (اختياري)" : "Button Link (Optional)"}
                </Label>
                <Input
                  value={workingBlock.content.buttonUrl || ""}
                  onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com" : "https://example.com"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "نص الزر (اختياري)" : "Button Text (Optional)"}
                </Label>
                <Input
                  value={currentLanguageButtonText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "buttonTextAr" : "buttonTextEn", e.target.value)}
                  placeholder={lang === "ar" ? "اقرأ المزيد" : "Read More"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "الصورة (اختياري)" : "Image (Optional)"}
                </Label>
                <ImageUpload
                  value={workingBlock.content.imageUrl || ""}
                  onChange={(url) => handleContentChange("imageUrl", url)}
                  language={lang}
                />
              </>
            )}

            {block.type === "icon-box" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "العنوان" : "Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان الصندوق" : "Icon box title"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "الوصف" : "Description"}</Label>
                <Textarea
                  value={currentLanguageDescription || ""}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={3}
                  placeholder={lang === "ar" ? "وصف الصندوق" : "Icon box description"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "الأيقونة" : "Icon"}</Label>
                <Input
                  value={workingBlock.content.iconClass || ""}
                  onChange={(e) => handleContentChange("iconClass", e.target.value)}
                  placeholder="e.g., fas fa-star"
                />
              </>
            )}

            {block.type === "hero-slider" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان السلايدر" : "Slider Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان السلايدر" : "Hero slider title"}
                />
                <div className="mt-4">
                  <Label className="text-sm font-medium">{lang === "ar" ? "الشرائح" : "Slides"}</Label>
                  <div className="space-y-2">
                    {(workingBlock.content.slides || []).map((slide, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedSlides = [...(workingBlock.content.slides || [])]
                              updatedSlides.splice(index, 1)
                              handleContentChange("slides", updatedSlides)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <Label className="text-xs font-medium">{lang === "ar" ? "صورة الشريحة" : "Slide Image"}</Label>
                        <ImageUpload
                          value={slide.imageUrl || ""}
                          onChange={(url) => {
                            const updatedSlides = [...(workingBlock.content.slides || [])]
                            updatedSlides[index].imageUrl = url
                            handleContentChange("slides", updatedSlides)
                          }}
                          language={lang}
                        />
                        <Label className="text-xs font-medium mt-2">
                          {lang === "ar" ? "عنوان الشريحة" : "Slide Title"}
                        </Label>
                        <Input
                          value={slide.title || ""}
                          onChange={(e) => {
                            const updatedSlides = [...(workingBlock.content.slides || [])]
                            updatedSlides[index].title = e.target.value
                            handleContentChange("slides", updatedSlides)
                          }}
                          placeholder={lang === "ar" ? "عنوان الشريحة" : "Slide title"}
                        />
                        <Label className="text-xs font-medium mt-2">
                          {lang === "ar" ? "وصف الشريحة" : "Slide Description"}
                        </Label>
                        <Textarea
                          value={slide.description || ""}
                          onChange={(e) => {
                            const updatedSlides = [...(workingBlock.content.slides || [])]
                            updatedSlides[index].description = e.target.value
                            handleContentChange("slides", updatedSlides)
                          }}
                          rows={2}
                          placeholder={lang === "ar" ? "وصف الشريحة" : "Slide description"}
                        />
                        <Label className="text-xs font-medium mt-2">
                          {lang === "ar" ? "رابط الشريحة" : "Slide Link"}
                        </Label>
                        <Input
                          value={slide.link || ""}
                          onChange={(e) => {
                            const updatedSlides = [...(workingBlock.content.slides || [])]
                            updatedSlides[index].link = e.target.value
                            handleContentChange("slides", updatedSlides)
                          }}
                          placeholder={lang === "ar" ? "https://example.com" : "https://example.com"}
                        />
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      handleContentChange("slides", [
                        ...(workingBlock.content.slides || []),
                        { title: "", description: "", imageUrl: "", link: "" },
                      ])
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {lang === "ar" ? "إضافة شريحة" : "Add Slide"}
                  </Button>
                </div>
              </>
            )}

            {block.type === "statistics" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان القسم" : "Section Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان قسم الإحصائيات" : "Statistics section title"}
                />
                <div className="mt-4">
                  <Label className="text-sm font-medium">{lang === "ar" ? "الإحصائيات" : "Statistics"}</Label>
                  <div className="space-y-2">
                    {(workingBlock.content.stats || []).map((stat, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedStats = [...(workingBlock.content.stats || [])]
                              updatedStats.splice(index, 1)
                              handleContentChange("stats", updatedStats)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <Label className="text-xs font-medium">{lang === "ar" ? "الرقم" : "Number"}</Label>
                        <Input
                          type="number"
                          value={stat.value || 0}
                          onChange={(e) => {
                            const updatedStats = [...(workingBlock.content.stats || [])]
                            updatedStats[index].value = Number.parseInt(e.target.value, 10)
                            handleContentChange("stats", updatedStats)
                          }}
                          placeholder="100"
                        />
                        <Label className="text-xs font-medium mt-2">{lang === "ar" ? "التسمية" : "Label"}</Label>
                        <Input
                          value={stat.label || ""}
                          onChange={(e) => {
                            const updatedStats = [...(workingBlock.content.stats || [])]
                            updatedStats[index].label = e.target.value
                            handleContentChange("stats", updatedStats)
                          }}
                          placeholder={lang === "ar" ? "عملاء سعداء" : "Happy Clients"}
                        />
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      handleContentChange("stats", [...(workingBlock.content.stats || []), { value: 0, label: "" }])
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {lang === "ar" ? "إضافة إحصائية" : "Add Statistic"}
                  </Button>
                </div>
              </>
            )}

            {block.type === "features" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان القسم" : "Section Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان قسم المميزات" : "Features section title"}
                />
                <div className="mt-4">
                  <Label className="text-sm font-medium">{lang === "ar" ? "المميزات" : "Features"}</Label>
                  <div className="space-y-2">
                    {(workingBlock.content.features || []).map((feature, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedFeatures = [...(workingBlock.content.features || [])]
                              updatedFeatures.splice(index, 1)
                              handleContentChange("features", updatedFeatures)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <Label className="text-xs font-medium">{lang === "ar" ? "العنوان" : "Title"}</Label>
                        <Input
                          value={feature.title || ""}
                          onChange={(e) => {
                            const updatedFeatures = [...(workingBlock.content.features || [])]
                            updatedFeatures[index].title = e.target.value
                            handleContentChange("features", updatedFeatures)
                          }}
                          placeholder={lang === "ar" ? "عنوان الميزة" : "Feature title"}
                        />
                        <Label className="text-xs font-medium mt-2">{lang === "ar" ? "الوصف" : "Description"}</Label>
                        <Textarea
                          value={feature.description || ""}
                          onChange={(e) => {
                            const updatedFeatures = [...(workingBlock.content.features || [])]
                            updatedFeatures[index].description = e.target.value
                            handleContentChange("features", updatedFeatures)
                          }}
                          rows={3}
                          placeholder={lang === "ar" ? "وصف الميزة" : "Feature description"}
                        />
                        <Label className="text-xs font-medium mt-2">{lang === "ar" ? "الأيقونة" : "Icon"}</Label>
                        <Input
                          value={feature.iconClass || ""}
                          onChange={(e) => {
                            const updatedFeatures = [...(workingBlock.content.features || [])]
                            updatedFeatures[index].iconClass = e.target.value
                            handleContentChange("features", updatedFeatures)
                          }}
                          placeholder="e.g., fas fa-star"
                        />
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      handleContentChange("features", [
                        ...(workingBlock.content.features || []),
                        { title: "", description: "", iconClass: "" },
                      ])
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {lang === "ar" ? "إضافة ميزة" : "Add Feature"}
                  </Button>
                </div>
              </>
            )}

            {block.type === "accordion" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان الأكورديون" : "Accordion Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان الأكورديون" : "Accordion title"}
                />
                <div className="mt-4">
                  <Label className="text-sm font-medium">{lang === "ar" ? "العناصر" : "Items"}</Label>
                  <div className="space-y-2">
                    {(workingBlock.content.items || []).map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedItems = [...(workingBlock.content.items || [])]
                              updatedItems.splice(index, 1)
                              handleContentChange("items", updatedItems)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <Label className="text-xs font-medium">{lang === "ar" ? "عنوان العنصر" : "Item Title"}</Label>
                        <Input
                          value={item.title || ""}
                          onChange={(e) => {
                            const updatedItems = [...(workingBlock.content.items || [])]
                            updatedItems[index].title = e.target.value
                            handleContentChange("items", updatedItems)
                          }}
                          placeholder={lang === "ar" ? "عنوان العنصر" : "Item title"}
                        />
                        <Label className="text-xs font-medium mt-2">
                          {lang === "ar" ? "محتوى العنصر" : "Item Content"}
                        </Label>
                        <Textarea
                          value={item.content || ""}
                          onChange={(e) => {
                            const updatedItems = [...(workingBlock.content.items || [])]
                            updatedItems[index].content = e.target.value
                            handleContentChange("items", updatedItems)
                          }}
                          rows={3}
                          placeholder={lang === "ar" ? "محتوى العنصر" : "Item content"}
                        />
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      handleContentChange("items", [...(workingBlock.content.items || []), { title: "", content: "" }])
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {lang === "ar" ? "إضافة عنصر" : "Add Item"}
                  </Button>
                </div>
              </>
            )}

            {block.type === "tabs" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان التبويبات" : "Tabs Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان التبويبات" : "Tabs title"}
                />
                <div className="mt-4">
                  <Label className="text-sm font-medium">{lang === "ar" ? "التبويبات" : "Tabs"}</Label>
                  <div className="space-y-2">
                    {(workingBlock.content.tabs || []).map((tab, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedTabs = [...(workingBlock.content.tabs || [])]
                              updatedTabs.splice(index, 1)
                              handleContentChange("tabs", updatedTabs)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <Label className="text-xs font-medium">{lang === "ar" ? "عنوان التبويب" : "Tab Title"}</Label>
                        <Input
                          value={tab.title || ""}
                          onChange={(e) => {
                            const updatedTabs = [...(workingBlock.content.tabs || [])]
                            updatedTabs[index].title = e.target.value
                            handleContentChange("tabs", updatedTabs)
                          }}
                          placeholder={lang === "ar" ? "عنوان التبويب" : "Tab title"}
                        />
                        <Label className="text-xs font-medium mt-2">
                          {lang === "ar" ? "محتوى التبويب" : "Tab Content"}
                        </Label>
                        <Textarea
                          value={tab.content || ""}
                          onChange={(e) => {
                            const updatedTabs = [...(workingBlock.content.tabs || [])]
                            updatedTabs[index].content = e.target.value
                            handleContentChange("tabs", updatedTabs)
                          }}
                          rows={3}
                          placeholder={lang === "ar" ? "محتوى التبويب" : "Tab content"}
                        />
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      handleContentChange("tabs", [...(workingBlock.content.tabs || []), { title: "", content: "" }])
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {lang === "ar" ? "إضافة تبويب" : "Add Tab"}
                  </Button>
                </div>
              </>
            )}

            {block.type === "alert" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان التنبيه" : "Alert Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان التنبيه" : "Alert title"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نوع التنبيه" : "Alert Type"}</Label>
                <select
                  value={workingBlock.content.alertType || "info"}
                  onChange={(e) => handleContentChange("alertType", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نص التنبيه" : "Alert Message"}</Label>
                <Textarea
                  value={currentLanguageDescription || ""}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={3}
                  placeholder={lang === "ar" ? "رسالة التنبيه" : "Alert message"}
                />
              </>
            )}

            {block.type === "testimonial-card" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "اسم العميل" : "Customer Name"}</Label>
                <Input
                  value={workingBlock.content.name || ""}
                  onChange={(e) => handleContentChange("name", e.target.value)}
                  placeholder={lang === "ar" ? "اسم عضو الفريق" : "Team member name"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "المنصب/الشركة" : "Position/Company"}
                </Label>
                <Input
                  value={workingBlock.content.position || ""}
                  onChange={(e) => handleContentChange("position", e.target.value)}
                  placeholder={lang === "ar" ? "منصب العميل أو شركته" : "Customer position or company"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "رأي العميل" : "Customer Testimonial"}
                </Label>
                <Textarea
                  value={currentLanguageQuote || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "quoteAr" : "quoteEn", e.target.value)}
                  rows={4}
                  placeholder={lang === "ar" ? "رأي العميل" : "Customer testimonial"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "صورة العميل" : "Customer Image"}</Label>
                <ImageUpload
                  value={workingBlock.content.imageUrl || ""}
                  onChange={(url) => handleContentChange("imageUrl", url)}
                  language={lang}
                />
              </>
            )}

            {block.type === "team-member" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "اسم العضو" : "Member Name"}</Label>
                <Input
                  value={workingBlock.content.name || ""}
                  onChange={(e) => handleContentChange("name", e.target.value)}
                  placeholder={lang === "ar" ? "اسم عضو الفريق" : "Team member name"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "المنصب" : "Position"}</Label>
                <Input
                  value={workingBlock.content.position || ""}
                  onChange={(e) => handleContentChange("position", e.target.value)}
                  placeholder={lang === "ar" ? "منصب عضو الفريق" : "Team member position"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نبذة مختصرة" : "Short Bio"}</Label>
                <Textarea
                  value={currentLanguageDescription || ""}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={3}
                  placeholder={lang === "ar" ? "نبذة مختصرة عن عضو الفريق" : "Short bio about the team member"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "صورة العضو" : "Member Image"}</Label>
                <ImageUpload
                  value={workingBlock.content.imageUrl || ""}
                  onChange={(url) => handleContentChange("imageUrl", url)}
                  language={lang}
                />
                <div className="mt-4">
                  <Label className="text-sm font-medium">
                    {lang === "ar" ? "روابط التواصل الاجتماعي" : "Social Media Links"}
                  </Label>
                  <div className="space-y-2">
                    {(workingBlock.content.socialLinks || []).map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={link.url || ""}
                          onChange={(e) => {
                            const updatedSocialLinks = [...(workingBlock.content.socialLinks || [])]
                            updatedSocialLinks[index].url = e.target.value
                            handleContentChange("socialLinks", updatedSocialLinks)
                          }}
                          placeholder="URL"
                        />
                        <select
                          value={link.platform || "facebook"}
                          onChange={(e) => {
                            const updatedSocialLinks = [...(workingBlock.content.socialLinks || [])]
                            updatedSocialLinks[index].platform = e.target.value
                            handleContentChange("socialLinks", updatedSocialLinks)
                          }}
                          className="flex h-10 w-[120px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                          <option value="website">Website</option>
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updatedSocialLinks = [...(workingBlock.content.socialLinks || [])]
                            updatedSocialLinks.splice(index, 1)
                            handleContentChange("socialLinks", updatedSocialLinks)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      handleContentChange("socialLinks", [
                        ...(workingBlock.content.socialLinks || []),
                        { platform: "facebook", url: "" },
                      ])
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {lang === "ar" ? "إضافة رابط" : "Add Link"}
                  </Button>
                </div>
              </>
            )}

            {block.type === "pricing-card" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان البطاقة" : "Card Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "اسم الباقة" : "Plan name"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "السعر" : "Price"}</Label>
                <Input
                  value={workingBlock.content.price || ""}
                  onChange={(e) => handleContentChange("price", e.target.value)}
                  placeholder="99.99"
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "العملة" : "Currency"}</Label>
                <Input
                  value={workingBlock.content.currency || "$"}
                  onChange={(e) => handleContentChange("currency", e.target.value)}
                  placeholder="$"
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "الوصف/المميزات" : "Description/Features"}
                </Label>
                <Textarea
                  value={currentLanguageDescription || ""}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={4}
                  placeholder={lang === "ar" ? "قائمة بالمميزات" : "List of features"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نص الزر" : "Button Text"}</Label>
                <Input
                  value={currentLanguageButtonText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "buttonTextAr" : "buttonTextEn", e.target.value)}
                  placeholder={lang === "ar" ? "اشترك الآن" : "Sign Up"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "رابط الزر" : "Button Link"}</Label>
                <Input
                  value={workingBlock.content.buttonUrl || ""}
                  onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com/signup" : "https://example.com/signup"}
                />
              </>
            )}

            {block.type === "cta" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "النص الرئيسي" : "Main Text"}</Label>
                <Textarea
                  value={currentLanguageText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "textAr" : "textEn", e.target.value)}
                  rows={3}
                  placeholder={lang === "ar" ? "اكتب نص الدعوة لإجراء هنا" : "Write your call-to-action text here"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "نص الزر" : "Button Text"}</Label>
                <Input
                  value={currentLanguageButtonText || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "buttonTextAr" : "buttonTextEn", e.target.value)}
                  placeholder={lang === "ar" ? "انقر هنا" : "Click Me"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "رابط الزر" : "Button Link"}</Label>
                <Input
                  value={workingBlock.content.buttonUrl || ""}
                  onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                  placeholder={lang === "ar" ? "https://example.com" : "https://example.com"}
                />
              </>
            )}

            {block.type === "form" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان النموذج" : "Form Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان النموذج" : "Form title"}
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "وصف النموذج" : "Form Description"}</Label>
                <Textarea
                  value={currentLanguageDescription || ""}
                  onChange={(e) =>
                    handleContentChange(lang === "ar" ? "descriptionAr" : "descriptionEn", e.target.value)
                  }
                  rows={3}
                  placeholder={lang === "ar" ? "وصف مختصر للنموذج" : "Short description of the form"}
                />
                {/* Add more form field configurations here if needed */}
              </>
            )}

            {block.type === "map" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "عنوان الخريطة" : "Map Title"}</Label>
                <Input
                  value={currentLanguageTitle || ""}
                  onChange={(e) => handleContentChange(lang === "ar" ? "titleAr" : "titleEn", e.target.value)}
                  placeholder={lang === "ar" ? "عنوان الخريطة" : "Map title"}
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "عنوان أو إحداثيات" : "Address or Coordinates"}
                </Label>
                <Input
                  value={workingBlock.content.address || ""}
                  onChange={(e) => handleContentChange("address", e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "عنوان أو خطوط الطول والعرض (e.g., 34.0522, -118.2437)"
                      : "Address or Lat/Lng (e.g., 34.0522, -118.2437)"
                  }
                />
                <Label className="text-sm font-medium mt-4">
                  {lang === "ar" ? "ارتفاع الخريطة (px)" : "Map Height (px)"}
                </Label>
                <Input
                  type="number"
                  value={workingBlock.content.height || 400}
                  onChange={(e) => handleContentChange("height", Number.parseInt(e.target.value, 10))}
                  placeholder="400"
                />
                <Label className="text-sm font-medium mt-4">{lang === "ar" ? "مستوى التكبير" : "Zoom Level"}</Label>
                <Input
                  type="number"
                  value={workingBlock.content.zoom || 12}
                  onChange={(e) => handleContentChange("zoom", Number.parseInt(e.target.value, 10))}
                  placeholder="12"
                />
              </>
            )}

            {block.type === "social-links" && (
              <>
                <Label className="text-sm font-medium">{lang === "ar" ? "روابط" : "Links"}</Label>
                <div className="space-y-2">
                  {(workingBlock.content.links || []).map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={link.url || ""}
                        onChange={(e) => {
                          const updatedLinks = [...(workingBlock.content.links || [])]
                          updatedLinks[index].url = e.target.value
                          handleContentChange("links", updatedLinks)
                        }}
                        placeholder="URL"
                      />
                      <select
                        value={link.platform || "facebook"}
                        onChange={(e) => {
                          const updatedLinks = [...(workingBlock.content.links || [])]
                          updatedLinks[index].platform = e.target.value
                          handleContentChange("links", updatedLinks)
                        }}
                        className="flex h-10 w-[120px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="website">Website</option>
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updatedLinks = [...(workingBlock.content.links || [])]
                          updatedLinks.splice(index, 1)
                          handleContentChange("links", updatedLinks)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full bg-transparent"
                  onClick={() => {
                    handleContentChange("links", [
                      ...(workingBlock.content.links || []),
                      { platform: "facebook", url: "" },
                    ])
                  }}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {lang === "ar" ? "إضافة رابط" : "Add Link"}
                </Button>
              </>
            )}
          </>
        </TabsContent>

        <TabsContent value="style" className="mt-4">
          {renderStyleTab()}
        </TabsContent>
      </Tabs>
    )
  }

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
              <Button variant="outline" size="sm" onClick={handlePreviewToggle}>
                <Eye className="w-4 h-4 ml-2" />
                {language === "ar" ? "معاينة" : "Preview"}
              </Button>
              <Button onClick={handleSave} size="sm" className="bg-violet-600 hover:bg-violet-700" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === "ar" ? "جاري الحفظ..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    {language === "ar" ? "حفظ" : "Save"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {isPreviewMode ? (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{contentLanguage === "ar" ? pageData.titleAr : pageData.titleEn}</h2>
              <Button variant="outline" size="sm" onClick={handlePreviewToggle}>
                <X className="w-4 h-4 ml-2" />
                {language === "ar" ? "إغلاق المعاينة" : "Close Preview"}
              </Button>
            </div>
            <div className="space-y-4">{blocks.map((block) => renderBlockForPreview(block, contentLanguage))}</div>
          </div>
        ) : (
          <>
            {/* Sidebar - Page Settings */}
            <div className="grid lg:grid-cols-[380px_1fr] gap-8 max-w-[1800px] mx-auto">
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
                          <Label className="text-sm font-medium">
                            {language === "ar" ? "وصف SEO" : "SEO Description"}
                          </Label>
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
                            onChange={(e) =>
                              setPageData({
                                ...pageData,
                                titleEn: e.target.value,
                              })
                            }
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
                        <Button
                          onClick={() => {
                            setShowBlockModal(true)
                            setActiveContainer(null)
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          {language === "ar" ? "إضافة عنصر" : "Add Block"}
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="ar" className="mt-0">
                      {blocks.length === 0 && !showBlockMenu ? (
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
                          <Button
                            onClick={() => {
                              setShowBlockModal(true)
                              setActiveContainer(null)
                            }}
                            variant="outline"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            {language === "ar" ? "إضافة عنصر" : "Add Block"}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">{blocks.map((block) => renderBlockItem(block, undefined, 0))}</div>
                      )}
                    </TabsContent>

                    <TabsContent value="en" className="mt-0">
                      {blocks.length === 0 && !showBlockMenu ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                          <Type className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Start adding content</h3>
                          <p className="text-muted-foreground mb-4">Click 'Add Block' to build your page</p>
                          <Button
                            onClick={() => {
                              setShowBlockModal(true)
                              setActiveContainer(null)
                            }}
                            variant="outline"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            Add Block
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">{blocks.map((block) => renderBlockItem(block, undefined, 0))}</div>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeContainer
                ? language === "ar"
                  ? "اختر عنصر لإضافته إلى العمود"
                  : "Choose a Block to Add to Column"
                : language === "ar"
                  ? "اختر نوع العنصر"
                  : "Choose Block Type"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Blocks */}
            <div>
              <h3 className="text-lg font-bold mb-2">{language === "ar" ? "عناصر أساسية" : "Basic Blocks"}</h3>
              <div className="grid grid-cols-2 gap-4">
                {basicBlocks.map((blockType) => {
                  const IconComponent = blockType.icon
                  return (
                    <Button
                      key={blockType.type}
                      onClick={() => {
                        addBlock(blockType.type, activeContainer?.blockId, activeContainer?.columnIndex)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <IconComponent className="w-4 h-4 ml-2" />
                      {blockType.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Layout Blocks */}
            <div>
              <h3 className="text-lg font-bold mb-2">{language === "ar" ? "عناصر التخطيط" : "Layout Blocks"}</h3>
              <div className="grid grid-cols-2 gap-4">
                {layoutBlocks.map((blockType) => {
                  const IconComponent = blockType.icon
                  return (
                    <Button
                      key={blockType.type}
                      onClick={() => {
                        addBlock(blockType.type, activeContainer?.blockId, activeContainer?.columnIndex)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <IconComponent className="w-4 h-4 ml-2" />
                      {blockType.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Component Blocks */}
            <div>
              <h3 className="text-lg font-bold mb-2">{language === "ar" ? "عناصر المكونات" : "Component Blocks"}</h3>
              <div className="grid grid-cols-2 gap-4">
                {componentBlocks.map((blockType) => {
                  const IconComponent = blockType.icon
                  return (
                    <Button
                      key={blockType.type}
                      onClick={() => {
                        addBlock(blockType.type, activeContainer?.blockId, activeContainer?.columnIndex)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <IconComponent className="w-4 h-4 ml-2" />
                      {blockType.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Home Blocks */}
            <div>
              <h3 className="text-lg font-bold mb-2">{language === "ar" ? "الصفحات الرئيسية" : "Home Blocks"}</h3>
              <div className="grid grid-cols-2 gap-4">
                {homeBlocks.map((blockType) => {
                  const IconComponent = blockType.icon
                  return (
                    <Button
                      key={blockType.type}
                      onClick={() => {
                        addBlock(blockType.type, activeContainer?.blockId, activeContainer?.columnIndex)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <IconComponent className="w-4 h-4 ml-2" />
                      {blockType.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingBlock}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBlock(null)
            setTempBlockChanges(null)
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === "ar" ? "إعدادات العنصر" : "Block Settings"} -{" "}
              {blockTypes.find((b) => b.type === editingBlock?.type)?.label || editingBlock?.type}
            </DialogTitle>
          </DialogHeader>

          {editingBlock && (
            <div className="space-y-6 py-4">
              <Tabs value={contentLanguage} onValueChange={(v) => setContentLanguage(v as "ar" | "en")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="ar" className="space-y-4 mt-4">
                  {renderBlockSettings(editingBlock, "ar")}
                </TabsContent>

                <TabsContent value="en" className="space-y-4 mt-4">
                  {renderBlockSettings(editingBlock, "en")}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingBlock(null)
                    setTempBlockChanges(null)
                  }}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  onClick={() => {
                    if (tempBlockChanges && editingBlock) {
                      updateBlock(editingBlock.id, tempBlockChanges.content || {}, tempBlockChanges.styles)
                    }
                    setEditingBlock(null)
                    setTempBlockChanges(null)
                  }}
                >
                  {language === "ar" ? "حفظ" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
