import { useCallback, useEffect, useState } from 'react'
import { list, remove, save } from '../lib/db'
import type { BaseRecord, StoreName } from '../types/research'

export function useRecords<T extends BaseRecord>(store: StoreName) {
  const [records, setRecords] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    setLoading(true)
    try { setRecords(await list<T>(store)) } finally { setLoading(false) }
  }, [store])
  useEffect(() => { void refresh() }, [refresh])
  const upsert = useCallback(async (record: T) => {
    const saved = await save(store, record)
    setRecords((items) => [...items.filter((item) => item.id !== saved.id), saved].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    return saved
  }, [store])
  const destroy = useCallback(async (id: string) => {
    await remove(store, id); setRecords((items) => items.filter((item) => item.id !== id))
  }, [store])
  return { records, loading, refresh, upsert, destroy }
}
