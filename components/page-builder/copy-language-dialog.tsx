"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Block, PageBlocksValue } from "./types"

interface CopyLanguageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingLanguage: "ar" | "en"
  value: PageBlocksValue
  onChange: (value: PageBlocksValue) => void
}

export function CopyLanguageDialog({
  open,
  onOpenChange,
  editingLanguage,
  value,
  onChange,
}: CopyLanguageDialogProps) {
  const handleCopy = () => {
    const sourceBlocks = editingLanguage === "ar"
      ? (value.blocksEn || [])
      : (value.blocksAr || [])

    if (sourceBlocks.length === 0) {
      onOpenChange(false)
      return
    }

    // Deep clone blocks with new IDs
    const copiedBlocks = sourceBlocks.map((block: Block) => ({
      ...JSON.parse(JSON.stringify(block)),
      id: `${block.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    }))

    if (editingLanguage === "ar") {
      onChange({ ...value, blocksAr: copiedBlocks })
    } else {
      onChange({ ...value, blocksEn: copiedBlocks })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingLanguage === "ar"
              ? "نسخ المحتوى من الإنجليزية؟"
              : "Copy content from Arabic?"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-slate-600 text-right">
          {editingLanguage === "ar"
            ? "سيتم استبدال المحتوى العربي الحالي بنسخة من المحتوى الإنجليزي. هل أنت متأكد؟"
            : "This will replace the current English content with a copy of the Arabic content. Are you sure?"}
        </p>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {editingLanguage === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleCopy} className="bg-amber-600 hover:bg-amber-700">
            {editingLanguage === "ar" ? "نسخ" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CopyLanguageButtonProps {
  editingLanguage: "ar" | "en"
  blocksArCount: number
  blocksEnCount: number
  onClick: () => void
}

export function CopyLanguageButton({
  editingLanguage,
  blocksArCount,
  blocksEnCount,
  onClick,
}: CopyLanguageButtonProps) {
  // Only show if other language has content
  const shouldShow = (editingLanguage === "ar" && blocksEnCount > 0) ||
                     (editingLanguage === "en" && blocksArCount > 0)

  if (!shouldShow) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 transition-all hover:bg-amber-200"
      title={editingLanguage === "ar" ? "نسخ المحتوى من الإنجليزية" : "Copy content from Arabic"}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      <span className="hidden sm:inline">
        {editingLanguage === "ar" ? "نسخ من EN" : "Copy from AR"}
      </span>
    </button>
  )
}
