import { MultiSelect } from '../ui/MultiSelect'
import { SUBJECTS } from '../../lib/constants'

interface SubjectsSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function SubjectsSelector({ value, onChange, error }: SubjectsSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Branches
      </label>
      <MultiSelect
        options={SUBJECTS}
        value={value}
        onChange={onChange}
        error={error}
        searchable
      />
    </div>
  )
}