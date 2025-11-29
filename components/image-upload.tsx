"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, LinkIcon, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  language?: "ar" | "en"
}

export function ImageUpload({ value, onChange, label, language = "ar" }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value)
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url" | "ai">("url")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

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
      setImageUrl(data.imageUrl)
      onChange(data.imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
      alert(language === "ar" ? "فشل في توليد الصورة" : "Failed to generate image")
    } finally {
      setIsGenerating(false)
    }
  }

  const clearImage = () => {
    setImageUrl("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      <Tabs
        value={uploadMethod}
        onValueChange={(v) => setUploadMethod(v as "upload" | "url" | "ai")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="url" className="gap-2">
            <LinkIcon className="w-4 h-4" />
            {language === "ar" ? "رابط" : "URL"}
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            {language === "ar" ? "رفع" : "Upload"}
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="w-4 h-4" />
            {language === "ar" ? "ذكاء اصطناعي" : "AI"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3">
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={language === "ar" ? "أدخل رابط الصورة" : "Enter image URL"}
            dir="ltr"
          />
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
              placeholder={language === "ar" ? "صف الصورة التي تريدها..." : "Describe the image you want..."}
              dir={language === "ar" ? "rtl" : "ltr"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  handleAiGenerate()
                }
              }}
            />
            <Button type="button" onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt.trim()}>
              {isGenerating ? (
                language === "ar" ? (
                  "جاري التوليد..."
                ) : (
                  "Generating..."
                )
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {language === "ar" ? "توليد" : "Generate"}
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
    </div>
  )
}
