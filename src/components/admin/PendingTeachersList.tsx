import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Check, X } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

type Teacher = {
  id: string
  firstName: string
  lastName: string
  email: string
  age: number
  teachingLevels: string[]
  subjects: string[]
  status: string
  createdAt: string
}

export function PendingTeachersList() {
  const { t } = useTranslation()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPendingTeachers()
  }, [])

  async function loadPendingTeachers() {
    const q = query(
      collection(db, 'teachers'),
      where('status', '==', 'pending')
    )
    
    const snapshot = await getDocs(q)
    const teachersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Teacher[]
    
    setTeachers(teachersData)
    setLoading(false)
  }

  async function handleApprove(teacherId: string) {
    await updateDoc(doc(db, 'teachers', teacherId), {
      status: 'approved'
    })
    await loadPendingTeachers()
  }

  async function handleReject(teacherId: string) {
    await updateDoc(doc(db, 'teachers', teacherId), {
      status: 'rejected'
    })
    await loadPendingTeachers()
  }

  if (loading) {
    return <div>{t('admin.loading')}</div>
  }

  if (teachers.length === 0) {
    return <div>{t('admin.noPendingTeachers')}</div>
  }

  return (
    <div className="space-y-4">
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-start"
        >
          <div>
            <h3 className="font-medium">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-500">{teacher.email}</p>
            <div className="mt-2 text-sm">
              <p>{t('admin.teacherDetails.age')}: {t('admin.teacherDetails.yearsOld', { age: teacher.age })}</p>
              <p>{t('admin.teacherDetails.levels')}: {teacher.teachingLevels.join(', ')}</p>
              <p>{t('admin.teacherDetails.subjects')}: {teacher.subjects.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(teacher.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleReject(teacher.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}