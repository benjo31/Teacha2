import { Building, Mail, Book, AlertTriangle, Scale, Shield, Clock, Settings, Gavel } from 'lucide-react'

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Conditions Générales de Vente</h1>
      </div>

      {/* Contenu principal */}
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">1. Introduction</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Objet</h3>
              <p>Les présentes conditions régissent l'utilisation de la plateforme Teacha, qui offre un service de mise en relation entre écoles et enseignants remplaçants.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Acceptation des conditions</h3>
              <p>En utilisant la plateforme Teacha, vous acceptez ces conditions générales de vente et de service.</p>
            </div>
          </div>
        </div>

        {/* Description du Service */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">2. Description du Service</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Phase pilote</h3>
              <p>Durant la phase de projet pilote, l'accès à la plateforme est gratuit pour toutes les écoles et remplaçants.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Services payants</h3>
              <p>À l'issue de la phase pilote, l'accès à certains services deviendra payant pour les écoles sous forme d'abonnement.</p>
            </div>
          </div>
        </div>

        {/* Création de compte */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">3. Création de compte</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Inscription requise</h3>
              <p>Pour accéder aux services, les écoles et les remplaçants doivent créer un compte en fournissant des informations exactes et complètes.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Responsabilité</h3>
              <p>Chaque utilisateur est responsable de la sécurité de son compte et de son mot de passe.</p>
            </div>
          </div>
        </div>

        {/* Conditions Financières */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">4. Conditions Financières</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Modalités de paiement</h3>
              <p>Les abonnements payants pour les écoles seront facturés via Stripe. Les détails des frais d'abonnement seront fournis avant la souscription.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Renouvellement et annulation</h3>
              <p>L'abonnement est renouvelé automatiquement sauf annulation avant la date de renouvellement.</p>
            </div>
          </div>
        </div>

        {/* Obligations des Utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">5. Obligations des Utilisateurs</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Conduite des utilisateurs</h3>
              <p>Les utilisateurs s'engagent à utiliser la plateforme de manière éthique et conforme aux lois en vigueur.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Confidentialité</h3>
              <p>Les utilisateurs doivent traiter les informations obtenues via Teacha de manière confidentielle.</p>
            </div>
          </div>
        </div>

        {/* Propriété intellectuelle */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">6. Propriété intellectuelle</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Droits</h3>
              <p>Le contenu de Teacha, y compris les textes, graphiques, logos, etc., est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de Teacha.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Interdictions</h3>
              <p>Il est interdit de reproduire, modifier ou exploiter les contenus de la plateforme sans l'autorisation expresse de Teacha.</p>
            </div>
          </div>
        </div>

        {/* Limitation de responsabilité */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">7. Limitation de responsabilité</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Garanties</h3>
              <p>Teacha ne garantit pas que le service sera exempt d'interruptions ou d'erreurs.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Limitation de responsabilité</h3>
              <p>Teacha ne sera pas responsable des dommages indirects découlant de l'utilisation de la plateforme.</p>
            </div>
          </div>
        </div>

        {/* Modifications des conditions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">8. Modifications des conditions</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Droit de modification</h3>
              <p>Teacha se réserve le droit de modifier les conditions générales à tout moment.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Notification</h3>
              <p>Les modifications seront notifiées aux utilisateurs par la plateforme ou par email.</p>
            </div>
          </div>
        </div>

        {/* Juridiction et droit applicable */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">9. Juridiction et droit applicable</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium mb-2">Droit applicable</h3>
              <p>Ces conditions sont régies et interprétées conformément au droit suisse.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Juridiction</h3>
              <p>Tout litige relatif à l'utilisation de Teacha sera soumis aux tribunaux compétents de Bienne, Suisse.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Contact</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>Pour toute question concernant ces conditions, veuillez contacter Teacha :</p>
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