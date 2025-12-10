"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CheckStoragePage() {
  const [output, setOutput] = useState("Click 'Check Pages Data' to inspect...")

  const checkPages = () => {
    const pagesData = localStorage.getItem('pages')

    if (!pagesData) {
      setOutput('No pages found in localStorage')
      return
    }

    try {
      const pages = JSON.parse(pagesData)
      let result = `Found ${pages.length} page(s)\n\n`

      pages.forEach((page: any, index: number) => {
        result += `\n${'='.repeat(80)}\n`
        result += `Page ${index + 1}:\n`
        result += `${'='.repeat(80)}\n`
        result += `ID: ${page.id}\n`
        result += `Slug: ${page.slug}\n`
        result += `Title AR: ${page.titleAr}\n`
        result += `Title EN: ${page.titleEn}\n`
        result += `Is Home: ${page.isHome ? 'YES' : 'NO'}\n`
        result += `Published: ${page.isPublished ? 'YES' : 'NO'}\n`
        result += `\n--- Blocks Info ---\n`
        result += `blocksAr: ${page.blocksAr ? page.blocksAr.length + ' blocks' : 'NOT SET'}\n`
        result += `blocksEn: ${page.blocksEn ? page.blocksEn.length + ' blocks' : 'NOT SET'}\n`
        result += `blocks (legacy): ${page.blocks ? page.blocks.length + ' blocks' : 'NOT SET'}\n`

        if (page.blocksAr && page.blocksAr.length > 0) {
          result += `\n--- Arabic Blocks ---\n`
          page.blocksAr.forEach((block: any, i: number) => {
            result += `  ${i + 1}. ${block.kind || block.type}\n`
          })
        }

        if (page.blocksEn && page.blocksEn.length > 0) {
          result += `\n--- English Blocks ---\n`
          page.blocksEn.forEach((block: any, i: number) => {
            result += `  ${i + 1}. ${block.kind || block.type}\n`
          })
        }

        if (page.blocks && page.blocks.length > 0) {
          result += `\n--- Legacy Blocks ---\n`
          page.blocks.forEach((block: any, i: number) => {
            result += `  ${i + 1}. ${block.kind || block.type}\n`
          })
        }
      })

      setOutput(result)
    } catch (e: any) {
      setOutput('Error parsing pages data: ' + e.message + '\n\nRaw data (first 500 chars):\n' + pagesData?.substring(0, 500))
    }
  }

  const clearAllPages = () => {
    if (confirm('Are you sure you want to delete ALL pages from localStorage? This cannot be undone.')) {
      localStorage.removeItem('pages')
      setOutput('All pages cleared from localStorage!')
    }
  }

  const deletePageBySlug = () => {
    const slug = prompt('Enter the slug of the page to delete (e.g., "home"):')
    if (!slug) return

    const pagesData = localStorage.getItem('pages')
    if (!pagesData) {
      setOutput('No pages found in localStorage')
      return
    }

    try {
      const pages = JSON.parse(pagesData)
      const filtered = pages.filter((p: any) => p.slug !== slug)

      if (filtered.length === pages.length) {
        setOutput(`No page found with slug "${slug}"`)
        return
      }

      localStorage.setItem('pages', JSON.stringify(filtered))
      setOutput(`Page with slug "${slug}" deleted! ${filtered.length} pages remaining.`)
    } catch (e: any) {
      setOutput('Error: ' + e.message)
    }
  }

  const repairPages = () => {
    const pagesData = localStorage.getItem('pages')
    if (!pagesData) {
      setOutput('No pages found in localStorage')
      return
    }

    try {
      // Try to parse and re-stringify to fix any formatting issues
      const pages = JSON.parse(pagesData)
      localStorage.setItem('pages', JSON.stringify(pages))
      setOutput(`Successfully repaired ${pages.length} pages!`)
    } catch (e: any) {
      // If parse fails, the data is corrupted - offer to clear
      setOutput('Data is corrupted and cannot be repaired.\n\nError: ' + e.message + '\n\nUse "Clear All Pages" to start fresh.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8">
      <Card className="max-w-6xl mx-auto p-6 bg-black border-green-500">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">LocalStorage Data Inspector</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={checkPages} className="bg-green-500 text-black hover:bg-green-600">
            Check Pages Data
          </Button>
          <Button onClick={repairPages} className="bg-yellow-500 text-black hover:bg-yellow-600">
            Repair Pages
          </Button>
          <Button onClick={deletePageBySlug} className="bg-orange-500 text-black hover:bg-orange-600">
            Delete Page by Slug
          </Button>
          <Button onClick={clearAllPages} className="bg-red-500 text-white hover:bg-red-600">
            Clear All Pages
          </Button>
          <Button onClick={() => setOutput('')} variant="outline" className="border-green-500 text-green-500">
            Clear Output
          </Button>
        </div>

        <div>
          <h2 className="text-xl text-cyan-400 mb-4">Pages in localStorage:</h2>
          <pre className="bg-black border border-green-500 p-4 overflow-auto max-h-[600px] text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </Card>
    </div>
  )
}
