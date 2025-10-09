export interface User {
  username: string
  number: string
  password: string
}

const ADMIN_USER: User = {
  username: "diaailian",
  number: "123",
  password: "12345",
}

export function login(username: string, number: string, password: string): boolean {
  if (username === ADMIN_USER.username && number === ADMIN_USER.number && password === ADMIN_USER.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", username)
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAuthenticated") === "true"
  }
  return false
}

export function getUsername(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username")
  }
  return null
}
