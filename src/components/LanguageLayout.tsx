'use client'

import { useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

export function LanguageLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language
  }, [language])

  return <>{children}</>
}
