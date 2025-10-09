"use client"

import { useState, useEffect } from "react"

export function useLocalStorageSync<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Load initial value from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error)
      }
    }
  }, [key])

  // Listen for storage changes from other tabs/windows or dashboard
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing ${key} from storage event:`, error)
        }
      }
    }

    // Listen for custom events from same window (dashboard updates)
    const handleCustomStorageChange = ((e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value)
      }
    }) as EventListener

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("localStorageChange", handleCustomStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localStorageChange", handleCustomStorageChange)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value))
        // Dispatch custom event for same-window updates
        window.dispatchEvent(
          new CustomEvent("localStorageChange", {
            detail: { key, value },
          }),
        )
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  return [storedValue, setValue]
}
