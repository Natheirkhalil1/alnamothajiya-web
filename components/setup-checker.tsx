"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { hasUsers } from "@/lib/storage"
import { Loader2 } from "lucide-react"

export function SetupChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [setupNeeded, setSetupNeeded] = useState(false)

  useEffect(() => {
    checkSetup()
  }, [pathname])

  const checkSetup = async () => {
    // Skip check for setup and login pages
    if (pathname === "/setup" || pathname === "/admin-login") {
      setChecking(false)
      return
    }

    try {
      console.log("[v0] Checking if users exist...")
      const usersExist = await hasUsers()
      console.log("[v0] Users exist:", usersExist)

      if (!usersExist) {
        console.log("[v0] No users found, redirecting to setup...")
        setSetupNeeded(true)
        router.push("/setup")
      } else {
        setChecking(false)
      }
    } catch (error) {
      console.error("[v0] Error checking setup:", error)
      setChecking(false)
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      </div>
    )
  }

  if (setupNeeded) {
    return null // Will redirect to setup page
  }

  return <>{children}</>
}
