"use client"

/**
 * PageBlocks.tsx
 *
 * Drop this file into: /components/PageBlocks.tsx
 *
 * What it gives you:
 * - A typed block-based page editor & renderer.
 * - `PageBlocks` component:
 *     - mode="edit" -> editing UI
 *     - mode="view" -> rendering only
 * - `BlocksRenderer` -> use for public pages (no editing).
 *
 * IMPORTANT:
 * - The nmTheme below uses placeholder Tailwind classes.
 * - To get pixel-perfect Namothajia style:
 *      1. Inspect your existing components with DevTools.
 *      2. Copy the real classes into nmTheme.* entries.
 *      3. The blocks will then match your live design.
 */

import * as React from "react"
import { motion } from "framer-motion"
import { useLanguage, LanguageProvider } from "@/lib/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlockStyles, BlockAnimations } from "@/lib/types/blocks"
import DOMPurify from "isomorphic-dompurify"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Import from modular page-builder system
import { getBlockEditor, getBlockView } from "./page-builder/registry"
import type { Block, BlockKind, BaseBlock, HeroBasicBlock, HeroSliderBlock, HeroSplitBlock, SectionHeaderBlock, SectionHeader, RichTextBlock, ImageWithTextBlock, HighlightBannerBlock, ProgramsGridBlock, ServicesListBlock, CurriculumOverviewBlock, StatsBlock, IconPointsBlock, TestimonialsBlock, LogosStripBlock, GalleryGridBlock, VideoHighlightBlock, StaffGridBlock, BoardOrTeamListBlock, StepsHorizontalBlock, TimelineVerticalBlock, FaqAccordionBlock, DownloadsListBlock, ContactSectionBlock, MapBlock, CtaStripBlock, ColumnsBlock, GridBlock, GalleryMasonryBlock, PricingTableBlock, VideoEmbedBlock, DownloadsListBlock as DownloadListBlock, NewsletterSignupBlock, DividerBlock, SpacerBlock, CustomHtmlBlock, SocialIconsBlock, PageBlocksValue } from "./page-builder/types"
import { nmTheme } from "./page-builder/theme"
import { createId, InputField, TextareaField, SelectField, SectionContainer, blockLabel, createDefaultBlock, ColorPalette, BLOCK_COLORS, TEXT_COLORS, SPACING_PRESETS, SHADOW_PRESETS, BORDER_WIDTH_PRESETS, BORDER_RADIUS_PRESETS, ANIMATION_PRESETS, DURATION_PRESETS } from "./page-builder/utils"
import { blockCategories } from "./page-builder/block-categories"
import { AddBlockModal } from "./page-builder/add-block-modal"
import { EditingLanguageProvider, useEditingLanguage } from "./page-builder/editing-language-context"

// Helper to normalize column slots data that may be corrupted from Firestore
function normalizeColumnSlots(data: any): Block[][] {
    if (!data) return []
    // Handle case where columnSlots itself is an object (corrupted from Firestore)
    let slots = data
    if (!Array.isArray(slots) && typeof slots === "object") {
        const restored: any[] = []
        for (const [key, value] of Object.entries(slots as Record<string, any>)) {
            if (key === "__isNestedArray") continue
            const index = parseInt(key, 10)
            if (!isNaN(index)) {
                restored[index] = value
            }
        }
        slots = restored
    }
    if (!Array.isArray(slots)) return []
    return slots.map(normalizeColumnBlocks)
}

// Helper to normalize column blocks data that may be corrupted from Firestore
function normalizeColumnBlocks(data: any): Block[] {
    if (!data) return []
    // Already an array
    if (Array.isArray(data)) return data
    // JSON string (from previous fix attempt)
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    // Object with __isNestedArray marker or numeric keys
    if (typeof data === "object") {
        const result: Block[] = []
        for (const [key, value] of Object.entries(data)) {
            if (key === "__isNestedArray") continue
            const index = parseInt(key, 10)
            if (!isNaN(index)) {
                result[index] = value as Block
            }
        }
        return result
    }
    return []
}


/* ========================================================================
 * 2) MAIN PUBLIC API
 * ======================================================================*/

export type PageBlocksMode = "view" | "edit"

interface PageBlocksProps {
  mode: PageBlocksMode
  value: PageBlocksValue
  onChange?: (value: PageBlocksValue) => void // required in edit mode
  className?: string
  customCss?: string
  customJs?: string
  onOpenTemplates?: () => void
  onOpenCss?: () => void
  onOpenJs?: () => void
  editingLanguage?: "ar" | "en" // language for editing mode
}

/**
 * PageBlocks
 * - mode="view" -> render only
 * - mode="edit" -> editor + live preview
 */
