import { ChangeEvent, useRef } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  label: string
  accept?: string
  onChange: (file: File | null) => void
  error?: string
}

export function FileUpload({ label, accept, onChange, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90">
              <span>Télécharger un fichier</span>
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleChange}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Cliquez ou glissez-déposez
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}