"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { hasUsers } from "@/lib/storage"
import { initializeAdminUser } from "@/lib/init-admin"
import { Loader2 } from 'lucide-react'

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
    if (pathname === "/setup" || pathname === "/admin-login" || pathname === "/login" || pathname === "/staff-login") {
      setChecking(false)
      return
    }

    try {
      console.log("[v0] Checking if users exist...")
      
      initializeAdminUser()
      
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (setupNeeded) {
    return null // Will redirect to setup page
  }

  return <>{children}</>
}
