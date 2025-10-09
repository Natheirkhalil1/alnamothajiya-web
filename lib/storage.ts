export interface EmploymentApplication {
  id: string
  position: string
  fullName: string
  phone: string
  email: string
  nationalId: string
  gender: string
  experience: string
  expectedSalary: string
  coverLetter: string
  submittedAt: string
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string
  rating: number
  message: string
  submittedAt: string
}

export function saveEmploymentApplication(data: Omit<EmploymentApplication, "id" | "submittedAt">): void {
  if (typeof window !== "undefined") {
    const applications = getEmploymentApplications()
    const newApplication: EmploymentApplication = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    }
    applications.push(newApplication)
    localStorage.setItem("employmentApplications", JSON.stringify(applications))
  }
}

export function getEmploymentApplications(): EmploymentApplication[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("employmentApplications")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveContactMessage(data: Omit<ContactMessage, "id" | "submittedAt">): void {
  if (typeof window !== "undefined") {
    const messages = getContactMessages()
    const newMessage: ContactMessage = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    }
    messages.push(newMessage)
    localStorage.setItem("contactMessages", JSON.stringify(messages))
  }
}

export function getContactMessages(): ContactMessage[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("contactMessages")
    return data ? JSON.parse(data) : []
  }
  return []
}

export function deleteEmploymentApplication(id: string): void {
  if (typeof window !== "undefined") {
    const applications = getEmploymentApplications().filter((app) => app.id !== id)
    localStorage.setItem("employmentApplications", JSON.stringify(applications))
  }
}

export function deleteContactMessage(id: string): void {
  if (typeof window !== "undefined") {
    const messages = getContactMessages().filter((msg) => msg.id !== id)
    localStorage.setItem("contactMessages", JSON.stringify(messages))
  }
}
