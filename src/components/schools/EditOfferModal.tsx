import { useState } from 'react'
import { X } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface EditOfferModalProps {
  offer: {
    id: string
    topic?: string
    qualifications?: string
  }
  onClose: () => void
  onSuccess: () => void
}

export function EditOfferModal({ offer, onClose, onSuccess }: EditOfferModalProps) {
  const [topic, setTopic] = useState(offer.topic || '')
  const [qualifications, setQualifications] = useState(offer.qualifications || '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const offerRef = doc(db, 'replacement-offers', offer.id)
      await updateDoc(offerRef, {
        topic,
        qualifications,
        updatedAt: new Date()
      })
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'offre:', err)
      setError('Une erreur est survenue lors de la mise à jour')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Modifier l'offre
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horaires, lieu de rendez-vous et informations utiles
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input min-h-[100px] resize-none w-full"
              placeholder="Précisez les horaires exacts, le lieu de rendez-vous et toute information utile pour le bon déroulement du remplacement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications souhaitées
            </label>
            <textarea
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="input min-h-[100px] resize-none w-full"
              placeholder="Décrivez les qualifications souhaitées pour ce remplacement..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}