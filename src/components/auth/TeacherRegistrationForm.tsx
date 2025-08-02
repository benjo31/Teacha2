import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../lib/context/LanguageContext'
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
  const { t } = useTranslation()
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
      setError(t('teacher.registration.error'))
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
          label={t('teacher.registration.photo')}
          onChange={handlePhotoChange}
          error={errors.photo?.message}
          aspectRatio={1}
          minWidth={200}
          minHeight={200}
        />
        {uploadSuccess.photo && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('teacher.registration.success.photoUploaded')}
          </div>
        )}
      </div>

      <Controller
        name="civility"
        control={control}
        render={({ field }) => (
          <MultiSelect
            label={t('teacher.registration.civility')}
            options={CIVILITY}
            value={field.value ? [field.value] : []}
            onChange={(values) => field.onChange(values[0])}
            error={errors.civility?.message}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('teacher.registration.firstName')}
          {...register('firstName')}
          error={errors.firstName?.message}
          className="h-14 text-lg"
        />
        <Input
          label={t('teacher.registration.lastName')}
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
            label={t('teacher.registration.nativeLanguage')}
            options={NATIVE_LANGUAGES}
            value={field.value ? [field.value] : []}
            onChange={(values) => field.onChange(values[0])}
            error={errors.nativeLanguage?.message}
          />
        )}
      />
      
      <Input
        label={t('teacher.registration.email')}
        type="email"
        {...register('email')}
        error={errors.email?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label={t('teacher.registration.password')}
        type="password"
        {...register('password')}
        error={errors.password?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label={t('teacher.registration.age')}
        type="number"
        {...register('age', { valueAsNumber: true })}
        error={errors.age?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label={t('teacher.registration.phone')}
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        className="h-14 text-lg"
      />

      <div className="space-y-4">
        <h3 className="font-medium">{t('teacher.registration.address')}</h3>
        <Input
          label={t('teacher.registration.street')}
          {...register('street')}
          error={errors.street?.message}
          className="h-14 text-lg"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('teacher.registration.zipCode')}
            {...register('zipCode')}
            error={errors.zipCode?.message}
            className="h-14 text-lg"
          />
          <Input
            label={t('teacher.registration.city')}
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
            label={t('teacher.registration.canton')}
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
            label={t('teacher.registration.teachingLevels')}
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
            label={t('teacher.registration.subjects')}
            options={SUBJECTS}
            value={field.value || []}
            onChange={field.onChange}
            error={errors.subjects?.message}
          />
        )}
      />

      <div className="space-y-4">
        <FileUpload
          label={t('teacher.registration.cv')}
          accept="application/pdf"
          onChange={handleFileChange}
          error={errors.cv?.message}
        />
        {uploadSuccess.cv && selectedCV && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('teacher.registration.success.cvUploaded', { filename: selectedCV.name })}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full h-14 text-lg"
      >
        {isSubmitting ? t('teacher.registration.submitting') : t('teacher.registration.submit')}
      </button>
    </form>
  )
}