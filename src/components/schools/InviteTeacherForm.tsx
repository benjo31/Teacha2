import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../ui/Input'
import { inviteTeacher } from '../../lib/services/schoolTeachers'

const inviteSchema = z.object({
  email: z.string().email('Email invalide')
})

interface InviteTeacherFormProps {
  schoolId: string
  onSuccess: () => void
}

export function InviteTeacherForm({ schoolId, onSuccess }: InviteTeacherFormProps) {
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
      setError(err.message || 'Une erreur est survenue')
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
        label="Email de l'enseignant"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="exemple@ecole.ch"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? 'Envoi...' : 'Inviter l\'enseignant'}
      </button>
    </form>
  )
}