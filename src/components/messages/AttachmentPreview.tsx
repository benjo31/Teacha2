import { useState } from 'react'
import { FileText, Image as ImageIcon, X, Download } from 'lucide-react'
import { getMessageAttachment } from '../../lib/services/storage'

interface AttachmentPreviewProps {
  attachment: {
    path: string
    type: 'pdf' | 'image'
    name: string
  }
  onRemove?: () => void
  showRemove?: boolean
}

export function AttachmentPreview({ attachment, onRemove, showRemove = false }: AttachmentPreviewProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      const url = await getMessageAttachment(attachment.path)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative group">
      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
        {attachment.type === 'pdf' ? (
          <FileText className="h-5 w-5 text-gray-500" />
        ) : (
          <ImageIcon className="h-5 w-5 text-gray-500" />
        )}
        
        <span className="text-sm text-gray-600 truncate">
          {attachment.name}
        </span>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="ml-auto text-primary hover:text-primary-dark"
        >
          <Download className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
        </button>

        {showRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  )
}