export function PageBlocks({ mode, value, onChange, className, customCss, customJs, onOpenTemplates, onOpenCss, onOpenJs, editingLanguage = "ar" }: PageBlocksProps) {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [settingsBlockId, setSettingsBlockId] = React.useState<string | null>(null)
  const [settingsBlockPath, setSettingsBlockPath] = React.useState<string[] | null>(null)
  const [draggedBlockId, setDraggedBlockId] = React.useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const isEdit = mode === "edit"
  if (isEdit && !onChange) {
    throw new Error("PageBlocks: onChange is required in edit mode")
  }

  // Apply custom JS when in view mode
  React.useEffect(() => {
    if (!isEdit && customJs) {
      try {
        // Execute custom JS in a safe manner
        const script = document.createElement('script')
        script.textContent = `
          (function() {
            try {
              ${customJs}
            } catch (error) {
              console.error('Custom JS execution error:', error);
            }
          })();
        `
        document.body.appendChild(script)
        return () => {
          document.body.removeChild(script)
        }
      } catch (error) {
        console.error('Error applying custom JS:', error)
      }
    }
  }, [isEdit, customJs])

  if (!isEdit) {
    // In view mode, show blocks based on active language
    // Use editingLanguage prop if provided (for preview), otherwise fall back to language context
    const viewLanguage = editingLanguage || language
    const blocksToRender = viewLanguage === "ar" ? (value.blocksAr || value.blocks || []) : (value.blocksEn || value.blocks || [])
    return (
      <LanguageProvider initialLanguage={viewLanguage}>
        <div className={className}>
          {customCss && (
            <style dangerouslySetInnerHTML={{ __html: customCss }} />
          )}
          <BlocksRenderer blocks={blocksToRender} />
        </div>
      </LanguageProvider>
    )
  }

  // In edit mode, work with the blocks for the active editing language
  // Fallback to empty array if blocks don't exist yet, or to legacy blocks array
  const currentBlocks = editingLanguage === "ar"
    ? (value.blocksAr || value.blocks || [])
    : (value.blocksEn || value.blocks || [])

  const findBlockByPath = (blocks: Block[], path: string[]): Block | null => {
    if (!blocks || path.length === 0) return null
    if (path.length === 1) {
      return blocks.find((b) => b.id === path[0]) || null
    }
    const containerBlock = blocks.find((b) => b.id === path[0])
    if (!containerBlock || (containerBlock.kind !== "columns" && containerBlock.kind !== "grid")) {
      return null
    }
    // Search through nested blocks in columnSlots
    // Path format: [containerId, columnIndex, nestedBlockId]
    const container = containerBlock as ColumnsBlock | GridBlock
    const columnSlots = normalizeColumnSlots(container.columnSlots)

    if (path.length >= 3) {
      const columnIndex = parseInt(path[1], 10)
      const nestedBlockId = path[2]
      const columnBlocks = columnSlots[columnIndex] || []
      return columnBlocks.find((b) => b.id === nestedBlockId) || null
    }

    // Fallback to legacy blocks property if it exists
    if (container.blocks) {
      return findBlockByPath(container.blocks, path.slice(1))
    }

    return null
  }

  const updateBlockByPath = (blocks: Block[], path: string[], updater: (b: Block) => Block): Block[] => {
    if (path.length === 0) return blocks
    if (path.length === 1) {
      return blocks.map((b) => (b.id === path[0] ? updater(b) : b))
    }
    return blocks.map((b) => {
      if (b.id !== path[0]) return b
      if (b.kind !== "columns" && b.kind !== "grid") return b

      const container = b as ColumnsBlock | GridBlock

      // Handle columnSlots (new structure)
      // Path format: [containerId, columnIndex, nestedBlockId]
      if (path.length >= 3 && container.columnSlots) {
        const columnIndex = parseInt(path[1], 10)
        const nestedBlockId = path[2]
        // Normalize columnSlots to handle corrupted Firestore data
        const normalizedSlots = normalizeColumnSlots(container.columnSlots)
        const newColumnSlots = [...normalizedSlots]

        if (newColumnSlots[columnIndex]) {
          newColumnSlots[columnIndex] = newColumnSlots[columnIndex].map((nestedBlock) =>
            nestedBlock.id === nestedBlockId ? updater(nestedBlock) : nestedBlock
          )
        }

        return { ...container, columnSlots: newColumnSlots }
      }

      // Fallback to legacy blocks property
      if (!container.blocks) return b
      const updatedBlocks = updateBlockByPath(container.blocks, path.slice(1), updater)
      return { ...container, blocks: updatedBlocks }
    })
  }

  const handleNestedBlockSettings = (path: string[], block: Block) => {
    setSettingsBlockPath(path)
    setSettingsBlockId(block.id)
  }

  // Helper to update blocks for current language
  const updateBlocks = (newBlocks: Block[]) => {
    if (!onChange) return
    onChange(editingLanguage === "ar"
      ? { ...value, blocksAr: newBlocks, blocksEn: value.blocksEn || [] }
      : { ...value, blocksAr: value.blocksAr || [], blocksEn: newBlocks })
  }

  const handleUpdateBlock = (id: string, updater: (b: Block) => Block) => {
    if (!onChange) return
    if (settingsBlockPath && settingsBlockPath.length > 1) {
      const blocks = updateBlockByPath(currentBlocks, settingsBlockPath, updater)
      updateBlocks(blocks)
    } else {
      const blocks = currentBlocks.map((b) => (b.id === id ? updater(b) : b))
      updateBlocks(blocks)
    }
  }

  const handleRemoveBlock = (id: string) => {
    const blocks = currentBlocks.filter((b) => b.id !== id)
    updateBlocks(blocks)
  }

  const handleMoveBlock = (id: string, direction: "up" | "down") => {
    const idx = currentBlocks.findIndex((b) => b.id === id)
    if (idx === -1) return
    const newIdx = direction === "up" ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= currentBlocks.length) return
    const arr = [...currentBlocks]
    const [item] = arr.splice(idx, 1)
    arr.splice(newIdx, 0, item)
    updateBlocks(arr)
  }

  const handleCloneBlock = (id: string) => {
    const block = currentBlocks.find((b) => b.id === id)
    if (!block) return
    const clonedBlock = { ...block, id: `${block.kind}-${Date.now()}` }
    const idx = currentBlocks.findIndex((b) => b.id === id)
    const arr = [...currentBlocks]
    arr.splice(idx + 1, 0, clonedBlock)
    updateBlocks(arr)
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setHoveredIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!onChange || !draggedBlockId) return

    const sourceIndex = currentBlocks.findIndex((b) => b.id === draggedBlockId)
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      setDraggedBlockId(null)
      setHoveredIndex(null)
      return
    }

    const arr = [...currentBlocks]
    const [item] = arr.splice(sourceIndex, 1)
    arr.splice(targetIndex, 0, item)
    updateBlocks(arr)
    setDraggedBlockId(null)
    setHoveredIndex(null)
  }

  const addBlock = (kind: BlockKind) => {
    if (!onChange) return
    const newBlock = createDefaultBlock(kind, editingLanguage)

    // Check if we're adding to a container column
    const addingToColumn = (window as any).__addingToColumn as { containerId: string; columnIndex: number } | undefined

    if (addingToColumn) {
      // Adding to a container's column slot
      const { containerId, columnIndex } = addingToColumn
      const containerBlock = currentBlocks.find((b) => b.id === containerId) as ColumnsBlock | GridBlock | undefined

      if (containerBlock && containerBlock.columnSlots) {
        // Normalize columnSlots to handle corrupted Firestore data
        const normalizedSlots = normalizeColumnSlots(containerBlock.columnSlots)
        const updatedSlots = normalizedSlots.map((col, idx) =>
          idx === columnIndex ? [...col, newBlock] : col
        )
        const updatedContainer = { ...containerBlock, columnSlots: updatedSlots }
        const updatedBlocks = currentBlocks.map((b) => (b.id === containerId ? updatedContainer : b))
        updateBlocks(updatedBlocks)
        setSettingsBlockId(newBlock.id)
        setSettingsBlockPath([containerId, newBlock.id])
      }

      // Clean up the global variable
      delete (window as any).__addingToColumn
    } else {
      // Adding to current language blocks (top level)
      const updatedBlocks = [...currentBlocks, newBlock]
      updateBlocks(updatedBlocks)
      setSettingsBlockId(newBlock.id)
      setSettingsBlockPath([newBlock.id])
    }

    setIsModalOpen(false)
  }

  const settingsBlock = settingsBlockId
    ? settingsBlockPath
      ? findBlockByPath(currentBlocks, settingsBlockPath)
      : currentBlocks.find((b) => b.id === settingsBlockId)
    : null

  return (
    <div className={className} dir="rtl">
      <div className="sticky top-0 z-50 mb-6 space-y-3">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {language === "ar" ? "إضافة بلوك جديد" : "Add New Block"}
            </button>

            {onOpenTemplates && (
              <button
                type="button"
                onClick={onOpenTemplates}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                title={language === "ar" ? "الأقسام الجاهزة" : "Ready-Made Templates"}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="hidden sm:inline">{language === "ar" ? "قوالب" : "Templates"}</span>
              </button>
            )}

            {onOpenCss && (
              <button
                type="button"
                onClick={onOpenCss}
                className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                title="CSS مخصص"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            )}

            {onOpenJs && (
              <button
                type="button"
                onClick={onOpenJs}
                className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                title="JavaScript مخصص"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </button>
            )}
          </div>
          <span className="text-sm text-slate-500">
            {currentBlocks.length} {currentBlocks.length === 1 ? "بلوك" : "بلوكات"}
          </span>
        </div>

      </div>

      <AddBlockModal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        // Clean up the global variable when modal is closed without adding
        delete (window as any).__addingToColumn
      }} onAddBlock={addBlock} />

      <Dialog
        open={!!settingsBlock}
        onOpenChange={(open) => {
          if (!open) {
            setSettingsBlockId(null)
            setSettingsBlockPath(null)
          }
        }}
      >
        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">
              {/* Show breadcrumb for nested blocks */}
              {settingsBlockPath && settingsBlockPath.length > 1 && (
                <button
                  onClick={() => {
                    // Go back to container block
                    const containerBlock = currentBlocks.find((b) => b.id === settingsBlockPath[0])
                    if (containerBlock) {
                      setSettingsBlockId(containerBlock.id)
                      setSettingsBlockPath(null)
                    }
                  }}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {(() => {
                    const containerBlock = currentBlocks.find((b) => b.id === settingsBlockPath[0])
                    return containerBlock ? `العودة إلى ${blockLabel(containerBlock.kind)}` : "العودة"
                  })()}
                </button>
              )}
              <span className="block">إعدادات {settingsBlock ? blockLabel(settingsBlock.kind) : ""}</span>
            </DialogTitle>
          </DialogHeader>
          {settingsBlock && (
            <Tabs defaultValue="content" dir="rtl" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">المحتوى</TabsTrigger>
                <TabsTrigger value="style">التصميم</TabsTrigger>
                <TabsTrigger value="animation">الحركة</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-4">
                <EditingLanguageProvider editingLanguage={editingLanguage}>
                  <BlockEditor
                    block={settingsBlock}
                    onChange={(updatedBlock) => handleUpdateBlock(settingsBlock.id, () => updatedBlock)}
                    onNestedBlockSettings={handleNestedBlockSettings}
                  />
                </EditingLanguageProvider>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                <StyleEditor
                  block={settingsBlock}
                  onChange={(updatedBlock) => handleUpdateBlock(settingsBlock.id, () => updatedBlock)}
                />
              </TabsContent>

              <TabsContent value="animation" className="space-y-4 mt-4">
                <AnimationEditor
                  block={settingsBlock}
                  onChange={(updatedBlock) => handleUpdateBlock(settingsBlock.id, () => updatedBlock)}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {currentBlocks.map((block, index) => {
          const isContainerBlock = block.kind === "columns" || block.kind === "grid"

          // For container blocks (Columns/Grid), render with nested blocks visible
          if (isContainerBlock) {
            const containerBlock = block as ColumnsBlock | GridBlock
            const containerColor = block.kind === "columns" ? "blue" : "purple"
            // Normalize columnSlots to handle corrupted Firestore data, ensure proper number of columns
            let columnSlots = normalizeColumnSlots(containerBlock.columnSlots)
            // Ensure we have the right number of columns
            while (columnSlots.length < containerBlock.columns) {
              columnSlots.push([])
            }

            return (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative transition-all border-2 rounded-lg ${draggedBlockId === block.id
                  ? `opacity-50 border-${containerColor}-400`
                  : hoveredIndex === index
                    ? `border-${containerColor}-400/50`
                    : `border-${containerColor}-200`
                  } bg-${containerColor}-50/30`}
              >
                {/* Container Header */}
                <div className={`flex items-center justify-between border-b-2 border-${containerColor}-200 bg-${containerColor}-100/50 px-4 py-3`}>
                  <div className="flex items-center gap-3">
                    <div className="cursor-move text-slate-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{blockLabel(block.kind)}</div>
                      <div className="text-xs text-slate-500">
                        {containerBlock.columns} أعمدة • {containerBlock.gap === "sm" ? "مسافة صغيرة" : containerBlock.gap === "lg" ? "مسافة كبيرة" : "مسافة متوسطة"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Settings button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsBlockId(block.id)
                        setSettingsBlockPath([block.id])
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-${containerColor}-200 hover:text-${containerColor}-700`}
                      title="إعدادات الحاوية"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>

                    {/* Clone button */}
                    <button
                      type="button"
                      onClick={() => handleCloneBlock(block.id)}
                      className="flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-green-100 hover:text-green-600"
                      title="نسخ"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>

                    {/* Move up button */}
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(block.id, "up")}
                      disabled={index === 0}
                      className={`flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-${containerColor}-200 hover:text-${containerColor}-700 disabled:opacity-40`}
                      title="تحريك للأعلى"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    {/* Move down button */}
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(block.id, "down")}
                      disabled={index === value.blocks.length - 1}
                      className={`flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-${containerColor}-200 hover:text-${containerColor}-700 disabled:opacity-40`}
                      title="تحريك للأسفل"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(block.id)}
                      className="flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"
                      title="حذف"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Nested Blocks Area - Column Slots */}
                <div className="p-4">
                  <div
                    className={`grid gap-3 ${containerBlock.columns === 2 ? 'grid-cols-2' :
                      containerBlock.columns === 3 ? 'grid-cols-3' :
                        'grid-cols-4'
                      }`}
                  >
                    {columnSlots.map((columnBlocks, columnIndex) => (
                      <div
                        key={columnIndex}
                        className="flex flex-col gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 p-3 min-h-[200px]"
                      >
                        {/* Column Header */}
                        <div className="text-xs font-medium text-slate-600 mb-1">
                          عمود {columnIndex + 1}
                        </div>

                        {/* Blocks in this column */}
                        <div className="flex-1 space-y-2">
                          {columnBlocks.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-xs text-slate-400">
                              فارغ
                            </div>
                          ) : (
                            columnBlocks.map((nestedBlock, blockIndex) => {
                              const ViewComponent = getBlockView(nestedBlock.kind)

                              return (
                                <div
                                  key={nestedBlock.id}
                                  className="group/nested relative rounded-lg border-2 border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                                >
                                  {/* Nested Block Preview */}
                                  <div className="relative">
                                    {ViewComponent && <ViewComponent block={nestedBlock} />}

                                    {/* Nested Block Controls */}
                                    <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md bg-white p-1 shadow-md ring-1 ring-slate-200 opacity-0 transition-all duration-200 group-hover/nested:opacity-100">
                                      {/* Edit button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSettingsBlockId(nestedBlock.id)
                                          setSettingsBlockPath([block.id, nestedBlock.id])
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                        title="تحرير"
                                      >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>

                                      {/* Clone nested block */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!onChange) return
                                          const clonedNested = { ...nestedBlock, id: `${nestedBlock.kind}-${Date.now()}` }
                                          const updatedSlots = columnSlots.map((col, idx) =>
                                            idx === columnIndex
                                              ? [...col.slice(0, blockIndex + 1), clonedNested, ...col.slice(blockIndex + 1)]
                                              : col
                                          )
                                          const updatedContainer = { ...containerBlock, columnSlots: updatedSlots }
                                          updateBlocks(currentBlocks.map((b) => (b.id === block.id ? updatedContainer : b)))
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-green-50 hover:text-green-600"
                                        title="نسخ"
                                      >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>

                                      {/* Delete nested block */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!onChange) return
                                          const updatedSlots = columnSlots.map((col, idx) =>
                                            idx === columnIndex ? col.filter((b) => b.id !== nestedBlock.id) : col
                                          )
                                          const updatedContainer = { ...containerBlock, columnSlots: updatedSlots }
                                          updateBlocks(currentBlocks.map((b) => (b.id === block.id ? updatedContainer : b)))
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                        title="حذف"
                                      >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>

                                    {/* Block type label */}
                                    <div className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/nested:opacity-100">
                                      {blockLabel(nestedBlock.kind)}
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>

                        {/* Add Block to this Column */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(true)
                              // Store which column we're adding to
                              ; (window as any).__addingToColumn = { containerId: block.id, columnIndex }
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          إضافة بلوك
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remove the old "Add Nested Block" button since each column has its own */}
              </div>
            )
          }

          // Regular block rendering (non-container blocks)
          return (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`group relative transition-all border-y-2 border-transparent ${draggedBlockId === block.id
                ? "opacity-50 border-blue-400"
                : hoveredIndex === index
                  ? "border-blue-400/50 z-10"
                  : ""
                }`}
            >
              {/* Block content with rendered preview */}
              <div className="relative">
                <BlocksRenderer blocks={[block]} language={editingLanguage} />

                {/* Improved Control Toolbar (Top Left) */}
                <div className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-md bg-white p-1 shadow-md ring-1 ring-slate-200 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  {/* Drag Handle */}
                  <div className="cursor-move rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>

                  <div className="mx-1 h-4 w-px bg-slate-200" />

                  {/* Settings button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsBlockId(block.id)
                      setSettingsBlockPath([block.id])
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    title="إعدادات"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  {/* Clone button */}
                  <button
                    type="button"
                    onClick={() => handleCloneBlock(block.id)}
                    className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-500 transition-colors hover:bg-green-50 hover:text-green-600"
                    title="نسخ"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  {/* Move up button */}
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(block.id, "up")}
                    disabled={index === 0}
                    className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-500 transition-colors hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                    title="تحريك للأعلى"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>

                  {/* Move down button */}
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(block.id, "down")}
                    disabled={index === value.blocks.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-500 transition-colors hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                    title="تحريك للأسفل"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Block label badge */}
                <div className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {blockLabel(block.kind)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ========================================================================
 * 4) BLOCK EDITOR
 * ======================================================================*/

interface BlockEditorProps {
  block: Block
  onChange: (block: Block) => void
  onNestedBlockSettings?: (blockPath: string[], block: Block) => void
}

/**
 * BlockEditor:
 * - Uses the block registry to dynamically load the appropriate editor
 * - Falls back to JsonBlockEditor for any unregistered block types
 */
function BlockEditor({ block, onChange, onNestedBlockSettings }: BlockEditorProps) {
  const EditorComponent = getBlockEditor(block.kind)

  if (!EditorComponent) {
    return <JsonBlockEditor block={block} onChange={onChange} />
  }

  // Pass onNestedBlockSettings for container blocks (columns, grid)
  return <EditorComponent block={block as any} onChange={onChange} onNestedBlockSettings={onNestedBlockSettings} />
}

/* --- Dedicated editors for main blocks --- */

function HeroBasicEditor({
  block,
  onChange,
}: {
  block: HeroBasicBlock
  onChange: (b: Block) => void
}) {
  const update = (patch: Partial<HeroBasicBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Eyebrow" value={block.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v || undefined })} />
      <InputField label="Title" value={block.title} onChange={(v) => update({ title: v })} />
      <TextareaField
        label="Subtitle"
        value={block.subtitle ?? ""}
        onChange={(v) => update({ subtitle: v || undefined })}
      />
      <SelectField
        label="Alignment"
        value={block.align ?? "left"}
        onChange={(v) => update({ align: v as HeroBasicBlock["align"] })}
        options={[
          { value: "left", label: "يسار" },
          { value: "center", label: "وسط" },
        ]}
      />
      <div className="grid gap-2 md:grid-cols-2">
        <InputField
          label="Primary CTA Label"
          value={block.primaryCtaLabel ?? ""}
          onChange={(v) => update({ primaryCtaLabel: v || undefined })}
        />
        <InputField
          label="Primary CTA Link"
          value={block.primaryCtaHref ?? ""}
          onChange={(v) => update({ primaryCtaHref: v || undefined })}
        />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <InputField
          label="Secondary CTA Label"
          value={block.secondaryCtaLabel ?? ""}
          onChange={(v) => update({ secondaryCtaLabel: v || undefined })}
        />
        <InputField
          label="Secondary CTA Link"
          value={block.secondaryCtaHref ?? ""}
          onChange={(v) => update({ secondaryCtaHref: v || undefined })}
        />
      </div>
      <InputField
        label="Image URL"
        value={block.imageUrl ?? ""}
        onChange={(v) => update({ imageUrl: v || undefined })}
      />
      <InputField
        label="Image Alt"
        value={block.imageAlt ?? ""}
        onChange={(v) => update({ imageAlt: v || undefined })}
      />
    </div>
  )
}

function HeroSplitEditor({
  block,
  onChange,
}: {
  block: HeroSplitBlock
  onChange: (b: Block) => void
}) {
  const update = (patch: Partial<HeroSplitBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={block.title} onChange={(v) => update({ title: v })} />
      <TextareaField
        label="Subtitle"
        value={block.subtitle ?? ""}
        onChange={(v) => update({ subtitle: v || undefined })}
      />
      <SelectField
        label="Image side"
        value={block.imageSide ?? "right"}
        onChange={(v) => update({ imageSide: v as HeroSplitBlock["imageSide"] })}
        options={[
          { value: "left", label: "يسار" },
          { value: "right", label: "يمين" },
        ]}
      />
      <InputField
        label="Image URL"
        value={block.imageUrl ?? ""}
        onChange={(v) => update({ imageUrl: v || undefined })}
      />
      <InputField
        label="Image Alt"
        value={block.imageAlt ?? ""}
        onChange={(v) => update({ imageAlt: v || undefined })}
      />
    </div>
  )
}

function RichTextEditor({
  block,
  onChange,
}: {
  block: RichTextBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="Description"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={3}
      />
      <TextareaField label="Body" value={block.body} onChange={(v) => onChange({ ...block, body: v })} rows={6} />
    </div>
  )
}

function ImageWithTextEditor({
  block,
  onChange,
}: {
  block: ImageWithTextBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const update = (patch: Partial<ImageWithTextBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField label="Text" value={block.text} onChange={(v) => update({ text: v })} />
      <SelectField
        label="Image side"
        value={block.imageSide ?? "right"}
        onChange={(v) => update({ imageSide: v as ImageWithTextBlock["imageSide"] })}
        options={[
          { value: "left", label: "يسار" },
          { value: "right", label: "يمين" },
        ]}
      />
      <InputField label="Image URL" value={block.imageUrl} onChange={(v) => update({ imageUrl: v })} />
      <InputField
        label="Image Alt"
        value={block.imageAlt ?? ""}
        onChange={(v) => update({ imageAlt: v || undefined })}
      />
    </div>
  )
}

function ProgramsGridEditor({
  block,
  onChange,
}: {
  block: ProgramsGridBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })

  const updateItems = (updater: (items: ProgramsGridBlock["items"]) => ProgramsGridBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="Description"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={3}
      />
      <SelectField
        label="Columns"
        value={String(block.columns)}
        onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
        options={[
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
        ]}
      />
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">البرامج</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  title: "برنامج جديد",
                  description: "وصف مختصر.",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة برنامج
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="عنوان البرنامج"
              value={item.title}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, title: v } : it)))
              }
            />
            <InputField
              label="الفئة العمرية"
              value={item.ageRange ?? ""}
              onChange={(v) =>
                updateItems((items) =>
                  items.map((it) => (it.id === item.id ? { ...it, ageRange: v || undefined } : it)),
                )
              }
            />
            <TextareaField
              label="الوصف"
              value={item.description}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, description: v } : it)))
              }
              rows={3}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف البرنامج
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesListEditor({
  block,
  onChange,
}: {
  block: ServicesListBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })

  const updateItems = (updater: (items: ServicesListBlock["items"]) => ServicesListBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <SelectField
        label="Layout"
        value={block.layout ?? "grid"}
        onChange={(v) => onChange({ ...block, layout: v as ServicesListBlock["layout"] })}
        options={[
          { value: "grid", label: "شبكة" },
          { value: "list", label: "قائمة" },
        ]}
      />
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">الخدمات</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  title: "خدمة جديدة",
                  description: "وصف مختصر.",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة خدمة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="عنوان الخدمة"
              value={item.title}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, title: v } : it)))
              }
            />
            <TextareaField
              label="الوصف"
              value={item.description}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, description: v } : it)))
              }
              rows={3}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الخدمة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsEditor({
  block,
  onChange,
}: {
  block: StatsBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: StatsBlock["items"]) => StatsBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">الإحصائيات</span>
          <button
            type="button"
            onClick={() => updateItems((items) => [...items, { id: createId(), label: "وصف", value: "0" }])}
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة رقم
          </button>
        </div>
        {block.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-1 rounded-md border border-slate-200 bg-slate-50/60 p-2 md:grid-cols-3"
          >
            <InputField
              label="Label"
              value={item.label}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, label: v } : it)))
              }
            />
            <InputField
              label="Value"
              value={item.value}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, value: v } : it)))
              }
            />
            <InputField
              label="Suffix"
              value={item.suffix ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, suffix: v || undefined } : it)))
              }
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
              className="col-span-full text-[11px] text-red-500"
            >
              حذف الرقم
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaqEditor({
  block,
  onChange,
}: {
  block: FaqAccordionBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: FaqAccordionBlock["items"]) => FaqAccordionBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">الأسئلة</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  question: "سؤال جديد",
                  answer: "إجابة...",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة سؤال
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="Question"
              value={item.question}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, question: v } : it)))
              }
            />
            <TextareaField
              label="Answer"
              value={item.answer}
              onChange={(v) =>
                updateItems((items) => items.map((it) => (it.id === item.id ? { ...it, answer: v } : it)))
              }
              rows={3}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((it) => it.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف السؤال
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function CtaStripEditor({
  block,
  onChange,
}: {
  block: CtaStripBlock
  onChange: (b: Block) => void
}) {
  const update = (patch: Partial<CtaStripBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-2 text-[11px]">
      <InputField label="Title" value={block.title} onChange={(v) => update({ title: v })} />
      <TextareaField
        label="Text"
        value={block.text ?? ""}
        onChange={(v) => update({ text: v || undefined })}
        rows={3}
      />
      <div className="grid gap-2 md:grid-cols-2">
        <InputField
          label="Primary CTA Label"
          value={block.primaryCtaLabel}
          onChange={(v) => update({ primaryCtaLabel: v })}
        />
        <InputField
          label="Primary CTA Link"
          value={block.primaryCtaHref}
          onChange={(v) => update({ primaryCtaHref: v })}
        />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <InputField
          label="Secondary CTA Label"
          value={block.secondaryCtaLabel ?? ""}
          onChange={(v) => update({ secondaryCtaLabel: v || undefined })}
        />
        <InputField
          label="Secondary CTA Link"
          value={block.secondaryCtaHref ?? ""}
          onChange={(v) => update({ secondaryCtaHref: v || undefined })}
        />
      </div>
    </div>
  )
}

function ColumnsEditor({
  block,
  onChange,
  onNestedBlockSettings,
}: {
  block: ColumnsBlock
  onChange: (b: Block) => void
  onNestedBlockSettings?: (blockPath: string[], block: Block) => void
}) {
  const { editingLanguage } = useEditingLanguage()
  const language = editingLanguage
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [draggedBlockId, setDraggedBlockId] = React.useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const update = (patch: Partial<ColumnsBlock>) => onChange({ ...block, ...patch })

  const addBlock = (kind: BlockKind) => {
    const newBlock = createDefaultBlock(kind, language)
    update({ blocks: [...block.blocks, newBlock] })
    if (onNestedBlockSettings) {
      onNestedBlockSettings([block.id, newBlock.id], newBlock)
    }
    setIsModalOpen(false)
  }

  const updateNestedBlock = (id: string, updater: (b: Block) => Block) => {
    const blocks = block.blocks.map((b) => (b.id === id ? updater(b) : b))
    update({ blocks })
  }

  const removeNestedBlock = (id: string) => {
    update({ blocks: block.blocks.filter((b) => b.id !== id) })
  }

  const moveNestedBlock = (id: string, direction: "up" | "down") => {
    const idx = block.blocks.findIndex((b) => b.id === id)
    if (idx === -1) return
    const newIdx = direction === "up" ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= block.blocks.length) return
    const blocks = [...block.blocks]
      ;[blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]]
    update({ blocks })
  }

  const cloneNestedBlock = (id: string) => {
    const nestedBlock = block.blocks.find((b) => b.id === id)
    if (!nestedBlock) return
    const clonedBlock = { ...nestedBlock, id: `${nestedBlock.kind}-${Date.now()}` }
    const idx = block.blocks.findIndex((b) => b.id === id)
    const arr = [...block.blocks]
    arr.splice(idx + 1, 0, clonedBlock)
    update({ blocks: arr })
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setHoveredIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedBlockId) return

    const sourceIndex = block.blocks.findIndex((b) => b.id === draggedBlockId)
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      setDraggedBlockId(null)
      setHoveredIndex(null)
      return
    }

    const arr = [...block.blocks]
    const [item] = arr.splice(sourceIndex, 1)
    arr.splice(targetIndex, 0, item)
    update({ blocks: arr })
    setDraggedBlockId(null)
    setHoveredIndex(null)
  }

  return (
    <div className="space-y-3 text-[11px]">
      <SelectField
        label="عدد الأعمدة"
        value={String(block.columns)}
        onChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
        options={[
          { value: "2", label: "عمودين" },
          { value: "3", label: "3 أعمدة" },
          { value: "4", label: "4 أعمدة" },
        ]}
      />
      <SelectField
        label="المسافة بين الأعمدة"
        value={block.gap ?? "md"}
        onChange={(v) => update({ gap: v as "sm" | "md" | "lg" })}
        options={[
          { value: "sm", label: "صغيرة" },
          { value: "md", label: "متوسطة" },
          { value: "lg", label: "كبيرة" },
        ]}
      />

      <div className="mt-4 space-y-2 rounded border border-blue-200 bg-blue-50/50 p-3">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow transition-all hover:shadow-md active:scale-95"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة بلوك جديد
          </button>
          <span className="text-[10px] text-blue-700">
            {block.blocks.length} {block.blocks.length === 1 ? "بلوك" : "بلوكات"}
          </span>
        </div>

        <AddBlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBlock={addBlock} />

        {block.blocks.map((nestedBlock, idx) => (
          <div
            key={nestedBlock.id}
            draggable
            onDragStart={(e) => handleDragStart(e, nestedBlock.id)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`group relative rounded-lg border-2 transition-all ${draggedBlockId === nestedBlock.id
              ? "border-blue-400 opacity-50"
              : hoveredIndex === idx
                ? "border-blue-300"
                : "border-slate-200"
              } bg-white shadow-sm hover:shadow-md`}
          >
            <div className="relative">
              <BlocksRenderer blocks={[nestedBlock]} language={language} />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNestedBlockSettings) {
                        onNestedBlockSettings([block.id, nestedBlock.id], nestedBlock)
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
                    title="إعدادات"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => cloneNestedBlock(nestedBlock.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-green-50 hover:text-green-600"
                    title="نسخ"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => moveNestedBlock(nestedBlock.id, "up")}
                    disabled={idx === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                    title="تحريك للأعلى"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => moveNestedBlock(nestedBlock.id, "down")}
                    disabled={idx === block.blocks.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                    title="تحريك للأسفل"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeNestedBlock(nestedBlock.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="absolute left-1 top-1 cursor-move rounded bg-white/90 p-0.5 opacity-0 shadow transition-opacity group-hover:opacity-100">
                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>

              <div className="absolute right-1 top-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {blockLabel(nestedBlock.kind)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GridEditor({
  block,
  onChange,
  onNestedBlockSettings,
}: {
  block: GridBlock
  onChange: (b: Block) => void
  onNestedBlockSettings?: (blockPath: string[], block: Block) => void
}) {
  const { editingLanguage } = useEditingLanguage()
  const language = editingLanguage
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [draggedBlockId, setDraggedBlockId] = React.useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const update = (patch: Partial<GridBlock>) => onChange({ ...block, ...patch })

  const addBlock = (kind: BlockKind) => {
    const newBlock = createDefaultBlock(kind, language)
    update({ blocks: [...block.blocks, newBlock] })
    if (onNestedBlockSettings) {
      onNestedBlockSettings([block.id, newBlock.id], newBlock)
    }
    setIsModalOpen(false)
  }

  const updateNestedBlock = (id: string, updater: (b: Block) => Block) => {
    const blocks = block.blocks.map((b) => (b.id === id ? updater(b) : b))
    update({ blocks })
  }

  const removeNestedBlock = (id: string) => {
    update({ blocks: block.blocks.filter((b) => b.id !== id) })
  }

  const moveNestedBlock = (id: string, direction: "up" | "down") => {
    const idx = block.blocks.findIndex((b) => b.id === id)
    if (idx === -1) return
    const newIdx = direction === "up" ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= block.blocks.length) return
    const blocks = [...block.blocks]
      ;[blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]]
    update({ blocks })
  }

  const cloneNestedBlock = (id: string) => {
    const nestedBlock = block.blocks.find((b) => b.id === id)
    if (!nestedBlock) return
    const clonedBlock = { ...nestedBlock, id: `${nestedBlock.kind}-${Date.now()}` }
    const idx = block.blocks.findIndex((b) => b.id === id)
    const arr = [...block.blocks]
    arr.splice(idx + 1, 0, clonedBlock)
    update({ blocks: arr })
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setHoveredIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedBlockId) return

    const sourceIndex = block.blocks.findIndex((b) => b.id === draggedBlockId)
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      setDraggedBlockId(null)
      setHoveredIndex(null)
      return
    }

    const arr = [...block.blocks]
    const [item] = arr.splice(sourceIndex, 1)
    arr.splice(targetIndex, 0, item)
    update({ blocks: arr })
    setDraggedBlockId(null)
    setHoveredIndex(null)
  }

  return (
    <div className="space-y-3 text-[11px]">
      <SelectField
        label="عدد الأعمدة"
        value={String(block.columns)}
        onChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
        options={[
          { value: "2", label: "عمودين" },
          { value: "3", label: "3 أعمدة" },
          { value: "4", label: "4 أعمدة" },
        ]}
      />
      <SelectField
        label="المسافة"
        value={block.gap ?? "md"}
        onChange={(v) => update({ gap: v as "sm" | "md" | "lg" })}
        options={[
          { value: "sm", label: "صغيرة" },
          { value: "md", label: "متوسطة" },
          { value: "lg", label: "كبيرة" },
        ]}
      />

      <div className="mt-4 space-y-2 rounded border border-purple-200 bg-purple-50/50 p-3">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow transition-all hover:shadow-md active:scale-95"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة بلوك جديد
          </button>
          <span className="text-[10px] text-purple-700">
            {block.blocks.length} {block.blocks.length === 1 ? "بلوك" : "بلوكات"}
          </span>
        </div>

        <AddBlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBlock={addBlock} />

        {block.blocks.map((nestedBlock, idx) => (
          <div
            key={nestedBlock.id}
            draggable
            onDragStart={(e) => handleDragStart(e, nestedBlock.id)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`group relative rounded-lg border-2 transition-all ${draggedBlockId === nestedBlock.id
              ? "border-purple-400 opacity-50"
              : hoveredIndex === idx
                ? "border-purple-300"
                : "border-slate-200"
              } bg-white shadow-sm hover:shadow-md`}
          >
            <div className="relative">
              <BlocksRenderer blocks={[nestedBlock]} language={language} />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNestedBlockSettings) {
                        onNestedBlockSettings([block.id, nestedBlock.id], nestedBlock)
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-purple-50 hover:text-purple-600"
                    title="إعدادات"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => cloneNestedBlock(nestedBlock.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-green-50 hover:text-green-600"
                    title="نسخ"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => moveNestedBlock(nestedBlock.id, "up")}
                    disabled={idx === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                    title="تحريك للأعلى"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => moveNestedBlock(nestedBlock.id, "down")}
                    disabled={idx === block.blocks.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                    title="تحريك للأسفل"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeNestedBlock(nestedBlock.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-lg transition-transform hover:scale-110 hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="absolute left-1 top-1 cursor-move rounded bg-white/90 p-0.5 opacity-0 shadow transition-opacity group-hover:opacity-100">
                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>

              <div className="absolute right-1 top-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {blockLabel(nestedBlock.kind)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* --- JSON fallback editor: keeps all blocks editable --- */

function JsonBlockEditor({
  block,
  onChange,
}: {
  block: Block
  onChange: (b: Block) => void
}) {
  const [draft, setDraft] = React.useState(() => JSON.stringify(block, null, 2))
  const [error, setError] = React.useState<string | null>(null)

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(draft)
      onChange(parsed as Block)
      setError(null)
    } catch (e) {
      if (e instanceof Error) {
        setError(`JSON غير صالح – لم يتم حفظ التغييرات: ${e.message}`)
      } else {
        setError("JSON غير صالح – لم يتم حفظ التغييرات.")
      }
    }
  }

  return (
    <div className="space-y-1 text-[11px]">
      <p className="text-slate-600">محرر JSON لهذا البلوك (يمكنك لاحقًا استبداله بمحرر مخصص).</p>
      <textarea
        className="h-48 w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-[11px]"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}

/* ========================================================================
 * 6) RENDERER (View UI for all blocks)
 * ======================================================================*/

export function BlocksRenderer({ blocks, language }: { blocks: Block[]; language?: "ar" | "en" }) {
  const content = (
    <>
      {blocks.map((block) => {
        const blockStyles = (block as any).blockStyles || {}
        const blockAnimations = (block as any).blockAnimations || {}

        // بناء classes للستايل
        const styleClasses = [
          blockStyles.backgroundColor || "",
          blockStyles.textColor || "",
          blockStyles.borderRadius ? `rounded-${blockStyles.borderRadius}` : "",
          blockStyles.shadow ? `shadow-${blockStyles.shadow}` : "",
          blockStyles.padding ? `p-${blockStyles.padding}` : "",
          blockStyles.margin ? `m-${blockStyles.margin}` : "",
          blockStyles.borderWidth ? `border-${blockStyles.borderWidth}` : "",
          blockStyles.borderColor || "",
        ]
          .filter(Boolean)
          .join(" ")

        // بناء classes للانيميشن
        const animationClasses = [
          blockAnimations.entranceAnimation && blockAnimations.entranceAnimation !== "none"
            ? `animate-${blockAnimations.entranceAnimation}`
            : "",
          blockAnimations.hoverAnimation && blockAnimations.hoverAnimation !== "none"
            ? `hover-${blockAnimations.hoverAnimation}`
            : "",
          blockAnimations.scrollAnimation ? "scroll-animate" : "",
        ]
          .filter(Boolean)
          .join(" ")

        const animationStyles = {
          animationDuration: blockAnimations.entranceDuration || "500ms",
          animationDelay: blockAnimations.entranceDelay || "0ms",
        }

        return (
          <div key={block.id} className={`${styleClasses} ${animationClasses}`.trim()} style={animationStyles}>
            <BlockView block={block} />
          </div>
        )
      })}
    </>
  )

  // Wrap with LanguageProvider if language is specified to override context
  if (language) {
    return <LanguageProvider initialLanguage={language}>{content}</LanguageProvider>
  }
  return content
}

// BlockView component
function BlockView({ block }: { block: Block }) {
  const styles = block.blockStyles || {}
  const styleObj: React.CSSProperties = {
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    backgroundColor: styles.backgroundColor,
    backgroundImage: styles.backgroundImage,
    color: styles.textColor,
    width: styles.width,
    maxWidth: styles.maxWidth,
    height: styles.height,
    minHeight: styles.minHeight,
    borderRadius: styles.borderRadius,
    borderWidth: styles.borderWidth,
    borderColor: styles.borderColor,
    boxShadow: styles.shadow,
    borderStyle: styles.borderWidth ? "solid" : undefined,
    textAlign: styles.textAlign,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    ...((styles as any).style || {}), // Allow raw style object if present
  }

  const ViewComponent = getBlockView(block.kind)

  const content = ViewComponent ? (
    <ViewComponent key={block.id} block={block as any} />
  ) : (
    // Fallback to JSON dump for any unhandled block kinds
    <SectionContainer key={block.id}>
      <pre className={nmTheme.misc.jsonDump}>{JSON.stringify(block, null, 2)}</pre>
    </SectionContainer>
  )

  return (
    <div style={styleObj} className={styles.className}>
      {content}
    </div>
  )
}

/* --- View implementations for main blocks --- */

function HeroBasicView({ block }: { block: HeroBasicBlock }) {
  const alignCenter = block.align === "center"

  return (
    <SectionContainer className={nmTheme.hero.section}>
      <div className={`grid items-center gap-10 md:grid-cols-2 ${alignCenter ? "text-center" : ""}`}>
        <div>
          {block.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{block.eyebrow}</p>}
          <h1 className={`mb-3 ${nmTheme.hero.title}`}>{block.title}</h1>
          {block.subtitle && <p className={`mb-6 max-w-xl ${nmTheme.hero.subtitle}`}>{block.subtitle}</p>}
          <div className={`flex flex-wrap gap-3 ${alignCenter ? "justify-center" : ""}`}>
            {block.primaryCtaLabel && block.primaryCtaHref && (
              <a href={block.primaryCtaHref} className={nmTheme.hero.primaryBtn}>
                {block.primaryCtaLabel}
              </a>
            )}
            {block.secondaryCtaLabel && block.secondaryCtaHref && (
              <a href={block.secondaryCtaHref} className={nmTheme.hero.secondaryBtn}>
                {block.secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>

        {block.imageUrl && (
          <div className={nmTheme.hero.imageWrapper}>
            <img
              src={block.imageUrl || "/placeholder.svg"}
              alt={block.imageAlt ?? ""}
              className={nmTheme.hero.imageCard}
            />
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

function HeroSplitView({ block }: { block: HeroSplitBlock }) {
  const imageRight = block.imageSide !== "left"

  return (
    <SectionContainer className={nmTheme.hero.section}>
      <div className={`grid items-center gap-10 md:grid-cols-2 ${imageRight ? "" : "md:grid-flow-col-dense"}`}>
        {!imageRight && block.imageUrl && (
          <div className={nmTheme.hero.imageWrapper}>
            <img
              src={block.imageUrl || "/placeholder.svg"}
              alt={block.imageAlt ?? ""}
              className={nmTheme.hero.imageCard}
            />
          </div>
        )}
        <div>
          <h1 className={`mb-3 ${nmTheme.hero.title}`}>{block.title}</h1>
          {block.subtitle && <p className={`mb-6 max-w-xl ${nmTheme.hero.subtitle}`}>{block.subtitle}</p>}
        </div>
        {imageRight && block.imageUrl && (
          <div className={nmTheme.hero.imageWrapper}>
            <img
              src={block.imageUrl || "/placeholder.svg"}
              alt={block.imageAlt ?? ""}
              className={nmTheme.hero.imageCard}
            />
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

function RichTextView({ block }: { block: RichTextBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
      {header?.description && (
        <p className={`mb-4 max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
      )}
      <div className={`max-w-3xl ${nmTheme.textSection.body}`} dangerouslySetInnerHTML={{ __html: block.body }} />
    </SectionContainer>
  )
}

function ImageWithTextView({ block }: { block: ImageWithTextBlock }) {
  const imageRight = block.imageSide !== "left"
  const header = block.header

  return (
    <SectionContainer>
      <div className={`grid items-center gap-10 md:grid-cols-2 ${imageRight ? "" : "md:grid-flow-col-dense"}`}>
        {!imageRight && (
          <div>
            {header?.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{header.eyebrow}</p>}
            {header?.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
            <p className={nmTheme.textSection.body}>{block.text}</p>
          </div>
        )}
        <div className="relative h-64 w-full md:h-80">
          <img
            src={block.imageUrl || "/placeholder.svg"}
            alt={block.imageAlt ?? ""}
            className="h-full w-full rounded-3xl object-cover shadow-lg ring-1 ring-slate-200"
          />
        </div>
        {imageRight && (
          <div>
            {header?.eyebrow && <p className={`mb-2 ${nmTheme.hero.eyebrow}`}>{header.eyebrow}</p>}
            {header?.title && <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>}
            <p className={nmTheme.textSection.body}>{block.text}</p>
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

function ProgramsGridView({ block }: { block: ProgramsGridBlock }) {
  const header = block.header
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <SectionContainer className={nmTheme.programs.sectionBg}>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={`grid gap-6 ${colsClass}`}>
        {block.items.map((item) => (
          <div key={item.id} className={nmTheme.programs.card}>
            {item.icon && <div className={nmTheme.programs.icon}>{item.icon}</div>}
            <h3 className={nmTheme.programs.title}>{item.title}</h3>
            {item.ageRange && <p className={nmTheme.programs.ageRange}>{item.ageRange}</p>}
            <p className={nmTheme.programs.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function ServicesListView({ block }: { block: ServicesListBlock }) {
  const header = block.header
  const isGrid = block.layout !== "list"

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-6 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-4"}>
        {block.items.map((item) => (
          <div key={item.id} className={nmTheme.services.card}>
            {item.icon && <div className={nmTheme.services.icon}>{item.icon}</div>}
            <div>
              <h3 className={nmTheme.services.title}>{item.title}</h3>
              <p className={nmTheme.services.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function StatsView({ block }: { block: StatsBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header && (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {header.title && <h2 className={nmTheme.textSection.title}>{header.title}</h2>}
          {header.description && <p className="max-w-md text-xs md:text-sm text-slate-600">{header.description}</p>}
        </div>
      )}
      <dl className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {block.items.map((item) => (
          <div key={item.id} className={nmTheme.stats.card}>
            <dt className={nmTheme.stats.label}>{item.label}</dt>
            <dd className={nmTheme.stats.value}>
              {item.value}
              {item.suffix && <span className={nmTheme.stats.suffix}>{item.suffix}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </SectionContainer>
  )
}

function FaqView({ block }: { block: FaqAccordionBlock }) {
  const header = block.header

  return (
    <SectionContainer className={nmTheme.faq.sectionBg}>
      {header?.title && (
        <div className="mb-6 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {block.items.map((item) => (
          <details key={item.id} className={nmTheme.faq.item}>
            <summary className={nmTheme.faq.question}>{item.question}</summary>
            <p className={nmTheme.faq.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionContainer>
  )
}

function CtaStripView({ block }: { block: CtaStripBlock }) {
  return (
    <SectionContainer className={nmTheme.ctaStrip.section}>
      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <h2 className={nmTheme.ctaStrip.title}>{block.title}</h2>
          {block.text && <p className={nmTheme.ctaStrip.text}>{block.text}</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={block.primaryCtaHref} className={nmTheme.ctaStrip.primaryBtn}>
            {block.primaryCtaLabel}
          </a>
          {block.secondaryCtaLabel && block.secondaryCtaHref && (
            <a href={block.secondaryCtaHref} className={nmTheme.ctaStrip.secondaryBtn}>
              {block.secondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </SectionContainer>
  )
}

function ColumnsView({ block }: { block: ColumnsBlock }) {
  const gapClass = block.gap === "sm" ? "gap-4" : block.gap === "lg" ? "gap-10" : "gap-6"
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <SectionContainer>
      <div className={`grid ${colsClass} ${gapClass}`}>
        <BlocksRenderer blocks={block.blocks} />
      </div>
    </SectionContainer>
  )
}

function GridView({ block }: { block: GridBlock }) {
  const gapClass = block.gap === "sm" ? "gap-4" : block.gap === "lg" ? "gap-10" : "gap-6"
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <SectionContainer>
      <div className={`grid ${colsClass} ${gapClass}`}>
        {block.blocks.map((nestedBlock) => (
          <div key={nestedBlock.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <BlocksRenderer blocks={[nestedBlock]} />
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

// Added Views from Updates

function HighlightBannerView({ block }: { block: HighlightBannerBlock }) {
  return (
    <div
      className={`mb-4 rounded-lg p-4 shadow-sm ${block.variant === "muted" ? "bg-slate-100" : "bg-gradient-to-r from-emerald-50 to-blue-50"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-grow">
          <p className="font-semibold text-slate-900">{block.title}</p>
          {block.text && <p className="text-sm text-slate-700">{block.text}</p>}
        </div>
        {block.ctaLabel && block.ctaHref && (
          <a
            href={block.ctaHref}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {block.ctaLabel}
          </a>
        )}
      </div>
    </div>
  )
}

function IconPointsView({ block }: { block: IconPointsBlock }) {
  const header = block.header
  // Inferring colsClass from block.items.length for better responsiveness,
  // or could add a explicit 'columns' prop to IconPointsBlock interface.
  const itemCount = block.items.length
  let colsClass = "grid-cols-1"
  if (itemCount >= 2) colsClass = "md:grid-cols-2"
  if (itemCount >= 3) colsClass = "lg:grid-cols-3"
  if (itemCount >= 4) colsClass = "xl:grid-cols-4"

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={`grid ${colsClass} gap-6`}>
        {block.items.map((item) => (
          <div key={item.id} className="text-center">
            {item.icon && <div className="mb-3 text-4xl">{item.icon}</div>}
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function TestimonialsView({ block }: { block: TestimonialsBlock }) {
  const header = block.header
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"

  return (
    <SectionContainer className="bg-slate-50">
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={`grid ${colsClass} gap-6`}>
        {block.items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-4 italic text-slate-700">"{item.quote}"</p>
            <div className="flex items-center gap-3">
              {item.avatarUrl && (
                <img
                  src={item.avatarUrl || "/placeholder.svg"}
                  alt={item.author}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-slate-900">{item.author}</p>
                {item.role && <p className="text-sm text-slate-600">{item.role}</p>}
              </div>
            </div>
            {item.rating && (
              <div className="mt-3 text-yellow-400">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function LogosStripView({ block }: { block: LogosStripBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500`}>{header.title}</h2>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {block.items.map((logo) => (
          <div key={logo.id} className="grayscale transition hover:grayscale-0">
            <img src={logo.logoUrl || "/placeholder.svg"} alt={logo.alt ?? ""} className="h-12 w-auto object-contain" />
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function GalleryGridView({ block }: { block: GalleryGridBlock }) {
  const header = block.header
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={`grid ${colsClass} gap-4`}>
        {block.items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg">
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.alt ?? ""}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-sm font-medium text-white">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function VideoHighlightView({ block }: { block: VideoHighlightBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-6 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
        {block.thumbnailUrl ? (
          <div className="group relative h-full w-full cursor-pointer">
            <img
              src={block.thumbnailUrl || "/placeholder.svg"}
              alt={block.title ?? ""}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
              <div className="rounded-full bg-white/90 p-4">
                <svg className="h-12 w-12 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : block.embedUrl || block.videoUrl ? (
          <iframe
            src={block.embedUrl || block.videoUrl}
            className="h-full w-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : null}
      </div>
      {block.caption && <p className="mt-4 text-center text-sm text-slate-600">{block.caption}</p>}
    </SectionContainer>
  )
}

function StaffGridView({ block }: { block: StaffGridBlock }) {
  const header = block.header
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={`grid ${colsClass} gap-6`}>
        {block.items.map((item) => (
          <div key={item.id} className="text-center">
            {item.photoUrl && (
              <img
                src={item.photoUrl || "/placeholder.svg"}
                alt={item.name}
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-md"
              />
            )}
            <h3 className="mb-1 text-lg font-semibold text-slate-900">{item.name}</h3>
            <p className="mb-2 text-sm font-medium text-emerald-600">{item.role}</p>
            {item.bioShort && <p className="text-sm text-slate-600">{item.bioShort}</p>}
            {item.email && (
              <a
                href={`mailto:${item.email}`}
                className="mt-2 inline-block text-xs text-slate-500 hover:text-emerald-600"
              >
                {item.email}
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function BoardOrTeamListView({ block }: { block: BoardOrTeamListBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {block.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div className="flex-grow">
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              <p className="text-sm text-emerald-600">{item.role}</p>
              {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function StepsHorizontalView({ block }: { block: StepsHorizontalBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {block.items.map((item, index) => (
          <div key={item.id} className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                {index + 1}
              </div>
              {index < block.items.length - 1 && <div className="hidden h-0.5 flex-grow bg-slate-200 md:block"></div>}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function TimelineVerticalView({ block }: { block: TimelineVerticalBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200 md:before:ml-20">
        {block.items.map((item) => (
          <div key={item.id} className="relative flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white md:w-40">
              {item.date || item.label}
            </div>
            <div className="flex-grow pb-8">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title || item.label}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function SectionHeaderView({ block }: { block: SectionHeaderBlock }) {
  return (
    <SectionContainer>
      <div
        className={`mb-8 ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left"}`}
      >
        {block.eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">{block.eyebrow}</p>
        )}
        <h2 className={nmTheme.textSection.title}>{block.title}</h2>
        {block.description && (
          <p
            className={`mt-3 ${block.align === "center" ? "mx-auto" : ""} max-w-2xl ${nmTheme.textSection.description}`}
          >
            {block.description}
          </p>
        )}
      </div>
    </SectionContainer>
  )
}

function CurriculumOverviewView({ block }: { block: CurriculumOverviewBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="space-y-6">
        {block.areas.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              {/* Placeholder for potential hours display if added to interface */}
            </div>
            {item.description && <p className="mb-3 text-slate-600">{item.description}</p>}
            {item.bulletPoints && item.bulletPoints.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">المواضيع:</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                  {item.bulletPoints.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

/* ========================================================================
 * 7) PageBlocks Editor Component (The main entry point for editing)
 * ======================================================================*/

interface PageBlocksEditorProps {
  value: PageBlocksValue
  onChange: (value: PageBlocksValue) => void
  mode?: PageBlocksMode
  className?: string
}

// This AddBlockModal component was previously defined inside PageBlocksEditorProps and PageBlocksEditor.
// It has been moved here to resolve the lint/suspicious/noRedeclare error.


// Modified PageBlocksEditor to include the modal toggle
function PageBlocksEditor({ value, onChange, mode = "edit", className }: PageBlocksEditorProps) {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const addBlock = (kind: BlockKind) => {
    if (!onChange) return
    const newBlock = createDefaultBlock(kind, language)
    onChange({ blocks: [...value.blocks, newBlock] })
  }

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة بلوك جديد
        </button>
        <span className="text-sm text-slate-500">
          {value.blocks.length} {value.blocks.length === 1 ? "بلوك" : "بلوكات"}
        </span>
      </div>

      <AddBlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBlock={addBlock} />

      {mode === "view" ? (
        <BlocksRenderer blocks={value.blocks} />
      ) : (
        <div className="space-y-4">
          {value.blocks.map((block, index) => (
            <div key={block.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-xs">
                <span className="font-medium text-slate-600">
                  {index + 1}. {blockLabel(block.kind)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => {
                      const idx = value.blocks.findIndex((b) => b.id === block.id)
                      if (idx === -1) return
                      const newIdx = idx - 1
                      if (newIdx < 0) return
                      const arr = [...value.blocks]
                        ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
                      onChange({ blocks: arr })
                    }}
                    className="text-slate-500 hover:text-slate-900 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === value.blocks.length - 1}
                    onClick={() => {
                      const idx = value.blocks.findIndex((b) => b.id === block.id)
                      if (idx === -1) return
                      const newIdx = idx + 1
                      if (newIdx >= value.blocks.length) return
                      const arr = [...value.blocks]
                        ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
                      onChange({ blocks: arr })
                    }}
                    className="text-slate-500 hover:text-slate-900 disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ blocks: value.blocks.filter((b) => b.id !== block.id) })}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="grid gap-4 p-4 md:grid-cols-2">
                {/* Editor side */}
                <div className="space-y-3 border-slate-100 pr-0 md:border-r md:pr-4">
                  <BlockEditor
                    block={block}
                    onChange={(updatedBlock) => {
                      const blocks = value.blocks.map((b) => (b.id === block.id ? updatedBlock : b))
                      onChange({ blocks })
                    }}
                  />
                </div>

                {/* Live preview side */}
                <div className="rounded-md bg-slate-50/70 p-3">
                  <BlocksRenderer blocks={[block]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { PageBlocksEditor }

// Updated TestimonialsSliderView with proper carousel functionality




// ADDED VIEW COMPONENTS FOR NEWLY ADDED BLOCKS
function DownloadsListView({ block }: { block: DownloadsListBlock }) {
  return (
    <section className="py-12">
      {block.header && (
        <SectionHeaderView block={{ ...block, kind: "section-header", id: `${block.id}-header`, ...block.header }} />
      )}
      <div className="container mx-auto px-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {block.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#1e40af] transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {item.fileType && <span className="uppercase font-medium">{item.fileType}</span>}
                  {item.fileSize && <span>{item.fileSize}</span>}
                </div>
              </div>
              <a
                href={item.fileUrl}
                download
                className="flex-shrink-0 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors text-sm font-medium"
              >
                تحميل
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSectionView({ block }: { block: ContactSectionBlock }) {
  return (
    <section className="py-12 bg-gray-50">
      {block.header && (
        <SectionHeaderView block={{ ...block, kind: "section-header", id: `${block.id}-header`, ...block.header }} />
      )}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">معلومات الاتصال</h3>
            {block.info.address && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">العنوان</p>
                  <p className="text-gray-600">{block.info.address}</p>
                </div>
              </div>
            )}
            {block.info.phone && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">الهاتف</p>
                  <p className="text-gray-600" dir="ltr">
                    {block.info.phone}
                  </p>
                </div>
              </div>
            )}
            {block.info.email && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">البريد الإلكتروني</p>
                  <p className="text-gray-600">{block.info.email}</p>
                </div>
              </div>
            )}
            {block.info.whatsapp && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">واتساب</p>
                  <p className="text-gray-600" dir="ltr">
                    {block.info.whatsapp}
                  </p>
                </div>
              </div>
            )}
            {block.info.workingHours && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">ساعات العمل</p>
                  <p className="text-gray-600">{block.info.workingHours}</p>
                </div>
              </div>
            )}
          </div>
          {block.showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">أرسل رسالة</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1e40af] text-white py-3 rounded-lg hover:bg-[#1e3a8a] transition-colors font-semibold"
                >
                  إرسال
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function HeroSliderView({ block }: { block: HeroSliderBlock }) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const slides = block.slides || []

  React.useEffect(() => {
    if (slides.length === 0 || !block.autoplay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, block.interval || 5000)
    return () => clearInterval(timer)
  }, [slides.length, block.autoplay, block.interval])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

  if (slides.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center">
        <p className="text-muted-foreground">لا توجد شرائح</p>
      </section>
    )
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-primary/20 rounded-lg rotate-12 animate-float" />
        <div className="absolute bottom-1/3 right-16 w-16 h-16 border-2 border-accent/20 rounded-full animate-float animation-delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg rotate-45 animate-float animation-delay-3000" />
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Overlay background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-accent/5" />

          <img
            src={slide.imageUrl || "/placeholder.svg"}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 backdrop-blur-xl rounded-full border-2 border-primary/40 shadow-2xl shadow-primary/20 animate-float">
                    <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      مرحباً بكم
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                    <span className="block text-foreground drop-shadow-lg">{slide.title}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mt-3 animate-shimmer drop-shadow-2xl">
                      {slide.subtitle}
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto drop-shadow-md">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                    <button className="group relative text-lg px-10 py-6 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all duration-500 hover:scale-105 overflow-hidden rounded-lg text-primary-foreground font-semibold">
                      <span className="relative z-10 flex items-center gap-2">
                        اعرف المزيد
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                    <button className="group text-lg px-10 py-6 border-2 border-primary/50 hover:border-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 rounded-lg font-semibold">
                      <span className="flex items-center gap-2">
                        تواصل معنا
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {block.showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background/70 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground border-2 border-primary/30 hover:border-primary shadow-2xl hover:shadow-3xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 group"
          >
            <svg className="w-7 h-7 mx-auto group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background/70 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground border-2 border-primary/30 hover:border-primary shadow-2xl hover:shadow-3xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 group"
          >
            <svg className="w-7 h-7 mx-auto group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {block.showDots && slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 bg-background/60 backdrop-blur-xl px-6 py-4 rounded-full border-2 border-primary/30 shadow-2xl">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-500 ${index === currentSlide
                ? "bg-gradient-to-r from-primary to-accent w-12 shadow-lg shadow-primary/50"
                : "bg-muted-foreground/40 w-3 hover:bg-muted-foreground/70 hover:w-6"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function MapView({ block }: { block: MapBlock }) {
  return (
    <section className="py-12">
      {block.title && (
        <div className="container mx-auto px-4 mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">{block.title}</h2>
        </div>
      )}
      <div className="w-full h-[400px]">
        <iframe
          src={block.embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}

function GalleryMasonryView({ block }: { block: GalleryMasonryBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        {block.items.map((item) => (
          <div key={item.id} className="mb-4 break-inside-avoid">
            <div className="group relative overflow-hidden rounded-lg">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.alt ?? ""}
                className="w-full transition group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-sm font-medium text-white">{item.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}



function PricingTableView({ block }: { block: PricingTableBlock }) {
  const header = block.header
  const colsClass = block.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className={`grid ${colsClass} gap-6`}>
        {block.items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border-2 p-8 ${item.isFeatured
              ? "border-emerald-600 bg-emerald-50 shadow-xl scale-105"
              : "border-slate-200 bg-white shadow-sm"
              }`}
          >
            {item.isFeatured && (
              <div className="mb-4 inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                الأكثر شعبية
              </div>
            )}
            <h3 className="mb-2 text-2xl font-bold text-slate-900">{item.title}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">{item.price}</span>
              <span className="text-slate-600">/شهرياً</span>
            </div>
            <ul className="mb-8 space-y-3">
              {item.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            {item.ctaLabel && item.ctaHref && (
              <a
                href={item.ctaHref}
                className={`block w-full rounded-lg py-3 text-center font-semibold transition ${item.isFeatured
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "border-2 border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
              >
                {item.ctaLabel}
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function VideoEmbedView({ block }: { block: VideoEmbedBlock }) {
  return (
    <SectionContainer>
      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
        <iframe
          src={block.embedUrl}
          className="h-full w-full"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {block.caption && <p className="mt-4 text-center text-sm text-slate-600">{block.caption}</p>}
    </SectionContainer>
  )
}

function DownloadListView({ block }: { block: DownloadListBlock }) {
  const header = block.header

  return (
    <SectionContainer>
      {header?.title && (
        <div className="mb-8 text-center">
          <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
          {header.description && (
            <p className={`mx-auto max-w-2xl ${nmTheme.textSection.description}`}>{header.description}</p>
          )}
        </div>
      )}
      <div className="mx-auto max-w-4xl space-y-4">
        {block.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-slate-900">{item.title}</h3>
              {item.description && <p className="mb-2 text-sm text-slate-600">{item.description}</p>}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {item.fileType && <span className="font-medium uppercase">{item.fileType}</span>}
                {item.fileSize && <span>{item.fileSize}</span>}
              </div>
            </div>
            <a
              href={item.fileUrl}
              download
              className="flex-shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              تحميل
            </a>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

function CustomHtmlEditor({
  block,
  onChange,
}: {
  block: CustomHtmlBlock
  onChange: (b: Block) => void
}) {
  const [draft, setDraft] = React.useState(block.html)
  const [showPreview, setShowPreview] = React.useState(false)

  const handleBlur = () => {
    onChange({ ...block, html: draft })
  }

  const sanitizedHtml = DOMPurify.sanitize(draft, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  })

  return (
    <div className="space-y-3 text-[11px]">
      {/* تحذير أمني */}
      <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
        <div className="flex gap-2 items-start">
          <span className="text-amber-600">⚠️</span>
          <div className="text-amber-800 text-[10px]">
            <strong>تحذير أمني:</strong> سيتم تنقية HTML تلقائياً لحمايتك من XSS. العلامات والخصائص الخطرة سيتم حذفها.
          </div>
        </div>
      </div>

      {/* أزرار التبديل */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`px-3 py-1 rounded text-[10px] ${!showPreview ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          تحرير HTML
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`px-3 py-1 rounded text-[10px] ${showPreview ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          معاينة
        </button>
      </div>

      {!showPreview ? (
        <TextareaField
          label="HTML (سيتم تنقيته تلقائياً)"
          value={draft}
          onChange={setDraft}
          rows={8}
          onBlur={handleBlur}
          className="font-mono text-[10px]"
        />
      ) : (
        <div className="border rounded-md p-3 bg-white min-h-[200px]">
          <div className="text-[9px] text-gray-500 mb-2">المعاينة (بعد التنقية):</div>
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </div>
      )}

      {/* معلومات */}
      <div className="text-[9px] text-gray-500">
        العلامات المسموح بها: p, br, strong, em, u, h1-h6, ul, ol, li, a, img, div, span, table
      </div>
    </div>
  )
}

// تم حذف: export interface SocialFeedBlock extends BaseBlock {...}
// تم حذف: | SocialFeedBlock من Block union type
// تم حذف: case "social-feed" من جميع switch statements
// تم حذف: SocialFeedEditor و SocialFeedView

function NewsletterSignupView({ block }: { block: NewsletterSignupBlock }) {
  const header = block.header

  return (
    <SectionContainer className="bg-emerald-600">
      <div className="mx-auto max-w-2xl text-center">
        {header?.title && <h2 className="mb-3 text-3xl font-bold text-white">{header.title}</h2>}
        {header?.description && <p className="mb-6 text-emerald-100">{header.description}</p>}
        <form className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder={block.placeholder || "أدخل بريدك الإلكتروني"}
            className="flex-1 rounded-lg border-0 px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {block.buttonText || "اشترك"}
          </button>
        </form>
      </div>
    </SectionContainer>
  )
}

function DividerView({ block }: { block: DividerBlock }) {
  const style = block.style || "solid"
  const color = block.color || "#ccc"
  const thickness = block.thickness || 1

  return (
    <div className="py-6">
      <hr
        style={{
          borderStyle: style,
          borderColor: color,
          borderWidth: `${thickness}px 0 0 0`,
        }}
      />
    </div>
  )
}

function SpacerView({ block }: { block: SpacerBlock }) {
  const height = block.height || 50

  return <div style={{ height: `${height}px` }} />
}

function CustomHtmlView({ block }: { block: CustomHtmlBlock }) {
  // تنقية HTML قبل عرضه
  const sanitizedHtml = DOMPurify.sanitize(block.html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  })

  return (
    <SectionContainer>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </SectionContainer>
  )
}

// --- Editors for Newly Added Blocks ---

function SectionHeaderEditor({
  block,
  onChange,
}: {
  block: SectionHeaderBlock
  onChange: (b: Block) => void
}) {
  const update = (patch: Partial<SectionHeaderBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="Eyebrow" value={block.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v || undefined })} />
      <InputField label="عنوان" value={block.title ?? ""} onChange={(v) => update({ title: v || undefined })} />
      <TextareaField
        label="وصف"
        value={block.description ?? ""}
        onChange={(v) => update({ description: v || undefined })}
        rows={3}
      />
      <SelectField
        label="المحاذاة"
        value={block.align ?? "center"}
        onChange={(v) => update({ align: v as "left" | "center" | "right" })}
        options={[
          { value: "left", label: "يسار" },
          { value: "center", label: "وسط" },
          { value: "right", label: "يمين" },
        ]}
      />
    </div>
  )
}

function HighlightBannerEditor({
  block,
  onChange,
}: {
  block: HighlightBannerBlock
  onChange: (b: Block) => void
}) {
  const update = (patch: Partial<HighlightBannerBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={block.title} onChange={(v) => update({ title: v })} />
      <TextareaField label="نص" value={block.text ?? ""} onChange={(v) => update({ text: v || undefined })} rows={2} />
      <SelectField
        label="النمط"
        value={block.variant ?? "primary"}
        onChange={(v) => update({ variant: v as "primary" | "muted" })}
        options={[
          { value: "primary", label: "رئيسي" },
          { value: "muted", label: "هادئ" },
        ]}
      />
      <InputField label="نص الزر" value={block.ctaLabel ?? ""} onChange={(v) => update({ ctaLabel: v || undefined })} />
      <InputField label="رابط الزر" value={block.ctaHref ?? ""} onChange={(v) => update({ ctaHref: v || undefined })} />
    </div>
  )
}

function CurriculumOverviewEditor({
  block,
  onChange,
}: {
  block: CurriculumOverviewBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateAreas = (updater: (areas: CurriculumOverviewBlock["areas"]) => CurriculumOverviewBlock["areas"]) =>
    onChange({ ...block, areas: updater(block.areas) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="وصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">المجالات</span>
          <button
            type="button"
            onClick={() =>
              updateAreas((areas) => [
                ...areas,
                {
                  id: createId(),
                  title: "مجال جديد",
                  bulletPoints: [],
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة مجال
          </button>
        </div>
        {block.areas.map((area) => (
          <div key={area.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="عنوان المجال"
              value={area.title}
              onChange={(v) => updateAreas((areas) => areas.map((a) => (a.id === area.id ? { ...a, title: v } : a)))}
            />
            <TextareaField
              label="وصف"
              value={area.description ?? ""}
              onChange={(v) =>
                updateAreas((areas) => areas.map((a) => (a.id === area.id ? { ...a, description: v || undefined } : a)))
              }
              rows={2}
            />
            <button
              type="button"
              onClick={() => updateAreas((areas) => areas.filter((a) => a.id !== area.id))}
              className="text-[11px] text-red-500"
            >
              حذف المجال
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function IconPointsEditor({
  block,
  onChange,
}: {
  block: IconPointsBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: IconPointsBlock["items"]) => IconPointsBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="وصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">النقاط</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  icon: "⭐",
                  title: "نقطة جديدة",
                  description: "وصف...",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة نقطة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="أيقونة"
              value={item.icon ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, icon: v || undefined } : i)))
              }
            />
            <InputField
              label="عنوان"
              value={item.title}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
            />
            <TextareaField
              label="وصف"
              value={item.description}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v } : i)))
              }
              rows={2}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف النقطة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialsEditor({
  block,
  onChange,
}: {
  block: TestimonialsBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: TestimonialsBlock["items"]) => TestimonialsBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <SelectField
        label="الأعمدة"
        value={String(block.columns ?? 3)}
        onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 })}
        options={[
          { value: "2", label: "عمودين" },
          { value: "3", label: "3 أعمدة" },
        ]}
      />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الآراء</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  quote: "رأي رائع...",
                  author: "اسم",
                  rating: 5,
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة رأي
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <TextareaField
              label="النص"
              value={item.quote}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, quote: v } : i)))}
              rows={3}
            />
            <InputField
              label="الكاتب"
              value={item.author}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, author: v } : i)))}
            />
            <InputField
              label="الدور"
              value={item.role ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, role: v || undefined } : i)))
              }
            />
            <SelectField
              label="التقييم"
              value={String(item.rating ?? 5)}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, rating: Number(v) } : i)))
              }
              options={[
                { value: "5", label: "5 نجوم" },
                { value: "4", label: "4 نجوم" },
                { value: "3", label: "3 نجوم" },
                { value: "2", label: "نجمتان" },
                { value: "1", label: "نجمة واحدة" },
              ]}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الرأي
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogosStripEditor({
  block,
  onChange,
}: {
  block: LogosStripBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: LogosStripBlock["items"]) => LogosStripBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الشعارات</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  logoUrl: "/logo.png",
                  alt: "شعار",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة شعار
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="رابط الشعار"
              value={item.logoUrl}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, logoUrl: v } : i)))}
            />
            <InputField
              label="النص البديل"
              value={item.alt ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
              }
            />
            <InputField
              label="رابط الموقع"
              value={item.href ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, href: v || undefined } : i)))
              }
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الشعار
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryGridEditor({
  block,
  onChange,
}: {
  block: GalleryGridBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: GalleryGridBlock["items"]) => GalleryGridBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <SelectField
        label="الأعمدة"
        value={String(block.columns)}
        onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
        options={[
          { value: "2", label: "عمودين" },
          { value: "3", label: "3 أعمدة" },
          { value: "4", label: "4 أعمدة" },
        ]}
      />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الصور</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  imageUrl: "/photo.jpg",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة صورة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="رابط الصورة"
              value={item.imageUrl}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v } : i)))}
            />
            <InputField
              label="النص البديل"
              value={item.alt ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
              }
            />
            <InputField
              label="التعليق"
              value={item.caption ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, caption: v || undefined } : i)))
              }
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الصورة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideoHighlightEditor({
  block,
  onChange,
}: {
  block: VideoHighlightBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const update = (patch: Partial<VideoHighlightBlock>) => onChange({ ...block, ...patch })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <InputField
        label="رابط الفيديو المضمن"
        value={block.embedUrl ?? ""}
        onChange={(v) => update({ embedUrl: v || undefined })}
      />
      <InputField
        label="رابط الفيديو"
        value={block.videoUrl ?? ""}
        onChange={(v) => update({ videoUrl: v || undefined })}
      />
      <InputField
        label="صورة مصغرة"
        value={block.thumbnailUrl ?? ""}
        onChange={(v) => update({ thumbnailUrl: v || undefined })}
      />
      <InputField label="التعليق" value={block.caption ?? ""} onChange={(v) => update({ caption: v || undefined })} />
    </div>
  )
}

function StaffGridEditor({
  block,
  onChange,
}: {
  block: StaffGridBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: StaffGridBlock["items"]) => StaffGridBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <SelectField
        label="الأعمدة"
        value={String(block.columns)}
        onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
        options={[
          { value: "2", label: "عمودين" },
          { value: "3", label: "3 أعمدة" },
          { value: "4", label: "4 أعمدة" },
        ]}
      />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الأعضاء</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  name: "اسم العضو",
                  role: "الدور",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة عضو
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="الاسم"
              value={item.name}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, name: v } : i)))}
            />
            <InputField
              label="الدور"
              value={item.role}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, role: v } : i)))}
            />
            <InputField
              label="صورة"
              value={item.photoUrl ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, photoUrl: v || undefined } : i)))
              }
            />
            <TextareaField
              label="نبذة"
              value={item.bioShort ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, bioShort: v || undefined } : i)))
              }
              rows={2}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف العضو
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function BoardOrTeamListEditor({
  block,
  onChange,
}: {
  block: BoardOrTeamListBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: BoardOrTeamListBlock["items"]) => BoardOrTeamListBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الأعضاء</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  name: "اسم",
                  role: "دور",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة عضو
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="الاسم"
              value={item.name}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, name: v } : i)))}
            />
            <InputField
              label="الدور"
              value={item.role}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, role: v } : i)))}
            />
            <TextareaField
              label="وصف"
              value={item.description ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
              }
              rows={2}
            />
            <InputField
              label="صورة"
              value={item.imageUrl ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v || undefined } : i)))
              }
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف العضو
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}


