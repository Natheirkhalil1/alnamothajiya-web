import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseStorage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const storage = getFirebaseStorage()

    // Create unique filename with timestamp and random suffix
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 9)
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}_${randomSuffix}.${fileExtension}`

    // Store in web_uploads folder with subfolder
    // Subfolders: general, review_images, jobs_apps_files, forms_uploads
    const storagePath = `web_uploads/${folder}/${fileName}`
    const storageRef = ref(storage, storagePath)

    // Convert file to buffer for Firebase
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload file to Firebase Storage
    await uploadBytes(storageRef, uint8Array, {
      contentType: file.type,
    })

    // Get public download URL
    const downloadURL = await getDownloadURL(storageRef)

    console.log("[Firebase] File uploaded to Firebase Storage:", downloadURL)

    return NextResponse.json({
      url: downloadURL,
      filename: file.name,
      size: file.size,
      type: file.type,
      path: storagePath,
    })
  } catch (error) {
    console.error("[Firebase] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
