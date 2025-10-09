"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogIn, Mail, Lock, Home, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showOptions, setShowOptions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (login(formData.email, formData.password)) {
      setShowOptions(true)
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      })
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      })
    }
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
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg bg-gradient-to-r from-primary via-primary/95 to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
          >
            <LogIn className="w-5 h-5 ml-2" />
            تسجيل الدخول
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => router.push("/")} className="text-muted-foreground hover:text-primary">
            <Home className="w-4 h-4 ml-1" />
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </Card>
    </div>
  )
}
