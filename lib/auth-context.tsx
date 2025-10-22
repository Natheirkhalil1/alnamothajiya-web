"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Employee } from "./storage"
import { getEmployees, updateEmployee } from "./storage"

interface AuthContextType {
  currentUser: Employee | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: keyof Employee["permissions"]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentStaffUser")
    const adminStatus = localStorage.getItem("isAdmin")

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const allEmployees = getEmployees()
      const updatedUser = allEmployees.find((s) => s.id === parsedUser.id)

      if (updatedUser) {
        setCurrentUser(updatedUser)
        localStorage.setItem("currentStaffUser", JSON.stringify(updatedUser))
      } else {
        setCurrentUser(parsedUser)
      }
    }

    if (adminStatus === "true") {
      setIsAdmin(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if admin
    if (email === "admin@namothajia.com" && password === "admin123") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      return true
    }

    // Check staff members
    const allEmployees = getEmployees()
    const employee = allEmployees.find((s) => s.email === email)

    if (employee && employee.password === password && employee.isActive) {
      const updatedEmployee = { ...employee, lastLogin: new Date().toISOString() }
      setCurrentUser(updatedEmployee)
      localStorage.setItem("currentStaffUser", JSON.stringify(updatedEmployee))

      // تحديث في قاعدة البيانات
      updateEmployee(employee.id, { lastLogin: updatedEmployee.lastLogin })

      return true
    }

    return false
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAdmin(false)
    localStorage.removeItem("currentStaffUser")
    localStorage.removeItem("isAdmin")
  }

  const hasPermission = (permission: keyof Employee["permissions"]): boolean => {
    if (isAdmin) return true
    if (!currentUser) return false
    return currentUser.permissions[permission]
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, login, logout, hasPermission }}>
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
