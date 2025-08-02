import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../lib/context/AuthContext'
import { useTranslation } from '../../lib/context/LanguageContext'
import { replacementOfferSchema, type ReplacementOffer } from '../../lib/schemas/offer'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { TEACHING_LEVELS } from '../../lib/constants'
import { createOffer } from '../../lib/services/offers'
import { Calendar, Clock } from 'lucide-react'
import { PeriodSelector } from './PeriodSelector'
import { SubjectsSelector } from './SubjectsSelector'

export function CreateOfferForm() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReplacementOffer>({
    resolver: zodResolver(replacementOfferSchema),
    defaultValues: {
      schoolId: user?.uid,
      status: 'active',
      periods: [],
      subjects: []
    }
  })

  const onSubmit = async (data: ReplacementOffer) => {
    try {
      setIsSubmitting(true)
      setError('')

      if (!user) {
        throw new Error(t('school.createOffer.errors.notLoggedIn'))
      }

      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      const now = new Date()
      
      now.setHours(0, 0, 0, 0)
      startDate.setHours(0, 0, 0, 0)
      
      if (startDate < now) {
        throw new Error(t('school.createOffer.errors.startDateInvalid'))
      }
      
      if (endDate < startDate) {
        throw new Error(t('school.createOffer.errors.endDateInvalid'))
      }

      const offerData = {
        ...data,
        schoolId: user.uid,
        status: 'active' as const
      }

      await createOffer(offerData)
      reset()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'offre:', err)
      setError(err.message || t('school.createOffer.errors.general'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 text-error p-4 rounded-lg border border-red-200 flex items-center space-x-2 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-success p-4 rounded-lg border border-green-200 flex items-center space-x-2 mb-6">
          <p>{t('school.createOffer.success')}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <h3 className="font-semibold text-lg mb-4">{t('school.createOffer.basicInfo')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('school.createOffer.class')}
              </label>
              <Input
                placeholder={t('school.createOffer.classPlaceholder')}
                {...register('class')}
                error={errors.class?.message}
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('school.createOffer.location')}
              </label>
              <Input
                placeholder={t('school.createOffer.locationPlaceholder')}
                {...register('location')}
                error={errors.location?.message}
                className="h-12"
              />
            </div>
          </div>

          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <SubjectsSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.subjects?.message}
              />
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('school.createOffer.teachingLevel')}
            </label>
            <Controller
              name="teachingLevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={errors.teachingLevel?.message}
                  className="h-12"
                >
                  <option value="">{t('school.createOffer.selectLevel')}</option>
                  {TEACHING_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <h3 className="font-semibold text-lg mb-4">{t('school.createOffer.period')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('school.createOffer.startDate')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  min={today}
                  {...register('startDate')}
                  error={errors.startDate?.message}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('school.createOffer.endDate')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  min={today}
                  {...register('endDate')}
                  error={errors.endDate?.message}
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>

          <Controller
            name="periods"
            control={control}
            render={({ field }) => (
              <PeriodSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.periods?.message}
              />
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('school.createOffer.totalLessons')}
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="number"
                {...register('totalLessons', { valueAsNumber: true })}
                error={errors.totalLessons?.message}
                className="pl-10 h-12"
                placeholder={t('school.createOffer.totalLessonsPlaceholder')}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <h3 className="font-semibold text-lg mb-4">{t('school.createOffer.additionalInfo')}</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('school.createOffer.topicLabel')}
            </label>
            <textarea
              {...register('topic')}
              className="input min-h-[100px] resize-none w-full"
              placeholder={t('school.createOffer.topicPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('school.createOffer.qualifications')}
            </label>
            <textarea
              {...register('qualifications')}
              className="input min-h-[100px] resize-none w-full"
              placeholder={t('school.createOffer.qualificationsPlaceholder')}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? t('school.createOffer.submitting') : t('school.createOffer.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}