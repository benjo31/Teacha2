import { useEffect, useState } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { TeacherStats } from '../components/teachers/TeacherStats'
import { Link } from 'react-router-dom'
import { 
  Search, BookOpen, MessageCircle, Settings,
  FileText, Download, HelpCircle
} from 'lucide-react'

const quickActions = [
  {
    icon: Search,
    title: "Chercher des remplacements",
    description: "Parcourez les offres disponibles",
    link: "/teacher-dashboard",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: BookOpen,
    title: "Mes candidatures",
    description: "Suivez vos postulations en cours",
    link: "/teacher-applications",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: MessageCircle,
    title: "Messages",
    description: "Gérez vos conversations",
    link: "/messages",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Settings,
    title: "Mon profil",
    description: "Mettez à jour vos informations",
    link: "/account",
    color: "bg-gray-100 text-gray-600"
  }
]

const resources = [
  {
    icon: FileText,
    title: "Guide du remplaçant",
    description: "Conseils et bonnes pratiques pour réussir vos remplacements",
    link: "/teacher-guide",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: HelpCircle,
    title: "FAQ & Support",
    description: "Réponses à vos questions fréquentes",
    link: "/help",
    color: "bg-orange-100 text-orange-600"
  }
]

const documents = [
  {
    icon: FileText,
    title: "Modèle de rapport de remplacement",
    description: "Document à remplir après chaque mission",
    downloadUrl: "#"
  },
  {
    icon: FileText,
    title: "Check-list de préparation",
    description: "Liste des points essentiels avant un remplacement",
    downloadUrl: "#"
  }
]

export function TeacherHomePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
        if (teacherDoc.exists()) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <TeacherStats teacherId={user?.uid || ''} />

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

      {/* Ressources et guides */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ressources utiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <Link
              key={index}
              to={resource.link}
              className="card p-6 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`rounded-full ${resource.color} w-12 h-12 flex items-center justify-center mb-4`}>
                <resource.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Documents utiles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Documents utiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <a
              key={index}
              href={doc.downloadUrl}
              className="card p-6 hover:-translate-y-1 transition-all duration-200 flex items-start space-x-4"
            >
              <div className="rounded-full bg-gray-100 text-gray-600 w-12 h-12 flex items-center justify-center flex-shrink-0">
                <doc.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
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
              Notre équipe est là pour vous aider à optimiser votre expérience de remplacement.
            </p>
            <Link to="/help" className="text-primary hover:text-primary-dark text-sm flex items-center">
              Consulter le centre d'aide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}