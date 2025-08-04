import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ConversationList } from '../components/messages/ConversationList'
import { MessageList } from '../components/messages/MessageList'
import { MessageInput } from '../components/messages/MessageInput'
import { useAuth } from '../lib/context/AuthContext'
import { useTranslation } from '../lib/context/LanguageContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { ArrowLeft } from 'lucide-react'

export function MessagesPage() {
  const [searchParams] = useSearchParams()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversationMetadata, setConversationMetadata] = useState<any>(null)
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (conversationId) {
      setSelectedConversation(conversationId)
      loadConversationMetadata(conversationId)
    }
  }, [searchParams])

  const loadConversationMetadata = async (conversationId: string) => {
    try {
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId))
      if (conversationDoc.exists()) {
        setConversationMetadata(conversationDoc.data().metadata)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des métadonnées:', error)
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    loadConversationMetadata(id)
    // Sur mobile, ajouter le paramètre à l'URL pour la navigation
    navigate(`/messages?conversation=${id}`)
  }

  const handleBack = () => {
    setSelectedConversation(null)
    setConversationMetadata(null)
    navigate('/messages')
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem-2rem)] p-4">
      <div className="bg-white rounded-lg shadow-sm border h-full flex">
        {/* Liste des conversations - Toujours visible sur desktop, cachée sur mobile quand une conversation est sélectionnée */}
        <div className={`w-full md:w-1/3 border-r flex flex-col min-h-0 ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`}>
          <ConversationList
            onSelect={handleSelectConversation}
            selectedId={selectedConversation || undefined}
          />
        </div>

        {/* Zone de messages - Visible sur desktop, remplace la liste sur mobile */}
        <div className={`flex-1 flex flex-col min-h-0 ${
          selectedConversation ? 'flex' : 'hidden md:flex'
        }`}>
          {selectedConversation && conversationMetadata ? (
            <>
              {/* Bouton retour sur mobile */}
              <button
                onClick={handleBack}
                className="md:hidden flex items-center text-gray-600 hover:text-gray-800 p-4 border-b"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('common.back')}
              </button>

              <MessageList 
                conversationId={selectedConversation}
                metadata={conversationMetadata}
              />
              <MessageInput
                conversationId={selectedConversation}
                senderId={user?.uid || ''}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {t('messages.selectConversation')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}