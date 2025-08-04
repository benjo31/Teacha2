import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../lib/context/LanguageContext'

export function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">Teacha</span>
            </Link>
            <p className="text-gray-600 text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
                  {t('footer.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-primary">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary">
                  {t('footer.help')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.information')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal" className="text-gray-600 hover:text-primary">
                  {t('footer.legal')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:hello@teacha.ch" 
                  className="text-gray-600 hover:text-primary"
                >
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}