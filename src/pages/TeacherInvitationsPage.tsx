import { useState, useEffect } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { School, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useTranslation } from '../lib/context/LanguageContext'

type Invitation = {
  id: string
  schoolId: string
  schoolName: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: any
}

export function TeacherInvitationsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadInvitations()
    }
  }, [user])

  async function loadInvitations() {
    if (!user) return

    try {
      // Load all teacher invitations
      const invitationsQuery = query(
        collection(db, 'school_invitations'),
        where('teacherEmail', '==', user.email),
        where('status', '==', 'pending')
      )
      const snapshot = await getDocs(invitationsQuery)
      const invitationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invitation[]
      setInvitations(invitationsData)
    } catch (err) {
      console.error('Error loading invitations:', err)
      setError(t('teacherInvitations.errorLoading'))
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (invitationId: string, schoolId: string) => {
    try {
      // Update invitation status
      await updateDoc(doc(db, 'school_invitations', invitationId), {
        status: 'accepted'
      })

      // Add teacher to school's teacher list
      await updateDoc(doc(db, `schools/${schoolId}/teachers`, user?.uid || ''), {
        status: 'active'
      })

      await loadInvitations()
    } catch (err) {
      console.error('Error accepting invitation:', err)
      setError(t('teacherInvitations.errorAccepting'))
    }
  }

  const handleReject = async (invitationId: string) => {
    try {
      await updateDoc(doc(db, 'school_invitations', invitationId), {
        status: 'rejected'
      })
      await loadInvitations()
    } catch (err) {
      console.error('Error rejecting invitation:', err)
      setError(t('teacherInvitations.errorRejecting'))
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('teacherInvitations.title')}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <School className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{invitation.schoolName}</h3>
                  <div className="flex items-center text-yellow-600 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{t('teacherInvitations.pendingResponse')}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(invitation.id, invitation.schoolId)}
                  className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{t('teacherInvitations.accept')}</span>
                </button>
                <button
                  onClick={() => handleReject(invitation.id)}
                  className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{t('teacherInvitations.reject')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {invitations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('teacherInvitations.noInvitations')}
          </div>
        )}
      </div>
    </div>
  )
}