import { useState } from 'react'
import { TeacherRegistrationForm } from '../components/auth/TeacherRegistrationForm'
import { SchoolRegistrationForm } from '../components/auth/SchoolRegistrationForm'
import { useTranslation } from '../lib/context/LanguageContext'

export function RegisterPage() {
  const [userType, setUserType] = useState<'teacher' | 'school'>('teacher')
  const { t } = useTranslation()

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">{t('auth.register.title')}</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-md ${
            userType === 'teacher'
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setUserType('teacher')}
        >
          {t('auth.register.asTeacher')}
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md ${
            userType === 'school'
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setUserType('school')}
        >
          {t('auth.register.asSchool')}
        </button>
      </div>

      {userType === 'teacher' ? (
        <TeacherRegistrationForm />
      ) : (
        <SchoolRegistrationForm />
      )}
    </div>
  )
}