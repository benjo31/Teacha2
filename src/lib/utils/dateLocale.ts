import { fr, enUS, de } from 'date-fns/locale'
import type { Language } from '../context/LanguageContext'

export function getDateLocale(language: Language) {
  switch (language) {
    case 'fr':
      return fr
    case 'de':
      return de
    case 'en':
    default:
      return enUS
  }
}