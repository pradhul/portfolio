'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { content, CONTENT_VERSION } from '@/lib/content'
import { getLanguageFromBrowser, supportedLanguages } from '@/lib/countryToLanguage'

type ContentType = typeof content

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string | string[] | Record<string, unknown>
  tString: (key: string) => string // Helper for string-only translations
  isTranslating: boolean
  translatedContent: ContentType | null
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en')
  const [translatedContent, setTranslatedContent] = useState<ContentType | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language detection
  useEffect(() => {
    if (isInitialized) return

    // Check localStorage first (user preference takes priority)
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      setIsInitialized(true)
      return
    }

    // Detect language based on country/IP location
    const detectLanguage = async () => {
      try {
        const response = await fetch('/api/detect-country')
        if (response.ok) {
          const data = await response.json()
          if (data.language && supportedLanguages.includes(data.language)) {
            setLanguageState(data.language)
            setIsInitialized(true)
            return
          }
        }
      } catch (error) {
        console.error('Error detecting country:', error)
      }

      // Fallback to browser language if country detection fails
      const browserLang = navigator.language || 'en'
      const detectedLang = getLanguageFromBrowser(browserLang)
      setLanguageState(detectedLang)
      setIsInitialized(true)
    }

    detectLanguage()
  }, [isInitialized])

  // Load translations when language changes
  useEffect(() => {
    if (!isInitialized) return

    const loadTranslations = async () => {
      // If English, use original content
      if (language === 'en') {
        setTranslatedContent(null)
        setIsTranslating(false)
        return
      }

      // Check localStorage cache first
      const cacheKey = `translatedContent_${language}_v${CONTENT_VERSION}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          // Check if cache is recent (24 hours)
          if (parsed.content && parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setTranslatedContent(parsed.content)
            setIsTranslating(false)
            return
          }
        } catch {
          localStorage.removeItem(cacheKey)
        }
      }

      // Remove legacy cache keys from older versions
      localStorage.removeItem(`translatedContent_${language}`)

      // Fetch translation from API
      setIsTranslating(true)
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            targetLanguage: language,
          }),
        })

        if (!response.ok) {
          throw new Error('Translation failed')
        }

        const data = await response.json()
        if (!data.translatedContent || data.error) {
          throw new Error(data.error || 'Translation failed')
        }

        setTranslatedContent(data.translatedContent)

        // Cache in localStorage
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            content: data.translatedContent,
            timestamp: Date.now(),
          })
        )
      } catch (error) {
        console.error('Error loading translations:', error)
        localStorage.removeItem(`translatedContent_${language}_v${CONTENT_VERSION}`)
        // Fallback to English on error
        setTranslatedContent(null)
      } finally {
        setIsTranslating(false)
      }
    }

    loadTranslations()
  }, [language, isInitialized])

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang)
      localStorage.setItem('preferredLanguage', lang)
    }
  }

  // Translation function - gets value from nested keys like 'hero.title'
  const t = (key: string): string | string[] | Record<string, unknown> => {
    const currentContent = translatedContent || content
    const keys = key.split('.')
    let value: unknown = currentContent

    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Key not found, return the key itself as fallback
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    // Return the value as-is (could be string, array, or object)
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value)) {
      return value as string[]
    }
    if (typeof value === 'object' && value !== null) {
      return value as Record<string, unknown>
    }
    return String(value)
  }

  // Helper function that always returns a string (for React components)
  const tString = (key: string): string => {
    const result = t(key)
    if (typeof result === 'string') {
      return result
    }
    if (Array.isArray(result)) {
      return result.join(' ')
    }
    return JSON.stringify(result)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tString,
        isTranslating,
        translatedContent,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
