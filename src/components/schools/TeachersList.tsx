import { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../lib/context/AuthContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { UserCircle2, Mail, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

interface TeachersListProps {
  compact?: boolean
}

export function TeachersList({ compact = false }: TeachersListProps) {
  const { t } = useTranslation()
  // ... reste du code inchangé ...

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {!compact && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t('team.activeTeachers')}</h2>
        </div>
      )}

      {/* ... reste du code inchangé ... */}
    </div>
  )
}