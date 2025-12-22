"use client"

import * as React from "react"

interface EditingLanguageContextType {
    editingLanguage: "ar" | "en"
}

const EditingLanguageContext = React.createContext<EditingLanguageContextType | undefined>(undefined)

export function EditingLanguageProvider({
    children,
    editingLanguage,
}: {
    children: React.ReactNode
    editingLanguage: "ar" | "en"
}) {
    return (
        <EditingLanguageContext.Provider value={{ editingLanguage }}>
            {children}
        </EditingLanguageContext.Provider>
    )
}

export function useEditingLanguage() {
    const context = React.useContext(EditingLanguageContext)
    // Fall back to "ar" if not within EditingLanguageProvider (for legacy components)
    if (!context) {
        return { editingLanguage: "ar" as const }
    }
    return context
}
