import { useState } from 'react'
import { TeacherRegistrationForm } from '../components/auth/TeacherRegistrationForm'
import { SchoolRegistrationForm } from '../components/auth/SchoolRegistrationForm'

export function RegisterPage() {
  const [userType, setUserType] = useState<'teacher' | 'school'>('teacher')

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-md ${
            userType === 'teacher'
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setUserType('teacher')}
        >
          Remplaçant
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md ${
            userType === 'school'
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setUserType('school')}
        >
          École
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