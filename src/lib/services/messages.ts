import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc, increment, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { z } from 'zod'
import { messageSchema } from '../schemas/message'
import { conversationSchema } from '../schemas/conversation'

type MessageData = z.infer<typeof messageSchema>
type ConversationData = z.infer<typeof conversationSchema>

export async function findOrCreateConversation(data: ConversationData): Promise<string> {
  try {
    // Validation des données requises
    if (!data.metadata?.teacherId || !data.metadata?.schoolId) {
      throw new Error('Teacher ID and School ID are required')
    }

    // Rechercher une conversation existante entre ces deux participants
    const conversationsRef = collection(db, 'conversations')
    const q = query(
      conversationsRef,
      where('metadata.teacherId', '==', data.metadata.teacherId),
      where('metadata.schoolId', '==', data.metadata.schoolId)
    )
    
    const snapshot = await getDocs(q)
    
    // Si une conversation existe déjà, la retourner
    if (!snapshot.empty) {
      const conversationId = snapshot.docs[0].id
      
      // Mettre à jour le timestamp
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessageAt: serverTimestamp()
      })
      
      return conversationId
    }

    // Si aucune conversation n'existe, en créer une nouvelle
    const conversationRef = await addDoc(conversationsRef, {
      participants: [data.metadata.teacherId, data.metadata.schoolId],
      participantsMap: {
        [data.metadata.teacherId]: true,
        [data.metadata.schoolId]: true
      },
      type: 'teacher_school',
      metadata: {
        teacherId: data.metadata.teacherId,
        teacherName: data.metadata.teacherName,
        schoolId: data.metadata.schoolId,
        schoolName: data.metadata.schoolName,
        offerSubject: data.metadata.offerSubject || null
      },
      lastMessageAt: serverTimestamp(),
      unreadCount: {
        [data.metadata.teacherId]: 0,
        [data.metadata.schoolId]: 0
      }
    })

    // Créer le message système initial
    await addDoc(collection(db, 'messages'), {
      conversationId: conversationRef.id,
      senderId: 'system',
      content: 'Conversation démarrée',
      createdAt: serverTimestamp()
    })

    return conversationRef.id
  } catch (error) {
    console.error('Error creating/finding conversation:', error)
    throw error
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  attachments?: File[]
): Promise<string> {
  try {
    // Vérifier que la conversation existe
    const conversationRef = doc(db, 'conversations', conversationId)
    const conversationDoc = await getDoc(conversationRef)
    
    if (!conversationDoc.exists()) {
      throw new Error('Conversation not found')
    }

    const messageData = {
      conversationId,
      senderId,
      content,
      createdAt: serverTimestamp(),
      attachments: []
    }

    const messageRef = await addDoc(collection(db, 'messages'), messageData)

    // Mettre à jour la conversation
    const conversationData = conversationDoc.data()
    const updates: any = {
      lastMessageAt: serverTimestamp(),
      lastMessage: content
    }
    
    // Incrémenter le compteur de messages non lus pour les autres participants
    Object.keys(conversationData.participantsMap).forEach(participantId => {
      if (participantId !== senderId) {
        updates[`unreadCount.${participantId}`] = increment(1)
      }
    })
    
    await updateDoc(conversationRef, updates)

    return messageRef.id
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}