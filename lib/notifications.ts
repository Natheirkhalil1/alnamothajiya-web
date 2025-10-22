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
الاسم الكامل / Full Name: ${data.fullName}
مكان الميلاد / Birth Place: ${data.birthPlace}
تاريخ الميلاد / Birth Date: ${data.birthDate}
الرقم الوطني / National ID: ${data.nationalId}
الحالة الاجتماعية / Marital Status: ${data.maritalStatus}
العنوان / Address: ${data.address}
الهاتف / Phone: ${data.phone}
${data.email ? `البريد الإلكتروني / Email: ${data.email}` : ""}

💼 معلومات الوظيفة / Job Information:
الوظيفة المطلوبة / Position: ${data.position}
الراتب المتوقع / Expected Salary: ${data.expectedSalary}

🎓 التعليم / Education:
${
  data.education
    ?.map(
      (edu: any, index: number) => `
${index + 1}. ${edu.degree} - ${edu.major}
   الجامعة / University: ${edu.university}
   سنة التخرج / Graduation Year: ${edu.graduationYear}
   ${edu.gpa ? `المعدل / GPA: ${edu.gpa}` : ""}
`,
    )
    .join("\n") || "لا يوجد / None"
}

💼 الخبرات العملية / Work Experience:
${
  data.experience
    ?.map(
      (exp: any, index: number) => `
${index + 1}. ${exp.position} في / at ${exp.company}
   من / From: ${exp.startDate} إلى / To: ${exp.currentlyWorking ? "الآن / Present" : exp.endDate}
   الوصف / Description: ${exp.description}
`,
    )
    .join("\n") || "لا يوجد / None"
}

${data.cvFileName ? `📎 السيرة الذاتية / CV: ${data.cvFileName}` : ""}

تاريخ التقديم / Submission Date: ${new Date().toLocaleString("ar-JO")}
    `.trim()
  } else if (type === "service") {
    subject = "طلب خدمة جديد - New Service Request"
    message = `
طلب خدمة جديد / New Service Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 معلومات ولي الأمر / Guardian Information:
الاسم / Name: ${data.fullName}
الهاتف / Phone: ${data.phone}
البريد الإلكتروني / Email: ${data.email}

👦 معلومات الطالب / Student Information:
اسم الطالب / Student Name: ${data.studentName}
عمر الطالب / Student Age: ${data.studentAge}

📋 تفاصيل الخدمة / Service Details:
نوع الخدمة / Service Type: ${data.serviceType}
العنوان / Address: ${data.address}
التاريخ المفضل / Preferred Date: ${data.preferredDate}

📝 ملاحظات / Notes:
${data.notes || "لا يوجد / None"}

تاريخ التقديم / Submission Date: ${new Date().toLocaleString("ar-JO")}
    `.trim()
  } else if (type === "contact") {
    subject = "رسالة جديدة - New Contact Message"
    message = `
رسالة جديدة / New Contact Message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 معلومات المرسل / Sender Information:
الاسم / Name: ${data.name}
الهاتف / Phone: ${data.phone}
البريد الإلكتروني / Email: ${data.email}

💬 الرسالة / Message:
${data.message}

تاريخ الإرسال / Sent Date: ${new Date().toLocaleString("ar-JO")}
    `.trim()
  }

  // إرسال عبر WhatsApp
  const whatsappUrl = `https://wa.me/972595864023?text=${encodeURIComponent(message)}`

  // إرسال عبر البريد الإلكتروني
  const emailUrl = `mailto:mmm460286@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

  // فتح WhatsApp والبريد الإلكتروني في نوافذ جديدة
  window.open(whatsappUrl, "_blank")
  window.open(emailUrl, "_blank")
}
