import { useState } from 'react'
import { CheckCircle, Clock, BookOpen, FileText, Users, Bell, Coffee, School, AlertTriangle, HelpCircle } from 'lucide-react'
import { useTranslation } from '../lib/context/LanguageContext'

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
  const { t } = useTranslation()
  
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      title: t('guide.beforeReplacement.title'),
      icon: Clock,
      items: [
        {
          id: "contact",
          title: t('guide.beforeReplacement.contact.title'),
          description: t('guide.beforeReplacement.contact.description'),
          checked: false
        },
        {
          id: "schedule",
          title: t('guide.beforeReplacement.schedule.title'),
          description: t('guide.beforeReplacement.schedule.description'),
          checked: false
        },
        {
          id: "transport",
          title: t('guide.beforeReplacement.transport.title'),
          description: t('guide.beforeReplacement.transport.description'),
          checked: false
        }
      ]
    },
    {
      title: t('guide.documents.title'),
      icon: FileText,
      items: [
        {
          id: "materials",
          title: t('guide.documents.materials.title'),
          description: t('guide.documents.materials.description'),
          checked: false
        },
        {
          id: "emergency",
          title: t('guide.documents.emergency.title'),
          description: t('guide.documents.emergency.description'),
          checked: false
        },
        {
          id: "class-list",
          title: t('guide.documents.classList.title'),
          description: t('guide.documents.classList.description'),
          checked: false
        }
      ]
    },
    {
      title: t('guide.essentialInfo.title'),
      icon: AlertTriangle,
      items: [
        {
          id: "rules",
          title: t('guide.essentialInfo.rules.title'),
          description: t('guide.essentialInfo.rules.description'),
          checked: false
        },
        {
          id: "special-needs",
          title: t('guide.essentialInfo.specialNeeds.title'),
          description: t('guide.essentialInfo.specialNeeds.description'),
          checked: false
        },
        {
          id: "procedures",
          title: t('guide.essentialInfo.procedures.title'),
          description: t('guide.essentialInfo.procedures.description'),
          checked: false
        }
      ]
    },
    {
      title: t('guide.personalMaterials.title'),
      icon: BookOpen,
      items: [
        {
          id: "supplies",
          title: t('guide.personalMaterials.supplies.title'),
          description: t('guide.personalMaterials.supplies.description'),
          checked: false
        },
        {
          id: "backup",
          title: t('guide.personalMaterials.backup.title'),
          description: t('guide.personalMaterials.backup.description'),
          checked: false
        },
        {
          id: "personal",
          title: t('guide.personalMaterials.personal.title'),
          description: t('guide.personalMaterials.personal.description'),
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
        <h1 className="text-3xl font-bold mb-4">{t('guide.title')}</h1>
        <p className="text-lg text-gray-600">
          {t('guide.subtitle')}
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
          <h2 className="text-xl font-semibold">{t('guide.practicalTips.title')}</h2>
        </div>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-primary" />
            <span>{t('guide.practicalTips.arrive')}</span>
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{t('guide.practicalTips.introduce')}</span>
          </li>
          <li className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span>{t('guide.practicalTips.bells')}</span>
          </li>
          <li className="flex items-center gap-2">
            <School className="h-4 w-4 text-primary" />
            <span>{t('guide.practicalTips.cleanup')}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}