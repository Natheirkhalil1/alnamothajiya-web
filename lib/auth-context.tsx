"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirebaseAuth } from "./firebase"
import type { Employee } from "./storage"
import { updateEmployee, getEmployeeByEmail } from "./storage"

interface AuthContextType {
  currentUser: Employee | null
  firebaseUser: User | null
  isAdmin: boolean
  isLoading: boolean
  isAuthenticated: boolean
  username: string
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: keyof Employee["permissions"]) => boolean
  employee: Employee | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Key for persisting auth expectation
const AUTH_PERSISTENCE_KEY = "auth_session_active"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)
  // Track if we're fetching employee data (for showing loading state)
  const [isFetchingEmployeeState, setIsFetchingEmployeeState] = useState(false)
  // Track if onAuthStateChanged has fired at least once
  const [authInitialized, setAuthInitialized] = useState(false)

  // Track if we're currently fetching employee data to prevent race conditions
  const isFetchingEmployee = useRef(false)
  // Track the last known authenticated state to prevent flicker
  const wasAuthenticated = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    // Check if we had a previous session - if so, stay in loading state until Firebase confirms
    const hadPreviousSession = localStorage.getItem(AUTH_PERSISTENCE_KEY) === "true"
    if (hadPreviousSession) {
      console.log("[Firebase] Previous session detected, waiting for auth restoration...")
    }

    console.log("[Firebase] Setting up auth state listener...")

    try {
      const auth = getFirebaseAuth()

      const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        console.log("[Firebase] Auth state changed:", user?.email)
        setAuthInitialized(true)
        setFirebaseUser(user)

        if (user) {
          // Mark that we have an active session
          localStorage.setItem(AUTH_PERSISTENCE_KEY, "true")

          // Prevent multiple concurrent fetches
          if (isFetchingEmployee.current) {
            console.log("[Firebase] Already fetching employee, skipping...")
            return
          }

          isFetchingEmployee.current = true
          setIsFetchingEmployeeState(true)

          try {
            const employeeData = await getEmployeeByEmail(user.email!)

            if (employeeData && employeeData.isActive) {
              setCurrentUser(employeeData)
              setEmployee(employeeData)
              setIsAdmin(employeeData.role === "admin")
              wasAuthenticated.current = true

              const sessionTimestamp = localStorage.getItem("sessionTimestamp")
              if (!sessionTimestamp) {
                localStorage.setItem("sessionTimestamp", Date.now().toString())
              } else {
                // Extended to 7 days for better UX
                const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
                const sessionAge = Date.now() - Number.parseInt(sessionTimestamp)

                if (sessionAge > sevenDaysInMs) {
                  console.log("[Firebase] Session expired after 7 days, logging out")
                  await signOut(auth)
                  localStorage.removeItem("sessionTimestamp")
                  localStorage.removeItem(AUTH_PERSISTENCE_KEY)
                  setCurrentUser(null)
                  setEmployee(null)
                  setIsAdmin(false)
                  setFirebaseUser(null)
                  wasAuthenticated.current = false
                  setLoading(false)
                  isFetchingEmployee.current = false
                  return
                }
              }

              console.log("[Firebase] Employee loaded:", employeeData.fullName, "Role:", employeeData.role)
            } else {
              console.log("[Firebase] Employee not found or inactive")
              localStorage.removeItem(AUTH_PERSISTENCE_KEY)
              setCurrentUser(null)
              setEmployee(null)
              setIsAdmin(false)
              wasAuthenticated.current = false
            }
          } finally {
            isFetchingEmployee.current = false
            setIsFetchingEmployeeState(false)
          }
        } else {
          // No user - clear session markers
          localStorage.removeItem(AUTH_PERSISTENCE_KEY)
          localStorage.removeItem("sessionTimestamp")
          setCurrentUser(null)
          setEmployee(null)
          setIsAdmin(false)
          wasAuthenticated.current = false
        }

        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("[Firebase] Error setting up auth:", error)
      setLoading(false)
      setAuthInitialized(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("[Firebase] Attempting login for:", email)
      const auth = getFirebaseAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("[Firebase] Firebase auth successful:", userCredential.user.email)

      const employee = await getEmployeeByEmail(email)

      if (employee && employee.isActive) {
        setCurrentUser(employee)
        setEmployee(employee)
        setIsAdmin(employee.role === "admin")
        localStorage.setItem("sessionTimestamp", Date.now().toString())
        localStorage.setItem(AUTH_PERSISTENCE_KEY, "true")
        wasAuthenticated.current = true

        await updateEmployee(employee.id, { lastLogin: new Date().toISOString() })
        console.log("[Firebase] Login successful for:", employee.fullName)

        return true
      } else {
        console.log("[Firebase] Employee not found or inactive in Firestore")
        await signOut(auth)
        throw new Error("EMPLOYEE_NOT_FOUND")
      }
    } catch (error: any) {
      console.error("[Firebase] Login error:", error.message)
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        throw new Error("INVALID_PASSWORD")
      } else if (error.code === "auth/user-not-found") {
        throw new Error("USER_NOT_FOUND")
      } else if (error.message === "EMPLOYEE_NOT_FOUND") {
        throw new Error("EMPLOYEE_NOT_FOUND")
      } else {
        throw new Error("LOGIN_ERROR")
      }
    }
  }

  const logout = async () => {
    try {
      console.log("[Firebase] Logging out")
      const auth = getFirebaseAuth()
      await signOut(auth)
      setCurrentUser(null)
      setEmployee(null)
      setIsAdmin(false)
      setFirebaseUser(null)
      localStorage.removeItem("sessionTimestamp")
      localStorage.removeItem(AUTH_PERSISTENCE_KEY)
    } catch (error) {
      console.error("[Firebase] Logout error:", error)
    }
  }

  const hasPermission = (permission: keyof Employee["permissions"]): boolean => {
    if (isAdmin) return true
    if (!currentUser) return false
    return currentUser.permissions[permission]
  }

  // Check if we should expect a session (prevents premature redirect)
  const hadPreviousSession = typeof window !== "undefined" && localStorage.getItem(AUTH_PERSISTENCE_KEY) === "true"

  // Show loading if:
  // 1. Initial auth check is in progress (loading = true)
  // 2. We're fetching employee data
  // 3. We had a previous session but auth hasn't initialized yet (waiting for Firebase to restore)
  const isLoading = loading || isFetchingEmployeeState || (hadPreviousSession && !authInitialized)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  // User is authenticated if:
  // 1. We have a currentUser (fully loaded)
  // 2. OR firebaseUser exists and we're still fetching employee data
  // 3. OR we had a previous session and auth is being restored
  const isAuthenticated = !!currentUser || (!!firebaseUser && (wasAuthenticated.current || isFetchingEmployeeState))
  const username = currentUser?.fullName || currentUser?.email || ""

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      isAdmin,
      isLoading,
      isAuthenticated,
      username,
      login,
      logout,
      hasPermission,
      employee
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
