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
import { useTranslation } from '../lib/context/LanguageContext'

type FAQItem = {
  question: string
  answer: string
  icon: any
}


export function HelpPage() {
  const { t } = useTranslation()
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: t('help.faq.platform.question'),
      answer: t('help.faq.platform.answer'),
      icon: Search
    },
    {
      question: t('help.faq.requirements.question'),
      answer: t('help.faq.requirements.answer'),
      icon: CheckCircle
    },
    {
      question: t('help.faq.cost.question'),
      answer: t('help.faq.cost.answer'),
      icon: Settings
    },
    {
      question: t('help.faq.verification.question'),
      answer: t('help.faq.verification.answer'),
      icon: School
    },
    {
      question: t('help.faq.response.question'),
      answer: t('help.faq.response.answer'),
      icon: Clock
    },
    {
      question: t('help.faq.messaging.question'),
      answer: t('help.faq.messaging.answer'),
      icon: MessageCircle
    },
    {
      question: t('help.faq.technical.question'),
      answer: t('help.faq.technical.answer'),
      icon: AlertTriangle
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('help.title')}</h1>
        <p className="text-xl text-gray-600">
          {t('help.subtitle')}
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
            <h2 className="text-xl font-semibold mb-2">{t('help.contact.title')}</h2>
            <p className="text-gray-600 mb-4">
              {t('help.contact.description')}
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