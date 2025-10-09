export interface User {
  email: string
  password: string
}

const ADMIN_USER: User = {
  email: "admin@namothajia.com",
  password: "admin123",
}

export function login(email: string, password: string): boolean {
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAuthenticated") === "true"
  }
  return false
}

export function getUserEmail(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userEmail")
  }
  return null
}

export function getUsername(): string | null {
  return getUserEmail()
}
