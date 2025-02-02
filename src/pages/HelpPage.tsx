import { useState } from 'react'
import { 
  Mail, 
  Plus, 
  Minus, 
  Search, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle,
  Settings,
  School
} from 'lucide-react'

type FAQItem = {
  question: string
  answer: string
  icon: any
}

const faqItems: FAQItem[] = [
  {
    question: "Comment fonctionne la plateforme ?",
    answer: "Les écoles publient leurs besoins en remplacement, et les remplaçants peuvent postuler directement aux offres qui correspondent à leur profil. La mise en relation est instantanée et la communication facilitée via notre messagerie intégrée.",
    icon: Search
  },
  {
    question: "Quelles sont les conditions pour devenir remplaçant ?",
    answer: "Vous devez avoir les qualifications requises pour enseigner et passer par notre processus de vérification. Votre profil sera validé par notre équipe avant d'être activé.",
    icon: CheckCircle
  },
  {
    question: "Combien coûte l'utilisation de la plateforme ?",
    answer: "L'inscription est gratuite pour les remplaçants. Pour les écoles, nous proposons actuellement une offre spéciale 'projet pilote' gratuite pour les 5 premiers établissements.",
    icon: Settings
  },
  {
    question: "Comment sont vérifiés les profils des remplaçants ?",
    answer: "Chaque profil est vérifié manuellement par notre équipe. Nous contrôlons les diplômes, références et autres documents fournis pour garantir la qualité de notre service.",
    icon: School
  },
  {
    question: "Quel est le délai de réponse pour une candidature ?",
    answer: "Les écoles sont notifiées immédiatement de votre candidature et peuvent y répondre rapidement. Pour les remplacements urgents, nous recommandons aux écoles de répondre dans les 24h.",
    icon: Clock
  },
  {
    question: "Comment fonctionne la messagerie ?",
    answer: "Une messagerie intégrée permet aux écoles et aux remplaçants de communiquer directement sur la plateforme. Vous recevez des notifications pour chaque nouveau message.",
    icon: MessageCircle
  },
  {
    question: "Que faire en cas de problème technique ?",
    answer: "En cas de problème technique, contactez notre support à hello@cta-ecom.com. Notre équipe s'engage à vous répondre dans les plus brefs délais.",
    icon: AlertTriangle
  }
]

export function HelpPage() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
        <p className="text-xl text-gray-600">
          Trouvez rapidement des réponses à vos questions
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <button
              onClick={() => setOpenItem(openItem === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-primary" />
                <span className="font-medium text-left">{item.question}</span>
              </div>
              {openItem === index ? (
                <Minus className="h-5 w-5 text-gray-400" />
              ) : (
                <Plus className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {openItem === index && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-600 mb-4">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
            </p>
            <a
              href="mailto:hello@cta-ecom.com"
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <Mail className="h-5 w-5 mr-2" />
              hello@teacha.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}