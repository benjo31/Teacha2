import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export type Conversation = {
  id: string
  participants: string[]
  participantsMap: Record<string, boolean>
  lastMessageAt: Timestamp
  lastMessage?: string
  unreadCount?: Record<string, number>
  metadata: {
    teacherId: string
    teacherName: string
    schoolId: string
    schoolName: string
    offerId?: string
    offerSubject?: string
  }
}

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
      )

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const conversationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Conversation[]
          setConversations(conversationsData)
          setLoading(false)
        },
        (err) => {
          console.error('Erreur lors du chargement des conversations:', err)
          setError('Erreur lors du chargement des conversations')
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Erreur lors de l\'initialisation:', err)
      setError('Erreur lors de l\'initialisation')
      setLoading(false)
    }
  }, [userId])

  return { conversations, loading, error }
}