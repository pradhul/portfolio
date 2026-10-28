'use client'

import { useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

export function LanguageLayout({ children }: { children: React.ReactNode }) {
  const { renderedLanguage } = useLanguage()

  useEffect(() => {
    // Match the document language to the copy that is actually on screen.
    document.documentElement.lang = renderedLanguage
  }, [renderedLanguage])

  return <>{children}</>
}
