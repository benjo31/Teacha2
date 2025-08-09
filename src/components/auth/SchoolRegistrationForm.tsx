import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../lib/context/LanguageContext'
import { createSchoolSchema } from '../../lib/schemas/validationSchemas'
import { Input } from '../ui/Input'
import { MultiSelect } from '../ui/MultiSelect'
import { getTeachingLevels, getCantons, getSpecialClasses } from '../../lib/constants'
import { registerSchool } from '../../lib/services/auth'

export function SchoolRegistrationForm() {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const schoolSchema = createSchoolSchema(t)
  type SchoolFormData = z.infer<typeof schoolSchema>
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      schedule: {
        morningStart: '08:00',
        morningEnd: '11:45',
        afternoonStart: '13:30',
        afternoonEnd: '15:15'
      }
    }
  })

  const onSubmit = async (data: SchoolFormData) => {
    try {
      await registerSchool(data)
      navigate('/pending-approval')
    } catch (err: any) {
      if (err.message === 'EMAIL_ALREADY_IN_USE') {
        setError(t('errors.emailInUse'))
      } else {
        setError(t('school.registration.error'))
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-error p-4 rounded-md animate-fade-in">
          {error}
        </div>
      )}
      
      <Input
        label={t('school.registration.name')}
        {...register('name')}
        error={errors.name?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label={t('school.registration.email')}
        type="email"
        {...register('email')}
        error={errors.email?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label={t('school.registration.password')}
        type="password"
        {...register('password')}
        error={errors.password?.message}
        className="h-14 text-lg"
      />
      
      <Input
        label={t('school.registration.address')}
        {...register('address')}
        error={errors.address?.message}
        className="h-14 text-lg"
      />
      
      <Controller
        name="canton"
        control={control}
        render={({ field }) => (
          <MultiSelect
            label={t('school.registration.canton')}
            options={getCantons(t)}
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
            label={t('school.registration.teachingLevels')}
            options={getTeachingLevels(t)}
            value={field.value || []}
            onChange={field.onChange}
            error={errors.teachingLevels?.message}
          />
        )}
      />
      
      <Input
        label={t('school.registration.classCount')}
        type="number"
        {...register('classCount', { valueAsNumber: true })}
        error={errors.classCount?.message}
        className="h-14 text-lg"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('school.registration.description')}
        </label>
        <textarea
          {...register('description')}
          className="input min-h-[8rem] text-lg"
          placeholder={t('school.registration.descriptionPlaceholder')}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error animate-fade-in">
            {errors.description?.message as string}
          </p>
        )}
      </div>

      <Input
        label={t('school.registration.website')}
        type="url"
        {...register('website')}
        error={errors.website?.message}
        className="h-14 text-lg"
        placeholder={t('school.registration.websitePlaceholder')}
      />

      <Controller
        name="specialClasses"
        control={control}
        render={({ field }) => (
          <MultiSelect
            label={t('school.registration.specialClasses')}
            options={getSpecialClasses(t)}
            value={field.value || []}
            onChange={field.onChange}
            error={errors.specialClasses?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('school.registration.pedagogicalProjects')}
        </label>
        <textarea
          {...register('pedagogicalProjects')}
          className="input min-h-[8rem] text-lg"
          placeholder={t('school.registration.pedagogicalProjectsPlaceholder')}
        />
        {errors.pedagogicalProjects?.message && (
          <p className="mt-1 text-sm text-error animate-fade-in">
            {errors.pedagogicalProjects?.message as string}
          </p>
        )}
      </div>

      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-medium">{t('school.registration.contactPerson')}</h3>
        
        <Input
          label={t('school.registration.contactName')}
          {...register('contactPerson.name')}
          error={errors.contactPerson?.name?.message}
          className="h-14 text-lg"
        />
        
        <Input
          label={t('school.registration.contactRole')}
          {...register('contactPerson.role')}
          error={errors.contactPerson?.role?.message}
          className="h-14 text-lg"
        />
        
        <Input
          label={t('school.registration.contactPhone')}
          type="tel"
          {...register('contactPerson.phone')}
          error={errors.contactPerson?.phone?.message}
          className="h-14 text-lg"
        />
        
        <Input
          label={t('school.registration.contactEmail')}
          type="email"
          {...register('contactPerson.email')}
          error={errors.contactPerson?.email?.message}
          className="h-14 text-lg"
        />
      </div>

      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-medium">{t('school.registration.schedule')}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('school.registration.morning')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label={t('school.registration.morningStart')}
                type="time"
                {...register('schedule.morningStart')}
                error={errors.schedule?.morningStart?.message}
                className="h-14 text-lg"
              />
              <Input
                label={t('school.registration.morningEnd')}
                type="time"
                {...register('schedule.morningEnd')}
                error={errors.schedule?.morningEnd?.message}
                className="h-14 text-lg"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('school.registration.afternoon')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label={t('school.registration.afternoonStart')}
                type="time"
                {...register('schedule.afternoonStart')}
                error={errors.schedule?.afternoonStart?.message}
                className="h-14 text-lg"
              />
              <Input
                label={t('school.registration.afternoonEnd')}
                type="time"
                {...register('schedule.afternoonEnd')}
                error={errors.schedule?.afternoonEnd?.message}
                className="h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full h-14 text-lg"
      >
        {isSubmitting ? t('school.registration.submitting') : t('school.registration.submit')}
      </button>
    </form>
  )
}