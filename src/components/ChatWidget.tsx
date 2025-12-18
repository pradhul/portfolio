'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim() || isLoading) return

    setIsLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

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
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white p-4 rounded-full shadow-lg shadow-cyan-500/50 transition-all"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-cyan-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Ask About Me</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
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
                  className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                >
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
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
                  <Loader2 className="text-cyan-400 animate-spin" size={24} />
                  <span className="ml-3 text-gray-400 text-sm">Thinking...</span>
                </div>
              )}

              {!answer && !error && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    Ask me anything about my experience, skills, or background!
                  </p>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about me..."
                  disabled={isLoading}
                  className="flex-1 bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <motion.button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
