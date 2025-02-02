import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { schoolSchema } from '../../lib/schemas/auth'
import { Input } from '../ui/Input'
import { MultiSelect } from '../ui/MultiSelect'
import { TEACHING_LEVELS, CANTONS, SPECIAL_CLASSES } from '../../lib/constants'
import { registerSchool } from '../../lib/services/auth'

type SchoolFormData = z.infer<typeof schoolSchema>

export function SchoolRegistrationForm() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
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
      
      <Input
        label="Nom de l'école"
        {...register('name')}
        error={errors.name?.message}
        className="h-14 text-lg"
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
        label="Adresse"
        {...register('address')}
        error={errors.address?.message}
        className="h-14 text-lg"
      />
      
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
      
      <Input
        label="Nombre de classes"
        type="number"
        {...register('classCount', { valueAsNumber: true })}
        error={errors.classCount?.message}
        className="h-14 text-lg"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description de l'établissement (facultatif)
        </label>
        <textarea
          {...register('description')}
          className="input min-h-[8rem] text-lg"
          placeholder="Décrivez brièvement votre établissement..."
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error animate-fade-in">
            {errors.description.message}
          </p>
        )}
      </div>

      <Input
        label="Site web (facultatif)"
        type="url"
        {...register('website')}
        error={errors.website?.message}
        className="h-14 text-lg"
        placeholder="https://www.example.com"
      />

      <Controller
        name="specialClasses"
        control={control}
        render={({ field }) => (
          <MultiSelect
            label="Classes spéciales"
            options={SPECIAL_CLASSES}
            value={field.value || []}
            onChange={field.onChange}
            error={errors.specialClasses?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Projets pédagogiques particuliers (facultatif)
        </label>
        <textarea
          {...register('pedagogicalProjects')}
          className="input min-h-[8rem] text-lg"
          placeholder="Décrivez vos projets pédagogiques particuliers..."
        />
        {errors.pedagogicalProjects?.message && (
          <p className="mt-1 text-sm text-error animate-fade-in">
            {errors.pedagogicalProjects.message}
          </p>
        )}
      </div>

      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-medium">Personne de contact principale</h3>
        
        <Input
          label="Nom"
          {...register('contactPerson.name')}
          error={errors.contactPerson?.name?.message}
          className="h-14 text-lg"
        />
        
        <Input
          label="Rôle"
          {...register('contactPerson.role')}
          error={errors.contactPerson?.role?.message}
          className="h-14 text-lg"
        />
        
        <Input
          label="Téléphone"
          type="tel"
          {...register('contactPerson.phone')}
          error={errors.contactPerson?.phone?.message}
          className="h-14 text-lg"
        />
        
        <Input
          label="Email"
          type="email"
          {...register('contactPerson.email')}
          error={errors.contactPerson?.email?.message}
          className="h-14 text-lg"
        />
      </div>

      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="font-medium">Horaires typiques</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Matin</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Début"
                type="time"
                {...register('schedule.morningStart')}
                error={errors.schedule?.morningStart?.message}
                className="h-14 text-lg"
              />
              <Input
                label="Fin"
                type="time"
                {...register('schedule.morningEnd')}
                error={errors.schedule?.morningEnd?.message}
                className="h-14 text-lg"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Après-midi</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Début"
                type="time"
                {...register('schedule.afternoonStart')}
                error={errors.schedule?.afternoonStart?.message}
                className="h-14 text-lg"
              />
              <Input
                label="Fin"
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
        {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire comme école'}
      </button>
    </form>
  )
}