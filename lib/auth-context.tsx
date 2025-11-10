"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, type User } from "firebase/auth"
import { getFirebaseAuth } from "./firebase"
import type { Employee } from "./storage"
import { updateEmployee, getEmployeeByEmail } from "./storage"

interface AuthContextType {
  currentUser: Employee | null
  firebaseUser: User | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: keyof Employee["permissions"]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[v0] Auth state changed:", user?.email)
      setFirebaseUser(user)

      if (user) {
        const employee = await getEmployeeByEmail(user.email!)

        if (employee && employee.isActive) {
          setCurrentUser(employee)
          setIsAdmin(employee.role === "admin")
          console.log("[v0] Employee loaded:", employee.fullName, "Role:", employee.role)
        } else {
          console.log("[v0] Employee not found or inactive")
          setCurrentUser(null)
          setIsAdmin(false)
        }
      } else {
        setCurrentUser(null)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("[v0] Attempting login for:", email)
      const auth = getFirebaseAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("[v0] Firebase auth successful:", userCredential.user.email)

      const employee = await getEmployeeByEmail(email)

      if (employee && employee.isActive) {
        setCurrentUser(employee)
        setIsAdmin(employee.role === "admin")

        await updateEmployee(employee.id, { lastLogin: new Date().toISOString() })
        console.log("[v0] Login successful for:", employee.fullName)

        return true
      } else {
        console.log("[v0] Employee not found or inactive in Firestore")
        // Sign out if employee doesn't exist in Firestore
        await firebaseSignOut(auth)
        throw new Error("EMPLOYEE_NOT_FOUND")
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error.code, error.message)
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        throw new Error("INVALID_PASSWORD")
      } else if (error.code === "auth/user-not-found") {
        throw new Error("USER_NOT_FOUND")
      } else if (error.message === "EMPLOYEE_NOT_FOUND") {
        throw error
      } else {
        throw new Error("LOGIN_FAILED")
      }
    }
  }

  const logout = async () => {
    try {
      console.log("[v0] Logging out")
      const auth = getFirebaseAuth()
      await firebaseSignOut(auth)
      setCurrentUser(null)
      setIsAdmin(false)
      setFirebaseUser(null)
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const hasPermission = (permission: keyof Employee["permissions"]): boolean => {
    if (isAdmin) return true
    if (!currentUser) return false
    return currentUser.permissions[permission]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ currentUser, firebaseUser, isAdmin, login, logout, hasPermission }}>
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
