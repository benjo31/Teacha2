import { Building, Mail, AlertTriangle, Copyright, Lock } from 'lucide-react'

export function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>
      </div>

      {/* Contenu principal */}
      <div className="space-y-8">
        {/* Contenu et Rédaction */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Copyright className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Contenu et Rédaction</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Teacha est la solution web de communication remplaçants et établissements scolaires, sécurisée et répondant à toutes les réglementations RGPD.
          </p>
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Coordonnées</h2>
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
            <h2 className="text-xl font-semibold">Clause de non-responsabilité</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              Le contenu de ces pages web est maintenu avec le plus grand soin. Cependant, nous déclinons toute responsabilité quant à leur contenu.
            </p>
            <p>
              Erreurs d'impression, fautes et modifications réservées.
            </p>
            <p>
              L'intégralité des droits d'auteurs appartiennent à Teacha. Le contenu de ce site web ne peut être utilisé sans autorisation de la part de Teacha, et la source doit être indiquée.
            </p>
          </div>
        </div>

        {/* Protection des données */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Protection des données</h2>
          </div>
          <p className="text-gray-600">
            Les données personnelles transmises lors du remplissage de formulaires sont confidentielles et ne seront pas transmises à des tiers.
          </p>
        </div>
      </div>
    </div>
  )
}