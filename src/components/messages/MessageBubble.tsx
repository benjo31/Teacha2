import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Message } from '../../hooks/useMessages'
import { AttachmentPreview } from './AttachmentPreview'
import { UserCircle2 } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
  senderPhoto: string | null
}

export function MessageBubble({ message, isOwnMessage, senderPhoto }: MessageBubbleProps) {
  // Gérer le cas où createdAt est null ou undefined
  const timestamp = message.createdAt?.toDate?.()
  const formattedTime = timestamp ? format(timestamp, 'HH:mm', { locale: fr }) : ''

  return (
    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} mb-4`}>
      {message.senderId === 'system' ? (
        <div className="text-center text-sm text-gray-500 my-2 w-full">
          {message.content}
        </div>
      ) : (
        <>
          <div className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {senderPhoto ? (
                <img 
                  src={senderPhoto} 
                  alt="Photo de profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
            
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwnMessage
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>

          {message.attachments?.length > 0 && (
            <div className={`mt-2 space-y-2 ${isOwnMessage ? 'self-end' : 'self-start'}`}>
              {message.attachments.map((attachment, index) => (
                <AttachmentPreview
                  key={index}
                  attachment={attachment}
                />
              ))}
            </div>
          )}

          {formattedTime && (
            <span className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'self-end' : 'self-start'}`}>
              {formattedTime}
            </span>
          )}
        </>
      )}
    </div>
  )
}