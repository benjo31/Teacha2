import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/context/AuthContext'
import { TeachersList } from './TeachersList'
import { InviteTeacherForm } from './InviteTeacherForm'
import { Users, UserPlus, Settings } from 'lucide-react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useTranslation } from '../../lib/context/LanguageContext'
import { InvitationLimitIndicator } from '../ui/InvitationLimitIndicator'
import { PermissionGuard } from '../auth/PermissionGuard'
import { usePermissions } from '../../lib/hooks/usePermissions'

type TeamStats = {
  activeTeachers: number
  pendingInvitations: number
  acceptanceRate: number
  invitationLimit: {
    used: number
    max: number
  }
}

export function TeamManagement() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { checkPermission } = usePermissions()
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
      // Load school data for invitation limits
      const schoolDoc = await getDoc(doc(db, 'schools', user.uid))
      const schoolData = schoolDoc.exists() ? schoolDoc.data() : {}
      const maxInvitations = schoolData.plan?.maxInvitations ?? 20
      const usedInvitations = schoolData.plan?.usedInvitations ?? 0

      // Load active teachers
      const teachersQuery = query(
        collection(db, `schools/${user.uid}/teachers`),
        where('status', '==', 'active')
      )
      const activeTeachersSnapshot = await getDocs(teachersQuery)
      const activeTeachers = activeTeachersSnapshot.size

      // Load pending invitations
      const pendingQuery = query(
        collection(db, `schools/${user.uid}/teachers`),
        where('status', '==', 'pending')
      )
      const pendingInvitationsSnapshot = await getDocs(pendingQuery)
      const pendingInvitations = pendingInvitationsSnapshot.size

      // Calculate acceptance rate
      const allTeachersQuery = collection(db, `schools/${user.uid}/teachers`)
      const allTeachersSnapshot = await getDocs(allTeachersQuery)
      const totalInvitations = allTeachersSnapshot.size
      const acceptedInvitations = allTeachersSnapshot.docs.filter(
        doc => doc.data().status === 'active'
      ).length

      const acceptanceRate = totalInvitations > 0
        ? Math.round((acceptedInvitations / totalInvitations) * 100)
        : 0

      setStats({
        activeTeachers,
        pendingInvitations,
        acceptanceRate,
        invitationLimit: {
          used: usedInvitations,
          max: maxInvitations
        }
      })
      setLoading(false)
    } catch (error) {
      console.error('Error loading team stats:', error)
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
            <h2 className="text-xl font-semibold">{t('team.title')}</h2>
          </div>
          <div className="flex items-center gap-4">
            {stats && (
              <InvitationLimitIndicator 
                used={stats.invitationLimit.used}
                max={stats.invitationLimit.max}
                size="sm"
              />
            )}
            <PermissionGuard permission="team:invite">
              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="btn btn-primary flex items-center gap-2"
                disabled={stats?.invitationLimit.used >= stats?.invitationLimit.max}
              >
                <UserPlus className="h-4 w-4" />
                {showInviteForm ? t('common.close') : t('team.inviteTeacher')}
              </button>
            </PermissionGuard>
          </div>
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
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold">{t('team.title')} - {t('common.statistics')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-semibold text-primary mb-1">
              {stats?.activeTeachers || 0}
            </div>
            <div className="text-sm text-gray-600">{t('team.activeTeachers')}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-semibold text-yellow-600 mb-1">
              {stats?.pendingInvitations || 0}
            </div>
            <div className="text-sm text-gray-600">{t('team.pendingInvitations')}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-semibold text-green-600 mb-1">
              {stats?.acceptanceRate || 0}%
            </div>
            <div className="text-sm text-gray-600">{t('team.acceptanceRate')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}