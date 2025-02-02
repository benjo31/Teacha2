import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useUnreadMessages(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.reduce((total, doc) => {
        const data = doc.data()
        return total + (data.unreadCount?.[userId] || 0)
      }, 0)
      setUnreadCount(count)
    })

    return () => unsubscribe()
  }, [userId])

  return unreadCount
}