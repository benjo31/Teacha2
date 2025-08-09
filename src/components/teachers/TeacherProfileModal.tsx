import { X, Mail, Phone, MapPin, GraduationCap, BookOpen, FileText, ExternalLink, User, Globe } from 'lucide-react'
import { useTranslation } from '../../lib/context/LanguageContext'

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
  const { t } = useTranslation()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* En-tête avec bouton de fermeture */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="text-2xl font-semibold">{t('teacherProfile.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('common.close')}
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
                <span>{teacher.civility || t('constants.civility.unspecified')}</span>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('teacher.registration.personalInfo')}</h3>
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
                    <span>{teacher.age} {t('teacherProfile.yearsOld')}</span>
                  </div>
                )}
                {teacher.nativeLanguage && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 mr-3" />
                    <span>{t('teacher.registration.nativeLanguage')}: {teacher.nativeLanguage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse */}
            {(teacher.street || teacher.city || teacher.canton) && (
              <div>
                <h3 className="font-semibold text-lg mb-4">{t('teacher.registration.address')}</h3>
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
              <h3 className="font-semibold text-lg mb-4">{t('teacher.registration.cv')}</h3>
              {teacher.cvUrl ? (
                <a
                  href={teacher.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark bg-primary/5 px-4 py-2 rounded-lg transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>{t('teacherProfile.viewCV')}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="text-gray-500 italic">
                  {t('teacherProfile.noCVAvailable')}
                </div>
              )}
            </div>

            {/* Compétences */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('teacher.registration.qualifications')}</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <GraduationCap className="h-5 w-5 mr-3 mt-1 text-gray-400" />
                  <div>
                    <h4 className="font-medium mb-2">{t('teacher.registration.teachingLevels')}</h4>
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
                    <h4 className="font-medium mb-2">{t('teacher.registration.subjects')}</h4>
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