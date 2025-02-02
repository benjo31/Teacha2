import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { teacherProfileSchema } from '../../lib/schemas/profile'
import { Input } from '../ui/Input'
import { MultiSelect } from '../ui/MultiSelect'
import { FileUpload } from '../ui/FileUpload'
import { ImageUpload } from '../ui/ImageUpload'
import { updateTeacherProfile } from '../../lib/services/profile'
import { TEACHING_LEVELS, SUBJECTS, CANTONS, CIVILITY, NATIVE_LANGUAGES } from '../../lib/constants'
import { CheckCircle, FileText } from 'lucide-react'

type TeacherProfileData = z.infer<typeof teacherProfileSchema>

interface UpdateProfileFormProps {
  initialData: TeacherProfileData
  onSuccess: () => void
}

export function UpdateProfileForm({ initialData, onSuccess }: UpdateProfileFormProps) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updating, setUpdating] = useState(false)
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [newCV, setNewCV] = useState<File | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TeacherProfileData>({
    resolver: zodResolver(teacherProfileSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: TeacherProfileData) => {
    try {
      setUpdating(true)
      setError('')
      await updateTeacherProfile(data, newPhoto || undefined, newCV || undefined)
      setSuccess('Profil mis à jour avec succès')
      onSuccess()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
      setError('Une erreur est survenue lors de la mise à jour')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* Photo de profil */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Photo de profil</h3>
          <ImageUpload
            label="Photo de profil"
            onChange={(file) => setNewPhoto(file)}
            currentImageUrl={initialData.photoUrl}
          />
        </div>

        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="civility"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Civilité"
                  options={CIVILITY}
                  value={field.value ? [field.value] : []}
                  onChange={(values) => field.onChange(values[0])}
                  error={errors.civility?.message}
                />
              )}
            />

            <Controller
              name="nativeLanguage"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Langue natale"
                  options={NATIVE_LANGUAGES}
                  value={field.value ? [field.value] : []}
                  onChange={(values) => field.onChange(values[0])}
                  error={errors.nativeLanguage?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Prénom"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Nom"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Téléphone"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Âge"
              type="number"
              {...register('age', { valueAsNumber: true })}
              error={errors.age?.message}
            />
          </div>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Adresse</h3>
          
          <div className="space-y-4">
            <Input
              label="Rue"
              {...register('street')}
              error={errors.street?.message}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="NPA"
                {...register('zipCode')}
                error={errors.zipCode?.message}
              />
              <Input
                label="Ville"
                {...register('city')}
                error={errors.city?.message}
              />
            </div>

            <Controller
              name="canton"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Canton"
                  options={CANTONS}
                  value={field.value ? [field.value] : []}
                  onChange={(values) => field.onChange(values[0])}
                  error={errors.canton?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Compétences */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Compétences</h3>
          
          <div className="space-y-4">
            <Controller
              name="teachingLevels"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Niveaux d'enseignement"
                  options={TEACHING_LEVELS}
                  value={field.value || []}
                  onChange={field.onChange}
                  error={errors.teachingLevels?.message}
                />
              )}
            />

            <Controller
              name="subjects"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Branches"
                  options={SUBJECTS}
                  value={field.value || []}
                  onChange={field.onChange}
                  error={errors.subjects?.message}
                />
              )}
            />
          </div>
        </div>

        {/* CV */}
        <div>
          <h3 className="text-lg font-semibold mb-4">CV</h3>
          
          {initialData.cvUrl && (
            <a
              href={initialData.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark mb-4"
            >
              <FileText className="h-5 w-5" />
              <span>Voir le CV actuel</span>
            </a>
          )}

          <FileUpload
            label="Nouveau CV (PDF, max 2 Mo)"
            accept="application/pdf"
            onChange={(file) => setNewCV(file)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updating}
          className="btn btn-primary px-8"
        >
          {updating ? 'Mise à jour...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  )
}