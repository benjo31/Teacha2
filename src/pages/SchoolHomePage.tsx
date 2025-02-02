import { useEffect, useState } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { SchoolStats } from '../components/schools/SchoolStats'
import { Link } from 'react-router-dom'
import { 
  PlusCircle, Search, MessageCircle, Settings,
  FileText, Download, CheckSquare, Users, BookOpen,
  Calendar, ClipboardList, HelpCircle, Calculator
} from 'lucide-react'

type SchoolData = {
  name: string
  email: string
  address: string
  canton: string
  teachingLevels: string[]
}

const quickActions = [
  {
    icon: PlusCircle,
    title: "Publier une offre",
    description: "Créez une nouvelle offre de remplacement",
    link: "/school-dashboard",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Search,
    title: "Rechercher des remplaçants",
    description: "Parcourez notre base de remplaçants qualifiés",
    link: "/school-applications",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: MessageCircle,
    title: "Messages",
    description: "Gérez vos conversations avec les remplaçants",
    link: "/messages",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Settings,
    title: "Paramètres",
    description: "Configurez votre profil et vos préférences",
    link: "/account",
    color: "bg-gray-100 text-gray-600"
  }
]

const planningTools = [
  {
    icon: Calendar,
    title: "Calendrier des absences",
    description: "Planifiez et visualisez les absences à venir",
    link: "#",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Calculator,
    title: "Calculateur de périodes",
    description: "Estimez les besoins en remplacement",
    link: "#",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Users,
    title: "Liste des remplaçants favoris",
    description: "Gérez votre pool de remplaçants réguliers",
    link: "#",
    color: "bg-pink-100 text-pink-600"
  }
]

const resources = [
  {
    icon: BookOpen,
    title: "Guide d'accueil",
    description: "Document à personnaliser pour les remplaçants",
    downloadUrl: "#"
  },
  {
    icon: ClipboardList,
    title: "Procédures internes",
    description: "Règles et processus pour les remplacements",
    downloadUrl: "#"
  },
  {
    icon: CheckSquare,
    title: "Grille d'évaluation",
    description: "Pour le suivi des remplacements effectués",
    downloadUrl: "#"
  }
]

const templates = [
  {
    icon: FileText,
    title: "Modèle de cahier des charges",
    description: "Pour détailler les missions de remplacement",
    downloadUrl: "#"
  },
  {
    icon: FileText,
    title: "Fiche de transmission",
    description: "Pour la passation entre enseignants",
    downloadUrl: "#"
  }
]

export function SchoolHomePage() {
  const { user } = useAuth()
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const schoolDoc = await getDoc(doc(db, 'schools', user.uid))
        if (!schoolDoc.exists()) {
          throw new Error('École non trouvée')
        }

        const schoolData = schoolDoc.data() as SchoolData
        setSchoolData(schoolData)
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setError('Une erreur est survenue lors du chargement des données')
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (loading || !schoolData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-20 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SchoolStats schoolId={user?.uid || ''} />

      {/* Actions rapides */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card p-6 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex flex-col h-full">
                <div className={`rounded-full ${action.color} w-12 h-12 flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Outils de planification */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Outils de planification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planningTools.map((tool, index) => (
            <Link
              key={index}
              to={tool.link}
              className="card p-6 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`rounded-full ${tool.color} w-12 h-12 flex items-center justify-center mb-4`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{tool.title}</h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Ressources et guides */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ressources utiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.downloadUrl}
              className="card p-6 hover:-translate-y-1 transition-all duration-200 flex items-start space-x-4"
            >
              <div className="rounded-full bg-gray-100 text-gray-600 w-12 h-12 flex items-center justify-center flex-shrink-0">
                <resource.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                <span className="text-primary text-sm flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Modèles de documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modèles de documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <a
              key={index}
              href={template.downloadUrl}
              className="card p-6 hover:-translate-y-1 transition-all duration-200 flex items-start space-x-4"
            >
              <div className="rounded-full bg-gray-100 text-gray-600 w-12 h-12 flex items-center justify-center flex-shrink-0">
                <template.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <span className="text-primary text-sm flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Centre d'aide */}
      <div className="card p-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Notre équipe est là pour vous aider à optimiser la gestion de vos remplacements.
            </p>
            <Link to="#" className="text-primary hover:text-primary-dark text-sm flex items-center">
              Consulter le centre d'aide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}