import { useState } from 'react'
import { FileText, ExternalLink, Download } from 'lucide-react'

interface PDFPreviewProps {
  url: string
  title?: string
}

export function PDFPreview({ url, title }: PDFPreviewProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* En-tête */}
      <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{title || 'CV'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center space-x-1 text-primary hover:text-primary-dark"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Télécharger</span>
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-primary hover:text-primary-dark"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">Ouvrir</span>
          </a>
        </div>
      </div>

      {/* Prévisualisation */}
      <div className="aspect-[1/1.4] bg-gray-100">
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          className="w-full h-full"
          title="Prévisualisation du CV"
        />
      </div>
    </div>
  )
}