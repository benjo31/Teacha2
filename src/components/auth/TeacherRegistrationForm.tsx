import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { teacherSchema } from '../../lib/schemas/auth'
import { Input } from '../ui/Input'
import { MultiSelect } from '../ui/MultiSelect'
import { FileUpload } from '../ui/FileUpload'
import { ImageUpload } from '../ui/ImageUpload'
import { TEACHING_LEVELS, SUBJECTS, CANTONS, CIVILITY, NATIVE_LANGUAGES } from '../../lib/constants'
import { registerTeacher } from '../../lib/services/auth'
import { CheckCircle } from 'lucide-react'

type TeacherFormData = z.infer<typeof teacherSchema>

export function TeacherRegistrationForm() {
  const [error, setError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState({
    photo: false,
    cv: false
  })
  const navigate = useNavigate()
  
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  })

  const selectedPhoto = watch('photo')
  const selectedCV = watch('cv')

  const handleFileChange = (file: File | null) => {
    setValue('cv', file || undefined)
    if (file) {
      setUploadSuccess(prev => ({ ...prev, cv: true }))
    }
  }

  const handlePhotoChange = (file: File | null, croppedImage?: Blob) => {
    setValue('photo', file || undefined)
    if (file) {
      setUploadSuccess(prev => ({ ...prev, photo: true }))
    }
  }

  const onSubmit = async (data: TeacherFormData) => {
    try {
      await registerTeacher(data)
      navigate('/pending-approval')
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-error p-4 rounded-md animate-fade-in">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <ImageUpload
          label="Photo de profil"
          onChange={handlePhotoChange}
          error={errors.photo?.message}
          aspectRatio={1}
          minWidth={200}
          minHeight={200}
        />
        {uploadSuccess.photo && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Photo téléchargée avec succès
          </div>
        )}
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          {...register('firstName')}
          error={errors.firstName?.message}
          className="h-14 text-lg"
        />
        <Input
          label="Nom"
          {...register('lastName')}
          error={errors.lastName?.message}
          className="h-14 text-lg"
        />
      </div>

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
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label="Mot de passe"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label="Âge"
        type="number"
        {...register('age', { valueAsNumber: true })}
        error={errors.age?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label="Téléphone (facultatif)"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        className="h-14 text-lg"
      />

      <div className="space-y-4">
        <h3 className="font-medium">Adresse</h3>
        <Input
          label="Rue et numéro"
          {...register('street')}
          error={errors.street?.message}
          className="h-14 text-lg"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="NPA"
            {...register('zipCode')}
            error={errors.zipCode?.message}
            className="h-14 text-lg"
          />
          <Input
            label="Ville"
            {...register('city')}
            error={errors.city?.message}
            className="h-14 text-lg"
          />
        </div>
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

      <div className="space-y-4">
        <FileUpload
          label="CV (PDF, max 2 Mo)"
          accept="application/pdf"
          onChange={handleFileChange}
          error={errors.cv?.message}
        />
        {uploadSuccess.cv && selectedCV && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            CV téléchargé avec succès : {selectedCV.name}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full h-14 text-lg"
      >
        {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire comme remplaçant'}
      </button>
    </form>
  )
}