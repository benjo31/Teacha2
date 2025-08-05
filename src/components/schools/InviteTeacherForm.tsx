import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../ui/Input'
import { inviteTeacher } from '../../lib/services/schoolTeachers'
import { useTranslation } from '../../lib/context/LanguageContext'

const inviteSchema = z.object({
  email: z.string().email('Email invalide')
})

interface InviteTeacherFormProps {
  schoolId: string
  onSuccess: () => void
}

export function InviteTeacherForm({ schoolId, onSuccess }: InviteTeacherFormProps) {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<{ email: string }>({
    resolver: zodResolver(inviteSchema)
  })

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsSubmitting(true)
      setError('')
      await inviteTeacher(schoolId, data.email)
      reset()
      onSuccess()
    } catch (err: any) {
      setError(err.message || t('inviteTeacherForm.errorMessage'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}

      <Input
        label={t('inviteTeacherForm.teacherEmail')}
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder={t('inviteTeacherForm.emailPlaceholder')}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? t('inviteTeacherForm.sending') : t('inviteTeacherForm.inviteTeacher')}
      </button>
    </form>
  )
}