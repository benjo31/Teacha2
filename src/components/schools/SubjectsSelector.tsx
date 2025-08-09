import { MultiSelect } from '../ui/MultiSelect'
import { getSubjects } from '../../lib/constants'
import { useTranslation } from '../../lib/context/LanguageContext'

interface SubjectsSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function SubjectsSelector({ value, onChange, error }: SubjectsSelectorProps) {
  const { t } = useTranslation()
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('school.createOffer.subjects')}
      </label>
      <MultiSelect
        options={getSubjects(t)}
        value={value}
        onChange={onChange}
        error={error}
        searchable
      />
    </div>
  )
}