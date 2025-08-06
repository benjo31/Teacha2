import { useState, useEffect } from 'react'
import { useConversations } from '../../hooks/useConversations'
import { useAuth } from '../../lib/context/AuthContext'
import { useTranslation } from '../../lib/context/LanguageContext'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { UserCircle2 } from 'lucide-react'
import { UnreadBadge } from '../ui/UnreadBadge'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface ConversationListProps {
  onSelect: (conversationId: string) => void
  selectedId?: string
}

export function ConversationList({ onSelect, selectedId }: ConversationListProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { conversations, loading } = useConversations(user?.uid)
  const [userPhotos, setUserPhotos] = useState<{ [key: string]: string | null }>({})

  useEffect(() => {
    async function loadUserPhotos() {
      const photos: { [key: string]: string | null } = {}
      
      for (const conversation of conversations) {
        const otherPartyId = conversation.metadata.teacherId === user?.uid
          ? conversation.metadata.schoolId
          : conversation.metadata.teacherId

        // Pour les écoles, on n'a pas de photo
        if (conversation.metadata.teacherId === otherPartyId) {
          const teacherDoc = await getDoc(doc(db, 'teachers', otherPartyId))
          if (teacherDoc.exists()) {
            photos[otherPartyId] = teacherDoc.data().photoUrl || null
          }
        }
      }
      
      setUserPhotos(photos)
    }

    if (conversations.length > 0) {
      loadUserPhotos()
    }
  }, [conversations, user?.uid])

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-center text-gray-500">
        {t('conversationList.noConversations')}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 divide-y divide-gray-100">
        {conversations.map((conversation) => {
          const isTeacher = conversation.metadata.teacherId === user?.uid
          const otherPartyName = isTeacher
            ? conversation.metadata.schoolName
            : conversation.metadata.teacherName
          const otherPartyId = isTeacher
            ? conversation.metadata.schoolId
            : conversation.metadata.teacherId
          const unreadCount = conversation.unreadCount?.[user?.uid || ''] || 0
          const photoUrl = userPhotos[otherPartyId]

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full p-4 text-left transition-colors relative hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                selectedId === conversation.id
                  ? 'bg-primary/10'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={otherPartyName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle2 className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium truncate">
                      {otherPartyName}
                    </h3>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(conversation.lastMessageAt.toDate(), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </span>
                    )}
                  </div>
                  
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                  )}
                </div>

                {unreadCount > 0 && (
                  <UnreadBadge count={unreadCount} className="ml-2" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}