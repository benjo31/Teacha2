import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export type Message = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Timestamp | null
  attachments?: {
    path: string
    type: 'image' | 'pdf'
    name: string
  }[]
}

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }

    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      )

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt || null
          })) as Message[]
          setMessages(messagesData)
          setLoading(false)
        },
        (err) => {
          console.error('Erreur lors du chargement des messages:', err)
          setError('Erreur lors du chargement des messages')
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Erreur lors de l\'initialisation:', err)
      setError('Erreur lors de l\'initialisation')
      setLoading(false)
    }
  }, [conversationId])

  return { messages, loading, error }
}