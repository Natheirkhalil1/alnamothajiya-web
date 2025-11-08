"use client"

import { getDb, FIREBASE_COLLECTIONS } from "./firebase"
import { collection, getDocs, setDoc, doc } from "firebase/firestore"

// Storage adapter that tries Firebase first, falls back to localStorage
// All collections use "web_" prefix

export const COLLECTIONS = FIREBASE_COLLECTIONS

// Helper to get from Firebase or localStorage
export async function getFromFirestore<T>(collectionName: string, defaultValue: T): Promise<T> {
  try {
    const db = getDb()
    const colRef = collection(db, collectionName)
    const snapshot = await getDocs(colRef)

    if (snapshot.empty) {
      return defaultValue
    }

    const data: any[] = []
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    return data as T
  } catch (error) {
    console.error(`[v0] Error reading from Firestore (${collectionName}):`, error)
    // Fallback to localStorage
    return getFromLocalStorage(collectionName, defaultValue)
  }
}

// Helper to save to Firebase or localStorage
export async function saveToFirestore(collectionName: string, docId: string, value: any): Promise<void> {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, value, { merge: true })
  } catch (error) {
    console.error(`[v0] Error saving to Firestore (${collectionName}):`, error)
    // Fallback to localStorage
    const existing = getFromLocalStorage<any[]>(collectionName, [])
    const index = existing.findIndex((item: any) => item.id === docId)
    if (index !== -1) {
      existing[index] = { ...existing[index], ...value }
    } else {
      existing.push({ id: docId, ...value })
    }
    saveToLocalStorage(collectionName, existing)
  }
}

// Helper to get from localStorage
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`[v0] Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

// Helper to save to localStorage
export function saveToLocalStorage(key: string, value: any): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`[v0] Error saving to localStorage (${key}):`, error)
  }
}
