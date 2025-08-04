import { Building, Mail, AlertTriangle, Copyright, Lock } from 'lucide-react'
import { useTranslation } from '../lib/context/LanguageContext'

export function LegalPage() {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t('legal.title')}</h1>
      </div>

      {/* Contenu principal */}
      <div className="space-y-8">
        {/* Contenu et Rédaction */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Copyright className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('legal.contentRedaction.title')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t('legal.contentRedaction.description')}
          </p>
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('legal.coordinates.title')}</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>CTA Ecom</p>
            <p>Teacha</p>
            <p>Chemin de Scheuren 49,</p>
            <p>2504 Bienne,</p>
            <p>Suisse</p>
            <div className="flex items-center gap-2 mt-4">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:hello@teacha.ch" className="text-primary hover:text-primary-dark">
                hello@teacha.ch
              </a>
            </div>
          </div>
        </div>

        {/* Clause de non-responsabilité */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('legal.disclaimer.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              {t('legal.disclaimer.content1')}
            </p>
            <p>
              {t('legal.disclaimer.content2')}
            </p>
            <p>
              {t('legal.disclaimer.content3')}
            </p>
          </div>
        </div>

        {/* Protection des données */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('legal.dataProtection.title')}</h2>
          </div>
          <p className="text-gray-600">
            {t('legal.dataProtection.description')}
          </p>
        </div>
      </div>
    </div>
  )
}