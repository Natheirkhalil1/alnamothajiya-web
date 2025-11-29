import { Badge } from "@/components/ui/badge"
import type { Employee } from "@/lib/storage"

interface EmployeeRoleBadgeProps {
  role: Employee["role"]
  language?: "ar" | "en"
}

export function EmployeeRoleBadge({ role, language = "ar" }: EmployeeRoleBadgeProps) {
  const roleLabels = {
    admin: { ar: "مدير عام", en: "Admin" },
    hr_manager: { ar: "مدير توظيف", en: "HR Manager" },
    service_manager: { ar: "مدير خدمات", en: "Service Manager" },
    content_manager: { ar: "مدير محتوى", en: "Content Manager" },
    receptionist: { ar: "موظف استقبال", en: "Receptionist" },
    employee: { ar: "موظف", en: "Employee" },
    viewer: { ar: "مشاهد", en: "Viewer" },
  }

  const roleColors = {
    admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    hr_manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    service_manager: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    content_manager: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    receptionist: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    employee: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    viewer: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  }

  return <Badge className={roleColors[role]}>{roleLabels[role][language]}</Badge>
}
