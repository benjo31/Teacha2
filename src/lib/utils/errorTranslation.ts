import { useTranslation } from '../context/LanguageContext'

/**
 * Utility function to translate error codes to user-friendly messages
 * @param error - Error object or error code string
 * @returns Translated error message
 */
export function useErrorTranslation() {
  const { t } = useTranslation()
  
  const translateError = (error: string | Error): string => {
    let errorCode: string
    
    if (error instanceof Error) {
      errorCode = error.message
    } else {
      errorCode = error
    }
    
    // Check if it's one of our error codes
    if (errorCode.startsWith('ADMIN_') || 
        errorCode.startsWith('EMAIL_') || 
        errorCode.startsWith('ALREADY_') ||
        errorCode.startsWith('TEACHER_') ||
        errorCode.startsWith('CONVERSATION_') ||
        errorCode.startsWith('USER_') ||
        errorCode.startsWith('ERROR_') ||
        errorCode === 'loadUserData') {
      
      const translation = t(`errors.${errorCode}`)
      // If translation key doesn't exist, return the original error code
      return translation === `errors.${errorCode}` ? errorCode : translation
    }
    
    // For non-coded errors, return as is
    return errorCode
  }
  
  return { translateError }
}

/**
 * Simple function to get error translation without hook (for non-component contexts)
 * @param errorCode - Error code to translate
 * @param t - Translation function
 * @returns Translated error message
 */
export function getErrorTranslation(errorCode: string, t: (key: string) => string): string {
  if (errorCode.startsWith('ADMIN_') || 
      errorCode.startsWith('EMAIL_') || 
      errorCode.startsWith('ALREADY_') ||
      errorCode.startsWith('TEACHER_') ||
      errorCode.startsWith('CONVERSATION_') ||
      errorCode.startsWith('USER_') ||
      errorCode.startsWith('ERROR_') ||
      errorCode === 'loadUserData') {
    
    const translation = t(`errors.${errorCode}`)
    return translation === `errors.${errorCode}` ? errorCode : translation
  }
  
  return errorCode
}