function AnimationEditor({
  block,
  onChange,
}: {
  block: Block
  onChange: (b: Block) => void
}) {
  const animations = block.blockAnimations || {}
  const updateAnimations = (patch: Partial<BlockAnimations>) =>
    onChange({ ...block, blockAnimations: { ...animations, ...patch } })

  const elementAnimations = animations.elementAnimations || []
  const updateElementAnimations = (newAnimations: any[]) =>
    updateAnimations({ elementAnimations: newAnimations })

  return (
    <div className="space-y-3 text-[11px]">
      {/* Block-Level Animations */}
      <div className="border-b pb-3">
        <h4 className="font-semibold mb-2">Block Animation</h4>

        <SelectField
          label="Entrance Animation"
          value={animations.entranceAnimation ?? ""}
          onChange={(v) => updateAnimations({ entranceAnimation: v || undefined })}
          options={[
            { value: "", label: "None" },
            ...ANIMATION_PRESETS.map(a => ({ value: a.value, label: a.label })),
          ]}
        />

        <div className="grid grid-cols-2 gap-2 mt-2">
          <SelectField
            label="Duration"
            value={animations.entranceDuration ?? ""}
            onChange={(v) => updateAnimations({ entranceDuration: v || undefined })}
            options={[
              { value: "", label: "Default" },
              ...DURATION_PRESETS.map(d => ({ value: d.value + "ms", label: d.label })),
            ]}
          />
          <SelectField
            label="Delay"
            value={animations.entranceDelay ?? ""}
            onChange={(v) => updateAnimations({ entranceDelay: v || undefined })}
            options={[
              { value: "", label: "None" },
              { value: "100ms", label: "100ms" },
              { value: "200ms", label: "200ms" },
              { value: "300ms", label: "300ms" },
              { value: "500ms", label: "500ms" },
            ]}
          />
        </div>
      </div>

      {/* Element-Level Animations */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">Element Animations</h4>
          <button
            type="button"
            onClick={() => updateElementAnimations([
              ...elementAnimations,
              {
                selector: "h2",
                animation: "fade-up",
                delay: 0,
                duration: 300,
              },
            ])}
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + Add Element
          </button>
        </div>

        {elementAnimations.map((elem, index) => (
          <div key={index} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2 mb-2">
            <InputField
              label="Selector (e.g., h2, .card, .button)"
              value={elem.selector}
              onChange={(v) => {
                const updated = [...elementAnimations]
                updated[index] = { ...elem, selector: v }
                updateElementAnimations(updated)
              }}
            />

            <SelectField
              label="Animation"
              value={elem.animation}
              onChange={(v) => {
                const updated = [...elementAnimations]
                updated[index] = { ...elem, animation: v }
                updateElementAnimations(updated)
              }}
              options={ANIMATION_PRESETS.map(a => ({ value: a.value, label: a.label }))}
            />

            <div className="grid grid-cols-3 gap-1">
              <InputField
                label="Delay (ms)"
                value={String(elem.delay ?? 0)}
                onChange={(v) => {
                  const updated = [...elementAnimations]
                  updated[index] = { ...elem, delay: parseInt(v) || 0 }
                  updateElementAnimations(updated)
                }}
                type="number"
              />
              <InputField
                label="Duration (ms)"
                value={String(elem.duration ?? 300)}
                onChange={(v) => {
                  const updated = [...elementAnimations]
                  updated[index] = { ...elem, duration: parseInt(v) || 300 }
                  updateElementAnimations(updated)
                }}
                type="number"
              />
              <InputField
                label="Stagger (ms)"
                value={String(elem.stagger ?? 0)}
                onChange={(v) => {
                  const updated = [...elementAnimations]
                  updated[index] = { ...elem, stagger: parseInt(v) || 0 }
                  updateElementAnimations(updated)
                }}
                type="number"
              />
            </div>

            <button
              type="button"
              onClick={() => updateElementAnimations(elementAnimations.filter((_, i) => i !== index))}
              className="text-[11px] text-red-500"
            >
              Remove Element
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}


function StyleEditor({
  block,
  onChange,
}: {
  block: Block
  onChange: (b: Block) => void
}) {
  const styles = block.blockStyles || {}
  const updateStyles = (patch: Partial<BlockStyles>) => onChange({ ...block, blockStyles: { ...styles, ...patch } })

  return (
    <div className="space-y-3 text-[11px]">
      {/* Background Color Palette */}
      <ColorPalette
        label="Background Color"
        value={styles.backgroundColor ?? ""}
        onChange={(v) => updateStyles({ backgroundColor: v || undefined })}
      />

      <InputField
        label="Background Image"
        value={styles.backgroundImage ?? ""}
        onChange={(v) => updateStyles({ backgroundImage: v || undefined })}
        placeholder="url(/images/bg.jpg)"
      />

      {/* Text Color Palette */}
      <ColorPalette
        label="Text Color"
        value={styles.textColor ?? ""}
        onChange={(v) => updateStyles({ textColor: v || undefined })}
        colors={TEXT_COLORS}
      />

      {/* Spacing with Dropdowns */}
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="Padding Top"
          value={styles.paddingTop ?? ""}
          onChange={(v) => updateStyles({ paddingTop: v || undefined })}
          options={[
            { value: "", label: "Default" },
            ...SPACING_PRESETS.map(s => ({ value: s.class, label: s.label })),
          ]}
        />
        <SelectField
          label="Padding Bottom"
          value={styles.paddingBottom ?? ""}
          onChange={(v) => updateStyles({ paddingBottom: v || undefined })}
          options={[
            { value: "", label: "Default" },
            ...SPACING_PRESETS.map(s => ({ value: s.class, label: s.label })),
          ]}
        />
        <SelectField
          label="Margin Top"
          value={styles.marginTop ?? ""}
          onChange={(v) => updateStyles({ marginTop: v || undefined })}
          options={[
            { value: "", label: "Default" },
            ...SPACING_PRESETS.map(s => ({ value: s.class, label: s.label })),
          ]}
        />
        <SelectField
          label="Margin Bottom"
          value={styles.marginBottom ?? ""}
          onChange={(v) => updateStyles({ marginBottom: v || undefined })}
          options={[
            { value: "", label: "Default" },
            ...SPACING_PRESETS.map(s => ({ value: s.class, label: s.label })),
          ]}
        />
      </div>

      {/* Dimensions - Keep as inputs */}
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="Width"
          value={styles.width ?? ""}
          onChange={(v) => updateStyles({ width: v || undefined })}
          placeholder="e.g. 100% or 800px"
        />
        <InputField
          label="Max Width"
          value={styles.maxWidth ?? ""}
          onChange={(v) => updateStyles({ maxWidth: v || undefined })}
          placeholder="e.g. 1200px"
        />
        <InputField
          label="Height"
          value={styles.height ?? ""}
          onChange={(v) => updateStyles({ height: v || undefined })}
          placeholder="e.g. 500px or auto"
        />
        <InputField
          label="Min Height"
          value={styles.minHeight ?? ""}
          onChange={(v) => updateStyles({ minHeight: v || undefined })}
          placeholder="e.g. 300px"
        />
      </div>

      {/* Borders and Shadows with Dropdowns */}
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="Border Radius"
          value={styles.borderRadius ?? ""}
          onChange={(v) => updateStyles({ borderRadius: v || undefined })}
          options={[
            { value: "", label: "Default" },
            ...BORDER_RADIUS_PRESETS.map(b => ({ value: b.class, label: b.label })),
          ]}
        />
        <SelectField
          label="Border Width"
          value={styles.borderWidth ?? ""}
          onChange={(v) => updateStyles({ borderWidth: v || undefined })}
          options={[
            { value: "", label: "Default" },
            ...BORDER_WIDTH_PRESETS.map(b => ({ value: b.class, label: b.label })),
          ]}
        />
        <InputField
          label="Border Color"
          value={styles.borderColor ?? ""}
          onChange={(v) => updateStyles({ borderColor: v || undefined })}
          placeholder="#e2e8f0"
        />
        <SelectField
          label="Shadow"
          value={styles.shadow ?? ""}
          onChange={(v) => updateStyles({ shadow: v || undefined })}
          options={[
            { value: "", label: "None" },
            ...SHADOW_PRESETS.map(s => ({ value: s.class, label: s.label })),
          ]}
        />
      </div>

      {/* Typography */}
      <div className="grid grid-cols-3 gap-2">
        <SelectField
          label="Text Align"
          value={styles.textAlign ?? ""}
          onChange={(v) => updateStyles({ textAlign: (v || undefined) as any })}
          options={[
            { value: "", label: "Default" },
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
        />
        <InputField
          label="Font Size"
          value={styles.fontSize ?? ""}
          onChange={(v) => updateStyles({ fontSize: v || undefined })}
          placeholder="e.g. 16px"
        />
        <InputField
          label="Font Weight"
          value={styles.fontWeight ?? ""}
          onChange={(v) => updateStyles({ fontWeight: v || undefined })}
          placeholder="e.g. 700"
        />
      </div>

      <InputField
        label="CSS Classes (Custom)"
        value={styles.className ?? ""}
        onChange={(v) => updateStyles({ className: v || undefined })}
        placeholder="my-custom-class"
      />

      <div className="border-t pt-3 mt-3">
        <InputField
          label="Custom ID (Required for Hover Effects)"
          value={styles.customId ?? ""}
          onChange={(v) => updateStyles({ customId: v || undefined })}
          placeholder="my-block-id"
        />
        <p className="text-[10px] text-slate-500 mt-1">
          💡 Set a unique ID to enable hover effects below
        </p>
      </div>

      {/* Hover Effects Section */}
      <div className="border-t pt-3 mt-3">
        <h4 className="font-semibold mb-2">Hover Effects {!styles.customId && <span className="text-red-500 text-[10px]">(Requires Custom ID)</span>}</h4>

        <div className="grid grid-cols-2 gap-2">
          <InputField
            label="Hover Background"
            value={styles.hoverBackgroundColor ?? ""}
            onChange={(v) => updateStyles({ hoverBackgroundColor: v || undefined })}
            placeholder="#f0f0f0"
          />
          <InputField
            label="Hover Text Color"
            value={styles.hoverTextColor ?? ""}
            onChange={(v) => updateStyles({ hoverTextColor: v || undefined })}
            placeholder="#000000"
          />
          <InputField
            label="Hover Border Color"
            value={styles.hoverBorderColor ?? ""}
            onChange={(v) => updateStyles({ hoverBorderColor: v || undefined })}
            placeholder="#3b82f6"
          />
          <SelectField
            label="Hover Shadow"
            value={styles.hoverShadow ?? ""}
            onChange={(v) => updateStyles({ hoverShadow: v || undefined })}
            options={[
              { value: "", label: "None" },
              ...SHADOW_PRESETS.map(s => ({ value: s.class, label: s.label })),
            ]}
          />
          <InputField
            label="Hover Scale"
            value={styles.hoverScale ?? ""}
            onChange={(v) => updateStyles({ hoverScale: v || undefined })}
            placeholder="1.05"
          />
          <SelectField
            label="Transition Duration"
            value={styles.hoverTransition ?? ""}
            onChange={(v) => updateStyles({ hoverTransition: v || undefined })}
            options={[
              { value: "", label: "Default" },
              ...DURATION_PRESETS.map(d => ({ value: d.value + "ms", label: d.label })),
            ]}
          />
        </div>
      </div>
    </div>
  )
}


function StepsHorizontalEditor({
  block,
  onChange,
}: {
  block: StepsHorizontalBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: StepsHorizontalBlock["items"]) => StepsHorizontalBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الخطوات</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  stepNumber: items.length + 1,
                  title: "خطوة جديدة",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة خطوة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
            <InputField
              label="العنوان"
              value={item.title}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
            />
            <TextareaField
              label="الوصف"
              value={item.description ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
              }
              rows={2}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الخطوة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========================================================================
 * MISSING EDITORS (Added to fix ReferenceErrors)
 * ======================================================================*/

function SpacerEditor({ block, onChange }: { block: SpacerBlock; onChange: (b: Block) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Height (px)</Label>
        <Input
          type="number"
          value={block.height}
          onChange={(e) => onChange({ ...block, height: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  )
}

function DividerEditor({ block, onChange }: { block: DividerBlock; onChange: (b: Block) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="divider-visible"
          checked={block.visible}
          onChange={(e) => onChange({ ...block, visible: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="divider-visible">Visible Line</Label>
      </div>
    </div>
  )
}



function NewsletterSignupEditor({
  block,
  onChange,
}: {
  block: NewsletterSignupBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={header.title ?? ""} onChange={(e) => updateHeader({ title: e.target.value || undefined })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={header.description ?? ""}
          onChange={(e) => updateHeader({ description: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={block.buttonText ?? ""}
          onChange={(e) => onChange({ ...block, buttonText: e.target.value || undefined })}
        />
      </div>
    </div>
  )
}

function MapEditor({ block, onChange }: { block: MapBlock; onChange: (b: Block) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Map Embed URL</Label>
        <Input value={block.embedUrl} onChange={(e) => onChange({ ...block, embedUrl: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Height</Label>
        <Input value={block.height ?? ""} onChange={(e) => onChange({ ...block, height: e.target.value || undefined })} />
      </div>
    </div>
  )
}



function VideoEmbedEditor({ block, onChange }: { block: VideoEmbedBlock; onChange: (b: Block) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video URL (YouTube/Vimeo)</Label>
        <Input value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
      </div>
    </div>
  )
}

function PricingTableEditor({ block, onChange }: { block: PricingTableBlock; onChange: (b: Block) => void }) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: PricingTableBlock["items"]) => PricingTableBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="الوصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />

      <SelectField
        label="عدد الأعمدة"
        value={block.columns.toString()}
        onChange={(v) => onChange({ ...block, columns: parseInt(v) as 2 | 3 })}
        options={[
          { value: "2", label: "2 Columns" },
          { value: "3", label: "3 Columns" },
        ]}
      />

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الخطط</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  title: "خطة جديدة",
                  price: "$0",
                  features: [],
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة خطة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <InputField
              label="اسم الخطة"
              value={item.title}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="السعر"
                value={item.price}
                onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, price: v } : i)))}
                placeholder="$99/mo"
              />
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id={`featured-${item.id}`}
                  checked={item.isFeatured ?? false}
                  onChange={(e) =>
                    updateItems((items) =>
                      items.map((i) => (i.id === item.id ? { ...i, isFeatured: e.target.checked } : i))
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor={`featured-${item.id}`} className="text-[11px]">
                  مميزة
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-600">الميزات</span>
                <button
                  type="button"
                  onClick={() =>
                    updateItems((items) =>
                      items.map((i) =>
                        i.id === item.id ? { ...i, features: [...i.features, "ميزة جديدة"] } : i
                      )
                    )
                  }
                  className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px]"
                >
                  + ميزة
                </button>
              </div>
              {item.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      updateItems((items) =>
                        items.map((i) =>
                          i.id === item.id
                            ? { ...i, features: i.features.map((f, fi) => (fi === idx ? e.target.value : f)) }
                            : i
                        )
                      )
                    }
                    className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-[10px]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateItems((items) =>
                        items.map((i) =>
                          i.id === item.id ? { ...i, features: i.features.filter((_, fi) => fi !== idx) } : i
                        )
                      )
                    }
                    className="text-[10px] text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="نص الزر"
                value={item.ctaLabel ?? ""}
                onChange={(v) =>
                  updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, ctaLabel: v || undefined } : i)))
                }
                placeholder="Get Started"
              />
              <InputField
                label="رابط الزر"
                value={item.ctaHref ?? ""}
                onChange={(v) =>
                  updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, ctaHref: v || undefined } : i)))
                }
                placeholder="/signup"
              />
            </div>

            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الخطة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function DownloadListEditor({ block, onChange }: { block: DownloadListBlock; onChange: (b: Block) => void }) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: DownloadListBlock["items"]) => DownloadListBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="الوصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الملفات</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  title: "ملف جديد",
                  fileUrl: "",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة ملف
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <InputField
              label="اسم الملف"
              value={item.title}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
            />
            <TextareaField
              label="الوصف"
              value={item.description ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
              }
              rows={2}
            />
            <InputField
              label="رابط الملف"
              value={item.fileUrl}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, fileUrl: v } : i)))}
              placeholder="/files/document.pdf"
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="نوع الملف"
                value={item.fileType ?? ""}
                onChange={(v) =>
                  updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, fileType: v || undefined } : i)))
                }
                placeholder="PDF"
              />
              <InputField
                label="حجم الملف"
                value={item.fileSize ?? ""}
                onChange={(v) =>
                  updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, fileSize: v || undefined } : i)))
                }
                placeholder="2.5 MB"
              />
            </div>
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الملف
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryMasonryEditor({
  block,
  onChange,
}: {
  block: GalleryMasonryBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: GalleryMasonryBlock["items"]) => GalleryMasonryBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="الوصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الصور</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  imageUrl: "",
                  alt: "",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة صورة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <InputField
              label="رابط الصورة"
              value={item.imageUrl}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, imageUrl: v } : i)))}
              placeholder="/images/photo.jpg"
            />
            <InputField
              label="النص البديل (Alt)"
              value={item.alt ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, alt: v || undefined } : i)))
              }
              placeholder="وصف الصورة"
            />
            <InputField
              label="التعليق"
              value={item.caption ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, caption: v || undefined } : i)))
              }
              placeholder="تعليق اختياري"
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الصورة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialsSliderEditor({
  block,
  onChange,
}: {
  block: TestimonialsSliderBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: TestimonialsSliderBlock["items"]) => TestimonialsSliderBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="الوصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoplay"
            checked={block.autoplay ?? false}
            onChange={(e) => onChange({ ...block, autoplay: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="autoplay" className="text-[11px]">
            تشغيل تلقائي
          </label>
        </div>
        {block.autoplay && (
          <InputField
            label="الفاصل الزمني (ms)"
            value={(block.interval ?? 5000).toString()}
            onChange={(v) => onChange({ ...block, interval: parseInt(v) || 5000 })}
            type="number"
          />
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الشهادات</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  quote: "",
                  author: "",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة شهادة
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <TextareaField
              label="النص"
              value={item.quote}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, quote: v } : i)))}
              rows={3}
            />
            <InputField
              label="الاسم"
              value={item.author}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, author: v } : i)))}
            />
            <InputField
              label="الوظيفة"
              value={item.role ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, role: v || undefined } : i)))
              }
              placeholder="المدير التنفيذي"
            />
            <InputField
              label="التقييم (1-5)"
              value={(item.rating ?? 5).toString()}
              onChange={(v) =>
                updateItems((items) =>
                  items.map((i) => (i.id === item.id ? { ...i, rating: parseInt(v) || 5 } : i))
                )
              }
              type="number"
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الشهادة
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactSectionEditor({
  block,
  onChange,
}: {
  block: ContactSectionBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const info = block.info ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateInfo = (patch: Partial<ContactSectionBlock["info"]>) =>
    onChange({ ...block, info: { ...info, ...patch } })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="الوصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />

      <div className="mt-3 space-y-2">
        <span className="font-medium text-slate-700">معلومات الاتصال</span>
        <InputField
          label="العنوان"
          value={info.address ?? ""}
          onChange={(v) => updateInfo({ address: v || undefined })}
          placeholder="123 Main St, City"
        />
        <div className="grid grid-cols-2 gap-2">
          <InputField
            label="الهاتف"
            value={info.phone ?? ""}
            onChange={(v) => updateInfo({ phone: v || undefined })}
            placeholder="+1234567890"
          />
          <InputField
            label="البريد الإلكتروني"
            value={info.email ?? ""}
            onChange={(v) => updateInfo({ email: v || undefined })}
            placeholder="info@example.com"
          />
        </div>
        <InputField
          label="واتساب"
          value={info.whatsapp ?? ""}
          onChange={(v) => updateInfo({ whatsapp: v || undefined })}
          placeholder="+1234567890"
        />
        <TextareaField
          label="ساعات العمل"
          value={info.workingHours ?? ""}
          onChange={(v) => updateInfo({ workingHours: v || undefined })}
          rows={2}
          placeholder="Mon-Fri: 9AM-5PM"
        />
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="show-form"
            checked={block.showForm ?? true}
            onChange={(e) => onChange({ ...block, showForm: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="show-form" className="text-[11px]">
            إظهار نموذج الاتصال
          </label>
        </div>
      </div>
    </div>
  )
}

function HeroSliderEditor({ block, onChange }: { block: HeroSliderBlock; onChange: (b: Block) => void }) {
  const updateSlides = (updater: (slides: HeroSliderBlock["slides"]) => HeroSliderBlock["slides"]) =>
    onChange({ ...block, slides: updater(block.slides) })

  return (
    <div className="space-y-3 text-[11px]">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoplay"
            checked={block.autoplay ?? true}
            onChange={(e) => onChange({ ...block, autoplay: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="autoplay" className="text-[11px]">
            تشغيل تلقائي
          </label>
        </div>
        {block.autoplay && (
          <InputField
            label="الفاصل الزمني (ms)"
            value={(block.interval ?? 5000).toString()}
            onChange={(v) => onChange({ ...block, interval: parseInt(v) || 5000 })}
            type="number"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showDots"
            checked={block.showDots ?? true}
            onChange={(e) => onChange({ ...block, showDots: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="showDots" className="text-[11px]">
            إظهار النقاط
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showArrows"
            checked={block.showArrows ?? true}
            onChange={(e) => onChange({ ...block, showArrows: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="showArrows" className="text-[11px]">
            إظهار الأسهم
          </label>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الشرائح</span>
          <button
            type="button"
            onClick={() =>
              updateSlides((slides) => [
                ...slides,
                {
                  id: createId(),
                  title: "",
                  subtitle: "",
                  description: "",
                  imageUrl: "",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة شريحة
          </button>
        </div>
        {block.slides.map((slide, index) => (
          <div key={slide.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">شريحة {index + 1}</span>
              <button
                type="button"
                onClick={() => updateSlides((slides) => slides.filter((s) => s.id !== slide.id))}
                className="text-[11px] text-red-500"
              >
                حذف
              </button>
            </div>
            <InputField
              label="العنوان"
              value={slide.title}
              onChange={(v) => updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, title: v } : s)))}
            />
            <InputField
              label="العنوان الفرعي"
              value={slide.subtitle}
              onChange={(v) =>
                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, subtitle: v } : s)))
              }
            />
            <TextareaField
              label="الوصف"
              value={slide.description}
              onChange={(v) =>
                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, description: v } : s)))
              }
              rows={2}
            />
            <InputField
              label="رابط الصورة"
              value={slide.imageUrl}
              onChange={(v) =>
                updateSlides((slides) => slides.map((s) => (s.id === slide.id ? { ...s, imageUrl: v } : s)))
              }
              placeholder="/modern-school-exterior.png"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineVerticalEditor({
  block,
  onChange,
}: {
  block: TimelineVerticalBlock
  onChange: (b: Block) => void
}) {
  const header = block.header ?? {}
  const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
  const updateItems = (updater: (items: TimelineVerticalBlock["items"]) => TimelineVerticalBlock["items"]) =>
    onChange({ ...block, items: updater(block.items) })

  return (
    <div className="space-y-3 text-[11px]">
      <InputField label="عنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />
      <TextareaField
        label="الوصف"
        value={header.description ?? ""}
        onChange={(v) => updateHeader({ description: v || undefined })}
        rows={2}
      />

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">الأحداث</span>
          <button
            type="button"
            onClick={() =>
              updateItems((items) => [
                ...items,
                {
                  id: createId(),
                  date: "",
                  title: "",
                },
              ])
            }
            className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
          >
            + إضافة حدث
          </button>
        </div>
        {block.items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <InputField
              label="التاريخ"
              value={item.date}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, date: v } : i)))}
              placeholder="2024"
            />
            <InputField
              label="العنوان"
              value={item.title}
              onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, title: v } : i)))}
            />
            <TextareaField
              label="الوصف"
              value={item.description ?? ""}
              onChange={(v) =>
                updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, description: v || undefined } : i)))
              }
              rows={2}
            />
            <button
              type="button"
              onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
              className="text-[11px] text-red-500"
            >
              حذف الحدث
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
