"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  LogOut,
  Briefcase,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
} from "lucide-react"
import {
  getEnhancedEmploymentApplications,
  updateEmploymentApplicationStatus,
  getServiceRequests,
  updateServiceRequestStatus,
  getContactMessages,
  logActivity,
  type EnhancedEmploymentApplication,
  type ServiceRequest,
  type ContactMessage,
} from "@/lib/storage"

export default function StaffDashboardPage() {
  const router = useRouter()
  const { currentUser, isAdmin, logout, hasPermission } = useAuth()
  const [applications, setApplications] = useState<EnhancedEmploymentApplication[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedApplication, setSelectedApplication] = useState<EnhancedEmploymentApplication | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [notes, setNotes] = useState("")
  const [activeTab, setActiveTab] = useState("applications")

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser && !isAdmin) {
      router.push("/staff-login")
      return
    }

    // Load data
    loadData()
  }, [currentUser, isAdmin, router])

  const loadData = () => {
    setApplications(getEnhancedEmploymentApplications())
    setServiceRequests(getServiceRequests())
    setMessages(getContactMessages())
  }

  const handleApplicationStatusChange = (id: string, status: EnhancedEmploymentApplication["status"]) => {
    if (!hasPermission("canApproveApplications")) {
      alert("ليس لديك صلاحية لتغيير حالة الطلبات")
      return
    }

    updateEmploymentApplicationStatus(id, status, notes)

    // Log activity
    const app = applications.find((a) => a.id === id)
    if (app && currentUser) {
      logActivity({
        employeeId: currentUser.id,
        employeeName: currentUser.fullName,
        action: `تم تغيير حالة طلب التوظيف لـ ${app.fullName} إلى ${getStatusLabel(status)}`,
        actionType: status === "accepted" ? "approve" : status === "rejected" ? "reject" : "update",
        targetType: "application",
        targetId: id,
        details: notes || "لا توجد ملاحظات",
      })
    }

    loadData()
    setSelectedApplication(null)
    setNotes("")
  }

  const handleServiceRequestStatusChange = (id: string, status: ServiceRequest["status"]) => {
    if (!hasPermission("canEditServiceRequests")) {
      alert("ليس لديك صلاحية لتغيير حالة الطلبات")
      return
    }

    updateServiceRequestStatus(id, status, notes)

    // Log activity
    const req = serviceRequests.find((r) => r.id === id)
    if (req && currentUser) {
      logActivity({
        employeeId: currentUser.id,
        employeeName: currentUser.fullName,
        action: `تم تغيير حالة طلب الخدمة من ${req.name} إلى ${getServiceStatusLabel(status)}`,
        actionType: "update",
        targetType: "application",
        targetId: id,
        details: notes || "لا توجد ملاحظات",
      })
    }

    loadData()
    setSelectedRequest(null)
    setNotes("")
  }

  const getStatusLabel = (status: EnhancedEmploymentApplication["status"]) => {
    const labels = {
      pending: "قيد المراجعة",
      reviewed: "تمت المراجعة",
      accepted: "مقبول",
      rejected: "مرفوض",
    }
    return labels[status]
  }

  const getServiceStatusLabel = (status: ServiceRequest["status"]) => {
    const labels = {
      pending: "قيد الانتظار",
      contacted: "تم التواصل",
      completed: "مكتمل",
      cancelled: "ملغي",
    }
    return labels[status]
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      contacted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (!currentUser && !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isAdmin ? "لوحة تحكم المدير" : "لوحة تحكم الموظف"}
                </h1>
                <p className="text-sm text-gray-600">مرحباً، {isAdmin ? "المدير" : currentUser?.fullName}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                طلبات التوظيف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{applications.length}</div>
              <p className="text-blue-100 text-sm mt-1">
                {applications.filter((a) => a.status === "pending").length} قيد المراجعة
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="w-5 h-5" />
                طلبات الخدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{serviceRequests.length}</div>
              <p className="text-purple-100 text-sm mt-1">
                {serviceRequests.filter((r) => r.status === "pending").length} قيد الانتظار
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                الرسائل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{messages.length}</div>
              <p className="text-pink-100 text-sm mt-1">رسائل الاتصال</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="applications" className="gap-2">
              <Briefcase className="w-4 h-4" />
              طلبات التوظيف
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <FileText className="w-4 h-4" />
              طلبات الخدمة
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              الرسائل
            </TabsTrigger>
          </TabsList>

          {/* Employment Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">لا توجد طلبات توظيف</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{app.fullName}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-4 text-base">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {app.position}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {app.phone}
                          </span>
                          {app.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {app.email}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>مكان الولادة:</strong> {app.birthPlace}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>تاريخ الميلاد:</strong> {app.birthDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>الحالة الاجتماعية:</strong> {app.maritalStatus}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>العنوان:</strong> {app.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>الراتب المتوقع:</strong> {app.expectedSalary}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>تاريخ التقديم:</strong> {new Date(app.submittedAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedApplication(app)} variant="outline" size="sm">
                        عرض التفاصيل
                      </Button>
                      {hasPermission("canApproveApplications") && app.status === "pending" && (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedApplication(app)
                              setNotes("")
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 ml-2" />
                            قبول
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedApplication(app)
                              setNotes("")
                            }}
                            size="sm"
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 ml-2" />
                            رفض
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="services" className="space-y-4">
            {serviceRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">لا توجد طلبات خدمة</p>
                </CardContent>
              </Card>
            ) : (
              serviceRequests.map((req) => (
                <Card key={req.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{req.name}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-4 text-base">
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {req.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {req.email}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(req.status)}>{getServiceStatusLabel(req.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>نوع الخدمة:</strong> {req.serviceType}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>الرسالة:</strong> {req.message}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>تاريخ التقديم:</strong> {new Date(req.submittedAt).toLocaleDateString("ar-EG")}
                      </p>
                      {req.notes && (
                        <p className="text-sm text-gray-600">
                          <strong>ملاحظات:</strong> {req.notes}
                        </p>
                      )}
                    </div>

                    {hasPermission("canEditServiceRequests") && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedRequest(req)
                            setNotes(req.notes || "")
                          }}
                          size="sm"
                          variant="outline"
                        >
                          تحديث الحالة
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {messages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">لا توجد رسائل</p>
                </CardContent>
              </Card>
            ) : (
              messages.map((msg) => (
                <Card key={msg.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{msg.name}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-4 text-base">
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {msg.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {msg.email}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">{"★".repeat(msg.rating)}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{msg.message}</p>
                    <p className="text-sm text-gray-500">{new Date(msg.submittedAt).toLocaleDateString("ar-EG")}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل طلب التوظيف</DialogTitle>
            <DialogDescription>معلومات كاملة عن المتقدم للوظيفة</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">الاسم الكامل</p>
                    <p className="font-medium">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">مكان الولادة</p>
                    <p className="font-medium">{selectedApplication.birthPlace}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                    <p className="font-medium">{selectedApplication.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم الهوية</p>
                    <p className="font-medium">{selectedApplication.nationalId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الحالة الاجتماعية</p>
                    <p className="font-medium">{selectedApplication.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">العنوان</p>
                    <p className="font-medium">{selectedApplication.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الهاتف</p>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  {selectedApplication.email && (
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  معلومات الوظيفة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">الوظيفة المطلوبة</p>
                    <p className="font-medium">{selectedApplication.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الراتب المتوقع</p>
                    <p className="font-medium">{selectedApplication.expectedSalary}</p>
                  </div>
                </div>
              </div>

              {/* Education */}
              {selectedApplication.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    المؤهلات العلمية
                  </h3>
                  <div className="space-y-3">
                    {selectedApplication.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-600">الدرجة العلمية</p>
                            <p className="font-medium">{edu.degree}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">التخصص</p>
                            <p className="font-medium">{edu.major}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">الجامعة</p>
                            <p className="font-medium">{edu.university}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">سنة التخرج</p>
                            <p className="font-medium">{edu.graduationYear}</p>
                          </div>
                          {edu.gpa && (
                            <div>
                              <p className="text-sm text-gray-600">المعدل</p>
                              <p className="font-medium">{edu.gpa}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedApplication.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    الخبرات العملية
                  </h3>
                  <div className="space-y-3">
                    {selectedApplication.experience.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-600">الشركة</p>
                            <p className="font-medium">{exp.company}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">المنصب</p>
                            <p className="font-medium">{exp.position}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">تاريخ البدء</p>
                            <p className="font-medium">{exp.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                            <p className="font-medium">{exp.currentlyWorking ? "حتى الآن" : exp.endDate}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">الوصف</p>
                            <p className="font-medium">{exp.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {hasPermission("canApproveApplications") && (
                <div>
                  <Label htmlFor="notes" className="text-base font-semibold mb-2 block">
                    ملاحظات
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أضف ملاحظاتك هنا..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}

              {/* Actions */}
              {hasPermission("canApproveApplications") && selectedApplication.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApplicationStatusChange(selectedApplication.id, "accepted")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    قبول الطلب
                  </Button>
                  <Button
                    onClick={() => handleApplicationStatusChange(selectedApplication.id, "rejected")}
                    className="flex-1"
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 ml-2" />
                    رفض الطلب
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Request Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث حالة طلب الخدمة</DialogTitle>
            <DialogDescription>اختر الحالة الجديدة وأضف ملاحظاتك</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="request-notes" className="mb-2 block">
                  ملاحظات
                </Label>
                <Textarea
                  id="request-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف ملاحظاتك هنا..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleServiceRequestStatusChange(selectedRequest.id, "contacted")}
                  variant="outline"
                >
                  تم التواصل
                </Button>
                <Button
                  onClick={() => handleServiceRequestStatusChange(selectedRequest.id, "completed")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  مكتمل
                </Button>
                <Button
                  onClick={() => handleServiceRequestStatusChange(selectedRequest.id, "cancelled")}
                  variant="destructive"
                >
                  ملغي
                </Button>
                <Button
                  onClick={() => handleServiceRequestStatusChange(selectedRequest.id, "pending")}
                  variant="outline"
                >
                  قيد الانتظار
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
