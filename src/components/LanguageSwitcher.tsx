'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { supportedLanguages, languageInfo } from '@/lib/countryToLanguage'

export default function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLangInfo = languageInfo[language] || languageInfo.en

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isTranslating}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-soft/60 backdrop-blur-sm border border-line hover:border-cream-muted text-cream transition-all disabled:opacity-50"
      >
        <Globe size={16} className="text-cream-muted" />
        <span className="text-sm font-medium">
          {language === 'en' ? 'English' : `${currentLangInfo.flag} ${currentLangInfo.nativeName}`}
        </span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 bg-ink-raised/95 backdrop-blur-md border border-line rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="py-2">
              {supportedLanguages.map((lang) => {
                const langInfo = languageInfo[lang]
                const isSelected = language === lang

                return (
                  <motion.button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang)
                      setIsOpen(false)
                    }}
                    whileHover={{ backgroundColor: 'rgba(217, 164, 65, 0.08)' }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-cream-muted hover:text-cream transition-colors"
                  >
                    <span className="text-lg">{langInfo.flag}</span>
                    <span className="flex-1">{langInfo.nativeName}</span>
                    {isSelected && (
                      <Check size={16} className="text-brass" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
