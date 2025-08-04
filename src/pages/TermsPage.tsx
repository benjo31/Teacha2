import { Building, Mail, Book, AlertTriangle, Scale, Shield, Clock, Settings, Gavel } from 'lucide-react'
import { useTranslation } from '../lib/context/LanguageContext'

export function TermsPage() {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t('terms.title')}</h1>
      </div>

      {/* Contenu principal */}
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.introduction.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.introduction.object.title')}</h3>
              <p>{t('terms.introduction.object.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.introduction.acceptance.title')}</h3>
              <p>{t('terms.introduction.acceptance.description')}</p>
            </div>
          </div>
        </div>

        {/* Description du Service */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.serviceDescription.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.serviceDescription.pilot.title')}</h3>
              <p>{t('terms.serviceDescription.pilot.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.serviceDescription.paidServices.title')}</h3>
              <p>{t('terms.serviceDescription.paidServices.description')}</p>
            </div>
          </div>
        </div>

        {/* Création de compte */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.accountCreation.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.accountCreation.registration.title')}</h3>
              <p>{t('terms.accountCreation.registration.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.accountCreation.responsibility.title')}</h3>
              <p>{t('terms.accountCreation.responsibility.description')}</p>
            </div>
          </div>
        </div>

        {/* Conditions Financières */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.financialConditions.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.financialConditions.payment.title')}</h3>
              <p>{t('terms.financialConditions.payment.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.financialConditions.renewal.title')}</h3>
              <p>{t('terms.financialConditions.renewal.description')}</p>
            </div>
          </div>
        </div>

        {/* Obligations des Utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.userObligations.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.userObligations.conduct.title')}</h3>
              <p>{t('terms.userObligations.conduct.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.userObligations.confidentiality.title')}</h3>
              <p>{t('terms.userObligations.confidentiality.description')}</p>
            </div>
          </div>
        </div>

        {/* Propriété intellectuelle */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.intellectualProperty.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.intellectualProperty.rights.title')}</h3>
              <p>{t('terms.intellectualProperty.rights.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.intellectualProperty.prohibitions.title')}</h3>
              <p>{t('terms.intellectualProperty.prohibitions.description')}</p>
            </div>
          </div>
        </div>

        {/* Limitation de responsabilité */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.liability.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.liability.warranties.title')}</h3>
              <p>{t('terms.liability.warranties.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.liability.limitation.title')}</h3>
              <p>{t('terms.liability.limitation.description')}</p>
            </div>
          </div>
        </div>

        {/* Modifications des conditions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.modifications.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.modifications.right.title')}</h3>
              <p>{t('terms.modifications.right.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.modifications.notification.title')}</h3>
              <p>{t('terms.modifications.notification.description')}</p>
            </div>
          </div>
        </div>

        {/* Juridiction et droit applicable */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.jurisdiction.title')}</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">{t('terms.jurisdiction.law.title')}</h3>
              <p>{t('terms.jurisdiction.law.description')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('terms.jurisdiction.courts.title')}</h3>
              <p>{t('terms.jurisdiction.courts.description')}</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('terms.contact.title')}</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>{t('terms.contact.description')}</p>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:hello@teacha.ch" className="text-primary hover:text-primary-dark">
                hello@teacha.ch
              </a>
            </div>
            <p className="mt-4">Teacha</p>
            <p>Chemin de Scheuren 49,</p>
            <p>2504 Bienne,</p>
            <p>Suisse</p>
          </div>
        </div>
      </div>
    </div>
  )
}