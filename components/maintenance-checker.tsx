"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getMaintenanceSettings } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"

// Pages that should remain accessible even during maintenance
const ALLOWED_PATHS = [
  "/maintenance",
  "/login",
  "/dashboard",
  "/reset-password",
  "/setup",
]

export function MaintenanceChecker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, isAuthenticated, isLoading } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const checkMaintenance = useCallback(() => {
    // Don't check on server or before mount
    if (typeof window === "undefined" || !isMounted) return

    try {
      const settings = getMaintenanceSettings()
      console.log("[Maintenance] Checking mode:", settings.enabled, "Path:", pathname)

      // If maintenance is not enabled, allow access
      if (!settings.enabled) {
        setIsChecking(false)
        setShouldRedirect(false)
        return
      }

      // Check if current path is in allowed paths
      const isAllowedPath = ALLOWED_PATHS.some((path) =>
        pathname === path || pathname?.startsWith(path + "/")
      )

      console.log("[Maintenance] Is allowed path:", isAllowedPath, "Is admin:", isAdmin)

      // Allow access if:
      // 1. Path is in allowed paths (login, dashboard, maintenance, etc.)
      // 2. User is authenticated admin
      if (isAllowedPath || (isAuthenticated && isAdmin)) {
        setIsChecking(false)
        setShouldRedirect(false)
        return
      }

      // Redirect to maintenance page
      console.log("[Maintenance] Redirecting to maintenance page")
      setShouldRedirect(true)
      setIsChecking(false)
    } catch (error) {
      console.error("[Maintenance] Error checking maintenance:", error)
      setIsChecking(false)
      setShouldRedirect(false)
    }
  }, [pathname, isAdmin, isAuthenticated, isMounted])

  useEffect(() => {
    // Wait for mount and auth to load
    if (!isMounted || isLoading) {
      return
    }

    checkMaintenance()

    // Listen for storage changes (custom event)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail?.key === "maintenanceSettings") {
        console.log("[Maintenance] Settings changed via custom event")
        checkMaintenance()
      }
    }

    // Also listen for native storage events (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "maintenanceSettings") {
        console.log("[Maintenance] Settings changed via storage event")
        checkMaintenance()
      }
    }

    window.addEventListener("localStorageChange", handleCustomStorageChange as EventListener)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("localStorageChange", handleCustomStorageChange as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [isMounted, isLoading, checkMaintenance])

  useEffect(() => {
    if (shouldRedirect && !isChecking && isMounted) {
      router.replace("/maintenance")
    }
  }, [shouldRedirect, isChecking, isMounted, router])

  // Don't show loading on server - just render children
  if (!isMounted) {
    return <>{children}</>
  }

  // Show loading while checking
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If should redirect, show loading while redirecting
  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
