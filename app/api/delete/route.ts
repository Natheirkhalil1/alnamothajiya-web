import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseStorage } from "@/lib/firebase"
import { ref, deleteObject } from "firebase/storage"

export async function DELETE(request: NextRequest) {
  try {
    const { url, path } = await request.json()

    if (!url && !path) {
      return NextResponse.json({ error: "No URL or path provided" }, { status: 400 })
    }

    const storage = getFirebaseStorage()

    // If path is provided, use it directly
    // Otherwise, extract path from Firebase Storage URL
    let storagePath = path

    if (!storagePath && url) {
      // Firebase Storage URLs look like:
      // https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[encoded-path]?alt=media&token=...
      // We need to extract and decode the path
      try {
        const urlObj = new URL(url)
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/)
        if (pathMatch) {
          storagePath = decodeURIComponent(pathMatch[1])
        }
      } catch {
        return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
      }
    }

    if (!storagePath) {
      return NextResponse.json({ error: "Could not determine file path" }, { status: 400 })
    }

    // Only allow deletion of files in web_uploads folder
    if (!storagePath.startsWith("web_uploads/")) {
      return NextResponse.json({ error: "Cannot delete files outside web_uploads folder" }, { status: 403 })
    }

    const storageRef = ref(storage, storagePath)
    await deleteObject(storageRef)

    console.log("[Firebase] File deleted from Firebase Storage:", storagePath)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[Firebase] Delete error:", error)

    // If file doesn't exist, consider it a success
    if (error.code === "storage/object-not-found") {
      return NextResponse.json({ success: true, message: "File already deleted" })
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
