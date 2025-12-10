"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Search,
  Upload,
  LinkIcon,
  Sparkles,
  X,
  Image as ImageIcon,
  FileVideo,
  FileText,
  File,
  Loader2,
  FolderOpen,
  Check,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  getMediaItems,
  saveMediaItem,
  getMediaCategories,
  type MediaItem,
} from "@/lib/storage"
import { uploadFileToStorage } from "@/lib/firebase"

interface MediaPickerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect: (item: MediaItem) => void
  language?: "ar" | "en"
  filterType?: "image" | "video" | "document" | "all"
  title?: string
  trigger?: React.ReactNode
}

const ITEMS_PER_PAGE = 24

export function MediaPicker({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSelect,
  language = "ar",
  filterType = "all",
  title,
  trigger,
}: MediaPickerProps) {
  // Internal state for uncontrolled mode (when trigger is provided)
  const [internalOpen, setInternalOpen] = useState(false)

  // Use controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  const [items, setItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [displayedItems, setDisplayedItems] = useState<MediaItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  // Upload state
  const [showUploadTab, setShowUploadTab] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url" | "ai">("upload")
  const [uploadUrl, setUploadUrl] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [newCategory, setNewCategory] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isAr = language === "ar"

  const t = {
    title: title || (isAr ? "اختيار من مكتبة الوسائط" : "Select from Media Library"),
    search: isAr ? "بحث..." : "Search...",
    library: isAr ? "المكتبة" : "Library",
    upload: isAr ? "رفع جديد" : "Upload New",
    uploadUrl: isAr ? "رابط" : "URL",
    uploadFile: isAr ? "رفع" : "Upload",
    uploadAi: isAr ? "ذكاء اصطناعي" : "AI",
    category: isAr ? "التصنيف" : "Category",
    allCategories: isAr ? "جميع التصنيفات" : "All Categories",
    noItems: isAr ? "لا توجد عناصر" : "No items found",
    loadMore: isAr ? "تحميل المزيد" : "Load More",
    select: isAr ? "اختيار" : "Select",
    cancel: isAr ? "إلغاء" : "Cancel",
    enterUrl: isAr ? "أدخل رابط الملف" : "Enter file URL",
    aiPromptPlaceholder: isAr ? "صف الصورة التي تريدها..." : "Describe the image you want...",
    generate: isAr ? "توليد" : "Generate",
    generating: isAr ? "جاري التوليد..." : "Generating...",
    uploading: isAr ? "جاري الرفع..." : "Uploading...",
    newCategory: isAr ? "تصنيف جديد" : "New Category",
    dropFiles: isAr ? "اسحب الملفات هنا أو انقر للاختيار" : "Drop files here or click to select",
    selected: isAr ? "محدد" : "Selected",
  }

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      loadData()
      setSelectedItem(null)
      setSearchQuery("")
      setSelectedCategory("all")
    }
  }, [open])

  const loadData = async () => {
    setLoading(true)
    try {
      const [mediaItems, mediaCategories] = await Promise.all([
        getMediaItems(),
        getMediaCategories(),
      ])

      // Filter by type if specified
      let filtered = mediaItems
      if (filterType !== "all") {
        filtered = mediaItems.filter((item) => item.type === filterType)
      }

      setItems(filtered)
      setCategories(mediaCategories)
    } catch (error) {
      console.error("Error loading media:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter items
  useEffect(() => {
    let filtered = [...items]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.originalName.toLowerCase().includes(query) ||
          item.titleAr?.toLowerCase().includes(query) ||
          item.titleEn?.toLowerCase().includes(query) ||
          item.descriptionAr?.toLowerCase().includes(query) ||
          item.descriptionEn?.toLowerCase().includes(query)
      )
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
    setPage(1)
    setDisplayedItems(filtered.slice(0, ITEMS_PER_PAGE))
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }, [items, searchQuery, selectedCategory])

  const loadMoreItems = useCallback(() => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = page + 1
    const end = nextPage * ITEMS_PER_PAGE
    const newItems = filteredItems.slice(0, end)

    setDisplayedItems(newItems)
    setPage(nextPage)
    setHasMore(end < filteredItems.length)
    setLoadingMore(false)
  }, [page, filteredItems, hasMore, loadingMore])

  // Handle file upload - uses client-side Firebase upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    const fileArray = Array.from(files)
    const totalFiles = fileArray.length

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setUploadStatus(isAr ? `جاري رفع ${file.name}...` : `Uploading ${file.name}...`)

        // Upload directly to Firebase Storage from client with progress tracking
        const data = await uploadFileToStorage(file, "media", (progress) => {
          // Calculate overall progress across all files
          const fileProgress = progress / totalFiles
          const completedFilesProgress = (i / totalFiles) * 100
          setUploadProgress(completedFilesProgress + fileProgress)
        })

        const mimeType = file.type
        let type: MediaItem["type"] = "other"
        if (mimeType.startsWith("image/")) type = "image"
        else if (mimeType.startsWith("video/")) type = "video"
        else if (mimeType.includes("pdf") || mimeType.includes("document")) type = "document"

        setUploadStatus(isAr ? `جاري حفظ ${file.name}...` : `Saving ${file.name}...`)

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
        const newItem = await saveMediaItem(mediaItemData)

        // Select the newly uploaded item
        setSelectedItem(newItem)
      }

      setUploadProgress(100)
      setUploadStatus(isAr ? "تم الرفع بنجاح!" : "Upload complete!")

      // Brief delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500))

      await loadData()
      setShowUploadTab(false)
      setNewCategory("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert(isAr ? "فشل في رفع الملف" : "Failed to upload file")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStatus("")
    }
  }

  // Handle URL upload
  const handleUrlUpload = async () => {
    if (!uploadUrl) return

    setIsUploading(true)
    try {
      const ext = uploadUrl.split(".").pop()?.toLowerCase() || ""
      let type: MediaItem["type"] = "other"
      let mimeType = "application/octet-stream"

      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
        type = "image"
        mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`
      } else if (["mp4", "webm", "mov"].includes(ext)) {
        type = "video"
        mimeType = `video/${ext}`
      } else if (["pdf", "doc", "docx"].includes(ext)) {
        type = "document"
        mimeType = ext === "pdf" ? "application/pdf" : "application/octet-stream"
      }

      const filename = uploadUrl.split("/").pop() || "file"

      const newItem = await saveMediaItem({
        url: uploadUrl,
        filename,
        originalName: filename,
        type,
        mimeType,
        size: 0,
        category: newCategory || undefined,
        source: "url",
      })

      setSelectedItem(newItem)
      await loadData()
      setShowUploadTab(false)
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

      const newItem = await saveMediaItem({
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

      setSelectedItem(newItem)
      await loadData()
      setShowUploadTab(false)
      setAiPrompt("")
      setNewCategory("")
    } catch (error) {
      console.error("AI generation error:", error)
      alert(isAr ? "فشل في توليد الصورة" : "Failed to generate image")
    } finally {
      setIsUploading(false)
    }
  }

  const getTypeIcon = (type: MediaItem["type"]) => {
    switch (type) {
      case "image": return <ImageIcon className="w-4 h-4" />
      case "video": return <FileVideo className="w-4 h-4" />
      case "document": return <FileText className="w-4 h-4" />
      default: return <File className="w-4 h-4" />
    }
  }

  const handleConfirmSelection = () => {
    if (selectedItem) {
      onSelect(selectedItem)
      onOpenChange?.(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:!max-w-[95vw] !w-[min(1400px,95vw)] !h-[min(90vh,900px)] !max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={showUploadTab ? "upload" : "library"} onValueChange={(v) => setShowUploadTab(v === "upload")} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="library" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              {t.library}
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              {t.upload}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col overflow-hidden m-0">
            {/* Filters */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground", isAr ? "right-3" : "left-3")} />
                <Input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(isAr ? "pr-10" : "pl-10")}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allCategories}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Media Grid */}
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <FolderOpen className="w-16 h-16 mb-4" />
                  <p className="text-lg">{t.noItems}</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 p-1">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200",
                        selectedItem?.id === item.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-primary/50"
                      )}
                      onClick={() => setSelectedItem(item)}
                    >
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

                      {/* Selection indicator */}
                      {selectedItem?.id === item.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      )}

                      {/* Source badge */}
                      {item.source === "ai" && (
                        <Badge className="absolute top-1 right-1 text-[10px] px-1 py-0 bg-purple-500">
                          AI
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center py-4">
                  {loadingMore ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <Button variant="outline" size="sm" onClick={loadMoreItems}>
                      {t.loadMore}
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 m-0">
            <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
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

              <TabsContent value="upload" className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t.dropFiles}</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={filterType === "image" ? "image/*" : filterType === "video" ? "video/*" : "*"}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
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
                <Button onClick={handleUrlUpload} disabled={isUploading || !uploadUrl} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.uploading}
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      {t.upload}
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.aiPromptPlaceholder}</Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={t.aiPromptPlaceholder}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAiGenerate} disabled={isUploading || !aiPrompt.trim()} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t.generate}
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 mt-4">
              <Label>{t.category}</Label>
              <div className="flex gap-2">
                <Select value={newCategory || "__none__"} onValueChange={(v) => setNewCategory(v === "__none__" ? "" : v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t.category} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{t.allCategories}</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t.newCategory}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleConfirmSelection} disabled={!selectedItem}>
            <Check className="w-4 h-4 mr-2" />
            {t.select}
            {selectedItem && (
              <span className="ml-2 text-xs opacity-70">
                ({isAr ? selectedItem.titleAr || selectedItem.originalName : selectedItem.titleEn || selectedItem.originalName})
              </span>
            )}
          </Button>
        </DialogFooter>

        {/* Glowing Upload Progress Bar */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 z-50 rounded-b-lg overflow-hidden">
            {/* Status text */}
            <div className="flex items-center justify-between px-4 py-2 bg-background/90 backdrop-blur-sm border-t">
              <span className="text-sm font-medium text-primary">{uploadStatus}</span>
              <span className="text-sm font-bold text-primary">{Math.round(uploadProgress)}%</span>
            </div>
            {/* Progress bar container */}
            <div className="h-3 bg-muted/50 relative overflow-hidden">
              {/* Main progress bar with gradient */}
              <div
                className="h-full relative transition-all duration-300 ease-out"
                style={{
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 70%, hsl(var(--primary) / 0.8) 100%)',
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.2)',
                }}
              >
                {/* Animated shine effect */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    animation: 'shine 1.5s ease-in-out infinite',
                  }}
                />
                {/* Glowing edge pulse */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-4"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8))',
                    animation: 'pulse 1s ease-in-out infinite',
                  }}
                />
              </div>
              {/* Glow beneath the bar */}
              <div
                className="absolute top-0 h-6 transition-all duration-300 pointer-events-none"
                style={{
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(180deg, hsl(var(--primary) / 0.5) 0%, transparent 100%)',
                  filter: 'blur(8px)',
                }}
              />
            </div>
            {/* Inline keyframes for animations */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes shine {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(200%); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 0.5; }
                  50% { opacity: 1; }
                }
              `
            }} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
