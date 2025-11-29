"use client"

import { useState } from "react"
import { PageBlocks, type PageBlocksValue } from "./page-blocks-editor-core"
import type { Block } from "./page-blocks-editor-core"
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
}

export function PageBlocksEditor({
  blocks,
  onChange,
  customCss = "",
  customJs = "",
  onCustomCssChange,
  onCustomJsChange
}: PageBlocksEditorProps) {
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [cssModalOpen, setCssModalOpen] = useState(false)
  const [jsModalOpen, setJsModalOpen] = useState(false)

  const value: PageBlocksValue = { blocks }

  const handleChange = (newValue: PageBlocksValue) => {
    onChange(newValue.blocks)
  }

  const handleSelectTemplate = (template: BlockTemplate) => {
    const newBlocks = [...blocks, ...template.blocks]
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
      />

      <CustomJsModal
        open={jsModalOpen}
        onClose={() => setJsModalOpen(false)}
        initialJs={customJs}
        onSave={handleSaveJs}
      />
    </div>
  )
}

export type { Block } from "./page-blocks-editor-core"
