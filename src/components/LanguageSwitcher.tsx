'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, Search } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { supportedLanguages, languageInfo } from '@/lib/countryToLanguage'

function matchesLanguageQuery(lang: string, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  const info = languageInfo[lang]
  if (!info) return false

  return (
    lang.toLowerCase().includes(normalizedQuery) ||
    info.name.toLowerCase().includes(normalizedQuery) ||
    info.nativeName.toLowerCase().includes(normalizedQuery)
  )
}

export default function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredLanguages = useMemo(
    () => supportedLanguages.filter((lang) => matchesLanguageQuery(lang, searchQuery)),
    [searchQuery]
  )

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

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      return
    }

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  const currentLangInfo = languageInfo[language] || languageInfo.en

  const handleSelect = (lang: string) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isTranslating}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
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
            className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-line bg-ink-raised/95 shadow-2xl backdrop-blur-md"
          >
            <div className="border-b border-line p-2">
              <label htmlFor="language-search" className="sr-only">
                Search languages
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-faint"
                />
                <input
                  id="language-search"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.stopPropagation()
                      setIsOpen(false)
                    }
                  }}
                  placeholder="Search languages..."
                  className="w-full rounded-lg border border-line bg-ink/60 py-2 pl-9 pr-3 text-sm text-cream placeholder:text-cream-faint focus:outline-none focus:ring-2 focus:ring-brass/40"
                />
              </div>
            </div>

            <div
              ref={listRef}
              role="listbox"
              aria-label="Languages"
              className="max-h-64 overflow-y-auto overscroll-contain py-1"
              onWheel={(event) => event.stopPropagation()}
            >
              {filteredLanguages.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-cream-faint">
                  No languages found
                </p>
              ) : (
                filteredLanguages.map((lang) => {
                  const langInfo = languageInfo[lang]
                  const isSelected = language === lang

                  return (
                    <button
                      key={lang}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(lang)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-cream-muted transition-colors hover:bg-brass/10 hover:text-cream"
                    >
                      <span className="text-lg">{langInfo.flag}</span>
                      <span className="flex-1">
                        <span className="block">{langInfo.nativeName}</span>
                        {langInfo.nativeName !== langInfo.name && (
                          <span className="block text-xs text-cream-faint">{langInfo.name}</span>
                        )}
                      </span>
                      {isSelected && <Check size={16} className="shrink-0 text-brass" />}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
