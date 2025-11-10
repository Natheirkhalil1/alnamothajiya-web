import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseStorage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const storage = getFirebaseStorage()

    // Create unique filename with timestamp and random suffix
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 9)
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}_${randomSuffix}.${fileExtension}`

    // Store in web_uploads folder as requested
    const storageRef = ref(storage, `web_uploads/${fileName}`)

    // Convert file to buffer for Firebase
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file to Firebase Storage
    await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    })

    // Get public download URL
    const downloadURL = await getDownloadURL(storageRef)

    console.log("[v0] File uploaded to Firebase Storage:", downloadURL)

    return NextResponse.json({
      url: downloadURL,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
