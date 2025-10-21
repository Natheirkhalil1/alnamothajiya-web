import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Format application data for email and WhatsApp
    const message = `
🎓 طلب توظيف جديد

👤 المعلومات الشخصية:
الاسم: ${data.fullName}
مكان الولادة: ${data.birthPlace}
تاريخ الولادة: ${data.birthDate}
رقم الهوية: ${data.nationalId}
الحالة الاجتماعية: ${data.maritalStatus}
العنوان: ${data.address}
الهاتف: ${data.phone}
الوظيفة المطلوبة: ${data.position}
الراتب المتوقع: ${data.expectedSalary}

🎓 المؤهلات العلمية:
${data.education
  .map(
    (edu: any, i: number) => `
${i + 1}. ${edu.degree} في ${edu.major}
   الجامعة: ${edu.university}
   سنة التخرج: ${edu.graduationYear}
   ${edu.gpa ? `المعدل: ${edu.gpa}` : ""}
`,
  )
  .join("\n")}

💼 الخبرات العملية:
${
  data.experience.length > 0
    ? data.experience
        .map(
          (exp: any, i: number) => `
${i + 1}. ${exp.position} في ${exp.company}
   من: ${exp.startDate} إلى: ${exp.currentlyWorking ? "حتى الآن" : exp.endDate}
   ${exp.description}
`,
        )
        .join("\n")
    : "لا توجد خبرات"
}

📅 تاريخ التقديم: ${new Date().toLocaleString("ar-EG")}
    `

    // Send to WhatsApp (using WhatsApp Business API or direct link)
    const whatsappNumber = "+972595864023" // Replace with actual number
    const whatsappMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    // In a real implementation, you would:
    // 1. Send email using a service like SendGrid, Resend, or Nodemailer
    // 2. Send WhatsApp message using WhatsApp Business API
    // 3. Save to database

    console.log("[v0] Application submitted:", data)
    console.log("[v0] WhatsApp URL:", whatsappUrl)

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      whatsappUrl,
    })
  } catch (error) {
    console.error("[v0] Error submitting application:", error)
    return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 })
  }
}
