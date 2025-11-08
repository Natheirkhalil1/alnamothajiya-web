"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Employee } from "./storage"
import { updateEmployee, getEmployeeById, authenticateEmployee } from "./storage"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const storedEmployeeId = localStorage.getItem("employeeId")
      if (storedEmployeeId) {
        const employee = await getEmployeeById(storedEmployeeId)
        if (employee && employee.isActive) {
          setCurrentUser(employee)
          setIsAdmin(employee.role === "admin")
        } else {
          setCurrentUser(null)
          setIsAdmin(false)
        }
      } else {
        setCurrentUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    }

    checkAuth()

    return () => {}
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const employee = await authenticateEmployee(email, password)

      if (employee && employee.isActive) {
        setCurrentUser(employee)
        setIsAdmin(employee.role === "admin")
        localStorage.setItem("employeeId", employee.id)

        // Update last login time
        await updateEmployee(employee.id, { lastLogin: new Date().toISOString() })

        return true
      } else {
        // Employee not found or inactive
        localStorage.removeItem("employeeId")
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("employeeId")
      setCurrentUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error("Logout error:", error)
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
