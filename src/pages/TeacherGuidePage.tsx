import { useState } from 'react'
import { CheckCircle, Clock, BookOpen, FileText, Users, Bell, Coffee, School, AlertTriangle, HelpCircle } from 'lucide-react'

type ChecklistItem = {
  id: string
  title: string
  description: string
  checked: boolean
}

type ChecklistSection = {
  title: string
  icon: any
  items: ChecklistItem[]
}

export function TeacherGuidePage() {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      title: "Avant le remplacement",
      icon: Clock,
      items: [
        {
          id: "contact",
          title: "Contacter l'école",
          description: "Confirmer l'heure d'arrivée et le point de rendez-vous",
          checked: false
        },
        {
          id: "schedule",
          title: "Horaires détaillés",
          description: "Noter les heures exactes des cours et des pauses",
          checked: false
        },
        {
          id: "transport",
          title: "Planifier le trajet",
          description: "Vérifier l'itinéraire et prévoir une marge de sécurité",
          checked: false
        }
      ]
    },
    {
      title: "Documents à préparer",
      icon: FileText,
      items: [
        {
          id: "materials",
          title: "Programme et matériel",
          description: "Récupérer le programme et les supports de cours",
          checked: false
        },
        {
          id: "emergency",
          title: "Contacts d'urgence",
          description: "Noter les numéros importants (direction, secrétariat)",
          checked: false
        },
        {
          id: "class-list",
          title: "Liste des élèves",
          description: "Demander la liste et les particularités de la classe",
          checked: false
        }
      ]
    },
    {
      title: "Informations essentielles",
      icon: AlertTriangle,
      items: [
        {
          id: "rules",
          title: "Règlement de l'école",
          description: "Connaître les règles principales de l'établissement",
          checked: false
        },
        {
          id: "special-needs",
          title: "Besoins particuliers",
          description: "S'informer des élèves nécessitant une attention spéciale",
          checked: false
        },
        {
          id: "procedures",
          title: "Procédures d'urgence",
          description: "Connaître les protocoles de sécurité et d'évacuation",
          checked: false
        }
      ]
    },
    {
      title: "Matériel personnel",
      icon: BookOpen,
      items: [
        {
          id: "supplies",
          title: "Fournitures de base",
          description: "Stylos, craies/feutres, papier, etc.",
          checked: false
        },
        {
          id: "backup",
          title: "Activités de secours",
          description: "Prévoir des exercices supplémentaires",
          checked: false
        },
        {
          id: "personal",
          title: "Effets personnels",
          description: "Badge, clés, repas, eau",
          checked: false
        }
      ]
    }
  ])

  const handleCheck = (sectionIndex: number, itemId: string) => {
    setSections(prevSections => {
      const newSections = [...prevSections]
      const section = newSections[sectionIndex]
      const itemIndex = section.items.findIndex(item => item.id === itemId)
      section.items[itemIndex].checked = !section.items[itemIndex].checked
      return newSections
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Le guide complet du remplaçant</h1>
        <p className="text-lg text-gray-600">
          Une checklist exhaustive pour préparer vos remplacements sereinement
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-primary/10 p-3">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <button
                    onClick={() => handleCheck(sectionIndex, item.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-primary border-primary text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {item.checked && <CheckCircle className="h-4 w-4" />}
                  </button>

                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Conseils supplémentaires */}
      <div className="mt-12 bg-primary/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Conseils pratiques</h2>
        </div>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-primary" />
            <span>Arrivez au moins 15 minutes avant le début des cours</span>
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Présentez-vous aux collègues des classes voisines</span>
          </li>
          <li className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span>Familiarisez-vous avec les horaires des sonneries</span>
          </li>
          <li className="flex items-center gap-2">
            <School className="h-4 w-4 text-primary" />
            <span>Laissez la salle de classe en ordre à votre départ</span>
          </li>
        </ul>
      </div>
    </div>
  )
}