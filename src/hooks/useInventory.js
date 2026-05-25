import { useEffect, useState, useCallback } from 'react'
import { subscribeToItems, createItem, updateItem, deleteItem } from '../firebase/items'
import { useAuth } from '../contexts/AuthContext'

export function useInventory() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToItems(
      user.uid,
      (data) => {
        setItems(data)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const addItem = useCallback(
    async (data, imageFile) => {
      if (!user) return
      setError(null)
      await createItem(user.uid, data, imageFile)
    },
    [user],
  )

  const editItem = useCallback(
    async (itemId, data, imageFile) => {
      if (!user) return
      setError(null)
      await updateItem(user.uid, itemId, data, imageFile)
    },
    [user],
  )

  const removeItem = useCallback(
    async (itemId, imageUrl) => {
      if (!user) return
      setError(null)
      await deleteItem(user.uid, itemId, imageUrl)
    },
    [user],
  )

  const lowStockItems = items.filter(
    (item) => item.quantity <= (item.minStock ?? 5),
  )

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)

  return {
    items,
    loading,
    error,
    setError,
    addItem,
    editItem,
    removeItem,
    lowStockItems,
    totalQuantity,
  }
}
