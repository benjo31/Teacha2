import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/context/AuthContext'
import { useTranslation } from '../lib/context/LanguageContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { ClockIcon } from 'lucide-react'

export function PendingApprovalPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    async function checkStatus() {
      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      const schoolDoc = await getDoc(doc(db, 'schools', user.uid))

      if (teacherDoc.exists()) {
        setUserType('teacher')
        if (teacherDoc.data().status === 'approved') {
          navigate('/teacher-dashboard')
        }
      } else if (schoolDoc.exists()) {
        setUserType('school')
        if (schoolDoc.data().status === 'approved') {
          navigate('/school-dashboard')
        }
      }
    }

    checkStatus()
  }, [user, navigate])

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <ClockIcon className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">{t('auth.pendingApproval.title')}</h1>
        <p className="text-gray-600 mb-4">
          {t('auth.pendingApproval.message')}
        </p>
        <p className="text-sm text-gray-500">
          {t('auth.pendingApproval.checkLater')}
        </p>
      </div>
    </div>
  )
}