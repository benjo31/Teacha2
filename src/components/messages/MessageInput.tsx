import { useState, useRef } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { sendMessage } from '../../lib/services/messages'
import { AttachmentPreview } from './AttachmentPreview'
import { useTranslation } from '../../lib/context/LanguageContext'

interface MessageInputProps {
  conversationId: string
  senderId: string
}

export function MessageInput({ conversationId, senderId }: MessageInputProps) {
  const { t } = useTranslation()
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && attachments.length === 0) return

    try {
      setSending(true)
      await sendMessage(conversationId, senderId, content, attachments)
      setContent('')
      setAttachments([])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex-shrink-0">
      {attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          {attachments.map((file, index) => (
            <AttachmentPreview
              key={index}
              attachment={{
                path: '',
                type: file.type.startsWith('image/') ? 'image' : 'pdf',
                name: file.name
              }}
              onRemove={() => removeAttachment(index)}
              showRemove
            />
          ))}
        </div>
      )}

      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none rounded-lg border border-gray-300 focus:border-primary focus:ring-primary p-2"
            rows={2}
            placeholder={t('messageInput.placeholder')}
          />
        </div>

        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={sending || (!content.trim() && attachments.length === 0)}
            className="p-2 text-primary hover:text-primary-dark rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Send className={`h-5 w-5 ${sending ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </form>
  )
}