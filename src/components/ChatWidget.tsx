'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Languages } from 'lucide-react'
import { useChristmasTheme } from './ChristmasTheme'
import { useLanguage } from './LanguageProvider'
import { trackChatQuestion, trackChatResponse } from '@/lib/analytics'

export default function ChatWidget() {
  const isChristmas = useChristmasTheme()
  const { isTranslating } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim() || isLoading) return

    const userQuestion = question.trim()
    
    // Track the question being asked
    console.log('[Chat Widget] Tracking chat question:', userQuestion)
    await trackChatQuestion(userQuestion)

    setIsLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Track failed response
        console.log('[Chat Widget] Tracking failed chat response')
        await trackChatResponse(userQuestion, false)
        throw new Error(data.error || 'Failed to get response')
      }

      // Track successful response
      console.log('[Chat Widget] Tracking successful chat response')
      await trackChatResponse(userQuestion, true)
      setAnswer(data.answer)
      setQuestion('') // Clear input after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuestion('')
    setAnswer('')
    setError('')
  }

  return (
    <>
      {/* Floating Chat Button — morphs into a spinner while translating */}
      <motion.button
        onClick={() => setIsOpen(true)}
        disabled={isTranslating}
        whileHover={isTranslating ? undefined : { scale: 1.1 }}
        whileTap={isTranslating ? undefined : { scale: 0.9 }}
        animate={isTranslating ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={
          isTranslating
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 320, damping: 20 }
        }
        className={`fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full shadow-lg transition-colors ${
          isChristmas
            ? 'text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-600/50'
            : 'text-ink bg-brass hover:bg-brass-bright shadow-black/40'
        } ${isTranslating ? 'cursor-progress' : ''}`}
        aria-label={isTranslating ? 'Translating page…' : 'Open chat'}
        aria-busy={isTranslating}
      >
        {/* Spinning progress ring */}
        <AnimatePresence>
          {isTranslating && (
            <motion.svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{
                rotate: { duration: 0.9, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 0.25 },
                scale: { type: 'spring', stiffness: 260, damping: 18 },
              }}
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.22}
                strokeWidth={7}
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray="70 220"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Icon swap: chat bubble <-> translate glyph */}
        <AnimatePresence mode="wait" initial={false}>
          {isTranslating ? (
            <motion.span
              key="translating"
              initial={{ scale: 0, rotate: -120, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 20 }}
              className="relative grid place-items-center"
            >
              <Languages size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0, rotate: 120, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: -120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 20 }}
              className="relative grid place-items-center"
            >
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-ink-raised/95 backdrop-blur-md border rounded-2xl shadow-2xl overflow-hidden ${
              isChristmas ? 'border-red-500/30' : 'border-line'
            }`}
          >
            {/* Header */}
            <div className={`border-b p-4 flex items-center justify-between ${
              isChristmas
                ? 'bg-gradient-to-r from-red-600/20 to-red-500/20 border-red-500/30'
                : 'border-line'
            }`}>
              <div className="flex items-center gap-3">
                <MessageCircle className={isChristmas ? 'text-red-400' : 'text-brass'} size={20} />
                <h3 className="text-lg font-semibold text-cream">Ask About Me</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-cream-faint hover:text-cream transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {answer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-4 border rounded-lg ${
                    isChristmas
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-brass/10 border-line'
                  }`}
                >
                  <p className="text-cream-muted text-sm leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className={`${isChristmas ? 'text-red-400' : 'text-brass'} animate-spin`} size={24} />
                  <span className="ml-3 text-cream-faint text-sm">Thinking...</span>
                </div>
              )}

              {!answer && !error && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-cream-faint text-sm">
                    Ask me anything about my experience, skills, or background!
                  </p>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className={`p-4 border-t ${
              isChristmas ? 'border-red-500/20' : 'border-line'
            }`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about me..."
                  disabled={isLoading}
                  className={`flex-1 bg-ink/60 border rounded-lg px-4 py-2 text-cream placeholder-cream-faint focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isChristmas
                      ? 'border-red-500/30 focus:border-red-400 focus:ring-red-500/50'
                      : 'border-line focus:border-brass focus:ring-brass/40'
                  }`}
                />
                <motion.button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                    isChristmas
                      ? 'text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                      : 'text-ink bg-brass hover:bg-brass-bright'
                  }`}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
