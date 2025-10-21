import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Format service request for email and WhatsApp
    const message = `
📋 طلب خدمة جديد

الاسم: ${data.name}
الهاتف: ${data.phone}
البريد الإلكتروني: ${data.email}
نوع الخدمة: ${data.serviceType}

الرسالة:
${data.message}

📅 تاريخ الطلب: ${new Date().toLocaleString("ar-EG")}
    `

    // Send to WhatsApp
    const whatsappNumber = "+972595864023"
    const whatsappMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    console.log("[v0] Service request submitted:", data)
    console.log("[v0] WhatsApp URL:", whatsappUrl)

    return NextResponse.json({
      success: true,
      message: "Service request submitted successfully",
      whatsappUrl,
    })
  } catch (error) {
    console.error("[v0] Error submitting service request:", error)
    return NextResponse.json({ success: false, error: "Failed to submit service request" }, { status: 500 })
  }
}
