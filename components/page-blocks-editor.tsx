"use client"

import { useState } from "react"
import { PageBlocks } from "./page-blocks-editor-core"
import type { PageBlocksValue, Block } from "./page-builder/types"
import { Button } from "@/components/ui/button"
import { Sparkles, Code, FileCode } from "lucide-react"
import { TemplatesModal } from "./page-builder/templates-modal"
import { CustomCssModal } from "./page-builder/custom-css-modal"
import { CustomJsModal } from "./page-builder/custom-js-modal"
import type { BlockTemplate } from "@/lib/types/block-templates"

interface PageBlocksEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  customCss?: string
  customJs?: string
  onCustomCssChange?: (css: string) => void
  onCustomJsChange?: (js: string) => void
  editingLanguage?: "ar" | "en"
}

export function PageBlocksEditor({
  blocks,
  onChange,
  customCss = "",
  customJs = "",
  onCustomCssChange,
  onCustomJsChange,
  editingLanguage = "ar"
}: PageBlocksEditorProps) {
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [cssModalOpen, setCssModalOpen] = useState(false)
  const [jsModalOpen, setJsModalOpen] = useState(false)

  // Pass blocks to the correct language array based on editingLanguage
  const value: PageBlocksValue = {
    blocksAr: editingLanguage === "ar" ? blocks : [],
    blocksEn: editingLanguage === "en" ? blocks : [],
    blocks // Keep for backward compatibility
  }

  const handleChange = (newValue: PageBlocksValue) => {
    // Return blocks based on the current editing language
    if (editingLanguage === "en") {
      onChange(newValue.blocksEn || [])
    } else {
      onChange(newValue.blocksAr || [])
    }
  }

  const handleSelectTemplate = (template: BlockTemplate) => {
    // Deep clone blocks and regenerate all IDs to avoid conflicts
    const clonedBlocks = template.blocks.map(block => {
      const cloned = JSON.parse(JSON.stringify(block))
      cloned.id = crypto.randomUUID()
      // Also regenerate IDs for nested items if they exist
      if (cloned.items && Array.isArray(cloned.items)) {
        cloned.items = cloned.items.map((item: any) => ({
          ...item,
          id: crypto.randomUUID()
        }))
      }
      if (cloned.slides && Array.isArray(cloned.slides)) {
        cloned.slides = cloned.slides.map((slide: any) => ({
          ...slide,
          id: crypto.randomUUID()
        }))
      }
      if (cloned.stats && Array.isArray(cloned.stats)) {
        cloned.stats = cloned.stats.map((stat: any) => ({
          ...stat,
          id: crypto.randomUUID()
        }))
      }
      if (cloned.featureCards && Array.isArray(cloned.featureCards)) {
        cloned.featureCards = cloned.featureCards.map((card: any) => ({
          ...card,
          id: crypto.randomUUID()
        }))
      }
      return cloned
    })
    const newBlocks = [...blocks, ...clonedBlocks]
    onChange(newBlocks)
  }

  const handleSaveCss = (css: string) => {
    if (onCustomCssChange) {
      onCustomCssChange(css)
    }
  }

  const handleSaveJs = (js: string) => {
    if (onCustomJsChange) {
      onCustomJsChange(js)
    }
  }

  return (
    <div className="space-y-4">
      <PageBlocks
        mode="edit"
        value={value}
        onChange={handleChange}
        customCss={customCss}
        customJs={customJs}
        onOpenTemplates={() => setTemplatesOpen(true)}
        onOpenCss={() => setCssModalOpen(true)}
        onOpenJs={() => setJsModalOpen(true)}
        editingLanguage={editingLanguage}
      />

      <TemplatesModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <CustomCssModal
        open={cssModalOpen}
        onClose={() => setCssModalOpen(false)}
        initialCss={customCss}
        onSave={handleSaveCss}
        language={editingLanguage}
      />

      <CustomJsModal
        open={jsModalOpen}
        onClose={() => setJsModalOpen(false)}
        initialJs={customJs}
        onSave={handleSaveJs}
        language={editingLanguage}
      />
    </div>
  )
}

export type { Block } from "./page-builder/types"
