import { X, Mail, Phone, MapPin, GraduationCap, BookOpen, FileText, ExternalLink, User, Globe } from 'lucide-react'

interface TeacherProfileModalProps {
  teacher: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    street?: string
    city?: string
    zipCode?: string
    canton?: string
    teachingLevels: string[]
    subjects: string[]
    cvUrl?: string
    photoUrl?: string
    age?: number
    civility?: string
    nativeLanguage?: string
  }
  onClose: () => void
}

export function TeacherProfileModal({ teacher, onClose }: TeacherProfileModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* En-tête avec bouton de fermeture */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="text-2xl font-semibold">Profil de l'enseignant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="p-6 overflow-y-auto">
          {/* Photo et nom */}
          <div className="flex items-center space-x-4 mb-6">
            {teacher.photoUrl ? (
              <img
                src={teacher.photoUrl}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl text-primary font-semibold">
                  {teacher.firstName[0]}
                  {teacher.lastName[0]}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold">
                {teacher.firstName} {teacher.lastName}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <User className="h-4 w-4 mr-2" />
                <span>{teacher.civility || 'Non spécifié'}</span>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Informations personnelles</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{teacher.email}</span>
                </div>
                {teacher.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3" />
                    <span>{teacher.phone}</span>
                  </div>
                )}
                {teacher.age && (
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-3" />
                    <span>{teacher.age} ans</span>
                  </div>
                )}
                {teacher.nativeLanguage && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 mr-3" />
                    <span>Langue maternelle: {teacher.nativeLanguage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse */}
            {(teacher.street || teacher.city || teacher.canton) && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Adresse</h3>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 mt-1" />
                  <div>
                    {teacher.street && <div>{teacher.street}</div>}
                    <div>
                      {teacher.zipCode && <span>{teacher.zipCode} </span>}
                      {teacher.city && <span>{teacher.city}</span>}
                    </div>
                    {teacher.canton && <div>{teacher.canton}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* CV */}
            <div>
              <h3 className="font-semibold text-lg mb-4">CV</h3>
              {teacher.cvUrl ? (
                <a
                  href={teacher.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark bg-primary/5 px-4 py-2 rounded-lg transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>Voir le CV</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="text-gray-500 italic">
                  Pas de CV disponible
                </div>
              )}
            </div>

            {/* Compétences */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Compétences</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <GraduationCap className="h-5 w-5 mr-3 mt-1 text-gray-400" />
                  <div>
                    <h4 className="font-medium mb-2">Niveaux d'enseignement</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.teachingLevels.map((level) => (
                        <span
                          key={level}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 mr-3 mt-1 text-gray-400" />
                  <div>
                    <h4 className="font-medium mb-2">Branches</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}