"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Download,
  Trash2,
  LogOut,
  Users,
  TrendingUp,
  Star,
  Calendar,
  Mail,
  Phone,
  User,
  FileText,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { isAuthenticated, logout, getUsername } from "@/lib/auth"
import {
  getEmploymentApplications,
  getContactMessages,
  deleteEmploymentApplication,
  deleteContactMessage,
  type EmploymentApplication,
  type ContactMessage,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<EmploymentApplication[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    setUsername(getUsername() || "")
    loadData()
  }, [router])

  const loadData = () => {
    setApplications(getEmploymentApplications())
    setMessages(getContactMessages())
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً",
    })
    router.push("/login")
  }

  const exportToExcel = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {})
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()

    toast({
      title: "تم التصدير بنجاح",
      description: `تم تنزيل ${filename}.csv`,
    })
  }

  const handleDeleteApplication = (id: string) => {
    deleteEmploymentApplication(id)
    loadData()
    toast({
      title: "تم الحذف",
      description: "تم حذف طلب التوظيف بنجاح",
    })
  }

  const handleDeleteMessage = (id: string) => {
    deleteContactMessage(id)
    loadData()
    toast({
      title: "تم الحذف",
      description: "تم حذف الرسالة بنجاح",
    })
  }

  const stats = [
    {
      title: "طلبات التوظيف",
      value: applications.length,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "الرسائل",
      value: messages.length,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
    },
    {
      title: "متوسط التقييم",
      value:
        messages.length > 0 ? (messages.reduce((acc, msg) => acc + msg.rating, 0) / messages.length).toFixed(1) : "0",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "إجمالي المستخدمين",
      value: new Set([...applications.map((a) => a.email), ...messages.map((m) => m.email)]).size,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative">
                <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6" />
                  لوحة التحكم
                </h1>
                <p className="text-sm text-primary-foreground/80">مرحباً، {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="secondary"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                الصفحة الرئيسية
              </Button>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="applications" className="text-base">
              <Briefcase className="w-4 h-4 ml-2" />
              طلبات التوظيف ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-base">
              <MessageSquare className="w-4 h-4 ml-2" />
              الرسائل ({messages.length})
            </TabsTrigger>
          </TabsList>

          {/* Employment Applications */}
          <TabsContent value="applications" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  طلبات التوظيف
                </h2>
                <Button
                  onClick={() => exportToExcel(applications, "employment-applications")}
                  disabled={applications.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">لا توجد طلبات توظيف حالياً</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{app.fullName}</h3>
                            <Badge className="mt-1 bg-primary/10 text-primary hover:bg-primary/20">
                              {app.position}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteApplication(app.id)}
                          variant="destructive"
                          size="sm"
                          className="hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="truncate">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>الرقم الوطني: {app.nationalId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4 text-primary" />
                          <span>الجنس: {app.gender === "male" ? "ذكر" : "أنثى"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span>الخبرة: {app.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span>الراتب المتوقع: {app.expectedSalary}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-foreground mb-2">نبذة عن المتقدم:</p>
                        <p className="text-muted-foreground leading-relaxed">{app.coverLetter}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>تاريخ التقديم: {new Date(app.submittedAt).toLocaleDateString("ar-EG")}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Contact Messages */}
          <TabsContent value="messages" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  رسائل التواصل
                </h2>
                <Button
                  onClick={() => exportToExcel(messages, "contact-messages")}
                  disabled={messages.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">لا توجد رسائل حالياً</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="p-6 hover:shadow-lg transition-shadow border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{msg.name}</h3>
                            <div className="flex gap-1 mt-1">
                              {Array.from({ length: msg.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteMessage(msg.id)}
                          variant="destructive"
                          size="sm"
                          className="hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{msg.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="truncate">{msg.email}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-foreground mb-2">الرسالة:</p>
                        <p className="text-muted-foreground leading-relaxed">{msg.message}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>تاريخ الإرسال: {new Date(msg.submittedAt).toLocaleDateString("ar-EG")}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
