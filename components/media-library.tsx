"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Search,
  Upload,
  LinkIcon,
  Sparkles,
  Grid3X3,
  List,
  Filter,
  X,
  Image as ImageIcon,
  FileVideo,
  FileText,
  File,
  Trash2,
  Edit2,
  Check,
  Loader2,
  FolderOpen,
  Eye,
  ExternalLink,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  getMediaItems,
  saveMediaItem,
  updateMediaItem,
  deleteMediaItem,
  getMediaCategories,
  type MediaItem,
} from "@/lib/storage"
import { uploadFileToStorage } from "@/lib/firebase"

interface MediaLibraryProps {
  language?: "ar" | "en"
  onSelect?: (item: MediaItem) => void
  selectable?: boolean
  showActions?: boolean
  initialCategory?: string
}

const ITEMS_PER_PAGE = 20

export function MediaLibrary({
  language = "ar",
  onSelect,
  selectable = false,
  showActions = true,
  initialCategory,
}: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [displayedItems, setDisplayedItems] = useState<MediaItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Upload dialog state
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url" | "ai">("upload")
  const [uploadUrl, setUploadUrl] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit dialog state
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [editForm, setEditForm] = useState<Partial<MediaItem>>({})

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Preview dialog state
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)

  // Scroll container ref for lazy loading
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const isAr = language === "ar"

  const t = {
    title: isAr ? "مكتبة الوسائط" : "Media Library",
    search: isAr ? "بحث..." : "Search...",
    upload: isAr ? "رفع ملف" : "Upload File",
    uploadUrl: isAr ? "رابط" : "URL",
    uploadFile: isAr ? "رفع" : "Upload",
    uploadAi: isAr ? "ذكاء اصطناعي" : "AI",
    category: isAr ? "التصنيف" : "Category",
    allCategories: isAr ? "جميع التصنيفات" : "All Categories",
    type: isAr ? "النوع" : "Type",
    allTypes: isAr ? "جميع الأنواع" : "All Types",
    images: isAr ? "صور" : "Images",
    videos: isAr ? "فيديوهات" : "Videos",
    documents: isAr ? "مستندات" : "Documents",
    other: isAr ? "أخرى" : "Other",
    noItems: isAr ? "لا توجد عناصر" : "No items found",
    loadMore: isAr ? "تحميل المزيد" : "Load More",
    select: isAr ? "اختيار" : "Select",
    edit: isAr ? "تعديل" : "Edit",
    delete: isAr ? "حذف" : "Delete",
    cancel: isAr ? "إلغاء" : "Cancel",
    save: isAr ? "حفظ" : "Save",
    confirmDelete: isAr ? "هل أنت متأكد من حذف هذا العنصر؟" : "Are you sure you want to delete this item?",
    uploadTitle: isAr ? "إضافة وسائط" : "Add Media",
    enterUrl: isAr ? "أدخل رابط الملف" : "Enter file URL",
    aiPromptPlaceholder: isAr ? "صف الصورة التي تريدها..." : "Describe the image you want...",
    generate: isAr ? "توليد" : "Generate",
    generating: isAr ? "جاري التوليد..." : "Generating...",
    uploading: isAr ? "جاري الرفع..." : "Uploading...",
    newCategory: isAr ? "تصنيف جديد" : "New Category",
    titleAr: isAr ? "العنوان (عربي)" : "Title (Arabic)",
    titleEn: isAr ? "العنوان (إنجليزي)" : "Title (English)",
    descriptionAr: isAr ? "الوصف (عربي)" : "Description (Arabic)",
    descriptionEn: isAr ? "الوصف (إنجليزي)" : "Description (English)",
    editMedia: isAr ? "تعديل الوسائط" : "Edit Media",
    dropFiles: isAr ? "اسحب الملفات هنا أو انقر للاختيار" : "Drop files here or click to select",
    uploadDescription: isAr ? "اختر طريقة إضافة الوسائط" : "Choose how to add media",
    editDescription: isAr ? "تعديل بيانات الوسائط" : "Edit media details",
    uploadFailed: isAr ? "فشل في رفع الملف. تأكد من إعدادات الخادم." : "Failed to upload file. Check server configuration.",
    preview: isAr ? "معاينة" : "Preview",
    openInNewTab: isAr ? "فتح في تبويب جديد" : "Open in new tab",
    copyUrl: isAr ? "نسخ الرابط" : "Copy URL",
    copied: isAr ? "تم النسخ!" : "Copied!",
    close: isAr ? "إغلاق" : "Close",
  }

  // Load initial data
  useEffect(() => {
    loadData()

    const handleStorageChange = () => {
      loadData()
    }

    window.addEventListener("localStorageChange", handleStorageChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [mediaItems, mediaCategories] = await Promise.all([
        getMediaItems(),
        getMediaCategories(),
      ])
      setItems(mediaItems)
      setCategories(mediaCategories)
    } catch (error) {
      console.error("Error loading media:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter items when search/category/type changes
  useEffect(() => {
    let filtered = [...items]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.originalName.toLowerCase().includes(query) ||
          item.titleAr?.toLowerCase().includes(query) ||
          item.titleEn?.toLowerCase().includes(query) ||
          item.descriptionAr?.toLowerCase().includes(query) ||
          item.descriptionEn?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Filter by type
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType)
    }

    setFilteredItems(filtered)
    setPage(1)
    setDisplayedItems(filtered.slice(0, ITEMS_PER_PAGE))
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }, [items, searchQuery, selectedCategory, selectedType])

  // Lazy load more items
  const loadMoreItems = useCallback(() => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = page + 1
    const start = (nextPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const newItems = filteredItems.slice(0, end)

    setDisplayedItems(newItems)
    setPage(nextPage)
    setHasMore(end < filteredItems.length)
    setLoadingMore(false)
  }, [page, filteredItems, hasMore, loadingMore])

  // Intersection observer for lazy loading
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreItems()
        }
      },
      { root: container, threshold: 0.1 }
    )

    const sentinel = document.getElementById("load-more-sentinel")
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => observer.disconnect()
  }, [hasMore, loadingMore, loadMoreItems])

  // Handle file upload - uses client-side Firebase upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Upload directly to Firebase Storage from client
        const data = await uploadFileToStorage(file, "media")

        // Determine file type
        const mimeType = file.type
        let type: MediaItem["type"] = "other"
        if (mimeType.startsWith("image/")) type = "image"
        else if (mimeType.startsWith("video/")) type = "video"
        else if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) type = "document"

        // Save to media library
        const mediaItemData: Parameters<typeof saveMediaItem>[0] = {
          url: data.url,
          filename: data.filename,
          originalName: file.name,
          type,
          mimeType: file.type,
          size: file.size,
          source: "upload",
        }
        if (newCategory) {
          mediaItemData.category = newCategory
        }
        await saveMediaItem(mediaItemData)
      }

      await loadData()
      setShowUploadDialog(false)
      setNewCategory("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert(t.uploadFailed)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle URL upload
  const handleUrlUpload = async () => {
    if (!uploadUrl) return

    setIsUploading(true)
    try {
      // Determine type from URL extension
      const ext = uploadUrl.split(".").pop()?.toLowerCase() || ""
      let type: MediaItem["type"] = "other"
      let mimeType = "application/octet-stream"

      if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
        type = "image"
        mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`
      } else if (["mp4", "webm", "mov", "avi"].includes(ext)) {
        type = "video"
        mimeType = `video/${ext}`
      } else if (["pdf", "doc", "docx", "txt"].includes(ext)) {
        type = "document"
        mimeType = ext === "pdf" ? "application/pdf" : "application/octet-stream"
      }

      const filename = uploadUrl.split("/").pop() || "file"

      await saveMediaItem({
        url: uploadUrl,
        filename,
        originalName: filename,
        type,
        mimeType,
        size: 0,
        category: newCategory || undefined,
        source: "url",
      })

      await loadData()
      setShowUploadDialog(false)
      setUploadUrl("")
      setNewCategory("")
    } catch (error) {
      console.error("URL upload error:", error)
      alert(isAr ? "فشل في إضافة الرابط" : "Failed to add URL")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle AI generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return

    setIsUploading(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) throw new Error("Failed to generate image")

      const data = await response.json()

      await saveMediaItem({
        url: data.imageUrl,
        filename: `ai-generated-${Date.now()}.png`,
        originalName: `AI: ${aiPrompt.substring(0, 50)}`,
        type: "image",
        mimeType: "image/png",
        size: 0,
        category: newCategory || undefined,
        source: "ai",
        descriptionAr: aiPrompt,
        descriptionEn: aiPrompt,
      })

      await loadData()
      setShowUploadDialog(false)
      setAiPrompt("")
      setNewCategory("")
    } catch (error) {
      console.error("AI generation error:", error)
      alert(isAr ? "فشل في توليد الصورة" : "Failed to generate image")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle edit save
  const handleEditSave = async () => {
    if (!editingItem) return

    try {
      await updateMediaItem(editingItem.id, editForm)
      await loadData()
      setEditingItem(null)
      setEditForm({})
    } catch (error) {
      console.error("Edit error:", error)
      alert(isAr ? "فشل في حفظ التعديلات" : "Failed to save changes")
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id)
      await loadData()
      setDeleteConfirm(null)
    } catch (error) {
      console.error("Delete error:", error)
      alert(isAr ? "فشل في الحذف" : "Failed to delete")
    }
  }

  // Get type icon
  const getTypeIcon = (type: MediaItem["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "video":
        return <FileVideo className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "N/A"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground", isAr ? "right-3" : "left-3")} />
            <Input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("w-full md:w-80", isAr ? "pr-10" : "pl-10")}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.category} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCategories}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t.type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="image">{t.images}</SelectItem>
              <SelectItem value="video">{t.videos}</SelectItem>
              <SelectItem value="document">{t.documents}</SelectItem>
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {showActions && (
            <Button onClick={() => setShowUploadDialog(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              {t.upload}
            </Button>
          )}
        </div>
      </div>

      {/* Media Grid/List */}
      <div
        ref={scrollContainerRef}
        className="overflow-auto max-h-[calc(100vh-300px)] min-h-[400px]"
      >
        {displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <FolderOpen className="w-16 h-16 mb-4" />
            <p className="text-lg">{t.noItems}</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-200",
                  selectable && "cursor-pointer hover:ring-2 hover:ring-primary"
                )}
                onClick={() => selectable && onSelect?.(item)}
              >
                {/* Preview */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.titleAr || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                  )}

                  {/* Type Badge */}
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 text-xs"
                  >
                    {getTypeIcon(item.type)}
                  </Badge>

                  {/* Source Badge */}
                  {item.source === "ai" && (
                    <Badge className="absolute top-2 right-2 text-xs bg-purple-500">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {/* Preview Button - Always show */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewItem(item)
                      }}
                      title={t.preview}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {showActions && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingItem(item)
                            setEditForm({
                              titleAr: item.titleAr,
                              titleEn: item.titleEn,
                              descriptionAr: item.descriptionAr,
                              descriptionEn: item.descriptionEn,
                              category: item.category,
                            })
                          }}
                          title={t.edit}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm(item.id)
                          }}
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-sm font-medium truncate">
                    {isAr ? item.titleAr || item.originalName : item.titleEn || item.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatSize(item.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-4 p-3 bg-card rounded-lg border hover:shadow-md transition-all duration-200",
                  selectable && "cursor-pointer hover:ring-2 hover:ring-primary"
                )}
                onClick={() => selectable && onSelect?.(item)}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.titleAr || item.originalName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {isAr ? item.titleAr || item.originalName : item.titleEn || item.originalName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatSize(item.size)}</span>
                    {item.category && (
                      <>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </>
                    )}
                    {item.source === "ai" && (
                      <Badge className="text-xs bg-purple-500">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {/* Preview Button - Always show */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewItem(item)
                    }}
                    title={t.preview}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {showActions && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingItem(item)
                          setEditForm({
                            titleAr: item.titleAr,
                            titleEn: item.titleEn,
                            descriptionAr: item.descriptionAr,
                            descriptionEn: item.descriptionEn,
                            category: item.category,
                          })
                        }}
                        title={t.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm(item.id)
                        }}
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more sentinel */}
        {hasMore && (
          <div id="load-more-sentinel" className="flex justify-center py-8">
            {loadingMore ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <Button variant="outline" onClick={loadMoreItems}>
                {t.loadMore}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.uploadTitle}</DialogTitle>
            <DialogDescription>{t.uploadDescription}</DialogDescription>
          </DialogHeader>

          <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="w-4 h-4" />
                {t.uploadFile}
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon className="w-4 h-4" />
                {t.uploadUrl}
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="w-4 h-4" />
                {t.uploadAi}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t.dropFiles}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.enterUrl}</Label>
                <Input
                  type="url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.aiPromptPlaceholder}</Label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={t.aiPromptPlaceholder}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>{t.category}</Label>
            <Select value={newCategory || "__none__"} onValueChange={(v) => setNewCategory(v === "__none__" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">{t.allCategories}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={t.newCategory}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                if (uploadMethod === "upload") {
                  fileInputRef.current?.click()
                } else if (uploadMethod === "url") {
                  handleUrlUpload()
                } else {
                  handleAiGenerate()
                }
              }}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploadMethod === "ai" ? t.generating : t.uploading}
                </>
              ) : uploadMethod === "ai" ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t.generate}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t.upload}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editMedia}</DialogTitle>
            <DialogDescription>{t.editDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {editingItem?.type === "image" && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={editingItem.url}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.titleAr}</Label>
                <Input
                  value={editForm.titleAr || ""}
                  onChange={(e) => setEditForm({ ...editForm, titleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.titleEn}</Label>
                <Input
                  value={editForm.titleEn || ""}
                  onChange={(e) => setEditForm({ ...editForm, titleEn: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.descriptionAr}</Label>
                <Textarea
                  value={editForm.descriptionAr || ""}
                  onChange={(e) => setEditForm({ ...editForm, descriptionAr: e.target.value })}
                  dir="rtl"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.descriptionEn}</Label>
                <Textarea
                  value={editForm.descriptionEn || ""}
                  onChange={(e) => setEditForm({ ...editForm, descriptionEn: e.target.value })}
                  dir="ltr"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.category}</Label>
              <Select
                value={editForm.category || "__none__"}
                onValueChange={(v) => setEditForm({ ...editForm, category: v === "__none__" ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t.allCategories}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              {t.cancel}
            </Button>
            <Button onClick={handleEditSave}>
              <Check className="w-4 h-4 mr-2" />
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.delete}</DialogTitle>
            <DialogDescription>{t.confirmDelete}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getTypeIcon(previewItem?.type || "other")}
              {isAr ? previewItem?.titleAr || previewItem?.originalName : previewItem?.titleEn || previewItem?.originalName}
            </DialogTitle>
            <DialogDescription>
              {previewItem?.category && (
                <Badge variant="outline" className="mr-2">
                  {previewItem.category}
                </Badge>
              )}
              {formatSize(previewItem?.size || 0)}
              {previewItem?.source === "ai" && (
                <Badge className="ml-2 bg-purple-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
              {previewItem?.source === "url" && (
                <Badge variant="secondary" className="ml-2">
                  <LinkIcon className="w-3 h-3 mr-1" />
                  URL
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4">
            {previewItem?.type === "image" ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <img
                  src={previewItem.url}
                  alt={previewItem.titleAr || previewItem.originalName}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            ) : previewItem?.type === "video" ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <video
                  src={previewItem.url}
                  controls
                  className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
                >
                  {isAr ? "متصفحك لا يدعم عرض الفيديو" : "Your browser does not support video playback"}
                </video>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
                {getTypeIcon(previewItem?.type || "other")}
                <p className="mt-4 text-lg font-medium">{previewItem?.originalName}</p>
                <p className="text-sm">{previewItem?.mimeType}</p>
              </div>
            )}
          </div>

          {/* URL Display */}
          {previewItem && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <Label className="text-xs text-muted-foreground mb-1 block">URL</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background p-2 rounded border overflow-x-auto" dir="ltr">
                  {previewItem.url}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(previewItem.url)
                    alert(t.copied)
                  }}
                  title={t.copyUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewItem.url, "_blank")}
                  title={t.openInNewTab}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewItem(null)}>
              {t.close}
            </Button>
            {selectable && previewItem && (
              <Button onClick={() => {
                onSelect?.(previewItem)
                setPreviewItem(null)
              }}>
                <Check className="w-4 h-4 mr-2" />
                {t.select}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
