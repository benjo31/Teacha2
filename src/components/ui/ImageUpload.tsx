import { ChangeEvent, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Crop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageUploadProps {
  label: string
  onChange: (file: File | null, croppedImage?: Blob) => void
  error?: string
  aspectRatio?: number
  minWidth?: number
  minHeight?: number
  currentImageUrl?: string
}

export function ImageUpload({
  label,
  onChange,
  error,
  aspectRatio = 1,
  minWidth = 200,
  minHeight = 200,
  currentImageUrl
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  })

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPreview(null)
      setSelectedFile(null)
      onChange(null)
      return
    }

    // Vérifier les dimensions de l'image
    const img = new Image()
    img.src = URL.createObjectURL(file)
    await new Promise((resolve) => {
      img.onload = resolve
    })

    if (img.width < minWidth || img.height < minHeight) {
      alert(`L'image doit faire au minimum ${minWidth}x${minHeight} pixels`)
      return
    }

    setPreview(img.src)
    setSelectedFile(file)
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setPreview(null)
    setSelectedFile(null)
    onChange(null)
  }

  const getCroppedImg = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const handleSave = async () => {
    if (!selectedFile) return
    
    try {
      const croppedImage = await getCroppedImg()
      if (croppedImage) {
        onChange(selectedFile, croppedImage)
      }
    } catch (err) {
      console.error('Erreur lors du crop de l\'image:', err)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {!preview && !currentImageUrl && (
        <div
          onClick={() => inputRef.current?.click()}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90">
                <span>Télécharger une image</span>
                <input
                  ref={inputRef}
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/png"
                  onChange={handleChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PNG ou JPG uniquement
            </p>
          </div>
        </div>
      )}

      {(preview || currentImageUrl) && (
        <div className="relative mt-1">
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 z-10"
          >
            <X className="h-4 w-4" />
          </button>
          {preview ? (
            <>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={aspectRatio}
              >
                <img
                  ref={imgRef}
                  src={preview}
                  alt="Aperçu"
                  className="max-h-64 rounded-md mx-auto"
                />
              </ReactCrop>

              <button
                onClick={handleSave}
                className="mt-4 w-full btn btn-primary"
              >
                Valider le recadrage
              </button>
            </>
          ) : (
            <img
              src={currentImageUrl}
              alt="Photo actuelle"
              className="max-h-64 rounded-md mx-auto"
            />
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}