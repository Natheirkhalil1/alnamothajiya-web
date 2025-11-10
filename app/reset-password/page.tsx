"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { sendPasswordResetEmail } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowRight, Home } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const auth = getFirebaseAuth()
      await sendPasswordResetEmail(auth, email)

      setEmailSent(true)
      toast({
        title: "تم إرسال رسالة إعادة تعيين كلمة المرور",
        description: "الرجاء التحقق من بريدك الإلكتروني",
      })
    } catch (error: any) {
      console.error("Reset password error:", error)
      toast({
        title: "خطأ",
        description:
          error.code === "auth/user-not-found"
            ? "البريد الإلكتروني غير مسجل"
            : "حدث خطأ أثناء إرسال رسالة إعادة التعيين",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">تم إرسال البريد الإلكتروني</h2>
          <p className="text-muted-foreground mb-8">
            تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. الرجاء التحقق من صندوق الوارد والبريد غير
            المرغوب فيه.
          </p>

          <div className="space-y-3">
            <Button onClick={() => router.push("/login")} className="w-full">
              العودة لتسجيل الدخول
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setEmailSent(false)
                setEmail("")
              }}
              className="w-full"
            >
              إرسال مرة أخرى
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
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-muted-foreground">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="h-12 text-lg"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg bg-gradient-to-r from-primary via-primary/95 to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Button
            variant="link"
            onClick={() => router.push("/login")}
            className="text-muted-foreground hover:text-primary"
          >
            العودة لتسجيل الدخول
          </Button>

          <div>
            <Button
              variant="link"
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-primary"
            >
              <Home className="w-4 h-4 ml-1" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
