"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogIn, Mail, Lock, Home, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, currentUser, isLoading: authLoading, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return
    }

    if (isAuthenticated && currentUser) {
      console.log("[v0] User already logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [currentUser, router, authLoading, isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)

      setIsLoading(false)

      if (success) {
        setShowOptions(true)
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        })
      }
    } catch (error: any) {
      setIsLoading(false)
      console.log("[v0] Login page caught error:", error.message)

      if (error.message === "INVALID_PASSWORD") {
        console.log("[v0] Showing incorrect password toast")
        toast({
          title: "كلمة المرور غير صحيحة",
          description: "الرجاء التحقق من كلمة المرور أو إعادة تعيينها",
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push("/reset-password")} className="bg-white">
              إعادة تعيين
            </Button>
          ),
        })
      } else if (error.message === "USER_NOT_FOUND") {
        toast({
          title: "المستخدم غير موجود",
          description: "البريد الإلكتروني غير مسجل في النظام",
          variant: "destructive",
        })
      } else if (error.message === "EMPLOYEE_NOT_FOUND") {
        toast({
          title: "الموظف غير موجود",
          description: "لم يتم العثور على بيانات الموظف في النظام",
          variant: "destructive",
        })
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى",
          variant: "destructive",
        })
      }
    }
  }

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If already authenticated, don't show login (will redirect in useEffect)
  if (isAuthenticated) {
    return null
  }

  if (showOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">مرحباً بك!</h2>
            <p className="text-muted-foreground">اختر وجهتك</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full h-16 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-6 h-6 ml-2" />
              الصفحة الرئيسية
            </Button>

            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full h-16 text-lg bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              <LayoutDashboard className="w-6 h-6 ml-2" />
              لوحة التحكم
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative animate-in fade-in zoom-in duration-500">
            <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">تسجيل الدخول</h1>
          <p className="text-muted-foreground">المدرسة النموذجية للتربية الخاصة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="admin@example.com"
              className="h-12 text-lg"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="أدخل كلمة المرور"
              className="h-12 text-lg"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg bg-gradient-to-r from-primary via-primary/95 to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
          >
            <LogIn className="w-5 h-5 ml-2" />
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/reset-password")}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            نسيت كلمة المرور؟
          </Button>
        </div>

        <div className="mt-2 text-center">
          <Button variant="link" onClick={() => router.push("/")} className="text-muted-foreground hover:text-primary">
            <Home className="w-4 h-4 ml-1" />
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </Card>
    </div>
  )
}
