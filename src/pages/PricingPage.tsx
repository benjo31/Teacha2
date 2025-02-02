import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'

const teacherBenefits = [
  "Accès illimité aux offres de remplacement",
  "Création de profil personnalisé",
  "Messagerie intégrée avec les écoles",
  "Gestion des candidatures",
  "Notifications en temps réel",
  "CV et documents centralisés",
  "Suivi des missions effectuées",
  "Support prioritaire"
]

const schoolBenefits = [
  "Publication illimitée d'offres",
  "Accès à tous les profils de remplaçants",
  "Messagerie intégrée",
  "Gestion des candidatures",
  "Notifications en temps réel",
  "Tableau de bord personnalisé",
  "Historique des remplacements",
  "Support dédié"
]

export function PricingPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-6">Tarifs simples et transparents</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez la formule qui correspond à vos besoins
          </p>
        </motion.div>

        {/* Plans de tarification */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Remplaçants */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border p-8"
          >
            <h2 className="text-2xl font-bold mb-2">Remplaçants</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">Gratuit</span>
              <span className="text-gray-500">pour toujours</span>
            </div>

            <div className="space-y-4">
              {teacherBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <a
              href="/register?type=teacher"
              className="btn btn-primary w-full mt-8"
            >
              Créer un compte gratuit
            </a>
          </motion.div>

          {/* Plan Écoles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border p-8 relative overflow-hidden"
          >
            {/* Badge Projet Pilote */}
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <AlertCircle className="h-3.5 w-3.5" />
                Projet pilote
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2">Écoles</h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">Gratuit</span>
              <span className="text-gray-500">pendant le projet pilote</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Au lieu de CHF 250.- par année
            </p>

            <div className="space-y-4">
              {schoolBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <a
                href="/register?type=school"
                className="btn btn-primary w-full"
              >
                Participer au projet pilote
              </a>
              <p className="text-sm text-center text-gray-500">
                Places limitées à 5 écoles
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          className="mt-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Combien de temps dure le projet pilote ?</h3>
              <p className="text-gray-600">
                Le projet pilote dure 6 mois, pendant lesquels les écoles participantes bénéficient d'un accès gratuit à toutes les fonctionnalités.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Que se passe-t-il après le projet pilote ?</h3>
              <p className="text-gray-600">
                Les écoles participantes au projet pilote bénéficieront d'une réduction de 50% sur leur premier abonnement annuel.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Y a-t-il des frais cachés ?</h3>
              <p className="text-gray-600">
                Non, notre politique de tarification est totalement transparente. Il n'y a aucun frais caché ni engagement de durée.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}