"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, LinkIcon, X, Sparkles, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaPicker } from "@/components/media-picker"
import { saveMediaItem, type MediaItem } from "@/lib/storage"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  language?: "ar" | "en"
}

export function ImageUpload({ value, onChange, label, language = "ar" }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value)
  const [uploadMethod, setUploadMethod] = useState<"library" | "upload" | "url" | "ai">("library")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  // Sync with external value
  useEffect(() => {
    setImageUrl(value)
  }, [value])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()

        // Save to media library
        await saveMediaItem({
          url: data.url,
          filename: data.filename,
          originalName: file.name,
          type: "image",
          mimeType: file.type,
          size: file.size,
          source: "upload",
        })

        setImageUrl(data.url)
        onChange(data.url)
      } catch (error) {
        console.error("Error uploading file:", error)
        alert(language === "ar" ? "فشل في رفع الصورة" : "Failed to upload image")
      }
    }
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    onChange(url)
  }

  const handleUrlConfirm = async () => {
    if (!imageUrl) return

    try {
      // Save URL to media library
      const ext = imageUrl.split(".").pop()?.toLowerCase() || ""
      let mimeType = "image/jpeg"
      if (["png", "gif", "webp", "svg"].includes(ext)) {
        mimeType = `image/${ext}`
      }

      await saveMediaItem({
        url: imageUrl,
        filename: imageUrl.split("/").pop() || "image",
        originalName: imageUrl.split("/").pop() || "image",
        type: "image",
        mimeType,
        size: 0,
        source: "url",
      })
    } catch (error) {
      console.error("Error saving to media library:", error)
    }
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) throw new Error("Failed to generate image")

      const data = await response.json()

      // Save to media library
      await saveMediaItem({
        url: data.imageUrl,
        filename: `ai-generated-${Date.now()}.png`,
        originalName: `AI: ${aiPrompt.substring(0, 50)}`,
        type: "image",
        mimeType: "image/png",
        size: 0,
        source: "ai",
        descriptionAr: aiPrompt,
        descriptionEn: aiPrompt,
      })

      setImageUrl(data.imageUrl)
      onChange(data.imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
      alert(language === "ar" ? "فشل في توليد الصورة" : "Failed to generate image")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleMediaSelect = (item: MediaItem) => {
    setImageUrl(item.url)
    onChange(item.url)
    setShowMediaPicker(false)
  }

  const clearImage = () => {
    setImageUrl("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isAr = language === "ar"

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      <Tabs
        value={uploadMethod}
        onValueChange={(v) => setUploadMethod(v as "library" | "upload" | "url" | "ai")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            {isAr ? "المكتبة" : "Library"}
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <LinkIcon className="w-4 h-4" />
            {isAr ? "رابط" : "URL"}
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            {isAr ? "رفع" : "Upload"}
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="w-4 h-4" />
            {isAr ? "AI" : "AI"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full h-32 border-dashed text-lg"
            onClick={() => setShowMediaPicker(true)}
          >
            <div className="flex flex-col items-center gap-3">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
              <span className="text-base text-muted-foreground font-medium">
                {isAr ? "اختيار من مكتبة الوسائط" : "Select from Media Library"}
              </span>
            </div>
          </Button>
        </TabsContent>

        <TabsContent value="url" className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleUrlConfirm}
              placeholder={isAr ? "أدخل رابط الصورة" : "Enter image URL"}
              dir="ltr"
              className="flex-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div className="flex gap-2">
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={isAr ? "صف الصورة التي تريدها..." : "Describe the image you want..."}
              dir={isAr ? "rtl" : "ltr"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  handleAiGenerate()
                }
              }}
            />
            <Button type="button" onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt.trim()}>
              {isGenerating ? (
                isAr ? (
                  "جاري التوليد..."
                ) : (
                  "Generating..."
                )
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isAr ? "توليد" : "Generate"}
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {imageUrl && (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30 p-2">
          <img src={imageUrl || "/placeholder.svg"} alt="Preview" className="w-full h-40 object-cover rounded-md" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Media Picker Dialog */}
      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
        language={language}
        filterType="image"
      />
    </div>
  )
}
