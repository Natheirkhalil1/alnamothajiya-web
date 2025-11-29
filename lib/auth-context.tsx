"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
// FIREBASE: Firebase imports
// import type { User } from "firebase/auth"
// import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
// import { getFirebaseAuth } from "./firebase"
import type { Employee } from "./storage"
import { updateEmployee, getEmployeeByEmail } from "./storage"
import { getFromLocalStorage, saveToLocalStorage, COLLECTIONS } from "./storage-adapter"

interface AuthContextType {
  currentUser: Employee | null
  firebaseUser: any | null // Changed from User to any for localStorage compatibility
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: keyof Employee["permissions"]) => boolean
  employee: Employee | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    console.log("[v0] Checking localStorage auth state...")
    
    // LocalStorage implementation (active)
    const checkAuth = async () => {
      const storedEmployee = localStorage.getItem("currentEmployee")
      const sessionTimestamp = localStorage.getItem("sessionTimestamp")
      
      if (storedEmployee && sessionTimestamp) {
        const employee: Employee = JSON.parse(storedEmployee)
        
        // Check session expiration (3 days)
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000
        const sessionAge = Date.now() - Number.parseInt(sessionTimestamp)
        
        if (sessionAge > threeDaysInMs) {
          console.log("[v0] Session expired after 3 days, logging out")
          localStorage.removeItem("currentEmployee")
          localStorage.removeItem("sessionTimestamp")
          setCurrentUser(null)
          setEmployee(null)
          setIsAdmin(false)
          setFirebaseUser(null)
        } else if (employee.isActive) {
          console.log("[v0] Employee loaded from localStorage:", employee.fullName, "Role:", employee.role)
          setCurrentUser(employee)
          setEmployee(employee)
          setIsAdmin(employee.role === "admin")
          setFirebaseUser({ email: employee.email, uid: employee.id })
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()

    // FIREBASE: Original Firebase auth state listener
    // try {
    //   const auth = getFirebaseAuth()
    //   
    //   const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
    //     console.log("[v0] Auth state changed:", user?.email)
    //     setFirebaseUser(user)

    //     if (user) {
    //       const employee = await getEmployeeByEmail(user.email!)

    //       if (employee && employee.isActive) {
    //         setCurrentUser(employee)
    //         setEmployee(employee)
    //         setIsAdmin(employee.role === "admin")

    //         const sessionTimestamp = localStorage.getItem("sessionTimestamp")
    //         if (!sessionTimestamp) {
    //           localStorage.setItem("sessionTimestamp", Date.now().toString())
    //         } else {
    //           const threeDaysInMs = 3 * 24 * 60 * 60 * 1000
    //           const sessionAge = Date.now() - Number.parseInt(sessionTimestamp)

    //           if (sessionAge > threeDaysInMs) {
    //             console.log("[v0] Session expired after 3 days, logging out")
    //             await signOut(auth)
    //             localStorage.removeItem("sessionTimestamp")
    //             setCurrentUser(null)
    //             setEmployee(null)
    //             setIsAdmin(false)
    //             setFirebaseUser(null)
    //             setLoading(false)
    //             return
    //           }
    //         }

    //         console.log("[v0] Employee loaded:", employee.fullName, "Role:", employee.role)
    //       } else {
    //         console.log("[v0] Employee not found or inactive")
    //         setCurrentUser(null)
    //         setEmployee(null)
    //         setIsAdmin(false)
    //       }
    //     } else {
    //       setCurrentUser(null)
    //       setEmployee(null)
    //       setIsAdmin(false)
    //       localStorage.removeItem("sessionTimestamp")
    //     }

    //     setLoading(false)
    //   })

    //   return () => unsubscribe()
    // } catch (error) {
    //   console.error("[v0] Error setting up auth:", error)
    //   setLoading(false)
    // }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("[v0] Attempting localStorage login for:", email)
      
      // LocalStorage implementation (active)
      const employee = await getEmployeeByEmail(email)
      
      if (employee && employee.isActive && employee.password === password) {
        console.log("[v0] Password match successful for:", employee.fullName)
        
        setCurrentUser(employee)
        setEmployee(employee)
        setIsAdmin(employee.role === "admin")
        setFirebaseUser({ email: employee.email, uid: employee.id })
        
        // Store session in localStorage
        localStorage.setItem("currentEmployee", JSON.stringify(employee))
        localStorage.setItem("sessionTimestamp", Date.now().toString())

        await updateEmployee(employee.id, { lastLogin: new Date().toISOString() })
        console.log("[v0] Login successful for:", employee.fullName)

        return true
      } else {
        console.log("[v0] Invalid credentials or employee not active")
        throw new Error("INVALID_PASSWORD")
      }

      // FIREBASE: Original Firebase authentication
      // console.log("[v0] Attempting login for:", email)
      // const auth = getFirebaseAuth()

      // const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // console.log("[v0] Firebase auth successful:", userCredential.user.email)

      // const employee = await getEmployeeByEmail(email)

      // if (employee && employee.isActive) {
      //   setCurrentUser(employee)
      //   setEmployee(employee)
      //   setIsAdmin(employee.role === "admin")
      //   localStorage.setItem("sessionTimestamp", Date.now().toString())

      //   await updateEmployee(employee.id, { lastLogin: new Date().toISOString() })
      //   console.log("[v0] Login successful for:", employee.fullName)

      //   return true
      // } else {
      //   console.log("[v0] Employee not found or inactive in Firestore")
      //   await signOut(auth)
      //   throw new Error("EMPLOYEE_NOT_FOUND")
      // }
    } catch (error: any) {
      console.error("[v0] Login error:", error.message)
      if (error.message === "INVALID_PASSWORD") {
        throw new Error("INVALID_PASSWORD")
      } else if (error.message === "EMPLOYEE_NOT_FOUND") {
        throw new Error("EMPLOYEE_NOT_FOUND")
      } else {
        throw new Error("USER_NOT_FOUND")
      }
    }
  }

  const logout = async () => {
    try {
      console.log("[v0] Logging out from localStorage")
      
      // LocalStorage implementation (active)
      localStorage.removeItem("currentEmployee")
      localStorage.removeItem("sessionTimestamp")
      setCurrentUser(null)
      setEmployee(null)
      setIsAdmin(false)
      setFirebaseUser(null)

      // FIREBASE: Original Firebase logout
      // const auth = getFirebaseAuth()
      // await signOut(auth)
      // setCurrentUser(null)
      // setEmployee(null)
      // setIsAdmin(false)
      // setFirebaseUser(null)
      // localStorage.removeItem("sessionTimestamp")
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
    <AuthContext.Provider value={{ currentUser, firebaseUser, isAdmin, login, logout, hasPermission, employee }}>
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
