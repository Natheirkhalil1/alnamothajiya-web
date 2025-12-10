"use client"

import { getDb, FIREBASE_COLLECTIONS } from "./firebase"
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint
} from "firebase/firestore"

// Re-export FIREBASE_COLLECTIONS as COLLECTIONS for backward compatibility
export const COLLECTIONS = FIREBASE_COLLECTIONS

// Helper to get all documents from a Firestore collection
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
    console.error(`[Firebase] Error reading from Firestore (${collectionName}):`, error)
    return defaultValue
  }
}

// Helper to get a single document from Firestore
export async function getDocFromFirestore<T>(collectionName: string, docId: string, defaultValue: T): Promise<T> {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return defaultValue
    }

    return { id: docSnap.id, ...docSnap.data() } as T
  } catch (error) {
    console.error(`[Firebase] Error reading document from Firestore (${collectionName}/${docId}):`, error)
    return defaultValue
  }
}

// Helper to save/update a document in Firestore
export async function saveToFirestore(collectionName: string, docId: string, value: any): Promise<void> {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, docId)
    // Remove id from value to avoid duplication (id is stored as doc ID)
    const { id, ...dataWithoutId } = value
    await setDoc(docRef, dataWithoutId, { merge: true })
  } catch (error) {
    console.error(`[Firebase] Error saving to Firestore (${collectionName}/${docId}):`, error)
    throw error
  }
}

// Helper to delete a document from Firestore
export async function deleteFromFirestore(collectionName: string, docId: string): Promise<void> {
  try {
    const db = getDb()
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[Firebase] Error deleting from Firestore (${collectionName}/${docId}):`, error)
    throw error
  }
}

// Helper to query Firestore with constraints
export async function queryFirestore<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  defaultValue: T
): Promise<T> {
  try {
    const db = getDb()
    const colRef = collection(db, collectionName)
    const q = query(colRef, ...constraints)
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return defaultValue
    }

    const data: any[] = []
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    return data as T
  } catch (error) {
    console.error(`[Firebase] Error querying Firestore (${collectionName}):`, error)
    return defaultValue
  }
}

// Export Firestore query helpers for use in storage.ts
export { where, orderBy, limit, query, collection, getDocs, doc, getDoc, setDoc, deleteDoc }

// Legacy localStorage helpers (kept for potential fallback/migration use)
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const parsed = JSON.parse(item)
    return parsed
  } catch (error) {
    console.error(`[localStorage] Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export function saveToLocalStorage(key: string, value: any): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))

    window.dispatchEvent(
      new CustomEvent("localStorageChange", {
        detail: { key, value },
      })
    )
  } catch (error) {
    console.error(`[localStorage] Error saving to localStorage (${key}):`, error)
  }
}
