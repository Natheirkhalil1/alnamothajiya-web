"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Sparkles, Layout, Heart, MessageSquare, Zap, FileText } from "lucide-react"
import { blockTemplates, type BlockTemplate } from "@/lib/types/block-templates"
import { PageBlocks } from "@/components/page-blocks-editor-core"
import { useLanguage } from "@/lib/language-context"

interface TemplatesModalProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: BlockTemplate) => void
}

export function TemplatesModal({ open, onClose, onSelectTemplate }: TemplatesModalProps) {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "hero", nameEn: "Hero Sections", nameAr: "الأقسام الرئيسية", icon: Layout, color: "blue" },
    { id: "about", nameEn: "About Sections", nameAr: "أقسام من نحن", icon: FileText, color: "green" },
    { id: "features", nameEn: "Features", nameAr: "المميزات", icon: Sparkles, color: "purple" },
    { id: "testimonials", nameEn: "Testimonials", nameAr: "الآراء", icon: MessageSquare, color: "amber" },
    { id: "cta", nameEn: "Call to Action", nameAr: "دعوة للعمل", icon: Zap, color: "red" },
    { id: "complex", nameEn: "Full Pages", nameAr: "صفحات كاملة", icon: Heart, color: "pink" },
  ]

  const filteredTemplates = blockTemplates.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.nameAr.includes(searchQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-4 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {language === "ar" ? "الأقسام الجاهزة" : "Ready-Made Templates"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={language === "ar" ? "ابحث عن قالب..." : "Search for a template..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                {language === "ar" ? "الكل" : "All"}
                <Badge variant="secondary" className="ml-2">
                  {blockTemplates.length}
                </Badge>
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                const count = blockTemplates.filter((t) => t.category === category.id).length;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {language === "ar" ? category.nameAr : category.nameEn}
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>{language === "ar" ? "لم يتم العثور على قوالب" : "No templates found"}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
                      {/* Real blocks preview */}
                      <div className="absolute inset-0 overflow-hidden bg-white">
                        <div className="origin-top-left transform scale-[0.25] w-[400%] h-[400%] pointer-events-none">
                          <PageBlocks mode="view" value={{ blocks: template.blocks }} />
                        </div>
                      </div>

                      {/* Thumbnail overlay */}
                      {template.thumbnail && (
                        <img
                          src={template.thumbnail || "/placeholder.svg"}
                          alt={language === "ar" ? template.nameAr : template.nameEn}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Category badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-primary">
                          {categories.find((c) => c.id === template.category)?.[language === "ar" ? "nameAr" : "nameEn"]}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {language === "ar" ? template.nameAr : template.nameEn}
                        </h3>
                        <p className="text-sm text-gray-100 line-clamp-2 drop-shadow">
                          {language === "ar" ? template.descriptionAr : template.descriptionEn}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Layout className="w-4 h-4" />
                            {template.blocks.length} {language === "ar" ? "بلوك" : "blocks"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            {language === "ar" ? "جاهز" : "Ready"}
                          </span>
                        </div>
                        <Button size="sm" className="group-hover:scale-110 transition-transform">
                          {language === "ar" ? "استخدم" : "Use"}
                          <Sparkles className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
