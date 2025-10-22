import { Check, X } from "lucide-react"
import type { Employee } from "@/lib/storage"

interface PermissionListProps {
  permissions: Employee["permissions"]
  language?: "ar" | "en"
}

export function PermissionList({ permissions, language = "ar" }: PermissionListProps) {
  const permissionLabels = {
    canViewApplications: { ar: "عرض طلبات التوظيف", en: "View Applications" },
    canEditApplications: { ar: "تعديل طلبات التوظيف", en: "Edit Applications" },
    canApproveApplications: { ar: "الموافقة على طلبات التوظيف", en: "Approve Applications" },
    canDeleteApplications: { ar: "حذف طلبات التوظيف", en: "Delete Applications" },
    canViewServiceRequests: { ar: "عرض طلبات الخدمة", en: "View Service Requests" },
    canEditServiceRequests: { ar: "تعديل طلبات الخدمة", en: "Edit Service Requests" },
    canDeleteServiceRequests: { ar: "حذف طلبات الخدمة", en: "Delete Service Requests" },
    canViewMessages: { ar: "عرض الرسائل", en: "View Messages" },
    canReplyToMessages: { ar: "الرد على الرسائل", en: "Reply to Messages" },
    canDeleteMessages: { ar: "حذف الرسائل", en: "Delete Messages" },
    canViewContent: { ar: "عرض المحتوى", en: "View Content" },
    canEditContent: { ar: "تعديل المحتوى", en: "Edit Content" },
    canPublishContent: { ar: "نشر المحتوى", en: "Publish Content" },
    canDeleteContent: { ar: "حذف المحتوى", en: "Delete Content" },
    canViewEmployees: { ar: "عرض الموظفين", en: "View Employees" },
    canAddEmployees: { ar: "إضافة موظفين", en: "Add Employees" },
    canEditEmployees: { ar: "تعديل الموظفين", en: "Edit Employees" },
    canDeleteEmployees: { ar: "حذف الموظفين", en: "Delete Employees" },
    canViewReports: { ar: "عرض التقارير", en: "View Reports" },
    canExportData: { ar: "تصدير البيانات", en: "Export Data" },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {Object.entries(permissions).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          {value ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {permissionLabels[key as keyof Employee["permissions"]][language]}
          </span>
        </div>
      ))}
    </div>
  )
}
