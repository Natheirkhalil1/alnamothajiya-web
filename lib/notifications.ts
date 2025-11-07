export interface NotificationData {
  type: "employment" | "service" | "contact"
  data: Record<string, any>
}

export function sendNotifications(notificationData: NotificationData) {
  const { type, data } = notificationData

  let message = ""
  let subject = ""

  if (type === "employment") {
    subject = "طلب توظيف جديد - New Employment Application"
    message = `
طلب توظيف جديد / New Employment Application
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 المعلومات الشخصية / Personal Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الاسم الكامل / Full Name: ${data.fullName}
مكان الميلاد / Birth Place: ${data.birthPlace}
تاريخ الميلاد / Birth Date: ${data.birthDate}
الرقم الوطني / National ID: ${data.nationalId}
الجنس / Gender: ${data.gender}
الحالة الاجتماعية / Marital Status: ${data.maritalStatus}
إمكانية المبيت / Can Stay Overnight: ${data.canStayOvernight}
العنوان / Address: ${data.address}
الهاتف / Phone: ${data.phone}

💼 معلومات الوظيفة / Job Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الوظيفة المطلوبة / Position: ${data.position}
الراتب المتوقع / Expected Salary: ${data.expectedSalary}

🎓 المؤهلات العلمية / Educational Qualifications:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  data.education && data.education.length > 0
    ? data.education
        .map(
          (edu: any, index: number) => `
${index + 1}. ${edu.degree} - ${edu.major}
   الجامعة / University: ${edu.university}
   سنة التخرج / Graduation Year: ${edu.graduationYear}
   ${edu.gpa ? `المعدل / GPA: ${edu.gpa}` : ""}
`,
        )
        .join("\n")
    : "لا يوجد / None"
}

💼 الخبرات العملية / Work Experience:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  data.experience && data.experience.length > 0
    ? data.experience
        .map(
          (exp: any, index: number) => `
${index + 1}. ${exp.jobTitle} في / at ${exp.institution}
   المدة / Duration: ${exp.duration}
   المهام والمسؤوليات / Responsibilities:
   ${exp.responsibilities}
`,
        )
        .join("\n")
    : "لا يوجد / None"
}

${data.cvFileName ? `📎 السيرة الذاتية / CV: ${data.cvFileName}` : ""}

📅 تاريخ التقديم / Submission Date: ${new Date().toLocaleString("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
    `.trim()
  } else if (type === "service") {
    subject = "طلب خدمة جديد - New Service Request"
    message = `
طلب خدمة جديد / New Service Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 معلومات مقدم الطلب / Applicant Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الاسم / Name: ${data.name}
الهاتف / Phone: ${data.phone}
البريد الإلكتروني / Email: ${data.email}

📋 تفاصيل الخدمة / Service Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
نوع الخدمة / Service Type: ${data.serviceType}

📝 الرسالة / Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

📅 تاريخ التقديم / Submission Date: ${new Date().toLocaleString("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
    `.trim()
  } else if (type === "contact") {
    subject = "رسالة جديدة - New Contact Message"
    message = `
رسالة جديدة / New Contact Message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 معلومات المرسل / Sender Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الاسم / Name: ${data.name}
الهاتف / Phone: ${data.phone}
البريد الإلكتروني / Email: ${data.email}
${data.rating ? `التقييم / Rating: ${"⭐".repeat(data.rating)}` : ""}

💬 الرسالة / Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

📅 تاريخ الإرسال / Sent Date: ${new Date().toLocaleString("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
    `.trim()
  }

  // إرسال عبر WhatsApp
  const whatsappNumber = "972595864023" // رقم الواتساب الخاص بالمدرسة
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  // إرسال عبر البريد الإلكتروني
  const schoolEmail = "mmm460286@gmail.com" // البريد الإلكتروني الخاص بالمدرسة
  const emailUrl = `mailto:${schoolEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

  // فتح WhatsApp والبريد الإلكتروني في نوافذ جديدة (يتم حفظ البيانات في لوحة التحكم تلقائياً)
  // ملاحظة: هذه هي الطريقة الوحيدة لإرسال الرسائل من المتصفح بدون خادم
  if (typeof window !== "undefined") {
    // فتح WhatsApp في نافذة جديدة
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")

    // فتح البريد الإلكتروني في نافذة جديدة بعد ثانية واحدة
    setTimeout(() => {
      window.open(emailUrl, "_blank", "noopener,noreferrer")
    }, 1000)
  }

  // البيانات يتم حفظها تلقائياً في لوحة التحكم عبر localStorage
  // من خلال الدوال: saveEnhancedEmploymentApplication, saveServiceRequest, saveContactMessage
}
