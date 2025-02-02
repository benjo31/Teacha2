import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/context/AuthContext'
import { TeachersList } from './TeachersList'
import { InviteTeacherForm } from './InviteTeacherForm'
import { Users, UserPlus } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { LoadingSpinner } from '../ui/LoadingSpinner'

type TeamStats = {
  activeTeachers: number
  pendingInvitations: number
  acceptanceRate: number
}

export function TeamManagement() {
  const { user } = useAuth()
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadTeamStats()
    }
  }, [user])

  async function loadTeamStats() {
    if (!user) return

    try {
      // Charger les enseignants actifs
      const teachersQuery = query(
        collection(db, `schools/${user.uid}/teachers`),
        where('status', '==', 'active')
      )
      const activeTeachersSnapshot = await getDocs(teachersQuery)
      const activeTeachers = activeTeachersSnapshot.size

      // Charger les invitations en attente
      const invitationsQuery = query(
        collection(db, 'school_invitations'),
        where('schoolId', '==', user.uid),
        where('status', '==', 'pending')
      )
      const pendingInvitationsSnapshot = await getDocs(invitationsQuery)
      const pendingInvitations = pendingInvitationsSnapshot.size

      // Calculer le taux d'acceptation
      const allInvitationsQuery = query(
        collection(db, 'school_invitations'),
        where('schoolId', '==', user.uid)
      )
      const allInvitationsSnapshot = await getDocs(allInvitationsQuery)
      const totalInvitations = allInvitationsSnapshot.size
      const acceptedInvitations = allInvitationsSnapshot.docs.filter(
        doc => doc.data().status === 'accepted'
      ).length

      const acceptanceRate = totalInvitations > 0
        ? Math.round((acceptedInvitations / totalInvitations) * 100)
        : 0

      setStats({
        activeTeachers,
        pendingInvitations,
        acceptanceRate
      })
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Équipe enseignante</h2>
          </div>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {showInviteForm ? 'Fermer' : 'Inviter un enseignant'}
          </button>
        </div>

        {showInviteForm && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <InviteTeacherForm
              schoolId={user?.uid || ''}
              onSuccess={() => {
                setShowInviteForm(false)
                loadTeamStats()
              }}
            />
          </div>
        )}

        <TeachersList 
          compact 
          onTeacherStatusChange={loadTeamStats}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold mb-4">Statistiques de l'équipe</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-semibold text-primary mb-1">
              {stats?.activeTeachers || 0}
            </div>
            <div className="text-sm text-gray-600">Enseignants actifs</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-semibold text-yellow-600 mb-1">
              {stats?.pendingInvitations || 0}
            </div>
            <div className="text-sm text-gray-600">Invitations en attente</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-semibold text-green-600 mb-1">
              {stats?.acceptanceRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Taux d'acceptation</div>
          </div>
        </div>
      </div>
    </div>
  )
}