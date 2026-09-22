import { openDB } from 'idb'
import type { BaseRecord, ResearchRecord, StoreName } from '../types/research'

const DB_NAME = 'moderai-user-research'
const STORE_NAMES: StoreName[] = ['experts', 'extremeUsers', 'observations', 'empathyMaps', 'roperDynagrams', 'requirements', 'settings']

const database = openDB(DB_NAME, 1, {
  upgrade(db) {
    STORE_NAMES.forEach((name) => {
      if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' })
    })
  },
})

export const makeId = (prefix = 'rec') => `${prefix}-${crypto.randomUUID()}`
export const timestamp = () => new Date().toISOString()

export async function list<T extends BaseRecord>(store: StoreName): Promise<T[]> {
  const db = await database
  return (await db.getAll(store)) as T[]
}

export async function save<T extends BaseRecord>(store: StoreName, record: T): Promise<T> {
  const db = await database
  const now = timestamp()
  const value = { ...record, createdAt: record.createdAt || now, updatedAt: now }
  await db.put(store, value)
  return value
}

export async function remove(store: StoreName, id: string) {
  const db = await database
  await db.delete(store, id)
}

export async function bulkSave(store: StoreName, records: ResearchRecord[]) {
  const db = await database
  const tx = db.transaction(store, 'readwrite')
  await Promise.all(records.map((record) => tx.store.put(record)))
  await tx.done
}
