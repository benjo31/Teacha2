import { useEffect, useRef, useState } from 'react'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../lib/context/AuthContext'
import { useTranslation } from '../../lib/context/LanguageContext'
import { UserCircle2 } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { TeacherProfileModal } from '../teachers/TeacherProfileModal'

interface MessageListProps {
  conversationId: string
  metadata: {
    teacherId: string
    teacherName: string
    schoolId: string
    schoolName: string
  }
}

export function MessageList({ conversationId, metadata }: MessageListProps) {
  const { messages, loading, error } = useMessages(conversationId)
  const { user } = useAuth()
  const { t } = useTranslation()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const previousMessagesLengthRef = useRef(0)
  const isInitialLoadRef = useRef(true)
  const [otherPartyPhoto, setOtherPartyPhoto] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [teacherProfile, setTeacherProfile] = useState<any>(null)

  const isTeacher = user?.uid === metadata.teacherId
  const otherPartyName = isTeacher ? metadata.schoolName : metadata.teacherName
  const otherPartyId = isTeacher ? metadata.schoolId : metadata.teacherId

  useEffect(() => {
    // Load the profile photo of the other participant
    async function loadOtherPartyPhoto() {
      try {
        if (isTeacher) {
          // If the user is a teacher, no photo for the school
          setOtherPartyPhoto(null)
        } else {
          // If the user is a school, load the teacher's photo
          const teacherDoc = await getDoc(doc(db, 'teachers', metadata.teacherId))
          if (teacherDoc.exists()) {
            setOtherPartyPhoto(teacherDoc.data().photoUrl || null)
          }
        }
      } catch (error) {
        console.error('Error loading profile photo:', error)
      }
    }

    loadOtherPartyPhoto()
  }, [isTeacher, metadata.teacherId])

  const handleShowProfile = async () => {
    // Only show profile for teachers
    if (isTeacher) return

    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', metadata.teacherId))
      if (teacherDoc.exists()) {
        const data = teacherDoc.data()
        setTeacherProfile({
          ...data,
          id: metadata.teacherId,
          city: data.address?.city,
          canton: data.canton
        })
        setShowProfile(true)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  useEffect(() => {
    // Positionner les messages en bas lors du chargement initial
    if (isInitialLoadRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      isInitialLoadRef.current = false
      previousMessagesLengthRef.current = messages.length
      return
    }

    // Faire défiler uniquement si de nouveaux messages sont ajoutés
    if (messages.length > previousMessagesLengthRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    previousMessagesLengthRef.current = messages.length
  }, [messages])

  // Réinitialiser isInitialLoad quand la conversation change
  useEffect(() => {
    isInitialLoadRef.current = true
    previousMessagesLengthRef.current = 0
  }, [conversationId])

  // Réinitialiser le compteur de messages non lus quand on ouvre la conversation
  useEffect(() => {
    if (user && conversationId) {
      const conversationRef = doc(db, 'conversations', conversationId)
      updateDoc(conversationRef, {
        [`unreadCount.${user.uid}`]: 0
      }).catch(console.error)
    }
  }, [conversationId, user])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex-grow p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête de la conversation */}
      <div className="border-b p-4 bg-white flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {otherPartyPhoto ? (
              <img 
                src={otherPartyPhoto} 
                alt={otherPartyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <button
            onClick={handleShowProfile}
            className={`text-left ${!isTeacher ? 'hover:text-primary' : ''}`}
          >
            <h3 className="font-semibold">{otherPartyName}</h3>
            {!isTeacher && (
              <p className="text-xs text-gray-500">{t('messages.clickToViewProfile')}</p>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {t('messages.noMessages')}
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === user?.uid}
              senderPhoto={message.senderId === otherPartyId ? otherPartyPhoto : null}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modal du profil */}
      {showProfile && teacherProfile && (
        <TeacherProfileModal
          teacher={teacherProfile}
          onClose={() => {
            setShowProfile(false)
            setTeacherProfile(null)
          }}
        />
      )}
    </div>
  )
}